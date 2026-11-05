/**
 * Focus Question Bank Manager (專注力測驗題庫管理系統)
 * 支援單元：
 * 1. classicsQuiz: 📜 唐詩宋詞・成語典故 (選擇題)
 * 2. characterTest: ✍️ 一字千金：字力測驗 (手寫/輸入)
 * 3. characterCrossword: ✍️ 一字千金：字字珠璣 (十字選字)
 * 4. characterUnitedWords: ✍️ 一字千金：團結一詞 (部件組詞)
 * 
 * 支援 CSV (含 UTF-8 BOM 防亂碼) 與 JSON 雙格式匯入 / 匯出 / 範本下載
 */
(function (global) {
  'use strict';

  // 輔助函式：CSV 欄位轉義
  function escapeCSVCell(val) {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      str = str.replace(/"/g, '""');
    }
    return `"${str}"`;
  }

  // 輔助函式：強健的 CSV 解析器（支援雙引號、跨行換行、跳脫雙引號與 UTF-8 BOM）
  function parseCSVText(csvText) {
    if (!csvText) return [];
    // 移除 UTF-8 BOM
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

  class FocusQuestionBankManager {
    constructor() {
      this.STORAGE_PREFIX = 'focus_qb_v5_';
      this.currentActiveType = 'classicsQuiz';
      this.searchKeywords = {
        classicsQuiz: '',
        characterTest: '',
        characterCrossword: '',
        characterUnitedWords: '',
        songQuiz: ''
      };
      this.selectedTagFilters = {
        songQuiz: 'all'
      };
      this.editingIndex = -1;
    }

    // 解析歌單標籤字串或陣列為乾淨標籤陣列
    parseSongTags(raw) {
      if (!raw) return [];
      if (Array.isArray(raw)) {
        return raw.map(t => String(t).trim()).filter(Boolean);
      }
      if (typeof raw === 'string') {
        return raw.split(/[,，、/|]+/).map(t => t.trim()).filter(Boolean);
      }
      return [];
    }

    // 點擊快捷標籤時切換/增減歌曲標籤
    toggleSongQuizTag(tag) {
      const input = document.getElementById('qb_input_tag');
      if (!input) return;
      let tags = this.parseSongTags(input.value);
      if (tags.includes(tag)) {
        tags = tags.filter(t => t !== tag);
      } else {
        tags.push(tag);
      }
      input.value = tags.join(', ');
    }

    // 取得指定單元的原廠預設題庫
    getDefaultPool(type) {
      if (type === 'songQuiz') {
        const pool = (global.DEFAULT_SONG_QUIZ_POOL && Array.isArray(global.DEFAULT_SONG_QUIZ_POOL))
          ? global.DEFAULT_SONG_QUIZ_POOL
          : [];
        return JSON.parse(JSON.stringify(pool));
      }
      if (type === 'classicsQuiz') {
        const pool = (global.CLASSICS_QUIZ_POOL && Array.isArray(global.CLASSICS_QUIZ_POOL))
          ? global.CLASSICS_QUIZ_POOL
          : [];
        return JSON.parse(JSON.stringify(pool));
      }
      if (type === 'characterTest') {
        return (typeof CHARACTER_TEST_POOL !== 'undefined' && Array.isArray(CHARACTER_TEST_POOL))
          ? JSON.parse(JSON.stringify(CHARACTER_TEST_POOL))
          : [];
      }
      if (type === 'characterCrossword') {
        return (typeof CHARACTER_CROSSWORD_POOL !== 'undefined' && Array.isArray(CHARACTER_CROSSWORD_POOL))
          ? JSON.parse(JSON.stringify(CHARACTER_CROSSWORD_POOL))
          : [];
      }
      if (type === 'characterUnitedWords') {
        return (typeof CHARACTER_UNITED_WORDS_POOL !== 'undefined' && Array.isArray(CHARACTER_UNITED_WORDS_POOL))
          ? JSON.parse(JSON.stringify(CHARACTER_UNITED_WORDS_POOL))
          : [];
      }
      return [];
    }

    // 取得指定單元目前啟用的題庫（優先讀取 localStorage，若無則讀取原廠預設）
    getPool(type) {
      try {
        const stored = window.boardStorage.local.getItem(this.STORAGE_PREFIX + type);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (type === 'characterTest') {
              const defaults = this.getDefaultPool('characterTest');
              const zhuyinValid = /^[ㄅ-ㄩˊˇˋ˙]+$/;
              let updated = false;
              parsed.forEach((item, idx) => {
                const def = defaults[idx];
                const isCorrupted = !item.char || item.char.length !== 1 || /[ㄅ-ㄩ&]/.test(item.char) || !item.zhuyin || !zhuyinValid.test(item.zhuyin);
                if (def && (isCorrupted || (item.searchWord === def.searchWord && (item.zhuyin !== def.zhuyin || item.clue !== def.clue || item.char !== def.char)))) {
                  item.char = def.char;
                  item.zhuyin = def.zhuyin;
                  item.clue = def.clue;
                  item.searchWord = def.searchWord;
                  updated = true;
                }
              });
              if (updated) {
                try {
                  window.boardStorage.local.setItem(this.STORAGE_PREFIX + type, JSON.stringify(parsed));
                } catch (e) {}
              }
            }
            if (type === 'songQuiz') {
              const defaults = this.getDefaultPool('songQuiz');
              const existingIds = new Set(parsed.map(s => s.id || s.title));
              let updated = false;
              defaults.forEach(def => {
                const key = def.id || def.title;
                if (!existingIds.has(key)) {
                  parsed.push(def);
                  updated = true;
                }
              });
              const defMap = new Map();
              defaults.forEach(d => {
                if (d.id) defMap.set(d.id, d);
                if (d.title) defMap.set(d.title, d);
              });
              parsed.forEach(item => {
                const def = defMap.get(item.id) || defMap.get(item.title);
                if (def && def.tag && def.tag !== item.tag) {
                  const defTags = this.parseSongTags(def.tags || def.tag);
                  const curTags = this.parseSongTags(item.tags || item.tag);
                  const combined = Array.from(new Set([...curTags, ...defTags]));
                  if (combined.length !== curTags.length) {
                    item.tag = combined.join(', ');
                    item.tags = combined;
                    updated = true;
                  }
                }
              });
              if (updated) {
                try {
                  window.boardStorage.local.setItem(this.STORAGE_PREFIX + type, JSON.stringify(parsed));
                } catch (e) {}
              }
            }
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to load stored question bank for ' + type, e);
      }
      return this.getDefaultPool(type);
    }

    // 檢查目前是否為自訂題庫
    isCustomPool(type) {
      try {
        const stored = window.boardStorage.local.getItem(this.STORAGE_PREFIX + type);
        return !!stored;
      } catch (e) {
        return false;
      }
    }

    // 儲存題庫至 localStorage
    savePool(type, pool) {
      try {
        window.boardStorage.local.setItem(this.STORAGE_PREFIX + type, JSON.stringify(pool));
        this.updateAdminBadge(type);
        return true;
      } catch (e) {
        console.error('Failed to save question bank to localStorage', e);
        return false;
      }
    }

    // 恢復原廠預設題庫
    resetPool(type) {
      window.boardStorage.local.removeItem(this.STORAGE_PREFIX + type);
      this.updateAdminBadge(type);
    }

    // 取得單元中文名稱
    getTypeName(type) {
      const names = {
        classicsQuiz: '成語與佳句名言典故',
        characterTest: '一字千金：字力測驗',
        characterCrossword: '一字千金：字字珠璣',
        characterUnitedWords: '一字千金：團結一詞',
        songQuiz: '聽歌搶答：歌曲辨曲'
      };
      return names[type] || type;
    }

    // 標準化題型物件屬性（兼容原廠內建題庫與匯入自訂格式）
    normalizeItem(type, item) {
      if (!item) return {};

      if (type === 'classicsQuiz') {
        const prompt = item.prompt || `「${item.quote || item.title}」是出自？`;
        const isAuthorQuestion = item.id?.includes('author') || item.id?.includes('person') || prompt.includes('作者') || prompt.includes('主角');
        const answer = item.correctOption || item.answer || '';
        const title = item.work || item.title || '';
        const quote = item.quote || item.title || prompt;
        const author = item.author || (item.explanation ? item.explanation.replace(/.*?出自.*?代(.*?)〈.*/, '$1') : '');
        const category = item.category || (item.author ? '名句典故' : '成語典故');
        const typeBadge = isAuthorQuestion ? '✍️ 問作者/主角' : '📜 問出處/作品';

        return {
          id: item.id || `q_${Date.now()}`,
          category,
          typeBadge,
          prompt,
          quote,
          title,
          work: title,
          author,
          dynasty: item.dynasty || '',
          options: item.options || [answer],
          answer,
          correctOption: answer,
          explanation: item.explanation || item.fullPoem || '',
          fullPoem: item.fullPoem || item.explanation || quote,
          links: item.links || item.reference || {}
        };
      }

      if (type === 'characterTest') {
        return {
          char: item.char || '',
          zhuyin: item.zhuyin || '',
          clue: item.clue || '',
          searchWord: item.searchWord || ''
        };
      }

      if (type === 'characterCrossword') {
        const centerChar = item.char || item.centerChar || '';
        let surroundingChars = [];
        let combinedWords = [];

        if (Array.isArray(item.surrounding) && item.surrounding.length >= 4) {
          surroundingChars = item.surrounding.map(s => typeof s === 'string' ? s : (s.char || ''));
          combinedWords = item.surrounding.map(s => {
            const c = typeof s === 'string' ? s : s.char;
            const pos = typeof s === 'object' ? s.pos : 'after';
            return pos === 'before' ? `${c}${centerChar}` : `${centerChar}${c}`;
          });
        } else {
          const top = item.topWord || '';
          const bottom = item.bottomWord || '';
          const left = item.leftWord || '';
          const right = item.rightWord || '';
          surroundingChars = [top, bottom, left, right].filter(Boolean);
          combinedWords = [
            top ? `${top}${centerChar}` : '',
            bottom ? `${bottom}${centerChar}` : '',
            left ? `${centerChar}${left}` : '',
            right ? `${centerChar}${right}` : ''
          ].filter(Boolean);
        }

        return {
          char: centerChar,
          centerChar: centerChar,
          zhuyin: item.zhuyin || '',
          surroundingChars,
          combinedWords,
          topWord: surroundingChars[0] || '',
          bottomWord: surroundingChars[1] || '',
          leftWord: surroundingChars[2] || '',
          rightWord: surroundingChars[3] || '',
          searchWord: item.searchWord || combinedWords.join('、')
        };
      }

      if (type === 'characterUnitedWords') {
        const word = item.targetWord || item.word || (item.chars ? item.chars.join('') : '');
        const parts = Array.isArray(item.components)
          ? item.components
          : (Array.isArray(item.parts) ? item.parts : (item.p1 && item.p2 ? (item.p1 + item.p2).split('') : []));

        return {
          word,
          targetWord: word,
          parts,
          components: parts,
          clue: item.clue || '',
          searchWord: item.searchWord || word
        };
      }

      if (type === 'songQuiz') {
        const title = (item.title || item.name || '').trim();
        const artist = (item.artist || item.singer || '').trim();
        const rawTag = item.tags || item.tag || item.category || '懷舊經典';
        const tags = this.parseSongTags(rawTag);
        const tag = tags.join(', ') || '精選歌單';
        const youtubeUrl = (item.youtubeUrl || item.url || '').trim();
        let youtubeId = (item.youtubeId || '').trim();
        if (!youtubeId && youtubeUrl) {
          const match = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
          if (match && match[1]) youtubeId = match[1];
        }
        const startTime = Math.max(0, parseInt(item.startTime) || 0);
        const duration = Math.max(5, Math.min(120, parseInt(item.duration) || 60));
        let options = Array.isArray(item.options) ? item.options.filter(Boolean) : [];
        if (options.length === 0 && title) {
          options = [title];
        }
        if (options.length < 4 && global.DEFAULT_SONG_QUIZ_POOL) {
          const others = global.DEFAULT_SONG_QUIZ_POOL
            .map(s => s.title)
            .filter(t => t && t !== title && !options.includes(t));
          while (options.length < 4 && others.length > 0) {
            const rand = others.splice(Math.floor(Math.random() * others.length), 1)[0];
            options.push(rand);
          }
        }
        if (!options.includes(title) && title) {
          options[0] = title;
        }
        const clue = (item.clue || item.hint || item.description || '').trim();
        return {
          id: item.id || `song_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          tag,
          tags: tags.length > 0 ? tags : [tag],
          title,
          artist,
          youtubeUrl: youtubeUrl || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : ''),
          youtubeId,
          startTime,
          duration,
          options,
          clue
        };
      }

      return item;
    }

    // 關鍵字搜尋過濾
    searchPool(type, query = '') {
      const pool = this.getPool(type);
      const q = (query || '').trim().toLowerCase();
      const selectedTag = (this.selectedTagFilters && this.selectedTagFilters[type]) || 'all';

      if (!q && selectedTag === 'all') {
        return pool.map((item, idx) => ({ ...this.normalizeItem(type, item), _originalIndex: idx }));
      }

      return pool
        .map((item, idx) => ({ ...this.normalizeItem(type, item), _originalIndex: idx }))
        .filter((norm) => {
          if (type === 'songQuiz' && selectedTag !== 'all') {
            const itemTags = norm.tags || this.parseSongTags(norm.tag);
            if (!itemTags.includes(selectedTag)) return false;
          }
          if (!q) return true;

          if (type === 'songQuiz') {
            return (
              (norm.title && norm.title.toLowerCase().includes(q)) ||
              (norm.artist && norm.artist.toLowerCase().includes(q)) ||
              (norm.tag && norm.tag.toLowerCase().includes(q)) ||
              (norm.clue && norm.clue.toLowerCase().includes(q)) ||
              (norm.options && norm.options.join(' ').toLowerCase().includes(q))
            );
          }
          if (type === 'classicsQuiz') {
            return (
              (norm.title && norm.title.toLowerCase().includes(q)) ||
              (norm.author && norm.author.toLowerCase().includes(q)) ||
              (norm.quote && norm.quote.toLowerCase().includes(q)) ||
              (norm.prompt && norm.prompt.toLowerCase().includes(q)) ||
              (norm.answer && norm.answer.toLowerCase().includes(q)) ||
              (norm.explanation && norm.explanation.toLowerCase().includes(q)) ||
              (norm.options && norm.options.join(' ').toLowerCase().includes(q))
            );
          }
          if (type === 'characterTest') {
            return (
              (norm.char && norm.char.toLowerCase().includes(q)) ||
              (norm.zhuyin && norm.zhuyin.toLowerCase().includes(q)) ||
              (norm.clue && norm.clue.toLowerCase().includes(q)) ||
              (norm.searchWord && norm.searchWord.toLowerCase().includes(q))
            );
          }
          if (type === 'characterCrossword') {
            return (
              (norm.centerChar && norm.centerChar.toLowerCase().includes(q)) ||
              (norm.surroundingChars && norm.surroundingChars.join('').toLowerCase().includes(q)) ||
              (norm.combinedWords && norm.combinedWords.join(' ').toLowerCase().includes(q)) ||
              (norm.searchWord && norm.searchWord.toLowerCase().includes(q))
            );
          }
          if (type === 'characterUnitedWords') {
            return (
              (norm.word && norm.word.toLowerCase().includes(q)) ||
              (norm.parts && norm.parts.join('').toLowerCase().includes(q)) ||
              (norm.clue && norm.clue.toLowerCase().includes(q))
            );
          }
          return false;
        });
    }

    // 匯出題庫為 CSV 檔案（內嵌 UTF-8 BOM 防 Excel 亂碼）
    exportPool(type) {
      const pool = this.getPool(type);
      let csvContent = '\uFEFF'; // UTF-8 BOM

      if (type === 'classicsQuiz') {
        csvContent += '題型,題目問句,名句引言,作品名,作者或主角,朝代,選項A,選項B,選項C,選項D,標準答案,原典全文\r\n';
        pool.forEach(rawItem => {
          const item = this.normalizeItem(type, rawItem);
          const opts = item.options || ['', '', '', ''];
          const row = [
            item.category || '名句典故',
            item.prompt || '',
            item.quote || '',
            item.title || '',
            item.author || '',
            item.dynasty || '',
            opts[0] || '',
            opts[1] || '',
            opts[2] || '',
            opts[3] || '',
            item.answer || '',
            item.fullPoem || ''
          ].map(escapeCSVCell).join(',');
          csvContent += row + '\r\n';
        });
      } else if (type === 'characterTest') {
        csvContent += '解答正字,注音,題幹提示,字典關聯詞\r\n';
        pool.forEach(rawItem => {
          const item = this.normalizeItem(type, rawItem);
          const row = [
            item.char || '',
            item.zhuyin || '',
            item.clue || '',
            item.searchWord || ''
          ].map(escapeCSVCell).join(',');
          csvContent += row + '\r\n';
        });
      } else if (type === 'characterCrossword') {
        csvContent += '中心正字,注音,周圍字1(上或前),周圍字2(下或前),周圍字3(左或後),周圍字4(右或後),組成詞語說明\r\n';
        pool.forEach(rawItem => {
          const item = this.normalizeItem(type, rawItem);
          const surr = item.surroundingChars || [];
          const row = [
            item.centerChar || '',
            item.zhuyin || '',
            surr[0] || '',
            surr[1] || '',
            surr[2] || '',
            surr[3] || '',
            (item.combinedWords && item.combinedWords.length > 0) ? item.combinedWords.join('、') : (item.searchWord || '')
          ].map(escapeCSVCell).join(',');
          csvContent += row + '\r\n';
        });
      } else if (type === 'characterUnitedWords') {
        csvContent += '解答詞語,散裝部件(以空格分開),詞語解釋提示\r\n';
        pool.forEach(rawItem => {
          const item = this.normalizeItem(type, rawItem);
          const row = [
            item.word || '',
            (item.parts || []).join(' '),
            item.clue || ''
          ].map(escapeCSVCell).join(',');
          csvContent += row + '\r\n';
        });
      } else if (type === 'songQuiz') {
        csvContent += '標籤分組,歌曲名稱(正解),演唱者,YouTube網址,開始播放秒數,播放秒數,干擾選項1,干擾選項2,干擾選項3,提示說明\r\n';
        pool.forEach(rawItem => {
          const item = this.normalizeItem(type, rawItem);
          const distractors = (item.options || []).filter(o => o !== item.title);
          const row = [
            item.tag || '懷舊經典',
            item.title || '',
            item.artist || '',
            item.youtubeUrl || '',
            item.startTime ?? 0,
            item.duration ?? 60,
            distractors[0] || '',
            distractors[1] || '',
            distractors[2] || '',
            item.clue || ''
          ].map(escapeCSVCell).join(',');
          csvContent += row + '\r\n';
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${type}_題庫清單_${new Date().toISOString().slice(0, 10)}.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // 取得 CSV 範本文字（內嵌 UTF-8 BOM）
    getCSVTemplateContent(type) {
      let content = '\uFEFF';
      if (type === 'classicsQuiz') {
        content += '題型,題目問句,名句引言,作品名,作者或主角,朝代,選項A,選項B,選項C,選項D,標準答案,原典全文\r\n';
        content += '"名句典故","「好學近乎知，力行近乎仁，知恥近乎勇。」是出自？","好學近乎知，力行近乎仁，知恥近乎勇。","中庸","子思","先秦","子思－〈中庸〉","孔子－〈論語〉","孟子－〈孟子〉","荀子－〈荀子〉","子思－〈中庸〉","好學近乎知，力行近乎仁，知恥近乎勇。知斯三者，則知所以修身；知所以修身，則知所以治人；知所以治人，則知所以治天下國家矣。"\r\n';
        content += '"成語典故","「蛇固無足，子安能為之足？」出自哪一個著名成語典故？","蛇固無足，子安能為之足？","畫蛇添足","劉向","西漢","畫蛇添足","掩耳盜鈴","亡羊補牢","自相矛盾","畫蛇添足","楚有祠者，賜其舍人卮酒。舍人相謂曰：「數人飲之不足，一人飲之有餘。請畫地為蛇，先成者飲酒。」一人蛇先成，引酒且飲之，乃左手持卮，右手畫蛇，曰：「吾能為之足。」未成，一人之蛇成，奪其卮曰：「蛇固無足，子安能為之足？」遂飲其酒。為蛇足者，終亡其酒。"\r\n';
      } else if (type === 'characterTest') {
        content += '解答正字,注音,題幹提示,字典關聯詞\r\n';
        content += '"足","ㄗㄨˊ","畫蛇添（　）","畫蛇添足"\r\n';
        content += '"兔","ㄊㄨˋ","守株待（　）","守株待兔"\r\n';
        content += '"牢","ㄌㄠˊ","亡羊補（　）","亡羊補牢"\r\n';
      } else if (type === 'characterCrossword') {
        content += '中心正字,注音,周圍字1(上或前),周圍字2(下或前),周圍字3(左或後),周圍字4(右或後),組成詞語說明\r\n';
        content += '"天","ㄊㄧㄢ","今","明","氣","空","今天、明天、天氣、天空"\r\n';
        content += '"風","ㄈㄥ","颱","微","雨","景","颱風、微風、風雨、風景"\r\n';
      } else if (type === 'characterUnitedWords') {
        content += '解答詞語,散裝部件(以空格分開),詞語解釋提示\r\n';
        content += '"明月","日 月 月","形容夜空中明亮的月亮"\r\n';
        content += '"森林","木 木 木 木 木","大片生長樹木的廣大土地"\r\n';
      } else if (type === 'songQuiz') {
        content += '標籤分組,歌曲名稱(正解),演唱者,YouTube網址,開始播放秒數,播放秒數,干擾選項1,干擾選項2,干擾選項3,提示說明\r\n';
        content += '"懷舊經典","月亮代表我的心","鄧麗君","https://www.youtube.com/watch?v=bv_cEeDlop0",30,60,"甜蜜蜜","夜來香","何日君再來","1977年華語傳世經典情歌"\r\n';
        content += '"熱門流行","晴天","周杰倫","https://www.youtube.com/watch?v=DYptgVvkVLQ",28,60,"不能說的秘密","七里香","簡單愛","收錄於2003年葉惠美專輯"\r\n';
        content += '"動漫神曲","殘酷天使的行動綱領","高橋洋子","https://www.youtube.com/watch?v=o6wtDPVkKqI",10,60,"魂之輪迴","直到世界的盡頭","前前前世","新世紀福音戰士經典主題曲"\r\n';
        content += '"童謠兒歌","拔蘿蔔","傳統童謠","https://www.youtube.com/watch?v=rwth9dQS1oM",0,60,"兩隻老虎","泥娃娃","小星星","經典幼兒同樂童謠"\r\n';
        content += '"影視金曲","那些年","胡夏","https://www.youtube.com/watch?v=KqjgLbKZ1h0",35,60,"小幸運","刻在我心底的名字","修煉愛情","那些年我們一起追的女孩電影主題曲"\r\n';
      }
      return content;
    }

    // 下載標準 CSV 範本檔案
    downloadTemplate(type) {
      const csvContent = this.getCSVTemplateContent(type);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${type}_範本.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // 從 CSV 解析並匯入題庫
    importPoolFromCSV(type, csvText, mode = 'replace') {
      const rows = parseCSVText(csvText);
      if (rows.length < 2) {
        throw new Error('CSV 檔案內容為空或缺少資料行（至少需包含表頭與一筆題目）！');
      }

      // 跳過第一行表頭
      const dataRows = rows.slice(1);
      const validatedList = [];

      for (let i = 0; i < dataRows.length; i++) {
        const cols = dataRows[i];
        if (!cols || cols.length === 0 || cols.every(c => !c)) continue; // 略過空白行

        if (type === 'classicsQuiz') {
          // 欄位：題型, 題目問句, 名句引言, 作品名, 作者或主角, 朝代, 選項A, 選項B, 選項C, 選項D, 標準答案, 原典全文
          const category = cols[0] || '名句典故';
          const prompt = cols[1] || '';
          const quote = cols[2] || cols[3] || prompt;
          const title = cols[3] || quote;
          const author = cols[4] || '';
          const dynasty = cols[5] || '';
          const optA = cols[6] || '';
          const optB = cols[7] || '';
          const optC = cols[8] || '';
          const optD = cols[9] || '';
          const answer = cols[10] || '';
          const fullPoem = cols[11] || quote;

          if (!answer) {
            throw new Error(`第 ${i + 2} 行題目缺少「標準答案」欄位！`);
          }
          if (!prompt && !quote && !title) {
            throw new Error(`第 ${i + 2} 行題目缺少「題目問句」或「作品/名句」！`);
          }

          let options = [optA, optB, optC, optD].filter(Boolean);
          if (options.length < 4) {
            options = [answer, '李白', '杜甫', '蘇軾'].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4);
          }
          if (!options.includes(answer)) {
            options[0] = answer;
          }

          validatedList.push({
            id: `custom_csv_${Date.now()}_${i}`,
            category,
            type: author ? 'poetry' : 'idiom',
            title,
            work: title,
            author,
            dynasty,
            quote,
            prompt: prompt || `「${quote}」出自？`,
            options,
            answer,
            correctOption: answer,
            fullPoem,
            explanation: fullPoem || `正解為：${answer}`,
            links: {
              sinoreading: `https://www.google.com/search?q=${encodeURIComponent(title + ' 中讀網')}`,
              wikisource: `https://zh.wikisource.org/wiki/${encodeURIComponent(title)}`,
              wikipedia: `https://zh.wikipedia.org/wiki/${encodeURIComponent(title)}`
            }
          });
        } else if (type === 'characterTest') {
          // 欄位：解答正字, 注音, 題幹提示, 字典關聯詞
          const char = cols[0] || '';
          const zhuyin = cols[1] || '';
          const clue = cols[2] || '';
          const searchWord = cols[3] || '';

          if (!char || !clue) {
            throw new Error(`第 ${i + 2} 行缺少「解答正字」或「題幹提示」！`);
          }

          validatedList.push({
            char: char.trim(),
            zhuyin: zhuyin.trim(),
            clue: clue.trim(),
            searchWord: (searchWord || clue.replace(/[（(].*?[）)]/g, char)).trim()
          });
        } else if (type === 'characterCrossword') {
          // 欄位：中心正字, 注音, 周圍字1, 周圍字2, 周圍字3, 周圍字4, 組成詞語說明
          const centerChar = cols[0] || '';
          const zhuyin = cols[1] || '';
          const w1 = cols[2] || '前';
          const w2 = cols[3] || '後';
          const w3 = cols[4] || '左';
          const w4 = cols[5] || '右';
          const searchWord = cols[6] || '';

          if (!centerChar) {
            throw new Error(`第 ${i + 2} 行缺少「中心正字」！`);
          }

          const surrounding = [
            { char: w1.trim(), pos: 'before' },
            { char: w2.trim(), pos: 'before' },
            { char: w3.trim(), pos: 'after' },
            { char: w4.trim(), pos: 'after' }
          ];

          validatedList.push({
            char: centerChar.trim(),
            centerChar: centerChar.trim(),
            zhuyin: zhuyin.trim(),
            surrounding,
            searchWord: searchWord.trim()
          });
        } else if (type === 'characterUnitedWords') {
          // 欄位：解答詞語, 散裝部件(以空格分開), 詞語解釋提示
          const word = cols[0] || '';
          const partsStr = cols[1] || '';
          const clue = cols[2] || '';

          if (!word) {
            throw new Error(`第 ${i + 2} 行缺少「解答詞語」！`);
          }

          const parts = partsStr.split(/[\s,，、+]+/).filter(Boolean);
          validatedList.push({
            targetWord: word.trim(),
            word: word.trim(),
            components: parts.length > 0 ? parts : word.trim().split(''),
            parts: parts.length > 0 ? parts : word.trim().split(''),
            clue: clue.trim(),
            searchWord: word.trim()
          });
        } else if (type === 'songQuiz') {
          // 欄位：標籤分組,歌曲名稱(正解),演唱者,YouTube網址,開始播放秒數,播放秒數,干擾選項1,干擾選項2,干擾選項3,提示說明
          const tag = cols[0] || '精選歌單';
          const title = cols[1] || '';
          const artist = cols[2] || '';
          const youtubeUrl = cols[3] || '';
          const startTime = parseInt(cols[4]) || 0;
          const duration = parseInt(cols[5]) || 60;
          const d1 = cols[6] || '';
          const d2 = cols[7] || '';
          const d3 = cols[8] || '';
          const clue = cols[9] || '';

          if (!title) {
            throw new Error(`第 ${i + 2} 行缺少「歌曲名稱(正解)」！`);
          }

          let options = [title, d1, d2, d3].filter(Boolean);
          // 補足4個選項
          let optFill = 1;
          while (options.length < 4) {
            options.push(`其他推薦歌曲 ${optFill++}`);
          }

          let youtubeId = '';
          if (youtubeUrl) {
            const match = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
            if (match && match[1]) youtubeId = match[1];
          }

          validatedList.push({
            id: `song_csv_${Date.now()}_${i}`,
            tag: tag.trim(),
            title: title.trim(),
            artist: artist.trim(),
            youtubeUrl: youtubeUrl.trim(),
            youtubeId: youtubeId || youtubeUrl.trim(),
            startTime,
            duration,
            options,
            clue: clue.trim()
          });
        }
      }

      if (validatedList.length === 0) {
        throw new Error('CSV 檔案中未解析出任何有效題目！');
      }

      let finalPool = validatedList;
      if (mode === 'append') {
        const current = this.getPool(type);
        finalPool = current.concat(validatedList);
      }

      this.savePool(type, finalPool);
      return finalPool.length;
    }

    // 支援自動判斷 CSV 或 JSON 格式並匯入
    importPool(type, textContent, mode = 'replace') {
      const trimmed = (textContent || '').trim();
      if (!trimmed) {
        throw new Error('匯入內容為空！');
      }

      // 若以 [ 或 { 開頭則以 JSON 解析
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        let data;
        try {
          data = JSON.parse(trimmed);
        } catch (e) {
          throw new Error('JSON 語法錯誤！');
        }
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('JSON 資料必須為非空的陣列！');
        }
        const validatedList = data.map(item => this.normalizeItem(type, item));
        let finalPool = validatedList;
        if (mode === 'append') {
          const current = this.getPool(type);
          finalPool = current.concat(validatedList);
        }
        this.savePool(type, finalPool);
        return finalPool.length;
      }

      // 否則以標準 CSV 解析
      return this.importPoolFromCSV(type, trimmed, mode);
    }

    // 刪除指定索引之題目
    deleteQuestion(type, originalIndex) {
      const pool = this.getPool(type);
      if (originalIndex >= 0 && originalIndex < pool.length) {
        pool.splice(originalIndex, 1);
        this.savePool(type, pool);
        return true;
      }
      return false;
    }

    // 新增或儲存題目
    saveQuestion(type, questionData, originalIndex = -1) {
      const pool = this.getPool(type);
      if (originalIndex >= 0 && originalIndex < pool.length) {
        pool[originalIndex] = questionData;
      } else {
        pool.unshift(questionData); // 新增在最前面
      }
      this.savePool(type, pool);
    }

    // 更新管理後台的題庫狀態徽章
    updateAdminBadge(type) {
      const badge = document.getElementById(`focusQbBadge_${type}`);
      if (badge) {
        const pool = this.getPool(type);
        const isCustom = this.isCustomPool(type);
        badge.innerHTML = isCustom
          ? `<span style="background: #10b981; color: white; padding: 3px 9px; border-radius: 12px; font-size: 11px; font-weight: bold; box-shadow: 0 1px 4px rgba(16,185,129,0.25);">✨ 自訂題庫：共 ${pool.length} 題</span>`
          : `<span style="background: var(--accent-color); color: white; padding: 3px 9px; border-radius: 12px; font-size: 11px; font-weight: bold;">📚 官方預設題庫：共 ${pool.length} 題</span>`;
      }
    }

    // 開啟題庫管理中心彈窗
    openModal(type = 'classicsQuiz') {
      this.currentActiveType = type;
      const modal = document.getElementById('modal-focus-question-bank');
      if (!modal) return;
      modal.classList.add('active');
      modal.style.display = 'flex';
      this.switchTab(type);
    }

    // 關閉題庫管理中心彈窗
    closeModal() {
      const modal = document.getElementById('modal-focus-question-bank');
      if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
          if (!modal.classList.contains('active')) {
            modal.style.display = 'none';
          }
        }, 150);
      }
      this.closeQuestionEditForm();
    }

    // 切換彈窗內的單元頁籤
    switchTab(type) {
      this.currentActiveType = type;
      this.editingIndex = -1;
      this.closeQuestionEditForm();

      const tabs = document.querySelectorAll('.focus-qb-tab-btn');
      tabs.forEach((tab) => {
        if (tab.dataset.type === type) {
          tab.classList.add('active');
          tab.style.background = 'var(--accent-color)';
          tab.style.color = '#ffffff';
          tab.style.borderColor = 'var(--accent-color)';
        } else {
          tab.classList.remove('active');
          tab.style.background = 'var(--bg-card)';
          tab.style.color = 'var(--text-primary)';
          tab.style.borderColor = 'var(--border-color)';
        }
      });

      const searchInput = document.getElementById('focusQbSearchInput');
      if (searchInput) {
        searchInput.value = this.searchKeywords[type] || '';
      }

      this.updateTagFilterSelect(type);
      this.renderList();
    }

    // 取得指定單元目前所有不重複的標籤清單
    getAllTags(type = this.currentActiveType) {
      const pool = this.getPool(type);
      const tags = new Set();
      pool.forEach(raw => {
        const item = this.normalizeItem(type, raw);
        if (type === 'songQuiz') {
          const itemTags = item.tags || this.parseSongTags(item.tag);
          itemTags.forEach(t => { if (t) tags.add(t); });
        } else {
          if (item.tag) tags.add(item.tag);
        }
      });
      return Array.from(tags);
    }

    // 處理標籤篩選切換
    handleTagFilter(val) {
      if (!this.selectedTagFilters) this.selectedTagFilters = {};
      this.selectedTagFilters[this.currentActiveType] = val;
      this.renderList();
    }

    // 更新題庫管理彈窗工具列之標籤篩選器
    updateTagFilterSelect(type = this.currentActiveType) {
      const wrapper = document.getElementById('focusQbTagFilterWrapper');
      const select = document.getElementById('focusQbTagFilterSelect');
      if (!wrapper || !select) return;

      if (type === 'songQuiz') {
        wrapper.style.display = 'flex';
        const tags = this.getAllTags('songQuiz');
        const currentTag = (this.selectedTagFilters && this.selectedTagFilters.songQuiz) || 'all';
        let html = `<option value="all" ${currentTag === 'all' ? 'selected' : ''}>🏷️ 全部標籤歌單 (全部 ${this.getPool('songQuiz').length} 首)</option>`;
        tags.forEach(tag => {
          const count = this.getPool('songQuiz').filter(raw => {
            const item = this.normalizeItem('songQuiz', raw);
            const itemTags = item.tags || this.parseSongTags(item.tag);
            return itemTags.includes(tag);
          }).length;
          html += `<option value="${tag}" ${currentTag === tag ? 'selected' : ''}>🏷️ ${tag} (${count} 首)</option>`;
        });
        select.innerHTML = html;
      } else {
        wrapper.style.display = 'none';
      }
    }

    // 渲染題目清單
    renderList() {
      const type = this.currentActiveType;
      const query = this.searchKeywords[type] || '';
      const listContainer = document.getElementById('focusQbListContainer');
      const countEl = document.getElementById('focusQbCountBadge');
      if (!listContainer) return;

      const totalPool = this.getPool(type);
      const filtered = this.searchPool(type, query);
      const isCustom = this.isCustomPool(type);

      if (countEl) {
        countEl.innerHTML = query
          ? `🔍 搜尋符合：<strong>${filtered.length}</strong> / 全部 ${totalPool.length} 題 ${isCustom ? '(✨ 自訂題庫)' : '(📚 官方預設題庫)'}`
          : `📚 題庫總計：<strong>${totalPool.length}</strong> 題 ${isCustom ? '(✨ 自訂題庫)' : '(📚 官方預設題庫)'}`;
      }

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            <div style="font-size: 36px; margin-bottom: 8px;">📭</div>
            <div style="font-size: 15px; font-weight: bold;">查無符合「${query}」的題目</div>
            <div style="font-size: 12px; margin-top: 4px;">您可以清除搜尋關鍵字，或點選上方「➕ 新增題目」！</div>
          </div>
        `;
        return;
      }

      let html = '';
      filtered.forEach((item, displayIdx) => {
        const origIdx = item._originalIndex;
        let contentHtml = '';

        if (type === 'classicsQuiz') {
          const badgeBg = item.typeBadge.includes('作者') ? 'rgba(0,122,255,0.1)' : 'rgba(16,185,129,0.1)';
          const badgeColor = item.typeBadge.includes('作者') ? 'var(--accent-color)' : '#10b981';

          contentHtml = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
              <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${item.typeBadge}</span>
              <span style="font-weight: bold; font-size: 15px; color: var(--text-primary);">
                ${displayIdx + 1}. ${this.highlightText(item.prompt, query)}
              </span>
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 6px;">
              ${item.title ? `<span><strong>出處作品：</strong>${this.highlightText(item.title, query)}</span>` : ''}
              ${item.author ? `<span><strong>作者/主角：</strong>${this.highlightText(item.author, query)}${item.dynasty ? ` (${item.dynasty})` : ''}</span>` : ''}
              <span style="color: #10b981;"><strong>正解：</strong>${this.highlightText(item.answer, query)}</span>
            </div>
            <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5; background: var(--bg-input); padding: 8px; border-radius: 6px;">
              <strong>四選一選項：</strong>${(item.options || []).map(opt => opt === item.answer ? `<span style="color: #10b981; font-weight:bold;">${opt} (正解)</span>` : opt).join('、 ')}
            </div>
          `;
        } else if (type === 'characterTest') {
          contentHtml = `
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="font-size: 28px; font-weight: bold; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(0,122,255,0.1); border-radius: 8px; color: var(--accent-color); flex-shrink: 0;">
                ${this.highlightText(item.char, query)}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 15px; font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">
                  ${displayIdx + 1}. 提示：${this.highlightText(item.clue, query)}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 12px;">
                  <span><strong>注音：</strong>${item.zhuyin || '無'}</span>
                  <span><strong>關聯詞：</strong>${this.highlightText(item.searchWord || '無', query)}</span>
                </div>
              </div>
            </div>
          `;
        } else if (type === 'characterCrossword') {
          contentHtml = `
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="font-size: 26px; font-weight: bold; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(16,185,129,0.1); border-radius: 8px; color: #10b981; flex-shrink: 0;">
                ${this.highlightText(item.centerChar, query)}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 14px; font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">
                  ${displayIdx + 1}. 中心正字【${this.highlightText(item.centerChar, query)}】${item.zhuyin ? `（注音：${item.zhuyin}）` : ''}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 3px;">
                  <span><strong>四方字：</strong>${(item.surroundingChars || []).map(c => this.highlightText(c, query)).join('、 ')}</span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted); background: var(--bg-input); padding: 4px 8px; border-radius: 4px; display: inline-block;">
                  <strong>組成詞語：</strong>${(item.combinedWords && item.combinedWords.length > 0) ? item.combinedWords.map(w => this.highlightText(w, query)).join('、 ') : this.highlightText(item.searchWord || '', query)}
                </div>
              </div>
            </div>
          `;
        } else if (type === 'characterUnitedWords') {
          contentHtml = `
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="font-size: 20px; font-weight: bold; padding: 8px 14px; display: flex; align-items: center; justify-content: center; background: rgba(245,158,11,0.1); border-radius: 8px; color: #f59e0b; flex-shrink: 0;">
                ${this.highlightText(item.word, query)}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 14px; font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">
                  ${displayIdx + 1}. 解答詞語【${this.highlightText(item.word, query)}】
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 3px;">
                  <span><strong>散裝部件：</strong>${(item.parts || []).map(p => this.highlightText(p, query)).join(' + ')}</span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted);">
                  <span><strong>解釋提示：</strong>${this.highlightText(item.clue || '無', query)}</span>
                </div>
              </div>
            </div>
          `;
        } else if (type === 'songQuiz') {
          const itemTags = (item.tags && item.tags.length > 0) ? item.tags : this.parseSongTags(item.tag);
          const tagBadgesHtml = itemTags.map(t => `<span style="background: rgba(16,185,129,0.12); color: #10b981; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">🏷️ ${this.highlightText(t, query)}</span>`).join(' ');
          contentHtml = `
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: #1f2937; border: 2px solid #374151; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
                🎵
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                  ${tagBadgesHtml}
                  <span style="font-weight: bold; font-size: 15px; color: var(--text-primary);">
                    ${displayIdx + 1}. ${this.highlightText(item.title, query)}
                  </span>
                  ${item.artist ? `<span style="font-size: 13px; color: var(--accent-color); font-weight: bold;">(${this.highlightText(item.artist, query)})</span>` : ''}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 5px;">
                  <span><strong>試聽播放：</strong>從第 ${item.startTime || 0} 秒播放 ${item.duration || 15} 秒</span>
                  ${item.youtubeUrl ? `<a href="${item.youtubeUrl}" target="_blank" rel="noopener noreferrer" style="color: #ef4444; font-weight: bold; text-decoration: underline;">▶️ YouTube 試聽</a>` : ''}
                </div>
                ${item.clue ? `<div style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px;">💡 提示：${this.highlightText(item.clue, query)}</div>` : ''}
                <div style="font-size: 12px; color: var(--text-muted); background: var(--bg-input); padding: 5px 8px; border-radius: 6px;">
                  <strong>選項：</strong>${(item.options || []).map(opt => opt === item.title ? `<span style="color: #10b981; font-weight:bold;">${opt} (正解)</span>` : opt).join('、 ')}
                </div>
              </div>
            </div>
          `;
        }

        html += `
          <div class="focus-qb-item-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="flex: 1; min-width: 0;">${contentHtml}</div>
            <div style="display: flex; gap: 8px; flex-shrink: 0;">
              <button type="button" onclick="window.focusQB.openQuestionEditForm(${origIdx})" title="編輯題目" style="background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-primary); padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">
                ✏️ 編輯
              </button>
              <button type="button" onclick="window.focusQB.handleDeleteQuestion(${origIdx})" title="刪除題目" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">
                🗑️ 刪除
              </button>
            </div>
          </div>
        `;
      });

      listContainer.innerHTML = html;
    }

    // 搜尋高亮關鍵字
    highlightText(text, query) {
      if (!text) return '';
      if (!query) return String(text);
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return String(text).replace(regex, '<span style="background: #fef08a; color: #854d0e; padding: 0 2px; border-radius: 2px; font-weight:bold;">$1</span>');
    }

    // 關鍵字搜尋輸入處理
    handleSearchInput(val) {
      this.searchKeywords[this.currentActiveType] = val;
      this.renderList();
    }

    // 刪除題目事件處理
    handleDeleteQuestion(originalIndex) {
      const type = this.currentActiveType;
      const pool = this.getPool(type);
      const item = this.normalizeItem(type, pool[originalIndex]);
      const name = item.title || item.char || item.centerChar || item.word || `第 ${originalIndex + 1} 題`;
      if (confirm(`確定要刪除題目「${name}」嗎？`)) {
        this.deleteQuestion(type, originalIndex);
        if (window.app && typeof window.app.showNotification === 'function') {
          window.app.showNotification('成功', '題目已成功刪除！');
        }
        this.renderList();
        this.updateAdminBadge(type);
      }
    }

    // 打開新增/編輯題目表單
    openQuestionEditForm(originalIndex = -1) {
      this.editingIndex = originalIndex;
      const type = this.currentActiveType;
      const formContainer = document.getElementById('focusQbEditFormContainer');
      const formTitle = document.getElementById('focusQbEditFormTitle');
      const fieldsContainer = document.getElementById('focusQbFormFields');
      if (!formContainer || !fieldsContainer) return;

      const isEdit = originalIndex >= 0;
      const pool = this.getPool(type);
      const rawItem = isEdit ? pool[originalIndex] : {};
      const item = this.normalizeItem(type, rawItem);

      if (formTitle) {
        formTitle.textContent = isEdit ? `✏️ 編輯題目 (${this.getTypeName(type)})` : `➕ 新增題目 (${this.getTypeName(type)})`;
      }

      let fieldsHtml = '';
      if (type === 'classicsQuiz') {
        const title = item.title || item.work || '';
        const author = item.author || '';
        const dynasty = item.dynasty || '';
        const quote = item.quote || item.prompt || '';
        const prompt = item.prompt || (quote ? `「${quote}」出自？` : '');
        const answer = item.answer || item.correctOption || '';
        const fullPoem = item.fullPoem || item.explanation || '';
        const opts = item.options || ['', '', '', ''];

        fieldsHtml = `
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">作品名 / 典故名 *</label>
              <input type="text" id="qb_input_title" value="${title}" placeholder="例如：水調歌頭 或 畫蛇添足" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">作者 / 主角</label>
              <input type="text" id="qb_input_author" value="${author}" placeholder="例如：蘇軾" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">朝代</label>
              <input type="text" id="qb_input_dynasty" value="${dynasty}" placeholder="例如：宋" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">名句引言 *</label>
            <input type="text" id="qb_input_quote" value="${quote}" placeholder="例如：但願人長久，千里共嬋娟。" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">題目問句 *</label>
            <input type="text" id="qb_input_prompt" value="${prompt}" placeholder="例如：「但願人長久，千里共嬋娟。」出自哪一部作品？" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 1 (A)</label>
              <input type="text" id="qb_input_opt0" value="${opts[0] || ''}" placeholder="選項A" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 2 (B)</label>
              <input type="text" id="qb_input_opt1" value="${opts[1] || ''}" placeholder="選項B" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 3 (C)</label>
              <input type="text" id="qb_input_opt2" value="${opts[2] || ''}" placeholder="選項C" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 4 (D)</label>
              <input type="text" id="qb_input_opt3" value="${opts[3] || ''}" placeholder="選項D" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px; color:#10b981;">標準解答 (必須與上方其中一個選項完全一致) *</label>
            <input type="text" id="qb_input_answer" value="${answer}" placeholder="例如：蘇軾 或 水調歌頭" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid #10b981; background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">原典 / 完整詩詞全文 (作答後解析與複習呈現)</label>
            <textarea id="qb_input_fullPoem" rows="3" placeholder="請輸入完整詩詞原文..." class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-family:inherit;">${fullPoem}</textarea>
          </div>
        `;
      } else if (type === 'characterTest') {
        fieldsHtml = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">正字 (解答單字) *</label>
              <input type="text" id="qb_input_char" maxlength="1" value="${item.char || ''}" placeholder="例如：足" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-size:16px; font-weight:bold;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">注音符號</label>
              <input type="text" id="qb_input_zhuyin" value="${item.zhuyin || ''}" placeholder="例如：ㄗㄨˊ" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">題幹提示語 (包含填空處) *</label>
            <input type="text" id="qb_input_clue" value="${item.clue || ''}" placeholder="例如：畫蛇添（　）" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">延伸關聯詞語 (字典搜尋詞)</label>
            <input type="text" id="qb_input_searchWord" value="${item.searchWord || ''}" placeholder="例如：畫蛇添足" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
        `;
      } else if (type === 'characterCrossword') {
        const surr = item.surroundingChars || [];
        fieldsHtml = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">中心正字 (解答) *</label>
              <input type="text" id="qb_input_centerChar" maxlength="1" value="${item.centerChar || ''}" placeholder="例如：天" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-size:18px; font-weight:bold;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">注音</label>
              <input type="text" id="qb_input_crosswordZhuyin" value="${item.zhuyin || ''}" placeholder="例如：ㄊㄧㄢ" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">周圍字 1 (上/前)</label>
              <input type="text" id="qb_input_topWord" maxlength="1" value="${surr[0] || ''}" placeholder="今" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">周圍字 2 (下/前)</label>
              <input type="text" id="qb_input_bottomWord" maxlength="1" value="${surr[1] || ''}" placeholder="明" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">周圍字 3 (左/後)</label>
              <input type="text" id="qb_input_leftWord" maxlength="1" value="${surr[2] || ''}" placeholder="氣" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">周圍字 4 (右/後)</label>
              <input type="text" id="qb_input_rightWord" maxlength="1" value="${surr[3] || ''}" placeholder="空" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">組成的四個詞語說明</label>
            <input type="text" id="qb_input_searchWord" value="${item.searchWord || ''}" placeholder="例如：今天、明天、天氣、天空" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
        `;
      } else if (type === 'characterUnitedWords') {
        fieldsHtml = `
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">解答詞語 *</label>
            <input type="text" id="qb_input_word" value="${item.word || ''}" placeholder="例如：明月" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-size:16px; font-weight:bold;">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">散裝部件 (以空格分開) *</label>
            <input type="text" id="qb_input_parts" value="${(item.parts || []).join(' ')}" placeholder="例如：日 月 月" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">詞語解釋 / 提示語 *</label>
            <input type="text" id="qb_input_clue" value="${item.clue || ''}" placeholder="例如：形容夜空中明亮的月亮" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
        `;
      } else if (type === 'songQuiz') {
        const tag = item.tag || '懷舊經典';
        const title = item.title || '';
        const artist = item.artist || '';
        const youtubeUrl = item.youtubeUrl || '';
        const startTime = item.startTime ?? 0;
        const duration = item.duration ?? 15;
        const opts = item.options || [title, '', '', ''];
        const clue = item.clue || '';

        const quickCategories = [
          '古典音樂', '經典台語', '台灣五年級', '台灣六年級', '台灣七年級',
          '台灣八年級', '台灣九年級', '經典日劇', '經典韓劇', '動漫神曲',
          '童謠兒歌', '80~90年代西洋經典情歌', '歷年經典國片主題曲'
        ];
        const quickBtnsHtml = quickCategories.map(cat => `
          <button type="button" onclick="window.focusQB && window.focusQB.toggleSongQuizTag('${cat}')" style="padding:3px 8px; font-size:11px; border-radius:4px; border:1px solid var(--border-color); background:var(--bg-card); cursor:pointer;">🏷️ ${cat}</button>
        `).join('');

        fieldsHtml = `
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">標籤分組 (可自訂或點擊快捷標籤切換/多選) *</label>
            <div style="display:flex; gap:6px; margin-bottom:6px; flex-wrap:wrap;">
              ${quickBtnsHtml}
            </div>
            <input type="text" id="qb_input_tag" value="${tag}" placeholder="例如：經典台語, 台灣六年級 (可用逗號設定多個標籤)" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">💡 提示：點擊上方按鈕可快速切換或增減標籤，支援單首歌曲設定多個分類標籤（以逗號分隔）</div>
          </div>
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px; color:#10b981;">歌曲名稱 (標準正解) *</label>
              <input type="text" id="qb_input_songTitle" value="${title}" placeholder="例如：月亮代表我的心" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid #10b981; background:var(--bg-input); color:var(--text-primary); font-weight:bold;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">演唱者 / 歌手</label>
              <input type="text" id="qb_input_artist" value="${artist}" placeholder="例如：鄧麗君" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">YouTube 網址或影片 ID *</label>
            <input type="text" id="qb_input_youtubeUrl" value="${youtubeUrl}" placeholder="例如：https://www.youtube.com/watch?v=bv_cEeDlop0" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">開始播放秒數 (秒)</label>
              <input type="number" min="0" id="qb_input_startTime" value="${startTime}" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">試聽播放秒數 (建議 30~60 秒，最長120秒)</label>
              <input type="number" min="5" max="120" id="qb_input_duration" value="${duration}" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 1 (A)</label>
              <input type="text" id="qb_input_songOpt0" value="${opts[0] || ''}" placeholder="選項A" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 2 (B)</label>
              <input type="text" id="qb_input_songOpt1" value="${opts[1] || ''}" placeholder="選項B" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 3 (C)</label>
              <input type="text" id="qb_input_songOpt2" value="${opts[2] || ''}" placeholder="選項C" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 4 (D)</label>
              <input type="text" id="qb_input_songOpt3" value="${opts[3] || ''}" placeholder="選項D" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">歌曲提示 / 背景說明</label>
            <input type="text" id="qb_input_songClue" value="${clue}" placeholder="例如：1977年鄧麗君經典傳唱情歌" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
        `;
      }

      fieldsContainer.innerHTML = fieldsHtml;
      formContainer.style.display = 'block';
      formContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // 關閉新增/編輯表單
    closeQuestionEditForm() {
      const formContainer = document.getElementById('focusQbEditFormContainer');
      if (formContainer) formContainer.style.display = 'none';
      this.editingIndex = -1;
    }

    // 儲存表單資料
    saveQuestionEditForm() {
      const type = this.currentActiveType;
      try {
        let questionData = null;

        if (type === 'classicsQuiz') {
          const title = document.getElementById('qb_input_title')?.value.trim();
          const author = document.getElementById('qb_input_author')?.value.trim() || '';
          const dynasty = document.getElementById('qb_input_dynasty')?.value.trim() || '';
          const quote = document.getElementById('qb_input_quote')?.value.trim();
          const prompt = document.getElementById('qb_input_prompt')?.value.trim() || (quote ? `「${quote}」出自？` : '');
          const opt0 = document.getElementById('qb_input_opt0')?.value.trim();
          const opt1 = document.getElementById('qb_input_opt1')?.value.trim();
          const opt2 = document.getElementById('qb_input_opt2')?.value.trim();
          const opt3 = document.getElementById('qb_input_opt3')?.value.trim();
          const fullPoem = document.getElementById('qb_input_fullPoem')?.value.trim() || '';

          if (!title) throw new Error('請輸入作品名或典故名！');
          if (!quote) throw new Error('請輸入名句引言！');

          const options = [opt0, opt1, opt2, opt3].filter(Boolean);
          if (options.length < 4) throw new Error('請完整填寫 4 個選項！');

          const answer = options[0];
          questionData = {
            title,
            work: title,
            author,
            dynasty,
            quote,
            prompt,
            options,
            answer,
            correctOption: answer,
            fullPoem: fullPoem || quote,
            explanation: fullPoem || `正解為：${answer}`,
            category: author ? '唐詩宋詞' : '成語典故',
            type: author ? 'poetry' : 'idiom',
            id: `custom_q_${Date.now()}`,
            links: {
              sinoreading: `https://www.google.com/search?q=${encodeURIComponent(title + ' 中讀網')}`,
              wikisource: `https://zh.wikisource.org/wiki/${encodeURIComponent(title)}`,
              wikipedia: `https://zh.wikipedia.org/wiki/${encodeURIComponent(title)}`
            }
          };
        } else if (type === 'characterTest') {
          const char = document.getElementById('qb_input_char')?.value.trim();
          const zhuyin = document.getElementById('qb_input_zhuyin')?.value.trim() || '';
          const clue = document.getElementById('qb_input_clue')?.value.trim();
          const searchWord = document.getElementById('qb_input_searchWord')?.value.trim() || '';

          if (!char) throw new Error('請輸入解答正字！');
          if (!clue) throw new Error('請輸入題幹提示！');

          questionData = {
            char,
            zhuyin,
            clue,
            searchWord: searchWord || clue.replace(/[（(].*?[）)]/g, char)
          };
        } else if (type === 'characterCrossword') {
          const centerChar = document.getElementById('qb_input_centerChar')?.value.trim();
          const zhuyin = document.getElementById('qb_input_crosswordZhuyin')?.value.trim() || '';
          const topWord = document.getElementById('qb_input_topWord')?.value.trim() || '';
          const bottomWord = document.getElementById('qb_input_bottomWord')?.value.trim() || '';
          const leftWord = document.getElementById('qb_input_leftWord')?.value.trim() || '';
          const rightWord = document.getElementById('qb_input_rightWord')?.value.trim() || '';
          const searchWord = document.getElementById('qb_input_searchWord')?.value.trim() || '';

          if (!centerChar) throw new Error('請輸入中心正字！');
          if (!topWord || !bottomWord || !leftWord || !rightWord) throw new Error('請填寫全部 4 個周圍字！');

          const surrounding = [
            { char: topWord, pos: 'before' },
            { char: bottomWord, pos: 'before' },
            { char: leftWord, pos: 'after' },
            { char: rightWord, pos: 'after' }
          ];

          questionData = {
            char: centerChar,
            centerChar,
            zhuyin,
            surrounding,
            searchWord: searchWord || `${topWord}${centerChar}、${bottomWord}${centerChar}、${centerChar}${leftWord}、${centerChar}${rightWord}`
          };
        } else if (type === 'characterUnitedWords') {
          const word = document.getElementById('qb_input_word')?.value.trim();
          const partsInput = document.getElementById('qb_input_parts')?.value.trim() || '';
          const clue = document.getElementById('qb_input_clue')?.value.trim();

          if (!word) throw new Error('請輸入解答詞語！');
          if (!partsInput) throw new Error('請輸入散裝部件！');
          if (!clue) throw new Error('請輸入詞語提示！');

          const parts = partsInput.split(/[\s,，、+]+/).filter(Boolean);
          questionData = {
            targetWord: word,
            word,
            components: parts,
            parts,
            clue,
            searchWord: word
          };
        } else if (type === 'songQuiz') {
          const rawTagInput = document.getElementById('qb_input_tag')?.value.trim() || '精選歌單';
          const tags = this.parseSongTags(rawTagInput);
          const tag = tags.join(', ') || '精選歌單';
          const title = document.getElementById('qb_input_songTitle')?.value.trim();
          const artist = document.getElementById('qb_input_artist')?.value.trim() || '';
          const youtubeUrl = document.getElementById('qb_input_youtubeUrl')?.value.trim();
          const startTime = Math.max(0, parseInt(document.getElementById('qb_input_startTime')?.value) || 0);
          const duration = Math.max(5, Math.min(120, parseInt(document.getElementById('qb_input_duration')?.value) || 60));
          const opt0 = document.getElementById('qb_input_songOpt0')?.value.trim();
          const opt1 = document.getElementById('qb_input_songOpt1')?.value.trim();
          const opt2 = document.getElementById('qb_input_songOpt2')?.value.trim();
          const opt3 = document.getElementById('qb_input_songOpt3')?.value.trim();
          const clue = document.getElementById('qb_input_songClue')?.value.trim() || '';

          if (!title) throw new Error('請輸入歌曲名稱(標準正解)！');
          if (!youtubeUrl) throw new Error('請輸入 YouTube 網址！');

          let options = [opt0, opt1, opt2, opt3].filter(Boolean);
          if (options.length < 4) throw new Error('請完整填寫 4 個選項！');
          if (!options.includes(title)) throw new Error('歌曲正解必須包含在 4 個選項之中！');

          let youtubeId = '';
          const match = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
          if (match && match[1]) youtubeId = match[1];

          questionData = {
            id: `song_${Date.now()}`,
            tag,
            tags: tags.length > 0 ? tags : [tag],
            title,
            artist,
            youtubeUrl,
            youtubeId: youtubeId || youtubeUrl,
            startTime,
            duration,
            options,
            clue
          };
        }

        this.saveQuestion(type, questionData, this.editingIndex);
        if (window.app && typeof window.app.showNotification === 'function') {
          window.app.showNotification('成功', this.editingIndex >= 0 ? '題目修改已儲存！' : '新題目已成功加入題庫！');
        }
        this.closeQuestionEditForm();
        this.renderList();
        this.updateAdminBadge(type);
      } catch (err) {
        alert(err.message || '儲存失敗，請檢查欄位！');
      }
    }

    // 打開匯入題庫彈窗
    openImportDialog(type = this.currentActiveType) {
      this.currentActiveType = type;
      const fileInput = document.getElementById('focusQbFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }

    // 處理檔案上傳匯入（支援 CSV, TXT, JSON）
    handleFileUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const type = this.currentActiveType;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const count = this.importPool(type, e.target.result, 'replace');
          if (window.app && typeof window.app.showNotification === 'function') {
            window.app.showNotification('成功', `成功匯入 ${count} 筆題目至【${this.getTypeName(type)}】！`);
          } else {
            alert(`成功匯入 ${count} 筆題目！`);
          }
          this.renderList();
          this.updateAdminBadge(type);
        } catch (err) {
          alert('匯入失敗：' + err.message);
        }
      };
      reader.readAsText(file, 'UTF-8');
    }

    // 處理恢復預設題庫
    handleResetDefault(type = this.currentActiveType) {
      if (confirm(`確定要將【${this.getTypeName(type)}】題庫重置還原為原廠官方預設題庫嗎？所有自訂增修將會被清除。`)) {
        this.resetPool(type);
        if (window.app && typeof window.app.showNotification === 'function') {
          window.app.showNotification('成功', `【${this.getTypeName(type)}】已成功恢復為官方預設題庫！`);
        }
        this.renderList();
        this.updateAdminBadge(type);
      }
    }
  }

  // 掛載至 global
  global.FocusQuestionBankManager = FocusQuestionBankManager;
  global.focusQB = new FocusQuestionBankManager();

  // 綁定視窗外點擊關閉
  document.addEventListener('board-ready', () => {
    const modal = document.getElementById('modal-focus-question-bank');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          global.focusQB.closeModal();
        }
      });
    }
  });

})(typeof window !== 'undefined' ? window : this);
