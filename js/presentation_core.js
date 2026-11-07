/**
 * ==========================================================================
 * 📽️ 同步互動簡報核心模組 (Synchronized Interactive Presentation Core)
 * 更新亮點：
 * 1. 權限管控 (Item 1)：由老師端開關「🔒 僅老師進行 / 🔓 學生可操作」，預設僅老師主控。
 * 2. 修復彈窗失效 (Item 2)：修復「本頁設定」與「匯入/匯出」之 .modal-overlay.active 顯現邏輯。
 * 3. 移除關閉按鈕 (Item 3)：依要求徹底移除頂部 redundant 關閉按鈕。
 * 4. 半透明黃色圓圈 + 點擊手勢指針雷射筆 (Item 4，參照圖 3)。
 * 5. 簡報控制功能往上移並整合為同一行 (Item 5，參照圖 4)。
 * ==========================================================================
 */
(function (global) {
  'use strict';

  class PresentationManager {
    constructor() {
      // 簡報核心資料
      this.slides = []; // [{ id, type, bgUrl, bgColor, externalUrl, urlPosition, displayMode, questions }]
      this.currentSlideIndex = 0;
      this.isPresenting = false; // 是否向全班同步廣播
      this.isRemoteBroadcastingActive = false; // 是否接收到他人主持廣播
      this.studentCanUsePresentation = true; // 預設值為「學生可以參與簡報中的互動」(需求 2)
      this.localIsHost = false; // 本機是否為簡報主控/主持端 (老師端生命週期持久化)
      try {
        if (window.boardStorage.session.getItem('wb_presentation_host') === 'true') {
          this.localIsHost = true;
        }
      } catch (e) {}
      this.currentTool = 'none'; // 'none' | 'pen' | 'laser'
      
      // 標註筆選色 (圖 2) 與雷射筆狀態
      this.penColor = '#ef4444'; // 預設重點紅
      this.penWidth = 4;
      this.annotations = {}; // { [slideId]: [ { color, width, points: [[rx, ry], ...] } ] }
      this.isDrawing = false;
      this.currentStroke = null;
      this.lastLaserBroadcast = 0;

      // 互動與作答 (圖 4 & 圖 5)
      this.submissions = {}; // { [slideId]: { [studentUid]: { userName, avatar, answers, timestamp } } }
      this.myAnswers = {}; // 學生端當前作答草稿 { [qId]: answer }
      this.currentStudentQuestionIndex = 0; // 分步模式當前題號
      this.isFloatingDrawerOpen = false; // 浮動模式題目展開狀態
      this.isStudentCollapsed = false; // 學生端作答視窗收合狀態 (圖 1)
      this.isTeacherCollapsed = false; // 老師端作答視窗收合狀態 (項目 2)

      // 學生端手繪作答狀態 (圖 3)
      this.studentDrawColor = '#ef4444'; // 預設紅
      this.studentDrawWidth = 4; // 預設中
      this.studentDrawStrokes = []; // 學生當前頁手繪筆劃
      this.isStudentDrawing = false;
      this.selectedSubmissionIds = new Set(); // 老師端勾選比較的作答 UIDs (圖 4)

      // PDF 暫存
      this.currentPdfDoc = null;
      this.selectedPdfPages = new Set();
      this.tempQuestions = [];
      this.tempExternalLinks = [];
      this.tempFloatingEmojis = ['👍', '💡', '❓', '❤️', '👏', '😂'];
      this.customFloatingEmojis = [];

      // 雲端教材庫
      this.materialsBank = {};
      this.materialSearchQuery = '';
      this.pendingLoadMaterialId = null;
      this._cloudBankListenerMounted = false;

      // 行動裝置雙指縮放與平移簡報畫面狀態 (Item 6)
      this.slideZoom = 1;
      this.slidePanX = 0;
      this.slidePanY = 0;
      this.isSlidePinching = false;

      // DOM 元素快取
      this.els = {};

      this.init();
    }

    // 初始化程序
    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('board-ready', () => this.bindUI());
      } else {
        this.bindUI();
      }
    }

    // 標記本機為簡報主持端 (老師端生命週期持久化)
    markAsHost() {
      this.localIsHost = true;
      if (this.draft) this.draft.ensureLoaded();
      try {
        window.boardStorage.session.setItem('wb_presentation_host', 'true');
      } catch (e) {}
      this.isRemoteBroadcastingActive = false;
    }

    // 檢查當前使用者是否具備教師身份 (嚴格依據登入狀態、主持狀態與 URL 參數判定)
    isTeacher() {
      if (this.localIsHost) return true;
      if (window.app && window.app.isAdmin) return true;
      try {
        const raw = window.boardStorage.session.getItem('wb_admin_session_v1');
        if (raw) {
          const data = JSON.parse(raw);
          if (data && data.isAdmin) return true;
        }
      } catch (e) {}
      try {
        if (window.boardStorage.session.getItem('wb_presentation_host') === 'true') return true;
      } catch (e) {}
      if (window.teacherAuthManager) {
        if (typeof window.teacherAuthManager.isAuthenticated === 'function' && window.teacherAuthManager.isAuthenticated()) return true;
        if (window.teacherAuthManager.currentVerifiedTeacher) return true;
      }
      if (window.firebaseManager && typeof window.firebaseManager.getUserRole === 'function' && window.firebaseManager.getUserRole() === 'teacher') return true;
      try {
        if (window.boardStorage.local.getItem('user_role') === 'teacher') return true;
      } catch (e) {}
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('role') === 'teacher' || urlParams.get('isAdmin') === '1') return true;
      return false;
    }

    // 檢查當前使用者是否有權限操作與控制簡報管理/編輯工具 (僅老師與主持人具備)
    canControlPresentation() {
      return Boolean(this.isTeacher() || this.localIsHost);
    }

    // 取得當前使用者資訊
    getUserInfo() {
      const name = (window.app && window.app.getCurrentUserName && window.app.getCurrentUserName()) || (window.app && window.app.currentUserName) || '學生';
      const uid = (window.app && window.app.getUserId && window.app.getUserId()) || (window.app && window.app.currentUserId) || ('stu_' + Math.random().toString(36).substring(2, 9));
      const avatar = (window.app && window.app.getCurrentUserAvatar && window.app.getCurrentUserAvatar()) || (window.app && window.app.currentUserAvatar) || '👤';
      return { name, uid, avatar };
    }

    // 綁定 UI 與 Firebase
    bindUI() {
      this.cacheElements();
      this.draft = new window.PresentationDraftController(this);
      this.bindEvents();
      this.initFirebase();
      this.updatePermissionsUI();
      this.render();
      this.draft.ensureLoaded();
    }

    // 快取所有相關 DOM 元素
    cacheElements() {
      this.els = {
        panel: document.getElementById('panel-presentation'),
        btnStartSync: document.getElementById('btnStartSyncPresentation'),
        btnAddColor: document.getElementById('btnAddColorSlide'),
        btnAddImage: document.getElementById('btnAddImageSlide'),
        thumbnailsList: document.getElementById('presentationThumbnailsList'),
        fileInputImage: document.getElementById('inputPresentationImageFile'),
        btnToggleStudentPresentation: document.getElementById('btnToggleStudentPresentation'),
        
        // 投影幕視區
        stageWrapper: document.getElementById('presentationStageWrapper'),
        screen: document.getElementById('presentationScreen'),
        screenBg: document.getElementById('presentationScreenBg'),
        emptyHint: document.getElementById('presentationEmptyHint'),
        annotationCanvas: document.getElementById('presentationAnnotationCanvas'),
        laserDot: document.getElementById('presentationLaserDot'),
        urlBadge: document.getElementById('presentationUrlBadge'),
        urlBadgesContainer: document.getElementById('presentationUrlBadgesContainer'),
        liveBadge: document.getElementById('presentationLiveBadge'),

        // 頂部整合控制列 (Item 5)
        headerControls: document.getElementById('presentationHeaderControls'),
        btnSlideNew: document.getElementById('btnSlideNew'),
        btnPrev: document.getElementById('btnSlidePrev'),
        btnNext: document.getElementById('btnSlideNext'),
        pageCounter: document.getElementById('txtSlidePageCounter'),
        btnGridOverview: document.getElementById('btnSlideGridOverview'),
        btnToolPen: document.getElementById('btnSlideToolPen'),
        penPalette: document.getElementById('presentationPenPalette'),
        penColorDot: document.getElementById('penColorDot'),
        colorPickerPopover: document.getElementById('presentationColorPickerPopover'),
        customBgColorInput: document.getElementById('presCustomBgColor'),
        btnConfirmCustomColor: document.getElementById('btnConfirmCustomColorSlide'),
        btnToolLaser: document.getElementById('btnSlideToolLaser'),
        btnClearAnnotations: document.getElementById('btnSlideClearAnnotations'),
        btnFullscreen: document.getElementById('btnSlideFullscreen'),
        btnSettings: document.getElementById('btnSlideSettings'),
        btnImportExport: document.getElementById('btnSlideImportExport'),
        btnResetSubmissions: document.getElementById('btnSlideResetSubmissions'),

        // 右側即時提交欄
        rightSidebar: document.getElementById('presentationRightSidebar'),
        submissionsList: document.getElementById('presentationSubmissionsList'),
        submissionsStats: document.getElementById('presentationSubmissionsStats'),
        btnDownloadResponses: document.getElementById('btnDownloadResponses'),
        txtSelectedCountBadge: document.getElementById('txtSelectedCountBadge'),
        btnCompareSubmissions: document.getElementById('btnCompareSubmissions'),

        // 學生端作答容器與手繪作答工具列 (圖 1 & 圖 3)
        studentInteractionArea: document.getElementById('presentationStudentInteractionArea'),
        studentDrawBar: document.getElementById('presentationStudentDrawBar'),
        studentDrawCanvas: document.getElementById('presentationStudentDrawCanvas'),
        selStudentDrawWidth: document.getElementById('selStudentDrawWidth'),
        btnStudentDrawClear: document.getElementById('btnStudentDrawClear'),
        btnStudentDrawSubmit: document.getElementById('btnStudentDrawSubmit'),

        // 彈窗
        modalImportExport: document.getElementById('modalPresentationImportExport'),
        modalPdfPicker: document.getElementById('modalPresentationPdfPicker'),
        pdfPagesContainer: document.getElementById('presentationPdfPagesContainer'),
        modalSlideSettings: document.getElementById('modalPresentationSlideSettings'),
        modalGridOverview: document.getElementById('modalPresentationGridOverview'),
        gridOverviewContainer: document.getElementById('presentationGridOverviewContainer'),
        modalIframeViewer: document.getElementById('modalPresentationIframeViewer'),
        iframeViewerFrame: document.getElementById('presentationIframeViewerFrame'),
        modalComparison: document.getElementById('modalPresentationComparison'),
        comparisonContainer: document.getElementById('presentationComparisonContainer'),
        modalImageZoom: document.getElementById('modalPresentationImageZoom'),
        imgZoomPreview: document.getElementById('imgZoomPreview'),
        txtZoomStudentTitle: document.getElementById('txtZoomStudentTitle'),
        // 雲端教材庫
        btnCloudBank: document.getElementById('btnSlideCloudBank'),
        modalCloudBank: document.getElementById('modalPresentationCloudBank'),
        modalLoadChoice: document.getElementById('modalPresentationLoadChoice')
      };
    }

    // 彈窗通用開啟與關閉輔助函數 (解決全螢幕層級與 .modal-overlay.active 問題)
    openModal(modal) {
      if (!modal) return;
      const fsEl = document.fullscreenElement;
      if (fsEl && !fsEl.contains(modal)) {
        fsEl.appendChild(modal);
      }
      modal.classList.add('active');
      modal.style.display = 'flex';
    }

    closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('active');
      modal.style.display = 'none';
    }

    // 綁定點擊與滑鼠互動
    bindEvents() {
      const { els } = this;
      if (!els.panel) return;

      // 老師端切換學生權限按鈕 (Item 1：是否開放同學參與題目回覆與切換簡報)
      if (els.btnToggleStudentPresentation) {
        els.btnToggleStudentPresentation.onclick = () => {
          if (!this.isTeacher()) return;
          this.studentCanUsePresentation = !this.studentCanUsePresentation;
          this.updatePermissionsUI();
          this.renderStudentInteraction();
          if (typeof db !== 'undefined') {
            db.ref('presentation/settings').update({
              studentCanUsePresentation: this.studentCanUsePresentation
            }).catch(() => {});
          }
          this.notify('權限更新', this.studentCanUsePresentation ? '已設定為「學生可以參與簡報中的互動」！' : '已設定為「僅老師操作簡報，同學不能參與簡報中的互動」。');
        };
      }

      // 開始/結束同步廣播 (圖 1)
      if (els.btnStartSync) {
        els.btnStartSync.onclick = () => this.toggleSyncPresentation();
      }

      // 新增純色頁 (圖 1：支援點擊展開背景顏色選擇浮窗)
      if (els.btnAddColor && els.colorPickerPopover) {
        els.btnAddColor.onclick = (e) => {
          e.stopPropagation();
          const isVisible = els.colorPickerPopover.style.display !== 'none';
          els.colorPickerPopover.style.display = isVisible ? 'none' : 'block';
        };
      } else if (els.btnAddColor) {
        els.btnAddColor.onclick = () => this.addColorSlide();
      }

      // 純色頁預設色票點擊事件
      const colorSwatches = document.querySelectorAll('.presentation-color-swatch-btn');
      colorSwatches.forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const color = btn.dataset.color || '#1e293b';
          this.addColorSlide(color);
          if (els.colorPickerPopover) els.colorPickerPopover.style.display = 'none';
        };
      });

      // 純色頁自訂底色確認按鈕
      if (els.btnConfirmCustomColor && els.customBgColorInput) {
        els.btnConfirmCustomColor.onclick = (e) => {
          e.stopPropagation();
          const color = els.customBgColorInput.value || '#1e293b';
          this.addColorSlide(color);
          if (els.colorPickerPopover) els.colorPickerPopover.style.display = 'none';
        };
      }

      // 新增圖片頁 (支援全螢幕狀態自動追蹤與恢復)
      if (els.btnAddImage && els.fileInputImage) {
        els.btnAddImage.onclick = () => {
          this.trackFullscreenBeforeFile();
          els.fileInputImage.click();
        };
        els.fileInputImage.onchange = (e) => {
          this.tryRestoreFullscreen();
          this.handleImageSlideUpload(e);
        };
      }

      // 新建簡報 (圖 2)
      if (els.btnSlideNew) {
        els.btnSlideNew.onclick = () => this.createNewPresentation();
      }

      // 上一頁 / 下一頁 (圖 2: 純箭頭)
      if (els.btnPrev) els.btnPrev.onclick = () => this.prevSlide();
      if (els.btnNext) els.btnNext.onclick = () => this.nextSlide();

      // 標註筆與雷射筆工具切換 (圖 2：標記工具提供多種常用顏色切換)
      if (els.btnToolPen) {
        els.btnToolPen.onclick = (e) => {
          e.stopPropagation();
          if (this.currentTool === 'pen') {
            if (els.penPalette) {
              const isVis = els.penPalette.style.display !== 'none';
              els.penPalette.style.display = isVis ? 'none' : 'flex';
            }
          } else {
            this.setTool('pen');
            if (els.penPalette) els.penPalette.style.display = 'flex';
          }
        };
      }

      // 標記筆選色按鈕事件
      const penPaletteBtns = document.querySelectorAll('.presentation-palette-color');
      penPaletteBtns.forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const color = btn.dataset.color || '#ef4444';
          this.setPenColor(color);
        };
      });

      // 點擊空白處自動關閉彈窗浮層
      document.addEventListener('click', (e) => {
        if (els.colorPickerPopover && !els.colorPickerPopover.contains(e.target) && e.target !== els.btnAddColor) {
          els.colorPickerPopover.style.display = 'none';
        }
        if (els.penPalette && !els.penPalette.contains(e.target) && !els.btnToolPen?.contains(e.target)) {
          els.penPalette.style.display = 'none';
        }
      });
      if (els.btnToolLaser) {
        els.btnToolLaser.onclick = () => this.setTool(this.currentTool === 'laser' ? 'none' : 'laser');
      }
      if (els.btnClearAnnotations) {
        els.btnClearAnnotations.onclick = () => this.clearAnnotations();
      }

      // 全螢幕切換
      if (els.btnFullscreen) {
        els.btnFullscreen.onclick = () => this.toggleFullscreen();
      }

      // 監聽全螢幕狀態切換事件，自動同步更新「最大化」/「恢復為視窗」按鈕文字與狀態
      document.addEventListener('fullscreenchange', () => this.updateFullscreenButtonUI());
      document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButtonUI());

      // 當使用者在全螢幕模式下開啟本機檔案選取器返回時，自動無縫維持或點擊恢復全螢幕
      window.addEventListener('focus', () => {
        if (this.wasFullscreenBeforeFile && !document.fullscreenElement) {
          this.tryRestoreFullscreen();
          const onNextClick = () => {
            if (this.wasFullscreenBeforeFile && !document.fullscreenElement) {
              this.tryRestoreFullscreen();
            }
            window.removeEventListener('click', onNextClick, true);
          };
          window.addEventListener('click', onNextClick, { capture: true, once: true });
        }
      });

      // 匯入/匯出按鈕 (Item 2)
      if (els.btnImportExport) {
        els.btnImportExport.onclick = () => this.openImportExportModal();
      }

      // 本頁設定按鈕 (Item 2)
      if (els.btnSettings) {
        els.btnSettings.onclick = () => this.openSlideSettingsModal();
      }

      // 重置提交
      if (els.btnResetSubmissions) {
        els.btnResetSubmissions.onclick = () => this.resetSubmissions();
      }

      // 縮圖九宮格總覽
      if (els.btnGridOverview) {
        els.btnGridOverview.onclick = () => this.openGridOverviewModal();
      }

      // 下載回應 CSV
      if (els.btnDownloadResponses) {
        els.btnDownloadResponses.onclick = () => this.downloadResponsesCsv();
      }

      // 比較選取同學作答 (圖 4)
      if (els.btnCompareSubmissions) {
        els.btnCompareSubmissions.onclick = () => this.openComparisonModal();
      }

      // 學生端手繪作答工具列事件綁定 (圖 3)
      this.bindStudentDrawBarEvents();

      // 外部 URL 懸浮點擊
      if (els.urlBadge) {
        els.urlBadge.onclick = (e) => {
          e.preventDefault();
          this.openExternalUrlViewer();
        };
      }

      // 雲端教材庫點擊背景關閉
      const modalCloudBank = els.modalCloudBank || document.getElementById('modalPresentationCloudBank');
      if (modalCloudBank) {
        modalCloudBank.addEventListener('click', (e) => {
          if (e.target === modalCloudBank) {
            this.closeCloudBankModal();
          }
        });
      }

      // 匯入/匯出簡報彈窗點擊背景關閉 (需求 3)
      const modalImportExport = els.modalImportExport || document.getElementById('modalPresentationImportExport');
      if (modalImportExport) {
        modalImportExport.addEventListener('click', (e) => {
          if (e.target === modalImportExport) {
            this.closeImportExportModal();
          }
        });
      }

      // 載入教材授課模式選擇彈窗點擊背景關閉
      const modalLoadChoice = els.modalLoadChoice || document.getElementById('modalPresentationLoadChoice');
      if (modalLoadChoice) {
        modalLoadChoice.addEventListener('click', (e) => {
          if (e.target === modalLoadChoice) {
            this.closeLoadChoiceModal();
          }
        });
      }

      // 畫布繪製與雷射筆滑鼠事件
      this.bindCanvasEvents();
      this.bindStudentDrawCanvasEvents();

      // 分頁切換監聽：當開啟簡報分頁時，自動重新計算畫布與投影幕尺寸
      const presTabBtns = document.querySelectorAll('.menu-tab[data-target="panel-presentation"]');
      presTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          setTimeout(() => {
            this.updatePermissionsUI();
            this.updateCanvasDimensions();
            this.render();
          }, 60);
        });
      });

      window.addEventListener('resize', () => {
        if (this.els.panel && (this.els.panel.classList.contains('active') || this.els.panel.style.display !== 'none')) {
          this.updateCanvasDimensions();
          this.render();
        }
      });

      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          if (this.els.panel && (this.els.panel.classList.contains('active') || this.els.panel.style.display !== 'none')) {
            this.updateCanvasDimensions();
            this.render();
          }
        }, 120);
        setTimeout(() => {
          if (this.els.panel && (this.els.panel.classList.contains('active') || this.els.panel.style.display !== 'none')) {
            this.updateCanvasDimensions();
          }
        }, 380);
      });

      if (typeof ResizeObserver !== 'undefined' && this.els.stageWrapper) {
        this._stageResizeObserver = new ResizeObserver(() => {
          if (this.els.panel && (this.els.panel.classList.contains('active') || this.els.panel.style.display !== 'none')) {
            this.updateCanvasDimensions();
          }
        });
        this._stageResizeObserver.observe(this.els.stageWrapper);
      }

      // 鍵盤左右鍵快捷切換頁面
      window.addEventListener('keydown', (e) => {
        if (!els.panel || !els.panel.classList.contains('active')) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          this.nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.prevSlide();
        }
      });
    }

    // 權限 UI 更新 (需求 1：僅老師可進行 vs 同學可操作)
    updatePermissionsUI() {
      const { els } = this;
      const teacher = Boolean((this.isTeacher() || this.localIsHost) && (!this.isRemoteBroadcastingActive || this.localIsHost));

      // 老師專用開關按鈕 / 學生端唯讀狀態提示 (遵循 AGENTS.md 師生權限隔離與透明化)
      if (els.btnToggleStudentPresentation) {
        els.btnToggleStudentPresentation.style.display = 'inline-flex';
        if (teacher) {
          els.btnToggleStudentPresentation.classList.remove('is-student-readonly');
          if (this.studentCanUsePresentation) {
            els.btnToggleStudentPresentation.classList.add('is-active');
            els.btnToggleStudentPresentation.classList.remove('is-inactive');
            els.btnToggleStudentPresentation.innerHTML = '<span>🔓 學生可以參與簡報中的互動</span>';
            els.btnToggleStudentPresentation.title = '點擊切換：目前設定學生可以參與簡報中的互動';
          } else {
            els.btnToggleStudentPresentation.classList.remove('is-active');
            els.btnToggleStudentPresentation.classList.add('is-inactive');
            els.btnToggleStudentPresentation.innerHTML = '<span>🔒 僅老師操作簡報，同學不能參與簡報中的互動</span>';
            els.btnToggleStudentPresentation.title = '點擊切換：目前設定僅老師操作簡報，同學不能參與簡報中的互動';
          }
        } else {
          // 學生端相同位置維持顯示狀態，但設為唯讀不可修改 (.is-student-readonly)
          els.btnToggleStudentPresentation.classList.add('is-student-readonly');
          if (this.studentCanUsePresentation) {
            els.btnToggleStudentPresentation.classList.add('is-active');
            els.btnToggleStudentPresentation.classList.remove('is-inactive');
            els.btnToggleStudentPresentation.innerHTML = '<span>🔓 學生可以參與簡報中的互動</span>';
            els.btnToggleStudentPresentation.title = '目前設定：學生可以參與簡報中的互動';
          } else {
            els.btnToggleStudentPresentation.classList.remove('is-active');
            els.btnToggleStudentPresentation.classList.add('is-inactive');
            els.btnToggleStudentPresentation.innerHTML = '<span>🔒 僅老師操作簡報，同學不能參與簡報中的互動</span>';
            els.btnToggleStudentPresentation.title = '目前設定：僅老師操作簡報，同學不能參與簡報中的互動';
          }
        }
      }

      // 老師專屬管理/編輯功能：只有老師可見，學生永遠不可見
      const teacherDisplay = teacher ? 'inline-flex' : 'none';
      if (els.btnSlideNew) els.btnSlideNew.style.display = teacherDisplay;
      if (els.btnAddColor) els.btnAddColor.style.display = teacherDisplay;
      if (els.btnAddImage) els.btnAddImage.style.display = teacherDisplay;
      if (els.btnStartSync) els.btnStartSync.style.display = teacherDisplay;
      if (els.btnToolPen) els.btnToolPen.style.display = teacherDisplay;
      if (els.btnToolLaser) els.btnToolLaser.style.display = teacherDisplay;
      if (els.btnClearAnnotations) els.btnClearAnnotations.style.display = teacherDisplay;
      if (els.btnSettings) els.btnSettings.style.display = teacherDisplay;
      if (els.btnCloudBank) els.btnCloudBank.style.display = teacherDisplay;
      if (els.btnImportExport) els.btnImportExport.style.display = teacherDisplay;
      if (els.btnResetSubmissions) els.btnResetSubmissions.style.display = teacherDisplay;
      const purgeBtn = document.getElementById('btnSlidePurgeCache');
      if (purgeBtn) purgeBtn.style.display = teacherDisplay;

      // 右側作答即時管理側欄：只有老師可見
      const expandRight = document.getElementById('btnExpandRightSidebar');
      if (els.rightSidebar) {
        if (!teacher) {
          els.rightSidebar.style.display = 'none';
          if (expandRight) expandRight.style.display = 'none';
        } else {
          els.rightSidebar.style.display = 'flex';
          if (expandRight) {
            expandRight.style.display = els.rightSidebar.classList.contains('is-collapsed') ? 'inline-flex' : 'none';
          }
        }
      }
      const expandLeft = document.getElementById('btnExpandLeftSidebar');
      const leftSidebar = document.getElementById('presentationLeftSidebar');
      if (leftSidebar && expandLeft) {
        expandLeft.style.display = leftSidebar.classList.contains('is-collapsed') ? 'inline-flex' : 'none';
      }

      // 若學生且老師未廣播時，畫面呈現提示
      if (!teacher && !this.isPresenting) {
        if (els.emptyHint) {
          els.emptyHint.innerHTML = `
            <span style="font-size: 38px;">📺</span>
            <span style="font-weight: 700; color: var(--text-secondary); font-size: 16px;">目前尚無進行中的同步簡報</span>
            <span style="font-size: 14px; color: var(--text-muted);">當老師開啟同步簡報時，畫面將自動同步於此播放</span>
          `;
          els.emptyHint.style.display = 'flex';
        }
        if (els.screenBg) els.screenBg.style.display = 'none';
      }

      // 翻頁控制：若為學生且處於「僅老師操作簡報」模式，鎖定翻頁；若「學生可以參與簡報中的互動」，允許同學自由點閱與切換
      const isStudentPageLocked = !teacher && this.isRemoteBroadcastingActive && !this.studentCanUsePresentation;
      if (isStudentPageLocked) {
        if (els.btnPrev) {
          els.btnPrev.disabled = true;
          els.btnPrev.style.opacity = '0.4';
          els.btnPrev.style.cursor = 'not-allowed';
          els.btnPrev.title = '目前設定為「僅老師操作簡報，同學不能參與簡報中的互動」，簡報頁面由老師統一控制';
        }
        if (els.btnNext) {
          els.btnNext.disabled = true;
          els.btnNext.style.opacity = '0.4';
          els.btnNext.style.cursor = 'not-allowed';
          els.btnNext.title = '目前設定為「僅老師操作簡報，同學不能參與簡報中的互動」，簡報頁面由老師統一控制';
        }
        if (els.btnGridOverview) {
          els.btnGridOverview.disabled = true;
          els.btnGridOverview.style.opacity = '0.4';
          els.btnGridOverview.style.cursor = 'not-allowed';
          els.btnGridOverview.title = '目前設定為「僅老師操作簡報，同學不能參與簡報中的互動」';
        }
        if (els.thumbnailsList) {
          els.thumbnailsList.classList.add('is-sync-locked');
        }
      } else {
        if (els.btnPrev) {
          els.btnPrev.disabled = false;
          els.btnPrev.style.opacity = '1';
          els.btnPrev.style.cursor = 'pointer';
          els.btnPrev.title = '上一頁';
        }
        if (els.btnNext) {
          els.btnNext.disabled = false;
          els.btnNext.style.opacity = '1';
          els.btnNext.style.cursor = 'pointer';
          els.btnNext.title = '下一頁';
        }
        if (els.btnGridOverview) {
          els.btnGridOverview.disabled = false;
          els.btnGridOverview.style.opacity = '1';
          els.btnGridOverview.style.cursor = 'pointer';
          els.btnGridOverview.title = '所有投影片總覽';
        }
        if (els.thumbnailsList) {
          els.thumbnailsList.classList.remove('is-sync-locked');
        }
      }
    }

    // 更新標註畫布的尺寸使其與螢幕精確對齊 (修正行動裝置橫向與直向維持嚴格 16:9 比例，並確保翻頁時重繪清除舊標記)
    updateCanvasDimensions() {
      const { stageWrapper, screen, annotationCanvas, studentDrawCanvas } = this.els;
      if (!screen || !annotationCanvas) return;

      if (stageWrapper) {
        const style = window.getComputedStyle(stageWrapper);
        const padX = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
        const padY = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
        const availW = Math.max(0, stageWrapper.clientWidth - padX);
        const availH = Math.max(0, stageWrapper.clientHeight - padY);
        const isMobile = window.innerWidth <= 900;
        const isLandscape = window.innerWidth > window.innerHeight;

        if (availW > 0) {
          let targetW = availW;
          let targetH = Math.round(availW * 9 / 16);

          if (!isMobile && availH > 40) {
            const maxH = Math.max(120, availH - 12);
            if (targetH > maxH) {
              targetH = maxH;
              targetW = Math.round(targetH * 16 / 9);
            }
          } else if (isMobile && isLandscape) {
            const maxLandscapeH = Math.max(140, Math.min(availH > 80 ? availH - 8 : window.innerHeight - 100, window.innerHeight - 96));
            if (targetH > maxLandscapeH) {
              targetH = maxLandscapeH;
              targetW = Math.round(targetH * 16 / 9);
            }
          }

          screen.style.width = `${targetW}px`;
          screen.style.height = `${targetH}px`;
        }
      }

      const w = screen.clientWidth || Math.round( screen.getBoundingClientRect().width );
      const h = screen.clientHeight || Math.round( screen.getBoundingClientRect().height );
      if (w > 0 && h > 0) {
        if (annotationCanvas.width !== w || annotationCanvas.height !== h) {
          annotationCanvas.width = w;
          annotationCanvas.height = h;
        }
        this.redrawAnnotations();

        if (studentDrawCanvas) {
          if (studentDrawCanvas.width !== w || studentDrawCanvas.height !== h) {
            studentDrawCanvas.width = w;
            studentDrawCanvas.height = h;
          }
          this.redrawStudentDrawCanvas();
        }
      }
    }

    // 套用簡報畫面的雙指縮放與平移 Transform (Item 6)
    applySlideZoomTransform() {
      const { screen, screenBg, annotationCanvas, studentDrawCanvas } = this.els;
      if (!screen) return;
      const targets = [screenBg, annotationCanvas, studentDrawCanvas].filter(Boolean);
      if (this.slideZoom <= 1.02) {
        this.slideZoom = 1;
        this.slidePanX = 0;
        this.slidePanY = 0;
        targets.forEach(el => {
          el.style.transformOrigin = '0 0';
          el.style.transform = '';
        });
      } else {
        const w = screen.clientWidth || 320;
        const h = screen.clientHeight || 180;
        const minX = w - w * this.slideZoom;
        const minY = h - h * this.slideZoom;
        this.slidePanX = Math.min(0, Math.max(minX, this.slidePanX));
        this.slidePanY = Math.min(0, Math.max(minY, this.slidePanY));
        const tf = `translate(${this.slidePanX}px, ${this.slidePanY}px) scale(${this.slideZoom})`;
        targets.forEach(el => {
          el.style.transformOrigin = '0 0';
          el.style.transform = tf;
        });
      }
    }

    resetSlideZoom() {
      this.slideZoom = 1;
      this.slidePanX = 0;
      this.slidePanY = 0;
      this.applySlideZoomTransform();
    }

    // 畫布繪圖與雷射筆滑鼠/觸控事件 (同時支援行動裝置雙指縮放簡報畫面)
    bindCanvasEvents() {
      const { screen, annotationCanvas } = this.els;
      if (!screen || !annotationCanvas) return;

      let isOneFingerPanning = false;
      let panLastPt = { x: 0, y: 0 };
      let pinchStartDist = 0;
      let pinchStartZoom = 1;
      let pinchLastMid = { x: 0, y: 0 };

      const getDistAndMid = (t0, t1) => {
        const dx = t1.clientX - t0.clientX;
        const dy = t1.clientY - t0.clientY;
        return {
          dist: Math.hypot(dx, dy) || 1,
          midX: (t0.clientX + t1.clientX) / 2,
          midY: (t0.clientY + t1.clientY) / 2
        };
      };

      const getRatioPos = (e) => {
        const rect = screen.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const zoom = this.slideZoom || 1;
        const panX = this.slidePanX || 0;
        const panY = this.slidePanY || 0;
        const localX = (clientX - rect.left - panX) / zoom;
        const localY = (clientY - rect.top - panY) / zoom;
        const rx = Math.max(0, Math.min(1, localX / rect.width));
        const ry = Math.max(0, Math.min(1, localY / rect.height));
        return { rx, ry };
      };

      const onPointerDown = (e) => {
        if (this.isSlidePinching) return;
        if (this.currentTool === 'none' || !this.canControlPresentation()) return;
        this.updateCanvasDimensions();
        const { rx, ry } = getRatioPos(e);

        if (this.currentTool === 'pen') {
          this.isDrawing = true;
          this.currentStroke = {
            color: this.penColor || '#ef4444',
            width: this.penWidth || 4,
            points: [[rx, ry]]
          };
          this.drawCurrentStroke();
        } else if (this.currentTool === 'laser') {
          this.updateLaserPointer(rx, ry, true);
          this.broadcastLaser(rx, ry, true);
        }
      };

      const onPointerMove = (e) => {
        if (this.isSlidePinching) return;
        if (this.currentTool === 'none' || !this.canControlPresentation()) return;
        const { rx, ry } = getRatioPos(e);

        if (this.currentTool === 'laser') {
          this.updateLaserPointer(rx, ry, true);
          this.broadcastLaser(rx, ry, true);
        } else if (this.currentTool === 'pen' && this.isDrawing && this.currentStroke) {
          this.currentStroke.points.push([rx, ry]);
          this.drawCurrentStroke();
        }
      };

      const onPointerUp = () => {
        if (this.isDrawing && this.currentStroke) {
          this.isDrawing = false;
          const slide = this.getCurrentSlide();
          if (slide) {
            if (!this.annotations[slide.id]) this.annotations[slide.id] = [];
            this.annotations[slide.id].push(this.currentStroke);
            this.broadcastAnnotations(slide.id);
            if (this.draft) this.draft.schedule();
          }
          this.currentStroke = null;
        }
      };

      const onPointerLeave = () => {
        onPointerUp();
        if (this.currentTool === 'laser') {
          this.updateLaserPointer(0, 0, false);
          this.broadcastLaser(0, 0, false);
        }
      };

      screen.addEventListener('mousedown', onPointerDown);
      screen.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      screen.addEventListener('mouseleave', onPointerLeave);

      screen.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length >= 2) {
          e.preventDefault();
          this.isSlidePinching = true;
          isOneFingerPanning = false;
          if (this.isDrawing && this.currentStroke && this.currentStroke.points.length <= 5) {
            this.isDrawing = false;
            this.currentStroke = null;
            this.redrawAnnotations();
          }
          if (this.isStudentDrawing && this.studentDrawStrokes && this.studentDrawStrokes.length > 0) {
            const lastS = this.studentDrawStrokes[this.studentDrawStrokes.length - 1];
            if (lastS && lastS.points && lastS.points.length <= 5) {
              this.studentDrawStrokes.pop();
              this.redrawStudentDrawCanvas();
            }
            this.isStudentDrawing = false;
          }
          const info = getDistAndMid(e.touches[0], e.touches[1]);
          pinchStartDist = info.dist;
          pinchStartZoom = this.slideZoom || 1;
          pinchLastMid = { x: info.midX, y: info.midY };
          return;
        }
        const slide = this.getCurrentSlide();
        const isDrawModeActive = slide && Array.isArray(slide.questions) && slide.questions.some(q => q.type === 'draw');
        if (this.slideZoom > 1.02 && this.currentTool === 'none' && !isDrawModeActive && e.touches && e.touches.length === 1) {
          isOneFingerPanning = true;
          panLastPt = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          return;
        }
        if (this.currentTool !== 'none') e.preventDefault();
        onPointerDown(e);
      }, { passive: false });

      screen.addEventListener('touchmove', (e) => {
        if (this.isSlidePinching && e.touches && e.touches.length >= 2) {
          e.preventDefault();
          const info = getDistAndMid(e.touches[0], e.touches[1]);
          const rect = screen.getBoundingClientRect();
          const cx = info.midX - rect.left;
          const cy = info.midY - rect.top;

          this.slidePanX += (info.midX - pinchLastMid.x);
          this.slidePanY += (info.midY - pinchLastMid.y);
          pinchLastMid = { x: info.midX, y: info.midY };

          const newZoom = Math.max(1, Math.min(4, pinchStartZoom * (info.dist / pinchStartDist)));
          const factor = newZoom / (this.slideZoom || 1);
          this.slidePanX = cx - (cx - this.slidePanX) * factor;
          this.slidePanY = cy - (cy - this.slidePanY) * factor;
          this.slideZoom = newZoom;
          this.applySlideZoomTransform();
          return;
        }
        if (isOneFingerPanning && e.touches && e.touches.length === 1 && this.slideZoom > 1.02) {
          e.preventDefault();
          const dx = e.touches[0].clientX - panLastPt.x;
          const dy = e.touches[0].clientY - panLastPt.y;
          panLastPt = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          this.slidePanX += dx;
          this.slidePanY += dy;
          this.applySlideZoomTransform();
          return;
        }
        if (this.currentTool !== 'none') e.preventDefault();
        onPointerMove(e);
      }, { passive: false });

      screen.addEventListener('touchend', (e) => {
        if (!e.touches || e.touches.length === 0) {
          isOneFingerPanning = false;
          if (this.isSlidePinching) {
            setTimeout(() => { this.isSlidePinching = false; }, 60);
          }
          this.applySlideZoomTransform();
        }
        onPointerUp();
      }, { passive: true });
    }

    // 初始化 Firebase 同步監聽
    initFirebase() {
      if (typeof db === 'undefined') {
        console.warn('Firebase db is undefined. Presentation runs smoothly in local mode.');
        return;
      }

      const presRef = db.ref('presentation');

      // 0. 監聽全域權限設定 (Item 1)
      presRef.child('settings').on('value', (snap) => {
        const val = snap.val();
        if (val) {
          if (typeof val.studentCanUsePresentation === 'boolean') {
            this.studentCanUsePresentation = val.studentCanUsePresentation;
            this.updatePermissionsUI();
            this.renderStudentInteraction();
          }
        }
      });

      // 1. 監聽簡報同步狀態與當前頁 (極致輕量：僅傳遞 ~100 bytes 狀態，不含大圖)
      presRef.child('live').on('value', (snap) => {
        const data = snap.val();
        if (!data) return;

        const myUser = this.getUserInfo();
        // 檢查廣播資料是否在 25 分鐘之內活躍更新 (避免過期舊廣播遺留卡住)
        const isFresh = Boolean(data.updatedAt && (Date.now() - data.updatedAt < 1500000));
        const isBroadcastingNow = Boolean(data.isPresenting && isFresh);
        const isAnotherHost = data.hostUid && data.hostUid !== myUser.uid;

        if (!isBroadcastingNow) {
          // 目前無有效廣播中：立即卸載即時監聽器，防止閒置背景全量下載
          this.isRemoteBroadcastingActive = false;
          if (this.isPresenting && (isAnotherHost || !data.isPresenting)) {
            this.isPresenting = false;
          }
          this.detachLivePresentationListeners();
          this.detachSubmissionsListener();

          // 老師端在無活躍廣播時，自動偵測並清理舊的雲端大檔殘留 (釋放資料庫儲存空間)
          if (this.isTeacher() && !this.isPresenting && !this._initialStaleCleaned) {
            this._initialStaleCleaned = true;
            setTimeout(() => {
              if (!this.isPresenting && !this.isRemoteBroadcastingActive) {
                this.cleanUpOrphanedPresentationData(false);
              }
            }, 1200);
          }
        } else {
          // 當前有活躍廣播
          const isMyBroadcast = Boolean((data.hostUid && data.hostUid === myUser.uid) || this.localIsHost);
          if (this.isTeacher() || this.localIsHost || isMyBroadcast) {
            if (isMyBroadcast || !data.hostUid || data.hostUid === myUser.uid) {
              this.isPresenting = true;
              this.isRemoteBroadcastingActive = false;
              this.markAsHost();
              // 主持人掛載 submissions 監聽以收取學生作答
              this.attachSubmissionsListener();
            } else {
              // 另一位老師正在廣播
              this.isRemoteBroadcastingActive = true;
              this.isPresenting = false;
              this.attachLivePresentationListeners();
            }
          } else {
            // 學生端：跟隨老師同步廣播，按需掛載監聽器 (學生端絕不掛載 submissions，節省巨大頻寬)
            this.isRemoteBroadcastingActive = true;
            this.isPresenting = true;
            this.attachLivePresentationListeners();

            if (window.app && typeof window.app.switchToTab === 'function') {
              if (window.app.activeTabId !== 'panel-presentation') {
                window.app.switchToTab('panel-presentation');
              }
            }
            if (typeof data.currentSlideIndex === 'number' && data.currentSlideIndex !== this.currentSlideIndex) {
              this.currentSlideIndex = data.currentSlideIndex;
              this.onSlideChanged();
            }
          }
        }
        this.updateSyncButtonUI();
        this.updatePermissionsUI();
      });
    }

    // 動態掛載學生端即時監聽器 (僅在廣播中掛載，結束時卸載)
    attachLivePresentationListeners() {
      if (this._isLiveListenersAttached || typeof db === 'undefined') return;
      this._isLiveListenersAttached = true;
      const presRef = db.ref('presentation');

      this._onSlidesChange = (snap) => {
        const cloudSlides = snap.val();
        if (cloudSlides && Array.isArray(cloudSlides) && this.isRemoteBroadcastingActive) {
          this.slides = cloudSlides;
          this.render();
        }
      };

      this._onLaserChange = (snap) => {
        const laser = snap.val();
        if (this.isRemoteBroadcastingActive && laser) {
          this.updateLaserPointer(laser.rx, laser.ry, laser.active);
        }
      };

      this._onAnnotationsChange = (snap) => {
        const annots = snap.val();
        this.annotations = annots || {};
        this.redrawAnnotations();
      };

      presRef.child('slides').on('value', this._onSlidesChange);
      presRef.child('laser').on('value', this._onLaserChange);
      presRef.child('annotations').on('value', this._onAnnotationsChange);
    }

    // 卸載學生端即時監聽器
    detachLivePresentationListeners() {
      if (!this._isLiveListenersAttached || typeof db === 'undefined') return;
      this._isLiveListenersAttached = false;
      const presRef = db.ref('presentation');
      if (this._onSlidesChange) presRef.child('slides').off('value', this._onSlidesChange);
      if (this._onLaserChange) presRef.child('laser').off('value', this._onLaserChange);
      if (this._onAnnotationsChange) presRef.child('annotations').off('value', this._onAnnotationsChange);
    }

    // 老師端專用：掛載學生作答回傳監聽器
    attachSubmissionsListener() {
      if (this._isSubmissionsListenerAttached || typeof db === 'undefined') return;
      this._isSubmissionsListenerAttached = true;
      const presRef = db.ref('presentation');

      this._onSubmissionsChange = (snap) => {
        this.submissions = snap.val() || {};
        this.renderSubmissionsSidebar();
      };

      presRef.child('submissions').on('value', this._onSubmissionsChange);
    }

    // 老師端專用：卸載學生作答回傳監聽器
    detachSubmissionsListener() {
      if (!this._isSubmissionsListenerAttached || typeof db === 'undefined') return;
      this._isSubmissionsListenerAttached = false;
      const presRef = db.ref('presentation');
      if (this._onSubmissionsChange) presRef.child('submissions').off('value', this._onSubmissionsChange);
    }

    // 清理雲端簡報暫存空間 (一鍵清除 40MB+ 大檔與歷史作答，釋放 Firebase 頻寬與儲存空間)
    cleanUpOrphanedPresentationData(showConfirm = true) {
      if (typeof db === 'undefined') return;

      const doClean = () => {
        db.ref('presentation/slides').remove().catch(() => {});
        db.ref('presentation/submissions').remove().catch(() => {});
        db.ref('presentation/annotations').remove().catch(() => {});
        db.ref('presentation/laser').remove().catch(() => {});
        if (!this.isPresenting) {
          db.ref('presentation/live').set({
            isPresenting: false,
            currentSlideIndex: 0,
            hostUid: '',
            hostName: '',
            updatedAt: Date.now()
          }).catch(() => {});
        }
        if (showConfirm) {
          this.notify('🧹 清理完成', '已清理 Firebase 雲端簡報暫存，大幅釋放資料庫頻寬與儲存空間！');
        }
      };

      if (showConfirm) {
        if (window.app && typeof window.app.showConfirmModal === 'function') {
          window.app.showConfirmModal(
            '🧹',
            '清理雲端簡報暫存',
            '確定要清理 Firebase 雲端簡報暫存嗎？這將刪除目前雲端殘留的投影片大圖與作答暫存，立即釋放資料庫空間與流量（不會影響本機目前編輯內容）。',
            doClean
          );
        } else {
          doClean();
        }
      } else {
        doClean();
      }
    }

    // 廣播雷射筆位置 (節流 65ms 與微動略過，大幅減少高頻小封包)
    broadcastLaser(rx, ry, active) {
      if (!this.isPresenting || typeof db === 'undefined') return;
      const now = Date.now();
      if (active) {
        if (now - this.lastLaserBroadcast < 65) return;
        if (typeof this.lastLaserRx === 'number') {
          const dist = Math.hypot(rx - this.lastLaserRx, ry - this.lastLaserRy);
          if (dist < 0.005) return; // 微小抖動略過發送
        }
      } else {
        if (this.lastLaserActive === false) return;
      }

      this.lastLaserBroadcast = now;
      this.lastLaserRx = rx;
      this.lastLaserRy = ry;
      this.lastLaserActive = active;

      db.ref('presentation/laser').set({
        rx: Math.round(rx * 1000) / 1000,
        ry: Math.round(ry * 1000) / 1000,
        active,
        ts: now
      }).catch(() => {});
    }

    // 廣播繪圖標註
    broadcastAnnotations(slideId) {
      if (!this.isPresenting || typeof db === 'undefined') return;
      db.ref(`presentation/annotations/${slideId}`).set(this.annotations[slideId] || []).catch(() => {});
    }

    // 廣播當前簡報狀態給全班 (極速優化：翻頁時僅同步頁碼，僅增刪頁時才傳輸完整投影片)
    broadcastLiveState(syncSlides = false) {
      if (typeof db === 'undefined') return;
      const user = this.getUserInfo();
      db.ref('presentation/live').set({
        isPresenting: this.isPresenting,
        currentSlideIndex: this.currentSlideIndex,
        hostUid: user.uid,
        hostName: user.name,
        updatedAt: Date.now()
      }).catch(err => console.warn('broadcastLiveState error:', err));

      if (syncSlides && this.isPresenting && this.slides.length > 0) {
        try {
          db.ref('presentation/slides').set(this.slides).catch(err => console.warn('Slide sync warning:', err));
        } catch (e) {
          console.warn('Cannot write full slides to Firebase:', e);
        }
      }
    }

    // 開啟同步廣播
    startSyncPresentation() {
      this.markAsHost();
      if (this.slides.length === 0) {
        this.notify('提示', '請先新增至少一頁簡報才能開始同步！');
        return;
      }

      const user = this.getUserInfo();
      this.isPresenting = true;
      this.isRemoteBroadcastingActive = false;
      this.attachSubmissionsListener();

      if (typeof db !== 'undefined') {
        const liveRef = db.ref('presentation/live');
        liveRef.set({
          isPresenting: true,
          currentSlideIndex: this.currentSlideIndex,
          hostUid: user.uid,
          hostName: user.name,
          updatedAt: Date.now()
        }).catch(err => console.warn('startSyncPresentation error:', err));

        // 離線自動解除廣播：關閉分頁或斷線時將 isPresenting 標記為 false
        liveRef.child('isPresenting').onDisconnect().set(false);

        if (this.slides.length > 0) {
          try {
            db.ref('presentation/slides').set(this.slides).catch(() => {});
          } catch (e) {}
        }
      }

      this.updateSyncButtonUI();
      this.updatePermissionsUI();
      this.notify('🎉 同步簡報已開啟', '全班學生畫面將自動同步顯示當前簡報！');
    }

    // 結束同步廣播 (圖 1：確實停止廣播並清理狀態)
    stopSyncPresentation() {
      this.markAsHost();
      this.isPresenting = false;
      this.isRemoteBroadcastingActive = false;

      if (typeof db !== 'undefined') {
        db.ref('presentation/live').set({
          isPresenting: false,
          currentSlideIndex: this.currentSlideIndex,
          hostUid: '',
          hostName: '',
          updatedAt: Date.now()
        }).catch(err => console.warn('stopSyncPresentation error:', err));

        // 結束同步時徹底清空雲端資料庫中的投影片與學生作答，釋放資料庫頻寬與儲存空間
        this.cleanUpOrphanedPresentationData(false);
      }

      this.detachLivePresentationListeners();
      this.detachSubmissionsListener();
      this.updateSyncButtonUI();
      this.updatePermissionsUI();
      this.render();
      this.notify('🏁 同步簡報已結束', '已關閉學生跟隨同步，並釋放雲端暫存頻寬。');
    }

    // 切換開始/結束同步簡報 (圖 1)
    toggleSyncPresentation() {
      if (this.isPresenting) {
        this.stopSyncPresentation();
      } else {
        this.startSyncPresentation();
      }
    }

    // 更新同步按鈕狀態外觀
    updateSyncButtonUI() {
      const btn = this.els.btnStartSync;
      const badge = this.els.liveBadge;
      if (!btn) return;

      if (this.isPresenting) {
        btn.classList.add('is-active');
        btn.innerHTML = '<span>🏁 結束簡報</span>';
        if (badge) badge.style.display = 'inline-flex';
      } else {
        btn.classList.remove('is-active');
        btn.innerHTML = '<span>🎉 開始同步簡報</span>';
        if (badge) badge.style.display = 'none';
      }
    }

    // 設定標記筆色彩 (圖 2)
    setPenColor(color) {
      this.penColor = color;
      if (this.els.penColorDot) {
        this.els.penColorDot.style.backgroundColor = color;
      }
      const btns = document.querySelectorAll('.presentation-palette-color');
      btns.forEach(btn => {
        btn.classList.toggle('is-selected', btn.dataset.color === color);
      });
    }

    // 設定當前標註工具 ('none' | 'pen' | 'laser')
    setTool(tool) {
      this.currentTool = tool;
      const { btnToolPen, btnToolLaser, annotationCanvas, screen, penPalette } = this.els;

      if (btnToolPen) btnToolPen.classList.toggle('active', tool === 'pen');
      if (btnToolLaser) btnToolLaser.classList.toggle('active', tool === 'laser');

      if (annotationCanvas) {
        annotationCanvas.classList.toggle('interactive', tool === 'pen');
      }
      if (screen) {
        screen.style.cursor = tool === 'laser' ? 'crosshair' : (tool === 'pen' ? 'crosshair' : 'default');
      }

      if (tool !== 'pen' && penPalette) {
        penPalette.style.display = 'none';
      }

      if (tool !== 'laser') {
        this.updateLaserPointer(0, 0, false);
        this.broadcastLaser(0, 0, false);
      }
    }

    // 更新雷射筆外觀座標 (圖 3：半透明黃色圓圈 + 點擊手勢指針)
    updateLaserPointer(rx, ry, active) {
      const dot = this.els.laserDot;
      if (!dot) return;

      if (!active) {
        dot.style.display = 'none';
        return;
      }

      dot.style.display = 'block';
      dot.style.left = `${rx * 100}%`;
      dot.style.top = `${ry * 100}%`;
    }

    // 清除當前頁面的標記 (全螢幕友好確認彈窗)
    clearAnnotations() {
      const slide = this.getCurrentSlide();
      if (!slide) return;
      this.showConfirm('🧹', '清除本頁標記', '確定要清除此頁的所有手繪標記嗎？', () => {
        delete this.annotations[slide.id];
        if (this.draft) this.draft.schedule();
        this.redrawAnnotations();
        if (this.isPresenting && typeof db !== 'undefined') {
          db.ref(`presentation/annotations/${slide.id}`).remove().catch(() => {});
        }
        this.notify('已清除', '已清除本頁所有手繪標記！');
      });
    }

    // 繪製當前未放開滑鼠的筆劃
    drawCurrentStroke() {
      if (!this.currentStroke || this.currentStroke.points.length < 2) return;
      const canvas = this.els.annotationCanvas;
      if (!canvas || canvas.width === 0) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      const pts = this.currentStroke.points;
      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];

      ctx.beginPath();
      ctx.strokeStyle = this.currentStroke.color || this.penColor || '#ef4444';
      ctx.lineWidth = this.currentStroke.width || this.penWidth || 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(p1[0] * w, p1[1] * h);
      ctx.lineTo(p2[0] * w, p2[1] * h);
      ctx.stroke();
    }

    // 重繪當前頁面的全部標註
    redrawAnnotations() {
      const canvas = this.els.annotationCanvas;
      if (!canvas || canvas.width === 0) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const slide = this.getCurrentSlide();
      if (!slide) return;

      const strokes = this.annotations[slide.id] || [];
      const w = canvas.width;
      const h = canvas.height;

      strokes.forEach(stroke => {
        if (!stroke.points || stroke.points.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = stroke.color || '#ef4444';
        ctx.lineWidth = stroke.width || 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(stroke.points[0][0] * w, stroke.points[0][1] * h);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i][0] * w, stroke.points[i][1] * h);
        }
        ctx.stroke();
      });
    }

    // 取得當前顯示中的簡報頁面物件
    getCurrentSlide() {
      if (this.slides.length === 0) return null;
      return this.slides[this.currentSlideIndex] || null;
    }

    // 翻到下一頁 (若為僅老師操作簡報，學生端鎖定跟隨；若學生可參與互動，則允許自行翻頁)
    nextSlide() {
      if (this.isRemoteBroadcastingActive && !this.isTeacher()) {
        if (!this.studentCanUsePresentation) {
          this.notify('提示', '目前設定為「僅老師操作簡報，同學不能參與簡報中的互動」，簡報頁面由老師主控跟隨。');
          return;
        }
      }
      if (this.currentSlideIndex < this.slides.length - 1) {
        this.currentSlideIndex++;
        this.onSlideChanged();
      }
    }

    // 翻到上一頁
    prevSlide() {
      if (this.isRemoteBroadcastingActive && !this.isTeacher()) {
        if (!this.studentCanUsePresentation) {
          this.notify('提示', '目前設定為「僅老師操作簡報，同學不能參與簡報中的互動」，簡報頁面由老師主控跟隨。');
          return;
        }
      }
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--;
        this.onSlideChanged();
      }
    }

    // 跳轉到指定頁
    goToSlide(index) {
      if (this.isRemoteBroadcastingActive && !this.isTeacher()) {
        if (!this.studentCanUsePresentation) {
          this.notify('提示', '目前設定為「僅老師操作簡報，同學不能參與簡報中的互動」，簡報頁面由老師主控跟隨。');
          return;
        }
      }
      if (index >= 0 && index < this.slides.length) {
        this.currentSlideIndex = index;
        this.onSlideChanged();
      }
    }

    // 頁面變更觸發動作 (極速優化：翻頁時不重寫整份簡報圖檔，僅更新頁碼狀態)
    onSlideChanged() {
      this.myAnswers = {};
      this.currentStudentQuestionIndex = 0;
      this.isFloatingDrawerOpen = false;
      this.studentDrawStrokes = [];
      this.resetSlideZoom();
      if (this.els.studentDrawCanvas) {
        const ctx = this.els.studentDrawCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.els.studentDrawCanvas.width, this.els.studentDrawCanvas.height);
      }
      if (this.els.annotationCanvas) {
        const actx = this.els.annotationCanvas.getContext('2d');
        actx.clearRect(0, 0, this.els.annotationCanvas.width, this.els.annotationCanvas.height);
      }
      this.selectedSubmissionIds.clear();
      this.render();
      if (this.isPresenting && !this.isRemoteBroadcastingActive) {
        this.broadcastLiveState(false);
      }
    }

    // 建立新簡報 (圖 2: 清空當前簡報並建立全新投影片，全螢幕友好)
    createNewPresentation() {
      if (!this.canControlPresentation()) return;
      const doCreate = () => {
        this.markAsHost();
        if (this.isPresenting) {
          this.stopSyncPresentation();
        }

        if (this.draft) this.draft.markReset();
        this.slides = [];
        this.currentSlideIndex = 0;
        this.annotations = {};
        this.submissions = {};
        this.myAnswers = {};
        this.studentDrawStrokes = [];
        this.selectedSubmissionIds.clear();

        // 清除 Firebase 上的簡報與互動記錄
        if (typeof db !== 'undefined') {
          db.ref('presentation/slides').remove().catch(() => {});
          db.ref('presentation/annotations').remove().catch(() => {});
          db.ref('presentation/submissions').remove().catch(() => {});
          db.ref('presentation/laser').remove().catch(() => {});
        }

        this.updatePermissionsUI();
        this.render();
        this.notify('🎉 新簡報已建立', '已清空並建立全新簡報！可點擊「+ 純色頁」或「+ 圖片頁」開始編排。');
      };

      if (this.slides.length > 0) {
        this.showConfirm('➕', '建立新簡報', '確定要建立新簡報嗎？這將清空目前的簡報頁面與隨堂作答記錄。', doCreate);
      } else {
        doCreate();
      }
    }

    // 新增純色頁
    addColorSlide(color = '#1e293b') {
      this.markAsHost();
      const newSlide = {
        id: 'slide_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        type: 'color',
        bgColor: color,
        bgUrl: '',
        externalLinks: [],
        externalUrl: '',
        externalUrlTitle: '',
        urlPosition: 'center',
        urlTarget: 'iframe',
        displayMode: 'step',
        allowAsyncAnswer: false,
        questions: []
      };
      this.slides.push(newSlide);
      this.currentSlideIndex = this.slides.length - 1;
      this.updatePermissionsUI();
      this.render();
      if (this.isPresenting) this.broadcastLiveState(true);
      this.notify('已新增', `已新增第 ${this.slides.length} 頁純色簡報頁面！`);
    }

    // 處理圖片頁上傳 (可多選)
    handleImageSlideUpload(e) {
      this.markAsHost();
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      let loadedCount = 0;
      files.forEach((file) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const rawUrl = event.target.result;
          const img = new Image();
          img.onload = () => {
            let w = img.naturalWidth || img.width;
            let h = img.naturalHeight || img.height;
            const maxDim = 1440;
            if (w > maxDim || h > maxDim) {
              const scale = maxDim / Math.max(w, h);
              w = Math.round(w * scale);
              h = Math.round(h * scale);
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            const compressedDataUrl = canvas.toDataURL('image/webp', 0.8);

            this.slides.push({
              id: 'slide_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
              type: 'image',
              bgColor: '#0f172a',
              bgUrl: compressedDataUrl,
              externalLinks: [],
              externalUrl: '',
              externalUrlTitle: '',
              urlPosition: 'center',
              urlTarget: 'iframe',
              displayMode: 'step',
              allowAsyncAnswer: false,
              questions: []
            });
            loadedCount++;
            if (loadedCount === files.length) {
              this.currentSlideIndex = this.slides.length - 1;
              this.updatePermissionsUI();
              this.render();
              if (this.isPresenting) this.broadcastLiveState(true);
              this.notify('成功', `已新增 ${files.length} 張圖片簡報頁面！`);
            }
          };
          img.onerror = () => {
            this.slides.push({
              id: 'slide_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
              type: 'image',
              bgColor: '#0f172a',
              bgUrl: rawUrl,
              externalLinks: [],
              externalUrl: '',
              externalUrlTitle: '',
              urlPosition: 'center',
              urlTarget: 'iframe',
              displayMode: 'step',
              allowAsyncAnswer: false,
              questions: []
            });
            loadedCount++;
            if (loadedCount === files.length) {
              this.currentSlideIndex = this.slides.length - 1;
              this.updatePermissionsUI();
              this.render();
              if (this.isPresenting) this.broadcastLiveState(true);
              this.notify('成功', `已新增 ${files.length} 張圖片簡報頁面！`);
            }
          };
          img.src = rawUrl;
        };
        reader.readAsDataURL(file);
      });

      e.target.value = '';
    }

    // 刪除指定頁面 (全螢幕友好)
    deleteSlide(index) {
      this.markAsHost();
      this.showConfirm('🗑️', '刪除簡報頁面', '確定要刪除第 ' + (index + 1) + ' 頁嗎？', () => {
        const deletedSlide = this.slides[index];
        if (deletedSlide) {
          delete this.annotations[deletedSlide.id];
        }

        this.slides.splice(index, 1);
        if (this.currentSlideIndex >= this.slides.length) {
          this.currentSlideIndex = Math.max(0, this.slides.length - 1);
        }

        this.updatePermissionsUI();
        this.render();
        if (this.isPresenting) this.broadcastLiveState(true);
        this.notify('已刪除', '已刪除第 ' + (index + 1) + ' 頁簡報。');
      });
    }

    // 主渲染流程
    render() {
      const { els } = this;
      if (!els.panel) return;
      if (this.draft) this.draft.schedule();

      const total = this.slides.length;
      const current = total > 0 ? this.currentSlideIndex + 1 : 0;
      const slide = this.getCurrentSlide();

      // 頁碼文字更新
      if (els.pageCounter) {
        els.pageCounter.textContent = `${current} / ${total}`;
      }

      // 翻頁按鈕可用狀態
      if (els.btnPrev) els.btnPrev.disabled = this.currentSlideIndex <= 0;
      if (els.btnNext) els.btnNext.disabled = this.currentSlideIndex >= total - 1;

      // 簡報畫面渲染
      if (!slide) {
        if (els.screenBg) els.screenBg.style.display = 'none';
        if (els.emptyHint) {
          if (!this.canControlPresentation() && !this.isPresenting) {
            els.emptyHint.innerHTML = `
              <span style="font-size: 38px;">🔒</span>
              <span style="font-weight: 700; color: var(--text-secondary); font-size: 16px;">目前設定為「僅老師進行簡報」</span>
              <span style="font-size: 14px; color: var(--text-muted);">請等待老師開啟同步簡報或開放操作權限</span>
            `;
          } else {
            els.emptyHint.innerHTML = `
              <span style="font-size: 36px;">📊</span>
              <span>從左側新增頁面開始建立簡報</span>
            `;
          }
          els.emptyHint.style.display = 'flex';
        }
        if (els.urlBadge) els.urlBadge.style.display = 'none';
        if (els.urlBadgesContainer) {
          els.urlBadgesContainer.style.display = 'none';
          els.urlBadgesContainer.innerHTML = '';
        }
      } else {
        if (els.emptyHint) els.emptyHint.style.display = 'none';
        if (els.screenBg) {
          els.screenBg.style.display = 'block';
          if (slide.type === 'image' && slide.bgUrl) {
            els.screenBg.style.backgroundImage = `url("${slide.bgUrl}")`;
            els.screenBg.style.backgroundColor = '#0f172a';
          } else {
            els.screenBg.style.backgroundImage = 'none';
            els.screenBg.style.backgroundColor = slide.bgColor || '#1e293b';
          }
        }

        // 外部 URL 懸浮按鈕清單 (最多 3 個)
        this.renderExternalUrlBadges(slide);
      }

      // 更新畫布尺寸並重繪
      this.updateCanvasDimensions();

      // 側欄縮圖清單
      this.renderThumbnails();

      // 右側即時提交欄
      this.renderSubmissionsSidebar();

      // 學生端作答卡片 / 浮動表情回饋條
      this.renderStudentInteraction();
    }

    // 渲染左側縮圖列表
    renderThumbnails() {
      const container = this.els.thumbnailsList;
      if (!container) return;
      container.innerHTML = '';

      this.slides.forEach((slide, index) => {
        const card = document.createElement('div');
        card.className = `presentation-thumbnail-card ${index === this.currentSlideIndex ? 'active' : ''}`;
        card.onclick = () => {
          if (this.isRemoteBroadcastingActive && !this.isTeacher()) {
            this.notify('提示', '目前正處於跟隨老師同步簡報中，頁面由老師統一控制。若老師停止同步即可自由點閱。');
            return;
          }
          this.goToSlide(index);
        };

        if (slide.type === 'image' && slide.bgUrl) {
          card.innerHTML = `<img class="presentation-thumbnail-img" src="${slide.bgUrl}" alt="第 ${index + 1} 頁">`;
        } else {
          card.innerHTML = `<div class="presentation-thumbnail-color" style="background-color: ${slide.bgColor || '#1e293b'}"></div>`;
        }

        card.innerHTML += `<div class="presentation-thumbnail-badge">${index + 1}</div>`;

        // 刪除按鈕 (僅授權主控者可見)
        if (this.canControlPresentation()) {
          const delBtn = document.createElement('button');
          delBtn.className = 'presentation-thumbnail-del';
          delBtn.innerHTML = '✕';
          delBtn.title = '刪除此頁';
          delBtn.onclick = (e) => {
            e.stopPropagation();
            this.deleteSlide(index);
          };
          card.appendChild(delBtn);
        }

        container.appendChild(card);
      });
    }

    // 渲染右側即時提交欄 (圖 4: 支援手繪作答縮圖卡片、勾選與並排比較)
    renderSubmissionsSidebar() {
      const { submissionsList, submissionsStats, txtSelectedCountBadge } = this.els;
      if (!submissionsList) return;

      const slide = this.getCurrentSlide();
      if (!slide) {
        submissionsList.innerHTML = '<div class="presentation-submissions-empty">尚未選取任何簡報頁面。</div>';
        if (submissionsStats) submissionsStats.textContent = '';
        if (txtSelectedCountBadge) txtSelectedCountBadge.textContent = '已選 0';
        return;
      }

      const hasQuestions = (slide.questions && slide.questions.length > 0) || slide.displayMode === 'floating';
      const pageSubs = (this.submissions && this.submissions[slide.id]) || {};
      const subEntries = Object.entries(pageSubs);

      if (!hasQuestions) {
        submissionsList.innerHTML = `
          <div class="presentation-submissions-empty">
            本頁未設定互動。<br>
            <span style="font-size: 14px; opacity: 0.8;">可點擊頂部「⚙️ 本頁設定」新增選擇題、手繪作答或心得回饋。</span>
          </div>
        `;
        if (submissionsStats) {
          let totalAll = 0;
          Object.values(this.submissions || {}).forEach(page => totalAll += Object.keys(page).length);
          submissionsStats.textContent = `全體回應：${totalAll}`;
        }
        if (txtSelectedCountBadge) txtSelectedCountBadge.textContent = '已選 0';
        return;
      }

      if (submissionsStats) {
        submissionsStats.textContent = `${subEntries.length} 則回應`;
      }
      if (txtSelectedCountBadge) {
        txtSelectedCountBadge.textContent = `已選 ${this.selectedSubmissionIds.size}`;
      }

      if (subEntries.length === 0) {
        submissionsList.innerHTML = '<div class="presentation-submissions-empty">目前尚未有同學提交回應...</div>';
        return;
      }

      submissionsList.innerHTML = '';

      // 檢查本頁是否包含手繪作答題或有提交手繪圖檔 (防呆：floating 模式下 slide.questions 可能為 undefined)
      const isDrawQuestion = Array.isArray(slide.questions) && slide.questions.some(q => q.type === 'draw');

      subEntries.slice().reverse().forEach(([uid, sub]) => {
        if (isDrawQuestion || sub.drawDataUrl) {
          // 圖 4 手繪作答縮圖卡片
          const card = document.createElement('div');
          const isSelected = this.selectedSubmissionIds.has(uid);
          card.className = `presentation-draw-submission-card ${isSelected ? 'selected' : ''}`;

          card.innerHTML = `
            <div class="presentation-draw-submission-thumb-wrap">
              <input type="checkbox" class="presentation-draw-submission-checkbox" data-uid="${uid}" ${isSelected ? 'checked' : ''}>
              <img class="presentation-draw-submission-img" src="${sub.drawDataUrl || ''}" alt="${this.escapeHtml(sub.userName || '作品')}" title="點擊放大查看">
            </div>
            <div class="presentation-draw-submission-author">${sub.avatar || '👤'} ${this.escapeHtml(sub.userName || '同學')}</div>
          `;

          const chk = card.querySelector('.presentation-draw-submission-checkbox');
          chk.onclick = (e) => {
            e.stopPropagation();
            if (chk.checked) {
              this.selectedSubmissionIds.add(uid);
              card.classList.add('selected');
            } else {
              this.selectedSubmissionIds.delete(uid);
              card.classList.remove('selected');
            }
            if (txtSelectedCountBadge) {
              txtSelectedCountBadge.textContent = `已選 ${this.selectedSubmissionIds.size}`;
            }
          };

          const img = card.querySelector('.presentation-draw-submission-img');
          img.onclick = () => {
            if (sub.drawDataUrl) {
              this.openZoomModal(sub.drawDataUrl, sub.userName || '同學');
            }
          };

          submissionsList.appendChild(card);
        } else {
          // 一般文字/選擇題作答卡片
          const card = document.createElement('div');
          card.className = 'presentation-submission-card';

          const timeStr = sub.timestamp ? new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
          let answerText = '';
          if (typeof sub.answers === 'string') {
            answerText = sub.answers;
          } else if (typeof sub.answers === 'object') {
            answerText = Object.entries(sub.answers).map(([qid, ans]) => `${ans}`).join(' | ');
          }

          card.innerHTML = `
            <div class="presentation-submission-head">
              <span class="presentation-student-name">${sub.avatar || '👤'} ${this.escapeHtml(sub.userName || '同學')}</span>
              <span class="presentation-submission-time">${timeStr}</span>
            </div>
            <div class="presentation-submission-answer">${this.escapeHtml(answerText)}</div>
          `;
          submissionsList.appendChild(card);
        }
      });
    }

    // 渲染學生端與老師端作答介面 (圖 1 & 圖 2: 可收合、自訂選擇題選項、圖 3: 手繪作答工具列)
    renderStudentInteraction() {
      const area = this.els.studentInteractionArea;
      if (!area) return;
      area.innerHTML = '';

      const slide = this.getCurrentSlide();
      if (!slide) return;

      const questions = Array.isArray(slide.questions) ? slide.questions : [];
      const mode = slide.displayMode || 'step';
      const hasQuestions = questions.length > 0;
      const isTeacherUser = this.isTeacher() || this.localIsHost || (this.isPresenting && !this.isRemoteBroadcastingActive);

      // 檢查非同步廣播與互動權限 (需求 1：僅老師可進行 vs 同學可操作)
      // 1. 老師端隨時可預覽作答
      // 2. 學生端：必須在「學生可以參與簡報中的互動」(this.studentCanUsePresentation === true) 的授權下，且 (處於同步廣播中 或 本頁允許非同步作答)
      let isAllowedToAnswer = false;
      if (isTeacherUser) {
        isAllowedToAnswer = true;
      } else if (this.studentCanUsePresentation) {
        isAllowedToAnswer = this.isRemoteBroadcastingActive || Boolean(slide.allowAsyncAnswer);
      }

      // 若不允許作答
      if (!isAllowedToAnswer) {
        if (this.els.studentDrawBar) this.els.studentDrawBar.style.display = 'none';
        if (this.els.studentDrawCanvas) {
          this.els.studentDrawCanvas.style.display = 'none';
          this.els.studentDrawCanvas.style.pointerEvents = 'none';
        }

        if (hasQuestions) {
          const lockedCard = document.createElement('div');
          lockedCard.className = 'presentation-student-dialog';
          lockedCard.style.cssText = 'padding: 16px 20px; text-align: center; background: rgba(255, 255, 255, 0.96); border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-left: 4px solid #f59e0b; max-width: 360px;';
          if (!this.studentCanUsePresentation) {
            lockedCard.innerHTML = `
              <div style="font-size: 26px; margin-bottom: 6px;">🔒</div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 14px;">目前為觀摩模式</div>
              <div style="font-size: 14px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">
                目前設定為「<strong>僅老師操作簡報，同學不能參與簡報中的互動</strong>」，同學僅能觀看簡報。
              </div>
            `;
          } else {
            lockedCard.innerHTML = `
              <div style="font-size: 26px; margin-bottom: 6px;">🔒</div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 14px;">隨堂作答暫未開放</div>
              <div style="font-size: 14px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">
                本頁互動題目設定為「<strong>僅限老師同步廣播時作答</strong>」。<br>
                請等待老師開啟同步簡報，系統將自動開啟作答！
              </div>
            `;
          }
          area.appendChild(lockedCard);
        }
        return;
      }

      // 手繪作答工具列與畫布狀態控制 (圖 3)
      const hasDrawQuestion = questions.some(q => q.type === 'draw');
      if (this.els.studentDrawBar) {
        this.els.studentDrawBar.style.display = hasDrawQuestion ? 'flex' : 'none';
      }
      if (this.els.studentDrawCanvas) {
        this.els.studentDrawCanvas.style.display = hasDrawQuestion ? 'block' : 'none';
        this.els.studentDrawCanvas.style.pointerEvents = hasDrawQuestion ? 'auto' : 'none';
        if (hasDrawQuestion) {
          this.updateCanvasDimensions();
        }
      }

      // 若完全無題目且不是 floating 模式，不需顯示對話框
      if (!hasQuestions && mode !== 'floating') return;

      // 檢查收合狀態 (圖 1: 同學端可收合；項目 2: 老師端亦可看見互動作答區塊且可收合)
      const isCollapsed = isTeacherUser ? this.isTeacherCollapsed : this.isStudentCollapsed;
      if (isCollapsed && hasQuestions) {
        const pill = document.createElement('div');
        pill.className = 'presentation-collapsed-pill';
        pill.id = 'btnExpandInteractionPill';
        pill.innerHTML = `
          <span>📝</span>
          <span>${isTeacherUser ? '👀 老師預覽作答 (展開 ▴)' : `互動作答 (${questions.length} 題，展開 ▴)`}</span>
        `;
        pill.onclick = () => {
          if (isTeacherUser) this.isTeacherCollapsed = false;
          else this.isStudentCollapsed = false;
          this.renderStudentInteraction();
        };
        area.appendChild(pill);
        return;
      }

      const userInfo = this.getUserInfo();
      const mySub = this.submissions[slide.id]?.[userInfo.uid];
      const isSubmitted = Boolean(mySub);

      // 1. 浮動表情回饋條 (Floating Mode：僅顯示老師勾選設定的表情符號，不附加題目作答)
      if (mode === 'floating') {
        const wrap = document.createElement('div');
        wrap.className = 'presentation-floating-drawer-wrap';

        const bar = document.createElement('div');
        bar.className = 'presentation-floating-reaction-bar';

        const emojis = (Array.isArray(slide.floatingEmojis) && slide.floatingEmojis.length > 0)
          ? slide.floatingEmojis
          : ['👍', '💡', '❓', '❤️', '👏', '😂'];
        emojis.forEach(emo => {
          const btn = document.createElement('button');
          btn.type = 'button';
          const isTextItem = Array.from(String(emo)).length > 2 || /[\u4e00-\u9fa5a-zA-Z0-9]/.test(String(emo));
          btn.className = `presentation-reaction-btn ${isTextItem ? 'is-custom-text' : ''}`;
          btn.textContent = emo;
          btn.title = `點擊送出「${emo}」回饋`;
          btn.onclick = () => this.submitStudentAnswer({ reaction: emo });
          bar.appendChild(btn);
        });
        wrap.appendChild(bar);
        area.appendChild(wrap);
        return;
      }

      // 2. 題目作答對話框 (Step 模式、Scroll 模式、或 Floating 展開時)
      if (!hasQuestions) return;

      const dialog = document.createElement('div');
      dialog.className = 'presentation-student-dialog';

      const totalQ = questions.length;
      if (typeof this.currentStudentQuestionIndex !== 'number' || this.currentStudentQuestionIndex >= totalQ) {
        this.currentStudentQuestionIndex = 0;
      }
      const qIdx = this.currentStudentQuestionIndex;

      // 標題列
      let headTitle = '📝 隨堂互動作答';
      if (mode === 'step') {
        headTitle = `📝 隨堂作答 (第 ${qIdx + 1} / ${totalQ} 題)`;
      } else {
        headTitle = `📝 隨堂作答 (共 ${totalQ} 題)`;
      }
      if (isTeacherUser) {
        headTitle = `👀 老師作答預覽 (${headTitle})`;
      }

      dialog.innerHTML = `
        <div class="presentation-student-dialog-head">
          <span class="presentation-student-dialog-title">${headTitle}</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${isSubmitted ? '<span style="color: #10b981; font-size: 14px; font-weight: 700;">✅ 已提交</span>' : ''}
            <button type="button" class="presentation-collapse-dialog-btn" id="btnCollapseInteraction" title="收合作答視窗" aria-label="收合">▼</button>
            ${mode === 'floating' ? '<button type="button" class="presentation-btn-close-sub" id="btnCloseStudentDrawer" style="background:none;border:none;cursor:pointer;color:#64748b;font-size:14px;" title="收合">✕</button>' : ''}
          </div>
        </div>
        ${mode === 'step' ? `
          <div style="padding: 0 16px;">
            <div class="presentation-step-progress">
              <span>進度 ${qIdx + 1} / ${totalQ}</span>
              <span>${Math.round(((qIdx + 1) / totalQ) * 100)}%</span>
            </div>
            <div class="presentation-step-progress-bar">
              <div class="presentation-step-progress-fill" style="width: ${((qIdx + 1) / totalQ) * 100}%;"></div>
            </div>
          </div>
        ` : ''}
        <div class="presentation-student-dialog-body" id="presStudentDialogBody"></div>
        <div class="presentation-student-dialog-footer" id="presStudentDialogFooter"></div>
      `;

      area.appendChild(dialog);

      // 收合按鈕事件綁定 (圖 1 & 項目 2)
      const collapseBtn = dialog.querySelector('#btnCollapseInteraction');
      if (collapseBtn) {
        collapseBtn.onclick = () => {
          if (isTeacherUser) this.isTeacherCollapsed = true;
          else this.isStudentCollapsed = true;
          this.renderStudentInteraction();
        };
      }

      if (mode === 'floating') {
        const closeBtn = dialog.querySelector('#btnCloseStudentDrawer');
        if (closeBtn) {
          closeBtn.onclick = () => {
            this.isFloatingDrawerOpen = false;
            this.renderStudentInteraction();
          };
        }
      }

      const body = dialog.querySelector('#presStudentDialogBody');
      const footer = dialog.querySelector('#presStudentDialogFooter');

      // 渲染題目函數
      const renderQuestionBlock = (q, displayIndex) => {
        const qContainer = document.createElement('div');
        if (q.type !== 'draw') {
          qContainer.innerHTML = `<div class="presentation-student-q-title">${displayIndex + 1}. ${this.escapeHtml(q.title || '請作答')}</div>`;
        }

        // 快速色塊選擇題 (圖 2: 支援設定選項數量 2~6 與色塊標籤樣式)
        if (q.type === 'quick_choice') {
          const grid = document.createElement('div');
          grid.className = 'presentation-quick-color-options';

          const optCount = q.optCount || 4;
          const optStyle = q.optStyle || 'abcd';
          const labels = this.getOptionLabels(optCount, optStyle);
          const colorClasses = ['opt-red', 'opt-yellow', 'opt-blue', 'opt-green', 'opt-purple', 'opt-orange'];

          labels.forEach((label, i) => {
            const cls = colorClasses[i % colorClasses.length];
            const btn = document.createElement('button');
            btn.type = 'button';
            const isSelected = this.myAnswers[q.id] === label || 
              (label === '◯' && this.myAnswers[q.id] === '○') || 
              (label === '○' && this.myAnswers[q.id] === '◯');
            btn.className = `presentation-color-opt-btn ${cls} ${isSelected ? 'selected' : ''}`;
            if (label === '◯' || label === '○') {
              btn.classList.add('is-circle-btn');
            } else if (label === '✕' || label === '╳' || label === 'X' || label === 'x') {
              btn.classList.add('is-cross-btn');
            }
            btn.textContent = label;
            btn.onclick = () => {
              this.myAnswers[q.id] = label;
              grid.querySelectorAll('.presentation-color-opt-btn').forEach(b => b.classList.remove('selected'));
              btn.classList.add('selected');
            };
            grid.appendChild(btn);
          });
          qContainer.appendChild(grid);
        }
        // 手繪標記作答題 (圖 5: 移除題幹標題與下方重複按鈕，說明文字指向畫面上方「提交作答」)
        else if (q.type === 'draw') {
          const drawNotice = document.createElement('div');
          drawNotice.style.background = '#e0f2fe';
          drawNotice.style.border = '1px dashed #0284c7';
          drawNotice.style.borderRadius = '8px';
          drawNotice.style.padding = '12px';
          drawNotice.style.fontSize = '14px';
          drawNotice.style.color = '#0369a1';
          drawNotice.style.lineHeight = '1.6';
          drawNotice.style.textAlign = 'center';
          drawNotice.innerHTML = `
            🎨 <b>手繪標記作答模式</b><br>
            請直接於簡報畫布上手繪作答, 完成後點擊畫面上方「提交作答」送出!
          `;
          qContainer.appendChild(drawNotice);
        }
        // 自訂文字選擇題
        else if (q.type === 'choice') {
          const list = document.createElement('div');
          list.className = 'presentation-choice-list';
          (q.options || ['A', 'B', 'C', 'D']).forEach(optText => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `presentation-choice-btn ${this.myAnswers[q.id] === optText ? 'selected' : ''}`;
            btn.textContent = optText;
            btn.onclick = () => {
              this.myAnswers[q.id] = optText;
              list.querySelectorAll('.presentation-choice-btn').forEach(b => b.classList.remove('selected'));
              btn.classList.add('selected');
            };
            list.appendChild(btn);
          });
          qContainer.appendChild(list);
        }
        // 文字心得回覆
        else if (q.type === 'text') {
          const textarea = document.createElement('textarea');
          textarea.className = 'presentation-text-answer-input';
          textarea.placeholder = '請在此輸入您的想法或回答...';
          textarea.value = this.myAnswers[q.id] || '';
          textarea.oninput = (e) => {
            this.myAnswers[q.id] = e.target.value;
          };
          qContainer.appendChild(textarea);
        }
        // 評分 (1~5 星)
        else if (q.type === 'rating') {
          const ratingWrap = document.createElement('div');
          ratingWrap.style.display = 'flex';
          ratingWrap.style.gap = '8px';
          [1, 2, 3, 4, 5].forEach(star => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `presentation-tool-btn ${this.myAnswers[q.id] === `${star} 顆星` ? 'active' : ''}`;
            btn.textContent = `⭐ ${star}`;
            btn.onclick = () => {
              this.myAnswers[q.id] = `${star} 顆星`;
              ratingWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
            };
            ratingWrap.appendChild(btn);
          });
          qContainer.appendChild(ratingWrap);
        }

        return qContainer;
      };

      // 根據模式渲染題目本體
      if (mode === 'step') {
        body.appendChild(renderQuestionBlock(questions[qIdx], qIdx));

        // Footer 按鈕: 上一題 / 下一題 / 送出
        if (qIdx > 0) {
          const prevBtn = document.createElement('button');
          prevBtn.type = 'button';
          prevBtn.className = 'presentation-tool-btn';
          prevBtn.textContent = '◀ 上一題';
          prevBtn.onclick = () => {
            this.currentStudentQuestionIndex--;
            this.renderStudentInteraction();
          };
          footer.appendChild(prevBtn);
        }

        if (qIdx < totalQ - 1) {
          const nextBtn = document.createElement('button');
          nextBtn.type = 'button';
          nextBtn.className = 'presentation-tool-btn active';
          nextBtn.textContent = '下一題 ▶';
          nextBtn.onclick = () => {
            this.currentStudentQuestionIndex++;
            this.renderStudentInteraction();
          };
          footer.appendChild(nextBtn);
        } else if (questions[qIdx].type !== 'draw') {
          const submitBtn = document.createElement('button');
          submitBtn.type = 'button';
          submitBtn.className = 'presentation-tool-btn active';
          submitBtn.textContent = isSubmitted ? '重新送出' : '🚀 完成送出';
          submitBtn.onclick = () => {
            if (Object.keys(this.myAnswers).length === 0 && !hasDrawQuestion) {
              this.notify('提示', '請先選擇或填寫答案再送出喔！');
              return;
            }
            this.submitStudentAnswer(this.myAnswers);
          };
          footer.appendChild(submitBtn);
        }
      } else {
        // scroll 模式：展示全部題目
        questions.forEach((q, index) => {
          body.appendChild(renderQuestionBlock(q, index));
        });

        const hasNonDrawQuestion = questions.some(q => q.type !== 'draw');
        if (hasNonDrawQuestion) {
          const submitBtn = document.createElement('button');
          submitBtn.type = 'button';
          submitBtn.className = 'presentation-tool-btn active';
          submitBtn.textContent = isSubmitted ? '重新送出' : '🚀 送出全部答案';
          submitBtn.onclick = () => {
            if (Object.keys(this.myAnswers).length === 0 && !hasDrawQuestion) {
              this.notify('提示', '請先選擇或填寫答案再送出喔！');
              return;
            }
            this.submitStudentAnswer(this.myAnswers);
          };
          footer.appendChild(submitBtn);
        }
      }

      if (footer.children.length === 0) {
        footer.style.display = 'none';
      }
    }

    // 綁定學生端手繪作答工具列事件 (圖 3)
    bindStudentDrawBarEvents() {
      const { studentDrawBar, selStudentDrawWidth, btnStudentDrawClear, btnStudentDrawSubmit } = this.els;
      if (!studentDrawBar) return;

      const colorBtns = studentDrawBar.querySelectorAll('.presentation-draw-color-btn');
      colorBtns.forEach(btn => {
        btn.onclick = () => {
          colorBtns.forEach(b => b.classList.remove('active-color'));
          btn.classList.add('active-color');
          this.studentDrawColor = btn.dataset.color || '#ef4444';
        };
      });

      if (selStudentDrawWidth) {
        selStudentDrawWidth.onchange = (e) => {
          this.studentDrawWidth = parseInt(e.target.value, 10) || 4;
        };
      }

      if (btnStudentDrawClear) {
        btnStudentDrawClear.onclick = () => {
          this.studentDrawStrokes = [];
          this.redrawStudentDrawCanvas();
        };
      }

      if (btnStudentDrawSubmit) {
        btnStudentDrawSubmit.onclick = () => {
          this.submitStudentDrawing();
        };
      }
    }

    // 綁定學生端手繪畫布事件 (圖 3)
    bindStudentDrawCanvasEvents() {
      const { screen, studentDrawCanvas } = this.els;
      if (!screen || !studentDrawCanvas) return;

      const getRatioPos = (e) => {
        const rect = screen.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const zoom = this.slideZoom || 1;
        const panX = this.slidePanX || 0;
        const panY = this.slidePanY || 0;
        const localX = (clientX - rect.left - panX) / zoom;
        const localY = (clientY - rect.top - panY) / zoom;
        const rx = Math.max(0, Math.min(1, localX / rect.width));
        const ry = Math.max(0, Math.min(1, localY / rect.height));
        return { rx, ry };
      };

      let activeStroke = null;

      const onPointerDown = (e) => {
        if (this.isSlidePinching || (e.touches && e.touches.length >= 2)) return;
        const slide = this.getCurrentSlide();
        if (!slide || !slide.questions || !slide.questions.some(q => q.type === 'draw')) return;
        this.updateCanvasDimensions();
        const { rx, ry } = getRatioPos(e);
        this.isStudentDrawing = true;
        activeStroke = {
          color: this.studentDrawColor || '#ef4444',
          width: this.studentDrawWidth || 4,
          points: [[rx, ry]]
        };
        this.studentDrawStrokes.push(activeStroke);
        this.drawStudentStrokeSegment(activeStroke, [rx, ry], [rx, ry]);
      };

      const onPointerMove = (e) => {
        if (this.isSlidePinching || (e.touches && e.touches.length >= 2)) return;
        if (!this.isStudentDrawing || !activeStroke) return;
        const { rx, ry } = getRatioPos(e);
        const prevPt = activeStroke.points[activeStroke.points.length - 1];
        activeStroke.points.push([rx, ry]);
        this.drawStudentStrokeSegment(activeStroke, prevPt, [rx, ry]);
      };

      const onPointerUp = () => {
        this.isStudentDrawing = false;
        activeStroke = null;
      };

      studentDrawCanvas.addEventListener('mousedown', onPointerDown);
      studentDrawCanvas.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      studentDrawCanvas.addEventListener('touchstart', onPointerDown, { passive: true });
      studentDrawCanvas.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);
    }

    // 繪製學生端筆劃段
    drawStudentStrokeSegment(stroke, p1, p2) {
      const { studentDrawCanvas } = this.els;
      if (!studentDrawCanvas) return;
      const ctx = studentDrawCanvas.getContext('2d');
      const w = studentDrawCanvas.width;
      const h = studentDrawCanvas.height;

      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(p1[0] * w, p1[1] * h);
      ctx.lineTo(p2[0] * w, p2[1] * h);
      ctx.stroke();
      ctx.restore();
    }

    // 重繪學生端手繪畫布
    redrawStudentDrawCanvas() {
      const { studentDrawCanvas } = this.els;
      if (!studentDrawCanvas) return;
      const ctx = studentDrawCanvas.getContext('2d');
      const w = studentDrawCanvas.width;
      const h = studentDrawCanvas.height;
      ctx.clearRect(0, 0, w, h);

      if (!this.studentDrawStrokes || this.studentDrawStrokes.length === 0) return;

      this.studentDrawStrokes.forEach(stroke => {
        if (!stroke.points || stroke.points.length === 0) return;
        ctx.save();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        stroke.points.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt[0] * w, pt[1] * h);
          else ctx.lineTo(pt[0] * w, pt[1] * h);
        });
        ctx.stroke();
        ctx.restore();
      });
    }

    // 提交學生端手繪作答 (圖 1: 依據老師設定決定是否包含簡報畫面底圖，預設為不包含)
    submitStudentDrawing() {
      const slide = this.getCurrentSlide();
      if (!slide) return;
      if (!this.studentDrawStrokes || this.studentDrawStrokes.length === 0) {
        this.notify('提示', '請先在畫面上進行手繪標記後再提交作答！');
        return;
      }
      const { studentDrawCanvas } = this.els;
      if (!studentDrawCanvas) return;

      const drawQ = (slide.questions || []).find(q => q.type === 'draw') || { id: 'q_draw' };
      const shouldIncludeBg = Boolean(drawQ.includeSlideBg);

      const doSubmit = (dataUrl) => {
        const user = this.getUserInfo();
        const payload = {
          userName: user.name,
          avatar: user.avatar,
          answers: { [drawQ.id]: '手繪標記作答' },
          drawDataUrl: dataUrl,
          timestamp: Date.now()
        };

        if (typeof db !== 'undefined') {
          db.ref(`presentation/submissions/${slide.id}/${user.uid}`).set(payload)
            .then(() => {
              this.notify('✅ 送出成功', '您的手繪標記作答已成功傳送給老師！');
              this.render();
            })
            .catch(err => {
              this.notify('❌ 失敗', '送出失敗：' + err.message);
            });
        } else {
          if (!this.submissions[slide.id]) this.submissions[slide.id] = {};
          this.submissions[slide.id][user.uid] = payload;
          this.notify('✅ 送出成功', '已在本機記錄您的手繪作答！');
          this.render();
        }
      };

      if (shouldIncludeBg) {
        // 包含簡報畫面底圖：合成投影片內容與手繪筆劃
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = studentDrawCanvas.width;
        exportCanvas.height = studentDrawCanvas.height;
        const ctx = exportCanvas.getContext('2d');

        if (slide.type === 'image' && slide.bgUrl) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.drawImage(img, 0, 0, exportCanvas.width, exportCanvas.height);
            ctx.drawImage(studentDrawCanvas, 0, 0);
            doSubmit(exportCanvas.toDataURL('image/webp', 0.8));
          };
          img.onerror = () => {
            ctx.fillStyle = slide.bgColor || '#0f172a';
            ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
            ctx.drawImage(studentDrawCanvas, 0, 0);
            doSubmit(exportCanvas.toDataURL('image/webp', 0.8));
          };
          img.src = slide.bgUrl;
        } else {
          ctx.fillStyle = slide.bgColor || '#1e293b';
          ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          ctx.drawImage(studentDrawCanvas, 0, 0);
          doSubmit(exportCanvas.toDataURL('image/webp', 0.8));
        }
      } else {
        // 預設為不包含簡報底圖 (圖 1: 僅深色底襯托學生手繪筆劃)
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = studentDrawCanvas.width;
        exportCanvas.height = studentDrawCanvas.height;
        const ctx = exportCanvas.getContext('2d');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        ctx.drawImage(studentDrawCanvas, 0, 0);
        doSubmit(exportCanvas.toDataURL('image/webp', 0.8));
      }
    }

    // 開啟並排對比視窗 (圖 4)
    openComparisonModal() {
      const modal = this.els.modalComparison;
      const container = this.els.comparisonContainer;
      if (!modal || !container) return;

      const slide = this.getCurrentSlide();
      if (!slide) return;
      const pageSubs = (this.submissions && this.submissions[slide.id]) || {};

      const selectedList = Object.entries(pageSubs).filter(([uid, sub]) => this.selectedSubmissionIds.has(uid) && sub.drawDataUrl);
      if (selectedList.length === 0) {
        this.notify('提示', '請先在右側「即時回應」清單勾選要比較的同學手繪作品！');
        return;
      }

      container.innerHTML = '';
      selectedList.forEach(([uid, sub]) => {
        const item = document.createElement('div');
        item.style.background = '#ffffff';
        item.style.border = '1px solid var(--border-color)';
        item.style.borderRadius = '10px';
        item.style.padding = '10px';
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.gap = '8px';
        item.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';

        item.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 700; color: var(--text-primary); font-size: 14px;">${sub.avatar || '👤'} ${this.escapeHtml(sub.userName || '同學')}</span>
            <span style="font-size: 14px; color: var(--text-secondary);">${sub.timestamp ? new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
          </div>
          <div style="background: #0f172a; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; aspect-ratio: 16/9; cursor: pointer;" title="點擊放大查看">
            <img src="${sub.drawDataUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
          </div>
        `;
        item.querySelector('img').onclick = () => this.openZoomModal(sub.drawDataUrl, sub.userName);
        container.appendChild(item);
      });

      this.openModal(modal);
    }

    closeComparisonModal() {
      this.closeModal(this.els.modalComparison);
    }

    // 開啟放大檢視作品彈窗
    openZoomModal(dataUrl, studentName = '同學') {
      const modal = this.els.modalImageZoom;
      const img = this.els.imgZoomPreview;
      const title = this.els.txtZoomStudentTitle;
      if (!modal || !img) return;

      img.src = dataUrl;
      if (title) title.textContent = `🔍 ${studentName} 的手繪作答`;
      this.openModal(modal);
    }

    closeZoomModal() {
      this.closeModal(this.els.modalImageZoom);
    }

    // 送出作答至 Firebase
    submitStudentAnswer(answers) {
      const slide = this.getCurrentSlide();
      if (!slide) return;
      const user = this.getUserInfo();

      const payload = {
        userName: user.name,
        avatar: user.avatar,
        answers: answers,
        timestamp: Date.now()
      };

      if (typeof db !== 'undefined') {
        db.ref(`presentation/submissions/${slide.id}/${user.uid}`).set(payload)
          .then(() => {
            this.notify('✅ 送出成功', '您的作答已即時傳送給老師！');
            this.render();
          })
          .catch(err => {
            this.notify('❌ 失敗', '送出失敗：' + err.message);
          });
      } else {
        if (!this.submissions[slide.id]) this.submissions[slide.id] = {};
        this.submissions[slide.id][user.uid] = payload;
        this.notify('✅ 送出成功', '已記錄您的作答！');
        this.render();
      }
    }

    // 重設本頁提交記錄 (全螢幕友好)
    resetSubmissions() {
      const slide = this.getCurrentSlide();
      if (!slide) return;

      this.showConfirm('🗑️', '重置本頁回應', '確定要清空本頁所有同學的作答回應記錄嗎？此動作無法復原。', () => {
        if (typeof db !== 'undefined') {
          db.ref(`presentation/submissions/${slide.id}`).remove().catch(() => {});
        }
        delete this.submissions[slide.id];
        this.renderSubmissionsSidebar();
        this.notify('已重置', '本頁作答記錄已清空！');
      });
    }

    // 下載回應 CSV 表格
    downloadResponsesCsv() {
      const slide = this.getCurrentSlide();
      if (!slide) return;
      const pageSubs = (this.submissions && this.submissions[slide.id]) || {};
      const entries = Object.values(pageSubs);

      if (entries.length === 0) {
        this.notify('提示', '目前本頁尚無任何提交記錄可下載。');
        return;
      }

      let csvContent = '\uFEFF學生姓名,作答內容,提交時間\n';
      entries.forEach(sub => {
        const name = (sub.userName || '').replace(/"/g, '""');
        let ansStr = '';
        if (typeof sub.answers === 'string') {
          ansStr = sub.answers;
        } else if (typeof sub.answers === 'object') {
          ansStr = Object.values(sub.answers).join('; ');
        }
        if (sub.drawDataUrl) {
          ansStr += (ansStr ? ' ; ' : '') + '[手繪標記作答作品]';
        }
        ansStr = ansStr.replace(/"/g, '""');
        const time = sub.timestamp ? new Date(sub.timestamp).toLocaleString() : '';
        csvContent += `"${name}","${ansStr}","${time}"\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `簡報第${this.currentSlideIndex + 1}頁作答統計_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // 更新全螢幕切換按鈕文字與狀態 (項目 4：全螢幕 <-> 恢復為視窗)
    updateFullscreenButtonUI() {
      const btn = this.els.btnFullscreen || document.getElementById('btnSlideFullscreen');
      if (!btn) return;
      const isFullscreen = Boolean(
        document.fullscreenElement && (
          document.fullscreenElement === this.els.panel ||
          (this.els.panel && this.els.panel.contains(document.fullscreenElement))
        )
      );

      if (isFullscreen) {
        btn.innerHTML = '🗗 恢復為視窗';
        btn.title = '點擊結束全螢幕，恢復為一般視窗 (或按 Esc)';
        btn.classList.add('is-fullscreen-active');
      } else {
        btn.innerHTML = '⛶ 全螢幕';
        btn.title = '進入全螢幕同步簡報';
        btn.classList.remove('is-fullscreen-active');
      }
    }

    // 追蹤開啟系統檔案選取器前的全螢幕狀態
    trackFullscreenBeforeFile() {
      const panel = this.els.panel;
      this.wasFullscreenBeforeFile = Boolean(
        document.fullscreenElement && (
          document.fullscreenElement === panel ||
          (panel && panel.contains(document.fullscreenElement))
        )
      );
    }

    // 嘗試無縫恢復全螢幕狀態
    tryRestoreFullscreen() {
      const panel = this.els.panel;
      if (this.wasFullscreenBeforeFile && panel && !document.fullscreenElement) {
        panel.requestFullscreen().then(() => {
          this.updateFullscreenButtonUI();
        }).catch(() => {});
      }
    }

    // 全螢幕切換
    toggleFullscreen() {
      const panel = this.els.panel;
      if (!panel) return;

      if (!document.fullscreenElement) {
        panel.requestFullscreen().then(() => {
          this.updateFullscreenButtonUI();
        }).catch(err => {
          console.error('Fullscreen request error:', err);
        });
      } else {
        this.wasFullscreenBeforeFile = false;
        document.exitFullscreen().then(() => {
          this.updateFullscreenButtonUI();
        }).catch(() => {});
      }
    }

    // 收合 / 展開左側簡報縮圖側欄（教師端與學生端皆支援）
    toggleLeftSidebar(expand = null) {
      const sidebar = document.getElementById('presentationLeftSidebar');
      const expandBtn = document.getElementById('btnExpandLeftSidebar');
      if (!sidebar) return;
      const isCurrentlyCollapsed = sidebar.classList.contains('is-collapsed');
      const shouldExpand = expand !== null ? Boolean(expand) : isCurrentlyCollapsed;

      if (shouldExpand) {
        sidebar.classList.remove('is-collapsed');
        if (expandBtn) expandBtn.style.display = 'none';
      } else {
        sidebar.classList.add('is-collapsed');
        if (expandBtn) expandBtn.style.display = 'inline-flex';
      }

      setTimeout(() => this.updateCanvasDimensions(), 60);
      setTimeout(() => this.updateCanvasDimensions(), 280);
    }

    // 收合 / 展開右側即時回應側欄（教師端支援）
    toggleRightSidebar(expand = null) {
      const sidebar = document.getElementById('presentationRightSidebar');
      const expandBtn = document.getElementById('btnExpandRightSidebar');
      if (!sidebar) return;
      const isCurrentlyCollapsed = sidebar.classList.contains('is-collapsed');
      const shouldExpand = expand !== null ? Boolean(expand) : isCurrentlyCollapsed;

      if (shouldExpand) {
        sidebar.classList.remove('is-collapsed');
        if (expandBtn) expandBtn.style.display = 'none';
      } else {
        sidebar.classList.add('is-collapsed');
        if (expandBtn && this.canControlPresentation()) {
          expandBtn.style.display = 'inline-flex';
        }
      }

      setTimeout(() => this.updateCanvasDimensions(), 60);
      setTimeout(() => this.updateCanvasDimensions(), 280);
    }

    // ===== 彈窗邏輯：匯入 / 匯出 (圖 3，修復 Item 2) =====
    openImportExportModal() {
      this.openModal(this.els.modalImportExport);
    }

    closeImportExportModal() {
      this.closeModal(this.els.modalImportExport);
    }

    // 觸發 PDF 上傳 (使用 pdf.js 逐頁解析)
    triggerPdfUpload() {
      if (!window.pdfjsLib) {
        this.notify('錯誤', 'PDF.js 解析庫載入中，請稍候重試。');
        return;
      }
      this.trackFullscreenBeforeFile();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf';
      input.onchange = (e) => {
        this.tryRestoreFullscreen();
        this.handlePdfFile(e.target.files[0]);
      };
      input.click();
    }

    // 解析 PDF 檔案並開啟選頁彈窗
    async handlePdfFile(file) {
      if (!file) return;
      this.closeImportExportModal();
      this.notify('解析中', '正在逐頁讀取 PDF 內容，請稍候...');

      try {
        const buffer = await file.arrayBuffer();
        this.currentPdfDoc = await pdfjsLib.getDocument({ data: buffer }).promise;
        this.selectedPdfPages.clear();
        this.openPdfPickerModal();
      } catch (err) {
        console.error('PDF parsing error:', err);
        this.notify('解析失敗', '無法讀取 PDF 檔案，請確認檔案格式是否正確。');
      }
    }

    // 開啟 PDF 逐頁勾選彈窗
    openPdfPickerModal() {
      const modal = this.els.modalPdfPicker;
      const container = this.els.pdfPagesContainer;
      if (!modal || !container || !this.currentPdfDoc) return;

      container.innerHTML = '';
      const resolution = document.getElementById('presentationPdfResolution');
      const customWrap = document.getElementById('presentationPdfCustomWrap');
      const customWidth = document.getElementById('presentationPdfCustomWidth');
      if (resolution && customWrap && customWidth) {
        resolution.value = '1000';
        customWidth.value = '1000';
        customWrap.hidden = true;
        resolution.onchange = () => { customWrap.hidden = resolution.value !== 'custom'; };
      }
      this.openModal(modal);
      const numPages = this.currentPdfDoc.numPages;

      for (let i = 1; i <= numPages; i++) {
        const pageItem = document.createElement('div');
        pageItem.style.display = 'flex';
        pageItem.style.flexDirection = 'column';
        pageItem.style.alignItems = 'center';
        pageItem.style.gap = '6px';
        pageItem.style.padding = '8px';
        pageItem.style.background = '#f8fafc';
        pageItem.style.borderRadius = '8px';
        pageItem.style.border = '1px solid #cbd5e1';
        pageItem.style.cursor = 'pointer';

        pageItem.innerHTML = `
          <canvas id="pdfPreviewCanvas_${i}" style="width: 140px; aspect-ratio: 16/9; object-fit: contain; background: white; border: 1px solid var(--border-color); border-radius: 4px;"></canvas>
          <label style="font-size: 14px; font-weight: 600; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; gap: 4px;">
            <input type="checkbox" class="pdf-page-checkbox" data-page="${i}" checked> 第 ${i} 頁
          </label>
        `;

        this.selectedPdfPages.add(i);

        const chk = pageItem.querySelector('.pdf-page-checkbox');
        chk.onchange = () => {
          if (chk.checked) this.selectedPdfPages.add(i);
          else this.selectedPdfPages.delete(i);
        };

        pageItem.onclick = (e) => {
          if (e.target !== chk) {
            chk.checked = !chk.checked;
            chk.dispatchEvent(new Event('change'));
          }
        };

        container.appendChild(pageItem);

        // 渲染縮圖
        this.currentPdfDoc.getPage(i).then(page => {
          const canvas = document.getElementById(`pdfPreviewCanvas_${i}`);
          if (!canvas) return;
          const viewport = page.getViewport({ scale: 0.3 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
        });
      }
    }

    closePdfPickerModal() {
      this.closeModal(this.els.modalPdfPicker);
      this.currentPdfDoc = null;
      this.tryRestoreFullscreen();
    }

    // 確認將勾選的 PDF 頁數轉換並加入簡報
    async confirmImportPdfPages() {
      if (!this.currentPdfDoc || this.selectedPdfPages.size === 0) {
        this.notify('提示', '請至少勾選一頁 PDF！');
        return;
      }
      const resolution = document.getElementById('presentationPdfResolution');
      const customWidth = document.getElementById('presentationPdfCustomWidth');
      const requestedWidth = Number(resolution?.value === 'custom' ? customWidth?.value : resolution?.value);
      if (!Number.isInteger(requestedWidth) || requestedWidth < 100 || requestedWidth > 4096) {
        this.notify('解析度不正確', '圖片寬度請輸入 100～4096 的整數像素。');
        return;
      }
      this.tryRestoreFullscreen();

      const sortedPages = Array.from(this.selectedPdfPages).sort((a, b) => a - b);
      this.notify('轉換中', `正在將 ${sortedPages.length} 頁 PDF 轉為簡報內容...`);

      for (const pageNum of sortedPages) {
        const page = await this.currentPdfDoc.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        // 使用所選圖片寬度，頁面高度依 PDF 原始比例計算。
        const viewport = page.getViewport({ scale: requestedWidth / unscaledViewport.width });
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = requestedWidth;
        tempCanvas.height = Math.max(1, Math.round(viewport.height));
        await page.render({ canvasContext: tempCanvas.getContext('2d'), viewport }).promise;

        // 使用 0.75 品質 WebP，相較原 JPEG 畫質更清晰但體積大幅縮減 40% 以上
        const imgDataUrl = tempCanvas.toDataURL('image/webp', 0.75);
        this.slides.push({
          id: 'slide_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          type: 'image',
          bgColor: '#0f172a',
          bgUrl: imgDataUrl,
          externalLinks: [],
          externalUrl: '',
          externalUrlTitle: '',
          urlPosition: 'center',
          urlTarget: 'iframe',
          displayMode: 'step',
          allowAsyncAnswer: false,
          questions: []
        });
      }

      this.closePdfPickerModal();
      this.currentSlideIndex = this.slides.length - sortedPages.length;
      this.render();
      if (this.isPresenting) this.broadcastLiveState(true);
      this.notify('匯入成功', `已將 ${sortedPages.length} 頁 PDF 成功設為簡報頁面！`);
    }

    async ensureBackupZipLibrary() {
      if (window.JSZip) return window.JSZip;
      if (!this.backupZipLibraryPromise) {
        this.backupZipLibraryPromise = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          script.onload = () => window.JSZip ? resolve(window.JSZip) : reject(new Error('ZIP 元件無法使用'));
          script.onerror = () => reject(new Error('無法載入 ZIP 元件，請檢查網路連線'));
          document.head.appendChild(script);
        }).catch(error => { this.backupZipLibraryPromise = null; throw error; });
      }
      return this.backupZipLibraryPromise;
    }

    async exportZipBackup() {
      if (!this.slides.length) { this.notify('提示', '目前簡報無任何內容可匯出！'); return; }
      try {
        const JSZip = await this.ensureBackupZipLibrary();
        const zip = new JSZip();
        zip.file('presentation_data.json', JSON.stringify({ version: '1.0', exportedAt: new Date().toISOString(), slides: this.slides }));
        const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `同步簡報備份_${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.closeImportExportModal();
        this.notify('匯出成功', '簡報 ZIP 壓縮備份已下載完成！');
      } catch (error) { this.notify('匯出失敗', error.message || '無法建立 ZIP 備份'); }
    }

    // 匯出 JSON 備份
    exportJsonBackup() {
      if (this.slides.length === 0) {
        this.notify('提示', '目前簡報無任何內容可匯出！');
        return;
      }

      const backupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        slides: this.slides
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `同步簡報備份_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.closeImportExportModal();
      this.notify('匯出成功', '簡報 JSON 備份檔案已下載完成！');
    }

    // 從 JSON 或 ZIP 匯入
    triggerJsonImport() {
      this.trackFullscreenBeforeFile();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.zip,application/json,application/zip';
      input.onchange = async (event) => {
        this.tryRestoreFullscreen();
        const file = event.target.files[0];
        if (!file) return;
        try {
          let json;
          if (/\.zip$/i.test(file.name)) {
            const JSZip = await this.ensureBackupZipLibrary();
            const zip = await JSZip.loadAsync(await file.arrayBuffer());
            const entry = zip.file('presentation_data.json');
            if (!entry) throw new Error('壓縮檔中找不到簡報資料');
            json = await entry.async('string');
          } else {
            json = await file.text();
          }
          const data = JSON.parse(json);
          if (!data || !Array.isArray(data.slides)) throw new Error('簡報資料格式不正確');
          this.slides = data.slides;
          this.currentSlideIndex = 0;
          this.render();
          if (this.isPresenting) this.broadcastLiveState(true);
          this.closeImportExportModal();
          this.notify('匯入成功', `成功匯入 ${this.slides.length} 頁簡報！`);
        } catch (error) {
          this.notify('匯入失敗', error.message || '無法讀取簡報備份檔案');
        }
      };
      input.click();
    }

    // ===== 雲端教材庫核心方法 (存檔、載入、跨班複製、刪除) =====
    openCloudBankModal() {
      this.markAsHost();
      const modal = this.els.modalCloudBank || document.getElementById('modalPresentationCloudBank');
      if (!modal) return;
      this.openModal(modal);
      this.loadCloudBankData(false);
    }

    closeCloudBankModal() {
      const modal = this.els.modalCloudBank || document.getElementById('modalPresentationCloudBank');
      if (!modal) return;
      this.closeModal(modal);
    }

    async loadCloudBankData(showNotification = false) {
      if (typeof db === 'undefined') return;
      const container = document.getElementById('presentationBankListContainer');
      if (container && (!this.materialsBank || Object.keys(this.materialsBank).length === 0)) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 14px;">⏳ 正在連線讀取雲端教材清單...</div>';
      }
      try {
        const snap = await db.ref('presentation_materials').once('value');
        this.materialsBank = snap.val() || {};
        this.renderCloudBankList();
        if (showNotification) {
          this.notify('🔄 已更新', '已重新整理雲端教材清單！');
        }
      } catch (err) {
        console.error('loadCloudBankData error:', err);
        if (container) {
          container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--danger-color); font-size: 14px;">❌ 讀取教材失敗：${err.message || '網路逾時'}</div>`;
        }
      }
    }

    mountCloudBankListener() {
      this.loadCloudBankData(false);
    }

    unmountCloudBankListener() {
      // 保持空函式相容
    }

    onBankSearchInput(query) {
      this.materialSearchQuery = query || '';
      this.renderCloudBankList();
    }

    refreshCloudBankList() {
      this.loadCloudBankData(true);
    }

    // 彈出儲存目前簡報對話框 (支援建立新教材或更新現有教材)
    promptSaveCurrentPresentation() {
      if (!this.slides || this.slides.length === 0) {
        this.notify('提示', '目前無任何簡報內容可儲存！請先上傳 PDF 或新增簡報頁面。');
        return;
      }
      this.openSaveChoiceModal();
    }

    // 開啟儲存教材選擇彈窗 (建立新教材 vs 更新現有教材)
    openSaveChoiceModal() {
      const modal = document.getElementById('modalPresentationSaveChoice');
      if (!modal) return;

      const now = new Date();
      const defaultTitle = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 簡報教材`;

      const newTitleInput = document.getElementById('presSaveNewTitleInput');
      if (newTitleInput) {
        newTitleInput.value = this.currentLoadedMaterialTitle || defaultTitle;
      }

      // 填充現有教材下拉選單
      const selectEl = document.getElementById('presSaveTargetMaterialSelect');
      const updateCard = document.getElementById('presSaveOptionUpdateCard');
      const bankItems = Object.values(this.materialsBank || {});

      if (selectEl) {
        selectEl.innerHTML = '';
        if (bankItems.length > 0) {
          const sortedItems = bankItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          sortedItems.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            const sCount = item.slideCount || (item.slides ? item.slides.length : 0);
            opt.textContent = `${item.title || '未命名教材'} (${sCount} 頁)`;
            if (this.currentLoadedMaterialId && item.id === this.currentLoadedMaterialId) {
              opt.selected = true;
            }
            selectEl.appendChild(opt);
          });
        }
      }

      // 若教材庫目前無任何現有檔案，更新選項反灰或隱藏
      if (updateCard) {
        if (bankItems.length === 0) {
          updateCard.style.opacity = '0.5';
          updateCard.style.pointerEvents = 'none';
        } else {
          updateCard.style.opacity = '1';
          updateCard.style.pointerEvents = 'auto';
        }
      }

      // 預設選取狀態：若是由某教材載入且該教材存在，預設選取「更新現有教材」，否則選取「建立新教材」
      if (this.currentLoadedMaterialId && this.materialsBank && this.materialsBank[this.currentLoadedMaterialId]) {
        this.selectSaveMode('update');
      } else {
        this.selectSaveMode('new');
      }

      this.openModal(modal);
    }

    // 切換儲存模式 (new | update)
    selectSaveMode(mode) {
      const radioNew = document.getElementById('presSaveRadioNew');
      const radioUpdate = document.getElementById('presSaveRadioUpdate');
      const newCard = document.getElementById('presSaveOptionNewCard');
      const updateCard = document.getElementById('presSaveOptionUpdateCard');
      const newWrap = document.getElementById('presSaveNewNameWrap');
      const updateWrap = document.getElementById('presSaveUpdateSelectWrap');

      if (mode === 'update') {
        const bankItems = Object.keys(this.materialsBank || {});
        if (bankItems.length === 0) {
          mode = 'new';
        }
      }

      if (mode === 'new') {
        if (radioNew) radioNew.checked = true;
        if (radioUpdate) radioUpdate.checked = false;
        if (newCard) {
          newCard.style.borderColor = 'var(--accent-color)';
          newCard.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
        }
        if (updateCard) {
          updateCard.style.borderColor = 'var(--border-color)';
          updateCard.style.backgroundColor = 'var(--bg-card)';
        }
        if (newWrap) newWrap.style.display = 'block';
        if (updateWrap) updateWrap.style.display = 'none';
      } else {
        if (radioNew) radioNew.checked = false;
        if (radioUpdate) radioUpdate.checked = true;
        if (newCard) {
          newCard.style.borderColor = 'var(--border-color)';
          newCard.style.backgroundColor = 'var(--bg-card)';
        }
        if (updateCard) {
          updateCard.style.borderColor = 'var(--accent-color)';
          updateCard.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
        }
        if (newWrap) newWrap.style.display = 'none';
        if (updateWrap) updateWrap.style.display = 'block';
      }
    }

    // 關閉儲存模式選擇彈窗
    closeSaveChoiceModal() {
      const modal = document.getElementById('modalPresentationSaveChoice');
      if (modal) {
        this.closeModal(modal);
      }
    }

    // 確認執行儲存 (建立新教材或更新現有教材)
    async confirmSaveChoice() {
      const isNew = document.getElementById('presSaveRadioNew')?.checked;
      if (isNew) {
        const inputEl = document.getElementById('presSaveNewTitleInput');
        const title = (inputEl ? inputEl.value : '').trim();
        if (!title) {
          this.notify('提示', '請輸入教材名稱！');
          if (inputEl) inputEl.focus();
          return;
        }
        this.closeSaveChoiceModal();
        await this.saveCurrentPresentationToCloud(title, null);
      } else {
        const selectEl = document.getElementById('presSaveTargetMaterialSelect');
        const targetId = selectEl ? selectEl.value : null;
        if (!targetId || !this.materialsBank || !this.materialsBank[targetId]) {
          this.notify('提示', '請選擇要更新覆蓋的現有教材！');
          return;
        }
        const targetMaterial = this.materialsBank[targetId];
        const targetTitle = targetMaterial.title || '現有教材';
        this.closeSaveChoiceModal();
        await this.saveCurrentPresentationToCloud(targetTitle, targetId);
      }
    }

    // 儲存目前簡報至雲端教材庫 (targetMaterialId 為 null 時建立新教材；傳入 ID 時更新現有教材)
    async saveCurrentPresentationToCloud(title, targetMaterialId = null) {
      if (!this.slides || this.slides.length === 0) {
        this.notify('提示', '目前無任何簡報內容可儲存！');
        return;
      }

      const finalTitle = (title || '').trim();
      if (!finalTitle) return;

      const isUpdate = Boolean(targetMaterialId);
      this.notify('處理中', isUpdate ? `正在覆蓋更新簡報教材「${finalTitle}」至雲端...` : '正在打包儲存全新簡報教材至雲端...');

      try {
        let totalQuestions = 0;
        this.slides.forEach(s => {
          if (Array.isArray(s.interactiveQuestions)) {
            totalQuestions += s.interactiveQuestions.length;
          }
        });

        let totalAnnotations = 0;
        if (this.annotations) {
          Object.values(this.annotations).forEach(arr => {
            if (Array.isArray(arr)) totalAnnotations += arr.length;
          });
        }

        const materialId = targetMaterialId || `pres_mat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const myUser = this.getUserInfo();
        const existingData = (isUpdate && this.materialsBank) ? this.materialsBank[materialId] : null;

        const materialData = {
          id: materialId,
          title: finalTitle,
          createdAt: existingData?.createdAt || Date.now(),
          updatedAt: Date.now(),
          createdBy: existingData?.createdBy || (myUser.name || '老師'),
          updatedBy: myUser.name || '老師',
          slideCount: this.slides.length,
          annotationCount: totalAnnotations,
          questionCount: totalQuestions,
          slides: this.slides,
          annotations: this.annotations || {}
        };

        if (typeof db === 'undefined') throw new Error('資料庫未連線');

        const { slides, annotations, ...metadata } = materialData;
        const summary = await BoardArchiveStore.save(db.ref(), 'presentation_materials', 'presentation_material_data', materialId, metadata, { slides, annotations });

        // 記錄當前載入的教材資訊
        this.currentLoadedMaterialId = materialId;
        this.currentLoadedMaterialTitle = finalTitle;

        this.notify('🎉 儲存成功', isUpdate ? `已成功覆蓋更新簡報教材「${finalTitle}」！` : `簡報教材「${finalTitle}」已成功儲存為全新雲端教材！`);
        if (!this.materialsBank) this.materialsBank = {};
        this.materialsBank[materialId] = summary;
        this.renderCloudBankList();
      } catch (err) {
        console.error('saveCurrentPresentationToCloud error:', err);
        this.notify('儲存失敗', err.message || '儲存簡報教材時發生錯誤');
      }
    }

    // 渲染雲端教材卡片清單
    renderCloudBankList() {
      const container = document.getElementById('presentationBankListContainer');
      const countBadge = document.getElementById('presentationBankCountBadge');
      if (!container) return;

      const keys = Object.keys(this.materialsBank || {});
      if (countBadge) {
        countBadge.textContent = `共 ${keys.length} 筆簡報教材`;
      }

      if (keys.length === 0) {
        container.innerHTML = `
          <div style="color: var(--text-muted); text-align: center; font-size: 14px; padding: 36px 20px; background: var(--bg-card); border-radius: 10px; border: 1.5px dashed var(--border-color); line-height: 1.6;">
            目前尚無儲存的簡報教材。<br>
            您可以點選上方「➕ 儲存目前簡報為教材」將課堂的簡報內容永久儲存在雲端！
          </div>
        `;
        return;
      }

      const query = (this.materialSearchQuery || '').toLowerCase().trim();
      const sortedKeys = keys.sort((a, b) => {
        const itemA = this.materialsBank[a];
        const itemB = this.materialsBank[b];
        return (itemB.createdAt || 0) - (itemA.createdAt || 0);
      });

      const filteredKeys = sortedKeys.filter(k => {
        if (!query) return true;
        const item = this.materialsBank[k];
        if (!item) return false;
        const title = (item.title || '').toLowerCase();
        const creator = (item.createdBy || '').toLowerCase();
        return title.includes(query) || creator.includes(query);
      });

      if (filteredKeys.length === 0) {
        container.innerHTML = `
          <div style="color: var(--text-muted); text-align: center; font-size: 14px; padding: 24px 20px; background: var(--bg-card); border-radius: 10px; border: 1px dashed var(--border-color);">
            查無符合「${this.escapeHtml(this.materialSearchQuery)}」的簡報教材
          </div>
        `;
        return;
      }

      container.innerHTML = filteredKeys.map(k => {
        const item = this.materialsBank[k];
        const sCount = item.slideCount || (item.slides ? item.slides.length : 0);
        const aCount = item.annotationCount !== undefined ? item.annotationCount : 0;
        const qCount = item.questionCount !== undefined ? item.questionCount : 0;
        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString('zh-TW', { hour12: false }) : '未知時間';

        return `
          <div class="presentation-bank-card">
            <div style="display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="font-weight: 700; font-size: 15px; color: var(--text-primary);">${this.escapeHtml(item.title || '簡報教材')}</span>
                <span style="background: rgba(102, 126, 234, 0.12); color: var(--accent-color); font-size: 14px; padding: 2px 8px; border-radius: 6px; font-weight: 600;">📑 ${sCount} 頁簡報</span>
                ${aCount > 0 ? `<span style="background: rgba(249, 115, 22, 0.12); color: #f97316; font-size: 14px; padding: 2px 8px; border-radius: 6px; font-weight: 600;">✏️ ${aCount} 處標記</span>` : ''}
                ${qCount > 0 ? `<span style="background: rgba(52, 199, 89, 0.12); color: var(--success-color); font-size: 14px; padding: 2px 8px; border-radius: 6px; font-weight: 600;">❓ ${qCount} 道互動題</span>` : ''}
              </div>
              <div style="display: flex; align-items: center; gap: 14px; font-size: 14px; color: var(--text-secondary); flex-wrap: wrap;">
                <span>👤 建立者：${this.escapeHtml(item.createdBy || '老師')}</span>
                <span>🕒 建立時間：${dateStr}</span>
              </div>
            </div>
            <div style="display: flex; gap: 6px; flex-shrink: 0; align-items: center; flex-wrap: wrap;">
              <button type="button" class="presentation-tool-btn active" onclick="window.presentationManager.openLoadChoiceModal('${k}')" style="height: 32px; padding: 0 12px; font-size: 14px; border-radius: 10px; font-weight: bold;" title="載入此簡報檔案">🚀 載入</button>
              <button type="button" class="presentation-tool-btn" onclick="window.presentationManager.copyPresentationMaterial('${k}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; font-weight: bold; color: var(--accent-color); border-color: var(--accent-color);" title="複製此簡報教材到其他班級">📤 複製</button>
              <button type="button" class="presentation-tool-btn" onclick="window.presentationManager.downloadMaterialJson('${k}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; font-weight: bold;" title="下載此教材的 JSON 備份檔案">📥 下載</button>
              <button type="button" class="presentation-tool-btn danger" onclick="window.presentationManager.deletePresentationMaterial('${k}')" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px;" title="刪除此教材">🗑️</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // 開啟載入模式選擇彈窗 (共編 vs 唯讀)
    openLoadChoiceModal(materialId) {
      const material = this.materialsBank && this.materialsBank[materialId];
      if (!material) return;
      this.pendingLoadMaterialId = materialId;

      const titleEl = document.getElementById('presentationLoadChoiceTitle');
      if (titleEl) {
        titleEl.textContent = material.title || '簡報教材';
      }

      const modal = this.els.modalLoadChoice || document.getElementById('modalPresentationLoadChoice');
      if (modal) {
        this.openModal(modal);
      }
    }

    // 關閉載入模式選擇彈窗
    closeLoadChoiceModal() {
      this.pendingLoadMaterialId = null;
      const modal = this.els.modalLoadChoice || document.getElementById('modalPresentationLoadChoice');
      if (modal) {
        this.closeModal(modal);
      }
    }

    // 確認載入教材
    async confirmLoadMaterial(mode = 'edit') {
      if (!this.pendingLoadMaterialId) return;
      const materialId = this.pendingLoadMaterialId;
      const material = this.materialsBank && this.materialsBank[materialId];
      if (!material) {
        this.notify('錯誤', '找不到該教材資料！');
        this.closeLoadChoiceModal();
        return;
      }

      this.notify('載入中', `正在載入簡報「${material.title}」...`);
      this.markAsHost();

      try {
        // 1. 僅在載入時下載壓縮教材並檢查內容
        if (material.format !== 'zip-json-v1') throw new Error('此教材不是目前支援的新格式');
        const content = await BoardArchiveStore.load(db.ref(), 'presentation_material_data', materialId);
        if (!content || !Array.isArray(content.slides)) throw new Error('教材內容不完整');
        this.slides = JSON.parse(JSON.stringify(content.slides));
        this.annotations = JSON.parse(JSON.stringify(content.annotations || {}));
        this.currentSlideIndex = 0;
        this.currentLoadedMaterialId = materialId;
        this.currentLoadedMaterialTitle = material.title || '';

        // 2. 依模式更新權限 (需求 3：學生可以參與互動 vs 僅老師操作簡報)
        const isReadOnly = mode === 'readonly';
        this.studentCanUsePresentation = !isReadOnly;
        if (typeof db !== 'undefined') {
          await db.ref('presentation/settings').update({
            studentCanUsePresentation: !isReadOnly
          });
        }
        this.updatePermissionsUI();

        // 3. 渲染本地畫面 (需求 1：載入後先不自動開啟同步廣播，待老師點擊開始同步再廣播)
        this.isPresenting = false;
        this.updateSyncButtonUI();
        this.render();

        this.closeLoadChoiceModal();
        this.closeCloudBankModal();

        this.notify(
          '載入完成',
          isReadOnly
            ? `簡報「${material.title}」已載入！已設定為「僅老師操作簡報，同學不能參與簡報中的互動」。點擊上方「🚀 開始同步」即可向全班廣播。`
            : `簡報「${material.title}」已載入！已設定為「學生可以參與簡報中的互動」。點擊上方「🚀 開始同步」即可向全班廣播。`
        );
      } catch (err) {
        console.error('confirmLoadMaterial error:', err);
        this.notify('載入失敗', err.message || '載入簡報時發生錯誤');
      }
    }

    // 下載教材備份 JSON
    async downloadMaterialJson(materialId) {
      const material = this.materialsBank && this.materialsBank[materialId];
      if (!material) return;
      let content;
      try {
        if (material.format !== 'zip-json-v1') throw new Error('此教材不是目前支援的新格式');
        content = await BoardArchiveStore.load(db.ref(), 'presentation_material_data', materialId);
        if (!content || !Array.isArray(content.slides)) throw new Error('教材內容不完整');
      } catch (error) { this.notify('下載失敗', error.message); return; }
      const backupData = {
        version: '1.0',
        title: material.title,
        exportedAt: new Date().toISOString(),
        slideCount: material.slideCount,
        questionCount: material.questionCount,
        slides: content.slides,
        annotations: content.annotations
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${material.title || '簡報教材'}_備份.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.notify('匯出成功', `已下載「${material.title}」的 JSON 備份檔案！`);
    }

    // 刪除教材
    deletePresentationMaterial(materialId) {
      const material = this.materialsBank && this.materialsBank[materialId];
      if (!material) return;

      const doDelete = async () => {
        try {
          if (typeof db !== 'undefined') {
            await BoardArchiveStore.remove(db.ref(), 'presentation_materials', 'presentation_material_data', materialId);
          }
          if (this.materialsBank) {
            delete this.materialsBank[materialId];
          }
          this.renderCloudBankList();
          this.notify('🗑️ 刪除成功', `已刪除教材「${material.title || '簡報教材'}」！`);
        } catch (err) {
          this.notify('刪除失敗', err.message || '刪除教材時發生錯誤');
        }
      };

      if (window.app && typeof window.app.showConfirmModal === 'function') {
        window.app.showConfirmModal(
          '🗑️',
          '刪除簡報教材',
          `確定要刪除簡報教材「${material.title || '此教材'}」嗎？刪除後無法復原。`,
          doDelete
        );
      } else {
        if (confirm(`確定要刪除簡報教材「${material.title || '此教材'}」嗎？`)) {
          doDelete();
        }
      }
    }

    // 跨班級複製簡報教材
    copyPresentationMaterial(materialId) {
      if (window.app && typeof window.app.openSingleItemCopyModal === 'function') {
        window.app.openSingleItemCopyModal('presentationMaterial', materialId);
      } else {
        this.notify('提示', '跨班級複製中心未就緒');
      }
    }

    // ===== 彈窗邏輯：本頁設定 (圖 5 + 多題擴充，修復 Item 2) =====
    openSlideSettingsModal() {
      this.markAsHost();
      const slide = this.getCurrentSlide();
      if (!slide) {
        this.notify('提示', '請先新增簡報頁面後再進行設定。');
        return;
      }
      const modal = this.els.modalSlideSettings;
      if (!modal) return;

      // 初始化外部連結清單暫存 (相容舊版 externalUrl)
      if (Array.isArray(slide.externalLinks) && slide.externalLinks.length > 0) {
        this.tempExternalLinks = JSON.parse(JSON.stringify(slide.externalLinks));
      } else if (slide.externalUrl && slide.externalUrl.trim()) {
        this.tempExternalLinks = [{
          title: slide.externalUrlTitle || '外部連結 1',
          url: slide.externalUrl.trim()
        }];
      } else {
        this.tempExternalLinks = [];
      }
      this.renderExternalLinksConfigList();

      const selUrlPos = document.getElementById('selPresUrlPosition');
      if (selUrlPos) selUrlPos.value = slide.urlPosition || 'center';

      const selUrlTarget = document.getElementById('selPresUrlTarget');
      if (selUrlTarget) selUrlTarget.value = slide.urlTarget || 'iframe';

      const selDisplay = document.getElementById('selPresDisplayMode');
      if (selDisplay) selDisplay.value = slide.displayMode || 'step';

      const selAsync = document.getElementById('selPresAllowAsyncAnswer');
      if (selAsync) selAsync.value = slide.allowAsyncAnswer ? 'true' : 'false';

      this.tempFloatingEmojis = (Array.isArray(slide.floatingEmojis) && slide.floatingEmojis.length > 0)
        ? [...slide.floatingEmojis]
        : ['👍', '💡', '❓', '❤️', '👏', '😂'];

      this.tempQuestions = JSON.parse(JSON.stringify(slide.questions || []));
      this.renderQuestionsBuilderList();
      this.onDisplayModeChange(slide.displayMode || 'step');

      this.openModal(modal);
    }

    onDisplayModeChange(mode) {
      const emojiSection = document.getElementById('presFloatingEmojiConfigSection');
      const questionsSection = document.getElementById('presQuestionsBuilderSection');
      if (mode === 'floating') {
        if (emojiSection) emojiSection.style.display = 'block';
        if (questionsSection) questionsSection.style.display = 'none';
        this.renderFloatingEmojiPicker();
      } else {
        if (emojiSection) emojiSection.style.display = 'none';
        if (questionsSection) questionsSection.style.display = 'block';
      }
    }

    renderFloatingEmojiPicker() {
      const grid = document.getElementById('presFloatingEmojiPickerGrid');
      if (!grid) return;
      grid.innerHTML = '';

      // 預設 16 款常用表情符號 + 老師自訂加入的表情或文字 (Item 7A)
      const default16Emojis = [
        '👍', '💡', '❓', '❤️', '👏', '😂', '🎉', '🤔',
        '😮', '🔥', '✅', '🆘', '🙌', '💯', '🤩', '🙏'
      ];
      if (!Array.isArray(this.tempFloatingEmojis) || this.tempFloatingEmojis.length === 0) {
        this.tempFloatingEmojis = ['👍', '💡', '❓', '❤️', '👏', '😂'];
      }
      if (!Array.isArray(this.customFloatingEmojis)) {
        this.customFloatingEmojis = [];
      }

      const allCandidateEmojis = [...default16Emojis];
      this.customFloatingEmojis.forEach(item => {
        if (item && !allCandidateEmojis.includes(item)) {
          allCandidateEmojis.push(item);
        }
      });
      this.tempFloatingEmojis.forEach(item => {
        if (item && !allCandidateEmojis.includes(item)) {
          allCandidateEmojis.push(item);
        }
      });

      allCandidateEmojis.forEach(emo => {
        const isChecked = this.tempFloatingEmojis.includes(emo);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.style.cssText = `
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 2px solid ${isChecked ? '#0ea5e9' : '#cbd5e1'};
          background: ${isChecked ? '#e0f2fe' : '#ffffff'};
          color: ${isChecked ? '#0369a1' : '#64748b'};
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        `;
        btn.innerHTML = `<span>${this.escapeHtml(emo)}</span><span style="font-size: 14px;">${isChecked ? '✓' : ''}</span>`;
        btn.onclick = () => this.toggleFloatingEmoji(emo);
        grid.appendChild(btn);
      });

      this.renderStandardEmojiLibrary();
    }

    addCustomFloatingEmoji() {
      this.markAsHost();
      const input = document.getElementById('inputCustomFloatingEmoji');
      if (!input) return;
      const val = (input.value || '').trim();
      if (!val) {
        this.notify('提示', '請先輸入要新增的文字或表情符號！');
        return;
      }
      if (!Array.isArray(this.customFloatingEmojis)) {
        this.customFloatingEmojis = [];
      }
      if (!this.customFloatingEmojis.includes(val)) {
        this.customFloatingEmojis.push(val);
      }
      if (!Array.isArray(this.tempFloatingEmojis)) {
        this.tempFloatingEmojis = [];
      }
      if (!this.tempFloatingEmojis.includes(val)) {
        this.tempFloatingEmojis.push(val);
      }
      input.value = '';
      this.renderFloatingEmojiPicker();
      this.notify('已新增', `已將「${val}」加入浮動表情條並勾選啟用！`);
    }

    toggleStandardEmojiLibrary() {
      const lib = document.getElementById('presStandardEmojiLibrary');
      if (!lib) return;
      const isHidden = lib.style.display === 'none' || !lib.style.display;
      lib.style.display = isHidden ? 'block' : 'none';
      if (isHidden) {
        this.renderStandardEmojiLibrary();
      }
    }

    renderStandardEmojiLibrary() {
      const libGrid = document.getElementById('presStandardEmojiLibraryGrid');
      if (!libGrid) return;
      libGrid.innerHTML = '';

      const standardEmojis = [
        '😀', '😄', '😁', '😆', '😅', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰',
        '😘', '😎', '🤓', '🧐', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥',
        '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤',
        '😒', '😓', '😔', '😕', '🙃', '🫠', '🫡', '🫢', '🫣', '🫤', '🫨', '🤯',
        '😳', '🥺', '😢', '😭', '😱', '😖', '😣', '😞', '😟', '😤', '😡', '🤬',
        '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🤚', '🖐️', '✋',
        '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🧠', '👀', '❤️', '🧡',
        '💛', '💚', '💙', '💜', '💖', '💯', '💥', '💫', '⭐', '🌟', '✨', '⚡',
        '🔥', '🎉', '🎊', '🎈', '🏆', '🥇', '🎯', '💡', '❓', '❔', '❗', '❕',
        '✅', '☑️', '❌', '⭕', '🆘', '🆗', '🆙', '🆕', '🆒', '🆓', '➕', '➖'
      ];

      standardEmojis.forEach(emo => {
        const isSelected = Array.isArray(this.tempFloatingEmojis) && this.tempFloatingEmojis.includes(emo);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.title = isSelected ? `點擊取消「${emo}」` : `點擊加入並勾選「${emo}」`;
        btn.style.cssText = `
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1.5px solid ${isSelected ? '#0284c7' : '#e2e8f0'};
          background: ${isSelected ? '#e0f2fe' : '#f8fafc'};
          font-size: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.12s;
        `;
        btn.textContent = emo;
        btn.onclick = () => {
          if (!Array.isArray(this.customFloatingEmojis)) this.customFloatingEmojis = [];
          if (!this.customFloatingEmojis.includes(emo)) {
            this.customFloatingEmojis.push(emo);
          }
          this.toggleFloatingEmoji(emo);
        };
        libGrid.appendChild(btn);
      });
    }

    toggleFloatingEmoji(emo) {
      this.markAsHost();
      if (!Array.isArray(this.tempFloatingEmojis)) {
        this.tempFloatingEmojis = ['👍', '💡', '❓', '❤️', '👏', '😂'];
      }
      const idx = this.tempFloatingEmojis.indexOf(emo);
      if (idx >= 0) {
        if (this.tempFloatingEmojis.length <= 1) {
          this.notify('提示', '請至少保留 1 個表情符號！');
          return;
        }
        this.tempFloatingEmojis.splice(idx, 1);
      } else {
        this.tempFloatingEmojis.push(emo);
      }
      this.renderFloatingEmojiPicker();
    }

    closeSlideSettingsModal() {
      this.closeModal(this.els.modalSlideSettings);
    }

    // 渲染本頁外部連結設定清單 (需求 1: 最多可設定 3 個外部連結，並可自訂名稱)
    renderExternalLinksConfigList() {
      const container = document.getElementById('presExternalLinksList');
      const addBtn = document.getElementById('btnAddExternalLink');
      if (!container) return;

      container.innerHTML = '';
      if (!Array.isArray(this.tempExternalLinks)) {
        this.tempExternalLinks = [];
      }

      if (this.tempExternalLinks.length >= 3) {
        if (addBtn) addBtn.style.display = 'none';
      } else {
        if (addBtn) addBtn.style.display = 'inline-flex';
      }

      if (this.tempExternalLinks.length === 0) {
        container.innerHTML = `
          <div style="color: var(--text-muted); font-size: 14px; padding: 6px 0; font-style: italic;">
            尚未設定外部連結，點擊上方「➕ 新增連結」即可加入（最多 3 個）。
          </div>
        `;
        return;
      }

      this.tempExternalLinks.forEach((item, idx) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '8px';
        row.style.alignItems = 'center';
        row.style.background = '#f8fafc';
        row.style.padding = '8px';
        row.style.borderRadius = '8px';
        row.style.border = '1px solid #e2e8f0';

        row.innerHTML = `
          <div style="flex: 0 0 110px;">
            <input type="text" placeholder="連結名稱" value="${this.escapeHtml(item.title || '')}"
              oninput="window.presentationManager.updateExternalLinkTitle(${idx}, this.value)"
              style="width: 100%; box-sizing: border-box; padding: 6px 8px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 14px;">
          </div>
          <div style="flex: 1;">
            <input type="url" placeholder="https://..." value="${this.escapeHtml(item.url || '')}"
              oninput="window.presentationManager.updateExternalLinkUrl(${idx}, this.value)"
              onblur="window.presentationManager.onExternalLinkUrlBlur(${idx}, this.value)"
              style="width: 100%; box-sizing: border-box; padding: 6px 8px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 14px;">
          </div>
          <button type="button" onclick="window.presentationManager.deleteExternalLinkItem(${idx})"
            title="刪除此連結"
            style="border: none; background: #fee2e2; color: #ef4444; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; font-weight: bold; flex-shrink: 0;">
            ✕
          </button>
        `;
        container.appendChild(row);
      });
    }

    addExternalLinkItem() {
      this.markAsHost();
      if (!Array.isArray(this.tempExternalLinks)) {
        this.tempExternalLinks = [];
      }
      if (this.tempExternalLinks.length >= 3) {
        this.notify('提示', '每頁簡報最多設定 3 個外部連結。');
        return;
      }
      this.tempExternalLinks.push({
        title: `外部連結 ${this.tempExternalLinks.length + 1}`,
        url: ''
      });
      this.renderExternalLinksConfigList();
    }

    deleteExternalLinkItem(idx) {
      this.markAsHost();
      if (Array.isArray(this.tempExternalLinks) && this.tempExternalLinks[idx] !== undefined) {
        this.tempExternalLinks.splice(idx, 1);
        this.renderExternalLinksConfigList();
      }
    }

    updateExternalLinkTitle(idx, val) {
      if (Array.isArray(this.tempExternalLinks) && this.tempExternalLinks[idx]) {
        this.tempExternalLinks[idx].title = val;
      }
    }

    updateExternalLinkUrl(idx, val) {
      if (Array.isArray(this.tempExternalLinks) && this.tempExternalLinks[idx]) {
        this.tempExternalLinks[idx].url = val;
      }
    }

    onExternalLinkUrlBlur(idx, val) {
      if (Array.isArray(this.tempExternalLinks) && this.tempExternalLinks[idx]) {
        const converted = this.convertYoutubeToEmbedUrl(val);
        if (converted && converted !== val) {
          this.tempExternalLinks[idx].url = converted;
          this.renderExternalLinksConfigList();
          this.notify('網址自動轉換', '已自動將 YouTube 影片轉換為可嵌入播放網址！');
        }
      }
    }

    // 渲染本頁多題互動建構清單 (圖 2: 選擇題選項設定、圖 3: 手繪標記作答)
    renderQuestionsBuilderList() {
      const container = document.getElementById('presQuestionsBuilderList');
      if (!container) return;
      container.innerHTML = '';

      if (this.tempQuestions.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); font-size: 14px; padding: 10px 0;">目前本頁無設定互動題目，點擊下方「+ 新增題目」開始建立！</div>';
        return;
      }

      this.tempQuestions.forEach((q, idx) => {
        const item = document.createElement('div');
        item.style.background = 'var(--bg-input)';
        item.style.border = '1px solid var(--border-color)';
        item.style.borderRadius = '10px';
        item.style.padding = '12px';
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.gap = '8px';

        const optCount = q.optCount || 4;
        const optStyle = q.optStyle || 'abcd';
        const optLabels = this.getOptionLabels(optCount, optStyle);

        item.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 700; font-size: 14px; color: var(--text-primary);">題目 ${idx + 1}</span>
            <button type="button" style="color: #ef4444; border: none; background: none; font-size: 14px; cursor: pointer; font-weight: 600;" onclick="window.presentationManager.deleteQuestionItem(${idx})">✕ 刪除</button>
          </div>
          <div style="display: flex; gap: 8px;">
            <select style="padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 14px; width: 100%;" onchange="window.presentationManager.updateQuestionType(${idx}, this.value)">
              <option value="quick_choice" ${q.type === 'quick_choice' ? 'selected' : ''}>選擇題 (學生按色塊作答，可設正解)</option>
              <option value="draw" ${q.type === 'draw' ? 'selected' : ''}>手繪標記作答 (學生於畫面繪圖提交)</option>
              <option value="choice" ${q.type === 'choice' ? 'selected' : ''}>自訂文字選擇題</option>
              <option value="text" ${q.type === 'text' ? 'selected' : ''}>文字回覆 / 簡答心得</option>
              <option value="rating" ${q.type === 'rating' ? 'selected' : ''}>評分 (1~5 星級)</option>
            </select>
          </div>
          ${q.type !== 'draw' ? `
            <input type="text" style="width: 100%; box-sizing: border-box; padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 14px;" placeholder="輸入題幹或題目說明..." value="${this.escapeHtml(q.title || '')}" oninput="window.presentationManager.updateQuestionTitle(${idx}, this.value)">
          ` : ''}
          
          ${q.type === 'quick_choice' ? `
            <div style="display: flex; gap: 8px; flex-wrap: wrap; background: var(--bg-card); padding: 8px 10px; border-radius: 6px; border: 1px dashed var(--border-color);">
              <div style="display: flex; align-items: center; gap: 4px; font-size: 14px; color: var(--text-secondary);">
                <span>選項數：</span>
                <select style="padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 14px;" onchange="window.presentationManager.updateQuestionOptCount(${idx}, this.value)">
                  <option value="2" ${optCount == 2 ? 'selected' : ''}>2 個選項</option>
                  <option value="3" ${optCount == 3 ? 'selected' : ''}>3 個選項</option>
                  <option value="4" ${optCount == 4 ? 'selected' : ''}>4 個選項</option>
                  <option value="5" ${optCount == 5 ? 'selected' : ''}>5 個選項</option>
                  <option value="6" ${optCount == 6 ? 'selected' : ''}>6 個選項</option>
                </select>
              </div>
              <div style="display: flex; align-items: center; gap: 4px; font-size: 14px; color: var(--text-secondary);">
                <span>標籤：</span>
                <select style="padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 14px;" onchange="window.presentationManager.updateQuestionOptStyle(${idx}, this.value)">
                  <option value="abcd" ${optStyle === 'abcd' ? 'selected' : ''}>A B C D</option>
                  <option value="1234" ${optStyle === '1234' ? 'selected' : ''}>1 2 3 4</option>
                  <option value="ox" ${optStyle === 'ox' ? 'selected' : ''}>◯ ✕ (是非)</option>
                  <option value="cjk" ${optStyle === 'cjk' ? 'selected' : ''}>甲 乙 丙 丁</option>
                </select>
              </div>
              <div style="display: flex; align-items: center; gap: 4px; font-size: 14px; color: var(--text-secondary);">
                <span>正解：</span>
                <select style="padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 14px;" onchange="window.presentationManager.updateQuestionCorrectAnswer(${idx}, this.value)">
                  <option value="" ${!q.correctAnswer ? 'selected' : ''}>無正解 (調查/回饋)</option>
                  ${optLabels.map(lbl => `<option value="${lbl}" ${q.correctAnswer === lbl ? 'selected' : ''}>正解：${lbl}</option>`).join('')}
                </select>
              </div>
            </div>
          ` : ''}

          ${q.type === 'draw' ? `
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: #0284c7; background: #e0f2fe; padding: 8px 10px; border-radius: 6px; border: 1px dashed #7dd3fc;">
              <div>🎨 學生端將在畫面上方顯示手繪工具列，可直接在投影片上進行標記並送出。</div>
              <div style="display: flex; align-items: center; gap: 8px; color: #0369a1; background: var(--bg-card); padding: 6px 10px; border-radius: 6px; border: 1px solid #bae6fd;">
                <span style="font-weight: 700; white-space: nowrap;">繳交作品底圖 (圖 1)：</span>
                <select style="padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 14px; flex: 1;" onchange="window.presentationManager.updateQuestionIncludeBg(${idx}, this.value)">
                  <option value="false" ${!q.includeSlideBg ? 'selected' : ''}>不包含簡報畫面（僅手繪筆劃，預設）</option>
                  <option value="true" ${q.includeSlideBg ? 'selected' : ''}>包含簡報畫面底圖</option>
                </select>
              </div>
            </div>
          ` : ''}

          ${q.type === 'choice' ? `
            <input type="text" style="width: 100%; box-sizing: border-box; padding: 6px 10px; border: 1px dashed var(--border-color); border-radius: 6px; font-size: 14px; background: var(--bg-card);" placeholder="選項清單 (以逗號分隔，例如：選項A, 選項B, 選項C, 選項D)" value="${this.escapeHtml((q.options || ['A', 'B', 'C', 'D']).join(', '))}" onchange="window.presentationManager.updateQuestionOptions(${idx}, this.value)">
          ` : ''}
        `;

        container.appendChild(item);
      });
    }

    // 取得選項標籤清單
    getOptionLabels(optCount = 4, optStyle = 'abcd') {
      let labels = ['A', 'B', 'C', 'D', 'E', 'F'];
      if (optStyle === '1234') labels = ['1', '2', '3', '4', '5', '6'];
      else if (optStyle === 'ox') labels = ['◯', '✕'];
      else if (optStyle === 'cjk') labels = ['甲', '乙', '丙', '丁', '戊', '己'];
      return labels.slice(0, Math.min(optCount, labels.length));
    }

    addQuestionItem() {
      this.markAsHost();
      if (!this.tempQuestions) this.tempQuestions = [];
      this.tempQuestions.push({
        id: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        type: 'quick_choice',
        title: '請在下方選擇您的答案',
        optCount: 4,
        optStyle: 'abcd',
        correctAnswer: '',
        includeSlideBg: false,
        options: ['A', 'B', 'C', 'D']
      });
      this.renderQuestionsBuilderList();
    }

    deleteQuestionItem(idx) {
      this.tempQuestions.splice(idx, 1);
      this.renderQuestionsBuilderList();
    }

    updateQuestionType(idx, type) {
      if (this.tempQuestions[idx]) {
        this.tempQuestions[idx].type = type;
        if (type === 'quick_choice') {
          if (!this.tempQuestions[idx].optCount) this.tempQuestions[idx].optCount = 4;
          if (!this.tempQuestions[idx].optStyle) this.tempQuestions[idx].optStyle = 'abcd';
        }
        this.renderQuestionsBuilderList();
      }
    }

    updateQuestionOptCount(idx, count) {
      if (this.tempQuestions[idx]) {
        this.tempQuestions[idx].optCount = parseInt(count, 10) || 4;
        this.renderQuestionsBuilderList();
      }
    }

    updateQuestionOptStyle(idx, style) {
      if (this.tempQuestions[idx]) {
        this.tempQuestions[idx].optStyle = style;
        this.renderQuestionsBuilderList();
      }
    }

    updateQuestionCorrectAnswer(idx, ans) {
      if (this.tempQuestions[idx]) {
        this.tempQuestions[idx].correctAnswer = ans;
      }
    }

    updateQuestionIncludeBg(idx, val) {
      if (this.tempQuestions[idx]) {
        this.tempQuestions[idx].includeSlideBg = (val === 'true');
      }
    }

    updateQuestionTitle(idx, title) {
      if (this.tempQuestions[idx]) {
        this.tempQuestions[idx].title = title;
      }
    }

    updateQuestionOptions(idx, optionsStr) {
      if (this.tempQuestions[idx]) {
        const arr = optionsStr.split(/[,，]/).map(s => s.trim()).filter(Boolean);
        this.tempQuestions[idx].options = arr.length > 0 ? arr : ['A', 'B', 'C', 'D'];
      }
    }

    // 儲存本頁設定 (需求 1 & 2: 外部連結最多 3 個、自訂名稱、開啟方式)
    saveSlideSettings() {
      this.markAsHost();
      const slide = this.getCurrentSlide();
      if (!slide) return;

      const cleanLinks = [];
      if (Array.isArray(this.tempExternalLinks)) {
        this.tempExternalLinks.slice(0, 3).forEach((link, i) => {
          const rawUrl = (link.url || '').trim();
          if (rawUrl) {
            cleanLinks.push({
              title: (link.title || '').trim() || `外部連結 ${i + 1}`,
              url: this.convertYoutubeToEmbedUrl(rawUrl)
            });
          }
        });
      }

      slide.externalLinks = cleanLinks;
      // 向後相容舊版單一外部網址屬性
      slide.externalUrl = cleanLinks.length > 0 ? cleanLinks[0].url : '';
      slide.externalUrlTitle = cleanLinks.length > 0 ? cleanLinks[0].title : '';

      const selUrlPos = document.getElementById('selPresUrlPosition');
      slide.urlPosition = selUrlPos ? selUrlPos.value : 'center';

      const selUrlTarget = document.getElementById('selPresUrlTarget');
      slide.urlTarget = selUrlTarget ? selUrlTarget.value : 'iframe';

      const selDisplay = document.getElementById('selPresDisplayMode');
      slide.displayMode = selDisplay ? selDisplay.value : 'step';
      
      const selAsync = document.getElementById('selPresAllowAsyncAnswer');
      slide.allowAsyncAnswer = selAsync ? (selAsync.value === 'true') : false;

      slide.floatingEmojis = (Array.isArray(this.tempFloatingEmojis) && this.tempFloatingEmojis.length > 0)
        ? [...this.tempFloatingEmojis]
        : ['👍', '💡', '❓', '❤️', '👏', '😂'];

      if (slide.displayMode === 'floating') {
        slide.questions = [];
      } else {
        slide.questions = this.tempQuestions || [];
      }

      this.closeSlideSettingsModal();
      this.updatePermissionsUI();
      this.render();
      if (this.isPresenting) this.broadcastLiveState(true);
      this.notify('儲存成功', '本頁互動設定已成功套用！');
    }

    // 渲染本頁外部 URL 懸浮按鈕清單 (支援最多 3 個連結按鈕並排)
    renderExternalUrlBadges(slide) {
      const container = this.els.urlBadgesContainer || document.getElementById('presentationUrlBadgesContainer');
      if (!container) return;

      if (!slide) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
      }

      let links = [];
      if (Array.isArray(slide.externalLinks) && slide.externalLinks.length > 0) {
        links = slide.externalLinks.filter(l => l && l.url && l.url.trim());
      } else if (slide.externalUrl && slide.externalUrl.trim()) {
        links = [{
          title: slide.externalUrlTitle || '開啟外部連結',
          url: slide.externalUrl.trim()
        }];
      }

      if (links.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
      }

      const pos = slide.urlPosition || 'center';
      const target = slide.urlTarget || 'iframe';

      container.className = `presentation-url-badges-container presentation-url-pos-${pos}`;
      container.style.display = 'inline-flex';
      container.innerHTML = '';

      links.forEach((link, idx) => {
        const titleText = (link.title && link.title.trim()) ? link.title.trim() : (links.length > 1 ? `連結 ${idx + 1}` : '開啟外部連結');
        const badge = document.createElement('a');
        badge.href = 'javascript:void(0)';
        badge.className = 'presentation-url-badge';
        badge.title = `${titleText} (${target === 'blank' ? '開新分頁瀏覽' : '頁面內嵌入開啟'})`;
        badge.innerHTML = `🔗 <span>${this.escapeHtml(titleText)}</span>`;
        badge.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleOpenExternalLink(link.url, titleText, target);
        };
        container.appendChild(badge);
      });
    }

    // 點擊外部連結按鈕處理 (需求 2: 支援在頁面內 iframe 或開新分頁開啟)
    handleOpenExternalLink(rawUrl, title, targetMode) {
      if (!rawUrl) return;
      const embedUrl = this.convertYoutubeToEmbedUrl(rawUrl);
      if (targetMode === 'blank') {
        window.open(embedUrl, '_blank');
      } else {
        this.openExternalUrlViewer(embedUrl, title);
      }
    }

    // 縮圖九宮格總覽彈窗
    openGridOverviewModal() {
      const modal = this.els.modalGridOverview;
      const container = this.els.gridOverviewContainer;
      if (!modal || !container) return;

      container.innerHTML = '';
      this.slides.forEach((slide, idx) => {
        const item = document.createElement('div');
        item.style.position = 'relative';
        item.style.aspectRatio = '16/9';
        item.style.borderRadius = '8px';
        item.style.overflow = 'hidden';
        item.style.cursor = 'pointer';
        item.style.border = idx === this.currentSlideIndex ? '3px solid var(--accent-color)' : '1px solid var(--border-color)';
        item.onclick = () => {
          if (this.isRemoteBroadcastingActive && !this.isTeacher()) {
            this.notify('提示', '目前正處於跟隨老師同步簡報中，頁面由老師統一控制。');
            return;
          }
          this.goToSlide(idx);
          this.closeGridOverviewModal();
        };

        if (slide.type === 'image' && slide.bgUrl) {
          item.innerHTML = `<img src="${slide.bgUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
          item.innerHTML = `<div style="width: 100%; height: 100%; background: ${slide.bgColor || '#1e293b'};"></div>`;
        }
        item.innerHTML += `<div style="position: absolute; bottom: 4px; left: 4px; background: rgba(0,0,0,0.7); color: white; padding: 1px 6px; border-radius: 4px; font-size: 14px; font-weight: 700;">${idx + 1}</div>`;
        container.appendChild(item);
      });

      this.openModal(modal);
    }

    closeGridOverviewModal() {
      this.closeModal(this.els.modalGridOverview);
    }

    // 自動將 YouTube / Google Drive 影片網址轉換為可嵌入播放格式 (Item 1)
    convertYoutubeToEmbedUrl(rawUrl) {
      if (!rawUrl || typeof rawUrl !== 'string') return '';
      let url = rawUrl.trim();
      if (!url) return '';

      // 支援 Google Drive 檔案轉換為預覽嵌入
      if (url.includes('drive.google.com/file/d/')) {
        return url.replace(/\/view(\?.*)?$/, '/preview');
      }

      // 支援各種 YouTube 格式（watch?v=、youtu.be/、shorts/、embed/ 等）
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
      if (ytMatch && ytMatch[1]) {
        const videoId = ytMatch[1];
        let timeParam = '';
        const timeMatch = url.match(/[?&](?:t|start)=([0-9hms]+)/i);
        if (timeMatch && timeMatch[1]) {
          const tVal = timeMatch[1];
          let seconds = 0;
          if (/^\d+$/.test(tVal)) {
            seconds = parseInt(tVal, 10);
          } else {
            const h = tVal.match(/(\d+)h/i);
            const m = tVal.match(/(\d+)m/i);
            const s = tVal.match(/(\d+)s/i);
            if (h) seconds += parseInt(h[1], 10) * 3600;
            if (m) seconds += parseInt(m[1], 10) * 60;
            if (s) seconds += parseInt(s[1], 10);
          }
          if (seconds > 0) {
            timeParam = `&start=${seconds}`;
          }
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${timeParam}`;
      }
      return url;
    }

    // 開啟外部 URL 嵌入視窗
    openExternalUrlViewer(customUrl, customTitle) {
      const slide = this.getCurrentSlide();
      let targetUrl = customUrl;
      let displayTitle = customTitle;

      if (!targetUrl) {
        if (slide && Array.isArray(slide.externalLinks) && slide.externalLinks.length > 0) {
          targetUrl = slide.externalLinks[0].url;
          displayTitle = slide.externalLinks[0].title;
        } else if (slide && slide.externalUrl) {
          targetUrl = slide.externalUrl;
          displayTitle = slide.externalUrlTitle || '外部連結';
        }
      }

      if (!targetUrl) return;

      const embedUrl = this.convertYoutubeToEmbedUrl(targetUrl);
      const modal = this.els.modalIframeViewer;
      const iframe = this.els.iframeViewerFrame;
      const titleEl = document.getElementById('txtPresIframeViewerTitle');
      if (titleEl) {
        titleEl.textContent = `🔗 ${displayTitle || '外部網頁瀏覽'}`;
      }

      if (!modal || !iframe) {
        window.open(embedUrl, '_blank');
        return;
      }

      iframe.src = embedUrl;
      this.openModal(modal);
    }

    closeExternalUrlViewer() {
      const modal = this.els.modalIframeViewer;
      const iframe = this.els.iframeViewerFrame;
      this.closeModal(modal);
      if (iframe) iframe.src = 'about:blank';
    }

    // 系統提示吐司通知 (相容全螢幕容器動態掛載)
    notify(title, msg) {
      if (window.app && window.app.showNotification) {
        window.app.showNotification(title, msg);
      } else {
        alert(`${title}\n${msg}`);
      }
    }

    // 自訂對話確認視窗 (完全取代原生 confirm，徹底避免全螢幕被強制中斷退回視窗)
    showConfirm(icon, title, subtitle, onConfirm) {
      if (window.app && typeof window.app.showConfirmModal === 'function') {
        window.app.showConfirmModal(icon, title, subtitle, onConfirm);
      } else {
        if (confirm(`${title}\n${subtitle}`)) {
          if (typeof onConfirm === 'function') onConfirm();
        }
      }
    }

    // 安全跳脫 HTML
    escapeHtml(str) {
      if (str == null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  }

  // 掛載至全域
  global.PresentationManager = PresentationManager;
  global.presentationManager = new PresentationManager();

})(window);
