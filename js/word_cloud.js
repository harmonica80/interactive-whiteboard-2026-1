// 即時互動文字雲系統 (Interactive Real-Time Word Cloud Assessment & Interactive System)
// 支援：純文字出題、圖片出題 (剪貼簿 Ctrl+V 貼上 / 檔案拖曳上傳)、多重提交限制、熱門詞頻排行、即時 Canvas 螺旋佈局演算、不當詞彙一鍵遮蔽、成果匯出 PNG
(function (global) {
  'use strict';

  // 預設鮮豔活潑色彩盤 (支援自適應深淺色)
  const CLOUD_PALETTES = [
    ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1'],
    ['#e11d48', '#be185d', '#a21caf', '#7c3aed', '#4338ca', '#1d4ed8', '#0369a1', '#0e7490', '#0f766e', '#047857'],
    ['#ff007f', '#7928ca', '#0070f3', '#00dfd8', '#79ffe1', '#f5a623', '#50e3c2', '#ff4081', '#00e676', '#ff9100']
  ];

  class WordCloudManager {
    constructor() {
      this.activeActivity = null;
      this.submissions = {};
      this.hiddenWords = new Set();
      this.currentPalette = 0;
      this.wordsData = [];
      this.placedWords = [];
      this.animFrameId = null;
      this.isSubmitting = false;
      this.uploadedImageUrl = null;
      this.maxSubmissionsPerStudent = 1; // 預設每人 1 次，可選 3 次或不限 (0)
      this.maxWordLength = 15;
      this.focusWords = new Set();
      this.wordOrientation = 'mixed'; // 'horizontal' | 'vertical' | 'mixed' | 'tilt30' | 'tilt45'
      this.cloudShape = 'circle'; // 'circle' | 'rectangle' | 'cloud' | 'heart' | 'star' | 'custom'
      this.customMaskImg = null;
      this.customMaskUrl = null;
      this.customMaskCanvas = null;
      this.customMaskCtx = null;
      this.knownSubmissionKeys = new Set();
      this.historyBank = {};
      this.wcZoom = 1;
      this.wcPanX = 0;
      this.wcPanY = 0;
      
      this.initFirebaseListeners();
      this.initClipboardPasteListener();
      if (document.readyState === 'loading') {
        document.addEventListener('board-ready', () => this.initCanvasPinchZoom());
      } else {
        this.initCanvasPinchZoom();
      }

      document.addEventListener('fullscreenchange', () => {
        this.updateFullscreenButtonUI();
        setTimeout(() => this.recalculateAndRender(), 150);
      });
      document.addEventListener('webkitfullscreenchange', () => {
        this.updateFullscreenButtonUI();
        setTimeout(() => this.recalculateAndRender(), 150);
      });
    }

    // 取得目前使用者正確顯示名稱 (修正文字雲提交時顯示為「匿名同學」的問題)
    getCurrentStudentName() {
      const nameFromApp = (window.app && typeof window.app.getCurrentUserName === 'function')
        ? window.app.getCurrentUserName()
        : (window.app?.currentUserName || '');
      const clean = (
        nameFromApp ||
        (window.ClassRoomManager && typeof window.ClassRoomManager.getUserName === 'function' && window.ClassRoomManager.getUserName()) ||
        window.boardStorage.local.getItem('user_nickname') ||
        window.boardStorage.local.getItem('user_name') ||
        window.boardStorage.local.getItem('comment_nickname') ||
        ''
      ).trim();
      return clean || (window.app?.isAdmin ? '老師' : '同學');
    }

    getCurrentStudentId() {
      return (
        (window.app && typeof window.app.getUserId === 'function' && window.app.getUserId()) ||
        window.app?.currentUserId ||
        window.boardStorage.local.getItem('wb_user_uid') ||
        ''
      );
    }

    // 支援行動裝置雙指縮放與平移文字雲畫布 (Item 10)
    initCanvasPinchZoom() {
      const wrapper = document.getElementById('wcCanvasWrapper');
      const canvas = document.getElementById('wordCloudCanvas');
      if (!wrapper || !canvas || wrapper._wcPinchBound) return;
      wrapper._wcPinchBound = true;
      wrapper.style.overflow = 'hidden';
      wrapper.style.position = 'relative';
      canvas.style.transformOrigin = '0 0';

      let isPinching = false;
      let isOneFingerPanning = false;
      let pinchStartDist = 0;
      let pinchStartZoom = 1;
      let pinchLastMid = { x: 0, y: 0 };
      let panLastPt = { x: 0, y: 0 };

      const applyTransform = () => {
        if (this.wcZoom <= 1.02) {
          this.wcZoom = 1;
          this.wcPanX = 0;
          this.wcPanY = 0;
          canvas.style.transform = '';
          wrapper.style.touchAction = 'pan-y';
        } else {
          const w = wrapper.clientWidth || 340;
          const h = wrapper.clientHeight || 300;
          const minX = w - w * this.wcZoom;
          const minY = h - h * this.wcZoom;
          this.wcPanX = Math.min(0, Math.max(minX, this.wcPanX));
          this.wcPanY = Math.min(0, Math.max(minY, this.wcPanY));
          canvas.style.transform = `translate(${this.wcPanX}px, ${this.wcPanY}px) scale(${this.wcZoom})`;
          wrapper.style.touchAction = 'none';
        }
      };

      const getDistAndMid = (t0, t1) => {
        const dx = t1.clientX - t0.clientX;
        const dy = t1.clientY - t0.clientY;
        return {
          dist: Math.hypot(dx, dy) || 1,
          midX: (t0.clientX + t1.clientX) / 2,
          midY: (t0.clientY + t1.clientY) / 2
        };
      };

      wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length >= 2) {
          e.preventDefault();
          isPinching = true;
          isOneFingerPanning = false;
          const info = getDistAndMid(e.touches[0], e.touches[1]);
          pinchStartDist = info.dist;
          pinchStartZoom = this.wcZoom || 1;
          pinchLastMid = { x: info.midX, y: info.midY };
        } else if (e.touches.length === 1 && this.wcZoom > 1.02) {
          isOneFingerPanning = true;
          panLastPt = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: false });

      wrapper.addEventListener('touchmove', (e) => {
        if (isPinching && e.touches.length >= 2) {
          e.preventDefault();
          const info = getDistAndMid(e.touches[0], e.touches[1]);
          const rect = wrapper.getBoundingClientRect();
          const cx = info.midX - rect.left;
          const cy = info.midY - rect.top;

          this.wcPanX += (info.midX - pinchLastMid.x);
          this.wcPanY += (info.midY - pinchLastMid.y);
          pinchLastMid = { x: info.midX, y: info.midY };

          const newZoom = Math.max(1, Math.min(4, pinchStartZoom * (info.dist / pinchStartDist)));
          const factor = newZoom / this.wcZoom;
          this.wcPanX = cx - (cx - this.wcPanX) * factor;
          this.wcPanY = cy - (cy - this.wcPanY) * factor;
          this.wcZoom = newZoom;
          applyTransform();
        } else if (isOneFingerPanning && e.touches.length === 1 && this.wcZoom > 1.02) {
          e.preventDefault();
          const dx = e.touches[0].clientX - panLastPt.x;
          const dy = e.touches[0].clientY - panLastPt.y;
          panLastPt = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          this.wcPanX += dx;
          this.wcPanY += dy;
          applyTransform();
        }
      }, { passive: false });

      wrapper.addEventListener('touchend', (e) => {
        if (!e.touches || e.touches.length < 2) {
          isPinching = false;
        }
        if (!e.touches || e.touches.length === 0) {
          isOneFingerPanning = false;
          applyTransform();
        }
      });
    }

    // 初始化 Firebase 監聽
    // 安全跳脫 HTML 特殊字元
    escapeHtml(str) {
      if (str == null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    initFirebaseListeners() {
      if (typeof db === 'undefined') return;

      // 監聽文字雲活動狀態
      db.ref('quiz/wordCloud/active').on('value', (snapshot) => {
        const val = snapshot.val();
        this.activeActivity = val || null;
        if (val) {
          if (val.wordOrientation) this.wordOrientation = val.wordOrientation;
          if (val.cloudShape) this.cloudShape = val.cloudShape;
          if (val.customMaskUrl && val.customMaskUrl !== this.customMaskUrl) {
            this.setCustomMaskFromUrl(val.customMaskUrl);
          }
        }
        this.updateActiveActivityUI();
      });

      // 監聽焦點/重點詞彙 (老師精選放大)
      db.ref('quiz/wordCloud/focusWords').on('value', (snapshot) => {
        const val = snapshot.val();
        this.focusWords = new Set(Array.isArray(val) ? val.map(w => String(w).trim().toLowerCase()) : []);
        this.recalculateAndRender();
      });

      // 監聽提交資料 (含新文字由下往上浮現與3秒晃動)
      db.ref('quiz/wordCloud/submissions').on('value', (snapshot) => {
        const newSubs = snapshot.val() || {};
        const oldKeys = this.knownSubmissionKeys;
        const newKeys = Object.keys(newSubs);

        if (oldKeys.size > 0 && newKeys.length > oldKeys.size) {
          // 找出新提交的項目觸發浮現動畫
          for (let i = 0; i < newKeys.length; i++) {
            const k = newKeys[i];
            if (!oldKeys.has(k)) {
              const sub = newSubs[k];
              if (sub && sub.word) {
                this.showFloatingWordAnnouncement(sub.word, sub.user);
              }
            }
          }
        }
        this.knownSubmissionKeys = new Set(newKeys);
        this.submissions = newSubs;
        this.recalculateAndRender();
      });

      // 監聽教師隱藏的詞彙名單 (自動進行 URL 解碼以相容所有編碼格式)
      db.ref('quiz/wordCloud/hiddenWords').on('value', (snapshot) => {
        const val = snapshot.val();
        const set = new Set();
        if (Array.isArray(val)) {
          val.forEach(item => {
            if (typeof item === 'string') {
              try {
                set.add(decodeURIComponent(item).trim().toLowerCase());
              } catch (e) {
                set.add(item.trim().toLowerCase());
              }
            }
          });
        }
        this.hiddenWords = set;
        this.recalculateAndRender();
      });

      // 監聽文字雲歷史題庫 (保留歷史記錄供後續重複使用與跨班級複製)
      db.ref('quiz/wordCloud/history').on('value', (snapshot) => {
        this.historyBank = snapshot.val() || {};
        this.renderHistoryListUI();
      });
    }

    // 支援直接於網頁或出題區 Ctrl + V 貼上截圖
    initClipboardPasteListener() {
      window.addEventListener('paste', (e) => {
        // 若當前焦點在一般非文字雲圖片輸入框且不是文字雲管理狀態，不攔截
        const activeModal = document.getElementById('adminFeatureModal');
        const isWordCloudAdminOpen = activeModal && activeModal.style.display !== 'none' && activeModal.getAttribute('data-feature') === 'gameWordCloud';
        const panelWordCloud = document.getElementById('panel-word-cloud');
        const isWordCloudTab = panelWordCloud && panelWordCloud.classList.contains('active');

        if (!isWordCloudAdminOpen && !isWordCloudTab && !window.app?.isAdmin) return;

        const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              e.preventDefault();
              this.processAndSetImage(blob);
              break;
            }
          }
        }
      });
    }

    // 處理與壓縮題目圖片 (上限 5MB, 自動最佳化為 WebP/JPEG)
    processAndSetImage(file) {
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) {
        window.app?.showNotification('提示', '圖片大小超過 15MB，請先縮小後再上傳！');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const compressedUrl = canvas.toDataURL('image/webp', 0.82);

          this.uploadedImageUrl = compressedUrl;
          this.renderQuestionImagePreview(compressedUrl);
          window.app?.showNotification('成功', '題目圖片已成功載入！');
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    }

    // 渲染出題圖片預覽
    renderQuestionImagePreview(dataUrl) {
      const container = document.getElementById('wcImagePreviewContainer');
      const adminContainer = document.getElementById('adminWcImagePreviewContainer');
      const html = dataUrl ? `
        <div style="position: relative; display: inline-block; margin-top: 8px;">
          <img src="${dataUrl}" style="max-width: 100%; max-height: 180px; border-radius: 8px; border: 1.5px solid var(--accent-color); box-shadow: 0 4px 12px rgba(0,0,0,0.15);" onclick="window.app?.zoomShareImage('${dataUrl}')" title="點擊放大預覽">
          <button type="button" onclick="window.wordCloud?.removeQuestionImage()" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; font-size: 14px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">✕</button>
        </div>
      ` : '';

      if (container) container.innerHTML = html;
      if (adminContainer) adminContainer.innerHTML = html;
    }

    removeQuestionImage() {
      this.uploadedImageUrl = null;
      this.renderQuestionImagePreview(null);
      const input = document.getElementById('wcImageFileInput');
      if (input) input.value = '';
      const adminInput = document.getElementById('adminWcImageFileInput');
      if (adminInput) adminInput.value = '';
    }

    // 儲存目前文字雲題目與成果至歷史題庫
    saveCurrentToHistory(includeSubmissionsSnapshot = true, showToast = false) {
      if (!window.app?.isAdmin || typeof db === 'undefined') return null;

      const titleInput = document.getElementById('adminWcQuestionTitleInput') || document.getElementById('wcQuestionTitleInput');
      const rawInputTitle = (titleInput?.value || '').trim();
      const act = this.activeActivity;
      const title = rawInputTitle || (act && act.title) || '即時互動文字雲';
      const imageUrl = this.uploadedImageUrl || (act && act.imageUrl) || null;

      const limitSelect = document.getElementById('adminWcLimitSelect') || document.getElementById('wcLimitSelect');
      const limit = (limitSelect && limitSelect.value !== undefined)
        ? parseInt(limitSelect.value, 10)
        : (act && act.limitPerStudent !== undefined ? parseInt(act.limitPerStudent, 10) : 1);

      // 尋找是否已有同標題與同圖片的歷史記錄，避免重複洗版
      let targetKey = (act && act.historyId && this.historyBank[act.historyId]) ? act.historyId : null;
      if (!targetKey) {
        const existingKey = Object.keys(this.historyBank || {}).find(k => {
          const item = this.historyBank[k];
          return item && item.title === title && (item.imageUrl || null) === (imageUrl || null);
        });
        if (existingKey) targetKey = existingKey;
      }
      if (!targetKey) {
        targetKey = 'wch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      }

      const prevRecord = this.historyBank[targetKey] || {};
      const currentSubCount = Object.keys(this.submissions || {}).length;
      const topWordsSnapshot = (this.wordsData || []).slice(0, 30).map(w => ({
        word: w.word,
        count: w.count,
        isFocused: Boolean(w.isFocused)
      }));

      const record = {
        ...prevRecord,
        id: targetKey,
        title: title,
        imageUrl: imageUrl,
        limitPerStudent: limit,
        wordOrientation: this.wordOrientation || (act && act.wordOrientation) || 'mixed',
        cloudShape: this.cloudShape || (act && act.cloudShape) || 'circle',
        customMaskUrl: this.customMaskUrl || (act && act.customMaskUrl) || null,
        createdAt: Date.now()
      };

      if (includeSubmissionsSnapshot && currentSubCount > 0) {
        record.totalSubmissions = currentSubCount;
        record.savedWords = topWordsSnapshot;
        record.savedSubmissions = JSON.parse(JSON.stringify(this.submissions));
      }

      this.historyBank[targetKey] = record;
      db.ref('quiz/wordCloud/history/' + targetKey).set(record).then(() => {
        if (showToast) {
          window.app?.showNotification('💾 已儲存', `文字雲「${title}」已保存至歷史記錄庫！可隨時重複使用或複製至其他班級。`);
        }
      }).catch(err => {
        if (showToast) {
          window.app?.showNotification('錯誤', '儲存歷史記錄失敗: ' + err.message);
        }
      });

      this.renderHistoryListUI();
      return targetKey;
    }

    // 渲染文字雲歷史記錄庫 UI (後台與前台同步顯示)
    renderHistoryListUI() {
      const adminListEl = document.getElementById('wcHistoryList');
      const frontListEl = document.getElementById('wcFrontHistoryList');
      const adminCountEl = document.getElementById('wcHistoryCount');
      const frontCountEl = document.getElementById('wcFrontHistoryCount');

      const keys = Object.keys(this.historyBank || {});
      if (adminCountEl) adminCountEl.textContent = `(${keys.length} 筆)`;
      if (frontCountEl) frontCountEl.textContent = `(${keys.length} 筆)`;

      if (keys.length === 0) {
        const emptyHtml = '<div style="color: var(--text-muted); text-align: center; font-size: 14px; padding: 12px;">目前尚無文字雲歷史記錄（發布題目後將自動保存，方便後續重複使用或複製至其他班級）</div>';
        if (adminListEl) adminListEl.innerHTML = emptyHtml;
        if (frontListEl) frontListEl.innerHTML = emptyHtml;
        this.renderBankListUI();
        return;
      }

      // 支援自訂拖曳順序 order 排序
      const sortedKeys = keys.sort((a, b) => {
        const itemA = this.historyBank[a];
        const itemB = this.historyBank[b];
        const orderA = typeof itemA?.order === 'number' ? itemA.order : null;
        const orderB = typeof itemB?.order === 'number' ? itemB.order : null;
        if (orderA !== null && orderB !== null) return orderA - orderB;
        if (orderA !== null) return -1;
        if (orderB !== null) return 1;
        return (itemB?.createdAt || 0) - (itemA?.createdAt || 0);
      });

      const shapeLabels = {
        circle: '⭕圓形',
        rectangle: '⬛矩形',
        cloud: '☁️白雲',
        heart: '❤️愛心',
        star: '⭐星形',
        custom: '🖼️自訂'
      };

      const html = sortedKeys.map(key => {
        const item = this.historyBank[key];
        if (!item) return '';
        const hasImg = Boolean(item.imageUrl);
        const badgeText = hasImg ? '🖼️ 圖文題' : '📝 文字題';
        const badgeBg = hasImg ? 'rgba(139,92,246,0.12)' : 'rgba(37,99,235,0.1)';
        const badgeColor = hasImg ? '#7c3aed' : 'var(--accent-color)';
        const limitVal = item.limitPerStudent !== undefined ? parseInt(item.limitPerStudent, 10) : 1;
        const limitText = limitVal === 0 ? '不限次數' : `每人限 ${limitVal} 次`;
        const shapeText = shapeLabels[item.cloudShape || 'circle'] || '⭕圓形';
        const topPreview = Array.isArray(item.savedWords) && item.savedWords.length > 0
          ? `熱門詞：${item.savedWords.slice(0, 5).map(w => `${w.word}(${w.count})`).join('、')}（共 ${item.totalSubmissions || item.savedWords.length} 則）`
          : '尚未有作答快照（可直接載入或發布）';
        const hasSnapshot = Boolean((item.savedSubmissions && Object.keys(item.savedSubmissions).length > 0) || (Array.isArray(item.savedWords) && item.savedWords.length > 0));

        return `
          <div class="wc-history-item draggable-wc-history-item" draggable="true" data-history-key="${key}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; gap: 10px; flex-wrap: wrap; cursor: grab;">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 200px;">
              <span class="drag-handle" style="cursor: grab; color: var(--text-muted); font-size: 16px; user-select: none; flex-shrink: 0;" title="按住拖曳調整題目順序">☰</span>
              ${hasImg ? `<img src="${item.imageUrl}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-color); flex-shrink: 0; cursor: pointer;" onclick="window.app?.zoomShareImage('${item.imageUrl}')" title="點擊預覽題目圖片">` : ''}
              <div style="display: flex; flex-direction: column; gap: 4px; overflow: hidden; flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 14px; padding: 1px 6px; border-radius: 6px; font-weight: bold; flex-shrink: 0;">${badgeText}</span>
                  <span style="font-weight: bold; font-size: 14px; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${this.escapeHtml(item.title || '即時互動文字雲')}</span>
                  <span style="font-size: 14px; color: var(--text-secondary); background: var(--bg-input); padding: 1px 6px; border-radius: 6px;">${limitText} ‧ ${shapeText}</span>
                </div>
                <div style="font-size: 14px; color: var(--text-secondary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                  ${this.escapeHtml(topPreview)}
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 6px; flex-shrink: 0; flex-wrap: wrap; align-items: center;">
              <button type="button" class="presentation-tool-btn" onclick="window.app && window.app.openSingleItemCopyModal('wordCloud', '${key}')" title="複製此文字雲題目到其他班級">📤 複製他班</button>
              ${hasSnapshot ? `<button type="button" class="presentation-tool-btn purple" onclick="window.wordCloud?.reviewHistorySnapshot('${key}')" title="在畫布上回顧此次文字雲成果">👁️ 回顧成果</button>` : ''}
              <button type="button" class="presentation-tool-btn" onclick="window.wordCloud?.loadFromHistory('${key}', false)" title="帶入此題設定到出題框">📝 載入</button>
              <button type="button" class="presentation-tool-btn active" onclick="window.wordCloud?.loadFromHistory('${key}', true)" title="立即以此題開啟新一輪文字雲">🚀 重新發起</button>
              <button type="button" class="presentation-tool-btn danger" onclick="window.wordCloud?.deleteHistoryItem('${key}')" title="刪除此筆歷史記錄">✕</button>
            </div>
          </div>
        `;
      }).join('');

      if (adminListEl) {
        adminListEl.innerHTML = html;
        this.initHistoryDragAndDrop();
      }
      if (frontListEl) frontListEl.innerHTML = html;
      this.renderBankListUI();
    }

    // 從歷史記錄載入設定或直接重新發起新一輪
    loadFromHistory(key, autoPublish = false) {
      if (!window.app?.isAdmin) return;
      const item = this.historyBank && this.historyBank[key];
      if (!item) {
        window.app?.showNotification('提示', '找不到該筆歷史記錄！');
        return;
      }

      const adminTitleInput = document.getElementById('adminWcQuestionTitleInput');
      if (adminTitleInput) adminTitleInput.value = item.title || '';
      const frontTitleInput = document.getElementById('wcQuestionTitleInput');
      if (frontTitleInput) frontTitleInput.value = item.title || '';

      this.uploadedImageUrl = item.imageUrl || null;
      this.renderQuestionImagePreview(this.uploadedImageUrl);

      const limit = item.limitPerStudent !== undefined ? parseInt(item.limitPerStudent, 10) : 1;
      this.maxSubmissionsPerStudent = limit;
      const adminLimitSel = document.getElementById('adminWcLimitSelect');
      if (adminLimitSel) adminLimitSel.value = String(limit);
      const frontLimitSel = document.getElementById('wcLimitSelect');
      if (frontLimitSel) frontLimitSel.value = String(limit);

      if (item.wordOrientation) {
        this.wordOrientation = item.wordOrientation;
        const ao = document.getElementById('adminWcOrientationSelect');
        if (ao) ao.value = item.wordOrientation;
        const fo = document.getElementById('wcOrientationSelect');
        if (fo) fo.value = item.wordOrientation;
      }
      if (item.cloudShape) {
        this.cloudShape = item.cloudShape;
        const as = document.getElementById('adminWcShapeSelect');
        if (as) as.value = item.cloudShape;
        const fs = document.getElementById('wcShapeSelect');
        if (fs) fs.value = item.cloudShape;
      }
      if (item.customMaskUrl) {
        this.setCustomMaskFromUrl(item.customMaskUrl);
      }

      if (autoPublish) {
        this.publishActivity(false, key);
      } else {
        window.app?.showNotification('📝 已載入', `已帶入歷史題目「${item.title}」，確認後點擊「發布」即可開動！`);
      }
    }

    // 回顧歷史文字雲成果快照 (展示於畫布與排行榜上，並保持鎖定作答狀態)
    reviewHistorySnapshot(key) {
      if (!window.app?.isAdmin || typeof db === 'undefined') return;
      const item = this.historyBank && this.historyBank[key];
      if (!item) return;

      let restoredSubs = {};
      if (item.savedSubmissions && Object.keys(item.savedSubmissions).length > 0) {
        restoredSubs = item.savedSubmissions;
      } else if (Array.isArray(item.savedWords) && item.savedWords.length > 0) {
        let idx = 0;
        item.savedWords.forEach(w => {
          const c = Math.max(1, parseInt(w.count, 10) || 1);
          for (let i = 0; i < c; i++) {
            restoredSubs['restored_' + (++idx)] = {
              word: w.word,
              user: '歷史記錄',
              timestamp: Date.now()
            };
          }
        });
      }

      const payload = {
        sessionId: 'wc_review_' + Date.now(),
        historyId: key,
        title: item.title || '即時互動文字雲',
        imageUrl: item.imageUrl || null,
        limitPerStudent: item.limitPerStudent !== undefined ? parseInt(item.limitPerStudent, 10) : 1,
        wordOrientation: item.wordOrientation || 'mixed',
        cloudShape: item.cloudShape || 'circle',
        customMaskUrl: item.customMaskUrl || null,
        active: true,
        accepting: false,
        timestamp: Date.now(),
        creator: this.getCurrentStudentName() || '老師'
      };

      Promise.all([
        db.ref('quiz/wordCloud/active').set(payload),
        db.ref('quiz/wordCloud/submissions').set(restoredSubs),
        db.ref('quiz/wordCloud/hiddenWords').remove()
      ]).then(() => {
        window.app?.switchToTab('panel-word-cloud');
        window.app?.showNotification('👁️ 歷史成果回顧', `已載入「${item.title}」的歷史文字雲成果（目前為鎖定觀看狀態，點擊「恢復作答」可讓學生繼續補充）。`);
      });
    }

    // 刪除單筆文字雲歷史記錄
    deleteHistoryItem(key) {
      if (!window.app?.isAdmin || !key) return;
      const item = this.historyBank && this.historyBank[key];
      const title = (item && item.title) || '此筆文字雲記錄';
      window.app?.showConfirmModal(
        '🗑️',
        `確定要刪除「${title}」嗎？`,
        '刪除後將無法從歷史記錄庫中再次載入此題目。',
        () => {
          delete this.historyBank[key];
          db.ref('quiz/wordCloud/history/' + key).remove().then(() => {
            this.renderHistoryListUI();
            window.app?.showNotification('成功', '已刪除該筆文字雲歷史記錄！');
          });
        }
      );
    }

    // 清空全部文字雲歷史記錄庫
    clearHistoryBank() {
      if (!window.app?.isAdmin) return;
      if (!this.historyBank || Object.keys(this.historyBank).length === 0) {
        window.app?.showNotification('提示', '目前文字雲歷史記錄庫已經是空的！');
        return;
      }
      window.app?.showConfirmModal(
        '🗑️',
        '確定要清空全部文字雲歷史記錄庫嗎？',
        '這將移除本班所有保存的文字雲歷史題目與成果，此動作無法復原。',
        () => {
          this.historyBank = {};
          db.ref('quiz/wordCloud/history').remove().then(() => {
            this.renderHistoryListUI();
            window.app?.showNotification('成功', '已清空文字雲歷史記錄庫！');
          });
        }
      );
    }

    // 切換文字雲後台雙頁籤 (歷次題目庫 vs 題庫管理)
    switchWcSubTab(tabName) {
      const btnHistory = document.getElementById('btnSubTabWcHistory');
      const btnBank = document.getElementById('btnSubTabWcBank');
      const paneHistory = document.getElementById('wcSubTabPaneHistory');
      const paneBank = document.getElementById('wcSubTabPaneBank');

      if (tabName === 'bank') {
        if (btnHistory) btnHistory.classList.remove('active');
        if (btnBank) btnBank.classList.add('active');
        if (paneHistory) paneHistory.style.display = 'none';
        if (paneBank) paneBank.style.display = 'block';
        this.renderBankListUI();
      } else {
        if (btnBank) btnBank.classList.remove('active');
        if (btnHistory) btnHistory.classList.add('active');
        if (paneBank) paneBank.style.display = 'none';
        if (paneHistory) paneHistory.style.display = 'block';
        this.renderHistoryListUI();
      }
    }

    // 切換格式說明對話框分頁
    switchFormatGuideTab(fmt) {
      ['Txt', 'Json', 'Csv'].forEach(type => {
        const btn = document.getElementById(`tabWcFormat${type}`);
        const pane = document.getElementById(`wcFormatGuidePane${type}`);
        const isTarget = type.toLowerCase() === fmt.toLowerCase();
        if (btn) btn.classList.toggle('active', isTarget);
        if (pane) pane.style.display = isTarget ? 'block' : 'none';
      });
    }

    // 建立新題目：重設出題表單以利輸入
    openCreateNewTopic() {
      if (!window.app?.isAdmin) return;
      const adminTitleInput = document.getElementById('adminWcQuestionTitleInput');
      if (adminTitleInput) {
        adminTitleInput.value = '';
        adminTitleInput.focus();
      }
      this.uploadedImageUrl = null;
      this.renderQuestionImagePreview(null);
      const limitSel = document.getElementById('adminWcLimitSelect');
      if (limitSel) limitSel.value = '1';
      this.maxSubmissionsPerStudent = 1;

      const adminSection = document.getElementById('adminWordCloudSection');
      if (adminSection) {
        adminSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.app?.showNotification('➕ 建立新題目', '請在上方出題框輸入題目標題或引導詞，完成後點選「🚀 發布」或「💾 儲存至歷史題庫」！');
    }

    // 開啟下載範例檔格式選擇彈窗
    openDownloadSampleModal() {
      if (!window.app || typeof window.app.openBankFormatPickerModal !== 'function') {
        this.downloadSampleTemplateJSON();
        return;
      }
      window.app.openBankFormatPickerModal({
        title: '下載文字雲題目範例檔',
        icon: '⬇️',
        desc: '請選擇您想要下載的範例檔格式，編輯後即可匯入出題：',
        options: [
          {
            icon: '📄',
            title: 'JSON 格式範例檔 (.json)',
            desc: '完整文字雲題目結構，包含標題、每人作答次數限制與詞雲形狀',
            badge: '推薦',
            action: () => this.downloadSampleTemplateJSON()
          },
          {
            icon: '📊',
            title: 'CSV 試算表範例檔 (.csv)',
            desc: '可直接使用 Excel 或 Google 試算表開啟編輯文字雲題目清單',
            badge: '常用',
            action: () => this.downloadSampleTemplateCSV()
          }
        ]
      });
    }

    // 開啟匯出題庫格式選擇彈窗
    openExportModal() {
      const keys = Object.keys(this.historyBank || {});
      if (keys.length === 0) {
        if (window.app) window.app.showNotification('提示', '目前文字雲題庫中沒有題目可供匯出！');
        return;
      }
      if (!window.app || typeof window.app.openBankFormatPickerModal !== 'function') {
        this.exportWordCloudJSON();
        return;
      }
      window.app.openBankFormatPickerModal({
        title: '匯出文字雲題庫',
        icon: '📤',
        desc: `目前文字雲題庫共 ${keys.length} 道題目，請選擇匯出備份格式：`,
        options: [
          {
            icon: '📄',
            title: '匯出 JSON 格式備份檔 (.json)',
            desc: '完整保留所有文字雲題目設定、作答次數限制與形狀配置',
            badge: '推薦備份',
            action: () => this.exportWordCloudJSON()
          },
          {
            icon: '📊',
            title: '匯出 CSV 試算表檔 (.csv)',
            desc: '適合使用 Excel 或試算表開啟檢視或批次調整題目',
            badge: 'Excel 試算表',
            action: () => this.exportWordCloudCSV()
          }
        ]
      });
    }

    // 下載文字雲題庫 JSON 範例檔
    downloadSampleTemplateJSON() {
      const templateData = [
        {
          title: "請用一個詞形容今天學到的核心觀念？",
          limitPerStudent: 1,
          cloudShape: "circle"
        },
        {
          title: "看完這部引導影片，你最深刻的三個感受是什麼？",
          limitPerStudent: 3,
          cloudShape: "cloud"
        },
        {
          title: "請為我們今天的團隊合作打出一個代表字！",
          limitPerStudent: 1,
          cloudShape: "heart"
        },
        {
          title: "你認為未來的綠能科技最關鍵的要素是什麼？",
          limitPerStudent: 0,
          cloudShape: "star"
        }
      ];

      const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wordcloud_template.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.app?.showNotification('成功', '已下載文字雲 JSON 範例格式檔！');
    }

    // 下載文字雲題庫 CSV 範例檔
    downloadSampleTemplateCSV() {
      let csv = '\uFEFF題目標題/引導詞,每人作答次數(1/3/0),外框形狀(circle/cloud/heart/star),題目圖片網址(選填)\r\n';
      csv += '"請用一個詞形容今天學到的核心觀念？",1,"circle",""\r\n';
      csv += '"看完這部引導影片，你最深刻的三個感受是什麼？",3,"cloud",""\r\n';
      csv += '"請為我們今天的團隊合作打出一個代表字！",1,"heart",""\r\n';
      csv += '"你認為未來的綠能科技最關鍵的要素是什麼？",0,"star",""\r\n';

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wordcloud_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.app?.showNotification('成功', '已下載文字雲 CSV 範例格式檔！');
    }

    // 匯出全部文字雲題庫備份 (JSON)
    exportWordCloudJSON() {
      const keys = Object.keys(this.historyBank || {});
      if (keys.length === 0) {
        window.app?.showNotification('提示', '題庫目前沒有任何題目可供匯出！');
        return;
      }
      const list = keys.map(k => this.historyBank[k]).filter(Boolean);
      const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wordcloud_bank_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.app?.showNotification('成功', `已順利匯出全部 ${list.length} 道文字雲題目 (JSON)！`);
    }

    // 匯出全部文字雲題庫備份 (CSV)
    exportWordCloudCSV() {
      const keys = Object.keys(this.historyBank || {});
      if (keys.length === 0) {
        window.app?.showNotification('提示', '題庫目前沒有任何題目可供匯出！');
        return;
      }
      let csv = '\uFEFF題目標題/引導詞,每人作答次數(1/3/0),外框形狀(circle/cloud/heart/star),題目圖片網址(選填)\r\n';
      keys.forEach(k => {
        const item = this.historyBank[k];
        if (!item) return;
        const title = (item.title || '').replace(/"/g, '""');
        const limit = item.limitPerStudent !== undefined ? item.limitPerStudent : 1;
        const shape = (item.cloudShape || 'circle').replace(/"/g, '""');
        const img = (item.imageUrl || '').replace(/"/g, '""');
        csv += `"${title}",${limit},"${shape}","${img}"\r\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wordcloud_bank_backup_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.app?.showNotification('成功', `已順利匯出全部 ${keys.length} 道文字雲題目 (CSV)！`);
    }

    // 匯出文字雲題庫 TXT
    exportWordCloudTxt() {
      const keys = Object.keys(this.historyBank || {});
      if (keys.length === 0) {
        window.app?.showNotification('提示', '題庫目前沒有任何題目可供匯出！');
        return;
      }
      let txt = '';
      keys.forEach((k, idx) => {
        const item = this.historyBank[k];
        if (!item) return;
        const title = (item.title || '即時互動文字雲').trim();
        const limit = item.limitPerStudent !== undefined ? item.limitPerStudent : 1;
        const shape = item.cloudShape || 'circle';
        txt += `${title} | ${limit} | ${shape}\r\n`;
        if (idx < keys.length - 1) {
          txt += '---\r\n';
        }
      });

      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wordcloud_bank_backup_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.app?.showNotification('成功', `已順利匯出全部 ${keys.length} 道文字雲題目 (TXT)！`);
    }

    // 搜尋與篩選題庫
    filterBankQuestions(query) {
      this.bankSearchQuery = (query || '').trim().toLowerCase();
      this.renderBankListUI();
    }

    // 渲染題庫管理列表
    renderBankListUI() {
      const listContainer = document.getElementById('wcBankListContainer');
      if (!listContainer) return;

      const keys = Object.keys(this.historyBank || {});
      if (keys.length === 0) {
        listContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-size: 14px; padding: 24px; background: var(--bg-card); border-radius: 10px; border: 1px dashed var(--border-color);">目前文字雲題庫無題目。您可以點選上方「➕ 建立新題目」出題，或點選「📥 匯入題庫」批次匯入題庫檔案！</div>';
        return;
      }

      const query = (this.bankSearchQuery || '').toLowerCase();

      // 依 order 排序
      const sortedKeys = keys.sort((a, b) => {
        const itemA = this.historyBank[a];
        const itemB = this.historyBank[b];
        const orderA = typeof itemA?.order === 'number' ? itemA.order : null;
        const orderB = typeof itemB?.order === 'number' ? itemB.order : null;
        if (orderA !== null && orderB !== null) return orderA - orderB;
        if (orderA !== null) return -1;
        if (orderB !== null) return 1;
        return (itemB?.createdAt || 0) - (itemA?.createdAt || 0);
      });

      const filteredKeys = sortedKeys.filter(k => {
        if (!query) return true;
        const item = this.historyBank[k];
        if (!item) return false;
        const title = (item.title || '').toLowerCase();
        return title.includes(query);
      });

      if (filteredKeys.length === 0) {
        listContainer.innerHTML = `<div style="color: var(--text-muted); text-align: center; font-size: 14px; padding: 18px; background: var(--bg-card); border-radius: 10px;">查無符合「${this.escapeHtml(this.bankSearchQuery)}」的文字雲題目</div>`;
        return;
      }

      const shapeLabels = {
        circle: '⭕圓形',
        rectangle: '⬛矩形',
        cloud: '☁️白雲',
        heart: '❤️愛心',
        star: '⭐星形',
        custom: '🖼️自訂'
      };

      listContainer.innerHTML = filteredKeys.map(key => {
        const item = this.historyBank[key];
        const hasImg = Boolean(item.imageUrl);
        const badgeText = hasImg ? '🖼️ 圖文題' : '📝 文字題';
        const badgeBg = hasImg ? 'rgba(139,92,246,0.12)' : 'rgba(37,99,235,0.1)';
        const badgeColor = hasImg ? '#7c3aed' : 'var(--accent-color)';
        const limitVal = item.limitPerStudent !== undefined ? parseInt(item.limitPerStudent, 10) : 1;
        const limitText = limitVal === 0 ? '不限次數' : `每人限 ${limitVal} 次`;
        const shapeText = shapeLabels[item.cloudShape || 'circle'] || '⭕圓形';
        const title = item.title || '即時互動文字雲';

        return `
          <div class="wc-history-item draggable-wc-bank-item" draggable="true" data-history-key="${key}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: 10px; gap: 10px; cursor: grab; transition: transform 0.15s, box-shadow 0.15s; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 200px;">
              <span class="drag-handle" style="cursor: grab; color: var(--text-muted); font-size: 16px; user-select: none; flex-shrink: 0;" title="按住拖曳調整題目順序">☰</span>
              ${hasImg ? `<img src="${item.imageUrl}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-color); flex-shrink: 0; cursor: pointer;" onclick="window.app?.zoomShareImage('${item.imageUrl}')" title="點擊預覽題目圖片">` : ''}
              <div style="display: flex; flex-direction: column; gap: 4px; overflow: hidden; flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 14px; padding: 1px 6px; border-radius: 6px; font-weight: bold; flex-shrink: 0;">${badgeText}</span>
                  <span style="font-weight: bold; font-size: 14px; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${this.escapeHtml(title)}</span>
                </div>
                <div style="font-size: 14px; color: var(--text-secondary);">
                  設定：${limitText} ‧ ${shapeText}
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 6px; flex-shrink: 0; align-items: center; flex-wrap: wrap;">
              <button type="button" class="presentation-tool-btn active" onclick="window.wordCloud?.loadFromHistory('${key}', true)" style="height: 32px; padding: 0 12px; font-size: 14px; border-radius: 10px; font-weight: bold; display: flex; align-items: center; gap: 4px;" title="帶入此題並立即開動">🚀 載入出題</button>
              <button type="button" class="presentation-tool-btn" onclick="window.wordCloud?.loadFromHistory('${key}', false)" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; font-weight: bold; display: flex; align-items: center; gap: 4px;" title="帶入設定至出題框">📝 載入修改</button>
              <button type="button" class="presentation-tool-btn" onclick="window.app && window.app.openSingleItemCopyModal('wordCloud', '${key}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; font-weight: bold; color: var(--accent-color); border-color: var(--accent-color); display: flex; align-items: center; gap: 4px;" title="複製此題到其他班級題庫">📤 複製</button>
              <button type="button" class="presentation-tool-btn danger" onclick="window.wordCloud?.deleteHistoryItem('${key}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; display: flex; align-items: center; gap: 4px;" title="刪除此題">🗑️</button>
            </div>
          </div>
        `;
      }).join('');

      this.initBankDragAndDrop();
    }

    // 題庫管理卡片拖曳排序
    initBankDragAndDrop() {
      const container = document.getElementById('wcBankListContainer');
      if (!container) return;

      const cards = container.querySelectorAll('.draggable-wc-bank-item');
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

          const currentCards = [...container.querySelectorAll('.draggable-wc-bank-item')];
          const updates = {};
          currentCards.forEach((c, idx) => {
            const key = c.dataset.historyKey;
            if (key && this.historyBank[key]) {
              this.historyBank[key].order = idx;
              updates[`quiz/wordCloud/history/${key}/order`] = idx;
            }
          });
          if (typeof db !== 'undefined' && Object.keys(updates).length > 0) {
            db.ref().update(updates);
          }
        });
      });

      if (!container._dragOverHandler) {
        container._dragOverHandler = (e) => {
          e.preventDefault();
          const dragging = container.querySelector('.dragging-bank-item');
          if (!dragging) return;
          const afterElement = this.getDragAfterElement(container, e.clientY, '.draggable-wc-bank-item');
          if (!afterElement) {
            container.appendChild(dragging);
          } else {
            container.insertBefore(dragging, afterElement);
          }
        };
        container.addEventListener('dragover', container._dragOverHandler);
      }
    }

    // 歷次題目庫卡片拖曳排序
    initHistoryDragAndDrop() {
      const container = document.getElementById('wcHistoryList');
      if (!container) return;

      const cards = container.querySelectorAll('.draggable-wc-history-item');
      cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
          if (['INPUT', 'BUTTON', 'SELECT', 'A', 'TEXTAREA'].includes(e.target.tagName)) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.effectAllowed = 'move';
          card.classList.add('dragging-history-item');
          card.style.opacity = '0.5';
        });

        card.addEventListener('dragend', () => {
          card.classList.remove('dragging-history-item');
          card.style.opacity = '1';

          const currentCards = [...container.querySelectorAll('.draggable-wc-history-item')];
          const updates = {};
          currentCards.forEach((c, idx) => {
            const key = c.dataset.historyKey;
            if (key && this.historyBank[key]) {
              this.historyBank[key].order = idx;
              updates[`quiz/wordCloud/history/${key}/order`] = idx;
            }
          });
          if (typeof db !== 'undefined' && Object.keys(updates).length > 0) {
            db.ref().update(updates);
          }
        });
      });

      if (!container._dragOverHandler) {
        container._dragOverHandler = (e) => {
          e.preventDefault();
          const dragging = container.querySelector('.dragging-history-item');
          if (!dragging) return;
          const afterElement = this.getDragAfterElement(container, e.clientY, '.draggable-wc-history-item');
          if (!afterElement) {
            container.appendChild(dragging);
          } else {
            container.insertBefore(dragging, afterElement);
          }
        };
        container.addEventListener('dragover', container._dragOverHandler);
      }
    }

    getDragAfterElement(container, y, selector) {
      const draggableElements = [...container.querySelectorAll(`${selector}:not(.dragging-bank-item):not(.dragging-history-item)`)];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // 統一匯入題庫檔案 (支援 .json / .csv / .txt)
    importWordCloudBankUnifiedFile(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const fileName = (file.name || '').toLowerCase();
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const textContent = e.target.result;
          let items = [];

          if (fileName.endsWith('.json') || (textContent.trim().startsWith('[') && textContent.trim().endsWith(']'))) {
            try {
              const parsed = JSON.parse(textContent);
              if (Array.isArray(parsed)) {
                items = parsed.map(p => ({
                  title: (p.title || p.question || '').trim(),
                  limitPerStudent: p.limitPerStudent !== undefined ? parseInt(p.limitPerStudent, 10) : 1,
                  cloudShape: p.cloudShape || 'circle',
                  imageUrl: p.imageUrl || null
                })).filter(p => p.title.length > 0);
              }
            } catch (err) {
              console.warn('JSON parse failed', err);
            }
          }

          if (items.length === 0 && (fileName.endsWith('.csv') || textContent.includes(','))) {
            items = this.parseWordCloudCSV(textContent);
          }

          if (items.length === 0) {
            items = this.parseWordCloudTXT(textContent);
          }

          if (items.length === 0) {
            window.app?.showNotification('錯誤', '匯入失敗：格式無法解析，請參考範例格式說明！');
            return;
          }

          let addedCount = 0;
          items.forEach((item, idx) => {
            const key = 'wch_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).substr(2, 4);
            const record = {
              id: key,
              title: item.title,
              limitPerStudent: item.limitPerStudent !== undefined ? item.limitPerStudent : 1,
              cloudShape: item.cloudShape || 'circle',
              imageUrl: item.imageUrl || null,
              createdAt: Date.now() + idx,
              order: idx
            };
            this.historyBank[key] = record;
            if (typeof db !== 'undefined') {
              db.ref('quiz/wordCloud/history/' + key).set(record);
            }
            addedCount++;
          });

          this.renderHistoryListUI();
          this.renderBankListUI();

          // 自動帶入第一題到出題框
          if (items.length > 0) {
            const firstKey = Object.keys(this.historyBank).find(k => this.historyBank[k]?.title === items[0].title);
            if (firstKey) {
              this.loadFromHistory(firstKey, false);
            }
          }

          window.app?.showNotification('成功', `已成功解析並匯入 ${addedCount} 道題目至文字雲題庫！第一題已帶入出題框。`);
        } catch (err) {
          window.app?.showNotification('錯誤', '解析檔案失敗：' + err.message);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    // 解析 CSV 文字雲題目
    parseWordCloudCSV(csvText) {
      if (!csvText) return [];
      if (csvText.charCodeAt(0) === 0xFEFF) {
        csvText = csvText.slice(1);
      }
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length <= 1) return [];

      const items = [];
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

        const title = (cells[0] || '').trim();
        if (!title) continue;

        const limitVal = cells[1] !== undefined ? parseInt(cells[1], 10) : 1;
        const shape = (cells[2] || 'circle').trim();
        const imageUrl = (cells[3] || '').trim() || null;

        items.push({
          title: title,
          limitPerStudent: isNaN(limitVal) ? 1 : limitVal,
          cloudShape: shape || 'circle',
          imageUrl: imageUrl
        });
      }
      return items;
    }

    // 解析 TXT 文字雲題目
    parseWordCloudTXT(txtText) {
      if (!txtText) return [];
      const blocks = txtText.split(/---+/).map(b => b.trim()).filter(Boolean);
      const items = [];

      blocks.forEach(block => {
        const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        lines.forEach(line => {
          if (!line) return;
          const parts = line.split('|').map(p => p.trim());
          const title = parts[0];
          if (!title) return;
          let limit = 1;
          let shape = 'circle';
          if (parts[1]) {
            const parsedLimit = parseInt(parts[1], 10);
            if (!isNaN(parsedLimit)) limit = parsedLimit;
          }
          if (parts[2]) {
            shape = parts[2];
          }
          items.push({
            title: title,
            limitPerStudent: limit,
            cloudShape: shape,
            imageUrl: null
          });
        });
      });

      return items;
    }

    // 發布或開啟新一輪文字雲活動
    publishActivity(isNewRound = false, explicitHistoryKey = null) {
      if (!window.app?.isAdmin) return;

      // 若上一輪有學生提交的詞彙，先自動歸檔保存至歷史記錄，確保成果不遺失
      if (this.activeActivity && Object.keys(this.submissions || {}).length > 0) {
        this.saveCurrentToHistory(true, false);
      }

      const titleInput = document.getElementById('adminWcQuestionTitleInput') || document.getElementById('wcQuestionTitleInput');
      const title = (titleInput?.value || '').trim() || (this.activeActivity && this.activeActivity.title) || '即時互動文字雲';

      const limitSelect = document.getElementById('adminWcLimitSelect') || document.getElementById('wcLimitSelect');
      const limit = (limitSelect && limitSelect.value !== undefined) ? parseInt(limitSelect.value, 10) : 1;

      const sessionId = 'wc_' + Date.now();

      // 自動將此次出題設定存入歷史記錄庫
      let historyId = explicitHistoryKey;
      if (!historyId) {
        const existingKey = Object.keys(this.historyBank || {}).find(k => {
          const item = this.historyBank[k];
          return item && item.title === title && (item.imageUrl || null) === (this.uploadedImageUrl || null);
        });
        historyId = existingKey || ('wch_' + Date.now());
      }

      const historyRecord = {
        ...(this.historyBank[historyId] || {}),
        id: historyId,
        title: title,
        imageUrl: this.uploadedImageUrl || null,
        limitPerStudent: limit,
        wordOrientation: this.wordOrientation || 'mixed',
        cloudShape: this.cloudShape || 'circle',
        customMaskUrl: this.customMaskUrl || null,
        createdAt: Date.now()
      };
      this.historyBank[historyId] = historyRecord;
      db.ref('quiz/wordCloud/history/' + historyId).set(historyRecord);

      const payload = {
        sessionId: sessionId,
        historyId: historyId,
        title: title,
        imageUrl: this.uploadedImageUrl || null,
        limitPerStudent: limit,
        wordOrientation: this.wordOrientation || 'mixed',
        cloudShape: this.cloudShape || 'circle',
        customMaskUrl: this.customMaskUrl || null,
        active: true,
        accepting: true, // 是否持續接收作答
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        creator: this.getCurrentStudentName() || '老師'
      };

      // 每次發布全新活動或新一輪時，徹底清除舊提交記錄與隱藏名單，確保全班同學皆可重新提交
      db.ref('quiz/wordCloud/submissions').remove();
      db.ref('quiz/wordCloud/hiddenWords').remove();
      this.submissions = {};
      this.hiddenWords.clear();
      this.recalculateAndRender();

      // 寫入 Firebase
      db.ref('quiz/wordCloud/active').set(payload).then(() => {
        window.app?.showNotification('成功', isNewRound ? '已成功開啟新一輪文字雲！全班同學已可再次作答。' : '即時文字雲活動已成功發布！全班同學端將同步接收。');
        this.broadcastToClass();
      }).catch(err => {
        window.app?.showNotification('錯誤', '發布失敗: ' + err.message);
      });
    }

    // 重設並開啟新一輪活動
    restartOrNewRound() {
      if (!window.app?.isAdmin) return;
      window.app?.showConfirmModal(
        '🔄',
        '確定要開啟新一輪文字雲活動嗎？',
        '這將重設所有同學的提交次數並清空畫布，讓全班重新進行文字雲作答。',
        () => {
          this.publishActivity(true);
        }
      );
    }

    // 即時調整學生提交次數限制
    changeSubmissionLimit(newLimit) {
      if (!window.app?.isAdmin) return;
      const limit = parseInt(newLimit, 10);
      this.maxSubmissionsPerStudent = limit;

      const frontSel = document.getElementById('wcLimitSelect');
      if (frontSel && String(frontSel.value) !== String(limit)) frontSel.value = limit;
      const adminSel = document.getElementById('adminWcLimitSelect');
      if (adminSel && String(adminSel.value) !== String(limit)) adminSel.value = limit;

      if (this.activeActivity) {
        db.ref('quiz/wordCloud/active/limitPerStudent').set(limit).then(() => {
          window.app?.showNotification('設定更新', `每人提交上限已調整為：${limit === 0 ? '不限次數' : limit + ' 次'}`);
        }).catch(err => {
          window.app?.showNotification('錯誤', '設定更新失敗: ' + err.message);
        });
      } else {
        window.app?.showNotification('設定更新', `已預設每人提交上限為：${limit === 0 ? '不限次數' : limit + ' 次'}`);
      }
    }

    // 廣播至全班切換分頁 (若活動處於結束或未開放，自動重新激活並允許提交)
    broadcastToClass() {
      if (!window.app?.isAdmin) return;
      const updates = {
        broadcastTimestamp: Date.now()
      };
      // 若活動處於結束或未啟用狀態，廣播全班時應自動恢復為進行中與開放作答
      if (!this.activeActivity || !this.activeActivity.active) {
        updates.active = true;
        updates.accepting = true;
        updates.roundTimestamp = Date.now();
        if (!this.activeActivity?.sessionId) {
          updates.sessionId = 'wc_' + Date.now();
        }
      } else if (this.activeActivity.accepting === false) {
        updates.accepting = true;
      }
      db.ref('quiz/wordCloud/active').update(updates).then(() => {
        window.app?.showNotification('廣播成功', '已通知全班切換至即時文字雲畫面並開放作答！');
      }).catch(err => {
        window.app?.showNotification('錯誤', '廣播失敗: ' + err.message);
      });
    }

    // 停止/恢復接收作答 (鎖定作答 / 若已結束則重新開啟)
    toggleAccepting() {
      if (!window.app?.isAdmin) return;
      if (!this.activeActivity) {
        this.publishActivity(false);
        return;
      }
      const nextAccepting = !this.activeActivity.accepting;
      const updates = {
        accepting: nextAccepting
      };
      // 若原本活動已結束 (active === false)，老師點擊開放作答時自動恢復為 active: true
      if (nextAccepting && !this.activeActivity.active) {
        updates.active = true;
        updates.roundTimestamp = Date.now();
      }
      db.ref('quiz/wordCloud/active').update(updates).then(() => {
        window.app?.showNotification('成功', nextAccepting ? '已開放學生提交詞彙！' : '已停止接收提交 (鎖定作答)');
      }).catch(err => {
        window.app?.showNotification('錯誤', '操作失敗: ' + err.message);
      });
    }

    // 結束文字雲活動
    stopActivity() {
      if (!window.app?.isAdmin) return;
      if (!this.activeActivity || !this.activeActivity.active) {
        this.updateActiveActivityUI();
        return;
      }
      window.app?.showConfirmModal(
        '☁️',
        '確定要結束文字雲活動嗎？',
        '結束後學生端將不再顯示作答視窗，本次文字雲題目與成果也會自動保存至歷史記錄庫。',
        () => {
          this.saveCurrentToHistory(true, false);
          if (this.activeActivity) {
            this.activeActivity.active = false;
          }
          this.updateActiveActivityUI();
          db.ref('quiz/wordCloud/active/active').set(false).then(() => {
            this.updateActiveActivityUI();
            window.app?.showNotification('成功', '即時文字雲活動已結束，並已自動保存至歷史記錄庫！');
          });
        }
      );
    }

    // 清空本次文字雲的所有提交資料
    clearSubmissions() {
      if (!window.app?.isAdmin) return;
      window.app?.showConfirmModal(
        '🗑️',
        '確定要清空所有學生提交的詞彙嗎？',
        '這將重設文字雲畫布並清除目前詞頻統計（清空前會自動將目前成果備份至歷史記錄庫）。',
        () => {
          if (Object.keys(this.submissions || {}).length > 0) {
            this.saveCurrentToHistory(true, false);
          }
          db.ref('quiz/wordCloud/submissions').remove().then(() => {
            db.ref('quiz/wordCloud/hiddenWords').remove();
            this.submissions = {};
            this.hiddenWords.clear();
            this.recalculateAndRender();
            window.app?.showNotification('成功', '已成功清空所有文字雲詞彙！');
          });
        }
      );
    }

    // 學生提交詞彙
    submitWord() {
      if (!this.activeActivity || !this.activeActivity.active) {
        window.app?.showNotification('提示', '目前尚無進行中的文字雲活動！');
        return;
      }
      if (this.activeActivity.accepting === false) {
        window.app?.showNotification('提示', '老師已鎖定作答，目前暫停接收提交！');
        return;
      }

      const input = document.getElementById('wcStudentWordInput');
      const rawText = (input?.value || '').trim();
      if (!rawText) {
        window.app?.showNotification('提示', '請輸入詞彙內容！');
        return;
      }

      // 清除過濾多餘符號，長度限制
      const cleanWord = rawText.replace(/[\r\n\t]+/g, ' ').substring(0, this.maxWordLength);

      const studentName = this.getCurrentStudentName();
      const studentId = this.getCurrentStudentId() || (navigator.userAgent + '_' + (studentName));
      
      // 正確判定提交限制：若設定為 0 代表不限次數；避免 0 || 1 誤判為 1
      const limit = (this.activeActivity && this.activeActivity.limitPerStudent !== undefined)
        ? parseInt(this.activeActivity.limitPerStudent, 10)
        : 1;

      const currentSessionId = this.activeActivity.sessionId;

      // 檢查提交次數限制 (limit === 0 為不限次數)
      if (limit > 0) {
        let userSubmitCount = 0;
        const roundStartTs = this.activeActivity.roundTimestamp || this.activeActivity.timestamp || 0;
        for (const key in this.submissions) {
          const item = this.submissions[key];
          if (!item) continue;
          // 若有 sessionId，只統計當前本輪的提交
          if (currentSessionId && item.sessionId && item.sessionId !== currentSessionId) {
            continue;
          }
          // 若本輪有重新開放時間 roundStartTs，排除之前的舊提交
          if (roundStartTs && item.timestamp && item.timestamp < (roundStartTs - 1000)) {
            continue;
          }
          if ((studentId && item.userId === studentId) || item.user === studentName) {
            userSubmitCount++;
          }
        }
        if (userSubmitCount >= limit) {
          window.app?.showNotification('提示', `每位同學最多僅能提交 ${limit} 次，您已達上限！`);
          return;
        }
      }

      if (this.isSubmitting) return;
      this.isSubmitting = true;
      setTimeout(() => { this.isSubmitting = false; }, 4000);

      const payload = {
        sessionId: currentSessionId || null,
        roundTimestamp: this.activeActivity.roundTimestamp || null,
        word: cleanWord,
        user: studentName,
        userId: studentId,
        avatar: (window.app && typeof window.app.getCurrentUserAvatar === 'function' ? window.app.getCurrentUserAvatar() : window.app?.currentUserAvatar) || null,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      db.ref('quiz/wordCloud/submissions').push(payload).then(() => {
        this.isSubmitting = false;
        if (input) input.value = '';
        window.app?.showNotification('🎉 提交成功', `您的詞彙「${cleanWord}」已飛入全班文字雲！`);
        this.showFlyingWordAnimation(cleanWord);
      }).catch(err => {
        this.isSubmitting = false;
        window.app?.showNotification('錯誤', '提交失敗: ' + err.message);
      });
    }

    // 送出成功時的輕快飛入小動畫
    showFlyingWordAnimation(word) {
      const toast = document.createElement('div');
      toast.className = 'wc-flying-word-toast';
      toast.textContent = `✨ ${word} ➔ ☁️`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('fly-up');
        setTimeout(() => toast.remove(), 800);
      }, 50);
    }

    // 隱藏/遮蔽特定不當詞彙 (支援 URI 解碼)
    toggleHideWord(rawWord) {
      if (!window.app?.isAdmin) return;
      let word = rawWord;
      try {
        word = decodeURIComponent(rawWord);
      } catch (e) {
        word = rawWord;
      }
      word = (word || '').trim();
      if (!word) return;

      const lower = word.toLowerCase();
      const isHiding = !this.hiddenWords.has(lower);

      if (isHiding) {
        this.hiddenWords.add(lower);
        window.app?.showNotification('遮蔽詞彙', '已遮蔽隱藏詞彙「' + word + '」！');
      } else {
        this.hiddenWords.delete(lower);
        window.app?.showNotification('取消遮蔽', '已取消遮蔽詞彙「' + word + '」！');
      }

      this.recalculateAndRender();
      db.ref('quiz/wordCloud/hiddenWords').set(Array.from(this.hiddenWords));
    }

    // 全部取消遮蔽
    unhideAllWords() {
      if (!window.app?.isAdmin) return;
      this.hiddenWords.clear();
      db.ref('quiz/wordCloud/hiddenWords').remove();
      this.recalculateAndRender();
      window.app?.showNotification('成功', '已解除所有詞彙之遮蔽！');
    }

    // 獎勵提交特定詞彙的同學或所屬小組
    rewardWordVoters(rawWord) {
      if (!window.app?.isAdmin) return;
      let word = rawWord;
      try { word = decodeURIComponent(rawWord); } catch (e) {}
      word = (word || '').trim();
      if (!word) return;
      const targetKey = word.replace(/^[#＃\s]+|[!！?？,，.\s]+$/g, '').trim().toLowerCase() || word.toLowerCase();

      const uniqueMap = new Map();
      Object.values(this.submissions || {}).forEach(s => {
        if (!s || !s.word) return;
        const cleanW = s.word.trim().replace(/^[#＃\s]+|[!！?？,，.\s]+$/g, '').trim().toLowerCase() || s.word.trim().toLowerCase();
        if (cleanW === targetKey) {
          const uKey = s.userId || s.user || s.userName;
          if (uKey && !uniqueMap.has(uKey)) {
            uniqueMap.set(uKey, { uid: s.userId || '', name: s.user || s.userName || '同學' });
          }
        }
      });

      const targets = Array.from(uniqueMap.values());
      if (targets.length === 0) {
        window.app?.showNotification('提示', `找不到送出詞彙「${word}」的同學記錄！`);
        return;
      }
      window.app?.rewardBatchTargets(targets, `文字雲優質詞彙「${word}」獎勵`);
    }

    // 挑選重點/焦點詞彙（變成最大字級加粗並顯示於中心）
    toggleFocusWord(rawWord) {
      if (!window.app?.isAdmin) return;
      let word = rawWord;
      try { word = decodeURIComponent(rawWord); } catch(e){}
      word = (word || '').trim();
      if (!word) return;

      const lower = word.toLowerCase();
      const isFocused = !this.focusWords.has(lower);

      if (isFocused) {
        this.focusWords.add(lower);
        window.app?.showNotification('⭐ 設為焦點', `已將「${word}」設為重點放大加粗顯示！`);
      } else {
        this.focusWords.delete(lower);
        window.app?.showNotification('取消焦點', `已取消「${word}」的焦點標記。`);
      }

      this.recalculateAndRender();
      db.ref('quiz/wordCloud/focusWords').set(Array.from(this.focusWords));
    }

    // 切換文字方向 (橫式 / 直式 / 直橫交錯 / ±30° / ±45°)
    changeOrientation(newOrientation) {
      if (!window.app?.isAdmin) return;
      this.wordOrientation = newOrientation;
      const frontSel = document.getElementById('wcOrientationSelect');
      if (frontSel) frontSel.value = newOrientation;
      const adminSel = document.getElementById('adminWcOrientationSelect');
      if (adminSel) adminSel.value = newOrientation;

      if (this.activeActivity) {
        db.ref('quiz/wordCloud/active/wordOrientation').set(newOrientation);
      }
      this.recalculateAndRender();
      const labelMap = {
        mixed: '直橫交錯',
        horizontal: '水平橫式',
        vertical: '垂直直式',
        tilt30: '傾斜 ±30°',
        tilt45: '傾斜 ±45°'
      };
      window.app?.showNotification('設定更新', `文字方向已切換為：${labelMap[newOrientation] || newOrientation}`);
    }

    // 切換文字雲圖案形狀 (圓形 / 矩形 / 雲朵 / 愛心 / 星形 / 自訂)
    changeShape(newShape) {
      if (!window.app?.isAdmin) return;
      if (newShape === 'custom' && !this.customMaskUrl) {
        const fileInput = document.getElementById('wcCustomMaskInput') || document.getElementById('adminWcCustomMaskInput');
        if (fileInput) fileInput.click();
        return;
      }
      this.cloudShape = newShape;
      const frontSel = document.getElementById('wcShapeSelect');
      if (frontSel) frontSel.value = newShape;
      const adminSel = document.getElementById('adminWcShapeSelect');
      if (adminSel) adminSel.value = newShape;

      if (this.activeActivity) {
        db.ref('quiz/wordCloud/active/cloudShape').set(newShape);
      }
      this.recalculateAndRender();
      const labelMap = {
        circle: '圓形 / 橢圓',
        rectangle: '矩形 (滿版)',
        cloud: '朵朵白雲',
        heart: '溫馨愛心',
        star: '璀璨星形',
        custom: '自訂圖案遮罩'
      };
      window.app?.showNotification('設定更新', `文字雲圖案形狀已切換為：${labelMap[newShape] || newShape}`);
    }

    // 上傳自訂遮罩圖案
    uploadCustomMask(file) {
      if (!file) return;
      if (file.size > 8 * 1024 * 1024) {
        window.app?.showNotification('提示', '自訂圖案請小於 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        this.setCustomMaskFromUrl(dataUrl, () => {
          this.cloudShape = 'custom';
          const frontSel = document.getElementById('wcShapeSelect');
          if (frontSel) frontSel.value = 'custom';
          const adminSel = document.getElementById('adminWcShapeSelect');
          if (adminSel) adminSel.value = 'custom';

          if (this.activeActivity) {
            db.ref('quiz/wordCloud/active/cloudShape').set('custom');
            db.ref('quiz/wordCloud/active/customMaskUrl').set(dataUrl);
          }
          this.recalculateAndRender();
          window.app?.showNotification('成功', '自訂文字雲圖案已成功套用！');
        });
      };
      reader.readAsDataURL(file);
    }

    // 依 DataURL 載入並建立遮罩離屏畫布
    setCustomMaskFromUrl(dataUrl, callback) {
      this.customMaskUrl = dataUrl;
      const img = new Image();
      img.onload = () => {
        this.customMaskImg = img;
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 300;
        offCanvas.height = 200;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(img, 0, 0, 300, 200);
        this.customMaskCanvas = offCanvas;
        this.customMaskCtx = offCtx;
        if (typeof callback === 'function') callback();
        else this.recalculateAndRender();
      };
      img.src = dataUrl;
    }

    // 新文字由下往上浮現並做 3 秒晃動 (Requirement A)
    showFloatingWordAnnouncement(word, user) {
      const container = document.getElementById('wcCanvasWrapper') || document.body;
      const bubble = document.createElement('div');
      bubble.className = 'wc-new-word-bubble';
      bubble.innerHTML = `
        <span class="wc-bubble-icon">✨</span>
        <span class="wc-bubble-text">${this.escapeHtml(word)}</span>
        <span class="wc-bubble-user">${this.escapeHtml(user || '同學')}</span>
      `;
      container.appendChild(bubble);

      setTimeout(() => {
        if (bubble && bubble.parentNode) {
          bubble.parentNode.removeChild(bubble);
        }
      }, 3300);
    }

    // 檢查指定坐標邊界是否位於當前形狀輪廓內部 (Requirement D)
    isInsideCurrentShape(x, y, w, h, cw, ch) {
      const shape = this.cloudShape || 'circle';
      if (shape === 'rectangle') return true;

      const points = [
        { px: x, py: y },
        { px: x + w, py: y },
        { px: x, py: y + h },
        { px: x + w, py: y + h },
        { px: x + w / 2, py: y + h / 2 }
      ];

      const cx = cw / 2;
      const cy = ch / 2;
      const rx = cw * 0.46;
      const ry = ch * 0.46;

      for (let i = 0; i < points.length; i++) {
        const { px, py } = points[i];
        const nx = (px - cx) / rx;
        const ny = (py - cy) / ry;

        if (shape === 'circle') {
          if (nx * nx + ny * ny > 0.95) return false;
        } else if (shape === 'heart') {
          const hx = nx * 1.15;
          const hy = -(ny + 0.15) * 1.15;
          const a = hx * hx + hy * hy - 1;
          if (a * a * a - hx * hx * hy * hy * hy > 0) return false;
        } else if (shape === 'cloud') {
          const inCenter = (nx * nx + (ny + 0.1) * (ny + 0.1)) < 0.6;
          const inLeft = ((nx + 0.45) * (nx + 0.45) + (ny - 0.05) * (ny - 0.05)) < 0.35;
          const inRight = ((nx - 0.45) * (nx - 0.45) + (ny - 0.05) * (ny - 0.05)) < 0.35;
          const inBottom = (nx * nx / 0.8 + (ny - 0.25) * (ny - 0.25) / 0.15) < 0.8;
          if (!inCenter && !inLeft && !inRight && !inBottom) return false;
        } else if (shape === 'star') {
          const dist = Math.hypot(nx, ny);
          if (dist > 1.0) return false;
          let angle = Math.atan2(ny, nx) + Math.PI / 2;
          angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          const angleSegment = (Math.PI * 2) / 5;
          const halfSegment = angleSegment / 2;
          const localAngle = Math.abs((angle % angleSegment) - halfSegment);
          const starR = 0.42 + 0.48 * (Math.cos(halfSegment) / Math.cos(localAngle));
          if (dist > starR) return false;
        } else if (shape === 'custom') {
          if (this.customMaskCanvas && this.customMaskCtx) {
            const sampleX = Math.max(0, Math.min(this.customMaskCanvas.width - 1, Math.floor((px / cw) * this.customMaskCanvas.width)));
            const sampleY = Math.max(0, Math.min(this.customMaskCanvas.height - 1, Math.floor((py / ch) * this.customMaskCanvas.height)));
            const pixel = this.customMaskCtx.getImageData(sampleX, sampleY, 1, 1).data;
            if (pixel[3] < 45) return false;
          }
        }
      }
      return true;
    }

    // 更新活動狀態 UI (題目標題、圖片、按鈕狀態)
    updateActiveActivityUI() {
      const act = this.activeActivity;
      const isActive = act && act.active;

      // 學生端狀態提示列與輸入區
      const promptEl = document.getElementById('wcStudentPrompt');
      const studentInputSection = document.getElementById('wcStudentInputSection');
      const studentTitle = document.getElementById('wcStudentTitleDisplay');
      const studentImageWrapper = document.getElementById('wcStudentImageDisplay');
      const lockBadge = document.getElementById('wcStatusLockBadge');

      if (studentTitle) {
        studentTitle.textContent = isActive ? act.title : '目前無進行中的文字雲活動';
      }

      if (studentImageWrapper) {
        if (isActive && act.imageUrl) {
          studentImageWrapper.style.display = 'block';
          studentImageWrapper.innerHTML = `
            <img src="${act.imageUrl}" style="max-height: 220px; max-width: 100%; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.15);" onclick="window.app?.zoomShareImage('${act.imageUrl}')" title="點擊放大題目圖片">
          `;
        } else {
          studentImageWrapper.style.display = 'none';
          studentImageWrapper.innerHTML = '';
        }
      }

      if (studentInputSection) {
        studentInputSection.style.display = isActive ? 'flex' : 'none';
      }

      if (lockBadge) {
        lockBadge.style.display = (isActive && act.accepting === false) ? 'inline-flex' : 'none';
      }

      // 廣播跳轉
      if (act && act.broadcastTimestamp) {
        const now = Date.now();
        if (now - act.broadcastTimestamp < 10000 && act.broadcastTimestamp > (this.lastBroadcastTs || 0)) {
          this.lastBroadcastTs = act.broadcastTimestamp;
          if (!window.app?.isAdmin && window.app?.activeTabId !== 'panel-word-cloud') {
            window.app?.switchToTab('panel-word-cloud');
            window.app?.showNotification('即時文字雲', '老師已開啟全班即時文字雲互動！');
          }
        }
      }

      // 教師後台控制鈕同步
      const btnToggle = document.getElementById('wcBtnToggleAccept');
      const adminBtnToggle = document.getElementById('adminWcBtnToggleAccept');
      const statusText = (isActive && act.accepting === false) ? '▶️ 恢復接收作答' : '⏸️ 停止接收作答';
      if (btnToggle) btnToggle.textContent = statusText;
      if (adminBtnToggle) adminBtnToggle.textContent = statusText;

      const adminTitleInput = document.getElementById('adminWcQuestionTitleInput');
      if (adminTitleInput && document.activeElement !== adminTitleInput && isActive && act.title) {
        if (!adminTitleInput.value) adminTitleInput.value = act.title;
      }
      const currentLimit = (isActive && act.limitPerStudent !== undefined) ? parseInt(act.limitPerStudent, 10) : 1;
      const orientSel = document.getElementById('wcOrientationSelect');
      if (orientSel && this.wordOrientation) orientSel.value = this.wordOrientation;
      const adminOrientSel = document.getElementById('adminWcOrientationSelect');
      if (adminOrientSel && this.wordOrientation) adminOrientSel.value = this.wordOrientation;

      const shapeSel = document.getElementById('wcShapeSelect');
      if (shapeSel && this.cloudShape) shapeSel.value = this.cloudShape;
      const adminShapeSel = document.getElementById('adminWcShapeSelect');
      if (adminShapeSel && this.cloudShape) adminShapeSel.value = this.cloudShape;
      const adminLimitSelect = document.getElementById('adminWcLimitSelect');
      if (adminLimitSelect && String(adminLimitSelect.value) !== String(currentLimit)) {
        adminLimitSelect.value = currentLimit;
      }
      const frontLimitSelect = document.getElementById('wcLimitSelect');
      if (frontLimitSelect && String(frontLimitSelect.value) !== String(currentLimit)) {
        frontLimitSelect.value = currentLimit;
      }
      const wordInput = document.getElementById('wcStudentWordInput');
      const submitBtn = document.querySelector('.wc-submit-btn');
      if (wordInput && isActive) {
        const isLocked = (act.accepting === false);
        wordInput.disabled = isLocked;
        if (submitBtn) submitBtn.disabled = isLocked;

        if (isLocked) {
          wordInput.placeholder = '老師已鎖定作答，目前暫停輸入...';
        } else {
          // 計算當前學生在此輪有效提交次數
          const studentName = this.getCurrentStudentName();
          const studentId = this.getCurrentStudentId();
          let myCount = 0;
          const roundStartTs = act.roundTimestamp || act.timestamp || 0;
          for (const key in this.submissions) {
            const item = this.submissions[key];
            if (!item) continue;
            if (act.sessionId && item.sessionId && item.sessionId !== act.sessionId) continue;
            if (roundStartTs && item.timestamp && item.timestamp < (roundStartTs - 1000)) continue;
            if ((studentId && item.userId === studentId) || item.user === studentName) {
              myCount++;
            }
          }

          if (currentLimit > 0 && myCount >= currentLimit) {
            wordInput.disabled = true;
            if (submitBtn) submitBtn.disabled = true;
            wordInput.placeholder = `您已完成作答（已送出 ${myCount}/${currentLimit} 次）`;
          } else {
            wordInput.disabled = false;
            if (submitBtn) submitBtn.disabled = false;
            wordInput.placeholder = currentLimit === 0
              ? '請輸入 1~15 字詞彙（不限提交次數）...'
              : (myCount > 0
                  ? `請輸入 1~15 字詞彙（每人限 ${currentLimit} 次，已送出 ${myCount} 次）...`
                  : `請輸入 1~15 字詞彙（每人限 ${currentLimit} 次）...`);
          }
        }
      }
      if (isActive && act.imageUrl && !this.uploadedImageUrl) {
        this.uploadedImageUrl = act.imageUrl;
        this.renderQuestionImagePreview(act.imageUrl);
      }

      // 後台進行中狀態列即時更新
      window.app?.updateAdminActiveActivitiesUI();
    }

    // 重新統計詞頻並觸發排版演算 (多位同學重複送出時票數累計、排名即時更新、文字明顯放大)
    recalculateAndRender() {
      try {
        const counts = {};
        const wordsList = [];

        for (const id in this.submissions) {
          const item = this.submissions[id];
          if (!item || !item.word) continue;
          const rawW = item.word.trim();
          if (!rawW) continue;

          // 去除首尾常見標點符號與多餘空白，讓如「好棒」、「好棒！」、「#好棒」完美合併為同一詞彙累加票數
          const cleanW = rawW.replace(/^[#＃\s]+|[!！?？,，.\s]+$/g, '').trim() || rawW;
          const key = cleanW.toLowerCase();
          if (this.hiddenWords.has(key)) continue;

          if (!counts[key]) {
            counts[key] = {
              word: cleanW,
              count: 0,
              latestTs: item.timestamp || 0,
              voters: new Set()
            };
          }
          counts[key].count++;
          if (item.userId || item.user) {
            counts[key].voters.add(item.userId || item.user);
          }
          if (item.timestamp && item.timestamp > counts[key].latestTs) {
            counts[key].latestTs = item.timestamp;
            counts[key].word = cleanW; // 保留最新格式
          }
        }

        for (const k in counts) {
          const item = counts[k];
          item.isFocused = this.focusWords.has(k);
          wordsList.push(item);
        }

        // 排行榜嚴格依「票數(count)由高至低」排序；同票數則依最新提交時間排序
        wordsList.sort((a, b) => b.count - a.count || b.latestTs - a.latestTs);
        this.wordsData = wordsList;

        // 即時更新右側票數與排行榜名次
        this.updateRankingListUI(wordsList);
        if (window.app && window.app._wcScoringModalOpen && typeof window.app.renderWordCloudStudentScoringList === 'function') {
          window.app.renderWordCloudStudentScoringList();
        }
      } catch (err) {
        console.error('WordCloud updateRankingListUI error:', err);
      }

      try {
        // 重新繪製文字雲 (票數越高的詞彙字級明顯遞增放大)
        this.renderCanvas();
      } catch (err) {
        console.error('WordCloud renderCanvas error:', err);
      }
    }

    // 更新詞頻排行榜 UI
    updateRankingListUI(wordsList) {
      const listEl = document.getElementById('wcRankingList');
      const totalCountEl = document.getElementById('wcTotalWordsCount');
      const uniqueCountEl = document.getElementById('wcUniqueWordsCount');

      const totalWords = Object.keys(this.submissions).length;
      if (totalCountEl) totalCountEl.textContent = `${totalWords} 則`;
      if (uniqueCountEl) uniqueCountEl.textContent = `${wordsList.length} 款`;

      if (!listEl) return;
      if (wordsList.length === 0) {
        listEl.innerHTML = '<li style="text-align: center; color: var(--text-muted); padding: 16px; font-size: 14px;">尚無詞彙，等待同學提交中...</li>';
        return;
      }

      const top10 = wordsList.slice(0, 15);
      const maxCount = Math.max(1, top10[0]?.count || 1);

      listEl.innerHTML = top10.map((item, idx) => {
        const pct = Math.round((item.count / maxCount) * 100);
        const rankColor = idx === 0 ? '#f59e0b' : (idx === 1 ? '#94a3b8' : (idx === 2 ? '#b45309' : 'var(--text-secondary)'));
        const isMultiple = item.count > 1;
        return `
          <li class="wc-rank-item" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 8px; border-bottom: 1px solid var(--border-color); font-size: 14px; ${isMultiple ? 'background: rgba(37, 99, 235, 0.04);' : ''}">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1;">
              <span style="font-weight: 800; color: ${rankColor}; width: 24px; flex-shrink: 0; font-size: 14px;">#${idx + 1}</span>
              <span style="font-weight: bold; color: ${item.isFocused ? '#2563eb' : 'var(--text-primary)'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.word}">
                ${item.isFocused ? '⭐ ' : ''}${this.escapeHtml(item.word)}
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
              <div style="width: 50px; height: 7px; background: rgba(0,0,0,0.06); border-radius: 4px; overflow: hidden;" title="${pct}% 佔比">
                <div style="width: ${pct}%; height: 100%; background: ${isMultiple ? 'linear-gradient(90deg, #3b82f6, #ec4899)' : 'var(--accent-color)'}; border-radius: 4px; transition: width 0.3s ease;"></div>
              </div>
              <span style="font-weight: 900; color: ${isMultiple ? '#2563eb' : 'var(--accent-color)'}; font-size: 14px; min-width: 32px; text-align: right;">${item.count}票</span>
              ${window.app?.isAdmin ? `
                <button type="button" class="preset-btn" onclick="window.wordCloud?.rewardWordVoters('${encodeURIComponent(item.word)}')" style="padding: 1px 6px; font-size: 14px; color: #d97706; border-color: rgba(245,158,11,0.4); background: rgba(245,158,11,0.08); height: auto;" title="依計分模式獎勵送出此詞彙的同學或所屬小組">⭐</button>
                <button type="button" class="preset-btn" onclick="window.wordCloud?.toggleFocusWord('${encodeURIComponent(item.word)}')" style="padding: 1px 6px; font-size: 14px; color: ${item.isFocused ? 'var(--accent-color)' : 'var(--text-secondary)'}; border-color: ${item.isFocused ? '#2563eb' : 'var(--border-color)'}; background: ${item.isFocused ? 'rgba(37,99,235,0.1)' : 'transparent'}; height: auto;" title="${item.isFocused ? '取消焦點詞彙' : '設為焦點詞彙'}">${item.isFocused ? '★' : '☆'}</button>
                <button type="button" class="preset-btn" onclick="window.wordCloud?.toggleHideWord('${encodeURIComponent(item.word)}')" style="padding: 1px 6px; font-size: 14px; color: #ef4444; border-color: rgba(239,68,68,0.3); background: transparent; height: auto;" title="隱藏此詞彙">✕</button>
              ` : ''}
            </div>
          </li>
        `;
      }).join('');

      if (window.app?.isAdmin && this.hiddenWords.size > 0) {
        listEl.innerHTML += `
          <li style="margin-top: 10px; padding: 6px 10px; background: rgba(239, 68, 68, 0.08); border-radius: 8px; font-size: 14px; display: flex; align-items: center; justify-content: space-between;">
            <span style="color: #ef4444; font-weight: bold;">🚫 已遮蔽 ${this.hiddenWords.size} 個詞彙</span>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.wordCloud?.unhideAllWords()" style="font-size: 14px; padding: 2px 8px; height: 22px; cursor: pointer;">全部取消遮蔽</button>
          </li>
        `;
      }
    }

    // 核心 Canvas 文字雲螺旋碰撞排版演算 (支援文字方向、圖案形狀與焦點加粗)
    renderCanvas() {
      const canvas = document.getElementById('wordCloudCanvas');
      if (!canvas) return;
      this.initCanvasPinchZoom();

      const wrapper = document.getElementById('wcCanvasWrapper');
      const dpr = window.devicePixelRatio || 1;
      const layoutW = canvas.clientWidth || (wrapper ? wrapper.clientWidth : 0) || 750;
      const layoutH = canvas.clientHeight || (wrapper ? wrapper.clientHeight : 0) || 480;
      const width = Math.max(340, Math.floor(layoutW));
      const height = Math.max(300, Math.floor(layoutH));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      const words = this.wordsData;
      if (!words || words.length === 0) {
        ctx.fillStyle = 'rgba(150, 150, 150, 0.4)';
        ctx.font = 'bold 20px "Microsoft JhengHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☁️ 等待同學提交詞彙，文字雲將即時呈現！', width / 2, height / 2);
        return;
      }

      // 計算實際全場最高票與最低票
      const maxCount = words.reduce((max, w) => Math.max(max, w.count || 1), 1);
      const minCount = words.reduce((min, w) => Math.min(min, w.count || 1), words[0]?.count || 1);
      const countRange = Math.max(1, maxCount - minCount);

      // 排版優先級：老師精選焦點詞第一優先，其餘高票重複提交詞彙優先排在正中心
      const wordsForCanvas = [...words].sort((a, b) => {
        if (a.isFocused && !b.isFocused) return -1;
        if (!a.isFocused && b.isFocused) return 1;
        return b.count - a.count || b.latestTs - a.latestTs;
      });

      // 統計星號焦點詞數量，若超過三個自動依數量自適應動態調降字級，確保全部皆能排入！
      const numFocused = wordsForCanvas.filter(w => w.isFocused).length;
      let targetFocusFont = 84;
      if (numFocused === 2) targetFocusFont = 70;
      else if (numFocused === 3) targetFocusFont = 58;
      else if (numFocused === 4) targetFocusFont = 48;
      else if (numFocused === 5) targetFocusFont = 42;
      else if (numFocused === 6) targetFocusFont = 38;
      else if (numFocused >= 7) targetFocusFont = Math.max(20, Math.min(35, Math.round(380 / (Math.sqrt(numFocused) * 3.2))));

      // 基本字級大小區間
      const baseSingleFont = Math.max(16, Math.min(26, Math.floor(width / 32)));
      const maxAllowedFont = Math.min(78, Math.floor(width / 8.5));

      const palette = CLOUD_PALETTES[this.currentPalette % CLOUD_PALETTES.length];
      const centerX = width / 2;
      const centerY = height / 2;

      const occupiedBoxes = [];
      const placedResults = [];

      wordsForCanvas.forEach((item, index) => {
        let initFontSize;
        if (item.isFocused) {
          // 焦點詞彙：依星號焦點詞總數自適應調整大小，保持比一般詞突出且保證容得下全部
          initFontSize = targetFocusFont;
        } else {
          if (maxCount <= 1) {
            initFontSize = baseSingleFont;
          } else {
            const countBoost = (item.count - 1) * Math.max(9, Math.floor(width / 50));
            const relativeRatio = (item.count - minCount) / countRange;
            initFontSize = Math.round(baseSingleFont + countBoost + relativeRatio * 14);
            initFontSize = Math.min(maxAllowedFont, Math.max(baseSingleFont, initFontSize));
          }
        }

        // 決定詞彙旋轉角度 (橫式 / 直式 / 直橫交錯 / ±30° / ±45°)
        let itemAngle = 0;
        const orient = this.wordOrientation || 'mixed';
        if (orient === 'horizontal') {
          itemAngle = 0;
        } else if (orient === 'vertical') {
          itemAngle = Math.PI / 2;
        } else if (orient === 'mixed') {
          // 當焦點詞較多 (>=4) 時，焦點詞也可適度交錯以完美鑲嵌在中央區域
          if (item.isFocused) {
            itemAngle = (numFocused >= 4 && index % 2 === 1) ? Math.PI / 2 : 0;
          } else {
            itemAngle = (index % 2 === 1 ? Math.PI / 2 : 0);
          }
        } else if (orient === 'tilt30') {
          const angles30 = [0, -Math.PI / 6, Math.PI / 6];
          itemAngle = item.isFocused ? 0 : angles30[index % angles30.length];
        } else if (orient === 'tilt45') {
          const angles45 = [0, -Math.PI / 4, Math.PI / 4];
          itemAngle = item.isFocused ? 0 : angles45[index % angles45.length];
        }

        // 自動搜尋空位與自適應降級重試機制 (最多重試 3 輪縮小，保證 100% 全部呈現！)
        let placed = false;
        let bestX = centerX;
        let bestY = centerY;
        let finalFontSize = initFontSize;
        let finalBoundingW = 0;
        let finalBoundingH = 0;
        let finalTextWidth = 0;
        let finalTextHeight = 0;

        for (let attempt = 0; attempt < 3; attempt++) {
          ctx.font = `bold ${finalFontSize}px "Microsoft JhengHei", "Noto Sans TC", sans-serif`;
          const metrics = ctx.measureText(item.word);
          const tW = Math.ceil(metrics.width);
          const tH = Math.ceil(finalFontSize * 1.05);

          // 若為焦點詞，計算外框 padding 所需預留空間
          const padX = item.isFocused ? Math.round(finalFontSize * 0.18) * 2 : 0;
          const padY = item.isFocused ? Math.round(finalFontSize * 0.12) * 2 : 0;
          const totalW = tW + padX;
          const totalH = tH + padY;

          const cos = Math.abs(Math.cos(itemAngle));
          const sin = Math.abs(Math.sin(itemAngle));
          const bW = Math.ceil(totalW * cos + totalH * sin);
          const bH = Math.ceil(totalW * sin + totalH * cos);

          let angle = (index * 2.39996) + attempt * 0.45;
          let radius = 0;
          const angleStep = 0.22;
          const radiusStep = 1.35;
          // 大幅擴大搜尋步數上限 (750 步)，半徑可覆蓋整張畫布
          const maxSteps = item.isFocused ? 750 : 550;

          for (let step = 0; step < maxSteps; step++) {
            const testX = Math.round(centerX + radius * Math.cos(angle) - bW / 2);
            const testY = Math.round(centerY + radius * Math.sin(angle) - bH / 2);

            // 邊界檢查
            if (testX >= 6 && testX + bW <= width - 6 && testY >= 6 && testY + bH <= height - 6) {
              if (this.isInsideCurrentShape(testX, testY, bW, bH, width, height)) {
                const padding = Math.max(2, Math.floor(finalFontSize * 0.08));
                const box = {
                  x: testX - padding,
                  y: testY - padding,
                  w: bW + padding * 2,
                  h: bH + padding * 2
                };

                let collided = false;
                for (let b = 0; b < occupiedBoxes.length; b++) {
                  const ob = occupiedBoxes[b];
                  if (box.x < ob.x + ob.w && box.x + box.w > ob.x &&
                      box.y < ob.y + ob.h && box.y + box.h > ob.y) {
                    collided = true;
                    break;
                  }
                }

                if (!collided) {
                  bestX = testX;
                  bestY = testY;
                  occupiedBoxes.push(box);
                  placed = true;
                  finalBoundingW = bW;
                  finalBoundingH = bH;
                  finalTextWidth = tW;
                  finalTextHeight = tH;
                  break;
                }
              }
            }

            angle += angleStep;
            radius += radiusStep;
          }

          if (placed) break;

          // 若空間不足，微幅縮小字級 (82%) 再進行下一輪嘗試
          finalFontSize = Math.max(14, Math.round(finalFontSize * 0.82));
        }

        // 保底機制：若空間極度擁擠仍未能放入，以安全坐標強制安置，絕不丟失任何詞彙
        if (!placed) {
          finalBoundingW = Math.ceil(ctx.measureText(item.word).width);
          finalBoundingH = Math.ceil(finalFontSize * 1.05);
          finalTextWidth = finalBoundingW;
          finalTextHeight = finalBoundingH;
          bestX = Math.max(8, Math.min(width - finalBoundingW - 8, centerX + (Math.random() - 0.5) * (width * 0.5)));
          bestY = Math.max(8, Math.min(height - finalBoundingH - 8, centerY + (Math.random() - 0.5) * (height * 0.5)));
          occupiedBoxes.push({ x: bestX, y: bestY, w: finalBoundingW, h: finalBoundingH });
          placed = true;
        }

        if (placed) {
          const color = item.isFocused ? '#2563eb' : palette[index % palette.length];
          placedResults.push({
            word: item.word,
            count: item.count,
            isFocused: item.isFocused,
            x: bestX,
            y: bestY,
            boundingW: finalBoundingW,
            boundingH: finalBoundingH,
            textWidth: finalTextWidth,
            textHeight: finalTextHeight,
            fontSize: finalFontSize,
            angle: itemAngle,
            color: color
          });
        }
      });

      this.placedWords = placedResults;

      // 繪製放置結果
      placedResults.forEach(item => {
        ctx.save();
        ctx.font = `bold ${item.fontSize}px "Microsoft JhengHei", "Noto Sans TC", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 旋轉中心置中
        ctx.translate(item.x + item.boundingW / 2, item.y + item.boundingH / 2);
        if (item.angle !== 0) {
          ctx.rotate(item.angle);
        }

        // 文字柔和陰影
        ctx.shadowColor = item.isFocused ? 'rgba(37, 99, 235, 0.35)' : 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = item.isFocused ? 8 : 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = item.color;
        ctx.fillText(item.word, 0, 0);

        // 若為精選焦點詞彙，繪製尊榮邊框框線 (如範例圖示)
        if (item.isFocused) {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = item.color;
          ctx.lineWidth = Math.max(2.5, Math.floor(item.fontSize * 0.07));
          const padX = Math.round(item.fontSize * 0.18);
          const padY = Math.round(item.fontSize * 0.12);
          ctx.strokeRect(-item.textWidth / 2 - padX, -item.textHeight / 2 - padY, item.textWidth + padX * 2, item.textHeight + padY * 2);
        }

        ctx.restore();
      });
    }

    // 切換色系調色盤
    switchPalette() {
      this.currentPalette = (this.currentPalette + 1) % CLOUD_PALETTES.length;
      this.renderCanvas();
    }

    // 匯出文字雲為高畫質 PNG 圖片
    exportPng() {
      const canvas = document.getElementById('wordCloudCanvas');
      if (!canvas) return;
      if (!this.wordsData || this.wordsData.length === 0) {
        window.app?.showNotification('提示', '目前文字雲尚無詞彙，無法匯出圖片！');
        return;
      }

      // 建立高畫質純色背景畫布
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext('2d');

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? '#1a1a2e' : '#ffffff';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // 繪製文字雲內容
      ctx.drawImage(canvas, 0, 0);

      // 加上浮水印與課堂代碼/題目標題
      const title = this.activeActivity?.title || '課堂即時文字雲';
      const classCode = window.currentClassCode ? `班級：${window.currentClassCode}` : '公開課堂';
      const timeStr = new Date().toLocaleDateString('zh-TW');

      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
      ctx.font = 'bold 24px "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`☁️ ${title}`, 30, 45);

      ctx.font = '16px "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${classCode} ‧ ${timeStr}`, exportCanvas.width - 30, 45);

      const url = exportCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `文字雲成果_${title}_${Date.now()}.png`;
      a.click();
      window.app?.showNotification('成功', '文字雲高畫質圖片已下載！');
    }

    // 全螢幕切換 (使用 documentElement 全螢幕搭配 body.wc-fullscreen-active，確保從全螢幕點擊「出題設定」進入後台時仍可完整操作)
    toggleFullscreen() {
      const docEl = document.documentElement;
      if (!document.fullscreenElement) {
        document.body.classList.add('wc-fullscreen-active');
        const reqFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
        if (reqFs) {
          reqFs.call(docEl).then(() => {
            this.updateFullscreenButtonUI();
            setTimeout(() => this.recalculateAndRender(), 150);
          }).catch(err => {
            document.body.classList.remove('wc-fullscreen-active');
            console.warn('WordCloud fullscreen error:', err);
          });
        }
      } else {
        document.body.classList.remove('wc-fullscreen-active');
        const exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (exitFs) {
          exitFs.call(document).then(() => {
            this.updateFullscreenButtonUI();
            setTimeout(() => this.recalculateAndRender(), 150);
          }).catch(() => {});
        }
      }
    }

    // 更新文字雲全螢幕切換按鈕文字與狀態
    updateFullscreenButtonUI() {
      const btn = document.getElementById('btnWordCloudFullscreen');
      const panel = document.getElementById('panel-word-cloud');
      if (!document.fullscreenElement) {
        document.body.classList.remove('wc-fullscreen-active');
      }
      if (!btn) return;
      const isFullscreen = Boolean(
        document.fullscreenElement && (
          document.body.classList.contains('wc-fullscreen-active') ||
          document.fullscreenElement === panel ||
          (panel && panel.contains(document.fullscreenElement))
        )
      );

      if (isFullscreen) {
        btn.innerHTML = '🗗 恢復為視窗';
        btn.title = '點擊結束全螢幕，恢復為一般視窗 (或按 Esc)';
        btn.classList.add('is-fullscreen-active');
      } else {
        btn.innerHTML = '⛶ 全螢幕';
        btn.title = '進入全螢幕展示文字雲';
        btn.classList.remove('is-fullscreen-active');
      }
    }

    // 收合 / 展開熱門詞頻排行側欄
    toggleRankingSidebar(forceOpen) {
      const grid = document.querySelector('.wc-main-grid');
      const card = document.getElementById('wcRankingCard');
      const expandBtn = document.getElementById('btnExpandWcRanking');
      const collapseBtn = document.getElementById('btnToggleWcRanking');
      if (!grid || !card) return;

      const isCollapsed = grid.classList.contains('wc-ranking-collapsed');
      const shouldOpen = forceOpen !== undefined ? Boolean(forceOpen) : isCollapsed;

      if (shouldOpen) {
        grid.classList.remove('wc-ranking-collapsed');
        if (expandBtn) expandBtn.style.display = 'none';
        if (collapseBtn) collapseBtn.innerHTML = '▶ 收合';
      } else {
        grid.classList.add('wc-ranking-collapsed');
        if (expandBtn) expandBtn.style.display = 'inline-flex';
        if (collapseBtn) collapseBtn.innerHTML = '◀ 展開';
      }

      setTimeout(() => {
        this.recalculateAndRender();
      }, 100);
    }
  }

  global.WordCloudManager = WordCloudManager;
  global.wordCloud = new WordCloudManager();
})(window);
