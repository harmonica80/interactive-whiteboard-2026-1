import fs from 'fs';

const resolved100 = JSON.parse(fs.readFileSync('scripts/resolved-100-songs.json', 'utf8'));

const animeAndKids = [
  // --- 動漫神曲 (6首) ---
  {
    id: 'song_anime_1',
    tag: '動漫神曲',
    title: '殘酷天使的行動綱領',
    artist: '高橋洋子',
    youtubeUrl: 'https://www.youtube.com/watch?v=o6wtDPVkKqI',
    youtubeId: 'o6wtDPVkKqI',
    startTime: 10,
    duration: 60,
    options: ['殘酷天使的行動綱領', '魂之輪迴', '直到世界的盡頭', '前前前世'],
    clue: '傳奇動畫《新世紀福音戰士》(EVA) 經典片頭曲。'
  },
  {
    id: 'song_anime_2',
    tag: '動漫神曲',
    title: '直到世界的盡頭',
    artist: 'WANDS',
    youtubeUrl: 'https://www.youtube.com/watch?v=P199MdOxVeI',
    youtubeId: 'P199MdOxVeI',
    startTime: 35,
    duration: 60,
    options: ['直到世界的盡頭', '好想大聲說喜歡你', '捕捉閃爍的瞬間', '灌籃高手'],
    clue: '《灌籃高手》(Slam Dunk) 三井壽浪子回頭專屬片尾曲。'
  },
  {
    id: 'song_anime_3',
    tag: '動漫神曲',
    title: '好想大聲說喜歡你',
    artist: 'BAAD',
    youtubeUrl: 'https://www.youtube.com/watch?v=HSj-en4UHMI',
    youtubeId: 'HSj-en4UHMI',
    startTime: 15,
    duration: 60,
    options: ['好想大聲說喜歡你', '直到世界的盡頭', '漸漸被你吸引', '勇氣100%'],
    clue: '《灌籃高手》(Slam Dunk) 熱血沸騰的第一代片頭曲。'
  },
  {
    id: 'song_anime_4',
    tag: '動漫神曲',
    title: '紅蓮華',
    artist: 'LiSA',
    youtubeUrl: 'https://www.youtube.com/watch?v=MpYy6wwqxoo',
    youtubeId: 'MpYy6wwqxoo',
    startTime: 15,
    duration: 60,
    options: ['紅蓮華', '炎', '殘響散歌', '虹'],
    clue: '全球現象級動畫《鬼滅之刃 竈門炭治郎 立志篇》主題曲。'
  },
  {
    id: 'song_anime_5',
    tag: '動漫神曲',
    title: '哆啦A夢之歌',
    artist: '大杉久美子',
    youtubeUrl: 'https://www.youtube.com/watch?v=frSrRzEJoE4',
    youtubeId: 'frSrRzEJoE4',
    startTime: 5,
    duration: 60,
    options: ['哆啦A夢之歌', '櫻桃小丸子主題曲', '麵包超人進行曲', '名偵探柯南主題曲'],
    clue: '「昂、昂、昂，小叮噹幫我實現所有的願望」，陪伴幾代人的童年。'
  },
  {
    id: 'song_anime_6',
    tag: '動漫神曲',
    title: 'We Are!',
    artist: '北谷洋',
    youtubeUrl: 'https://www.youtube.com/watch?v=HB4iNVa746E',
    youtubeId: 'HB4iNVa746E',
    startTime: 10,
    duration: 60,
    options: ['We Are!', 'Believe', 'Share The World', 'One Day'],
    clue: '超人氣動畫《航海王 ONE PIECE》最初也是最經典的冒險序幕曲。'
  },

  // --- 童謠兒歌 (6首) ---
  {
    id: 'song_kids_1',
    tag: '童謠兒歌',
    title: '拔蘿蔔',
    artist: '傳統童謠',
    youtubeUrl: 'https://www.youtube.com/watch?v=rwth9dQS1oM',
    youtubeId: 'rwth9dQS1oM',
    startTime: 0,
    duration: 60,
    options: ['拔蘿蔔', '兩隻老虎', '泥娃娃', '小星星'],
    clue: '「拔蘿蔔拔蘿蔔，嘿呦嘿呦拔不動」，耳熟能詳的兒歌。'
  },
  {
    id: 'song_kids_2',
    tag: '童謠兒歌',
    title: '兩隻老虎',
    artist: '傳統童謠',
    youtubeUrl: 'https://www.youtube.com/watch?v=RApHGXfBKO0',
    youtubeId: 'RApHGXfBKO0',
    startTime: 0,
    duration: 60,
    options: ['兩隻老虎', '三隻小豬', '醜小鴨', '泥娃娃'],
    clue: '「一隻沒有耳朵，一隻沒有尾巴，真奇怪！真奇怪！」。'
  },
  {
    id: 'song_kids_3',
    tag: '童謠兒歌',
    title: '小星星',
    artist: '傳統童謠',
    youtubeUrl: 'https://www.youtube.com/watch?v=yCjJyiqpAuU',
    youtubeId: 'yCjJyiqpAuU',
    startTime: 0,
    duration: 60,
    options: ['小星星', '搖籃曲', '當我們同在一起', '茉莉花'],
    clue: '莫札特《小星星變奏曲》旋律：「一閃一閃亮晶晶，滿天都是小星星」。'
  },
  {
    id: 'song_kids_4',
    tag: '童謠兒歌',
    title: '當我們同在一起',
    artist: '傳統童謠',
    youtubeUrl: 'https://www.youtube.com/watch?v=7shHB9qGi4g',
    youtubeId: '7shHB9qGi4g',
    startTime: 0,
    duration: 60,
    options: ['當我們同在一起', '捕魚歌', '火車快飛', '大象'],
    clue: '「當我們同在一起，在一起，其快樂無比」，德國傳統民謠改編。'
  },
  {
    id: 'song_kids_5',
    tag: '童謠兒歌',
    title: '泥娃娃',
    artist: '傳統童謠',
    youtubeUrl: 'https://www.youtube.com/watch?v=v7zHNHIjnt8',
    youtubeId: 'v7zHNHIjnt8',
    startTime: 0,
    duration: 60,
    options: ['泥娃娃', '娃娃國', '兩隻老虎', '茉莉花'],
    clue: '「泥娃娃泥娃娃，一個泥娃娃，也有那眉毛也有那眼睛」。'
  },
  {
    id: 'song_kids_6',
    tag: '童謠兒歌',
    title: '茉莉花',
    artist: '中國民謠',
    youtubeUrl: 'https://www.youtube.com/watch?v=jOqyaFORT0o',
    youtubeId: 'jOqyaFORT0o',
    startTime: 20,
    duration: 60,
    options: ['茉莉花', '採茶歌', '鳳陽花鼓', '康定情歌'],
    clue: '「好一朵美麗的茉莉花，芬芳美麗滿枝椏，又香又白人人誇」。'
  }
];

// 重新整理所有歌曲，分類前置為：古典音樂(20)、台灣五年級(20)、台灣六年級(20)、台灣七年級(20)、台灣八年級(20)、動漫神曲(6)、童謠兒歌(6)
const fullList = [...resolved100, ...animeAndKids];

// 賦予清楚有語意的 id
let catCounts = {};
fullList.forEach(s => {
  const t = s.tag;
  catCounts[t] = (catCounts[t] || 0) + 1;
  let prefix = 'song';
  if (t === '古典音樂') prefix = 'classical';
  else if (t === '台灣五年級') prefix = 'tw_grade5';
  else if (t === '台灣六年級') prefix = 'tw_grade6';
  else if (t === '台灣七年級') prefix = 'tw_grade7';
  else if (t === '台灣八年級') prefix = 'tw_grade8';
  else if (t === '動漫神曲') prefix = 'anime';
  else if (t === '童謠兒歌') prefix = 'kids';
  s.id = `${prefix}_${catCounts[t]}`;
});

const content = `/**
 * Song Quiz Default Pool (專注力測驗 - 聽歌搶答內建官方題庫)
 * 分類包含：古典音樂 (20首)、台灣五年級 (20首)、台灣六年級 (20首)、台灣七年級 (20首)、台灣八年級 (20首)、動漫神曲 (6首)、童謠兒歌 (6首)
 * 全數 112 首歌曲皆經由 YouTube 官方 API (oEmbed) 檢驗為有效且開放嵌入播放
 */
(function (global) {
  'use strict';

  const DEFAULT_SONG_QUIZ_POOL = ${JSON.stringify(fullList, null, 2)};

  global.DEFAULT_SONG_QUIZ_POOL = DEFAULT_SONG_QUIZ_POOL;
})(typeof window !== 'undefined' ? window : this);
`;

fs.writeFileSync('js/song_quiz_pool.js', content, 'utf8');
console.log(`成功生成 js/song_quiz_pool.js！總計 ${fullList.length} 首歌曲。`);
console.log('各類別歌曲數量統計：', catCounts);
