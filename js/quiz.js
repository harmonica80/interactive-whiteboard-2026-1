// 測驗模組
class Quiz {
  constructor() {
    this.currentQuiz = null;
    this.historyBank = {};
    this.chartType = 'bar'; // 'bar' | 'pie' | 'line'
    this.currentAnswers = {};
    this.quizRef = db.ref('quiz/current');
    this.answersRef = db.ref('quiz/answers');
    this.historyRef = db.ref('quiz/history');
    this.setupFirebaseSync();
    this.initEditorEvents();
  }
  
  setupFirebaseSync() {
    this.quizRef.on('value', (snapshot) => {
      const prevActive = this.currentQuiz?.active;
      this.currentQuiz = snapshot.val();
      if (this.currentQuiz && this.currentQuiz.chartType) {
        this.chartType = this.currentQuiz.chartType;
        const radios = document.querySelectorAll('input[name="quizChartTypeRadio"]');
        radios.forEach(r => {
          r.checked = (r.value === this.currentQuiz.chartType);
        });
      }
      this.updateUI();

      // 當老師發起選擇題測驗時，學生端比照專注力測驗，自動切換至測驗分頁無需學生手動點選按鈕
      if (this.currentQuiz && this.currentQuiz.active) {
        if (!window.app?.isAdmin) {
          if (window.app && typeof window.app.switchToTab === 'function') {
            if (window.app.activeTabId !== 'panel-quiz') {
              window.app.switchToTab('panel-quiz');
            }
          }
          if (!prevActive && window.app) {
            const cleanSummary = (this.currentQuiz.question || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
            const displayQuestion = cleanSummary.length > 50 ? cleanSummary.substring(0, 50) + '...' : (cleanSummary || '新題目');
            window.app.showNotification('測驗進行中', `老師已發起測驗：${displayQuestion}`);
          }
        }
      }
    });
    
    this.answersRef.on('value', (snapshot) => {
      const answers = snapshot.val() || {};
      this.updateResults(answers);
    });

    this.historyRef.on('value', (snapshot) => {
      this.historyBank = snapshot.val() || {};
      this.renderQuizHistoryUI();
      this.renderQuizBankListUI();
    });
  }

  setChartType(type) {
    if (!['bar', 'pie', 'line'].includes(type)) type = 'bar';
    this.chartType = type;
    const radios = document.querySelectorAll('input[name="quizChartTypeRadio"]');
    radios.forEach(r => {
      r.checked = (r.value === type);
    });
    if (this.currentQuiz) {
      if (this.currentQuiz.active) {
        this.updateResults(this.currentAnswers || {});
      } else {
        this.showFinalResults();
      }
    }
  }
  
  async startQuiz(question, options, quizType = 'single', extraData = {}) {
    if (!window.app?.isAdmin) {
      window.app?.showNotification('權限不足', '只有獲授權的教師可以出題。');
      return;
    }
    if (!question || options.length < 2) {
      if (window.app) window.app.showNotification('提示', '請填寫題目及至少兩個選項');
      return;
    }
    
    // 自動停止搶答與專注力測驗。
    db.ref('quiz/buzzGame').set(null);
    db.ref('quiz/focusGame/status').set('idle');

    const selectedChartRadio = document.querySelector('input[name="quizChartTypeRadio"]:checked');
    const selectedChartType = selectedChartRadio ? selectedChartRadio.value : (this.chartType || 'bar');
    this.chartType = selectedChartType;
    
    const quizData = {
      question: question,
      options: options,
      quizType: quizType, // 'single', 'multiple', 或 'matching'
      chartType: selectedChartType,
      startTime: Date.now(),
      active: true
    };

    if (quizType === 'matching') {
      quizData.pairs = extraData.pairs || [];
      quizData.matchOptions = extraData.matchOptions || (extraData.pairs ? extraData.pairs.map(p => p.right) : []);
      quizData.correctAnswer = extraData.correctAnswer || (extraData.pairs ? extraData.pairs.reduce((acc, p) => { acc[p.left] = p.right; return acc; }, {}) : {});
    } else if (Array.isArray(extraData.correctOptions) && extraData.correctOptions.length > 0) {
      quizData.correctOptions = extraData.correctOptions;
    }
    
    try {
      // 先關閉舊題，清除答案後才開放新題，避免作答遭後續清除。
      await this.quizRef.update({ active: false });
      await this.answersRef.remove();
      await this.quizRef.set(quizData);
    } catch (error) {
      window.app?.showNotification('出題失敗', '請確認教師授權及資料庫連線後重試。');
      return;
    }

    this.saveToHistoryBank(question, options, quizType, extraData);

    // 發起測驗後自動切換至前台「選擇題測驗」畫面，供投影與控場
    if (window.app && typeof window.app.switchToTab === 'function') {
      window.app.switchToTab('panel-quiz');
    }
  }

  // 儲存至歷次題目庫 (防重覆)
  saveToHistoryBank(question, options, quizType, extraData = {}) {
    if (!question || !this.historyRef) return;

    // 防呆：自動化測試環境下不寫入正式雲端題庫，防止測試題目污染題庫
    if (typeof window !== 'undefined' && window.navigator && window.navigator.webdriver && !window.__ALLOW_TEST_HISTORY_WRITE__) {
      return;
    }

    const cleanQ = String(question).trim();
    const cleanOpts = Array.isArray(options) ? options.map(o => typeof o === 'object' ? (o.text || '') : String(o)) : [];

    const keys = Object.keys(this.historyBank || {});
    const exists = keys.some(k => {
      const item = this.historyBank[k];
      if (!item) return false;
      const itemQ = String(item.question || '').trim();
      const itemOpts = Array.isArray(item.options) ? item.options.map(o => typeof o === 'object' ? (o.text || '') : String(o)) : [];
      return itemQ === cleanQ && JSON.stringify(itemOpts) === JSON.stringify(cleanOpts);
    });

    if (!exists) {
      const historyItem = {
        question: question,
        options: options,
        quizType: quizType || 'single',
        createdAt: Date.now(),
        order: keys.length
      };
      if (quizType === 'matching') {
        historyItem.pairs = extraData.pairs || [];
        historyItem.matchOptions = extraData.matchOptions || (extraData.pairs ? extraData.pairs.map(p => p.right) : []);
        historyItem.correctAnswer = extraData.correctAnswer || {};
      } else if (Array.isArray(extraData.correctOptions) && extraData.correctOptions.length > 0) {
        historyItem.correctOptions = extraData.correctOptions;
      }
      this.historyRef.push(historyItem);
    }
  }
  
  async submitAnswer(answerData) {
    if (!this.currentQuiz || !this.currentQuiz.active) return false;
    
    let userId = window.boardTarget?.mode === 'secure'
      ? window.firebaseAuth?.currentUser?.uid
      : ((window.app && window.app.userId) || window.boardStorage.local.getItem('quiz_user_id'));
    if (!userId && window.boardTarget?.mode !== 'secure') {
      userId = 'user_' + Math.random().toString(36).slice(2, 11);
      window.boardStorage.local.setItem('quiz_user_id', userId);
    }
    if (!userId) {
      if (window.app) window.app.showNotification('無法作答', '請確認已完成登入後重新整理。');
      return false;
    }

    const answerRef = this.answersRef.child(userId);
    try {
      const result = await answerRef.transaction(current => current === null ? answerData : undefined);
      if (window.app) {
        window.app.showNotification(result.committed ? '成功' : '提示',
          result.committed ? '作答已送出！' : '您已經作答過了！');
      }
      return result.committed;
    } catch (error) {
      if (window.app) window.app.showNotification('作答失敗', '請確認連線及班級作答權限後重試。');
      return false;
    }
  }

  submitMultipleAnswers() {
    if (!this.currentQuiz || !this.currentQuiz.active || this.currentQuiz.quizType !== 'multiple') return;
    
    const checkedBoxes = document.querySelectorAll('.quiz-multiple-checkbox:checked');
    if (checkedBoxes.length === 0) {
      if (window.app) window.app.showNotification('提示', '請至少勾選一個選項');
      return;
    }

    const selectedIndices = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
    this.submitAnswer(selectedIndices);
  }

  // 學生端提交連連看配對答案
  async submitMatchingAnswer() {
    if (!this.currentQuiz || !this.currentQuiz.active || this.currentQuiz.quizType !== 'matching') return;
    const boardContainer = document.getElementById('quizMatchingBoardContainer');
    if (!boardContainer || !window.MatchingQuizEngine) return;

    const connections = window.MatchingQuizEngine.getConnections(boardContainer);
    if (!connections || Object.keys(connections).length === 0) {
      if (window.app) window.app.showNotification('提示', '請先進行連線配對再提交答案！');
      return;
    }

    const submitBtn = document.querySelector('.submit-matching-btn');
    if (submitBtn) submitBtn.disabled = true;
    const submitted = await this.submitAnswer(connections);
    if (submitBtn) {
      submitBtn.disabled = submitted;
      if (submitted) {
        submitBtn.style.opacity = '0.6';
        submitBtn.innerText = '✅ 已提交連線答案';
      }
    }
    if (submitted && this.currentQuiz?.correctAnswer && window.MatchingQuizEngine.renderResults) {
      window.MatchingQuizEngine.renderResults(boardContainer, connections, this.currentQuiz.correctAnswer, { showAnswers: true });
    }
  }

  // 老師端題型 Radio 切換處理 (單選 / 複選 / 配對連連看)
  handleQuizTypeChange(type) {
    const container = document.getElementById('optionsContainer');
    if (!container) return;

    if (type === 'matching') {
      container.innerHTML = `
        <div class="option-matching-pair">
          <div class="option-matching-item matching-left-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-left-field" placeholder="左側題目 1 (例如：守株待兔)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <span class="matching-pair-link-icon">🔗</span>
          <div class="option-matching-item matching-right-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-right-field" placeholder="右側答案 1 (例如：妄想不勞而獲)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
        </div>
        <div class="option-matching-pair">
          <div class="option-matching-item matching-left-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-left-field" placeholder="左側題目 2 (例如：臥薪嚐膽)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <span class="matching-pair-link-icon">🔗</span>
          <div class="option-matching-item matching-right-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-right-field" placeholder="右側答案 2 (例如：刻苦自勵)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
        </div>
        <div class="option-matching-pair">
          <div class="option-matching-item matching-left-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-left-field" placeholder="左側題目 3 (例如：水落石出)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <span class="matching-pair-link-icon">🔗</span>
          <div class="option-matching-item matching-right-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-right-field" placeholder="右側答案 3 (例如：真相大白)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
        </div>
      `;
    } else {
      if (container.querySelector('.option-matching-pair')) {
        container.innerHTML = `
          <div class="option-input" data-type="text" data-correct="false">
            <span class="option-label">1</span>
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片選項">📝 文字</button>
            <button type="button" class="option-correct-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionCorrect(this)" title="點擊標記此選項為正確答案（若為純投票可不勾選）">⬜ 正解</button>
            <input type="text" class="option-field" placeholder="選項 1 文字內容">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
            <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
          </div>
          <div class="option-input" data-type="text" data-correct="false">
            <span class="option-label">2</span>
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片選項">📝 文字</button>
            <button type="button" class="option-correct-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionCorrect(this)" title="點擊標記此選項為正確答案（若為純投票可不勾選）">⬜ 正解</button>
            <input type="text" class="option-field" placeholder="選項 2 文字內容">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
            <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
          </div>
        `;
      } else if (quizType === 'single') {
        // 切換回單選題時，若原本複選勾了多個正解，僅保留第一個正解
        let foundFirst = false;
        container.querySelectorAll('.option-input').forEach(el => {
          if (el.getAttribute('data-correct') === 'true') {
            if (!foundFirst) {
              foundFirst = true;
            } else {
              el.setAttribute('data-correct', 'false');
              const b = el.querySelector('.option-correct-toggle-btn');
              if (b) {
                b.classList.remove('is-correct');
                b.innerHTML = '⬜ 正解';
              }
            }
          }
        });
      }
    }
  }

  // 切換選項是否為「正解」（單選題最多勾選 1 個，複選題可勾選多個；若皆不勾選則作為純投票）
  toggleOptionCorrect(btn) {
    if (!btn) return;
    const row = btn.closest('.option-input');
    if (!row) return;
    const quizType = document.querySelector('input[name="quizTypeRadio"]:checked')?.value || 'single';
    const isCurrentlyCorrect = row.getAttribute('data-correct') === 'true';

    if (quizType === 'single' && !isCurrentlyCorrect) {
      const container = row.closest('#optionsContainer') || document;
      container.querySelectorAll('.option-input').forEach(el => {
        el.setAttribute('data-correct', 'false');
        const b = el.querySelector('.option-correct-toggle-btn');
        if (b) {
          b.classList.remove('is-correct');
          b.innerHTML = '⬜ 正解';
        }
      });
    }

    const nextState = !isCurrentlyCorrect;
    row.setAttribute('data-correct', nextState ? 'true' : 'false');
    btn.classList.toggle('is-correct', nextState);
    btn.innerHTML = nextState ? '✅ 正解' : '⬜ 正解';
  }
  
  async endQuiz() {
    if (!window.app?.isAdmin) {
      window.app?.showNotification('權限不足', '只有獲授權的教師可以結束測驗。');
      return;
    }
    if (!this.currentQuiz) return;
    try {
      await this.quizRef.update({ active: false });
    } catch (error) {
      window.app?.showNotification('結束測驗失敗', '請確認教師授權及資料庫連線後重試。');
    }
  }
  
  // 題目內容渲染器 (支援純文字或豐富 HTML，並確保圖片/影片安全居中展示)
  renderQuestionContent(question) {
    if (!question) return '';
    const hasTags = /<[a-z][\s\S]*>/i.test(question);
    if (!hasTags) {
      return `<div class="quiz-question-rendered">${this.escapeHtml(question)}</div>`;
    }
    // 簡單清理潛在危險的 script 標籤
    const cleaned = String(question).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    return `<div class="quiz-question-rendered">${cleaned}</div>`;
  }

  // 選項文字/圖片標籤渲染
  getOptionLabel(opt, defaultText = '') {
    if (!opt) return defaultText;
    if (typeof opt === 'string') return opt;
    if (typeof opt === 'object') {
      return opt.text || (opt.image ? '【圖片選項】' : defaultText);
    }
    return String(opt);
  }

  // 學生端選項按鈕內容渲染 (包含圖片與文字)
  renderOptionButtonHtml(opt, index) {
    if (typeof opt === 'object' && opt !== null && opt.image) {
      return `
        <div class="answer-option-img-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
          <img src="${opt.image}" class="answer-option-img" alt="選項 ${index + 1}">
          ${opt.text ? `<span style="font-size: 14px; font-weight: bold;">${this.escapeHtml(opt.text)}</span>` : ''}
        </div>
      `;
    }
    const text = typeof opt === 'object' ? (opt.text || '') : String(opt);
    return `<span>${this.escapeHtml(text)}</span>`;
  }

  updateUI() {
    const quizStatus = document.getElementById('quizStatus');
    const quizForm = document.getElementById('quizForm');
    const answerOptions = document.getElementById('answerOptions');
    const endQuizBtn = document.getElementById('endQuizBtn');
    const idleNotice = document.getElementById('quizStudentIdleNotice');
    const adminLink = document.getElementById('quizAdminQuickLinkWrapper');
    const isAdmin = !!(window.app && window.app.isAdmin);
    if (adminLink) {
      adminLink.style.display = isAdmin ? 'block' : 'none';
    }
    
    if (this.currentQuiz && this.currentQuiz.active) {
      if (idleNotice) idleNotice.style.display = 'none';
      const isMultiple = this.currentQuiz.quizType === 'multiple';
      const isMatching = this.currentQuiz.quizType === 'matching';
      const badgeText = isMatching ? '🔗 配對題 (連連看)' : (isMultiple ? '☑️ 複選題' : '🔘 單選題');
      const badgeColor = isMatching ? '#5856d6' : 'var(--accent-color)';
      const badgeBg = isMatching ? 'rgba(88,86,214,0.1)' : 'rgba(0,122,255,0.1)';

      if (quizStatus) {
        quizStatus.innerHTML = `
          <div class="quiz-status">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 14px; font-weight: bold; color: ${badgeColor};">📝 測驗進行中</span>
              <span class="quiz-type-badge" style="background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">${badgeText}</span>
            </div>
            ${this.renderQuestionContent(this.currentQuiz.question)}
          </div>
        `;
      }
      if (quizForm) quizForm.style.display = 'none';
      if (endQuizBtn) endQuizBtn.style.display = 'block';
      const activeActionRow = document.getElementById('quizActiveActionRow');
      if (activeActionRow) activeActionRow.style.display = 'flex';
      
      // 顯示答題選項
      if (answerOptions) {
        answerOptions.style.display = 'block';
        const quizOpts = Array.isArray(this.currentQuiz.options) ? this.currentQuiz.options : [];
        if (isMatching) {
          answerOptions.innerHTML = `
            <div id="quizMatchingBoardContainer" style="margin-top: 14px;"></div>
            <button class="submit-matching-btn" onclick="window.quiz.submitMatchingAnswer()" style="margin-top: 12px; width: 100%; padding: 12px; background: #5856d6; color: white; font-size: 16px; font-weight: bold; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(88,86,214,0.3);">
              🔗 提交連線答案
            </button>
          `;
          if (window.MatchingQuizEngine) {
            const pairs = this.currentQuiz.pairs || (this.currentQuiz.options || []).map((opt, i) => ({
              left: typeof opt === 'object' ? opt.text : opt,
              right: this.currentQuiz.matchOptions?.[i] || ''
            }));
            const leftItems = (this.currentQuiz.options || []).map(opt => typeof opt === 'object' ? opt.text : opt);
            const rightItems = this.currentQuiz.matchOptions || pairs.map(p => p.right);
            window.MatchingQuizEngine.createBoard(document.getElementById('quizMatchingBoardContainer'), {
              id: 'quiz_matching_live',
              pairs,
              leftItems,
              rightItems,
              solution: this.currentQuiz.correctAnswer || null
            });
          }
        } else if (isMultiple) {
          answerOptions.innerHTML = `
            <div class="answer-options-container multiple-choice-container" style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
              ${quizOpts.map((opt, i) => {
                const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
                return `
                  <label class="answer-option-multiple ${isImg ? 'option-has-img' : ''}" style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 12px; cursor: pointer; user-select: none; transition: all 0.2s ease;">
                    <input type="checkbox" class="quiz-multiple-checkbox" value="${i}" style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--accent-color); flex-shrink: 0;">
                    <div style="flex: 1; text-align: ${isImg ? 'center' : 'left'};">
                      ${this.renderOptionButtonHtml(opt, i)}
                    </div>
                  </label>
                `;
              }).join('')}
              <button class="submit-multiple-btn" onclick="window.quiz.submitMultipleAnswers()" style="margin-top: 10px; width: 100%; padding: 12px; background: var(--accent-color); color: white; font-size: 16px; font-weight: bold; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,122,255,0.3);">
                ☑️ 提交答案
              </button>
            </div>
          `;
        } else {
          answerOptions.innerHTML = `
            <div class="answer-options-container">
              ${quizOpts.map((opt, i) => {
                const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
                return `
                  <button class="answer-option ${isImg ? 'option-has-img' : ''}" onclick="window.quiz.submitAnswer(${i})">
                    ${this.renderOptionButtonHtml(opt, i)}
                  </button>
                `;
              }).join('')}
            </div>
          `;
        }
      }
    } else if (this.currentQuiz && !this.currentQuiz.active) {
      if (idleNotice) idleNotice.style.display = 'none';
      const isMultiple = this.currentQuiz.quizType === 'multiple';
      const isMatching = this.currentQuiz.quizType === 'matching';
      const badgeText = isMatching ? '🔗 配對題 (連連看)' : (isMultiple ? '☑️ 複選題' : '🔘 單選題');
      const badgeColor = isMatching ? '#5856d6' : 'var(--accent-color)';
      const badgeBg = isMatching ? 'rgba(88,86,214,0.1)' : 'rgba(0,122,255,0.1)';

      if (quizStatus) {
        quizStatus.innerHTML = `
          <div class="quiz-status">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 14px; font-weight: bold; color: var(--text-muted);">⏹️ 測驗已結束</span>
              <span class="quiz-type-badge" style="background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">${badgeText}</span>
            </div>
            ${this.renderQuestionContent(this.currentQuiz.question || '')}
          </div>
        `;
      }
      if (quizForm) quizForm.style.display = 'block';
      if (endQuizBtn) endQuizBtn.style.display = 'none';
      const activeActionRow = document.getElementById('quizActiveActionRow');
      if (activeActionRow) activeActionRow.style.display = 'none';
      if (answerOptions) {
        answerOptions.style.display = 'none';
        answerOptions.innerHTML = '';
      }
      this.showFinalResults();
    } else {
      this.clearQuizResults();
    }
  }

  // 清除學生端與後台測驗結果及答題介面，回復至「目前沒有進行中的測驗」
  clearQuizResults() {
    const quizStatus = document.getElementById('quizStatus');
    const quizForm = document.getElementById('quizForm');
    const answerOptions = document.getElementById('answerOptions');
    const endQuizBtn = document.getElementById('endQuizBtn');
    const resultsContainer = document.getElementById('quizResults');
    const idleNotice = document.getElementById('quizStudentIdleNotice');
    const adminLink = document.getElementById('quizAdminQuickLinkWrapper');
    const isAdmin = !!(window.app && window.app.isAdmin);

    if (idleNotice) idleNotice.style.display = 'block';
    if (adminLink) adminLink.style.display = isAdmin ? 'block' : 'none';
    if (quizStatus) quizStatus.innerHTML = '';
    if (quizForm) quizForm.style.display = 'block';
    if (endQuizBtn) endQuizBtn.style.display = 'none';
    const activeActionRow = document.getElementById('quizActiveActionRow');
    if (activeActionRow) activeActionRow.style.display = 'none';
    if (answerOptions) {
      answerOptions.style.display = 'none';
      answerOptions.innerHTML = '';
    }
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }

  setAdminState(isAdmin) {
    const adminLink = document.getElementById('quizAdminQuickLinkWrapper');
    if (adminLink) adminLink.style.display = isAdmin ? 'block' : 'none';
  }
  
  renderResultsVisualization(items, totalVoters, isFinal = false, quizType = 'single') {
    const chartType = this.chartType || this.currentQuiz?.chartType || 'bar';
    const totalVotesSum = items.reduce((sum, it) => sum + (it.count || 0), 0);
    const CHART_COLORS = ['#007aff', '#34c759', '#ff9500', '#ff2d55', '#5856d6', '#af52de', '#00c7be', '#ffcc00', '#5ac8fa', '#ff3b30'];

    // 頂部狀態與即時圖表切換工具列
    let html = `
      <div style="padding: 10px 14px; background: var(--bg-input); border-radius: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-weight: bold; color: var(--text-primary); font-size: 14px; display: flex; align-items: center; gap: 6px;">
            <span>${isFinal ? '🏆 最終結果' : '📊 即時作答統計'}</span>
            <span style="font-size: 12px; font-weight: normal; color: var(--text-secondary);">(${quizType === 'matching' ? '配對題' : (quizType === 'multiple' ? '複選題' : '單選題')})</span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
            總計 ${totalVoters} 人作答${totalVotesSum !== totalVoters && totalVotesSum > 0 ? ` (累計得票 ${totalVotesSum} 票)` : ''}
          </div>
        </div>
        <div style="display: inline-flex; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 2px; gap: 2px; align-items: center;">
          <button type="button" onclick="window.quiz && window.quiz.setChartType('bar')" title="長條圖" style="padding: 4px 10px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; transition: all 0.2s; background: ${chartType === 'bar' ? 'var(--accent-color)' : 'transparent'}; color: ${chartType === 'bar' ? '#fff' : 'var(--text-secondary)'};">📊 長條圖</button>
          <button type="button" onclick="window.quiz && window.quiz.setChartType('pie')" title="圓餅圖" style="padding: 4px 10px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; transition: all 0.2s; background: ${chartType === 'pie' ? '#ff9500' : 'transparent'}; color: ${chartType === 'pie' ? '#fff' : 'var(--text-secondary)'};">🥧 圓餅圖</button>
          <button type="button" onclick="window.quiz && window.quiz.setChartType('line')" title="折線圖" style="padding: 4px 10px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; transition: all 0.2s; background: ${chartType === 'line' ? '#34c759' : 'transparent'}; color: ${chartType === 'line' ? '#fff' : 'var(--text-secondary)'};">📈 折線圖</button>
        </div>
      </div>
    `;

    if (totalVoters === 0) {
      html += `<div style="color: var(--text-muted); text-align: center; font-size: 13px; padding: 20px 0;">尚無人作答</div>`;
      return html;
    }

    if (chartType === 'pie') {
      // 🥧 圓餅圖 / 環形圖 (SVG + 圖例)
      const CX = 90, CY = 90, R = 75, r = 38;
      let currentAngle = -Math.PI / 2;
      let slicesSvg = '';

      if (totalVotesSum === 0) {
        slicesSvg = `<circle cx="${CX}" cy="${CY}" r="${(R + r) / 2}" fill="none" stroke="var(--border-color)" stroke-width="${R - r}" stroke-dasharray="4,4" />`;
      } else {
        const singleWinner = items.find(it => it.count === totalVotesSum);
        if (singleWinner) {
          const color = CHART_COLORS[items.indexOf(singleWinner) % CHART_COLORS.length];
          slicesSvg = `<circle cx="${CX}" cy="${CY}" r="${(R + r) / 2}" fill="none" stroke="${color}" stroke-width="${R - r}" />`;
        } else {
          items.forEach((it, idx) => {
            if (it.count <= 0) return;
            const sliceAngle = (it.count / totalVotesSum) * 2 * Math.PI;
            const nextAngle = currentAngle + sliceAngle;
            const x1 = CX + R * Math.cos(currentAngle);
            const y1 = CY + R * Math.sin(currentAngle);
            const x2 = CX + R * Math.cos(nextAngle);
            const y2 = CY + R * Math.sin(nextAngle);
            const x3 = CX + r * Math.cos(nextAngle);
            const y3 = CY + r * Math.sin(nextAngle);
            const x4 = CX + r * Math.cos(currentAngle);
            const y4 = CY + r * Math.sin(currentAngle);
            const largeArc = sliceAngle > Math.PI ? 1 : 0;
            const color = CHART_COLORS[idx % CHART_COLORS.length];
            const d = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${r} ${r} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
            slicesSvg += `<path d="${d}" fill="${color}" stroke="var(--bg-card)" stroke-width="2"><title>${this.escapeHtml(it.label)}: ${it.count}票 (${Math.round((it.count / totalVotesSum) * 100)}%)</title></path>`;
            currentAngle = nextAngle;
          });
        }
      }

      html += `
        <div style="display: flex; gap: 20px; align-items: center; justify-content: center; flex-wrap: wrap; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px;">
          <div style="flex-shrink: 0; width: 180px; height: 180px;">
            <svg viewBox="0 0 180 180" width="180" height="180" style="overflow: visible; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));">
              ${slicesSvg}
              <text x="${CX}" y="${CY - 4}" text-anchor="middle" font-size="16" font-weight="bold" fill="var(--text-primary)">${totalVoters}</text>
              <text x="${CX}" y="${CY + 14}" text-anchor="middle" font-size="11" fill="var(--text-secondary)">人作答</text>
            </svg>
          </div>
          <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 8px;">
            ${items.map((it, idx) => {
              const color = CHART_COLORS[idx % CHART_COLORS.length];
              const pct = totalVotesSum > 0 ? Math.round((it.count / totalVotesSum) * 100) : 0;
              return `
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; gap: 8px; padding: 4px 6px; border-radius: 6px; background: rgba(0,0,0,0.02);">
                  <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; background: ${color}; flex-shrink: 0;"></span>
                    ${it.isImg ? `<img src="${it.image}" style="width: 22px; height: 22px; border-radius: 4px; object-fit: cover; flex-shrink: 0;">` : ''}
                    <span style="font-weight: 500; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${this.escapeHtml(it.label)}">${this.escapeHtml(it.label)}</span>
                  </div>
                  <span style="font-weight: bold; color: var(--text-secondary); white-space: nowrap; font-size: 12px;">${it.count} 人 (${pct}%)</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (chartType === 'line') {
      // 📈 折線圖 (SVG 面積折線圖 - 調整比例與文字樣式，與長條圖文字尺寸一致)
      const W = 860, H = 220;
      const ml = 45, mr = 35, mt = 28, mb = 40;
      const plotW = W - ml - mr;
      const plotH = H - mt - mb;
      const maxVal = Math.max(...items.map(it => it.count), 1);
      const stepX = items.length > 1 ? plotW / (items.length - 1) : plotW / 2;

      const pts = items.map((it, idx) => {
        const x = items.length === 1 ? ml + plotW / 2 : ml + idx * stepX;
        const y = mt + plotH - (it.count / maxVal) * plotH;
        return { x, y, it, idx };
      });

      const polyPoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      const areaPoints = `${pts[0].x.toFixed(1)},${(mt + plotH).toFixed(1)} ${polyPoints} ${pts[pts.length - 1].x.toFixed(1)},${(mt + plotH).toFixed(1)}`;

      html += `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px 18px; overflow-x: auto;">
          <div style="max-width: 860px; margin: 0 auto; width: 100%;">
            <svg viewBox="0 0 ${W} ${H}" style="width: 100%; height: auto; max-height: 240px; display: block; overflow: visible; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans TC', sans-serif;">
              <defs>
                <linearGradient id="quizLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#34c759" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#34c759" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <!-- 橫向網格線與 Y 軸標籤 -->
              <line x1="${ml}" y1="${mt}" x2="${ml + plotW}" y2="${mt}" stroke="var(--border-color)" stroke-dasharray="3,3" opacity="0.6"/>
              <text x="${ml - 8}" y="${mt + 4}" text-anchor="end" font-size="12" fill="var(--text-secondary)">${maxVal}</text>

              <line x1="${ml}" y1="${mt + plotH / 2}" x2="${ml + plotW}" y2="${mt + plotH / 2}" stroke="var(--border-color)" stroke-dasharray="3,3" opacity="0.4"/>
              <text x="${ml - 8}" y="${mt + plotH / 2 + 4}" text-anchor="end" font-size="12" fill="var(--text-secondary)">${Math.round(maxVal / 2)}</text>

              <line x1="${ml}" y1="${mt + plotH}" x2="${ml + plotW}" y2="${mt + plotH}" stroke="var(--border-color)" opacity="0.8"/>
              <text x="${ml - 8}" y="${mt + plotH + 4}" text-anchor="end" font-size="12" fill="var(--text-secondary)">0</text>

              <!-- 漸層面積與折線 -->
              <polygon points="${areaPoints}" fill="url(#quizLineGrad)"/>
              <polyline points="${polyPoints}" fill="none" stroke="#34c759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

              <!-- 數據點與標籤 (字型大小調整為 13px/14px，與長條圖保持一致) -->
              ${pts.map(p => {
                const pct = totalVotesSum > 0 ? Math.round((p.it.count / totalVotesSum) * 100) : 0;
                const shortLabel = p.it.label.length > 10 ? p.it.label.substring(0, 9) + '…' : p.it.label;
                return `
                  <g>
                    <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#ffffff" stroke="#34c759" stroke-width="2.5"/>
                    <text x="${p.x.toFixed(1)}" y="${(p.y - 8).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="bold" fill="var(--text-primary)">
                      ${p.it.count} (${pct}%)
                    </text>
                    <text x="${p.x.toFixed(1)}" y="${(mt + plotH + 20).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="500" fill="var(--text-primary)">
                      ${this.escapeHtml(shortLabel)}
                    </text>
                  </g>
                `;
              }).join('')}
            </svg>
          </div>
        </div>
      `;
    } else {
      // 📊 長條圖 (預設)
      const correctOpts = Array.isArray(this.currentQuiz?.correctOptions) ? this.currentQuiz.correctOptions : [];
      const isTeacher = !!(window.app && window.app.isAdmin);
      html += `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${items.map((it, idx) => {
            const isImg = it.isImg;
            const pct = totalVoters > 0 ? (it.count / totalVoters * 100) : 0;
            const displayPct = Math.round(pct);
            const color = it.color || CHART_COLORS[idx % CHART_COLORS.length];
            const isCorrectOpt = correctOpts.includes(idx);
            const showCorrectBadge = isCorrectOpt && (isFinal || isTeacher);
            return `
              <div class="result-bar" style="align-items: center; margin-bottom: 4px; gap: 8px;">
                <div class="result-label" style="display: flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0; width: auto;" title="${this.escapeHtml(it.label)}">
                  ${isImg ? `<img src="${it.image}" style="width: 28px; height: 28px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">` : ''}
                  <span>${this.escapeHtml(it.label)}</span>
                  ${showCorrectBadge ? `<span style="color: #10b981; font-weight: bold; font-size: 14px;" title="標準答案">✅ 正解</span>` : ''}
                </div>
                <div class="result-progress" style="flex: 1;">
                  <div class="result-fill" style="width: ${pct}%; background: ${color};">
                    ${it.count} (${displayPct}%)
                  </div>
                </div>
                ${isTeacher && quizType !== 'matching' ? `
                  <button type="button" class="presentation-tool-btn" onclick="window.app && window.app.rewardChoiceQuizOption(${idx})" style="padding: 2px 10px; height: 28px; font-size: 14px; border-radius: 6px; flex-shrink: 0;" title="依目前計分模式（個人／小組），一鍵獎勵選擇此選項的同學">
                    ⭐ 加分
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (window.app && window.app.isAdmin) {
      const hasPreCorrect = Array.isArray(this.currentQuiz?.correctOptions) && this.currentQuiz.correctOptions.length > 0;
      const mode = window.app.activityScoringConfig?.mode || 'individual';
      const pts = window.app.activityScoringConfig?.pointsPerReward || 1;
      const modeName = mode === 'group' ? '👥 小組計分' : (mode === 'both' ? '🌟 個人＋小組同步' : '👤 個人計分');
      html += `
        <div style="margin-top: 12px; padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 14px; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span>🎯 目前計分模式：<strong style="color: var(--accent-color);">${modeName}（每次 +${pts} 點）</strong></span>
            ${hasPreCorrect ? `<span style="color: #10b981; font-weight: bold;">（已設定正解：選項 ${this.currentQuiz.correctOptions.map(i => i + 1).join('、')}）</span>` : `<span style="color: var(--text-muted);">（未預設正解，可直接點擊上方各選項右側「⭐ 加分」或下方全體獎勵）</span>`}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="presentation-tool-btn success" onclick="window.app && window.app.rewardChoiceQuizBatch('option')" style="font-size: 14px; padding: 4px 12px; height: 32px; border-radius: 8px;">
              🎁 ${hasPreCorrect || quizType === 'matching' ? '獎勵答對同學/小組' : '指定選項加分'}
            </button>
            <button type="button" class="presentation-tool-btn" onclick="window.app && window.app.rewardChoiceQuizBatch('all')" style="font-size: 14px; padding: 4px 12px; height: 32px; border-radius: 8px;">
              🎁 獎勵全體投票作答
            </button>
          </div>
        </div>
      `;
    }

    return html;
  }
  
  updateResults(answers) {
    this.currentAnswers = answers || {};
    const resultsContainer = document.getElementById('quizResults');
    if (!resultsContainer) return;
    if (!this.currentQuiz) {
      resultsContainer.innerHTML = '';
      return;
    }
    if (!this.currentQuiz.active) return;

    const totalVoters = Object.keys(this.currentAnswers).length;

    if (this.currentQuiz.quizType === 'matching') {
      const pairs = this.currentQuiz.pairs || (this.currentQuiz.options || []).map((opt, i) => ({
        left: typeof opt === 'object' ? opt.text : opt,
        right: this.currentQuiz.matchOptions?.[i] || ''
      }));

      const items = pairs.map((p) => {
        let count = 0;
        Object.values(this.currentAnswers).forEach(ans => {
          if (ans && typeof ans === 'object' && ans[p.left] === p.right) {
            count++;
          }
        });
        return {
          label: `${p.left} 🔗 ${p.right}`,
          count: count,
          isImg: false
        };
      });

      resultsContainer.innerHTML = this.renderResultsVisualization(items, totalVoters, false, 'matching');
      return;
    }
    
    const quizOpts = Array.isArray(this.currentQuiz.options) ? this.currentQuiz.options : [];
    const optionCount = quizOpts.length;
    if (optionCount === 0) return;
    const counts = new Array(optionCount).fill(0);
    
    Object.values(this.currentAnswers).forEach(answer => {
      if (Array.isArray(answer)) {
        answer.forEach(idx => {
          if (idx >= 0 && idx < optionCount) counts[idx]++;
        });
      } else if (typeof answer === 'number' && answer >= 0 && answer < optionCount) {
        counts[answer]++;
      }
    });

    const items = quizOpts.map((opt, i) => {
      const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
      const optText = this.getOptionLabel(opt, `選項 ${i + 1}`);
      return {
        label: optText,
        count: counts[i],
        isImg: isImg,
        image: isImg ? opt.image : null
      };
    });

    resultsContainer.innerHTML = this.renderResultsVisualization(items, totalVoters, false, this.currentQuiz.quizType || 'single');
  }
  
  showFinalResults() {
    const resultsContainer = document.getElementById('quizResults');
    if (!resultsContainer) return;
    if (!this.currentQuiz) {
      resultsContainer.innerHTML = '';
      return;
    }
    
    this.answersRef.once('value', (snapshot) => {
      if (!this.currentQuiz) {
        resultsContainer.innerHTML = '';
        return;
      }
      this.currentAnswers = snapshot.val() || {};
      const totalVoters = Object.keys(this.currentAnswers).length;

      if (this.currentQuiz.quizType === 'matching') {
        const pairs = this.currentQuiz.pairs || (this.currentQuiz.options || []).map((opt, i) => ({
          left: typeof opt === 'object' ? opt.text : opt,
          right: this.currentQuiz.matchOptions?.[i] || ''
        }));
        const items = pairs.map((p) => {
          let count = 0;
          Object.values(this.currentAnswers).forEach(ans => {
            if (ans && typeof ans === 'object' && ans[p.left] === p.right) {
              count++;
            }
          });
          return {
            label: `✅ ${p.left} 🔗 ${p.right}`,
            count: count,
            isImg: false
          };
        });

        resultsContainer.innerHTML = this.renderResultsVisualization(items, totalVoters, true, 'matching');
        return;
      }

      const quizOpts = (this.currentQuiz && Array.isArray(this.currentQuiz.options)) ? this.currentQuiz.options : [];
      const optionCount = quizOpts.length;
      if (optionCount === 0) {
        resultsContainer.innerHTML = '';
        return;
      }
      const counts = new Array(optionCount).fill(0);
      
      Object.values(this.currentAnswers).forEach(answer => {
        if (Array.isArray(answer)) {
          answer.forEach(idx => {
            if (idx >= 0 && idx < optionCount) counts[idx]++;
          });
        } else if (typeof answer === 'number' && answer >= 0 && answer < optionCount) {
          counts[answer]++;
        }
      });

      const items = quizOpts.map((opt, i) => {
        const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
        const optText = this.getOptionLabel(opt, `選項 ${i + 1}`);
        return {
          label: optText,
          count: counts[i],
          isImg: isImg,
          image: isImg ? opt.image : null
        };
      });

      resultsContainer.innerHTML = this.renderResultsVisualization(items, totalVoters, true, this.currentQuiz.quizType || 'single');
    });
  }

  // 渲染歷次題目庫 UI
  renderQuizHistoryUI() {
    const listContainer = document.getElementById('quizHistoryList');
    const countSpan = document.getElementById('quizHistoryCount');
    if (!listContainer) return;

    const keys = Object.keys(this.historyBank);
    if (countSpan) countSpan.textContent = `(${keys.length} 題)`;

    if (keys.length === 0) {
      listContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-size: 12px; padding: 12px;">目前歷史題庫空白（發起或匯入題目後會自動保存）</div>';
      return;
    }

    // 按 order 順序排序，若無 order 則依建立時間排序
    const sortedKeys = keys.sort((a, b) => {
      const itemA = this.historyBank[a];
      const itemB = this.historyBank[b];
      const orderA = typeof itemA.order === 'number' ? itemA.order : null;
      const orderB = typeof itemB.order === 'number' ? itemB.order : null;
      if (orderA !== null && orderB !== null) {
        return orderA - orderB;
      }
      if (orderA !== null) return -1;
      if (orderB !== null) return 1;
      return (itemB.createdAt || 0) - (itemA.createdAt || 0);
    });

    listContainer.innerHTML = sortedKeys.map(key => {
      const q = this.historyBank[key];
      const isMultiple = q.quizType === 'multiple';
      const isMatching = q.quizType === 'matching';
      const badgeText = isMatching ? '🔗 配對' : (isMultiple ? '☑️ 複選' : '🔘 單選');
      const badgeBg = isMatching ? 'rgba(88,86,214,0.1)' : 'rgba(0,122,255,0.1)';
      const badgeColor = isMatching ? '#5856d6' : 'var(--accent-color)';

      let optionsStr = '';
      if (isMatching && q.pairs && q.pairs.length > 0) {
        optionsStr = q.pairs.map(p => `${p.left} = ${p.right}`).join(' | ');
      } else {
        optionsStr = (q.options || []).map((opt, i) => this.getOptionLabel(opt, `選項 ${i + 1}`)).join(' | ');
      }
      const questionText = (q.question || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() || (q.question || '');

      return `
        <div class="quiz-history-item draggable-quiz-history-item" draggable="true" data-history-key="${key}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; gap: 8px; cursor: grab; transition: transform 0.15s, box-shadow 0.15s;">
          <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
            <span class="drag-handle" style="cursor: grab; color: var(--text-muted); font-size: 15px; user-select: none; flex-shrink: 0;" title="按住拖曳調整題目順序">☰</span>
            <input type="checkbox" class="quiz-history-checkbox" value="${key}" style="cursor: pointer; width: 16px; height: 16px; accent-color: var(--accent-color); flex-shrink: 0;">
            <div style="display: flex; flex-direction: column; gap: 4px; overflow: hidden; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 14px; padding: 2px 8px; border-radius: 8px; font-weight: bold; flex-shrink: 0;">${badgeText}</span>
                <span style="font-weight: bold; font-size: 14px; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${this.escapeHtml(questionText)}</span>
              </div>
              <div style="font-size: 14px; color: var(--text-secondary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                選項：${this.escapeHtml(optionsStr)}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0; align-items: center;">
            <button type="button" class="presentation-tool-btn" onclick="window.app && window.app.openSingleItemCopyModal('quiz', '${key}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; font-weight: bold; color: var(--accent-color); border-color: var(--accent-color);" title="複製此題到其他班級歷次題庫">📤 複製</button>
            <button type="button" class="presentation-tool-btn active" onclick="window.quiz.loadQuizFromHistory('${key}')" style="height: 32px; padding: 0 12px; font-size: 14px; border-radius: 10px; font-weight: bold;" title="帶入此題到出題框">🚀 載入</button>
            <button type="button" class="presentation-tool-btn danger" onclick="window.quiz.deleteQuizHistoryItem('${key}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px;" title="刪除此題">✕</button>
          </div>
        </div>
      `;
    }).join('');

    this.initQuizHistoryDragAndDrop();
  }

  // 歷次題目庫卡片拖曳排序
  initQuizHistoryDragAndDrop() {
    const container = document.getElementById('quizHistoryList');
    if (!container) return;

    const cards = container.querySelectorAll('.draggable-quiz-history-item');
    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        if (['INPUT', 'BUTTON', 'SELECT', 'A', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.effectAllowed = 'move';
        card.classList.add('dragging-quiz-item');
        card.style.opacity = '0.5';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging-quiz-item');
        card.style.opacity = '1';

        const currentCards = [...container.querySelectorAll('.draggable-quiz-history-item')];
        const orderedKeys = currentCards.map(c => c.getAttribute('data-history-key')).filter(Boolean);

        const updates = {};
        orderedKeys.forEach((key, idx) => {
          if (this.historyBank[key]) {
            this.historyBank[key].order = idx;
            updates[`${key}/order`] = idx;
          }
        });

        if (this.historyRef && Object.keys(updates).length > 0) {
          this.historyRef.update(updates).catch(err => {
            console.warn('Failed to update quiz history order in Firebase', err);
          });
        }

        if (window.app) {
          window.app.showNotification('📋 排序已更新', '歷次題目庫排序已成功調整！');
        }
      });
    });

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const dragging = container.querySelector('.dragging-quiz-item');
      if (!dragging) return;

      const siblings = [...container.querySelectorAll('.draggable-quiz-history-item:not(.dragging-quiz-item)')];
      const nextSibling = siblings.find(sibling => {
        const box = sibling.getBoundingClientRect();
        return e.clientY <= box.top + box.height / 2;
      });

      if (nextSibling) {
        container.insertBefore(dragging, nextSibling);
      } else {
        container.appendChild(dragging);
      }
    });
  }

  // 切換全選 / 全不選
  toggleSelectAllHistory(isChecked) {
    const checkboxes = document.querySelectorAll('.quiz-history-checkbox');
    checkboxes.forEach(cb => cb.checked = isChecked);
  }

  // 匯出勾選的題目庫 TXT
  exportSelectedQuizBankTxt() {
    const checkedBoxes = document.querySelectorAll('.quiz-history-checkbox:checked');
    if (checkedBoxes.length === 0) {
      if (window.app) window.app.showNotification('提示', '請先勾選欲匯出的題目！');
      return;
    }

    const selectedKeys = Array.from(checkedBoxes).map(cb => cb.value);
    const questionsToExport = selectedKeys.map(k => this.historyBank[k]).filter(Boolean);

    this.downloadQuizBankTxt(questionsToExport, "selected_quiz_bank.txt");
    if (window.app) window.app.showNotification('成功', `已成功匯出 ${questionsToExport.length} 道選取題目！`);
  }

  // 匯出全部歷次題目庫 TXT
  exportAllQuizBankTxt() {
    const keys = Object.keys(this.historyBank);
    if (keys.length === 0) {
      if (window.app) window.app.showNotification('提示', '歷次題目庫目前無任何題目可匯出');
      return;
    }

    const allQuestions = keys.map(k => this.historyBank[k]);
    this.downloadQuizBankTxt(allQuestions, "all_quiz_bank.txt");
    if (window.app) window.app.showNotification('成功', `已成功匯出全部 ${allQuestions.length} 道題目！`);
  }

  // 下載 TXT 工具方法
  downloadQuizBankTxt(questions, filename) {
    const txtBlocks = questions.map(q => {
      let typeStr = '單選';
      if (q.quizType === 'matching') typeStr = '配對';
      else if (q.quizType === 'multiple') typeStr = '複選';

      let optionsText = '';
      if (q.quizType === 'matching' && q.pairs && q.pairs.length > 0) {
        optionsText = q.pairs.map(p => `${p.left} = ${p.right}`).join('\n');
      } else {
        optionsText = (q.options || []).map(opt => {
          if (typeof opt === 'object' && opt !== null) {
            return opt.text ? `${opt.text} [圖片選項]` : '[圖片選項]';
          }
          return String(opt);
        }).join('\n');
      }
      return `${q.question}\n${typeStr}\n${optionsText}`;
    });

    const txtContent = txtBlocks.join('\n\n---\n\n');
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(txtContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // 切換題目庫子頁籤 (歷次題目庫 vs 題庫管理)
  switchHistorySubTab(tab) {
    const btnHistory = document.getElementById('btnSubTabQuizHistory');
    const btnBank = document.getElementById('btnSubTabQuizBank');
    const paneHistory = document.getElementById('quizSubTabPaneHistory');
    const paneBank = document.getElementById('quizSubTabPaneBank');

    if (tab === 'history') {
      if (btnHistory) btnHistory.classList.add('active');
      if (btnBank) btnBank.classList.remove('active');
      if (paneHistory) paneHistory.style.display = 'block';
      if (paneBank) paneBank.style.display = 'none';
      this.renderQuizHistoryUI();
    } else {
      if (btnHistory) btnHistory.classList.remove('active');
      if (btnBank) btnBank.classList.add('active');
      if (paneHistory) paneHistory.style.display = 'none';
      if (paneBank) paneBank.style.display = 'block';
      this.renderQuizBankListUI();
    }
  }

  // 切換格式說明對話框頁籤 (TXT / JSON / CSV)
  switchFormatGuideTab(format) {
    const tabTxt = document.getElementById('tabQuizFormatTxt');
    const tabJson = document.getElementById('tabQuizFormatJson');
    const tabCsv = document.getElementById('tabQuizFormatCsv');
    const paneTxt = document.getElementById('quizFormatGuidePaneTxt');
    const paneJson = document.getElementById('quizFormatGuidePaneJson');
    const paneCsv = document.getElementById('quizFormatGuidePaneCsv');

    if (tabTxt) tabTxt.classList.toggle('active', format === 'txt');
    if (tabJson) tabJson.classList.toggle('active', format === 'json');
    if (tabCsv) tabCsv.classList.toggle('active', format === 'csv');

    if (paneTxt) paneTxt.style.display = format === 'txt' ? 'block' : 'none';
    if (paneJson) paneJson.style.display = format === 'json' ? 'block' : 'none';
    if (paneCsv) paneCsv.style.display = format === 'csv' ? 'block' : 'none';
  }

  // 快捷建立新測驗：捲動並聚焦至上方出題區
  openCreateNewQuiz() {
    const section = document.getElementById('quizQuestionEditor') || document.getElementById('quizQuestion');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      section.focus();
      const parent = section.closest('.panel-body') || section.parentElement;
      if (parent) {
        parent.style.transition = 'box-shadow 0.3s ease';
        parent.style.boxShadow = '0 0 0 3px var(--accent-color)';
        setTimeout(() => { parent.style.boxShadow = ''; }, 1200);
      }
    }
    if (window.app) {
      window.app.showNotification('💡 建立新測驗', '請在上方出題框輸入題目內容與選項，點選「🚀 開始測驗」！');
    }
  }

  // 題庫管理搜尋過濾
  filterBankQuestions(query) {
    this.bankSearchQuery = (query || '').trim();
    this.renderQuizBankListUI();
  }

  // 渲染題庫管理清單 (圖 1 樣式)
  renderQuizBankListUI() {
    const listContainer = document.getElementById('quizBankListContainer');
    if (!listContainer) return;

    const keys = Object.keys(this.historyBank || {});
    if (keys.length === 0) {
      listContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-size: 13px; padding: 24px; background: var(--bg-card); border-radius: 10px; border: 1px dashed var(--border-color);">目前題庫無題目。您可以點選上方「➕ 建立新測驗」出題，或點選「📥 匯入題庫」匯入題庫檔案！</div>';
      return;
    }

    const query = (this.bankSearchQuery || '').toLowerCase();

    // 依 order 排序
    const sortedKeys = keys.sort((a, b) => {
      const itemA = this.historyBank[a];
      const itemB = this.historyBank[b];
      const orderA = typeof itemA.order === 'number' ? itemA.order : null;
      const orderB = typeof itemB.order === 'number' ? itemB.order : null;
      if (orderA !== null && orderB !== null) return orderA - orderB;
      if (orderA !== null) return -1;
      if (orderB !== null) return 1;
      return (itemB.createdAt || 0) - (itemA.createdAt || 0);
    });

    const filteredKeys = sortedKeys.filter(k => {
      if (!query) return true;
      const q = this.historyBank[k];
      if (!q) return false;
      const qText = (q.question || '').toLowerCase();
      let optText = '';
      if (q.quizType === 'matching' && Array.isArray(q.pairs)) {
        optText = q.pairs.map(p => `${p.left} ${p.right}`).join(' ').toLowerCase();
      } else if (Array.isArray(q.options)) {
        optText = q.options.map(opt => typeof opt === 'object' ? (opt.text || '') : String(opt)).join(' ').toLowerCase();
      }
      return qText.includes(query) || optText.includes(query);
    });

    if (filteredKeys.length === 0) {
      listContainer.innerHTML = `<div style="color: var(--text-muted); text-align: center; font-size: 13px; padding: 18px; background: var(--bg-card); border-radius: 10px;">查無符合「${this.escapeHtml(this.bankSearchQuery)}」的題目</div>`;
      return;
    }

    listContainer.innerHTML = filteredKeys.map((key) => {
      const q = this.historyBank[key];
      const isMultiple = q.quizType === 'multiple';
      const isMatching = q.quizType === 'matching';
      const badgeText = isMatching ? '🔗 配對' : (isMultiple ? '☑️ 複選' : '🔘 單選');
      const badgeBg = isMatching ? 'rgba(88,86,214,0.1)' : 'rgba(0,122,255,0.1)';
      const badgeColor = isMatching ? '#5856d6' : 'var(--accent-color)';

      let optionsStr = '';
      if (isMatching && q.pairs && q.pairs.length > 0) {
        optionsStr = q.pairs.map(p => `${p.left} = ${p.right}`).join(' | ');
      } else {
        optionsStr = (q.options || []).map((opt, i) => this.getOptionLabel(opt, `選項 ${i + 1}`)).join(' | ');
      }
      const questionText = (q.question || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() || (q.question || '');

      return `
        <div class="quiz-history-item draggable-quiz-bank-item" draggable="true" data-history-key="${key}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: 10px; gap: 10px; cursor: grab; transition: transform 0.15s, box-shadow 0.15s;">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <span class="drag-handle" style="cursor: grab; color: var(--text-muted); font-size: 16px; user-select: none; flex-shrink: 0;" title="按住拖曳調整題目順序">☰</span>
            <div style="display: flex; flex-direction: column; gap: 4px; overflow: hidden; min-width: 0; flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 14px; padding: 2px 8px; border-radius: 8px; font-weight: bold; flex-shrink: 0;">${badgeText}</span>
                <span style="font-weight: bold; font-size: 14px; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${this.escapeHtml(questionText)}</span>
              </div>
              <div style="font-size: 14px; color: var(--text-secondary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                選項：${this.escapeHtml(optionsStr)}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0; align-items: center;">
            <button type="button" class="presentation-tool-btn active" onclick="window.quiz.loadQuizFromHistory('${key}')" style="height: 32px; padding: 0 12px; font-size: 14px; border-radius: 10px; font-weight: bold; display: flex; align-items: center; gap: 4px;" title="帶入此題到出題框">🚀 載入出題</button>
            <button type="button" class="presentation-tool-btn" onclick="window.quiz.openEditBankQuestionModal('${key}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; font-weight: bold; display: flex; align-items: center; gap: 4px;" title="直接編輯此題內容與選項">✏️ 編輯</button>
            <button type="button" class="presentation-tool-btn" onclick="window.app && window.app.openSingleItemCopyModal('quiz', '${key}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; font-weight: bold; color: var(--accent-color); border-color: var(--accent-color); display: flex; align-items: center; gap: 4px;" title="複製此題到其他班級題庫">📤 複製</button>
            <button type="button" class="presentation-tool-btn danger" onclick="window.quiz.deleteQuizHistoryItem('${key}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; display: flex; align-items: center; gap: 4px;" title="刪除此題">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    this.initQuizBankDragAndDrop();
  }

  // 題庫管理卡片拖曳排序
  initQuizBankDragAndDrop() {
    const container = document.getElementById('quizBankListContainer');
    if (!container) return;

    const cards = container.querySelectorAll('.draggable-quiz-bank-item');
    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        if (['INPUT', 'BUTTON', 'SELECT', 'A', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.effectAllowed = 'move';
        card.classList.add('dragging-bank-item');
        card.style.opacity = '0.5';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging-bank-item');
        card.style.opacity = '1';

        const currentCards = [...container.querySelectorAll('.draggable-quiz-bank-item')];
        const orderedKeys = currentCards.map(c => c.getAttribute('data-history-key')).filter(Boolean);

        const updates = {};
        orderedKeys.forEach((key, idx) => {
          if (this.historyBank[key]) {
            this.historyBank[key].order = idx;
            updates[`${key}/order`] = idx;
          }
        });

        if (this.historyRef && Object.keys(updates).length > 0) {
          this.historyRef.update(updates).catch(err => {
            console.warn('Failed to update quiz bank order in Firebase', err);
          });
        }

        if (window.app) {
          window.app.showNotification('📋 排序已更新', '題庫排序已成功調整！');
        }
      });
    });

    if (container._dragOverHandler) {
      container.removeEventListener('dragover', container._dragOverHandler);
    }

    container._dragOverHandler = (e) => {
      e.preventDefault();
      const dragging = container.querySelector('.dragging-bank-item');
      if (!dragging) return;

      const siblings = [...container.querySelectorAll('.draggable-quiz-bank-item:not(.dragging-bank-item)')];
      const nextSibling = siblings.find(sibling => {
        const box = sibling.getBoundingClientRect();
        return e.clientY <= box.top + box.height / 2;
      });

      if (nextSibling) {
        container.insertBefore(dragging, nextSibling);
      } else {
        container.appendChild(dragging);
      }
    };

    container.addEventListener('dragover', container._dragOverHandler);
  }

  // 開啟下載範例檔格式選擇彈窗
  openDownloadSampleModal() {
    if (!window.app || typeof window.app.openBankFormatPickerModal !== 'function') {
      this.downloadSampleTemplateJSON();
      return;
    }
    window.app.openBankFormatPickerModal({
      title: '下載選擇題測驗範例檔',
      icon: '⬇️',
      desc: '請選擇您想要下載的範例檔格式，編輯完成後即可直接匯入：',
      options: [
        {
          icon: '📄',
          title: 'JSON 格式範例檔 (.json)',
          desc: '完整結構格式，支援單選、複選、連連看配對題與多選項設定',
          badge: '推薦',
          action: () => this.downloadSampleTemplateJSON()
        },
        {
          icon: '📊',
          title: 'CSV 試算表範例檔 (.csv)',
          desc: '以分號分隔選項，可直接使用 Excel 或 Google 試算表開啟編輯',
          badge: '常用',
          action: () => this.downloadSampleTemplateCSV()
        },
        {
          icon: '📝',
          title: 'TXT 純文字範例檔 (.txt)',
          desc: '第一行問句、第二行題型、後續每行一個選項，簡明好上手',
          badge: '純文字',
          action: () => this.exportQuizBankTxt()
        }
      ]
    });
  }

  // 開啟匯出題庫格式選擇彈窗
  openExportModal() {
    const keys = Object.keys(this.historyBank || {});
    if (keys.length === 0) {
      if (window.app) window.app.showNotification('提示', '題庫目前沒有任何題目可供匯出！');
      return;
    }

    if (!window.app || typeof window.app.openBankFormatPickerModal !== 'function') {
      this.exportQuizzesJSON();
      return;
    }
    window.app.openBankFormatPickerModal({
      title: '匯出選擇題測驗題庫',
      icon: '📤',
      desc: `目前題庫共 ${keys.length} 道題目，請選擇匯出備份格式：`,
      options: [
        {
          icon: '📄',
          title: '匯出 JSON 格式備份檔 (.json)',
          desc: '完整保留所有題目的題目問句、選項、題型、配對與自訂排序資訊',
          badge: '推薦備份',
          action: () => this.exportQuizzesJSON()
        },
        {
          icon: '📊',
          title: '匯出 CSV 試算表檔 (.csv)',
          desc: '適合使用 Excel 或試算表開啟查閱、修改或彙整題庫',
          badge: 'Excel 試算表',
          action: () => this.exportQuizzesCSV()
        },
        {
          icon: '📝',
          title: '匯出 TXT 純文字檔 (.txt)',
          desc: '純文字題目清單格式，適合快速複製或備忘閱讀',
          badge: '純文字',
          action: () => this.exportAllQuizBankTxt()
        }
      ]
    });
  }

  // 下載題庫 JSON 範例格式檔
  downloadSampleTemplateJSON() {
    const templateData = [
      {
        question: "您對今天的課堂內容滿意度如何？",
        quizType: "single",
        options: ["⭐ 1 星", "⭐⭐ 2 星", "⭐⭐⭐ 3 星", "⭐⭐⭐⭐ 4 星", "⭐⭐⭐⭐⭐ 5 星"]
      },
      {
        question: "請問下列哪些是網頁前端開發的三大核心語言？",
        quizType: "multiple",
        options: ["HTML", "CSS", "JavaScript", "Python"]
      },
      {
        question: "請將下列國家與其首都進行配對：",
        quizType: "matching",
        pairs: [
          { left: "台灣", right: "台北" },
          { left: "日本", right: "東京" },
          { left: "法國", right: "巴黎" }
        ],
        options: ["台灣", "日本", "法國"],
        matchOptions: ["台北", "東京", "巴黎"]
      }
    ];

    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'choice_quiz_template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (window.app) window.app.showNotification('成功', '已下載選擇測驗 JSON 範例格式檔！');
  }

  // 下載題庫 CSV 範例格式檔
  downloadSampleTemplateCSV() {
    let csv = '\uFEFF題目問句,題型(單選/複選/配對),選項(以分號;區隔),標準答案/配對\r\n';
    csv += '"您對今天的課堂內容滿意度如何？","單選","⭐ 1 星;⭐⭐ 2 星;⭐⭐⭐ 3 星;⭐⭐⭐⭐ 4 星;⭐⭐⭐⭐⭐ 5 星",""\r\n';
    csv += '"請問下列哪些是網頁前端開發的三大核心語言？","複選","HTML;CSS;JavaScript;Python","HTML;CSS;JavaScript"\r\n';
    csv += '"請將下列國家與其首都進行配對","配對","台灣=台北;日本=東京;法國=巴黎",""\r\n';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'choice_quiz_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (window.app) window.app.showNotification('成功', '已下載選擇測驗 CSV 範例格式檔！');
  }

  // 匯出全部題庫備份 (JSON)
  exportQuizzesJSON() {
    const keys = Object.keys(this.historyBank || {});
    if (keys.length === 0) {
      if (window.app) window.app.showNotification('提示', '題庫目前沒有任何題目可供匯出！');
      return;
    }
    const list = keys.map(k => this.historyBank[k]).filter(Boolean);
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_bank_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (window.app) window.app.showNotification('成功', `已順利匯出全部 ${list.length} 道選擇測驗題目 (JSON)！`);
  }

  // 匯出全部題庫備份 (CSV)
  exportQuizzesCSV() {
    const keys = Object.keys(this.historyBank || {});
    if (keys.length === 0) {
      if (window.app) window.app.showNotification('提示', '題庫目前沒有任何題目可供匯出！');
      return;
    }
    let csv = '\uFEFF題目問句,題型(單選/複選/配對),選項(以分號;區隔),標準答案/配對\r\n';
    keys.forEach(k => {
      const q = this.historyBank[k];
      if (!q) return;
      const question = (q.question || '').replace(/"/g, '""');
      const typeStr = q.quizType === 'matching' ? '配對' : (q.quizType === 'multiple' ? '複選' : '單選');
      let optStr = '';
      if (q.quizType === 'matching' && Array.isArray(q.pairs)) {
        optStr = q.pairs.map(p => `${p.left}=${p.right}`).join(';');
      } else if (Array.isArray(q.options)) {
        optStr = q.options.map(opt => typeof opt === 'object' ? (opt.text || '') : String(opt)).join(';');
      }
      optStr = optStr.replace(/"/g, '""');
      const ans = (Array.isArray(q.correctAnswer) ? q.correctAnswer.join(';') : (q.correctAnswer ? JSON.stringify(q.correctAnswer) : '')).replace(/"/g, '""');
      csv += `"${question}","${typeStr}","${optStr}","${ans}"\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_bank_backup_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (window.app) window.app.showNotification('成功', `已順利匯出全部 ${keys.length} 道選擇測驗題目 (CSV)！`);
  }

  // 統一匯入題庫檔案 (支援 .json / .csv / .txt)
  importQuizBankUnifiedFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = (file.name || '').toLowerCase();
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const textContent = e.target.result;
        let questions = [];

        if (fileName.endsWith('.json') || (textContent.trim().startsWith('[') && textContent.trim().endsWith(']'))) {
          try {
            questions = JSON.parse(textContent);
          } catch (err) {
            console.warn('JSON parse failed, will fallback', err);
          }
        }

        if (questions.length === 0 && (fileName.endsWith('.csv') || textContent.includes(','))) {
          questions = this.parseQuizCSV(textContent);
        }

        if (questions.length === 0) {
          questions = this.parseQuizTXT(textContent);
        }

        if (questions.length === 0) {
          if (window.app) window.app.showNotification('錯誤', '匯入失敗：格式無法解析，請參考範例格式說明！');
          return;
        }

        questions.forEach(q => {
          this.saveToHistoryBank(q.question, q.options, q.quizType, q);
        });

        // 重新渲染兩個頁籤
        this.renderQuizHistoryUI();
        this.renderQuizBankListUI();

        // 自動帶入第一題到出題框
        const q0 = questions[0];
        if (q0 && q0.question) {
          const editor = document.getElementById('quizQuestionEditor');
          if (editor) editor.innerHTML = q0.question;
          const qInput = document.getElementById('quizQuestion');
          if (qInput) qInput.value = q0.question;
        }

        if (window.app) {
          window.app.showNotification('成功', `已成功解析並匯入 ${questions.length} 道題目至題庫！第一題已帶入出題框。`);
        }
      } catch (err) {
        if (window.app) window.app.showNotification('錯誤', '解析檔案失敗：' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  // 解析 CSV 題目
  parseQuizCSV(csvText) {
    if (!csvText) return [];
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.slice(1);
    }
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) return [];

    const questions = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cells = [];
      let cell = '';
      let inQuotes = false;
      for (let j = 0; j < line.length; j++) {
        const c = line[j];
        if (c === '"') {
          if (inQuotes && line[j + 1] === '"') {
            cell += '"';
            j++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === ',' && !inQuotes) {
          cells.push(cell.trim());
          cell = '';
        } else {
          cell += c;
        }
      }
      cells.push(cell.trim());

      const question = cells[0];
      if (!question) continue;

      const typeStr = (cells[1] || '').toLowerCase();
      let quizType = 'single';
      if (typeStr.includes('配') || typeStr.includes('match') || typeStr.includes('連')) {
        quizType = 'matching';
      } else if (typeStr.includes('複') || typeStr.includes('multi')) {
        quizType = 'multiple';
      }

      const rawOptions = (cells[2] || '').split(/[;；]/).map(o => o.trim()).filter(Boolean);
      const answerStr = (cells[3] || '').trim();

      if (quizType === 'matching') {
        const pairs = [];
        const pairSource = rawOptions.length > 0 ? rawOptions : answerStr.split(/[;；]/).map(o => o.trim()).filter(Boolean);
        pairSource.forEach(pStr => {
          const parts = pStr.split(/[=＝]/);
          if (parts.length >= 2) {
            pairs.push({ left: parts[0].trim(), right: parts.slice(1).join('=').trim() });
          }
        });
        if (pairs.length >= 2) {
          questions.push({
            question,
            quizType,
            options: pairs.map(p => p.left),
            matchOptions: pairs.map(p => p.right),
            pairs,
            correctAnswer: pairs.reduce((acc, p) => { acc[p.left] = p.right; return acc; }, {})
          });
        }
      } else {
        if (rawOptions.length >= 2) {
          questions.push({
            question,
            quizType,
            options: rawOptions
          });
        }
      }
    }
    return questions;
  }

  // 解析 TXT 題目格式
  parseQuizTXT(textContent) {
    if (!textContent) return [];
    const questions = [];
    const blocks = textContent.split(/\n\s*---\s*\n|\n\s*\n\s*\n/).map(b => b.trim()).filter(Boolean);
    blocks.forEach(block => {
      const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '' && l !== '---');
      if (lines.length >= 3) {
        const question = lines[0];
        const typeStr = lines[1];
        let quizType = 'single';
        if (typeStr.includes('配對') || typeStr.includes('連') || typeStr.toLowerCase().includes('match')) {
          quizType = 'matching';
        } else if (typeStr.includes('複') || typeStr.toLowerCase().includes('multi')) {
          quizType = 'multiple';
        }

        const rawOptions = lines.slice(2);
        if (quizType === 'matching') {
          const pairs = [];
          rawOptions.forEach(optLine => {
            const parts = optLine.split(/[=＝]/);
            if (parts.length >= 2) {
              const left = parts[0].trim();
              const right = parts.slice(1).join('=').trim();
              if (left && right) pairs.push({ left, right });
            }
          });
          if (pairs.length >= 2) {
            questions.push({
              question,
              quizType,
              options: pairs.map(p => p.left),
              matchOptions: pairs.map(p => p.right),
              pairs,
              correctAnswer: pairs.reduce((acc, p) => { acc[p.left] = p.right; return acc; }, {})
            });
          }
        } else if (rawOptions.length >= 2) {
          questions.push({
            question,
            quizType,
            options: rawOptions
          });
        }
      }
    });
    return questions;
  }

  // 執行編輯器指令
  execEditorCmd(cmd, value = null) {
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    document.execCommand(cmd, false, value);
  }

  // 清空題目編輯器
  clearEditor() {
    const editor = document.getElementById('quizQuestionEditor');
    if (editor) editor.innerHTML = '';
  }

  // 初始化編輯器事件（貼上圖片監聽與點擊外部關閉選單）
  initEditorEvents() {
    const bindEvents = () => {
      const editor = document.getElementById('quizQuestionEditor');
      if (editor && !editor.__eventsBound) {
        editor.__eventsBound = true;
        editor.addEventListener('paste', (e) => {
          const clipboardData = e.clipboardData || window.clipboardData;
          if (!clipboardData) return;
          const items = clipboardData.items;
          if (!items) return;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type && items[i].type.indexOf('image') !== -1) {
              e.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  this.compressAndInsertImage(ev.target.result);
                };
                reader.readAsDataURL(file);
                return;
              }
            }
          }
        });
      }

      // 選項欄位也支援直接貼上剪貼簿圖片
      const optionsContainer = document.getElementById('optionsContainer');
      if (optionsContainer && !optionsContainer.__eventsBound) {
        optionsContainer.__eventsBound = true;
        optionsContainer.addEventListener('paste', (e) => {
          const row = e.target.closest('.option-input');
          if (!row) return;
          const clipboardData = e.clipboardData || window.clipboardData;
          if (!clipboardData) return;
          const items = clipboardData.items;
          if (!items) return;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type && items[i].type.indexOf('image') !== -1) {
              e.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                this.currentEditingOptionRow = row;
                const toggleBtn = row.querySelector('.option-type-toggle-btn');
                if (row.getAttribute('data-type') !== 'image' && toggleBtn) {
                  this.toggleOptionType(toggleBtn);
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                  this.compressOptionImage(ev.target.result);
                };
                reader.readAsDataURL(file);
                return;
              }
            }
          }
        });
      }

      if (!window.__quizDropdownClickBound) {
        window.__quizDropdownClickBound = true;
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.quiz-editor-dropdown-wrapper')) {
            this.closeAllDropdowns();
          }
          const optMenu = document.getElementById('quizOptionImgActionMenu');
          if (optMenu && !e.target.closest('#quizOptionImgActionMenu') && !e.target.closest('.option-img-btn')) {
            optMenu.style.display = 'none';
          }
        });
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('board-ready', bindEvents);
    } else {
      bindEvents();
    }
  }

  // 切換工具列下拉選單
  toggleDropdown(dropdownId, event) {
    if (event) event.stopPropagation();
    const target = document.getElementById(dropdownId);
    const wasOpen = target && target.style.display === 'block';
    this.closeAllDropdowns();
    if (target && !wasOpen) {
      target.style.display = 'block';
      target.style.left = '0';
      target.style.right = 'auto';
      const rect = target.getBoundingClientRect();
      if (rect.right > (window.innerWidth - 12)) {
        target.style.left = 'auto';
        target.style.right = '0';
      }
    }
  }

  // 關閉所有編輯器下拉選單
  closeAllDropdowns() {
    document.querySelectorAll('.quiz-editor-dropdown-menu').forEach(m => {
      m.style.display = 'none';
    });
  }

  // 設定段落區塊樣式 (h1, h2, h3, p, blockquote, pre)
  handleFormatBlock(tag) {
    if (!tag) return;
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    document.execCommand('formatBlock', false, `<${tag.toUpperCase()}>`);
  }

  // 設定字體大小 (1~7)
  handleFontSize(size) {
    if (!size) return;
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    document.execCommand('fontSize', false, size);
  }

  // 設定文字色彩
  setTextColor(color) {
    this.closeAllDropdowns();
    this.execEditorCmd('foreColor', color);
  }

  // 設定螢光筆標記色彩
  setHighlightColor(color) {
    this.closeAllDropdowns();
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    if (color === 'transparent') {
      document.execCommand('removeFormat', false, null);
    } else {
      try {
        document.execCommand('hiliteColor', false, color);
      } catch (e) {
        document.execCommand('backColor', false, color);
      }
    }
  }

  // 觸發本機圖檔上傳
  triggerImageUpload() {
    this.closeAllDropdowns();
    const fileInput = document.getElementById('quizEditorImgFileInput');
    if (fileInput) fileInput.click();
  }

  // 壓縮圖檔並插入編輯器
  compressAndInsertImage(src) {
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        const ratio = Math.min(MAX / w, MAX / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/webp', 0.82);
      this.insertEditorImageHtml(dataUrl);
    };
    img.src = src;
  }

  // 處理題目編輯器圖檔上傳
  handleEditorImgUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      if (window.app) window.app.showNotification('提示', '請選擇圖片檔案');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.compressAndInsertImage(e.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  // 從網址插入圖片
  insertImageFromUrl() {
    const input = document.getElementById('quizEditorImgUrlInput');
    const url = input ? input.value.trim() : '';
    if (!url) {
      if (window.app) window.app.showNotification('提示', '請輸入圖片網址');
      return;
    }
    this.closeAllDropdowns();
    if (input) input.value = '';
    this.insertEditorImageHtml(url);
  }

  // 從剪貼簿讀取圖片並貼上
  async pasteFromClipboard() {
    this.closeAllDropdowns();
    if (navigator.clipboard && navigator.clipboard.read) {
      try {
        const items = await navigator.clipboard.read();
        let found = false;
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const reader = new FileReader();
              reader.onload = (e) => {
                this.compressAndInsertImage(e.target.result);
              };
              reader.readAsDataURL(blob);
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) {
          if (window.app) window.app.showNotification('成功', '已從剪貼簿插入圖片！');
          return;
        }
      } catch (err) {
        console.warn('Clipboard read failed:', err);
      }
    }
    const editor = document.getElementById('quizQuestionEditor');
    if (editor) editor.focus();
    if (window.app) {
      window.app.showNotification('提示', '請在題目編輯框中直接按下 Ctrl+V (或 ⌘+V) 即可貼上剪貼簿圖片！');
    }
  }

  // 在編輯器光標處或尾端插入圖片
  insertEditorImageHtml(src) {
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    const imgHtml = `<p><img src="${src}" alt="題目圖片" style="max-width: 100%; max-height: 260px; border-radius: 8px; margin: 6px 0; display: block;"></p><p><br></p>`;
    document.execCommand('insertHTML', false, imgHtml);
  }

  // 從影片與音樂選單插入
  insertVideoFromUrl() {
    const input = document.getElementById('quizEditorVideoUrlInput');
    const url = input ? input.value.trim() : '';
    if (!url) {
      if (window.app) window.app.showNotification('提示', '請輸入影片或音樂網址');
      return;
    }
    this.closeAllDropdowns();
    if (input) input.value = '';
    this.embedVideoToEditor(url);
  }

  // 嵌入影片或音樂至編輯器
  embedVideoToEditor(url) {
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();

    let embedHtml = '';
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
    if (ytMatch && ytMatch[1]) {
      const ytId = ytMatch[1];
      embedHtml = `<p><iframe src="https://www.youtube.com/embed/${ytId}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width: 100%; max-width: 500px; aspect-ratio: 16/9; border: none; border-radius: 8px; margin: 6px 0; display: block;"></iframe></p><p><br></p>`;
    } else if (cleanUrl.includes('drive.google.com')) {
      const driveEmbed = cleanUrl.replace(/\/view(\?.*)?$/, '/preview');
      embedHtml = `<p><iframe src="${driveEmbed}" allow="autoplay" allowfullscreen style="width: 100%; max-width: 500px; aspect-ratio: 16/9; border: none; border-radius: 8px; margin: 6px 0; display: block;"></iframe></p><p><br></p>`;
    } else if (cleanUrl.match(/\.(mp3|wav|m4a|aac|flac|oga)($|\?)/i)) {
      embedHtml = `<p><audio src="${cleanUrl}" controls style="width: 100%; max-width: 500px; margin: 6px 0; display: block;"></audio></p><p><br></p>`;
    } else if (cleanUrl.match(/\.(mp4|webm|ogg)($|\?)/i)) {
      embedHtml = `<p><video src="${cleanUrl}" controls style="width: 100%; max-width: 500px; max-height: 280px; border-radius: 8px; margin: 6px 0; display: block;"></video></p><p><br></p>`;
    } else {
      embedHtml = `<p><iframe src="${cleanUrl}" allowfullscreen style="width: 100%; max-width: 500px; aspect-ratio: 16/9; border: none; border-radius: 8px; margin: 6px 0; display: block;"></iframe></p><p><br></p>`;
    }

    const editor = document.getElementById('quizQuestionEditor');
    if (editor) {
      editor.focus();
      document.execCommand('insertHTML', false, embedHtml);
    }
  }

  // 相容保留舊方法
  promptInsertEditorImage() {
    this.toggleDropdown('quizImageDropdown');
  }

  promptInsertEditorVideo() {
    this.toggleDropdown('quizVideoDropdown');
  }

  // 切換選項類型（文字 / 圖片）
  toggleOptionType(btn) {
    const row = btn.closest('.option-input, .option-matching-item, .vq-option-row-item');
    if (!row) return;
    const curType = row.getAttribute('data-type') || 'text';
    const textField = row.querySelector('.option-field, .matching-left-field, .matching-right-field, .vq-option-text-field');
    const imgBtn = row.querySelector('.option-img-btn');
    const imgThumb = row.querySelector('.option-img-preview-thumb');
    const imgData = row.querySelector('.option-img-data');

    if (curType === 'text') {
      row.setAttribute('data-type', 'image');
      btn.innerHTML = '🖼️ 圖片';
      btn.style.color = '#ff9500';
      btn.style.borderColor = '#ff9500';
      if (textField) {
        if (!textField.hasAttribute('data-original-placeholder')) {
          textField.setAttribute('data-original-placeholder', textField.placeholder || '選項文字內容');
        }
        textField.placeholder = '說明文字或留空';
      }
      if (imgBtn) imgBtn.style.display = 'inline-flex';
      if (imgData && imgData.value && imgThumb) {
        imgThumb.src = imgData.value;
        imgThumb.style.display = 'inline-block';
      }
    } else {
      row.setAttribute('data-type', 'text');
      btn.innerHTML = '📝 文字';
      btn.style.color = 'var(--text-secondary)';
      btn.style.borderColor = 'var(--border-color)';
      if (textField) {
        textField.placeholder = textField.getAttribute('data-original-placeholder') || '選項文字內容';
      }
      if (imgBtn) imgBtn.style.display = 'none';
      if (imgThumb) imgThumb.style.display = 'none';
    }
  }

  // 選取選項圖片（彈出選單：上傳圖檔 / 從剪貼簿貼上）
  selectOptionImage(btn, event) {
    const ev = event || window.event;
    if (ev) ev.stopPropagation();
    const row = btn.closest('.option-input, .option-matching-item, .vq-option-row-item');
    if (!row) return;
    this.currentEditingOptionRow = row;

    let menu = document.getElementById('quizOptionImgActionMenu');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'quizOptionImgActionMenu';
      menu.className = 'quiz-editor-dropdown-menu';
      menu.style.position = 'fixed';
      menu.style.zIndex = '9999';
      menu.innerHTML = `
        <div class="quiz-dropdown-item" onclick="window.quiz && window.quiz.triggerOptionFileUpload()">
          📁 上傳電腦圖檔...
        </div>
        <div class="quiz-dropdown-item" onclick="window.quiz && window.quiz.pasteOptionFromClipboard()">
          📋 從剪貼簿貼上圖片
        </div>
      `;
      document.body.appendChild(menu);
    }

    const rect = btn.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.left = `${Math.max(10, rect.left - 40)}px`;
    menu.style.display = 'block';
  }

  // 觸發選項電腦圖檔上傳
  triggerOptionFileUpload() {
    const menu = document.getElementById('quizOptionImgActionMenu');
    if (menu) menu.style.display = 'none';

    const fileInput = document.getElementById('quizOptionImgFileInput');
    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.compressOptionImage(ev.target.result);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      };
      fileInput.click();
    }
  }

  // 從剪貼簿為選項貼上圖片
  async pasteOptionFromClipboard() {
    const menu = document.getElementById('quizOptionImgActionMenu');
    if (menu) menu.style.display = 'none';

    if (navigator.clipboard && navigator.clipboard.read) {
      try {
        const items = await navigator.clipboard.read();
        let found = false;
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const reader = new FileReader();
              reader.onload = (e) => {
                this.compressOptionImage(e.target.result);
              };
              reader.readAsDataURL(blob);
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) return;
      } catch (err) {
        console.warn('Clipboard read error for option:', err);
      }
    }

    if (this.currentEditingOptionRow) {
      const field = this.currentEditingOptionRow.querySelector('.option-field');
      if (field) field.focus();
    }
    if (window.app) {
      window.app.showNotification('提示', '未能直接讀取剪貼簿，請點「上傳電腦圖檔」或在此選項輸入框中直接按 Ctrl+V 貼上圖片！');
    }
  }

  // 壓縮選項圖檔並設定
  compressOptionImage(src) {
    const img = new Image();
    img.onload = () => {
      const MAX = 400;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        const ratio = Math.min(MAX / w, MAX / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/webp', 0.82);
      this.setOptionImage(dataUrl);
      if (window.app) window.app.showNotification('成功', '已成功設定選項圖片！');
    };
    img.src = src;
  }

  // 設定選項列圖片
  setOptionImage(dataUrl) {
    if (!this.currentEditingOptionRow) return;
    const dataInput = this.currentEditingOptionRow.querySelector('.option-img-data');
    const thumb = this.currentEditingOptionRow.querySelector('.option-img-preview-thumb');
    const btn = this.currentEditingOptionRow.querySelector('.option-img-btn');
    if (dataInput) dataInput.value = dataUrl;
    if (thumb) {
      thumb.src = dataUrl;
      thumb.style.display = 'inline-block';
    }
    if (btn) btn.textContent = '🔄 更換圖片';
  }

  // 預覽選項大圖
  previewOptionImg(src) {
    if (!src) return;
    if (window.app && typeof window.app.showNotification === 'function') {
      const modal = document.getElementById('notifyModal');
      const textEl = document.getElementById('notifyModalText');
      if (modal && textEl) {
        document.getElementById('notifyModalTitle').textContent = '🖼️ 圖片預覽';
        textEl.innerHTML = `<img src="${src}" style="max-width: 100%; max-height: 70vh; border-radius: 8px; display: block; margin: 0 auto;">`;
        modal.classList.add('active');
        return;
      }
    }
    window.open(src, '_blank');
  }

  // 載入歷史題目至出題框
  loadQuizFromHistory(key) {
    const item = this.historyBank[key];
    if (!item) return;

    // 將題目文字/HTML 載入編輯器
    const editor = document.getElementById('quizQuestionEditor');
    if (editor) {
      editor.innerHTML = item.question || '';
    }
    const qInput = document.getElementById('quizQuestion');
    if (qInput) qInput.value = item.question || '';

    if (item.quizType === 'matching') {
      const radMatching = document.querySelector('input[name="quizTypeRadio"][value="matching"]');
      if (radMatching) radMatching.checked = true;
      const pairs = item.pairs || (item.options || []).map((opt, i) => ({
        left: typeof opt === 'object' ? opt.text : opt,
        right: item.matchOptions?.[i] || ''
      }));
      const container = document.getElementById('optionsContainer');
      if (container && pairs.length > 0) {
        container.innerHTML = pairs.map((p, idx) => {
          const isLeftImg = typeof p.left === 'object' && p.left !== null && !!p.left.image;
          const leftText = isLeftImg ? (p.left.text || '') : (typeof p.left === 'object' ? (p.left.text || '') : String(p.left || ''));
          const leftImg = isLeftImg ? p.left.image : '';

          const isRightImg = typeof p.right === 'object' && p.right !== null && !!p.right.image;
          const rightText = isRightImg ? (p.right.text || '') : (typeof p.right === 'object' ? (p.right.text || '') : String(p.right || ''));
          const rightImg = isRightImg ? p.right.image : '';

          return `
            <div class="option-matching-pair">
              <div class="option-matching-item matching-left-item" data-type="${isLeftImg ? 'image' : 'text'}">
                <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isLeftImg ? 'color: #ff9500; border-color: #ff9500;' : ''}" title="切換文字或圖片">
                  ${isLeftImg ? '🖼️ 圖片' : '📝 文字'}
                </button>
                <input type="text" class="option-field matching-left-field" value="${this.escapeHtml(leftText)}" placeholder="${isLeftImg ? '說明文字或留空' : '左側題目 ' + (idx + 1)}">
                <input type="hidden" class="option-img-data" value="${this.escapeHtml(leftImg)}">
                <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isLeftImg ? 'display: inline-flex;' : 'display: none;'}" title="上傳或貼上圖片">
                  ${isLeftImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                </button>
                <img class="option-img-preview-thumb" src="${this.escapeHtml(leftImg)}" style="${isLeftImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
              </div>
              <span class="matching-pair-link-icon">🔗</span>
              <div class="option-matching-item matching-right-item" data-type="${isRightImg ? 'image' : 'text'}">
                <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isRightImg ? 'color: #ff9500; border-color: #ff9500;' : ''}" title="切換文字或圖片">
                  ${isRightImg ? '🖼️ 圖片' : '📝 文字'}
                </button>
                <input type="text" class="option-field matching-right-field" value="${this.escapeHtml(rightText)}" placeholder="${isRightImg ? '說明文字或留空' : '右側答案 ' + (idx + 1)}">
                <input type="hidden" class="option-img-data" value="${this.escapeHtml(rightImg)}">
                <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isRightImg ? 'display: inline-flex;' : 'display: none;'}" title="上傳或貼上圖片">
                  ${isRightImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                </button>
                <img class="option-img-preview-thumb" src="${this.escapeHtml(rightImg)}" style="${isRightImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
              </div>
              <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
            </div>
          `;
        }).join('');
      }
      if (window.app) window.app.showNotification('成功', '已載入此題至出題框！');
      return;
    }

    if (item.quizType === 'multiple') {
      const radMulti = document.querySelector('input[name="quizTypeRadio"][value="multiple"]');
      if (radMulti) radMulti.checked = true;
    } else {
      const radSingle = document.querySelector('input[name="quizTypeRadio"][value="single"]');
      if (radSingle) radSingle.checked = true;
    }

    const container = document.getElementById('optionsContainer');
    const savedCorrect = Array.isArray(item.correctOptions) ? item.correctOptions : [];
    if (container && Array.isArray(item.options)) {
      container.innerHTML = item.options.map((opt, idx) => {
        const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
        const optText = isImg ? (opt.text || '') : (typeof opt === 'object' ? (opt.text || '') : String(opt));
        const imgSrc = isImg ? opt.image : '';
        const isCorrect = savedCorrect.includes(idx);

        return `
          <div class="option-input" data-type="${isImg ? 'image' : 'text'}" data-correct="${isCorrect ? 'true' : 'false'}">
            <span class="option-label">${idx + 1}</span>
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isImg ? 'color: #ff9500; border-color: #ff9500;' : ''}">
              ${isImg ? '🖼️ 圖片' : '📝 文字'}
            </button>
            <button type="button" class="option-correct-toggle-btn ${isCorrect ? 'is-correct' : ''}" onclick="window.quiz && window.quiz.toggleOptionCorrect(this)" title="點擊標記此選項為正確答案（若為純投票可不勾選）">${isCorrect ? '✅ 正解' : '⬜ 正解'}</button>
            <input type="text" class="option-field" value="${this.escapeHtml(optText)}" placeholder="${isImg ? '說明文字或留空' : '選項文字內容'}">
            <input type="hidden" class="option-img-data" value="${this.escapeHtml(imgSrc)}">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isImg ? 'display: inline-flex;' : 'display: none;'}">
              ${isImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
            </button>
            <img class="option-img-preview-thumb" src="${this.escapeHtml(imgSrc)}" style="${isImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
            <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
          </div>
        `;
      }).join('');
    }

    if (window.app) window.app.showNotification('成功', '已載入此題至出題框！');
  }

  // 刪除單題歷史記錄 (新增彈窗確認動作)
  deleteQuizHistoryItem(key) {
    const item = this.historyBank[key];
    const qText = item ? item.question : '';

    if (window.app) {
      window.app.showConfirmModal(
        '🗑️',
        '確定要刪除此題目嗎？',
        qText ? `題目：「${qText}」\n刪除後將無法復原。` : '此動作無法復原。',
        () => {
          this.historyRef.child(key).remove();
          window.app.showNotification('成功', '已刪除該題目！');
        }
      );
    } else {
      if (confirm(`確定要刪除題目「${qText}」嗎？`)) {
        this.historyRef.child(key).remove();
      }
    }
  }

  // 開啟題庫題目編輯彈窗
  openEditBankQuestionModal(key) {
    const item = this.historyBank && this.historyBank[key];
    if (!item) {
      if (window.app) window.app.showNotification('提示', '找不到該題目！');
      return;
    }
    this.editingBankQuestionKey = key;

    const modal = document.getElementById('quizBankQuestionEditModal');
    if (!modal) return;

    // 設定題目內容
    const qInput = document.getElementById('editBankQuestionInput');
    if (qInput) {
      qInput.value = item.question || '';
    }

    // 設定題型
    const type = item.quizType || 'single';
    const rad = document.querySelector(`input[name="editBankQuizType"][value="${type}"]`);
    if (rad) rad.checked = true;

    this.onEditBankQuizTypeChange(type, item);
    modal.classList.add('active');
    modal.style.display = 'flex';
  }

  // 關閉題庫題目編輯彈窗
  closeEditBankQuestionModal() {
    const modal = document.getElementById('quizBankQuestionEditModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
    this.editingBankQuestionKey = null;
  }

  // 切換編輯彈窗中的題型
  onEditBankQuizTypeChange(type, sourceItem = null) {
    const optSec = document.getElementById('editBankOptionsSection');
    const matchSec = document.getElementById('editBankMatchingSection');
    const optList = document.getElementById('editBankOptionsList');
    const matchList = document.getElementById('editBankMatchingList');

    if (type === 'matching') {
      if (optSec) optSec.style.display = 'none';
      if (matchSec) matchSec.style.display = 'block';
      if (matchList) {
        matchList.innerHTML = '';
        const item = sourceItem || (this.editingBankQuestionKey ? this.historyBank[this.editingBankQuestionKey] : null);
        let pairs = (item && item.quizType === 'matching' && Array.isArray(item.pairs)) ? item.pairs : [];
        if (pairs.length === 0 && item && Array.isArray(item.options)) {
          pairs = item.options.map((opt, i) => ({
            left: typeof opt === 'object' ? (opt.text || '') : String(opt),
            right: item.matchOptions?.[i] || ''
          }));
        }
        if (pairs.length === 0) {
          pairs = [{ left: '', right: '' }, { left: '', right: '' }];
        }
        pairs.forEach(p => {
          const lText = typeof p.left === 'object' ? (p.left.text || '') : String(p.left || '');
          const rText = typeof p.right === 'object' ? (p.right.text || '') : String(p.right || '');
          this.addEditBankMatchingPair(lText, rText);
        });
      }
    } else {
      if (matchSec) matchSec.style.display = 'none';
      if (optSec) optSec.style.display = 'block';
      if (optList) {
        optList.innerHTML = '';
        const item = sourceItem || (this.editingBankQuestionKey ? this.historyBank[this.editingBankQuestionKey] : null);
        let opts = (item && Array.isArray(item.options)) ? item.options : [];
        if (opts.length === 0) {
          opts = ['', '', '', ''];
        }
        opts.forEach(opt => {
          const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
          const optText = isImg ? (opt.text || '') : (typeof opt === 'object' ? (opt.text || '') : String(opt || ''));
          const imgSrc = isImg ? opt.image : '';
          this.addEditBankOption(optText, imgSrc);
        });
      }
    }
  }

  // 新增選項 (編輯彈窗)
  addEditBankOption(text = '', image = '') {
    const list = document.getElementById('editBankOptionsList');
    if (!list) return;

    const idx = list.querySelectorAll('.edit-bank-option-row').length + 1;
    const row = document.createElement('div');
    row.className = 'edit-bank-option-row';
    row.style = 'display: flex; align-items: center; gap: 8px; background: var(--bg-input); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color);';
    row.innerHTML = `
      <span class="edit-bank-opt-badge" style="font-size: 12px; font-weight: bold; background: var(--bg-card); color: var(--text-secondary); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${idx}</span>
      <input type="text" class="edit-bank-opt-input question-input" value="${this.escapeHtml(text)}" placeholder="請輸入選項文字..." style="margin: 0; flex: 1; padding: 6px 10px; font-size: 13.5px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary);">
      <button type="button" class="remove-option-btn" onclick="this.closest('.edit-bank-option-row').remove(); window.quiz && window.quiz.reindexEditBankOptions();" style="background: transparent; border: none; color: var(--danger-color); cursor: pointer; font-size: 16px; padding: 4px;" title="刪除此選項">✕</button>
    `;
    list.appendChild(row);
    this.reindexEditBankOptions();
  }

  // 重新計算選項編號
  reindexEditBankOptions() {
    const list = document.getElementById('editBankOptionsList');
    if (!list) return;
    list.querySelectorAll('.edit-bank-option-row').forEach((row, i) => {
      const badge = row.querySelector('.edit-bank-opt-badge');
      if (badge) badge.textContent = i + 1;
    });
  }

  // 新增配對組 (編輯彈窗)
  addEditBankMatchingPair(left = '', right = '') {
    const list = document.getElementById('editBankMatchingList');
    if (!list) return;

    const row = document.createElement('div');
    row.className = 'edit-bank-matching-row';
    row.style = 'display: flex; align-items: center; gap: 8px; background: var(--bg-input); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color);';
    row.innerHTML = `
      <input type="text" class="edit-bank-match-left question-input" value="${this.escapeHtml(left)}" placeholder="左側題目..." style="margin: 0; flex: 1; padding: 6px 10px; font-size: 13.5px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary);">
      <span style="color: var(--accent-color); font-weight: bold; user-select: none;">🔗</span>
      <input type="text" class="edit-bank-match-right question-input" value="${this.escapeHtml(right)}" placeholder="右側配對答案..." style="margin: 0; flex: 1; padding: 6px 10px; font-size: 13.5px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary);">
      <button type="button" class="remove-option-btn" onclick="this.closest('.edit-bank-matching-row').remove();" style="background: transparent; border: none; color: var(--danger-color); cursor: pointer; font-size: 16px; padding: 4px;" title="刪除此配對組">✕</button>
    `;
    list.appendChild(row);
  }

  // 儲存題庫題目修改
  saveEditBankQuestion() {
    const key = this.editingBankQuestionKey;
    if (!key || !this.historyBank[key]) {
      if (window.app) window.app.showNotification('錯誤', '找不到要編輯的題目！');
      return;
    }

    const qInput = document.getElementById('editBankQuestionInput');
    const questionText = (qInput?.value || '').trim();
    if (!questionText) {
      if (window.app) window.app.showNotification('提示', '請輸入題目問句內容！');
      return;
    }

    const quizType = document.querySelector('input[name="editBankQuizType"]:checked')?.value || 'single';
    const item = this.historyBank[key];

    if (quizType === 'matching') {
      const matchRows = document.querySelectorAll('#editBankMatchingList .edit-bank-matching-row');
      const pairs = [];
      matchRows.forEach(row => {
        const leftVal = (row.querySelector('.edit-bank-match-left')?.value || '').trim();
        const rightVal = (row.querySelector('.edit-bank-match-right')?.value || '').trim();
        if (leftVal || rightVal) {
          pairs.push({ left: leftVal, right: rightVal });
        }
      });

      if (pairs.length < 2) {
        if (window.app) window.app.showNotification('提示', '連線配對題請至少建立 2 組配對項目！');
        return;
      }

      item.question = questionText;
      item.quizType = 'matching';
      item.pairs = pairs;
      item.options = pairs.map(p => p.left);
      item.matchOptions = pairs.map(p => p.right);
      item.updatedAt = Date.now();

    } else {
      const optRows = document.querySelectorAll('#editBankOptionsList .edit-bank-opt-input');
      const options = [];
      optRows.forEach(input => {
        const val = input.value.trim();
        if (val) options.push(val);
      });

      if (options.length < 2) {
        if (window.app) window.app.showNotification('提示', '請至少保留 2 個選項！');
        return;
      }

      item.question = questionText;
      item.quizType = quizType;
      item.options = options;
      delete item.pairs;
      delete item.matchOptions;
      item.updatedAt = Date.now();
    }

    // 寫入 Firebase
    if (this.historyRef) {
      this.historyRef.child(key).set(item).then(() => {
        if (window.app) window.app.showNotification('成功', '已成功儲存題庫題目修改！');
      }).catch(err => {
        console.warn('Sync to firebase failed', err);
      });
    }

    this.renderQuizBankListUI();
    this.renderQuizHistoryUI();
    this.closeEditBankQuestionModal();
  }

  // 清空歷次題庫
  clearHistoryBank() {
    if (window.app) {
      window.app.showConfirmModal(
        '🗑️',
        '確定要清空歷次題庫嗎？',
        '這將刪除所有在後台保存的歷史題目，此動作無法復原。',
        () => {
          this.historyRef.remove();
          window.app.showNotification('成功', '已清空歷次題庫！');
        }
      );
    }
  }

  // 清除題庫中所有重複題目（保留最新 1 筆）
  cleanDuplicateBankQuestions() {
    const keys = Object.keys(this.historyBank || {});
    if (keys.length === 0) {
      if (window.app) window.app.showNotification('提示', '目前題庫無題目。');
      return;
    }

    const seen = new Map();
    const duplicatesToDelete = [];

    // 依序檢查重複題目（依題目問句、選項與題型進行特徵比對）
    keys.forEach(k => {
      const item = this.historyBank[k];
      if (!item) return;
      const cleanQ = String(item.question || '').trim();
      const cleanOpts = Array.isArray(item.options) ? item.options.map(o => typeof o === 'object' ? (o.text || '') : String(o)) : [];
      const sig = `${cleanQ}__${JSON.stringify(cleanOpts)}__${item.quizType || 'single'}`;
      if (seen.has(sig)) {
        duplicatesToDelete.push(k);
      } else {
        seen.set(sig, k);
      }
    });

    if (duplicatesToDelete.length === 0) {
      if (window.app) window.app.showNotification('提示', '題庫中沒有發現任何重複的題目！');
      return;
    }

    if (window.app) {
      window.app.showConfirmModal(
        '🧹 清除重複題目',
        `檢測到題庫中有 ${duplicatesToDelete.length} 筆完全重複的題目，確定要自動清理嗎？`,
        '將保留最新 1 筆，並刪除其餘多餘的重複項目。',
        () => {
          duplicatesToDelete.forEach(k => {
            this.historyRef.child(k).remove();
          });
          window.app.showNotification('成功', `已成功清理 ${duplicatesToDelete.length} 筆重複題目！`);
        }
      );
    }
  }

  // 匯出純文字檔 TXT 格式範例
  exportQuizBankTxt() {
    const sampleTxtContent = `您對今天的課堂內容滿意度如何？
單選
⭐ 1 星
⭐⭐ 2 星
⭐⭐⭐ 3 星
⭐⭐⭐⭐ 4 星
⭐⭐⭐⭐⭐ 5 星

---

請問下列哪些是網頁前端開發的核心語言？
複選
HTML
CSS
JavaScript
Python

---

您對今天的教學節奏滿意嗎？
單選
😍 非常滿意
👍 滿意
😐 普通
👎 不滿意
😡 非常不滿意`;

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(sampleTxtContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sample_quiz_bank.txt");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (window.app) window.app.showNotification('成功', '已下載純文字格式 (.txt) 題目檔！');
  }

  // 匯入純文字檔 TXT 格式題目庫
  importQuizBankTxtFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const textContent = e.target.result;
        let questions = [];

        // 嘗試解析 JSON 作為向下相容備用
        if (textContent.trim().startsWith('[') && textContent.trim().endsWith(']')) {
          try {
            questions = JSON.parse(textContent);
          } catch(err) { /* ignore JSON parse error */ }
        }

        // 若不是 JSON，則進行 TXT 段落解析
        if (questions.length === 0) {
          const blocks = textContent.split(/\n\s*---\s*\n|\n\s*\n\s*\n/).map(b => b.trim()).filter(Boolean);
          blocks.forEach(block => {
            const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '' && l !== '---');
            if (lines.length >= 3) {
              const question = lines[0];
              const typeStr = lines[1];
              let quizType = 'single';
              if (typeStr.includes('配對') || typeStr.includes('連') || typeStr.toLowerCase().includes('match')) {
                quizType = 'matching';
              } else if (typeStr.includes('複') || typeStr.toLowerCase().includes('multi')) {
                quizType = 'multiple';
              }

              const rawOptions = lines.slice(2);
              if (quizType === 'matching') {
                const pairs = [];
                rawOptions.forEach(optLine => {
                  const parts = optLine.split(/[=＝]/);
                  if (parts.length >= 2) {
                    const left = parts[0].trim();
                    const right = parts.slice(1).join('=').trim();
                    if (left && right) pairs.push({ left, right });
                  }
                });
                if (pairs.length >= 2) {
                  questions.push({
                    question,
                    quizType,
                    options: pairs.map(p => p.left),
                    matchOptions: pairs.map(p => p.right),
                    pairs,
                    correctAnswer: pairs.reduce((acc, p) => { acc[p.left] = p.right; return acc; }, {})
                  });
                }
              } else if (rawOptions.length >= 2) {
                questions.push({ question, quizType, options: rawOptions });
              }
            }
          });
        }

        if (questions.length === 0) {
          if (window.app) window.app.showNotification('錯誤', '匯入失敗：格式無法解析，請參考格式範例');
          return;
        }

        // 自動寫入歷次題目庫
        questions.forEach(q => {
          this.saveToHistoryBank(q.question, q.options, q.quizType, q);
        });

        // 帶入第一題
        const q0 = questions[0];
        if (q0 && q0.question && Array.isArray(q0.options)) {
          const editor = document.getElementById('quizQuestionEditor');
          if (editor) editor.innerHTML = q0.question;
          const qInput = document.getElementById('quizQuestion');
          if (qInput) qInput.value = q0.question;
          
          if (q0.quizType === 'matching') {
            const radMatching = document.querySelector('input[name="quizTypeRadio"][value="matching"]');
            if (radMatching) radMatching.checked = true;
            const container = document.getElementById('optionsContainer');
            if (container && q0.pairs && q0.pairs.length > 0) {
              container.innerHTML = q0.pairs.map((p, idx) => {
                const isLeftImg = typeof p.left === 'object' && p.left !== null && !!p.left.image;
                const leftText = isLeftImg ? (p.left.text || '') : (typeof p.left === 'object' ? (p.left.text || '') : String(p.left || ''));
                const leftImg = isLeftImg ? p.left.image : '';

                const isRightImg = typeof p.right === 'object' && p.right !== null && !!p.right.image;
                const rightText = isRightImg ? (p.right.text || '') : (typeof p.right === 'object' ? (p.right.text || '') : String(p.right || ''));
                const rightImg = isRightImg ? p.right.image : '';

                return `
                  <div class="option-matching-pair">
                    <div class="option-matching-item matching-left-item" data-type="${isLeftImg ? 'image' : 'text'}">
                      <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isLeftImg ? 'color: #ff9500; border-color: #ff9500;' : ''}" title="切換文字或圖片">
                        ${isLeftImg ? '🖼️ 圖片' : '📝 文字'}
                      </button>
                      <input type="text" class="option-field matching-left-field" value="${this.escapeHtml(leftText)}" placeholder="${isLeftImg ? '說明文字或留空' : '左側題目 ' + (idx + 1)}">
                      <input type="hidden" class="option-img-data" value="${this.escapeHtml(leftImg)}">
                      <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isLeftImg ? 'display: inline-flex;' : 'display: none;'}" title="上傳或貼上圖片">
                        ${isLeftImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                      </button>
                      <img class="option-img-preview-thumb" src="${this.escapeHtml(leftImg)}" style="${isLeftImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
                    </div>
                    <span class="matching-pair-link-icon">🔗</span>
                    <div class="option-matching-item matching-right-item" data-type="${isRightImg ? 'image' : 'text'}">
                      <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isRightImg ? 'color: #ff9500; border-color: #ff9500;' : ''}" title="切換文字或圖片">
                        ${isRightImg ? '🖼️ 圖片' : '📝 文字'}
                      </button>
                      <input type="text" class="option-field matching-right-field" value="${this.escapeHtml(rightText)}" placeholder="${isRightImg ? '說明文字或留空' : '右側答案 ' + (idx + 1)}">
                      <input type="hidden" class="option-img-data" value="${this.escapeHtml(rightImg)}">
                      <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isRightImg ? 'display: inline-flex;' : 'display: none;'}" title="上傳或貼上圖片">
                        ${isRightImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                      </button>
                      <img class="option-img-preview-thumb" src="${this.escapeHtml(rightImg)}" style="${isRightImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
                    </div>
                    <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
                  </div>
                `;
              }).join('');
            }
          } else if (q0.quizType === 'multiple') {
            const radMulti = document.querySelector('input[name="quizTypeRadio"][value="multiple"]');
            if (radMulti) radMulti.checked = true;
          } else {
            const radSingle = document.querySelector('input[name="quizTypeRadio"][value="single"]');
            if (radSingle) radSingle.checked = true;
          }

          // 重新填入非配對選項
          if (q0.quizType !== 'matching') {
            const container = document.getElementById('optionsContainer');
            if (container) {
              container.innerHTML = q0.options.map((opt, idx) => {
                const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
                const optText = isImg ? (opt.text || '') : (typeof opt === 'object' ? (opt.text || '') : String(opt));
                const imgSrc = isImg ? opt.image : '';

                const isCorrect = Array.isArray(q0.correctOptions) && q0.correctOptions.includes(idx);
                return `
                  <div class="option-input" data-type="${isImg ? 'image' : 'text'}" data-correct="${isCorrect ? 'true' : 'false'}">
                    <span class="option-label">${idx + 1}</span>
                    <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isImg ? 'color: #ff9500; border-color: #ff9500;' : ''}">
                      ${isImg ? '🖼️ 圖片' : '📝 文字'}
                    </button>
                    <button type="button" class="option-correct-toggle-btn ${isCorrect ? 'is-correct' : ''}" onclick="window.quiz && window.quiz.toggleOptionCorrect(this)" title="點擊標記此選項為正確答案（若為純投票可不勾選）">${isCorrect ? '✅ 正解' : '⬜ 正解'}</button>
                    <input type="text" class="option-field" value="${this.escapeHtml(optText)}" placeholder="${isImg ? '說明文字或留空' : '選項文字內容'}">
                    <input type="hidden" class="option-img-data" value="${this.escapeHtml(imgSrc)}">
                    <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isImg ? 'display: inline-flex;' : 'display: none;'}">
                      ${isImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                    </button>
                    <img class="option-img-preview-thumb" src="${this.escapeHtml(imgSrc)}" style="${isImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
                    <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
                  </div>
                `;
              }).join('');
            }
          }
        }


        if (window.app) window.app.showNotification('成功', `已成功解析並儲存 ${questions.length} 個題目至歷次題目庫！第一題已自動帶入出題框`);
      } catch (err) {
        if (window.app) window.app.showNotification('錯誤', '解析文字檔失敗: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
