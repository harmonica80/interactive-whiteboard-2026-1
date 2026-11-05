/**
 * matching_quiz.js - 互動連連看 (配對題) 引擎
 * 支援選擇題測驗與影片出題測驗的即時配對題
 * 支援滑鼠與觸控拖曳連線、點選配對、即時平滑 SVG 貝茲曲線、重設連線與正誤批改反饋
 * Version: 3.8.0
 */

(function(global) {
  'use strict';

  const LINE_COLORS = [
    '#007aff', // 亮藍
    '#ff9500', // 琥珀橘
    '#34c759', // 翠綠
    '#af52de', // 紫羅蘭
    '#ff2d55', // 桃紅
    '#5856d6', // 靛藍
    '#00c7be', // 湖水青
    '#ff3b30'  // 珊瑚紅
  ];

  const MatchingQuizEngine = {
    /**
     * 洗牌演算法 (Fisher-Yates)，並盡量保證右側選項不與原始順序一對一平行
     */
    shuffleArray(arr) {
      const list = [...arr];
      if (list.length <= 1) return list;
      for (let attempt = 0; attempt < 8; attempt++) {
        for (let i = list.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [list[i], list[j]] = [list[j], list[i]];
        }
        let identical = true;
        for (let i = 0; i < list.length; i++) {
          if (list[i] !== arr[i]) {
            identical = false;
            break;
          }
        }
        if (!identical) break;
      }
      return list;
    },

    /**
     * 計算平滑三次貝茲曲線
     */
    calcBezierPath(x1, y1, x2, y2) {
      const dx = Math.max(30, Math.abs(x2 - x1) * 0.45);
      return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
    },

    /**
     * 取得配對項目之識別唯一鍵
     */
    getItemKey(item, fallback = '') {
      if (item === null || item === undefined) return fallback;
      if (typeof item === 'string') return item;
      return item.key || item.id || item.text || (item.image ? `[圖片 ${fallback}]` : fallback);
    },

    /**
     * 取得配對項目之文字說明
     */
    getItemText(item) {
      if (!item) return '';
      if (typeof item === 'string') return item;
      return item.text || '';
    },

    /**
     * 取得配對項目之圖片網址或 Base64
     */
    getItemImage(item) {
      if (!item) return '';
      if (typeof item === 'object') return item.image || '';
      return '';
    },

    /**
     * 建立連連看畫布
     * @param {HTMLElement} container 容器元素
     * @param {Object} options 配置參數
     */
    createBoard(container, options = {}) {
      if (!container) return;

      const pairs = Array.isArray(options.pairs) ? options.pairs : [];
      let leftItems = options.leftItems || pairs.map(p => p.left);
      let rightItems = options.rightItems || pairs.map(p => p.right);

      // 若未指定已打亂的 rightItems，則自動洗牌
      if (!options.rightItems && !options.noShuffle) {
        rightItems = this.shuffleArray(rightItems);
      }

      const boardId = options.id || 'mq_' + Math.random().toString(36).substr(2, 9);
      const readOnly = !!options.readOnly;
      const initialConnections = options.initialConnections ? { ...options.initialConnections } : {};
      const solution = options.solution || (pairs.length > 0 ? pairs.reduce((acc, p) => {
        const lKey = this.getItemKey(p.left);
        const rKey = this.getItemKey(p.right);
        acc[lKey] = rKey;
        return acc;
      }, {}) : null);

      // 建立內部狀態
      const state = {
        boardId,
        readOnly,
        pairs,
        leftItems,
        rightItems,
        connections: initialConnections,
        solution,
        onChange: options.onChange || null,
        selectedLeftText: null,
        dragging: false,
        dragStartLeft: null,
        dragStartX: 0,
        dragStartY: 0,
        resizeObserver: null
      };

      container._matchingState = state;

      // 組合 HTML 結構
      container.innerHTML = `
        <div class="matching-quiz-board ${readOnly ? 'is-readonly' : ''}" id="${boardId}">
          <div class="matching-quiz-toolbar">
            <div class="matching-quiz-hint">
              ${readOnly ? '📖 配對結果檢視：' : '👉 請從左側題目<strong>拖曳連線</strong>或<strong>點選配對</strong>至右側正確答案'}
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="matching-status-badge" id="${boardId}_status">已配對: ${Object.keys(state.connections).length} / ${leftItems.length} 組</span>
              ${!readOnly ? `<button type="button" class="matching-reset-btn" id="${boardId}_resetBtn" title="清除所有目前已連線項目">🔄 重設連線</button>` : ''}
            </div>
          </div>

          <div class="matching-canvas-wrapper" id="${boardId}_wrapper">
            <svg class="matching-svg-canvas" id="${boardId}_svg">
              <g class="matching-svg-lines" id="${boardId}_linesGroup"></g>
              <path class="matching-svg-active-line" id="${boardId}_activeLine" d="" style="display: none;"></path>
            </svg>

            <!-- 左側欄位 -->
            <div class="matching-column matching-column-left" id="${boardId}_leftCol">
              ${leftItems.map((leftItem, idx) => {
                const color = LINE_COLORS[idx % LINE_COLORS.length];
                const key = this.getItemKey(leftItem, String(idx + 1));
                const text = this.getItemText(leftItem);
                const img = this.getItemImage(leftItem);
                return `
                  <div class="matching-card matching-card-left ${img ? 'has-img' : ''}" data-left-text="${this.escapeHtml(key)}" data-index="${idx}" style="--item-color: ${color};">
                    <span class="matching-card-badge" style="background: ${color};">${idx + 1}</span>
                    <div class="matching-card-body">
                      ${img ? `<img src="${this.escapeHtml(img)}" class="matching-card-thumb" draggable="false" alt="題目圖片" onclick="event.stopPropagation(); window.quiz && window.quiz.previewOptionImg && window.quiz.previewOptionImg(this.src)" title="點擊放大預覽圖片">` : ''}
                      ${text ? `<span class="matching-card-text">${this.escapeHtml(text)}</span>` : ''}
                    </div>
                    <div class="matching-dot matching-dot-right" title="拖曳連線" style="background: ${color};"></div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- 右側欄位 (已隨機洗牌) -->
            <div class="matching-column matching-column-right" id="${boardId}_rightCol">
              ${rightItems.map((rightItem, idx) => {
                const key = this.getItemKey(rightItem, String(idx + 1));
                const text = this.getItemText(rightItem);
                const img = this.getItemImage(rightItem);
                return `
                  <div class="matching-card matching-card-right ${img ? 'has-img' : ''}" data-right-text="${this.escapeHtml(key)}" data-index="${idx}">
                    <div class="matching-dot matching-dot-left" title="配對連接點"></div>
                    <span class="matching-card-badge">${String.fromCharCode(65 + idx)}</span>
                    <div class="matching-card-body">
                      ${img ? `<img src="${this.escapeHtml(img)}" class="matching-card-thumb" draggable="false" alt="答案圖片" onclick="event.stopPropagation(); window.quiz && window.quiz.previewOptionImg && window.quiz.previewOptionImg(this.src)" title="點擊放大預覽圖片">` : ''}
                      ${text ? `<span class="matching-card-text">${this.escapeHtml(text)}</span>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;

      // 綁定事件監聽
      this.bindEvents(container, state);

      // 初次繪製連線
      requestAnimationFrame(() => {
        this.updateLines(container);
        if (options.showResults && solution) {
          this.renderResults(container, state.connections, solution, { showAnswers: true });
        }
      });

      return state;
    },

    /**
     * 綁定互動事件 (拖曳、點擊、連線、重設、視窗自適應)
     */
    bindEvents(container, state) {
      const { boardId, readOnly } = state;
      const wrapper = document.getElementById(`${boardId}_wrapper`);
      const svg = document.getElementById(`${boardId}_svg`);
      const activeLine = document.getElementById(`${boardId}_activeLine`);
      const resetBtn = document.getElementById(`${boardId}_resetBtn`);
      if (!wrapper || !svg) return;

      // 監聽重設按鈕
      if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.resetConnections(container);
        });
      }

      if (readOnly) return;

      // 左側卡片拖曳與點選連線
      const leftCards = wrapper.querySelectorAll('.matching-card-left');
      leftCards.forEach(card => {
        const leftText = card.getAttribute('data-left-text');
        const dot = card.querySelector('.matching-dot-right');

        // Pointer Down: 開始拖曳
        const onPointerDown = (e) => {
          if (state.readOnly) return;
          e.preventDefault();

          state.dragging = true;
          state.dragStartLeft = leftText;

          const wrapperRect = wrapper.getBoundingClientRect();
          const dotRect = dot.getBoundingClientRect();
          state.dragStartX = (dotRect.left + dotRect.width / 2) - wrapperRect.left;
          state.dragStartY = (dotRect.top + dotRect.height / 2) - wrapperRect.top;

          // 設置 activeLine 起點樣式
          const cardIdx = parseInt(card.getAttribute('data-index') || '0', 10);
          const color = LINE_COLORS[cardIdx % LINE_COLORS.length];
          activeLine.setAttribute('stroke', color);
          activeLine.setAttribute('d', this.calcBezierPath(state.dragStartX, state.dragStartY, state.dragStartX, state.dragStartY));
          activeLine.style.display = 'block';

          // 指標鎖定 (保證拖曳不掉幀)
          try {
            card.setPointerCapture(e.pointerId);
          } catch(err) {}

          // 標記左側選取狀態
          this.selectLeftCard(container, leftText);
        };

        const onPointerMove = (e) => {
          if (!state.dragging || state.dragStartLeft !== leftText) return;
          e.preventDefault();

          const wrapperRect = wrapper.getBoundingClientRect();
          const curX = e.clientX - wrapperRect.left;
          const curY = e.clientY - wrapperRect.top;

          activeLine.setAttribute('d', this.calcBezierPath(state.dragStartX, state.dragStartY, curX, curY));

          // 檢查懸停右側卡片
          const hoverEl = document.elementFromPoint(e.clientX, e.clientY);
          const hoverRightCard = hoverEl ? hoverEl.closest('.matching-card-right') : null;
          wrapper.querySelectorAll('.matching-card-right').forEach(rc => {
            if (rc === hoverRightCard) {
              rc.classList.add('is-hover-target');
            } else {
              rc.classList.remove('is-hover-target');
            }
          });
        };

        const onPointerUp = (e) => {
          if (!state.dragging || state.dragStartLeft !== leftText) return;
          e.preventDefault();

          state.dragging = false;
          activeLine.style.display = 'none';
          wrapper.querySelectorAll('.matching-card-right').forEach(rc => rc.classList.remove('is-hover-target'));

          try {
            card.releasePointerCapture(e.pointerId);
          } catch(err) {}

          // 尋找指標釋放處的右側卡片
          const releaseEl = document.elementFromPoint(e.clientX, e.clientY);
          const targetRightCard = releaseEl ? releaseEl.closest('.matching-card-right') : null;

          if (targetRightCard) {
            const targetRightText = targetRightCard.getAttribute('data-right-text');
            this.connectPair(container, leftText, targetRightText);
            this.clearLeftSelection(container);
          }
        };

        const onPointerCancel = () => {
          state.dragging = false;
          activeLine.style.display = 'none';
          wrapper.querySelectorAll('.matching-card-right').forEach(rc => rc.classList.remove('is-hover-target'));
        };

        card.addEventListener('pointerdown', onPointerDown);
        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerup', onPointerUp);
        card.addEventListener('pointercancel', onPointerCancel);

        // 點擊左側卡片 (點選模式)
        card.addEventListener('click', (e) => {
          if (state.readOnly) return;
          if (state.selectedLeftText === leftText) {
            this.clearLeftSelection(container);
          } else {
            this.selectLeftCard(container, leftText);
          }
        });
      });

      // 右側卡片點選完成配對
      const rightCards = wrapper.querySelectorAll('.matching-card-right');
      rightCards.forEach(card => {
        card.addEventListener('click', (e) => {
          if (state.readOnly) return;
          const rightText = card.getAttribute('data-right-text');
          if (state.selectedLeftText) {
            this.connectPair(container, state.selectedLeftText, rightText);
            this.clearLeftSelection(container);
          } else {
            // 若該右側卡片已有連線，點擊可快速刪除連線
            const connectedLeft = Object.keys(state.connections).find(l => state.connections[l] === rightText);
            if (connectedLeft) {
              this.disconnectPair(container, connectedLeft);
            }
          }
        });
      });

      // 監聽容器大小變更 (響應式自動重繪所有連線)
      if (window.ResizeObserver) {
        state.resizeObserver = new ResizeObserver(() => {
          this.updateLines(container);
        });
        state.resizeObserver.observe(wrapper);
      }
    },

    /**
     * 選取左側卡片
     */
    selectLeftCard(container, leftText) {
      const state = container._matchingState;
      if (!state) return;
      state.selectedLeftText = leftText;

      const wrapper = document.getElementById(`${state.boardId}_wrapper`);
      if (!wrapper) return;

      wrapper.querySelectorAll('.matching-card-left').forEach(c => {
        if (c.getAttribute('data-left-text') === leftText) {
          c.classList.add('is-selected');
        } else {
          c.classList.remove('is-selected');
        }
      });
    },

    /**
     * 清除左側選取
     */
    clearLeftSelection(container) {
      const state = container._matchingState;
      if (!state) return;
      state.selectedLeftText = null;

      const wrapper = document.getElementById(`${state.boardId}_wrapper`);
      if (!wrapper) return;

      wrapper.querySelectorAll('.matching-card-left').forEach(c => c.classList.remove('is-selected'));
    },

    /**
     * 建立連線配對 (1對1)
     */
    connectPair(container, leftText, rightText) {
      const state = container._matchingState;
      if (!state || state.readOnly) return;

      // 若右側選項已被其他左側項目連線，先移除舊連線 (維持 1 對 1)
      Object.keys(state.connections).forEach(k => {
        if (state.connections[k] === rightText) {
          delete state.connections[k];
        }
      });

      state.connections[leftText] = rightText;

      this.updateLines(container);
      this.updateStatusBadge(container);

      if (typeof state.onChange === 'function') {
        state.onChange({ ...state.connections });
      }
    },

    /**
     * 解除連線配對
     */
    disconnectPair(container, leftText) {
      const state = container._matchingState;
      if (!state || state.readOnly) return;

      if (state.connections[leftText]) {
        delete state.connections[leftText];
        this.updateLines(container);
        this.updateStatusBadge(container);

        if (typeof state.onChange === 'function') {
          state.onChange({ ...state.connections });
        }
      }
    },

    /**
     * 清空重設所有連線
     */
    resetConnections(container) {
      const state = container._matchingState;
      if (!state || state.readOnly) return;

      state.connections = {};
      this.clearLeftSelection(container);
      this.updateLines(container);
      this.updateStatusBadge(container);

      if (typeof state.onChange === 'function') {
        state.onChange({});
      }
    },

    /**
     * 更新狀態標籤
     */
    updateStatusBadge(container) {
      const state = container._matchingState;
      if (!state) return;
      const statusEl = document.getElementById(`${state.boardId}_status`);
      if (statusEl) {
        const count = Object.keys(state.connections).length;
        const total = state.leftItems.length;
        statusEl.textContent = `已配對: ${count} / ${total} 組`;
        if (count === total && total > 0) {
          statusEl.classList.add('is-complete');
        } else {
          statusEl.classList.remove('is-complete');
        }
      }
    },

    /**
     * 重繪所有已建立連線之 SVG 曲線
     */
    updateLines(container) {
      const state = container._matchingState;
      if (!state) return;

      const { boardId, connections, leftItems } = state;
      const wrapper = document.getElementById(`${boardId}_wrapper`);
      const linesGroup = document.getElementById(`${boardId}_linesGroup`);
      if (!wrapper || !linesGroup) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      linesGroup.innerHTML = '';

      // 更新卡片連線中狀態
      const connectedRights = new Set(Object.values(connections));
      wrapper.querySelectorAll('.matching-card-left').forEach(card => {
        const lt = card.getAttribute('data-left-text');
        if (connections[lt]) {
          card.classList.add('is-connected');
        } else {
          card.classList.remove('is-connected');
        }
      });
      wrapper.querySelectorAll('.matching-card-right').forEach(card => {
        const rt = card.getAttribute('data-right-text');
        if (connectedRights.has(rt)) {
          card.classList.add('is-connected');
        } else {
          card.classList.remove('is-connected');
        }
      });

      // 繪製每組連線
      Object.keys(connections).forEach(leftText => {
        const rightText = connections[leftText];
        const leftCard = wrapper.querySelector(`.matching-card-left[data-left-text="${CSS.escape(leftText)}"]`);
        const rightCard = wrapper.querySelector(`.matching-card-right[data-right-text="${CSS.escape(rightText)}"]`);
        if (!leftCard || !rightCard) return;

        const leftDot = leftCard.querySelector('.matching-dot-right');
        const rightDot = rightCard.querySelector('.matching-dot-left');
        if (!leftDot || !rightDot) return;

        const leftDotRect = leftDot.getBoundingClientRect();
        const rightDotRect = rightDot.getBoundingClientRect();

        const x1 = (leftDotRect.left + leftDotRect.width / 2) - wrapperRect.left;
        const y1 = (leftDotRect.top + leftDotRect.height / 2) - wrapperRect.top;
        const x2 = (rightDotRect.left + rightDotRect.width / 2) - wrapperRect.left;
        const y2 = (rightDotRect.top + rightDotRect.height / 2) - wrapperRect.top;

        const pathD = this.calcBezierPath(x1, y1, x2, y2);
        const cardIdx = parseInt(leftCard.getAttribute('data-index') || '0', 10);
        const color = LINE_COLORS[cardIdx % LINE_COLORS.length];

        // 建立透明粗點擊區 (方便點擊刪除連線)
        const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hitPath.setAttribute('d', pathD);
        hitPath.setAttribute('class', 'matching-line-hitarea');
        hitPath.setAttribute('stroke', 'transparent');
        hitPath.setAttribute('stroke-width', '24');
        hitPath.setAttribute('fill', 'none');
        hitPath.style.cursor = state.readOnly ? 'default' : 'pointer';

        if (!state.readOnly) {
          hitPath.addEventListener('click', (e) => {
            e.stopPropagation();
            this.disconnectPair(container, leftText);
          });
        }

        // 建立主要可視曲線
        const visiblePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        visiblePath.setAttribute('d', pathD);
        visiblePath.setAttribute('class', 'matching-line-visible');
        visiblePath.setAttribute('stroke', color);
        visiblePath.setAttribute('stroke-width', '3.5');
        visiblePath.setAttribute('fill', 'none');

        // 端點裝飾圓點
        const dotStart = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotStart.setAttribute('cx', x1);
        dotStart.setAttribute('cy', y1);
        dotStart.setAttribute('r', '5');
        dotStart.setAttribute('fill', color);

        const dotEnd = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotEnd.setAttribute('cx', x2);
        dotEnd.setAttribute('cy', y2);
        dotEnd.setAttribute('r', '5');
        dotEnd.setAttribute('fill', color);

        linesGroup.appendChild(hitPath);
        linesGroup.appendChild(visiblePath);
        linesGroup.appendChild(dotStart);
        linesGroup.appendChild(dotEnd);
      });
    },

    /**
     * 批改並繪製正誤結果 (綠色正確實線、紅色錯誤虛線、綠色標準正解輔助虛線)
     */
    renderResults(container, userConnections = {}, solution = {}, options = {}) {
      const state = container._matchingState;
      if (!state) return;

      state.readOnly = true;
      state.connections = { ...userConnections };
      state.solution = { ...solution };

      const { boardId, leftItems } = state;
      const wrapper = document.getElementById(`${boardId}_wrapper`);
      const linesGroup = document.getElementById(`${boardId}_linesGroup`);
      const resetBtn = document.getElementById(`${boardId}_resetBtn`);
      if (resetBtn) resetBtn.style.display = 'none';
      if (!wrapper || !linesGroup) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      linesGroup.innerHTML = '';

      let correctCount = 0;
      const totalPairs = leftItems.length;

      leftItems.forEach((leftItem, idx) => {
        const leftKey = this.getItemKey(leftItem, String(idx + 1));
        const correctRight = solution[leftKey];
        const userRight = userConnections[leftKey];
        const isCorrect = (userRight && userRight === correctRight);
        if (isCorrect) correctCount++;

        const leftCard = wrapper.querySelector(`.matching-card-left[data-left-text="${CSS.escape(leftKey)}"]`);
        if (!leftCard) return;

        const leftDot = leftCard.querySelector('.matching-dot-right');
        const leftDotRect = leftDot.getBoundingClientRect();
        const x1 = (leftDotRect.left + leftDotRect.width / 2) - wrapperRect.left;
        const y1 = (leftDotRect.top + leftDotRect.height / 2) - wrapperRect.top;

        if (isCorrect) {
          // 答對：繪製綠色實線
          leftCard.classList.add('result-correct');
          const rightCard = wrapper.querySelector(`.matching-card-right[data-right-text="${CSS.escape(userRight)}"]`);
          if (rightCard) {
            rightCard.classList.add('result-correct');
            const rightDot = rightCard.querySelector('.matching-dot-left');
            const rightDotRect = rightDot.getBoundingClientRect();
            const x2 = (rightDotRect.left + rightDotRect.width / 2) - wrapperRect.left;
            const y2 = (rightDotRect.top + rightDotRect.height / 2) - wrapperRect.top;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', this.calcBezierPath(x1, y1, x2, y2));
            path.setAttribute('class', 'matching-line-correct');
            path.setAttribute('stroke', '#34c759');
            path.setAttribute('stroke-width', '4');
            path.setAttribute('fill', 'none');
            linesGroup.appendChild(path);
          }
        } else {
          // 答錯或未連線
          leftCard.classList.add('result-wrong');

          if (userRight) {
            // 學生選錯的連線：紅色虛線
            const wrongRightCard = wrapper.querySelector(`.matching-card-right[data-right-text="${CSS.escape(userRight)}"]`);
            if (wrongRightCard) {
              wrongRightCard.classList.add('result-wrong');
              const rightDot = wrongRightCard.querySelector('.matching-dot-left');
              const rightDotRect = rightDot.getBoundingClientRect();
              const x2 = (rightDotRect.left + rightDotRect.width / 2) - wrapperRect.left;
              const y2 = (rightDotRect.top + rightDotRect.height / 2) - wrapperRect.top;

              const wrongPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              wrongPath.setAttribute('d', this.calcBezierPath(x1, y1, x2, y2));
              wrongPath.setAttribute('class', 'matching-line-wrong');
              wrongPath.setAttribute('stroke', '#ff3b30');
              wrongPath.setAttribute('stroke-width', '3');
              wrongPath.setAttribute('stroke-dasharray', '6,4');
              wrongPath.setAttribute('fill', 'none');
              linesGroup.appendChild(wrongPath);
            }
          }

          // 顯示標準正解：綠色虛線指引
          if (options.showAnswers !== false && correctRight) {
            const correctRightCard = wrapper.querySelector(`.matching-card-right[data-right-text="${CSS.escape(correctRight)}"]`);
            if (correctRightCard) {
              const rightDot = correctRightCard.querySelector('.matching-dot-left');
              const rightDotRect = rightDot.getBoundingClientRect();
              const x2 = (rightDotRect.left + rightDotRect.width / 2) - wrapperRect.left;
              const y2 = (rightDotRect.top + rightDotRect.height / 2) - wrapperRect.top;

              const solPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              solPath.setAttribute('d', this.calcBezierPath(x1, y1, x2, y2));
              solPath.setAttribute('class', 'matching-line-solution');
              solPath.setAttribute('stroke', '#34c759');
              solPath.setAttribute('stroke-width', '2.5');
              solPath.setAttribute('stroke-dasharray', '4,3');
              solPath.setAttribute('opacity', '0.75');
              solPath.setAttribute('fill', 'none');
              linesGroup.appendChild(solPath);
            }
          }
        }
      });

      // 更新狀態標籤
      const statusEl = document.getElementById(`${boardId}_status`);
      if (statusEl) {
        statusEl.innerHTML = `配對成果：<strong style="color: ${correctCount === totalPairs ? 'var(--success-color)' : 'var(--danger-color)'};">${correctCount} / ${totalPairs} 正確</strong>`;
      }

      return {
        correctCount,
        totalPairs,
        accuracy: totalPairs > 0 ? Math.round((correctCount / totalPairs) * 100) : 0,
        isAllCorrect: correctCount === totalPairs
      };
    },

    /**
     * 取得目前作答連線
     */
    getConnections(container) {
      if (!container || !container._matchingState) return {};
      return { ...container._matchingState.connections };
    },

    /**
     * HTML 跳脫防護
     */
    escapeHtml(text) {
      if (text === null || text === undefined) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  };

  // 掛載至全域
  global.MatchingQuizEngine = MatchingQuizEngine;

})(typeof window !== 'undefined' ? window : globalThis);
