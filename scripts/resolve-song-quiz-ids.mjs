import fs from 'fs';

const songs = [
  { id: 'song_c1', query: '鄧麗君 月亮代表我的心', currentId: 'bv_cEeDlop0' },
  { id: 'song_c2', query: '鄧麗君 甜蜜蜜', currentId: 'kYkyX11qgYw' },
  { id: 'song_c3', query: '蔡琴 恰似你的溫柔', currentId: 't5Q3eQk_d60' },
  { id: 'song_c4', query: '黃安 新鴛鴦蝴蝶夢', currentId: 'KzKk7uM0F0c' },
  { id: 'song_c5', query: '周華健 朋友', currentId: '4YmI3gUe7hQ' },
  { id: 'song_c6', query: '葉啟田 愛拼才會贏', currentId: 'd_kF1n9yX_w' },
  { id: 'song_c7', query: '江蕙 家後', currentId: '8l-V8p2lY-M' },
  { id: 'song_c8', query: '羅大佑 童年', currentId: '2r1o_1y0l0A' },

  { id: 'song_p1', query: '周杰倫 晴天', currentId: 'DYptgVvkVLQ' },
  { id: 'song_p2', query: '周杰倫 七里香', currentId: 'Bbp9ZaJD_eA' },
  { id: 'song_p3', query: '周杰倫 稻香', currentId: 'sHD_z90E44U' },
  { id: 'song_p4', query: '周杰倫 告白氣球', currentId: 'bu7nU9Mhpyo' },
  { id: 'song_p5', query: '梁靜茹 勇氣', currentId: '2X7TqB8aQ-0' },
  { id: 'song_p6', query: '周杰倫 簡單愛', currentId: 'Y4x3ZDF7q_0' },
  { id: 'song_p7', query: '夢然 少年', currentId: 'q6t8o7wN_1c' },
  { id: 'song_p8', query: '任然 飛鳥和蟬', currentId: 'F_f8N2q_1gQ' },

  { id: 'song_a1', query: '殘酷天使的行動綱領 高橋洋子', currentId: 'o6wtDPVkKqI' },
  { id: 'song_a2', query: 'WANDS 直到世界的盡頭', currentId: '0kFhP6X0Q_A' },
  { id: 'song_a3', query: 'BAAD 好想大聲說喜歡你', currentId: 's_K8U3WvX1A' },
  { id: 'song_a4', query: 'LiSA 紅蓮華', currentId: 'MpYy6wwqxoo' },
  { id: 'song_a5', query: '大杉久美子 哆啦A夢之歌', currentId: 'gT1-Jz9_k_c' },
  { id: 'song_a6', query: '北谷洋 We Are! 航海王', currentId: '2T8u_z0fG0c' },

  { id: 'song_k1', query: '拔蘿蔔 兒歌', currentId: 'G3Y1GZ8m2-o' },
  { id: 'song_k2', query: '兩隻老虎 兒歌', currentId: 'q6bL7X_1_wU' },
  { id: 'song_k3', query: '小星星 兒歌', currentId: 'yCjJyiqpAuU' },
  { id: 'song_k4', query: '當我們同在一起 兒歌', currentId: '4E-T4E_0-hA' },
  { id: 'song_k5', query: '泥娃娃 兒歌', currentId: '5rT4E-0-hB8' },
  { id: 'song_k6', query: '茉莉花 民謠', currentId: 'yW_4r4F3hWw' },

  { id: 'song_m1', query: '胡夏 那些年', currentId: 'KqjgLbKZ1h0' },
  { id: 'song_m2', query: '田馥甄 小幸運', currentId: '_sQSXwdtnxY' },
  { id: 'song_m3', query: '盧廣仲 刻在我心底的名字', currentId: 'm78lJuzftCc' },
  { id: 'song_m4', query: '韋禮安 如果可以', currentId: '8MG--WuNW1Y' }
];

async function checkId(id) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
    if (res.ok) {
      const data = await res.json();
      return data.title;
    }
  } catch (e) {}
  return null;
}

async function searchYoutube(query) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
    const uniqueIds = [...new Set(matches)];
    for (const vid of uniqueIds.slice(0, 8)) {
      const title = await checkId(vid);
      if (title) {
        return { videoId: vid, title };
      }
    }
  } catch (e) {
    console.error(`Search error for ${query}:`, e.message);
  }
  return null;
}

async function run() {
  const results = {};
  for (const item of songs) {
    let validTitle = await checkId(item.currentId);
    if (validTitle) {
      results[item.id] = { videoId: item.currentId, title: validTitle, status: 'EXISTING_OK' };
      console.log(`[OK] ${item.id} -> ${item.currentId} (${validTitle})`);
    } else {
      console.log(`[NEED RESOLVE] ${item.id}: ${item.query}`);
      const found = await searchYoutube(item.query);
      if (found) {
        results[item.id] = { videoId: found.videoId, title: found.title, status: 'FOUND_NEW' };
        console.log(`  -> Resolved to: ${found.videoId} (${found.title})`);
      } else {
        results[item.id] = { videoId: null, status: 'NOT_FOUND' };
        console.log(`  -> FAILED to find valid ID`);
      }
    }
  }
  fs.writeFileSync('scripts/resolved_song_ids.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved to scripts/resolved_song_ids.json');
}

run();
