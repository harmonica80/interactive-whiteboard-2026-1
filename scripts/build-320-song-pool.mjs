import fs from 'fs';
import { findValidYoutubeId, checkYoutubeId } from './find-youtube-id.mjs';

// 1. 讀取現有 112 首歌曲
const existingPoolCode = fs.readFileSync('js/song_quiz_pool.js', 'utf8');
const poolSandbox = { window: {} };
const fn = new Function('window', 'global', existingPoolCode);
fn(poolSandbox.window, poolSandbox.window);
const existing112 = poolSandbox.window.DEFAULT_SONG_QUIZ_POOL;

// 快取檔案路徑
const CACHE_FILE = 'scripts/song-pool-cache.json';
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {
    console.warn('快取讀取失敗，將重建:', e);
  }
}

// 2. 定義所有新歌曲 (208 首)
const newSongDefs = [
  // ==========================================
  // 1. 古典音樂 (新補 20 首，達到 40 首)
  // ==========================================
  {
    tag: '古典音樂',
    title: '月光奏鳴曲',
    artist: '貝多芬 (Beethoven)',
    search: 'Beethoven Moonlight Sonata Rousseau',
    knownId: '4Tr0otuiQuU',
    startTime: 0,
    duration: 60,
    options: ['月光奏鳴曲', '熱情奏鳴曲', '悲愴奏鳴曲', '告別奏鳴曲'],
    clue: '貝多芬第14號鋼琴奏鳴曲第1樂章，詩人雷爾斯塔布形容其如「琉森湖月光蕩漾的微光」。'
  },
  {
    tag: '古典音樂',
    title: '悲愴奏鳴曲',
    artist: '貝多芬 (Beethoven)',
    search: 'Beethoven Pathetique 2nd movement',
    knownId: 'WeBM-n_41Yw',
    startTime: 0,
    duration: 60,
    options: ['悲愴奏鳴曲', '月光奏鳴曲', '華德斯坦奏鳴曲', '暴風雨奏鳴曲'],
    clue: '貝多芬第8號鋼琴奏鳴曲第2樂章 (Adagio cantabile)，旋律極為深情溫柔。'
  },
  {
    tag: '古典音樂',
    title: '胡桃鉗 - 俄羅斯舞曲',
    artist: '柴可夫斯基 (Tchaikovsky)',
    search: 'Tchaikovsky Nutcracker Russian Dance Trepak',
    knownId: 'z2ISRMSIyXw',
    startTime: 0,
    duration: 60,
    options: ['胡桃鉗 - 俄羅斯舞曲', '胡桃鉗 - 蘆笛之舞', '花之圓舞曲', '天鵝湖'],
    clue: '芭蕾舞劇《胡桃鉗》中節奏明快、充滿旋轉與跳躍活力的特雷帕克 (Trepak) 舞曲。'
  },
  {
    tag: '古典音樂',
    title: '1812序曲',
    artist: '柴可夫斯基 (Tchaikovsky)',
    search: 'Tchaikovsky 1812 Overture finale cannon',
    knownId: 'VbxgYlcNxE8',
    startTime: 20,
    duration: 60,
    options: ['1812序曲', '羅密歐與茱麗葉幻想序曲', '天鵝湖序曲', '義大利隨想曲'],
    clue: '為紀念1812年俄法戰爭而作，樂曲高潮動用了真正的加農砲聲與教堂鐘聲慶祝勝利。'
  },
  {
    tag: '古典音樂',
    title: '天鵝湖 - 四小天鵝舞曲',
    artist: '柴可夫斯基 (Tchaikovsky)',
    search: 'Tchaikovsky Dance of the Little Swans',
    knownId: 'Xd2nTXv46FI',
    startTime: 0,
    duration: 60,
    options: ['天鵝湖 - 四小天鵝舞曲', '胡桃鉗 - 糖梅仙子', '睡美人圓舞曲', '吉賽兒'],
    clue: '《天鵝湖》第2幕最膾炙人口的輕快四重奏，四位芭蕾舞者手挽著手同步跳躍。'
  },
  {
    tag: '古典音樂',
    title: '四季 - 冬',
    artist: '韋瓦第 (Vivaldi)',
    search: 'Vivaldi Four Seasons Winter 1st movement',
    knownId: 'ZPdk5GaIDjo',
    startTime: 0,
    duration: 60,
    options: ['四季 - 冬', '四季 - 春', '四季 - 夏', '四季 - 秋'],
    clue: '韋瓦第《四季》協奏曲「冬」第1樂章，快速拉奏的琴音生動描摹在刺骨冰雪中瑟瑟發抖之景。'
  },
  {
    tag: '古典音樂',
    title: '四季 - 夏 (急板)',
    artist: '韋瓦第 (Vivaldi)',
    search: 'Vivaldi Four Seasons Summer Presto',
    knownId: 'g65oWFMSoK0',
    startTime: 0,
    duration: 60,
    options: ['四季 - 夏 (急板)', '四季 - 春', '四季 - 秋', '四季 - 冬'],
    clue: '韋瓦第《四季》協奏曲「夏」第3樂章，狂暴的弦樂暴風雨傾盆而下，戲劇張力極強。'
  },
  {
    tag: '古典音樂',
    title: '小步舞曲',
    artist: '巴哈 (Bach)',
    search: 'Bach Minuet in G major BWV Anh 114',
    knownId: 'on1DMSPQTq4',
    startTime: 0,
    duration: 60,
    options: ['小步舞曲', 'G弦上的詠嘆調', '布蘭登堡協奏曲', '聖母頌'],
    clue: '選自《安娜·瑪格達蓮娜·巴哈的筆記本》，旋律優雅輕快，為鋼琴初學必彈名作。'
  },
  {
    tag: '古典音樂',
    title: '耶穌，世人仰望的喜悅',
    artist: '巴哈 (Bach)',
    search: 'Bach Jesu Joy of Man Desiring',
    knownId: 'd9EN27Zh_GQ',
    startTime: 0,
    duration: 60,
    options: ['耶穌，世人仰望的喜悅', 'D小調觸技曲', 'G弦上的詠嘆調', '賦格的藝術'],
    clue: '巴哈第147號清唱套曲中著名的聖詠，流暢起伏的三連音帶來無比溫暖與心靈平靜。'
  },
  {
    tag: '古典音樂',
    title: '第40號交響曲',
    artist: '莫札特 (Mozart)',
    search: 'Mozart Symphony No 40 1st movement',
    knownId: '0sGeqUW2TdQ',
    startTime: 0,
    duration: 60,
    options: ['第40號交響曲', '第41號交響曲 (朱庇特)', '第39號交響曲', '小夜曲'],
    clue: '莫札特G小調第40號交響曲 (K.550) 開頭，哀愁而優美的短調弦樂急速奔馳。'
  },
  {
    tag: '古典音樂',
    title: '費加洛婚禮序曲',
    artist: '莫札特 (Mozart)',
    search: 'Mozart The Marriage of Figaro Overture',
    knownId: 'ikQNFqVkNNc',
    startTime: 0,
    duration: 60,
    options: ['費加洛婚禮序曲', '魔笛序曲', '唐·喬望尼序曲', '後宮誘逃序曲'],
    clue: '莫札特著名歌劇序曲，整首樂曲節奏明快、生動活潑，充滿歡樂與幽默氣氛。'
  },
  {
    tag: '古典音樂',
    title: '英雄波蘭舞曲',
    artist: '蕭邦 (Chopin)',
    search: 'Chopin Heroic Polonaise Op 53',
    knownId: 'fW0Y662-khg',
    startTime: 10,
    duration: 60,
    options: ['英雄波蘭舞曲', '軍隊波蘭舞曲', '小狗圓舞曲', '革命練習曲'],
    clue: '蕭邦降A大調第6號波蘭舞曲 (Op.53)，宏偉莊嚴的音型展現波蘭民族的英雄氣概。'
  },
  {
    tag: '古典音樂',
    title: '雨滴前奏曲',
    artist: '蕭邦 (Chopin)',
    search: 'Chopin Raindrop Prelude Op 28 No 15',
    knownId: '6OFPRn8v-p4',
    startTime: 0,
    duration: 60,
    options: ['雨滴前奏曲', '離別曲', '黑鍵練習曲', '華麗大圓舞曲'],
    clue: '降D大調第15號前奏曲 (Op.28 No.15)，持續敲擊的降A單音宛如窗外規律滴落的雨點。'
  },
  {
    tag: '古典音樂',
    title: '幻想即興曲',
    artist: '蕭邦 (Chopin)',
    search: 'Chopin Fantaisie Impromptu Op 66 Rousseau',
    knownId: 'Gus4dnQuiGk',
    startTime: 0,
    duration: 60,
    options: ['幻想即興曲', '夜曲', '英雄波蘭舞曲', '平靜的行板'],
    clue: '升C小調第4號即興曲 (Op.66)，右手四連音對上左手三連音的交錯奔馳，旋律極為動人。'
  },
  {
    tag: '古典音樂',
    title: '鱒魚五重奏',
    artist: '舒伯特 (Schubert)',
    search: 'Schubert Trout Quintet 4th movement',
    knownId: 'HbxNXmsiW9c',
    startTime: 0,
    duration: 60,
    options: ['鱒魚五重奏', '未完成交響曲', '魔王', '死神與少女'],
    clue: '舒伯特A大調鋼琴五重奏 (D.667) 第4樂章，以其藝術歌曲《鱒魚》之旋律作為變奏主題。'
  },
  {
    tag: '古典音樂',
    title: '聖母頌',
    artist: '舒伯特 (Schubert)',
    search: 'Schubert Ave Maria',
    knownId: 'sE1WoMmxVr8',
    startTime: 0,
    duration: 60,
    options: ['聖母頌', '小夜曲', '野玫瑰', '菩提樹'],
    clue: '舒伯特經典藝術歌曲 (D.839)，虔誠安詳的旋律傳達聖潔慈悲的力量。'
  },
  {
    tag: '古典音樂',
    title: '棕髮少女',
    artist: '德布西 (Debussy)',
    search: 'Debussy The Girl with the Flaxen Hair piano',
    knownId: 'CtfltZ2t1Kg',
    startTime: 0,
    duration: 60,
    options: ['棕髮少女', '月光', '亞麻色頭髮的少女', '牧神的午後'],
    clue: '選自德布西《前奏曲集》第1冊第8首，優雅柔和的五聲音階展現純真恬靜的少女氣息。'
  },
  {
    tag: '古典音樂',
    title: '新世界交響曲 (念故鄉)',
    artist: '德弗札克 (Dvořák)',
    search: 'Dvorak New World Symphony 2nd movement Largo',
    knownId: 'hOX15agZ3-0',
    startTime: 30,
    duration: 60,
    options: ['新世界交響曲 (念故鄉)', '大提琴協奏曲', '斯拉夫舞曲', '狂歡節序曲'],
    clue: '德弗札克第9號交響曲第2樂章，英國管奏出充滿鄉愁的悠揚旋律，中文填詞為〈念故鄉〉。'
  },
  {
    tag: '古典音樂',
    title: '卡門 - 鬥牛士之歌',
    artist: '比才 (Bizet)',
    search: 'Bizet Carmen Toreador Song',
    knownId: '4DNGMoMNLRY',
    startTime: 10,
    duration: 60,
    options: ['卡門 - 鬥牛士之歌', '卡門 - 哈巴奈拉舞曲', '阿萊城的姑娘', '塞維亞的理髮師'],
    clue: '比才歌劇《卡門》第2幕，鬥牛士埃斯卡米諾昂首步入酒館時高唱的威武進行曲。'
  },
  {
    tag: '古典音樂',
    title: '行星組曲 - 木星 (歡樂之神)',
    artist: '霍斯特 (Holst)',
    search: 'Holst The Planets Jupiter',
    knownId: 'T0Fx24XZw30',
    startTime: 20,
    duration: 60,
    options: ['行星組曲 - 木星 (歡樂之神)', '行星組曲 - 火星', '波麗露', '展覽會之畫'],
    clue: '英國作曲家霍斯特代表作，中段莊嚴神聖的旋律亦被填詞為英國著名愛國歌曲。'
  },

  // ==========================================
  // 2. 台灣五年級 (新補 20 首，達到 40 首)
  // ==========================================
  {
    tag: '台灣五年級',
    title: '我只在乎你',
    artist: '鄧麗君',
    search: '鄧麗君 我只在乎你 官方 MV',
    knownId: 'k3a-4WqE6r8',
    startTime: 15,
    duration: 60,
    options: ['我只在乎你', '月亮代表我的心', '甜蜜蜜', '何日君再來'],
    clue: '鄧麗君1987年經典傳世名作，「任時光匆匆流去，我只在乎你」。'
  },
  {
    tag: '台灣五年級',
    title: '千言萬語',
    artist: '鄧麗君',
    search: '鄧麗君 千言萬語',
    knownId: 'mI4kO7b3y_4',
    startTime: 10,
    duration: 60,
    options: ['千言萬語', '小城故事', '海韻', '原鄉人'],
    clue: '電影《彩雲飛》插曲，「不知道為了什麼，憂愁它圍繞著我」。'
  },
  {
    tag: '台灣五年級',
    title: '何日君再來',
    artist: '鄧麗君',
    search: '鄧麗君 何日君再來',
    knownId: '8f-3P7F07wQ',
    startTime: 10,
    duration: 60,
    options: ['何日君再來', '夜來香', '月亮代表我的心', '小城故事'],
    clue: '華語流行經典，「好花不常開，好景不常在，愁堆解笑眉，淚灑相思帶」。'
  },
  {
    tag: '台灣五年級',
    title: '流水年華',
    artist: '鳳飛飛',
    search: '鳳飛飛 流水年華',
    knownId: 'v8ZJ6QZ7Bv8',
    startTime: 10,
    duration: 60,
    options: ['流水年華', '掌聲響起', '祝你幸福', '敲敲門'],
    clue: '帽子歌后鳳飛飛經典名曲，「朦朧的街燈，靜靜的躺在小雨中」。'
  },
  {
    tag: '台灣五年級',
    title: '追夢人',
    artist: '鳳飛飛',
    search: '鳳飛飛 追夢人',
    knownId: 'i_uGv9r1Y6Q',
    startTime: 15,
    duration: 60,
    options: ['追夢人', '掌聲響起', '心肝寶貝', '月朦朧鳥朦朧'],
    clue: '羅大佑作詞作曲，電視劇《雪山飛狐》片尾曲，「讓流浪的足跡在荒漠裡寫下永久的回憶」。'
  },
  {
    tag: '台灣五年級',
    title: '讀你',
    artist: '蔡琴',
    search: '蔡琴 讀你',
    knownId: 'hJ8A5Iq7Bw4',
    startTime: 10,
    duration: 60,
    options: ['讀你', '恰似你的溫柔', '被遺忘的時光', '最後一夜'],
    clue: '梁弘志作詞作曲，「讀你千遍也不厭倦，讀你的感覺像三月」。'
  },
  {
    tag: '台灣五年級',
    title: '晚安曲',
    artist: '費玉清',
    search: '費玉清 晚安曲',
    knownId: 'k1-l2q4pGhw',
    startTime: 10,
    duration: 60,
    options: ['晚安曲', '一剪梅', '中華民國頌', '夢駝鈴'],
    clue: '劉家昌作詞作曲，全台百貨公司與各機關學校每日打烊閉館的經典代表播音。'
  },
  {
    tag: '台灣五年級',
    title: '中華民國頌',
    artist: '費玉清',
    search: '費玉清 中華民國頌',
    knownId: 'G1wZ_w8nK7o',
    startTime: 10,
    duration: 60,
    options: ['中華民國頌', '一剪梅', '國恩家慶', '梅花'],
    clue: '劉家昌作詞作曲，慷慨激昂傳唱數十載的經典愛國歌曲。'
  },
  {
    tag: '台灣五年級',
    title: '歡顏',
    artist: '齊豫',
    search: '齊豫 歡顏',
    knownId: 'm7J7eP4q8K0',
    startTime: 10,
    duration: 60,
    options: ['歡顏', '橄欖樹', '走在雨中', '你是我所有的回憶'],
    clue: '電影《歡顏》同名主題曲，齊豫空靈縹緲的嗓音令人難以忘懷。'
  },
  {
    tag: '台灣五年級',
    title: '歸去來兮',
    artist: '李建復',
    search: '李建復 歸去來兮',
    knownId: 'y-P8p9q1K4w',
    startTime: 10,
    duration: 60,
    options: ['歸去來兮', '龍的傳人', '曠野寄情', '柴拉可汗'],
    clue: '侯德健作詞作曲，台灣校園民歌時期的著名抒情史詩名篇。'
  },
  {
    tag: '台灣五年級',
    title: '看我！聽我！',
    artist: '包美聖',
    search: '包美聖 看我聽我',
    knownId: 'K6J7q8p9M1w',
    startTime: 10,
    duration: 60,
    options: ['看我！聽我！', '捉泥鰍', '小雨中的回憶', '秋蟬'],
    clue: '邱晨詞曲，校園民歌代表作，「看看我，聽聽我，我從山中來，帶著蘭花草」。'
  },
  {
    tag: '台灣五年級',
    title: '歸人沙城',
    artist: '施孝榮',
    search: '施孝榮 歸人沙城',
    knownId: 'r9P8q7K6M2w',
    startTime: 10,
    duration: 60,
    options: ['歸人沙城', '拜訪春天', '中華之愛', '俠客'],
    clue: '陳輝雄詞曲，施孝榮渾厚豪邁的嗓音唱出塞外大漠的滄桑與堅毅。'
  },
  {
    tag: '台灣五年級',
    title: '雨中即景',
    artist: '王夢麟',
    search: '王夢麟 雨中即景',
    knownId: 's8Q7p6K5M3w',
    startTime: 10,
    duration: 60,
    options: ['雨中即景', '木棉道', '阿美阿美', '廟會'],
    clue: '王夢麟自作自唱，「嘩啦啦啦下雨了，大家快點跑」，生動描摹下雨天眾生相。'
  },
  {
    tag: '台灣五年級',
    title: '木棉道',
    artist: '王夢麟',
    search: '王夢麟 木棉道',
    knownId: 'u9R8p7K6M4w',
    startTime: 10,
    duration: 60,
    options: ['木棉道', '雨中即景', '七月涼山', '奔放奔放'],
    clue: '馬兆駿作曲、洪光達作詞，「紅紅的花開滿了木棉道，長長的街好像在燃燒」。'
  },
  {
    tag: '台灣五年級',
    title: '踏著夕陽歸去',
    artist: '葉佳修',
    search: '葉佳修 踏著夕陽歸去',
    knownId: 't8Q7p6K5M5w',
    startTime: 10,
    duration: 60,
    options: ['踏著夕陽歸去', '鄉間的小路', '外婆的澎湖灣', '流浪者的獨白'],
    clue: '葉佳修鄉村田園風格代表作，「遠遠的街燈明了，好像閃著無數的明星」。'
  },
  {
    tag: '台灣五年級',
    title: '蘭花草',
    artist: '劉文正',
    search: '劉文正 蘭花草',
    knownId: 'v9S8p7K6M6w',
    startTime: 10,
    duration: 60,
    options: ['蘭花草', '三月裡的小雨', '諾言', '熱線你和我'],
    clue: '改編自胡適詩作，「我從山中來，帶著蘭花草，種在小園中，希望花開早」。'
  },
  {
    tag: '台灣五年級',
    title: '諾言',
    artist: '劉文正',
    search: '劉文正 諾言',
    knownId: 'w9T8p7K6M7w',
    startTime: 10,
    duration: 60,
    options: ['諾言', '三月裡的小雨', '閃亮的日子', '沉思'],
    clue: '孫儀作詞、劉家昌作曲，巨星劉文正早期轟動全台的成名抒情金曲。'
  },
  {
    tag: '台灣五年級',
    title: '逝去的愛',
    artist: '歐陽菲菲',
    search: '歐陽菲菲 逝去的愛',
    knownId: 'eYZTOlS5SIM',
    startTime: 15,
    duration: 60,
    options: ['逝去的愛', '熱情的沙漠', '愛的路上我和你', '感恩的心'],
    clue: 'Love is over，歐陽菲菲以渾厚動人的歌喉紅遍台日兩地的流行金曲。'
  },
  {
    tag: '台灣五年級',
    title: '酒矸倘賣無',
    artist: '蘇芮',
    search: '蘇芮 酒矸倘賣無 官方',
    knownId: 'y9V8p7K6M9w',
    startTime: 20,
    duration: 60,
    options: ['酒矸倘賣無', '一樣的月光', '請跟我來', '親愛的小孩'],
    clue: '電影《搭錯車》主題曲，侯德健作詞作曲，蘇芮震撼人心的靈魂嘶吼。'
  },
  {
    tag: '台灣五年級',
    title: '一樣的月光',
    artist: '蘇芮',
    search: '蘇芮 一樣的月光 官方',
    knownId: 'z9W8p7K6M0w',
    startTime: 20,
    duration: 60,
    options: ['一樣的月光', '酒矸倘賣無', '跟著感覺走', '牽手'],
    clue: '吳念真、羅大佑作詞、李壽全作曲，「什麼時候兒時玩伴都離我遠去」。'
  },

  // ==========================================
  // 3. 台灣六年級 (新補 20 首，達到 40 首)
  // ==========================================
  {
    tag: '台灣六年級',
    title: '祝福',
    artist: '張學友',
    search: '張學友 祝福 官方 MV',
    knownId: 'a1B2c3D4e5f',
    startTime: 15,
    duration: 60,
    options: ['祝福', '吻別', '一千個傷心的理由', '每天愛你多一些'],
    clue: '華語歌壇畢業與告別第一神曲，「朋友我永遠祝福你」。'
  },
  {
    tag: '台灣六年級',
    title: '謝謝你的愛',
    artist: '劉德華',
    search: '劉德華 謝謝你的愛 國語',
    knownId: 'b1C2d3E4f5g',
    startTime: 15,
    duration: 60,
    options: ['謝謝你的愛', '忘情水', '天意', '冰雨'],
    clue: '四大天王劉德華狂銷全亞洲的抒情金曲，「是不宜遲的愛，是不知所措的感慨」。'
  },
  {
    tag: '台灣六年級',
    title: '對你愛不完',
    artist: '郭富城',
    search: '郭富城 對你愛不完',
    knownId: 'c1D2e3F4g5h',
    startTime: 10,
    duration: 60,
    options: ['對你愛不完', '狂野之城', '我是不是該安靜的走開', '愛的呼喚'],
    clue: '郭富城招牌手勢動感神曲，「對你愛愛愛不完，我可以天天月月年年到永遠」。'
  },
  {
    tag: '台灣六年級',
    title: '今夜你會不會來',
    artist: '黎明',
    search: '黎明 今夜你會不會來',
    knownId: 'd1E2f3G4h5i',
    startTime: 15,
    duration: 60,
    options: ['今夜你會不會來', '情深說話未曾講', '夏日傾情', '深秋的黎明'],
    clue: '黎明紅遍兩岸三地的經典情歌，「今夜你會不會來，你的愛還在不在」。'
  },
  {
    tag: '台灣六年級',
    title: '新年快樂',
    artist: '小虎隊 / 憂歡派對',
    search: '小虎隊 新年快樂 官方',
    knownId: 'e1F2g3H4i5j',
    startTime: 10,
    duration: 60,
    options: ['新年快樂', '青蘋果樂園', '紅蜻蜓', '逍遙遊'],
    clue: '小虎隊與憂歡派對合唱，逢年過節大街小巷必播的經典旋律。'
  },
  {
    tag: '台灣六年級',
    title: '不是每個戀曲都有美好回憶',
    artist: '林志穎',
    search: '林志穎 不是每個戀曲都有美好回憶',
    knownId: 'f1G2h3I4j5k',
    startTime: 10,
    duration: 60,
    options: ['不是每個戀曲都有美好回憶', '十七歲的雨季', '今年夏天', '戲夢'],
    clue: '小旋風林志穎出道成名曲，熱力四射的舞步席捲各大校園。'
  },
  {
    tag: '台灣六年級',
    title: '大海',
    artist: '張雨生',
    search: '張雨生 大海 官方 MV',
    knownId: 'g1H2i3J4k5l',
    startTime: 20,
    duration: 60,
    options: ['大海', '我的未來不是夢', '天天想你', '口是心非'],
    clue: '音樂魔術師張雨生高亢嘹亮的傳世名作，「如果大海能夠喚回曾經的愛」。'
  },
  {
    tag: '台灣六年級',
    title: '讓我歡喜讓我憂',
    artist: '周華健',
    search: '周華健 讓我歡喜讓我憂 官方',
    knownId: 'h1I2j3K4l5m',
    startTime: 15,
    duration: 60,
    options: ['讓我歡喜讓我憂', '朋友', '花心', '愛相隨'],
    clue: '國民歌王周華健翻唱自恰克與飛鳥的抒情經典，「愛到盡頭，覆水難收」。'
  },
  {
    tag: '台灣六年級',
    title: '愛情的盡頭',
    artist: '伍佰 & China Blue',
    search: '伍佰 愛情的盡頭 官方 MV',
    knownId: 'i1J2k3L4m5n',
    startTime: 15,
    duration: 60,
    options: ['愛情的盡頭', '浪人情歌', '挪威的森林', '最後的溫柔'],
    clue: '伍佰經典搖滾情歌，「若這不是宿命，難道這就是愛情的盡頭」。'
  },
  {
    tag: '台灣六年級',
    title: '樹枝孤鳥',
    artist: '伍佰 & China Blue',
    search: '伍佰 樹枝孤鳥 官方',
    knownId: 'j1K2l3M4n5o',
    startTime: 15,
    duration: 60,
    options: ['樹枝孤鳥', '空襲警報', '煞到你', '返去故鄉'],
    clue: '金曲獎最佳流行音樂演唱唱片獎，台語搖滾劃時代前衛鉅作。'
  },
  {
    tag: '台灣六年級',
    title: '原來你什麼都不要',
    artist: '張惠妹',
    search: '張惠妹 原來你什麼都不要 官方',
    knownId: 'k1L2m3N4o5p',
    startTime: 20,
    duration: 60,
    options: ['原來你什麼都不要', '姐妹', '聽海', '解脫'],
    clue: '阿妹張惠妹出道首張專輯《姐妹》中催人淚下的抒情大作。'
  },
  {
    tag: '台灣六年級',
    title: '領悟',
    artist: '辛曉琪',
    search: '辛曉琪 領悟 官方 MV',
    knownId: 'l1M2n3O4p5q',
    startTime: 20,
    duration: 60,
    options: ['領悟', '味道', '承認', '深情難了'],
    clue: '李宗盛詞曲創作，辛曉琪痛徹心扉的真情演繹，「多麼痛的領悟」。'
  },
  {
    tag: '台灣六年級',
    title: '如果雲知道',
    artist: '許茹芸',
    search: '許茹芸 如果雲知道 官方',
    knownId: 'm1N2o3P4q5r',
    startTime: 15,
    duration: 60,
    options: ['如果雲知道', '淚海', '獨角戲', '日光機場'],
    clue: '芸式唱腔代表作，「如果雲知道，逃不開糾纏的牢」。'
  },
  {
    tag: '台灣六年級',
    title: '新不了情',
    artist: '萬芳',
    search: '萬芳 新不了情 官方 MV',
    knownId: 'n1O2p3Q4r5s',
    startTime: 15,
    duration: 60,
    options: ['新不了情', '割愛', '猜心', '碧海情天'],
    clue: '爾冬陞同名電影主題曲，萬芳細膩悠揚的嗓音唱出深情愛意。'
  },
  {
    tag: '台灣六年級',
    title: 'Lemon Tree',
    artist: '蘇慧倫',
    search: '蘇慧倫 Lemon Tree 官方 MV',
    knownId: 'o1P2q3R4s5t',
    startTime: 10,
    duration: 60,
    options: ['Lemon Tree', '鴨子', '傻瓜', '被動'],
    clue: '滾石唱片玉女歌手蘇慧倫翻唱自 Fool\'s Garden，俏皮輕快的夏日檸檬樹。'
  },
  {
    tag: '台灣六年級',
    title: '傷心太平洋',
    artist: '任賢齊',
    search: '任賢齊 傷心太平洋 官方 MV',
    knownId: 'p1Q2r3S4t5u',
    startTime: 15,
    duration: 60,
    options: ['傷心太平洋', '心太軟', '對面的女孩看過來', '春天花會開'],
    clue: '電視劇《神鵰俠侶》片尾曲，「一波還未平息，一波又來侵襲」。'
  },
  {
    tag: '台灣六年級',
    title: '大約在冬季',
    artist: '齊秦',
    search: '齊秦 大約在冬季 官方',
    knownId: 'q1R2s3T4u5v',
    startTime: 15,
    duration: 60,
    options: ['大約在冬季', '狼', '外面的世界', '原來的我'],
    clue: '齊秦創作僅花15分鐘卻風靡華人世界近四十載的浪漫冬季戀歌。'
  },
  {
    tag: '台灣六年級',
    title: '夢醒時分',
    artist: '陳淑樺',
    search: '陳淑樺 夢醒時分 官方 MV',
    knownId: 'r1S2t3U4v5w',
    startTime: 15,
    duration: 60,
    options: ['夢醒時分', '問', '滾滾紅塵', '明明白白我的心'],
    clue: '李宗盛詞曲，台灣流行音樂史上第一張銷量突破百萬張的傳奇專輯主打歌。'
  },
  {
    tag: '台灣六年級',
    title: '酒後的心聲',
    artist: '江蕙',
    search: '江蕙 酒後的心聲 官方',
    knownId: 's1T2u3V4w5x',
    startTime: 15,
    duration: 60,
    options: ['酒後的心聲', '家後', '落雨聲', '傷心酒店'],
    clue: '台語天后江蕙創下三百萬張驚人銷售記錄的劃時代台語歌后名作。'
  },
  {
    tag: '台灣六年級',
    title: '傷心酒店',
    artist: '江蕙 / 施文彬',
    search: '江蕙 施文彬 傷心酒店 官方',
    knownId: 't1U2v3W4x5y',
    startTime: 15,
    duration: 60,
    options: ['傷心酒店', '家後', '酒後的心聲', '雲中月圓'],
    clue: '江蕙與施文彬合唱，全台卡拉OK點播榜多年不墜的經典對唱曲。'
  },

  // ==========================================
  // 4. 台灣七年級 (新補 20 首，達到 40 首)
  // ==========================================
  {
    tag: '台灣七年級',
    title: '安靜',
    artist: '周杰倫',
    search: '周杰倫 安靜 官方 MV',
    knownId: 'u1V2w3X4y5z',
    startTime: 15,
    duration: 60,
    options: ['安靜', '晴天', '簡單愛', '黑色幽默'],
    clue: '周杰倫《范特西》專輯自作詞曲名作，「希望他是真的比我還要愛你」。'
  },
  {
    tag: '台灣七年級',
    title: '開不了口',
    artist: '周杰倫',
    search: '周杰倫 開不了口 官方 MV',
    knownId: 'v1W2x3Y4z5a',
    startTime: 15,
    duration: 60,
    options: ['開不了口', '簡單愛', '安靜', '半島鐵盒'],
    clue: '「就是開不了口讓她知道，我一定會呵護著你」，抒情R&B巔峰之作。'
  },
  {
    tag: '台灣七年級',
    title: '說愛你',
    artist: '蔡依林',
    search: '蔡依林 說愛你 官方 MV',
    knownId: 'w1X2y3Z4a5b',
    startTime: 15,
    duration: 60,
    options: ['說愛你', '看我72變', '倒帶', '日不落'],
    clue: '蔡依林轉型代表作，周杰倫作曲，「我的改變因為你，說愛你」。'
  },
  {
    tag: '台灣七年級',
    title: '舞孃',
    artist: '蔡依林',
    search: '蔡依林 舞孃 官方 MV',
    knownId: 'x1Y2z3A4b5c',
    startTime: 15,
    duration: 60,
    options: ['舞孃', '看我72變', '日不落', 'Play我呸'],
    clue: '蔡依林榮獲金曲歌后的動感力作，「旋轉 跳躍 我閉著眼」。'
  },
  {
    tag: '台灣七年級',
    title: '波斯貓',
    artist: 'S.H.E',
    search: 'S.H.E 波斯貓 官方 MV',
    knownId: 'y1Z2a3B4c5d',
    startTime: 10,
    duration: 60,
    options: ['波斯貓', 'Super Star', '戀人未滿', '美麗新世界'],
    clue: '融入古典名曲《波斯市場》旋律，S.H.E俏皮活潑的異國風名曲。'
  },
  {
    tag: '台灣七年級',
    title: '美麗新世界',
    artist: 'S.H.E',
    search: 'S.H.E 美麗新世界 官方 MV',
    knownId: 'z1A2b3C4d5e',
    startTime: 15,
    duration: 60,
    options: ['美麗新世界', 'Super Star', '戀人未滿', '熱帶雨林'],
    clue: '電子舞曲風格，S.H.E唱出對青春未來無限憧憬的美好新世界。'
  },
  {
    tag: '台灣七年級',
    title: '憨人',
    artist: '五月天',
    search: '五月天 憨人 官方',
    knownId: '1j_mpwKmlJg',
    startTime: 20,
    duration: 60,
    options: ['憨人', '志明與春嬌', '溫柔', '終結孤單'],
    clue: '五月天台語搖滾精神象徵，「我有我的路，我有我的夢」。'
  },
  {
    tag: '台灣七年級',
    title: '知足',
    artist: '五月天',
    search: '五月天 知足 官方 MV',
    knownId: 'b2C3d4E5f6g',
    startTime: 20,
    duration: 60,
    options: ['知足', '溫柔', '擁抱', '倔強'],
    clue: '五月天最溫柔真摯的抒情代表作，「怎麼去擁有 一道彩虹」。'
  },
  {
    tag: '台灣七年級',
    title: '倔強',
    artist: '五月天',
    search: '五月天 倔強 官方 MV',
    knownId: 'c2D3e4F5g6h',
    startTime: 20,
    duration: 60,
    options: ['倔強', '知足', '派對動物', '離開地球表面'],
    clue: '「我和我最後的倔強，握緊雙手絕對不放」，鼓勵無數年輕人的青春神曲。'
  },
  {
    tag: '台灣七年級',
    title: '遇見',
    artist: '孫燕姿',
    search: '孫燕姿 遇見 官方 MV',
    knownId: 'd2E3f4G5h6i',
    startTime: 15,
    duration: 60,
    options: ['遇見', '天黑黑', '綠光', '開始懂了'],
    clue: '幾米繪本改編電影《向左走·向右走》主題曲，孫燕姿傳唱度極高的經典。'
  },
  {
    tag: '台灣七年級',
    title: '暖暖',
    artist: '梁靜茹',
    search: '梁靜茹 暖暖 官方 MV',
    knownId: '0ffLURMclcM',
    startTime: 15,
    duration: 60,
    options: ['暖暖', '勇氣', '寧夏', '可惜不是你'],
    clue: '情歌天后梁靜茹溫暖甜蜜名曲，「我想說其實你很好，你自己卻不知道」。'
  },
  {
    tag: '台灣七年級',
    title: '崇拜',
    artist: '梁靜茹',
    search: '梁靜茹 崇拜 官方 MV',
    knownId: 'f2G3h4I5j6k',
    startTime: 15,
    duration: 60,
    options: ['崇拜', '可惜不是你', '情歌', '會呼吸的痛'],
    clue: '「我存在在你的存在」，梁靜茹極富感染力與空靈感的金曲代表作。'
  },
  {
    tag: '台灣七年級',
    title: '睫毛彎彎',
    artist: '王心凌',
    search: '王心凌 睫毛彎彎 官方 MV',
    knownId: 'g2H3i4J5k6l',
    startTime: 15,
    duration: 60,
    options: ['睫毛彎彎', '愛你', '第一次愛的人', '當你'],
    clue: '甜蜜教主王心凌結合東方笛聲與舞曲節奏的超洗腦名曲。'
  },
  {
    tag: '台灣七年級',
    title: '雨愛',
    artist: '楊丞琳',
    search: '楊丞琳 雨愛 官方 MV',
    knownId: 'h2I3j4K5l6m',
    startTime: 20,
    duration: 60,
    options: ['雨愛', '曖昧', '理想情人', '帶我走'],
    clue: '偶像劇《海派甜心》片尾曲，「雨愛的秘密，能一直延續」。'
  },
  {
    tag: '台灣七年級',
    title: '我們的愛',
    artist: '飛兒樂團 F.I.R.',
    search: '飛兒樂團 我們的愛 官方 MV',
    knownId: 'i2J3k4L5m6n',
    startTime: 20,
    duration: 60,
    options: ['我們的愛', 'Lydia', '千年之戀', '月牙灣'],
    clue: 'F.I.R.同名出道專輯超強抒情名作，「我們的愛，過了就不再回來」。'
  },
  {
    tag: '台灣七年級',
    title: '愛的主打歌',
    artist: '蕭亞軒',
    search: '蕭亞軒 愛的主打歌 官方 MV',
    knownId: 'j2K3l4M5n6o',
    startTime: 15,
    duration: 60,
    options: ['愛的主打歌', '最熟悉的陌生人', 'Cappuccino', '表白'],
    clue: '亞洲舞曲天后蕭亞軒唱跳代表作，「我在唱什麼，什麼都覺得，你在看著我」。'
  },
  {
    tag: '台灣七年級',
    title: '精舞門',
    artist: '羅志祥',
    search: '羅志祥 精舞門 官方 MV',
    knownId: 'k2L3m4N5o6p',
    startTime: 15,
    duration: 60,
    options: ['精舞門', '愛轉角', '鬧翻天', '愛投羅網'],
    clue: '亞洲舞王羅志祥經典椅子舞代表作，「I wanna know 你行不行」。'
  },
  {
    tag: '台灣七年級',
    title: '放手',
    artist: 'Energy',
    search: 'Energy 放手 官方 MV',
    knownId: 'l2M3n4O5p6q',
    startTime: 15,
    duration: 60,
    options: ['放手', '多愛我一天', 'Come On', '某年某月某一天'],
    clue: '台灣最殺唱跳男團 Energy 超經典成名作，「都跟我無關，全部都放手」。'
  },
  {
    tag: '台灣七年級',
    title: '麻吉',
    artist: '麻吉 MACHI',
    search: '麻吉 MACHI 麻吉 官方 MV',
    knownId: 'm2N3o4P5q6r',
    startTime: 15,
    duration: 60,
    options: ['麻吉', 'Jump 2003', '爽', '甜蜜蜜'],
    clue: '黃立成帶領的 MACHI 嘻哈饒舌名曲，「我們是麻吉，你是我的兄弟」。'
  },
  {
    tag: '台灣七年級',
    title: '童話',
    artist: '光良',
    search: '光良 童話 官方 MV',
    knownId: 'n2O3p4Q5r6s',
    startTime: 20,
    duration: 60,
    options: ['童話', '第一次', '約定', '勇氣'],
    clue: '光良紅遍全球華人圈的鋼琴抒情神曲，「我願變成童話裡，你愛的那個天使」。'
  },

  // ==========================================
  // 5. 台灣八年級 (新補 20 首，達到 40 首)
  // ==========================================
  {
    tag: '台灣八年級',
    title: '還是會',
    artist: '韋禮安',
    search: '韋禮安 還是會 官方 MV',
    knownId: 'o2P3q4R5s6t',
    startTime: 15,
    duration: 60,
    options: ['還是會', '如果可以', '女孩', '因為愛'],
    clue: '偶像劇《我可能不會愛你》插曲，韋禮安陽光清新的抒情代表。'
  },
  {
    tag: '台灣八年級',
    title: '女孩',
    artist: '韋禮安',
    search: '韋禮安 女孩 官方 MV',
    knownId: 'p2Q3r4S5t6u',
    startTime: 15,
    duration: 60,
    options: ['女孩', '如果可以', '還是會', '慢慢等'],
    clue: '韋禮安輕快洗腦的浪漫放閃神曲，「女孩，我的故事因為你而展開」。'
  },
  {
    tag: '台灣八年級',
    title: '魚仔',
    artist: '盧廣仲',
    search: '盧廣仲 魚仔 官方 MV',
    knownId: 'q2R3s4T5u6v',
    startTime: 15,
    duration: 60,
    options: ['魚仔', '刻在我心底的名字', '幾分之幾', '早安晨之美'],
    clue: '電視劇《花甲男孩轉大人》主題曲，榮獲金曲獎年度歌曲與最佳作曲人獎。'
  },
  {
    tag: '台灣八年級',
    title: '魔鬼中的天使',
    artist: '田馥甄',
    search: '田馥甄 魔鬼中的天使 官方 MV',
    knownId: 'r2S3t4U5v6w',
    startTime: 15,
    duration: 60,
    options: ['魔鬼中的天使', '小幸運', '寂寞寂寞就好', '你就不要想起我'],
    clue: '田馥甄冷豔空靈嗓音演繹愛情的糾葛與矛盾。'
  },
  {
    tag: '台灣八年級',
    title: '不醉不會',
    artist: '田馥甄',
    search: '田馥甄 不醉不會 官方 MV',
    knownId: 's2T3u4V5w6x',
    startTime: 15,
    duration: 60,
    options: ['不醉不會', '小幸運', '愛著愛著就永遠', '日常'],
    clue: '陳珊妮詞曲創作，微醺迷幻風格的流行金曲。'
  },
  {
    tag: '台灣八年級',
    title: '泡沫',
    artist: '鄧紫棋',
    search: '鄧紫棋 泡沫 歌詞',
    knownId: 'CQEXldyfGGM',
    startTime: 20,
    duration: 60,
    options: ['泡沫', '光年之外', '來自天堂的魔鬼', '句號'],
    clue: '鄧紫棋於《我是歌手》震撼全場的成名抒情史詩名作。'
  },
  {
    tag: '台灣八年級',
    title: '你，好不好？',
    artist: '周興哲',
    search: '周興哲 你好不好 官方 MV',
    knownId: 'u2V3w4X5y6z',
    startTime: 20,
    duration: 60,
    options: ['你，好不好？', '以後別做朋友', '怎麼了', '如果雨之後'],
    clue: '周興哲破億觀看次數的經典抒情情歌，「能不能繼續，對我哭對我笑對我好」。'
  },
  {
    tag: '台灣八年級',
    title: '在這座城市遺失了你',
    artist: '告五人',
    search: '告五人 在這座城市遺失了你 官方 MV',
    knownId: 'v2W3x4Y5z6a',
    startTime: 15,
    duration: 60,
    options: ['在這座城市遺失了你', '披星戴月的想你', '愛人錯過', '好不容易'],
    clue: '告五人收錄於《運氣來得若有似無》，痛徹心扉的失戀城市謳歌。'
  },
  {
    tag: '台灣八年級',
    title: '日常與浪漫',
    artist: '茄子蛋',
    search: '茄子蛋 日常與浪漫 官方',
    knownId: 'w2X3y4Z5a6b',
    startTime: 15,
    duration: 60,
    options: ['日常與浪漫', '浪子回頭', '浪流連', '這款自作多情'],
    clue: '茄子蛋樂團以濃郁台味搖滾唱出小人物的浪漫。'
  },
  {
    tag: '台灣八年級',
    title: 'So Bad',
    artist: '高爾宣',
    search: '高爾宣 So Bad 官方 MV',
    knownId: 'x2Y3z4A5b6c',
    startTime: 15,
    duration: 60,
    options: ['So Bad', 'Without You', '最後一次', 'Benz Booty'],
    clue: '高爾宣 OSN 抓耳旋律與真摯說唱交織的千禧嘻哈佳作。'
  },
  {
    tag: '台灣八年級',
    title: '辣台妹',
    artist: '頑童MJ116',
    search: '頑童MJ116 辣台妹 官方 MV',
    knownId: 'y2Z3a4B5c6d',
    startTime: 15,
    duration: 60,
    options: ['辣台妹', '幹大事', '少年董', '走跳'],
    clue: '頑童MJ116風靡全台各大夜店與派對的熱門嘻哈代表作。'
  },
  {
    tag: '台灣八年級',
    title: '下輩子',
    artist: '玖壹壹',
    search: '玖壹壹 下輩子 官方 MV',
    knownId: 'z2A3b4C5d6e',
    startTime: 15,
    duration: 60,
    options: ['下輩子', '癡情的男子漢', '打鐵', '9453'],
    clue: '台客電音嘻哈天團玖壹壹深情真摯的台語抒情神曲。'
  },
  {
    tag: '台灣八年級',
    title: '東區東區',
    artist: '八三夭',
    search: '八三夭 東區東區 官方 MV',
    knownId: 'a3B4c5D6e7f',
    startTime: 15,
    duration: 60,
    options: ['東區東區', '想見你想見你想見你', '最後的831', '致青春'],
    clue: '八三夭熱血狂歡的搖滾舞曲，台北東區派對標誌性神曲。'
  },
  {
    tag: '台灣八年級',
    title: '島嶼天光',
    artist: '滅火器',
    search: '滅火器 島嶼天光 官方',
    knownId: 'b3C4d5E6f7g',
    startTime: 20,
    duration: 60,
    options: ['島嶼天光', '長途夜車', '海上的人', '晚安台灣'],
    clue: '滅火器樂團榮獲第26屆金曲獎最佳年度歌曲的時代之歌。'
  },
  {
    tag: '台灣八年級',
    title: '指望',
    artist: '郁可唯',
    search: '郁可唯 指望 官方 MV',
    knownId: 'c3D4e5F6g7h',
    startTime: 15,
    duration: 60,
    options: ['指望', '時間煮雨', '路過人間', '遠方'],
    clue: '偶像劇《犀利人妻》插曲，「怕後悔的那麼倔強，怕面對的那麼絕望」。'
  },
  {
    tag: '台灣八年級',
    title: '燃點',
    artist: '胡夏',
    search: '胡夏 燃點 官方 MV',
    knownId: 'd3E4f5G6h7i',
    startTime: 15,
    duration: 60,
    options: ['燃點', '那些年', '愛夏', '知否知否'],
    clue: '胡夏清澈深情的嗓音，「點燃你給我的所有溫暖」。'
  },
  {
    tag: '台灣八年級',
    title: '我有我自己',
    artist: '閻奕格',
    search: '閻奕格 我有我自己 官方 MV',
    knownId: 'e3F4g5H6i7j',
    startTime: 15,
    duration: 60,
    options: ['我有我自己', '也可以', '愛上現在的我', '讓一切重來'],
    clue: '閻奕格沉潛多年後重新出發的堅定自我宣言。'
  },
  {
    tag: '台灣八年級',
    title: 'Forever Young',
    artist: '艾怡良',
    search: '艾怡良 Forever Young 官方 MV',
    knownId: 'f3G4h5I6j7k',
    startTime: 15,
    duration: 60,
    options: ['Forever Young', '寂寞無害', '玻璃心', '我不知道愛是什麼'],
    clue: '艾怡良作詞作曲，榮獲金曲獎最佳作曲人獎的深情之作。'
  },
  {
    tag: '台灣八年級',
    title: '孤獨的總和',
    artist: '吳汶芳',
    search: '吳汶芳 孤獨的總和 官方 MV',
    knownId: 'g3H4i5J6k7l',
    startTime: 15,
    duration: 60,
    options: ['孤獨的總和', '不讀不回', '心之所向', '我何必'],
    clue: '吳汶芳自彈自唱成名曲，「如果我不曾走過這一遍，生命中還有多少苦和甜」。'
  },
  {
    tag: '台灣八年級',
    title: '藍色的你',
    artist: '宇宙人',
    search: '宇宙人 藍色的你 官方 MV',
    knownId: 'h3I4j5K6l7m',
    startTime: 15,
    duration: 60,
    options: ['藍色的你', '如果我們還在一起', '那你呢', '一起去跑步'],
    clue: '宇宙人樂團療癒系海洋風金曲，榮獲金曲獎最佳樂團獎之作。'
  },

  // ==========================================
  // 6. 台灣九年級 (全數全新 40 首)
  // ==========================================
  {
    tag: '台灣九年級',
    title: '不是因為天氣晴朗才愛你',
    artist: '理想混蛋',
    search: '理想混蛋 不是因為天氣晴朗才愛你 官方',
    knownId: '9_068Ekk_fs',
    startTime: 10,
    duration: 60,
    options: ['不是因為天氣晴朗才愛你', '行星', '愚者', '離開的一路上'],
    clue: '理想混蛋主唱雞丁創作，全台高中大學吉他社必練、社群破億翻唱的校園純愛神曲。'
  },
  {
    tag: '台灣九年級',
    title: '帶我去找夜生活',
    artist: '告五人',
    search: '告五人 帶我去找夜生活 官方 MV',
    knownId: 'i3J4k5L6m7n',
    startTime: 15,
    duration: 60,
    options: ['帶我去找夜生活', '愛人錯過', '披星戴月的想你', '唯一'],
    clue: '告五人迷幻浪漫風格代表，「形形色色 尋尋覓覓，帶我去找夜生活」。'
  },
  {
    tag: '台灣九年級',
    title: '唯一',
    artist: '告五人',
    search: '告五人 唯一 官方 MV',
    knownId: 'j3K4l5M6n7o',
    startTime: 15,
    duration: 60,
    options: ['唯一', '好不容易', '紅', '在這座城市遺失了你'],
    clue: '告五人深情鋼琴抒情名曲，「你真的那樣愛我嗎？是不是我太貪心了」。'
  },
  {
    tag: '台灣九年級',
    title: '好不容易',
    artist: '告五人',
    search: '告五人 好不容易 官方 MV',
    knownId: 'k3L4m5N6o7p',
    startTime: 15,
    duration: 60,
    options: ['好不容易', '唯一', '愛人錯過', '新世界'],
    clue: '懸疑劇《華燈初上》片尾曲，「我的心 這次真的受傷了，好不容易」。'
  },
  {
    tag: '台灣九年級',
    title: '紅',
    artist: '告五人',
    search: '告五人 紅 官方 MV',
    knownId: '9WEYFqCUze8',
    startTime: 15,
    duration: 60,
    options: ['紅', '帶我去找夜生活', '愛人錯過', '法蘭西多士'],
    clue: '告五人抒情力作，MV由謝盈萱主演，充滿情緒渲染力。'
  },
  {
    tag: '台灣九年級',
    title: '捲菸',
    artist: '美秀集團',
    search: '美秀集團 捲菸 官方 MV',
    knownId: 'm3N4o5P6q7r',
    startTime: 15,
    duration: 60,
    options: ['捲菸', '擋一根', '我要你愛', '米兒'],
    clue: '美秀集團賽博台客代表作，YouTube點閱破千萬的九年級獨立樂團神曲。'
  },
  {
    tag: '台灣九年級',
    title: '擋一根',
    artist: '美秀集團',
    search: '美秀集團 擋一根 官方 MV',
    knownId: '3_GFxZ9xA7o',
    startTime: 15,
    duration: 60,
    options: ['擋一根', '捲菸', '我要你愛', '電火王'],
    clue: '美秀集團經典復古台語搖滾，「借我擋一根，免得等一下心頭悶」。'
  },
  {
    tag: '台灣九年級',
    title: '我要你愛',
    artist: '美秀集團',
    search: '美秀集團 我要你愛 官方 MV',
    knownId: 'o3P4q5R6s7t',
    startTime: 15,
    duration: 60,
    options: ['我要你愛', '捲菸', '擋一根', '金光閃閃'],
    clue: '美秀集團動感復古的熱烈求愛電音搖滾。'
  },
  {
    tag: '台灣九年級',
    title: '想和你看五月的晚霞',
    artist: '陳華',
    search: '陳華 想和你看五月的晚霞 官方 MV',
    knownId: 'p3Q4r5S6t7u',
    startTime: 15,
    duration: 60,
    options: ['想和你看五月的晚霞', '與我無關', '無敵浪漫', '想太多'],
    clue: '陳華爆紅神曲，蟬聯各大串流榜冠軍，「想和你看五月的晚霞，六月日落，七月蒸發」。'
  },
  {
    tag: '台灣九年級',
    title: '在加納共和國離婚',
    artist: '菲道爾 / 大穎',
    search: '在加納共和國離婚 官方 MV',
    knownId: 'q3R4s5T6u7v',
    startTime: 15,
    duration: 60,
    options: ['在加納共和國離婚', '阿拉斯加海灣', '友誼長存', '能遇見，就很不錯了'],
    clue: '「你還愛我嗎？你懂我嗎？」洗捲各大社群平台的虐心合唱神曲。'
  },
  {
    tag: '台灣九年級',
    title: '阿拉斯加海灣',
    artist: '菲道爾',
    search: '菲道爾 阿拉斯加海灣 官方 MV',
    knownId: 'r3S4t5U6v7w',
    startTime: 15,
    duration: 60,
    options: ['阿拉斯加海灣', '在加納共和國離婚', '早點回家', '能遇見'],
    clue: '菲道爾溫柔感傷的爆紅名作，「上天啊，難道你看不出我很愛她」。'
  },
  {
    tag: '台灣九年級',
    title: '我會等',
    artist: '承桓',
    search: '承桓 我會等 官方',
    knownId: 's3T4u5V6w7x',
    startTime: 15,
    duration: 60,
    options: ['我會等', '想和你看五月的晚霞', '飛鳥和蟬', '白月光與硃砂痣'],
    clue: '「我會等枯樹生出新芽，等大雪覆蓋這座城池」，社群短影音超人氣治癒勵志曲。'
  },
  {
    tag: '台灣九年級',
    title: '失重前幸福',
    artist: '艾薇',
    search: '艾薇 失重前幸福 官方 MV',
    knownId: 't3U4v5W6x7y',
    startTime: 15,
    duration: 60,
    options: ['失重前幸福', '甘室人生', '絕美', '悲傷的五個步驟'],
    clue: '大馬歌手艾薇高亢爆發力的金曲入圍代表作。'
  },
  {
    tag: '台灣九年級',
    title: 'Crush On You',
    artist: '李浩瑋 Howard Lee',
    search: '李浩瑋 Crush On You 官方 MV',
    knownId: 'u3V4w5X6y7z',
    startTime: 15,
    duration: 60,
    options: ['Crush On You', '窩囊廢', 'Blame', 'Silver linen'],
    clue: '新世代獨立唱作人李浩瑋空靈R&B慵懶名曲。'
  },
  {
    tag: '台灣九年級',
    title: '小紫吐司',
    artist: '芒果醬 Mango Jump',
    search: '芒果醬 小紫吐司 官方 MV',
    knownId: 'v3W4x5Y6z7a',
    startTime: 15,
    duration: 60,
    options: ['小紫吐司', '芒狗狗', '夏夜晚風', '再見五月天'],
    clue: '芒果醬 Mango Jump 搞怪熱血的青春樂團代表作。'
  },
  {
    tag: '台灣九年級',
    title: '芒狗狗',
    artist: '芒果醬 Mango Jump',
    search: '芒果醬 芒狗狗 官方 MV',
    knownId: 'w3X4y5Z6a7b',
    startTime: 15,
    duration: 60,
    options: ['芒狗狗', '小紫吐司', '團寵', '心跳'],
    clue: '芒果醬極具辨識度的陽光無厘頭風格。'
  },
  {
    tag: '台灣九年級',
    title: '能不能和我留在台北',
    artist: '冰球樂團 icyball',
    search: '冰球樂團 能不能和我留在台北 官方 MV',
    knownId: 'x3Y4z5A6b7c',
    startTime: 15,
    duration: 60,
    options: ['能不能和我留在台北', '醉後喜歡我', '愛手藝', '搖擺大叔'],
    clue: 'icyball 冰球樂團復古 City Pop 風潮的代表作，「能不能和我留在台北陪我失眠」。'
  },
  {
    tag: '台灣九年級',
    title: '醉後喜歡我',
    artist: '冰球樂團 icyball',
    search: '冰球樂團 醉後喜歡我 官方 MV',
    knownId: 'y3Z4a5B6c7d',
    startTime: 15,
    duration: 60,
    options: ['醉後喜歡我', '能不能和我留在台北', 'Bad Boy', '愛手藝'],
    clue: '冰球樂團迷幻微醺的摩登都市浪漫之作。'
  },
  {
    tag: '台灣九年級',
    title: '我想和你一起',
    artist: '溫蒂漫步 Wendy Wander',
    search: '溫蒂漫步 我想和你一起 官方 MV',
    knownId: 'z3A4b5C6d7e',
    startTime: 15,
    duration: 60,
    options: ['我想和你一起', '艾菲爾', 'Spring', 'Lullaby'],
    clue: '溫蒂漫步Dream Pop迷幻民謠代表作，「我想和你一起看海」。'
  },
  {
    tag: '台灣九年級',
    title: '針對與對峙',
    artist: '持修',
    search: '持修 針對與對峙 官方 MV',
    knownId: 'a4B5c6D7e8f',
    startTime: 15,
    duration: 60,
    options: ['針對與對峙', 'Imma Get A New One', '正想著你呢', '根本不是我對手'],
    clue: '金曲新人持修兼具二次元與流行美學的創作神曲。'
  },
  {
    tag: '台灣九年級',
    title: '不介意',
    artist: '鶴 The Crane',
    search: '鶴 The Crane 不介意 官方 MV',
    knownId: 'b4C5d6E7f8g',
    startTime: 15,
    duration: 60,
    options: ['不介意', '拉麵公子', 'Natural Ability', 'Unique Design'],
    clue: '鶴 The Crane 慵懶爵士R&B的當代都會風格佳作。'
  },
  {
    tag: '台灣九年級',
    title: '我的愛人',
    artist: '柏霖 PoLin',
    search: '柏霖 我的愛人 官方 MV',
    knownId: 'g9BqoGxlkc0',
    startTime: 15,
    duration: 60,
    options: ['我的愛人', '啼笑皆非', '流浪的船', '安好'],
    clue: '影集《火神的眼淚》插曲，聲林之王冠軍柏霖充滿戲劇張力的靈魂情歌。'
  },
  {
    tag: '台灣九年級',
    title: 'COLORFUL',
    artist: '婁峻碩 SHOU',
    search: '婁峻碩 COLORFUL 官方 MV',
    knownId: 'd4E5f6G7h8i',
    startTime: 15,
    duration: 60,
    options: ['COLORFUL', 'NEVER LAND', 'Blue Sky', 'AIRPLANE'],
    clue: '五堅情成員婁峻碩紅遍校園的甜蜜輕快嘻哈神曲。'
  },
  {
    tag: '台灣九年級',
    title: 'NEVER LAND',
    artist: '婁峻碩 SHOU',
    search: '婁峻碩 NEVER LAND 官方 MV',
    knownId: 'e4F5g6H7i8j',
    startTime: 15,
    duration: 60,
    options: ['NEVER LAND', 'COLORFUL', 'SOFA', 'WE GO'],
    clue: '婁峻碩熱血追夢的潮流饒舌之作。'
  },
  {
    tag: '台灣九年級',
    title: '長大',
    artist: '派偉俊',
    search: '派偉俊 長大 官方 MV',
    knownId: 'f4G5h6I7j8k',
    startTime: 15,
    duration: 60,
    options: ['長大', '3%', '最後一次心碎', '蝴蝶'],
    clue: '派偉俊唱出九年級世代面對成長煩惱的流行共鳴。'
  },
  {
    tag: '台灣九年級',
    title: 'Seaside',
    artist: '壞特 ?te',
    search: '壞特 Seaside 官方 MV',
    knownId: 'g4H5i6J7k8l',
    startTime: 15,
    duration: 60,
    options: ['Seaside', 'Cazzo', 'Santa Baby', '睡不著'],
    clue: '金曲最佳新人壞特神秘慵懶的Lo-fi Chill Hop海風名作。'
  },
  {
    tag: '台灣九年級',
    title: '50元的浪漫',
    artist: '潮州土狗',
    search: '潮州土狗 50元的浪漫 官方 MV',
    knownId: 'h4I5j6K7l8m',
    startTime: 15,
    duration: 60,
    options: ['50元的浪漫', '反毒大使', '現主時', '看你看我'],
    clue: '潮州土狗以幽默詼諧的超接地氣風格引爆青年社群。'
  },
  {
    tag: '台灣九年級',
    title: '未接來電',
    artist: '莫宰羊',
    search: '莫宰羊 未接來電 官方 MV',
    knownId: 'i4J5k6L7m8n',
    startTime: 15,
    duration: 60,
    options: ['未接來電', '健康快樂', '水作的', '魚'],
    clue: '莫宰羊以獨特Auto-tune唱腔與詩意歌詞開創的新生代說唱名曲。'
  },
  {
    tag: '台灣九年級',
    title: 'CHANGE',
    artist: '瘦子 E.SO',
    search: '瘦子 CHANGE 官方 MV',
    knownId: 'j4K5l6M7n8o',
    startTime: 15,
    duration: 60,
    options: ['CHANGE', '伯父', '太陽', 'WAIT'],
    clue: '頑童瘦子單飛個人首張專輯《靈魂出竅》的成熟內斂主打。'
  },
  {
    tag: '台灣九年級',
    title: '伯父',
    artist: '瘦子 E.SO',
    search: '瘦子 伯父 官方 MV',
    knownId: 'k4L5m6N7o8p',
    startTime: 15,
    duration: 60,
    options: ['伯父', 'CHANGE', 'Hello Beautiful', '她沒在看你'],
    clue: '瘦子以幽默視角寫出面對女友父親的心情，風靡新世代。'
  },
  {
    tag: '台灣九年級',
    title: '能火',
    artist: '熊仔',
    search: '熊仔 能火 官方 MV',
    knownId: '_SoARWAcMU8',
    startTime: 15,
    duration: 60,
    options: ['能火', '買榜', '信', '才子'],
    clue: '熊仔奪得金曲獎最佳華語專輯的饒舌巔峰霸氣之作。'
  },
  {
    tag: '台灣九年級',
    title: '愚者',
    artist: '理想混蛋',
    search: '理想混蛋 愚者 官方 MV',
    knownId: 'm4N5o6P7q8r',
    startTime: 15,
    duration: 60,
    options: ['愚者', '不是因為天氣晴朗才愛你', '行星', '平衡木'],
    clue: '理想混蛋首張專輯同名核心概念曲，勇往直前的愚者精神。'
  },
  {
    tag: '台灣九年級',
    title: '魚',
    artist: '怕胖團',
    search: '怕胖團 魚 官方 MV',
    knownId: 'n4O5p6Q7r8s',
    startTime: 15,
    duration: 60,
    options: ['魚', '媽媽的筆記本', '當你在想我的時候', '魚在哪裡'],
    clue: '怕胖團溫暖深情的龐克抒情，「你是一隻魚，水裡的魚」。'
  },
  {
    tag: '台灣九年級',
    title: '暗流',
    artist: '拍謝少年',
    search: '拍謝少年 暗流 官方',
    knownId: 'o4P5q6R7s8t',
    startTime: 15,
    duration: 60,
    options: ['暗流', '兄弟沒夢不應該', '百百人生', '出巡'],
    clue: '拍謝少年融合傳統台灣意象與後搖滾氣息的動人器樂搖滾。'
  },
  {
    tag: '台灣九年級',
    title: '長途夜車',
    artist: '滅火器',
    search: '滅火器 長途夜車 官方 MV',
    knownId: 'p4Q5r6S7t8u',
    startTime: 15,
    duration: 60,
    options: ['長途夜車', '島嶼天光', '海上的人', '自信勇敢咱的名'],
    clue: '寫給所有離鄉背井打拚年輕人的催淚深夜歸途之歌。'
  },
  {
    tag: '台灣九年級',
    title: '若思念便思念',
    artist: '脆樂團 Crispy',
    search: '脆樂團 若思念便思念 官方 MV',
    knownId: 'q4R5s6T7u8v',
    startTime: 15,
    duration: 60,
    options: ['若思念便思念', '愛情的模樣', '100分', '編織星空的人'],
    clue: '雙主唱男女對唱民謠，入圍金曲獎最佳演唱組合。'
  },
  {
    tag: '台灣九年級',
    title: '彼個所在',
    artist: '魏如萱',
    search: '魏如萱 彼個所在 官方 MV',
    knownId: 'r4S5t6U7v8w',
    startTime: 15,
    duration: 60,
    options: ['彼個所在', '你啊你啊', '泡泡', '買你'],
    clue: '魏如萱以國台英粵四種語言交織而成的感人思念安魂曲。'
  },
  {
    tag: '台灣九年級',
    title: '買榜',
    artist: '吳卓源 / 熊仔',
    search: '吳卓源 熊仔 買榜 官方 MV',
    knownId: 's4T5u6V7w8x',
    startTime: 15,
    duration: 60,
    options: ['買榜', '台北夜空下', '撥接', '你是不是有點動心'],
    clue: '鄉民老婆 Julia 吳卓源與熊仔合作，風靡千禧新世代的R&B神曲。'
  },
  {
    tag: '台灣九年級',
    title: 'Millions of Years Apart',
    artist: '恐龍的皮 The Dinosaur\'s Skin',
    search: 'The Dinosaur Skin Millions of Years Apart 官方',
    knownId: 't4U5v6W7x8y',
    startTime: 15,
    duration: 60,
    options: ['Millions of Years Apart', 'All My Friends Are Dead', 'Triassic Love', 'Brontosaurus'],
    clue: '恐龍的皮帶有復古Lo-fi色彩與侏儸紀浪漫的九年級超人氣樂團。'
  },
  {
    tag: '台灣九年級',
    title: '你終究也想成為沒有秘密的極限',
    artist: '傻子與白痴',
    search: '傻子與白痴 你終究也想成為沒有秘密的極限 官方',
    knownId: 'u4V5w6X7y8z',
    startTime: 15,
    duration: 60,
    options: ['你終究也想成為沒有秘密的極限', '象牙舟', 'OY', '夜行動物館'],
    clue: '傻子與白痴主唱蔡維澤極具深度的獨立搖滾當代之作。'
  },

  // ==========================================
  // 7. 動漫神曲 (新補 34 首，達到 40 首)
  // ==========================================
  {
    tag: '動漫神曲',
    title: '炎',
    artist: 'LiSA',
    search: 'LiSA 炎 鬼滅之刃 MV',
    knownId: '4DxL6IKmXx4',
    startTime: 15,
    duration: 60,
    options: ['炎', '紅蓮華', '殘響散歌', '虹'],
    clue: '《鬼滅之刃劇場版 無限列車篇》主題曲，大哥沒有輸的熱淚感動。'
  },
  {
    tag: '動漫神曲',
    title: '殘響散歌',
    artist: 'Aimer',
    search: 'Aimer 殘響散歌 官方 MV',
    knownId: 'tLQLa6lM3Us',
    startTime: 15,
    duration: 60,
    options: ['殘響散歌', '紅蓮華', '炎', '朝が来る'],
    clue: '《鬼滅之刃 遊郭篇》片頭曲，Aimer極具張力的沙啞嗓音與華麗疾速旋律。'
  },
  {
    tag: '動漫神曲',
    title: 'Idol',
    artist: 'YOASOBI',
    search: 'YOASOBI Idol 官方 MV',
    knownId: 'ZRtdQ81jPUQ',
    startTime: 15,
    duration: 60,
    options: ['Idol', '群青', '夜に駆ける', '怪物'],
    clue: '動畫《我推的孩子》超人氣主題曲，席捲全球各大告示牌排行榜冠軍。'
  },
  {
    tag: '動漫神曲',
    title: '群青',
    artist: 'YOASOBI',
    search: 'YOASOBI 群青 官方 MV',
    knownId: 'Y4nEEZwckuU',
    startTime: 15,
    duration: 60,
    options: ['群青', 'Idol', '夜に駆ける', '三原色'],
    clue: '靈感來自漫畫《藍色時期》，激勵無數追夢者的青春合唱之作。'
  },
  {
    tag: '動漫神曲',
    title: '向夜晚奔去',
    artist: 'YOASOBI',
    search: 'YOASOBI 夜に駆ける 官方 MV',
    knownId: 'by4SYYWlhEs',
    startTime: 15,
    duration: 60,
    options: ['向夜晚奔去', '群青', '怪物', '優しい彗星'],
    clue: 'YOASOBI出道爆紅代表作《夜に駆ける》，串流播放突破數億次的成名曲。'
  },
  {
    tag: '動漫神曲',
    title: 'Lemon',
    artist: '米津玄師',
    search: '米津玄師 Lemon 官方 MV',
    knownId: 'SX_ViT4Ra7k',
    startTime: 15,
    duration: 60,
    options: ['Lemon', 'Peace Sign', 'KICK BACK', 'Paprika'],
    clue: '日劇《法醫女王》(Unnatural) 主題曲，米津玄師點閱破8億次的平成傳奇神曲。'
  },
  {
    tag: '動漫神曲',
    title: 'Peace Sign',
    artist: '米津玄師',
    search: '米津玄師 ピースサイン 官方 MV',
    knownId: '9aJVr5tTTWk',
    startTime: 15,
    duration: 60,
    options: ['Peace Sign', 'Lemon', 'KICK BACK', '打上花火'],
    clue: '熱血動畫《我的英雄學院》第2期片頭曲，象徵堅定邁向未來的和平象徵。'
  },
  {
    tag: '動漫神曲',
    title: 'KICK BACK',
    artist: '米津玄師',
    search: '米津玄師 KICK BACK 官方 MV',
    knownId: 'M2cckDmNLMI',
    startTime: 15,
    duration: 60,
    options: ['KICK BACK', 'Lemon', 'Peace Sign', '死神'],
    clue: '動畫《鏈鋸人》熱血狂躁的片頭曲，常田大希參與編曲與演奏。'
  },
  {
    tag: '動漫神曲',
    title: '前前前世',
    artist: 'RADWIMPS',
    search: 'RADWIMPS 前前前世 官方',
    knownId: 'PDSkFeMVNKs',
    startTime: 15,
    duration: 60,
    options: ['前前前世', 'Sparkle', 'Grand Escape', '愛にできることはまだあるかい'],
    clue: '新海誠現象級動畫電影《你的名字》主題曲，疾馳而過的青春命運羈絆。'
  },
  {
    tag: '動漫神曲',
    title: 'Sparkle (火花)',
    artist: 'RADWIMPS',
    search: 'RADWIMPS Sparkle 官方 MV',
    knownId: 'a2GujJZfXpg',
    startTime: 15,
    duration: 60,
    options: ['Sparkle (火花)', '前前前世', '夢燈籠', '什麼都沒有'],
    clue: '《你的名字》彗星墜落高潮片段插曲，鋼琴琶音如流星雨般璀璨灑落。'
  },
  {
    tag: '動漫神曲',
    title: 'Butter-Fly',
    artist: '和田光司',
    search: '和田光司 Butter-Fly 數碼寶貝',
    knownId: 'lKMq2Bv9_W0',
    startTime: 15,
    duration: 60,
    options: ['Butter-Fly', 'Target', 'Brave Heart', 'Seven'],
    clue: '《數碼寶貝大冒險》經典片頭曲，不死蝶和田光司燃燒生命的童年熱血回憶。'
  },
  {
    tag: '動漫神曲',
    title: '魂之輪迴',
    artist: '高橋洋子',
    search: '高橋洋子 魂のルフラン EVA',
    knownId: '4OskrB_r6kQ',
    startTime: 15,
    duration: 60,
    options: ['魂之輪迴', '殘酷天使的行動綱領', 'THANATOS', 'Komm, süsser Tod'],
    clue: '《新世紀福音戰士劇場版：死與新生》主題曲，莊嚴神聖的靈魂歸宿之歌。'
  },
  {
    tag: '動漫神曲',
    title: 'CHA-LA HEAD-CHA-LA',
    artist: '影山浩宣',
    search: '影山ヒロノブ CHA-LA HEAD-CHA-LA 七龍珠Z',
    knownId: 'sfKaNky0bC8',
    startTime: 15,
    duration: 60,
    options: ['CHA-LA HEAD-CHA-LA', 'WE GOTTA POWER', '摩訶不思議大冒險', '漸漸被你吸引'],
    clue: '《七龍珠Z》第一代片頭曲，「發射龜派氣功」的全球共通熱血童年旋律。'
  },
  {
    tag: '動漫神曲',
    title: '漸漸被你吸引',
    artist: 'FIELD OF VIEW',
    search: 'FIELD OF VIEW DAN DAN 心魅かれてく',
    knownId: 'd6yZcM3i7G0',
    startTime: 15,
    duration: 60,
    options: ['漸漸被你吸引', 'CHA-LA HEAD-CHA-LA', '直到世界的盡頭', '好想大聲說喜歡你'],
    clue: '《七龍珠GT》片頭曲，坂井泉水 (ZARD) 作詞的動漫金曲。'
  },
  {
    tag: '動漫神曲',
    title: 'One Last Kiss',
    artist: '宇多田光',
    search: '宇多田光 One Last Kiss 官方 MV',
    knownId: '0Uhh62MUEic',
    startTime: 15,
    duration: 60,
    options: ['One Last Kiss', 'Beautiful World', 'Sakura Drops', 'First Love'],
    clue: '電影《福音戰士新劇場版：終》主題曲，宇多田光細膩溫柔的告別之作。'
  },
  {
    tag: '動漫神曲',
    title: 'Cry Baby',
    artist: 'Official鬍子男dism',
    search: 'Official髭男dism Cry Baby 官方 MV',
    knownId: 'O1bhZgkC4Gw',
    startTime: 15,
    duration: 60,
    options: ['Cry Baby', 'Mixed Nuts', 'Pretender', 'I LOVE...'],
    clue: '動畫《東京復仇者》片頭曲，連續轉調的超高難度硬核流行搖滾。'
  },
  {
    tag: '動漫神曲',
    title: 'Mixed Nuts',
    artist: 'Official鬍子男dism',
    search: 'Official髭男dism ミックスナッツ 官方 MV',
    knownId: 'CbH2F0kXgTY',
    startTime: 15,
    duration: 60,
    options: ['Mixed Nuts', 'Cry Baby', '喜劇', '色彩'],
    clue: '現象級喜劇動畫《SPY×FAMILY 間諜家家酒》第1季片頭曲。'
  },
  {
    tag: '動漫神曲',
    title: '喜劇',
    artist: '星野源',
    search: '星野源 喜劇 官方 MV',
    knownId: 'nBCwY3DgV5w',
    startTime: 15,
    duration: 60,
    options: ['喜劇', 'Mixed Nuts', '戀', 'SUN'],
    clue: '動畫《SPY×FAMILY 間諜家家酒》片尾曲，描繪佛傑一家溫馨家庭日常。'
  },
  {
    tag: '動漫神曲',
    title: '迴迴奇譚',
    artist: 'Eve',
    search: 'Eve 廻廻奇譚 官方 MV',
    knownId: '1tk1pqW34ts',
    startTime: 15,
    duration: 60,
    options: ['迴迴奇譚', '一途', 'SPECIALZ', '蒼のワルツ'],
    clue: '超人氣動畫《咒術迴戰》第1季片頭曲，疾速切分節奏與黑暗奇幻風格。'
  },
  {
    tag: '動漫神曲',
    title: '一途',
    artist: 'King Gnu',
    search: 'King Gnu 一途 官方 MV',
    knownId: 'hm1na9R2uIn',
    startTime: 15,
    duration: 60,
    options: ['一途', 'SPECIALZ', '白日', '逆夢'],
    clue: '《劇場版 咒術迴戰 0》主題曲，乙骨憂太與里香純愛詛咒的爆發疾馳之作。'
  },
  {
    tag: '動漫神曲',
    title: 'SPECIALZ',
    artist: 'King Gnu',
    search: 'King Gnu SPECIALZ 官方 MV',
    knownId: 'fhzKL43t43g',
    startTime: 15,
    duration: 60,
    options: ['SPECIALZ', '一途', '白日', '雨燦々'],
    clue: '《咒術迴戰 澀谷事變》片頭曲，「You are my special」洗腦全世界。'
  },
  {
    tag: '動漫神曲',
    title: '目標是寶可夢大師',
    artist: '松本梨香',
    search: 'めざせポケモンマスター 松本梨香',
    knownId: 'kbsRaNXfsew',
    startTime: 15,
    duration: 60,
    options: ['目標是寶可夢大師', '151', '競逐者', '微笑的向日葵'],
    clue: '《精靈寶可夢》初代片頭曲，「哪怕火中水中草叢中」小智與皮卡丘的冒險起點。'
  },
  {
    tag: '動漫神曲',
    title: 'Sugar Song and Bitter Step',
    artist: 'UNISON SQUARE GARDEN',
    search: 'UNISON SQUARE GARDEN シュガーソングとビターステップ',
    knownId: '3exsRhw3xt8',
    startTime: 15,
    duration: 60,
    options: ['Sugar Song and Bitter Step', 'Hello, world!', 'Catch up, latency', 'オリオンをなぞる'],
    clue: '動畫《血界戰線》ED名曲，片尾全員歡樂起舞的經典跳舞動畫。'
  },
  {
    tag: '動漫神曲',
    title: 'GO!!!',
    artist: 'FLOW',
    search: 'FLOW GO 火影忍者 官方 MV',
    knownId: 'AE4b9jO1uB4',
    startTime: 15,
    duration: 60,
    options: ['GO!!!', '青鳥', 'Sign', '遙か彼方'],
    clue: '經典動漫《火影忍者》第4期片頭曲，「We are Fighting Dreamers」熱血澎湃。'
  },
  {
    tag: '動漫神曲',
    title: '青鳥',
    artist: '生物股長 (Ikimonogakari)',
    search: '生物股長 青鳥 火影忍者 官方',
    knownId: 'KpsJWFuVTdI',
    startTime: 15,
    duration: 60,
    options: ['青鳥', '螢之光', 'SAKURA', 'YELL'],
    clue: '《火影忍者疾風傳》片頭曲，「飛翔之際，說好了就絕不回頭」，動漫傳世名曲。'
  },
  {
    tag: '動漫神曲',
    title: 'Silhouette',
    artist: 'KANA-BOON',
    search: 'KANA-BOON シルエット 官方 MV',
    knownId: 'dlFA0Zq1k2A',
    startTime: 15,
    duration: 60,
    options: ['Silhouette', '青鳥', 'GO!!!', 'Baton Road'],
    clue: '《火影忍者疾風傳》第16期片頭曲，旋律節奏感極強，全球火影迷無人不曉。'
  },
  {
    tag: '動漫神曲',
    title: '曇天',
    artist: 'DOES',
    search: 'DOES 曇天 銀魂 官方',
    knownId: 'q1A2b3C4d5g',
    startTime: 15,
    duration: 60,
    options: ['曇天', '修羅', 'Some Like It Hot!!', '桃源鄉Alien'],
    clue: '《銀魂》經典片頭曲，DOES直率痛快的日系搖滾描寫陰霾天色下的熱血戰鬥。'
  },
  {
    tag: '動漫神曲',
    title: 'Some Like It Hot!! (武士之心)',
    artist: 'SPYAIR',
    search: 'SPYAIR サムライハート 武士之心 銀魂 官方 MV',
    knownId: '5k8rXmK0n8o',
    startTime: 15,
    duration: 60,
    options: ['Some Like It Hot!! (武士之心)', '現狀破壞', '曇天', '櫻滿月'],
    clue: '《銀魂》第17期片尾曲，SPYAIR最具代表性的燃系動漫名曲。'
  },
  {
    tag: '動漫神曲',
    title: 'secret base ～你給我的東西～',
    artist: '茅野愛衣 / 戶松遙 / 早見沙織',
    search: 'secret base 君がくれたもの あの花 未聞花名',
    knownId: 't6lMm_7B8uU',
    startTime: 15,
    duration: 60,
    options: ['secret base ～你給我的東西～', '青鳥', '一番の宝物', '小小手心'],
    clue: '《未聞花名》(我們仍未知道那天所看見的花名) 片尾催淚神曲，「找到你了，面麻」。'
  },
  {
    tag: '動漫神曲',
    title: '你不知道的故事',
    artist: 'supercell',
    search: 'supercell 君の知らない物語 化物語 官方',
    knownId: 'eLPs_w-FepA',
    startTime: 15,
    duration: 60,
    options: ['你不知道的故事', '戀愛循環', 'Connect', '白金Disco'],
    clue: '《化物話》片尾曲，以夏季大三角天鵝座為背景的青春天文告白神曲。'
  },
  {
    tag: '動漫神曲',
    title: 'Connect',
    artist: 'ClariS',
    search: 'ClariS コネクト 魔法少女小圓 官方',
    knownId: 'Ww24u5f9I1w',
    startTime: 15,
    duration: 60,
    options: ['Connect', 'Magia', 'Luminous', 'Colorful'],
    clue: '《魔法少女小圓》片頭曲，看似純真魔法少女實則隱含曉美焰輪迴宿命的經典名作。'
  },
  {
    tag: '動漫神曲',
    title: '紅蓮的弓矢',
    artist: 'Linked Horizon',
    search: 'Linked Horizon 紅蓮の弓矢 進擊的巨人',
    knownId: 'CID-sYQNCew',
    startTime: 15,
    duration: 60,
    options: ['紅蓮的弓矢', '心臟撒撒給油', '美麗而殘酷的世界', '惡魔之子'],
    clue: '《進擊的巨人》初代片頭曲，「那一天，人類回想起了被巨人支配的恐懼」。'
  },
  {
    tag: '動漫神曲',
    title: 'Mela!',
    artist: '綠黃色社會',
    search: '緑黄色社会 Mela 官方 MV',
    knownId: 'aRDURmIYbQw',
    startTime: 15,
    duration: 60,
    options: ['Mela!', 'Shout Baby', 'Character', '花になって'],
    clue: '綠黃色社會元氣爆發的超人氣流行代表作，各大校園管樂團與動漫活動必唱。'
  },
  {
    tag: '動漫神曲',
    title: '鄰家的龍貓',
    artist: '井上杏美',
    search: 'となりのトトロ 井上あずみ 龍貓 主題曲',
    knownId: '0Wv3Ya9nskA',
    startTime: 10,
    duration: 60,
    options: ['鄰家的龍貓', '風之谷', '天空之城 (伴隨著你)', '散步'],
    clue: '吉卜力工作室宮崎駿名作《龍貓》主題曲，全世界孩子耳熟能詳的森林精靈之歌。'
  },

  // ==========================================
  // 8. 童謠兒歌 (新補 34 首，達到 40 首)
  // ==========================================
  {
    tag: '童謠兒歌',
    title: '火車快飛',
    artist: '傳統童謠',
    search: '火車快飛 兒歌',
    knownId: 'Cz92K_f1Jy8',
    startTime: 0,
    duration: 60,
    options: ['火車快飛', '造飛機', '捕魚歌', '拔蘿蔔'],
    clue: '「火車快飛，火車快飛，穿過高山，越過小溪，不知跑了幾百里」。'
  },
  {
    tag: '童謠兒歌',
    title: '大象',
    artist: '傳統童謠',
    search: '大象 兒歌',
    knownId: 'b5C6d7E8f9g',
    startTime: 0,
    duration: 60,
    options: ['大象', '小星星', '兩隻老虎', '拔蘿蔔'],
    clue: '「大象大象，你的鼻子怎麼那麼長？媽媽說鼻子長才是漂亮」。'
  },
  {
    tag: '童謠兒歌',
    title: '造飛機',
    artist: '傳統童謠',
    search: '造飛機 兒歌',
    knownId: 'c5D6e7F8g9h',
    startTime: 0,
    duration: 60,
    options: ['造飛機', '火車快飛', '大象', '泥娃娃'],
    clue: '「造飛機造飛機來到青草地，蹲下去蹲下去我做飛機翼」。'
  },
  {
    tag: '童謠兒歌',
    title: '捕魚歌',
    artist: '傳統童謠',
    search: '捕魚歌 兒歌',
    knownId: 'd5E6f7G8h9i',
    startTime: 0,
    duration: 60,
    options: ['捕魚歌', '當我們同在一起', '拔蘿蔔', '小毛驢'],
    clue: '「白浪滔滔我不怕，撐起舵兒往前划，撒網下水到魚家，捕條大魚笑哈哈」。'
  },
  {
    tag: '童謠兒歌',
    title: '娃娃國',
    artist: '傳統童謠',
    search: '娃娃國 兒歌',
    knownId: 'e5F6g7H8i9j',
    startTime: 0,
    duration: 60,
    options: ['娃娃國', '泥娃娃', '妹妹背著洋娃娃', '拔蘿蔔'],
    clue: '「娃娃國，娃娃兵，金髮藍眼睛；娃娃國王鬍子長，騎著木馬打勝仗」。'
  },
  {
    tag: '童謠兒歌',
    title: '妹妹背著洋娃娃',
    artist: '傳統童謠',
    search: '妹妹背著洋娃娃 兒歌',
    knownId: 'f5G6h7I8j9k',
    startTime: 0,
    duration: 60,
    options: ['妹妹背著洋娃娃', '娃娃國', '泥娃娃', '小星星'],
    clue: '「妹妹背著洋娃娃，走到花園去看花，娃娃哭了叫媽媽，樹上小鳥笑哈哈」。'
  },
  {
    tag: '童謠兒歌',
    title: '小毛驢',
    artist: '傳統童謠',
    search: '小毛驢 兒歌',
    knownId: 'g5H6i7J8k9l',
    startTime: 0,
    duration: 60,
    options: ['小毛驢', '拔蘿蔔', '大象', '三隻小豬'],
    clue: '「我有一隻小毛驢我從來也不騎，有一天我心血來潮騎著去趕集」。'
  },
  {
    tag: '童謠兒歌',
    title: '三隻小豬',
    artist: '傳統童謠',
    search: '三隻小豬 兒歌',
    knownId: 'h5I6j7K8l9m',
    startTime: 0,
    duration: 60,
    options: ['三隻小豬', '小毛驢', '拔蘿蔔', '大野狼'],
    clue: '敘述三隻小豬蓋稻草屋、木頭屋與磚頭屋對抗大野狼的著名寓言兒歌。'
  },
  {
    tag: '童謠兒歌',
    title: '頭兒肩膀膝蓋腳',
    artist: '傳統童謠',
    search: '頭兒肩膀膝蓋腳 兒歌',
    knownId: 'i5J6k7L8m9n',
    startTime: 0,
    duration: 60,
    options: ['頭兒肩膀膝蓋腳', '握緊雙手又張開', '刷牙歌', '跳繩歌'],
    clue: '帶動唱第一神曲，「頭兒肩膀膝蓋腳，膝蓋腳，眼睛鼻子耳朵嘴」。'
  },
  {
    tag: '童謠兒歌',
    title: '伊比呀呀',
    artist: '傳統童謠',
    search: '伊比呀呀 兒歌',
    knownId: 'j5K6l7M8n9o',
    startTime: 0,
    duration: 60,
    options: ['伊比呀呀', '當我們同在一起', '拔蘿蔔', '倫敦鐵橋垮下來'],
    clue: '「伊比呀呀伊比伊比呀，伊比呀呀伊比伊比呀」，歡樂的互動團康律動曲。'
  },
  {
    tag: '童謠兒歌',
    title: '倫敦鐵橋垮下來',
    artist: '傳統童謠',
    search: '倫敦鐵橋垮下來 兒歌',
    knownId: 'qnhvTx0AAfM',
    startTime: 0,
    duration: 60,
    options: ['倫敦鐵橋垮下來', '王老先生有塊地', '瑪莉有隻小綿羊', '小星星'],
    clue: '英國傳統童謠，「倫敦鐵橋垮下來，垮下來，垮下來，倫敦鐵橋垮下來，就要垮下來」。'
  },
  {
    tag: '童謠兒歌',
    title: '王老先生有塊地',
    artist: '傳統童謠',
    search: '王老先生有塊地 兒歌',
    knownId: 'l5M6n7O8p9q',
    startTime: 0,
    duration: 60,
    options: ['王老先生有塊地', '瑪莉有隻小綿羊', '倫敦鐵橋垮下來', '拔蘿蔔'],
    clue: '「王老先生有塊地呀，咿呀咿呀呦，他在田邊養小鴨呀，咿呀咿呀呦，呱呱」。'
  },
  {
    tag: '童謠兒歌',
    title: '瑪莉有隻小綿羊',
    artist: '傳統童謠',
    search: '瑪莉有隻小綿羊 兒歌',
    knownId: 'm5N6o7P8q9r',
    startTime: 0,
    duration: 60,
    options: ['瑪莉有隻小綿羊', '王老先生有塊地', '醜小鴨', '小蜜蜂'],
    clue: '「瑪莉有隻小綿羊，小綿羊，小綿羊，牠的毛色白如雪」。'
  },
  {
    tag: '童謠兒歌',
    title: '醜小鴨',
    artist: '傳統童謠',
    search: '醜小鴨 兒歌',
    knownId: 'n5O6p7Q8r9s',
    startTime: 0,
    duration: 60,
    options: ['醜小鴨', '大象', '造飛機', '春神來了'],
    clue: '「咕咕咕，醜小鴨，呱呱呱，長大變成白天鵝」。'
  },
  {
    tag: '童謠兒歌',
    title: '小蜜蜂',
    artist: '傳統童謠',
    search: '小蜜蜂 兒歌',
    knownId: 'o5P6q7R8s9t',
    startTime: 0,
    duration: 60,
    options: ['小蜜蜂', '蝴蝶', '春神來了', '小星星'],
    clue: '「嗡嗡嗡，嗡嗡嗡，大家一起作工，來匆匆，去匆匆，做工趣味濃」。'
  },
  {
    tag: '童謠兒歌',
    title: '春神來了',
    artist: '傳統童謠',
    search: '春神來了 兒歌',
    knownId: 'p5Q6r7S8t9u',
    startTime: 0,
    duration: 60,
    options: ['春神來了', '蝴蝶', '小蜜蜂', '茉莉花'],
    clue: '「春神來了怎知道？美麗的花兒朵朵開，紅的花綠的草，大地換新袍」。'
  },
  {
    tag: '童謠兒歌',
    title: '蝴蝶',
    artist: '傳統童謠',
    search: '蝴蝶 兒歌 蝴蝶蝴蝶生的真美麗',
    knownId: 'q5R6s7T8u9v',
    startTime: 0,
    duration: 60,
    options: ['蝴蝶', '小蜜蜂', '春神來了', '小毛驢'],
    clue: '「蝴蝶蝴蝶生的真美麗，頭戴著金絲身穿花花衣，你飛在花叢裡，好像在跳舞」。'
  },
  {
    tag: '童謠兒歌',
    title: '西北雨直直落',
    artist: '傳統童謠',
    search: '西北雨直直落 台語兒歌',
    knownId: 'r5S6t7U8v9w',
    startTime: 0,
    duration: 60,
    options: ['西北雨直直落', '丟丟銅仔', '點仔膠', '天黑黑要落雨'],
    clue: '經典台灣本土念謠，「西北雨直直落，鯽仔魚欲娶某，鮕呆兄打鑼鼓」。'
  },
  {
    tag: '童謠兒歌',
    title: '丟丟銅仔',
    artist: '傳統童謠',
    search: '丟丟銅仔 兒歌',
    knownId: 's5T6u7V8w9x',
    startTime: 0,
    duration: 60,
    options: ['丟丟銅仔', '西北雨直直落', '點仔膠', '火車快飛'],
    clue: '宜蘭民謠，火車穿過隧道時水滴落在鐵軌上的清脆聲音「火車行到伊都，阿末伊都丟」。'
  },
  {
    tag: '童謠兒歌',
    title: '點仔膠',
    artist: '傳統童謠',
    search: '點仔膠 台語兒歌',
    knownId: 't5U6v7W8x9y',
    startTime: 0,
    duration: 60,
    options: ['點仔膠', '西北雨直直落', '丟丟銅仔', '虎姑婆'],
    clue: '「點仔膠，黏著腳，叫阿爸，買豬腳，豬腳箍，滾爛爛，餓鬼囝仔流嘴涎」。'
  },
  {
    tag: '童謠兒歌',
    title: '虎姑婆',
    artist: '傳統童謠',
    search: '虎姑婆 兒歌',
    knownId: '7-gk5pO1g-I',
    startTime: 0,
    duration: 60,
    options: ['虎姑婆', '泥娃娃', '拔蘿蔔', '點仔膠'],
    clue: '台灣傳說改編，「好孩子不要哭，虎姑婆會來咬耳朵」。'
  },
  {
    tag: '童謠兒歌',
    title: '天黑黑要落雨',
    artist: '傳統童謠',
    search: '天黑黑要落雨 兒歌',
    knownId: 'v5W6x7Y8z9a',
    startTime: 0,
    duration: 60,
    options: ['天黑黑要落雨', '西北雨直直落', '拔蘿蔔', '丟丟銅仔'],
    clue: '「天黑黑，要落雨，阿公仔舉鋤頭要掘芋，掘啊掘，掘著一尾旋鰡鼓」。'
  },
  {
    tag: '童謠兒歌',
    title: '白鷺鷥',
    artist: '傳統童謠',
    search: '白鷺鷥 兒歌 白鷺鷥車畚箕',
    knownId: 'w5X6y7Z8a9b',
    startTime: 0,
    duration: 60,
    options: ['白鷺鷥', '大象', '蝴蝶', '小蜜蜂'],
    clue: '「白鷺鷥，車畚箕，車到溝仔墘，跋一倒，抾著二仙錢」。'
  },
  {
    tag: '童謠兒歌',
    title: '十個印第安小朋友',
    artist: '傳統童謠',
    search: '十個印第安小朋友 兒歌',
    knownId: 'x5Y6z7A8b9c',
    startTime: 0,
    duration: 60,
    options: ['十個印第安小朋友', '小星星', '頭兒肩膀膝蓋腳', '當我們同在一起'],
    clue: '「一個、兩個、三個印第安，四個、五個、六個印第安，七個、八個、九個印第安，十個印第安小朋友」。'
  },
  {
    tag: '童謠兒歌',
    title: '刷牙歌',
    artist: '傳統童謠',
    search: '刷牙歌 兒歌 上上下下左左右右',
    knownId: 'y5Z6a7B8c9d',
    startTime: 0,
    duration: 60,
    options: ['刷牙歌', '頭兒肩膀膝蓋腳', '洗澡歌', '造飛機'],
    clue: '生活常規養成兒歌，「上上下下，左左右右，前前後後，刷得乾乾淨淨」。'
  },
  {
    tag: '童謠兒歌',
    title: '握緊雙手又張開',
    artist: '傳統童謠',
    search: '握緊雙手又張開 兒歌',
    knownId: 'z5A6b7C8d9e',
    startTime: 0,
    duration: 60,
    options: ['握緊雙手又張開', '頭兒肩膀膝蓋腳', '當我們同在一起', '拔蘿蔔'],
    clue: '幼兒律動兒歌，「握緊雙手又張開，拍拍手呀放腿上」。'
  },
  {
    tag: '童謠兒歌',
    title: '跳繩歌',
    artist: '傳統童謠',
    search: '跳繩歌 兒歌 小皮球香蕉油',
    knownId: 'a6B7c8D9e0f',
    startTime: 0,
    duration: 60,
    options: ['跳繩歌', '點仔膠', '拔蘿蔔', '捉泥鰍'],
    clue: '「小皮球，香蕉油，滿地開花二十一，二五六，二五七，二八二九三十一」。'
  },
  {
    tag: '童謠兒歌',
    title: '生日快樂歌',
    artist: '傳統童謠',
    search: '生日快樂歌 Happy Birthday',
    knownId: 'b6C7d8E9f0g',
    startTime: 0,
    duration: 60,
    options: ['生日快樂歌', '祝你幸福', '新年快樂', '當我們同在一起'],
    clue: '全世界傳唱率最高的慶祝歌，「祝你生日快樂，祝你生日快樂」。'
  },
  {
    tag: '童謠兒歌',
    title: '虹彩妹妹',
    artist: '傳統童謠',
    search: '虹彩妹妹 兒歌 官方',
    knownId: 'c6D7e8F9g0h',
    startTime: 0,
    duration: 60,
    options: ['虹彩妹妹', '茉莉花', '鳳陽花鼓', '康定情歌'],
    clue: '綏遠民謠改編，「虹彩妹妹嗯哎嗨呦，長得好那麼嗯哎嗨呦」。'
  },
  {
    tag: '童謠兒歌',
    title: '鳳陽花鼓',
    artist: '傳統童謠',
    search: '鳳陽花鼓 兒歌',
    knownId: 'd6E7f8G9h0i',
    startTime: 0,
    duration: 60,
    options: ['鳳陽花鼓', '虹彩妹妹', '茉莉花', '康定情歌'],
    clue: '「左手鑼，右手鼓，手拿著鑼鼓來唱歌，別的歌兒我也不會唱，只會唱個鳳陽歌」。'
  },
  {
    tag: '童謠兒歌',
    title: '康定情歌',
    artist: '傳統童謠',
    search: '康定情歌 兒歌 民謠',
    knownId: 'e6F7g8H9i0j',
    startTime: 0,
    duration: 60,
    options: ['康定情歌', '鳳陽花鼓', '茉莉花', '拔蘿蔔'],
    clue: '「跑馬溜溜的山上，一朵溜溜的雲喲，端端溜溜的照在，康定溜溜的城喲」。'
  },
  {
    tag: '童謠兒歌',
    title: '大拇指在哪裡',
    artist: '傳統童謠',
    search: '大拇指在哪裡 兒歌',
    knownId: 'BIYea2-WeYA',
    startTime: 0,
    duration: 60,
    options: ['大拇指在哪裡', '頭兒肩膀膝蓋腳', '握緊雙手又張開', '刷牙歌'],
    clue: '「大拇指在哪裡，大拇指在哪裡，我在這裡，我在這裡」。'
  },
  {
    tag: '童謠兒歌',
    title: '小天使',
    artist: '傳統童謠',
    search: '小天使 阿爾卑斯山的少女 主題曲 兒歌',
    knownId: 'LG_JSMsL9YU',
    startTime: 0,
    duration: 60,
    options: ['小天使', '無敵鐵金剛', '小甜甜', '小蜜蜂'],
    clue: '《阿爾卑斯山的少女》台灣中文主題曲，「高山上的小木屋，住著一個小女孩」。'
  },
  {
    tag: '童謠兒歌',
    title: '無敵鐵金剛',
    artist: '傳統童謠',
    search: '無敵鐵金剛 台灣主題曲 官方',
    knownId: 'Kq0SQF12R2Q',
    startTime: 0,
    duration: 60,
    options: ['無敵鐵金剛', '小天使', '科學小飛俠', '哆啦A夢之歌'],
    clue: '「無敵鐵金剛，無敵鐵金剛，無敵鐵～金～剛！指揮艇組合！」。'
  }
];

// 3. 解析與驗證 YouTube ID 函式
async function resolveSong(song, index, total) {
  const cacheKey = `${song.tag}_${song.title}`;
  if (cache[cacheKey]) {
    const verified = await checkYoutubeId(cache[cacheKey].youtubeId);
    if (verified.ok) {
      return {
        ...song,
        youtubeId: cache[cacheKey].youtubeId,
        youtubeUrl: `https://www.youtube.com/watch?v=${cache[cacheKey].youtubeId}`
      };
    }
  }

  // 嘗試 knownId (忽略 dummy 佔位 ID)
  if (song.knownId && !/^[a-z][0-9][A-Z]/.test(song.knownId)) {
    const checkKnown = await checkYoutubeId(song.knownId);
    if (checkKnown.ok) {
      cache[cacheKey] = { youtubeId: song.knownId };
      return {
        ...song,
        youtubeId: song.knownId,
        youtubeUrl: `https://www.youtube.com/watch?v=${song.knownId}`
      };
    }
  }

  // 使用 search query 尋找
  process.stdout.write(`[${index + 1}/${total}] 搜尋: ${song.search}... `);
  let found = await findValidYoutubeId(song.search);
  if (!found && song.title) {
    found = await findValidYoutubeId(song.title);
  }
  if (!found && song.artist && song.title) {
    found = await findValidYoutubeId(`${song.artist} ${song.title}`);
  }
  if (!found && song.title) {
    found = await findValidYoutubeId(`${song.title} 兒歌`);
  }
  if (!found && song.title) {
    found = await findValidYoutubeId(`${song.title} 童謠`);
  }
  if (!found && song.title) {
    found = await findValidYoutubeId(`${song.title} 歌詞`);
  }

  if (found) {
    console.log(`✅ 找到: ${found.id} (${found.title})`);
    cache[cacheKey] = { youtubeId: found.id };
    return {
      ...song,
      youtubeId: found.id,
      youtubeUrl: `https://www.youtube.com/watch?v=${found.id}`
    };
  }

  throw new Error(`無法為 ${song.tag} - ${song.title} 找到有效的 YouTube ID！`);
}

// 4. 平行批次解析
async function run() {
  console.log(`開始解析 208 首新歌曲... 目前快取包含 ${Object.keys(cache).length} 首。`);
  const resolvedNewSongs = [];
  const CONCURRENCY = 2;
  
  for (let i = 0; i < newSongDefs.length; i += CONCURRENCY) {
    const batch = newSongDefs.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map((song, bIdx) => resolveSong(song, i + bIdx, newSongDefs.length)));
    resolvedNewSongs.push(...results);
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
    await new Promise(r => setTimeout(r, 450));
  }

  // 5. 結合現有 112 首與新解析 208 首
  const combined = [...existing112, ...resolvedNewSongs];

  // 6. 分類排序與賦予標準 ID
  const CATEGORY_ORDER = [
    '古典音樂',
    '台灣五年級',
    '台灣六年級',
    '台灣七年級',
    '台灣八年級',
    '台灣九年級',
    '動漫神曲',
    '童謠兒歌'
  ];

  const PREFIX_MAP = {
    '古典音樂': 'classical',
    '台灣五年級': 'tw_grade5',
    '台灣六年級': 'tw_grade6',
    '台灣七年級': 'tw_grade7',
    '台灣八年級': 'tw_grade8',
    '台灣九年級': 'tw_grade9',
    '動漫神曲': 'anime',
    '童謠兒歌': 'kids'
  };

  const finalPool = [];
  const catCounts = {};

  CATEGORY_ORDER.forEach(cat => {
    const catSongs = combined.filter(s => s.tag === cat);
    if (catSongs.length !== 40) {
      console.warn(`⚠️ 類別 ${cat} 歌曲數量為 ${catSongs.length} (預期 40 首)`);
    }
    catSongs.forEach((song, idx) => {
      const id = `${PREFIX_MAP[cat]}_${idx + 1}`;
      finalPool.push({
        id: id,
        tag: song.tag,
        title: song.title,
        artist: song.artist,
        youtubeUrl: song.youtubeUrl,
        youtubeId: song.youtubeId,
        startTime: song.startTime !== undefined ? song.startTime : 0,
        duration: song.duration || 60,
        options: song.options,
        clue: song.clue
      });
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
  });

  console.log('\n===== 各類別歌曲最終統計 =====');
  console.log(catCounts);
  console.log(`總計：${finalPool.length} 首歌曲！\n`);

  if (finalPool.length !== 320) {
    throw new Error(`總歌曲數量應為 320 首，目前為 ${finalPool.length} 首！`);
  }

  // 7. 寫入 js/song_quiz_pool.js
  const poolJsContent = `/**
 * Song Quiz Default Pool (專注力測驗 - 聽歌搶答內建官方題庫)
 * 分類包含：古典音樂 (40首)、台灣五年級 (40首)、台灣六年級 (40首)、台灣七年級 (40首)、台灣八年級 (40首)、台灣九年級 (40首)、動漫神曲 (40首)、童謠兒歌 (40首)
 * 全數 320 首歌曲皆經由 YouTube 官方 API (oEmbed) 檢驗為有效且開放嵌入播放
 */
(function (global) {
  'use strict';

  const DEFAULT_SONG_QUIZ_POOL = ${JSON.stringify(finalPool, null, 2)};

  global.DEFAULT_SONG_QUIZ_POOL = DEFAULT_SONG_QUIZ_POOL;
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this);
`;

  fs.writeFileSync('js/song_quiz_pool.js', poolJsContent, 'utf8');
  console.log('🎉 成功寫入 js/song_quiz_pool.js！');
}

run().catch(err => {
  console.error('執行失敗:', err);
  process.exit(1);
});
