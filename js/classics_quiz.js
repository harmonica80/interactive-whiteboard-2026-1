// 唐詩宋詞・成語典故專注力選擇題模組
(function () {
  function escapeForClassics(value) {
    const text = String(value ?? '')
    return text.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]))
  }

  function renderClassicsLinks(question) {
    const keyword = question.work || (question.reference && question.reference.readcKeyword) || question.correctOption || '';
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
    return `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 10px;">
        <a href="${escapeForClassics(googleSearchUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); font-weight: bold; text-decoration: underline; font-size: 13px; display: inline-flex; align-items: center; gap: 4px;">🔍 透過 Google 查詢「${escapeForClassics(keyword)}」</a>
      </div>
    `;
  }

  App.prototype.startClassicsQuizGame = function startClassicsQuizGame(game) {
    this.focusGame = game
    const grid = document.getElementById('focusGameGrid')
    if (!grid) return

    const helpBtn = document.getElementById('focusHelpBtn')
    const helpInfo = document.getElementById('focusHelpInfo')
    const targetLabel = document.getElementById('focusCurrentTarget')?.parentElement
    if (helpBtn) helpBtn.style.display = 'none'
    if (helpInfo) helpInfo.textContent = ''
    if (targetLabel) targetLabel.style.display = 'none'

    grid.classList.remove('schulte-mode')
    const numberGridContainer = document.getElementById('focusNumberGridContainer')
    if (numberGridContainer) numberGridContainer.classList.remove('schulte-mode')
    const instEl = document.getElementById('focusGameInstruction')
    if (instEl) {
      instEl.style.display = 'none'
      instEl.textContent = ''
    }

    grid.style.aspectRatio = 'auto'
    grid.style.display = 'flex'
    grid.style.flexDirection = 'column'
    grid.style.gap = '12px'
    grid.style.width = '100%'
    grid.style.maxWidth = '560px'
    grid.style.maxHeight = 'none'
    grid.style.height = 'auto'
    grid.style.minHeight = 'auto'
    grid.style.overflow = 'visible'
    if (numberGridContainer) {
      numberGridContainer.style.maxHeight = 'none'
      numberGridContainer.style.height = 'auto'
      numberGridContainer.style.flexShrink = '0'
    }

    const questions = Array.isArray(game.questions) ? game.questions : []
    if (questions.length === 0) {
      grid.innerHTML = '<div style="padding:20px;color:var(--danger-color);font-weight:bold;">題庫載入失敗，請請老師重新發起遊戲。</div>'
      return
    }

    this.classicsQuizState = {
      gameKey: `${game.startTime || game.countdownStartTime || 'start'}_${questions.map((q) => q.id).join('_')}`,
      index: 0,
      correctCount: 0,
      answers: [],
      eliminated: new Set(),
      answered: false
    }
    this.focusStartTimeLocal = game.startTime || Date.now()
    if (this.focusTimerInterval) clearInterval(this.focusTimerInterval)
    this.focusTimerInterval = setInterval(() => {
      const elapsed = (Date.now() - (game.startTime || this.focusStartTimeLocal)) / 1000 + (this.focusHelpPenaltySeconds || 0)
      const timer = document.getElementById('focusTimer')
      if (timer) timer.textContent = elapsed.toFixed(2)
    }, 30)
    this.renderClassicsQuizQuestion()
  }

  App.prototype.renderClassicsQuizQuestion = function renderClassicsQuizQuestion() {
    const state = this.classicsQuizState
    const game = this.focusGame
    const grid = document.getElementById('focusGameGrid')
    if (!state || !game || !grid) return
    const question = (game.questions || [])[state.index]
    if (!question) return

    const remainingWrong = question.options.filter((option) => option !== question.correctOption && !state.eliminated.has(option))
    const optionHtml = question.options.map((option, optionIndex) => {
      const isEliminated = state.eliminated.has(option)
      const isCorrect = option === question.correctOption
      const isSelected = state.selectedOption === option
      let background = 'var(--bg-card)'
      let border = '1.5px solid var(--border-color)'
      let color = 'var(--text-primary)'
      if (state.answered && isCorrect) { background = 'rgba(52,199,89,0.14)'; border = '2px solid #34c759'; color = '#167a31' }
      if (state.answered && isSelected && !isCorrect) { background = 'rgba(255,59,48,0.12)'; border = '2px solid #ff3b30'; color = '#b42318' }
      const eliminatedStyle = isEliminated ? 'opacity:0.42; text-decoration:line-through; cursor:not-allowed;' : 'cursor:pointer;'
      return `
        <button onclick="window.app.answerClassicsQuiz(${optionIndex})" ${state.answered || isEliminated ? 'disabled' : ''} style="width:100%; text-align:left; padding:13px 14px; border-radius:10px; border:${border}; background:${background}; color:${color}; font-size:15px; font-weight:700; ${eliminatedStyle}">
          ${isEliminated ? '✖ 已排除　' : `${String.fromCharCode(65 + optionIndex)}．`}${escapeForClassics(option)}
        </button>`
    }).join('')

    const feedback = state.answered ? `
      <div style="margin-top:14px;padding:14px;border-radius:12px;background:${state.isCorrect ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)'};border:1px solid ${state.isCorrect ? '#34c759' : '#ff9500'};line-height:1.65;">
        <div style="font-weight:900;color:${state.isCorrect ? '#167a31' : '#b26a00'};font-size:16px;">${state.isCorrect ? '答對了！' : '這題的正解是：'} ${escapeForClassics(question.correctOption)}</div>
        <div style="font-size:14px;color:var(--text-secondary);margin-top:4px;">${escapeForClassics(question.explanation)}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;">📌 原文／典故：${escapeForClassics(question.quote)}</div>
        ${renderClassicsLinks(question)}
      </div>
      <button onclick="window.app.nextClassicsQuizQuestion()" style="margin-top:12px;width:100%;padding:12px;border:0;border-radius:10px;background:var(--accent-color);color:white;font-size:15px;font-weight:900;cursor:pointer;">${state.index + 1 === game.questions.length ? '🏁 查看全部解答與成績' : '下一題 ➜'}</button>` : (game.allowHint !== false ? `
      <button onclick="window.app.useClassicsEliminationHint()" ${remainingWrong.length === 0 ? 'disabled' : ''} style="margin-top:12px;width:100%;padding:11px;border:0;border-radius:10px;background:#ff9500;color:white;font-size:14px;font-weight:900;cursor:pointer;opacity:${remainingWrong.length === 0 ? 0.45 : 1};">
        💡 刪去法提示：排除 1 個錯誤選項（+5 秒）
      </button>
      <div style="font-size:12px;color:var(--text-muted);margin-top:7px;">已使用 ${this.focusHelpCount || 0} 次提示；目前會直接排除錯誤答案，增加答對機會。</div>` : '')

    grid.innerHTML = `
      <div style="width:100%;padding:14px;border-radius:14px;background:linear-gradient(135deg,rgba(0,122,255,.10),rgba(88,86,214,.08));border:1px solid rgba(0,122,255,.22);box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;font-size:13px;color:var(--text-secondary);font-weight:bold;"><span>${escapeForClassics(question.category)}</span><span>第 ${state.index + 1}／${game.questions.length} 題</span></div>
        <div style="margin:10px 0 14px;font-size:19px;line-height:1.6;font-weight:900;color:var(--text-primary);">${escapeForClassics(question.prompt)}</div>
        <div style="display:flex;flex-direction:column;gap:9px;">${optionHtml}</div>
        ${feedback}
      </div>`
  }

  App.prototype.answerClassicsQuiz = function answerClassicsQuiz(optionIndex) {
    const state = this.classicsQuizState
    const question = this.focusGame?.questions?.[state?.index]
    if (!state || !question || state.answered || state.eliminated.has(question.options[optionIndex])) return
    const selectedOption = question.options[optionIndex]
    state.selectedOption = selectedOption
    state.isCorrect = selectedOption === question.correctOption
    state.answered = true
    if (state.isCorrect) state.correctCount += 1
    state.answers[state.index] = { questionId: question.id, selectedOption, correct: state.isCorrect }
    if (typeof this.playFocusSound === 'function') {
      this.playFocusSound(state.isCorrect ? 'correct' : 'wrong')
    }
    this.renderClassicsQuizQuestion()
  }

  App.prototype.useClassicsEliminationHint = function useClassicsEliminationHint() {
    const state = this.classicsQuizState
    const question = this.focusGame?.questions?.[state?.index]
    if (!state || !question || state.answered || this.focusGame?.allowHint === false) return
    const candidate = question.options.find((option) => option !== question.correctOption && !state.eliminated.has(option))
    if (!candidate) return
    state.eliminated.add(candidate)
    this.focusHelpCount = (this.focusHelpCount || 0) + 1
    this.focusHelpPenaltySeconds = (this.focusHelpPenaltySeconds || 0) + 5
    this.playFocusSound?.('click')
    this.renderClassicsQuizQuestion()
  }

  App.prototype.nextClassicsQuizQuestion = function nextClassicsQuizQuestion() {
    const state = this.classicsQuizState
    if (!state || !state.answered) return
    state.index += 1
    state.answered = false
    state.selectedOption = null
    state.isCorrect = false
    state.eliminated = new Set()
    if (state.index >= (this.focusGame.questions || []).length) {
      this.finishClassicsQuizGame()
      return
    }
    this.renderClassicsQuizQuestion()
  }

  App.prototype.finishClassicsQuizGame = function finishClassicsQuizGame() {
    const state = this.classicsQuizState
    if (!state || state.submitted) return
    state.submitted = true
    if (this.focusTimerInterval) clearInterval(this.focusTimerInterval)
    this.focusTimerInterval = null
    const game = this.focusGame
    const userId = window.boardStorage.local.getItem('user_id') || 'guest'
    const userName = window.boardStorage.local.getItem('comment_nickname') || window.boardStorage.local.getItem('user_name') || '匿名'
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
      totalQuestions: game.questions.length,
      timeSpent,
      completedAt: firebase.database.ServerValue.TIMESTAMP,
      status: 'correct',
      gameType: 'classicsQuiz',
      helpCount: this.focusHelpCount || 0,
      penaltySeconds: this.focusHelpPenaltySeconds || 0
    }
    // 立即將本地成績加入 results，確保即時呈現在學生端排行榜上，不出現空白或「目前尚無人完成」
    const currentResults = { ...(this.focusGame?.results || game?.results || {}), [userId]: result };
    const updatedGame = { ...(this.focusGame || game || {}), results: currentResults };
    this.focusGame = updatedGame;
    const playingRankSection = document.getElementById('focusPlayingLeaderboardSection');
    if (playingRankSection) playingRankSection.style.display = 'none';
    this.renderClassicsQuizCompleted(updatedGame, result);

    db.ref(`quiz/focusGame/results/${userId}`).set(result).then(() => {
      this.showNotification('完成', `答對 ${state.correctCount}／${game.questions.length} 題！`);
      if (document.getElementById('classicsQuizSelfRankList')) {
        this.renderFocusGameLeaderboard('classicsQuizSelfRankList', this.focusGame?.results || currentResults);
      }
    }).catch((error) => this.showNotification('錯誤', `送出成績失敗：${error.message}`))
  }

  App.prototype.renderClassicsQuizCompleted = function renderClassicsQuizCompleted(game, result) {
    const grid = document.getElementById('focusGameGrid')
    if (!grid) return

    // 結算畫面已有 classicsQuizSelfRankList，必須確實隱藏作答中的 focusPlayingLeaderboardSection 避免重複出現
    const playingRankSection = document.getElementById('focusPlayingLeaderboardSection');
    if (playingRankSection) playingRankSection.style.display = 'none';

    grid.classList.remove('schulte-mode')
    const numberGridContainer = document.getElementById('focusNumberGridContainer')
    if (numberGridContainer) numberGridContainer.classList.remove('schulte-mode')
    const instEl = document.getElementById('focusGameInstruction')
    if (instEl) {
      instEl.style.display = 'none'
      instEl.textContent = ''
    }

    const answers = result.answers || []
    const score = Number(result.score) || 0
    const total = Number(result.totalQuestions) || (game.questions || []).length
    const byId = new Map(answers.map((item) => [item.questionId, item]))
    grid.style.aspectRatio = 'auto'
    grid.style.display = 'flex'
    grid.style.flexDirection = 'column'
    grid.style.gap = '12px'
    grid.style.width = '100%'
    grid.style.maxWidth = '560px'
    grid.style.maxHeight = 'none'
    grid.style.height = 'auto'
    grid.style.minHeight = 'auto'
    grid.style.overflow = 'visible'
    if (numberGridContainer) {
      numberGridContainer.style.maxHeight = 'none'
      numberGridContainer.style.height = 'auto'
      numberGridContainer.style.flexShrink = '0'
    }
    grid.innerHTML = `
      <div style="padding:16px;border-radius:14px;background:rgba(52,199,89,.10);border:1px solid #34c759;width:100%;box-sizing:border-box;">
        <div style="font-size:21px;font-weight:900;color:#167a31;">🎉 本局完成：答對 ${score}／${total} 題</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;">以下列出每題正解、原典／完整詩詞連結與導讀資料，可直接開啟延伸閱讀。</div>
      </div>
      ${(game.questions || []).map((question, index) => {
        const answer = byId.get(question.id)
        const isCorrect = answer?.correct
        return `
          <div style="padding:14px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border-color);width:100%;box-sizing:border-box;">
            <div style="font-size:13px;color:var(--text-secondary);font-weight:bold;">第 ${index + 1} 題・${escapeForClassics(question.category)} ${isCorrect ? '✅' : '❌'}</div>
            <div style="font-size:15px;font-weight:800;color:var(--text-primary);margin-top:5px;line-height:1.55;">${escapeForClassics(question.prompt)}</div>
            <div style="margin-top:7px;color:#167a31;font-weight:900;">正解：${escapeForClassics(question.correctOption)}</div>
            ${answer && !isCorrect ? `<div style="font-size:13px;color:#b42318;margin-top:3px;">你的答案：${escapeForClassics(answer.selectedOption || '未作答')}</div>` : ''}
            <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;line-height:1.55;">${escapeForClassics(question.explanation)}</div>
            ${renderClassicsLinks(question)}
          </div>`
      }).join('')}
      <div style="margin-top:16px; padding:16px; border-radius:14px; background:var(--bg-card); border:1px solid var(--border-color); width:100%; box-sizing:border-box;">
        <h4 style="font-size:15px; margin:0 0 12px 0; color:var(--text-primary); display:flex; align-items:center; gap:6px; font-weight:bold;">
          🏆 全班即時成績排行榜
        </h4>
        <div id="classicsQuizSelfRankList" style="display:flex; flex-direction:column; gap:6px; max-height:260px; overflow-y:auto;">
          <!-- 排行榜由 renderFocusGameLeaderboard 自動填入 -->
        </div>
      </div>
    `;

    if (this.renderFocusGameLeaderboard) {
      const resultsToRender = (game && game.results && Object.keys(game.results).length > 0)
        ? game.results
        : (result ? { [window.boardStorage.local.getItem('user_id') || 'guest']: result } : null);
      this.renderFocusGameLeaderboard('classicsQuizSelfRankList', resultsToRender);
    }
  }
})()
