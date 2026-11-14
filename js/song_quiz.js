/**
 * 專注力測驗：聽歌搶答 (歌曲聽音辨曲) 核心運作模組 (ver 3.2.7)
 * 支援：
 * 1. 個人自主挑戰模式 (模式 A: 每位同學各自聽歌作答、計時與結算)
 * 2. 全班同步搶答模式 (模式 B: 全班同步播放，搶答暫停音訊，答錯可由老師決定繼續播放或跳至下一題)
 * 3. YouTube 嵌入播放相容性優化與錯誤防護
 */
(function (global) {
  'use strict';

  function escapeForSong(value) {
    const text = String(value ?? '');
    return text.replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[char]));
  }

  // 取得/建立音訊播放容器 (置於背後不可見區域，避免瀏覽器防作弊/背景阻擋 Autoplay)
  function getHiddenPlayerContainer() {
    let container = document.getElementById('songQuizAudioWrapper');
    if (!container) {
      container = document.createElement('div');
      container.id = 'songQuizAudioWrapper';
      container.style.cssText = 'position:fixed; bottom:0; right:0; width:200px; height:200px; opacity:0.01; z-index:-999; pointer-events:none; overflow:hidden;';
      document.body.appendChild(container);
    }
    return container;
  }

  // ==========================================
  // 模式 A：個人自主挑戰模式 (Self-Paced Mode)
  // ==========================================

  // 開始個人自主挑戰
  App.prototype.startSongQuizGame = function startSongQuizGame(game) {
    this.focusGame = game;
    const grid = document.getElementById('focusGameGrid');
    if (!grid) return;

    // 若為全班同步搶答模式，導流至搶答控制器
    if (game.playMode === 'buzzer') {
      this.initBuzzerSongQuiz(game);
      return;
    }

    const numHeader = document.getElementById('focusNumberGridHeader');
    const helpBtn = document.getElementById('focusHelpBtn');
    const helpInfo = document.getElementById('focusHelpInfo');
    const targetLabel = document.getElementById('focusCurrentTarget')?.parentElement;
    if (numHeader) numHeader.style.display = 'none';
    if (helpBtn) helpBtn.style.display = 'none';
    if (helpInfo) { helpInfo.textContent = ''; helpInfo.style.display = 'none'; }
    if (targetLabel) targetLabel.style.display = 'none';

    grid.style.aspectRatio = 'auto';
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '12px';
    grid.style.width = '100%';
    grid.style.maxWidth = '600px';
    grid.style.maxHeight = 'none';
    grid.style.height = 'auto';
    grid.style.minHeight = 'auto';
    grid.style.overflow = 'visible';
    if (numberGridContainer) {
      numberGridContainer.style.maxHeight = 'none';
      numberGridContainer.style.height = 'auto';
      numberGridContainer.style.flexShrink = '0';
    }

    const questions = Array.isArray(game.questions) ? game.questions : [];
    if (questions.length === 0) {
      grid.innerHTML = '<div style="padding:24px; color:var(--danger-color); font-weight:bold; text-align:center;">題庫中無題目，請至題庫管理中心確認。</div>';
      return;
    }

    this.focusHelpCount = 0;
    this.focusHelpPenaltySeconds = 0;

    this.songQuizState = {
      gameKey: `${game.startTime || game.countdownStartTime || 'start'}_${questions.map((q) => q.id || q.title).join('_')}`,
      index: 0,
      correctCount: 0,
      answers: [],
      eliminated: new Set(),
      revealedSinger: false,
      answered: false,
      isPlayingAudio: false,
      audioRemainingSeconds: 0,
      audioTimerInterval: null
    };

    this.focusStartTimeLocal = game.startTime || Date.now();
    if (this.focusTimerInterval) clearInterval(this.focusTimerInterval);
    this.focusTimerInterval = setInterval(() => {
      const elapsed = (Date.now() - (game.startTime || this.focusStartTimeLocal)) / 1000 + (this.focusHelpPenaltySeconds || 0);
      const timer = document.getElementById('focusTimer');
      if (timer) timer.textContent = elapsed.toFixed(2);
    }, 30);

    this.renderSongQuizQuestion();
  };

  // 渲染個人自主挑戰題目畫面
  App.prototype.renderSongQuizQuestion = function renderSongQuizQuestion() {
    const state = this.songQuizState;
    const game = this.focusGame;
    const grid = document.getElementById('focusGameGrid');
    if (!state || !game || !grid) return;

    grid.style.aspectRatio = 'auto';
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '12px';
    grid.style.width = '100%';
    grid.style.maxWidth = '600px';
    grid.style.maxHeight = 'none';
    grid.style.height = 'auto';
    grid.style.minHeight = 'auto';
    grid.style.overflow = 'visible';
    const numberGridContainer = document.getElementById('focusNumberGridContainer');
    if (numberGridContainer) {
      numberGridContainer.style.maxHeight = 'none';
      numberGridContainer.style.height = 'auto';
      numberGridContainer.style.flexShrink = '0';
    }

    const question = (game.questions || [])[state.index];
    if (!question) return;

    // 播放音訊片段
    if (!state.answered && !state.audioInitiated) {
      state.audioInitiated = true;
      this.playSongQuizAudio(question);
    }

    const remainingWrong = (question.options || []).filter(
      (opt) => opt !== question.title && !state.eliminated.has(opt)
    );

    const isPlaying = state.isPlayingAudio;
    const tagBadge = question.tag || (Array.isArray(question.tags) ? question.tags.join(', ') : '') || game.selectedTag || '精選歌單';

    // 四選一選項按鈕
    const optionsHtml = (question.options || []).map((option, optIdx) => {
      const isEliminated = state.eliminated.has(option);
      const isCorrect = option === question.title;
      const isSelected = state.selectedOption === option;

      let background = 'var(--bg-card)';
      let border = '1.5px solid var(--border-color)';
      let color = 'var(--text-primary)';

      if (state.answered && isCorrect) {
        background = 'rgba(52,199,89,0.15)';
        border = '2px solid #34c759';
        color = '#167a31';
      }
      if (state.answered && isSelected && !isCorrect) {
        background = 'rgba(255,59,48,0.12)';
        border = '2px solid #ff3b30';
        color = '#b42318';
      }

      const eliminatedStyle = isEliminated
        ? 'opacity:0.35; text-decoration:line-through; cursor:not-allowed;'
        : 'cursor:pointer;';

      return `
        <button type="button" class="song-quiz-option-btn" onclick="window.app.answerSongQuiz(${optIdx})" ${state.answered || isEliminated ? 'disabled' : ''} style="border:${border}; background:${background}; color:${color}; ${eliminatedStyle}">
          ${isEliminated ? '✖ 已排除　' : `${String.fromCharCode(65 + optIdx)}．`}${escapeForSong(option)}
        </button>
      `;
    }).join('');

    // 作答後回饋或提示按鈕區
    let actionAreaHtml = '';
    if (state.answered) {
      const isCorrect = state.isCorrect;
      actionAreaHtml = `
        <div style="margin-top:10px; padding:14px; border-radius:12px; background:${isCorrect ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)'}; border:1px solid ${isCorrect ? '#34c759' : '#ff9500'}; line-height:1.6;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <div style="font-weight:900; color:${isCorrect ? '#167a31' : '#b26a00'}; font-size:16px;">
              ${isCorrect ? '🎉 答對了！太厲害了！' : '❌ 答錯了！'}
            </div>
            <span style="font-size:13px; font-weight:bold; color:var(--text-secondary);">正解：【${escapeForSong(question.title)}】</span>
          </div>
          <div style="font-size:14px; color:var(--text-primary); margin-top:6px; font-weight:bold;">
            🎤 演唱者：<span style="color:var(--accent-color);">${escapeForSong(question.artist || '未知')}</span>
          </div>
          ${question.clue ? `<div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">💡 歌曲提示：${escapeForSong(question.clue)}</div>` : ''}
          
          <div style="margin-top:8px; display:flex; gap:10px; flex-wrap:wrap;">
            <a href="${escapeForSong(question.youtubeUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#ff0000; color:white; padding:5px 12px; border-radius:6px; font-size:12px; font-weight:bold; text-decoration:none;">
              ▶️ 在 YouTube 聆聽完整歌曲
            </a>
          </div>
        </div>
        <button type="button" onclick="window.app.nextSongQuizQuestion()" style="margin-top:10px; width:100%; padding:12px; border:none; border-radius:10px; background:var(--accent-color); color:white; font-size:16px; font-weight:900; cursor:pointer; box-shadow:0 3px 10px rgba(0,122,255,0.3);">
          ${state.index + 1 === game.questions.length ? '🏁 查看全部解答與本局成績' : '下一首 ➜'}
        </button>
      `;
    } else if (game.allowHint !== false) {
      actionAreaHtml = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px;">
          <button type="button" onclick="window.app.useSongQuizSingerHint()" ${state.revealedSinger ? 'disabled' : ''} style="padding:9px; border:none; border-radius:8px; background:#6366f1; color:white; font-size:13px; font-weight:bold; cursor:pointer; opacity:${state.revealedSinger ? 0.45 : 1};">
            💡 提示歌手 (+5秒)
          </button>
          <button type="button" onclick="window.app.useSongQuizEliminationHint()" ${remainingWrong.length === 0 ? 'disabled' : ''} style="padding:9px; border:none; border-radius:8px; background:#ff9500; color:white; font-size:13px; font-weight:bold; cursor:pointer; opacity:${remainingWrong.length === 0 ? 0.45 : 1};">
            ✂️ 刪除1個錯誤 (+5秒)
          </button>
        </div>
        ${state.revealedSinger ? `<div style="background:rgba(99,102,241,0.1); border:1px solid #6366f1; padding:6px 10px; border-radius:8px; font-size:12px; color:#4f46e5; font-weight:bold; margin-top:6px; text-align:center;">🎤 提示歌手：${escapeForSong(question.artist || '無提供歌手資訊')}</div>` : ''}
        <div style="font-size:11px; color:var(--text-muted); text-align:center; margin-top:6px;">
          累計使用提示懲罰：+${this.focusHelpPenaltySeconds || 0} 秒（已算入總耗時）
        </div>
      `;
    } else {
      actionAreaHtml = '';
    }

    grid.innerHTML = `
      <div class="song-quiz-wrapper ${state.answered ? '' : 'answering-mode'}">
        <div class="song-quiz-header">
          <span style="background:rgba(0,122,255,0.1); color:var(--accent-color); padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
            🎵 第 ${state.index + 1} / ${game.questions.length} 題
          </span>
          <span style="background:rgba(16,185,129,0.1); color:#10b981; padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
            🏷️ ${escapeForSong(tagBadge)}
          </span>
        </div>

        <div class="song-quiz-vinyl-card">
          <div class="song-quiz-vinyl-disk">
            <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(circle, #2a2a2a 20%, #111 60%, #000 100%); border:3px solid #333; box-shadow:0 6px 18px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; ${isPlaying ? 'animation: spinVinyl 3s linear infinite;' : ''}">
              <div style="width:36%; height:36%; border-radius:50%; background:var(--accent-color); border:2px solid #fff; display:flex; align-items:center; justify-content:center; color:white; font-size:14px;">
                🎵
              </div>
            </div>
          </div>

          <div class="song-quiz-vinyl-title" style="font-size:15px; font-weight:bold; color:var(--text-primary); margin-bottom:3px;">
            ${isPlaying ? '🎧 歌曲片段播放中...' : (state.answered ? '✅ 歌曲已揭曉' : '⏸️ 試聽片段播放完畢')}
          </div>
          <div class="song-quiz-vinyl-subtitle" style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">
            ${isPlaying ? `剩餘播放時間：<strong>${state.audioRemainingSeconds}</strong> 秒` : (state.answered ? '請瀏覽解析或進入下一題' : '沒聽清楚嗎？可點擊下方重新播放！')}
          </div>

          <button type="button" onclick="window.app.replaySongQuizAudio()" style="padding:6px 14px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-size:12px; font-weight:bold; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            🔄 重新試聽歌曲片段
          </button>
        </div>

        <div class="song-quiz-options-list">
          ${optionsHtml}
        </div>

        ${actionAreaHtml}
      </div>

      <style>
        @keyframes spinVinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  };

  // 播放歌曲音訊片段
  App.prototype.playSongQuizAudio = function playSongQuizAudio(question, customStartTime) {
    const state = this.songQuizState;
    if (!question) return;

    // 全班同步搶答模式下：若當前為學生端，除非明確啟用全班發聲 'all'，否則嚴禁播放音訊
    if (this.focusGame && this.focusGame.playMode === 'buzzer' && !this.isAdmin) {
      if (this.focusGame.audioMode !== 'all') {
        this.stopSongQuizAudio();
        return;
      }
    }

    this.stopSongQuizAudio();

    const baseDuration = Math.max(5, Math.min(120, parseInt(question.duration) || 60));
    const questionStart = Math.max(0, parseInt(question.startTime) || 0);
    const startTime = typeof customStartTime === 'number' ? Math.max(0, customStartTime) : questionStart;
    const youtubeId = question.youtubeId || (this.parseYoutubeUrl ? this.parseYoutubeUrl(question.youtubeUrl).videoId : 'bv_cEeDlop0');

    // 計算自題目設定起點以來的偏移秒數，以及本段音訊剩餘可播放秒數
    const elapsedFromStart = Math.max(0, startTime - questionStart);
    const remainingDuration = Math.max(3, baseDuration - elapsedFromStart);

    const wrapper = getHiddenPlayerContainer();
    const originParam = (typeof window !== 'undefined' && window.location && window.location.origin) ? `&origin=${encodeURIComponent(window.location.origin)}` : '';
    // 使用 YouTube Iframe 播放，加入完整 allow 權限支援現代瀏覽器自動播放
    wrapper.innerHTML = `
      <iframe id="songQuizHiddenIframe" width="200" height="200" src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&start=${startTime}&enablejsapi=1&controls=0${originParam}" allow="autoplay; encrypted-media; picture-in-picture" style="border:none;"></iframe>
    `;

    if (state) {
      state.isPlayingAudio = true;
      state.audioRemainingSeconds = remainingDuration;
      state.audioTimerInterval = setInterval(() => {
        state.audioRemainingSeconds--;
        if (state.audioRemainingSeconds <= 0) {
          this.stopSongQuizAudio();
          if (this.renderSongQuizQuestion) this.renderSongQuizQuestion();
        } else {
          const textEl = document.querySelector('#focusGameGrid strong');
          if (textEl && state.isPlayingAudio) {
            textEl.textContent = state.audioRemainingSeconds;
          }
        }
      }, 1000);
    } else {
      // 全班同步搶答模式：若無人搶答，於剩餘播放長度到達後自動停止音訊
      if (this.buzzerAudioTimeout) clearTimeout(this.buzzerAudioTimeout);
      this.buzzerAudioTimeout = setTimeout(() => {
        this.stopSongQuizAudio();
      }, remainingDuration * 1000);
    }
  };

  // 停止歌曲播放
  App.prototype.stopSongQuizAudio = function stopSongQuizAudio() {
    if (this.buzzerAudioTimeout) {
      clearTimeout(this.buzzerAudioTimeout);
      this.buzzerAudioTimeout = null;
    }
    const state = this.songQuizState;
    if (state) {
      state.isPlayingAudio = false;
      if (state.audioTimerInterval) {
        clearInterval(state.audioTimerInterval);
        state.audioTimerInterval = null;
      }
    }

    // 強制停止並立即銷毀所有 YouTube Iframe 音訊，杜絕在背景繼續播放
    const iframes = document.querySelectorAll('#songQuizHiddenIframe, #songQuizAudioWrapper iframe');
    iframes.forEach(iframe => {
      try {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        iframe.src = 'about:blank';
      } catch (e) {}
      try { iframe.remove(); } catch (e) {}
    });

    const wrapper = document.getElementById('songQuizAudioWrapper');
    if (wrapper) {
      wrapper.innerHTML = '';
    }

    if (this.songQuizAudio) {
      try {
        this.songQuizAudio.pause();
        this.songQuizAudio.currentTime = 0;
        this.songQuizAudio.src = '';
      } catch (e) {}
      this.songQuizAudio = null;
    }
    if (this.songQuizBuzzerAudio) {
      try {
        this.songQuizBuzzerAudio.pause();
        this.songQuizBuzzerAudio.currentTime = 0;
        this.songQuizBuzzerAudio.src = '';
      } catch (e) {}
      this.songQuizBuzzerAudio = null;
    }
  };

  // 重播歌曲片段
  App.prototype.replaySongQuizAudio = function replaySongQuizAudio() {
    const state = this.songQuizState;
    const game = this.focusGame;
    if (!state || !game) return;
    const question = (game.questions || [])[state.index];
    if (question) {
      this.playSongQuizAudio(question);
      this.renderSongQuizQuestion();
    }
  };

  // 學生選擇答案 (個人自主挑戰)
  App.prototype.answerSongQuiz = function answerSongQuiz(selectedIndex) {
    const state = this.songQuizState;
    const game = this.focusGame;
    if (!state || !game || state.answered) return;

    const question = (game.questions || [])[state.index];
    if (!question) return;

    const chosenOption = (question.options || [])[selectedIndex];
    const isCorrect = chosenOption === question.title;

    state.answered = true;
    state.selectedOption = chosenOption;
    state.isCorrect = isCorrect;
    if (isCorrect) state.correctCount++;

    state.answers.push({
      questionId: question.id || question.title,
      title: question.title,
      artist: question.artist || '',
      selectedOption: chosenOption,
      correctOption: question.title,
      correct: isCorrect
    });

    if (typeof this.playFocusSound === 'function') {
      this.playFocusSound(isCorrect ? 'correct' : 'wrong');
    }

    this.stopSongQuizAudio();
    this.renderSongQuizQuestion();
  };

  // 提示歌手 (懲罰 +5 秒)
  App.prototype.useSongQuizSingerHint = function useSongQuizSingerHint() {
    const state = this.songQuizState;
    if (!state || state.answered || state.revealedSinger || this.focusGame?.allowHint === false) return;

    state.revealedSinger = true;
    this.focusHelpCount = (this.focusHelpCount || 0) + 1;
    this.focusHelpPenaltySeconds = (this.focusHelpPenaltySeconds || 0) + 5;

    this.renderSongQuizQuestion();
  };

  // 刪除錯誤選項 (懲罰 +5 秒)
  App.prototype.useSongQuizEliminationHint = function useSongQuizEliminationHint() {
    const state = this.songQuizState;
    const game = this.focusGame;
    if (!state || !game || state.answered || game.allowHint === false) return;

    const question = (game.questions || [])[state.index];
    if (!question) return;

    const wrongOptions = (question.options || []).filter(
      (opt) => opt !== question.title && !state.eliminated.has(opt)
    );

    if (wrongOptions.length === 0) return;

    const randIdx = Math.floor(Math.random() * wrongOptions.length);
    state.eliminated.add(wrongOptions[randIdx]);

    this.focusHelpCount = (this.focusHelpCount || 0) + 1;
    this.focusHelpPenaltySeconds = (this.focusHelpPenaltySeconds || 0) + 5;

    this.renderSongQuizQuestion();
  };

  // 下一題 (個人自主挑戰)
  App.prototype.nextSongQuizQuestion = function nextSongQuizQuestion() {
    const state = this.songQuizState;
    const game = this.focusGame;
    if (!state || !game) return;

    this.stopSongQuizAudio();

    if (state.index + 1 >= (game.questions || []).length) {
      this.finishSongQuizGame();
      return;
    }

    state.index++;
    state.answered = false;
    state.audioInitiated = false;
    state.selectedOption = null;
    state.isCorrect = false;
    state.eliminated = new Set();
    state.revealedSinger = false;

    this.renderSongQuizQuestion();
  };

  // 遊戲結束與結算 (個人自主挑戰)
  App.prototype.finishSongQuizGame = function finishSongQuizGame() {
    const state = this.songQuizState;
    if (!state || state.submitted) return;
    state.submitted = true;

    this.stopSongQuizAudio();

    if (this.focusTimerInterval) clearInterval(this.focusTimerInterval);
    this.focusTimerInterval = null;

    const game = this.focusGame;
    const userId = window.boardStorage.local.getItem('user_id') || 'guest';
    const now = Date.now();
    const start = this.focusStartTimeLocal || (game && game.startTime) || now;
    const rawElapsed = (now - start) / 1000 + (this.focusHelpPenaltySeconds || 0);
    const timeSpent = Math.max(0.1, Number(rawElapsed.toFixed(2)) || 0.1);

    const result = {
      name: userName,
      userName,
      avatar: this.getCurrentUserAvatar(),
      answers: state.answers,
      score: state.correctCount,
      totalQuestions: (game.questions || []).length,
      timeSpent,
      completedAt: firebase.database.ServerValue.TIMESTAMP,
      status: 'correct',
      gameType: 'songQuiz',
      playMode: 'self',
      tag: game.selectedTag || '全部歌單',
      helpCount: this.focusHelpCount || 0,
      penaltySeconds: this.focusHelpPenaltySeconds || 0
    };

    // 立即將本地成績加入 results，確保即時呈現在學生端排行榜上，不出現空白或「目前尚無人完成」
    const currentResults = { ...(this.focusGame?.results || game?.results || {}), [userId]: result };
    const updatedGame = { ...(this.focusGame || game || {}), results: currentResults };
    this.focusGame = updatedGame;
    const playingRankSection = document.getElementById('focusPlayingLeaderboardSection');
    if (playingRankSection) playingRankSection.style.display = 'none';
    this.renderSongQuizCompleted(updatedGame, result);

    db.ref(`quiz/focusGame/results/${userId}`).set(result).then(() => {
      this.showNotification('完成', `聽歌搶答完成！答對 ${state.correctCount}／${game.questions.length} 題！`);
      if (document.getElementById('songQuizSelfRankList')) {
        this.renderFocusGameLeaderboard('songQuizSelfRankList', this.focusGame?.results || currentResults);
      }
    }).catch((error) => {
      this.showNotification('錯誤', `送出成績失敗：${error.message}`);
    });
  };

  // 渲染個人自主挑戰結算與解析清單
  App.prototype.renderSongQuizCompleted = function renderSongQuizCompleted(game, result) {
    const grid = document.getElementById('focusGameGrid');
    if (!grid) return;

    // 結算畫面已有 songQuizSelfRankList，必須確實隱藏作答中的 focusPlayingLeaderboardSection 避免重複出現
    const playingRankSection = document.getElementById('focusPlayingLeaderboardSection');
    if (playingRankSection) playingRankSection.style.display = 'none';

    const answers = result.answers || [];
    const score = Number(result.score) || 0;
    const total = Number(result.totalQuestions) || (game.questions || []).length;
    const byId = new Map(answers.map((item) => [item.questionId, item]));

    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '14px';
    grid.style.width = '100%';
    grid.style.maxWidth = '600px';

    grid.innerHTML = `
      <div style="padding:18px; border-radius:14px; background:rgba(52,199,89,0.12); border:1px solid #34c759; width:100%; box-sizing:border-box; text-align:center;">
        <div style="font-size:22px; font-weight:900; color:#167a31;">🎉 恭喜完成！答對 ${score}／${total} 題</div>
        <div style="font-size:14px; color:var(--text-secondary); margin-top:6px;">
          總耗時：<strong>${Number(result.timeSpent || 0).toFixed(2)}</strong> 秒（含提示加罰 ${result.penaltySeconds || 0} 秒）
        </div>
        <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">
          以下為本局歌曲清單與正解，可點擊在 YouTube 欣賞完整 MV！
        </div>
      </div>

      ${(game.questions || []).map((question, index) => {
        const answer = byId.get(question.id || question.title);
        const isCorrect = answer?.correct;

        return `
          <div style="padding:16px; border-radius:12px; background:var(--bg-card); border:1px solid var(--border-color); width:100%; box-sizing:border-box;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:13px; color:var(--text-secondary); font-weight:bold;">第 ${index + 1} 題・${escapeForSong(question.tag || '歌曲')}</span>
              <span style="font-size:14px;">${isCorrect ? '✅ 答對' : '❌ 答錯'}</span>
            </div>
            <div style="font-size:17px; font-weight:900; color:var(--text-primary); margin-bottom:4px;">
              🎵 ${escapeForSong(question.title)}
            </div>
            <div style="font-size:14px; color:var(--accent-color); font-weight:bold; margin-bottom:6px;">
              🎤 演唱者：${escapeForSong(question.artist || '未知')}
            </div>
            ${answer && !isCorrect ? `<div style="font-size:13px; color:#b42318; margin-bottom:4px;">你的答案：${escapeForSong(answer.selectedOption || '未作答')}</div>` : ''}
            ${question.clue ? `<div style="font-size:13px; color:var(--text-secondary); line-height:1.5; margin-bottom:10px;">💡 ${escapeForSong(question.clue)}</div>` : ''}
            
            <a href="${escapeForSong(question.youtubeUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#ff0000; color:white; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold; text-decoration:none;">
              ▶️ 在 YouTube 聆聽完整歌曲
            </a>
          </div>
        `;
      }).join('')}

      <div style="margin-top:16px; padding:16px; border-radius:14px; background:var(--bg-card); border:1px solid var(--border-color); width:100%; box-sizing:border-box;">
        <h4 style="font-size:15px; margin:0 0 12px 0; color:var(--text-primary); display:flex; align-items:center; gap:6px; font-weight:bold;">
          🏆 全班即時成績排行榜
        </h4>
        <div id="songQuizSelfRankList" style="display:flex; flex-direction:column; gap:6px; max-height:260px; overflow-y:auto;">
          <!-- 排行榜由 renderFocusGameLeaderboard 自動填入 -->
        </div>
      </div>
    `;

    if (this.renderFocusGameLeaderboard) {
      const resultsToRender = (game && game.results && Object.keys(game.results).length > 0)
        ? game.results
        : (result ? { [window.boardStorage.local.getItem('user_id') || 'guest']: result } : null);
      this.renderFocusGameLeaderboard('songQuizSelfRankList', resultsToRender);
    }
  };

  // ==========================================
  // 模式 B：全班同步搶答模式 (Buzzer Sync Mode)
  // ==========================================

  // 初始化全班同步搶答狀態
  App.prototype.initBuzzerSongQuiz = function initBuzzerSongQuiz(game) {
    this.focusGame = game;
    // 若當前為學生端且非全班廣播模式，確保徹底停止任何殘留音訊
    if (!this.isAdmin && game?.audioMode !== 'all') {
      this.stopSongQuizAudio();
    }
    const grid = document.getElementById('focusGameGrid');
    if (!grid) return;

    const numHeader = document.getElementById('focusNumberGridHeader');
    const helpBtn = document.getElementById('focusHelpBtn');
    const helpInfo = document.getElementById('focusHelpInfo');
    const targetLabel = document.getElementById('focusCurrentTarget')?.parentElement;
    if (numHeader) numHeader.style.display = 'none';
    if (helpBtn) helpBtn.style.display = 'none';
    if (helpInfo) { helpInfo.textContent = ''; helpInfo.style.display = 'none'; }
    if (targetLabel) targetLabel.style.display = 'none';

    grid.style.aspectRatio = 'auto';
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '14px';
    grid.style.width = '100%';
    grid.style.maxWidth = '600px';
    grid.style.minHeight = 'auto';

    // 停止本地單機計時器
    if (this.focusTimerInterval) clearInterval(this.focusTimerInterval);
    this.focusTimerInterval = null;

    this.renderBuzzerSongQuizUI(game);
  };

  // 渲染全班同步搶答畫面 (由 Firebase 同步事件驅動)
  App.prototype.renderBuzzerSongQuizUI = function renderBuzzerSongQuizUI(game) {
    const grid = document.getElementById('focusGameGrid');
    if (!grid || !game) return;

    this.focusGame = game;

    // 確保非數字遊戲元件一律隱藏，包含求救提示按鈕與頂部目標/秒數資訊
    const numHeader = document.getElementById('focusNumberGridHeader');
    const helpBtn = document.getElementById('focusHelpBtn');
    const helpInfo = document.getElementById('focusHelpInfo');
    const targetLabel = document.getElementById('focusCurrentTarget')?.parentElement;
    if (numHeader) numHeader.style.display = 'none';
    if (helpBtn) helpBtn.style.display = 'none';
    if (helpInfo) { helpInfo.textContent = ''; helpInfo.style.display = 'none'; }
    if (targetLabel) targetLabel.style.display = 'none';

    grid.style.aspectRatio = 'auto';
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '12px';
    grid.style.width = '100%';
    grid.style.maxWidth = '600px';
    grid.style.maxHeight = 'none';
    grid.style.height = 'auto';
    grid.style.minHeight = 'auto';
    grid.style.overflow = 'visible';
    const numberGridContainer = document.getElementById('focusNumberGridContainer');
    if (numberGridContainer) {
      numberGridContainer.style.maxHeight = 'none';
      numberGridContainer.style.height = 'auto';
      numberGridContainer.style.flexShrink = '0';
    }

    if (this.focusTimerInterval) {
      clearInterval(this.focusTimerInterval);
      this.focusTimerInterval = null;
    }

    const questions = Array.isArray(game.questions) ? game.questions : [];
    const qIndex = Number(game.currentQuestionIndex || 0);
    const question = questions[qIndex];

    // 全部題目完成：顯示全班排行榜與頒獎
    if (!question || qIndex >= questions.length) {
      this.renderBuzzerFinalLeaderboard(game);
      return;
    }

    const round = game.buzzerRound || { status: 'waiting' };
    const roundStatus = round.status || 'waiting';
    const buzzedUser = round.buzzedUser || null;
    const eliminatedUsers = round.eliminatedUsers || {};
    const myUid = window.boardStorage.local.getItem('user_id') || 'guest';
    const isMeBuzzed = buzzedUser && (buzzedUser.uid === myUid);
    const amIEliminated = !!eliminatedUsers[myUid];

    // 處理音訊播放同步
    this.handleBuzzerAudioSync(question, round);

    const roundKey = `${qIndex}_${round?.timestamp || ''}_${roundStatus}`;
    if (this.lastBuzzerSoundKey !== roundKey) {
      this.lastBuzzerSoundKey = roundKey;
      if (roundStatus === 'answered_correct' && typeof this.playFocusSound === 'function') {
        this.playFocusSound('correct');
      } else if (roundStatus === 'answered_wrong' && typeof this.playFocusSound === 'function') {
        this.playFocusSound('wrong');
      }
    }

    const isPlaying = roundStatus === 'playing';
    const tagBadge = question.tag || (Array.isArray(question.tags) ? question.tags.join(', ') : '') || game.selectedTag || '精選歌單';

    // 頂部題號與資訊
    const headerHtml = `
      <div class="song-quiz-header">
        <span style="background:rgba(0,122,255,0.1); color:var(--accent-color); padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
          ⚡ 全班搶答：第 ${qIndex + 1} / ${questions.length} 題
        </span>
        <span style="background:rgba(16,185,129,0.1); color:#10b981; padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
          🏷️ ${escapeForSong(tagBadge)}
        </span>
      </div>
    `;

    // 黑膠唱片動畫與狀態提示區
    let vinylStatusText = '⏸️ 等待老師開始播放歌曲...';
    if (roundStatus === 'playing') vinylStatusText = '🎧 歌曲播放中，全班可按搶答！';
    if (roundStatus === 'buzzed') vinylStatusText = `🔔 【${escapeForSong(buzzedUser?.name || '同學')}】搶答成功！音樂已暫停`;
    if (roundStatus === 'answered_correct') vinylStatusText = `🎉 【${escapeForSong(buzzedUser?.name || '同學')}】答對了！`;
    if (roundStatus === 'answered_wrong') vinylStatusText = `❌ 【${escapeForSong(buzzedUser?.name || '同學')}】答錯了！`;
    if (roundStatus === 'revealed') vinylStatusText = '💡 答案已揭曉';

    const vinylHtml = `
      <div class="song-quiz-vinyl-card">
        <div class="song-quiz-vinyl-disk">
          <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(circle, #2a2a2a 20%, #111 60%, #000 100%); border:3px solid #333; box-shadow:0 4px 14px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; ${isPlaying ? 'animation: spinVinyl 3s linear infinite;' : ''}">
            <div style="width:36%; height:36%; border-radius:50%; background:var(--accent-color); border:2px solid #fff; display:flex; align-items:center; justify-content:center; color:white; font-size:14px;">
              ${isPlaying ? '🎵' : (roundStatus === 'buzzed' ? '⚡' : '⏸️')}
            </div>
          </div>
        </div>
        <div class="song-quiz-vinyl-title" style="font-size:15px; font-weight:900; color:var(--text-primary); margin-bottom:3px;">
          ${vinylStatusText}
        </div>
        <div class="song-quiz-vinyl-subtitle" style="font-size:12px; color:var(--text-secondary);">
          ${roundStatus === 'playing' ? '聽出歌名了嗎？手速要快！' : (roundStatus === 'buzzed' ? '歌曲暫停中，等待搶答同學回答' : '專注聆聽音樂辨識歌曲')}
        </div>
      </div>
    `;

    // 播放開始後，教師可查看相同的作答選項，且不提前標示答案。
    const teacherOptionsHtml = this.isAdmin && roundStatus !== 'waiting' ? `
      <div class="song-quiz-answer-card"><div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">同學的作答選項</div><div class="song-quiz-options-list">${(question.options || []).map((option,index)=>`<div class="song-quiz-option-btn">${String.fromCharCode(65+index)}．${escapeForSong(option)}</div>`).join('')}</div></div>` : '';
    // 核心互動搶答按鈕 / 作答選項區 (老師端與學生端分離)
    let interactiveAreaHtml = '';

    if (this.isAdmin) {
      // 👑 老師端視角：不顯示搶答按鈕，僅呈現課堂狀態，並由下方專屬主控台控制
      if (roundStatus === 'playing') {
        interactiveAreaHtml = `
          <div style="padding:24px; text-align:center; background:rgba(0,122,255,0.06); border:1.5px dashed var(--accent-color); border-radius:14px;">
            <div style="font-size:18px; font-weight:900; color:var(--accent-color);">🎧 歌曲播放中，全班搶答進行中...</div>
            <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">等待同學按下搶答。若有同學搶到，音樂將自動暫停！</div>
          </div>
        `;
      } else if (roundStatus === 'buzzed') {
        interactiveAreaHtml = `
          <div style="padding:24px; text-align:center; background:rgba(0,122,255,0.06); border:1.5px solid var(--accent-color); border-radius:14px;">
            <div style="font-size:19px; font-weight:900; color:var(--accent-color);">
              🔔 【${escapeForSong(buzzedUser?.name || '同學')}】搶答成功！
            </div>
            <div style="font-size:14px; color:var(--text-secondary); margin-top:8px;">
              該同學正在作答中（限時 10 秒），音樂已全班暫停...
            </div>
          </div>
        `;
      } else if (roundStatus === 'answered_wrong') {
        interactiveAreaHtml = `
          <div style="padding:18px; text-align:center; background:rgba(255,59,48,0.1); border:1.5px solid #ff3b30; border-radius:12px;">
            <div style="font-size:18px; font-weight:900; color:#b42318;">
              ❌ 【${escapeForSong(buzzedUser?.name || '同學')}】答錯了！
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">
              音樂目前維持暫停。請由下方主控台點選【繼續播放 (開放其餘同學繼續搶)】或【跳至下一題】。
            </div>
          </div>
        `;
      } else if (roundStatus === 'answered_correct' || roundStatus === 'revealed') {
        interactiveAreaHtml = `
          <div style="padding:18px; border-radius:12px; background:rgba(52,199,89,0.12); border:1.5px solid #34c759; text-align:center;">
            <div style="font-size:19px; font-weight:900; color:#167a31;">
              ${roundStatus === 'answered_correct' ? `🎉 恭喜【${escapeForSong(buzzedUser?.name || '同學')}】答對！` : '💡 本題正解揭曉'}
            </div>
            <div style="font-size:16px; font-weight:bold; color:var(--text-primary); margin-top:8px;">
              正解：🎵【${escapeForSong(question.title)}】
            </div>
            <div style="font-size:14px; color:var(--accent-color); font-weight:bold; margin-top:4px;">
              🎤 演唱者：${escapeForSong(question.artist || '未知')}
            </div>
            ${question.clue ? `<div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">💡 提示：${escapeForSong(question.clue)}</div>` : ''}
            <div style="margin-top:10px;">
              <a href="${escapeForSong(question.youtubeUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#ff0000; color:white; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold; text-decoration:none;">
                ▶️ 在 YouTube 聆聽完整歌曲
              </a>
            </div>
          </div>
        `;
      } else {
        interactiveAreaHtml = `
          <div style="padding:24px; text-align:center; background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px;">
            <div style="font-size:16px; font-weight:bold; color:var(--text-primary);">
              🎵 等待老師開始播放音樂
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">
              請點擊下方主控台【▶️ 開始播放音樂】開放全班同學搶答。
            </div>
          </div>
        `;
      }
    } else {
      // 🎒 學生端視角：提供巨大搶答按鈕與搶中四選一按鈕
      if (roundStatus === 'playing') {
        // 播放中：顯示巨大搶答按鈕
        if (amIEliminated) {
          interactiveAreaHtml = `
            <div style="padding:24px; text-align:center; background:rgba(255,59,48,0.08); border:2px dashed #ff3b30; border-radius:14px;">
              <div style="font-size:18px; font-weight:bold; color:#b42318;">❌ 您本題已回答錯誤</div>
              <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">請等待其他同學搶答，或等待老師切換至下一題！</div>
            </div>
          `;
        } else {
          const isTeacherOnly = (game.audioMode || 'teacher') !== 'all';
          const tipText = isTeacherOnly
            ? '請聆聽老師端播放音樂，按下搶答後老師端音樂將立即暫停，由您獲得 10 秒作答權！'
            : '仔細聆聽歌曲片段，聽出歌名請立刻按搶答！按下後音樂將全班暫停，由您獲得 10 秒作答權！';
          interactiveAreaHtml = `
            <div style="text-align:center; padding:10px 0;">
              <button type="button" onclick="window.app.pressBuzzerButton()" style="width:100%; max-width:400px; height:110px; border-radius:55px; border:none; background:linear-gradient(135deg, #ff3b30 0%, #ff9500 100%); color:white; font-size:26px; font-weight:900; cursor:pointer; box-shadow:0 8px 24px rgba(255,59,48,0.4); animation: pulseBuzzer 1.5s infinite; transition:transform 0.1s;">
                ⚡ 按我搶答！
              </button>
              <div style="font-size:12px; color:var(--text-muted); margin-top:10px;">${tipText}</div>
              ${!isTeacherOnly ? `
                <div style="margin-top:10px; display:flex; justify-content:center;">
                  <button type="button" onclick="event.stopPropagation(); window.app.playSongQuizAudio(window.app.focusGame.questions[window.app.focusGame.currentQuestionIndex || 0])" style="background:rgba(0,122,255,0.08); border:1px solid var(--accent-color); color:var(--accent-color); padding:5px 14px; border-radius:20px; font-size:12px; font-weight:bold; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                    🔊 聽不到音樂？點我發聲
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }
      } else if (roundStatus === 'buzzed') {
        // 有人搶到了：搶到者作答，其餘同學等待
        if (isMeBuzzed) {
          const optionsButtons = (question.options || []).map((opt, optIdx) => `
            <button type="button" class="song-quiz-option-btn" onclick="window.app.submitBuzzerAnswer(${optIdx})">
              ${String.fromCharCode(65 + optIdx)}．${escapeForSong(opt)}
            </button>
          `).join('');

          interactiveAreaHtml = `
            <div class="song-quiz-answer-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:15px; font-weight:900; color:var(--accent-color);">⚡ 您搶到了！請選擇答案：</span>
                <span id="buzzerAnswerTimer" style="background:#ff3b30; color:white; padding:2px 8px; border-radius:12px; font-size:12px; font-weight:900;">限時 10 秒</span>
              </div>
              <div class="song-quiz-options-list">
                ${optionsButtons}
              </div>
            </div>
          `;
        } else {
          interactiveAreaHtml = `
            <div style="padding:24px; text-align:center; background:rgba(0,122,255,0.06); border:1.5px solid var(--accent-color); border-radius:14px;">
              <div style="font-size:19px; font-weight:900; color:var(--accent-color);">
                🔔 【${escapeForSong(buzzedUser?.name || '同學')}】搶答成功！
              </div>
              <div style="font-size:14px; color:var(--text-secondary); margin-top:8px;">
                正在作答中，老師端歌曲已暫停，請稍候...
              </div>
            </div>
          `;
        }
      } else if (roundStatus === 'answered_wrong') {
        // 答錯：維持暫停，等待老師指令
        interactiveAreaHtml = `
          <div style="padding:18px; text-align:center; background:rgba(255,59,48,0.1); border:1.5px solid #ff3b30; border-radius:12px;">
            <div style="font-size:18px; font-weight:900; color:#b42318;">
              ❌ 【${escapeForSong(buzzedUser?.name || '同學')}】答錯了！
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">
              老師端音樂維持暫停。等待老師指示【繼續播放讓大家再搶】或【跳至下一題】...
            </div>
          </div>
        `;
      } else if (roundStatus === 'answered_correct' || roundStatus === 'revealed') {
        // 答對或公佈答案
        interactiveAreaHtml = `
          <div style="padding:18px; border-radius:12px; background:rgba(52,199,89,0.12); border:1.5px solid #34c759; text-align:center;">
            <div style="font-size:19px; font-weight:900; color:#167a31;">
              ${roundStatus === 'answered_correct' ? `🎉 恭喜【${escapeForSong(buzzedUser?.name || '同學')}】答對！` : '💡 本題正解揭曉'}
            </div>
            <div style="font-size:16px; font-weight:bold; color:var(--text-primary); margin-top:8px;">
              正解：🎵【${escapeForSong(question.title)}】
            </div>
            <div style="font-size:14px; color:var(--accent-color); font-weight:bold; margin-top:4px;">
              🎤 演唱者：${escapeForSong(question.artist || '未知')}
            </div>
            ${question.clue ? `<div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">💡 提示：${escapeForSong(question.clue)}</div>` : ''}
            <div style="margin-top:10px;">
              <a href="${escapeForSong(question.youtubeUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#ff0000; color:white; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold; text-decoration:none;">
                ▶️ 在 YouTube 聆聽完整歌曲
              </a>
            </div>
          </div>
        `;
      } else {
        // waiting 狀態
        interactiveAreaHtml = `
          <div style="padding:24px; text-align:center; background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px;">
            <div style="font-size:16px; font-weight:bold; color:var(--text-primary);">
              🎵 等待老師開始播放音樂
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">
              老師端按下開始播放後，請仔細聆聽音樂並準備按搶答！
            </div>
          </div>
        `;
      }
    }

    // 老師專屬控制面板 (管理員在畫面底部具備主控權)
    let teacherControlHtml = '';
    if (this.isAdmin) {
      const hasPausedProgress = round.audioSeekTime != null && Number(round.audioSeekTime) > Number(question?.startTime || 0);

      teacherControlHtml = `
        <div style="margin-top:10px; padding:14px; border-radius:12px; background:var(--bg-card); border:1.5px solid var(--accent-color);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
            <div style="display:inline-flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span style="font-size:14px; font-weight:900; color:var(--accent-color);">👑 老師主控台 (正解：</span>
              <button type="button" 
                class="presentation-tool-btn peek-answer-btn peek-song-btn" 
                onmousedown="window.app.toggleSongPeekAnswer(true); event.preventDefault();" 
                onmouseup="window.app.toggleSongPeekAnswer(false)" 
                ontouchstart="window.app.toggleSongPeekAnswer(true); event.preventDefault();" 
                ontouchend="window.app.toggleSongPeekAnswer(false)" 
                ontouchcancel="window.app.toggleSongPeekAnswer(false)" 
                title="單螢幕投影防窺：按住不放以暫時顯示歌曲正解，放開滑鼠/手指即自動隱藏" 
                style="font-size:14px; padding:2px 8px; height:28px; line-height:1; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; user-select:none;">
                <span id="peekSongIcon">👁️</span> <span id="peekSongLabel">按住看正解</span>
              </button>
              <span id="peekSongMasked" class="peek-answer-masked" style="font-size:14px; color:var(--text-muted); background:var(--bg-input); padding:2px 8px; border-radius:6px; border:1px dashed var(--border-color); letter-spacing:2px; user-select:none;">••••••</span>
              <span id="peekSongReal" class="peek-answer-real" style="display:none; font-size:14px; font-weight:900; color:var(--accent-color);">${escapeForSong(question.title)} / ${escapeForSong(question.artist || '')}</span>
              <span style="font-size:14px; font-weight:900; color:var(--accent-color);">)</span>
            </div>
            <span style="font-size:14px; color:var(--text-muted);">狀態：${roundStatus}${hasPausedProgress ? ` (進度 ${round.audioSeekTime}s)` : ''}</span>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            ${roundStatus === 'waiting' ? `
              <button type="button" class="presentation-tool-btn active" onclick="window.app.teacherBuzzerAction('play')" style="flex:1; padding:10px 14px; font-size:14px; font-weight:bold; cursor:pointer;">
                ${hasPausedProgress ? '▶️ 繼續播放音樂 (從暫停進度)' : '▶️ 開始播放音樂 (開放搶答)'}
              </button>
              ${hasPausedProgress ? `
                <button type="button" class="presentation-tool-btn" onclick="window.app.teacherBuzzerAction('restart')" style="padding:10px 14px; font-size:14px; font-weight:bold; cursor:pointer;">
                  ⏮️ 從頭重新播放
                </button>
              ` : ''}
            ` : ''}

            ${roundStatus === 'playing' ? `
              <button type="button" class="presentation-tool-btn" onclick="window.app.teacherBuzzerAction('pause')" style="flex:1; padding:10px 14px; background:var(--accent-hover); color:white; border-color:var(--accent-hover); font-size:14px; font-weight:bold; cursor:pointer;">
                ⏸️ 暫停播放
              </button>
            ` : ''}

            ${roundStatus === 'answered_wrong' ? `
              <button type="button" class="presentation-tool-btn active" onclick="window.app.teacherBuzzerAction('resume')" style="flex:2; padding:12px 14px; font-size:14px; font-weight:900; cursor:pointer;">
                ▶️ 繼續播放音樂 (開放其餘同學繼續搶答)
              </button>
              <button type="button" class="presentation-tool-btn" onclick="window.app.teacherBuzzerAction('restart')" style="padding:10px 12px; font-size:14px; font-weight:bold; cursor:pointer;">
                ⏮️ 從頭重播
              </button>
              <button type="button" class="presentation-tool-btn" onclick="window.app.teacherBuzzerAction('reveal')" style="padding:10px 12px; font-size:14px; font-weight:bold; cursor:pointer;">
                💡 揭曉答案
              </button>
              <button type="button" class="presentation-tool-btn danger" onclick="window.app.teacherBuzzerAction('next')" style="flex:1; padding:12px 14px; font-size:14px; font-weight:900; cursor:pointer;">
                ⏭️ 跳至下一題
              </button>
            ` : ''}

            ${(roundStatus === 'answered_correct' || roundStatus === 'revealed') ? `
              <button type="button" class="presentation-tool-btn active" onclick="window.app.teacherBuzzerAction('next')" style="flex:1; padding:12px 14px; font-size:15px; font-weight:900; cursor:pointer;">
                ${qIndex + 1 >= questions.length ? '🏁 結束並查看全班排行榜' : '⏭️ 進入下一題 ➜'}
              </button>
            ` : ''}

            ${roundStatus !== 'answered_correct' && roundStatus !== 'revealed' && roundStatus !== 'answered_wrong' ? `
              <button type="button" class="presentation-tool-btn" onclick="window.app.teacherBuzzerAction('reveal')" style="padding:10px 14px; font-size:14px; font-weight:bold; cursor:pointer;">
                💡 揭曉答案
              </button>
              <button type="button" class="presentation-tool-btn" onclick="window.app.teacherBuzzerAction('next')" style="padding:10px 14px; font-size:14px; font-weight:bold; cursor:pointer;">
                ⏭️ 跳題
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }

    // 即時積分看板 (縮小版置於底部，支援同分並列名次)
    const scores = game.buzzerScores || {};
    const scoreEntries = Object.values(scores).sort((a, b) => (b.score || 0) - (a.score || 0));
    let scoreBoardHtml = '';
    if (scoreEntries.length > 0) {
      let inGameRank = 1;
      const rankedScoreEntries = scoreEntries.map((u, i) => {
        if (i > 0 && Number(u.score || 0) < Number(scoreEntries[i - 1].score || 0)) {
          inGameRank = i + 1;
        }
        return { ...u, rank: inGameRank };
      });

      scoreBoardHtml = `
        <div style="margin-top:10px; padding:10px 14px; border-radius:10px; background:var(--bg-card); border:1px solid var(--border-color);">
          <div style="font-size:12px; font-weight:bold; color:var(--text-secondary); margin-bottom:6px;">🏆 目前搶答積分排行榜：</div>
          <div style="display:flex; gap:12px; overflow-x:auto; padding-bottom:4px;">
            ${rankedScoreEntries.slice(0, 5).map((u) => `
              <span style="font-size:12px; font-weight:bold; white-space:nowrap; background:rgba(0,122,255,0.08); padding:3px 8px; border-radius:6px; color:var(--text-primary);">
                ${u.rank === 1 ? '🥇' : (u.rank === 2 ? '🥈' : (u.rank === 3 ? '🥉' : `${u.rank}.`))} ${escapeForSong(u.name)}: <strong style="color:var(--accent-color);">${u.score || 0}分</strong>
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 手機學生端：搶答按鈕優先顯示在最上方，讓學生無需捲動即可立刻按搶答
    const isMobileStudent = (window.innerWidth <= 768) && !this.isAdmin;
    const useSingleStatus = (this.isAdmin && ['waiting','playing','buzzed','answered_wrong'].includes(roundStatus)) || (!this.isAdmin && ['buzzed','answered_wrong'].includes(roundStatus));
    grid.innerHTML = `
      <div class="song-quiz-wrapper ${isMeBuzzed ? 'answering-mode' : ''}">
        ${headerHtml}
        ${useSingleStatus ? interactiveAreaHtml : (roundStatus === 'waiting' ? vinylHtml : (isMobileStudent ? interactiveAreaHtml : vinylHtml))}
        ${useSingleStatus || roundStatus === 'waiting' ? '' : (isMobileStudent ? vinylHtml : interactiveAreaHtml)}
        ${teacherOptionsHtml}
        ${teacherControlHtml}
        ${scoreBoardHtml}
      </div>

      <style>
        @keyframes spinVinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseBuzzer {
          0% { transform: scale(1); box-shadow: 0 4px 16px rgba(255,59,48,0.3); }
          50% { transform: scale(1.03); box-shadow: 0 8px 28px rgba(255,59,48,0.6); }
          100% { transform: scale(1); box-shadow: 0 4px 16px rgba(255,59,48,0.3); }
        }
      </style>
    `;
  };

  // 處理全班音訊同步播放 / 暫停
  App.prototype.handleBuzzerAudioSync = function handleBuzzerAudioSync(question, round) {
    // 全班同步搶答模式下：除非設定明確為 'all' (全班同步發聲)，否則學生端嚴格禁止播放音樂
    const isAllAudioBroadcast = this.focusGame && this.focusGame.audioMode === 'all';
    if (!this.isAdmin && !isAllAudioBroadcast) {
      this.lastBuzzerAudioKey = null;
      this.stopSongQuizAudio();
      return;
    }

    const roundStatus = round.status || 'waiting';
    const action = round.audioAction || 'stop';

    if (roundStatus === 'playing') {
      // 播放中：如果尚未播放，啟動播放 (包含 action, timestamp 與 audioSeekTime 變更)
      const currentActionKey = `${question.id}_${round.timestamp || 0}_${round.audioSeekTime || 0}`;
      if (this.lastBuzzerAudioKey !== currentActionKey) {
        this.lastBuzzerAudioKey = currentActionKey;
        const seekTime = Number(round.audioSeekTime != null ? round.audioSeekTime : (question.startTime || 0));
        this.playSongQuizAudio(question, seekTime);
      }
    } else {
      // 非播放狀態 (buzzed, answered_wrong, answered_correct, waiting, revealed)：立即停止/暫停音訊
      this.lastBuzzerAudioKey = null;
      this.stopSongQuizAudio();
    }
  };

  // 學生按下「⚡ 按我搶答！」
  App.prototype.pressBuzzerButton = function pressBuzzerButton() {
    if (this.isAdmin) return;
    const game = this.focusGame;
    if (!game || game.playMode !== 'buzzer') return;

    const round = game.buzzerRound || {};
    if (round.status !== 'playing') return;

    const question = (game.questions || [])[Number(game.currentQuestionIndex || 0)];

    // 檢查是否有設定姓名或暱稱，防呆強制驗證以利老師辨識答題者
    const currentName = this.getCurrentUserName ? this.getCurrentUserName() : (window.boardStorage.local.getItem('user_nickname') || window.boardStorage.local.getItem('user_name') || '');
    if (!currentName || currentName === '同學' || currentName === '訪客' || currentName === '匿名') {
      if (this.openStudentNameModal) this.openStudentNameModal();
      this.showNotification('請先設定姓名', '搶答前請先輸入您的姓名或暱稱，讓老師知道是誰搶答！');
      return;
    }

    const userId = (this.getUserId && typeof this.getUserId === 'function') ? this.getUserId() : (window.boardStorage.local.getItem('user_id') || 'guest');
    const userName = currentName;

    // 檢查是否已被淘汰
    if (round.eliminatedUsers && round.eliminatedUsers[userId]) {
      this.showNotification('提醒', '您本題已回答錯誤，請等待其他同學搶答！');
      return;
    }

    // 播放搶答音效
    if (this.playFocusSound) this.playFocusSound('click');

    // 透過 Firebase Transaction 原子性搶奪答題權
    db.ref('quiz/focusGame/buzzerRound').transaction((current) => {
      if (!current) return current;
      if (current.status === 'playing' && !current.buzzedUser) {
        const now = Date.now();
        const baseSeek = Number(current.audioSeekTime != null ? current.audioSeekTime : (question?.startTime || 0));
        const playedMs = current.playStartedAt ? Math.max(0, now - current.playStartedAt) : 0;
        const currentPos = Math.round(baseSeek + playedMs / 1000);

        current.status = 'buzzed';
        current.buzzedUser = {
          uid: userId,
          name: userName,
          buzzedAt: now
        };
        current.audioAction = 'pause';
        current.audioSeekTime = currentPos;
        current.playStartedAt = null;
        current.timestamp = now;
        return current;
      }
      return; // 已被搶走，取消操作
    }, (error, committed, snapshot) => {
      if (error) {
        this.showNotification('錯誤', '搶答失敗: ' + error.message);
      } else if (committed) {
        this.showNotification('搶答成功', '您成功搶到了！請於 10 秒內作答！');
        // 啟動 10 秒作答倒數
        this.startBuzzerAnswerCountdown(10);
      } else {
        this.showNotification('慢了一步', '已被其他同學搶先按下了！');
      }
    });
  };

  // 搶答者作答 10 秒倒數計時
  App.prototype.startBuzzerAnswerCountdown = function startBuzzerAnswerCountdown(seconds) {
    if (this.buzzerCountdownInterval) clearInterval(this.buzzerCountdownInterval);
    let remaining = seconds;
    const timerEl = document.getElementById('buzzerAnswerTimer');
    if (timerEl) timerEl.textContent = `限時 ${remaining} 秒`;

    this.buzzerCountdownInterval = setInterval(() => {
      remaining--;
      const el = document.getElementById('buzzerAnswerTimer');
      if (el) el.textContent = `限時 ${remaining} 秒`;

      if (remaining <= 0) {
        clearInterval(this.buzzerCountdownInterval);
        this.buzzerCountdownInterval = null;
        // 逾時視為答錯
        this.submitBuzzerAnswer(-1);
      }
    }, 1000);
  };

  // 搶答者送出四選一答案
  App.prototype.submitBuzzerAnswer = function submitBuzzerAnswer(optIdx) {
    if (this.buzzerCountdownInterval) {
      clearInterval(this.buzzerCountdownInterval);
      this.buzzerCountdownInterval = null;
    }

    const game = this.focusGame;
    if (!game) return;

    const qIndex = Number(game.currentQuestionIndex || 0);
    const question = (game.questions || [])[qIndex];
    if (!question) return;

    const userId = window.boardStorage.local.getItem('user_id') || 'guest';
    const userName = window.boardStorage.local.getItem('comment_nickname') || window.boardStorage.local.getItem('user_name') || '同學';

    const chosenOption = optIdx >= 0 ? (question.options || [])[optIdx] : '（逾時未答）';
    const isCorrect = optIdx >= 0 && (chosenOption === question.title);

    const roundRef = db.ref('quiz/focusGame/buzzerRound');
    const scoresRef = db.ref(`quiz/focusGame/buzzerScores/${userId}`);

    if (isCorrect) {
      // 答對：加 10 分，更新 round 狀態為 answered_correct
      roundRef.update({
        status: 'answered_correct',
        selectedOption: chosenOption,
        isCorrect: true,
        timestamp: Date.now()
      });

      scoresRef.transaction((curr) => {
        const score = (curr && curr.score) || 0;
        const correctCount = (curr && curr.correctCount) || 0;
        return {
          name: userName,
          score: score + 10,
          correctCount: correctCount + 1,
          updatedAt: Date.now()
        };
      });

      if (this.playFocusSound) this.playFocusSound('correct');
    } else {
      // 答錯：將該學生加入 eliminatedUsers，狀態切換為 answered_wrong
      db.ref(`quiz/focusGame/buzzerRound/eliminatedUsers/${userId}`).set(true);
      roundRef.update({
        status: 'answered_wrong',
        selectedOption: chosenOption,
        isCorrect: false,
        timestamp: Date.now()
      });
      if (this.playFocusSound) this.playFocusSound('wrong');
    }
  };

  // 老師端主控操作指令
  App.prototype.teacherBuzzerAction = function teacherBuzzerAction(action) {
    if (!this.isAdmin) return;
    const game = this.focusGame;
    if (!game) return;

    const questions = game.questions || [];
    const qIndex = Number(game.currentQuestionIndex || 0);
    const question = questions[qIndex];
    const round = game.buzzerRound || {};

    if (action === 'play') {
      // 開始播放：若之前有暫停進度則從暫停點播放，否則從題目起點播放
      const now = Date.now();
      const startSeek = Number(round.audioSeekTime != null ? round.audioSeekTime : (question?.startTime || 0));
      db.ref('quiz/focusGame/buzzerRound').update({
        status: 'playing',
        audioAction: 'play',
        audioSeekTime: startSeek,
        playStartedAt: now,
        buzzedUser: null,
        timestamp: now
      });
    } else if (action === 'pause') {
      // 手動暫停：精確計算並儲存當前音訊進度
      const now = Date.now();
      const baseSeek = Number(round.audioSeekTime != null ? round.audioSeekTime : (question?.startTime || 0));
      const playedMs = round.playStartedAt ? Math.max(0, now - round.playStartedAt) : 0;
      const currentPos = Math.round(baseSeek + playedMs / 1000);

      db.ref('quiz/focusGame/buzzerRound').update({
        status: 'waiting',
        audioAction: 'pause',
        audioSeekTime: currentPos,
        playStartedAt: null,
        timestamp: now
      });
    } else if (action === 'resume') {
      // 繼續播放 (答錯後讓其他同學繼續搶)：從剛才暫停的時間點開始續播
      const now = Date.now();
      const currentSeek = Number(round.audioSeekTime != null ? round.audioSeekTime : (question?.startTime || 0));
      db.ref('quiz/focusGame/buzzerRound').update({
        status: 'playing',
        audioAction: 'resume',
        audioSeekTime: currentSeek,
        playStartedAt: now,
        buzzedUser: null,
        timestamp: now
      });
      this.showNotification('指令發送', '已繼續播放歌曲，開放其他同學搶答！');
    } else if (action === 'restart') {
      // 從頭重播本題
      const now = Date.now();
      const initialStart = Number(question?.startTime || 0);
      db.ref('quiz/focusGame/buzzerRound').update({
        status: 'playing',
        audioAction: 'play',
        audioSeekTime: initialStart,
        playStartedAt: now,
        buzzedUser: null,
        timestamp: now
      });
      this.showNotification('重新播放', '已從頭重新播放本題歌曲片段！');
    } else if (action === 'reveal') {
      // 揭曉答案
      db.ref('quiz/focusGame/buzzerRound').update({
        status: 'revealed',
        audioAction: 'stop',
        playStartedAt: null,
        timestamp: Date.now()
      });
    } else if (action === 'next') {
      // 切換下一題
      const nextIndex = qIndex + 1;
      if (nextIndex >= questions.length) {
        // 全部完成：標記遊戲結束
        db.ref('quiz/focusGame').update({
          currentQuestionIndex: nextIndex,
          buzzerRound: {
            status: 'finished',
            audioAction: 'stop',
            playStartedAt: null,
            timestamp: Date.now()
          }
        });
      } else {
        // 進入下一題，重置 round
        const nextQ = questions[nextIndex];
        const nextStart = nextQ ? Number(nextQ.startTime || 0) : 0;
        db.ref('quiz/focusGame').update({
          currentQuestionIndex: nextIndex,
          buzzerRound: {
            status: 'waiting',
            audioAction: 'init',
            audioSeekTime: nextStart,
            playStartedAt: null,
            buzzedUser: null,
            eliminatedUsers: {},
            timestamp: Date.now()
          }
        });
      }
    }
  };

  // 渲染全班搶答最終排行榜與頒獎
  App.prototype.renderBuzzerFinalLeaderboard = function renderBuzzerFinalLeaderboard(game) {
    const grid = document.getElementById('focusGameGrid');
    if (!grid) return;

    const playingRankSection = document.getElementById('focusPlayingLeaderboardSection');
    if (playingRankSection) playingRankSection.style.display = 'none';

    this.stopSongQuizAudio();

    const scores = game.buzzerScores || {};
    const entries = Object.values(scores).sort((a, b) => (b.score || 0) - (a.score || 0));

    // 計算同分人數與並列名次
    const scoreCounts = {};
    entries.forEach((e) => {
      const s = Number(e.score || 0);
      scoreCounts[s] = (scoreCounts[s] || 0) + 1;
    });

    let currentRank = 1;
    const rankedEntries = entries.map((entry, index) => {
      if (index > 0 && Number(entry.score || 0) < Number(entries[index - 1].score || 0)) {
        currentRank = index + 1;
      }
      const isTied = (scoreCounts[Number(entry.score || 0)] || 1) > 1;
      return {
        ...entry,
        rank: currentRank,
        isTied
      };
    });

    grid.innerHTML = `
      <div style="padding:20px; border-radius:16px; background:linear-gradient(135deg, rgba(0,122,255,0.12) 0%, rgba(52,199,89,0.12) 100%); border:1.5px solid var(--accent-color); text-align:center; box-sizing:border-box;">
        <div style="font-size:26px; font-weight:900; color:var(--text-primary);">🏆 全班聽歌搶答 頒獎典禮 🏆</div>
        <div style="font-size:14px; color:var(--text-secondary); margin-top:6px;">全部歌曲搶答完畢！以下為全班同學的搶答戰績與榮譽榜：</div>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px; margin-top:6px;">
        ${rankedEntries.length === 0 ? `
          <div style="padding:24px; text-align:center; color:var(--text-muted); background:var(--bg-card); border-radius:12px; border:1px solid var(--border-color);">
            本局無同學得分
          </div>
        ` : rankedEntries.map((entry) => {
          let badge = `第 ${entry.rank} 名${entry.isTied ? ' (並列)' : ''}`;
          let bg = 'var(--bg-card)';
          let border = '1px solid var(--border-color)';
          if (entry.rank === 1) {
            badge = entry.isTied ? '🥇 並列冠軍' : '🥇 冠軍';
            bg = 'rgba(255,215,0,0.15)';
            border = '2px solid #ffd700';
          } else if (entry.rank === 2) {
            badge = entry.isTied ? '🥈 並列亞軍' : '🥈 亞軍';
            bg = 'rgba(192,192,192,0.15)';
            border = '2px solid #c0c0c0';
          } else if (entry.rank === 3) {
            badge = entry.isTied ? '🥉 並列季軍' : '🥉 季軍';
            bg = 'rgba(205,127,50,0.15)';
            border = '2px solid #cd7f32';
          }

          return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-radius:12px; background:${bg}; border:${border};">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-weight:900; font-size:15px; color:var(--text-primary); min-width:90px; white-space:nowrap;">${badge}</span>
                <span style="font-size:16px; font-weight:bold; color:var(--text-primary);">${escapeForSong(entry.name)}</span>
              </div>
              <div style="text-align:right;">
                <span style="font-size:18px; font-weight:900; color:var(--accent-color);">${entry.score || 0} 分</span>
                <span style="font-size:12px; color:var(--text-secondary); margin-left:8px;">(答對 ${entry.correctCount || 0} 首)</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${this.isAdmin ? `
        <button type="button" onclick="window.app.endFocusGame()" style="margin-top:14px; width:100%; padding:13px; border:none; border-radius:10px; background:#ff3b30; color:white; font-size:16px; font-weight:bold; cursor:pointer;">
          🛑 關閉全班測驗並重置
        </button>
      ` : ''}
    `;
  };

})(typeof window !== 'undefined' ? window : this);
