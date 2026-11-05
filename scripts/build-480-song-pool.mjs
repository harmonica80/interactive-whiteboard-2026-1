import fs from 'fs';
import { checkYoutubeId, searchYoutube, findValidYoutubeId } from './find-youtube-id.mjs';
import { newSongsMetadata } from './new-songs-metadata.mjs';

// 讀取既有 320 首
const poolCode = fs.readFileSync('js/song_quiz_pool.js', 'utf8');
const poolSandbox = { window: {} };
new Function('window', 'global', poolCode)(poolSandbox.window, poolSandbox.window);
const existing320 = poolSandbox.window.DEFAULT_SONG_QUIZ_POOL;

// 快取檔案
const CACHE_FILE = 'scripts/song-pool-cache.json';
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch {}
}

console.log(`目前已有歌曲：${existing320.length} 首`);
console.log(`待處理新歌曲：${newSongsMetadata.length} 首，快取中已有：${Object.keys(cache).length} 筆`);

async function build() {
  const newSongs = [];

  for (let i = 0; i < newSongsMetadata.length; i++) {
    const item = newSongsMetadata[i];
    const key = `${item.tag}_${item.title}`;

    if (cache[key] && cache[key].youtubeId) {
      // 驗證快取中的 youtubeId 是否仍有效
      const chk = await checkYoutubeId(cache[key].youtubeId);
      if (chk.ok) {
        newSongs.push({
          tag: item.tag,
          title: item.title,
          artist: item.artist,
          youtubeId: cache[key].youtubeId,
          options: item.opts,
          clue: item.clue
        });
        console.log(`[${i + 1}/${newSongsMetadata.length}] [快取命中] ${item.tag} - ${item.title} -> ${cache[key].youtubeId} (${chk.title || ''})`);
        continue;
      } else {
        console.log(`[快取失效重查] ${item.title} (${cache[key].youtubeId})`);
        delete cache[key];
      }
    }

    console.log(`[${i + 1}/${newSongsMetadata.length}] 正在搜尋: ${item.tag} - ${item.title} (${item.q})...`);
    let found = await findValidYoutubeId(item.q);
    if (!found) {
      // 備援查詢 1: 歌名 + 歌手
      console.log(`  -> 嘗試備援查詢 1: ${item.title} ${item.artist}`);
      await new Promise(r => setTimeout(r, 1500));
      found = await findValidYoutubeId(`${item.title} ${item.artist}`);
    }
    if (!found) {
      // 備援查詢 2: 純歌名
      console.log(`  -> 嘗試備援查詢 2: ${item.title}`);
      await new Promise(r => setTimeout(r, 1500));
      found = await findValidYoutubeId(item.title);
    }

    if (found && found.id) {
      cache[key] = { youtubeId: found.id, title: item.title, ytTitle: found.title, author: found.author };
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
      newSongs.push({
        tag: item.tag,
        title: item.title,
        artist: item.artist,
        youtubeId: found.id,
        options: item.opts,
        clue: item.clue
      });
      console.log(` -> 成功找到: ${found.id} (${found.title || ''})`);
    } else {
      console.error(` -> ❌ 找不到有效 YouTube ID: ${item.title}`);
    }

    // 稍微延遲避免頻率限制
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`\n新歌成功解析: ${newSongs.length} / ${newSongsMetadata.length}`);

  if (newSongs.length === newSongsMetadata.length) {
    const fullPool = [...existing320, ...newSongs];
    console.log(`合併後總計: ${fullPool.length} 首歌曲`);

    // 驗證各標籤數量
    const tagCounts = {};
    fullPool.forEach(s => {
      tagCounts[s.tag] = (tagCounts[s.tag] || 0) + 1;
    });
    console.log('各分類數量統計：', tagCounts);

    // 輸出到 js/song_quiz_pool.js
    const outputJs = `// 聽歌搶答 480 首大題庫 (8大分類各60首，全數通過 YouTube oEmbed 官方驗證)\n(function(window) {\n  window.DEFAULT_SONG_QUIZ_POOL = ${JSON.stringify(fullPool, null, 2)};\n})(typeof window !== 'undefined' ? window : global);\n`;
    fs.writeFileSync('js/song_quiz_pool.js', outputJs, 'utf8');
    console.log('成功寫入 js/song_quiz_pool.js！');
  } else {
    console.warn('警告：尚有歌曲未解析成功，請檢查日誌或重試！');
  }
}

build().catch(console.error);
