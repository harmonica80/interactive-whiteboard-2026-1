// 互動式影片出題測驗系統 (Interactive Video Quiz Assessment System)
// 支援：全班同步播放測驗 (Teacher-led) 與 學生自主學習測驗 (Self-paced)
// 支援題型：單選題 (single)、複選題 (multiple)、問答題 (text)
(function (global) {
  'use strict';

  // 原廠預設精選影片測驗範例題庫
  const DEFAULT_VIDEO_QUIZZES = [
    {
      id: 'vq_solar_system',
      title: '🌌 自然科學：太陽系行星奧秘探索',
      description: '跟隨影片探索太陽系各大行星特徵、運轉規律與宇宙奧秘！',
      videoUrl: 'https://www.youtube.com/watch?v=libKVRa01L8',
      videoType: 'youtube',
      youtubeId: 'libKVRa01L8',
      createdAt: 1725550000000,
      questions: [
        {
          id: 'q_1',
          time: 25,
          timeFormatted: '00:25',
          type: 'single',
          prompt: '太陽系中體積最大、質量最重的行星是哪一顆？',
          options: ['水星', '金星', '木星', '土星'],
          correctAnswer: '木星',
          explanation: '木星是太陽系中最大的行星，屬於氣態巨行星，其質量是其他所有行星總和的2.5倍。',
          points: 10
        },
        {
          id: 'q_2',
          time: 60,
          timeFormatted: '01:00',
          type: 'multiple',
          prompt: '下列哪些行星屬於主要由岩石和金屬組成的「類地行星」？（複選題，請選出所有正確選項）',
          options: ['水星', '金星', '地球', '木星'],
          correctAnswer: ['水星', '金星', '地球'],
          explanation: '太陽系內的類地行星包含水星、金星、地球與火星；木星則為氣態巨行星。',
          points: 10
        },
        {
          id: 'q_3',
          time: 95,
          timeFormatted: '01:35',
          type: 'text',
          prompt: '【問答題】請用您自己的話簡述：為什麼地球是目前已知唯一能孕育複雜生命的行星？',
          options: [],
          correctAnswer: '位於適居帶、擁有適量液態水、合適厚度的大氣層與地磁防護',
          explanation: '地球具備適宜的日地距離（適居帶）、充足的液態水、富含氧與氮的大氣層，以及阻擋宇宙射線的強大地磁場。',
          points: 10
        }
      ]
    },
    {
      id: 'vq_eye_cells',
      title: '👁️ 生物科普：眼睛中的視錐細胞與視桿細胞的作用是？',
      description: '探索眼睛感光細胞的奧秘，了解負責彩色視覺的視錐細胞與暗光視覺的視桿細胞！',
      videoUrl: 'https://www.youtube.com/watch?v=J4BJB48jdfw',
      videoType: 'youtube',
      youtubeId: 'J4BJB48jdfw',
      createdAt: 1725550100000,
      questions: [
        {
          id: 'qc_1',
          time: 25,
          timeFormatted: '00:25',
          type: 'single',
          prompt: '視網膜上的「視錐細胞」主要負責什麼生理功能？',
          options: ['負責色彩視覺與強光下的清晰影像', '負責暗光下的黑白模糊輪廓', '調節眼球水晶體的厚薄曲度', '分泌眼淚保持眼角膜濕潤'],
          correctAnswer: '負責色彩視覺與強光下的清晰影像',
          explanation: '視錐細胞（錐狀細胞）主要集中於視網膜黃斑部，對強光敏感，負責高解析度影像與紅、綠、藍彩色視覺。',
          points: 10
        },
        {
          id: 'qc_2',
          time: 60,
          timeFormatted: '01:00',
          type: 'multiple',
          prompt: '關於「視桿細胞（桿狀細胞）」的特性，下列哪些敘述正確？（複選題）',
          options: ['對弱光極為敏感，是夜間暗視覺的主力', '無法分辨色彩，僅能感知明暗與黑白輪廓', '缺乏維生素 A 會影響其視紫質合成導致夜盲症', '主要負責辨識鮮豔細緻的色彩'],
          correctAnswer: ['對弱光極為敏感，是夜間暗視覺的主力', '無法分辨色彩，僅能感知明暗與黑白輪廓', '缺乏維生素 A 會影響其視紫質合成導致夜盲症'],
          explanation: '視桿細胞靈敏度極高，在微弱光線下即可感光，但無法分辨顏色；缺乏維生素A會導致視紫質不足，引發夜盲症。',
          points: 10
        },
        {
          id: 'qc_3',
          time: 94,
          timeFormatted: '01:34',
          type: 'matching',
          prompt: '請問「色盲」與「夜盲」分別是哪一個細胞有問題？',
          options: ['色盲', '夜盲'],
          matchOptions: ['視錐細胞', '視桿細胞'],
          pairs: [
            { left: '色盲', right: '視錐細胞' },
            { left: '夜盲', right: '視桿細胞' }
          ],
          correctAnswer: {
            '色盲': '視錐細胞',
            '夜盲': '視桿細胞'
          },
          explanation: '視錐細胞主要作用：負責彩色視覺與清晰的細節；視桿細胞主要作用：負責暗光視覺與黑白輪廓。色盲與視錐細胞異常有關，夜盲則與視桿細胞異常有關。',
          points: 10
        },
        {
          id: 'qc_4',
          time: 135,
          timeFormatted: '02:15',
          type: 'text',
          prompt: '【問答題】請簡述：為什麼從明亮室外走進昏暗電影院時，一開始會看不清，過一會兒卻能看清周遭輪廓（暗適應現象）？',
          options: [],
          correctAnswer: '強光下視紫質大量分解，進入暗處後視桿細胞需要時間重新合成視紫質以恢復暗視覺。',
          explanation: '由亮入暗時，視錐細胞失去作用，視桿細胞需要數分鐘重新合成「視紫質」恢復感光能力，此生理過程稱為「暗適應」。',
          points: 10
        }
      ]
    }
  ];

  const DEFAULT_CUSTOM_SETS = [
    {
      id: 'cset_comprehensive_default',
      name: '綜合影音複習測驗組',
      quizIds: ['vq_science_solar', 'vq_eye_cells'],
      quizCount: 2,
      createdAt: 1725550000000,
      totalQuestions: 7
    },
    {
      id: 'cset_interdisciplinary_default',
      name: '跨學科精選測驗組',
      quizIds: ['vq_eye_cells', 'vq_science_solar'],
      quizCount: 2,
      createdAt: 1789574400000,
      totalQuestions: 7
    }
  ];

  class VideoQuizManager {
    constructor() {
      this.STORAGE_KEY = 'video_quizzes_v1';
      this.CUSTOM_SETS_KEY = 'video_quiz_custom_sets_v1';
      this.quizzes = this.loadStoredQuizzes();
      this.customSets = this.loadStoredCustomSets();
      this.activeQuiz = null;
      this.currentMode = 'sync'; // 'sync' (全班同步) | 'self' (自主學習) | 'editor' (出題管理)
      this.globalMode = 'sync'; // 由授課老師於管理後台統一設定 ('sync' | 'self')
      this.allowStudentRepeat = false; // 老師決定重播時學生端是否重複出題作答 (預設關閉)
      this.currentCustomSet = null; // 當前進行中的測驗組合 (支援多影片)
      this.currentSetQuizIndex = 0; // 測驗組合中當前播放的影片索引
      this.lastTeacherTickTime = 0; // 教師端上次時間軸刻度 (用於倒轉/重播偵測)
      
      // 題庫後台搜尋、分頁與影片核選自訂組合狀態
      this.adminSearchQuery = '';
      this.adminCurrentPage = 1;
      this.adminPageSize = 3;
      this.selectedQuizIds = new Set();

      // 播放器狀態
      this.playerType = null; // 'youtube' | 'html5'
      this.ytPlayer = null;
      this.html5Player = null;
      this.pollTimer = null;
      this.currentTime = 0;
      this.duration = 0;
      this.isPlaying = false;
      this.isPlayerReady = false;

      // 播放器真實時間狀態
      this.lastMediaTime = null; // 上一次時間軸真實時間 (用於區間跨越、快轉、回溯重播偵測)
      this.isQuestionOverlayShowing = false; // 題目覆蓋層鎖定 (避免同時間點連續多次彈題)
      this.syncEventSeq = 0;
      this.lastHandledSessionId = null;
      this.handledEventIds = new Set();

      // 測驗進度狀態 (自主學習 & 同步模式)
      this.triggeredQuestions = new Set();
      this.currentActiveQuestion = null;
      this.userAnswers = {}; // { qId: { answer, isCorrect, score } }
      this.isTeacher = false;
      this.lastSession = null;
      this.pendingQuestion = null;
      this.hasAssignedSelfQuiz = false;
      
      // 編輯器暫存
      this.editingQuiz = null;
      this.editingQuestionIndex = -1;

      // Firebase 同步參照
      this.sessionRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizSession') : null;
      this.answersRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizAnswers') : null;
      this.quizzesRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizzes') : null;
      this.settingsRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizSettings') : null;
      this.customSetsRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizCustomSets') : null;

      this.initFirebaseSync();
    }

    // 載入儲存的題庫清單 (優先 LocalStorage，若無則使用預設範例)
    loadStoredQuizzes() {
      try {
        const stored = window.boardStorage.local.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            let needsUpdate = false;
            const updated = parsed.map(q => {
              if (!q) return q;
              // 自動升級：若包含舊版「國文與成語典故」，替換為「眼睛中的視錐細胞與視桿細胞的作用是？」
              if (q.id === 'vq_chinese_culture' || (q.title && q.title.includes('國文與成語典故'))) {
                needsUpdate = true;
                return JSON.parse(JSON.stringify(DEFAULT_VIDEO_QUIZZES[1]));
              }
              // 自動修正：確保「眼睛中的視錐細胞與視桿細胞的作用是？」在各教室與本機皆使用正確的 Youtube 網址
              if (q.id === 'vq_eye_cells' || (q.title && q.title.includes('視錐細胞與視桿細胞'))) {
                if (q.youtubeId !== 'J4BJB48jdfw' || q.videoUrl !== 'https://www.youtube.com/watch?v=J4BJB48jdfw') {
                  needsUpdate = true;
                  q.videoUrl = 'https://www.youtube.com/watch?v=J4BJB48jdfw';
                  q.youtubeId = 'J4BJB48jdfw';
                }
              }
              return q;
            });
            if (needsUpdate) {
              window.boardStorage.local.setItem(this.STORAGE_KEY, JSON.stringify(updated));
              return updated;
            }
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse stored video quizzes', e);
      }
      return JSON.parse(JSON.stringify(DEFAULT_VIDEO_QUIZZES));
    }

    // 儲存題庫清單
    saveQuizzes() {
      try {
        window.boardStorage.local.setItem(this.STORAGE_KEY, JSON.stringify(this.quizzes));
        if (this.quizzesRef) {
          const quizObj = {};
          this.quizzes.forEach(q => { quizObj[q.id] = q; });
          this.quizzesRef.set(quizObj);
        }
      } catch (e) {
        console.error('Failed to save video quizzes', e);
      }
    }

    // 清理與驗證測驗組合清單（官方預設範例嚴格保留兩組：「綜合影音複習測驗組」與「跨學科精選測驗組」，其餘舊範例一律清理刪除）
    sanitizeCustomSets(list) {
      const existingDefault1 = Array.isArray(list) ? list.find(s => s && (s.id === 'cset_comprehensive_default' || s.name === '綜合影音複習測驗組')) : null;
      const defaultSet1 = existingDefault1
        ? JSON.parse(JSON.stringify(existingDefault1))
        : JSON.parse(JSON.stringify(DEFAULT_CUSTOM_SETS[0]));

      const existingDefault2 = Array.isArray(list) ? list.find(s => s && (s.id === 'cset_interdisciplinary_default' || s.name === '跨學科精選測驗組')) : null;
      const defaultSet2 = existingDefault2
        ? JSON.parse(JSON.stringify(existingDefault2))
        : JSON.parse(JSON.stringify(DEFAULT_CUSTOM_SETS[1]));

      if (defaultSet1 && Array.isArray(defaultSet1.quizIds)) {
        defaultSet1.quizIds = [...new Set(defaultSet1.quizIds.map(id => id === 'vq_chinese_culture' ? 'vq_eye_cells' : id))];
        defaultSet1.quizCount = defaultSet1.quizIds.length;
      }
      if (defaultSet2 && Array.isArray(defaultSet2.quizIds)) {
        defaultSet2.quizIds = [...new Set(defaultSet2.quizIds.map(id => id === 'vq_chinese_culture' ? 'vq_eye_cells' : id))];
        defaultSet2.quizCount = defaultSet2.quizIds.length;
      }

      if (!Array.isArray(list) || list.length === 0) {
        return [defaultSet1, defaultSet2];
      }

      // 舊版過渡範例黑名單
      const legacySampleNames = new Set([
        '更新後的跨領域精選測驗組',
        '原測驗組合名稱',
        '太陽系科學核心組',
        '八大行星核心速測組',
        '經典成語與文化精選組',
        '國文與成語典故組',
        '歷史與科學綜合特輯'
      ]);

      const defaultIds = new Set(['cset_comprehensive_default', 'cset_interdisciplinary_default', defaultSet1.id, defaultSet2.id]);
      const defaultNames = new Set(['綜合影音複習測驗組', '跨學科精選測驗組', defaultSet1.name, defaultSet2.name]);

      // 篩選出使用者建立的測驗組合
      const userCreatedSets = list.filter(s => {
        if (!s || !s.name) return false;
        if (defaultNames.has(s.name) || defaultIds.has(s.id)) return false;
        // 使用者自訂組合一律保留 (包含 set_ 或 cset_custom 開頭)
        if (s.id && (s.id.startsWith('set_') || s.id.startsWith('cset_custom'))) {
          if (Array.isArray(s.quizIds)) {
            s.quizIds = [...new Set(s.quizIds)];
            s.quizCount = s.quizIds.length;
          }
          return true;
        }
        if (legacySampleNames.has(s.name)) return false;
        if (s.id && (s.id.startsWith('cset_default') || s.id.startsWith('cset_sample'))) return false;
        if (Array.isArray(s.quizIds)) {
          s.quizIds = [...new Set(s.quizIds)];
          s.quizCount = s.quizIds.length;
        }
        return true;
      });

      // 官方預設範例保留兩組（綜合影音複習測驗組、跨學科精選測驗組），其餘範例全數刪除
      return [defaultSet1, defaultSet2, ...userCreatedSets];
    }

    // 載入自訂常用測驗組合清單 (預設範例只保留一組「綜合影音複習測驗組」，其餘/重複自動刪除)
    loadStoredCustomSets() {
      try {
        const stored = window.boardStorage.local.getItem(this.CUSTOM_SETS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const sanitized = this.sanitizeCustomSets(parsed);
          window.boardStorage.local.setItem(this.CUSTOM_SETS_KEY, JSON.stringify(sanitized));
          return sanitized;
        }
      } catch (e) {
        console.warn('Failed to parse stored video quiz custom sets', e);
      }
      return JSON.parse(JSON.stringify(DEFAULT_CUSTOM_SETS));
    }

    // 儲存自訂常用測驗組合清單
    saveCustomSets() {
      try {
        window.boardStorage.local.setItem(this.CUSTOM_SETS_KEY, JSON.stringify(this.customSets));
        if (this.customSetsRef) {
          const setObj = {};
          this.customSets.forEach(s => { setObj[s.id] = s; });
          this.customSetsRef.set(setObj);
        }
      } catch (e) {
        console.error('Failed to save video quiz custom sets', e);
      }
    }

    // 初始化 Firebase 同步監聽
    initFirebaseSync() {
      if (!this.sessionRef) return;

      // 監聽遠端同步測驗廣播
      this.sessionRef.on('value', (snapshot) => {
        const session = snapshot.val();
        this.handleRemoteSessionUpdate(session);
      });

      // 監聽全班即時答題資料 (用於即時統計與排行榜)
      if (this.answersRef) {
        this.answersRef.on('value', (snapshot) => {
          const answers = snapshot.val() || {};
          this.handleRemoteAnswersUpdate(answers);
        });
      }

      // 監聽線上題庫同步 (各教室線上同步)
      if (this.quizzesRef) {
        this.quizzesRef.on('value', (snapshot) => {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            const list = Object.values(val);
            if (list.length > 0) {
              let firebaseNeedsUpdate = false;
              this.quizzes = list.map(q => {
                if (!q) return q;
                if (q.id === 'vq_chinese_culture' || (q.title && q.title.includes('國文與成語典故'))) {
                  firebaseNeedsUpdate = true;
                  return JSON.parse(JSON.stringify(DEFAULT_VIDEO_QUIZZES[1]));
                }
                if (q.id === 'vq_eye_cells' || (q.title && q.title.includes('視錐細胞與視桿細胞'))) {
                  if (q.youtubeId !== 'J4BJB48jdfw' || q.videoUrl !== 'https://www.youtube.com/watch?v=J4BJB48jdfw') {
                    firebaseNeedsUpdate = true;
                    q.videoUrl = 'https://www.youtube.com/watch?v=J4BJB48jdfw';
                    q.youtubeId = 'J4BJB48jdfw';
                  }
                }
                return q;
              });
              if (firebaseNeedsUpdate && (this.isTeacher || window.app?.isAdmin)) {
                this.saveQuizzes();
              }
              this.renderQuizSelector();
              this.renderEditorQuizList();
            }
          }
        });
      }

      // 監聽測驗模式全班同步設定 (老師主導)
      if (this.settingsRef) {
        let isInitialSettingsLoad = true;
        this.settingsRef.on('value', (snapshot) => {
          const val = snapshot.val();
          const wasInitial = isInitialSettingsLoad;
          isInitialSettingsLoad = false;
          if (!val) return;
          const mode = (val.mode === 'self' || val.mode === 'sync') ? val.mode : 'sync';
          
          if (mode === 'self') {
            // 只有當老師真正按下「指派自主學習測驗」有了 assignedQuizId，學生端才切換並出現
            if (val.assignedQuizId && !this.isTeacher && !window.app?.isAdmin) {
              this.hasAssignedSelfQuiz = true;
              this.applyGlobalMode('self');
              this.selectQuiz(val.assignedQuizId);
              // 如果是初次載入網頁，僅當指派時間是 15 分鐘以內的新鮮指派時才切換分頁
              const isRecent = val.assignedAt ? (Date.now() - val.assignedAt < 15 * 60 * 1000) : false;
              if (!wasInitial || isRecent) {
                this.startSelfPacedQuiz(val.assignedQuizId);
                if (!wasInitial && window.app && typeof window.app.switchToTab === 'function') {
                  if (window.app.activeTabId !== 'panel-video-quiz') {
                    window.app.switchToTab('panel-video-quiz');
                  }
                }
              }
            }
          } else {
            this.hasAssignedSelfQuiz = false;
            this.applyGlobalMode('sync');
          }
        });
      }

      // 監聽自訂常用測驗組合同步 (確保官方預設範例只保留一組，其餘舊範例自動刪除並回寫清理 Firebase)
      if (this.customSetsRef) {
        this.customSetsRef.on('value', (snapshot) => {
          const val = snapshot.val();
          let rawList = (val && typeof val === 'object') ? Object.values(val) : [];
          const sanitized = this.sanitizeCustomSets(rawList);

          const rawIds = rawList.map(s => `${s.id || ''}:${s.name || ''}`).sort().join(',');
          const sanitizedIds = sanitized.map(s => `${s.id || ''}:${s.name || ''}`).sort().join(',');
          const needsSyncBack = rawIds !== sanitizedIds;

          this.customSets = sanitized;
          window.boardStorage.local.setItem(this.CUSTOM_SETS_KEY, JSON.stringify(sanitized));

          if (needsSyncBack) {
            const setObj = {};
            this.customSets.forEach(s => { setObj[s.id] = s; });
            this.customSetsRef.set(setObj);
          }

          this.renderCustomSetsList();
          this.renderQuizSelector();
        });
      }
    }

    // 初始化介面與事件綁定
    init() {
      this.renderCustomSetsList();
      this.renderQuizSelector();
      this.renderEditorQuizList();
      this.bindEvents();
      this.applyGlobalMode(this.globalMode);
      
      // 預設選取第一部測驗
      if (this.quizzes.length > 0) {
        this.selectQuiz(this.quizzes[0].id);
      }

      if (window.app && window.app.isAdmin) {
        this.setAdminState(true);
      } else {
        this.setAdminState(false);
      }
    }

    // 設定全班測驗模式 (僅授課老師於管理後台可操作)
    setGlobalMode(mode) {
      if (mode !== 'sync' && mode !== 'self') return;
      this.globalMode = mode;

      if (mode === 'sync') {
        this.hasAssignedSelfQuiz = false;
        if (this.settingsRef) {
          this.settingsRef.set({ mode: 'sync', assignedQuizId: null, updatedAt: Date.now() });
        }
        this.applyGlobalMode('sync');
        if (window.app) {
          window.app.showNotification('測驗模式設定', '已將全班切換為「🧑‍🏫 全班同步測驗模式」！');
        }
      } else {
        // 自主學習模式：老師在後台選擇時「先不要馬上開始」，等按下「指派自主學習測驗」按鈕後，學生端才出現
        this.hasAssignedSelfQuiz = false;
        this.applyGlobalMode('self');
        if (window.app) {
          window.app.showNotification('自主學習模式', '已切換為自主學習設定。請選擇測驗單元，並點擊下方「🚀 指派自主學習測驗」後學生端才會開始！');
        }
      }
    }

    // 套用測驗模式至畫面 (更新學生端狀態列與後台按鈕狀態)
    applyGlobalMode(mode) {
      this.globalMode = mode;

      // 1. 更新管理後台的 Radio 樣式
      const syncRadio = document.querySelector('input[name="adminVideoQuizModeRadio"][value="sync"]');
      const selfRadio = document.querySelector('input[name="adminVideoQuizModeRadio"][value="self"]');
      const lblSync = document.getElementById('lblGlobalModeSync');
      const lblSelf = document.getElementById('lblGlobalModeSelf');
      if (syncRadio && selfRadio) {
        syncRadio.checked = (mode === 'sync');
        selfRadio.checked = (mode === 'self');
      }
      if (lblSync && lblSelf) {
        if (mode === 'sync') {
          lblSync.style.borderColor = 'var(--accent-color)';
          lblSync.style.background = 'rgba(0,122,255,0.08)';
          lblSelf.style.borderColor = 'var(--border-color)';
          lblSelf.style.background = 'var(--bg-input)';
        } else {
          lblSelf.style.borderColor = 'var(--accent-color)';
          lblSelf.style.background = 'rgba(0,122,255,0.08)';
          lblSync.style.borderColor = 'var(--border-color)';
          lblSync.style.background = 'var(--bg-input)';
        }
      }

      // 2. 更新學生端頂部狀態列
      const badge = document.getElementById('vqStudentModeBadge');
      const note = document.getElementById('vqStudentModeNote');
      const isTeacherUser = this.isTeacher || window.app?.isAdmin;
      if (badge) {
        badge.textContent = mode === 'sync' ? '🧑‍🏫 模式：全班同步測驗' : '🎧 模式：個人自主學習';
        badge.style.background = mode === 'sync' ? 'var(--accent-color)' : '#34c759';
      }
      if (note) {
        note.textContent = mode === 'sync' 
          ? '由授課老師統一設定與引導播放'
          : (isTeacherUser ? '由授課老師設定為自主學習，可自由選擇影片練習' : '由授課老師指派自主學習測驗');
      }

      // 3. 學生端顯示區域連動 (同步模式顯示同步區，自主模式顯示自主區)
      const syncSec = document.getElementById('vqSyncSection');
      const selfSec = document.getElementById('vqSelfSection');
      const selectorRow = document.getElementById('vqSelfQuizSelectorRow');
      if (selectorRow) {
        selectorRow.style.display = 'none';
      }
      if (syncSec && selfSec) {
        if (mode === 'sync') {
          syncSec.style.display = 'block';
          selfSec.style.display = 'none';
        } else {
          // 自主模式：管理員或老師端可見，學生端須等待老師指派後才出現
          if (isTeacherUser || this.hasAssignedSelfQuiz) {
            syncSec.style.display = 'none';
            selfSec.style.display = 'block';
          }
        }
      }

      // 4. 更新管理後台測驗控制台標題、選單標籤與按鈕 (依模式即時切換)
      const secTitle = document.getElementById('vqAdminModeSectionTitle');
      const selectLabel = document.getElementById('vqAdminQuizSelectLabel');
      const startBtn = document.getElementById('vqAdminStartQuizBtn');
      const broadcastBadge = document.getElementById('vqAdminBroadcastStatusBadge');

      if (secTitle) {
        secTitle.textContent = (mode === 'sync') ? '🧑‍🏫 全班同步測驗廣播控制' : '🎧 個人自主學習測驗控制';
      }
      if (selectLabel) {
        selectLabel.textContent = (mode === 'sync') ? '選擇同步測驗單元：' : '選擇自主學習測驗單元：';
      }
      if (startBtn) {
        if (mode === 'sync') {
          startBtn.textContent = '🚀 發起全班同步測驗';
          startBtn.style.background = 'var(--accent-color)';
        } else {
          startBtn.textContent = '🚀 指派自主學習測驗';
          startBtn.style.background = '#34c759';
        }
      }
      if (broadcastBadge && (!this.lastSession || this.lastSession.status === 'idle')) {
        if (mode === 'self') {
          if (this.hasAssignedSelfQuiz) {
            broadcastBadge.textContent = '🟢 自主學習中';
            broadcastBadge.style.background = '#34c759';
          } else {
            broadcastBadge.textContent = '⚪ 待指派自主學習';
            broadcastBadge.style.background = 'var(--text-muted)';
          }
        } else {
          broadcastBadge.textContent = '⚪ 未發起測驗';
          broadcastBadge.style.background = 'var(--text-muted)';
        }
      }

      this.currentMode = mode;
      if (this.isTeacher || window.app?.isAdmin) {
        this.renderSyncTeacherControls();
      }
    }

    // 管理員登入 / 登出狀態連動
    setAdminState(isAdmin) {
      this.isTeacher = !!isAdmin;
      const link = document.getElementById('vqAdminQuickLinkWrapper');
      if (link) link.style.display = this.isTeacher ? 'block' : 'none';
      const selectorRow = document.getElementById('vqSelfQuizSelectorRow');
      if (selectorRow) selectorRow.style.display = 'none';
      this.renderCustomSetsList();
      this.renderQuizSelector();
      this.renderEditorQuizList();
      this.updateAdminBroadcastUI(this.lastSession);
      this.renderSyncTeacherControls();
      if (!this.isTeacher) {
        const syncContainer = document.getElementById('vqSyncTeacherControls');
        if (syncContainer) { syncContainer.style.display = 'none'; syncContainer.innerHTML = ''; }
        const selfContainer = document.getElementById('vqSelfTeacherControls');
        if (selfContainer) { selfContainer.style.display = 'none'; selfContainer.innerHTML = ''; }
      }
    }

    // 當切換進入「影片出題測驗」分頁時的觸發邏輯
    onTabEnter() {
      if (this.isTeacher || window.app?.isAdmin) {
        this.renderSyncTeacherControls();
      } else {
        const syncContainer = document.getElementById('vqSyncTeacherControls');
        if (syncContainer) { syncContainer.style.display = 'none'; syncContainer.innerHTML = ''; }
        const selfContainer = document.getElementById('vqSelfTeacherControls');
        if (selfContainer) { selfContainer.style.display = 'none'; selfContainer.innerHTML = ''; }
      }
      if (this.lastSession && this.lastSession.status !== 'idle') {
        const studentNotice = document.getElementById('vqSyncStudentIdleNotice');
        const activeWrapper = document.getElementById('vqSyncActivePlayerWrapper');
        if (studentNotice) studentNotice.style.display = 'none';
        if (activeWrapper) activeWrapper.style.display = 'block';

        if (!this.playerType || !this.isPlayerReady) {
          if (this.isTeacher || window.app?.isAdmin) {
            // 教師端：建立播放器統一播放
            if (this.lastSession.quizData) {
              this.activeQuiz = this.lastSession.quizData;
              this.setupPlayer('vqSyncPlayerContainer', this.lastSession.quizData.videoUrl, () => {
                if (this.lastSession.status === 'playing') this.playVideo();
              });
            } else if (this.lastSession.quizId) {
              const matched = (this.quizzes || []).find(q => q.id === this.lastSession.quizId);
              if (matched) {
                this.activeQuiz = matched;
                this.setupPlayer('vqSyncPlayerContainer', matched.videoUrl, () => {
                  if (this.lastSession.status === 'playing') this.playVideo();
                });
              }
            }
          } else {
            // 學生端：在全班同步模式下顯示該則影片，但不要自動播放
            const quiz = this.lastSession.quizData || (this.quizzes || []).find(q => q.id === this.lastSession.quizId);
            if (quiz && quiz.videoUrl) {
              this.activeQuiz = quiz;
              this.setupPlayer('vqSyncPlayerContainer', quiz.videoUrl, () => {
                this.pauseVideo();
              });
            } else if (quiz) {
              this.renderStudentSyncWaitingScreen(quiz);
            }
          }
        }

        if (this.lastSession.status === 'question' && this.lastSession.currentQuestion && !this.isTeacher && !window.app?.isAdmin) {
          this.showQuestionOverlay(this.lastSession.currentQuestion, false);
        }
      }
    }

    // 綁定 UI 事件
    bindEvents() {
      const modeTabs = document.querySelectorAll('.video-quiz-mode-tab');
      modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const mode = tab.dataset.mode;
          this.switchMode(mode);
        });
      });

      // 編輯器影片載入按鈕
      const loadBtn = document.getElementById('vqEditorLoadVideoBtn');
      if (loadBtn) {
        loadBtn.addEventListener('click', () => this.loadEditorVideo());
      }



      // 編輯器時間點新增按鈕
      const addQBtn = document.getElementById('vqEditorAddQuestionBtn');
      if (addQBtn) {
        addQBtn.addEventListener('click', () => this.openAddQuestionModal());
      }

      // 儲存測驗按鈕
      const saveQuizBtn = document.getElementById('vqEditorSaveQuizBtn');
      if (saveQuizBtn) {
        saveQuizBtn.addEventListener('click', () => this.saveEditingQuiz());
      }

      // 需求 3：指定播放起訖點雙滑桿與快速設定按鈕事件監聽
      const rangeStartInput = document.getElementById('vqRangeStartInput');
      const rangeEndInput = document.getElementById('vqRangeEndInput');
      if (rangeStartInput && rangeEndInput) {
        rangeStartInput.addEventListener('input', (e) => {
          let s = parseInt(e.target.value, 10);
          let eVal = parseInt(rangeEndInput.value, 10);
          if (s > eVal) {
            rangeEndInput.value = s;
            eVal = s;
          }
          this.updateTimeRangeUI(s, eVal, parseInt(rangeStartInput.max, 10));
          if (this.editingQuiz) {
            this.editingQuiz.startTime = s;
            this.editingQuiz.endTime = eVal;
          }
        });

        rangeEndInput.addEventListener('input', (e) => {
          let eVal = parseInt(e.target.value, 10);
          let s = parseInt(rangeStartInput.value, 10);
          if (eVal < s) {
            rangeStartInput.value = eVal;
            s = eVal;
          }
          this.updateTimeRangeUI(s, eVal, parseInt(rangeEndInput.max, 10));
          if (this.editingQuiz) {
            this.editingQuiz.startTime = s;
            this.editingQuiz.endTime = eVal;
          }
        });
      }

      const setStartBtn = document.getElementById('vqSetStartCurrentBtn');
      if (setStartBtn) {
        setStartBtn.addEventListener('click', () => {
          const validTime = this.getValidCurrentTime();
          if (validTime === null) {
            if (window.app) window.app.showNotification('提示', '播放器尚未就緒，無法取得有效播放時間！請先載入影音檔案。');
            return;
          }
          let cur = Math.round(validTime);
          let max = parseInt(rangeStartInput?.max || 100, 10);
          if (cur > max) {
            max = cur + 30;
            if (rangeStartInput) rangeStartInput.max = max;
            if (rangeEndInput) rangeEndInput.max = max;
          }
          let curEnd = parseInt(rangeEndInput?.value || max, 10);
          if (cur > curEnd) curEnd = cur;
          this.updateTimeRangeUI(cur, curEnd, max);
          if (this.editingQuiz) {
            this.editingQuiz.startTime = cur;
            this.editingQuiz.endTime = curEnd;
          }
        });
      }

      const setEndBtn = document.getElementById('vqSetEndCurrentBtn');
      if (setEndBtn) {
        setEndBtn.addEventListener('click', () => {
          const validTime = this.getValidCurrentTime();
          if (validTime === null) {
            if (window.app) window.app.showNotification('提示', '播放器尚未就緒，無法取得有效播放時間！請先載入影音檔案。');
            return;
          }
          let cur = Math.round(validTime);
          let max = parseInt(rangeEndInput?.max || 100, 10);
          if (cur > max) {
            max = cur + 30;
            if (rangeStartInput) rangeStartInput.max = max;
            if (rangeEndInput) rangeEndInput.max = max;
          }
          let curStart = parseInt(rangeStartInput?.value || 0, 10);
          if (cur < curStart) curStart = cur;
          this.updateTimeRangeUI(curStart, cur, max);
          if (this.editingQuiz) {
            this.editingQuiz.startTime = curStart;
            this.editingQuiz.endTime = cur;
          }
        });
      }

      const resetRangeBtn = document.getElementById('vqResetRangeBtn');
      if (resetRangeBtn) {
        resetRangeBtn.addEventListener('click', () => {
          const max = Math.round(this.duration || parseInt(rangeStartInput?.max || 100, 10));
          this.updateTimeRangeUI(0, max, max);
          if (this.editingQuiz) {
            this.editingQuiz.startTime = 0;
            this.editingQuiz.endTime = max;
          }
        });
      }

      // 題目秒數手動輸入與格式化時間 (分:秒) 即時雙向互通連動
      const qTimeInput = document.getElementById('vqQuestionTimeInput');
      const qTimeFormattedEl = document.getElementById('vqQuestionTimeFormatted');

      if (qTimeInput) {
        qTimeInput.addEventListener('input', (e) => {
          const sec = Math.max(0, parseInt(e.target.value || 0, 10));
          if (qTimeFormattedEl) qTimeFormattedEl.value = this.formatTime(sec);
        });
      }

      if (qTimeFormattedEl) {
        qTimeFormattedEl.addEventListener('input', (e) => {
          const sec = this.parseTimeString(e.target.value);
          if (qTimeInput) qTimeInput.value = sec;
        });
      }

      // 需求 5：點擊遮罩外側背景自動關閉彈窗
      const overlaysToDismiss = [
        { id: 'vqAnalyticsModal', close: () => this.closeClassAnalytics() },
        { id: 'vqCustomSetModal', close: () => this.closeCustomSetModal() },
        { id: 'vqEditCustomSetNameModal', close: () => this.closeEditCustomSetNameModal() },
        { id: 'vqEditQuizModal', close: () => this.closeEditQuizModal() },
        { id: 'vqFormatGuideModal', close: () => this.closeFormatGuideModal() },
        { id: 'vqImportModal', close: () => this.closeImportModal() }
      ];
      overlaysToDismiss.forEach(({ id, close }) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('click', (e) => {
            if (e.target === el) close();
          });
        }
      });
    }

    // 切換模式：'sync' (全班同步) | 'self' (自主學習) | 'editor' (出題管理)
    switchMode(mode) {
      this.currentMode = mode;
      
      document.querySelectorAll('.video-quiz-mode-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
      });

      const syncSec = document.getElementById('vqSyncSection');
      const selfSec = document.getElementById('vqSelfSection');
      const editorSec = document.getElementById('vqEditorSection');

      if (syncSec) syncSec.style.display = mode === 'sync' ? 'block' : 'none';
      if (selfSec) selfSec.style.display = mode === 'self' ? 'block' : 'none';
      if (editorSec) editorSec.style.display = mode === 'editor' ? 'block' : 'none';

      // 停止先前播放器避免背景繼續發聲
      this.pauseVideo();

      if (mode === 'editor') {
        this.renderEditorQuizList();
      } else if (mode === 'self' && this.activeQuiz) {
        this.startSelfPacedQuiz(this.activeQuiz.id);
      } else if (mode === 'sync') {
        this.handleRemoteSessionUpdate(this.lastSession);
      }
    }

    // 渲染主畫面與後台測驗選擇選單
    renderQuizSelector() {
      const selects = [
        document.getElementById('vqAdminQuizSelect'),
        document.getElementById('vqSyncQuizSelect'),
        document.getElementById('vqSelfQuizSelect')
      ];

      selects.forEach(sel => {
        if (!sel) return;
        const isAdminSel = (sel.id === 'vqAdminQuizSelect');
        const curVal = sel.value;
        let html = '';

        if (this.customSets && this.customSets.length > 0) {
          html += `<optgroup label="🌟 測驗組合">` +
            this.customSets.map(s => `
              <option value="custom:${s.id}">🌟 ${this.escapeHtml(s.name)} (共 ${s.quizIds?.length || s.quizCount || 0} 部影片 · ${s.totalQuestions || 0} 題)</option>
            `).join('') +
            `</optgroup>`;
        }

        const candidateQuizzes = isAdminSel 
          ? this.quizzes 
          : this.quizzes.filter(q => q.enabled !== false);

        if (candidateQuizzes.length > 0) {
          html += `<optgroup label="${isAdminSel ? '🎬 所有影片測驗庫' : '🎬 開放測驗影片'}">` +
            candidateQuizzes.map(q => {
              const qCount = q.questions?.length || 0;
              const statusText = isAdminSel ? (q.enabled !== false ? ' [🟢 開放]' : ' [⚪ 隱藏]') : '';
              return `<option value="${q.id}">🎬 ${this.escapeHtml(q.title)}${statusText} (${qCount} 題)</option>`;
            }).join('') +
            `</optgroup>`;
        } else if (!isAdminSel) {
          html += `<option value="">⚠️ 目前尚無開放測驗的影片</option>`;
        }

        sel.innerHTML = html;
        if (curVal && (this.quizzes.some(q => q.id === curVal) || (this.customSets && this.customSets.some(s => `custom:${s.id}` === curVal)))) {
          sel.value = curVal;
        }
      });
    }

    // 更新管理後台廣播狀態 UI
    updateAdminBroadcastUI(session) {
      const badge = document.getElementById('vqAdminBroadcastStatusBadge');
      const forceStopBtn = document.getElementById('vqAdminForceStopBtn');
      const activeControls = document.getElementById('vqAdminActiveControls');
      const currentTitle = document.getElementById('vqAdminCurrentQuizTitle');
      const currentProgress = document.getElementById('vqAdminCurrentQuizProgress');
      const activeRow = document.getElementById('vqActiveActionRow');

      const isSyncActive = session && session.status && session.status !== 'idle';
      const isSelfActive = this.globalMode === 'self' && this.hasAssignedSelfQuiz;
      const isAnyActive = isSyncActive || isSelfActive;

      if (activeRow) {
        activeRow.style.display = isAnyActive ? 'flex' : 'none';
      }

      if (!session || session.status === 'idle') {
        if (badge) {
          if (this.globalMode === 'self') {
            badge.textContent = '🟢 自主學習中';
            badge.style.background = '#34c759';
          } else {
            badge.textContent = '⚪ 未發起測驗';
            badge.style.background = 'var(--text-muted)';
          }
        }
        if (forceStopBtn) forceStopBtn.style.display = isSelfActive ? 'inline-block' : 'none';
        if (activeControls) activeControls.style.display = 'none';
        return;
      }

      if (forceStopBtn) forceStopBtn.style.display = 'inline-block';
      if (activeControls) activeControls.style.display = 'block';
      if (currentTitle) {
        currentTitle.textContent = `當前測驗：${session.quizData?.title || '全班同步測驗'}`;
      }

      if (badge) {
        if (session.status === 'playing') {
          badge.textContent = '🟢 正在播放中';
          badge.style.background = 'var(--success-color)';
        } else if (session.status === 'question') {
          const qIdx = (session.currentQuestionIndex ?? -1) + 1;
          badge.textContent = `🟡 測驗作答中 (第 ${qIdx} 題)`;
          badge.style.background = '#ff9500';
        } else if (session.status === 'completed') {
          badge.textContent = '🔵 測驗已結束';
          badge.style.background = '#007aff';
        } else {
          badge.textContent = '🟣 準備中';
          badge.style.background = '#5856d6';
        }
      }

      if (currentProgress) {
        if (session.status === 'playing') {
          currentProgress.textContent = `狀態：影片同步播放中...`;
        } else if (session.status === 'question') {
          const q = session.currentQuestion;
          currentProgress.textContent = `狀態：作答中 -「${q?.prompt || ''}」`;
        } else if (session.status === 'completed') {
          currentProgress.textContent = `狀態：全體測驗完成，已統計成績`;
        } else {
          currentProgress.textContent = `狀態：等待開始播放...`;
        }
      }
    }

    // 從後台發起所選測驗 (依當前模式：同步廣播或指派自主學習)
    startAdminSelectedQuiz() {
      const select = document.getElementById('vqAdminQuizSelect');
      const quizId = select ? select.value : (this.activeQuiz ? this.activeQuiz.id : null);
      if (!quizId) {
        if (window.app) window.app.showNotification('提示', '請先選擇測驗單元！');
        return;
      }

      if (this.globalMode === 'self') {
        this.hasAssignedSelfQuiz = true;
        this.applyGlobalMode('self');
        this.startSelfPacedQuiz(quizId);
        if (this.settingsRef) {
          this.settingsRef.update({
            mode: 'self',
            assignedQuizId: quizId,
            updatedAt: Date.now()
          });
        }
        if (window.app && typeof window.app.switchToTab === 'function') {
          window.app.switchToTab('panel-video-quiz');
        }
        if (window.app) {
          const quizTitle = this.activeQuiz?.title || '指定單元';
          window.app.showNotification('自主學習', `已指派「${quizTitle}」，學生端同步切換至此測驗！`);
        }
      } else {
        this.startSyncQuizAsTeacher(quizId);
      }
    }

    // 選取指定測驗
    selectQuiz(quizId) {
      if (typeof quizId === 'string' && quizId.startsWith('custom:')) {
        const setId = quizId.replace('custom:', '');
        const set = (this.customSets || []).find(s => s.id === setId);
        if (set) {
          const firstQuizId = (set.quizIds && set.quizIds[0]) || set.quizId;
          const parent = this.quizzes.find(q => q.id === firstQuizId);
          if (parent) {
            const cloned = JSON.parse(JSON.stringify(parent));
            cloned.id = `custom_${set.id}`;
            cloned.title = `🌟 ${set.name}`;
            cloned.description = `【測驗組合】內含 ${set.quizIds?.length || set.quizCount || 1} 部影片，共 ${set.totalQuestions || parent.questions?.length || 0} 題測驗`;
            this.activeQuiz = cloned;
          }
        }
      } else {
        const quiz = this.quizzes.find(q => q.id === quizId);
        if (!quiz) return;
        this.activeQuiz = quiz;
      }

      const descEls = [
        document.getElementById('vqSyncQuizDesc'),
        document.getElementById('vqSelfQuizDesc')
      ];
      descEls.forEach(el => {
        if (el) el.textContent = this.activeQuiz ? (this.activeQuiz.description || '') : '';
      });
    }

    // 解析 YouTube 網址取得 11 碼 ID
    extractYoutubeId(url) {
      if (!url) return null;
      const reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
      const match = url.match(reg);
      return match ? match[1] : null;
    }



    // 取得播放器目前的有效時間 (若尚未就緒回傳 null，絕不可轉為 0；合法 0 秒仍回傳 0)
    getValidCurrentTime() {
      if (!this.isPlayerReady) return null;
      if (this.playerType === 'html5' && this.html5Player) {
        const t = this.html5Player.currentTime;
        return (typeof t === 'number' && !isNaN(t)) ? t : null;
      }
      if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
        const t = this.ytPlayer.getCurrentTime();
        return (typeof t === 'number' && !isNaN(t)) ? t : null;
      }
      return null;
    }

    // 更新出題編輯器就緒狀態與按鈕狀態
    updateEditorReadyState(isReady) {
      const statusEl = document.getElementById('vqEditorPlayerStatus');
      const addBtn = document.getElementById('vqEditorAddQuestionBtn');
      const startBtn = document.getElementById('vqSetStartCurrentBtn');
      const endBtn = document.getElementById('vqSetEndCurrentBtn');

      if (isReady) {
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: var(--success-color); font-weight: bold;">🟢 播放器已就緒 (總長：${this.formatTime(this.duration)})</span>`;
        }
        if (addBtn) {
          addBtn.disabled = false;
          addBtn.style.opacity = '1';
          addBtn.style.cursor = 'pointer';
        }
        if (startBtn) {
          startBtn.disabled = false;
          startBtn.style.opacity = '1';
          startBtn.style.cursor = 'pointer';
        }
        if (endBtn) {
          endBtn.disabled = false;
          endBtn.style.opacity = '1';
          endBtn.style.cursor = 'pointer';
        }
      } else {
        if (statusEl && !statusEl.innerHTML.includes('正在從')) {
          statusEl.innerHTML = `<span style="color: var(--text-secondary);">⏳ 播放器尚未就緒（請先載入影音）</span>`;
        }
        if (addBtn) {
          addBtn.disabled = true;
          addBtn.style.opacity = '0.5';
          addBtn.style.cursor = 'not-allowed';
        }
        if (startBtn) {
          startBtn.disabled = true;
          startBtn.style.opacity = '0.5';
          startBtn.style.cursor = 'not-allowed';
        }
        if (endBtn) {
          endBtn.disabled = true;
          endBtn.style.opacity = '0.5';
          endBtn.style.cursor = 'not-allowed';
        }
      }
    }

    // 瀏覽器阻擋自動播放提示
    showAutoplayBlockedNotice() {
      let banner = document.getElementById('vqAutoplayBlockedBanner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'vqAutoplayBlockedBanner';
        banner.style.cssText = 'position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1e293b; color: white; border: 1.5px solid #38bdf8; padding: 10px 22px; border-radius: 30px; box-shadow: 0 4px 16px rgba(0,0,0,0.3); z-index: 9999; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: bold; cursor: pointer;';
        banner.innerHTML = `<span>▶ 瀏覽器阻擋自動播放，點擊此處繼續播放影片</span>`;
        banner.onclick = () => {
          this.playVideo();
          this.hideAutoplayBlockedNotice();
        };
        document.body.appendChild(banner);
      }
      banner.style.display = 'flex';
    }

    hideAutoplayBlockedNotice() {
      const banner = document.getElementById('vqAutoplayBlockedBanner');
      if (banner) banner.style.display = 'none';
    }

    // ==========================================
    // 播放器封裝 (YouTube IFrame & HTML5 Video)
    // ==========================================

    setupPlayer(containerId, videoUrl, onReadyCallback, onTimeUpdateCallback) {
      const container = document.getElementById(containerId);
      if (!container) return;

      this.destroyPlayer();
      container.innerHTML = '';
      this.isPlayerReady = false;
      this.updateEditorReadyState(false);

      const ytId = this.extractYoutubeId(videoUrl);

      if (ytId) {
        this.playerType = 'youtube';
        const playerDivId = containerId + '_yt_frame';
        container.innerHTML = `<div id="${playerDivId}" style="width: 100%; height: 100%;"></div>`;

        const initYT = () => {
          try {
            this.ytPlayer = new YT.Player(playerDivId, {
              height: '100%',
              width: '100%',
              videoId: ytId,
              playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
                enablejsapi: 1,
                origin: window.location.origin
              },
              events: {
                onReady: (event) => {
                  this.isPlayerReady = true;
                  this.duration = this.ytPlayer.getDuration() || 0;
                  this.updateEditorReadyState(true);
                  if (containerId === 'vqEditorPlayerContainer') {
                    const dur = Math.round(this.duration || 0);
                    if (dur > 0) {
                      const s = this.editingQuiz?.startTime || 0;
                      const e = (this.editingQuiz?.endTime && this.editingQuiz.endTime <= dur) ? this.editingQuiz.endTime : dur;
                      this.updateTimeRangeUI(s, e, dur);
                    }
                  } else if (this.activeQuiz && this.activeQuiz.startTime > 0) {
                    this.seekTo(this.activeQuiz.startTime);
                  }
                  // 同步模式下的學生端：嚴格保持靜音與暫停，絕不自動播放音訊或影片
                  if (containerId === 'vqSyncPlayerContainer' && !this.isTeacher && !window.app?.isAdmin) {
                    try { if (typeof this.ytPlayer.mute === 'function') this.ytPlayer.mute(); } catch (e) {}
                    try { if (typeof this.ytPlayer.pauseVideo === 'function') this.ytPlayer.pauseVideo(); } catch (e) {}
                  }
                  if (typeof onReadyCallback === 'function') onReadyCallback(this);
                },
                onStateChange: (event) => {
                  this.isPlaying = (event.data === YT.PlayerState.PLAYING);
                  if (this.isPlaying) this.hideAutoplayBlockedNotice();
                  if (event.data === YT.PlayerState.ENDED) {
                    this.handleVideoEnded();
                  }
                }
              }
            });
          } catch (e) {
            console.error('Failed to init YouTube Player', e);
          }
        };

        if (window.YT && window.YT.Player) {
          initYT();
        } else {
          this.loadYoutubeAPI(initYT);
        }
      } else {
        // HTML5 本地或直連影片 (例如 MP4)
        this.playerType = 'html5';
        const videoEl = document.createElement('video');
        videoEl.src = videoUrl;
        videoEl.controls = true;
        videoEl.autoplay = false;
        videoEl.playsInline = true;
        if (containerId === 'vqSyncPlayerContainer' && !this.isTeacher && !window.app?.isAdmin) {
          videoEl.muted = true;
        }
        videoEl.style.width = '100%';
        videoEl.style.height = '100%';
        videoEl.style.objectFit = 'contain';
        videoEl.style.background = '#000';
        container.appendChild(videoEl);
        this.html5Player = videoEl;

        videoEl.onerror = () => {
          if (this.isPlayerReady && videoEl.duration > 0) return;
          console.warn('Video load error:', videoUrl);
          this.isPlayerReady = false;
          this.updateEditorReadyState(false);
        };

        videoEl.onloadedmetadata = () => {
          this.isPlayerReady = true;
          this.duration = videoEl.duration || 0;
          this.updateEditorReadyState(true);
          if (containerId === 'vqEditorPlayerContainer') {
            const dur = Math.round(this.duration || 0);
            if (dur > 0) {
              const s = this.editingQuiz?.startTime || 0;
              const e = (this.editingQuiz?.endTime && this.editingQuiz.endTime <= dur) ? this.editingQuiz.endTime : dur;
              this.updateTimeRangeUI(s, e, dur);
            }
          } else if (this.activeQuiz && this.activeQuiz.startTime > 0) {
            this.seekTo(this.activeQuiz.startTime);
          }
          if (typeof onReadyCallback === 'function') onReadyCallback(this);
        };

        videoEl.ontimeupdate = () => {
          if (!this.isPlayerReady) return;
          const t = videoEl.currentTime;
          this.currentTime = t;
          if (typeof onTimeUpdateCallback === 'function') {
            onTimeUpdateCallback(t);
          }
          this.checkTimeline(t);
        };

        videoEl.onplay = () => {
          this.isPlaying = true;
          this.hideAutoplayBlockedNotice();
        };

        videoEl.onpause = () => {
          this.isPlaying = false;
        };

        videoEl.onended = () => {
          this.handleVideoEnded();
        };
      }

      // 時間輪詢備援 (僅讀取真實時間，絕對不累加虛擬秒數)
      this.pollTimer = setInterval(() => {
        if (!this.isPlayerReady) return;
        let t = 0;
        if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
          t = this.ytPlayer.getCurrentTime() || 0;
          this.currentTime = t;
          if (typeof onTimeUpdateCallback === 'function') onTimeUpdateCallback(t);
          this.checkTimeline(t);
        } else if (this.playerType === 'html5' && this.html5Player) {
          t = this.html5Player.currentTime || 0;
          this.currentTime = t;
        }
      }, 250);
    }

    destroyPlayer() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
      if (this.ytPlayer && typeof this.ytPlayer.destroy === 'function') {
        try { this.ytPlayer.destroy(); } catch (e) {}
        this.ytPlayer = null;
      }
      if (this.html5Player) {
        try {
          this.html5Player.pause();
          this.html5Player.removeAttribute('src');
          this.html5Player.load();
        } catch (e) {}
        this.html5Player = null;
      }
      this.playerType = null;
      this.isPlaying = false;
      this.isPlayerReady = false;
      this.currentTime = 0;
      this.duration = 0;
      this.lastMediaTime = null;
      this.isQuestionOverlayShowing = false;
      this.hideAutoplayBlockedNotice();
      this.updateEditorReadyState(false);
    }

    playVideo() {
      if (!this.isPlayerReady) return;
      if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
        this.ytPlayer.playVideo();
        this.isPlaying = true;
        this.hideAutoplayBlockedNotice();
      } else if (this.playerType === 'html5' && this.html5Player) {
        const playPromise = this.html5Player.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.isPlaying = true;
            this.hideAutoplayBlockedNotice();
          }).catch((err) => {
            console.warn('Playback prevented by browser autoplay policy:', err);
            this.isPlaying = false;
            this.showAutoplayBlockedNotice();
          });
        }
      }
    }

    pauseVideo() {
      if (!this.isPlayerReady) return;
      if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
        this.ytPlayer.pauseVideo();
      } else if (this.playerType === 'html5' && this.html5Player) {
        this.html5Player.pause();
      }
      this.isPlaying = false;
    }

    seekTo(seconds) {
      if (!this.isPlayerReady) return;
      const sec = Math.max(0, seconds);
      if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
        this.ytPlayer.seekTo(sec, true);
      } else if (this.playerType === 'html5' && this.html5Player) {
        this.html5Player.currentTime = sec;
      }
      this.currentTime = sec;
      this.lastMediaTime = sec;
    }

    // 時間檢查核心引擎：防止漏題、防多題重複觸發、支援快進與倒轉出題規則
    checkTimeline(currentTime) {
      if (this.isQuestionOverlayShowing || this.currentActiveQuestion) return;

      if (this.activeQuiz && this.activeQuiz.endTime > 0 && this.activeQuiz.endTime > (this.activeQuiz.startTime || 0)) {
        if (currentTime >= this.activeQuiz.endTime) {
          this.pauseVideo();
          this.handleVideoEnded();
          return;
        }
      }

      if (this.currentMode === 'sync') {
        if (this.isTeacher) {
          this.handleTeacherTimelineTick(currentTime);
        }
      } else if (this.currentMode === 'self') {
        this.handleSelfTimelineTick(currentTime);
      }
    }



    loadYoutubeAPI(callback) {
      if (window.YT && window.YT.Player) {
        if (typeof callback === 'function') callback();
        return;
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') prev();
        if (typeof callback === 'function') callback();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const first = document.getElementsByTagName('script')[0];
        if (first && first.parentNode) {
          first.parentNode.insertBefore(tag, first);
        } else {
          document.head.appendChild(tag);
        }
      }
    }

    // ==========================================
    // 情境 A：全班同步播放測驗 (Teacher-led Sync)
    // ==========================================

    // 老師發起全班同步測驗
    startSyncQuizAsTeacher(quizId, customQuizData = null) {
      let quiz = customQuizData;
      if (!quiz) {
        if (typeof quizId === 'string' && quizId.startsWith('custom:')) {
          const setId = quizId.replace('custom:', '');
          const set = (this.customSets || []).find(s => s.id === setId);
          if (set) {
            const subQuizIds = (set.quizIds && set.quizIds.length > 0) ? set.quizIds : [set.quizId || 'vq_science_solar'];
            const allSubQuizzes = subQuizIds.map(id => this.quizzes.find(q => q.id === id)).filter(Boolean);
            this.currentCustomSet = set;
            this.currentSetQuizIndex = 0;
            const currentSubQuiz = allSubQuizzes[0] || this.quizzes[0];

            quiz = JSON.parse(JSON.stringify(currentSubQuiz));
            quiz.id = `custom_${set.id}`;
            quiz.customSetId = set.id;
            quiz.customSetName = set.name;
            quiz.currentSubQuizIndex = 0;
            quiz.totalSubQuizzes = allSubQuizzes.length;
            quiz.allSubQuizIds = subQuizIds;
            quiz.allSubQuizzes = allSubQuizzes;
            quiz.allQuestions = allSubQuizzes.flatMap((sq, sqIdx) => 
              (sq.questions || []).map(q => ({
                ...q,
                videoTitle: sq.title,
                videoIndex: sqIdx + 1
              }))
            );
            quiz.title = `🌟 ${set.name}`;
            quiz.description = `【測驗組合】第 1/${allSubQuizzes.length} 部：《${currentSubQuiz.title}》（共 ${quiz.allQuestions.length} 題測驗）`;
          }
        } else {
          quiz = this.quizzes.find(q => q.id === quizId) || this.activeQuiz;
          this.currentCustomSet = null;
          this.currentSetQuizIndex = 0;
        }
      }
      if (!quiz) {
        if (window.app) window.app.showNotification('錯誤', '請先選擇有效的影片測驗！');
        return;
      }
      this.activeQuiz = quiz;
      this.isTeacher = true;
      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;
      this.lastMediaTime = null;
      this.lastTeacherTickTime = 0;
      this.currentSyncSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      this.syncEventSeq = 0;
      this.handledEventIds = new Set();
      this.isQuestionOverlayShowing = false;

      // 清除前次作答記錄
      if (this.answersRef) {
        this.answersRef.remove();
      }

      // 確保同步資料乾淨
      const cleanQuiz = JSON.parse(JSON.stringify(quiz));
      if (cleanQuiz.id === 'vq_eye_cells' || (cleanQuiz.title && cleanQuiz.title.includes('視錐細胞與視桿細胞'))) {
        cleanQuiz.videoUrl = 'https://www.youtube.com/watch?v=J4BJB48jdfw';
        cleanQuiz.youtubeId = 'J4BJB48jdfw';
        quiz.videoUrl = 'https://www.youtube.com/watch?v=J4BJB48jdfw';
        quiz.youtubeId = 'J4BJB48jdfw';
      }

      // 設定 Firebase 同步廣播狀態
      const sessionData = {
        sessionId: this.currentSyncSessionId,
        status: 'waiting',
        quizId: quiz.id,
        quizData: cleanQuiz,
        currentSubQuizIndex: this.currentSetQuizIndex || 0,
        currentTime: 0,
        currentQuestionIndex: -1,
        questionStartTime: 0,
        allowRepeat: !!this.allowStudentRepeat,
        createdAt: Date.now()
      };

      this.lastSession = sessionData;

      if (this.sessionRef) {
        this.sessionRef.set(sessionData).then(() => {
          if (window.app) window.app.showNotification('成功', `已發起「${quiz.title}」全班同步測驗！`);
        });
      }

      // 隱藏閒置提示，開啟播放器容器
      const studentNotice = document.getElementById('vqSyncStudentIdleNotice');
      const activeWrapper = document.getElementById('vqSyncActivePlayerWrapper');
      if (studentNotice) studentNotice.style.display = 'none';
      if (activeWrapper) activeWrapper.style.display = 'block';

      // 自動切換至「影片出題測驗」前台畫面以供投影與播放
      if (window.app && typeof window.app.switchToTab === 'function') {
        window.app.switchToTab('panel-video-quiz');
      }

      // 教師端載入播放器並監聽時間點
      this.setupPlayer('vqSyncPlayerContainer', quiz.videoUrl, () => {
        this.renderSyncTeacherControls();
      }, (time) => {
        this.handleTeacherTimelineTick(time);
      });
    }

    // 停止全班同步測驗
    stopSyncQuiz() {
      if (this.sessionRef) {
        this.sessionRef.set({ status: 'idle', sessionId: null, updatedAt: Date.now() });
      }
      if (this.settingsRef) {
        this.settingsRef.update({ mode: 'sync', assignedQuizId: null, updatedAt: Date.now() });
      }
      this.globalMode = 'sync';
      this.hasAssignedSelfQuiz = false;
      this.destroyPlayer();
      this.hideQuestionOverlay();
      this.currentSyncSessionId = null;
      this.handledEventIds.clear();
      this.lastSession = { status: 'idle' };
      this.updateAdminBroadcastUI(this.lastSession);
      const activeRow = document.getElementById('vqActiveActionRow');
      if (activeRow) activeRow.style.display = 'none';
      if (window.app && typeof window.app.updateAdminActiveActivitiesUI === 'function') {
        window.app.updateAdminActiveActivitiesUI();
      }

      const ctrls = document.getElementById('vqSyncTeacherControls');
      if (ctrls) ctrls.style.display = 'none';

      const studentNotice = document.getElementById('vqSyncStudentIdleNotice');
      const activeWrapper = document.getElementById('vqSyncActivePlayerWrapper');
      if (studentNotice) studentNotice.style.display = 'block';
      if (activeWrapper) activeWrapper.style.display = 'none';

      const link = document.getElementById('vqAdminQuickLinkWrapper');
      if (link) link.style.display = (this.isTeacher || window.app?.isAdmin) ? 'block' : 'none';

      // 需求 7：在後台（或老師結束測驗）按下結束測驗時，應回到管理後台分頁（panel-admin）
      if (window.app && typeof window.app.switchToTab === 'function') {
        if (window.app.isAdmin || this.isTeacher || document.getElementById('panel-admin')?.classList.contains('active')) {
          window.app.switchToTab('panel-admin');
          const videoSection = document.getElementById('adminVideoQuizSection');
          if (videoSection && videoSection.classList.contains('collapsed')) {
            videoSection.classList.remove('collapsed');
          }
        }
      }

      this.currentCustomSet = null;
      this.currentSetQuizIndex = 0;
      if (window.app) window.app.showNotification('提示', '全班同步測驗已結束，已返回管理後台！');
    }

    // 核心時間軸判斷引擎：防止漏題、防重複出題、支援快進停在首題、向後重播依設定處理
    processTimelineTick(currentTime, isTeacherMode) {
      if (!this.activeQuiz || !this.activeQuiz.questions || this.activeQuiz.questions.length === 0) return;
      if (this.isQuestionOverlayShowing || this.currentActiveQuestion) return;

      const questions = this.activeQuiz.questions;
      if (typeof this.lastMediaTime !== 'number') {
        this.lastMediaTime = currentTime;
        return;
      }
      const lastTime = this.lastMediaTime;

      // 檢查片段播放終點 (Clip End)
      if (this.activeQuiz.endTime > 0 && this.activeQuiz.endTime > (this.activeQuiz.startTime || 0)) {
        if (currentTime >= this.activeQuiz.endTime) {
          this.pauseVideo();
          this.handleVideoEnded();
          return;
        }
      }

      // 判斷時間軸方向與拖曳跳躍 (倍速播放時 delta 通常 <= 1.0s，拖曳通常 > 1.5s)
      const isBackward = (currentTime < lastTime - 1.0);
      const isForwardSeek = (currentTime > lastTime + 2.0);

      // 向後拖曳 (回溯或重播)
      if (isBackward) {
        if (this.allowStudentRepeat) {
          // 已勾選：重新經過題目時間時可以再次出題，清除當前時間點之後的已觸發記錄
          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (q.time >= currentTime - 0.5) {
              this.triggeredQuestions.delete(q.id);
            }
          }
        } else {
          // 未勾選：同一輪測驗已出過的題目不再自動出現，保留觸發記錄
        }
        this.lastMediaTime = currentTime;
        return;
      }

      // 暫停或緩衝未推進時間 (不得繼續推進出題判定)
      if (currentTime === lastTime) {
        return;
      }

      // 篩選啟用之題目 (若有設定片段範圍，需在片段範圍內)
      const validQuestions = questions.filter(q => {
        if (q.enabled === false) return false;
        if (this.activeQuiz.startTime > 0 && q.time < this.activeQuiz.startTime) return false;
        if (this.activeQuiz.endTime > 0 && q.time > this.activeQuiz.endTime) return false;
        return true;
      });

      // 向前拖曳跨過多題 (Forward Seek)
      if (isForwardSeek) {
        // 跨越區間 (lastTime, currentTime] 的題目，依時間遞增排序
        const skipped = validQuestions.filter(q => {
          return !this.triggeredQuestions.has(q.id) && q.time > lastTime && q.time <= currentTime;
        }).sort((a, b) => a.time - b.time);

        if (skipped.length > 0) {
          // 預設停在第一道未觸發的題目時間並出題，其餘題目隨後續播放處理
          const firstQ = skipped[0];
          const qIndex = questions.findIndex(q => q.id === firstQ.id);

          this.seekTo(firstQ.time);
          this.currentTime = firstQ.time;
          this.lastMediaTime = firstQ.time;
          this.triggeredQuestions.add(firstQ.id);
          this.pauseVideo();

          if (isTeacherMode) {
            this.broadcastQuestion(firstQ, qIndex);
            this.renderSyncTeacherControls();
          } else {
            this.showQuestionOverlay(firstQ, false);
          }
          return;
        }
      }

      // 正常播放前進 (播放進度跨過題目時間，以區間判斷避免漏題；倍速播放亦能精準捕捉)
      // 區間: (lastTime, currentTime + 0.15]
      // 支援起點 0 秒題目 (若 lastTime <= 0.1 且 currentTime >= 0 且 q.time === 0)
      const triggerCandidates = validQuestions.filter(q => {
        if (this.triggeredQuestions.has(q.id)) return false;
        if (q.time === 0 && lastTime <= 0.1 && currentTime >= 0) return true;
        return q.time > lastTime && q.time <= currentTime + 0.15;
      }).sort((a, b) => a.time - b.time);

      if (triggerCandidates.length > 0) {
        const qToTrigger = triggerCandidates[0];
        const qIndex = questions.findIndex(q => q.id === qToTrigger.id);

        this.triggeredQuestions.add(qToTrigger.id);
        this.lastMediaTime = qToTrigger.time;
        this.pauseVideo();

        if (isTeacherMode) {
          this.broadcastQuestion(qToTrigger, qIndex);
          this.renderSyncTeacherControls();
        } else {
          this.showQuestionOverlay(qToTrigger, false);
        }
        return;
      }

      this.lastMediaTime = currentTime;
    }

    // 教師端播放時間軸偵測出題點
    handleTeacherTimelineTick(currentTime) {
      if (!this.isTeacher) return;
      this.processTimelineTick(currentTime, true);
    }

    // 廣播題目給全班
    broadcastQuestion(question, index) {
      this.currentActiveQuestion = question;
      this.isQuestionOverlayShowing = true;
      this.syncEventSeq = (this.syncEventSeq || 0) + 1;
      const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${this.syncEventSeq}`;
      const sessionId = this.currentSyncSessionId || this.activeQuiz?.id || 'sync_default';

      if (this.sessionRef) {
        // 安全原則：絕對不將 Google 授權憑證或 Blob URL 透過廣播外傳
        const cleanQuestion = JSON.parse(JSON.stringify(question));
        let cleanQuizData = null;
        if (this.activeQuiz) {
          try {
            cleanQuizData = JSON.parse(JSON.stringify(this.activeQuiz));
          } catch (e) {
            cleanQuizData = null;
          }
        }
        this.sessionRef.update({
          status: 'question',
          sessionId: sessionId,
          quizId: this.activeQuiz?.id || null,
          quizData: cleanQuizData,
          questionId: question.id,
          eventId: eventId,
          seq: this.syncEventSeq,
          timestamp: Date.now(),
          currentQuestionIndex: index,
          currentQuestion: cleanQuestion,
          questionStartTime: Date.now(),
          currentTime: this.currentTime || 0,
          allowRepeat: !!this.allowStudentRepeat
        });
      }
      this.showQuestionOverlay(question, true);
    }

    // 需求 3：直接跳轉至指定題目並立即出題 (不一定要照順序)
    jumpToQuestion(index) {
      if (!this.activeQuiz || !this.activeQuiz.questions || !this.activeQuiz.questions[index]) return;
      const q = this.activeQuiz.questions[index];
      this.currentActiveQuestion = q;
      this.triggeredQuestions.add(q.id);

      const targetTime = Math.max(0, (q.time || 0) - 0.5);
      if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
        this.ytPlayer.seekTo(targetTime, true);
        this.pauseVideo();
      } else if (this.playerType === 'html5' && this.html5Player) {
        this.html5Player.currentTime = targetTime;
        this.pauseVideo();
      }

      if (this.currentMode === 'sync') {
        this.broadcastQuestion(q, index);
      } else {
        this.showQuestionOverlay(q, false);
      }
      this.renderSyncTeacherControls();

      if (window.app) {
        window.app.showNotification('跳題出題', `已跳轉至第 ${index + 1} 題 (${q.timeFormatted || this.formatSeconds(q.time)})！`);
      }
    }

    // 需求 4：切換學生端重播重複出題設定
    toggleAllowStudentRepeat(checked) {
      this.allowStudentRepeat = !!checked;
      if (this.sessionRef) {
        this.sessionRef.update({
          allowRepeat: this.allowStudentRepeat
        });
      }
      if (window.app) {
        window.app.showNotification('重複出題設定', `學生端重播時出題：${this.allowStudentRepeat ? '允許重複出題作答' : '已關閉重複出題（已答過的題目略過）'}`);
      }
    }

    // 需求 6：載入測驗組合中指定影片
    loadCustomSetVideo(subIndex) {
      if (!this.currentCustomSet) return;
      const subQuizIds = this.currentCustomSet.quizIds || [];
      if (subIndex < 0 || subIndex >= subQuizIds.length) return;

      this.currentSetQuizIndex = subIndex;
      const allSubQuizzes = subQuizIds.map(id => this.quizzes.find(q => q.id === id)).filter(Boolean);
      const subQuiz = allSubQuizzes[subIndex];
      if (!subQuiz) return;

      this.activeQuiz = JSON.parse(JSON.stringify(subQuiz));
      this.activeQuiz.id = `custom_${this.currentCustomSet.id}`;
      this.activeQuiz.customSetId = this.currentCustomSet.id;
      this.activeQuiz.customSetName = this.currentCustomSet.name;
      this.activeQuiz.currentSubQuizIndex = subIndex;
      this.activeQuiz.totalSubQuizzes = allSubQuizzes.length;
      this.activeQuiz.allSubQuizIds = subQuizIds;
      this.activeQuiz.allSubQuizzes = allSubQuizzes;
      this.activeQuiz.allQuestions = allSubQuizzes.flatMap((sq, sqIdx) => 
        (sq.questions || []).map(q => ({
          ...q,
          videoTitle: sq.title,
          videoIndex: sqIdx + 1
        }))
      );
      this.activeQuiz.title = `🌟 ${this.currentCustomSet.name}`;
      this.activeQuiz.description = `【測驗組合】第 ${subIndex + 1}/${allSubQuizzes.length} 部：《${subQuiz.title}》（共 ${this.activeQuiz.allQuestions.length} 題測驗）`;

      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;
      this.lastTeacherTickTime = 0;

      if (this.sessionRef) {
        this.sessionRef.update({
          status: 'playing',
          currentSubQuizIndex: subIndex,
          quizData: this.activeQuiz,
          currentTime: 0,
          currentQuestionIndex: -1,
          currentQuestion: null,
          allowRepeat: !!this.allowStudentRepeat
        });
      }

      this.setupPlayer('vqSyncPlayerContainer', subQuiz.videoUrl, () => {
        this.renderSyncTeacherControls();
        this.playVideo();
      }, (time) => {
        this.handleTeacherTimelineTick(time);
      });

      if (window.app) {
        window.app.showNotification('影片切換', `正在播放第 ${subIndex + 1}/${allSubQuizzes.length} 部影片：《${subQuiz.title}》`);
      }
    }

    // 切換上一部或下一部影片 (delta: -1 或 +1)
    switchCustomSetVideo(delta) {
      if (!this.currentCustomSet) return;
      const targetIndex = this.currentSetQuizIndex + delta;
      this.loadCustomSetVideo(targetIndex);
    }

    // 需求 6：影片播放結束時自動銜接下一部影片
    handleVideoEnded() {
      if (this.currentCustomSet && this.currentCustomSet.quizIds && this.currentCustomSet.quizIds.length > 1) {
        if (this.currentSetQuizIndex < this.currentCustomSet.quizIds.length - 1) {
          const nextIndex = this.currentSetQuizIndex + 1;
          if (this.isTeacher) {
            if (window.app) {
              window.app.showNotification('提示', `第 ${this.currentSetQuizIndex + 1} 部影片播放結束，即將自動播放第 ${nextIndex + 1} 部影片！`);
            }
            setTimeout(() => {
              this.loadCustomSetVideo(nextIndex);
            }, 1200);
          } else if (this.currentMode === 'self') {
            if (window.app) {
              window.app.showNotification('提示', `第 ${this.currentSetQuizIndex + 1} 部影片播放結束，即將自動播放第 ${nextIndex + 1} 部影片！`);
            }
            setTimeout(() => {
              this.loadSelfPacedCustomSetVideo(nextIndex);
            }, 1200);
          }
          return;
        } else {
          // 所有影片均已播放完畢
          if (this.isTeacher) {
            if (window.app) {
              window.app.showNotification('測驗完成', '測驗組合中所有影片已播放完畢！您可以點選「查看本題統計」檢視所有影片的總答題數據。');
            }
          } else if (this.currentMode === 'self') {
            if (window.app) {
              window.app.showNotification('測驗完成', '測驗組合中所有影片測驗已全數完成！');
            }
            this.showClassAnalytics(this.activeQuiz, {
              self: {
                userName: window.app?.currentUserName || '您',
                answers: this.userAnswers
              }
            });
          }
        }
      }
    }

    // 教師點擊繼續播放
    resumeSyncPlayback() {
      this.hideQuestionOverlay();
      if (this.sessionRef) {
        this.sessionRef.update({
          status: 'playing',
          currentQuestionIndex: -1,
          currentQuestion: null
        });
      }
      this.playVideo();
    }

    // 學生端於「統一引導播放」模式下專屬等待畫面（由授課老師大螢幕統一播放，同學端無需本地播放與載入影音）
    renderStudentSyncWaitingScreen(quizData) {
      const container = document.getElementById('vqSyncPlayerContainer');
      if (!container) return;

      const quizId = (quizData && quizData.id) ? quizData.id : 'unknown';
      if (container.getAttribute('data-waiting-quiz-id') === quizId && container.querySelector('.vq-student-waiting-card')) {
        return;
      }
      container.setAttribute('data-waiting-quiz-id', quizId);

      this.destroyPlayer();
      this.isPlayerReady = false;

      const title = quizData?.title || '影片出題測驗';
      container.innerHTML = `
        <div class="vq-student-waiting-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px; height: 100%; background: linear-gradient(135deg, rgba(0, 122, 255, 0.04), rgba(88, 86, 214, 0.08)); border-radius: 12px; border: 1.5px dashed var(--accent-color); padding: 28px 20px; text-align: center; box-sizing: border-box;">
          <div style="font-size: 52px; margin-bottom: 12px; line-height: 1;">🎬</div>
          <div style="font-size: 18px; font-weight: bold; color: var(--text-primary); margin-bottom: 8px;">
            由授課老師統一設定與引導播放
          </div>
          <div style="font-size: 15px; font-weight: 600; color: var(--accent-color); margin-bottom: 12px; max-width: 520px; word-break: break-word;">
            《${this.escapeHtml(title)}》
          </div>
          <div style="font-size: 13.5px; color: var(--text-secondary); max-width: 480px; line-height: 1.6; margin-bottom: 18px;">
            📺 影片由老師在教室前方大螢幕統一引導播放，請專注觀看大螢幕！<br>
            ✨ 當影片播放至指定出題時間點時，互動題目將會<strong>自動同步在此彈出</strong>供您作答。
          </div>
          <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(52, 199, 89, 0.15); color: #16a34a; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; border: 1px solid rgba(52, 199, 89, 0.3);">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #16a34a; box-shadow: 0 0 6px #16a34a;"></span>
            全班同步連線中・等待出題...
          </div>
        </div>
      `;
    }

    // 處理遠端廣播更新 (學生端與老師端同步)
    handleRemoteSessionUpdate(session) {
      if (session && session.quizData && (session.quizData.id === 'vq_eye_cells' || (session.quizData.title && session.quizData.title.includes('視錐細胞與視桿細胞')))) {
        if (session.quizData.youtubeId !== 'J4BJB48jdfw' || session.quizData.videoUrl !== 'https://www.youtube.com/watch?v=J4BJB48jdfw') {
          session.quizData.videoUrl = 'https://www.youtube.com/watch?v=J4BJB48jdfw';
          session.quizData.youtubeId = 'J4BJB48jdfw';
        }
      }
      this.lastSession = session;
      this.updateAdminBroadcastUI(session);
      if (window.app && typeof window.app.updateAdminActiveActivitiesUI === 'function') {
        window.app.updateAdminActiveActivitiesUI();
      }

      const studentNotice = document.getElementById('vqSyncStudentIdleNotice');
      const activeWrapper = document.getElementById('vqSyncActivePlayerWrapper');
      const studentTopInfo = document.getElementById('vqStudentTopInfo');
      const quickLink = document.getElementById('vqAdminQuickLinkWrapper');

      if (quickLink) {
        quickLink.style.display = (this.isTeacher || window.app?.isAdmin) ? 'block' : 'none';
      }

      if (!session || session.status === 'idle') {
        this.hideQuestionOverlay();
        if (studentNotice) studentNotice.style.display = 'block';
        if (activeWrapper) activeWrapper.style.display = 'none';
        if (studentTopInfo) studentTopInfo.innerHTML = '';
        const ctrls = document.getElementById('vqSyncTeacherControls');
        if (ctrls) ctrls.style.display = 'none';
        const syncContainer = document.getElementById('vqSyncPlayerContainer');
        if (syncContainer) syncContainer.removeAttribute('data-waiting-quiz-id');
        return;
      }

      // 有測驗正在廣播中
      if (studentNotice) studentNotice.style.display = 'none';
      if (activeWrapper) activeWrapper.style.display = 'block';
      if (studentTopInfo) {
        studentTopInfo.innerHTML = `<span style="color: var(--success-color); font-weight: bold;">🟢 廣播進行中</span>`;
      }

      const quizTitleEl = document.getElementById('vqSyncQuizTitle');
      const quizDescEl = document.getElementById('vqSyncQuizDesc');
      if (quizTitleEl && session.quizData?.title) {
        quizTitleEl.textContent = `🎬 ${session.quizData.title}`;
      }
      if (quizDescEl && session.quizData?.description) {
        quizDescEl.textContent = session.quizData.description;
      }

      // 若當前使用者為管理員或老師，顯示控制列；學生端確保嚴格隱藏並清空教師控制列（含出題時間軸）
      if (this.isTeacher || window.app?.isAdmin) {
        this.renderSyncTeacherControls();
      } else {
        const syncContainer = document.getElementById('vqSyncTeacherControls');
        if (syncContainer) {
          syncContainer.style.display = 'none';
          syncContainer.innerHTML = '';
        }
        const selfContainer = document.getElementById('vqSelfTeacherControls');
        if (selfContainer) {
          selfContainer.style.display = 'none';
          selfContainer.innerHTML = '';
        }
      }

      // 檢查是否處於「影片出題測驗」分頁
      let isVideoQuizActive = document.getElementById('panel-video-quiz')?.classList.contains('active');

      // 若為學生端（非老師），接收廣播
      if (!this.isTeacher && !window.app?.isAdmin) {
        // 比照專注力測驗：當老師發起同步影片測驗時，自動切換至影片測驗分頁，無需學生手動點按按鈕
        if (!isVideoQuizActive && window.app && typeof window.app.switchToTab === 'function') {
          window.app.switchToTab('panel-video-quiz');
          isVideoQuizActive = true;
        }

        // 場次切換檢查：若切換不同測驗場次，重設去重記錄
        if (session.sessionId && this.lastHandledSessionId !== session.sessionId) {
          this.lastHandledSessionId = session.sessionId;
          this.handledEventIds = new Set();
        }

        if (session.status === 'waiting' || session.status === 'playing' || session.status === 'question') {
          const quiz = session.quizData || (this.quizzes || []).find(q => q.id === session.quizId);
          if (quiz) {
            const isQuizChanged = !this.activeQuiz || this.activeQuiz.id !== quiz.id || this.activeQuiz.currentSubQuizIndex !== session.currentSubQuizIndex;
            this.activeQuiz = quiz;

            // 學生端：在全班同步模式下顯示該則影片，但不要自動播放
            if (isVideoQuizActive && quiz.videoUrl) {
              const currentVideoUrl = (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.getVideoUrl === 'function')
                ? this.ytPlayer.getVideoUrl()
                : (this.html5Player ? this.html5Player.src : null);
              const ytId = this.extractYoutubeId(quiz.videoUrl);
              const isDifferentYT = ytId && currentVideoUrl && !currentVideoUrl.includes(ytId);

              if (!this.playerType || !this.isPlayerReady || isQuizChanged || isDifferentYT) {
                this.setupPlayer('vqSyncPlayerContainer', quiz.videoUrl, () => {
                  this.pauseVideo();
                });
              } else {
                this.pauseVideo();
              }
            } else if (isVideoQuizActive && !quiz.videoUrl) {
              this.renderStudentSyncWaitingScreen(quiz);
            }
          }
        }

        if (session.status === 'question' && session.currentQuestion) {
          // 學生端收到老師的題目事件後立即顯示，不得再等待自己的播放器或計時器到達相同秒數
          this.pauseVideo();

          // 事件去重：避免網路重送造成重複彈窗
          const eventId = session.eventId || `${session.sessionId || 's'}_${session.questionId || session.currentQuestion.id}_${session.seq || 0}`;
          if (this.handledEventIds.has(eventId) && this.isQuestionOverlayShowing) {
            return;
          }
          this.handledEventIds.add(eventId);

          const qId = session.currentQuestion.id;
          const hasAnswered = !!this.userAnswers[qId];
          const allowRepeat = session.allowRepeat !== false;

          // 關鍵防卡死：僅在使用者處於「影片出題測驗」分頁時才彈出題目覆蓋視窗，絕不遮蔽提問區或登入按鈕
          if (isVideoQuizActive) {
            if (!hasAnswered || allowRepeat) {
              if (allowRepeat && hasAnswered) {
                delete this.userAnswers[qId];
              }
              this.showQuestionOverlay(session.currentQuestion, false);
            } else {
              this.hideQuestionOverlay();
              if (window.app) {
                window.app.showNotification('提示', '老師正在重播此題，您先前已完成作答，請靜候老師繼續播放！');
              }
            }
          }
        } else if (session.status === 'playing') {
          this.hideQuestionOverlay();
          // 全班同步測驗模式：音訊由老師透過教室喇叭播放，學生端保持暫停
          this.pauseVideo();
        } else if (session.status === 'completed') {
          this.hideQuestionOverlay();
          if (isVideoQuizActive) {
            const quiz = this.resolveCurrentActiveQuiz();
            this.showClassAnalytics(quiz, this.cachedRemoteAnswers || {});
          }
        }
      }
    }

    // 渲染教師專屬同步控制列 (圖3 顯示出題時間點與題目清單、支援直接跳題、重複出題開關、多影片導覽，同步與自主學習模式皆支援)
    renderSyncTeacherControls() {
      const syncContainer = document.getElementById('vqSyncTeacherControls');
      const selfContainer = document.getElementById('vqSelfTeacherControls');
      const isTeacherUser = this.isTeacher || window.app?.isAdmin;

      if (!isTeacherUser) {
        if (syncContainer) { syncContainer.style.display = 'none'; syncContainer.innerHTML = ''; }
        if (selfContainer) { selfContainer.style.display = 'none'; selfContainer.innerHTML = ''; }
        return;
      }

      // 檢查是否為多影片測驗組合
      const isMultiVideoSet = !!(this.currentCustomSet && this.currentCustomSet.quizIds && this.currentCustomSet.quizIds.length > 1);
      const multiVideoHtml = isMultiVideoSet ? `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding-bottom: 8px; margin-bottom: 8px; border-bottom: 1px dashed var(--border-color); flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 6px; font-size: 11px;">測驗組合</span>
            <span style="font-weight: bold; color: var(--text-primary); font-size: 13px;">
              影片 ${this.currentSetQuizIndex + 1} / ${this.currentCustomSet.quizIds.length}：《${this.escapeHtml(this.activeQuiz?.title || '')}》
            </span>
          </div>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="action-btn" onclick="window.videoQuiz.switchCustomSetVideo(-1)" ${this.currentSetQuizIndex <= 0 ? 'disabled' : ''} style="padding: 4px 10px; font-size: 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); cursor: ${this.currentSetQuizIndex <= 0 ? 'not-allowed' : 'pointer'}; opacity: ${this.currentSetQuizIndex <= 0 ? '0.5' : '1'};">◀ 上一部影片</button>
            <button type="button" class="action-btn" onclick="window.videoQuiz.switchCustomSetVideo(1)" ${this.currentSetQuizIndex >= this.currentCustomSet.quizIds.length - 1 ? 'disabled' : ''} style="padding: 4px 10px; font-size: 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); cursor: ${this.currentSetQuizIndex >= this.currentCustomSet.quizIds.length - 1 ? 'not-allowed' : 'pointer'}; opacity: ${this.currentSetQuizIndex >= this.currentCustomSet.quizIds.length - 1 ? '0.5' : '1'};">下一部影片 ▶</button>
          </div>
        </div>
      ` : '';

      // 圖3 紅色方框區域：出題時間與題目清單按鈕、重複出題控制開關
      const questionsListHtml = `
        <div id="vqTeacherQuestionsList" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; flex: 1; margin: 4px 8px;">
          <span style="font-size: 12px; font-weight: bold; color: var(--text-secondary); white-space: nowrap;">出題時間軸：</span>
          ${(this.activeQuiz?.questions || []).map((q, idx) => {
            const isCurrent = this.currentActiveQuestion?.id === q.id;
            return `
              <button type="button" class="action-btn vq-qjump-btn" onclick="window.videoQuiz.jumpToQuestion(${idx})" style="padding: 4px 10px; border-radius: 16px; font-size: 12px; font-weight: bold; background: ${isCurrent ? 'var(--accent-color)' : 'var(--bg-primary)'}; color: ${isCurrent ? '#fff' : 'var(--text-primary)'}; border: 1px solid ${isCurrent ? 'var(--accent-color)' : 'var(--border-color)'}; cursor: pointer; transition: all 0.2s;" title="${this.escapeHtml(q.prompt)}">
                ⏱️ ${q.timeFormatted || this.formatSeconds(q.time)} 第 ${idx + 1} 題
              </button>
            `;
          }).join('')}
          <label style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer; color: var(--text-secondary); margin-left: 6px; white-space: nowrap;" title="勾選時，重播影片或跳題時學生端會再次跳出題目作答">
            <input type="checkbox" id="vqAllowRepeatCheckbox" onchange="window.videoQuiz.toggleAllowStudentRepeat(this.checked)" ${this.allowStudentRepeat ? 'checked' : ''}> 重播時學生重複出題
          </label>
        </div>
      `;

      const submittedCount = Object.keys(this.cachedRemoteAnswers || {}).length;
      const stopBtnText = (this.currentMode === 'self') ? '⏹ 結束自主學習' : '⏹ 結束全班測驗';

      const controlsHtml = `
        <div style="display: flex; flex-direction: column; background: var(--bg-card); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-color); margin-top: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          ${multiVideoHtml}
          <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: bold; color: var(--accent-color); white-space: nowrap; font-size: 14px;">🧑‍🏫 老師同步控制台</span>
              <span class="badge vq-submitted-count-badge" id="vqSyncSubmittedCountBadge" style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 10px; font-size: 14px; white-space: nowrap;">已提交 ${submittedCount} 人</span>
            </div>
            ${questionsListHtml}
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
              <button class="presentation-tool-btn" onclick="window.videoQuiz.resumeSyncPlayback()" style="background: var(--success-color); color: white; border-color: var(--success-color); font-size: 14px;">▶ 繼續播放影片</button>
              <button class="presentation-tool-btn active" onclick="window.videoQuiz.showCurrentQuestionAnalytics()" style="font-size: 14px;">📊 查看本題統計</button>
              <button class="presentation-tool-btn danger" onclick="window.videoQuiz.stopSyncQuiz()" style="font-size: 14px;">${stopBtnText}</button>
            </div>
          </div>
        </div>
      `;

      if (syncContainer) {
        syncContainer.innerHTML = controlsHtml;
        syncContainer.style.display = (this.currentMode === 'sync') ? 'block' : 'none';
      }
      if (selfContainer) {
        selfContainer.innerHTML = controlsHtml;
        selfContainer.style.display = (this.currentMode === 'self') ? 'block' : 'none';
      }
    }

    // ==========================================
    // 情境 B：學生自主學習測驗 (Self-paced)
    // ==========================================

    startSelfPacedQuiz(quizId, customQuizData = null) {
      let quiz = customQuizData;
      if (!quiz) {
        if (typeof quizId === 'string' && quizId.startsWith('custom:')) {
          const setId = quizId.replace('custom:', '');
          const set = (this.customSets || []).find(s => s.id === setId);
          if (set) {
            const subQuizIds = (set.quizIds && set.quizIds.length > 0) ? set.quizIds : [set.quizId || 'vq_science_solar'];
            const allSubQuizzes = subQuizIds.map(id => this.quizzes.find(q => q.id === id)).filter(Boolean);
            this.currentCustomSet = set;
            this.currentSetQuizIndex = 0;
            const currentSubQuiz = allSubQuizzes[0] || this.quizzes[0];

            quiz = JSON.parse(JSON.stringify(currentSubQuiz));
            quiz.id = `custom_${set.id}`;
            quiz.customSetId = set.id;
            quiz.customSetName = set.name;
            quiz.currentSubQuizIndex = 0;
            quiz.totalSubQuizzes = allSubQuizzes.length;
            quiz.allSubQuizIds = subQuizIds;
            quiz.allSubQuizzes = allSubQuizzes;
            quiz.allQuestions = allSubQuizzes.flatMap((sq, sqIdx) => 
              (sq.questions || []).map(q => ({
                ...q,
                videoTitle: sq.title,
                videoIndex: sqIdx + 1
              }))
            );
            quiz.title = `🌟 ${set.name}`;
            quiz.description = `【測驗組合】第 1/${allSubQuizzes.length} 部：《${currentSubQuiz.title}》（共 ${quiz.allQuestions.length} 題測驗）`;
          }
        } else {
          quiz = this.quizzes.find(q => q.id === quizId) || this.activeQuiz;
          this.currentCustomSet = null;
          this.currentSetQuizIndex = 0;
        }
      }
      if (!quiz) return;
      if (quiz.id === 'vq_eye_cells' || (quiz.title && quiz.title.includes('視錐細胞與視桿細胞'))) {
        quiz.videoUrl = 'https://www.youtube.com/watch?v=J4BJB48jdfw';
        quiz.youtubeId = 'J4BJB48jdfw';
      }
      this.activeQuiz = quiz;
      this.isTeacher = !!(window.app?.isAdmin || this.isTeacher);
      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;
      this.userAnswers = {};
      if (this.isTeacher) {
        this.renderSyncTeacherControls();
      }

      const progressEl = document.getElementById('vqSelfProgressInfo');
      if (progressEl) {
        const activeCount = (quiz.questions || []).filter(q => q.enabled !== false).length;
        const totalSetCount = quiz.allQuestions ? quiz.allQuestions.length : activeCount;
        progressEl.textContent = `共有 ${totalSetCount} 題互動測驗，影片播放到關鍵時間點會自動跳出題目！`;
      }

      this.setupPlayer('vqSelfPlayerContainer', quiz.videoUrl, () => {
        // 自主學習影片播放器載入完成
      }, (currentTime) => {
        this.handleSelfTimelineTick(currentTime);
      });
    }

    // 載入自主學習組合中下一部影片
    loadSelfPacedCustomSetVideo(subIndex) {
      if (!this.currentCustomSet) return;
      const subQuizIds = this.currentCustomSet.quizIds || [];
      if (subIndex < 0 || subIndex >= subQuizIds.length) return;

      this.currentSetQuizIndex = subIndex;
      const allSubQuizzes = subQuizIds.map(id => this.quizzes.find(q => q.id === id)).filter(Boolean);
      const subQuiz = allSubQuizzes[subIndex];
      if (!subQuiz) return;

      this.activeQuiz = JSON.parse(JSON.stringify(subQuiz));
      this.activeQuiz.id = `custom_${this.currentCustomSet.id}`;
      this.activeQuiz.customSetId = this.currentCustomSet.id;
      this.activeQuiz.customSetName = this.currentCustomSet.name;
      this.activeQuiz.currentSubQuizIndex = subIndex;
      this.activeQuiz.totalSubQuizzes = allSubQuizzes.length;
      this.activeQuiz.allSubQuizIds = subQuizIds;
      this.activeQuiz.allSubQuizzes = allSubQuizzes;
      this.activeQuiz.allQuestions = allSubQuizzes.flatMap((sq, sqIdx) => 
        (sq.questions || []).map(q => ({
          ...q,
          videoTitle: sq.title,
          videoIndex: sqIdx + 1
        }))
      );
      this.activeQuiz.title = `🌟 ${this.currentCustomSet.name}`;
      this.activeQuiz.description = `【測驗組合】第 ${subIndex + 1}/${allSubQuizzes.length} 部：《${subQuiz.title}》（共 ${this.activeQuiz.allQuestions.length} 題測驗）`;

      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;
      if (this.isTeacher || window.app?.isAdmin) {
        this.renderSyncTeacherControls();
      }

      const progressEl = document.getElementById('vqSelfProgressInfo');
      if (progressEl) {
        progressEl.textContent = `第 ${subIndex + 1}/${allSubQuizzes.length} 部影片，本片共有 ${subQuiz.questions?.length || 0} 題測驗！`;
      }

      this.setupPlayer('vqSelfPlayerContainer', subQuiz.videoUrl, () => {
        this.playVideo();
      }, (time) => {
        this.handleSelfTimelineTick(time);
      });
    }

    // 自主學習時間軸偵測
    handleSelfTimelineTick(currentTime) {
      this.processTimelineTick(currentTime, false);
    }

    // ==========================================
    // 答題彈窗與作答處理 (Single / Multiple / Text)
    // ==========================================

    showQuestionOverlay(question, isTeacherView = false) {
      if (!question) return;
      this.currentActiveQuestion = question;
      this.isQuestionOverlayShowing = true;

      // 自動校正當前 activeQuiz，確保統計與作答所屬題目一致
      if (!this.activeQuiz || !(
        (this.activeQuiz.questions || []).some(item => item.id === question.id) ||
        (this.activeQuiz.allQuestions || []).some(item => item.id === question.id)
      )) {
        const matched = (this.quizzes || []).find(q =>
          (q.questions || []).some(item => item.id === question.id) ||
          (q.allQuestions || []).some(item => item.id === question.id)
        );
        if (matched) {
          this.activeQuiz = matched;
        } else if (this.lastSession && this.lastSession.quizData) {
          this.activeQuiz = this.lastSession.quizData;
        }
      }

      const overlay = document.getElementById('vqQuestionOverlay');
      const content = document.getElementById('vqQuestionOverlayContent');
      if (!overlay || !content) return;

      const typeBadge = question.type === 'single' ? '🔘 單選題'
        : (question.type === 'multiple' ? '☑️ 複選題'
        : (question.type === 'matching' ? '🔗 配對題 (連連看)' : '✍️ 問答題'));
      const points = question.points || 10;

      let formHtml = '';
      if (question.type === 'single') {
        formHtml = `
          <div class="vq-options-list" style="display: flex; flex-direction: column; gap: 10px; margin: 16px 0;">
            ${(question.options || []).map((opt, idx) => {
              const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
              const optText = isImg ? (opt.text || '') : (typeof opt === 'object' ? (opt.text || '') : String(opt));
              const optKey = typeof opt === 'object' ? (opt.key || opt.text || `[圖片 ${idx + 1}]`) : String(opt);
              const imgSrc = isImg ? opt.image : '';

              return `
                <label class="vq-option-item ${isImg ? 'has-img' : ''}" style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 15px;">
                  <input type="radio" name="vqSingleOption" value="${this.escapeHtml(optKey)}" style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0; accent-color: var(--accent-color);">
                  <span style="font-weight: bold; color: var(--accent-color); flex-shrink: 0;">${String.fromCharCode(65 + idx)}.</span>
                  <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                    ${isImg ? `<img src="${this.escapeHtml(imgSrc)}" style="max-height: 60px; max-width: 90px; object-fit: contain; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); cursor: pointer;" onclick="event.stopPropagation(); window.quiz && window.quiz.previewOptionImg ? window.quiz.previewOptionImg(this.src) : null" title="點擊放大預覽圖片">` : ''}
                    ${optText ? `<span>${this.escapeHtml(optText)}</span>` : ''}
                  </div>
                </label>
              `;
            }).join('')}
          </div>
        `;
      } else if (question.type === 'multiple') {
        formHtml = `
          <div class="vq-options-list" style="display: flex; flex-direction: column; gap: 10px; margin: 16px 0;">
            ${(question.options || []).map((opt, idx) => {
              const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
              const optText = isImg ? (opt.text || '') : (typeof opt === 'object' ? (opt.text || '') : String(opt));
              const optKey = typeof opt === 'object' ? (opt.key || opt.text || `[圖片 ${idx + 1}]`) : String(opt);
              const imgSrc = isImg ? opt.image : '';

              return `
                <label class="vq-option-item ${isImg ? 'has-img' : ''}" style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 15px;">
                  <input type="checkbox" name="vqMultipleOption" value="${this.escapeHtml(optKey)}" style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0; accent-color: var(--accent-color);">
                  <span style="font-weight: bold; color: var(--accent-color); flex-shrink: 0;">${String.fromCharCode(65 + idx)}.</span>
                  <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                    ${isImg ? `<img src="${this.escapeHtml(imgSrc)}" style="max-height: 60px; max-width: 90px; object-fit: contain; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); cursor: pointer;" onclick="event.stopPropagation(); window.quiz && window.quiz.previewOptionImg ? window.quiz.previewOptionImg(this.src) : null" title="點擊放大預覽圖片">` : ''}
                    ${optText ? `<span>${this.escapeHtml(optText)}</span>` : ''}
                  </div>
                </label>
              `;
            }).join('')}
          </div>
        `;
      } else if (question.type === 'matching') {
        formHtml = `
          <div id="vqMatchingContainer" style="margin: 14px 0;"></div>
        `;
      } else if (question.type === 'text') {
        formHtml = `
          <div style="margin: 16px 0;">
            <textarea id="vqTextAnswerInput" placeholder="請在此輸入您的回答..." rows="4" style="width: 100%; box-sizing: border-box; padding: 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 15px; font-family: inherit; resize: vertical;"></textarea>
          </div>
        `;
      }

      const isTeacherOrAdmin = (this.isTeacher || window.app?.isAdmin);

      content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: bold; color: var(--accent-color); font-size: 14px;">${typeBadge}（${points} 分）</span>
            <span style="font-size: 14px; color: var(--text-secondary);">時間點：${question.timeFormatted || '00:00'}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${isTeacherOrAdmin ? `
              <button type="button" class="presentation-tool-btn active" onclick="window.videoQuiz.showCurrentQuestionAnalytics()" style="font-size: 14px; padding: 4px 10px;" title="查看全班答題分佈與排行榜">📊 查看本題統計</button>
              <button type="button" class="presentation-tool-btn danger" onclick="window.videoQuiz.stopSyncQuiz()" style="font-size: 14px; padding: 4px 10px;" title="立即停止全班測驗廣播">⏹️ 結束測驗</button>
              <button type="button" class="presentation-tool-btn" onclick="window.videoQuiz.returnToQuizVideo()" style="background: var(--accent-color); color: white; border-color: var(--accent-color); font-size: 14px; padding: 4px 10px;" title="關閉題目彈窗，返回測驗影片播放介面">🎬 返回測驗影片</button>
            ` : `
              <button type="button" class="presentation-tool-btn active" onclick="window.videoQuiz.showCurrentQuestionAnalytics()" style="font-size: 14px; padding: 4px 10px;" title="查看全班答題分佈與排行榜">📊 查看本題統計</button>
              <button type="button" class="presentation-tool-btn desktop-only" onclick="window.app.switchToTab('panel-admin')" style="font-size: 14px; padding: 4px 10px;" title="若您是老師，點此登入管理後台">⚙️ 後台登入</button>
            `}
            <button type="button" onclick="window.videoQuiz.hideQuestionOverlay()" style="background: rgba(0,0,0,0.06); color: var(--text-primary); border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="暫時收合題目視窗">✕</button>
          </div>
        </div>
        <h3 style="font-size: 18px; line-height: 1.5; margin: 0 0 12px 0; color: var(--text-primary);">${this.escapeHtml(question.prompt)}</h3>
        ${formHtml}
        <div id="vqQuestionFeedbackArea" style="display: none; margin: 14px 0; padding: 12px; border-radius: 8px;"></div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; flex-wrap: wrap; align-items: center;">
          <button id="vqSubmitAnswerBtn" onclick="window.videoQuiz.submitCurrentAnswer()" class="action-btn" style="background: var(--accent-color); color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer;">
            📤 確認提交答案
          </button>
          <button id="vqContinuePlayBtn" onclick="window.videoQuiz.continueAfterAnswer()" class="action-btn" style="display: none; background: var(--success-color); color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer;">
            ▶ 繼續播放影片
          </button>
        </div>
      `;

      overlay.style.display = 'flex';

      // 若為連連看配對題，初始化連連看畫布
      if (question.type === 'matching' && window.MatchingQuizEngine) {
        const pairs = question.pairs || (question.options || []).map((opt, i) => ({
          left: opt,
          right: question.matchOptions?.[i] || ''
        }));
        const leftItems = (question.options || []).map(opt => typeof opt === 'object' ? opt : opt);
        const rightItems = question.matchOptions || pairs.map(p => p.right);
        const boardEl = document.getElementById('vqMatchingContainer');
        if (boardEl) {
          window.MatchingQuizEngine.createBoard(boardEl, {
            id: 'vq_matching_board_' + question.id,
            pairs,
            leftItems,
            rightItems,
            solution: question.correctAnswer || null
          });
        }
      }
    }

    // 返回測驗影片播放介面並關閉題目彈窗 (教師端)
    returnToQuizVideo() {
      if (window.app) {
        window.app.switchToTab('panel-video-quiz');
      }
      this.hideQuestionOverlay();
    }

    hideQuestionOverlay() {
      const overlay = document.getElementById('vqQuestionOverlay');
      if (overlay) overlay.style.display = 'none';
      this.isQuestionOverlayShowing = false;
      this.currentActiveQuestion = null;
    }

    // 學生提交答案
    submitCurrentAnswer() {
      if (!this.currentActiveQuestion) return;
      const q = this.currentActiveQuestion;
      let userAnswer = null;
      let isCorrect = false;

      if (q.type === 'matching') {
        const matchingContainer = document.getElementById('vqMatchingContainer');
        const userConnections = window.MatchingQuizEngine ? window.MatchingQuizEngine.getConnections(matchingContainer) : {};
        if (Object.keys(userConnections).length === 0) {
          if (window.app) window.app.showNotification('提示', '請先進行連線配對再提交答案！');
          return;
        }
        userAnswer = userConnections;
        const pairs = q.pairs || (q.options || []).map((opt, i) => ({ left: opt, right: q.matchOptions?.[i] || '' }));
        let correctCount = 0;
        const totalPairs = pairs.length;
        pairs.forEach((p, idx) => {
          const lKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.left, String(idx + 1)) : (typeof p.left === 'object' ? (p.left.key || p.left.text) : p.left);
          const rKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.right, String(idx + 1)) : (typeof p.right === 'object' ? (p.right.key || p.right.text) : p.right);
          if (userAnswer[lKey] === rKey) correctCount++;
        });
        isCorrect = (correctCount === totalPairs);
      } else if (q.type === 'single') {
        const checked = document.querySelector('input[name="vqSingleOption"]:checked');
        if (!checked) {
          if (window.app) window.app.showNotification('提示', '請先選擇一個選項！');
          return;
        }
        userAnswer = checked.value;
        const correctStr = (typeof q.correctAnswer === 'object' && q.correctAnswer !== null)
          ? (q.correctAnswer.key || q.correctAnswer.text)
          : String(q.correctAnswer);
        isCorrect = (userAnswer === correctStr);
      } else if (q.type === 'multiple') {
        const checkedList = Array.from(document.querySelectorAll('input[name="vqMultipleOption"]:checked')).map(el => el.value);
        if (checkedList.length === 0) {
          if (window.app) window.app.showNotification('提示', '請至少勾選一個選項！');
          return;
        }
        userAnswer = checkedList;
        const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        const correctStrs = correctArr.map(c => (typeof c === 'object' && c !== null) ? (c.key || c.text) : String(c));
        const correctSet = new Set(correctStrs);
        isCorrect = (checkedList.length === correctSet.size && checkedList.every(val => correctSet.has(val)));
      } else if (q.type === 'text') {
        const txtEl = document.getElementById('vqTextAnswerInput');
        const textVal = txtEl ? txtEl.value.trim() : '';
        if (!textVal) {
          if (window.app) window.app.showNotification('提示', '請輸入您的問答文字回答！');
          return;
        }
        userAnswer = textVal;
        isCorrect = true; // 問答題只要提交即視為完成作答
      }

      let score = 0;
      if (q.type === 'matching') {
        const pairs = q.pairs || (q.options || []).map((opt, i) => ({ left: opt, right: q.matchOptions?.[i] || '' }));
        let correctCount = 0;
        const totalPairs = pairs.length;
        pairs.forEach((p, idx) => {
          const lKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.left, String(idx + 1)) : (typeof p.left === 'object' ? (p.left.key || p.left.text) : p.left);
          const rKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.right, String(idx + 1)) : (typeof p.right === 'object' ? (p.right.key || p.right.text) : p.right);
          if (userAnswer && userAnswer[lKey] === rKey) correctCount++;
        });
        score = totalPairs > 0 ? Math.round((correctCount / totalPairs) * (q.points || 10)) : 0;
      } else {
        score = isCorrect ? (q.points || 10) : 0;
      }

      this.userAnswers[q.id] = {
        questionId: q.id,
        type: q.type,
        answer: userAnswer,
        isCorrect,
        score
      };

      // 儲存至 Firebase
      this.syncUserAnswerToFirebase(q.id, this.userAnswers[q.id]);

      // 呈現即時答題反饋
      const feedbackArea = document.getElementById('vqQuestionFeedbackArea');
      const submitBtn = document.getElementById('vqSubmitAnswerBtn');
      const continueBtn = document.getElementById('vqContinuePlayBtn');

      if (feedbackArea) {
        feedbackArea.style.display = 'block';
        if (q.type === 'matching') {
          const matchingContainer = document.getElementById('vqMatchingContainer');
          const pairs = q.pairs || (q.options || []).map((opt, i) => ({ left: opt, right: q.matchOptions?.[i] || '' }));
          let correctCount = 0;
          const totalPairs = pairs.length;
          pairs.forEach((p, idx) => {
            const lKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.left, String(idx + 1)) : (typeof p.left === 'object' ? (p.left.key || p.left.text) : p.left);
            const rKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.right, String(idx + 1)) : (typeof p.right === 'object' ? (p.right.key || p.right.text) : p.right);
            if (userAnswer && userAnswer[lKey] === rKey) correctCount++;
          });
          if (window.MatchingQuizEngine && matchingContainer) {
            window.MatchingQuizEngine.renderResults(matchingContainer, userAnswer, q.correctAnswer, { showAnswers: true });
          }
          if (isCorrect) {
            feedbackArea.style.background = 'rgba(52, 199, 89, 0.1)';
            feedbackArea.style.border = '1px solid var(--success-color)';
            feedbackArea.innerHTML = `
              <div style="font-weight: bold; color: var(--success-color); margin-bottom: 4px;">🎉 全部配對正確！（+${score} 分）</div>
              <div style="font-size: 13px; color: var(--text-secondary);">💡 解析：${this.escapeHtml(q.explanation || '連線配對完全正確，非常厲害！')}</div>
            `;
          } else {
            feedbackArea.style.background = 'rgba(255, 149, 0, 0.1)';
            feedbackArea.style.border = '1px solid #ff9500';
            feedbackArea.innerHTML = `
              <div style="font-weight: bold; color: #ff9500; margin-bottom: 4px;">連線完成：答對 ${correctCount} / ${totalPairs} 組配對（+${score} 分）</div>
              <div style="font-size: 13px; color: var(--text-secondary);">💡 綠色虛線為標準正確配對指引。解析：${this.escapeHtml(q.explanation || '請對照正確配對釐清觀念喔！')}</div>
            `;
          }
        } else if (q.type === 'text') {
          feedbackArea.style.background = 'rgba(0, 122, 255, 0.1)';
          feedbackArea.style.border = '1px solid var(--accent-color)';
          feedbackArea.innerHTML = `
            <div style="font-weight: bold; color: var(--accent-color); margin-bottom: 4px;">✅ 問答已提交！</div>
            <div style="font-size: 13px; color: var(--text-secondary);">💡 參考解析：${this.escapeHtml(q.explanation || q.correctAnswer || '感謝您的回答！')}</div>
          `;
        } else if (isCorrect) {
          feedbackArea.style.background = 'rgba(52, 199, 89, 0.1)';
          feedbackArea.style.border = '1px solid var(--success-color)';
          feedbackArea.innerHTML = `
            <div style="font-weight: bold; color: var(--success-color); margin-bottom: 4px;">🎉 答對了！（+${score} 分）</div>
            <div style="font-size: 13px; color: var(--text-secondary);">💡 解析：${this.escapeHtml(q.explanation || '觀念非常正確！')}</div>
          `;
        } else {
          feedbackArea.style.background = 'rgba(255, 59, 48, 0.1)';
          feedbackArea.style.border = '1px solid var(--danger-color)';
          const correctText = Array.isArray(q.correctAnswer) ? q.correctAnswer.join('、') : q.correctAnswer;
          feedbackArea.innerHTML = `
            <div style="font-weight: bold; color: var(--danger-color); margin-bottom: 4px;">❌ 答錯了！正確解答為：${this.escapeHtml(correctText)}</div>
            <div style="font-size: 13px; color: var(--text-secondary);">💡 解析：${this.escapeHtml(q.explanation || '請注意影片中提到的關鍵細節喔！')}</div>
          `;
        }
      }

      // 播放自訂測驗互動音效回饋
      if (window.app && typeof window.app.playFocusSound === 'function') {
        if (q.type === 'text') {
          window.app.playFocusSound('correct');
        } else {
          window.app.playFocusSound(isCorrect ? 'correct' : 'wrong');
        }
      }

      if (submitBtn) submitBtn.style.display = 'none';
      if (continueBtn) continueBtn.style.display = 'inline-block';

      // 若在同步模式且為學生端，顯示等待老師廣播
      if (this.currentMode === 'sync' && !this.isTeacher) {
        if (continueBtn) continueBtn.textContent = '⏳ 等待老師繼續播放...';
        if (continueBtn) continueBtn.disabled = true;
      }
    }

    // 答題後繼續播放
    continueAfterAnswer() {
      this.hideQuestionOverlay();
      this.playVideo();

      // 檢查是否所有題目都已完成
      if (this.activeQuiz && this.activeQuiz.questions && this.triggeredQuestions.size >= this.activeQuiz.questions.length) {
        setTimeout(() => {
          this.checkSelfQuizCompletion();
        }, 1500);
      }
    }

    // 檢查自主學習完成度並顯示成績
    checkSelfQuizCompletion() {
      if (!this.activeQuiz) return;
      let totalScore = 0;
      let maxScore = 0;
      let correctCount = 0;

      (this.activeQuiz.questions || []).forEach(q => {
        maxScore += (q.points || 10);
        const ans = this.userAnswers[q.id];
        if (ans && ans.isCorrect) {
          totalScore += ans.score;
          correctCount++;
        }
      });

      this.showClassAnalytics(this.activeQuiz, this.cachedRemoteAnswers || {});
    }

    getAnswerUserId() {
      if (window.boardTarget?.mode === 'secure') {
        return window.firebaseAuth?.currentUser?.uid || '';
      }
      let userId = window.boardStorage.local.getItem('quiz_user_id');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        window.boardStorage.local.setItem('quiz_user_id', userId);
      }
      return userId;
    }

    // 同步作答資料至 Firebase
    syncUserAnswerToFirebase(questionId, answerObj) {
      if (!this.answersRef) return;
      const userId = this.getAnswerUserId();
      if (!userId) {
        window.app?.showNotification('無法同步作答', '請確認已完成登入後重新整理。');
        return;
      }
      const userName = window.boardStorage.local.getItem('user_nickname') || '同學_' + userId.slice(-4);

      this.answersRef.child(userId).update({
        userId,
        userName,
        updatedAt: Date.now()
      });
      this.answersRef.child(userId).child('answers').child(questionId).set(answerObj);
    }

    // 接收遠端全班答題更新
    handleRemoteAnswersUpdate(answers) {
      this.cachedRemoteAnswers = answers;
      const count = Object.keys(answers).length;
      const badges = document.querySelectorAll('.vq-submitted-count-badge');
      badges.forEach(badge => {
        badge.textContent = `已提交 ${count} 人`;
      });

      // 若當前開啟統計面板，即時重繪
      const analyticsModal = document.getElementById('vqAnalyticsModal');
      if (analyticsModal && analyticsModal.style.display === 'flex') {
        const quiz = this.resolveCurrentActiveQuiz();
        if (quiz) {
          this.renderAnalyticsDashboard(quiz, answers);
        }
      }
    }

    // ==========================================
    // 全班答題統計與分析儀表板 (Class Analytics)
    // ==========================================

    // 解析當前題目或場次真正所屬的測驗物件，防止統計面板顯示錯位
    resolveCurrentActiveQuiz() {
      // 1. 若當前有作用中題目，優先根據題目 ID 尋找所屬測驗
      if (this.currentActiveQuestion) {
        const qId = this.currentActiveQuestion.id;
        if (this.activeQuiz && (
          (this.activeQuiz.questions || []).some(item => item.id === qId) ||
          (this.activeQuiz.allQuestions || []).some(item => item.id === qId)
        )) {
          return this.activeQuiz;
        }

        const matched = (this.quizzes || []).find(q =>
          (q.questions || []).some(item => item.id === qId) ||
          (q.allQuestions || []).some(item => item.id === qId)
        );
        if (matched) {
          this.activeQuiz = matched;
          return matched;
        }

        if (this.customSets && this.customSets.length > 0) {
          for (const set of this.customSets) {
            const subQuizIds = (set.quizIds && set.quizIds.length > 0) ? set.quizIds : [set.quizId];
            const foundSub = (this.quizzes || []).find(q =>
              subQuizIds.includes(q.id) && (q.questions || []).some(item => item.id === qId)
            );
            if (foundSub) {
              this.activeQuiz = foundSub;
              return foundSub;
            }
          }
        }
      }

      // 2. 檢查最新 Firebase Session 中記錄的測驗
      if (this.lastSession) {
        if (this.lastSession.quizData) {
          this.activeQuiz = this.lastSession.quizData;
          return this.activeQuiz;
        }
        if (this.lastSession.quizId) {
          const matched = (this.quizzes || []).find(q => q.id === this.lastSession.quizId);
          if (matched) {
            this.activeQuiz = matched;
            return matched;
          }
        }
      }

      // 3. 回傳當前 activeQuiz 或預設第 1 個測驗
      if (!this.activeQuiz && this.quizzes && this.quizzes.length > 0) {
        this.activeQuiz = this.quizzes[0];
      }
      return this.activeQuiz;
    }

    showCurrentQuestionAnalytics() {
      const quiz = this.resolveCurrentActiveQuiz();
      if (!quiz) return;
      this.showClassAnalytics(quiz, this.cachedRemoteAnswers || {});
    }

    showClassAnalytics(quiz, answersMap) {
      const modal = document.getElementById('vqAnalyticsModal');
      if (!modal) return;
      this.renderAnalyticsDashboard(quiz, answersMap);
      modal.style.display = 'flex';

      // 若有當前作用題目，平滑捲動至本題卡片
      setTimeout(() => {
        if (this.currentActiveQuestion) {
          const el = document.getElementById(`vq-stats-q-${this.currentActiveQuestion.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }, 120);
    }

    closeClassAnalytics() {
      const modal = document.getElementById('vqAnalyticsModal');
      if (modal) modal.style.display = 'none';
    }

    renderAnalyticsDashboard(quiz, answersMap) {
      const container = document.getElementById('vqAnalyticsContent');
      if (!container) return;

      const titleEl = document.getElementById('vqAnalyticsTitle');
      if (titleEl && quiz && quiz.title) {
        titleEl.textContent = `📊 全班答題統計與分析：《${quiz.title}》`;
      }

      let userList = Object.values(answersMap || {});

      // 學生端容錯：若遠端作答中尚未涵蓋自己的回答，即時整合以顯示個人得分與名次
      const myUserId = window.app?.currentStudentId || window.app?.currentUserId || '';
      const myUserName = window.app?.currentStudentName || window.app?.userName || '';
      if (myUserName && Object.keys(this.userAnswers || {}).length > 0) {
        const found = userList.some(u => (myUserId && u.userId === myUserId) || (u.userName && u.userName === myUserName));
        if (!found) {
          userList.push({
            userId: myUserId || 'me',
            userName: myUserName,
            answers: this.userAnswers
          });
        }
      }
      const totalParticipants = userList.length;

      // 需求 6：多影片測驗組合彙整所有影片題目進行統計
      const targetQuestions = (quiz.allQuestions && quiz.allQuestions.length > 0) ? quiz.allQuestions : (quiz.questions || []);
      const subQuizzes = (quiz.allSubQuizzes && quiz.allSubQuizzes.length > 0) ? quiz.allSubQuizzes : [quiz];

      let totalClassScore = 0;
      let maxPossibleScore = 0;
      targetQuestions.forEach(q => { maxPossibleScore += (q.points || 10); });

      // 計算排行榜 (以整組測驗所有題目為基準)
      const leaderboard = userList.map(u => {
        let userScore = 0;
        let correctCount = 0;
        const answers = u.answers || {};
        targetQuestions.forEach(q => {
          const a = answers[q.id];
          if (a && a.isCorrect) {
            userScore += (a.score || 10);
            correctCount++;
          }
        });
        totalClassScore += userScore;
        return {
          userName: u.userName || '匿名同學',
          score: userScore,
          correctCount,
          answers
        };
      }).sort((a, b) => b.score - a.score);

      const avgScore = totalParticipants > 0 ? (totalClassScore / totalParticipants).toFixed(1) : 0;
      const avgRate = maxPossibleScore > 0 ? Math.round((avgScore / maxPossibleScore) * 100) : 0;

      // 渲染單題選項統計 (支援多影片分段顯示)
      let questionsHtml = '';
      subQuizzes.forEach((sq, sqIdx) => {
        if (subQuizzes.length > 1) {
          questionsHtml += `
            <div style="background: rgba(0,122,255,0.08); border-left: 4px solid var(--accent-color); padding: 8px 12px; border-radius: 6px; margin: 16px 0 10px 0; font-weight: bold; font-size: 14px; color: var(--text-primary); display: flex; align-items: center; justify-content: space-between;">
              <span>🎬 影片 ${sqIdx + 1}：《${this.escapeHtml(sq.title)}》</span>
              <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px;">${sq.questions?.length || 0} 題</span>
            </div>
          `;
        }

        const isTeacherOrAdmin = (this.isTeacher || window.app?.isAdmin);

        (sq.questions || []).forEach((q, qIdx) => {
          let qStatsHtml = '';
          const isAnsweredByMe = !!(this.userAnswers && this.userAnswers[q.id]);
          const canShowAnswer = isTeacherOrAdmin || isAnsweredByMe;

          if (q.type === 'single' || q.type === 'multiple') {
            const counts = {};
            (q.options || []).forEach((opt, idx) => {
              const optKey = typeof opt === 'object' && opt !== null ? (opt.key || opt.text || `[圖片 ${idx + 1}]`) : String(opt);
              counts[optKey] = 0;
            });
            let correctTotal = 0;
            let answeredRespondentCount = 0;

            userList.forEach(u => {
              const ans = u.answers?.[q.id];
              if (ans) {
                answeredRespondentCount++;
                if (Array.isArray(ans.answer)) {
                  ans.answer.forEach(opt => { counts[opt] = (counts[opt] || 0) + 1; });
                } else if (ans.answer) {
                  counts[ans.answer] = (counts[ans.answer] || 0) + 1;
                }
                if (ans.isCorrect) correctTotal++;
              }
            });

            const accuracy = totalParticipants > 0 ? Math.round((correctTotal / totalParticipants) * 100) : 0;

            let qAccuracyHeader = '';
            if (canShowAnswer) {
              qAccuracyHeader = `
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                  全班答對率：<strong style="color: ${accuracy >= 60 ? 'var(--success-color)' : 'var(--danger-color)'};">${accuracy}%</strong> (${correctTotal}/${totalParticipants} 人答對)
                </div>
              `;
            } else {
              qAccuracyHeader = `
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
                  <span>各選項作答分佈統計（全班共 ${answeredRespondentCount} 人提交）</span>
                  <span style="font-size: 12px; color: var(--accent-color); font-weight: 500;">🔒 作答本題後揭曉正確答案與答對率</span>
                </div>
              `;
            }

            qStatsHtml = `
              <div style="margin-top: 10px;">
                ${qAccuracyHeader}
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${(q.options || []).map((opt, optIdx) => {
                    const isImg = typeof opt === 'object' && opt !== null && (opt.type === 'image' || !!opt.image);
                    const optKey = typeof opt === 'object' && opt !== null ? (opt.key || opt.text || `[圖片 ${optIdx + 1}]`) : String(opt);
                    const optText = typeof opt === 'object' && opt !== null ? (opt.text || '') : String(opt);
                    const imgSrc = isImg ? (opt.image || '') : '';

                    const cnt = counts[optKey] || counts[optText] || 0;
                    const pct = totalParticipants > 0 ? Math.round((cnt / totalParticipants) * 100) : 0;
                    const isCorrectOpt = canShowAnswer && (Array.isArray(q.correctAnswer)
                      ? (q.correctAnswer.includes(optKey) || q.correctAnswer.includes(optText))
                      : (q.correctAnswer === optKey || q.correctAnswer === optText));

                    return `
                      <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
                        <span style="width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: ${isCorrectOpt ? 'bold' : 'normal'}; color: ${isCorrectOpt ? 'var(--success-color)' : 'var(--text-primary)'}; display: inline-flex; align-items: center; gap: 4px;">
                          ${isCorrectOpt ? '✅ ' : ''}${String.fromCharCode(65 + optIdx)}.
                          ${isImg && imgSrc ? `<img src="${this.escapeHtml(imgSrc)}" style="max-height: 22px; max-width: 32px; object-fit: contain; border-radius: 3px; border: 1px solid var(--border-color); vertical-align: middle; cursor: pointer;" onclick="event.stopPropagation(); window.quiz && window.quiz.previewOptionImg ? window.quiz.previewOptionImg(this.src) : null" title="點擊放大預覽">` : ''}
                          <span>${this.escapeHtml(optText || (isImg ? '[圖片]' : ''))}</span>
                        </span>
                        <div style="flex: 1; height: 16px; background: rgba(0,0,0,0.06); border-radius: 8px; overflow: hidden; position: relative;">
                          <div style="width: ${pct}%; height: 100%; background: ${isCorrectOpt ? 'var(--success-color)' : 'var(--accent-color)'}; border-radius: 8px; transition: width 0.3s;"></div>
                        </div>
                        <span style="width: 60px; text-align: right; font-size: 12px; color: var(--text-secondary);">${cnt}人 (${pct}%)</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          } else if (q.type === 'matching') {
            const pairs = q.pairs || (q.options || []).map((opt, i) => ({ left: opt, right: q.matchOptions?.[i] || '' }));
            const pairCounts = pairs.map((p, pIdx) => {
              const lKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.left, String(pIdx + 1)) : (typeof p.left === 'object' ? (p.left.key || p.left.text) : p.left);
              const rKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.right, String(pIdx + 1)) : (typeof p.right === 'object' ? (p.right.key || p.right.text) : p.right);

              let cnt = 0;
              userList.forEach(u => {
                const ans = u.answers?.[q.id]?.answer;
                if (ans && typeof ans === 'object' && ans[lKey] === rKey) {
                  cnt++;
                }
              });
              return cnt;
            });

            let allCorrectTotal = 0;
            let answeredRespondentCount = 0;
            userList.forEach(u => {
              const ans = u.answers?.[q.id];
              if (ans) {
                answeredRespondentCount++;
                if (ans.isCorrect) allCorrectTotal++;
              }
            });

            const accuracy = totalParticipants > 0 ? Math.round((allCorrectTotal / totalParticipants) * 100) : 0;

            let qAccuracyHeader = '';
            if (canShowAnswer) {
              qAccuracyHeader = `
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                  全班全對率：<strong style="color: ${accuracy >= 60 ? 'var(--success-color)' : 'var(--danger-color)'};">${accuracy}%</strong> (${allCorrectTotal}/${totalParticipants} 人全部配對正確)
                </div>
              `;
            } else {
              qAccuracyHeader = `
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
                  <span>各配對項目連線分佈統計（全班共 ${answeredRespondentCount} 人提交）</span>
                  <span style="font-size: 12px; color: var(--accent-color); font-weight: 500;">🔒 作答本題後揭曉正確配對與答對率</span>
                </div>
              `;
            }

            qStatsHtml = `
              <div style="margin-top: 10px;">
                ${qAccuracyHeader}
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${pairs.map((p, pIdx) => {
                    const cnt = pairCounts[pIdx];
                    const pct = totalParticipants > 0 ? Math.round((cnt / totalParticipants) * 100) : 0;

                    const isLeftImg = typeof p.left === 'object' && p.left !== null && (p.left.type === 'image' || !!p.left.image);
                    const leftText = typeof p.left === 'object' && p.left !== null ? (p.left.text || '') : String(p.left || '');
                    const leftImg = isLeftImg ? (p.left.image || '') : '';

                    const isRightImg = typeof p.right === 'object' && p.right !== null && (p.right.type === 'image' || !!p.right.image);
                    const rightText = typeof p.right === 'object' && p.right !== null ? (p.right.text || '') : String(p.right || '');
                    const rightImg = isRightImg ? (p.right.image || '') : '';

                    const leftDisplay = isLeftImg && leftImg
                      ? `<img src="${this.escapeHtml(leftImg)}" style="max-height: 20px; max-width: 28px; object-fit: contain; border-radius: 2px; vertical-align: middle;"> ${this.escapeHtml(leftText || '[圖]')}`
                      : this.escapeHtml(leftText);

                    const rightDisplay = isRightImg && rightImg
                      ? `<img src="${this.escapeHtml(rightImg)}" style="max-height: 20px; max-width: 28px; object-fit: contain; border-radius: 2px; vertical-align: middle;"> ${this.escapeHtml(rightText || '[圖]')}`
                      : this.escapeHtml(rightText);

                    const label = canShowAnswer
                      ? `✅ ${leftDisplay} 🔗 ${rightDisplay}`
                      : `🔗 項目 ${pIdx + 1}：${leftDisplay} ➔ ？？？`;

                    return `
                      <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
                        <span style="width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: ${canShowAnswer ? 'bold' : 'normal'}; color: ${canShowAnswer ? 'var(--success-color)' : 'var(--text-primary)'}; display: inline-flex; align-items: center; gap: 4px;">
                          ${label}
                        </span>
                        <div style="flex: 1; height: 16px; background: rgba(0,0,0,0.06); border-radius: 8px; overflow: hidden; position: relative;">
                          <div style="width: ${pct}%; height: 100%; background: ${canShowAnswer ? 'var(--success-color)' : '#5856d6'}; border-radius: 8px; transition: width 0.3s;"></div>
                        </div>
                        <span style="width: 60px; text-align: right; font-size: 12px; color: var(--text-secondary);">${cnt}人 (${pct}%)</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          } else if (q.type === 'text') {
            // 問答題條列答案文字牆
            const textAnswers = userList.map(u => ({
              name: u.userName,
              text: u.answers?.[q.id]?.answer || ''
            })).filter(item => item.text);

            if (canShowAnswer) {
              qStatsHtml = `
                <div style="margin-top: 10px;">
                  <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                    已提交回答：<strong>${textAnswers.length}</strong> 則回饋
                  </div>
                  <div style="max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding: 6px; background: var(--bg-input); border-radius: 8px; border: 1px solid var(--border-color);">
                    ${textAnswers.length > 0 ? textAnswers.map(item => `
                      <div style="padding: 8px 12px; background: var(--bg-card); border-radius: 6px; border-left: 3px solid var(--accent-color); font-size: 13px; line-height: 1.4;">
                        <strong style="color: var(--accent-color);">${this.escapeHtml(item.name)}：</strong>
                        <span>${this.escapeHtml(item.text)}</span>
                      </div>
                    `).join('') : '<div style="color: var(--text-muted); font-size: 12px; text-align: center; padding: 12px;">尚無學生提交問答</div>'}
                  </div>
                </div>
              `;
            } else {
              qStatsHtml = `
                <div style="margin-top: 10px;">
                  <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
                    <span>已提交回答：<strong>${textAnswers.length}</strong> 則回饋</span>
                    <span style="font-size: 12px; color: var(--accent-color); font-weight: 500;">🔒 完成作答後揭曉同學回饋</span>
                  </div>
                  <div style="padding: 16px; background: var(--bg-input); border-radius: 8px; border: 1px dashed var(--border-color); text-align: center; color: var(--text-muted); font-size: 13px;">
                    🔒 您尚未回答本題，請於作答本題後再來檢視全班同學的精采想法！
                  </div>
                </div>
              `;
            }
          }

          const isCurrentQ = !!(this.currentActiveQuestion && this.currentActiveQuestion.id === q.id);
          const currentBadge = isCurrentQ ? `<span class="badge" style="background: #5856d6; color: white; padding: 2px 8px; border-radius: 6px; font-size: 11px; margin-left: 6px;">🎯 本題</span>` : '';
          const answeredBadge = isTeacherOrAdmin ? '' : (isAnsweredByMe
            ? `<span class="badge" style="background: rgba(52,199,89,0.12); color: var(--success-color); border: 1px solid rgba(52,199,89,0.3); padding: 1px 6px; border-radius: 6px; font-size: 11px; margin-left: 4px;">✓ 已作答</span>`
            : `<span class="badge" style="background: rgba(142,142,147,0.15); color: var(--text-secondary); border: 1px solid rgba(142,142,147,0.3); padding: 1px 6px; border-radius: 6px; font-size: 11px; margin-left: 4px;">⏳ 尚未作答</span>`
          );
          const cardBorder = isCurrentQ ? 'border: 2px solid #5856d6; box-shadow: 0 4px 16px rgba(88,86,214,0.18);' : 'border: 1px solid var(--border-color);';

          const qTypeLabel = q.type === 'single' ? '單選題' : (q.type === 'multiple' ? '複選題' : (q.type === 'matching' ? '配對題' : '問答題'));

          questionsHtml += `
            <div id="vq-stats-q-${q.id}" style="background: var(--bg-card); ${cardBorder} border-radius: 12px; padding: 14px; margin-bottom: 12px; transition: all 0.3s;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="font-weight: bold; color: var(--accent-color); font-size: 14px;">第 ${qIdx + 1} 題（${q.timeFormatted || this.formatSeconds(q.time)}）</span>
                  ${currentBadge}
                  ${answeredBadge}
                </div>
                <span style="font-size: 12px; color: var(--text-secondary);">${qTypeLabel}</span>
              </div>
              <div style="font-size: 15px; font-weight: bold; margin: 6px 0; color: var(--text-primary);">${this.escapeHtml(q.prompt)}</div>
              ${qStatsHtml}
            </div>
          `;
        });
      });

      container.innerHTML = `
        <!-- 統計摘要卡片 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 18px;">
          <div style="background: var(--bg-card); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); text-align: center;">
            <div style="font-size: 12px; color: var(--text-secondary);">參與人數</div>
            <div style="font-size: 24px; font-weight: bold; color: var(--accent-color);">${totalParticipants} 人</div>
          </div>
          <div style="background: var(--bg-card); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); text-align: center;">
            <div style="font-size: 12px; color: var(--text-secondary);">全班平均得分</div>
            <div style="font-size: 24px; font-weight: bold; color: var(--success-color);">${avgScore} / ${maxPossibleScore}</div>
          </div>
          <div style="background: var(--bg-card); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); text-align: center;">
            <div style="font-size: 12px; color: var(--text-secondary);">平均答對率</div>
            <div style="font-size: 24px; font-weight: bold; color: #5856d6;">${avgRate}%</div>
          </div>
        </div>

        <!-- 各題詳細統計 -->
        <h4 style="margin: 16px 0 10px 0; font-size: 16px;">📊 各題答題分佈與統計（共 ${targetQuestions.length} 題）</h4>
        ${questionsHtml}

        <!-- 全班排行榜 -->
        <h4 style="margin: 20px 0 10px 0; font-size: 16px;">🏆 全班成績排行榜</h4>
        <div style="max-height: 220px; overflow-y: auto; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color); padding: 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary); text-align: left;">
                <th style="padding: 8px;">排名</th>
                <th style="padding: 8px;">學生暱稱</th>
                <th style="padding: 8px; text-align: center;">答對題數</th>
                <th style="padding: 8px; text-align: right;">總得分</th>
              </tr>
            </thead>
            <tbody>
              ${leaderboard.length > 0 ? leaderboard.map((item, idx) => {
                const isMe = !!((myUserName && item.userName === myUserName) || (myUserId && item.userId === myUserId));
                const rowBg = isMe ? 'background: rgba(88,86,214,0.08); font-weight: bold;' : '';
                const meBadge = isMe ? `<span class="badge" style="background: #5856d6; color: white; padding: 1px 6px; border-radius: 6px; font-size: 10px; margin-left: 6px;">我</span>` : '';
                return `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.04); ${rowBg}">
                  <td style="padding: 8px; font-weight: bold; color: ${idx === 0 ? '#ffcc00' : (idx === 1 ? '#8e8e93' : (idx === 2 ? '#cd7f32' : 'var(--text-primary)'))};">
                    ${idx === 0 ? '🥇 1' : (idx === 1 ? '🥈 2' : (idx === 2 ? '🥉 3' : `${idx + 1}`))}
                  </td>
                  <td style="padding: 8px; font-weight: 500;">
                    ${this.escapeHtml(item.userName)}
                    ${meBadge}
                  </td>
                  <td style="padding: 8px; text-align: center;">${item.correctCount} / ${targetQuestions.length}</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; color: var(--success-color);">${item.score} 分</td>
                </tr>
              `;}).join('') : '<tr><td colspan="4" style="text-align: center; padding: 16px; color: var(--text-muted);">尚無作答數據</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; flex-wrap: wrap; align-items: center;">
          <button type="button" class="action-btn" id="vqAnalyticsBottomCloseBtn" onclick="window.videoQuiz.closeClassAnalytics()" style="background: var(--bg-card); border: 1.5px solid var(--border-color); color: var(--text-primary); padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 13px;" title="關閉統計視窗">
            ✕ 關閉視窗
          </button>
          <button type="button" class="action-btn" onclick="window.videoQuiz.exportAnalyticsCSV()" style="background: var(--accent-color); color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 13px;">
            📥 匯出全班成績 CSV
          </button>
        </div>
      `;
    }

    // 匯出全班成績 CSV (多影片測驗組合彙整全體題目)
    exportAnalyticsCSV() {
      const quiz = this.resolveCurrentActiveQuiz();
      if (!quiz) return;
      const targetQuestions = (quiz.allQuestions && quiz.allQuestions.length > 0) ? quiz.allQuestions : (quiz.questions || []);
      const userList = Object.values(this.cachedRemoteAnswers || {});
      const isTeacherOrAdmin = (this.isTeacher || window.app?.isAdmin);
      let csv = '\uFEFF學生暱稱,總得分,答對題數';
      targetQuestions.forEach((q, idx) => {
        const vPrefix = q.videoIndex ? `[影片${q.videoIndex}]` : '';
        csv += `,${vPrefix}第${idx + 1}題(${q.timeFormatted || this.formatSeconds(q.time)})`;
      });
      csv += '\r\n';

      userList.forEach(u => {
        let totalScore = 0;
        let correctCount = 0;
        const answers = u.answers || {};
        const qCols = targetQuestions.map(q => {
          const a = answers[q.id];
          if (a && a.isCorrect) {
            totalScore += (a.score || 10);
            correctCount++;
          }
          const isAnsweredByMe = !!(this.userAnswers && this.userAnswers[q.id]);
          const canShowQ = isTeacherOrAdmin || isAnsweredByMe;
          if (!canShowQ) {
            return '"🔒 作答後揭曉"';
          }
          const ansVal = a ? (Array.isArray(a.answer) ? a.answer.join(';') : a.answer) : '未作答';
          return `"${String(ansVal).replace(/"/g, '""')}"`;
        });

        csv += `"${(u.userName || '匿名').replace(/"/g, '""')}",${totalScore},${correctCount},${qCols.join(',')}\r\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${quiz.title}_全班答題統計_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // ==========================================
    // 視覺化影片出題編輯器 (Visual Quiz Editor)
    // ==========================================

    // ==========================================
    // 測驗組合 (Quiz Sets)
    // ==========================================

    renderCustomSetsList() {
      const container = document.getElementById('vqAdminCustomSetsList');
      if (!container) return;

      if (!this.customSets || this.customSets.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 18px; background: var(--bg-card); border-radius: 10px; border: 1px dashed var(--border-color); color: var(--text-secondary); font-size: 13px;">
            💡 尚未建立任何測驗組合。<br>
            您可以在「單題測驗與題庫管理」頁籤中勾選單部或多部影片，點選「🌟 儲存為測驗組合」，即可建立專屬快速測驗組！
          </div>
        `;
        return;
      }

      container.className = 'vq-custom-sets-grid';
      container.innerHTML = this.customSets.map(set => {
        const validQuizIds = [...new Set(set.quizIds || [])];
        const resolvedQuizzes = validQuizIds.map(id => (this.quizzes || []).find(q => q.id === id)).filter(Boolean);
        const count = resolvedQuizzes.length > 0 ? resolvedQuizzes.length : (validQuizIds.length || set.quizCount || 0);
        const totalQ = resolvedQuizzes.length > 0
          ? resolvedQuizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0)
          : (set.totalQuestions || 0);
        const titles = (resolvedQuizzes.length > 0
          ? resolvedQuizzes.map(q => q.title)
          : (set.quizTitles || [])
        ).filter(Boolean).map(t => `<span style="background: var(--bg-input); border: 1px solid var(--border-color); padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-right: 4px; display: inline-block; margin-top: 3px;">🎬 ${this.escapeHtml(t)}</span>`).join('');
        return `
          <div class="draggable-custom-set" draggable="true" data-set-id="${set.id}" style="background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03); cursor: grab; transition: transform 0.15s, box-shadow 0.15s;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;">
                  <span class="drag-handle" style="cursor: grab; color: var(--text-muted); font-size: 15px; user-select: none;" title="按住拖曳調整組合排序">☰</span>
                  <span style="font-weight: bold; font-size: 14px; color: var(--text-primary); word-break: break-word;">🌟 ${this.escapeHtml(set.name)}</span>
                  <button class="action-btn" onclick="window.videoQuiz.openEditCustomSetNameModal('${set.id}')" title="編輯組合內容與名稱" style="background: transparent; border: none; padding: 2px 4px; cursor: pointer; color: var(--accent-color); font-size: 13px; line-height: 1; flex-shrink: 0;">✏️</button>
                </div>
                <div style="display: flex; gap: 4px; flex-shrink: 0;">
                  <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 6px; border-radius: 6px; font-size: 11px; white-space: nowrap;">${count} 部影片</span>
                  <span class="badge" style="background: #34c759; color: white; padding: 2px 6px; border-radius: 6px; font-size: 11px; white-space: nowrap;">${totalQ} 題</span>
                </div>
              </div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.4;">
                <div>建立日期：${new Date(set.createdAt || Date.now()).toLocaleDateString()}</div>
                <div style="margin-top: 4px;">${titles}</div>
              </div>
            </div>
            <div style="display: flex; gap: 4px; align-items: center; flex-wrap: nowrap; margin-top: 8px; border-top: 1px solid var(--border-color); padding-top: 8px; width: 100%; box-sizing: border-box;">
              <button class="custom-set-action-btn action-btn" onclick="window.videoQuiz.startSyncQuizFromCustomSet('${set.id}')" style="flex: 1; min-width: 0; background: var(--accent-color); color: white; border: none; padding: 5px 6px; border-radius: 6px; font-size: 11.5px; font-weight: bold; cursor: pointer; white-space: nowrap; text-align: center;" title="以此組合直接發起全班同步測驗">
                ▶ 全班開測
              </button>
              <button class="custom-set-action-btn action-btn" onclick="window.videoQuiz.assignCustomSetToSelfPaced('${set.id}')" style="flex: 1; min-width: 0; background: #34c759; color: white; border: none; padding: 5px 6px; border-radius: 6px; font-size: 11.5px; font-weight: bold; cursor: pointer; white-space: nowrap; text-align: center;" title="切換為學生自主學習此組合">
                🎧 自主學習
              </button>
              <button class="custom-set-action-btn action-btn" onclick="window.app.openQuickCopyCustomSetModal('${set.id}')" style="flex: 1.2; min-width: 0; background: rgba(88, 86, 214, 0.12); color: #5856d6; border: 1px solid rgba(88, 86, 214, 0.3); padding: 5px 6px; border-radius: 6px; font-size: 11.5px; font-weight: bold; cursor: pointer; white-space: nowrap; text-align: center;" title="複製此測驗組合到其他班級">
                📤 複製到其他班
              </button>
              <button class="custom-set-action-btn action-btn" onclick="window.videoQuiz.deleteCustomSet('${set.id}')" style="flex: 0 0 auto; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--danger-color); padding: 5px 8px; border-radius: 6px; font-size: 12px; cursor: pointer; white-space: nowrap;" title="刪除此組合">
                🗑️
              </button>
            </div>
          </div>
        `;
      }).join('');

      this.initCustomSetDragAndDrop();
    }

    // 開啟編輯測驗組合彈窗 (支援修改名稱、增修組合內影片與關鍵字搜尋)
    openEditCustomSetNameModal(setId) {
      const set = setId ? (this.customSets || []).find(s => s.id === setId) : null;
      this.editingCustomSetId = set ? set.id : null;
      this.editingCustomSetQuizIds = set && Array.isArray(set.quizIds)
        ? [...set.quizIds]
        : (this.selectedQuizIds && this.selectedQuizIds.size > 0 ? Array.from(this.selectedQuizIds) : []);
      this.editingCustomSetSearchQuery = '';

      const modalTitle = document.getElementById('vqEditCustomSetModalTitle');
      if (modalTitle) {
        modalTitle.textContent = set ? '✏️ 編輯測驗組合與影片清單' : '🌟 建立新測驗組合';
      }

      const input = document.getElementById('vqEditCustomSetNameInput');
      if (input) {
        input.value = set ? (set.name || '') : (this.editingCustomSetQuizIds.length > 0 ? `測驗組合 (${this.editingCustomSetQuizIds.length}部影片)` : '自訂測驗組合');
      }

      const searchInput = document.getElementById('vqCustomSetSearchQuizInput');
      if (searchInput) {
        searchInput.value = '';
      }

      this.renderEditCustomSetUI();

      const modal = document.getElementById('vqEditCustomSetNameModal');
      if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
          if (input) {
            input.focus();
            input.select();
          }
        }, 50);
      } else {
        const newName = prompt('請輸入新的測驗組合名稱：', set ? set.name : '新測驗組合');
        if (newName && newName.trim()) {
          if (set) {
            set.name = newName.trim();
          }
          this.saveCustomSets();
          this.renderCustomSetsList();
          this.renderQuizSelector();
          if (window.app) window.app.showNotification('成功', `已將測驗組合更名為「${newName.trim()}」！`);
        }
      }
    }

    // 關閉編輯測驗組合名稱彈窗
    closeEditCustomSetNameModal() {
      const modal = document.getElementById('vqEditCustomSetNameModal');
      if (modal) modal.style.display = 'none';
      this.editingCustomSetId = null;
      this.editingCustomSetQuizIds = [];
      this.editingCustomSetSearchQuery = '';
    }

    // 渲染編輯組合中的影片與候選影片清單 (增修組合中的影片)
    renderEditCustomSetUI() {
      // 1. 渲染目前組合收錄的影片清單
      const currentContainer = document.getElementById('vqEditCustomSetCurrentList');
      const statsBadge = document.getElementById('vqEditCustomSetStatsBadge');

      const currentQuizzes = (this.editingCustomSetQuizIds || [])
        .map(qid => (this.quizzes || []).find(q => q.id === qid))
        .filter(Boolean);

      const totalCount = currentQuizzes.length;
      const totalQ = currentQuizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);

      if (statsBadge) {
        statsBadge.textContent = `共 ${totalCount} 部影片 · ${totalQ} 題`;
      }

      if (currentContainer) {
        if (totalCount === 0) {
          currentContainer.innerHTML = `
            <div style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 13px; background: var(--bg-input); border-radius: 8px; border: 1px dashed var(--border-color);">
              尚未加入任何影片，請從下方搜尋並加入單題測驗！
            </div>
          `;
        } else {
          currentContainer.innerHTML = currentQuizzes.map((quiz, idx) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                <span style="font-size: 12px; font-weight: bold; color: var(--text-muted); width: 20px; text-align: center; flex-shrink: 0;">${idx + 1}.</span>
                <span style="font-size: 15px; flex-shrink: 0;">${quiz.sourceType === 'mp4' ? '🎬' : '🌐'}</span>
                <div style="min-width: 0; flex: 1;">
                  <div style="font-size: 13px; font-weight: bold; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${this.escapeHtml(quiz.title || '')}">
                    ${this.escapeHtml(quiz.title || '未命名測驗')}
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary);">
                    ${quiz.subject || '全科'} · 共 ${quiz.questions?.length || 0} 題
                  </div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                <button type="button" onclick="window.videoQuiz.moveQuizInEditingCustomSet('${quiz.id}', -1)" ${idx === 0 ? 'disabled style="opacity: 0.3; cursor: not-allowed; padding: 4px 8px; font-size: 11px; border-radius: 5px; border: 1px solid var(--border-color); background: var(--bg-card);"' : 'style="cursor: pointer; padding: 4px 8px; font-size: 11px; border-radius: 5px; border: 1px solid var(--border-color); background: var(--bg-card);"'} title="上移">▲</button>
                <button type="button" onclick="window.videoQuiz.moveQuizInEditingCustomSet('${quiz.id}', 1)" ${idx === totalCount - 1 ? 'disabled style="opacity: 0.3; cursor: not-allowed; padding: 4px 8px; font-size: 11px; border-radius: 5px; border: 1px solid var(--border-color); background: var(--bg-card);"' : 'style="cursor: pointer; padding: 4px 8px; font-size: 11px; border-radius: 5px; border: 1px solid var(--border-color); background: var(--bg-card);"'} title="下移">▼</button>
                <button type="button" onclick="window.videoQuiz.removeQuizFromEditingCustomSet('${quiz.id}')" title="移出組合" style="padding: 4px 10px; font-size: 11.5px; background: rgba(255,59,48,0.1); color: #ff3b30; border: 1px solid rgba(255,59,48,0.3); border-radius: 5px; cursor: pointer; font-weight: bold;">🗑️ 移出</button>
              </div>
            </div>
          `).join('');
        }
      }

      // 2. 渲染搜尋候選清單
      this.renderEditCustomSetCandidates();
    }

    // 渲染搜尋候選清單 (透過搜尋找到單題影片加入)
    renderEditCustomSetCandidates() {
      const candidateContainer = document.getElementById('vqEditCustomSetCandidateList');
      if (!candidateContainer) return;

      const q = (this.editingCustomSetSearchQuery || '').toLowerCase();
      const allQuizzes = this.quizzes || [];

      const filtered = allQuizzes.filter(quiz => {
        if (!q) return true;
        const title = (quiz.title || '').toLowerCase();
        const subject = (quiz.subject || '').toLowerCase();
        const desc = (quiz.description || '').toLowerCase();
        return title.includes(q) || subject.includes(q) || desc.includes(q);
      });

      if (filtered.length === 0) {
        candidateContainer.innerHTML = `
          <div style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 12.5px; background: var(--bg-input); border-radius: 8px;">
            無符合「${this.escapeHtml(this.editingCustomSetSearchQuery)}」的單題測驗
          </div>
        `;
        return;
      }

      candidateContainer.innerHTML = filtered.map(quiz => {
        const isAdded = (this.editingCustomSetQuizIds || []).includes(quiz.id);
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
              <span style="font-size: 15px; flex-shrink: 0;">${quiz.sourceType === 'mp4' ? '🎬' : '🌐'}</span>
              <div style="min-width: 0; flex: 1;">
                <div style="font-size: 13px; font-weight: bold; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${this.escapeHtml(quiz.title || '')}">
                  ${this.escapeHtml(quiz.title || '未命名測驗')}
                </div>
                <div style="font-size: 11px; color: var(--text-secondary);">
                  ${quiz.subject || '全科'} · 共 ${quiz.questions?.length || 0} 題
                </div>
              </div>
            </div>
            <div style="flex-shrink: 0;">
              ${isAdded ? `
                <span style="font-size: 11.5px; color: var(--text-muted); background: var(--bg-card); padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 3px;">
                  ✓ 已在組合中
                </span>
              ` : `
                <button type="button" onclick="window.videoQuiz.addQuizToEditingCustomSet('${quiz.id}')" style="padding: 5px 12px; font-size: 12px; font-weight: bold; background: var(--accent-color); color: white; border: none; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;">
                  ➕ 加入
                </button>
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    // 組合編輯：搜尋關鍵字過濾
    filterCandidateQuizzesForCustomSet(query) {
      this.editingCustomSetSearchQuery = (query || '').trim();
      this.renderEditCustomSetCandidates();
    }

    // 組合編輯：將單題影片加入目前組合
    addQuizToEditingCustomSet(quizId) {
      if (!this.editingCustomSetQuizIds) this.editingCustomSetQuizIds = [];
      if (!this.editingCustomSetQuizIds.includes(quizId)) {
        this.editingCustomSetQuizIds.push(quizId);
        this.renderEditCustomSetUI();
      }
    }

    // 組合編輯：將影片從組合中移出
    removeQuizFromEditingCustomSet(quizId) {
      if (!this.editingCustomSetQuizIds) return;
      this.editingCustomSetQuizIds = this.editingCustomSetQuizIds.filter(id => id !== quizId);
      this.renderEditCustomSetUI();
    }

    // 組合編輯：調整影片在組合中的順序
    moveQuizInEditingCustomSet(quizId, direction) {
      if (!this.editingCustomSetQuizIds) return;
      const idx = this.editingCustomSetQuizIds.indexOf(quizId);
      if (idx === -1) return;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= this.editingCustomSetQuizIds.length) return;
      const temp = this.editingCustomSetQuizIds[idx];
      this.editingCustomSetQuizIds[idx] = this.editingCustomSetQuizIds[targetIdx];
      this.editingCustomSetQuizIds[targetIdx] = temp;
      this.renderEditCustomSetUI();
    }

    // 確認編輯測驗組合 (儲存名稱與增修影片)
    confirmEditCustomSetName() {
      const input = document.getElementById('vqEditCustomSetNameInput');
      const newName = input ? input.value.trim() : '';
      if (!newName) {
        if (window.app) window.app.showNotification('提示', '請輸入測驗組合名稱！');
        return;
      }

      let quizIdsToSave = [];
      if (this.editingCustomSetQuizIds && this.editingCustomSetQuizIds.length > 0) {
        quizIdsToSave = [...this.editingCustomSetQuizIds];
      } else if (this.editingCustomSetId) {
        const existing = (this.customSets || []).find(s => s.id === this.editingCustomSetId);
        if (existing && Array.isArray(existing.quizIds)) {
          quizIdsToSave = [...existing.quizIds];
        }
      }

      if (quizIdsToSave.length === 0) {
        if (window.app) window.app.showNotification('提示', '請至少加入一部單題測驗影片到組合中！');
        return;
      }

      const selectedQuizzes = quizIdsToSave
        .map(qid => (this.quizzes || []).find(q => q.id === qid))
        .filter(Boolean);

      const totalQuestions = selectedQuizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);

      if (this.editingCustomSetId) {
        // 修改現有組合
        const set = (this.customSets || []).find(s => s.id === this.editingCustomSetId);
        if (set) {
          set.name = newName;
          set.quizIds = [...new Set(quizIdsToSave)];
          set.quizTitles = selectedQuizzes.map(q => q.title || '');
          set.quizCount = selectedQuizzes.length;
          set.totalQuestions = totalQuestions;
          set.updatedAt = Date.now();
        }
      } else {
        // 新增自訂組合
        const newSet = {
          id: 'set_' + Date.now(),
          name: newName,
          quizIds: [...new Set(quizIdsToSave)],
          quizTitles: selectedQuizzes.map(q => q.title || ''),
          quizCount: selectedQuizzes.length,
          totalQuestions: totalQuestions,
          createdAt: Date.now()
        };
        if (!this.customSets) this.customSets = [];
        this.customSets.unshift(newSet);
      }

      this.saveCustomSets();
      this.closeEditCustomSetNameModal();
      this.renderCustomSetsList();
      this.renderQuizSelector();

      if (window.app) {
        window.app.showNotification('成功', `已成功儲存測驗組合「${newName}」（含 ${selectedQuizzes.length} 部影片）！`);
      }
    }

    // 核選單部或多部影片加入組合 (需求 c)
    toggleSelectQuizForCustomSet(quizId) {
      if (this.selectedQuizIds.has(quizId)) {
        this.selectedQuizIds.delete(quizId);
      } else {
        this.selectedQuizIds.add(quizId);
      }
      this.renderEditorQuizList();
    }

    // 清除已勾選的影片
    clearSelectedQuizzes() {
      this.selectedQuizIds.clear();
      this.renderEditorQuizList();
    }

    // 開啟自訂組合命名彈窗
    openSaveCustomSetModal() {
      if (this.selectedQuizIds.size === 0) {
        if (window.app) window.app.showNotification('提示', '請先核選至少一部影片！');
        return;
      }

      const selectedQuizzes = this.quizzes.filter(q => this.selectedQuizIds.has(q.id));
      const input = document.getElementById('vqCustomSetNameInput');
      if (input) {
        if (selectedQuizzes.length === 1) {
          input.value = `${selectedQuizzes[0].title.replace(/^[^a-zA-Z0-9\u4e00-\u9fa5]+/, '')} - 精選速測組`;
        } else {
          const shortNames = selectedQuizzes.map(q => q.title.replace(/^[^a-zA-Z0-9\u4e00-\u9fa5]+/, '').slice(0, 6)).join('與');
          input.value = `${shortNames} - 跨領域測驗組`;
        }
      }

      const previewContainer = document.getElementById('vqCustomSetQuestionsPreview');
      if (previewContainer) {
        previewContainer.innerHTML = selectedQuizzes.map((q, idx) => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 13px; background: var(--bg-card); margin-bottom: 4px; border-radius: 6px;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">影片 ${idx + 1}</span>
              <span style="font-weight: bold; color: var(--text-primary);">${this.escapeHtml(q.title)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="badge" style="background: ${q.enabled !== false ? 'rgba(52,199,89,0.15)' : 'rgba(142,142,147,0.15)'}; color: ${q.enabled !== false ? '#28a745' : 'var(--text-muted)'}; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
                ${q.enabled !== false ? '🟢 前台開放' : '⚪ 前台隱藏'}
              </span>
              <span style="font-size: 12px; color: var(--text-secondary); white-space: nowrap;">共 ${q.questions?.length || 0} 題</span>
            </div>
          </div>
        `).join('');
      }

      const modal = document.getElementById('vqCustomSetModal');
      if (modal) modal.style.display = 'flex';
    }

    // 關閉自訂組合命名彈窗
    closeCustomSetModal() {
      const modal = document.getElementById('vqCustomSetModal');
      if (modal) modal.style.display = 'none';
    }

    // 確認儲存自訂測驗組合 (多影片)
    confirmSaveCustomSet() {
      const input = document.getElementById('vqCustomSetNameInput');
      const name = input ? input.value.trim() : '';
      if (!name) {
        if (window.app) window.app.showNotification('提示', '請輸入組合自訂名稱！');
        return;
      }

      const selected = this.quizzes.filter(q => this.selectedQuizIds.has(q.id));
      if (selected.length === 0) {
        if (window.app) window.app.showNotification('提示', '未選取任何影片！');
        return;
      }

      const totalQuestions = selected.reduce((sum, q) => sum + (q.questions?.length || 0), 0);

      const newSet = {
        id: 'set_' + Date.now(),
        name: name,
        quizIds: selected.map(q => q.id),
        quizTitles: selected.map(q => q.title),
        quizCount: selected.length,
        totalQuestions: totalQuestions,
        createdAt: Date.now()
      };

      this.customSets.unshift(newSet);
      this.saveCustomSets();
      this.clearSelectedQuizzes();
      this.closeCustomSetModal();
      this.renderCustomSetsList();
      this.renderQuizSelector();

      if (window.app) {
        window.app.showNotification('成功', `已成功建立測驗組合「${name}」（含 ${selected.length} 部影片）！未來可直接一鍵開測。`);
      }
    }

    // 刪除自訂測驗組合
    deleteCustomSet(setId) {
      const set = this.customSets.find(s => s.id === setId);
      if (!set) return;
      if (!confirm(`確定要刪除「${set.name}」測驗組合嗎？`)) return;

      this.customSets = this.customSets.filter(s => s.id !== setId);
      this.saveCustomSets();
      this.renderCustomSetsList();
      this.renderQuizSelector();
      if (window.app) window.app.showNotification('成功', `已刪除測驗組合「${set.name}」。`);
    }

    // 從自訂組合直接發起全班同步測驗
    startSyncQuizFromCustomSet(setId) {
      const set = this.customSets.find(s => s.id === setId);
      if (!set) return;

      this.setGlobalMode('sync');
      this.startSyncQuizAsTeacher('custom:' + setId);
    }

    // 將自訂組合指派給自主學習模式
    assignCustomSetToSelfPaced(setId) {
      const set = this.customSets.find(s => s.id === setId);
      if (!set) return;

      this.globalMode = 'self';
      this.hasAssignedSelfQuiz = true;
      this.applyGlobalMode('self');
      this.startSelfPacedQuiz('custom:' + setId);
      if (this.settingsRef) {
        this.settingsRef.update({
          mode: 'self',
          assignedQuizId: 'custom:' + setId,
          updatedAt: Date.now()
        });
      }
      this.updateAdminBroadcastUI(this.lastSession);
      if (window.app && typeof window.app.switchToTab === 'function') {
        window.app.switchToTab('panel-video-quiz');
      }
      if (window.app) {
        window.app.showNotification('成功', `已指派「${set.name}」進入個人自主學習！`);
      }
    }

    // 從單題測驗卡片直接指派進入個人自主學習模式
    launchSelfPacedQuiz(quizId) {
      const quiz = this.quizzes.find(q => q.id === quizId);
      if (!quiz) return;

      this.globalMode = 'self';
      this.hasAssignedSelfQuiz = true;
      this.applyGlobalMode('self');
      this.startSelfPacedQuiz(quizId);
      if (this.settingsRef) {
        this.settingsRef.update({
          mode: 'self',
          assignedQuizId: quizId,
          updatedAt: Date.now()
        });
      }
      this.updateAdminBroadcastUI(this.lastSession);
      if (window.app && typeof window.app.switchToTab === 'function') {
        window.app.switchToTab('panel-video-quiz');
      }
      if (window.app) {
        window.app.showNotification('自主學習模式', `已指派「${quiz.title}」進入個人自主學習！學生端已同步切換。`);
      }
    }

    // 切換影片在前台的開放 / 隱藏狀態 (需求 a)
    toggleQuizEnabled(quizId) {
      const quiz = this.quizzes.find(q => q.id === quizId);
      if (!quiz) return;

      quiz.enabled = (quiz.enabled === false); // 若為 false 轉為 true，若為 true 或 undefined 轉為 false
      this.saveQuizzes();
      this.renderEditorQuizList();
      this.renderQuizSelector();

      if (window.app) {
        const status = quiz.enabled !== false ? '已開放（學生端可見並能進行測驗）' : '已隱藏（學生端不會顯示此影片）';
        window.app.showNotification('影片出題設定', `《${quiz.title}》：${status}`);
      }
    }

    // 設定後台題庫搜尋關鍵字 (需求 b)
    setAdminSearchQuery(query) {
      this.adminSearchQuery = (query || '').trim().toLowerCase();
      this.adminCurrentPage = 1;
      this.renderEditorQuizList();
    }

    // 切換後台題庫分頁 (需求 b)
    setAdminPage(page) {
      this.adminCurrentPage = page;
      this.renderEditorQuizList();
    }

    // ==========================================
    // 視覺化影片出題編輯器 (Visual Quiz Editor)
    // ==========================================

    renderEditorQuizList() {
      const container = document.getElementById('vqAdminEditorQuizList');
      const paginationContainer = document.getElementById('vqAdminPaginationContainer');

      // 1. 影片搜尋過濾 (需求 b)
      const qText = this.adminSearchQuery;
      const filtered = this.quizzes.filter(quiz => {
        if (!qText) return true;
        const inTitle = (quiz.title || '').toLowerCase().includes(qText);
        const inDesc = (quiz.description || '').toLowerCase().includes(qText);
        const inUrl = (quiz.videoUrl || '').toLowerCase().includes(qText);
        const inQ = (quiz.questions || []).some(q => 
          (q.prompt || '').toLowerCase().includes(qText) || 
          (q.explanation || '').toLowerCase().includes(qText) ||
          (q.options || []).some(opt => opt.toLowerCase().includes(qText))
        );
        return inTitle || inDesc || inUrl || inQ;
      });

      // 2. 影片分頁計算 (需求 b)
      const totalItems = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / this.adminPageSize));
      if (this.adminCurrentPage > totalPages) this.adminCurrentPage = totalPages;
      if (this.adminCurrentPage < 1) this.adminCurrentPage = 1;

      const startIndex = (this.adminCurrentPage - 1) * this.adminPageSize;
      const pageQuizzes = filtered.slice(startIndex, startIndex + this.adminPageSize);

      // 3. 渲染題庫卡片清單
      let html = '';

      // 多選影片批量操作列 (需求 c)
      if (this.selectedQuizIds.size > 0) {
        html += `
          <div style="background: rgba(0,122,255,0.08); border: 1.5px dashed var(--accent-color); border-radius: 10px; padding: 10px 16px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 13px; font-weight: bold; color: var(--accent-color);">
              ✨ 目前已核選 ${this.selectedQuizIds.size} 部影片
            </span>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.videoQuiz.openSaveCustomSetModal()" class="action-btn" style="background: var(--accent-color); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 12px; cursor: pointer;">
                🌟 儲存為測驗組合
              </button>
              <button onclick="window.videoQuiz.clearSelectedQuizzes()" class="action-btn" style="background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
                ✕ 取消核選
              </button>
            </div>
          </div>
        `;
      }

      if (this.quizzes.length === 0) {
        html += `
          <div style="text-align: center; padding: 28px; color: var(--text-secondary); font-size: 14px; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color);">
            目前尚無影片測驗，請點擊上方「➕ 建立新影片測驗」或「📥 匯入題庫」開始！
          </div>
        `;
      } else if (pageQuizzes.length === 0) {
        html += `
          <div style="text-align: center; padding: 24px; color: var(--text-secondary); font-size: 14px; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color);">
            🔍 查無符合「${this.escapeHtml(qText)}」的影片或題目，請嘗試其他關鍵字。
          </div>
        `;
      } else {
        html += pageQuizzes.map(quiz => {
          const questions = quiz.questions || [];
          const isEnabled = (quiz.enabled !== false);
          const isChecked = this.selectedQuizIds.has(quiz.id);

          const questionsPreview = questions.length === 0 ? `
            <div style="padding: 6px; color: var(--text-muted); font-size: 12px; text-align: center;">尚未設定任何題目</div>
          ` : questions.map((q, idx) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; margin-bottom: 4px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; font-size: 12px; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 6px; flex: 1;">
                <span class="badge" style="background: var(--accent-color); color: white; padding: 1px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap;">⏱️ ${q.timeFormatted || '00:00'}</span>
                <span class="badge" style="background: var(--bg-input); border: 1px solid var(--border-color); padding: 1px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap;">${q.type === 'single' ? '單選' : (q.type === 'multiple' ? '複選' : '問答')}</span>
                <span style="color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 320px;">${this.escapeHtml(q.prompt)}</span>
              </div>
              <span style="color: var(--text-secondary); font-size: 11px; white-space: nowrap;">${q.points || 10} 分</span>
            </div>
          `).join('');

          return `
            <div class="draggable-quiz-card" draggable="true" data-quiz-id="${quiz.id}" style="background: var(--bg-card); border: 1.5px solid ${isChecked ? 'var(--accent-color)' : 'var(--border-color)'}; border-radius: 12px; padding: 14px 16px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: transform 0.15s, box-shadow 0.15s;">
              <!-- 測驗卡片頂部控制列 (拖曳手柄、核選、標題、開放開關、操作按鈕) -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                <div style="display: flex; align-items: flex-start; gap: 8px; flex: 1; min-width: 260px;">
                  <!-- 拖曳手柄與核選以自訂常用組合 (需求 3-C) -->
                  <div style="display: flex; align-items: center; gap: 6px; padding-top: 3px;">
                    <span class="drag-handle" style="cursor: grab; color: var(--text-muted); font-size: 16px; user-select: none;" title="按住拖曳調整測驗排序">☰</span>
                    <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="window.videoQuiz.toggleSelectQuizForCustomSet('${quiz.id}')" title="核選此影片加入常用組合" style="width: 18px; height: 18px; cursor: pointer;">
                  </div>
                  <div>
                    <div style="font-weight: bold; font-size: 16px; color: var(--text-primary); display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span>🎬 ${this.escapeHtml(quiz.title)}</span>
                      <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 8px; font-size: 11px;">共 ${questions.length} 題</span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px; word-break: break-all;">
                      影片：<a href="${this.escapeHtml(quiz.videoUrl)}" target="_blank" style="color: var(--accent-color); text-decoration: none;">${this.escapeHtml(quiz.videoUrl)}</a> · 建立時間：${new Date(quiz.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <!-- 影片出題開關與編輯/刪除按鈕 -->
                <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                  <button class="presentation-tool-btn active" onclick="window.videoQuiz.startSyncQuizAsTeacher('${quiz.id}')" style="font-size: 14px; padding: 6px 14px;" title="以此題目立即發起全班同步連線測驗">
                    🚀 發起全班同步測驗
                  </button>
                  <button class="presentation-tool-btn" onclick="window.videoQuiz.launchSelfPacedQuiz('${quiz.id}')" style="background: rgba(52,199,89,0.12); color: #28a745; border: 1.5px solid rgba(52,199,89,0.4); font-size: 14px; padding: 6px 12px; font-weight: bold; border-radius: 8px;" title="以此題目立即指派進入個人自主學習模式">
                    🎧 自主學習模式
                  </button>
                  <button class="presentation-tool-btn" onclick="window.app && window.app.openSingleItemCopyModal('videoQuiz', '${quiz.id}')" style="background: var(--bg-card); border: 1px solid var(--accent-color); color: var(--accent-color); font-size: 14px; padding: 6px 12px;" title="複製此部影片測驗至其他班級">📤 複製到其他班</button>
                  <button class="presentation-tool-btn" onclick="window.videoQuiz.openEditQuizModal('${quiz.id}')" style="background: var(--accent-color); color: white; border-color: var(--accent-color); font-size: 14px; padding: 6px 12px;">✏️ 編輯題目</button>
                  <button class="presentation-tool-btn danger" onclick="window.videoQuiz.deleteQuiz('${quiz.id}')" style="font-size: 14px; padding: 6px 12px;">🗑️ 刪除</button>
                </div>
              </div>

              <!-- 題目預覽列表 (可收合，預設為收合 需求 3-B) -->
              <div style="background: var(--bg-input); border-radius: 10px; padding: 10px 14px; border: 1px solid var(--border-color); margin-top: 8px;">
                <div onclick="window.videoQuiz.togglePreviewCollapse(this, event, '${quiz.id}')" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 13px; font-weight: bold; color: var(--text-secondary);">
                      📌 影片題目預覽（共 ${questions.length} 題）
                    </span>
                    <span id="vqPreviewArrow_${quiz.id}" class="vq-preview-arrow" style="font-size: 11.5px; color: var(--accent-color); font-weight: bold; background: rgba(0,122,255,0.08); padding: 2px 8px; border-radius: 6px;">
                      ▼ 展開預覽
                    </span>
                  </div>
                  <span style="font-size: 11px; color: var(--text-muted);">
                    點擊右上角「✏️ 編輯題目」進入完整頁面出題與微調
                  </span>
                </div>
                <div id="vqPreviewContent_${quiz.id}" class="vq-preview-content" style="display: none; margin-top: 10px; border-top: 1px dashed var(--border-color); padding-top: 8px;">
                  ${questionsPreview}
                </div>
              </div>
            </div>
          `;
        }).join('');
      }

      if (container) container.innerHTML = html;

      // 4. 渲染分頁導覽控制列 (需求 b)
      if (paginationContainer) {
        if (totalItems <= this.adminPageSize) {
          paginationContainer.innerHTML = `
            <div style="font-size: 12px; color: var(--text-secondary);">
              顯示全部 ${totalItems} 部測驗
            </div>
          `;
        } else {
          let pagesHtml = '';
          for (let p = 1; p <= totalPages; p++) {
            pagesHtml += `
              <button onclick="window.videoQuiz.setAdminPage(${p})" style="background: ${p === this.adminCurrentPage ? 'var(--accent-color)' : 'var(--bg-card)'}; color: ${p === this.adminCurrentPage ? 'white' : 'var(--text-primary)'}; border: 1px solid var(--border-color); width: 32px; height: 32px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;">
                ${p}
              </button>
            `;
          }

          paginationContainer.innerHTML = `
            <div style="font-size: 12px; color: var(--text-secondary);">
              顯示第 ${startIndex + 1} - ${Math.min(startIndex + this.adminPageSize, totalItems)} 筆，共 ${totalItems} 部測驗
            </div>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button onclick="window.videoQuiz.setAdminPage(${this.adminCurrentPage - 1})" ${this.adminCurrentPage <= 1 ? 'disabled' : ''} style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color); padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: ${this.adminCurrentPage <= 1 ? 'not-allowed' : 'pointer'}; opacity: ${this.adminCurrentPage <= 1 ? 0.5 : 1};">
                ◀ 上一頁
              </button>
              ${pagesHtml}
              <button onclick="window.videoQuiz.setAdminPage(${this.adminCurrentPage + 1})" ${this.adminCurrentPage >= totalPages ? 'disabled' : ''} style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color); padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: ${this.adminCurrentPage >= totalPages ? 'not-allowed' : 'pointer'}; opacity: ${this.adminCurrentPage >= totalPages ? 0.5 : 1};">
                下一頁 ▶
              </button>
            </div>
          `;
        }
      }

      this.initQuizDragAndDrop();
    }

    /**
     * 切換單題測驗與組合測驗子頁籤 (需求 3-A)
     */
    switchVqSubTab(tab) {
      const btnSingle = document.getElementById('btnSubTabVqSingle');
      const btnCombo = document.getElementById('btnSubTabVqCombo');
      const paneSingle = document.getElementById('vqSubTabPaneSingle');
      const paneCombo = document.getElementById('vqSubTabPaneCombo');

      if (tab === 'single') {
        if (btnSingle) btnSingle.classList.add('active');
        if (btnCombo) btnCombo.classList.remove('active');
        if (paneSingle) paneSingle.style.display = 'block';
        if (paneCombo) paneCombo.style.display = 'none';
      } else {
        if (btnSingle) btnSingle.classList.remove('active');
        if (btnCombo) btnCombo.classList.add('active');
        if (paneSingle) paneSingle.style.display = 'none';
        if (paneCombo) paneCombo.style.display = 'block';
      }
    }

    /**
     * 切換題目預覽收合與展開 (需求 3-B)
     */
    togglePreviewCollapse(triggerEl, ev, quizId) {
      if (ev && ev.stopPropagation) {
        ev.stopPropagation();
      }
      if (typeof triggerEl === 'string' && !quizId) {
        quizId = triggerEl;
        triggerEl = null;
      }

      let content = null;
      let arrow = null;

      if (triggerEl && triggerEl.closest) {
        const card = triggerEl.closest('.draggable-quiz-card') || triggerEl.parentElement;
        if (card) {
          content = card.querySelector('.vq-preview-content') || (quizId ? card.querySelector(`#vqPreviewContent_${quizId}`) : null);
          arrow = card.querySelector('.vq-preview-arrow') || (quizId ? card.querySelector(`#vqPreviewArrow_${quizId}`) : null);
        }
      }

      if (!content && quizId) {
        content = document.getElementById(`vqPreviewContent_${quizId}`);
        arrow = document.getElementById(`vqPreviewArrow_${quizId}`);
      }

      if (!content) return;
      const isHidden = content.style.display === 'none' || getComputedStyle(content).display === 'none';
      if (isHidden) {
        content.style.display = 'block';
        if (arrow) arrow.textContent = '▲ 收合預覽';
      } else {
        content.style.display = 'none';
        if (arrow) arrow.textContent = '▼ 展開預覽';
      }
    }

    /**
     * 單題測驗卡片拖曳排序 (需求 3-C)
     */
    initQuizDragAndDrop() {
      const container = document.getElementById('vqAdminEditorQuizList');
      if (!container) return;

      const cards = container.querySelectorAll('.draggable-quiz-card');
      cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
          if (['INPUT', 'BUTTON', 'SELECT', 'A', 'TEXTAREA'].includes(e.target.tagName)) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.effectAllowed = 'move';
          card.classList.add('dragging-card');
          card.style.opacity = '0.5';
        });

        card.addEventListener('dragend', () => {
          card.classList.remove('dragging-card');
          card.style.opacity = '1';

          const currentCards = [...container.querySelectorAll('.draggable-quiz-card')];
          const pageQuizIds = currentCards.map(c => c.getAttribute('data-quiz-id')).filter(Boolean);

          const quizMap = new Map(this.quizzes.map(q => [q.id, q]));
          const newQuizzes = [];

          pageQuizIds.forEach(id => {
            if (quizMap.has(id)) {
              newQuizzes.push(quizMap.get(id));
              quizMap.delete(id);
            }
          });
          quizMap.forEach(q => newQuizzes.push(q));

          this.quizzes = newQuizzes;
          this.saveQuizzes();
          if (window.app) {
            window.app.showNotification('📋 排序已更新', '單題影片測驗排序已成功調整！');
          }
        });
      });

      container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = container.querySelector('.dragging-card');
        if (!dragging) return;

        const siblings = [...container.querySelectorAll('.draggable-quiz-card:not(.dragging-card)')];
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

    /**
     * 組合測驗卡片拖曳排序 (支援一行三個 2D 網格水平與垂直拖曳換位)
     */
    initCustomSetDragAndDrop() {
      const container = document.getElementById('vqAdminCustomSetsList');
      if (!container) return;

      const sets = container.querySelectorAll('.draggable-custom-set');
      sets.forEach(setCard => {
        setCard.addEventListener('dragstart', (e) => {
          if (['INPUT', 'BUTTON', 'SELECT', 'A'].includes(e.target.tagName)) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.effectAllowed = 'move';
          setCard.classList.add('dragging-set');
          setCard.style.opacity = '0.5';
        });

        setCard.addEventListener('dragend', () => {
          setCard.classList.remove('dragging-set');
          setCard.style.opacity = '1';

          const currentSets = [...container.querySelectorAll('.draggable-custom-set')];
          const currentSetIds = currentSets.map(c => c.getAttribute('data-set-id')).filter(Boolean);

          const setMap = new Map(this.customSets.map(s => [s.id, s]));
          const reordered = [];
          currentSetIds.forEach(id => {
            if (setMap.has(id)) {
              reordered.push(setMap.get(id));
              setMap.delete(id);
            }
          });
          setMap.forEach(s => reordered.push(s));

          this.customSets = reordered;
          this.saveCustomSets();
          this.renderCustomSetsList();
          this.renderQuizSelector();
          if (window.app) {
            window.app.showNotification('📋 排序已更新', '組合測驗排序已成功調整！');
          }
        });
      });

      if (container._dragOverHandler) {
        container.removeEventListener('dragover', container._dragOverHandler);
      }

      container._dragOverHandler = (e) => {
        e.preventDefault();
        const dragging = container.querySelector('.dragging-set');
        if (!dragging) return;

        const siblings = [...container.querySelectorAll('.draggable-custom-set:not(.dragging-set)')];
        // 2D 網格判斷：先判斷行，同列中再由水平中心點判斷先後順序
        const nextSibling = siblings.find(sibling => {
          const box = sibling.getBoundingClientRect();
          if (e.clientY < box.top) return true;
          if (e.clientY <= box.bottom && e.clientX < box.left + box.width / 2) return true;
          return false;
        });

        if (nextSibling) {
          container.insertBefore(dragging, nextSibling);
        } else {
          container.appendChild(dragging);
        }
      };

      container.addEventListener('dragover', container._dragOverHandler);
    }

    openEditQuizModal(quizId = null) {
      if (quizId) {
        const found = this.quizzes.find(q => q.id === quizId);
        this.editingQuiz = JSON.parse(JSON.stringify(found));
      } else {
        this.editingQuiz = {
          id: 'vq_' + Date.now(),
          title: '新建影片測驗',
          description: '',
          videoUrl: 'https://www.youtube.com/watch?v=libKVRa01L8',
          videoType: 'youtube',
          youtubeId: 'libKVRa01L8',
          createdAt: Date.now(),
          questions: []
        };
      }

      const titleInput = document.getElementById('vqEditQuizTitle');
      const descInput = document.getElementById('vqEditQuizDesc');
      const urlInput = document.getElementById('vqEditQuizUrl');
      const pageTitle = document.getElementById('vqEditorPageTitle');

      if (titleInput) titleInput.value = this.editingQuiz.title || '';
      if (descInput) descInput.value = this.editingQuiz.description || '';
      if (urlInput) urlInput.value = this.editingQuiz.originalUrlText || this.editingQuiz.videoUrl || '';
      if (pageTitle) {
        pageTitle.textContent = quizId ? `編輯影片測驗：${this.editingQuiz.title || ''}` : '建立新影片測驗';
      }

      const s = this.editingQuiz.startTime || 0;
      const e = this.editingQuiz.endTime || 0;
      this.updateTimeRangeUI(s, e, 100);

      this.renderEditorTimelineList();
      this.loadEditorVideo();

      // 切換至完整頁面編輯器 (需求 3-D)
      const mainView = document.getElementById('vqAdminMainView');
      const editorView = document.getElementById('vqAdminEditorFullView');
      if (mainView) mainView.style.display = 'none';
      if (editorView) {
        editorView.style.display = 'block';
        editorView.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      const oldModal = document.getElementById('vqEditQuizModal');
      if (oldModal) oldModal.style.display = 'none';
    }

    closeEditQuizModal() {
      const mainView = document.getElementById('vqAdminMainView');
      const editorView = document.getElementById('vqAdminEditorFullView');
      if (editorView) editorView.style.display = 'none';
      if (mainView) {
        mainView.style.display = 'block';
        mainView.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      const oldModal = document.getElementById('vqEditQuizModal');
      if (oldModal) oldModal.style.display = 'none';

      if (this.players && this.players['vqEditorPlayerContainer']) {
        try {
          if (typeof this.players['vqEditorPlayerContainer'].pauseVideo === 'function') {
            this.players['vqEditorPlayerContainer'].pauseVideo();
          }
        } catch (e) {}
      }
      this.editingQuiz = null;
    }

    loadEditorVideo() {
      const url = document.getElementById('vqEditQuizUrl')?.value?.trim();
      if (!url) return;
      this.setupPlayer('vqEditorPlayerContainer', url);
    }

    // 渲染時間節點題目清單
    renderEditorTimelineList() {
      const container = document.getElementById('vqEditorTimelineList');
      if (!container || !this.editingQuiz) return;

      const qList = this.editingQuiz.questions || [];
      if (qList.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px;">目前尚未設定任何時間點題目，請播放影片至關鍵處點擊下方按鈕新增！</div>';
        return;
      }

      container.innerHTML = qList.map((q, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 8px;">
          <div>
            <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 6px; border-radius: 6px; font-size: 11px; margin-right: 6px;">⏱️ ${q.timeFormatted || '00:00'}</span>
            <span class="badge" style="background: rgba(0,0,0,0.06); color: var(--text-primary); padding: 2px 6px; border-radius: 6px; font-size: 11px; margin-right: 6px;">${q.type === 'single' ? '單選' : (q.type === 'multiple' ? '複選' : (q.type === 'matching' ? '配對' : '問答'))}</span>
            <strong style="font-size: 14px;">${this.escapeHtml(q.prompt)}</strong>
          </div>
          <div style="display: flex; gap: 6px;">
            <button onclick="window.videoQuiz.previewQuestionAtTime(${idx})" style="background: #5856d6; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;">▶ 跳轉</button>
            <button onclick="window.videoQuiz.openEditQuestionModal(${idx})" style="background: var(--accent-color); color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;">✏️ 編輯</button>
            <button onclick="window.videoQuiz.deleteQuestion(${idx})" style="background: var(--danger-color); color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;">✕</button>
          </div>
        </div>
      `).join('');
    }

    // 在當前播放時間開啟新增題目彈窗
    openAddQuestionModal() {
      const validTime = this.getValidCurrentTime();
      if (validTime === null) {
        if (window.app) {
          window.app.showNotification('提示', '播放器尚未就緒，無法取得有效播放時間！請先載入影片檔案。');
        } else {
          alert('播放器尚未就緒，無法取得有效播放時間！請先載入影片檔案。');
        }
        return;
      }
      const curTime = Math.round(validTime);
      const formatted = this.formatTime(curTime);

      this.editingQuestionIndex = -1;
      document.getElementById('vqQuestionTimeInput').value = curTime;
      document.getElementById('vqQuestionTimeFormatted').value = formatted;
      document.getElementById('vqQuestionTypeSelect').value = 'single';
      document.getElementById('vqQuestionPromptInput').value = '';
      document.getElementById('vqQuestionExplanationInput').value = '';
      document.getElementById('vqQuestionPointsInput').value = '10';

      this.renderQuestionOptionsEditor('single', ['選項A', '選項B', '選項C', '選項D'], '選項A');

      const hintEl = document.getElementById('vqQuestionTimeHint');
      if (hintEl) {
        hintEl.innerHTML = `💡 時間設定支援「格式化時間」（如 <code>01:25</code> 或長音檔 <code>01:15:30</code>）或「秒數」（如 <code>85</code>），兩欄位輸入時將即時雙向自動換算。`;
      }

      const modal = document.getElementById('vqQuestionEditModal');
      if (modal) modal.style.display = 'flex';
    }

    openEditQuestionModal(index) {
      if (!this.editingQuiz || !this.editingQuiz.questions[index]) return;
      const q = this.editingQuiz.questions[index];
      this.editingQuestionIndex = index;

      document.getElementById('vqQuestionTimeInput').value = q.time;
      document.getElementById('vqQuestionTimeFormatted').value = q.timeFormatted || this.formatTime(q.time);
      document.getElementById('vqQuestionTypeSelect').value = q.type || 'single';
      document.getElementById('vqQuestionPromptInput').value = q.prompt || '';
      document.getElementById('vqQuestionExplanationInput').value = q.explanation || '';
      document.getElementById('vqQuestionPointsInput').value = q.points || 10;

      this.renderQuestionOptionsEditor(q.type || 'single', q.options, q.correctAnswer, q.pairs, q.matchOptions);

      const modal = document.getElementById('vqQuestionEditModal');
      if (modal) modal.style.display = 'flex';
    }

    closeQuestionEditModal() {
      const modal = document.getElementById('vqQuestionEditModal');
      if (modal) modal.style.display = 'none';
    }

    openMatchingHelpModal() {
      const modal = document.getElementById('modalVqMatchingHelp');
      if (modal) modal.style.display = 'flex';
    }

    closeMatchingHelpModal() {
      const modal = document.getElementById('modalVqMatchingHelp');
      if (modal) modal.style.display = 'none';
    }

    updateQuestionEditorTypeFields() {
      const type = document.getElementById('vqQuestionTypeSelect')?.value || 'single';
      this.renderQuestionOptionsEditor(type);
    }

    // 渲染出題細節彈窗之視覺化選項編輯列表 (支援單選、複選、配對題的文字與圖片)
    renderQuestionOptionsEditor(type, optionsData = [], correctAnswerData = '', pairsData = [], matchOptionsData = []) {
      const container = document.getElementById('vqInteractiveOptionsList');
      const addBtn = document.getElementById('vqAddOptionBtn');
      const optGroup = document.getElementById('vqOptionsFieldGroup');
      const ansGroup = document.getElementById('vqAnswerFieldGroup');
      const optLabel = document.getElementById('vqOptionsLabel');
      const helpHint = document.getElementById('vqOptionsHelpHint');
      const ansLabel = document.getElementById('vqAnswerFieldLabel');
      const ansInput = document.getElementById('vqQuestionAnswerInput');
      if (!container) return;

      const matchingHelpBtn = document.getElementById('vqMatchingHelpBtn');
      if (matchingHelpBtn) matchingHelpBtn.style.display = (type === 'matching') ? 'inline-flex' : 'none';

      if (type === 'text') {
        if (optGroup) optGroup.style.display = 'none';
        if (ansGroup) ansGroup.style.display = 'block';
        if (ansLabel) ansLabel.textContent = '✍️ 參考正解或評分關鍵詞：';
        if (ansInput) ansInput.placeholder = '請填寫問答參考標準答案...';
        container.innerHTML = '';
        return;
      }

      if (optGroup) optGroup.style.display = 'block';

      if (type === 'matching') {
        if (ansGroup) ansGroup.style.display = 'none'; // 配對題正解由各組左側與右側直接決定
        if (optLabel) optLabel.textContent = '🔗 配對題設定（每組「左側 🔗 右側」，支援文字或圖片）：';
        if (addBtn) {
          addBtn.style.display = 'inline-flex';
          addBtn.textContent = '➕ 新增配對';
        }
        if (helpHint) {
          helpHint.innerHTML = '💡 每組橫列「左側 🔗 右側」直接對應即為正確解答；學生端作答時右側選項將由系統自動隨機打散洗牌。<a href="javascript:void(0)" onclick="window.videoQuiz.openMatchingHelpModal()" style="color: var(--accent-color); font-weight: bold; margin-left: 6px; text-decoration: underline;">📖 點此查看圖文出題說明</a>';
        }

        // 解析配對資料
        let pairs = [];
        if (Array.isArray(pairsData) && pairsData.length > 0) {
          pairs = pairsData;
        } else if (Array.isArray(optionsData) && Array.isArray(matchOptionsData) && matchOptionsData.length > 0) {
          pairs = optionsData.map((opt, i) => ({ left: opt, right: matchOptionsData[i] || '' }));
        } else if (Array.isArray(optionsData) && optionsData.length > 0) {
          pairs = optionsData.map(opt => {
            if (typeof opt === 'string' && opt.includes('=')) {
              const p = opt.split(/[=＝]/);
              return { left: p[0].trim(), right: p.slice(1).join('=').trim() };
            }
            return { left: opt, right: '' };
          });
        }

        if (pairs.length === 0) {
          pairs = [
            { left: '題目項目 1', right: '配對解答 1' },
            { left: '題目項目 2', right: '配對解答 2' },
            { left: '題目項目 3', right: '配對解答 3' }
          ];
        }

        container.innerHTML = pairs.map((pair, idx) => {
          const isLeftImg = typeof pair.left === 'object' && pair.left !== null && (pair.left.type === 'image' || !!pair.left.image);
          const leftText = typeof pair.left === 'object' ? (pair.left.text || '') : String(pair.left || '');
          const leftImg = isLeftImg ? (pair.left.image || '') : '';

          const isRightImg = typeof pair.right === 'object' && pair.right !== null && (pair.right.type === 'image' || !!pair.right.image);
          const rightText = typeof pair.right === 'object' ? (pair.right.text || '') : String(pair.right || '');
          const rightImg = isRightImg ? (pair.right.image || '') : '';

          return `
            <div class="vq-option-row-item option-matching-pair" style="display: grid; grid-template-columns: 1fr auto 1fr auto; gap: 8px; align-items: center; padding: 8px 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px;">
              <!-- 左側項目 -->
              <div class="option-matching-item matching-left-item" data-type="${isLeftImg ? 'image' : 'text'}" style="display: flex; align-items: center; gap: 6px; min-width: 0;">
                <span style="font-weight: bold; font-size: 12px; color: var(--accent-color); flex-shrink: 0;">左${idx + 1}</span>
                <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="padding: 3px 6px; font-size: 11px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-input); cursor: pointer; flex-shrink: 0; ${isLeftImg ? 'color: #ff9500; border-color: #ff9500;' : ''}">
                  ${isLeftImg ? '🖼️ 圖片' : '📝 文字'}
                </button>
                <input type="text" class="option-field matching-left-field vq-option-text-field" value="${this.escapeHtml(leftText)}" placeholder="${isLeftImg ? '說明文字(選填)' : '題目 ' + (idx + 1)}" style="flex: 1; min-width: 60px; padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 13px;">
                <input type="hidden" class="option-img-data" value="${this.escapeHtml(leftImg)}">
                <button type="button" class="option-img-btn btn btn-secondary" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isLeftImg ? 'display: inline-flex;' : 'display: none;'} padding: 3px 6px; font-size: 11px; flex-shrink: 0;">
                  ${leftImg ? '🔄 更換' : '📁 選圖'}
                </button>
                <img class="option-img-preview-thumb" src="${this.escapeHtml(leftImg)}" style="${isLeftImg && leftImg ? 'display: inline-block;' : 'display: none;'} width: 28px; height: 28px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer; flex-shrink: 0;" title="點擊放大預覽" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
              </div>

              <!-- 連結圖示 -->
              <span class="matching-pair-link-icon" style="font-size: 14px; color: var(--text-muted); padding: 0 2px;">🔗</span>

              <!-- 右側項目 -->
              <div class="option-matching-item matching-right-item" data-type="${isRightImg ? 'image' : 'text'}" style="display: flex; align-items: center; gap: 6px; min-width: 0;">
                <span style="font-weight: bold; font-size: 12px; color: #5856d6; flex-shrink: 0;">右${idx + 1}</span>
                <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="padding: 3px 6px; font-size: 11px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-input); cursor: pointer; flex-shrink: 0; ${isRightImg ? 'color: #ff9500; border-color: #ff9500;' : ''}">
                  ${isRightImg ? '🖼️ 圖片' : '📝 文字'}
                </button>
                <input type="text" class="option-field matching-right-field vq-option-text-field" value="${this.escapeHtml(rightText)}" placeholder="${isRightImg ? '說明文字(選填)' : '答案 ' + (idx + 1)}" style="flex: 1; min-width: 60px; padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 13px;">
                <input type="hidden" class="option-img-data" value="${this.escapeHtml(rightImg)}">
                <button type="button" class="option-img-btn btn btn-secondary" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isRightImg ? 'display: inline-flex;' : 'display: none;'} padding: 3px 6px; font-size: 11px; flex-shrink: 0;">
                  ${rightImg ? '🔄 更換' : '📁 選圖'}
                </button>
                <img class="option-img-preview-thumb" src="${this.escapeHtml(rightImg)}" style="${isRightImg && rightImg ? 'display: inline-block;' : 'display: none;'} width: 28px; height: 28px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer; flex-shrink: 0;" title="點擊放大預覽" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
              </div>

              <!-- 刪除按鈕 -->
              <button type="button" onclick="window.videoQuiz.removeOptionRow(this)" style="background: transparent; border: none; color: var(--danger-color); font-size: 15px; cursor: pointer; padding: 4px 6px; border-radius: 4px;" title="刪除此配對">✕</button>
            </div>
          `;
        }).join('');
        return;
      }

      // 單選題 (single) 或 複選題 (multiple)
      if (ansGroup) ansGroup.style.display = 'none'; // 正解直接透過各選項前方的按鈕點選
      if (optLabel) optLabel.textContent = type === 'single' ? '🔘 單選題選項（點選「正解」按鈕設定標準答案）：' : '☑️ 複選題選項（點選「正解」按鈕可複選多個正確答案）：';
      if (addBtn) {
        addBtn.style.display = 'inline-flex';
        addBtn.textContent = '➕ 新增選項';
      }
      if (helpHint) {
        helpHint.innerHTML = '💡 點選綠色按鈕即可設定為正確答案；點選「🖼️ 圖片」即可上傳圖檔或從剪貼簿貼上圖片。';
      }

      let options = Array.isArray(optionsData) && optionsData.length > 0 ? optionsData : ['選項A', '選項B', '選項C', '選項D'];
      const correctSet = new Set();
      if (Array.isArray(correctAnswerData)) {
        correctAnswerData.forEach(ans => correctSet.add(ans));
      } else if (correctAnswerData) {
        correctSet.add(correctAnswerData);
      } else if (options.length > 0) {
        // 預設第一個選項為正解
        const first = options[0];
        const key = typeof first === 'object' ? (first.key || first.text || '[圖片 1]') : first;
        correctSet.add(key);
      }

      container.innerHTML = options.map((opt, idx) => {
        const isImg = typeof opt === 'object' && opt !== null && (opt.type === 'image' || !!opt.image);
        const optText = typeof opt === 'object' ? (opt.text || '') : String(opt);
        const optKey = typeof opt === 'object' ? (opt.key || opt.text || `[圖片 ${idx + 1}]`) : String(opt);
        const imgSrc = isImg ? (opt.image || '') : '';
        const isCorrect = correctSet.has(optKey) || correctSet.has(optText);

        return `
          <div class="vq-option-row-item" data-type="${isImg ? 'image' : 'text'}" style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px;">
            <!-- 正解切換按鈕 -->
            <button type="button" class="vq-correct-toggle-btn" data-correct="${isCorrect ? 'true' : 'false'}" onclick="window.videoQuiz.toggleCorrectAnswer(this)" style="padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 6px; border: 1px solid ${isCorrect ? 'var(--success-color)' : 'var(--border-color)'}; background: ${isCorrect ? 'var(--success-color)' : 'var(--bg-input)'}; color: ${isCorrect ? '#ffffff' : 'var(--text-secondary)'}; cursor: pointer; flex-shrink: 0; min-width: 60px;">
              ${isCorrect ? (type === 'multiple' ? '☑ 正解' : '✓ 正解') : '○ 設正解'}
            </button>

            <!-- 序號標籤 -->
            <span class="vq-option-label" style="font-weight: bold; font-size: 13px; color: var(--accent-color); min-width: 18px; flex-shrink: 0;">${String.fromCharCode(65 + idx)}.</span>

            <!-- 文字/圖片切換按鈕 -->
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="padding: 3px 6px; font-size: 11px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-input); cursor: pointer; flex-shrink: 0; ${isImg ? 'color: #ff9500; border-color: #ff9500;' : ''}">
              ${isImg ? '🖼️ 圖片' : '📝 文字'}
            </button>

            <!-- 文字輸入框 -->
            <input type="text" class="option-field vq-option-text-field" value="${this.escapeHtml(optText)}" placeholder="${isImg ? '說明文字(選填)' : '選項文字內容'}" style="flex: 1; min-width: 80px; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 13px;">

            <!-- 隱藏圖片資料 -->
            <input type="hidden" class="option-img-data" value="${this.escapeHtml(imgSrc)}">

            <!-- 選取圖片按鈕 -->
            <button type="button" class="option-img-btn btn btn-secondary" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isImg ? 'display: inline-flex;' : 'display: none;'} padding: 4px 8px; font-size: 11px; flex-shrink: 0;">
              ${imgSrc ? '🔄 更換' : '📁 選圖'}
            </button>

            <!-- 圖片縮圖 -->
            <img class="option-img-preview-thumb" src="${this.escapeHtml(imgSrc)}" style="${isImg && imgSrc ? 'display: inline-block;' : 'display: none;'} width: 30px; height: 30px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer; flex-shrink: 0;" title="點擊放大預覽" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">

            <!-- 刪除按鈕 -->
            <button type="button" onclick="window.videoQuiz.removeOptionRow(this)" style="background: transparent; border: none; color: var(--danger-color); font-size: 16px; cursor: pointer; padding: 4px 6px; border-radius: 4px;" title="刪除此選項">✕</button>
          </div>
        `;
      }).join('');
    }

    addOptionRow() {
      const type = document.getElementById('vqQuestionTypeSelect')?.value || 'single';
      const container = document.getElementById('vqInteractiveOptionsList');
      if (!container) return;

      if (type === 'matching') {
        const count = container.querySelectorAll('.option-matching-pair').length;
        const newIdx = count;
        const div = document.createElement('div');
        div.className = 'vq-option-row-item option-matching-pair';
        div.style.cssText = 'display: grid; grid-template-columns: 1fr auto 1fr auto; gap: 8px; align-items: center; padding: 8px 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px;';
        div.innerHTML = `
          <div class="option-matching-item matching-left-item" data-type="text" style="display: flex; align-items: center; gap: 6px; min-width: 0;">
            <span style="font-weight: bold; font-size: 12px; color: var(--accent-color); flex-shrink: 0;">左${newIdx + 1}</span>
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="padding: 3px 6px; font-size: 11px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-input); cursor: pointer; flex-shrink: 0;">📝 文字</button>
            <input type="text" class="option-field matching-left-field vq-option-text-field" placeholder="題目 ${newIdx + 1}" style="flex: 1; min-width: 60px; padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 13px;">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn btn btn-secondary" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none; padding: 3px 6px; font-size: 11px; flex-shrink: 0;">📁 選圖</button>
            <img class="option-img-preview-thumb" src="" style="display: none; width: 28px; height: 28px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer; flex-shrink: 0;" title="點擊放大預覽" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <span class="matching-pair-link-icon" style="font-size: 14px; color: var(--text-muted); padding: 0 2px;">🔗</span>
          <div class="option-matching-item matching-right-item" data-type="text" style="display: flex; align-items: center; gap: 6px; min-width: 0;">
            <span style="font-weight: bold; font-size: 12px; color: #5856d6; flex-shrink: 0;">右${newIdx + 1}</span>
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="padding: 3px 6px; font-size: 11px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-input); cursor: pointer; flex-shrink: 0;">📝 文字</button>
            <input type="text" class="option-field matching-right-field vq-option-text-field" placeholder="答案 ${newIdx + 1}" style="flex: 1; min-width: 60px; padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 13px;">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn btn btn-secondary" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none; padding: 3px 6px; font-size: 11px; flex-shrink: 0;">📁 選圖</button>
            <img class="option-img-preview-thumb" src="" style="display: none; width: 28px; height: 28px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer; flex-shrink: 0;" title="點擊放大預覽" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <button type="button" onclick="window.videoQuiz.removeOptionRow(this)" style="background: transparent; border: none; color: var(--danger-color); font-size: 15px; cursor: pointer; padding: 4px 6px; border-radius: 4px;" title="刪除此配對">✕</button>
        `;
        container.appendChild(div);
      } else if (type === 'single' || type === 'multiple') {
        const count = container.querySelectorAll('.vq-option-row-item').length;
        const newIdx = count;
        const div = document.createElement('div');
        div.className = 'vq-option-row-item';
        div.setAttribute('data-type', 'text');
        div.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px;';
        div.innerHTML = `
          <button type="button" class="vq-correct-toggle-btn" data-correct="false" onclick="window.videoQuiz.toggleCorrectAnswer(this)" style="padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-secondary); cursor: pointer; flex-shrink: 0; min-width: 60px;">
            ○ 設正解
          </button>
          <span class="vq-option-label" style="font-weight: bold; font-size: 13px; color: var(--accent-color); min-width: 18px; flex-shrink: 0;">${String.fromCharCode(65 + newIdx)}.</span>
          <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="padding: 3px 6px; font-size: 11px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-input); cursor: pointer; flex-shrink: 0;">📝 文字</button>
          <input type="text" class="option-field vq-option-text-field" placeholder="選項文字內容" style="flex: 1; min-width: 80px; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 13px;">
          <input type="hidden" class="option-img-data" value="">
          <button type="button" class="option-img-btn btn btn-secondary" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none; padding: 4px 8px; font-size: 11px; flex-shrink: 0;">📁 選圖</button>
          <img class="option-img-preview-thumb" src="" style="display: none; width: 30px; height: 30px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer; flex-shrink: 0;" title="點擊放大預覽" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          <button type="button" onclick="window.videoQuiz.removeOptionRow(this)" style="background: transparent; border: none; color: var(--danger-color); font-size: 16px; cursor: pointer; padding: 4px 6px; border-radius: 4px;" title="刪除此選項">✕</button>
        `;
        container.appendChild(div);
      }
    }

    removeOptionRow(btn) {
      const row = btn.closest('.vq-option-row-item');
      if (!row) return;
      const container = document.getElementById('vqInteractiveOptionsList');
      if (!container) return;
      const rows = container.querySelectorAll('.vq-option-row-item');
      if (rows.length <= 2) {
        if (window.app) window.app.showNotification('提示', '至少需保留 2 個項目！');
        return;
      }
      row.remove();
      // 重新整理序號標籤
      const type = document.getElementById('vqQuestionTypeSelect')?.value || 'single';
      if (type === 'matching') {
        const remaining = container.querySelectorAll('.option-matching-pair');
        remaining.forEach((item, idx) => {
          const leftSpan = item.querySelector('.matching-left-item > span');
          if (leftSpan) leftSpan.textContent = `左${idx + 1}`;
          const rightSpan = item.querySelector('.matching-right-item > span');
          if (rightSpan) rightSpan.textContent = `右${idx + 1}`;
        });
      } else {
        const remaining = container.querySelectorAll('.vq-option-row-item');
        remaining.forEach((item, idx) => {
          const label = item.querySelector('.vq-option-label');
          if (label) label.textContent = `${String.fromCharCode(65 + idx)}.`;
        });
      }
    }

    toggleCorrectAnswer(btn) {
      const type = document.getElementById('vqQuestionTypeSelect')?.value || 'single';
      const container = document.getElementById('vqInteractiveOptionsList');
      if (!container) return;

      const isCurrentlyCorrect = btn.getAttribute('data-correct') === 'true';

      if (type === 'single') {
        // 單選題：互斥
        container.querySelectorAll('.vq-correct-toggle-btn').forEach(b => {
          b.setAttribute('data-correct', 'false');
          b.style.borderColor = 'var(--border-color)';
          b.style.background = 'var(--bg-input)';
          b.style.color = 'var(--text-secondary)';
          b.textContent = '○ 設正解';
        });

        btn.setAttribute('data-correct', 'true');
        btn.style.borderColor = 'var(--success-color)';
        btn.style.background = 'var(--success-color)';
        btn.style.color = '#ffffff';
        btn.textContent = '✓ 正解';
      } else if (type === 'multiple') {
        // 複選題：切換
        const nextCorrect = !isCurrentlyCorrect;
        btn.setAttribute('data-correct', nextCorrect ? 'true' : 'false');
        if (nextCorrect) {
          btn.style.borderColor = 'var(--success-color)';
          btn.style.background = 'var(--success-color)';
          btn.style.color = '#ffffff';
          btn.textContent = '☑ 正解';
        } else {
          btn.style.borderColor = 'var(--border-color)';
          btn.style.background = 'var(--bg-input)';
          btn.style.color = 'var(--text-secondary)';
          btn.textContent = '○ 設正解';
        }
      }
    }

    saveQuestionItem() {
      if (!this.editingQuiz) return;
      let time = parseInt(document.getElementById('vqQuestionTimeInput').value, 10) || 0;
      const formattedInput = document.getElementById('vqQuestionTimeFormatted')?.value.trim() || '';
      if (formattedInput && (time === 0 || formattedInput !== this.formatTime(time))) {
        time = this.parseTimeString(formattedInput);
      }
      const timeFormatted = this.formatTime(time);
      const type = document.getElementById('vqQuestionTypeSelect').value;
      const prompt = document.getElementById('vqQuestionPromptInput').value.trim();
      const explanation = document.getElementById('vqQuestionExplanationInput').value.trim();
      const points = parseInt(document.getElementById('vqQuestionPointsInput').value, 10) || 10;

      if (!prompt) {
        if (window.app) window.app.showNotification('提示', '請填寫題目問句！');
        return;
      }

      let options = [];
      let matchOptions = [];
      let pairs = [];
      let correctAnswer = null;

      const interactiveRows = document.querySelectorAll('#vqInteractiveOptionsList .vq-option-row-item');

      if (type === 'matching') {
        if (interactiveRows.length > 0) {
          const pairRows = document.querySelectorAll('#vqInteractiveOptionsList .option-matching-pair');
          pairRows.forEach((row, idx) => {
            const leftItem = row.querySelector('.matching-left-item');
            const rightItem = row.querySelector('.matching-right-item');
            if (!leftItem || !rightItem) return;

            const leftType = leftItem.getAttribute('data-type') || 'text';
            const leftText = leftItem.querySelector('.vq-option-text-field')?.value.trim() || '';
            const leftImg = leftItem.querySelector('.option-img-data')?.value.trim() || '';

            const rightType = rightItem.getAttribute('data-type') || 'text';
            const rightText = rightItem.querySelector('.vq-option-text-field')?.value.trim() || '';
            const rightImg = rightItem.querySelector('.option-img-data')?.value.trim() || '';

            let leftObj, rightObj;
            if (leftType === 'image' && leftImg) {
              const key = leftText || `[左側圖片 ${idx + 1}]`;
              leftObj = { type: 'image', text: leftText, image: leftImg, key };
            } else {
              leftObj = leftText || `項目 ${idx + 1}`;
            }

            if (rightType === 'image' && rightImg) {
              const key = rightText || `[右側圖片 ${idx + 1}]`;
              rightObj = { type: 'image', text: rightText, image: rightImg, key };
            } else {
              rightObj = rightText || `解答 ${idx + 1}`;
            }

            pairs.push({ left: leftObj, right: rightObj });
          });
        } else {
          // Fallback: 純文字相容模式 (例如自動測試直接寫入 textarea)
          const optsText = document.getElementById('vqQuestionOptionsInput')?.value.trim() || '';
          const pairLines = optsText.split('\n').map(s => s.trim()).filter(Boolean);
          pairLines.forEach(line => {
            const parts = line.split(/[=＝]/);
            if (parts.length >= 2) {
              const left = parts[0].trim();
              const right = parts.slice(1).join('=').trim();
              if (left && right) {
                pairs.push({ left, right });
              }
            }
          });
        }

        if (pairs.length < 2) {
          if (window.app) window.app.showNotification('提示', '配對題至少需要兩組有效配對！');
          return;
        }

        options = pairs.map(p => p.left);
        matchOptions = pairs.map(p => p.right);
        correctAnswer = {};
        pairs.forEach((p, idx) => {
          const lKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.left, String(idx + 1)) : (typeof p.left === 'object' ? p.left.key : p.left);
          const rKey = window.MatchingQuizEngine ? window.MatchingQuizEngine.getItemKey(p.right, String(idx + 1)) : (typeof p.right === 'object' ? p.right.key : p.right);
          correctAnswer[lKey] = rKey;
        });

        // 同步文字版至相容 textarea
        const optsText = pairs.map(p => {
          const l = typeof p.left === 'object' ? (p.left.text || p.left.key) : p.left;
          const r = typeof p.right === 'object' ? (p.right.text || p.right.key) : p.right;
          return `${l} = ${r}`;
        }).join('\n');
        const ansText = Object.entries(correctAnswer).map(([k, v]) => `${k} = ${v}`).join('\n');
        if (document.getElementById('vqQuestionOptionsInput')) document.getElementById('vqQuestionOptionsInput').value = optsText;
        if (document.getElementById('vqQuestionAnswerInput')) document.getElementById('vqQuestionAnswerInput').value = ansText;
      } else if (type === 'single' || type === 'multiple') {
        if (interactiveRows.length > 0) {
          const correctList = [];
          interactiveRows.forEach((row, idx) => {
            const rowType = row.getAttribute('data-type') || 'text';
            const text = row.querySelector('.vq-option-text-field')?.value.trim() || '';
            const img = row.querySelector('.option-img-data')?.value.trim() || '';
            const isCorrect = row.querySelector('.vq-correct-toggle-btn')?.getAttribute('data-correct') === 'true';

            let optObj;
            let optKey;
            if (rowType === 'image' && img) {
              optKey = text || `[圖片 ${idx + 1}]`;
              optObj = { type: 'image', text, image: img, key: optKey };
            } else {
              optKey = text || `選項 ${String.fromCharCode(65 + idx)}`;
              optObj = text ? text : optKey;
            }

            options.push(optObj);
            if (isCorrect) {
              correctList.push(optKey);
            }
          });

          if (options.length < 2) {
            if (window.app) window.app.showNotification('提示', '請至少提供 2 個選項！');
            return;
          }

          if (correctList.length === 0) {
            if (window.app) window.app.showNotification('提示', '請至少點選一個選項設為正確答案！');
            return;
          }

          if (type === 'single') {
            correctAnswer = correctList[0];
          } else {
            correctAnswer = correctList;
          }
        } else {
          // Fallback: 純文字相容模式
          const optsText = document.getElementById('vqQuestionOptionsInput')?.value.trim() || '';
          const ansText = document.getElementById('vqQuestionAnswerInput')?.value.trim() || '';
          options = optsText.split('\n').map(s => s.trim()).filter(Boolean);
          if (type === 'multiple') {
            correctAnswer = ansText.split('\n').map(s => s.trim()).filter(Boolean);
          } else {
            correctAnswer = ansText;
          }
        }

        // 同步文字版至相容 textarea
        const optsText = options.map(o => typeof o === 'object' ? (o.text || o.key) : o).join('\n');
        const ansText = Array.isArray(correctAnswer) ? correctAnswer.join('\n') : correctAnswer;
        if (document.getElementById('vqQuestionOptionsInput')) document.getElementById('vqQuestionOptionsInput').value = optsText;
        if (document.getElementById('vqQuestionAnswerInput')) document.getElementById('vqQuestionAnswerInput').value = ansText;
      } else {
        // text (問答題)
        const ansText = document.getElementById('vqQuestionAnswerInput')?.value.trim() || '';
        correctAnswer = ansText;
        options = [];
      }

      const qItem = {
        id: this.editingQuestionIndex >= 0 ? this.editingQuiz.questions[this.editingQuestionIndex].id : 'q_' + Date.now(),
        time,
        timeFormatted,
        type,
        prompt,
        options,
        matchOptions,
        pairs,
        correctAnswer,
        explanation,
        points
      };

      if (!this.editingQuiz.questions) this.editingQuiz.questions = [];
      if (this.editingQuestionIndex >= 0) {
        this.editingQuiz.questions[this.editingQuestionIndex] = qItem;
      } else {
        this.editingQuiz.questions.push(qItem);
      }

      // 按時間先後排序
      this.editingQuiz.questions.sort((a, b) => a.time - b.time);
      this.renderEditorTimelineList();
      this.closeQuestionEditModal();
    }

    deleteQuestion(index) {
      if (!this.editingQuiz || !this.editingQuiz.questions) return;
      this.editingQuiz.questions.splice(index, 1);
      this.renderEditorTimelineList();
    }

    previewQuestionAtTime(index) {
      if (!this.editingQuiz || !this.editingQuiz.questions[index]) return;
      const q = this.editingQuiz.questions[index];
      this.seekTo(q.time);
    }

    saveEditingQuiz() {
      if (!this.editingQuiz) return;
      const title = document.getElementById('vqEditQuizTitle').value.trim();
      const desc = document.getElementById('vqEditQuizDesc').value.trim();
      const url = document.getElementById('vqEditQuizUrl').value.trim();

      if (!title || !url) {
        if (window.app) window.app.showNotification('提示', '請填寫測驗標題與影片網址！');
        return;
      }

      this.editingQuiz.title = title;
      this.editingQuiz.description = desc;
      this.editingQuiz.videoUrl = url;

      const ytId = this.extractYoutubeId(url);
      if (ytId) {
        this.editingQuiz.videoType = 'youtube';
        this.editingQuiz.youtubeId = ytId;
      } else {
        this.editingQuiz.videoType = 'html5';
      }

      // 儲存指定播放起訖時間
      const startVal = parseInt(document.getElementById('vqRangeStartInput')?.value || 0, 10);
      const endVal = parseInt(document.getElementById('vqRangeEndInput')?.value || 0, 10);
      this.editingQuiz.startTime = isNaN(startVal) ? 0 : Math.max(0, startVal);
      this.editingQuiz.endTime = isNaN(endVal) ? 0 : Math.max(0, endVal);

      const idx = this.quizzes.findIndex(q => q.id === this.editingQuiz.id);
      if (idx >= 0) {
        this.quizzes[idx] = this.editingQuiz;
      } else {
        this.quizzes.push(this.editingQuiz);
      }

      this.saveQuizzes();
      this.renderQuizSelector();
      this.renderEditorQuizList();
      this.closeEditQuizModal();
      if (window.app) window.app.showNotification('成功', '影片測驗已成功儲存！');
    }

    deleteQuiz(quizId) {
      if (!confirm('確定要刪除這部影片測驗嗎？')) return;
      this.quizzes = this.quizzes.filter(q => q.id !== quizId);
      this.saveQuizzes();
      this.renderQuizSelector();
      this.renderEditorQuizList();
      if (window.app) window.app.showNotification('成功', '已刪除影片測驗。');
    }

    // 格式化時間 (秒數轉 mm:ss 或 hh:mm:ss)
    formatTime(sec) {
      const totalSec = Math.max(0, Math.floor(sec || 0));
      const hrs = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      if (hrs > 0) {
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // 解析時間字串 (支援 mm:ss、hh:mm:ss、或純秒數數字)
    parseTimeString(val) {
      if (typeof val === 'number') return Math.max(0, Math.floor(val));
      if (!val) return 0;
      const str = String(val).trim();
      if (str.includes(':')) {
        const parts = str.split(':').map(p => parseInt(p, 10) || 0);
        if (parts.length === 3) {
          return Math.max(0, parts[0] * 3600 + parts[1] * 60 + parts[2]);
        } else if (parts.length === 2) {
          return Math.max(0, parts[0] * 60 + parts[1]);
        }
      }
      return Math.max(0, parseInt(str, 10) || 0);
    }

    // 需求 3：更新指定播放起訖點雙滑桿介面
    updateTimeRangeUI(startVal, endVal, maxVal) {
      const startInput = document.getElementById('vqRangeStartInput');
      const endInput = document.getElementById('vqRangeEndInput');
      const startLabel = document.getElementById('vqRangeStartTimeLabel');
      const endLabel = document.getElementById('vqRangeEndTimeLabel');
      const totalLabel = document.getElementById('vqRangeTotalTimeLabel');
      const durLabel = document.getElementById('vqRangeDurationLabel');
      const highlight = document.getElementById('vqSliderTrackHighlight');

      if (!startInput || !endInput) return;

      const max = Math.max(1, Math.round(maxVal || 100));
      startInput.max = max;
      endInput.max = max;

      let s = Math.max(0, Math.min(max, Math.round(startVal || 0)));
      let e = Math.max(0, Math.min(max, Math.round(endVal !== undefined && endVal !== null ? endVal : max)));

      if (s > e) s = e;

      startInput.value = s;
      endInput.value = e;

      const sPct = Math.min(100, Math.max(0, (s / max) * 100));
      const ePct = Math.min(100, Math.max(0, (e / max) * 100));

      if (highlight) {
        highlight.style.left = `${sPct}%`;
        highlight.style.width = `${Math.max(0, ePct - sPct)}%`;
      }

      if (startLabel) {
        startLabel.textContent = this.formatTime(s);
        startLabel.style.left = `${sPct}%`;
      }

      if (endLabel) {
        endLabel.textContent = this.formatTime(e);
        endLabel.style.left = `${ePct}%`;
      }

      if (totalLabel) {
        totalLabel.textContent = this.formatTime(max);
      }

      if (durLabel) {
        durLabel.textContent = this.formatTime(Math.max(0, e - s));
      }
    }

    // ==========================================
    // 題庫匯入 / 匯出 / 範例格式檔管理
    // ==========================================

    // 取得 JSON 格式範例物件
    getSampleTemplateJSON() {
      return [
        {
          "title": "自然科學：太陽系與行星探索 (範例)",
          "description": "探索太陽系天體特徵與八大行星奧秘",
          "videoUrl": "https://www.youtube.com/watch?v=libKVRa01L8",
          "questions": [
            {
              "time": 25,
              "timeFormatted": "00:25",
              "type": "single",
              "prompt": "太陽系中體積最大、質量最重的行星是哪一顆？",
              "options": ["水星", "金星", "木星", "土星"],
              "correctAnswer": "木星",
              "explanation": "木星是太陽系中最大的氣態巨行星。",
              "points": 10
            },
            {
              "time": 60,
              "timeFormatted": "01:00",
              "type": "multiple",
              "prompt": "下列哪些行星屬於主要由岩石和金屬組成的「類地行星」？（多選題）",
              "options": ["水星", "金星", "地球", "木星"],
              "correctAnswer": ["水星", "金星", "地球"],
              "explanation": "類地行星包含水星、金星、地球與火星。",
              "points": 10
            },
            {
              "time": 95,
              "timeFormatted": "01:35",
              "type": "text",
              "prompt": "【問答題】請簡述為什麼地球能夠孕育豐富多樣的生命？",
              "options": [],
              "correctAnswer": "位於適居帶、具備液態水、大氣層與地磁場保護",
              "explanation": "地球具備適當日地距離、充足液態水與防護大氣。",
              "points": 10
            }
          ]
        }
      ];
    }

    // 開啟下載範例檔格式選擇彈窗
    openDownloadSampleModal() {
      if (!window.app || typeof window.app.openBankFormatPickerModal !== 'function') {
        this.downloadSampleTemplateJSON();
        return;
      }
      window.app.openBankFormatPickerModal({
        title: '下載影片出題測驗範例檔',
        icon: '⬇️',
        desc: '請選擇您想要下載的範例檔格式，編輯時間點與題目後即可直接匯入：',
        options: [
          {
            icon: '📄',
            title: 'JSON 格式範例檔 (.json)',
            desc: '支援 YouTube 影片網址、多時間標籤、單選、複選、文字簡答與自訂題組',
            badge: '推薦',
            action: () => this.downloadSampleTemplateJSON()
          },
          {
            icon: '📊',
            title: 'CSV 試算表範例檔 (.csv)',
            desc: '包含時間標籤、題型與分號分隔選項，可使用 Excel 或試算表開啟編輯',
            badge: '常用',
            action: () => this.downloadSampleTemplateCSV()
          }
        ]
      });
    }

    // 開啟匯出題庫格式選擇彈窗
    openExportModal() {
      const quizzes = this.quizzes || [];
      if (quizzes.length === 0) {
        if (window.app) window.app.showNotification('提示', '目前沒有影片測驗題目可供匯出！');
        return;
      }

      if (!window.app || typeof window.app.openBankFormatPickerModal !== 'function') {
        this.exportQuizzesJSON();
        return;
      }
      window.app.openBankFormatPickerModal({
        title: '匯出影片出題測驗題庫',
        icon: '📤',
        desc: `目前共 ${quizzes.length} 組影片測驗，請選擇匯出備份格式：`,
        options: [
          {
            icon: '📄',
            title: '匯出 JSON 格式備份檔 (.json)',
            desc: '完整備份影片來源、播放秒數範圍、時間點出題、各類題型與選項',
            badge: '推薦備份',
            action: () => this.exportQuizzesJSON()
          },
          {
            icon: '📊',
            title: '匯出 CSV 試算表檔 (.csv)',
            desc: '匯出為試算表清單，適合檢視各題時間戳記與題目問答內容',
            badge: 'Excel 試算表',
            action: () => this.exportQuizzesCSV()
          }
        ]
      });
    }

    // 下載 JSON 格式範例檔案
    downloadSampleTemplateJSON() {
      const templateData = this.getSampleTemplateJSON();
      const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'video_quiz_template.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.app) window.app.showNotification('成功', '已下載影片測驗 JSON 範例格式檔！');
    }

    // 取得 CSV 格式範例字串
    getSampleTemplateCSV() {
      let csv = '\uFEFF測驗標題,測驗簡介,影片網址,時間點(分:秒或秒數),題型(單選/複選/問答),題目問句,選項(以分號;區隔),標準答案(複選以分號;區隔),題目解析,配分\r\n';
      csv += '"自然科學：太陽系行星探索","探索太陽系各大行星特徵與運行奧秘","https://www.youtube.com/watch?v=libKVRa01L8","00:25","單選","太陽系中體積最大、質量最重的行星是哪一顆？","水星;金星;木星;土星","木星","木星是太陽系中最大的行星，屬於氣態巨行星。","10"\r\n';
      csv += '"自然科學：太陽系行星探索","探索太陽系各大行星特徵與運行奧秘","https://www.youtube.com/watch?v=libKVRa01L8","01:00","複選","下列哪些行星屬於主要由岩石和金屬組成的「類地行星」？","水星;金星;地球;木星","水星;金星;地球","類地行星包含水星、金星、地球與火星。","10"\r\n';
      csv += '"自然科學：太陽系行星探索","探索太陽系各大行星特徵與運行奧秘","https://www.youtube.com/watch?v=libKVRa01L8","01:35","問答","請簡述為什麼地球能夠孕育豐富多樣的生命？","","適居帶、液態水、適宜大氣與地磁保護","地球位處適居帶，擁有液態水與完整大氣保護。","10"\r\n';
      return csv;
    }

    // 下載 CSV 格式範例檔案
    downloadSampleTemplateCSV() {
      const csv = this.getSampleTemplateCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'video_quiz_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.app) window.app.showNotification('成功', '已下載影片測驗 CSV 範例格式檔！');
    }

    // 匯出全部題庫備份 (JSON)
    exportQuizzesJSON() {
      if (!this.quizzes || this.quizzes.length === 0) {
        if (window.app) window.app.showNotification('提示', '目前沒有任何影片測驗可供匯出！');
        return;
      }
      const dataStr = JSON.stringify(this.quizzes, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_quizzes_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.app) window.app.showNotification('成功', `已順利匯出 ${this.quizzes.length} 部影片測驗題庫備份！`);
    }

    // 匯出全部題庫備份 (CSV)
    exportQuizzesCSV() {
      if (!this.quizzes || this.quizzes.length === 0) {
        if (window.app) window.app.showNotification('提示', '目前沒有任何影片測驗可供匯出！');
        return;
      }
      let csv = '\uFEFF測驗標題,測驗簡介,影片網址,時間點(分:秒或秒數),題型(單選/複選/問答),題目問句,選項(以分號;區隔),標準答案(複選以分號;區隔),題目解析,配分\r\n';
      this.quizzes.forEach(quiz => {
        const title = (quiz.title || '').replace(/"/g, '""');
        const desc = (quiz.description || '').replace(/"/g, '""');
        const url = (quiz.videoUrl || '').replace(/"/g, '""');
        (quiz.questions || []).forEach(q => {
          const timeStr = q.timeFormatted || this.formatSeconds(q.time);
          const typeStr = q.type === 'single' ? '單選' : (q.type === 'multiple' ? '複選' : '問答');
          const prompt = (q.prompt || '').replace(/"/g, '""');
          const opts = ((q.options || []).join(';')).replace(/"/g, '""');
          const ans = (Array.isArray(q.correctAnswer) ? q.correctAnswer.join(';') : (q.correctAnswer || '')).replace(/"/g, '""');
          const exp = (q.explanation || '').replace(/"/g, '""');
          const pts = q.points || 10;
          csv += `"${title}","${desc}","${url}","${timeStr}","${typeStr}","${prompt}","${opts}","${ans}","${exp}","${pts}"\r\n`;
        });
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_quizzes_backup_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.app) window.app.showNotification('成功', '已順利匯出 CSV 格式影片題庫！');
    }

    // 開啟匯入彈窗
    openImportModal() {
      const modal = document.getElementById('vqImportModal');
      const input = document.getElementById('vqImportTextInput');
      const fileInput = document.getElementById('vqImportFileInput');
      if (input) input.value = '';
      if (fileInput) fileInput.value = '';
      if (modal) modal.style.display = 'flex';
    }

    // 關閉匯入彈窗
    closeImportModal() {
      const modal = document.getElementById('vqImportModal');
      if (modal) modal.style.display = 'none';
    }

    // 處理檔案拖曳或選取
    handleImportFileChange(event) {
      const file = event?.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const textInput = document.getElementById('vqImportTextInput');
        if (textInput) textInput.value = text;
      };
      reader.readAsText(file, 'utf-8');
    }

    // 執行匯入
    executeImport() {
      const textInput = document.getElementById('vqImportTextInput');
      const text = textInput ? textInput.value.trim() : '';
      if (!text) {
        if (window.app) window.app.showNotification('提示', '請先選擇檔案或在文字框中貼上 JSON / CSV 內容！');
        return;
      }

      const modeRadio = document.querySelector('input[name="vqImportMode"]:checked');
      const mode = modeRadio ? modeRadio.value : 'merge'; // 'merge' or 'replace'

      try {
        let importedList = [];
        if (text.startsWith('[') || text.startsWith('{')) {
          importedList = this.parseQuizzesFromJSON(text);
        } else {
          importedList = this.parseQuizzesFromCSV(text);
        }

        if (!importedList || importedList.length === 0) {
          throw new Error('未在檔案中解析出任何有效的測驗資料，請檢查格式是否正確！');
        }

        if (mode === 'replace') {
          this.quizzes = importedList;
        } else {
          // 合併模式：同 ID 或同標題進行覆蓋，否則新增
          importedList.forEach(newQ => {
            const existingIdx = this.quizzes.findIndex(q => q.id === newQ.id || q.title === newQ.title);
            if (existingIdx >= 0) {
              this.quizzes[existingIdx] = newQ;
            } else {
              this.quizzes.push(newQ);
            }
          });
        }

        this.saveQuizzes();
        this.renderQuizSelector();
        this.renderEditorQuizList();
        this.closeImportModal();

        const qCount = importedList.reduce((acc, cur) => acc + (cur.questions?.length || 0), 0);
        if (window.app) {
          window.app.showNotification('成功', `已順利匯入 ${importedList.length} 部影片測驗（共 ${qCount} 道題目）！`);
        }
      } catch (err) {
        console.error('Import failed', err);
        alert('匯入失敗：' + err.message);
      }
    }

    // 解析 JSON
    parseQuizzesFromJSON(jsonText) {
      const parsed = JSON.parse(jsonText);
      const rawList = Array.isArray(parsed) ? parsed : [parsed];
      const validQuizzes = [];

      rawList.forEach((item, idx) => {
        if (!item.title || !item.videoUrl) return;
        const qId = item.id || 'vq_' + Date.now() + '_' + idx;
        const ytId = this.extractYoutubeId(item.videoUrl);
        const videoType = ytId ? 'youtube' : 'html5';

        const questions = (item.questions || []).map((q, qIdx) => {
          const time = typeof q.time === 'number' ? q.time : this.parseTime(q.time || q.timeFormatted);
          const type = (q.type === 'multiple' || q.type === '複選') ? 'multiple' : ((q.type === 'text' || q.type === '問答') ? 'text' : 'single');
          let options = Array.isArray(q.options) ? q.options : (typeof q.options === 'string' ? q.options.split(';').map(s => s.trim()).filter(Boolean) : []);
          let correctAnswer = q.correctAnswer;
          if (type === 'multiple' && typeof correctAnswer === 'string') {
            correctAnswer = correctAnswer.split(';').map(s => s.trim()).filter(Boolean);
          }
          return {
            id: q.id || 'q_' + qIdx + '_' + Date.now(),
            time,
            timeFormatted: q.timeFormatted || this.formatSeconds(time),
            type,
            prompt: q.prompt || q.question || '',
            options,
            correctAnswer,
            explanation: q.explanation || '',
            points: parseInt(q.points, 10) || 10
          };
        }).filter(q => q.prompt);

        validQuizzes.push({
          id: qId,
          title: item.title,
          description: item.description || '',
          videoUrl: item.videoUrl,
          videoType,
          youtubeId: ytId,
          createdAt: item.createdAt || Date.now(),
          questions
        });
      });

      return validQuizzes;
    }

    // 解析 CSV
    parseQuizzesFromCSV(csvText) {
      const rows = this.parseCSVText(csvText);
      if (rows.length < 2) {
        throw new Error('CSV 格式錯誤：請至少提供表頭與一行題目資料！');
      }

      // 跳過表頭，對資料列依「測驗標題」進行分組
      const dataRows = rows.slice(1);
      const groups = {};

      dataRows.forEach(cols => {
        if (!cols || cols.length < 4) return;
        const title = (cols[0] || '').trim();
        const desc = (cols[1] || '').trim();
        const url = (cols[2] || '').trim();
        const timeStr = (cols[3] || '').trim();
        const typeStr = (cols[4] || '單選').trim();
        const prompt = (cols[5] || '').trim();
        const optionsStr = (cols[6] || '').trim();
        const ansStr = (cols[7] || '').trim();
        const explanation = (cols[8] || '').trim();
        const points = parseInt(cols[9], 10) || 10;

        if (!title || !url || !prompt) return;

        const groupKey = title + '||' + url;
        if (!groups[groupKey]) {
          groups[groupKey] = {
            title,
            description: desc,
            videoUrl: url,
            questions: []
          };
        }

        const time = this.parseTime(timeStr);
        const type = (typeStr.includes('複選') || typeStr === 'multiple') ? 'multiple' : ((typeStr.includes('問答') || typeStr === 'text') ? 'text' : 'single');
        const options = type !== 'text' ? optionsStr.split(/[\;\；\n]/).map(s => s.trim()).filter(Boolean) : [];
        let correctAnswer = ansStr;
        if (type === 'multiple') {
          correctAnswer = ansStr.split(/[\;\；\n]/).map(s => s.trim()).filter(Boolean);
        }

        groups[groupKey].questions.push({
          id: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          time,
          timeFormatted: this.formatSeconds(time),
          type,
          prompt,
          options,
          correctAnswer,
          explanation,
          points
        });
      });

      const list = Object.values(groups).map((g, idx) => {
        const ytId = this.extractYoutubeId(g.videoUrl);
        return {
          id: 'vq_' + Date.now() + '_' + idx,
          title: g.title,
          description: g.description,
          videoUrl: g.videoUrl,
          videoType: ytId ? 'youtube' : 'html5',
          youtubeId: ytId,
          createdAt: Date.now(),
          questions: g.questions.sort((a, b) => a.time - b.time)
        };
      });

      return list;
    }

    // CSV 解析工具，相容雙引號與逗號包含
    parseCSVText(text) {
      const clean = text.replace(/^\uFEFF/, '');
      const lines = [];
      let row = [];
      let inQuotes = false;
      let cur = '';

      for (let i = 0; i < clean.length; i++) {
        const c = clean[i];
        const next = clean[i + 1];

        if (c === '"') {
          if (inQuotes && next === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === ',' && !inQuotes) {
          row.push(cur);
          cur = '';
        } else if ((c === '\r' || c === '\n') && !inQuotes) {
          if (c === '\r' && next === '\n') i++;
          row.push(cur);
          if (row.some(field => field.trim().length > 0)) {
            lines.push(row);
          }
          row = [];
          cur = '';
        } else {
          cur += c;
        }
      }
      if (cur.length > 0 || row.length > 0) {
        row.push(cur);
        if (row.some(field => field.trim().length > 0)) {
          lines.push(row);
        }
      }
      return lines;
    }

    // 時間字串轉秒數 (支援 "01:25" 或 "85")
    parseTime(str) {
      if (typeof str === 'number') return Math.max(0, Math.round(str));
      if (!str) return 0;
      str = String(str).trim();
      if (/^\d+$/.test(str)) return parseInt(str, 10);
      const parts = str.split(':').map(p => parseInt(p, 10) || 0);
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      return 0;
    }

    // 秒數轉時間格式字串 (如 "01:25")
    formatSeconds(seconds) {
      const s = Math.max(0, Math.round(seconds || 0));
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // 開啟範例格式說明彈窗
    openFormatGuideModal() {
      const modal = document.getElementById('vqFormatGuideModal');
      if (modal) {
        this.switchFormatGuideTab('json');
        modal.style.display = 'flex';
      }
    }

    closeFormatGuideModal() {
      const modal = document.getElementById('vqFormatGuideModal');
      if (modal) modal.style.display = 'none';
    }

    switchFormatGuideTab(tabType) {
      const jsonTab = document.getElementById('vqFormatTabJson');
      const csvTab = document.getElementById('vqFormatTabCsv');
      const jsonContent = document.getElementById('vqFormatContentJson');
      const csvContent = document.getElementById('vqFormatContentCsv');

      if (jsonTab) jsonTab.classList.toggle('active', tabType === 'json');
      if (csvTab) csvTab.classList.toggle('active', tabType === 'csv');
      if (jsonContent) jsonContent.style.display = (tabType === 'json' ? 'block' : 'none');
      if (csvContent) csvContent.style.display = (tabType === 'csv' ? 'block' : 'none');
    }

    copyFormatCode(elemId) {
      const el = document.getElementById(elemId);
      if (!el) return;
      const text = el.textContent;
      navigator.clipboard.writeText(text).then(() => {
        if (window.app) window.app.showNotification('成功', '範例格式代碼已複製至剪貼簿！');
      }).catch(() => {
        if (window.app) window.app.showNotification('提示', '請手動選取代碼進行複製。');
      });
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  // 掛載至全域
  global.VideoQuizManager = VideoQuizManager;
  global.videoQuiz = new VideoQuizManager();

})(typeof window !== 'undefined' ? window : global);
