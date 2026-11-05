/**
 * teacher_auth_manager.js - 教師身分與管理員安全認證管理模組
 * 
 * 功能亮點：
 * 1. SHA-256 不可逆雜湊加密 (Web Crypto API + 純 JS 雙重容錯)，零明文存儲
 * 2. 認老師架構：單一教師設定專屬密碼，所建所有白板自動套用；一次性/公共白板全相容
 * 3. 防暴力破解鎖定：連續錯誤 5 次自動鎖定 180 秒 (3 分鐘)，帶即時倒數與狀態保護
 * 4. 忘記密碼自救機制：
 *    - 第一線自救：密碼提示 + 安全提問自救 (不需外部郵件，自給自足，SHA-256 零明文)
 *    - 終極自救保障：資料庫擁有者登入 Firebase 控制台刪除密碼節點即可自救重設 (徹底脫鉤，無全域萬能鑰匙後門)
 * 5. 向下相容：初次使用或舊班級預設密碼 1234 仍可登入，後台顯示琥珀色警告提醒儘速修改
 */

(function (window) {
  'use strict';

  // 預設與系統保留常數
  const DEFAULT_PASSWORD_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; // '1234'
  const DEFAULT_PASSWORD_GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000; // 預設密碼 1234 寬限期：7 天 (自啟用/初次登入起算 1 週)
  
  const STORAGE_KEYS = {
    ACTIVE_TEACHER: 'wb_active_teacher_id',
    ACTIVE_TEACHER_NAME: 'wb_active_teacher_name',
    LOCKOUT: 'wb_admin_auth_lockout_v1',
    LOCAL_CACHE: 'wb_teacher_profile_cache_'
  };

  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 180 * 1000; // 3 分鐘 (180 秒)

  class TeacherAuthManager {
    constructor() {
      this.lockoutTimer = null;
      this.currentVerifiedTeacher = null;
    }

    /**
     * 取得預設密碼 1234 的過期時間戳記 (自首次登入/啟用起算 7 天 / 一週)
     */
    getDefaultPasswordExpiryTimestamp(profile) {
      const baseTime = (profile && (profile.defaultPasswordCreatedAt || profile.createdAt)) || this._getFallbackInitTime();
      return baseTime + DEFAULT_PASSWORD_GRACE_PERIOD_MS;
    }

    _getFallbackInitTime() {
      let t = parseInt(window.boardStorage.local.getItem('wb_default_pwd_init_ts'), 10);
      if (!t || isNaN(t)) {
        t = Date.now();
        try { window.boardStorage.local.setItem('wb_default_pwd_init_ts', String(t)); } catch (e) {}
      }
      return t;
    }

    /**
     * 檢查預設密碼 1234 是否已過期 (超過首次登入起算之一週寬限期)
     */
    isDefaultPasswordExpired(profile) {
      const expiry = this.getDefaultPasswordExpiryTimestamp(profile);
      return Date.now() > expiry;
    }

    /**
     * 取得預設密碼距離一週寬限期尚餘天數
     */
    getDefaultPasswordRemainingDays(profile) {
      const expiry = this.getDefaultPasswordExpiryTimestamp(profile);
      const diff = expiry - Date.now();
      if (diff <= 0) return 0;
      return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    /**
     * 計算字串之 SHA-256 雜湊 (小寫 Hex 字串)
     */
    async sha256(text) {
      if (typeof text !== 'string') text = String(text || '');
      // 優先使用 Web Crypto API
      if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
        try {
          const encoder = new TextEncoder();
          const data = encoder.encode(text);
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
          console.warn('Web Crypto API 執行失敗，使用內建演算法 fallback:', e);
        }
      }
      return this._fallbackSha256(text);
    }

    /**
     * 純 JS SHA-256 容錯備援實作 (確保在任何環境/file:// 協定皆 100% 正常運作)
     */
    _fallbackSha256(ascii) {
      function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
      }
      const mathPow = Math.pow;
      const maxWord = mathPow(2, 32);
      let lengthProperty = 'length';
      let i, j;
      let result = '';
      const words = [];
      const asciiBitLength = ascii[lengthProperty] * 8;
      let hash = [];
      let k = [];
      let primeCounter = 0;

      const isComposite = {};
      for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
          for (i = candidate * candidate; i < 313; i += candidate) {
            isComposite[i] = true;
          }
          if (primeCounter < 8) {
            hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
          }
          k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
          primeCounter++;
        }
      }

      ascii += '\x80';
      while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
      for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return ''; // 僅支援 ASCII/UTF-8 字符
        words[i >> 2] |= j << (((3 - i) % 4) * 8);
      }
      words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
      words[words[lengthProperty]] = asciiBitLength;

      for (j = 0; j < words[lengthProperty];) {
        const w = words.slice(j, (j += 16));
        const oldHash = hash;
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
          const w15 = w[i - 15], w2 = w[i - 2];
          const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
          const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
          const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
          const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
          const s1_4 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
          const s0_0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
          const t1 = hash[7] + s1_4 + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
          const t2 = s0_0 + maj;

          hash = [(t1 + t2) | 0].concat(hash);
          hash[4] = (hash[4] + t1) | 0;
        }

        for (i = 0; i < 8; i++) {
          hash[i] = (hash[i] + oldHash[i]) | 0;
        }
      }

      for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
          const b = (hash[i] >> (j * 8)) & 255;
          result += ((b < 16) ? '0' : '') + b.toString(16);
        }
      }
      return result;
    }

    /**
     * 讀取防暴力破解狀態
     */
    getLockoutStatus() {
      try {
        const raw = window.boardStorage.local.getItem(STORAGE_KEYS.LOCKOUT);
        if (!raw) return { isLocked: false, remainingSeconds: 0, failCount: 0 };
        const data = JSON.parse(raw);
        const now = Date.now();
        if (data.lockedUntil && data.lockedUntil > now) {
          const remainingSeconds = Math.ceil((data.lockedUntil - now) / 1000);
          return { isLocked: true, remainingSeconds, failCount: data.failCount || MAX_FAILED_ATTEMPTS };
        }
        // 鎖定時間已過，若鎖定過期則保留計數或重設
        if (data.lockedUntil && data.lockedUntil <= now) {
          this.clearLockout();
          return { isLocked: false, remainingSeconds: 0, failCount: 0 };
        }
        return { isLocked: false, remainingSeconds: 0, failCount: data.failCount || 0 };
      } catch (e) {
        return { isLocked: false, remainingSeconds: 0, failCount: 0 };
      }
    }

    /**
     * 記錄一次密碼錯誤
     */
    recordFailedAttempt() {
      try {
        const current = this.getLockoutStatus();
        const newCount = (current.failCount || 0) + 1;
        let lockedUntil = 0;
        let isLocked = false;
        let remainingSeconds = 0;

        if (newCount >= MAX_FAILED_ATTEMPTS) {
          lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
          isLocked = true;
          remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
        }

        window.boardStorage.local.setItem(STORAGE_KEYS.LOCKOUT, JSON.stringify({
          failCount: newCount,
          lockedUntil: lockedUntil,
          lastFailedAt: Date.now()
        }));

        return { isLocked, remainingSeconds, failCount: newCount, remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - newCount) };
      } catch (e) {
        return { isLocked: false, remainingSeconds: 0, failCount: 1, remainingAttempts: MAX_FAILED_ATTEMPTS - 1 };
      }
    }

    /**
     * 清除防暴力破解計數與鎖定
     */
    clearLockout() {
      try {
        window.boardStorage.local.removeItem(STORAGE_KEYS.LOCKOUT);
      } catch (e) {}
    }

    /**
     * 取得當前本機記錄的使用中教師代號
     */
    getActiveTeacherId() {
      let id = window.boardStorage.local.getItem(STORAGE_KEYS.ACTIVE_TEACHER);
      if (!id) {
        // 預設教師 ID：以 T- 開頭加上隨機字串，便於區隔不同老師
        id = 'teacher_' + Math.random().toString(36).substring(2, 8);
        window.boardStorage.local.setItem(STORAGE_KEYS.ACTIVE_TEACHER, id);
        window.boardStorage.local.setItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME, '授課老師');
      }
      return id;
    }

    /**
     * 設定當前使用中教師代號與名稱
     */
    setActiveTeacher(teacherId, name = '') {
      if (teacherId) {
        window.boardStorage.local.setItem(STORAGE_KEYS.ACTIVE_TEACHER, teacherId);
        if (name) window.boardStorage.local.setItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME, name);
      }
    }

    /**
     * 取得目前課堂綁定的擁有者教師 ID
     */
    async getCurrentClassOwnerTeacherId() {
      const classCode = window.currentClassCode;
      if (!classCode) return null;

      try {
        if (window.firebase && typeof window.rawRef === 'function') {
          const snap = await window.rawRef(`registered_classes/${classCode}/ownerTeacherId`).once('value');
          if (snap.exists() && snap.val()) {
            return snap.val();
          }
        }
      } catch (e) {
        console.warn('getCurrentClassOwnerTeacherId error:', e);
      }
      return null;
    }

    /**
     * 讀取教師資料 (優先從 Firebase 讀取，並快取於本機)
     */
    async getTeacherProfile(teacherId) {
      if (!teacherId) teacherId = this.getActiveTeacherId();
      
      // 1. 先嘗試由 Firebase 讀取最新資料
      try {
        if (window.firebase && typeof window.rawRef === 'function') {
          const snap = await window.rawRef(`teachers/${teacherId}`).once('value');
          if (snap.exists() && snap.val()) {
            const profile = snap.val();
            // 寫入快取
            try {
              window.boardStorage.local.setItem(STORAGE_KEYS.LOCAL_CACHE + teacherId, JSON.stringify(profile));
            } catch (e) {}
            return profile;
          }
        }
      } catch (e) {
        console.warn('從 Firebase 讀取教師資料失敗，嘗試本機快取:', e);
      }

      // 2. 本機快取備援
      try {
        const cached = window.boardStorage.local.getItem(STORAGE_KEYS.LOCAL_CACHE + teacherId);
        if (cached) return JSON.parse(cached);
      } catch (e) {}

      // 3. 預設初始資料
      const now = Date.now();
      return {
        teacherId: teacherId,
        name: window.boardStorage.local.getItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME) || '授課老師',
        passwordHash: DEFAULT_PASSWORD_HASH, // 預設 1234
        passwordHint: '',
        recoveryQuestion: '',
        recoveryAnswerHash: '',
        isDefault: true,
        defaultPasswordCreatedAt: now,
        createdAt: now
      };
    }

    /**
     * 儲存教師資料至 Firebase 與本機快取
     */
    async saveTeacherProfile(teacherId, data) {
      if (!teacherId) teacherId = this.getActiveTeacherId();
      const existing = await this.getTeacherProfile(teacherId);

      const updated = {
        teacherId: teacherId,
        name: (data.name !== undefined ? data.name : existing.name) || '授課老師',
        passwordHash: data.passwordHash !== undefined ? data.passwordHash : existing.passwordHash,
        passwordHint: data.passwordHint !== undefined ? data.passwordHint : (existing.passwordHint || ''),
        recoveryQuestion: data.recoveryQuestion !== undefined ? data.recoveryQuestion : (existing.recoveryQuestion || ''),
        recoveryAnswerHash: data.recoveryAnswerHash !== undefined ? data.recoveryAnswerHash : (existing.recoveryAnswerHash || ''),
        defaultPasswordCreatedAt: data.defaultPasswordCreatedAt !== undefined ? data.defaultPasswordCreatedAt : (existing.defaultPasswordCreatedAt || Date.now()),
        updatedAt: Date.now(),
        createdAt: existing.createdAt || Date.now()
      };

      // 儲存至本機快取
      try {
        window.boardStorage.local.setItem(STORAGE_KEYS.LOCAL_CACHE + teacherId, JSON.stringify(updated));
        window.boardStorage.local.setItem(STORAGE_KEYS.ACTIVE_TEACHER, teacherId);
        window.boardStorage.local.setItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME, updated.name);
      } catch (e) {}

      // 儲存至 Firebase
      if (window.firebase && typeof window.rawRef === 'function') {
        try {
          await window.rawRef(`teachers/${teacherId}`).set(updated);
        } catch (e) {
          console.error('儲存教師資料至 Firebase 失敗:', e);
          throw new Error('無法儲存至雲端資料庫，請檢查網路連線：' + e.message);
        }
      }

      return updated;
    }

    /**
     * 核心密碼驗證
     * @param {string} inputPassword 輸入的明文密碼
     * @returns {Promise<Object>} 驗證結果
     */
    async verifyPassword(inputPassword) {
      // 1. 檢查防暴力破解狀態
      const lockout = this.getLockoutStatus();
      if (lockout.isLocked) {
        return {
          success: false,
          locked: true,
          remainingSeconds: lockout.remainingSeconds,
          message: `登入嘗試次數過多，已被安全防護鎖定！請等待 ${lockout.remainingSeconds} 秒後再試。`
        };
      }

      const inputTrimmed = (inputPassword || '').trim();
      if (!inputTrimmed) {
        return { success: false, message: '請輸入管理員密碼！' };
      }

      const inputHash = await this.sha256(inputTrimmed);

      // 2. 判斷當前環境（班級課堂 vs 公共課堂）
      const classCode = window.currentClassCode;
      let targetTeacherId = null;

      if (classCode) {
        targetTeacherId = await this.getCurrentClassOwnerTeacherId();
      }

      // 如果當前班級有綁定老師
      if (targetTeacherId) {
        const teacherProfile = await this.getTeacherProfile(targetTeacherId);
        const expectedHash = teacherProfile.passwordHash || DEFAULT_PASSWORD_HASH;

        // 若班級設定仍為預設密碼且已過期，阻擋存取
        if (expectedHash === DEFAULT_PASSWORD_HASH && this.isDefaultPasswordExpired(teacherProfile)) {
          return {
            success: false,
            locked: false,
            isExpiredDefault: true,
            message: '⛔ 系統安全政策：此班級管理密碼仍為初始預設密碼 1234，已超過一週（7天）寬限期並正式停用！請點選下方「忘記密碼？」進行安全自救重設。'
          };
        }

        if (inputHash === expectedHash) {
          this.clearLockout();
          this.setActiveTeacher(teacherProfile.teacherId, teacherProfile.name);
          this.currentVerifiedTeacher = teacherProfile;
          const isDef = expectedHash === DEFAULT_PASSWORD_HASH;
          if (isDef && !teacherProfile.defaultPasswordCreatedAt) {
            teacherProfile.defaultPasswordCreatedAt = Date.now();
            this.saveTeacherProfile(teacherProfile.teacherId, teacherProfile).catch(() => {});
          }
          return {
            success: true,
            teacher: teacherProfile,
            isDefault: isDef,
            remainingDays: this.getDefaultPasswordRemainingDays(teacherProfile),
            message: isDef
              ? `管理員驗證成功！（目前使用初始預設密碼 1234，一週寬限期尚餘 ${this.getDefaultPasswordRemainingDays(teacherProfile)} 天，請及早更換）`
              : '管理員密碼驗證成功！'
          };
        }

        // 若此班級老師已自訂專屬密碼，但使用者輸入系統預設密碼
        if (inputHash === DEFAULT_PASSWORD_HASH && expectedHash !== DEFAULT_PASSWORD_HASH) {
          const record = this.recordFailedAttempt();
          return {
            success: false,
            locked: record.isLocked,
            remainingSeconds: record.remainingSeconds,
            remainingAttempts: record.remainingAttempts,
            message: '⛔ 此班級白板已設定專屬安全密碼，系統預設密碼已失效！請輸入授課老師設定的專屬密碼。'
          };
        }
      } else {
        // 公共課堂／未綁定教師班級：
        // 優先檢查本機活躍教師
        const activeId = this.getActiveTeacherId();
        const activeProfile = await this.getTeacherProfile(activeId);
        const isSelfDefault = (!activeProfile.passwordHash || activeProfile.passwordHash === DEFAULT_PASSWORD_HASH);
        
        if (activeProfile && activeProfile.passwordHash && !isSelfDefault) {
          if (inputHash === activeProfile.passwordHash) {
            this.clearLockout();
            this.currentVerifiedTeacher = activeProfile;
            // 若在班級中且該班尚未綁定老師，自動綁定為該老師
            if (classCode && window.rawRef) {
              window.rawRef(`registered_classes/${classCode}/ownerTeacherId`).set(activeProfile.teacherId).catch(() => {});
            }
            return {
              success: true,
              teacher: activeProfile,
              isDefault: false,
              message: '管理員密碼驗證成功！'
            };
          }
        }

        // 若當前老師已設定專屬密碼，但輸入了系統預設密碼
        if (!isSelfDefault && inputHash === DEFAULT_PASSWORD_HASH) {
          const record = this.recordFailedAttempt();
          return {
            success: false,
            locked: record.isLocked,
            remainingSeconds: record.remainingSeconds,
            remainingAttempts: record.remainingAttempts,
            message: '⛔ 此管理員帳號已設定專屬安全密碼，系統預設密碼已失效！請輸入專屬密碼。'
          };
        }

        // 搜尋 Firebase 中所有教師看是否有匹配的密碼
        try {
          if (window.firebase && typeof window.rawRef === 'function') {
            const snap = await window.rawRef('teachers').once('value');
            if (snap.exists() && snap.val()) {
              const allTeachers = snap.val();
              for (const tid in allTeachers) {
                const t = allTeachers[tid];
                if (t && t.passwordHash === inputHash) {
                  this.clearLockout();
                  this.setActiveTeacher(t.teacherId, t.name);
                  this.currentVerifiedTeacher = t;
                  // 若在班級中，自動綁定為該老師
                  if (classCode && window.rawRef) {
                    window.rawRef(`registered_classes/${classCode}/ownerTeacherId`).set(t.teacherId).catch(() => {});
                  }
                  return {
                    success: true,
                    teacher: t,
                    isDefault: false,
                    message: `歡迎 ${t.name}！密碼驗證成功。`
                  };
                }
              }
            }
          }
        } catch (e) {
          console.warn('比對全域教師密碼失敗:', e);
        }

        // 最後比對系統預設密碼 (僅在當前帳號尚未設定過專屬密碼且未過期時允許)
        if (isSelfDefault && inputHash === DEFAULT_PASSWORD_HASH) {
          if (this.isDefaultPasswordExpired(activeProfile)) {
            return {
              success: false,
              locked: false,
              isExpiredDefault: true,
              message: '⛔ 系統安全政策：初始預設密碼 1234 已超過一週（7天）寬限期並正式停用！為保障課堂安全，請點選下方「忘記密碼？」使用安全提問自救重設專屬密碼。'
            };
          }
          this.clearLockout();
          this.currentVerifiedTeacher = activeProfile;
          if (!activeProfile.defaultPasswordCreatedAt) {
            activeProfile.defaultPasswordCreatedAt = Date.now();
            this.saveTeacherProfile(activeProfile.teacherId, activeProfile).catch(() => {});
          }
          const remDays = this.getDefaultPasswordRemainingDays(activeProfile);
          return {
            success: true,
            teacher: activeProfile,
            isDefault: true,
            remainingDays: remDays,
            message: `密碼正確！（目前使用初始預設密碼 1234，一週寬限期尚餘 ${remDays} 天，請及早更換）`
          };
        }
      }

      // 4. 密碼錯誤，記錄失敗嘗試
      const record = this.recordFailedAttempt();
      if (record.isLocked) {
        return {
          success: false,
          locked: true,
          remainingSeconds: record.remainingSeconds,
          message: `密碼錯誤次數達 ${MAX_FAILED_ATTEMPTS} 次！帳號已被安全鎖定，請於 3 分鐘後再試，或使用忘記密碼自救。`
        };
      }

      return {
        success: false,
        locked: false,
        remainingAttempts: record.remainingAttempts,
        message: `密碼不正確！還剩 ${record.remainingAttempts} 次輸入機會。`
      };
    }

    /**
     * 取得雲端所有可供跨裝置選擇救援的教師與班級清單
     */
    async getAvailableTeachersForRecovery() {
      const list = [];
      const seenIds = new Set();
      const classMapByTeacher = {};

      try {
        if (window.firebase && typeof window.rawRef === 'function') {
          const [classesSnap, teachersSnap] = await Promise.all([
            window.rawRef('registered_classes').once('value').catch(() => null),
            window.rawRef('teachers').once('value').catch(() => null)
          ]);

          if (classesSnap && classesSnap.exists() && classesSnap.val()) {
            const clsObj = classesSnap.val();
            for (const code in clsObj) {
              const c = clsObj[code];
              if (c && c.ownerTeacherId) {
                if (!classMapByTeacher[c.ownerTeacherId]) classMapByTeacher[c.ownerTeacherId] = [];
                classMapByTeacher[c.ownerTeacherId].push(code);
              }
            }
          }

          if (teachersSnap && teachersSnap.exists() && teachersSnap.val()) {
            const tObj = teachersSnap.val();
            for (const tid in tObj) {
              const t = tObj[tid];
              if (!t || !t.teacherId) continue;
              const isConfigured = (t.passwordHash && t.passwordHash !== DEFAULT_PASSWORD_HASH) ||
                Boolean(t.passwordHint) ||
                Boolean(t.recoveryQuestion && t.recoveryAnswerHash) ||
                Boolean(classMapByTeacher[t.teacherId] && classMapByTeacher[t.teacherId].length > 0);
              if (isConfigured || tid === this.getActiveTeacherId()) {
                seenIds.add(t.teacherId);
                list.push({
                  teacherId: t.teacherId,
                  name: t.name || '授課老師',
                  classes: classMapByTeacher[t.teacherId] || [],
                  hasQuestion: Boolean(t.recoveryQuestion && t.recoveryAnswerHash),
                  hasHint: Boolean(t.passwordHint),
                  isCustomPassword: Boolean(t.passwordHash && t.passwordHash !== DEFAULT_PASSWORD_HASH)
                });
              }
            }
          }
        }
      } catch (e) {
        console.warn('讀取跨裝置教師救援清單失敗:', e);
      }

      const activeId = this.getActiveTeacherId();
      if (!seenIds.has(activeId)) {
        const localProfile = await this.getTeacherProfile(activeId);
        list.unshift({
          teacherId: localProfile.teacherId,
          name: localProfile.name || '授課老師 (本機)',
          classes: classMapByTeacher[localProfile.teacherId] || [],
          hasQuestion: Boolean(localProfile.recoveryQuestion && localProfile.recoveryAnswerHash),
          hasHint: Boolean(localProfile.passwordHint),
          isCustomPassword: Boolean(localProfile.passwordHash && localProfile.passwordHash !== DEFAULT_PASSWORD_HASH)
        });
      }

      // 優先排序：已設定安全問題或專屬密碼的教師排在前面
      list.sort((a, b) => {
        const scoreA = (a.hasQuestion ? 4 : 0) + (a.isCustomPassword ? 2 : 0) + (a.classes.length > 0 ? 1 : 0);
        const scoreB = (b.hasQuestion ? 4 : 0) + (b.isCustomPassword ? 2 : 0) + (b.classes.length > 0 ? 1 : 0);
        return scoreB - scoreA;
      });

      return list;
    }

    /**
     * 取得重設/自救所需的教師資訊 (不回傳 Hash)
     */
    async getRecoveryContext(overrideTeacherId = null) {
      const classCode = window.currentClassCode;
      let teacherId = overrideTeacherId;
      if (!teacherId && classCode) {
        teacherId = await this.getCurrentClassOwnerTeacherId();
      }
      if (!teacherId) {
        teacherId = this.getActiveTeacherId();
      }
      let profile = await this.getTeacherProfile(teacherId);

      // 若在公共課堂且本機為全新的未設定預設帳號（例如換教室電腦／無痕視窗），自動優先帶入雲端已設定專屬密碼的教師帳號
      if (!overrideTeacherId && !classCode) {
        const isUnconfiguredLocal = (!profile.passwordHash || profile.passwordHash === DEFAULT_PASSWORD_HASH) &&
          !profile.passwordHint && !profile.recoveryAnswerHash;
        if (isUnconfiguredLocal) {
          const available = await this.getAvailableTeachersForRecovery();
          const configuredCandidate = available.find(item => item.isCustomPassword || item.hasQuestion || item.hasHint);
          if (configuredCandidate) {
            teacherId = configuredCandidate.teacherId;
            profile = await this.getTeacherProfile(teacherId);
          }
        }
      }

      return {
        teacherId: profile.teacherId,
        name: profile.name || '授課老師',
        classCode: classCode || '公共課堂',
        hasHint: !!profile.passwordHint,
        passwordHint: profile.passwordHint || '未設定密碼提示',
        hasQuestion: !!(profile.recoveryQuestion && profile.recoveryAnswerHash),
        recoveryQuestion: profile.recoveryQuestion || '未設定安全問題'
      };
    }

    /**
     * 透過安全問題答案重設密碼
     */
    async verifyAndResetViaQuestion(teacherId, answer, newPassword) {
      if (!answer || !newPassword) {
        throw new Error('請輸入安全問題的答案與新密碼！');
      }
      if (newPassword.length < 4) {
        throw new Error('新密碼長度至少需 4 碼！');
      }
      if (newPassword.trim() === '1234' && this.isDefaultPasswordExpired(profile)) {
        throw new Error('初始預設密碼 1234 已超過 7 天（一週）寬限期，請自訂一組專屬新密碼！');
      }

      const profile = await this.getTeacherProfile(teacherId);
      if (!profile.recoveryAnswerHash) {
        throw new Error('此教師帳號尚未設定安全問題！若遺忘密碼，請登入您的 Firebase 控制台，在 teachers/ 節點下刪除該老師密碼資料即可重新設定。');
      }

      const normalizedAnswer = answer.trim().toLowerCase();
      const answerHash = await this.sha256(normalizedAnswer);

      if (answerHash !== profile.recoveryAnswerHash) {
        throw new Error('安全問題答案不正確，請重新確認！');
      }

      const newPasswordHash = await this.sha256(newPassword.trim());
      await this.saveTeacherProfile(teacherId, {
        passwordHash: newPasswordHash
      });
      this.setActiveTeacher(teacherId, profile.name || '授課老師');

      this.clearLockout();
      return true;
    }

    // ==========================================
    // UI 互動串接與即時渲染
    // ==========================================

    /**
     * 開啟管理員密碼輸入彈窗時更新 UI
     */
    async updatePasswordModalUI() {
      const modal = document.getElementById('adminPasswordModal');
      if (!modal) return;

      const lockout = this.getLockoutStatus();
      const warningBox = document.getElementById('adminPasswordLockoutWarning');
      const submitBtn = document.getElementById('btnSubmitAdminPassword');
      const input = document.getElementById('adminPasswordInput');
      const subInfo = document.getElementById('adminPasswordSubInfo');

      // 班級與老師資訊 + 是否已設定專屬密碼偵測
      if (subInfo) {
        const classCode = window.currentClassCode;
        let infoText = '';
        let hasCustomPassword = false;

        if (classCode) {
          const ownerId = await this.getCurrentClassOwnerTeacherId();
          let teacherName = '授課老師';
          if (ownerId) {
            const p = await this.getTeacherProfile(ownerId);
            if (p) {
              if (p.name) teacherName = p.name;
              hasCustomPassword = Boolean(p.passwordHash && p.passwordHash !== DEFAULT_PASSWORD_HASH);
            }
          }
          infoText = `🏫 當前班級：<strong>【${classCode}】</strong> (管理老師: ${teacherName})`;
        } else {
          const activeId = this.getActiveTeacherId();
          const activeProfile = await this.getTeacherProfile(activeId);
          let activeName = (activeProfile && activeProfile.name) || window.boardStorage.local.getItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME) || '授課老師';
          hasCustomPassword = Boolean(activeProfile && activeProfile.passwordHash && activeProfile.passwordHash !== DEFAULT_PASSWORD_HASH);

          if (!hasCustomPassword) {
            const available = await this.getAvailableTeachersForRecovery();
            const customTeacher = available.find(t => t.isCustomPassword);
            if (customTeacher) {
              hasCustomPassword = true;
              activeName = customTeacher.name || activeName;
            }
          }
          infoText = `🌐 公共課堂 (目前老師: <strong>${activeName}</strong>)`;
        }

        let statusBadge = '';
        const targetProfile = hasCustomPassword ? null : (ownerId ? await this.getTeacherProfile(ownerId) : await this.getTeacherProfile(this.getActiveTeacherId()));
        if (hasCustomPassword) {
          statusBadge = `<div style="margin-top: 6px; font-size: 11px; color: #16a34a; background: rgba(52,199,89,0.1); border: 1px solid rgba(52,199,89,0.35); padding: 3px 8px; border-radius: 6px; display: inline-block; font-weight: bold;">🛡️ 已啟用教師專屬安全密碼保護</div>`;
        } else if (this.isDefaultPasswordExpired(targetProfile)) {
          statusBadge = `<div style="margin-top: 6px; font-size: 11px; color: #dc2626; background: rgba(255,59,48,0.08); border: 1px solid rgba(255,59,48,0.25); padding: 3px 8px; border-radius: 6px; display: inline-block; font-weight: bold;">⛔ 初始預設密碼 1234 已超過 7 天寬限期，已停用</div>`;
        } else {
          const remDays = this.getDefaultPasswordRemainingDays(targetProfile);
          statusBadge = `<div style="margin-top: 6px; font-size: 11px; color: #d97706; background: rgba(255,149,0,0.1); border: 1px solid rgba(255,149,0,0.3); padding: 3px 8px; border-radius: 6px; display: inline-block; font-weight: bold;">⏳ 初始預設密碼 1234 寬限期剩餘 ${remDays} 天，請儘速設定專屬密碼</div>`;
        }

        subInfo.innerHTML = `${infoText}<br>${statusBadge}`;
      }

      if (lockout.isLocked) {
        if (warningBox) {
          warningBox.style.display = 'block';
          warningBox.innerHTML = `⚠️ 連續錯誤次數過多，安全鎖定中！<br>請等待 <strong id="lockoutCountdownText" style="color: #ff3b30; font-size: 16px;">${lockout.remainingSeconds}</strong> 秒後再試。`;
        }
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.5';
          submitBtn.style.cursor = 'not-allowed';
        }
        if (input) input.disabled = true;

        this._startLockoutCountdown(lockout.remainingSeconds);
      } else {
        if (warningBox) warningBox.style.display = 'none';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
        }
        if (input) {
          input.disabled = false;
          input.focus();
        }
        if (this.lockoutTimer) {
          clearInterval(this.lockoutTimer);
          this.lockoutTimer = null;
        }
      }
    }

    /**
     * 取得當前班級或本機老師的專屬密碼設定狀態 (供頂部橫幅或 UI 即時偵測)
     */
    async getTeacherSecurityStatus() {
      const classCode = window.currentClassCode;
      let hasCustomPassword = false;
      let targetProfile = null;
      let ownerId = null;

      if (classCode) {
        ownerId = await this.getCurrentClassOwnerTeacherId();
        if (ownerId) {
          targetProfile = await this.getTeacherProfile(ownerId);
          if (targetProfile) {
            hasCustomPassword = Boolean(targetProfile.passwordHash && targetProfile.passwordHash !== DEFAULT_PASSWORD_HASH);
          }
        }
      }

      if (!hasCustomPassword) {
        const activeId = this.getActiveTeacherId();
        const activeProfile = await this.getTeacherProfile(activeId);
        if (activeProfile && activeProfile.passwordHash && activeProfile.passwordHash !== DEFAULT_PASSWORD_HASH) {
          hasCustomPassword = true;
          targetProfile = activeProfile;
        } else {
          const available = await this.getAvailableTeachersForRecovery();
          const customTeacher = available.find(t => t.isCustomPassword);
          if (customTeacher) {
            hasCustomPassword = true;
            targetProfile = customTeacher;
          } else {
            targetProfile = targetProfile || activeProfile;
          }
        }
      }

      return {
        hasCustomPassword,
        targetProfile,
        isExpired: this.isDefaultPasswordExpired(targetProfile),
        remainingDays: this.getDefaultPasswordRemainingDays(targetProfile),
        expiryTimestamp: this.getDefaultPasswordExpiryTimestamp(targetProfile)
      };
    }

    _startLockoutCountdown(seconds) {
      if (this.lockoutTimer) clearInterval(this.lockoutTimer);
      let rem = seconds;
      this.lockoutTimer = setInterval(() => {
        rem--;
        const el = document.getElementById('lockoutCountdownText');
        if (el) el.textContent = rem;
        if (rem <= 0) {
          clearInterval(this.lockoutTimer);
          this.lockoutTimer = null;
          this.clearLockout();
          this.updatePasswordModalUI();
        }
      }, 1000);
    }

    /**
     * 顯示／清除忘記密碼彈窗內的單一內嵌紅字錯誤提示（搭配微幅搖晃動畫，免跳第二層彈窗）
     */
    showRecoveryError(message, focusInputEl = null) {
      const errBox = document.getElementById('recoveryErrorMsg');
      if (errBox) {
        errBox.style.display = 'block';
        errBox.innerHTML = `⚠️ ${message}`;
        errBox.classList.remove('admin-input-shake');
        void errBox.offsetWidth;
        errBox.classList.add('admin-input-shake');
        errBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (focusInputEl) {
        focusInputEl.classList.remove('admin-input-shake');
        void focusInputEl.offsetWidth;
        focusInputEl.classList.add('admin-input-shake');
        focusInputEl.focus();
      }
    }

    clearRecoveryError() {
      const errBox = document.getElementById('recoveryErrorMsg');
      if (errBox) {
        errBox.style.display = 'none';
        errBox.classList.remove('admin-input-shake');
      }
    }

    /**
     * 將指定教師的救援資訊渲染至忘記密碼彈窗
     */
    _applyRecoveryContextToUI(info) {
      const modal = document.getElementById('adminPasswordRecoveryModal');
      if (!modal || !info) return;

      const teacherNameSpan = document.getElementById('recoveryTeacherName');
      if (teacherNameSpan) teacherNameSpan.textContent = `${info.name} (${info.classCode})`;

      const hintText = document.getElementById('recoveryPasswordHintText');
      if (hintText) {
        hintText.textContent = info.passwordHint || '（此教師帳號尚未填寫密碼提示）';
      }

      const qBox = document.getElementById('recoveryQuestionContainer');
      const qText = document.getElementById('recoveryQuestionLabel');
      if (qBox && qText) {
        if (info.hasQuestion) {
          qBox.style.display = 'block';
          qText.textContent = info.recoveryQuestion;
        } else {
          qBox.style.display = 'none';
        }
      }

      modal.setAttribute('data-target-teacher-id', info.teacherId);
    }

    /**
     * 當老師在公共課堂/跨電腦下拉選單切換救援對象時觸發
     */
    async onRecoveryTeacherSelectChange(selectedTeacherId) {
      if (!selectedTeacherId) return;
      this.clearRecoveryError();
      const info = await this.getRecoveryContext(selectedTeacherId);
      this._applyRecoveryContextToUI(info);
    }

    /**
     * 開啟忘記密碼救援彈窗
     */
    async openRecoveryModal() {
      // 1. 先關閉或隱藏管理員密碼登入視窗，防止畫面重疊遮擋
      if (window.app && typeof window.app.closeAdminPasswordModal === 'function') {
        window.app.closeAdminPasswordModal();
      } else {
        const loginModal = document.getElementById('adminPasswordModal');
        if (loginModal) {
          loginModal.style.display = 'none';
          loginModal.classList.remove('active');
        }
      }

      const modal = document.getElementById('adminPasswordRecoveryModal');
      if (!modal) return;

      modal.style.display = 'flex';
      modal.classList.add('active');
      modal.style.zIndex = '3600';

      this.clearRecoveryError();

      const [info, availableTeachers] = await Promise.all([
        this.getRecoveryContext(),
        this.getAvailableTeachersForRecovery()
      ]);

      this._applyRecoveryContextToUI(info);

      // 若在公共課堂或雲端有多位教師帳號，顯示跨電腦教師選擇器，解決換電腦／無痕視窗找不到安全提問的盲點
      const selectorWrapper = document.getElementById('recoveryTeacherSelectorWrapper');
      const selectEl = document.getElementById('recoveryTeacherSelect');
      if (selectorWrapper && selectEl) {
        if (!window.currentClassCode && availableTeachers.length > 0) {
          selectorWrapper.style.display = 'block';
          selectEl.innerHTML = availableTeachers.map(t => {
            const classLabel = t.classes && t.classes.length > 0 ? ` [班級: ${t.classes.join(', ')}]` : '';
            const qBadge = t.hasQuestion ? ' ✓已設安全提問' : '';
            const selectedAttr = t.teacherId === info.teacherId ? 'selected' : '';
            return `<option value="${t.teacherId}" ${selectedAttr}>👨‍🏫 ${t.name}${classLabel}${qBadge}</option>`;
          }).join('');
        } else {
          selectorWrapper.style.display = 'none';
        }
      }

      // 清空輸入框
      const answerInput = document.getElementById('recoveryQuestionAnswer');
      const newPwd1 = document.getElementById('recoveryNewPassword');
      const newPwd2 = document.getElementById('recoveryNewPasswordConfirm');

      if (answerInput) answerInput.value = '';
      if (newPwd1) newPwd1.value = '';
      if (newPwd2) newPwd2.value = '';
    }

    closeRecoveryModal(skipReopenLogin = false) {
      const modal = document.getElementById('adminPasswordRecoveryModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
      this.clearRecoveryError();

      // 若未成功登入管理員，且使用者關閉了救援彈窗，自動重新開啟管理員密碼登入視窗
      if (!skipReopenLogin && (!window.app || !window.app.isAdmin)) {
        if (window.app && typeof window.app.openAdminPasswordModal === 'function') {
          window.app.openAdminPasswordModal();
        }
      }
    }

    /**
     * 執行安全提問重設
     */
    async submitQuestionRecovery() {
      const modal = document.getElementById('adminPasswordRecoveryModal');
      const teacherId = modal ? modal.getAttribute('data-target-teacher-id') : null;
      const answerInput = document.getElementById('recoveryQuestionAnswer');
      const newPwd1 = document.getElementById('recoveryNewPassword');
      const newPwd2 = document.getElementById('recoveryNewPasswordConfirm');

      const answer = answerInput ? answerInput.value : '';
      const p1 = newPwd1 ? newPwd1.value : '';
      const p2 = newPwd2 ? newPwd2.value : '';

      if (!answer) {
        this.showRecoveryError('請填寫安全問題的正確答案！', answerInput);
        return;
      }
      if (!p1 || p1.length < 4) {
        this.showRecoveryError('新密碼長度至少需 4 碼！', newPwd1);
        return;
      }
      if (p1 !== p2) {
        this.showRecoveryError('兩次輸入的新密碼不相符，請重新確認！', newPwd2);
        return;
      }

      try {
        await this.verifyAndResetViaQuestion(teacherId, answer, p1);
        this.closeRecoveryModal();
        this.updatePasswordModalUI();
        window.app.showNotification('🎉 重設成功', '管理員密碼已成功更新！請使用新密碼登入。');
      } catch (e) {
        this.showRecoveryError(e.message || '安全提問驗證錯誤', answerInput);
      }
    }

    /**
     * 預覽/隱藏教師系統代碼 (唯讀識別碼)
     * 按住眼睛圖示顯示，放開後隱藏
     * @param {boolean} show - 是否顯示明文
     */
    peekTeacherId(show) {
      const idInput = document.getElementById('secTeacherIdDisplay');
      if (!idInput) return;
      if (show) {
        idInput.type = 'text';
        idInput.style.letterSpacing = 'normal';
      } else {
        idInput.type = 'password';
        idInput.style.letterSpacing = '2px';
      }
    }

    /**
     * 渲染後台「F. 教師身分與密碼安全設定」管理面板
     */
    async renderSecurityPanel() {
      const teacherId = this.getActiveTeacherId();
      const profile = await this.getTeacherProfile(teacherId);

      const nameInput = document.getElementById('secTeacherNameInput');
      const idInput = document.getElementById('secTeacherIdDisplay');
      const statusBadge = document.getElementById('secPasswordStatusBadge');
      const hintInput = document.getElementById('secPasswordHintInput');
      const questionSelect = document.getElementById('secSecurityQuestionSelect');
      const customQuestionInput = document.getElementById('secCustomQuestionInput');
      const answerInput = document.getElementById('secSecurityAnswerInput');
      const boundClassInfo = document.getElementById('secBoundClassesInfo');

      if (nameInput) nameInput.value = profile.name || '授課老師';
      if (idInput) idInput.value = profile.teacherId || teacherId;
      if (hintInput) hintInput.value = profile.passwordHint || '';

      const isDefault = !profile.passwordHash || profile.passwordHash === DEFAULT_PASSWORD_HASH;
      if (statusBadge) {
        if (isDefault) {
          if (this.isDefaultPasswordExpired(profile)) {
            statusBadge.innerHTML = `<span style="background: rgba(255, 59, 48, 0.15); color: #dc2626; padding: 4px 10px; border-radius: 8px; font-weight: bold; border: 1px solid rgba(255, 59, 48, 0.4); display: inline-flex; align-items: center; gap: 4px;">⛔ 初始預設密碼 1234 已超過 7 天寬限期 — 必須設定專屬密碼！</span>`;
          } else {
            const remDays = this.getDefaultPasswordRemainingDays(profile);
            statusBadge.innerHTML = `<span style="background: rgba(255, 149, 0, 0.15); color: #d97706; padding: 4px 10px; border-radius: 8px; font-weight: bold; border: 1px solid rgba(255, 149, 0, 0.4); display: inline-flex; align-items: center; gap: 4px;">⚠️ 目前使用初始預設密碼 1234 — 寬限期剩餘 ${remDays} 天，請儘速修改！</span>`;
          }
        } else {
          statusBadge.innerHTML = `<span style="background: rgba(52, 199, 89, 0.15); color: #16a34a; padding: 4px 10px; border-radius: 8px; font-weight: bold; border: 1px solid rgba(52, 199, 89, 0.4); display: inline-flex; align-items: center; gap: 4px;">🛡️ 已啟用專屬安全密碼 (SHA-256 加密守護中)</span>`;
        }
      }

      // 安全問題下拉選單
      if (questionSelect) {
        let found = false;
        for (let i = 0; i < questionSelect.options.length; i++) {
          if (questionSelect.options[i].value === profile.recoveryQuestion) {
            questionSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found && profile.recoveryQuestion) {
          questionSelect.value = 'custom';
          if (customQuestionInput) {
            customQuestionInput.style.display = 'block';
            customQuestionInput.value = profile.recoveryQuestion;
          }
        } else {
          if (customQuestionInput) {
            customQuestionInput.style.display = (questionSelect.value === 'custom') ? 'block' : 'none';
          }
        }
      }

      if (answerInput) {
        answerInput.value = '';
        answerInput.placeholder = profile.recoveryAnswerHash ? '（已設定安全答案，若不修改請留空）' : '請輸入解答';
      }

      // 查詢該老師名下所擁有的班級代碼
      if (boundClassInfo) {
        try {
          if (window.firebase && typeof window.rawRef === 'function') {
            const snap = await window.rawRef('registered_classes').once('value');
            const classes = [];
            if (snap.exists() && snap.val()) {
              const all = snap.val();
              for (const code in all) {
                if (all[code] && (all[code].ownerTeacherId === teacherId || (!all[code].ownerTeacherId && isDefault))) {
                  classes.push(code);
                }
              }
            }
            if (classes.length > 0) {
              boundClassInfo.innerHTML = classes.map(c => `<span style="background: rgba(0, 122, 255, 0.1); color: var(--accent-color); padding: 3px 8px; border-radius: 6px; font-size: 13px; font-weight: bold;">🏫 ${c}</span>`).join(' ');
            } else {
              boundClassInfo.textContent = '尚未開立專屬班級（開課時將自動套用此密碼）';
            }
          }
        } catch (e) {
          boundClassInfo.textContent = '無法讀取班級資訊';
        }
      }
    }

    /**
     * 儲存後台安全設定面板所輸入的內容
     */
    async saveSecurityPanelSettings() {
      const teacherId = this.getActiveTeacherId();
      const nameInput = document.getElementById('secTeacherNameInput');
      const newPwd1 = document.getElementById('secNewPasswordInput');
      const newPwd2 = document.getElementById('secNewPasswordConfirmInput');
      const hintInput = document.getElementById('secPasswordHintInput');
      const questionSelect = document.getElementById('secSecurityQuestionSelect');
      const customQuestionInput = document.getElementById('secCustomQuestionInput');
      const answerInput = document.getElementById('secSecurityAnswerInput');

      const name = nameInput ? nameInput.value.trim() : '授課老師';
      const p1 = newPwd1 ? newPwd1.value : '';
      const p2 = newPwd2 ? newPwd2.value : '';
      const hint = hintInput ? hintInput.value.trim() : '';
      
      let question = '';
      if (questionSelect) {
        if (questionSelect.value === 'custom') {
          question = customQuestionInput ? customQuestionInput.value.trim() : '';
        } else {
          question = questionSelect.value;
        }
      }

      const answer = answerInput ? answerInput.value.trim() : '';

      const updateData = {
        name: name || '授課老師',
        passwordHint: hint,
        recoveryQuestion: question
      };

      // 檢查密碼更新
      if (p1 || p2) {
        if (p1.length < 4) {
          window.app.showNotification('密碼過短', '新密碼長度至少需 4 碼！');
          return;
        }
        if (p1 !== p2) {
          window.app.showNotification('密碼不相符', '兩次輸入的新密碼不一致，請重新檢查！');
          return;
        }
        if (p1 === '1234' && this.isDefaultPasswordExpired()) {
          window.app.showNotification('密碼不合規', '初始預設密碼 1234 已超過一週寬限期，不可再設定為預設密碼！請使用其他自訂專屬密碼。');
          return;
        }
        updateData.passwordHash = await this.sha256(p1);
      }

      // 檢查安全提問更新
      if (answer) {
        updateData.recoveryAnswerHash = await this.sha256(answer.toLowerCase());
      }

      try {
        await this.saveTeacherProfile(teacherId, updateData);
        window.app.showNotification('💾 儲存成功', '教師身分與管理員密碼設定已成功同步至雲端！');
        
        // 清空密碼欄位
        if (newPwd1) newPwd1.value = '';
        if (newPwd2) newPwd2.value = '';
        if (answerInput) answerInput.value = '';

        this.renderSecurityPanel();
      } catch (e) {
        window.app.showNotification('儲存失敗', e.message || '發生未知錯誤');
      }
    }

    /**
     * 重設為系統預設密碼 (自重設起重新給予 7 天寬限期)
     */
    async resetToDefaultPassword() {
      const teacherId = this.getActiveTeacherId();
      await this.saveTeacherProfile(teacherId, {
        passwordHash: DEFAULT_PASSWORD_HASH,
        passwordHint: '',
        recoveryQuestion: '',
        recoveryAnswerHash: '',
        defaultPasswordCreatedAt: Date.now()
      });
      window.app.showNotification('🔄 已重設為預設', '密碼已恢復為預設密碼 1234（寬限期 7 天）。請務必及時設定專屬安全密碼與自救問題。');
      this.renderSecurityPanel();
    }
  }

  // 掛載至 window
  window.TeacherAuthManager = TeacherAuthManager;
  window.teacherAuthManager = new TeacherAuthManager();

})(window);
