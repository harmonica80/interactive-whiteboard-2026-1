/**
 * 同步共編白板核心引擎 (Collaborative Whiteboard Engine)
 * 支援多白板、分頁、學生編輯權限控管、他人物件移動保護、作者姓名標籤、剪貼簿貼上文字便利貼/圖片、PDF 頁面解析選取插入與整齊排版。
 */

(function () {
  'use strict';

  // ===== 使用者身分與角色 =====
  const urlParams = new URLSearchParams(window.location.search);
  let isTeacherOverride = null;

  function isTeacherUser() {
    if (isTeacherOverride !== null) return isTeacherOverride;
    const parentApp = (window.parent && window.parent.app) || null;
    if (parentApp && parentApp.isAdmin) return true;
    if (urlParams.get('role') === 'teacher' || urlParams.get('isAdmin') === '1') return true;
    return false;
  }

  const persistentUid = (
    urlParams.get('uid') ||
    (window.parent && window.parent.app && typeof window.parent.app.getUserId === 'function' && window.parent.app.getUserId()) ||
    window.boardStorage.local.getItem('whiteboard_uid') ||
    window.boardStorage.session.getItem('whiteboard_uid') ||
    ('u_' + Math.random().toString(36).substring(2, 9))
  );
  try {
    window.boardStorage.local.setItem('whiteboard_uid', persistentUid);
    window.boardStorage.session.setItem('whiteboard_uid', persistentUid);
  } catch (e) {}

  const myClientId = persistentUid;
  const myPresenceKey = 'u_' + persistentUid;

  let myName = (
    urlParams.get('name') ||
    (window.parent && window.parent.app && typeof window.parent.app.getCurrentUserName === 'function' && window.parent.app.getCurrentUserName()) ||
    window.boardStorage.local.getItem('user_nickname') ||
    window.boardStorage.local.getItem('user_name') ||
    (isTeacherUser() ? '老師' : '同學')
  ).trim();

  // 監聽來自母頁面的身分與權限更新
  window.addEventListener('message', (e) => {
    // 只接受同源父頁面的狀態通知；實際資料權限仍由資料庫規則控制。
    if (window.parent === window || e.source !== window.parent || e.origin !== window.location.origin || !e.data) return;
    if (e.data.type === 'UPDATE_ADMIN_STATUS') {
      isTeacherOverride = !!e.data.isAdmin;
      if (e.data.userName) {
        myName = e.data.userName;
      }
      applySettingsUI();
      if (typeof updateMyPresence === 'function') {
        updateMyPresence();
      }
    }
  });

  // ===== 狀態管理 =====
  const state = {
    activeCanvasId: 'main',
    activePageId: 'page_1',
    canvases: {
      main: { id: 'main', name: '主白板', pages: ['page_1'] }
    },
    objects: {}, // 當前頁面物件: { [id]: obj }
    settings: {
      studentCanEdit: true,
      canMoveOthers: true,
      followTeacher: true,
      showAuthorBadge: true,
      studentCanManagePages: false, // 學生增減畫布與頁數權限 (Item 7，預設為否)
      activeCanvasId: 'main',
      activePageId: 'page_1'
    },
    currentTool: 'select', // select, pen, rect, circle, arrow, sticky, hand, eraser
    currentColor: '#2563eb', // 工具列預設顏色改為藍色 (Item 4)
    currentStrokeWidth: 4,
    showAuthorBadge: true,
    view: { x: 0, y: 0, zoom: 1 },
    selectedObjIds: [],
    get selectedObjId() {
      return (this.selectedObjIds && this.selectedObjIds[0]) || null;
    },
    set selectedObjId(id) {
      this.selectedObjIds = id ? [id] : [];
    },
    isPanning: false,
    panStart: { x: 0, y: 0 },
    isMarqueeSelecting: false,
    marqueeStart: { x: 0, y: 0 },
    activeDrawing: null,
    onlineUsers: {},
    lockedStudents: {}, // 遭個別鎖定編輯之學生名單 (Item 8)
    isIndividuallyLocked: false,
    individualLockUntil: null
  };

  // ===== DOM 參照 =====
  const els = {
    canvasViewport: document.getElementById('canvasViewport'),
    canvasWorld: document.getElementById('canvasWorld'),
    svgLayer: document.getElementById('svgLayer'),
    htmlLayer: document.getElementById('htmlLayer'),
    floatingToolbar: document.getElementById('floatingToolbar'),
    canvasSelect: document.getElementById('canvasSelect'),
    pagesTabs: document.getElementById('pagesTabs'),
    btnAddCanvas: document.getElementById('btnAddCanvas'),
    btnRenameCanvas: document.getElementById('btnRenameCanvas'),
    btnDeleteCanvas: document.getElementById('btnDeleteCanvas'),
    btnAddPage: document.getElementById('btnAddPage'),
    btnToggleStudentPages: document.getElementById('btnToggleStudentPages'),
    btnUndo: document.getElementById('btnUndo'),
    btnRedo: document.getElementById('btnRedo'),
    // 右下角縮放與白板小地圖導航 (Item 5)
    canvasMinimapWidget: document.getElementById('canvasMinimapWidget'),
    btnZoomIn: document.getElementById('btnZoomIn'),
    btnZoomOut: document.getElementById('btnZoomOut'),
    btnZoomReset: document.getElementById('btnZoomReset'),
    zoomVal: document.getElementById('zoomVal'),
    btnToggleMinimap: document.getElementById('btnToggleMinimap'),
    minimapBody: document.getElementById('minimapBody'),
    minimapCanvas: document.getElementById('minimapCanvas'),
    minimapViewportRect: document.getElementById('minimapViewportRect'),
    btnToggleStudentEdit: document.getElementById('btnToggleStudentEdit'),
    btnToggleMoveOthers: document.getElementById('btnToggleMoveOthers'),
    btnFollowMode: document.getElementById('btnFollowMode'),
    btnSummonAll: document.getElementById('btnSummonAll'),
    btnExport: document.getElementById('btnExport'),
    btnToggleDrawer: document.getElementById('btnToggleDrawer'),
    btnFullscreen: document.getElementById('btnFullscreen'),
    btnClearOrEnd: document.getElementById('btnClearOrEnd'),
    btnCloseWhiteboard: document.getElementById('btnCloseWhiteboard'),
    btnToggleAuthorBadge: document.getElementById('btnToggleAuthorBadge'),
    colorCurrentDot: document.getElementById('colorCurrentDot'),
    colorPalette: document.getElementById('colorPalette'),
    strokeSizeSelect: document.getElementById('strokeSizeSelect'),
    participantsDrawer: document.getElementById('participantsDrawer'),
    userCount: document.getElementById('userCount'),
    userList: document.getElementById('userList'),
    readonlyBanner: document.getElementById('readonlyBanner'),
    // Guide Modal
    btnHelpGuide: document.getElementById('btnHelpGuide'),
    guideModal: document.getElementById('guideModal'),
    btnCloseGuideModal: document.getElementById('btnCloseGuideModal'),
    btnConfirmGuide: document.getElementById('btnConfirmGuide'),
    // PDF Modal
    pdfModal: document.getElementById('pdfModal'),
    btnClosePdfModal: document.getElementById('btnClosePdfModal'),
    btnCancelPdf: document.getElementById('btnCancelPdf'),
    btnConfirmInsertPdf: document.getElementById('btnConfirmInsertPdf'),
    pdfTotalPages: document.getElementById('pdfTotalPages'),
    pdfSelectAll: document.getElementById('pdfSelectAll'),
    pdfResolution: document.getElementById('pdfResolution'),
    pdfCustomWidth: document.getElementById('pdfCustomWidth'),
    pdfCustomWidthWrap: document.getElementById('pdfCustomWidthWrap'),
    // Student Lock Modal (Item 8)
    studentLockModal: document.getElementById('studentLockModal'),
    lockStudentTargetName: document.getElementById('lockStudentTargetName'),
    btnCloseStudentLockModal: document.getElementById('btnCloseStudentLockModal'),
    btnCancelStudentLockModal: document.getElementById('btnCancelStudentLockModal'),
    lockStudentStatusBox: document.getElementById('lockStudentStatusBox'),
    lockStudentStatusText: document.getElementById('lockStudentStatusText'),
    btnUnlockStudentDirect: document.getElementById('btnUnlockStudentDirect'),
    pdfSelectedBadge: document.getElementById('pdfSelectedBadge'),
    pdfThumbnailGrid: document.getElementById('pdfThumbnailGrid'),
    btnInsertPdf: document.getElementById('btnInsertPdf'),
    btnInsertImage: document.getElementById('btnInsertImage'),
    btnTrashCanvas: document.getElementById('btnTrashCanvas'),
    imageFileInput: document.getElementById('imageFileInput'),
    pdfFileInput: document.getElementById('pdfFileInput'),
    // Selection Marquee & Floating Action Bar
    selectionMarquee: document.getElementById('selectionMarquee'),
    wbTransformOverlay: document.getElementById('wbTransformOverlay'),
    wbHoverBox: document.getElementById('wbHoverBox'),
    selectionActionBar: document.getElementById('selectionActionBar'),
    groupMultiAlign: document.getElementById('groupMultiAlign'),
    btnResetRotation: document.getElementById('btnResetRotation'),
    btnResetCrop: document.getElementById('btnResetCrop'),
    btnLayerFront: document.getElementById('btnLayerFront'),
    btnLayerForward: document.getElementById('btnLayerForward'),
    btnLayerBackward: document.getElementById('btnLayerBackward'),
    btnLayerBack: document.getElementById('btnLayerBack'),
    btnAlignLeft: document.getElementById('btnAlignLeft'),
    btnAlignCenter: document.getElementById('btnAlignCenter'),
    btnAlignRight: document.getElementById('btnAlignRight'),
    btnAlignTop: document.getElementById('btnAlignTop'),
    btnAlignMiddle: document.getElementById('btnAlignMiddle'),
    btnAlignBottom: document.getElementById('btnAlignBottom'),
    btnDistributeH: document.getElementById('btnDistributeH'),
    btnDistributeV: document.getElementById('btnDistributeV'),
    btnActionDelete: document.getElementById('btnActionDelete'),
    // Export Modal (Item 6, 如圖 5)
    exportModal: document.getElementById('exportModal'),
    btnCloseExportModal: document.getElementById('btnCloseExportModal'),
    btnCancelExportModal: document.getElementById('btnCancelExportModal'),
    btnExportPdf: document.getElementById('btnExportPdf'),
    btnExportPng: document.getElementById('btnExportPng'),
    btnExportZip: document.getElementById('btnExportZip'),
    btnExportFullZip: document.getElementById('btnExportFullZip'),
    btnExportJson: document.getElementById('btnExportJson'),
    btnImportJson: document.getElementById('btnImportJson'),
    jsonFileInput: document.getElementById('jsonFileInput'),
    // 白板雲端歷程檔案庫
    btnCloudArchive: document.getElementById('btnCloudArchive'),
    btnOpenCloudArchiveFromExport: document.getElementById('btnOpenCloudArchiveFromExport'),
    whiteboardArchiveModal: document.getElementById('whiteboardArchiveModal'),
    btnCloseWbArchiveModal: document.getElementById('btnCloseWbArchiveModal'),
    btnSaveCurrentWbToCloud: document.getElementById('btnSaveCurrentWbToCloud'),
    btnArchiveExportJson: document.getElementById('btnArchiveExportJson'),
    btnArchiveImportJson: document.getElementById('btnArchiveImportJson'),
    btnRefreshWbArchives: document.getElementById('btnRefreshWbArchives'),
    wbArchiveCountBadge: document.getElementById('wbArchiveCountBadge'),
    wbArchiveSearchInput: document.getElementById('wbArchiveSearchInput'),
    wbArchiveListContainer: document.getElementById('wbArchiveListContainer'),
    wbArchiveLoadChoiceModal: document.getElementById('wbArchiveLoadChoiceModal'),
    btnCloseWbLoadChoiceModal: document.getElementById('btnCloseWbLoadChoiceModal'),
    wbLoadChoiceArchiveTitle: document.getElementById('wbLoadChoiceArchiveTitle'),
    btnConfirmLoadEdit: document.getElementById('btnConfirmLoadEdit'),
    btnConfirmLoadReadonly: document.getElementById('btnConfirmLoadReadonly'),
    btnCancelLoadChoice: document.getElementById('btnCancelLoadChoice')
  };

  // ===== 班級代碼同步 =====
  if (!window.currentClassCode) {
    if (window.parent && window.parent.currentClassCode) {
      window.currentClassCode = window.parent.currentClassCode;
    } else if (window.ClassRoomManager && typeof window.ClassRoomManager.getActiveClassCode === 'function') {
      window.currentClassCode = window.ClassRoomManager.getActiveClassCode();
    }
  }

  // ===== Firebase 資料庫參照 =====
  let db = window.db;
  let roomRef = null;
  let objectsRef = null;
  let myPresenceRef = null;
  let archivesRef = null;
  const archiveBank = {};
  window.whiteboardArchives = archiveBank;
  if (window.parent) {
    window.parent.whiteboardArchives = archiveBank;
  }
  let archiveSearchQuery = '';
  let pendingLoadArchiveId = null;

  function getArchivesRef() {
    if (db) {
      return db.ref('whiteboard_archives');
    }
    if (window.parent && window.parent.db) {
      return window.parent.db.ref('whiteboard_archives');
    }
    return null;
  }

  function updateMyPresence() {
    if (!myPresenceRef) return;
    myPresenceRef.set({
      id: myPresenceKey,
      uid: persistentUid,
      name: myName,
      role: isTeacherUser() ? 'teacher' : 'student',
      canvasId: state.activeCanvasId,
      pageId: state.activePageId,
      lastActive: firebase.database.ServerValue.TIMESTAMP
    });
  }

  function initFirebase() {
    if (!db) {
      console.warn('Firebase DB not available. Operating in local mode.');
      return;
    }

    roomRef = db.ref('whiteboard_v2');

    // 雲端歷程檔案庫改為按需抓取 (On-Demand)，不再於初始載入時無條件全量監聽，節省巨量頻寬
    archivesRef = getArchivesRef();

    // 學生端動態同步至老師當前畫布與分頁
    function syncStudentToTeacherView() {
      if (isTeacherUser() || !state.settings.followTeacher) return;

      let targetCanvasId = null;
      let targetPageId = null;

      // 優先跟隨在線活躍老師的 Presence (最即時精確)
      if (state.onlineUsers) {
        const now = Date.now();
        const onlineTeacher = Object.values(state.onlineUsers).find(u => 
          u && u.role === 'teacher' && u.canvasId && (now - (u.lastActive || 0) < 60000)
        );
        if (onlineTeacher) {
          targetCanvasId = onlineTeacher.canvasId;
          targetPageId = onlineTeacher.pageId || 'page_1';
        }
      }

      // 若無活躍在線老師，以 settings.activeCanvasId 與 activePageId 為備用
      if (!targetCanvasId) {
        targetCanvasId = state.settings.activeCanvasId || 'main';
        targetPageId = state.settings.activePageId || 'page_1';
      }

      // 防呆檢查：確認目標畫布存在於 state.canvases 中，不存在則退回主白板
      if (state.canvases && Object.keys(state.canvases).length > 0) {
        if (!state.canvases[targetCanvasId]) {
          targetCanvasId = state.canvases['main'] ? 'main' : Object.keys(state.canvases)[0];
          targetPageId = (state.canvases[targetCanvasId]?.pages?.[0]) || 'page_1';
        }
      }

      if (targetCanvasId && (state.activeCanvasId !== targetCanvasId || state.activePageId !== targetPageId)) {
        switchCanvasAndPage(targetCanvasId, targetPageId, false);
      }
    }

    // 1. 同步全域設定 (權限、當前畫布、頁面)
    roomRef.child('settings').on('value', (snap) => {
      const val = snap.val();
      if (!val) return;
      Object.assign(state.settings, val);
      state.showAuthorBadge = state.settings.showAuthorBadge !== false;
      applySettingsUI();
      renderCanvasSelector();
      renderPagesTabs();

      // 老師端進入若開啟全班跟隨，自動將老師端當前畫布與分頁同步至 settings
      if (isTeacherUser() && state.settings.followTeacher) {
        if (state.activeCanvasId && state.activePageId) {
          roomRef.child('settings').update({
            activeCanvasId: state.activeCanvasId,
            activePageId: state.activePageId
          });
        }
      }

      // 學生端執行跟隨同步
      syncStudentToTeacherView();
    });

    // 2. 同步畫布清單
    roomRef.child('canvases').on('value', (snap) => {
      const val = snap.val();
      if (!val) return;
      state.canvases = val;
      renderCanvasSelector();
      renderPagesTabs();
      syncStudentToTeacherView();
    });

    // 3. 同步一鍵召集全班事件
    roomRef.child('summon').on('value', (snap) => {
      const val = snap.val();
      if (!val || !val.ts) return;
      if (!isTeacherUser() && (Date.now() - val.ts < 5000)) {
        switchCanvasAndPage(val.canvasId, val.pageId, false);
      }
    });

    // 4. 個別學生鎖定名單監聽 (Item 8)
    roomRef.child('lockedStudents').on('value', (snap) => {
      state.lockedStudents = snap.val() || {};
      checkMyLockStatus();
      renderParticipantsList();
    });

    // 5. 線上參與者 (Presence)
    myPresenceRef = roomRef.child('presence').child(myPresenceKey);
    updateMyPresence();
    myPresenceRef.onDisconnect().remove();

    // 每 40 秒定時發送心跳維護在線狀態
    setInterval(() => {
      if (roomRef) {
        myPresenceRef.child('lastActive').set(firebase.database.ServerValue.TIMESTAMP);
      }
    }, 40000);

    roomRef.child('presence').on('value', (snap) => {
      state.onlineUsers = snap.val() || {};
      renderParticipantsList();
      syncStudentToTeacherView();
    });

    // 綁定當前畫布頁面的即時物件監聽
    bindCurrentPageObjects();
  }

  function getPageKey(canvasId, pageId) {
    return `${canvasId || state.activeCanvasId}_${pageId || state.activePageId}`;
  }

  function bindCurrentPageObjects() {
    if (!roomRef) return;
    if (objectsRef) {
      objectsRef.off();
    }
    const pageKey = getPageKey();
    objectsRef = roomRef.child('pages').child(pageKey).child('objects');

    // 監聽單一物件新增/變更 (增量同步，極致省流)
    objectsRef.on('child_added', (snap) => {
      const obj = snap.val();
      if (!obj || !obj.id) return;
      state.objects[obj.id] = obj;
      renderObject(obj);
    });

    objectsRef.on('child_changed', (snap) => {
      const obj = snap.val();
      if (!obj || !obj.id) return;
      state.objects[obj.id] = obj;
      renderObject(obj);
    });

    objectsRef.on('child_removed', (snap) => {
      const obj = snap.val();
      const id = snap.key || (obj && obj.id);
      if (id && state.objects[id]) {
        delete state.objects[id];
        removeObjectDOM(id);
      }
    });
  }

  // ===== UI 控制與權限套用 =====
  let lockCountdownTimer = null;

  function canManagePages() {
    return isTeacherUser() || Boolean(state.settings.studentCanManagePages);
  }

  function isStudentAllowedToEdit() {
    if (isTeacherUser()) return true;
    if (state.isIndividuallyLocked) return false;
    return Boolean(state.settings.studentCanEdit);
  }

  function checkMyLockStatus() {
    if (isTeacherUser()) {
      state.isIndividuallyLocked = false;
      state.individualLockUntil = null;
      if (lockCountdownTimer) {
        clearInterval(lockCountdownTimer);
        lockCountdownTimer = null;
      }
      return;
    }
    const lockedMap = state.lockedStudents || {};
    let activeLock = null;
    const now = Date.now();

    for (const [key, lock] of Object.entries(lockedMap)) {
      if (!lock) continue;
      const matchName = lock.name && myName && (lock.name.trim().toLowerCase() === myName.trim().toLowerCase());
      const matchUid = lock.uid && persistentUid && (lock.uid === persistentUid || lock.uid === myClientId);
      const matchKey = (key === persistentUid || key === myClientId || key === myName || (myName && key === myName.replace(/[.$#\[\]\/]/g, '_')));
      if (matchName || matchUid || matchKey) {
        if (lock.until === -1 || lock.until > now) {
          activeLock = lock;
          break;
        }
      }
    }

    if (activeLock) {
      state.isIndividuallyLocked = true;
      state.individualLockUntil = activeLock.until;
      updateLockCountdownBanner();
      if (!lockCountdownTimer) {
        lockCountdownTimer = setInterval(updateLockCountdownBanner, 1000);
      }
    } else {
      const wasLocked = state.isIndividuallyLocked;
      state.isIndividuallyLocked = false;
      state.individualLockUntil = null;
      if (lockCountdownTimer) {
        clearInterval(lockCountdownTimer);
        lockCountdownTimer = null;
      }
      if (wasLocked) {
        flashToast('🎉 您的編輯限制已被解除，已恢復編輯！');
      }
      applySettingsUI();
    }
  }

  function updateLockCountdownBanner() {
    if (!state.isIndividuallyLocked) {
      if (lockCountdownTimer) {
        clearInterval(lockCountdownTimer);
        lockCountdownTimer = null;
      }
      applySettingsUI();
      return;
    }
    const until = state.individualLockUntil;
    if (until === -1) {
      els.readonlyBanner.textContent = '🔒 您已被老師個別限制編輯白板（永久鎖定，直到老師解除）';
      els.readonlyBanner.style.display = 'block';
      disableDrawingTools(true);
    } else {
      const remainingSec = Math.ceil((until - Date.now()) / 1000);
      if (remainingSec <= 0) {
        state.isIndividuallyLocked = false;
        state.individualLockUntil = null;
        if (lockCountdownTimer) {
          clearInterval(lockCountdownTimer);
          lockCountdownTimer = null;
        }
        flashToast('🎉 編輯限制時間已結束，已恢復白板編輯權限！');
        applySettingsUI();
        return;
      }
      const min = Math.floor(remainingSec / 60);
      const sec = remainingSec % 60;
      const timeStr = min > 0 ? `${min} 分 ${sec} 秒` : `${sec} 秒`;
      els.readonlyBanner.textContent = `⏱️ 您已被老師個別限制編輯白板（剩餘禁言時間：${timeStr}）`;
      els.readonlyBanner.style.display = 'block';
      disableDrawingTools(true);
    }
  }

  function applySettingsUI() {
    // 學生可編輯開關
    if (els.btnToggleStudentEdit) {
      if (state.settings.studentCanEdit) {
        els.btnToggleStudentEdit.classList.add('is-active');
        els.btnToggleStudentEdit.classList.remove('is-inactive');
        els.btnToggleStudentEdit.innerHTML = '<span>🔒 學生可編輯</span>';
      } else {
        els.btnToggleStudentEdit.classList.remove('is-active');
        els.btnToggleStudentEdit.classList.add('is-inactive');
        els.btnToggleStudentEdit.innerHTML = '<span>🚫 學生唯讀</span>';
      }
    }

    // 可動他人物件開關
    if (els.btnToggleMoveOthers) {
      if (state.settings.canMoveOthers) {
        els.btnToggleMoveOthers.classList.add('is-active');
        els.btnToggleMoveOthers.classList.remove('is-inactive');
        els.btnToggleMoveOthers.innerHTML = '<span>👥 可動他人物件</span>';
      } else {
        els.btnToggleMoveOthers.classList.remove('is-active');
        els.btnToggleMoveOthers.classList.add('is-inactive');
        els.btnToggleMoveOthers.innerHTML = '<span>👤 僅限自己物件</span>';
      }
    }

    // 學生增減頁面權限開關 (Item 7, 如圖 6)
    if (els.btnToggleStudentPages) {
      if (state.settings.studentCanManagePages) {
        els.btnToggleStudentPages.classList.add('is-active');
        els.btnToggleStudentPages.classList.remove('is-inactive');
        els.btnToggleStudentPages.innerHTML = '<span>🔓 學生可管頁面</span>';
      } else {
        els.btnToggleStudentPages.classList.remove('is-active');
        els.btnToggleStudentPages.classList.add('is-inactive');
        els.btnToggleStudentPages.innerHTML = '<span>🔒 僅老師管頁面</span>';
      }
    }

    const teacher = isTeacherUser();

    // 跟隨老師模式
    if (els.btnFollowMode) {
      if (state.settings.followTeacher) {
        els.btnFollowMode.innerHTML = '<span>🎯 全班跟隨</span>';
        els.btnFollowMode.classList.add('active');
        if (els.btnSummonAll) els.btnSummonAll.style.display = 'none';
      } else {
        els.btnFollowMode.innerHTML = '<span>🕊️ 自由分組</span>';
        els.btnFollowMode.classList.remove('active');
        if (els.btnSummonAll && teacher) els.btnSummonAll.style.display = 'inline-flex';
      }
    }

    // 教師控場開關顯示與權限套用
    if (!teacher) {
      if (els.btnToggleStudentEdit) {
        els.btnToggleStudentEdit.style.display = 'inline-flex';
        els.btnToggleStudentEdit.classList.add('is-student-readonly');
        els.btnToggleStudentEdit.title = '目前畫布編輯權限狀態（僅供老師修改）';
      }
      if (els.btnToggleMoveOthers) {
        els.btnToggleMoveOthers.style.display = 'inline-flex';
        els.btnToggleMoveOthers.classList.add('is-student-readonly');
        els.btnToggleMoveOthers.title = '目前物件移動權限狀態（僅供老師修改）';
      }
      if (els.btnToggleStudentPages) {
        els.btnToggleStudentPages.style.display = 'inline-flex';
        els.btnToggleStudentPages.classList.add('is-student-readonly');
        els.btnToggleStudentPages.title = '目前頁面管理權限狀態（僅供老師修改）';
      }
      if (els.btnFollowMode) els.btnFollowMode.style.display = 'none';
      if (els.btnSummonAll) els.btnSummonAll.style.display = 'none';
      if (els.btnClearOrEnd) els.btnClearOrEnd.style.display = 'none';
      if (els.btnCloudArchive) els.btnCloudArchive.style.display = 'none';
      if (els.btnSaveCurrentWbToCloud) els.btnSaveCurrentWbToCloud.style.display = 'none';

      // 畫布增減控制 (學生端依據老師設定開放或隱藏)
      if (els.btnAddCanvas) els.btnAddCanvas.style.display = state.settings.studentCanManagePages ? 'inline-flex' : 'none';
      if (els.btnRenameCanvas) els.btnRenameCanvas.style.display = state.settings.studentCanManagePages ? 'inline-flex' : 'none';
      if (els.btnAddPage) els.btnAddPage.style.display = state.settings.studentCanManagePages ? 'inline-flex' : 'none';

      // 唯讀提示 Banner (個別鎖定優先，否則全班唯讀)
      if (state.isIndividuallyLocked) {
        updateLockCountdownBanner();
      } else if (!state.settings.studentCanEdit) {
        els.readonlyBanner.textContent = '🔒 老師目前設定白板為唯讀狀態，僅能檢視內容';
        els.readonlyBanner.style.display = 'block';
        disableDrawingTools(true);
      } else {
        els.readonlyBanner.style.display = 'none';
        disableDrawingTools(false);
      }
    } else {
      if (els.btnToggleStudentEdit) {
        els.btnToggleStudentEdit.style.display = 'inline-flex';
        els.btnToggleStudentEdit.classList.remove('is-student-readonly');
        els.btnToggleStudentEdit.title = '設定學生是否可以編輯畫布';
      }
      if (els.btnToggleMoveOthers) {
        els.btnToggleMoveOthers.style.display = 'inline-flex';
        els.btnToggleMoveOthers.classList.remove('is-student-readonly');
        els.btnToggleMoveOthers.title = '設定學生是否可移動別人的物件';
      }
      if (els.btnToggleStudentPages) {
        els.btnToggleStudentPages.style.display = 'inline-flex';
        els.btnToggleStudentPages.classList.remove('is-student-readonly');
        els.btnToggleStudentPages.title = '設定學生是否可以增減畫布與頁數';
      }
      if (els.btnFollowMode) els.btnFollowMode.style.display = 'inline-flex';
      if (els.btnSummonAll) els.btnSummonAll.style.display = state.settings.followTeacher ? 'none' : 'inline-flex';
      if (els.btnClearOrEnd) els.btnClearOrEnd.style.display = 'inline-flex';
      if (els.btnAddCanvas) els.btnAddCanvas.style.display = 'inline-flex';
      if (els.btnRenameCanvas) els.btnRenameCanvas.style.display = 'inline-flex';
      if (els.btnAddPage) els.btnAddPage.style.display = 'inline-flex';
      if (els.btnCloudArchive) els.btnCloudArchive.style.display = 'inline-flex';
      if (els.btnSaveCurrentWbToCloud) els.btnSaveCurrentWbToCloud.style.display = 'inline-flex';

      els.readonlyBanner.style.display = 'none';
      disableDrawingTools(false);
    }

    // 垃圾桶清空功能 (納入「老師管理頁面」權限控制，僅老師或開放學生管頁面時可用，避免誤清空或惡意清空)
    if (els.btnTrashCanvas) {
      els.btnTrashCanvas.style.display = canManagePages() ? 'inline-flex' : 'none';
    }

    // 作者標籤切換按鈕狀態
    if (els.btnToggleAuthorBadge) {
      if (state.showAuthorBadge) {
        els.btnToggleAuthorBadge.classList.add('active');
      } else {
        els.btnToggleAuthorBadge.classList.remove('active');
      }
    }

    // 刷新畫布上所有作者標籤顯示
    updateAllAuthorBadgesVisibility();
  }

  function disableDrawingTools(disabled) {
    const tools = els.floatingToolbar.querySelectorAll('.tool-btn');
    tools.forEach(btn => {
      const tool = btn.dataset.tool;
      if (tool && tool !== 'select' && tool !== 'hand') {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.35' : '1';
        btn.style.pointerEvents = disabled ? 'none' : 'auto';
      }
    });
    if (disabled && state.currentTool !== 'select' && state.currentTool !== 'hand') {
      setTool('select');
    }
  }

  // ===== 畫布與頁面切換 =====
  function renderCanvasSelector() {
    els.canvasSelect.innerHTML = '';
    const canvasIds = Object.keys(state.canvases);
    canvasIds.forEach(id => {
      const c = state.canvases[id];
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = c.name || id;
      if (id === state.activeCanvasId) opt.selected = true;
      els.canvasSelect.appendChild(opt);
    });

    if (els.btnDeleteCanvas) {
      els.btnDeleteCanvas.style.display = (canvasIds.length > 1 && canManagePages()) ? 'inline-flex' : 'none';
    }
  }

  function renderPagesTabs() {
    const curCanvas = state.canvases[state.activeCanvasId] || { pages: ['page_1'] };
    els.pagesTabs.innerHTML = '';
    const pages = curCanvas.pages || ['page_1'];

    pages.forEach((pId, idx) => {
      const tab = document.createElement('div');
      tab.className = `page-tab-item ${pId === state.activePageId ? 'active' : ''}`;
      tab.dataset.page = pId;

      const label = document.createElement('span');
      label.textContent = `頁 ${idx + 1}`;
      tab.appendChild(label);

      // 當頁數大於 1 且具備管頁面權限時，提供刪除按鈕 (Item 2 & 7)
      if (pages.length > 1 && canManagePages()) {
        const delBtn = document.createElement('span');
        delBtn.className = 'page-del-btn';
        delBtn.innerHTML = '×';
        delBtn.title = `刪除頁 ${idx + 1}`;
        delBtn.onclick = (e) => {
          e.stopPropagation();
          deletePage(state.activeCanvasId, pId, idx + 1);
        };
        tab.appendChild(delBtn);
      }

      tab.onclick = () => switchCanvasAndPage(state.activeCanvasId, pId, true);
      els.pagesTabs.appendChild(tab);
    });
  }

  function deletePage(canvasId, pageId, pageNum) {
    const curCanvas = state.canvases[canvasId];
    if (!curCanvas || !curCanvas.pages || curCanvas.pages.length <= 1) {
      flashToast('至少需保留 1 個頁面，無法刪除！');
      return;
    }
    showWhiteboardConfirm('🗑️ 刪除分頁', `確定要刪除「頁 ${pageNum}」嗎？該頁面的所有白板內容將會被移除。`, () => {
      curCanvas.pages = curCanvas.pages.filter(p => p !== pageId);
      state.canvases[canvasId] = curCanvas;

      // 清空該頁資料庫物件
      if (roomRef) {
        const pageKey = `${canvasId}_${pageId}`;
        roomRef.child('pages').child(pageKey).remove();
        roomRef.child('canvases').set(state.canvases);
      }

      flashToast(`已刪除「頁 ${pageNum}」`);

      // 若刪除的是當前頁，自動切換至第一頁
      if (state.activePageId === pageId) {
        switchCanvasAndPage(canvasId, curCanvas.pages[0], true);
      } else {
        renderPagesTabs();
      }
    });
  }

  function switchCanvasAndPage(canvasId, pageId, broadcast) {
    state.activeCanvasId = canvasId;
    state.activePageId = pageId;

    // 清空目前畫面 DOM
    state.objects = {};
    state.selectedObjIds = [];
    if (typeof updateSelectionActionBar === 'function') updateSelectionActionBar();
    els.svgLayer.innerHTML = '';
    els.htmlLayer.innerHTML = '';

    renderCanvasSelector();
    renderPagesTabs();
    bindCurrentPageObjects();

    // 更新個人 Presence
    if (roomRef) {
      roomRef.child('presence').child(myPresenceKey).update({
        canvasId: state.activeCanvasId,
        pageId: state.activePageId,
        lastActive: firebase.database.ServerValue.TIMESTAMP
      });

      // 老師切換且開啟跟隨模式時，廣播給全班
      if (isTeacherUser() && broadcast && state.settings.followTeacher) {
        roomRef.child('settings').update({
          activeCanvasId: state.activeCanvasId,
          activePageId: state.activePageId
        });
      }
    }
  }

  // ===== 學生個別鎖定彈窗控制 (Item 8) =====
  let currentLockTarget = null; // { name, uid }

  function unlockStudent(studentKey, studentName) {
    const safeKey = studentKey ? studentKey.replace(/[.$#\[\]\/]/g, '_') : '';
    const safeName = studentName ? studentName.replace(/[.$#\[\]\/]/g, '_') : '';

    if (state.lockedStudents) {
      if (studentKey) delete state.lockedStudents[studentKey];
      if (studentName) delete state.lockedStudents[studentName];
      if (safeKey) delete state.lockedStudents[safeKey];
      if (safeName) delete state.lockedStudents[safeName];
      Object.keys(state.lockedStudents).forEach(k => {
        const l = state.lockedStudents[k];
        if (l && (l.name === studentName || l.uid === studentKey)) {
          delete state.lockedStudents[k];
        }
      });
    }

    if (roomRef) {
      const updates = {};
      if (studentKey) updates[studentKey] = null;
      if (studentName) updates[studentName] = null;
      if (safeKey) updates[safeKey] = null;
      if (safeName) updates[safeName] = null;
      Object.entries(state.lockedStudents || {}).forEach(([k, lock]) => {
        if (lock && (lock.name === studentName || lock.uid === studentKey)) {
          updates[k] = null;
        }
      });
      roomRef.child('lockedStudents').update(updates).catch(console.error);
    }

    flashToast(`🔓 已解除 ${studentName} 的編輯限制`);
    checkMyLockStatus();
    renderParticipantsList();
  }

  function openStudentLockModal(student) {
    currentLockTarget = student;
    if (els.lockStudentTargetName) els.lockStudentTargetName.textContent = student.name;

    const lockedMap = state.lockedStudents || {};
    const key = (student.uid || student.name || '').replace(/[.$#\[\]\/]/g, '_');
    const safeName = (student.name || '').replace(/[.$#\[\]\/]/g, '_');
    const existingLock = lockedMap[key] || lockedMap[safeName] || lockedMap[student.name];
    const isLocked = existingLock && (existingLock.until === -1 || existingLock.until > Date.now());

    if (els.lockStudentStatusBox) {
      if (isLocked) {
        els.lockStudentStatusBox.style.display = 'flex';
        if (existingLock.until === -1) {
          els.lockStudentStatusText.textContent = `目前狀態：永久鎖定中`;
        } else {
          const sec = Math.ceil((existingLock.until - Date.now()) / 1000);
          const min = Math.floor(sec / 60);
          const tText = min > 0 ? `${min} 分 ${sec % 60} 秒` : `${sec} 秒`;
          els.lockStudentStatusText.textContent = `目前狀態：鎖定中（剩餘 ${tText}）`;
        }
      } else {
        els.lockStudentStatusBox.style.display = 'none';
      }
    }

    if (els.studentLockModal) {
      els.studentLockModal.classList.add('open');
      els.studentLockModal.classList.add('active');
    }
  }

  function closeStudentLockModal() {
    if (els.studentLockModal) {
      els.studentLockModal.classList.remove('open');
      els.studentLockModal.classList.remove('active');
    }
    currentLockTarget = null;
  }

  // ===== 參與者名單 (依「姓名 + 角色」去重，徹底解決重複出現問題) =====
  function renderParticipantsList() {
    const rawUsers = Object.values(state.onlineUsers || {});
    const now = Date.now();

    // 1. 過濾超過 2.5 分鐘未發送心跳的過期殘留節點
    const activeUsers = rawUsers.filter(u => {
      if (!u || !u.name) return false;
      if (u.lastActive && typeof u.lastActive === 'number' && (now - u.lastActive > 150000)) {
        return false;
      }
      return true;
    });

    // 2. 嚴格依「姓名 + 角色」去重，保證同一個人永不重複顯示
    const uniqueMap = new Map();
    activeUsers.forEach(u => {
      const trimmedName = (u.name || '').trim();
      if (!trimmedName) return;
      const key = `${u.role || 'student'}_${trimmedName}`;
      const isMe = (u.id === myPresenceKey || u.uid === persistentUid || trimmedName === myName);

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, { ...u, name: trimmedName, isMe });
      } else if (isMe) {
        uniqueMap.get(key).isMe = true;
      }
    });

    const deduplicatedUsers = Array.from(uniqueMap.values());
    els.userCount.textContent = deduplicatedUsers.length;
    els.userList.innerHTML = '';

    // 老師排在最前面，自己優先，其餘按姓名排序
    deduplicatedUsers.sort((a, b) => {
      if (a.role === 'teacher' && b.role !== 'teacher') return -1;
      if (a.role !== 'teacher' && b.role === 'teacher') return 1;
      if (a.isMe && !b.isMe) return -1;
      if (!a.isMe && b.isMe) return 1;
      return a.name.localeCompare(b.name, 'zh-Hant');
    });

    const teacher = isTeacherUser();

    deduplicatedUsers.forEach(u => {
      const item = document.createElement('div');
      item.className = 'user-list-item';
      const roleBadgeClass = u.role === 'teacher' ? 'role-teacher' : 'role-student';
      const roleText = u.role === 'teacher' ? '老師' : '同學';

      const studentKey = u.uid || u.name;
      const lockedMap = state.lockedStudents || {};
      const lockData = lockedMap[studentKey] || lockedMap[u.name];
      const isLocked = lockData && (lockData.until === -1 || lockData.until > Date.now());

      let lockBadgeHtml = '';
      let lockActionBtnHtml = '';

      if (isLocked) {
        lockBadgeHtml = `<span class="student-locked-tag">🚫 已鎖定</span>`;
      }

      if (teacher && u.role !== 'teacher' && !u.isMe) {
        if (isLocked) {
          lockActionBtnHtml = `<button class="btn-student-lock-action btn-student-unlock-action" data-action="unlock" data-key="${escapeHtml(studentKey)}" data-name="${escapeHtml(u.name)}">解除</button>`;
        } else {
          lockActionBtnHtml = `<button class="btn-student-lock-action" data-action="lock" data-uid="${escapeHtml(u.uid || '')}" data-name="${escapeHtml(u.name)}">🔒 限制編輯</button>`;
        }
      }

      item.innerHTML = `
        <div class="user-info-left">
          <div class="user-dot"></div>
          <span style="font-weight:600;">${escapeHtml(u.name)}${u.isMe ? ' (您)' : ''}</span>
          ${lockBadgeHtml}
        </div>
        <div style="display:flex; align-items:center;">
          <span class="user-role-badge ${roleBadgeClass}">${roleText}</span>
          ${lockActionBtnHtml}
        </div>
      `;

      const actionBtn = item.querySelector('.btn-student-lock-action');
      if (actionBtn) {
        actionBtn.onclick = (e) => {
          e.stopPropagation();
          const action = actionBtn.dataset.action;
          if (action === 'unlock') {
            const key = actionBtn.dataset.key;
            const name = actionBtn.dataset.name;
            unlockStudent(key, name);
          } else {
            const uid = actionBtn.dataset.uid;
            const name = actionBtn.dataset.name;
            openStudentLockModal({ uid: uid || name, name: name });
          }
        };
      }

      els.userList.appendChild(item);
    });
  }

  // ===== 視角縮放與平移 (Pan & Zoom) =====
  function updateWorldTransform() {
    els.canvasWorld.style.transform = `translate(${state.view.x}px, ${state.view.y}px) scale(${state.view.zoom})`;
    if (els.zoomVal) els.zoomVal.textContent = Math.round(state.view.zoom * 100) + '%';
    if (typeof hideSvgHoverBox === 'function') {
      hideSvgHoverBox();
    }
    if (typeof updateSelectionActionBar === 'function') {
      updateSelectionActionBar();
    }
    if (typeof renderMinimap === 'function') {
      renderMinimap();
    }
  }

  function zoomAt(targetZoom, clientX, clientY) {
    const rect = els.canvasViewport.getBoundingClientRect();
    const cx = clientX !== undefined ? clientX - rect.left : rect.width / 2;
    const cy = clientY !== undefined ? clientY - rect.top : rect.height / 2;

    const clamped = Math.max(0.2, Math.min(3.0, targetZoom));
    const factor = clamped / state.view.zoom;

    state.view.x = cx - (cx - state.view.x) * factor;
    state.view.y = cy - (cy - state.view.y) * factor;
    state.view.zoom = clamped;
    updateWorldTransform();
  }

  function resetView() {
    state.view.x = 0;
    state.view.y = 0;
    state.view.zoom = 1;
    updateWorldTransform();
  }

  // 自適應全景縮放 (Item 5, 如圖 4 - 讓所有物件完全顯示在最佳比例)
  function zoomToFitAllObjects() {
    const objKeys = Object.keys(state.objects);
    if (objKeys.length === 0) {
      resetView();
      flashToast('畫布尚無物件，已重設視角為 100%');
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    objKeys.forEach(id => {
      const o = state.objects[id];
      if (!o) return;
      const b = getObjBounds(o);
      if (b && (b.width > 0 || b.height > 0)) {
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
        maxX = Math.max(maxX, b.x + b.width);
        maxY = Math.max(maxY, b.y + b.height);
      }
    });

    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
      resetView();
      return;
    }

    const contentW = Math.max(100, maxX - minX);
    const contentH = Math.max(80, maxY - minY);
    const rect = els.canvasViewport.getBoundingClientRect();
    const pad = 60;
    const availW = Math.max(100, rect.width - pad * 2);
    const availH = Math.max(100, rect.height - pad * 2);

    let targetZoom = Math.min(availW / contentW, availH / contentH);
    targetZoom = Math.max(0.15, Math.min(2.5, targetZoom));

    const contentCenterX = minX + contentW / 2;
    const contentCenterY = minY + contentH / 2;
    const vpCenterX = rect.width / 2;
    const vpCenterY = rect.height / 2;

    state.view.zoom = targetZoom;
    state.view.x = vpCenterX - contentCenterX * targetZoom;
    state.view.y = vpCenterY - contentCenterY * targetZoom;

    updateWorldTransform();
    flashToast(`🔍 已最適比例全覽畫面 (${Math.round(targetZoom * 100)}%)`);
  }

  // ===== 座標轉換 =====
  function screenToWorld(sx, sy) {
    const rect = els.canvasViewport.getBoundingClientRect();
    const vx = sx - rect.left;
    const vy = sy - rect.top;
    return {
      x: (vx - state.view.x) / state.view.zoom,
      y: (vy - state.view.y) / state.view.zoom
    };
  }

  function worldToViewport(wx, wy) {
    return {
      x: wx * state.view.zoom + state.view.x,
      y: wy * state.view.zoom + state.view.y
    };
  }

  // ===== 工具切換 =====
  function setTool(toolName) {
    state.currentTool = toolName;
    if (toolName !== 'select') {
      if (typeof deselectAll === 'function') deselectAll();
      document.querySelectorAll('.hover-target-outline').forEach(el => el.classList.remove('hover-target-outline'));
      if (typeof hideSvgHoverBox === 'function') hideSvgHoverBox();
    }

    const btns = els.floatingToolbar.querySelectorAll('.tool-btn[data-tool]');
    btns.forEach(b => {
      if (b.dataset.tool === toolName) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    els.canvasViewport.className = 'grid-bg';
    if (toolName === 'select') els.canvasViewport.classList.add('cursor-select');
    else if (toolName === 'hand') els.canvasViewport.classList.add('cursor-grab');
    else if (toolName === 'eraser') els.canvasViewport.classList.add('cursor-eraser');
  }

  // ===== 權限檢查：是否可動該物件 =====
  function canModifyObject(obj) {
    if (isTeacherUser()) return true;
    if (state.isIndividuallyLocked) return false;
    if (!state.settings.studentCanEdit) return false;
    if (state.settings.canMoveOthers) return true;
    // 嚴格模式：僅可動自己創建的物件
    return (obj.authorId === myClientId || obj.author === myName);
  }

  // ===== 物件渲染引擎 =====
  function renderObject(obj) {
    if (!obj || !obj.id) return;

    if (obj.type === 'sticky') {
      renderStickyNoteDOM(obj);
    } else if (obj.type === 'image') {
      renderImageDOM(obj);
    } else {
      renderSvgElement(obj);
    }
  }

  function removeObjectDOM(id) {
    const htmlEl = document.getElementById(`html_obj_${id}`);
    if (htmlEl) htmlEl.remove();
    const svgEl = document.getElementById(`svg_obj_${id}`);
    if (svgEl) svgEl.remove();
    const badgeEl = document.getElementById(`badge_obj_${id}`);
    if (badgeEl) badgeEl.remove();
  }

  function updateAllAuthorBadgesVisibility() {
    const badges = document.querySelectorAll('.obj-author-badge');
    badges.forEach(b => {
      b.style.display = state.showAuthorBadge ? 'block' : 'none';
    });
  }

  // 1. 便利貼渲染
  function renderStickyNoteDOM(obj) {
    let el = document.getElementById(`html_obj_${obj.id}`);
    if (!el) {
      el = document.createElement('div');
      el.id = `html_obj_${obj.id}`;
      el.className = 'board-sticky-note';
      els.htmlLayer.appendChild(el);
      bindObjectInteraction(el, obj);
    }

    el.style.left = obj.x + 'px';
    el.style.top = obj.y + 'px';
    el.style.width = (obj.width || 200) + 'px';
    el.style.minHeight = (obj.height || 140) + 'px';
    el.style.height = (obj.height || 140) + 'px';
    if (obj.bg) el.style.background = obj.bg;

    // 支援旋轉角度 (Rotation)
    if (obj.rotation) {
      el.style.transform = `rotate(${obj.rotation}deg)`;
      el.style.transformOrigin = 'center center';
    } else {
      el.style.transform = '';
      el.style.transformOrigin = '';
    }

    // 作者標籤
    const badgeHtml = `<div class="obj-author-badge" id="badge_obj_${obj.id}" style="display:${state.showAuthorBadge ? 'block' : 'none'};">${escapeHtml(obj.author || '同學')}</div>`;

    // 內容自動連結化 (URL 自動轉超連結)
    const linkedText = formatTextWithLinks(obj.text || '');
    el.innerHTML = `
      ${badgeHtml}
      <div class="sticky-content" contenteditable="false" spellcheck="false">${linkedText}</div>
    `;

    // 綁定編輯完成即時同步
    const contentEl = el.querySelector('.sticky-content');
    contentEl.ondblclick = (event) => {
      const current = state.objects[obj.id];
      if (state.currentTool !== 'select' || !current || !canModifyObject(current) || event.target.closest('a')) return;
      event.stopPropagation();
      contentEl.contentEditable = 'true';
      contentEl.focus();
    };
    contentEl.onblur = () => {
      if (contentEl.contentEditable !== 'true') return;
      contentEl.contentEditable = 'false';
      const current = state.objects[obj.id];
      const newText = contentEl.innerText.trim();
      if (current && canModifyObject(current) && newText !== current.text) {
        current.text = newText;
        pushObjectUpdate(current);
      }
      contentEl.innerHTML = formatTextWithLinks(current ? current.text || '' : obj.text || '');
    };
  }

  // 2. 圖片與 PDF 頁面渲染
  function renderImageDOM(obj) {
    let el = document.getElementById(`html_obj_${obj.id}`);
    if (!el) {
      el = document.createElement('div');
      el.id = `html_obj_${obj.id}`;
      el.className = 'board-image-item';
      els.htmlLayer.appendChild(el);
      bindObjectInteraction(el, obj);
    }

    el.style.left = obj.x + 'px';
    el.style.top = obj.y + 'px';
    el.style.width = (obj.width || 320) + 'px';
    el.style.height = (obj.height || 200) + 'px';

    // 支援旋轉角度 (Rotation)
    if (obj.rotation) {
      el.style.transform = `rotate(${obj.rotation}deg)`;
      el.style.transformOrigin = 'center center';
    } else {
      el.style.transform = '';
      el.style.transformOrigin = '';
    }

    const badgeHtml = `<div class="obj-author-badge" id="badge_obj_${obj.id}" style="display:${state.showAuthorBadge ? 'block' : 'none'};">${escapeHtml(obj.author || '同學')}</div>`;

    // 支援影像邊界裁切呈現 (Crop)
    const crop = obj.crop || { top: 0, right: 0, bottom: 0, left: 0 };
    const hasCrop = (crop.top || 0) > 0 || (crop.right || 0) > 0 || (crop.bottom || 0) > 0 || (crop.left || 0) > 0;

    let imgHtml = '';
    if (hasCrop) {
      const wRatio = Math.max(0.05, (100 - (crop.left || 0) - (crop.right || 0)) / 100);
      const hRatio = Math.max(0.05, (100 - (crop.top || 0) - (crop.bottom || 0)) / 100);
      const fullImgW = (obj.width || 320) / wRatio;
      const fullImgH = (obj.height || 200) / hRatio;
      const imgLeft = -fullImgW * ((crop.left || 0) / 100);
      const imgTop = -fullImgH * ((crop.top || 0) / 100);
      imgHtml = `
        <div class="board-image-crop-wrap" style="width: 100%; height: 100%; overflow: hidden; position: relative; border-radius: 6px;">
          <img src="${obj.src}" alt="${escapeHtml(obj.title || '圖片')}" loading="lazy" style="position: absolute; width: ${Math.round(fullImgW)}px; height: ${Math.round(fullImgH)}px; left: ${Math.round(imgLeft)}px; top: ${Math.round(imgTop)}px; max-width: none; max-height: none; pointer-events: none;" />
        </div>
      `;
    } else {
      imgHtml = `<img src="${obj.src}" alt="${escapeHtml(obj.title || '圖片')}" loading="lazy" style="width: 100%; height: 100%; border-radius: 6px; pointer-events: none; display: block;" />`;
    }

    el.innerHTML = `
      ${badgeHtml}
      ${imgHtml}
    `;
  }

  // 動態粗細漸變單色箭頭路徑計算 (Item 3, 如圖 3 - 軸身厚實漸粗、尖端倒鉤三角比例協調)
  function getArrowPathData(x1, y1, x2, y2, strokeWidth = 4) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 3) return '';

    const ux = dx / len;
    const uy = dy / len;
    const nx = -uy;
    const ny = ux;

    // 依設定的 strokeWidth (2, 4, 8) 進行基礎縮放
    const scale = Math.max(0.65, (strokeWidth || 4) / 4);

    // 依長度決定箭頭尺寸，確保箭頭與軸身協調且短箭頭不超界
    let headLen = 30 * scale;
    if (len < headLen * 1.5) {
      headLen = Math.max(10, len * 0.4);
    }

    const neckRatio = Math.min(1.0, headLen / (30 * scale));
    // 軸身寬度 (如圖 3：尾端厚實約 6px，頸部大幅加粗至約 16px)
    const shaftStartW = Math.max(2.5, 6 * scale * (neckRatio * 0.5 + 0.5));
    const shaftEndW = Math.max(6, 16 * scale * (neckRatio * 0.5 + 0.5));

    // 箭頭頂端兩側倒鉤寬度 (僅比頸部軸身向外多延伸約 6~7px，絕不大頭娃娃)
    const headBarbFlare = Math.max(4.5, 7 * scale * neckRatio);
    const headHalfW = (shaftEndW / 2) + headBarbFlare;

    const neckX = x2 - ux * headLen;
    const neckY = y2 - uy * headLen;

    // 1. 尾端起點兩翼 (厚實 ~6px)
    const tLx = x1 - nx * (shaftStartW / 2);
    const tLy = y1 - ny * (shaftStartW / 2);
    const tRx = x1 + nx * (shaftStartW / 2);
    const tRy = y1 + ny * (shaftStartW / 2);

    // 2. 頸部軸身兩翼 (厚實加粗 ~16px)
    const nLx = neckX - nx * (shaftEndW / 2);
    const nLy = neckY - ny * (shaftEndW / 2);
    const nRx = neckX + nx * (shaftEndW / 2);
    const nRy = neckY + ny * (shaftEndW / 2);

    // 3. 箭頭兩側倒鉤尖角
    const bLx = neckX - nx * headHalfW;
    const bLy = neckY - ny * headHalfW;
    const bRx = neckX + nx * headHalfW;
    const bRy = neckY + ny * headHalfW;

    return `M ${tLx.toFixed(1)} ${tLy.toFixed(1)} ` +
           `L ${nLx.toFixed(1)} ${nLy.toFixed(1)} ` +
           `L ${bLx.toFixed(1)} ${bLy.toFixed(1)} ` +
           `L ${x2.toFixed(1)} ${y2.toFixed(1)} ` +
           `L ${bRx.toFixed(1)} ${bRy.toFixed(1)} ` +
           `L ${nRx.toFixed(1)} ${nRy.toFixed(1)} ` +
           `L ${tRx.toFixed(1)} ${tRy.toFixed(1)} Z`;
  }

  // 3. SVG 筆劃、矩形、圓形、箭頭渲染
  function renderSvgElement(obj) {
    let el = document.getElementById(`svg_obj_${obj.id}`);
    const shouldRecreate = el && obj.type === 'arrow' && el.tagName.toLowerCase() !== 'path';
    if (!el || shouldRecreate) {
      if (shouldRecreate) el.remove();
      if (obj.type === 'pen' || obj.type === 'arrow') el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      else if (obj.type === 'rect') el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      else if (obj.type === 'circle') el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      el.id = `svg_obj_${obj.id}`;
      els.svgLayer.appendChild(el);
      bindSvgInteraction(el, obj);
    }

    if (obj.type === 'pen') {
      el.setAttribute('d', obj.d);
      el.setAttribute('stroke', obj.color || state.currentColor || '#2563eb');
      el.setAttribute('stroke-width', obj.strokeWidth || 4);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
    } else if (obj.type === 'rect') {
      el.setAttribute('x', obj.x);
      el.setAttribute('y', obj.y);
      el.setAttribute('width', Math.max(1, obj.width));
      el.setAttribute('height', Math.max(1, obj.height));
      el.setAttribute('stroke', obj.color || state.currentColor || '#2563eb');
      el.setAttribute('stroke-width', obj.strokeWidth || 3);
      el.setAttribute('fill', obj.fill || 'transparent');
      el.setAttribute('rx', '4');
    } else if (obj.type === 'circle') {
      el.setAttribute('cx', obj.cx);
      el.setAttribute('cy', obj.cy);
      el.setAttribute('rx', Math.max(1, obj.rx));
      el.setAttribute('ry', Math.max(1, obj.ry));
      el.setAttribute('stroke', obj.color || state.currentColor || '#2563eb');
      el.setAttribute('stroke-width', obj.strokeWidth || 3);
      el.setAttribute('fill', obj.fill || 'transparent');
    } else if (obj.type === 'arrow') {
      const dStr = getArrowPathData(obj.x1 || 0, obj.y1 || 0, obj.x2 || 0, obj.y2 || 0, obj.strokeWidth || 4);
      el.setAttribute('d', dStr);
      const col = obj.color || state.currentColor || '#2563eb';
      el.setAttribute('fill', col);
      el.setAttribute('stroke', col);
      el.setAttribute('stroke-width', '1');
      el.setAttribute('stroke-linejoin', 'round');
    }

    // 支援 SVG 旋轉角度 (Rotation)
    const b = getObjBounds(obj);
    const cx = Math.round(b.x + b.width / 2);
    const cy = Math.round(b.y + b.height / 2);
    if (obj.rotation) {
      el.setAttribute('transform', `rotate(${obj.rotation} ${cx} ${cy})`);
    } else {
      el.removeAttribute('transform');
    }

    // SVG 物件作者標籤 (置於起點上方)
    let badgeEl = document.getElementById(`badge_obj_${obj.id}`);
    if (!badgeEl) {
      badgeEl = document.createElement('div');
      badgeEl.id = `badge_obj_${obj.id}`;
      badgeEl.className = 'obj-author-badge';
      badgeEl.textContent = obj.author || '同學';
      els.htmlLayer.appendChild(badgeEl);
    }
    const bx = obj.x !== undefined ? obj.x : (obj.x1 !== undefined ? Math.min(obj.x1, obj.x2) : (obj.cx - (obj.rx || 0)));
    const by = obj.y !== undefined ? obj.y : (obj.y1 !== undefined ? Math.min(obj.y1, obj.y2) : (obj.cy - (obj.ry || 0)));
    badgeEl.style.left = bx + 'px';
    badgeEl.style.top = (by - 20) + 'px';
    badgeEl.style.display = state.showAuthorBadge ? 'block' : 'none';
  }

  // ===== SVG 與 HTML 物件懸停虛線外框 =====
  function showSvgHoverBox(obj) {
    const hoverBox = els.wbHoverBox || document.getElementById('wbHoverBox');
    if (!hoverBox || !obj) return;
    const b = getObjBounds(obj);
    const pad = 3;
    hoverBox.style.left = (b.x - pad) + 'px';
    hoverBox.style.top = (b.y - pad) + 'px';
    hoverBox.style.width = Math.max(10, b.width + pad * 2) + 'px';
    hoverBox.style.height = Math.max(10, b.height + pad * 2) + 'px';
    hoverBox.style.transform = obj.rotation ? `rotate(${obj.rotation}deg)` : 'none';
    hoverBox.style.transformOrigin = 'center center';
    hoverBox.style.display = 'block';
  }

  function hideSvgHoverBox() {
    const hoverBox = els.wbHoverBox || document.getElementById('wbHoverBox');
    if (hoverBox) hoverBox.style.display = 'none';
  }

  // ===== 物件拖曳與點選互動 (DOM & SVG) =====
  function setupHoverEffects(el, obj, isSvg) {
    el.addEventListener('pointerenter', () => {
      if (state.currentTool !== 'select' || state.isMarqueeSelecting) return;
      // 若該物件已被選中，已有變形控制點與外框，不需顯示懸停外框
      if (state.selectedObjIds && state.selectedObjIds.includes(obj.id)) return;

      if (isSvg) {
        showSvgHoverBox(obj);
      } else {
        el.classList.add('hover-target-outline');
      }
    });

    el.addEventListener('pointerleave', () => {
      if (isSvg) {
        hideSvgHoverBox();
      } else {
        el.classList.remove('hover-target-outline');
      }
    });
  }

  // ===== 歷史記錄還原 / 重做 (Item 1, Ctrl + Z / Ctrl + Y) =====
  let undoStack = [];
  let redoStack = [];
  let isApplyingHistory = false;

  function pushHistoryAction(action) {
    if (isApplyingHistory) return;
    undoStack.push(action);
    if (undoStack.length > 50) undoStack.shift();
    redoStack = [];
    updateHistoryUI();
  }

  function updateHistoryUI() {
    if (els.btnUndo) els.btnUndo.disabled = (undoStack.length === 0);
    if (els.btnRedo) els.btnRedo.disabled = (redoStack.length === 0);
  }

  function undo() {
    if (undoStack.length === 0) {
      flashToast('已無更早的操作可還原');
      return;
    }
    const action = undoStack.pop();
    redoStack.push(action);
    applyHistoryAction(action, true);
    updateHistoryUI();
    flashToast('↩️ 已還原上一步');
  }

  function redo() {
    if (redoStack.length === 0) {
      flashToast('已無後續操作可重做');
      return;
    }
    const action = redoStack.pop();
    undoStack.push(action);
    applyHistoryAction(action, false);
    updateHistoryUI();
    flashToast('↪️ 已重做下一步');
  }

  function applyHistoryAction(action, isUndo) {
    isApplyingHistory = true;
    try {
      if (action.type === 'create') {
        // isUndo: 刪除物件; !isUndo: 重建物件
        if (isUndo) {
          action.objects.forEach(obj => {
            deleteObject(obj.id);
          });
        } else {
          action.objects.forEach(obj => {
            state.objects[obj.id] = JSON.parse(JSON.stringify(obj));
            renderObject(obj);
            pushObjectUpdate(obj);
          });
        }
      } else if (action.type === 'delete') {
        // isUndo: 重建物件; !isUndo: 刪除物件
        if (isUndo) {
          action.objects.forEach(obj => {
            state.objects[obj.id] = JSON.parse(JSON.stringify(obj));
            renderObject(obj);
            pushObjectUpdate(obj);
          });
        } else {
          action.objects.forEach(obj => {
            deleteObject(obj.id);
          });
        }
      } else if (action.type === 'update') {
        const list = isUndo ? action.before : action.after;
        list.forEach(obj => {
          const previous = state.objects[obj.id];
          state.objects[obj.id] = JSON.parse(JSON.stringify(obj));
          renderObject(obj);
          pushObjectUpdate(obj, previous);
        });
      }
      if (typeof updateSelectionActionBar === 'function') updateSelectionActionBar();
    } finally {
      isApplyingHistory = false;
    }
  }

  function eraseObjectByObj(obj) {
    if (!obj || !state.objects[obj.id]) return false;
    if (!isStudentAllowedToEdit()) {
      flashToast(state.isIndividuallyLocked ? '🚫 您目前已被老師限制編輯白板' : '🔒 老師目前設定白板為唯讀狀態');
      return false;
    }
    if (!canModifyObject(obj)) {
      flashToast('⚠️ 老師已設定僅能刪除自己建立的物件');
      return false;
    }
    pushHistoryAction({ type: 'delete', objects: [JSON.parse(JSON.stringify(obj))] });
    deleteObject(obj.id);
    return true;
  }

  function eraseAtPoint(clientX, clientY) {
    if (!isStudentAllowedToEdit()) return;
    const pos = screenToWorld(clientX, clientY);
    const pad = 10 / (state.view.zoom || 1);
    const hitBox = { x: pos.x - pad, y: pos.y - pad, w: pad * 2, h: pad * 2 };
    Object.values(state.objects).forEach(obj => {
      if (!obj || !canModifyObject(obj)) return;
      const ob = getObjBounds(obj);
      if (intersectRect(hitBox, ob)) {
        eraseObjectByObj(obj);
      }
    });
  }

  function handleObjectPointerDown(e, obj, el, isSvg) {
    if (state.currentTool === 'eraser') {
      e.preventDefault();
      e.stopPropagation();
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
      state.isErasing = true;
      eraseObjectByObj(obj);
      return;
    }

    if (e.target.closest('a') || e.target.closest('.sticky-content[contenteditable="true"]')) return;
    if (state.currentTool !== 'select') return;

    hideSvgHoverBox();

    if (!canModifyObject(obj)) {
      flashToast('⚠️ 老師已設定僅能移動自己建立的物件');
      return;
    }

    e.stopPropagation();

    // 處理多選 (Shift 或 Ctrl 點選) 與單選
    if (e.shiftKey || e.ctrlKey) {
      if (state.selectedObjIds.includes(obj.id)) {
        state.selectedObjIds = state.selectedObjIds.filter(id => id !== obj.id);
      } else {
        state.selectedObjIds.push(obj.id);
      }
    } else {
      if (!state.selectedObjIds.includes(obj.id)) {
        state.selectedObjIds = [obj.id];
      }
    }

    updateSelectionVisuals();
    updateSelectionActionBar();

    // 準備拖曳 (支援所有選取物件同動)
    const startPos = screenToWorld(e.clientX, e.clientY);
    const snapshots = {};
    state.selectedObjIds.forEach(id => {
      const o = state.objects[id];
      if (o && canModifyObject(o)) {
        snapshots[id] = JSON.parse(JSON.stringify(o));
      }
    });

    let hasMoved = false;

    function onMove(me) {
      hasMoved = true;
      const cur = screenToWorld(me.clientX, me.clientY);
      const dx = cur.x - startPos.x;
      const dy = cur.y - startPos.y;

      Object.keys(snapshots).forEach(id => {
        const orig = snapshots[id];
        const target = state.objects[id];
        if (!target) return;

        if (target.type === 'sticky' || target.type === 'image') {
          target.x = Math.round(orig.x + dx);
          target.y = Math.round(orig.y + dy);
          const hEl = document.getElementById(`html_obj_${id}`);
          if (hEl) {
            hEl.style.left = target.x + 'px';
            hEl.style.top = target.y + 'px';
          }
          const bEl = document.getElementById(`badge_obj_${id}`);
          if (bEl) {
            bEl.style.left = target.x + 'px';
            bEl.style.top = (target.y - 20) + 'px';
          }
        } else if (target.type === 'rect') {
          target.x = Math.round(orig.x + dx);
          target.y = Math.round(orig.y + dy);
          renderSvgElement(target);
        } else if (target.type === 'circle') {
          target.cx = Math.round(orig.cx + dx);
          target.cy = Math.round(orig.cy + dy);
          renderSvgElement(target);
        } else if (target.type === 'arrow') {
          target.x1 = Math.round(orig.x1 + dx);
          target.y1 = Math.round(orig.y1 + dy);
          target.x2 = Math.round(orig.x2 + dx);
          target.y2 = Math.round(orig.y2 + dy);
          renderSvgElement(target);
        } else if (target.type === 'pen') {
          target.d = translateSvgPath(orig.d, dx, dy);
          if (orig.points) {
            target.points = orig.points.map(p => ({ x: Math.round(p.x + dx), y: Math.round(p.y + dy) }));
          }
          renderSvgElement(target);
        }
      });

      updateSelectionActionBar();
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);

      if (hasMoved) {
        const beforeList = [];
        const afterList = [];
        Object.keys(snapshots).forEach(id => {
          if (state.objects[id]) {
            beforeList.push(snapshots[id]);
            afterList.push(JSON.parse(JSON.stringify(state.objects[id])));
            pushObjectUpdate(state.objects[id], snapshots[id]);
          }
        });
        if (beforeList.length > 0) {
          pushHistoryAction({ type: 'update', before: beforeList, after: afterList });
        }
      }
      updateSelectionActionBar();
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  function bindObjectInteraction(el, obj) {
    setupHoverEffects(el, obj, false);
    el.addEventListener('pointerdown', (e) => handleObjectPointerDown(e, obj, el, false));
  }

  function bindSvgInteraction(el, obj) {
    setupHoverEffects(el, obj, true);
    el.addEventListener('pointerdown', (e) => handleObjectPointerDown(e, obj, el, true));
  }

  function translateSvgPath(d, dx, dy) {
    return d.replace(/([ML])\s*(-?[\d.]+)\s*[, ]\s*(-?[\d.]+)/g, (_, cmd, x, y) => {
      return `${cmd} ${(parseFloat(x) + dx).toFixed(1)} ${(parseFloat(y) + dy).toFixed(1)}`;
    });
  }

  function scaleSvgPath(d, oldB, newX, newY, newW, newH) {
    if (!d || !oldB || oldB.width <= 0 || oldB.height <= 0) return d;
    const sx = newW / oldB.width;
    const sy = newH / oldB.height;
    return d.replace(/([ML])\s*(-?[\d.]+)\s*[, ]\s*(-?[\d.]+)/g, (_, cmd, x, y) => {
      const nx = newX + (parseFloat(x) - oldB.x) * sx;
      const ny = newY + (parseFloat(y) - oldB.y) * sy;
      return `${cmd} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
    });
  }

  function pointsToSvgPath(pts) {
    if (!pts || pts.length === 0) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  }

  // ===== 互動白板物件變形覆蓋層 (8 個控制點 + 旋轉把手 + 影像裁切) =====
  let isTransformInitialized = false;

  function initTransformOverlay() {
    if (isTransformInitialized) return;
    const overlay = els.wbTransformOverlay || document.getElementById('wbTransformOverlay');
    if (!overlay) return;
    isTransformInitialized = true;

    overlay.innerHTML = `
      <div class="wb-rot-stem"></div>
      <div class="wb-handle wb-handle-rot" data-handle="rot" title="旋轉物件 (拖曳旋轉，按住 Shift 鍵以 15 度吸附)">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
      </div>
      <div class="wb-handle wb-handle-corner wb-handle-nw" data-handle="nw" title="放大 / 縮小"></div>
      <div class="wb-handle wb-handle-corner wb-handle-ne" data-handle="ne" title="放大 / 縮小"></div>
      <div class="wb-handle wb-handle-corner wb-handle-se" data-handle="se" title="放大 / 縮小"></div>
      <div class="wb-handle wb-handle-corner wb-handle-sw" data-handle="sw" title="放大 / 縮小"></div>
      <div class="wb-handle wb-handle-edge wb-handle-n" data-handle="n"></div>
      <div class="wb-handle wb-handle-edge wb-handle-e" data-handle="e"></div>
      <div class="wb-handle wb-handle-edge wb-handle-s" data-handle="s"></div>
      <div class="wb-handle wb-handle-edge wb-handle-w" data-handle="w"></div>
    `;

    overlay.querySelectorAll('.wb-handle').forEach(handle => {
      handle.addEventListener('pointerdown', (e) => onHandlePointerDown(e, handle.dataset.handle));
    });

    if (els.btnResetRotation) {
      els.btnResetRotation.onclick = () => {
        const selectedId = state.selectedObjId;
        const obj = state.objects[selectedId];
        if (!obj || !canModifyObject(obj)) return;
        const beforeSnap = JSON.parse(JSON.stringify(obj));
        obj.rotation = 0;
        renderObject(obj);
        pushObjectUpdate(obj, beforeSnap);
        pushHistoryAction({ type: 'update', before: [beforeSnap], after: [JSON.parse(JSON.stringify(obj))] });
        updateSelectionActionBar();
        updateTransformOverlay();
        flashToast('🔄 物件已轉正為 0 度');
      };
    }

    if (els.btnResetCrop) {
      els.btnResetCrop.onclick = () => {
        const selectedId = state.selectedObjId;
        const obj = state.objects[selectedId];
        if (!obj || obj.type !== 'image' || !canModifyObject(obj)) return;
        const beforeSnap = JSON.parse(JSON.stringify(obj));
        const crop = obj.crop || { top: 0, right: 0, bottom: 0, left: 0 };
        const visW_ratio = Math.max(0.05, (100 - (crop.left || 0) - (crop.right || 0)) / 100);
        const visH_ratio = Math.max(0.05, (100 - (crop.top || 0) - (crop.bottom || 0)) / 100);
        const fullW = obj.width / visW_ratio;
        const fullH = obj.height / visH_ratio;
        const rad = (obj.rotation || 0) * Math.PI / 180;
        const dLocalX = -((crop.left || 0) / 100) * fullW;
        const dLocalY = -((crop.top || 0) / 100) * fullH;
        obj.x = Math.round(obj.x + dLocalX * Math.cos(rad) - dLocalY * Math.sin(rad));
        obj.y = Math.round(obj.y + dLocalX * Math.sin(rad) + dLocalY * Math.cos(rad));
        obj.width = Math.round(fullW);
        obj.height = Math.round(fullH);
        obj.crop = { top: 0, right: 0, bottom: 0, left: 0 };
        renderObject(obj);
        pushObjectUpdate(obj, beforeSnap);
        pushHistoryAction({ type: 'update', before: [beforeSnap], after: [JSON.parse(JSON.stringify(obj))] });
        updateSelectionActionBar();
        updateTransformOverlay();
        flashToast('✂️ 圖片裁切已重設為完整全圖');
      };
    }
  }

  function updateTransformOverlay() {
    const overlay = els.wbTransformOverlay || document.getElementById('wbTransformOverlay');
    if (!overlay) return;
    if (!isTransformInitialized) initTransformOverlay();

    const selectedIds = state.selectedObjIds || [];
    if (selectedIds.length !== 1 || state.currentTool !== 'select') {
      overlay.style.display = 'none';
      return;
    }

    const obj = state.objects[selectedIds[0]];
    if (!obj) {
      overlay.style.display = 'none';
      return;
    }

    const b = getObjBounds(obj);
    overlay.style.left = b.x + 'px';
    overlay.style.top = b.y + 'px';
    overlay.style.width = Math.max(10, b.width) + 'px';
    overlay.style.height = Math.max(10, b.height) + 'px';
    overlay.style.transform = obj.rotation ? `rotate(${obj.rotation}deg)` : 'none';
    overlay.style.transformOrigin = 'center center';
    overlay.style.display = 'block';

    const isImage = (obj.type === 'image');
    if (isImage) {
      overlay.classList.add('is-image-object');
      const hn = overlay.querySelector('.wb-handle-n');
      const hs = overlay.querySelector('.wb-handle-s');
      const hw = overlay.querySelector('.wb-handle-w');
      const he = overlay.querySelector('.wb-handle-e');
      if (hn) hn.title = '✂️ 裁切上方 (拖曳調整裁切邊界)';
      if (hs) hs.title = '✂️ 裁切下方 (拖曳調整裁切邊界)';
      if (hw) hw.title = '✂️ 裁切左側 (拖曳調整裁切邊界)';
      if (he) he.title = '✂️ 裁切右側 (拖曳調整裁切邊界)';
    } else {
      overlay.classList.remove('is-image-object');
      const hn = overlay.querySelector('.wb-handle-n');
      const hs = overlay.querySelector('.wb-handle-s');
      const hw = overlay.querySelector('.wb-handle-w');
      const he = overlay.querySelector('.wb-handle-e');
      if (hn) hn.title = '調整高度';
      if (hs) hs.title = '調整高度';
      if (hw) hw.title = '調整寬度';
      if (he) he.title = '調整寬度';
    }

    const editable = canModifyObject(obj);
    overlay.querySelectorAll('.wb-handle').forEach(h => {
      h.style.display = editable ? 'flex' : 'none';
    });
    const rotStem = overlay.querySelector('.wb-rot-stem');
    if (rotStem) rotStem.style.display = editable ? 'block' : 'none';
  }

  function onHandlePointerDown(e, handleType) {
    const selectedIds = state.selectedObjIds || [];
    if (selectedIds.length !== 1) return;
    const obj = state.objects[selectedIds[0]];
    if (!obj || !canModifyObject(obj)) {
      flashToast('⚠️ 僅能編輯自己建立的物件或需老師權限');
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const initialObj = JSON.parse(JSON.stringify(obj));
    const initialBounds = getObjBounds(initialObj);
    const initialCenter = {
      x: initialBounds.x + initialBounds.width / 2,
      y: initialBounds.y + initialBounds.height / 2
    };
    const startPointer = screenToWorld(e.clientX, e.clientY);
    let hasModified = false;

    function onMove(me) {
      hasModified = true;
      const curPointer = screenToWorld(me.clientX, me.clientY);
      const rot = initialObj.rotation || 0;
      const rad = rot * Math.PI / 180;

      if (handleType === 'rot') {
        const theta = Math.atan2(curPointer.y - initialCenter.y, curPointer.x - initialCenter.x);
        let deg = Math.round(((theta * 180 / Math.PI + 90) % 360 + 360) % 360);
        if (me.shiftKey) deg = Math.round(deg / 15) * 15;
        obj.rotation = deg;
      } else if (['nw', 'ne', 'se', 'sw'].includes(handleType)) {
        const opposite = { nw: 'se', ne: 'sw', se: 'nw', sw: 'ne' };
        const cornerSign = { nw: { x: -1, y: -1 }, ne: { x: 1, y: -1 }, se: { x: 1, y: 1 }, sw: { x: -1, y: 1 } };
        const opp = opposite[handleType];
        const anchorSign = cornerSign[opp];
        const anchorLocal = { x: anchorSign.x * initialBounds.width / 2, y: anchorSign.y * initialBounds.height / 2 };
        const anchorWorld = {
          x: initialCenter.x + anchorLocal.x * Math.cos(rad) - anchorLocal.y * Math.sin(rad),
          y: initialCenter.y + anchorLocal.x * Math.sin(rad) + anchorLocal.y * Math.cos(rad)
        };
        const vWorld = { x: curPointer.x - anchorWorld.x, y: curPointer.y - anchorWorld.y };
        const vLocalX = vWorld.x * Math.cos(-rad) - vWorld.y * Math.sin(-rad);
        const vLocalY = vWorld.x * Math.sin(-rad) + vWorld.y * Math.cos(-rad);
        let newW = Math.max(25, -anchorSign.x * vLocalX);
        let newH = Math.max(25, -anchorSign.y * vLocalY);

        if (obj.type === 'image' || me.shiftKey) {
          const ratio = initialBounds.width / Math.max(1, initialBounds.height);
          if (Math.abs(newW - initialBounds.width) > Math.abs(newH - initialBounds.height)) {
            newH = Math.max(20, newW / ratio);
          } else {
            newW = Math.max(20, newH * ratio);
          }
        }

        const localCenterOffset = { x: -anchorSign.x * newW / 2, y: -anchorSign.y * newH / 2 };
        const newCenter = {
          x: anchorWorld.x + localCenterOffset.x * Math.cos(rad) - localCenterOffset.y * Math.sin(rad),
          y: anchorWorld.y + localCenterOffset.x * Math.sin(rad) + localCenterOffset.y * Math.cos(rad)
        };
        const newX = Math.round(newCenter.x - newW / 2);
        const newY = Math.round(newCenter.y - newH / 2);
        newW = Math.round(newW);
        newH = Math.round(newH);

        if (obj.type === 'sticky' || obj.type === 'image' || obj.type === 'rect') {
          obj.x = newX;
          obj.y = newY;
          obj.width = newW;
          obj.height = newH;
        } else if (obj.type === 'circle') {
          obj.cx = Math.round(newCenter.x);
          obj.cy = Math.round(newCenter.y);
          obj.rx = Math.max(5, Math.round(newW / 2));
          obj.ry = Math.max(5, Math.round(newH / 2));
        } else if (obj.type === 'arrow') {
          const sx = newW / Math.max(1, initialBounds.width);
          const sy = newH / Math.max(1, initialBounds.height);
          obj.x1 = Math.round(newX + (initialObj.x1 - initialBounds.x) * sx);
          obj.y1 = Math.round(newY + (initialObj.y1 - initialBounds.y) * sy);
          obj.x2 = Math.round(newX + (initialObj.x2 - initialBounds.x) * sx);
          obj.y2 = Math.round(newY + (initialObj.y2 - initialBounds.y) * sy);
        } else if (obj.type === 'pen') {
          const sx = newW / Math.max(1, initialBounds.width);
          const sy = newH / Math.max(1, initialBounds.height);
          if (initialObj.points) {
            obj.points = initialObj.points.map(p => ({
              x: Math.round(newX + (p.x - initialBounds.x) * sx),
              y: Math.round(newY + (p.y - initialBounds.y) * sy)
            }));
            obj.d = pointsToSvgPath(obj.points);
          } else {
            obj.d = scaleSvgPath(initialObj.d, initialBounds, newX, newY, newW, newH);
          }
        }
      } else if (['n', 's', 'e', 'w'].includes(handleType)) {
        const dx = curPointer.x - startPointer.x;
        const dy = curPointer.y - startPointer.y;
        const localDx = dx * Math.cos(-rad) - dy * Math.sin(-rad);
        const localDy = dx * Math.sin(-rad) + dy * Math.cos(-rad);

        if (obj.type === 'image') {
          // 影像物件：四個邊中間節點為「裁切 (Crop)」
          const c = initialObj.crop || { top: 0, right: 0, bottom: 0, left: 0 };
          const visW_ratio = Math.max(0.05, (100 - (c.left || 0) - (c.right || 0)) / 100);
          const visH_ratio = Math.max(0.05, (100 - (c.top || 0) - (c.bottom || 0)) / 100);
          const fullW = initialBounds.width / visW_ratio;
          const fullH = initialBounds.height / visH_ratio;

          if (handleType === 'e') {
            const deltaCropRight_pct = (-localDx / fullW) * 100;
            const targetCropRight = Math.max(0, Math.min(85 - (c.left || 0), (c.right || 0) + deltaCropRight_pct));
            const newW = Math.max(25, fullW * (100 - (c.left || 0) - targetCropRight) / 100);
            obj.width = Math.round(newW);
            obj.crop = { ...c, right: Math.round(targetCropRight * 10) / 10 };
          } else if (handleType === 'w') {
            const deltaCropLeft_pct = (localDx / fullW) * 100;
            const targetCropLeft = Math.max(0, Math.min(85 - (c.right || 0), (c.left || 0) + deltaCropLeft_pct));
            const newW = Math.max(25, fullW * (100 - targetCropLeft - (c.right || 0)) / 100);
            const dLocalX = (targetCropLeft - (c.left || 0)) / 100 * fullW;
            obj.x = Math.round(initialObj.x + dLocalX * Math.cos(rad));
            obj.y = Math.round(initialObj.y + dLocalX * Math.sin(rad));
            obj.width = Math.round(newW);
            obj.crop = { ...c, left: Math.round(targetCropLeft * 10) / 10 };
          } else if (handleType === 's') {
            const deltaCropBottom_pct = (-localDy / fullH) * 100;
            const targetCropBottom = Math.max(0, Math.min(85 - (c.top || 0), (c.bottom || 0) + deltaCropBottom_pct));
            const newH = Math.max(25, fullH * (100 - (c.top || 0) - targetCropBottom) / 100);
            obj.height = Math.round(newH);
            obj.crop = { ...c, bottom: Math.round(targetCropBottom * 10) / 10 };
          } else if (handleType === 'n') {
            const deltaCropTop_pct = (localDy / fullH) * 100;
            const targetCropTop = Math.max(0, Math.min(85 - (c.bottom || 0), (c.top || 0) + deltaCropTop_pct));
            const newH = Math.max(25, fullH * (100 - targetCropTop - (c.bottom || 0)) / 100);
            const dLocalY = (targetCropTop - (c.top || 0)) / 100 * fullH;
            obj.x = Math.round(initialObj.x - dLocalY * Math.sin(rad));
            obj.y = Math.round(initialObj.y + dLocalY * Math.cos(rad));
            obj.height = Math.round(newH);
            obj.crop = { ...c, top: Math.round(targetCropTop * 10) / 10 };
          }
        } else {
          // 非影像物件：邊界拉伸 (Resize Dimension)
          if (handleType === 'e') {
            const newW = Math.max(25, initialBounds.width + localDx);
            const shift = (newW - initialBounds.width) / 2;
            if (obj.type === 'circle') {
              obj.rx = Math.max(5, Math.round(newW / 2));
              obj.cx = Math.round(initialCenter.x + shift * Math.cos(rad));
              obj.cy = Math.round(initialCenter.y + shift * Math.sin(rad));
            } else {
              obj.width = Math.round(newW);
              obj.x = Math.round(initialObj.x + shift * Math.cos(rad) - shift);
              obj.y = Math.round(initialObj.y + shift * Math.sin(rad));
            }
          } else if (handleType === 'w') {
            const newW = Math.max(25, initialBounds.width - localDx);
            const shift = -(newW - initialBounds.width) / 2;
            if (obj.type === 'circle') {
              obj.rx = Math.max(5, Math.round(newW / 2));
              obj.cx = Math.round(initialCenter.x + shift * Math.cos(rad));
              obj.cy = Math.round(initialCenter.y + shift * Math.sin(rad));
            } else {
              obj.width = Math.round(newW);
              obj.x = Math.round(initialObj.x + shift * Math.cos(rad) - shift);
              obj.y = Math.round(initialObj.y + shift * Math.sin(rad));
            }
          } else if (handleType === 's') {
            const newH = Math.max(25, initialBounds.height + localDy);
            const shift = (newH - initialBounds.height) / 2;
            if (obj.type === 'circle') {
              obj.ry = Math.max(5, Math.round(newH / 2));
              obj.cx = Math.round(initialCenter.x - shift * Math.sin(rad));
              obj.cy = Math.round(initialCenter.y + shift * Math.cos(rad));
            } else {
              obj.height = Math.round(newH);
              obj.x = Math.round(initialObj.x - shift * Math.sin(rad));
              obj.y = Math.round(initialObj.y + shift * Math.cos(rad) - shift);
            }
          } else if (handleType === 'n') {
            const newH = Math.max(25, initialBounds.height - localDy);
            const shift = -(newH - initialBounds.height) / 2;
            if (obj.type === 'circle') {
              obj.ry = Math.max(5, Math.round(newH / 2));
              obj.cx = Math.round(initialCenter.x - shift * Math.sin(rad));
              obj.cy = Math.round(initialCenter.y + shift * Math.cos(rad));
            } else {
              obj.height = Math.round(newH);
              obj.x = Math.round(initialObj.x - shift * Math.sin(rad));
              obj.y = Math.round(initialObj.y + shift * Math.cos(rad) - shift);
            }
          }
        }
      }

      renderObject(obj);
      updateTransformOverlay();
      updateSelectionActionBar();
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (hasModified) {
        pushObjectUpdate(obj, initialObj);
        pushHistoryAction({ type: 'update', before: [initialObj], after: [JSON.parse(JSON.stringify(obj))] });
        updateSelectionVisuals();
        updateSelectionActionBar();
      }
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  // ===== 選取管理與外觀視覺 =====
  function selectObject(id, addToSelection) {
    if (addToSelection) {
      if (!state.selectedObjIds.includes(id)) state.selectedObjIds.push(id);
    } else {
      state.selectedObjIds = [id];
    }
    updateSelectionVisuals();
    updateSelectionActionBar();
    updateTransformOverlay();
  }

  function deselectAll() {
    state.selectedObjIds = [];
    updateSelectionVisuals();
    updateSelectionActionBar();
    updateTransformOverlay();
  }

  function updateSelectionVisuals() {
    document.querySelectorAll('.selected-border').forEach(el => el.classList.remove('selected-border'));
    document.querySelectorAll('.selected-svg-outline').forEach(el => el.classList.remove('selected-svg-outline'));
    document.querySelectorAll('.hover-target-outline').forEach(el => el.classList.remove('hover-target-outline'));
    hideSvgHoverBox();

    // 多選時對 HTML 物件加上 selected-border，單選由 Transform Overlay 統一呈現外框與 8 控制點
    if (state.selectedObjIds && state.selectedObjIds.length > 1) {
      state.selectedObjIds.forEach(id => {
        const htmlEl = document.getElementById(`html_obj_${id}`);
        if (htmlEl) htmlEl.classList.add('selected-border');
      });
    }
  }

  // 計算物件的世界座標包圍盒 (Bounding Box)
  function getObjBounds(obj) {
    if (!obj) return { x: 0, y: 0, width: 0, height: 0 };
    if (obj.type === 'sticky') {
      return { x: obj.x || 0, y: obj.y || 0, width: obj.width || 210, height: obj.height || 140 };
    }
    if (obj.type === 'image') {
      return { x: obj.x || 0, y: obj.y || 0, width: obj.width || 320, height: obj.height || 200 };
    }
    if (obj.type === 'rect') {
      return { x: obj.x || 0, y: obj.y || 0, width: Math.max(5, obj.width || 0), height: Math.max(5, obj.height || 0) };
    }
    if (obj.type === 'circle') {
      const rx = obj.rx || 10;
      const ry = obj.ry || 10;
      return { x: (obj.cx || 0) - rx, y: (obj.cy || 0) - ry, width: rx * 2, height: ry * 2 };
    }
    if (obj.type === 'arrow') {
      const minX = Math.min(obj.x1 || 0, obj.x2 || 0) - 20;
      const minY = Math.min(obj.y1 || 0, obj.y2 || 0) - 20;
      const w = Math.max(25, Math.abs((obj.x2 || 0) - (obj.x1 || 0)) + 40);
      const h = Math.max(25, Math.abs((obj.y2 || 0) - (obj.y1 || 0)) + 40);
      return { x: minX, y: minY, width: w, height: h };
    }
    if (obj.type === 'pen') {
      if (obj.points && obj.points.length > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        obj.points.forEach(p => {
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        });
        return { x: minX, y: minY, width: Math.max(10, maxX - minX), height: Math.max(10, maxY - minY) };
      }
      const coords = (obj.d || '').match(/-?[\d.]+/g);
      if (coords && coords.length >= 2) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (let i = 0; i < coords.length; i += 2) {
          const px = parseFloat(coords[i]);
          const py = parseFloat(coords[i + 1]);
          if (!isNaN(px) && !isNaN(py)) {
            if (px < minX) minX = px;
            if (py < minY) minY = py;
            if (px > maxX) maxX = px;
            if (py > maxY) maxY = py;
          }
        }
        if (minX !== Infinity) {
          return { x: minX, y: minY, width: Math.max(10, maxX - minX), height: Math.max(10, maxY - minY) };
        }
      }
    }
    return { x: 0, y: 0, width: 20, height: 20 };
  }

  function intersectRect(r1, r2) {
    return !(
      r2.x > r1.x + r1.w ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.h ||
      r2.y + r2.height < r1.y
    );
  }

  function setObjPos(obj, newX, newY) {
    const b = getObjBounds(obj);
    const dx = newX - b.x;
    const dy = newY - b.y;
    moveObjDelta(obj, dx, dy);
  }

  function moveObjDelta(obj, dx, dy) {
    if (obj.type === 'sticky' || obj.type === 'image' || obj.type === 'rect') {
      obj.x = Math.round(obj.x + dx);
      obj.y = Math.round(obj.y + dy);
      if (obj.type === 'sticky' || obj.type === 'image') {
        const hEl = document.getElementById(`html_obj_${obj.id}`);
        if (hEl) {
          hEl.style.left = obj.x + 'px';
          hEl.style.top = obj.y + 'px';
        }
        const bEl = document.getElementById(`badge_obj_${obj.id}`);
        if (bEl) {
          bEl.style.left = obj.x + 'px';
          bEl.style.top = (obj.y - 20) + 'px';
        }
      } else {
        renderSvgElement(obj);
      }
    } else if (obj.type === 'circle') {
      obj.cx = Math.round(obj.cx + dx);
      obj.cy = Math.round(obj.cy + dy);
      renderSvgElement(obj);
    } else if (obj.type === 'arrow') {
      obj.x1 = Math.round(obj.x1 + dx);
      obj.y1 = Math.round(obj.y1 + dy);
      obj.x2 = Math.round(obj.x2 + dx);
      obj.y2 = Math.round(obj.y2 + dy);
      renderSvgElement(obj);
    } else if (obj.type === 'pen') {
      obj.d = translateSvgPath(obj.d, dx, dy);
      if (obj.points) {
        obj.points.forEach(p => {
          p.x = Math.round(p.x + dx);
          p.y = Math.round(p.y + dy);
        });
      }
      renderSvgElement(obj);
    }
  }

  // 更新懸浮選取工具列位置 (Item 5 & 9)
  function updateSelectionActionBar() {
    if (!els.selectionActionBar) return;
    const selectedIds = state.selectedObjIds || [];
    if (selectedIds.length === 0) {
      els.selectionActionBar.style.display = 'none';
      if (typeof updateTransformOverlay === 'function') updateTransformOverlay();
      return;
    }

    const objs = selectedIds.map(id => state.objects[id]).filter(Boolean);
    if (objs.length === 0) {
      els.selectionActionBar.style.display = 'none';
      if (typeof updateTransformOverlay === 'function') updateTransformOverlay();
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    objs.forEach(o => {
      const b = getObjBounds(o);
      if (b.x < minX) minX = b.x;
      if (b.y < minY) minY = b.y;
      if (b.x + b.width > maxX) maxX = b.x + b.width;
      if (b.y + b.height > maxY) maxY = b.y + b.height;
    });

    const midX = (minX + maxX) / 2;
    const singleObj = objs.length === 1 ? objs[0] : null;
    const topY = minY - (singleObj ? 32 : 0);
    const vpPos = worldToViewport(midX, topY);

    els.selectionActionBar.style.left = Math.round(vpPos.x) + 'px';
    els.selectionActionBar.style.top = Math.round(vpPos.y - 14) + 'px';
    els.selectionActionBar.style.display = 'flex';

    if (els.groupMultiAlign) {
      els.groupMultiAlign.style.display = objs.length > 1 ? 'inline-flex' : 'none';
    }

    // 更新轉正與重設裁切按鈕狀態
    if (els.btnResetRotation) {
      els.btnResetRotation.style.display = (singleObj && singleObj.rotation) ? 'inline-flex' : 'none';
    }
    if (els.btnResetCrop) {
      const c = singleObj && singleObj.type === 'image' && singleObj.crop;
      const hasCrop = c && ((c.top || 0) > 0 || (c.right || 0) > 0 || (c.bottom || 0) > 0 || (c.left || 0) > 0);
      els.btnResetCrop.style.display = hasCrop ? 'inline-flex' : 'none';
    }

    if (typeof updateTransformOverlay === 'function') {
      updateTransformOverlay();
    }
  }

  // 調整物件圖層順序 (Item 5)
  function reorderSelectedLayers(action) {
    if (!state.selectedObjIds || state.selectedObjIds.length === 0) return;
    const objs = state.selectedObjIds.map(id => state.objects[id]).filter(Boolean);
    if (objs.length === 0) return;

    const beforeList = objs.map(o => JSON.parse(JSON.stringify(o)));

    objs.forEach(obj => {
      if (!canModifyObject(obj)) return;
      const htmlEl = document.getElementById(`html_obj_${obj.id}`);
      const svgEl = document.getElementById(`svg_obj_${obj.id}`);
      const el = htmlEl || svgEl;
      if (!el || !el.parentElement) return;

      const parent = el.parentElement;
      if (action === 'front') {
        parent.appendChild(el);
      } else if (action === 'back') {
        parent.insertBefore(el, parent.firstChild);
      } else if (action === 'forward') {
        if (el.nextSibling) {
          parent.insertBefore(el.nextSibling, el);
        }
      } else if (action === 'backward') {
        if (el.previousSibling) {
          parent.insertBefore(el, el.previousSibling);
        }
      }

      const allChildren = Array.from(parent.children);
      obj.order = allChildren.indexOf(el);
      pushObjectUpdate(obj, beforeList.find(item => item.id === obj.id));
    });

    const afterList = objs.map(o => JSON.parse(JSON.stringify(o)));
    pushHistoryAction({ type: 'update', before: beforeList, after: afterList });

    flashToast(`已調整圖層順序`);
    updateSelectionActionBar();
  }

  // 多物件對齊 (Item 9)
  function alignSelectedObjects(alignType) {
    const selectedObjs = (state.selectedObjIds || [])
      .map(id => state.objects[id])
      .filter(o => o && canModifyObject(o));

    if (selectedObjs.length < 2) {
      flashToast('請至少框選 2 個物件以進行對齊');
      return;
    }

    const boxes = selectedObjs.map(o => ({ obj: o, ...getObjBounds(o) }));
    const beforeList = boxes.map(b => JSON.parse(JSON.stringify(b.obj)));
    const minX = Math.min(...boxes.map(b => b.x));
    const maxX = Math.max(...boxes.map(b => b.x + b.width));
    const minY = Math.min(...boxes.map(b => b.y));
    const maxY = Math.max(...boxes.map(b => b.y + b.height));

    boxes.forEach(b => {
      let targetX = b.x;
      let targetY = b.y;
      if (alignType === 'left') targetX = minX;
      else if (alignType === 'center') targetX = minX + (maxX - minX) / 2 - b.width / 2;
      else if (alignType === 'right') targetX = maxX - b.width;
      else if (alignType === 'top') targetY = minY;
      else if (alignType === 'middle') targetY = minY + (maxY - minY) / 2 - b.height / 2;
      else if (alignType === 'bottom') targetY = maxY - b.height;

      setObjPos(b.obj, targetX, targetY);
      pushObjectUpdate(b.obj, beforeList.find(item => item.id === b.obj.id));
    });

    const afterList = boxes.map(b => JSON.parse(JSON.stringify(b.obj)));
    pushHistoryAction({ type: 'update', before: beforeList, after: afterList });

    updateSelectionActionBar();
    flashToast('已完成物件對齊');
  }

  // 多物件平均分配間距 (Item 9)
  function distributeSelectedObjects(direction) {
    const selectedObjs = (state.selectedObjIds || [])
      .map(id => state.objects[id])
      .filter(o => o && canModifyObject(o));

    if (selectedObjs.length < 3) {
      flashToast('平均分配間距需要至少框選 3 個物件');
      return;
    }

    const boxes = selectedObjs.map(o => ({ obj: o, ...getObjBounds(o) }));
    const beforeList = boxes.map(b => JSON.parse(JSON.stringify(b.obj)));

    if (direction === 'h') {
      boxes.sort((a, b) => a.x - b.x);
      const first = boxes[0];
      const last = boxes[boxes.length - 1];
      const totalSpan = (last.x + last.width) - first.x;
      const totalWidths = boxes.reduce((acc, b) => acc + b.width, 0);
      const totalGap = totalSpan - totalWidths;
      const gap = totalGap / (boxes.length - 1);

      let curX = first.x + first.width + gap;
      for (let i = 1; i < boxes.length - 1; i++) {
        setObjPos(boxes[i].obj, curX, boxes[i].y);
        pushObjectUpdate(boxes[i].obj, beforeList.find(item => item.id === boxes[i].obj.id));
        curX += boxes[i].width + gap;
      }
      flashToast('已完成水平均分間距');
    } else {
      boxes.sort((a, b) => a.y - b.y);
      const first = boxes[0];
      const last = boxes[boxes.length - 1];
      const totalSpan = (last.y + last.height) - first.y;
      const totalHeights = boxes.reduce((acc, b) => acc + b.height, 0);
      const totalGap = totalSpan - totalHeights;
      const gap = totalGap / (boxes.length - 1);

      let curY = first.y + first.height + gap;
      for (let i = 1; i < boxes.length - 1; i++) {
        setObjPos(boxes[i].obj, boxes[i].x, curY);
        pushObjectUpdate(boxes[i].obj, beforeList.find(item => item.id === boxes[i].obj.id));
        curY += boxes[i].height + gap;
      }
      flashToast('已完成垂直均分間距');
    }

    const afterList = boxes.map(b => JSON.parse(JSON.stringify(b.obj)));
    pushHistoryAction({ type: 'update', before: beforeList, after: afterList });

    updateSelectionActionBar();
  }

  // ===== 繪圖與手勢交互 (畫布事件，支援行動裝置雙指縮放與平移) =====
  let isPinching = false;
  let pinchStartDist = 0;
  let pinchStartZoom = 1;
  let pinchLastMid = { x: 0, y: 0 };

  function getTouchDistAndMid(t0, t1) {
    const dx = t1.clientX - t0.clientX;
    const dy = t1.clientY - t0.clientY;
    return {
      dist: Math.hypot(dx, dy) || 1,
      midX: (t0.clientX + t1.clientX) / 2,
      midY: (t0.clientY + t1.clientY) / 2
    };
  }

  els.canvasViewport.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length >= 2) {
      e.preventDefault();
      isPinching = true;
      state.isPanning = false;
      state.isMarqueeSelecting = false;
      if (els.selectionMarquee) els.selectionMarquee.style.display = 'none';

      // 若第一指剛觸碰瞬間觸發了未完成的短筆劃，取消該誤觸筆劃
      if (state.activeDrawing) {
        const tempId = state.activeDrawing.id;
        const pts = state.activeDrawing.points;
        if (!pts || pts.length <= 6) {
          delete state.objects[tempId];
          const el = document.getElementById('svg_' + tempId);
          if (el && el.parentNode) el.parentNode.removeChild(el);
        } else {
          pushObjectUpdate(state.activeDrawing);
        }
        state.activeDrawing = null;
      }

      const info = getTouchDistAndMid(e.touches[0], e.touches[1]);
      pinchStartDist = info.dist;
      pinchStartZoom = state.view.zoom;
      pinchLastMid = { x: info.midX, y: info.midY };
    }
  }, { passive: false });

  els.canvasViewport.addEventListener('touchmove', (e) => {
    if (isPinching && e.touches && e.touches.length >= 2) {
      e.preventDefault();
      const info = getTouchDistAndMid(e.touches[0], e.touches[1]);
      const dx = info.midX - pinchLastMid.x;
      const dy = info.midY - pinchLastMid.y;
      state.view.x += dx;
      state.view.y += dy;
      pinchLastMid = { x: info.midX, y: info.midY };

      const targetZoom = pinchStartZoom * (info.dist / pinchStartDist);
      zoomAt(targetZoom, info.midX, info.midY);
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (isPinching && (!e.touches || e.touches.length === 0)) {
      setTimeout(() => { isPinching = false; }, 60);
    }
  });
  window.addEventListener('touchcancel', () => {
    isPinching = false;
  });

  els.canvasViewport.addEventListener('pointerdown', (e) => {
    if (isPinching) return;
    // 抓手平移模式 (空白鍵、中鍵或手掌工具)
    if (state.currentTool === 'hand' || e.button === 1 || isSpacePressed) {
      state.isPanning = true;
      state.panStart = { x: e.clientX - state.view.x, y: e.clientY - state.view.y };
      els.canvasViewport.classList.remove('cursor-grab');
      els.canvasViewport.classList.add('cursor-grabbing');
      return;
    }

    // 檢查學生編輯權限
    if (state.currentTool !== 'select' && !isStudentAllowedToEdit()) {
      flashToast(state.isIndividuallyLocked ? '🚫 您目前已被老師限制編輯白板' : '🔒 老師目前設定白板為唯讀狀態');
      return;
    }

    const pos = screenToWorld(e.clientX, e.clientY);
    const objId = 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    // 1. 手繪畫筆 (Pen)
    if (state.currentTool === 'pen') {
      state.activeDrawing = {
        id: objId,
        type: 'pen',
        author: myName,
        authorId: myClientId,
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
        d: `M ${pos.x.toFixed(1)} ${pos.y.toFixed(1)}`,
        points: [pos]
      };
      state.objects[objId] = state.activeDrawing;
      renderSvgElement(state.activeDrawing);
    }
    // 2. 矩形 (Rect)
    else if (state.currentTool === 'rect') {
      state.activeDrawing = {
        id: objId,
        type: 'rect',
        author: myName,
        authorId: myClientId,
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
        x: pos.x,
        y: pos.y,
        width: 1,
        height: 1,
        startX: pos.x,
        startY: pos.y
      };
      state.objects[objId] = state.activeDrawing;
      renderSvgElement(state.activeDrawing);
    }
    // 3. 圓形 (Circle)
    else if (state.currentTool === 'circle') {
      state.activeDrawing = {
        id: objId,
        type: 'circle',
        author: myName,
        authorId: myClientId,
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
        cx: pos.x,
        cy: pos.y,
        rx: 1,
        ry: 1,
        startX: pos.x,
        startY: pos.y
      };
      state.objects[objId] = state.activeDrawing;
      renderSvgElement(state.activeDrawing);
    }
    // 4. 箭頭直線 (Arrow)
    else if (state.currentTool === 'arrow') {
      state.activeDrawing = {
        id: objId,
        type: 'arrow',
        author: myName,
        authorId: myClientId,
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
        x1: pos.x,
        y1: pos.y,
        x2: pos.x,
        y2: pos.y
      };
      state.objects[objId] = state.activeDrawing;
      renderSvgElement(state.activeDrawing);
    }
    // 5. 便利貼 (Sticky Note) - 點選直接插入
    else if (state.currentTool === 'sticky') {
      createStickyNote(pos.x, pos.y, '雙擊編輯文字...');
      setTool('select');
    }
    // 5b. 橡皮擦 (Eraser) - 點選或滑過即擦除物件 (含便利貼)
    else if (state.currentTool === 'eraser') {
      state.isErasing = true;
      eraseAtPoint(e.clientX, e.clientY);
    }
    // 6. 選取模式：拖曳框選多個物件 (Marquee Drag Selection) 或點擊空白處取消選取
    else if (state.currentTool === 'select') {
      const isCanvasBackground = (
        e.target === els.canvasViewport ||
        e.target === els.canvasWorld ||
        e.target === els.svgLayer ||
        e.target === els.htmlLayer
      );

      if (isCanvasBackground) {
        state.isMarqueeSelecting = true;
        state.marqueeStart = screenToWorld(e.clientX, e.clientY);
        if (!e.shiftKey && !e.ctrlKey) {
          deselectAll();
        }

        function onMarqueeMove(me) {
          if (!state.isMarqueeSelecting) return;
          const cur = screenToWorld(me.clientX, me.clientY);
          const minX = Math.min(state.marqueeStart.x, cur.x);
          const minY = Math.min(state.marqueeStart.y, cur.y);
          const w = Math.abs(cur.x - state.marqueeStart.x);
          const h = Math.abs(cur.y - state.marqueeStart.y);

          if (els.selectionMarquee) {
            els.selectionMarquee.style.left = minX + 'px';
            els.selectionMarquee.style.top = minY + 'px';
            els.selectionMarquee.style.width = w + 'px';
            els.selectionMarquee.style.height = h + 'px';
            els.selectionMarquee.style.display = 'block';
          }

          const box = { x: minX, y: minY, w, h };
          const newSelected = [];
          Object.values(state.objects).forEach(obj => {
            const ob = getObjBounds(obj);
            if (intersectRect(box, ob)) {
              newSelected.push(obj.id);
            }
          });
          state.selectedObjIds = newSelected;
          updateSelectionVisuals();
        }

        function onMarqueeUp() {
          state.isMarqueeSelecting = false;
          if (els.selectionMarquee) {
            els.selectionMarquee.style.display = 'none';
          }
          window.removeEventListener('pointermove', onMarqueeMove);
          window.removeEventListener('pointerup', onMarqueeUp);
          updateSelectionVisuals();
          updateSelectionActionBar();
        }

        window.addEventListener('pointermove', onMarqueeMove);
        window.addEventListener('pointerup', onMarqueeUp);
      }
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (isPinching) return;
    if (state.isPanning) {
      state.view.x = e.clientX - state.panStart.x;
      state.view.y = e.clientY - state.panStart.y;
      updateWorldTransform();
      return;
    }

    if (state.isErasing && state.currentTool === 'eraser') {
      eraseAtPoint(e.clientX, e.clientY);
      return;
    }

    if (!state.activeDrawing) return;
    const pos = screenToWorld(e.clientX, e.clientY);
    const d = state.activeDrawing;

    if (d.type === 'pen') {
      const lastPoint = d.points[d.points.length - 1];
      const minDistance = 0.75 / (state.view.zoom || 1);
      if (lastPoint && Math.hypot(pos.x - lastPoint.x, pos.y - lastPoint.y) < minDistance) return;
      d.points.push(pos);
      d.d += ` L ${pos.x.toFixed(1)} ${pos.y.toFixed(1)}`;
      renderSvgElement(d);
    } else if (d.type === 'rect') {
      d.x = Math.min(d.startX, pos.x);
      d.y = Math.min(d.startY, pos.y);
      d.width = Math.abs(pos.x - d.startX);
      d.height = Math.abs(pos.y - d.startY);
      renderSvgElement(d);
    } else if (d.type === 'circle') {
      d.cx = (d.startX + pos.x) / 2;
      d.cy = (d.startY + pos.y) / 2;
      d.rx = Math.abs(pos.x - d.startX) / 2;
      d.ry = Math.abs(pos.y - d.startY) / 2;
      renderSvgElement(d);
    } else if (d.type === 'arrow') {
      d.x2 = pos.x;
      d.y2 = pos.y;
      renderSvgElement(d);
    }
  });

  // 空白鍵平移畫布全域狀態 (Item 4)
  let isSpacePressed = false;

  window.addEventListener('pointerup', (event) => {
    if (state.isErasing) {
      state.isErasing = false;
    }
    if (state.isPanning) {
      state.isPanning = false;
      els.canvasViewport.classList.remove('cursor-grabbing');
      if (isSpacePressed || state.currentTool === 'hand') {
        els.canvasViewport.classList.add('cursor-grab');
      }
    }

    if (state.activeDrawing) {
      const finishedObj = state.activeDrawing;
      state.activeDrawing = null;
      if (finishedObj.type === 'pen' && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
        const finalPoint = screenToWorld(event.clientX, event.clientY);
        const lastPoint = finishedObj.points[finishedObj.points.length - 1];
        if (!lastPoint || Math.hypot(finalPoint.x - lastPoint.x, finalPoint.y - lastPoint.y) > 0.01) {
          finishedObj.points.push(finalPoint);
          finishedObj.d += ` L ${finalPoint.x.toFixed(1)} ${finalPoint.y.toFixed(1)}`;
          renderSvgElement(finishedObj);
        }
      }
      // 寫入 Firebase 同步
      pushObjectUpdate(finishedObj);
      pushHistoryAction({ type: 'create', objects: [JSON.parse(JSON.stringify(finishedObj))] });
    }
  });

  // 滾輪縮放 (平滑對準滑鼠游標)
  els.canvasViewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    zoomAt(state.view.zoom * zoomFactor, e.clientX, e.clientY);
  }, { passive: false });

  // 鍵盤空白鍵拖曳、Delete 刪除、Ctrl+Z/Y 還原重做監聽 (Item 1 & 4)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

    // Ctrl+Z / Ctrl+Y 還原與重做 (Item 1)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
      e.preventDefault();
      redo();
      return;
    }

    // 空白鍵按住準備拖曳 (Item 4)
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      if (!isSpacePressed) {
        isSpacePressed = true;
        els.canvasViewport.classList.add('cursor-grab');
      }
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (state.selectedObjIds && state.selectedObjIds.length > 0) {
        const toDelete = [...state.selectedObjIds];
        const deletedObjs = [];
        toDelete.forEach(id => {
          const obj = state.objects[id];
          if (obj && canModifyObject(obj)) {
            deletedObjs.push(JSON.parse(JSON.stringify(obj)));
            deleteObject(id);
          }
        });
        if (deletedObjs.length > 0) {
          pushHistoryAction({ type: 'delete', objects: deletedObjs });
        }
        deselectAll();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
      isSpacePressed = false;
      if (!state.isPanning) {
        els.canvasViewport.classList.remove('cursor-grab', 'cursor-grabbing');
        if (state.currentTool === 'select') els.canvasViewport.classList.add('cursor-select');
        else if (state.currentTool === 'hand') els.canvasViewport.classList.add('cursor-grab');
        else if (state.currentTool === 'eraser') els.canvasViewport.classList.add('cursor-eraser');
      }
    }
  });

  // ===== 剪貼簿整合 (Ctrl+V 支援圖片與文字便利貼) =====
  window.addEventListener('paste', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (!isStudentAllowedToEdit()) {
      flashToast(state.isIndividuallyLocked ? '🚫 您目前已被老師限制編輯白板' : '🔒 老師目前已關閉學生編輯權限');
      return;
    }

    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let foundImage = false;

    // 當前視角中心點
    const rect = els.canvasViewport.getBoundingClientRect();
    const center = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // 1. 剪貼簿是圖片 (自動前處理壓縮)
      if (item.type.indexOf('image') !== -1) {
        foundImage = true;
        const blob = item.getAsFile();
        compressWhiteboardImage(blob).then((compressedUrl) => {
          if (compressedUrl) {
            insertImageObject(compressedUrl, center.x - 150, center.y - 100);
          } else {
            flashToast('❌ 圖片轉換失敗，請使用支援的圖片格式。');
          }
        });
        break;
      }
    }

    // 2. 剪貼簿是純文字 -> 自動轉為黃色便利貼 (文字若有網址自動轉超連結)
    if (!foundImage) {
      const text = e.clipboardData.getData('text');
      if (text && text.trim()) {
        createStickyNote(center.x - 100, center.y - 70, text.trim());
      }
    }
  });

  function createStickyNote(x, y, text) {
    const objId = 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const stickyObj = {
      id: objId,
      type: 'sticky',
      author: myName,
      authorId: myClientId,
      x: Math.round(x),
      y: Math.round(y),
      width: 210,
      height: 140,
      text: text,
      bg: '#fef08a'
    };
    state.objects[objId] = stickyObj;
    renderStickyNoteDOM(stickyObj);
    pushObjectUpdate(stickyObj);
    pushHistoryAction({ type: 'create', objects: [JSON.parse(JSON.stringify(stickyObj))] });
  }

  // 前端自動壓縮白板貼圖 (防止未壓縮超大相片塞爆 Firebase 資料庫)
  function compressWhiteboardImage(fileOrBlob) {
    return new Promise((resolve) => {
      if (!fileOrBlob) return resolve(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawUrl = event.target.result;
        const img = new Image();
        img.onload = () => {
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;
          const maxWidth = 600;
          if (w > maxWidth) {
            h = Math.max(1, Math.round(h * maxWidth / w));
            w = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          // 全面改用 WebP 格式（原生支援透明度且體積縮減 70%~85%，約 50KB~150KB）
          const finalUrl = canvas.toDataURL('image/webp', 0.82);
          resolve(finalUrl.startsWith('data:image/webp') ? finalUrl : null);
        };
        img.onerror = () => resolve(null);
        img.src = rawUrl;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(fileOrBlob);
    });
  }

  function insertImageObject(src, x, y, width, height, title) {
    const img = new Image();
    img.onload = () => {
      const w = width || Math.min(480, img.naturalWidth || 320);
      const h = height || (img.naturalHeight ? Math.round(w * (img.naturalHeight / img.naturalWidth)) : 220);
      const objId = 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const imgObj = {
        id: objId,
        type: 'image',
        author: myName,
        authorId: myClientId,
        title: title || '貼圖',
        x: Math.round(x),
        y: Math.round(y),
        width: w,
        height: h,
        src: src
      };
      state.objects[objId] = imgObj;
      renderImageDOM(imgObj);
      pushObjectUpdate(imgObj);
      pushHistoryAction({ type: 'create', objects: [JSON.parse(JSON.stringify(imgObj))] });
    };
    img.src = src;
  }

  // 網址文字自動轉超連結
  function formatTextWithLinks(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const escaped = escapeHtml(text);
    return escaped.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }

  // ===== PDF 頁面解析與選取插入 (圖 2) =====
  let currentPdfDoc = null;
  let selectedPdfPages = new Set();

  let wasFullscreenBeforeFile = false;
  function trackFullscreenBeforeFile() {
    wasFullscreenBeforeFile = Boolean(document.fullscreenElement);
  }
  function tryRestoreFullscreen() {
    if (wasFullscreenBeforeFile && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  els.btnInsertPdf.onclick = () => {
    if (!isStudentAllowedToEdit()) {
      flashToast(state.isIndividuallyLocked ? '🚫 您目前已被老師限制編輯白板' : '🔒 老師目前已關閉學生編輯權限');
      return;
    }
    trackFullscreenBeforeFile();
    els.pdfFileInput.click();
  };

  els.pdfFileInput.onchange = async (e) => {
    tryRestoreFullscreen();
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!window.pdfjsLib) {
      flashToast('⏳ PDF 解析元件載入中，請稍候重試！');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      currentPdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      openPdfSelectModal();
    } catch (err) {
      console.error('Failed to parse PDF:', err);
      flashToast('❌ 解析 PDF 檔案失敗，請確認檔案格式是否正確。');
    }
  };

  async function openPdfSelectModal() {
    if (!currentPdfDoc) return;
    const numPages = currentPdfDoc.numPages;
    els.pdfTotalPages.textContent = numPages;
    els.pdfThumbnailGrid.innerHTML = '';
    els.pdfResolution.value = '600';
    els.pdfCustomWidth.value = '600';
    els.pdfCustomWidthWrap.hidden = true;
    els.pdfResolution.onchange = () => { els.pdfCustomWidthWrap.hidden = els.pdfResolution.value !== 'custom'; };
    selectedPdfPages.clear();

    // 預設全選
    for (let i = 1; i <= numPages; i++) selectedPdfPages.add(i);
    updatePdfSelectedCountBadge();

    els.pdfModal.classList.add('open');

    // 渲染各頁縮圖卡片
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await currentPdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.28 });

      const card = document.createElement('div');
      card.className = 'pdf-page-card selected';
      card.dataset.page = pageNum;

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      card.innerHTML = `
        <div class="page-index-badge">${pageNum}</div>
        <div class="page-check-badge">✓</div>
      `;
      card.appendChild(canvas);

      card.onclick = () => {
        if (selectedPdfPages.has(pageNum)) {
          selectedPdfPages.delete(pageNum);
          card.classList.remove('selected');
        } else {
          selectedPdfPages.add(pageNum);
          card.classList.add('selected');
        }
        updatePdfSelectedCountBadge();
      };

      els.pdfThumbnailGrid.appendChild(card);
    }
  }

  function updatePdfSelectedCountBadge() {
    els.pdfSelectedBadge.textContent = `已選 ${selectedPdfPages.size} 頁`;
    els.pdfSelectAll.checked = (selectedPdfPages.size === (currentPdfDoc ? currentPdfDoc.numPages : 0));
  }

  els.pdfSelectAll.onchange = () => {
    const isChecked = els.pdfSelectAll.checked;
    const cards = els.pdfThumbnailGrid.querySelectorAll('.pdf-page-card');
    selectedPdfPages.clear();
    cards.forEach(card => {
      const pageNum = parseInt(card.dataset.page, 10);
      if (isChecked) {
        selectedPdfPages.add(pageNum);
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
    updatePdfSelectedCountBadge();
  };

  els.btnClosePdfModal.onclick = closePdfModal;
  els.btnCancelPdf.onclick = closePdfModal;

  function closePdfModal() {
    els.pdfModal.classList.remove('open');
    els.pdfFileInput.value = '';
    tryRestoreFullscreen();
  }

  // 確認插入選取的 PDF 頁面 (自動計算網格排版，絕不重疊)
  els.btnConfirmInsertPdf.onclick = async () => {
    if (!currentPdfDoc || selectedPdfPages.size === 0) {
      flashToast('⚠️ 請至少勾選一頁要插入的 PDF！');
      return;
    }
    const resolutionOptions = [500, 600, 800, 1000, 1200, 1920];
    const isCustom = els.pdfResolution.value === 'custom';
    const requestedWidth = Number(isCustom ? els.pdfCustomWidth.value : els.pdfResolution.value);
    if (!Number.isInteger(requestedWidth) || (isCustom ? requestedWidth < 100 || requestedWidth > 4096 : !resolutionOptions.includes(requestedWidth))) {
      flashToast('⚠️ 圖片寬度請輸入 100～4096 的整數像素。');
      return;
    }
    tryRestoreFullscreen();

    const imageWidth = requestedWidth;
    const pagesToInsert = Array.from(selectedPdfPages).sort((a, b) => a - b);
    closePdfModal();
    flashToast(`正在插入 ${pagesToInsert.length} 頁 PDF...`);

    // 計算視角中心或整齊起點
    const rect = els.canvasViewport.getBoundingClientRect();
    const center = screenToWorld(rect.left + 60, rect.top + 60);

    const cols = pagesToInsert.length <= 4 ? pagesToInsert.length : Math.ceil(Math.sqrt(pagesToInsert.length * 1.5));
    const cardWidth = 420;
    const gap = 35;

    for (let idx = 0; idx < pagesToInsert.length; idx++) {
      const pageNum = pagesToInsert[idx];
      const page = await currentPdfDoc.getPage(pageNum);
      const originalViewport = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: imageWidth / originalViewport.width }); // 保持頁面比例並使用選定寬度

      const canvas = document.createElement('canvas');
      canvas.width = imageWidth;
      canvas.height = Math.max(1, Math.round(viewport.height));
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      const dataUrl = canvas.toDataURL('image/webp', 0.82);

      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardHeight = Math.round(cardWidth * (viewport.height / viewport.width));

      const posX = center.x + col * (cardWidth + gap);
      const posY = center.y + row * (cardHeight + gap);

      insertImageObject(dataUrl, posX, posY, cardWidth, cardHeight, `PDF 第 ${pageNum} 頁`);
    }

    flashToast('✅ PDF 頁面已全部依序編排插入完成！');
  };

  // 插入本機圖片
  els.btnInsertImage.onclick = () => {
    if (!isStudentAllowedToEdit()) {
      flashToast(state.isIndividuallyLocked ? '🚫 您目前已被老師限制編輯白板' : '🔒 老師目前已關閉學生編輯權限');
      return;
    }
    trackFullscreenBeforeFile();
    els.imageFileInput.click();
  };

  els.imageFileInput.onchange = (e) => {
    tryRestoreFullscreen();
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const rect = els.canvasViewport.getBoundingClientRect();
    const center = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
    compressWhiteboardImage(file).then((compressedUrl) => {
      if (compressedUrl) {
        insertImageObject(compressedUrl, center.x - 160, center.y - 110, 320, undefined, file.name);
      } else {
        flashToast('❌ 圖片轉換失敗，請使用支援的圖片格式。');
      }
    });
    els.imageFileInput.value = '';
  };

  // ===== 資料同步推播 =====
  function pushObjectUpdate(obj, before) {
    if (!objectsRef) return;
    const ref = objectsRef.child(obj.id);
    if (!before) {
      ref.set(obj).catch(err => console.error('Firebase object sync error:', err));
      return;
    }
    const changes = {};
    const keys = new Set([...Object.keys(before), ...Object.keys(obj)]);
    keys.forEach(key => {
      if (before[key] !== obj[key] && JSON.stringify(before[key]) !== JSON.stringify(obj[key])) {
        changes[key] = obj[key] === undefined ? null : obj[key];
      }
    });
    if (Object.keys(changes).length) {
      ref.update(changes).catch(err => console.error('Firebase object sync error:', err));
    }
  }

  function deleteObject(id) {
    if (!objectsRef) {
      delete state.objects[id];
      removeObjectDOM(id);
      return;
    }
    objectsRef.child(id).remove().catch(err => console.error(err));
  }

  // ===== 老師權限開關點擊事件 =====
  if (els.btnToggleStudentEdit) {
    els.btnToggleStudentEdit.onclick = () => {
      if (!isTeacherUser()) return;
      state.settings.studentCanEdit = !state.settings.studentCanEdit;
      applySettingsUI();
      if (roomRef) roomRef.child('settings').update({ studentCanEdit: state.settings.studentCanEdit });
    };
  }

  if (els.btnToggleMoveOthers) {
    els.btnToggleMoveOthers.onclick = () => {
      if (!isTeacherUser()) return;
      state.settings.canMoveOthers = !state.settings.canMoveOthers;
      applySettingsUI();
      if (roomRef) roomRef.child('settings').update({ canMoveOthers: state.settings.canMoveOthers });
    };
  }

  if (els.btnFollowMode) {
    els.btnFollowMode.onclick = () => {
      if (!isTeacherUser()) return;
      state.settings.followTeacher = !state.settings.followTeacher;
      applySettingsUI();
      if (roomRef) {
        const updatePayload = { followTeacher: state.settings.followTeacher };
        if (state.settings.followTeacher) {
          updatePayload.activeCanvasId = state.activeCanvasId;
          updatePayload.activePageId = state.activePageId;
        }
        roomRef.child('settings').update(updatePayload);
      }
      flashToast(state.settings.followTeacher ? '👥 已開啟全班跟隨模式（同學畫面將強制跟隨老師畫布與頁面）' : '🔓 已切換為同學自由瀏覽模式');
    };
  }

  if (els.btnSummonAll) {
    els.btnSummonAll.onclick = () => {
      if (!isTeacherUser()) return;
      if (roomRef) {
        roomRef.child('summon').set({
          canvasId: state.activeCanvasId,
          pageId: state.activePageId,
          ts: firebase.database.ServerValue.TIMESTAMP
        });
        flashToast('📢 已發送廣播，正在將全班召集至當前頁面！');
      }
    };
  }

  // 作者姓名標籤開關
  if (els.btnToggleAuthorBadge) {
    els.btnToggleAuthorBadge.onclick = () => {
      state.showAuthorBadge = !state.showAuthorBadge;
      applySettingsUI();
      if (isTeacherUser() && roomRef) {
        roomRef.child('settings').update({ showAuthorBadge: state.showAuthorBadge });
      }
    };
  }

  // ===== 選取操作與圖層、對齊按鈕綁定 (Item 5 & Item 9) =====
  if (els.btnLayerFront) els.btnLayerFront.onclick = () => reorderSelectedLayers('front');
  if (els.btnLayerForward) els.btnLayerForward.onclick = () => reorderSelectedLayers('forward');
  if (els.btnLayerBackward) els.btnLayerBackward.onclick = () => reorderSelectedLayers('backward');
  if (els.btnLayerBack) els.btnLayerBack.onclick = () => reorderSelectedLayers('back');

  if (els.btnAlignLeft) els.btnAlignLeft.onclick = () => alignSelectedObjects('left');
  if (els.btnAlignCenter) els.btnAlignCenter.onclick = () => alignSelectedObjects('center');
  if (els.btnAlignRight) els.btnAlignRight.onclick = () => alignSelectedObjects('right');
  if (els.btnAlignTop) els.btnAlignTop.onclick = () => alignSelectedObjects('top');
  if (els.btnAlignMiddle) els.btnAlignMiddle.onclick = () => alignSelectedObjects('middle');
  if (els.btnAlignBottom) els.btnAlignBottom.onclick = () => alignSelectedObjects('bottom');

  if (els.btnDistributeH) els.btnDistributeH.onclick = () => distributeSelectedObjects('h');
  if (els.btnDistributeV) els.btnDistributeV.onclick = () => distributeSelectedObjects('v');

  if (els.btnActionDelete) {
    els.btnActionDelete.onclick = () => {
      if (!state.selectedObjIds || state.selectedObjIds.length === 0) return;
      const toDelete = [...state.selectedObjIds];
      const deletedObjs = [];
      toDelete.forEach(id => {
        const obj = state.objects[id];
        if (obj && canModifyObject(obj)) {
          deletedObjs.push(JSON.parse(JSON.stringify(obj)));
          deleteObject(id);
        }
      });
      if (deletedObjs.length > 0) {
        pushHistoryAction({ type: 'delete', objects: deletedObjs });
      }
      deselectAll();
      flashToast('🗑️ 已刪除選取物件');
    };
  }

  // 學生增減畫布與分頁權限按鈕 (Item 7, 如圖 6)
  if (els.btnToggleStudentPages) {
    els.btnToggleStudentPages.onclick = () => {
      if (!isTeacherUser()) return;
      state.settings.studentCanManagePages = !state.settings.studentCanManagePages;
      applySettingsUI();
      renderCanvasSelector();
      renderPagesTabs();
      if (roomRef) roomRef.child('settings').update({ studentCanManagePages: state.settings.studentCanManagePages });
    };
  }

  // 還原與重做按鈕點擊綁定 (Item 1)
  if (els.btnUndo) els.btnUndo.onclick = undo;
  if (els.btnRedo) els.btnRedo.onclick = redo;

  // 學生個別鎖定彈窗事件綁定 (Item 8)
  if (els.btnCloseStudentLockModal) els.btnCloseStudentLockModal.onclick = closeStudentLockModal;
  if (els.btnCancelStudentLockModal) els.btnCancelStudentLockModal.onclick = closeStudentLockModal;
  document.querySelectorAll('.btn-lock-time').forEach(btn => {
    btn.onclick = () => {
      if (!isTeacherUser() || !currentLockTarget) return;
      const durSec = parseInt(btn.dataset.duration, 10);
      const until = durSec === -1 ? -1 : Date.now() + durSec * 1000;
      const key = (currentLockTarget.uid || currentLockTarget.name).replace(/[.$#\[\]\/]/g, '_');
      const safeName = currentLockTarget.name.replace(/[.$#\[\]\/]/g, '_');

      const lockObj = {
        name: currentLockTarget.name,
        uid: currentLockTarget.uid || '',
        until: until,
        lockedAt: Date.now()
      };

      state.lockedStudents = state.lockedStudents || {};
      state.lockedStudents[key] = lockObj;
      if (safeName) state.lockedStudents[safeName] = lockObj;

      if (roomRef) {
        const updates = {};
        updates[key] = lockObj;
        if (safeName && safeName !== key) updates[safeName] = lockObj;
        roomRef.child('lockedStudents').update(updates).then(() => {
          flashToast(`🔒 已鎖定 ${currentLockTarget.name} 的編輯權限 (${btn.textContent.trim()})`);
          closeStudentLockModal();
          renderParticipantsList();
        }).catch(err => {
          console.error(err);
          flashToast('鎖定更新出錯：' + err.message);
          closeStudentLockModal();
        });
      } else {
        flashToast(`🔒 已鎖定 ${currentLockTarget.name} 的編輯權限 (${btn.textContent.trim()})`);
        closeStudentLockModal();
        renderParticipantsList();
      }
    };
  });
  if (els.btnUnlockStudentDirect) {
    els.btnUnlockStudentDirect.onclick = () => {
      if (!isTeacherUser() || !currentLockTarget) return;
      unlockStudent(currentLockTarget.uid || currentLockTarget.name, currentLockTarget.name);
      closeStudentLockModal();
    };
  }

  // 新增畫布 (全螢幕友好，避免原生 prompt 中斷全螢幕)
  els.btnAddCanvas.onclick = () => {
    if (!canManagePages()) {
      flashToast('⚠️ 老師未開放學生增減畫布與頁數');
      return;
    }
    const defaultName = `畫布 ${Object.keys(state.canvases).length + 1}`;
    showWhiteboardPrompt('➕ 新增畫布', '請輸入新畫布名稱：', defaultName, (name) => {
      if (!name || !name.trim()) return;
      const newId = 'canvas_' + Date.now().toString(36);
      state.canvases[newId] = { id: newId, name: name.trim(), pages: ['page_1'] };
      renderCanvasSelector();
      if (roomRef) roomRef.child('canvases').set(state.canvases);
      switchCanvasAndPage(newId, 'page_1', true);
      flashToast(`✅ 已新增畫布「${name.trim()}」`);
    });
  };

  // 重新命名目前畫布 (全螢幕友好)
  if (els.btnRenameCanvas) {
    els.btnRenameCanvas.onclick = () => {
      if (!canManagePages()) {
        flashToast('⚠️ 老師未開放學生修改畫布名稱');
        return;
      }
      const cur = state.canvases[state.activeCanvasId];
      const curName = (cur && cur.name) || state.activeCanvasId;
      showWhiteboardPrompt('✏️ 重新命名畫布', '請輸入新的畫布名稱：', curName, (newName) => {
        if (!newName || !newName.trim()) return;
        const trimmed = newName.trim();
        if (cur) {
          cur.name = trimmed;
          state.canvases[state.activeCanvasId] = cur;
          renderCanvasSelector();
          if (roomRef) {
            roomRef.child('canvases').child(state.activeCanvasId).child('name').set(trimmed);
          }
          flashToast(`✅ 畫布名稱已更新為「${trimmed}」`);
        }
      });
    };
  }

  // 刪除目前畫布 (Item 2，全螢幕友好)
  if (els.btnDeleteCanvas) {
    els.btnDeleteCanvas.onclick = () => {
      if (!canManagePages()) {
        flashToast('⚠️ 老師未開放學生增減畫布與頁數');
        return;
      }
      const canvasIds = Object.keys(state.canvases);
      if (canvasIds.length <= 1) {
        flashToast('至少需保留 1 個主畫布，無法刪除！');
        return;
      }
      const cur = state.canvases[state.activeCanvasId];
      const curName = (cur && cur.name) || state.activeCanvasId;
      showWhiteboardConfirm('🗑️ 刪除畫布', `確定要刪除畫布「${curName}」及其包含的所有分頁嗎？此操作無法還原。`, () => {
        // 清除資料庫中該畫布的所有頁面
        if (roomRef && cur && cur.pages) {
          cur.pages.forEach(pId => {
            roomRef.child('pages').child(`${state.activeCanvasId}_${pId}`).remove();
          });
        }

        delete state.canvases[state.activeCanvasId];
        const remainingIds = Object.keys(state.canvases);
        const nextCanvasId = remainingIds[0];
        const nextCanvas = state.canvases[nextCanvasId];
        const nextPageId = (nextCanvas && nextCanvas.pages && nextCanvas.pages[0]) || 'page_1';

        if (roomRef) roomRef.child('canvases').set(state.canvases);
        flashToast(`已刪除畫布「${curName}」`);
        switchCanvasAndPage(nextCanvasId, nextPageId, true);
      });
    };
  }

  // 下拉選單切換畫布
  els.canvasSelect.onchange = () => {
    const cId = els.canvasSelect.value;
    const cur = state.canvases[cId];
    const targetPage = (cur && cur.pages && cur.pages[0]) || 'page_1';
    switchCanvasAndPage(cId, targetPage, true);
  };

  // 新增頁面
  els.btnAddPage.onclick = () => {
    if (!canManagePages()) {
      flashToast('⚠️ 老師未開放學生增減畫布與頁數');
      return;
    }
    const cur = state.canvases[state.activeCanvasId] || { pages: ['page_1'] };
    const newPageId = 'page_' + (cur.pages.length + 1);
    cur.pages.push(newPageId);
    state.canvases[state.activeCanvasId] = cur;
    renderPagesTabs();
    if (roomRef) roomRef.child('canvases').set(state.canvases);
    switchCanvasAndPage(state.activeCanvasId, newPageId, true);
  };

  // 縮放按鈕
  els.btnZoomIn.onclick = () => zoomAt(state.view.zoom * 1.2);
  els.btnZoomOut.onclick = () => zoomAt(state.view.zoom * 0.8);
  els.btnZoomReset.onclick = zoomToFitAllObjects; // 如圖 4：讓畫布所有物件完全顯示在畫面中
  els.zoomVal.onclick = resetView;

  // 清空或結束白板 (全螢幕友好)
  els.btnTrashCanvas.onclick = clearCurrentPage;
  els.btnClearOrEnd.onclick = () => {
    if (!isTeacherUser()) return;
    showWhiteboardConfirm('💥 結束白板', '確定要結束並清空白板當前畫布所有頁面內容嗎？', () => {
      if (roomRef) {
        roomRef.child('pages').remove();
        flashToast('💥 白板內容已全部重設清空');
      }
    });
  };

  function clearCurrentPage() {
    if (!canManagePages()) {
      flashToast('🔒 目前設定為「僅老師管頁面」，學生無法清空白板');
      return;
    }
    if (!isTeacherUser() && !state.settings.studentCanEdit) {
      flashToast('🔒 目前白板為唯讀狀態，無法清空白板');
      return;
    }
    if (!isTeacherUser() && state.isIndividuallyLocked) {
      flashToast('🔒 您目前已被老師個別限制編輯白板');
      return;
    }
    showWhiteboardConfirm('🗑️ 清空當前頁面', '確定要清空當前頁面的所有內容嗎？', () => {
      if (objectsRef) objectsRef.remove();
      state.objects = {};
      els.svgLayer.innerHTML = '';
      els.htmlLayer.innerHTML = '';
      flashToast('🗑️ 當前頁面已清空');
    });
  }

  // 工具按鈕點選綁定
  els.floatingToolbar.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
    btn.onclick = () => setTool(btn.dataset.tool);
  });

  // 顏色選取盤快選
  els.colorCurrentDot.onclick = () => {
    const isVisible = els.colorPalette.style.display === 'grid';
    els.colorPalette.style.display = isVisible ? 'none' : 'grid';
  };

  els.colorPalette.querySelectorAll('.color-swatch').forEach(sw => {
    sw.onclick = () => {
      const color = sw.dataset.color;
      state.currentColor = color;
      els.colorCurrentDot.style.background = color;
      els.colorPalette.style.display = 'none';
    };
  });

  els.strokeSizeSelect.onchange = () => {
    state.currentStrokeWidth = parseInt(els.strokeSizeSelect.value, 10) || 4;
  };

  // 右側抽屜展開/收合
  els.btnToggleDrawer.onclick = () => {
    els.participantsDrawer.classList.toggle('open');
  };

  // 全螢幕切換與按鈕文字同步 (⛶ 全螢幕 <-> 🗗 恢復為視窗)
  els.btnFullscreen.onclick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      wasFullscreenBeforeFile = false;
      document.exitFullscreen().catch(() => {});
    }
  };

  function updateWhiteboardFullscreenButtonUI() {
    if (!els.btnFullscreen) return;
    const isFs = Boolean(document.fullscreenElement);
    const span = els.btnFullscreen.querySelector('span');
    if (span) {
      span.textContent = isFs ? '🗗 恢復為視窗' : '⛶ 全螢幕';
    } else {
      els.btnFullscreen.textContent = isFs ? '🗗 恢復為視窗' : '⛶ 全螢幕';
    }
    if (isFs) {
      els.btnFullscreen.classList.add('is-fullscreen-active');
      els.btnFullscreen.title = '點擊結束全螢幕，恢復為一般視窗 (或按 Esc)';
    } else {
      els.btnFullscreen.classList.remove('is-fullscreen-active');
      els.btnFullscreen.title = '全螢幕切換';
    }
  }
  document.addEventListener('fullscreenchange', updateWhiteboardFullscreenButtonUI);
  document.addEventListener('webkitfullscreenchange', updateWhiteboardFullscreenButtonUI);

  // 當使用者在全螢幕模式下開啟本機檔案選取器返回時，若全螢幕被瀏覽器退出，點擊畫面可平滑恢復全螢幕
  window.addEventListener('focus', () => {
    if (wasFullscreenBeforeFile && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        const onNextClick = () => {
          if (wasFullscreenBeforeFile && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
          window.removeEventListener('click', onNextClick, true);
        };
        window.addEventListener('click', onNextClick, { capture: true, once: true });
      });
    }
  });

  // 使用說明彈窗事件 (圖 2)
  if (els.btnHelpGuide && els.guideModal) {
    els.btnHelpGuide.onclick = () => els.guideModal.classList.add('open');
  }
  if (els.btnCloseGuideModal && els.guideModal) {
    els.btnCloseGuideModal.onclick = () => els.guideModal.classList.remove('open');
  }
  if (els.btnConfirmGuide && els.guideModal) {
    els.btnConfirmGuide.onclick = () => els.guideModal.classList.remove('open');
  }

  // 關閉白板按鈕 (若存在時綁定)
  if (els.btnCloseWhiteboard) {
    els.btnCloseWhiteboard.onclick = () => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'CLOSE_WHITEBOARD' }, '*');
      } else {
        window.history.back();
      }
    };
  }

  // ===== 右下角縮放與白板小地圖導航 (Item 5, 如圖 4) =====
  let minimapExpanded = false;

  function toggleMinimap(force) {
    minimapExpanded = force !== undefined ? force : !minimapExpanded;
    if (els.minimapBody) {
      els.minimapBody.style.display = minimapExpanded ? 'block' : 'none';
    }
    if (els.btnToggleMinimap) {
      els.btnToggleMinimap.classList.toggle('expanded', minimapExpanded);
    }
    if (minimapExpanded) {
      renderMinimap();
    }
  }

  function renderMinimap() {
    if (!minimapExpanded || !els.minimapCanvas) return;
    const canvas = els.minimapCanvas;
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;

    const themeBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || '#f8fafc';
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = themeBg;
    ctx.fillRect(0, 0, cw, ch);

    const objs = Object.values(state.objects || {});
    const vpRect = els.canvasViewport.getBoundingClientRect();
    const vpWorldTL = screenToWorld(vpRect.left, vpRect.top);
    const vpWorldBR = screenToWorld(vpRect.right, vpRect.bottom);

    let minX = vpWorldTL.x;
    let minY = vpWorldTL.y;
    let maxX = vpWorldBR.x;
    let maxY = vpWorldBR.y;

    objs.forEach(o => {
      const b = getObjBounds(o);
      if (b.x < minX) minX = b.x;
      if (b.y < minY) minY = b.y;
      if (b.x + b.width > maxX) maxX = b.x + b.width;
      if (b.y + b.height > maxY) maxY = b.y + b.height;
    });

    const pad = 200;
    minX -= pad;
    minY -= pad;
    maxX += pad;
    maxY += pad;

    const spanW = Math.max(200, maxX - minX);
    const spanH = Math.max(150, maxY - minY);
    const scale = Math.min(cw / spanW, ch / spanH);

    const toMiniX = (wx) => (wx - minX) * scale;
    const toMiniY = (wy) => (wy - minY) * scale;

    objs.forEach(o => {
      const b = getObjBounds(o);
      const mx = toMiniX(b.x);
      const my = toMiniY(b.y);
      const mw = Math.max(2, b.width * scale);
      const mh = Math.max(2, b.height * scale);

      if (o.type === 'sticky') {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(mx, my, mw, mh);
      } else if (o.type === 'image') {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(mx, my, mw, mh);
      } else {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(mx, my, mw, mh);
      }
    });

    const vmx = toMiniX(vpWorldTL.x);
    const vmy = toMiniY(vpWorldTL.y);
    const vmw = (vpWorldBR.x - vpWorldTL.x) * scale;
    const vmh = (vpWorldBR.y - vpWorldTL.y) * scale;

    if (els.minimapViewportRect) {
      els.minimapViewportRect.style.left = Math.round(vmx) + 'px';
      els.minimapViewportRect.style.top = Math.round(vmy) + 'px';
      els.minimapViewportRect.style.width = Math.round(vmw) + 'px';
      els.minimapViewportRect.style.height = Math.round(vmh) + 'px';
    }

    canvas._miniTransform = { minX, minY, scale };
  }

  function navigateByMinimap(e) {
    const canvas = els.minimapCanvas;
    if (!canvas || !canvas._miniTransform) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { minX, minY, scale } = canvas._miniTransform;
    const targetWorldX = minX + mx / scale;
    const targetWorldY = minY + my / scale;

    const vpRect = els.canvasViewport.getBoundingClientRect();
    state.view.x = vpRect.width / 2 - targetWorldX * state.view.zoom;
    state.view.y = vpRect.height / 2 - targetWorldY * state.view.zoom;
    updateWorldTransform();
  }

  if (els.btnToggleMinimap) {
    els.btnToggleMinimap.onclick = () => toggleMinimap();
  }

  if (els.minimapBody) {
    els.minimapBody.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      navigateByMinimap(e);
      function onMiniMove(me) {
        navigateByMinimap(me);
      }
      function onMiniUp() {
        window.removeEventListener('pointermove', onMiniMove);
        window.removeEventListener('pointerup', onMiniUp);
      }
      window.addEventListener('pointermove', onMiniMove);
      window.addEventListener('pointerup', onMiniUp);
    });
  }

  // ===== 匯出與備份選單彈窗事件 (Item 6, 如圖 5) =====
  if (els.btnExport && els.exportModal) {
    els.btnExport.onclick = () => els.exportModal.classList.add('open');
  }
  if (els.btnCloseExportModal && els.exportModal) {
    els.btnCloseExportModal.onclick = () => els.exportModal.classList.remove('open');
  }
  if (els.btnCancelExportModal && els.exportModal) {
    els.btnCancelExportModal.onclick = () => els.exportModal.classList.remove('open');
  }
  if (els.exportModal) {
    els.exportModal.addEventListener('click', (e) => {
      if (e.target === els.exportModal) {
        els.exportModal.classList.remove('open');
      }
    });
  }

  if (els.btnExportPdf) els.btnExportPdf.onclick = exportCanvasToPdf;
  if (els.btnExportPng) els.btnExportPng.onclick = exportCurrentPageToPng;
  if (els.btnExportZip) els.btnExportZip.onclick = exportCanvasToZip;
  if (els.btnExportFullZip) els.btnExportFullZip.onclick = exportFullWhiteboardToZip;
  if (els.btnExportJson) els.btnExportJson.onclick = exportCanvasToJson;

  // ===== 白板雲端歷程檔案庫事件 =====
  if (els.btnCloudArchive) {
    els.btnCloudArchive.onclick = openWhiteboardArchiveModal;
  }
  if (els.btnOpenCloudArchiveFromExport) {
    els.btnOpenCloudArchiveFromExport.onclick = () => {
      if (els.exportModal) els.exportModal.classList.remove('open');
      openWhiteboardArchiveModal();
    };
  }
  if (els.btnCloseWbArchiveModal) {
    els.btnCloseWbArchiveModal.onclick = closeWhiteboardArchiveModal;
  }
  if (els.whiteboardArchiveModal) {
    els.whiteboardArchiveModal.addEventListener('click', (e) => {
      if (e.target === els.whiteboardArchiveModal) {
        closeWhiteboardArchiveModal();
      }
    });
  }
  if (els.btnSaveCurrentWbToCloud) {
    els.btnSaveCurrentWbToCloud.onclick = saveCurrentWhiteboardToCloud;
  }
  if (els.btnArchiveExportJson) {
    els.btnArchiveExportJson.onclick = exportCanvasToJson;
  }
  if (els.btnArchiveImportJson && els.jsonFileInput) {
    els.btnArchiveImportJson.onclick = () => els.jsonFileInput.click();
  }
  if (els.btnRefreshWbArchives) {
    els.btnRefreshWbArchives.onclick = () => {
      fetchWhiteboardArchives(true);
    };
  }
  if (els.wbArchiveSearchInput) {
    els.wbArchiveSearchInput.oninput = (e) => {
      archiveSearchQuery = e.target.value;
      renderWhiteboardArchiveList();
    };
  }

  // 載入模式選擇對話框事件
  if (els.btnConfirmLoadEdit) {
    els.btnConfirmLoadEdit.onclick = () => {
      if (pendingLoadArchiveId) {
        const id = pendingLoadArchiveId;
        closeArchiveLoadChoice();
        loadWhiteboardArchive(id, 'edit');
      }
    };
  }
  if (els.btnConfirmLoadReadonly) {
    els.btnConfirmLoadReadonly.onclick = () => {
      if (pendingLoadArchiveId) {
        const id = pendingLoadArchiveId;
        closeArchiveLoadChoice();
        loadWhiteboardArchive(id, 'readonly');
      }
    };
  }
  if (els.btnCancelLoadChoice) els.btnCancelLoadChoice.onclick = closeArchiveLoadChoice;
  if (els.btnCloseWbLoadChoiceModal) els.btnCloseWbLoadChoiceModal.onclick = closeArchiveLoadChoice;
  if (els.wbArchiveLoadChoiceModal) {
    els.wbArchiveLoadChoiceModal.addEventListener('click', (e) => {
      if (e.target === els.wbArchiveLoadChoiceModal) {
        closeArchiveLoadChoice();
      }
    });
  }

  if (els.btnImportJson && els.jsonFileInput) {
    els.btnImportJson.onclick = () => els.jsonFileInput.click();
    els.jsonFileInput.onchange = async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        flashToast('正在讀取備份檔案...');
        let jsonStr = '';
        if (file.name.endsWith('.zip')) {
          const JSZip = window.JSZip;
          if (!JSZip) throw new Error('ZIP 解析庫未就緒');
          const zip = await JSZip.loadAsync(file);
          const dataFile = zip.file('whiteboard_data.json');
          if (!dataFile) throw new Error('ZIP 壓縮檔中未找到 whiteboard_data.json');
          jsonStr = await dataFile.async('text');
        } else {
          jsonStr = await file.text();
        }

        const data = JSON.parse(jsonStr);
        if (!data || !data.pages) throw new Error('無效的白板備份資料');

        if (data.scope === 'full-whiteboard') {
          if (!data.canvases || typeof data.canvases !== 'object' || Array.isArray(data.canvases) || !Object.keys(data.canvases).length || typeof data.pages !== 'object' || Array.isArray(data.pages)) throw new Error('完整白板備份格式不正確');
          els.jsonFileInput.value = '';
          showWhiteboardConfirm('📁 匯入完整白板', '這會取代目前白板的所有畫布與頁面。確定要繼續嗎？', async () => {
            try {
              if (!roomRef) throw new Error('資料庫未連線');
              await roomRef.update({ canvases: data.canvases, pages: data.pages });
              state.canvases = data.canvases;
              const targetCanvas = state.canvases[data.activeCanvasId] ? data.activeCanvasId : Object.keys(state.canvases)[0];
              const pageIds = state.canvases[targetCanvas].pages || ['page_1'];
              const targetPage = pageIds.includes(data.activePageId) ? data.activePageId : pageIds[0];
              switchCanvasAndPage(targetCanvas, targetPage, true);
              if (els.exportModal) els.exportModal.classList.remove('open');
              flashToast('✅ 完整白板備份已匯入！');
            } catch (error) { flashToast('❌ 匯入失敗：' + error.message); }
          });
          return;
        }
        const canvasName = (data.canvas && data.canvas.name) || '備份畫布';
        showWhiteboardConfirm('📁 匯入備份', `確定要匯入備份「${canvasName}」嗎？這將會更新目前畫布內容。`, () => {
          if (roomRef) {
            Object.keys(data.pages).forEach(pId => {
              const key = `${state.activeCanvasId}_${pId}`;
              roomRef.child('pages').child(key).set(data.pages[pId]);
            });
            if (data.canvas && data.canvas.pages) {
              const cur = state.canvases[state.activeCanvasId] || { id: state.activeCanvasId };
              cur.pages = data.canvas.pages;
              state.canvases[state.activeCanvasId] = cur;
              roomRef.child('canvases').set(state.canvases);
            }
          }
          flashToast('✅ 備份資料已成功匯入！');
          if (els.exportModal) els.exportModal.classList.remove('open');
          switchCanvasAndPage(state.activeCanvasId, state.activePageId, true);
        });
      } catch (err) {
        flashToast('❌ 匯入失敗：' + err.message);
      }
      els.jsonFileInput.value = '';
    };
  }

  // 1. 匯出多頁 PDF
  async function exportCanvasToPdf() {
    const curCanvas = state.canvases[state.activeCanvasId] || { name: '白板', pages: ['page_1'] };
    const pages = curCanvas.pages || ['page_1'];
    flashToast(`正在匯出多頁 PDF (${pages.length} 頁)...`);

    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      flashToast('⚠️ jsPDF 函式庫未載入，請確認網路連線');
      return;
    }

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });

    for (let i = 0; i < pages.length; i++) {
      const pId = pages[i];
      let pObjs = {};
      if (pId === state.activePageId) {
        pObjs = state.objects;
      } else if (roomRef) {
        try {
          const snap = await roomRef.child('pages').child(`${state.activeCanvasId}_${pId}`).child('objects').once('value');
          pObjs = snap.val() || {};
        } catch (e) {
          pObjs = {};
        }
      }

      const c = document.createElement('canvas');
      await renderPageToCanvas(c, pObjs, 1920, 1080);
      const dataUrl = c.toDataURL('image/jpeg', 0.9);
      if (i > 0) pdf.addPage([1920, 1080], 'landscape');
      pdf.addImage(dataUrl, 'JPEG', 0, 0, 1920, 1080);
    }

    pdf.save(`${curCanvas.name}_所有頁面.pdf`);
    flashToast('✅ PDF 已成功匯出！');
    if (els.exportModal) els.exportModal.classList.remove('open');
  }

  // 2. 匯出當前頁面高畫質 PNG
  async function exportCurrentPageToPng() {
    flashToast('正在生成當前頁面高畫質圖片...');
    const curCanvas = state.canvases[state.activeCanvasId] || { name: '白板' };
    const fileName = `${curCanvas.name}_${state.activePageId}_高畫質.png`;
    const exportCanvas = document.createElement('canvas');
    await renderPageToCanvas(exportCanvas, state.objects, 2400, 1500);
    downloadCanvasImage(exportCanvas, fileName);
    if (els.exportModal) els.exportModal.classList.remove('open');
  }

  // 3. 匯出 ZIP 壓縮包
  async function exportCanvasToZip() {
    flashToast('正在打包 ZIP 壓縮備份...');
    const JSZip = window.JSZip;
    if (!JSZip) {
      flashToast('⚠️ JSZip 函式庫未載入，請確認網路連線');
      return;
    }

    const curCanvas = state.canvases[state.activeCanvasId] || { name: '白板', pages: ['page_1'] };
    const pages = curCanvas.pages || ['page_1'];
    const zip = new JSZip();

    const allPagesData = {};
    for (let i = 0; i < pages.length; i++) {
      const pId = pages[i];
      if (pId === state.activePageId) {
        allPagesData[pId] = { objects: state.objects };
      } else if (roomRef) {
        try {
          const snap = await roomRef.child('pages').child(`${state.activeCanvasId}_${pId}`).once('value');
          allPagesData[pId] = snap.val() || { objects: {} };
        } catch (e) {
          allPagesData[pId] = { objects: {} };
        }
      }
    }

    const backupData = {
      app: '即時互動白板',
      version: '3.9.16',
      exportTime: new Date().toISOString(),
      canvasId: state.activeCanvasId,
      canvas: curCanvas,
      pages: allPagesData
    };

    zip.file('manifest.json', JSON.stringify({
      appName: '即時互動白板',
      canvasName: curCanvas.name,
      pageCount: pages.length,
      exportTime: backupData.exportTime
    }, null, 2));

    zip.file('whiteboard_data.json', JSON.stringify(backupData, null, 2));

    const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    const a = document.createElement('a');
    a.download = `${curCanvas.name}_備份.zip`;
    a.href = URL.createObjectURL(content);
    a.click();
    flashToast('✅ ZIP 壓縮備份檔已匯出！');
    if (els.exportModal) els.exportModal.classList.remove('open');
  }

  // 完整白板備份：讀取所有畫布與頁面，讀取失敗時不產生不完整備份。
  async function exportFullWhiteboardToZip() {
    if (!window.JSZip || !roomRef) { flashToast('⚠️ ZIP 元件或資料庫尚未就緒'); return; }
    try {
      flashToast('正在打包完整白板...');
      const canvases = state.canvases;
      const pages = {};
      for (const [canvasId, canvas] of Object.entries(canvases)) {
        for (const pageId of (canvas.pages || ['page_1'])) {
          const key = `${canvasId}_${pageId}`;
          const snap = await roomRef.child('pages').child(key).once('value');
          pages[key] = snap.val() || { objects: {} };
          if (canvasId === state.activeCanvasId && pageId === state.activePageId) {
            pages[key] = { ...pages[key], objects: state.objects };
          }
        }
      }
      const data = { app: '即時互動白板', version: '1.0', scope: 'full-whiteboard', exportTime: new Date().toISOString(), activeCanvasId: state.activeCanvasId, activePageId: state.activePageId, canvases, pages };
      const zip = new window.JSZip();
      zip.file('whiteboard_data.json', JSON.stringify(data));
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '完整白板_備份.zip';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      flashToast('✅ 完整白板 ZIP 備份已匯出！');
      if (els.exportModal) els.exportModal.classList.remove('open');
    } catch (error) { flashToast('❌ 匯出失敗：' + error.message); }
  }

  // 4. 匯出 JSON 備份檔
  async function exportCanvasToJson() {
    const curCanvas = state.canvases[state.activeCanvasId] || { name: '白板', pages: ['page_1'] };
    const pages = curCanvas.pages || ['page_1'];
    const allPagesData = {};
    for (let i = 0; i < pages.length; i++) {
      const pId = pages[i];
      if (pId === state.activePageId) {
        allPagesData[pId] = { objects: state.objects };
      } else if (roomRef) {
        try {
          const snap = await roomRef.child('pages').child(`${state.activeCanvasId}_${pId}`).once('value');
          allPagesData[pId] = snap.val() || { objects: {} };
        } catch (e) {
          allPagesData[pId] = { objects: {} };
        }
      }
    }

    const backupData = {
      app: '即時互動白板',
      version: '3.9.16',
      exportTime: new Date().toISOString(),
      canvasId: state.activeCanvasId,
      canvas: curCanvas,
      pages: allPagesData
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.download = `${curCanvas.name}_備份.json`;
    a.href = URL.createObjectURL(blob);
    a.click();
    flashToast('✅ JSON 備份檔已匯出！');
    if (els.exportModal) els.exportModal.classList.remove('open');
  }

  // ===== 白板雲端歷程檔案庫管理 (存檔、載入、跨班複製、刪除) =====
  async function fetchWhiteboardArchives(showNotification = false) {
    const ref = getArchivesRef();
    if (!ref) return;
    try {
      if (els.wbArchiveListContainer && Object.keys(archiveBank).length === 0) {
        els.wbArchiveListContainer.innerHTML = '<div style="text-align: center; padding: 36px 20px; color: var(--text-muted); font-size: 14px;">⏳ 正在連線讀取雲端歷程檔案清單...</div>';
      }
      const snap = await ref.once('value');
      const val = snap.val() || {};
      Object.keys(archiveBank).forEach(k => delete archiveBank[k]);
      Object.assign(archiveBank, val);
      if (window.parent) {
        window.parent.whiteboardArchives = archiveBank;
      }
      renderWhiteboardArchiveList();
      if (showNotification) {
        flashToast('🔄 雲端歷程檔案清單已重新整理！');
      }
    } catch (err) {
      console.error('fetchWhiteboardArchives error:', err);
      if (els.wbArchiveListContainer) {
        els.wbArchiveListContainer.innerHTML = `<div style="text-align: center; padding: 36px 20px; color: var(--danger-color); font-size: 14px;">❌ 讀取歷程失敗：${err.message || '網路逾時'}</div>`;
      }
    }
  }

  function openWhiteboardArchiveModal() {
    if (!els.whiteboardArchiveModal) return;
    els.whiteboardArchiveModal.classList.add('open');
    els.whiteboardArchiveModal.style.display = 'flex';
    fetchWhiteboardArchives(false);
  }

  function closeWhiteboardArchiveModal() {
    if (!els.whiteboardArchiveModal) return;
    els.whiteboardArchiveModal.classList.remove('open');
    els.whiteboardArchiveModal.style.display = 'none';
  }

  function renderWhiteboardArchiveList() {
    if (!els.wbArchiveListContainer) return;
    const keys = Object.keys(archiveBank || {});

    if (els.wbArchiveCountBadge) {
      els.wbArchiveCountBadge.textContent = `共 ${keys.length} 筆歷程檔案`;
    }

    if (keys.length === 0) {
      els.wbArchiveListContainer.innerHTML = `
        <div style="color: var(--text-muted); text-align: center; font-size: 14px; padding: 36px 20px; background: var(--bg-card); border-radius: 10px; border: 1.5px dashed var(--border-color); line-height: 1.6;">
          目前尚無儲存的白板歷程檔案。<br>
          您可以點選上方「➕ 儲存目前白板」將課堂的畫布筆記永久儲存在雲端！
        </div>
      `;
      return;
    }

    // 依建立時間倒序
    const sortedKeys = keys.sort((a, b) => {
      const itemA = archiveBank[a];
      const itemB = archiveBank[b];
      return (itemB.createdAt || 0) - (itemA.createdAt || 0);
    });

    const query = (archiveSearchQuery || '').toLowerCase().trim();
    const filteredKeys = sortedKeys.filter(k => {
      if (!query) return true;
      const item = archiveBank[k];
      if (!item) return false;
      const title = (item.title || '').toLowerCase();
      const creator = (item.createdBy || '').toLowerCase();
      return title.includes(query) || creator.includes(query);
    });

    if (filteredKeys.length === 0) {
      els.wbArchiveListContainer.innerHTML = `
        <div style="color: var(--text-muted); text-align: center; font-size: 14px; padding: 24px 20px; background: var(--bg-card); border-radius: 10px; border: 1px dashed var(--border-color);">
          查無符合「${escapeHtml(archiveSearchQuery)}」的歷程檔案
        </div>
      `;
      return;
    }

    els.wbArchiveListContainer.innerHTML = filteredKeys.map(k => {
      const item = archiveBank[k];
      const cCount = item.canvasCount || (item.canvases ? Object.keys(item.canvases).length : 1);
      const pCount = item.pageCount || (item.pages ? Object.keys(item.pages).length : 1);
      const oCount = item.objectCount !== undefined ? item.objectCount : 0;
      const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString('zh-TW', { hour12: false }) : '未知時間';

      return `
        <div class="wb-archive-card" data-archive-id="${k}">
          <div style="display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-weight: 700; font-size: 15px; color: var(--text-primary);">${escapeHtml(item.title || '白板歷程筆記')}</span>
              <span style="background: rgba(102, 126, 234, 0.12); color: var(--accent-color); font-size: 14px; padding: 2px 8px; border-radius: 6px; font-weight: 600;">🎨 ${cCount} 畫布</span>
              <span style="background: rgba(52, 199, 89, 0.12); color: var(--success-color); font-size: 14px; padding: 2px 8px; border-radius: 6px; font-weight: 600;">📄 ${pCount} 頁</span>
              <span style="background: rgba(249, 115, 22, 0.12); color: #f97316; font-size: 14px; padding: 2px 8px; border-radius: 6px; font-weight: 600;">✏️ ${oCount} 物件</span>
            </div>
            <div style="display: flex; align-items: center; gap: 14px; font-size: 14px; color: var(--text-secondary); flex-wrap: wrap;">
              <span>👤 建立者：${escapeHtml(item.createdBy || '老師')}</span>
              <span>🕒 時間：${dateStr}</span>
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0; align-items: center; flex-wrap: wrap;">
            <button type="button" class="presentation-tool-btn active btn-wb-load-archive" data-id="${k}" style="height: 32px; padding: 0 12px; font-size: 14px; border-radius: 10px; font-weight: bold;" title="載入此白板檔案">🚀 載入</button>
            <button type="button" class="presentation-tool-btn btn-wb-copy-archive" data-id="${k}" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; font-weight: bold; color: var(--accent-color); border-color: var(--accent-color);" title="複製此白板歷程到其他班級">📤 複製</button>
            <button type="button" class="presentation-tool-btn btn-wb-download-archive" data-id="${k}" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px; font-weight: bold;" title="下載此歷程的 JSON 檔案">📥 下載</button>
            <button type="button" class="presentation-tool-btn danger btn-wb-delete-archive" data-id="${k}" style="height: 32px; padding: 0 10px; font-size: 14px; border-radius: 10px;" title="刪除此歷程">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    // 綁定卡片按鈕事件
    els.wbArchiveListContainer.querySelectorAll('.btn-wb-load-archive').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        openArchiveLoadChoice(id);
      };
    });

    els.wbArchiveListContainer.querySelectorAll('.btn-wb-copy-archive').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        copyWhiteboardArchive(id);
      };
    });

    els.wbArchiveListContainer.querySelectorAll('.btn-wb-download-archive').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        downloadWhiteboardArchiveJSON(id);
      };
    });

    els.wbArchiveListContainer.querySelectorAll('.btn-wb-delete-archive').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        deleteWhiteboardArchive(id);
      };
    });
  }

  // 儲存目前白板為雲端歷程
  async function saveCurrentWhiteboardToCloud() {
    if (!roomRef) {
      flashToast('⚠️ 資料庫未連線，無法儲存');
      return;
    }

    const now = new Date();
    const defaultTitle = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 課堂筆記`;

    showWhiteboardPrompt('☁️ 儲存白板為雲端歷程檔案', '請輸入此筆記存檔名稱：', defaultTitle, async (title) => {
      if (!title || !title.trim()) return;
      const finalTitle = title.trim();
      flashToast('正在打包雲端歷程檔案...');

      try {
        const curCanvases = state.canvases || { main: { id: 'main', name: '主白板', pages: ['page_1'] } };
        const allPagesData = {};
        let totalPages = 0;
        let totalObjects = 0;

        for (const cId of Object.keys(curCanvases)) {
          const c = curCanvases[cId];
          const pages = (c && c.pages) || ['page_1'];
          for (const pId of pages) {
            totalPages++;
            const pageKey = `${cId}_${pId}`;
            if (cId === state.activeCanvasId && pId === state.activePageId) {
              allPagesData[pageKey] = { objects: { ...state.objects } };
              totalObjects += Object.keys(state.objects || {}).length;
            } else {
              const snap = await roomRef.child('pages').child(pageKey).once('value');
              const val = snap.val() || { objects: {} };
              allPagesData[pageKey] = val;
              totalObjects += Object.keys((val && val.objects) || {}).length;
            }
          }
        }

        const archiveId = `wb_arc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const archiveData = {
          id: archiveId,
          title: finalTitle,
          createdAt: Date.now(),
          createdBy: myName || '老師',
          canvasCount: Object.keys(curCanvases).length,
          pageCount: totalPages,
          objectCount: totalObjects,
          activeCanvasId: state.activeCanvasId,
          activePageId: state.activePageId,
          canvases: curCanvases,
          pages: allPagesData
        };

        if (!getArchivesRef()) throw new Error('雲端歷程資料庫未就緒');
        const { canvases, pages, ...metadata } = archiveData;
        const summary = await BoardArchiveStore.save(db.ref(), 'whiteboard_archives', 'whiteboard_archive_data', archiveId, metadata, { canvases, pages });
        archiveBank[archiveId] = summary;
        if (window.parent) window.parent.whiteboardArchives = archiveBank;
        renderWhiteboardArchiveList();
        flashToast('✅ 白板歷程檔案已成功儲存至雲端！');
      } catch (err) {
        console.error('儲存白板歷程失敗:', err);
        flashToast('❌ 儲存失敗：' + err.message);
      }
    });
  }

  // 選擇載入模式 (大家繼續編輯 vs 唯讀觀摩模式)
  function openArchiveLoadChoice(archiveId) {
    const archive = archiveBank[archiveId];
    if (!archive) return;
    pendingLoadArchiveId = archiveId;
    if (els.wbLoadChoiceArchiveTitle) {
      els.wbLoadChoiceArchiveTitle.textContent = archive.title || '白板歷程筆記';
    }
    if (els.wbArchiveLoadChoiceModal) {
      els.wbArchiveLoadChoiceModal.classList.add('open');
      els.wbArchiveLoadChoiceModal.style.display = 'flex';
    }
  }

  function closeArchiveLoadChoice() {
    pendingLoadArchiveId = null;
    if (els.wbArchiveLoadChoiceModal) {
      els.wbArchiveLoadChoiceModal.classList.remove('open');
      els.wbArchiveLoadChoiceModal.style.display = 'none';
    }
  }

  // 載入白板歷程檔案
  async function loadWhiteboardArchive(archiveId, mode = 'edit') {
    if (!roomRef) return;
    const archive = archiveBank[archiveId];
    if (!archive) {
      flashToast('❌ 找不到該歷程檔案！');
      return;
    }

    flashToast('正在載入白板歷程檔案...');

    try {
      if (archive.format !== 'zip-json-v1') throw new Error('此歷程不是目前支援的新格式');
      const content = await BoardArchiveStore.load(db.ref(), 'whiteboard_archive_data', archiveId);
      if (!content || !content.canvases || !content.pages || !Object.keys(content.canvases).length) throw new Error('歷程內容不完整，未載入白板');
      const canvasesData = content.canvases;
      const pagesData = content.pages;

      // 一次提交頁面、畫布與模式，避免部分寫入失敗造成內容不一致。
      const isReadOnly = mode === 'readonly';
      await roomRef.update({
        pages: pagesData,
        canvases: canvasesData,
        'settings/studentCanEdit': !isReadOnly,
        'settings/canMoveOthers': !isReadOnly
      });
      state.settings.studentCanEdit = !isReadOnly;
      state.settings.canMoveOthers = !isReadOnly;
      applySettingsUI();

      // 3. 切換至存檔的起始頁面
      state.canvases = canvasesData;
      const targetCanvasId = archive.activeCanvasId && canvasesData[archive.activeCanvasId] ? archive.activeCanvasId : Object.keys(canvasesData)[0];
      const targetCanvas = canvasesData[targetCanvasId] || { pages: ['page_1'] };
      const targetPageId = archive.activePageId && targetCanvas.pages && targetCanvas.pages.includes(archive.activePageId) ? archive.activePageId : (targetCanvas.pages[0] || 'page_1');

      switchCanvasAndPage(targetCanvasId, targetPageId, true);

      closeWhiteboardArchiveModal();
      flashToast(isReadOnly ? '🔒 已載入白板歷程（學生唯讀觀摩模式）！' : '✅ 已載入白板歷程（大家可繼續編輯）！');
    } catch (err) {
      console.error('載入白板歷程失敗:', err);
      flashToast('❌ 載入失敗：' + err.message);
    }
  }

  // 下載白板歷程 JSON
  async function downloadWhiteboardArchiveJSON(archiveId) {
    const archive = archiveBank[archiveId];
    if (!archive) return;
    let content;
    try {
      if (archive.format !== 'zip-json-v1') throw new Error('此歷程不是目前支援的新格式');
      content = await BoardArchiveStore.load(db.ref(), 'whiteboard_archive_data', archiveId);
      if (!content || !content.canvases || !content.pages) throw new Error('歷程內容不完整');
    } catch (error) { flashToast('❌ 下載失敗：' + error.message); return; }
    const backupData = {
      app: '即時互動白板',
      version: '3.10.12',
      scope: 'full-whiteboard',
      activeCanvasId: archive.activeCanvasId,
      activePageId: archive.activePageId,
      title: archive.title,
      exportTime: new Date(archive.createdAt || Date.now()).toISOString(),
      canvasCount: archive.canvasCount,
      pageCount: archive.pageCount,
      objectCount: archive.objectCount,
      canvases: content.canvases,
      pages: content.pages
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.download = `${archive.title || '白板歷程'}_備份.json`;
    a.href = URL.createObjectURL(blob);
    a.click();
    flashToast('✅ 歷程檔案 JSON 已下載！');
  }

  // 刪除白板歷程
  function deleteWhiteboardArchive(archiveId) {
    const archive = archiveBank[archiveId];
    if (!archive) return;
    showWhiteboardConfirm('🗑️ 刪除白板歷程', `確定要刪除「${archive.title || '此歷程檔案'}」嗎？刪除後無法復原。`, () => {
      const ref = getArchivesRef();
      if (ref) {
        BoardArchiveStore.remove(db.ref(), 'whiteboard_archives', 'whiteboard_archive_data', archiveId).then(() => {
          delete archiveBank[archiveId];
          if (window.parent) window.parent.whiteboardArchives = archiveBank;
          renderWhiteboardArchiveList();
          flashToast('🗑️ 歷程檔案已刪除');
        }).catch(err => {
          flashToast('❌ 刪除失敗：' + err.message);
        });
      }
    });
  }

  // 跨班複製白板歷程
  async function copyWhiteboardArchive(archiveId) {
    const archive = archiveBank[archiveId];
    if (!archive) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    if (window.parent && window.parent.app && typeof window.parent.app.openSingleItemCopyModal === 'function') {
      window.parent.app.openSingleItemCopyModal('whiteboardArchive', archiveId);
      return;
    }

    // 獨立視窗模式：使用原生 Prompt 選擇目標班級
    if (window.ClassRoomManager && typeof window.ClassRoomManager.copySingleItem === 'function') {
      showWhiteboardPrompt('📤 跨班複製白板歷程', '請輸入欲複製到的目標班級代碼（留空代表免代碼公開大廳）：', '', async (tgtCode) => {
        try {
          flashToast('正在複製到目標班級...');
          await window.ClassRoomManager.copySingleItem({
            moduleType: 'whiteboardArchive',
            itemId: archiveId,
            targetCodes: [tgtCode ? tgtCode.trim() : ''],
            sourceCode: window.currentClassCode || ''
          });
          flashToast('🎉 成功複製白板歷程至目標班級！');
        } catch (err) {
          flashToast('❌ 複製失敗：' + err.message);
        }
      });
      return;
    }

    flashToast('⚠️ 班級管理器未就緒');
  }

  // 通用畫布頁面渲染至離線 Canvas
  async function renderPageToCanvas(exportCanvas, pageObjects, width, height) {
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 繪製背景點狀網格
    ctx.fillStyle = '#cbd5e1';
    for (let x = 0; x < width; x += 30) {
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const objs = Object.values(pageObjects || {});
    // 預載圖片
    const imgPromises = [];
    objs.forEach(obj => {
      if (obj.type === 'image' && obj.src) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const p = new Promise(resolve => {
          img.onload = () => { obj._loadedImg = img; resolve(); };
          img.onerror = () => resolve();
        });
        img.src = obj.src;
        imgPromises.push(p);
      }
    });

    if (imgPromises.length > 0) {
      await Promise.all(imgPromises);
    }

    objs.forEach(obj => {
      if (obj.type === 'pen') {
        ctx.strokeStyle = obj.color || '#1e293b';
        ctx.lineWidth = (obj.strokeWidth || 4) * 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (obj.points && obj.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(obj.points[0].x, obj.points[0].y);
          for (let i = 1; i < obj.points.length; i++) {
            ctx.lineTo(obj.points[i].x, obj.points[i].y);
          }
          ctx.stroke();
        }
      } else if (obj.type === 'rect') {
        ctx.strokeStyle = obj.color || '#1e293b';
        ctx.lineWidth = (obj.strokeWidth || 3) * 1.5;
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
      } else if (obj.type === 'circle') {
        ctx.strokeStyle = obj.color || '#1e293b';
        ctx.lineWidth = (obj.strokeWidth || 3) * 1.5;
        ctx.beginPath();
        ctx.ellipse(obj.cx, obj.cy, obj.rx, obj.ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (obj.type === 'sticky') {
        ctx.fillStyle = obj.bg || '#fef08a';
        ctx.fillRect(obj.x, obj.y, obj.width || 210, obj.height || 140);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x, obj.y, obj.width || 210, obj.height || 140);

        ctx.fillStyle = '#1e293b';
        ctx.font = '16px sans-serif';
        const lines = (obj.text || '').split('\n');
        lines.forEach((l, idx) => {
          ctx.fillText(l, obj.x + 12, obj.y + 32 + idx * 22);
        });
      } else if (obj.type === 'image' && obj._loadedImg) {
        ctx.drawImage(obj._loadedImg, obj.x, obj.y, obj.width, obj.height);
      }
    });
  }

  function downloadCanvasImage(canvas, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = canvas.toDataURL('image/png');
    a.click();
    flashToast('✅ 圖片已成功匯出至下載資料夾！');
  }

  // 白板專屬全螢幕友好通用彈窗系統 (避免原生 prompt/confirm/alert 強制中斷瀏覽器全螢幕模式)
  function showWhiteboardDialog({ title, message, inputDefault, showInput, onConfirm, onCancel }) {
    let modal = document.getElementById('whiteboardDialogModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.id = 'whiteboardDialogModal';
      modal.style.zIndex = '99999';
      modal.innerHTML = `
        <div class="modal-card" style="max-width: 420px;">
          <div class="modal-header">
            <div class="modal-title" id="wbDialogTitle"><span id="wbDialogTitleText">提示</span></div>
            <button class="btn-close" id="wbDialogCloseBtn">✕</button>
          </div>
          <div style="padding: 20px 24px;">
            <p id="wbDialogMessage" style="font-size: 14px; color: var(--text-main); margin: 0 0 12px 0;"></p>
            <input type="text" id="wbDialogInput" class="question-input" style="width: 100%; box-sizing: border-box; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); font-size: 14px; color: var(--text-main); display: none;">
          </div>
          <div class="modal-footer" style="padding: 12px 24px; justify-content: flex-end; gap: 10px;">
            <button class="btn-secondary" id="wbDialogCancelBtn">取消</button>
            <button class="btn-primary" id="wbDialogConfirmBtn">確定</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const titleEl = modal.querySelector('#wbDialogTitleText') || modal.querySelector('#wbDialogTitle span');
    const msgEl = modal.querySelector('#wbDialogMessage');
    const inputEl = modal.querySelector('#wbDialogInput');
    const btnCancel = modal.querySelector('#wbDialogCancelBtn');
    const btnConfirm = modal.querySelector('#wbDialogConfirmBtn');
    const btnClose = modal.querySelector('#wbDialogCloseBtn');

    if (titleEl) titleEl.textContent = title || '提示';
    if (msgEl) msgEl.textContent = message || '';
    if (showInput) {
      inputEl.style.display = 'block';
      inputEl.value = inputDefault || '';
      setTimeout(() => {
        inputEl.focus();
        inputEl.select();
      }, 50);
    } else {
      inputEl.style.display = 'none';
    }

    const close = () => {
      modal.classList.remove('open');
      modal.style.display = 'none';
      if (inputEl) inputEl.onkeydown = null;
    };

    const doConfirm = () => {
      const val = inputEl ? inputEl.value : null;
      close();
      if (typeof onConfirm === 'function') onConfirm(val);
    };

    const doCancel = () => {
      close();
      if (typeof onCancel === 'function') onCancel();
    };

    btnConfirm.onclick = doConfirm;
    btnCancel.onclick = doCancel;
    btnClose.onclick = doCancel;

    if (showInput) {
      inputEl.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doConfirm();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          doCancel();
        }
      };
    }

    modal.style.display = 'flex';
    modal.classList.add('open');
  }

  function showWhiteboardPrompt(title, message, defaultValue, onConfirm, onCancel) {
    showWhiteboardDialog({
      title,
      message,
      inputDefault: defaultValue,
      showInput: true,
      onConfirm,
      onCancel
    });
  }

  function showWhiteboardConfirm(title, message, onConfirm, onCancel) {
    showWhiteboardDialog({
      title,
      message,
      showInput: false,
      onConfirm,
      onCancel
    });
  }

  // 輕量 Toast 提示
  function flashToast(msg) {
    let t = document.getElementById('whiteboardToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'whiteboardToast';
      t.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.92); color:#fff; padding:8px 20px; border-radius:24px; font-size:13px; font-weight:600; z-index:9999; box-shadow:0 6px 18px rgba(0,0,0,0.25); pointer-events:none; transition:all 0.2s;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.style.opacity = '0';
    }, 2400);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ===== 浮動工具列：往左收合 / 展開 & 按住自由拖曳移動 (電腦版與行動裝置通用) =====
  function initFloatingToolbarControls() {
    const toolbar = document.getElementById('floatingToolbar');
    const toggleBtn = document.getElementById('btnToggleFloatingToolbar');
    const dragHandle = document.getElementById('toolbarDragHandle');
    if (!toolbar || toolbar._controlsBound) return;
    toolbar._controlsBound = true;

    let savedLeftBeforeCollapse = null;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isCollapsed = toolbar.classList.toggle('is-collapsed');
        toggleBtn.textContent = isCollapsed ? '▶' : '◀';
        toggleBtn.title = isCollapsed ? '展開白板工具列' : '往左收合工具列';
        if (isCollapsed) {
          if (toolbar.classList.contains('is-custom-pos')) {
            savedLeftBeforeCollapse = toolbar.style.left;
            toolbar.style.left = '0px';
          }
        } else {
          if (toolbar.classList.contains('is-custom-pos') && savedLeftBeforeCollapse !== null) {
            toolbar.style.left = savedLeftBeforeCollapse;
          }
        }
      });
    }

    let isDraggingToolbar = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const startToolbarDrag = (e) => {
      // 只允許左鍵或觸控拖曳
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      if (toolbar.classList.contains('is-collapsed')) {
        toolbar.classList.remove('is-collapsed');
        if (toggleBtn) toggleBtn.textContent = '◀';
      }

      const parent = toolbar.offsetParent || document.querySelector('.whiteboard-main') || document.body;
      const parentRect = parent.getBoundingClientRect();
      const rect = toolbar.getBoundingClientRect();
      const startLeft = rect.left - parentRect.left;
      const startTop = rect.top - parentRect.top;

      toolbar.classList.add('is-custom-pos', 'is-dragging');
      toolbar.style.left = Math.round(startLeft) + 'px';
      toolbar.style.top = Math.round(startTop) + 'px';

      isDraggingToolbar = true;
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
    };

    if (dragHandle) {
      dragHandle.addEventListener('pointerdown', startToolbarDrag);
    }

    // 電腦版與行動裝置也可直接按住工具列空白背景處拖曳移動
    toolbar.addEventListener('pointerdown', (e) => {
      if (e.target === toolbar || e.target.classList.contains('toolbar-grid') || e.target.classList.contains('toolbar-styles') || e.target.classList.contains('toolbar-history')) {
        startToolbarDrag(e);
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDraggingToolbar) return;
      const parent = toolbar.offsetParent || document.querySelector('.whiteboard-main') || document.body;
      const parentRect = parent.getBoundingClientRect();
      const tbWidth = toolbar.offsetWidth || 50;
      const tbHeight = toolbar.offsetHeight || 280;

      let newLeft = e.clientX - parentRect.left - dragOffsetX;
      let newTop = e.clientY - parentRect.top - dragOffsetY;

      newLeft = Math.max(4, Math.min(parentRect.width - tbWidth - 4, newLeft));
      newTop = Math.max(4, Math.min(parentRect.height - tbHeight - 4, newTop));

      toolbar.style.left = Math.round(newLeft) + 'px';
      toolbar.style.top = Math.round(newTop) + 'px';
      savedLeftBeforeCollapse = toolbar.style.left;
    });

    const endToolbarDrag = () => {
      if (!isDraggingToolbar) return;
      isDraggingToolbar = false;
      toolbar.classList.remove('is-dragging');
    };
    window.addEventListener('pointerup', endToolbarDrag);
    window.addEventListener('pointercancel', endToolbarDrag);
  }

  initFloatingToolbarControls();

  // ===== 初始化啟動 =====
  window.addEventListener('board-ready', () => {
    initFirebase();
    renderCanvasSelector();
    renderPagesTabs();
    applySettingsUI();
    setTool('select');
    initFloatingToolbarControls();
    initTransformOverlay();
  });

})();
