/**
 * Timer Background Music Manager (倒數計時背景音樂管理系統)
 * 支援功能：
 * 1. 線上編輯曲目（新增/編輯/刪除）
 * 2. 即時曲目搜尋過濾
 * 3. CSV 匯出 / 匯入（含 UTF-8 BOM 防 Excel 亂碼）
 * 4. 下載 CSV 範本檔
 * 5. 一鍵恢復原廠預設音樂清單
 * 6. 即時動態同步至倒數計時器背景音樂選單
 */
(function (global) {
  'use strict';

  function escapeCSVCell(val) {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      str = str.replace(/"/g, '""');
    }
    return `"${str}"`;
  }

  function parseCSVText(csvText) {
    if (!csvText) return [];
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.slice(1);
    }

    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;
    let i = 0;
    const len = csvText.length;

    while (i < len) {
      const char = csvText[i];
      const nextChar = i + 1 < len ? csvText[i + 1] : '';

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            currentCell += '"';
            i += 2;
            continue;
          } else {
            inQuotes = false;
            i++;
            continue;
          }
        } else {
          currentCell += char;
          i++;
          continue;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
          i++;
          continue;
        } else if (char === ',') {
          currentRow.push(currentCell.trim());
          currentCell = '';
          i++;
          continue;
        } else if (char === '\r' || char === '\n') {
          currentRow.push(currentCell.trim());
          if (currentRow.some(cell => cell.length > 0)) {
            rows.push(currentRow);
          }
          currentRow = [];
          currentCell = '';
          if (char === '\r' && nextChar === '\n') {
            i += 2;
          } else {
            i++;
          }
          continue;
        } else {
          currentCell += char;
          i++;
          continue;
        }
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
    }

    return rows;
  }

  const DEFAULT_TIMER_MUSIC = [
    { category: '巴洛克', title: '🎵 帕海貝爾 - 卡農 (YouTube)', url: 'https://www.youtube.com/watch?v=MnhXZRw_ATU&list=RDMnhXZRw_ATU&start_radio=1' },
    { category: '巴洛克', title: '🎵 英格蘭民謠 - 綠袖子', url: 'https://www.youtube.com/watch?v=GUrkvBPXmDQ' },
    { category: '巴洛克', title: '🎵 韓德爾 - 水上音樂', url: 'https://www.youtube.com/watch?v=1h4mAceHmrI' },
    { category: '巴洛克', title: '🎵 海頓 - 降E大調小號協奏曲「快板」', url: 'https://www.youtube.com/watch?v=Uum5rmPLVZw' },
    { category: '巴洛克', title: '🎵 巴哈 - 諧謔曲', url: 'https://www.youtube.com/watch?v=xVxwuirUX-M' },
    { category: '巴洛克', title: '🎵 韋瓦第 - 四季（春）', url: 'https://www.youtube.com/watch?v=k3AWRUYV9ds' },
    { category: '巴洛克', title: '🎵 莫札特 - G大調第13號小夜曲 K.525', url: 'https://www.youtube.com/watch?v=vG_FBIbGuvg' },
    { category: '古典鋼琴', title: '🎵 理查克萊德門 - 夢中的婚禮', url: 'https://www.youtube.com/watch?v=HJDLHuixqG8' },
    { category: '古典鋼琴', title: '🎵 理查克萊德門 - 給愛麗絲', url: 'https://www.youtube.com/watch?v=vDlqmTIw8y0' },
    { category: '台語經典', title: '🎵 經典台語 - 黃昏的故鄉', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA' },
    { category: '台語經典', title: '🎵 經典台語 - 望春風', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA&t=224s' },
    { category: '台語經典', title: '🎵 經典台語 - 河邊春夢', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA&t=379s' },
    { category: '台語經典', title: '🎵 經典台語 - 雨夜花', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA&t=646s' },
    { category: '台語經典', title: '🎵 經典台語 - 一支小雨傘', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA&t=783s' },
    { category: '台語經典', title: '🎵 經典台語 - 風醉雨也醉', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA&t=980s' },
    { category: '台語經典', title: '🎵 經典台語 - 雪中紅', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA&t=1466s' },
    { category: '台語經典', title: '🎵 經典台語 - 舊情也綿綿', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA&t=1687s' },
    { category: '台語經典', title: '🎵 經典台語 - 無字的情批', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA&t=1994s' },
    { category: '台語經典', title: '🎵 經典台語 - 繁華攏是夢', url: 'https://www.youtube.com/watch?v=lGbrMl8PAYA&t=2479s' }
  ];

  class TimerMusicManager {
    constructor() {
      this.STORAGE_KEY = 'timer_music_playlist_v4';
      this.searchKeyword = '';
      this.editingIndex = -1;
    }

    getDefaultPlaylist() {
      return JSON.parse(JSON.stringify(DEFAULT_TIMER_MUSIC));
    }

    getPlaylist() {
      try {
        const stored = window.boardStorage.local.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // 自動過濾已廢棄之本機版卡農與空曲目
            const cleaned = parsed.filter(item => item && item.url !== 'audio/canon.mp3' && !item.title?.includes('卡農 (本機版)'));
            if (cleaned.length !== parsed.length) {
              window.boardStorage.local.setItem(this.STORAGE_KEY, JSON.stringify(cleaned));
            }
            return cleaned;
          }
        }
        // 自動遷移舊版 v3 / v2 清單
        const oldStored = window.boardStorage.local.getItem('timer_music_playlist_v3') || window.boardStorage.local.getItem('timer_music_playlist_v2');
        if (oldStored) {
          const parsedOld = JSON.parse(oldStored);
          if (Array.isArray(parsedOld) && parsedOld.length > 0) {
            // 移除失效的 pixabay 連結以及移除本機曲目
            let filtered = parsedOld.filter(item => 
              !item.url.includes('pixabay') && 
              !item.url.includes('lofi.mp3') && 
              !item.url.includes('piano.mp3') &&
              item.url !== 'audio/canon.mp3' &&
              !item.title?.includes('卡農 (本機版)')
            );
            window.boardStorage.local.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
            return filtered;
          }
        }
      } catch (e) {
        console.warn('Failed to load stored timer music playlist', e);
      }
      return this.getDefaultPlaylist();
    }

    isCustomPlaylist() {
      try {
        return !!window.boardStorage.local.getItem(this.STORAGE_KEY);
      } catch (e) {
        return false;
      }
    }

    savePlaylist(list) {
      try {
        window.boardStorage.local.setItem(this.STORAGE_KEY, JSON.stringify(list));
        this.updateDropdown();
        return true;
      } catch (e) {
        console.error('Failed to save music playlist to localStorage', e);
        return false;
      }
    }

    resetPlaylist() {
      window.boardStorage.local.removeItem(this.STORAGE_KEY);
      this.updateDropdown();
    }

    searchPlaylist(query = '') {
      const list = this.getPlaylist();
      const q = (query || '').trim().toLowerCase();
      if (!q) return list.map((item, idx) => ({ ...item, _originalIndex: idx }));

      return list
        .map((item, idx) => ({ ...item, _originalIndex: idx }))
        .filter(item => {
          return (
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.category && item.category.toLowerCase().includes(q)) ||
            (item.url && item.url.toLowerCase().includes(q))
          );
        });
    }

    deleteTrack(originalIndex) {
      const list = this.getPlaylist();
      if (originalIndex >= 0 && originalIndex < list.length) {
        list.splice(originalIndex, 1);
        this.savePlaylist(list);
        return true;
      }
      return false;
    }

    saveTrack(trackData, originalIndex = -1) {
      const list = this.getPlaylist();
      if (originalIndex >= 0 && originalIndex < list.length) {
        list[originalIndex] = trackData;
      } else {
        list.push(trackData);
      }
      this.savePlaylist(list);
    }

    // 匯出音樂清單為 CSV 檔案
    exportCSV() {
      const list = this.getPlaylist();
      let csv = '\uFEFF'; // UTF-8 BOM
      csv += '曲目分類,曲目名稱,音樂網址\r\n';
      list.forEach(item => {
        const row = [
          item.category || '自訂音樂',
          item.title || '',
          item.url || ''
        ].map(escapeCSVCell).join(',');
        csv += row + '\r\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `倒數背景音樂清單_${new Date().toISOString().slice(0, 10)}.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // 下載音樂清單 CSV 範本檔
    downloadTemplate() {
      let csv = '\uFEFF';
      csv += '曲目分類,曲目名稱,音樂網址\r\n';
      csv += '"巴洛克","🎵 帕海貝爾 - 卡農 (YouTube)","https://www.youtube.com/watch?v=MnhXZRw_ATU"\r\n';
      csv += '"古典鋼琴","🎵 理查克萊德門 - 夢中的婚禮","https://www.youtube.com/watch?v=HJDLHuixqG8"\r\n';

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = '倒數背景音樂清單_範本.csv';
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // 從 CSV 解析並匯入音樂清單
    importCSV(csvText, mode = 'replace') {
      const rows = parseCSVText(csvText);
      if (rows.length < 2) {
        throw new Error('CSV 檔案為空或缺少有效資料列！');
      }

      const dataRows = rows.slice(1);
      const list = [];
      for (let i = 0; i < dataRows.length; i++) {
        const cols = dataRows[i];
        if (!cols || cols.length === 0 || cols.every(c => !c)) continue;

        const category = cols[0] || '自訂分類';
        const title = cols[1] || `音樂曲目 ${i + 1}`;
        const url = cols[2] || '';

        if (!url) {
          throw new Error(`第 ${i + 2} 行缺少「音樂網址」！`);
        }

        list.push({
          category: category.trim(),
          title: title.startsWith('🎵') ? title.trim() : `🎵 ${title.trim()}`,
          url: url.trim()
        });
      }

      if (list.length === 0) {
        throw new Error('未解析出任何有效曲目！');
      }

      let finalList = list;
      if (mode === 'append') {
        finalList = this.getPlaylist().concat(list);
      }

      this.savePlaylist(finalList);
      return finalList.length;
    }

    // 支援自動判斷 CSV 或 JSON 匯入
    importPlaylist(textContent, mode = 'replace') {
      const trimmed = (textContent || '').trim();
      if (!trimmed) throw new Error('匯入內容為空！');

      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        let data;
        try {
          data = JSON.parse(trimmed);
        } catch (e) {
          throw new Error('JSON 格式錯誤！');
        }
        if (!Array.isArray(data) || data.length === 0) throw new Error('JSON 資料必須為非空陣列！');
        const list = data.map((item, idx) => ({
          category: item.category || '自訂分類',
          title: item.title || `音樂曲目 ${idx + 1}`,
          url: item.url || item.src || ''
        })).filter(item => item.url);

        let finalList = list;
        if (mode === 'append') finalList = this.getPlaylist().concat(list);
        this.savePlaylist(finalList);
        return finalList.length;
      }

      return this.importCSV(trimmed, mode);
    }

    // 動態更新後台倒數計時器的背景音樂下拉選單
    updateDropdown(selectedUrl) {
      const select = document.getElementById('timerMusicSelect');
      if (!select) return;

      const currentVal = selectedUrl || select.value || 'https://www.youtube.com/watch?v=MnhXZRw_ATU&list=RDMnhXZRw_ATU&start_radio=1';
      const playlist = this.getPlaylist();

      // 依分類分組
      const groups = {};
      playlist.forEach(item => {
        const cat = item.category || '自訂音樂';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
      });

      let html = '';
      for (const [catName, tracks] of Object.entries(groups)) {
        html += `<optgroup label="── ${catName} ──">`;
        tracks.forEach(track => {
          const isSelected = track.url === currentVal ? 'selected' : '';
          html += `<option value="${track.url}" ${isSelected}>${track.title}</option>`;
        });
        html += `</optgroup>`;
      }
      html += `<option value="custom" ${currentVal === 'custom' ? 'selected' : ''}>✍️ 自訂 YouTube 網址...</option>`;

      select.innerHTML = html;
    }

    openModal() {
      const modal = document.getElementById('modal-timer-music-manager');
      if (!modal) return;
      modal.classList.add('active');
      modal.style.display = 'flex';
      this.searchKeyword = '';
      const searchInput = document.getElementById('timerMusicSearchInput');
      if (searchInput) searchInput.value = '';
      this.closeEditForm();
      this.renderList();
    }

    closeModal() {
      const modal = document.getElementById('modal-timer-music-manager');
      if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
          if (!modal.classList.contains('active')) {
            modal.style.display = 'none';
          }
        }, 150);
      }
      this.closeEditForm();
    }

    renderList() {
      const listContainer = document.getElementById('timerMusicListContainer');
      const countEl = document.getElementById('timerMusicCountBadge');
      if (!listContainer) return;

      const totalList = this.getPlaylist();
      const filtered = this.searchPlaylist(this.searchKeyword);
      const isCustom = this.isCustomPlaylist();

      if (countEl) {
        countEl.innerHTML = this.searchKeyword
          ? `🔍 搜尋符合：<strong>${filtered.length}</strong> / 全部 ${totalList.length} 首曲目 ${isCustom ? '(✨ 自訂清單)' : '(📚 官方預設清單)'}`
          : `🎵 曲目總計：<strong>${totalList.length}</strong> 首 ${isCustom ? '(✨ 自訂清單)' : '(📚 官方預設清單)'}`;
      }

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            <div style="font-size: 36px; margin-bottom: 8px;">📭</div>
            <div style="font-size: 15px; font-weight: bold;">查無符合「${this.searchKeyword}」的曲目</div>
            <div style="font-size: 12px; margin-top: 4px;">您可以清除搜尋關鍵字，或點選上方「➕ 新增曲目」！</div>
          </div>
        `;
        return;
      }

      let html = '';
      filtered.forEach((item, displayIdx) => {
        const origIdx = item._originalIndex;
        const isYT = item.url.includes('youtube.com') || item.url.includes('youtu.be');

        html += `
          <div class="timer-music-item-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                <span style="background: rgba(0,122,255,0.1); color: var(--accent-color); padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${item.category || '音樂'}</span>
                <span style="background: ${isYT ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}; color: ${isYT ? '#ef4444' : '#10b981'}; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">
                  ${isYT ? '📺 YouTube' : '🎵 MP3 直連'}
                </span>
                <span style="font-weight: bold; font-size: 15px; color: var(--text-primary);">
                  ${displayIdx + 1}. ${this.highlightText(item.title, this.searchKeyword)}
                </span>
              </div>
              <div style="font-size: 12px; color: var(--text-muted); word-break: break-all; margin-top: 4px;">
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: underline;">
                  ${item.url}
                </a>
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-shrink: 0;">
              <button type="button" onclick="window.timerMusicManager.openEditForm(${origIdx})" title="編輯曲目" style="background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-primary); padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">
                ✏️ 編輯
              </button>
              <button type="button" onclick="window.timerMusicManager.handleDelete(${origIdx})" title="刪除曲目" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">
                🗑️ 刪除
              </button>
            </div>
          </div>
        `;
      });

      listContainer.innerHTML = html;
    }

    highlightText(text, query) {
      if (!text) return '';
      if (!query) return String(text);
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return String(text).replace(regex, '<span style="background: #fef08a; color: #854d0e; padding: 0 2px; border-radius: 2px; font-weight:bold;">$1</span>');
    }

    handleSearchInput(val) {
      this.searchKeyword = val;
      this.renderList();
    }

    handleDelete(originalIndex) {
      const list = this.getPlaylist();
      const item = list[originalIndex];
      if (confirm(`確定要刪除曲目「${item.title}」嗎？`)) {
        this.deleteTrack(originalIndex);
        if (window.app && typeof window.app.showNotification === 'function') {
          window.app.showNotification('成功', '曲目已成功刪除！');
        }
        this.renderList();
      }
    }

    openEditForm(originalIndex = -1) {
      this.editingIndex = originalIndex;
      const formContainer = document.getElementById('timerMusicEditFormContainer');
      const formTitle = document.getElementById('timerMusicEditFormTitle');
      const catInput = document.getElementById('music_input_category');
      const titleInput = document.getElementById('music_input_title');
      const urlInput = document.getElementById('music_input_url');
      if (!formContainer) return;

      const isEdit = originalIndex >= 0;
      const list = this.getPlaylist();
      const item = isEdit ? list[originalIndex] : {};

      if (formTitle) {
        formTitle.textContent = isEdit ? '✏️ 編輯背景音樂曲目' : '➕ 新增背景音樂曲目';
      }
      if (catInput) catInput.value = item.category || '自訂音樂';
      if (titleInput) titleInput.value = item.title ? item.title.replace(/^🎵\s*/, '') : '';
      if (urlInput) urlInput.value = item.url || '';

      formContainer.style.display = 'block';
      formContainer.scrollIntoView({ behavior: 'smooth' });
    }

    closeEditForm() {
      const formContainer = document.getElementById('timerMusicEditFormContainer');
      if (formContainer) formContainer.style.display = 'none';
      this.editingIndex = -1;
    }

    handleSaveForm() {
      const catInput = document.getElementById('music_input_category')?.value.trim() || '自訂音樂';
      const rawTitle = document.getElementById('music_input_title')?.value.trim();
      const url = document.getElementById('music_input_url')?.value.trim();

      if (!rawTitle) {
        alert('請輸入曲目名稱！');
        return;
      }
      if (!url) {
        alert('請輸入音樂網址（YouTube 連結或 MP3 網址）！');
        return;
      }

      const title = rawTitle.startsWith('🎵') ? rawTitle : `🎵 ${rawTitle}`;
      const trackData = { category: catInput, title, url };

      this.saveTrack(trackData, this.editingIndex);
      if (window.app && typeof window.app.showNotification === 'function') {
        window.app.showNotification('成功', this.editingIndex >= 0 ? '曲目已更新！' : '新曲目已成功加入清單！');
      }

      this.closeEditForm();
      this.renderList();
    }

    openImportDialog() {
      const fileInput = document.getElementById('timerMusicFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }

    handleFileUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const count = this.importPlaylist(e.target.result, 'replace');
          if (window.app && typeof window.app.showNotification === 'function') {
            window.app.showNotification('成功', `成功匯入 ${count} 首背景音樂曲目！`);
          } else {
            alert(`成功匯入 ${count} 首曲目！`);
          }
          this.renderList();
        } catch (err) {
          alert('匯入失敗：' + err.message);
        }
      };
      reader.readAsText(file, 'UTF-8');
    }

    handleResetDefault() {
      if (confirm('確定要將背景音樂清單還原為官方原廠預設曲目嗎？所有自訂曲目將會被清除。')) {
        this.resetPlaylist();
        if (window.app && typeof window.app.showNotification === 'function') {
          window.app.showNotification('成功', '背景音樂清單已成功恢復為官方預設！');
        }
        this.renderList();
      }
    }
  }

  global.TimerMusicManager = TimerMusicManager;
  global.timerMusicManager = new TimerMusicManager();

  document.addEventListener('board-ready', () => {
    const modal = document.getElementById('modal-timer-music-manager');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          global.timerMusicManager.closeModal();
        }
      });
    }
  });

})(typeof window !== 'undefined' ? window : this);
