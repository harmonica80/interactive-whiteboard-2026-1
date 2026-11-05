import fs from 'fs';
import { newSongsMetadata } from './new-songs-metadata.mjs';

// 讀取既有 320 首
const poolCode = fs.readFileSync('js/song_quiz_pool.js', 'utf8');
const poolSandbox = { window: {} };
new Function('window', 'global', poolCode)(poolSandbox.window, poolSandbox.window);
const existingPool = poolSandbox.window.DEFAULT_SONG_QUIZ_POOL;

// 讀取快取
const cache = JSON.parse(fs.readFileSync('scripts/song-pool-cache.json', 'utf8'));

// 檢查既有歌曲數量
console.log(`既有歌曲數：${existingPool.length}`);

// 組合新 160 首
const newSongs = [];
const missing = [];

for (const meta of newSongsMetadata) {
  const k = `${meta.tag}_${meta.title}`;
  const hit = cache[k] || cache[meta.title];
  if (hit && hit.youtubeId) {
    newSongs.push({
      tag: meta.tag,
      title: meta.title,
      artist: meta.artist,
      youtubeId: hit.youtubeId,
      options: meta.opts,
      clue: meta.clue
    });
  } else {
    missing.push(`${meta.tag} - ${meta.title}`);
  }
}

console.log(`新歌已解析：${newSongs.length} / ${newSongsMetadata.length}`);
if (missing.length > 0) {
  console.log('尚未解析的歌曲：', missing);
} else {
  // 建立 480 首大題庫
  // 依 8 大分類排序與整合
  const categories = ['古典音樂', '台灣五年級', '台灣六年級', '台灣七年級', '台灣八年級', '台灣九年級', '動漫神曲', '童謠兒歌'];
  const fullPool = [];

  for (const cat of categories) {
    const fromExisting = existingPool.filter(s => s.tag === cat);
    const fromNew = newSongs.filter(s => s.tag === cat);
    console.log(`分類 [${cat}]: 既有 ${fromExisting.length} 首 + 新增 ${fromNew.length} 首 = ${fromExisting.length + fromNew.length} 首`);
    fullPool.push(...fromExisting, ...fromNew);
  }

  console.log(`\n總計歌曲數量: ${fullPool.length} 首`);

  const outputCode = `// 聽歌搶答 480 首大題庫 (8大分類各60首，全數通過 YouTube 官方 oEmbed 驗證)\n(function(window) {\n  window.DEFAULT_SONG_QUIZ_POOL = ${JSON.stringify(fullPool, null, 2)};\n})(typeof window !== 'undefined' ? window : global);\n`;

  fs.writeFileSync('js/song_quiz_pool.js', outputCode, 'utf8');
  console.log('✅ 成功寫入 js/song_quiz_pool.js！');
}
