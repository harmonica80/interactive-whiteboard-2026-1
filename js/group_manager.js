/**
 * 學生分組管理系統 (GroupManager)
 * 支援功能：
 * 1. 自動分組 (依每組人數 / 依總組數；範圍可限定全班或僅目前線上學生)
 * 2. 未到課學生處理：可選保留於組內或暫移至未分配清單
 * 3. 雙軌分配：支援拖曳換組 (Drag & Drop) + 點擊選單換組 (Click-to-Assign)
 * 4. 歷史分組快照存取、歷程載入、線上名單差異比對與一鍵補位/剔除
 * 5. 小組獨立積分池 (groupPoints) 與日誌 (groupPointsLog)
 * 6. 小組積分轉移至個人：支援「全額均分」與「全員同額獎勵」
 */

(function () {
  'use strict';

  class GroupManager {
    constructor() {
      this.app = null;
      this.activeGroupSet = null; // 當前班級活躍組別資料
      this.historyGroupSets = []; // 歷史分組快照清單
      this.groupListenerRef = null;
      this.isInitialized = false;
      this.draggedStudentUid = null;
      this.draggedFromGroupId = null;
      this.currentPointsGroupIds = [];
      this.batchSelectedGroupIds = new Set();

      // 預設鮮明且高對比的主題配色庫 (連動四大主題且高辨識度)
      this.PRESET_COLORS = [
        '#3B82F6', // 湛藍
        '#10B981', // 翡翠綠
        '#F59E0B', // 琥珀金
        '#8B5CF6', // 紫羅蘭
        '#EC4899', // 玫瑰粉
        '#06B6D4', // 青綠
        '#F97316', // 活力橘
        '#6366F1', // 靛藍
        '#14B8A6', // 湖水綠
        '#E11D48', // 緋紅
        '#84CC16', // 萊姆綠
        '#A855F7'  // 魅紫
      ];
    }

    init(appInstance) {
      this.app = appInstance || window.app;
      this.isInitialized = true;
      this.bindGlobalEvents();
    }

    bindGlobalEvents() {
      // 點擊全域關閉學生換組快顯選單
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.student-assign-menu') && !e.target.closest('.btn-quick-assign')) {
          this.closeAllAssignMenus();
        }
      });
    }

    closeAllAssignMenus() {
      document.querySelectorAll('.student-assign-menu').forEach((el) => el.remove());
    }

    // 通用彈窗開啟 (支援全螢幕掛載與 active class)
    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) {
        console.warn(`[GroupManager] Modal ${modalId} not found`);
        return;
      }
      const fsEl = document.fullscreenElement;
      if (fsEl && fsEl !== document.documentElement) {
        if (!fsEl.contains(modal)) fsEl.appendChild(modal);
      } else if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
      }
      modal.classList.add('active');
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
    }

    // 通用彈窗關閉
    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.opacity = '';
      modal.style.visibility = '';
    }

    // 取得當前班級代碼
    getActiveClassCode() {
      if (window.ClassRoomManager && typeof window.ClassRoomManager.getActiveClassCode === 'function') {
        return window.ClassRoomManager.getActiveClassCode();
      }
      return window.currentClassCode || '';
    }

    // 取得 Firebase db 參考
    getDb() {
      return window.db;
    }

    // 啟動監聽當前活躍組別 (按需監聽)
    listenActiveGroups() {
      const classCode = this.getActiveClassCode();
      const db = this.getDb();
      if (!db) return;

      this.unlistenActiveGroups();

      const path = classCode ? `classes/${classCode}/activeGroups` : 'groups/activeGroups';
      this.groupListenerRef = db.ref(path);
      this.groupListenerRef.on('value', (snapshot) => {
        const val = snapshot.val();
        this.activeGroupSet = val || null;

        // 若雲端尚無分組資料，但目前有名冊同學，自動初始化 activeGroupSet
        if (!this.activeGroupSet) {
          const allUids = Object.keys(this.getAllStudentsMap());
          this.activeGroupSet = {
            id: `set_${Date.now()}`,
            name: '未分組',
            updatedAt: Date.now(),
            groups: {},
            unassignedUids: allUids
          };
        } else {
          // 確保未分配清單補齊名冊中新增的學生
          const allUids = Object.keys(this.getAllStudentsMap());
          const assignedSet = new Set();
          Object.values(this.activeGroupSet.groups || {}).forEach((g) => {
            (g.memberUids || []).forEach((u) => assignedSet.add(u));
          });
          const unassignedSet = new Set(this.activeGroupSet.unassignedUids || []);
          allUids.forEach((uid) => {
            if (!assignedSet.has(uid)) {
              unassignedSet.add(uid);
            }
          });
          this.activeGroupSet.unassignedUids = Array.from(unassignedSet);
        }

        this.renderAdminPanel();
        if (this.app && typeof this.app.updateFloatingStudentGroupBadge === 'function') {
          this.app.updateFloatingStudentGroupBadge();
        }
        if (this.app) {
          if (this.app.buzzGame && this.app.buzzGame.results && typeof this.app.renderBuzzGameLeaderboard === 'function') {
            this.app.renderBuzzGameLeaderboard('adminBuzzGameRankList', this.app.buzzGame.results);
            this.app.renderBuzzGameLeaderboard('studentBuzzGameRankList', this.app.buzzGame.results);
          }
          if (this.app.focusGame && this.app.focusGame.results && typeof this.app.handleFocusGameSync === 'function') {
            this.app.handleFocusGameSync(this.app.focusGame);
          }
        }
      });
    }

    // 確保分組資料已從雲端載入（防止尚未開啟分組頁籤即在搶答/測驗執行小組加分）
    async ensureActiveGroupsLoaded() {
      if (!this.groupListenerRef) {
        this.listenActiveGroups();
      }
      if (!this.activeGroupSet || !this.activeGroupSet.groups || Object.keys(this.activeGroupSet.groups).length === 0) {
        try {
          const snap = await db.ref(this.getDbPath('active')).once('value');
          const val = snap.val();
          if (val) {
            this.activeGroupSet = val;
          }
        } catch (e) {}
      }
      return this.activeGroupSet;
    }

    // 卸載監聽器 (遵守規範)
    unlistenActiveGroups() {
      if (this.groupListenerRef) {
        this.groupListenerRef.off();
        this.groupListenerRef = null;
      }
    }

    // 取得目前班級所有學生資料物件
    getAllStudentsMap() {
      if (this.app && this.app.registeredStudents) {
        return this.app.registeredStudents;
      }
      return {};
    }

    // 取得線上學生 UID 集合
    getOnlineStudentUidsSet() {
      const onlineSet = new Set();
      const presenceData = (this.app && this.app.onlinePresence) || {};
      Object.values(presenceData).forEach((p) => {
        if (p && p.userId) onlineSet.add(p.userId);
      });
      return onlineSet;
    }

    // 判斷學生是否在線
    isStudentOnline(uid) {
      return this.getOnlineStudentUidsSet().has(uid);
    }

    // 取得指定學生的當前小組物件
    getStudentGroup(studentUid) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups) return null;
      for (const group of Object.values(this.activeGroupSet.groups)) {
        if (group && Array.isArray(group.memberUids) && group.memberUids.includes(studentUid)) {
          return group;
        }
      }
      return null;
    }

    // 取得目前小組統計摘要
    getActiveStats() {
      if (!this.activeGroupSet || !this.activeGroupSet.groups) {
        return { groupCount: 0, assignedCount: 0, unassignedCount: 0, totalPoints: 0 };
      }
      const groups = Object.values(this.activeGroupSet.groups);
      let assignedCount = 0;
      let totalPoints = 0;
      groups.forEach((g) => {
        assignedCount += (g.memberUids || []).length;
        totalPoints += parseInt(g.points, 10) || 0;
      });
      const unassignedCount = (this.activeGroupSet.unassignedUids || []).length;
      return {
        groupCount: groups.length,
        assignedCount,
        unassignedCount,
        totalPoints
      };
    }

    // ==========================================
    // 核心功能 1：自動分組演算法
    // ==========================================
    async createAutoGroups(options = {}) {
      const mode = options.mode || 'bySize';
      const value = Math.max(1, parseInt(options.value, 10) || 4);
      const scope = options.scope || 'all';
      const unassignedHandling = options.unassignedHandling || 'keep';
      const setName = options.setName || `分組活動 (${new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })})`;

      const studentsMap = this.getAllStudentsMap();
      const onlineSet = this.getOnlineStudentUidsSet();
      const allUids = Object.keys(studentsMap);

      if (allUids.length === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 目前名冊尚無任何學生，無法進行分組。');
        } else {
          alert('目前名冊尚無任何學生，無法進行分組。');
        }
        return false;
      }

      // 決定參與分組的名單
      let targetUids = [];
      let excludedUids = [];

      if (scope === 'online') {
        allUids.forEach((uid) => {
          if (onlineSet.has(uid)) {
            targetUids.push(uid);
          } else {
            excludedUids.push(uid);
          }
        });

        if (targetUids.length === 0) {
          if (this.app && this.app.showNotification) {
            this.app.showNotification('⚠️ 目前無任何線上學生，請確認同學已連線登入。');
          } else {
            alert('目前無任何線上學生，請確認同學已連線登入。');
          }
          return false;
        }
      } else {
        // 全班參與
        if (unassignedHandling === 'unassign') {
          allUids.forEach((uid) => {
            if (onlineSet.has(uid)) {
              targetUids.push(uid);
            } else {
              excludedUids.push(uid);
            }
          });
        } else {
          targetUids = [...allUids];
        }
      }

      // Fisher-Yates 隨機打散演算法
      for (let i = targetUids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targetUids[i], targetUids[j]] = [targetUids[j], targetUids[i]];
      }

      // 計算總組數
      let groupCount = 1;
      if (mode === 'bySize') {
        const perGroup = value;
        groupCount = Math.max(1, Math.ceil(targetUids.length / perGroup));
      } else {
        groupCount = Math.min(value, targetUids.length || 1);
      }

      // 均分學生至各小組
      const groups = {};
      for (let g = 0; g < groupCount; g++) {
        const gId = `grp_${Date.now()}_${g + 1}`;
        const color = this.PRESET_COLORS[g % this.PRESET_COLORS.length];
        groups[gId] = {
          id: gId,
          name: `第 ${g + 1} 組`,
          color: color,
          captainUid: null,
          memberUids: [],
          points: 0,
          pointsLog: {}
        };
      }

      const groupKeys = Object.keys(groups);
      targetUids.forEach((uid, idx) => {
        const targetGKey = groupKeys[idx % groupCount];
        groups[targetGKey].memberUids.push(uid);
        if (!groups[targetGKey].captainUid) {
          groups[targetGKey].captainUid = uid;
        }
      });

      const newGroupSet = {
        id: `set_${Date.now()}`,
        name: setName,
        updatedAt: Date.now(),
        groups: groups,
        unassignedUids: excludedUids
      };

      await this.saveActiveGroupSet(newGroupSet);
      if (this.app && this.app.showNotification) {
        this.app.showNotification(`🎉 已成功自動分為 ${groupCount} 組 (共 ${targetUids.length} 位同學入組)`);
      }
      return true;
    }

    // 將未分配學生自動補位至現有組別
    async autoFillUnassigned() {
      if (!this.activeGroupSet) return;
      const unassigned = [...(this.activeGroupSet.unassignedUids || [])];
      if (unassigned.length === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('💡 目前未分配名單為空，無須補位。');
        }
        return;
      }

      const groupKeys = Object.keys(this.activeGroupSet.groups || {});
      if (groupKeys.length === 0) {
        // 若完全沒有組別，直接建立 2 組自動分配
        await this.createAutoGroups({ mode: 'byCount', value: 2, scope: 'all' });
        return;
      }

      // 依序分發至成員最少的小組
      unassigned.forEach((uid) => {
        // 找出目前成員數最少的組別
        let minGroup = null;
        let minCount = Infinity;
        groupKeys.forEach((gid) => {
          const g = this.activeGroupSet.groups[gid];
          const count = (g.memberUids || []).length;
          if (count < minCount) {
            minCount = count;
            minGroup = g;
          }
        });

        if (minGroup) {
          if (!minGroup.memberUids) minGroup.memberUids = [];
          minGroup.memberUids.push(uid);
          if (!minGroup.captainUid) minGroup.captainUid = uid;
        }
      });

      this.activeGroupSet.unassignedUids = [];
      this.activeGroupSet.updatedAt = Date.now();
      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();

      if (this.app && this.app.showNotification) {
        this.app.showNotification(`⚡ 已將 ${unassigned.length} 位同學自動補位至各小組！`);
      }
    }

    // ==========================================
    // 核心功能 2：手動分組、換組、自訂與調整
    // ==========================================
    async createEmptyGroup(customName, customColor) {
      if (!this.activeGroupSet) {
        this.activeGroupSet = {
          id: `set_${Date.now()}`,
          name: '自訂分組',
          updatedAt: Date.now(),
          groups: {},
          unassignedUids: Object.keys(this.getAllStudentsMap())
        };
      }
      const existingCount = Object.keys(this.activeGroupSet.groups || {}).length;
      const gId = `grp_${Date.now()}_${existingCount + 1}`;
      const name = customName || `第 ${existingCount + 1} 組`;
      const color = customColor || this.PRESET_COLORS[existingCount % this.PRESET_COLORS.length];

      if (!this.activeGroupSet.groups) this.activeGroupSet.groups = {};
      this.activeGroupSet.groups[gId] = {
        id: gId,
        name: name,
        color: color,
        captainUid: null,
        memberUids: [],
        points: 0,
        pointsLog: {}
      };
      this.activeGroupSet.updatedAt = Date.now();

      await this.saveActiveGroupSet(this.activeGroupSet);
      if (this.app && this.app.activityScoringConfig && this.app.activityScoringConfig.mode !== 'individual') {
        this.app.activityScoringConfig.mode = 'individual';
        if (typeof this.app.updateActivityScoringBarUI === 'function') {
          this.app.updateActivityScoringBarUI();
        }
      }
      this.renderAdminPanel();
    }

    async deleteGroup(groupId) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const group = this.activeGroupSet.groups[groupId];
      const members = group.memberUids || [];

      if (!this.activeGroupSet.unassignedUids) this.activeGroupSet.unassignedUids = [];
      members.forEach((uid) => {
        if (!this.activeGroupSet.unassignedUids.includes(uid)) {
          this.activeGroupSet.unassignedUids.push(uid);
        }
      });

      delete this.activeGroupSet.groups[groupId];
      this.activeGroupSet.updatedAt = Date.now();

      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
    }

    async updateGroupInfo(groupId, { name, color, captainUid }) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const g = this.activeGroupSet.groups[groupId];
      if (name !== undefined) g.name = String(name).trim() || g.name;
      if (color !== undefined) g.color = color;
      if (captainUid !== undefined) g.captainUid = captainUid;
      this.activeGroupSet.updatedAt = Date.now();

      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
    }

    // 移動單一學生至指定組別 (或移至未分配清單 targetGroupId = null)
    async moveStudentToGroup(studentUid, targetGroupId) {
      if (!this.activeGroupSet) {
        this.activeGroupSet = {
          id: `set_${Date.now()}`,
          name: '課堂分組',
          updatedAt: Date.now(),
          groups: {},
          unassignedUids: Object.keys(this.getAllStudentsMap())
        };
      }
      if (!this.activeGroupSet.unassignedUids) this.activeGroupSet.unassignedUids = [];
      const groups = this.activeGroupSet.groups || {};

      // 1. 從所有組別與未分配名冊中移出
      this.activeGroupSet.unassignedUids = this.activeGroupSet.unassignedUids.filter((u) => u !== studentUid);
      Object.values(groups).forEach((g) => {
        if (Array.isArray(g.memberUids)) {
          g.memberUids = g.memberUids.filter((u) => u !== studentUid);
        }
        if (g.captainUid === studentUid) {
          g.captainUid = g.memberUids[0] || null;
        }
      });

      // 2. 加入目標小組或回歸未分配
      if (targetGroupId && groups[targetGroupId]) {
        if (!Array.isArray(groups[targetGroupId].memberUids)) {
          groups[targetGroupId].memberUids = [];
        }
        groups[targetGroupId].memberUids.push(studentUid);
        if (!groups[targetGroupId].captainUid) {
          groups[targetGroupId].captainUid = studentUid;
        }
      } else {
        this.activeGroupSet.unassignedUids.push(studentUid);
      }

      this.activeGroupSet.updatedAt = Date.now();
      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
    }

    // 一鍵清空目前分組
    async clearActiveGroups() {
      const allStudents = Object.keys(this.getAllStudentsMap());
      this.activeGroupSet = {
        id: `set_${Date.now()}`,
        name: '未分組',
        updatedAt: Date.now(),
        groups: {},
        unassignedUids: allStudents
      };
      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
    }

    // 🧹 一鍵清除所有小組目前積分（保留目前分組結構與組員名單）
    async clearAllGroupPoints() {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || Object.keys(this.activeGroupSet.groups).length === 0) {
        if (this.app && typeof this.app.showNotification === 'function') {
          this.app.showNotification('⚠️ 目前尚未建立任何小組！');
        }
        return;
      }

      const executeClear = async () => {
        Object.values(this.activeGroupSet.groups).forEach((g) => {
          g.points = 0;
          g.pointsLog = {};
        });
        this.activeGroupSet.updatedAt = Date.now();
        await this.saveActiveGroupSet(this.activeGroupSet);
        this.renderAdminPanel();
        if (this.app && typeof this.app.showNotification === 'function') {
          this.app.showNotification('🧹 已成功將所有小組目前積分歸零！');
        }
      };

      if (this.app && typeof this.app.showConfirmModal === 'function') {
        this.app.showConfirmModal(
          '🧹',
          '確定要清除所有小組目前積分嗎？',
          '這將把所有小組目前的累計積分與給點記錄全部歸零重新計算，但會完整保留目前的分組名單與組員配置。',
          executeClear
        );
      } else if (window.confirm('確定要清除所有小組目前的累計積分嗎？（將保留目前的分組名單與組員配置）')) {
        await executeClear();
      }
    }

    // 一鍵移除當前未在線組員至未分配區
    async removeOfflineMembersToUnassigned() {
      if (!this.activeGroupSet || !this.activeGroupSet.groups) return;
      const onlineSet = this.getOnlineStudentUidsSet();
      let movedCount = 0;

      if (!this.activeGroupSet.unassignedUids) this.activeGroupSet.unassignedUids = [];

      Object.values(this.activeGroupSet.groups).forEach((g) => {
        const remaining = [];
        (g.memberUids || []).forEach((uid) => {
          if (onlineSet.has(uid)) {
            remaining.push(uid);
          } else {
            this.activeGroupSet.unassignedUids.push(uid);
            movedCount++;
          }
        });
        g.memberUids = remaining;
        if (g.captainUid && !remaining.includes(g.captainUid)) {
          g.captainUid = remaining[0] || null;
        }
      });

      this.activeGroupSet.updatedAt = Date.now();
      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
      if (this.app && this.app.showNotification) {
        this.app.showNotification(`🧹 已將 ${movedCount} 位未在線同學暫時移至未分配清單。`);
      }
    }

    // ==========================================
    // 核心功能 3：歷史分組記錄庫與載入
    // ==========================================
    async saveCurrentToHistory(customName) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || Object.keys(this.activeGroupSet.groups).length === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 目前尚未建立小組，無法儲存為歷史記錄。');
        } else {
          alert('目前尚未建立小組，無法儲存為歷史記錄。');
        }
        return false;
      }
      const db = this.getDb();
      const classCode = this.getActiveClassCode();
      if (!db) return false;

      const title = String(customName || '').trim() || this.activeGroupSet.name || `分組快照 (${new Date().toLocaleDateString('zh-TW')})`;
      const setId = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const stats = this.getActiveStats();

      const snapshotData = {
        id: setId,
        name: title,
        createdAt: Date.now(),
        classCode: classCode,
        groupCount: stats.groupCount,
        assignedCount: stats.assignedCount,
        groups: JSON.parse(JSON.stringify(this.activeGroupSet.groups)),
        unassignedUids: [...(this.activeGroupSet.unassignedUids || [])]
      };

      const path = classCode ? `classes/${classCode}/groupSets/${setId}` : `groups/groupSets/${setId}`;
      await db.ref(path).set(snapshotData);

      if (this.app && this.app.showNotification) {
        this.app.showNotification(`💾 已成功將「${title}」儲存至歷史分組記錄庫！`);
      }
      return true;
    }

    async fetchHistoryGroupSets() {
      const db = this.getDb();
      const classCode = this.getActiveClassCode();
      if (!db) return [];

      const path = classCode ? `classes/${classCode}/groupSets` : 'groups/groupSets';
      const snap = await db.ref(path).once('value');
      const val = snap.val() || {};
      this.historyGroupSets = Object.values(val).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      return this.historyGroupSets;
    }

    async loadHistoryGroupSet(setId, options = {}) {
      const db = this.getDb();
      const classCode = this.getActiveClassCode();
      if (!db) return false;

      const path = classCode ? `classes/${classCode}/groupSets/${setId}` : `groups/groupSets/${setId}`;
      const snap = await db.ref(path).once('value');
      const data = snap.val();

      if (!data || !data.groups) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 查無該筆歷史分組記錄。');
        }
        return false;
      }

      const unassignedHandling = options.unassignedHandling || 'keep';
      const onlineSet = this.getOnlineStudentUidsSet();
      const clonedGroups = JSON.parse(JSON.stringify(data.groups));
      const unassignedUids = [...(data.unassignedUids || [])];

      // 重設或保留積分（歷史載入時小組積分歸 0 重新開展活動）
      Object.values(clonedGroups).forEach((g) => {
        g.points = 0;
        g.pointsLog = {};

        if (unassignedHandling === 'unassign') {
          const validMembers = [];
          (g.memberUids || []).forEach((uid) => {
            if (onlineSet.has(uid)) {
              validMembers.push(uid);
            } else {
              unassignedUids.push(uid);
            }
          });
          g.memberUids = validMembers;
          if (g.captainUid && !validMembers.includes(g.captainUid)) {
            g.captainUid = validMembers[0] || null;
          }
        }
      });

      // 檢查新學生
      const currentAllStudents = Object.keys(this.getAllStudentsMap());
      const historicalAllUids = new Set(unassignedUids);
      Object.values(clonedGroups).forEach((g) => {
        (g.memberUids || []).forEach((u) => historicalAllUids.add(u));
      });

      currentAllStudents.forEach((uid) => {
        if (!historicalAllUids.has(uid)) {
          unassignedUids.push(uid);
        }
      });

      const newActiveSet = {
        id: `set_${Date.now()}`,
        name: data.name,
        updatedAt: Date.now(),
        groups: clonedGroups,
        unassignedUids: unassignedUids
      };

      await this.saveActiveGroupSet(newActiveSet);

      if (this.app && this.app.showNotification) {
        this.app.showNotification(`🔄 已成功套用歷史分組：「${data.name}」！`);
      }
      return true;
    }

    async deleteHistoryGroupSet(setId) {
      const db = this.getDb();
      const classCode = this.getActiveClassCode();
      if (!db) return false;

      const path = classCode ? `classes/${classCode}/groupSets/${setId}` : `groups/groupSets/${setId}`;
      await db.ref(path).remove();
      await this.fetchHistoryGroupSets();
      this.renderHistoryModalList();
      if (this.app && this.app.showNotification) {
        this.app.showNotification('🗑️ 已刪除該筆歷史分組記錄。');
      }
      return true;
    }

    exportGroupSetCsv(groupSetData) {
      const data = groupSetData || this.activeGroupSet;
      if (!data || !data.groups) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 目前無分組資料可匯出。');
        }
        return;
      }

      const studentsMap = this.getAllStudentsMap();
      const rows = [['組別名稱', '組長標記', '學生姓名', '座號', '使用者ID', '小組累計積分']];

      Object.values(data.groups).forEach((g) => {
        const isCaptain = (uid) => (g.captainUid === uid ? '組長' : '組員');
        (g.memberUids || []).forEach((uid) => {
          const st = studentsMap[uid] || {};
          rows.push([
            `"${(g.name || '').replace(/"/g, '""')}"`,
            `"${isCaptain(uid)}"`,
            `"${(st.name || uid).replace(/"/g, '""')}"`,
            `"${st.seatNumber || ''}"`,
            `"${uid}"`,
            `"${g.points || 0}"`
          ]);
        });
      });

      (data.unassignedUids || []).forEach((uid) => {
        const st = studentsMap[uid] || {};
        rows.push([
          '"未分配名單"',
          '"-"',
          `"${(st.name || uid).replace(/"/g, '""')}"`,
          `"${st.seatNumber || ''}"`,
          `"${uid}"`,
          '"-"'
        ]);
      });

      const csvContent = '\uFEFF' + rows.map((e) => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `學生分組名冊_${data.name || '課堂分組'}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // ==========================================
    // 核心功能 4：小組獨立積分與轉移機制
    // ==========================================
    async addGroupPoints(groupId, deltaPoints, reason = '課堂小組表現優異') {
      const delta = parseInt(deltaPoints, 10);
      if (isNaN(delta) || delta === 0) return;
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;

      const g = this.activeGroupSet.groups[groupId];
      const curPts = parseInt(g.points, 10) || 0;
      const newPts = Math.max(0, curPts + delta);
      g.points = newPts;

      if (!g.pointsLog) g.pointsLog = {};
      const logId = `glog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      g.pointsLog[logId] = {
        id: logId,
        delta: delta,
        newPoints: newPts,
        reason: reason,
        timestamp: Date.now()
      };

      const classCode = this.getActiveClassCode();
      const db = this.getDb();
      if (db) {
        const path = classCode
          ? `classes/${classCode}/activeGroups/groups/${groupId}`
          : `groups/activeGroups/groups/${groupId}`;
        await db.ref(path).update({
          points: newPts,
          [`pointsLog/${logId}`]: g.pointsLog[logId]
        });
      }

      this.renderAdminPanel();

      if (this.app && this.app.showNotification) {
        this.app.showNotification(`🏆 已為【${g.name}】${delta > 0 ? `+${delta}` : delta} 點！`);
      }
    }

    async transferGroupPointsToMembers(groupId, options = {}) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const g = this.activeGroupSet.groups[groupId];
      const members = g.memberUids || [];
      const currentGroupPoints = parseInt(g.points, 10) || 0;

      if (members.length === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification(`⚠️ 【${g.name}】目前組內無任何成員，無法進行轉移。`);
        }
        return;
      }

      if (currentGroupPoints <= 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification(`⚠️ 【${g.name}】目前無累積小組點數可轉移。`);
        }
        return;
      }

      const method = options.method || 'split';
      const reasonPrefix = options.reason || '小組榮譽結算轉移';
      const resetGroupPoints = options.resetGroupPoints !== false;

      let perMemberDelta = 0;
      if (method === 'split') {
        perMemberDelta = Math.floor(currentGroupPoints / members.length);
        if (perMemberDelta <= 0) perMemberDelta = 1;
      } else {
        perMemberDelta = currentGroupPoints;
      }

      for (const uid of members) {
        const fullReason = `${reasonPrefix}：【${g.name}】獲分配 +${perMemberDelta} 點`;
        if (this.app && typeof this.app.adminQuickAdjustPoints === 'function') {
          await this.app.adminQuickAdjustPoints(uid, perMemberDelta, fullReason);
        }
      }

      if (resetGroupPoints) {
        g.points = 0;
        if (!g.pointsLog) g.pointsLog = {};
        const logId = `glog_trans_${Date.now()}`;
        g.pointsLog[logId] = {
          id: logId,
          delta: -currentGroupPoints,
          newPoints: 0,
          reason: `結算轉移至組員 (${method === 'split' ? '均分' : '全員同獎'})`,
          timestamp: Date.now()
        };

        const classCode = this.getActiveClassCode();
        const db = this.getDb();
        if (db) {
          const path = classCode
            ? `classes/${classCode}/activeGroups/groups/${groupId}`
            : `groups/activeGroups/groups/${groupId}`;
          await db.ref(path).update({
            points: 0,
            [`pointsLog/${logId}`]: g.pointsLog[logId]
          });
        }
      }

      this.renderAdminPanel();

      if (this.app && this.app.showNotification) {
        this.app.showNotification(
          `🎉 已成功將【${g.name}】點數轉移給 ${members.length} 位組員 (每人獲得 +${perMemberDelta} 點)！`
        );
      }
    }

    async saveActiveGroupSet(setData) {
      this.activeGroupSet = setData;
      const classCode = this.getActiveClassCode();
      const db = this.getDb();
      if (!db) return;

      const path = classCode ? `classes/${classCode}/activeGroups` : 'groups/activeGroups';
      await db.ref(path).set(setData);
    }

    // ==========================================
    // UI 渲染：教師後台管理工作區
    // ==========================================
    renderAdminPanel() {
      const container = document.getElementById('adminGroupEmbeddedContainer');
      if (!container) return;

      const classCode = this.getActiveClassCode();
      const scopeBadge = document.getElementById('adminGroupPanelScopeBadge');
      if (scopeBadge) {
        scopeBadge.textContent = classCode ? `🏫 當前班級：${classCode}` : '🌱 一次性課堂';
      }

      const stats = this.getActiveStats();
      const statsBadge = document.getElementById('adminGroupStatsBadge');
      if (statsBadge) {
        statsBadge.textContent = `共 ${stats.groupCount} 組 · 入組 ${stats.assignedCount} 人 · 未分配 ${stats.unassignedCount} 人 · 累計小組積分 ${stats.totalPoints} 點`;
      }

      const studentsMap = this.getAllStudentsMap();
      const onlineSet = this.getOnlineStudentUidsSet();
      const groups = (this.activeGroupSet && this.activeGroupSet.groups) || {};
      const groupList = Object.values(groups);
      const unassignedUids = (this.activeGroupSet && this.activeGroupSet.unassignedUids) || [];

      // 主工作區 HTML：小組網格 + 未分配側欄
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div style="display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 18px; align-items: start;" class="group-workspace-grid">
            
            <!-- 左側：小組卡片清單網格 -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="font-size: 15px; font-weight: bold; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                  <span>📋 課堂小組 (${groupList.length} 組)</span>
                  <span style="font-size: 14px; font-weight: normal; color: var(--text-secondary);">拖曳名牌換組或點擊名牌「⇄」快捷換組</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button type="button" class="presentation-tool-btn" onclick="window.groupManager.createEmptyGroup()" style="font-size: 14px; padding: 5px 12px; border-radius: 6px;" title="新增一個新組別">
                    ➕ 新增組別
                  </button>
                  <button type="button" class="presentation-tool-btn" onclick="window.groupManager.removeOfflineMembersToUnassigned()" style="font-size: 14px; padding: 5px 12px; border-radius: 6px;" title="將目前未連線的同學一鍵移至未分配清單">
                    🧹 排除離線學生
                  </button>
                </div>
              </div>

              ${groupList.length === 0 ? `
                <div style="text-align: center; padding: 48px 20px; background: var(--bg-input); border: 2px dashed var(--border-color); border-radius: 12px; color: var(--text-secondary); font-size: 15px;">
                  <div style="font-size: 32px; margin-bottom: 8px;">👥</div>
                  目前尚未建立小組，請點擊上方<strong>「⚡ 自動分組」</strong>或<strong>「➕ 新增組別」</strong>開始分組。
                </div>
              ` : `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 14px;" id="groupCardsContainer">
                  ${groupList.map((g) => this.renderSingleGroupCard(g, studentsMap, onlineSet)).join('')}
                </div>
              `}
            </div>

            <!-- 右側：未分配學生專區 -->
            <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 15px; font-weight: bold; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                  <span>⏳ 未分配名單</span>
                  <span style="background: rgba(245, 158, 11, 0.2); color: #d97706; padding: 2px 7px; border-radius: 8px; font-size: 14px; font-weight: bold;">
                    ${unassignedUids.length}
                  </span>
                </div>
                ${unassignedUids.length > 0 ? `
                  <button type="button" class="presentation-tool-btn purple" onclick="window.groupManager.autoFillUnassigned()" style="font-size: 14px; padding: 4px 10px; border-radius: 6px;" title="將未分配同學均勻自動補位至現有組別">
                    ⚡ 自動補位
                  </button>
                ` : ''}
              </div>

              <div id="unassignedDropZone" 
                   data-group-id=""
                   ondragover="window.groupManager.onDragOver(event)" 
                   ondragleave="window.groupManager.onDragLeave(event)" 
                   ondrop="window.groupManager.onDropToGroup(event, null)" 
                   style="display: flex; flex-direction: column; gap: 8px; min-height: 220px; max-height: 560px; overflow-y: auto; padding: 8px; border: 2px dashed var(--border-color); border-radius: 8px; transition: all 0.2s;">
                ${unassignedUids.length === 0 ? `
                  <div style="text-align: center; color: var(--text-muted); font-size: 14px; margin: auto; padding: 24px;">
                    全班同學皆已入組 🎉
                  </div>
                ` : unassignedUids.map((uid) => this.renderStudentChip(uid, studentsMap[uid], onlineSet.has(uid), null)).join('')}
              </div>
              <div style="font-size: 14px; color: var(--text-muted); line-height: 1.4;">
                💡 提示：可拖曳名牌，或點擊名牌右側<strong>「⇄」</strong>直接選擇組別！
              </div>
            </div>

          </div>
        </div>
      `;
    }

    // 渲染單一小組卡片
    renderSingleGroupCard(group, studentsMap, onlineSet) {
      const safeGid = String(group.id).replace(/'/g, "\\'");
      const safeName = this.escapeHtml(group.name);
      const color = group.color || '#3B82F6';
      const members = group.memberUids || [];
      const captainUid = group.captainUid;
      const points = parseInt(group.points, 10) || 0;

      return `
        <div class="group-admin-card drop-target-group" 
             id="card_${group.id}" 
             data-group-id="${group.id}"
             ondragover="window.groupManager.onDragOver(event)" 
             ondragleave="window.groupManager.onDragLeave(event)" 
             ondrop="window.groupManager.onDropToGroup(event, '${safeGid}')" 
             style="background: var(--bg-card); border: 1px solid var(--border-color); border-top: 4px solid ${color}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: var(--shadow); transition: all 0.2s;">
          
          <!-- 組別卡片頂部：組名、顏色切換、小組點數、操作選單 -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1;">
              <input type="color" value="${color}" onchange="window.groupManager.updateGroupInfo('${safeGid}', { color: this.value })" title="更換小組代表色" style="width: 24px; height: 24px; padding: 0; border: none; border-radius: 50%; cursor: pointer; flex-shrink: 0; background: none;">
              <span style="font-weight: bold; font-size: 15px; color: var(--text-primary); cursor: pointer;" onclick="window.groupManager.promptRenameGroup('${safeGid}', '${safeName}')" title="點擊更換組名">
                ${safeName}
              </span>
              <span style="font-size: 14px; color: var(--text-secondary); flex-shrink: 0;">(${members.length}人)</span>
            </div>

            <!-- 小組點數徽章與快速加分 -->
            <div style="display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;">
              <div style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); color: #d97706; font-weight: bold; font-size: 14px;" title="小組累計積分">
                <span>⭐️</span>
                <span>${points}</span>
              </div>
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.addGroupPoints('${safeGid}', 1, '課堂小組發言優異')" title="小組 +1 點" style="padding: 2px 7px; font-size: 14px; font-weight: bold; color: #10b981; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px;">
                +1
              </button>
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.openGroupPointsModal('${safeGid}')" title="自訂小組加減分或事由" style="padding: 2px 7px; font-size: 14px; color: var(--text-primary); border-radius: 6px;">
                給點
              </button>
            </div>
          </div>

          <!-- 組員清單區域 (Drop 放置區) -->
          <div class="group-members-drop-area"
               data-group-id="${group.id}"
               ondragover="window.groupManager.onDragOver(event)" 
               ondrop="window.groupManager.onDropToGroup(event, '${safeGid}')" 
               style="display: flex; flex-direction: column; gap: 6px; min-height: 86px; padding: 8px; background: var(--bg-input); border-radius: 8px; border: 1px dashed transparent; transition: all 0.2s;">
            ${members.length === 0 ? `
              <div style="text-align: center; color: var(--text-muted); font-size: 14px; margin: auto; padding: 14px; pointer-events: none;">
                尚未指派組員 (拖曳名牌至此，或點名牌 ⇄)
              </div>
            ` : members.map((uid) => this.renderStudentChip(uid, studentsMap[uid], onlineSet.has(uid), group.id, captainUid === uid)).join('')}
          </div>

          <!-- 底部工具列：小組點數結算轉移 / 刪除小組 -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1px dashed var(--border-color); font-size: 14px;">
            <button type="button" class="presentation-tool-btn" onclick="window.groupManager.openTransferModal('${safeGid}')" style="font-size: 14px; padding: 3px 8px; border-radius: 6px; color: #8b5cf6; background: rgba(139, 92, 246, 0.12); border: 1px solid rgba(139, 92, 246, 0.3);" title="將小組累積的積分結算並分配給組內成員">
              🎁 轉移給組員
            </button>
            <div style="display: flex; gap: 4px;">
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.deleteGroup('${safeGid}')" style="font-size: 14px; padding: 3px 8px; border-radius: 6px; color: #ef4444; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25);" title="刪除此小組 (組員移至未分配清單)">
                🗑️
              </button>
            </div>
          </div>

        </div>
      `;
    }

    // 渲染學生標籤晶片 (支援 HTML5 拖曳 + 點擊快捷換組)
    renderStudentChip(uid, studentData, isOnline, currentGroupId, isCaptain = false) {
      const safeUid = String(uid).replace(/'/g, "\\'");
      const safeName = this.escapeHtml((studentData && studentData.name) || uid);
      const avatarId = studentData ? studentData.avatar : 0;
      const avatarHtml = this.app && typeof this.app.renderAvatarHtml === 'function'
        ? this.app.renderAvatarHtml(avatarId, 24)
        : '👤';
      const points = (studentData && parseInt(studentData.points, 10)) || 0;

      return `
        <div class="student-drag-chip" 
             id="chip_${safeUid}"
             data-student-uid="${safeUid}"
             draggable="true" 
             ondragstart="window.groupManager.onDragStart(event, '${safeUid}', '${currentGroupId || ''}')" 
             style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; cursor: grab; user-select: none; gap: 6px; font-size: 14px; position: relative;">
          
          <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1;">
            <div style="flex-shrink: 0; pointer-events: none;">${avatarHtml}</div>
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${isOnline ? '#10b981' : '#9ca3af'}; flex-shrink: 0;" title="${isOnline ? '線上連線中' : '目前離線'}"></span>
            <span style="font-weight: 500; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none;">
              ${safeName}
            </span>
            ${isCaptain ? `
              <span style="background: rgba(245, 158, 11, 0.2); color: #d97706; padding: 1px 5px; border-radius: 4px; font-size: 14px; font-weight: bold; flex-shrink: 0;" title="組長">
                👑 組長
              </span>
            ` : ''}
          </div>

          <!-- 右側動作列：點數、快捷換組選單、設為組長、移出組別 -->
          <div style="display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;">
            <span style="font-size: 14px; color: var(--text-muted); margin-right: 2px;" title="個人點數">⭐️${points}</span>
            
            <!-- ⚡ 快捷換組按鈕 (觸控與滑鼠皆能一秒點擊換組) -->
            <button type="button" class="btn-quick-assign presentation-tool-btn" onclick="window.groupManager.toggleStudentAssignMenu(event, '${safeUid}')" title="點擊選擇要移入的組別" style="padding: 2px 6px; font-size: 14px; border-radius: 4px; background: var(--bg-input); color: var(--accent-color); border: 1px solid var(--border-color);">
              ⇄
            </button>

            ${currentGroupId ? `
              ${!isCaptain ? `
                <button type="button" class="chip-action-btn" onclick="event.stopPropagation(); window.groupManager.updateGroupInfo('${currentGroupId}', { captainUid: '${safeUid}' })" title="設為組長" style="background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px;">
                  👑
                </button>
              ` : ''}
              <button type="button" class="chip-action-btn" onclick="event.stopPropagation(); window.groupManager.moveStudentToGroup('${safeUid}', null)" title="移至未分配清單" style="background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px; color: var(--text-muted);">
                ✕
              </button>
            ` : ''}
          </div>

        </div>
      `;
    }

    // ==========================================
    // 點擊快捷換組選單 (Click-to-Assign)
    // ==========================================
    toggleStudentAssignMenu(event, studentUid) {
      event.stopPropagation();
      this.closeAllAssignMenus();

      const chip = document.getElementById(`chip_${studentUid}`);
      if (!chip) return;

      const groups = (this.activeGroupSet && this.activeGroupSet.groups) || {};
      const groupList = Object.values(groups);

      const menu = document.createElement('div');
      menu.className = 'student-assign-menu';
      menu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 22000;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 140px;
        font-size: 14px;
      `;

      let menuItemsHtml = `<div style="font-weight: bold; font-size: 13px; color: var(--text-secondary); padding: 4px 6px;">選擇分配組別：</div>`;

      if (groupList.length === 0) {
        menuItemsHtml += `<div style="color: var(--text-muted); padding: 4px 6px;">目前尚無小組</div>`;
      } else {
        groupList.forEach((g) => {
          const isMember = (g.memberUids || []).includes(studentUid);
          menuItemsHtml += `
            <button type="button" 
                    onclick="window.groupManager.moveStudentToGroup('${studentUid}', '${g.id}'); window.groupManager.closeAllAssignMenus();" 
                    style="display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 8px; border: none; border-radius: 6px; background: ${isMember ? 'var(--bg-hover)' : 'transparent'}; color: var(--text-primary); cursor: pointer; text-align: left; font-size: 14px;">
              <span style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${g.color || '#3b82f6'};"></span>
                <span>${this.escapeHtml(g.name)}</span>
              </span>
              ${isMember ? '<span style="color: #10b981; font-weight: bold;">✓</span>' : ''}
            </button>
          `;
        });
      }

      menuItemsHtml += `
        <div style="border-top: 1px solid var(--border-color); margin: 2px 0;"></div>
        <button type="button" 
                onclick="window.groupManager.moveStudentToGroup('${studentUid}', null); window.groupManager.closeAllAssignMenus();" 
                style="display: flex; align-items: center; gap: 6px; padding: 6px 8px; border: none; border-radius: 6px; background: transparent; color: var(--text-secondary); cursor: pointer; text-align: left; font-size: 14px;">
          <span>⏳ 移至未分配</span>
        </button>
      `;

      menu.innerHTML = menuItemsHtml;
      chip.appendChild(menu);
    }

    // ==========================================
    // 拖曳互動事件 (Drag & Drop)
    // ==========================================
    onDragStart(event, studentUid, fromGroupId) {
      this.draggedStudentUid = studentUid;
      this.draggedFromGroupId = fromGroupId || null;
      window.__draggedStudentUid = studentUid; // 雙重全域備份保險
      try {
        event.dataTransfer.setData('text/plain', studentUid);
        event.dataTransfer.effectAllowed = 'move';
      } catch (e) {}
    }

    onDragOver(event) {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
      const card = event.currentTarget.closest('.group-admin-card') || event.currentTarget;
      if (card && card.classList) {
        card.classList.add('drag-hover');
      }
    }

    onDragLeave(event) {
      const card = event.currentTarget.closest('.group-admin-card') || event.currentTarget;
      if (card && card.classList) {
        card.classList.remove('drag-hover');
      }
    }

    onDropToGroup(event, targetGroupId) {
      event.preventDefault();
      event.stopPropagation();
      document.querySelectorAll('.group-admin-card').forEach((el) => el.classList.remove('drag-hover'));
      document.querySelectorAll('#unassignedDropZone').forEach((el) => {
        el.style.borderColor = 'var(--border-color)';
      });

      let studentUid = this.draggedStudentUid || window.__draggedStudentUid;
      if (!studentUid && event.dataTransfer) {
        studentUid = event.dataTransfer.getData('text/plain');
      }

      if (!studentUid) return;

      this.moveStudentToGroup(studentUid, targetGroupId);
      this.draggedStudentUid = null;
      window.__draggedStudentUid = null;
      this.draggedFromGroupId = null;
    }

    // 彈窗與使用者互動
    promptRenameGroup(groupId, currentName) {
      const newName = prompt('請輸入新的小組名稱：', currentName);
      if (newName && newName.trim()) {
        this.updateGroupInfo(groupId, { name: newName.trim() });
      }
    }

    // 開啟「自動分組設定彈窗」
    openAutoGroupModal(options = {}) {
      this.openModal('adminAutoGroupModal');

      const onlineCount = this.getOnlineStudentUidsSet().size;
      const totalStudents = Object.keys(this.getAllStudentsMap()).length;

      const infoBadge = document.getElementById('autoGroupStudentCountInfo');
      if (infoBadge) {
        infoBadge.innerHTML = `名冊總額：<strong>${totalStudents}</strong> 人 · 目前線上連線中：<strong style="color: #10b981;">${onlineCount}</strong> 人`;
      }
    }

    closeAutoGroupModal() {
      this.closeModal('adminAutoGroupModal');
    }

    async confirmAutoGroup() {
      const modeEl = document.querySelector('input[name="autoGroupMode"]:checked');
      const mode = modeEl ? modeEl.value : 'bySize';
      const valEl = document.getElementById('autoGroupValueInput');
      const value = parseInt(valEl ? valEl.value : 4, 10) || 4;

      const scopeEl = document.querySelector('input[name="autoGroupScope"]:checked');
      const scope = scopeEl ? scopeEl.value : 'all';

      const unassignedEl = document.querySelector('input[name="autoGroupUnassigned"]:checked');
      const unassignedHandling = unassignedEl ? unassignedEl.value : 'keep';

      const titleInput = document.getElementById('autoGroupNameInput');
      const setName = (titleInput && titleInput.value.trim()) || `分組活動 (${new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })})`;

      this.closeAutoGroupModal();
      await this.createAutoGroups({
        mode,
        value,
        scope,
        unassignedHandling,
        setName
      });
    }

    // 開啟「歷史分組庫彈窗」
    async openHistoryModal() {
      this.openModal('adminGroupHistoryModal');
      await this.fetchHistoryGroupSets();
      this.renderHistoryModalList();
    }

    closeHistoryModal() {
      this.closeModal('adminGroupHistoryModal');
    }

    renderHistoryModalList() {
      const container = document.getElementById('adminGroupHistoryListContainer');
      if (!container) return;

      if (!this.historyGroupSets || this.historyGroupSets.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; color: var(--text-secondary); font-size: 14px; padding: 40px; background: var(--bg-input); border-radius: 10px;">
            🌱 尚無歷史分組記錄。可將目前的活躍小組儲存為歷史記錄以供往後重新套用。
          </div>
        `;
        return;
      }

      container.innerHTML = this.historyGroupSets.map((set) => {
        const safeId = String(set.id).replace(/'/g, "\\'");
        const safeName = this.escapeHtml(set.name);
        const timeStr = set.createdAt ? new Date(set.createdAt).toLocaleString('zh-TW') : '';

        return `
          <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-weight: bold; font-size: 15px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                <span>📁 ${safeName}</span>
                <span style="font-size: 14px; font-weight: normal; color: var(--text-secondary);">${timeStr}</span>
              </div>
              <div style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">
                共 <strong>${set.groupCount || 0}</strong> 組 · 組員 <strong>${set.assignedCount || 0}</strong> 人
              </div>
            </div>

            <div style="display: flex; gap: 6px; align-items: center;">
              <button type="button" class="presentation-tool-btn purple" onclick="window.groupManager.promptLoadHistorySet('${safeId}', '${safeName}')" style="font-size: 14px; padding: 5px 12px; border-radius: 6px;" title="套用此歷史分組為課堂當前組別">
                🔄 重新套用
              </button>
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.deleteHistoryGroupSet('${safeId}')" style="font-size: 14px; padding: 5px 10px; border-radius: 6px; color: #ef4444;" title="刪除此筆記錄">
                🗑️
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    promptLoadHistorySet(setId, setName) {
      const choice = confirm(
        `確定要重新套用歷史分組「${setName}」嗎？\n\n【確定】：保留未在線學生於原組別中等候上線。\n【取消】：僅將目前在線學生排入組別，未上線者移出至未分配名單。`
      );
      this.closeHistoryModal();
      this.loadHistoryGroupSet(setId, { unassignedHandling: choice ? 'keep' : 'unassign' });
    }

    openSaveHistoryModal() {
      const defaultName = (this.activeGroupSet && this.activeGroupSet.name) || `課堂分組 (${new Date().toLocaleDateString('zh-TW')})`;
      const name = prompt('請輸入此分組方案的歷史記錄名稱：', defaultName);
      if (name && name.trim()) {
        this.saveCurrentToHistory(name.trim());
      }
    }

    // ==========================================
    // 🏆 小組榮譽積分看板 (支援全螢幕、前三名頒獎台與即時連動)
    // ==========================================
    openLeaderboardModal() {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || Object.keys(this.activeGroupSet.groups).length === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 目前尚無任何小組組別，請先點擊「自動分組」或手動建立小組。');
        }
        return;
      }
      this.openModal('adminGroupLeaderboardModal');
      this.renderLeaderboardModal();
    }

    closeLeaderboardModal() {
      this.closeModal('adminGroupLeaderboardModal');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      const fsBtn = document.getElementById('btnGroupLeaderboardFullscreen');
      if (fsBtn) {
        fsBtn.textContent = '⛶ 全螢幕';
        fsBtn.classList.remove('active', 'is-fullscreen-active');
      }
    }

    toggleLeaderboardFullscreen() {
      const modalEl = document.getElementById('adminGroupLeaderboardModal');
      const fsBtn = document.getElementById('btnGroupLeaderboardFullscreen');
      if (!modalEl) return;

      if (!document.fullscreenElement) {
        modalEl.requestFullscreen().then(() => {
          if (fsBtn) {
            fsBtn.textContent = '🗗 恢復為視窗';
            fsBtn.classList.add('active', 'is-fullscreen-active');
          }
        }).catch(err => {
          console.error('進入全螢幕失敗:', err);
        });
      } else {
        document.exitFullscreen().then(() => {
          if (fsBtn) {
            fsBtn.textContent = '⛶ 全螢幕';
            fsBtn.classList.remove('active', 'is-fullscreen-active');
          }
        }).catch(() => {});
      }
    }

    renderLeaderboardModal() {
      const modal = document.getElementById('adminGroupLeaderboardModal');
      if (!modal) return;

      const classCode = this.getActiveClassCode();
      const scopeBadge = document.getElementById('adminGroupLeaderboardScopeBadge');
      if (scopeBadge) {
        scopeBadge.textContent = classCode ? `🏫 班級：${classCode}` : '🌱 一次性課堂';
      }

      if (!this.activeGroupSet || !this.activeGroupSet.groups) return;

      const studentsMap = this.getAllStudentsMap();
      const groups = Object.values(this.activeGroupSet.groups);
      // 依積分由大到小排序，分數相同依組名排序
      groups.sort((a, b) => {
        const ptsA = parseInt(a.points, 10) || 0;
        const ptsB = parseInt(b.points, 10) || 0;
        if (ptsB !== ptsA) return ptsB - ptsA;
        return (a.name || '').localeCompare(b.name || '');
      });

      const countBadge = document.getElementById('adminGroupLeaderboardCount');
      if (countBadge) {
        countBadge.textContent = `共 ${groups.length} 組`;
      }

      // 1. 渲染前三名頒獎台 (Top 3 Podium)
      const podiumEl = document.getElementById('adminGroupPodiumContainer');
      if (podiumEl) {
        const top1 = groups[0] || null;
        const top2 = groups[1] || null;
        const top3 = groups[2] || null;

        const renderPodiumPillar = (group, rank, height, medal, badgeColor, medalBg) => {
          if (!group) {
            return `
              <div style="flex: 1; max-width: 220px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;">
                <div style="width: 100%; height: ${height}px; background: var(--bg-input); border: 2px dashed var(--border-color); border-radius: 14px 14px 0 0; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 14px;">
                  虛位以待
                </div>
              </div>
            `;
          }

          const safeGid = String(group.id).replace(/'/g, "\\'");
          const color = group.color || '#3B82F6';
          const points = parseInt(group.points, 10) || 0;
          const members = group.memberUids || [];
          const captainName = group.captainUid && studentsMap[group.captainUid] ? studentsMap[group.captainUid].name : '';

          return `
            <div style="flex: 1; max-width: 240px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; animation: fadeInUp 0.4s ease;">
              <!-- 頂部榮譽圖示與小組名 -->
              <div style="margin-bottom: 8px; text-align: center; width: 100%;">
                <div style="font-size: 32px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15)); margin-bottom: 2px;">${medal}</div>
                <div style="font-weight: bold; font-size: 16px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 4px;" title="${this.escapeHtml(group.name)}">
                  ${this.escapeHtml(group.name)}
                </div>
                <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 4px;">
                  <span style="font-size: 20px; font-weight: 900; color: ${badgeColor};">⭐️ ${points}</span>
                  <span style="font-size: 14px; color: var(--text-secondary);">分</span>
                </div>
              </div>

              <!-- 頒獎柱柱體 -->
              <div style="width: 100%; height: ${height}px; background: ${medalBg}; border-top: 4px solid ${color}; border-radius: 14px 14px 0 0; box-shadow: 0 8px 16px rgba(0,0,0,0.08); display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 10px 8px; box-sizing: border-box; text-align: center;">
                <div style="font-weight: 900; font-size: 18px; color: ${badgeColor}; letter-spacing: 1px;">
                  第 ${rank} 名
                </div>
                <div style="font-size: 13px; color: var(--text-secondary); width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${captainName ? `👑 組長：${this.escapeHtml(captainName)}` : `組員 ${members.length} 人`}
                </div>
                <button type="button" class="presentation-tool-btn" onclick="window.groupManager.openGroupPointsModal('${safeGid}')" style="font-size: 13px; padding: 3px 10px; border-radius: 6px; background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color);">
                  ⭐ 給點
                </button>
              </div>
            </div>
          `;
        };

        podiumEl.innerHTML = `
          <div style="display: flex; align-items: flex-end; justify-content: center; gap: 14px; min-height: 230px; padding: 10px 4px 0 4px; border-bottom: 2px solid var(--border-color); margin-bottom: 8px;">
            ${renderPodiumPillar(top2, 2, 140, '🥈', '#64748b', 'linear-gradient(180deg, rgba(203, 213, 225, 0.45) 0%, rgba(203, 213, 225, 0.15) 100%)')}
            ${renderPodiumPillar(top1, 1, 185, '🥇', '#d97706', 'linear-gradient(180deg, rgba(254, 240, 138, 0.55) 0%, rgba(254, 240, 138, 0.15) 100%)')}
            ${renderPodiumPillar(top3, 3, 115, '🥉', '#b45309', 'linear-gradient(180deg, rgba(254, 215, 170, 0.45) 0%, rgba(254, 215, 170, 0.15) 100%)')}
          </div>
        `;
      }

      // 2. 渲染完整排名清單
      const listEl = document.getElementById('adminGroupLeaderboardList');
      if (listEl) {
        listEl.innerHTML = groups.map((g, idx) => {
          const rank = idx + 1;
          const safeGid = String(g.id).replace(/'/g, "\\'");
          const color = g.color || '#3B82F6';
          const points = parseInt(g.points, 10) || 0;
          const members = g.memberUids || [];
          const memberNames = members.map(uid => studentsMap[uid] ? studentsMap[uid].name : '同學').join('、');

          let rankBadge = `<span style="width: 28px; height: 28px; border-radius: 50%; background: var(--bg-input); color: var(--text-primary); display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 1px solid var(--border-color);">${rank}</span>`;
          if (rank === 1) rankBadge = `<span style="font-size: 22px;">🥇</span>`;
          else if (rank === 2) rankBadge = `<span style="font-size: 22px;">🥈</span>`;
          else if (rank === 3) rankBadge = `<span style="font-size: 22px;">🥉</span>`;

          return `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-left: 5px solid ${color}; border-radius: 10px; padding: 10px 14px; box-shadow: var(--shadow);">
              <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 32px;">
                  ${rankBadge}
                </div>
                <div style="min-width: 0; flex: 1;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: bold; font-size: 15px; color: var(--text-primary);">${this.escapeHtml(g.name)}</span>
                    <span style="font-size: 13px; color: var(--text-secondary); background: var(--bg-input); padding: 2px 7px; border-radius: 6px;">${members.length} 人</span>
                  </div>
                  <div style="font-size: 13px; color: var(--text-muted); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${this.escapeHtml(memberNames)}">
                    ${memberNames ? `組員：${this.escapeHtml(memberNames)}` : '尚無組員'}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                <div style="font-size: 17px; font-weight: bold; color: #d97706; display: flex; align-items: center; gap: 4px;">
                  <span>⭐️</span>
                  <span>${points}</span>
                  <span style="font-size: 13px; color: var(--text-secondary); font-weight: normal;">點</span>
                </div>
                <button type="button" class="presentation-tool-btn" onclick="window.groupManager.openGroupPointsModal('${safeGid}')" style="font-size: 14px; padding: 4px 10px; border-radius: 6px;">
                  ⭐ 給點
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // ==========================================
    // ⭐ 小組整組加扣分彈窗 (取代原 prompt，支援 3 種模式與常用標籤)
    // ==========================================
    openGroupPointsModal(groupId) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const g = this.activeGroupSet.groups[groupId];
      this.currentPointsGroupIds = [groupId];

      const targetInfoEl = document.getElementById('adminGroupPointsTargetInfo');
      if (targetInfoEl) {
        const studentsMap = this.getAllStudentsMap();
        const members = g.memberUids || [];
        const memberNames = members.map(uid => studentsMap[uid] ? studentsMap[uid].name : '同學').join('、');
        const color = g.color || '#3B82F6';
        const points = parseInt(g.points, 10) || 0;

        targetInfoEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 14px; height: 14px; border-radius: 50%; background: ${color}; flex-shrink: 0;"></div>
            <div style="font-size: 15px; font-weight: bold; color: var(--text-primary);">【${this.escapeHtml(g.name)}】</div>
            <div style="font-size: 13px; color: var(--text-secondary); background: var(--bg-card); border: 1px solid var(--border-color); padding: 2px 8px; border-radius: 6px;">
              共 ${members.length} 人 · 現有 ${points} 點
            </div>
          </div>
          <div style="font-size: 13px; color: var(--text-muted); margin-top: 6px; line-height: 1.4;">
            組員：${memberNames ? this.escapeHtml(memberNames) : '無成員'}
          </div>
        `;
      }

      // 重設輸入框預設值
      const deltaInput = document.getElementById('adminGroupPointsDeltaInput');
      if (deltaInput) deltaInput.value = '2';
      const reasonInput = document.getElementById('adminGroupPointsReasonInput');
      if (reasonInput) reasonInput.value = '團隊互助合作';

      this.openModal('adminGroupPointsModal');
    }

    closeGroupPointsModal() {
      this.closeModal('adminGroupPointsModal');
      this.currentPointsGroupIds = [];
    }

    setGroupPointsDelta(delta) {
      const input = document.getElementById('adminGroupPointsDeltaInput');
      if (input) input.value = delta;
    }

    setGroupPointsReason(reason) {
      const input = document.getElementById('adminGroupPointsReasonInput');
      if (input) input.value = reason;
    }

    // ⭐ 批次小組給點功能
    openBatchGroupPointsModal() {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || Object.keys(this.activeGroupSet.groups).length === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 目前尚無任何小組組別，無法進行批次給點。');
        }
        return;
      }

      this.batchSelectedGroupIds = new Set(Object.keys(this.activeGroupSet.groups));
      this.renderBatchGroupSelectList();
      this.openModal('adminBatchGroupSelectModal');
    }

    closeBatchGroupSelectModal() {
      this.closeModal('adminBatchGroupSelectModal');
    }

    renderBatchGroupSelectList() {
      const listEl = document.getElementById('adminBatchGroupSelectList');
      if (!listEl || !this.activeGroupSet || !this.activeGroupSet.groups) return;

      const studentsMap = this.getAllStudentsMap();
      const groups = Object.values(this.activeGroupSet.groups);

      listEl.innerHTML = groups.map(g => {
        const safeGid = String(g.id).replace(/'/g, "\\'");
        const isChecked = this.batchSelectedGroupIds.has(g.id);
        const color = g.color || '#3B82F6';
        const members = g.memberUids || [];
        const memberNames = members.map(uid => studentsMap[uid] ? studentsMap[uid].name : '同學').join('、');
        const points = parseInt(g.points, 10) || 0;

        return `
          <label style="display: flex; align-items: center; gap: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-left: 4px solid ${color}; border-radius: 8px; padding: 8px 12px; cursor: pointer; margin: 0;">
            <input type="checkbox" value="${safeGid}" ${isChecked ? 'checked' : ''} onchange="window.groupManager.toggleBatchGroupSelect('${safeGid}', this.checked)" style="width: 17px; height: 17px; cursor: pointer;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: bold; font-size: 14px; color: var(--text-primary);">${this.escapeHtml(g.name)}</span>
                <span style="font-size: 13px; color: var(--text-secondary);">(${members.length}人 · ${points}點)</span>
              </div>
              <div style="font-size: 13px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${memberNames ? this.escapeHtml(memberNames) : '無組員'}
              </div>
            </div>
          </label>
        `;
      }).join('');
    }

    toggleBatchGroupSelect(groupId, isChecked) {
      if (isChecked) {
        this.batchSelectedGroupIds.add(groupId);
      } else {
        this.batchSelectedGroupIds.delete(groupId);
      }
    }

    toggleBatchSelectAllGroups() {
      if (!this.activeGroupSet || !this.activeGroupSet.groups) return;
      const allIds = Object.keys(this.activeGroupSet.groups);
      if (this.batchSelectedGroupIds.size === allIds.length) {
        this.batchSelectedGroupIds.clear();
      } else {
        this.batchSelectedGroupIds = new Set(allIds);
      }
      this.renderBatchGroupSelectList();
    }

    confirmBatchGroupSelection() {
      if (this.batchSelectedGroupIds.size === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 請至少勾選 1 個小組進行給點！');
        }
        return;
      }

      this.currentPointsGroupIds = Array.from(this.batchSelectedGroupIds);
      this.closeModal('adminBatchGroupSelectModal');

      const targetInfoEl = document.getElementById('adminGroupPointsTargetInfo');
      if (targetInfoEl) {
        const groups = this.currentPointsGroupIds.map(gid => this.activeGroupSet.groups[gid]).filter(Boolean);
        const groupNames = groups.map(g => g.name).join('、');
        let totalMembers = 0;
        groups.forEach(g => { totalMembers += (g.memberUids || []).length; });

        targetInfoEl.innerHTML = `
          <div style="font-size: 15px; font-weight: bold; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
            <span>👥 批次多選給點</span>
            <span style="font-size: 13px; background: rgba(59, 130, 246, 0.15); color: #2563eb; padding: 2px 8px; border-radius: 6px;">
              已選取 ${groups.length} 個小組 · 共 ${totalMembers} 人
            </span>
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; line-height: 1.4;">
            對象組別：${this.escapeHtml(groupNames)}
          </div>
        `;
      }

      const deltaInput = document.getElementById('adminGroupPointsDeltaInput');
      if (deltaInput) deltaInput.value = '2';
      const reasonInput = document.getElementById('adminGroupPointsReasonInput');
      if (reasonInput) reasonInput.value = '團隊互助合作';

      this.openModal('adminGroupPointsModal');
    }

    // 執行送出小組給點
    async submitGroupPoints() {
      if (!this.currentPointsGroupIds || this.currentPointsGroupIds.length === 0) {
        this.closeGroupPointsModal();
        return;
      }

      const deltaInput = document.getElementById('adminGroupPointsDeltaInput');
      const val = parseInt(deltaInput ? deltaInput.value : '0', 10);
      if (isNaN(val) || val === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 請輸入有效的加減點數（不可為 0）！');
        }
        return;
      }

      const modeRadio = document.querySelector('input[name="adminGroupPointsMode"]:checked');
      const mode = modeRadio ? modeRadio.value : 'both'; // both / members / pool

      const reasonInput = document.getElementById('adminGroupPointsReasonInput');
      const reason = reasonInput && reasonInput.value.trim() ? reasonInput.value.trim() : '小組表現優異';

      const targetGroupIds = [...this.currentPointsGroupIds];
      this.closeGroupPointsModal();

      let affectedMembersCount = 0;
      let affectedGroupsCount = 0;

      for (const gid of targetGroupIds) {
        if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[gid]) continue;
        const g = this.activeGroupSet.groups[gid];
        affectedGroupsCount++;

        // 1. 若包含小組池：更新小組積分與日誌
        if (mode === 'both' || mode === 'pool') {
          await this.addGroupPoints(gid, val, reason, false); // 不在迴圈內反覆通知
        }

        // 2. 若包含組員個人：同步為全組組員加點並寫入歷程
        if (mode === 'both' || mode === 'members') {
          const members = g.memberUids || [];
          for (const uid of members) {
            affectedMembersCount++;
            const memberReason = `小組【${g.name}】獎勵：${reason}`;
            if (this.app && typeof this.app.adminQuickAdjustPoints === 'function') {
              await this.app.adminQuickAdjustPoints(uid, val, memberReason);
            }
          }
        }
      }

      // 重新渲染後台與小組看板
      this.renderAdminPanel();
      const leaderboardModal = document.getElementById('adminGroupLeaderboardModal');
      if (leaderboardModal && leaderboardModal.style.display !== 'none') {
        this.renderLeaderboardModal();
      }

      if (this.app && this.app.showNotification) {
        const sign = val > 0 ? `+${val}` : val;
        let msg = '';
        if (mode === 'both') {
          msg = `🎉 已完成 ${affectedGroupsCount} 個小組加分 (${sign} 點)，並同步獎勵 ${affectedMembersCount} 位組員個人點數！`;
        } else if (mode === 'members') {
          msg = `🎉 已為 ${affectedGroupsCount} 個小組共 ${affectedMembersCount} 位組員發放個人點數 (${sign} 點)！`;
        } else {
          msg = `🎉 已為 ${affectedGroupsCount} 個小組小組池增減 ${sign} 點！`;
        }
        this.app.showNotification(msg);
      }
    }

    openTransferModal(groupId) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const g = this.activeGroupSet.groups[groupId];
      this.currentTransferGroupId = groupId;
      this.openModal('adminGroupTransferModal');

      const infoEl = document.getElementById('groupTransferTargetInfo');
      if (infoEl) {
        infoEl.innerHTML = `
          目標小組：<strong style="color: ${g.color || 'var(--accent-color)'}; font-size: 15px;">${this.escapeHtml(g.name)}</strong>
          · 目前小組累計積分：<strong style="color: #d97706; font-size: 15px;">⭐️ ${g.points || 0} 點</strong>
          · 成員人數：<strong>${(g.memberUids || []).length}</strong> 人
        `;
      }
    }

    closeTransferModal() {
      this.closeModal('adminGroupTransferModal');
      this.currentTransferGroupId = null;
    }

    async confirmTransferPoints() {
      const groupId = this.currentTransferGroupId;
      if (!groupId) return;

      const methodEl = document.querySelector('input[name="groupTransferMethod"]:checked');
      const method = methodEl ? methodEl.value : 'split';

      const resetEl = document.getElementById('chkGroupTransferReset');
      const resetGroupPoints = resetEl ? resetEl.checked : true;

      const reasonEl = document.getElementById('groupTransferReasonInput');
      const reason = (reasonEl && reasonEl.value.trim()) || '小組積分結算分配';

      this.closeTransferModal();
      await this.transferGroupPointsToMembers(groupId, {
        method,
        reason,
        resetGroupPoints
      });
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  }

  window.GroupManager = GroupManager;
  window.groupManager = new GroupManager();

  document.addEventListener('board-ready', () => {
    if (window.app) {
      window.groupManager.init(window.app);
    }
  });
})();
