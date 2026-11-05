// 班級代碼與智慧雙軌管理器 (ClassRoomManager)
window.ClassRoomManager = {
  // 清理並標準化班級代碼（移除 Firebase 禁止字元 . $ # [ ] /）
  sanitizeClassCode(code) {
    if (!code) return '';
    return String(code).trim().replace(/[.$#\[\]\/]/g, '_').toUpperCase();
  },

  // 取得當前班級代碼 (優先順序: URL 參數 > localStorage)
  getActiveClassCode() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const fromUrl = urlParams.get('class') || urlParams.get('room');
      if (fromUrl) {
        const sanitized = this.sanitizeClassCode(fromUrl);
        if (sanitized) {
          window.boardStorage.local.setItem('active_class_code', sanitized);
          this.addToHistory(sanitized);
          return sanitized;
        }
      }
      const stored = window.boardStorage.local.getItem('active_class_code');
      return stored ? this.sanitizeClassCode(stored) : '';
    } catch (e) {
      return '';
    }
  },

  // 是否為一次性課堂（無特定班級代碼）
  isOneOffClass() {
    return !this.getActiveClassCode();
  },

  // 是否處於專屬班級模式
  isClassMode() {
    return Boolean(this.getActiveClassCode());
  },

  // 儲存並切換班級代碼 (若傳入空值則切換回一次性課堂)
  setActiveClassCode(code) {
    const sanitized = this.sanitizeClassCode(code);
    if (sanitized) {
      window.boardStorage.local.setItem('active_class_code', sanitized);
      this.addToHistory(sanitized);
      window.currentClassCode = sanitized;
    } else {
      window.boardStorage.local.removeItem('active_class_code');
      window.currentClassCode = '';
    }
    return sanitized;
  },

  // 記錄最近使用過的班級列表（最多保留 5 個）
  addToHistory(code) {
    if (!code) return;
    try {
      let history = this.getClassHistory();
      history = [code, ...history.filter(c => c !== code)].slice(0, 5);
      window.boardStorage.local.setItem('class_code_history', JSON.stringify(history));
    } catch (e) {}
  },

  getClassHistory() {
    try {
      const h = window.boardStorage.local.getItem('class_code_history');
      return h ? JSON.parse(h) : [];
    } catch (e) {
      return [];
    }
  },

  // 使用者姓名管理
  getUserName() {
    return (window.boardStorage.local.getItem('user_nickname') || window.boardStorage.local.getItem('user_name') || '').trim();
  },

  setUserName(name) {
    if (name) {
      const trimmed = name.trim();
      window.boardStorage.local.setItem('user_nickname', trimmed);
      window.boardStorage.local.setItem('user_name', trimmed);
    }
  },

  // 使用者唯一識別碼 (跨重整保留)
  getUserId() {
    let uid = window.boardStorage.local.getItem('app_user_id');
    if (!uid) {
      uid = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
      window.boardStorage.local.setItem('app_user_id', uid);
    }
    return uid;
  },

  // 身分管理 (student / teacher)
  getUserRole() {
    return window.boardStorage.local.getItem('user_role') || 'student';
  },

  setUserRole(role) {
    window.boardStorage.local.setItem('user_role', role === 'teacher' ? 'teacher' : 'student');
  },

  // 檢查班級是否已由老師登記開課
  async checkClassExists(code) {
    if (!code) return false;
    const sanitized = this.sanitizeClassCode(code);
    if (!sanitized) return false;
    try {
      const snap = await rawRef(`registered_classes/${sanitized}`).once('value');
      return snap.exists() && snap.val() !== null;
    } catch (e) {
      console.warn('檢查班級失敗:', e);
      throw e;
    }
  },

  // 老師登記新班級 (開課)
  async registerClass(code, name = '', createdBy = '老師', ownerTeacherId = '') {
    const sanitized = this.sanitizeClassCode(code);
    if (!sanitized) throw new Error('班級代碼不可為空或包含不合法字元！');
    
    // 檢查是否已存在
    const exists = await this.checkClassExists(sanitized);
    if (exists) {
      throw new Error(`班級代碼【${sanitized}】已存在，無需重複開課！`);
    }

    const classData = {
      code: sanitized,
      name: (name || sanitized).trim(),
      createdAt: Date.now(),
      createdBy: createdBy || '老師',
      ownerTeacherId: ownerTeacherId || '',
      status: 'active'
    };

    await rawRef(`registered_classes/${sanitized}`).set(classData);
    return classData;
  },

  // 刪除已登記的班級
  async deleteClass(code, deleteSpaceData = true) {
    const sanitized = this.sanitizeClassCode(code);
    if (!sanitized) return;

    await rawRef(`registered_classes/${sanitized}`).remove();
    if (deleteSpaceData) {
      // 一併清空該班專屬資料，徹底釋放空間
      await rawRef(`classes/${sanitized}`).remove();
    }
  },

  // 修改已登記班級之代碼與名稱（防範重複代碼與無損遷移資料空間）
  async updateClass(oldCode, newCode, newName = '') {
    const sanitizedOld = this.sanitizeClassCode(oldCode);
    const sanitizedNew = this.sanitizeClassCode(newCode);
    if (!sanitizedOld) throw new Error('原始班級代碼無效！');
    if (!sanitizedNew) throw new Error('新班級代碼不可為空或包含不合法字元！');

    const nameToSet = (newName || sanitizedNew).trim();
    const codeChanged = sanitizedOld !== sanitizedNew;

    if (codeChanged) {
      // 檢查新代碼是否已被其他已註冊班級使用
      const exists = await this.checkClassExists(sanitizedNew);
      if (exists) {
        throw new Error(`班級代碼【${sanitizedNew}】已存在，無法使用此代碼！請更換其他代碼。`);
      }

      // 取得舊註冊資料以繼承建立資訊
      const oldSnap = await rawRef(`registered_classes/${sanitizedOld}`).once('value');
      const oldData = oldSnap.val() || {};

      // 遷移 classes/${sanitizedOld} 專屬資料空間至 classes/${sanitizedNew}
      try {
        const spaceSnap = await rawRef(`classes/${sanitizedOld}`).once('value');
        if (spaceSnap.exists() && spaceSnap.val() !== null) {
          await rawRef(`classes/${sanitizedNew}`).set(spaceSnap.val());
          await rawRef(`classes/${sanitizedOld}`).remove();
        }
      } catch (err) {
        console.warn('遷移班級專屬空間資料時發生錯誤:', err);
      }

      // 建立新代碼之註冊資料並移除舊註冊資料
      const newClassData = {
        ...oldData,
        code: sanitizedNew,
        name: nameToSet,
        updatedAt: Date.now()
      };
      await rawRef(`registered_classes/${sanitizedNew}`).set(newClassData);
      await rawRef(`registered_classes/${sanitizedOld}`).remove();

      // 更新本機歷史記錄
      try {
        let history = this.getClassHistory();
        history = history.map(c => c === sanitizedOld ? sanitizedNew : c);
        history = [...new Set(history)].slice(0, 5);
        window.boardStorage.local.setItem('class_code_history', JSON.stringify(history));
      } catch (e) {}

      // 若目前活躍的班級代碼為舊代碼，切換至新代碼
      if (this.getActiveClassCode() === sanitizedOld) {
        this.setActiveClassCode(sanitizedNew);
      }

      return {
        oldCode: sanitizedOld,
        newCode: sanitizedNew,
        name: nameToSet,
        codeChanged: true
      };
    } else {
      // 代碼未變更，僅更新班級名稱
      await rawRef(`registered_classes/${sanitizedOld}`).update({
        name: nameToSet,
        updatedAt: Date.now()
      });
      return {
        oldCode: sanitizedOld,
        newCode: sanitizedOld,
        name: nameToSet,
        codeChanged: false
      };
    }
  },

  // 監聽所有已開課班級清單 (用於管理後台即時顯示)
  onClassesChange(callback) {
    return rawRef('registered_classes').on('value', (snap) => {
      const val = snap.val() || {};
      const list = Object.keys(val).map(key => ({ id: key, ...val[key] }));
      // 依建立時間倒序
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(list);
    });
  },

  // 取得特定班級各模組資源數量（用於複製中心即時統計）
  async getModuleCounts(classCode = '') {
    const code = this.sanitizeClassCode(classCode);
    const getPath = (p) => code ? `classes/${code}/${p}` : p;

    const counts = {
      questions: 0,
      questionFolders: 0,
      images: 0,
      imageFolders: 0,
      videos: 0,
      videoFolders: 0,
      teacherShares: 0,
      teacherShareFolders: 0,
      quiz: 0,
      videoQuizSets: 0,
      wordCloud: 0
    };

    try {
      const [qSnap, qfSnap, imgSnap, imgfSnap, vidSnap, vidfSnap, tsSnap, tsfSnap, qzSnap, vqSnap, wcSnap] = await Promise.all([
        rawRef(getPath('questions')).once('value'),
        rawRef(getPath('quiz/questionFolders')).once('value'),
        rawRef(getPath('images')).once('value'),
        rawRef(getPath('quiz/imageFolders')).once('value'),
        rawRef(getPath('videos')).once('value'),
        rawRef(getPath('quiz/videoFolders')).once('value'),
        rawRef(getPath('teacherShares')).once('value'),
        rawRef(getPath('quiz/teacherShareFolders')).once('value'),
        rawRef(getPath('quiz/history')).once('value'),
        rawRef(getPath('quiz/videoQuizCustomSets')).once('value'),
        rawRef(getPath('quiz/wordCloud/history')).once('value')
      ]);

      const countVal = (val) => {
        if (!val) return 0;
        if (Array.isArray(val)) return val.filter(Boolean).length;
        return Object.keys(val).length;
      };

      counts.questions = countVal(qSnap.val());
      counts.questionFolders = countVal(qfSnap.val());
      counts.images = countVal(imgSnap.val());
      counts.imageFolders = countVal(imgfSnap.val());
      counts.videos = countVal(vidSnap.val());
      counts.videoFolders = countVal(vidfSnap.val());
      counts.teacherShares = countVal(tsSnap.val());
      counts.teacherShareFolders = countVal(tsfSnap.val());
      counts.quiz = countVal(qzSnap.val());
      counts.videoQuizSets = countVal(vqSnap.val());
      counts.wordCloud = countVal(wcSnap.val());
    } catch (err) {
      console.warn('getModuleCounts error:', err);
    }

    return counts;
  },

  // 跨班複製核心方法（支援提問、圖片、影片、教師分享、選擇題庫、影片測驗組合、文字雲題庫與分類資料夾）
  async copyModuleData({
    sourceCode = '',
    targetCodes = [],
    modules = { questions: true, images: true, videos: true, teacherShares: true, quiz: true, videoQuiz: true, wordCloud: true },
    copyMode = 'append' // 'append' | 'overwrite'
  }) {
    const sCode = this.sanitizeClassCode(sourceCode);
    const targets = (targetCodes || []).map(c => this.sanitizeClassCode(c));
    if (!targets.length) throw new Error('請至少選擇一個目標班級！');

    const srcPath = (p) => sCode ? `classes/${sCode}/${p}` : p;
    const tgtPath = (tCode, p) => tCode ? `classes/${tCode}/${p}` : p;

    // 1. 讀取來源班級資料
    const readPromises = {};
    if (modules.questions) {
      readPromises.questions = rawRef(srcPath('questions')).once('value');
      readPromises.questionFolders = rawRef(srcPath('quiz/questionFolders')).once('value');
    }
    if (modules.images) {
      readPromises.images = rawRef(srcPath('images')).once('value');
      readPromises.imageFolders = rawRef(srcPath('quiz/imageFolders')).once('value');
    }
    if (modules.videos) {
      readPromises.videos = rawRef(srcPath('videos')).once('value');
      readPromises.videoFolders = rawRef(srcPath('quiz/videoFolders')).once('value');
    }
    if (modules.teacherShares) {
      readPromises.teacherShares = rawRef(srcPath('teacherShares')).once('value');
      readPromises.teacherShareFolders = rawRef(srcPath('quiz/teacherShareFolders')).once('value');
    }
    if (modules.quiz) {
      readPromises.quizHistory = rawRef(srcPath('quiz/history')).once('value');
      readPromises.quizCurrent = rawRef(srcPath('quiz/current')).once('value');
    }
    if (modules.videoQuiz) {
      readPromises.videoQuizCustomSets = rawRef(srcPath('quiz/videoQuizCustomSets')).once('value');
      readPromises.videoQuizzes = rawRef(srcPath('quiz/videoQuizzes')).once('value');
    }
    if (modules.wordCloud) {
      readPromises.wordCloudHistory = rawRef(srcPath('quiz/wordCloud/history')).once('value');
    }

    const srcData = {};
    for (const [key, promise] of Object.entries(readPromises)) {
      srcData[key] = (await promise).val();
    }

    // 輔助函式：轉換與重整
    const toArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      return Object.entries(val).map(([id, item]) => {
        if (typeof item === 'object' && item !== null) {
          return { id: item.id || id, ...item };
        }
        return { id, val: item };
      });
    };

    const toMap = (arr) => {
      const obj = {};
      arr.forEach((item, idx) => {
        const id = item.id || `item_${idx}_${Date.now()}`;
        obj[id] = item;
      });
      return obj;
    };

    const results = [];

    // 2. 處理各目標班級寫入
    for (const tCode of targets) {
      if (sCode && sCode === tCode) continue;

      const writePromises = [];

      // A. 處理提問與分類資料夾
      if (modules.questions) {
        const srcFolders = toArray(srcData.questionFolders);
        const srcQuestions = toArray(srcData.questions);

        if (copyMode === 'overwrite') {
          const cleanedQuestions = srcQuestions.map(q => ({
            ...q,
            reactions: { like: 0, love: 0, laugh: 0, wow: 0 },
            commentCount: 0
          }));
          writePromises.push(rawRef(tgtPath(tCode, 'quiz/questionFolders')).set(toMap(srcFolders)));
          writePromises.push(rawRef(tgtPath(tCode, 'questions')).set(toMap(cleanedQuestions)));
        } else {
          const [existFoldersSnap, existQuestionsSnap] = await Promise.all([
            rawRef(tgtPath(tCode, 'quiz/questionFolders')).once('value'),
            rawRef(tgtPath(tCode, 'questions')).once('value')
          ]);
          const existFolders = toArray(existFoldersSnap.val());
          const existQuestions = toArray(existQuestionsSnap.val());

          const folderIdMap = {};
          srcFolders.forEach(sf => {
            const match = existFolders.find(ef => ef.name === sf.name);
            if (match) {
              folderIdMap[sf.id] = match.id;
            } else {
              const newFolderId = `qf_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
              folderIdMap[sf.id] = newFolderId;
              existFolders.push({ ...sf, id: newFolderId });
            }
          });

          srcQuestions.forEach(sq => {
            const newQId = `q_copy_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const mappedFolderId = sq.folderId ? (folderIdMap[sq.folderId] || sq.folderId) : null;
            existQuestions.push({
              ...sq,
              id: newQId,
              folderId: mappedFolderId,
              reactions: { like: 0, love: 0, laugh: 0, wow: 0 },
              commentCount: 0
            });
          });

          writePromises.push(rawRef(tgtPath(tCode, 'quiz/questionFolders')).set(toMap(existFolders)));
          writePromises.push(rawRef(tgtPath(tCode, 'questions')).set(toMap(existQuestions)));
        }
      }

      // B. 處理圖片與分類資料夾
      if (modules.images) {
        const srcFolders = toArray(srcData.imageFolders);
        const srcImages = toArray(srcData.images);

        if (copyMode === 'overwrite') {
          const cleanedImages = srcImages.map(img => ({
            ...img,
            reactions: { like: 0, love: 0, laugh: 0, wow: 0 }
          }));
          writePromises.push(rawRef(tgtPath(tCode, 'quiz/imageFolders')).set(toMap(srcFolders)));
          writePromises.push(rawRef(tgtPath(tCode, 'images')).set(toMap(cleanedImages)));
        } else {
          const [existFoldersSnap, existImagesSnap] = await Promise.all([
            rawRef(tgtPath(tCode, 'quiz/imageFolders')).once('value'),
            rawRef(tgtPath(tCode, 'images')).once('value')
          ]);
          const existFolders = toArray(existFoldersSnap.val());
          const existImages = toArray(existImagesSnap.val());

          const folderIdMap = {};
          srcFolders.forEach(sf => {
            const match = existFolders.find(ef => ef.name === sf.name);
            if (match) {
              folderIdMap[sf.id] = match.id;
            } else {
              const newFolderId = `imgf_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
              folderIdMap[sf.id] = newFolderId;
              existFolders.push({ ...sf, id: newFolderId });
            }
          });

          srcImages.forEach(img => {
            const newId = `img_copy_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const mappedFolderId = img.folderId ? (folderIdMap[img.folderId] || img.folderId) : null;
            existImages.push({
              ...img,
              id: newId,
              folderId: mappedFolderId,
              reactions: { like: 0, love: 0, laugh: 0, wow: 0 }
            });
          });

          writePromises.push(rawRef(tgtPath(tCode, 'quiz/imageFolders')).set(toMap(existFolders)));
          writePromises.push(rawRef(tgtPath(tCode, 'images')).set(toMap(existImages)));
        }
      }

      // C. 處理影片與分類資料夾
      if (modules.videos) {
        const srcFolders = toArray(srcData.videoFolders);
        const srcVideos = toArray(srcData.videos);

        if (copyMode === 'overwrite') {
          const cleanedVideos = srcVideos.map(vid => ({
            ...vid,
            reactions: { like: 0, love: 0, laugh: 0, wow: 0 }
          }));
          writePromises.push(rawRef(tgtPath(tCode, 'quiz/videoFolders')).set(toMap(srcFolders)));
          writePromises.push(rawRef(tgtPath(tCode, 'videos')).set(toMap(cleanedVideos)));
        } else {
          const [existFoldersSnap, existVideosSnap] = await Promise.all([
            rawRef(tgtPath(tCode, 'quiz/videoFolders')).once('value'),
            rawRef(tgtPath(tCode, 'videos')).once('value')
          ]);
          const existFolders = toArray(existFoldersSnap.val());
          const existVideos = toArray(existVideosSnap.val());

          const folderIdMap = {};
          srcFolders.forEach(sf => {
            const match = existFolders.find(ef => ef.name === sf.name);
            if (match) {
              folderIdMap[sf.id] = match.id;
            } else {
              const newFolderId = `vidf_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
              folderIdMap[sf.id] = newFolderId;
              existFolders.push({ ...sf, id: newFolderId });
            }
          });

          srcVideos.forEach(vid => {
            const newId = `vid_copy_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const mappedFolderId = vid.folderId ? (folderIdMap[vid.folderId] || vid.folderId) : null;
            existVideos.push({
              ...vid,
              id: newId,
              folderId: mappedFolderId,
              reactions: { like: 0, love: 0, laugh: 0, wow: 0 }
            });
          });

          writePromises.push(rawRef(tgtPath(tCode, 'quiz/videoFolders')).set(toMap(existFolders)));
          writePromises.push(rawRef(tgtPath(tCode, 'videos')).set(toMap(existVideos)));
        }
      }

      // D. 處理教師分享與分類資料夾
      if (modules.teacherShares) {
        const srcFolders = toArray(srcData.teacherShareFolders);
        const srcShares = toArray(srcData.teacherShares);

        if (copyMode === 'overwrite') {
          writePromises.push(rawRef(tgtPath(tCode, 'quiz/teacherShareFolders')).set(toMap(srcFolders)));
          writePromises.push(rawRef(tgtPath(tCode, 'teacherShares')).set(toMap(srcShares)));
        } else {
          const [existFoldersSnap, existSharesSnap] = await Promise.all([
            rawRef(tgtPath(tCode, 'quiz/teacherShareFolders')).once('value'),
            rawRef(tgtPath(tCode, 'teacherShares')).once('value')
          ]);
          const existFolders = toArray(existFoldersSnap.val());
          const existShares = toArray(existSharesSnap.val());

          const folderIdMap = {};
          srcFolders.forEach(sf => {
            const match = existFolders.find(ef => ef.name === sf.name);
            if (match) {
              folderIdMap[sf.id] = match.id;
            } else {
              const newFolderId = `tsf_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
              folderIdMap[sf.id] = newFolderId;
              existFolders.push({ ...sf, id: newFolderId });
            }
          });

          srcShares.forEach(sh => {
            const newId = `share_copy_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const mappedFolderId = sh.folderId ? (folderIdMap[sh.folderId] || sh.folderId) : null;
            existShares.push({
              ...sh,
              id: newId,
              folderId: mappedFolderId
            });
          });

          writePromises.push(rawRef(tgtPath(tCode, 'quiz/teacherShareFolders')).set(toMap(existFolders)));
          writePromises.push(rawRef(tgtPath(tCode, 'teacherShares')).set(toMap(existShares)));
        }
      }

      // E. 處理選擇題測驗題庫 (quiz/history, 排除 quiz/answers)
      if (modules.quiz) {
        const srcHistory = toArray(srcData.quizHistory);
        if (copyMode === 'overwrite') {
          writePromises.push(rawRef(tgtPath(tCode, 'quiz/history')).set(toMap(srcHistory)));
          if (srcData.quizCurrent) {
            writePromises.push(rawRef(tgtPath(tCode, 'quiz/current')).set(srcData.quizCurrent));
          }
        } else {
          const existSnap = await rawRef(tgtPath(tCode, 'quiz/history')).once('value');
          const existHistory = toArray(existSnap.val());

          srcHistory.forEach(q => {
            const duplicate = existHistory.some(eq => eq.question === q.question);
            if (!duplicate) {
              const newId = `quiz_copy_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
              existHistory.push({ ...q, id: newId });
            }
          });
          writePromises.push(rawRef(tgtPath(tCode, 'quiz/history')).set(toMap(existHistory)));
        }
      }

      // F. 處理影片測驗組合 (quiz/videoQuizCustomSets 與 quiz/videoQuizzes; 排除 answers & session)
      if (modules.videoQuiz) {
        const srcSets = toArray(srcData.videoQuizCustomSets);
        const srcQuizzes = toArray(srcData.videoQuizzes);

        if (copyMode === 'overwrite') {
          writePromises.push(rawRef(tgtPath(tCode, 'quiz/videoQuizCustomSets')).set(toMap(srcSets)));
          if (srcQuizzes.length > 0) {
            writePromises.push(rawRef(tgtPath(tCode, 'quiz/videoQuizzes')).set(toMap(srcQuizzes)));
          }
        } else {
          const [existSetsSnap, existQuizzesSnap] = await Promise.all([
            rawRef(tgtPath(tCode, 'quiz/videoQuizCustomSets')).once('value'),
            rawRef(tgtPath(tCode, 'quiz/videoQuizzes')).once('value')
          ]);
          const existSets = toArray(existSetsSnap.val());
          const existQuizzes = toArray(existQuizzesSnap.val());

          srcSets.forEach(set => {
            const match = existSets.find(es => es.name === set.name);
            if (!match) {
              const newSetId = `set_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
              existSets.push({ ...set, id: newSetId });
            }
          });

          srcQuizzes.forEach(quiz => {
            const match = existQuizzes.find(eq => eq.title === quiz.title || eq.videoUrl === quiz.videoUrl);
            if (!match) {
              const newQuizId = `vq_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
              existQuizzes.push({ ...quiz, id: newQuizId });
            }
          });

          writePromises.push(rawRef(tgtPath(tCode, 'quiz/videoQuizCustomSets')).set(toMap(existSets)));
          if (srcQuizzes.length > 0) {
            writePromises.push(rawRef(tgtPath(tCode, 'quiz/videoQuizzes')).set(toMap(existQuizzes)));
          }
        }
      }

      // G. 處理文字雲歷史題庫 (quiz/wordCloud/history; 排除學生作答記錄)
      if (modules.wordCloud) {
        const srcWcHistory = toArray(srcData.wordCloudHistory).map(w => {
          const cleaned = { ...w };
          delete cleaned.savedSubmissions;
          delete cleaned.savedWords;
          delete cleaned.totalSubmissions;
          return cleaned;
        });

        if (copyMode === 'overwrite') {
          writePromises.push(rawRef(tgtPath(tCode, 'quiz/wordCloud/history')).set(toMap(srcWcHistory)));
        } else {
          const existSnap = await rawRef(tgtPath(tCode, 'quiz/wordCloud/history')).once('value');
          const existWc = toArray(existSnap.val());

          srcWcHistory.forEach(w => {
            const duplicate = existWc.some(ew => ew.title === w.title && (ew.imageUrl || null) === (w.imageUrl || null));
            if (!duplicate) {
              const newId = `wch_copy_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
              existWc.push({ ...w, id: newId, createdAt: Date.now() });
            }
          });
          writePromises.push(rawRef(tgtPath(tCode, 'quiz/wordCloud/history')).set(toMap(existWc)));
        }
      }

      await Promise.all(writePromises);
      results.push(tCode);
    }

    return results;
  },

  // 複製單一測驗組合到指定多個班級
  async copySingleCustomSet(setId, targetCodes = [], sourceCode = '') {
    const sCode = this.sanitizeClassCode(sourceCode);
    const targets = (targetCodes || []).map(c => this.sanitizeClassCode(c)).filter(Boolean);
    if (!targets.length) throw new Error('請至少選擇一個目標班級！');

    const srcPath = (p) => sCode ? `classes/${sCode}/${p}` : p;
    const tgtPath = (tCode, p) => tCode ? `classes/${tCode}/${p}` : p;

    // 讀取來源組合
    const snap = await rawRef(srcPath('quiz/videoQuizCustomSets')).once('value');
    const val = snap.val() || {};
    let targetSet = null;
    if (Array.isArray(val)) {
      targetSet = val.find(s => s && s.id === setId);
    } else if (val[setId]) {
      targetSet = val[setId];
    } else {
      targetSet = Object.values(val).find(s => s && s.id === setId);
    }

    // 若 Firebase 尚未儲存，嘗試由 LocalStorage 讀取
    if (!targetSet && typeof localStorage !== 'undefined') {
      try {
        const localSets = JSON.parse(window.boardStorage.local.getItem('video_quiz_custom_sets_v1') || '[]');
        targetSet = localSets.find(s => s && s.id === setId);
      } catch (e) {}
    }

    if (!targetSet) {
      throw new Error(`查無 ID 為【${setId}】的測驗組合！`);
    }

    // 讀取相關題目定義
    const vqSnap = await rawRef(srcPath('quiz/videoQuizzes')).once('value');
    let allQuizzes = vqSnap.val() || {};
    if (!allQuizzes && typeof localStorage !== 'undefined') {
      try {
        allQuizzes = JSON.parse(window.boardStorage.local.getItem('video_quizzes_v1') || '[]');
      } catch (e) {}
    }

    const toArray = (v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v.filter(Boolean);
      return Object.values(v);
    };

    const toMap = (arr) => {
      const obj = {};
      arr.forEach((item, idx) => {
        const id = item.id || `item_${idx}_${Date.now()}`;
        obj[id] = item;
      });
      return obj;
    };

    const copiedCount = [];

    for (const tCode of targets) {
      if (sCode && sCode === tCode) continue;

      const [existSetsSnap, existQuizzesSnap] = await Promise.all([
        rawRef(tgtPath(tCode, 'quiz/videoQuizCustomSets')).once('value'),
        rawRef(tgtPath(tCode, 'quiz/videoQuizzes')).once('value')
      ]);

      const existSets = toArray(existSetsSnap.val());
      const existQuizzes = toArray(existQuizzesSnap.val());

      // 檢查是否已有名稱相同的組合
      const matchIndex = existSets.findIndex(es => es.name === targetSet.name);
      const newSetId = `set_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const setToAdd = {
        ...targetSet,
        id: newSetId,
        createdAt: Date.now()
      };

      if (matchIndex >= 0) {
        existSets[matchIndex] = setToAdd;
      } else {
        existSets.unshift(setToAdd);
      }

      // 合併關聯的影片題目
      const relatedQuizzes = toArray(allQuizzes).filter(q => {
        return (targetSet.quizIds || []).includes(q.id) || (targetSet.quizTitles || []).includes(q.title);
      });

      relatedQuizzes.forEach(rq => {
        const qMatch = existQuizzes.find(eq => eq.title === rq.title);
        if (!qMatch) {
          existQuizzes.push(rq);
        }
      });

      await Promise.all([
        rawRef(tgtPath(tCode, 'quiz/videoQuizCustomSets')).set(toMap(existSets)),
        rawRef(tgtPath(tCode, 'quiz/videoQuizzes')).set(toMap(existQuizzes))
      ]);

      copiedCount.push(tCode);
    }

    return { set: targetSet, copiedCount };
  },

  // 複製單一項目到指定多個班級（提問、圖片、影片、教師分享、選擇題、影片出題）
  async copySingleItem({ moduleType, itemId, targetCodes = [], sourceCode = '' }) {
    const sCode = this.sanitizeClassCode(sourceCode);
    const targets = (targetCodes || []).map(c => this.sanitizeClassCode(c));
    if (!targets.length) throw new Error('請至少選擇一個目標班級！');

    const srcPath = (p) => sCode ? `classes/${sCode}/${p}` : p;
    const tgtPath = (tCode, p) => tCode ? `classes/${tCode}/${p}` : p;

    const toArray = (v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v.filter(Boolean);
      return Object.values(v);
    };

    const toMap = (arr) => {
      const obj = {};
      arr.forEach((item, idx) => {
        const id = item.id || `item_${idx}_${Date.now()}`;
        obj[id] = item;
      });
      return obj;
    };

    let itemData = null;
    let folderName = '';
    let folderTypePath = '';

    if (moduleType === 'questions') {
      const snap = await rawRef(srcPath(`questions/${itemId}`)).once('value');
      itemData = snap.val();
      if (!itemData) {
        const pSnap = await rawRef(srcPath('questions')).once('value');
        const pVal = pSnap.val();
        if (pVal) itemData = pVal[itemId];
      }
      if (!itemData && window.app && window.app.questions) {
        itemData = window.app.questions.find(q => q && q.id === itemId);
      }
      folderTypePath = 'quiz/questionFolders';
    } else if (moduleType === 'images') {
      const snap = await rawRef(srcPath(`images/${itemId}`)).once('value');
      itemData = snap.val();
      if (!itemData) {
        const pSnap = await rawRef(srcPath('images')).once('value');
        const pVal = pSnap.val();
        if (pVal) itemData = pVal[itemId];
      }
      if (!itemData && window.app && window.app.images) {
        itemData = window.app.images.find(img => img && img.id === itemId);
      }
      folderTypePath = 'quiz/imageFolders';
    } else if (moduleType === 'videos') {
      const snap = await rawRef(srcPath(`videos/${itemId}`)).once('value');
      itemData = snap.val();
      if (!itemData) {
        const pSnap = await rawRef(srcPath('videos')).once('value');
        const pVal = pSnap.val();
        if (pVal) itemData = pVal[itemId];
      }
      if (!itemData && window.app && window.app.videos) {
        itemData = window.app.videos.find(v => v && v.id === itemId);
      }
      folderTypePath = 'quiz/videoFolders';
    } else if (moduleType === 'teacherShares') {
      const snap = await rawRef(srcPath(`teacherShares/${itemId}`)).once('value');
      itemData = snap.val();
      if (!itemData) {
        const pSnap = await rawRef(srcPath('teacherShares')).once('value');
        const pVal = pSnap.val();
        if (pVal) itemData = pVal[itemId];
      }
      if (!itemData && window.app && window.app.shares) {
        itemData = window.app.shares.find(s => s && s.id === itemId);
      }
      folderTypePath = 'quiz/teacherShareFolders';
    } else if (moduleType === 'quiz') {
      const snap = await rawRef(srcPath(`quiz/history/${itemId}`)).once('value');
      itemData = snap.val();
      if (!itemData) {
        const pSnap = await rawRef(srcPath('quiz/history')).once('value');
        const pVal = pSnap.val();
        if (pVal) itemData = pVal[itemId];
      }
      if (!itemData && window.quiz && window.quiz.historyBank) {
        itemData = window.quiz.historyBank[itemId];
      }
    } else if (moduleType === 'videoQuiz') {
      const snap = await rawRef(srcPath(`quiz/videoQuizzes/${itemId}`)).once('value');
      itemData = snap.val();
      if (!itemData) {
        const pSnap = await rawRef(srcPath('quiz/videoQuizzes')).once('value');
        const pVal = pSnap.val();
        if (pVal) itemData = pVal[itemId];
      }
      if (!itemData && window.videoQuiz && window.videoQuiz.quizzes) {
        itemData = window.videoQuiz.quizzes.find(q => q && q.id === itemId);
      }
    } else if (moduleType === 'wordCloud') {
      const snap = await rawRef(srcPath(`quiz/wordCloud/history/${itemId}`)).once('value');
      itemData = snap.val();
      if (!itemData) {
        const pSnap = await rawRef(srcPath('quiz/wordCloud/history')).once('value');
        const pVal = pSnap.val();
        if (pVal) itemData = pVal[itemId];
      }
      if (!itemData && window.wordCloud && window.wordCloud.historyBank) {
        itemData = window.wordCloud.historyBank[itemId];
      }
    } else if (moduleType === 'whiteboardArchive') {
      const snap = await rawRef(srcPath(`whiteboard_archives/${itemId}`)).once('value');
      itemData = snap.val();
      if (!itemData) {
        const pSnap = await rawRef(srcPath('whiteboard_archives')).once('value');
        const pVal = pSnap.val();
        if (pVal) itemData = pVal[itemId];
      }
      if (!itemData && window.whiteboardArchives) {
        itemData = window.whiteboardArchives[itemId];
      }
      if (!itemData && window.parent && window.parent.whiteboardArchives) {
        itemData = window.parent.whiteboardArchives[itemId];
      }
    } else if (moduleType === 'presentationMaterial') {
      const snap = await rawRef(srcPath(`presentation_materials/${itemId}`)).once('value');
      itemData = snap.val();
      if (!itemData) {
        const pSnap = await rawRef(srcPath('presentation_materials')).once('value');
        const pVal = pSnap.val();
        if (pVal) itemData = pVal[itemId];
      }
      if (!itemData && window.presentationManager && window.presentationManager.materialsBank) {
        itemData = window.presentationManager.materialsBank[itemId];
      }
    }

    if (!itemData) {
      throw new Error(`找不到欲複製的項目（ID: ${itemId}）！`);
    }

    // 若有資料夾，取得來源資料夾名稱
    if (itemData.folderId && folderTypePath) {
      const fSnap = await rawRef(srcPath(`${folderTypePath}/${itemData.folderId}`)).once('value');
      let fVal = fSnap.val();
      if (!fVal) {
        const pfSnap = await rawRef(srcPath(folderTypePath)).once('value');
        const pfVal = pfSnap.val();
        if (pfVal) fVal = pfVal[itemData.folderId];
      }
      if (fVal && fVal.name) {
        folderName = fVal.name;
      } else if (window.app) {
        const folderList = moduleType === 'questions' ? window.app.questionFolders
          : moduleType === 'images' ? window.app.imageFolders
          : moduleType === 'videos' ? window.app.videoFolders
          : window.app.shareFolders;
        const found = (folderList || []).find(f => f && f.id === itemData.folderId);
        if (found) folderName = found.name;
      }
    }

    const copiedTargets = [];

    for (const tCode of targets) {
      if (sCode && sCode === tCode) continue;

      let mappedFolderId = null;
      if (folderName && folderTypePath) {
        const tgtFoldersSnap = await rawRef(tgtPath(tCode, folderTypePath)).once('value');
        const tgtFolders = toArray(tgtFoldersSnap.val());
        const matchFolder = tgtFolders.find(f => f && f.name === folderName);
        if (matchFolder) {
          mappedFolderId = matchFolder.id;
        } else {
          mappedFolderId = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
          tgtFolders.push({
            id: mappedFolderId,
            name: folderName,
            sortOrder: tgtFolders.length
          });
          await rawRef(tgtPath(tCode, folderTypePath)).set(toMap(tgtFolders));
        }
      }

      const newId = `${moduleType.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

      if (moduleType === 'questions') {
        const newQuestion = {
          ...itemData,
          id: newId,
          folderId: mappedFolderId || null,
          timestamp: Date.now(),
          reactions: { like: 0, love: 0, laugh: 0, wow: 0 },
          comments: null
        };
        await rawRef(tgtPath(tCode, `questions/${newId}`)).set(newQuestion);
      } else if (moduleType === 'images') {
        const newImage = {
          ...itemData,
          id: newId,
          folderId: mappedFolderId || null,
          timestamp: Date.now(),
          reactions: { like: 0, love: 0, laugh: 0, wow: 0 },
          comments: null
        };
        await rawRef(tgtPath(tCode, `images/${newId}`)).set(newImage);
      } else if (moduleType === 'videos') {
        const newVideo = {
          ...itemData,
          id: newId,
          folderId: mappedFolderId || null,
          timestamp: Date.now(),
          reactions: { like: 0, love: 0, laugh: 0, wow: 0 },
          comments: null
        };
        await rawRef(tgtPath(tCode, `videos/${newId}`)).set(newVideo);
      } else if (moduleType === 'teacherShares') {
        const newShare = {
          ...itemData,
          id: newId,
          folderId: mappedFolderId || null,
          timestamp: Date.now(),
          comments: null
        };
        await rawRef(tgtPath(tCode, `teacherShares/${newId}`)).set(newShare);
      } else if (moduleType === 'quiz') {
        const newQuizItem = {
          ...itemData,
          id: newId,
          createdAt: Date.now()
        };
        await rawRef(tgtPath(tCode, `quiz/history/${newId}`)).set(newQuizItem);
      } else if (moduleType === 'videoQuiz') {
        const existQuizzesSnap = await rawRef(tgtPath(tCode, 'quiz/videoQuizzes')).once('value');
        const existQuizzes = toArray(existQuizzesSnap.val());
        const cleanedQuiz = {
          ...itemData,
          id: newId,
          createdAt: Date.now()
        };
        delete cleanedQuiz.answers;
        delete cleanedQuiz.studentScores;
        const matchIdx = existQuizzes.findIndex(q => q && q.title === cleanedQuiz.title);
        if (matchIdx >= 0) {
          existQuizzes[matchIdx] = cleanedQuiz;
        } else {
          existQuizzes.unshift(cleanedQuiz);
        }
        await rawRef(tgtPath(tCode, 'quiz/videoQuizzes')).set(toMap(existQuizzes));
      } else if (moduleType === 'wordCloud') {
        const newWcItem = {
          ...itemData,
          id: newId,
          createdAt: Date.now()
        };
        delete newWcItem.savedSubmissions;
        delete newWcItem.savedWords;
        delete newWcItem.totalSubmissions;
        await rawRef(tgtPath(tCode, `quiz/wordCloud/history/${newId}`)).set(newWcItem);
      } else if (moduleType === 'whiteboardArchive') {
        const newArchiveItem = {
          ...itemData,
          id: newId,
          createdAt: Date.now()
        };
        await rawRef(tgtPath(tCode, `whiteboard_archives/${newId}`)).set(newArchiveItem);
      } else if (moduleType === 'presentationMaterial') {
        const newMaterialItem = {
          ...itemData,
          id: newId,
          createdAt: Date.now()
        };
        delete newMaterialItem.submissions;
        await rawRef(tgtPath(tCode, `presentation_materials/${newId}`)).set(newMaterialItem);
      }

      copiedTargets.push(tCode);
    }

    return { item: itemData, copiedTargets };
  }
};

// 同一班級的所有模組共用一個已就緒的資料庫與路徑規則。
var db = null;
var rawDb = null;
var rawRef = null;
var storage = null;

function bindBoardDatabase(database, parentPage) {
  rawDb = database;
  db = database;
  if (parentPage) {
    window.currentClassCode = parentPage.currentClassCode;
    rawRef = parentPage.rawRef;
    window.firebaseAuth = parentPage.firebaseAuth;
    return;
  }
  window.currentClassCode = ClassRoomManager.getActiveClassCode();
  rawRef = rawDb.ref.bind(rawDb);
  rawDb.rawRef = rawRef;

  // 若先前記錄此網路環境需走備用通道 (Long-Polling)，可直接調用加快連線
  try {
    if (window.boardStorage.local.getItem('fb_prefer_long_polling') === 'true' && rawDb.INTERNAL && typeof rawDb.INTERNAL.forceLongPolling === 'function') {
      console.log('偵測到先前校園網路偏好，直接啟用備用通訊協定 (Long-Polling)');
      rawDb.INTERNAL.forceLongPolling();
    }
  } catch (e) {}

  // 透過透明代理 (Transparent Routing)，支援「一次性課堂」與「專屬班級」雙軌自動分流
  rawDb.ref = function(path) {
    if (!path || path === '/') {
      const code = window.currentClassCode;
      return code ? rawRef(`classes/${code}`) : rawRef();
    }
    // 系統內部保留路徑不加班級前綴 (如連線檢測 .info/connected、班級名單 registered_classes)
    if (path.startsWith('.info/') || path.startsWith('system/') || path.startsWith('classes/') || path.startsWith('registered_classes')) {
      return rawRef(path);
    }
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const code = window.currentClassCode;

    // 雙軌分流核心：
    // 1. 若處於專屬班級（有班級代碼）：自動導向 classes/{classCode}/{cleanPath}
    // 2. 若處於一次性課堂（無班級代碼）：維持原本的 cleanPath（零破壞、100% 相容既有課堂資料！）
    if (code) {
      return rawRef(`classes/${code}/${cleanPath}`);
    } else {
      return rawRef(cleanPath);
    }
  };
}
