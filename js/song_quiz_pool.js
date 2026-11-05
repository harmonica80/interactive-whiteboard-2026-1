// 聽歌搶答 題庫 (全數通過 YouTube 官方 oEmbed 驗證)
(function(window) {
  window.DEFAULT_SONG_QUIZ_POOL = [
  {
    "id": "classical_1",
    "tag": "古典音樂",
    "title": "給愛麗絲",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=wfF0zHeU3Zs",
    "youtubeId": "wfF0zHeU3Zs",
    "startTime": 0,
    "duration": 60,
    "options": [
      "給愛麗絲",
      "月光奏鳴曲",
      "悲愴奏鳴曲",
      "歡樂頌"
    ],
    "clue": "貝多芬經典鋼琴小品 (WoO 59)，旋律優美流暢，亦為台灣垃圾車最著名的播放旋律之一。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_2",
    "tag": "古典音樂",
    "title": "命運交響曲",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=jv2WJMVPQi8",
    "youtubeId": "jv2WJMVPQi8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "命運交響曲",
      "英雄交響曲",
      "田園交響曲",
      "合唱交響曲"
    ],
    "clue": "第5號交響曲第1樂章，開頭著名的「短短短長」四音動機象徵「命運敲門的聲音」。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_3",
    "tag": "古典音樂",
    "title": "歡樂頌",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Wod-MudLNPA",
    "youtubeId": "Wod-MudLNPA",
    "startTime": 10,
    "duration": 60,
    "options": [
      "歡樂頌",
      "英雄交響曲",
      "合唱交響曲",
      "給愛麗絲"
    ],
    "clue": "出自貝多芬《第9號交響曲》終樂章，歌詞取自席勒詩作，象徵四海之內皆兄弟的大同精神。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_4",
    "tag": "古典音樂",
    "title": "小夜曲",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=vG_FBIbGuvg",
    "youtubeId": "vG_FBIbGuvg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小夜曲",
      "土耳其進行曲",
      "魔笛序曲",
      "費加洛婚禮"
    ],
    "clue": "莫札特《第13號弦樂小夜曲》(K. 525)，明亮輕快的旋律是古典弦樂合奏的最高代表。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_5",
    "tag": "古典音樂",
    "title": "土耳其進行曲",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=quxTnEEETbo",
    "youtubeId": "quxTnEEETbo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "土耳其進行曲",
      "小夜曲",
      "給愛麗絲",
      "大黃蜂的飛行"
    ],
    "clue": "出自莫札特《第11號鋼琴奏鳴曲》第三樂章，節奏明快活潑，模仿奧斯曼軍樂隊的風格。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_6",
    "tag": "古典音樂",
    "title": "魔笛 - 夜后詠嘆調",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=uMGFztZLsxE",
    "youtubeId": "uMGFztZLsxE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "魔笛 - 夜后詠嘆調",
      "卡門 - 哈巴奈拉舞曲",
      "塞維亞理髮師",
      "茶花女 - 飲酒歌"
    ],
    "clue": "莫札特歌劇《魔笛》中最經典的花腔女高音段落，以驚人的高音域與跳音聞名於世。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_7",
    "tag": "古典音樂",
    "title": "天鵝湖",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=9rJoB7y6Ncs",
    "youtubeId": "9rJoB7y6Ncs",
    "startTime": 0,
    "duration": 60,
    "options": [
      "天鵝湖",
      "胡桃鉗",
      "睡美人",
      "羅密歐與茱麗葉"
    ],
    "clue": "柴可夫斯基三大芭蕾舞劇之一，雙簧管奏出的淒美主旋律道盡奧傑塔公主與王子的動人故事。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_8",
    "tag": "古典音樂",
    "title": "胡桃鉗 - 糖梅仙子之舞",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=gFjveJ5sgeQ",
    "youtubeId": "gFjveJ5sgeQ",
    "startTime": 0,
    "duration": 60,
    "options": [
      "胡桃鉗 - 糖梅仙子之舞",
      "天鵝湖",
      "睡美人",
      "花之圓舞曲"
    ],
    "clue": "柴可夫斯基《胡桃鉗》中最富童話色彩的片段，率先採用鋼片琴 (Celesta) 營造水晶般夢幻音色。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_9",
    "tag": "古典音樂",
    "title": "四季 - 春",
    "artist": "韋瓦第 (Vivaldi)",
    "youtubeUrl": "https://www.youtube.com/watch?v=GRxofEmo3HA",
    "youtubeId": "GRxofEmo3HA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "四季 - 春",
      "四季 - 冬",
      "水上音樂",
      "皇家煙火"
    ],
    "clue": "巴洛克名家韋瓦第最著名的協奏曲，開頭燦爛明快的合奏描繪萬物復甦、鳥兒歌唱的春天景象。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_10",
    "tag": "古典音樂",
    "title": "G弦上的詠嘆調",
    "artist": "巴哈 (J. S. Bach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=pzlw6fUux4o",
    "youtubeId": "pzlw6fUux4o",
    "startTime": 0,
    "duration": 60,
    "options": [
      "G弦上的詠嘆調",
      "耶穌，世人仰望的喜悅",
      "布蘭登堡協奏曲",
      "郭德堡變奏曲"
    ],
    "clue": "改編自巴哈《第3號管弦樂組曲》，莊嚴抒情、冥想沉靜的旋律撫慰人心。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_11",
    "tag": "古典音樂",
    "title": "D小調觸技曲與賦格",
    "artist": "巴哈 (J. S. Bach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=ho9rZjlsyYY",
    "youtubeId": "ho9rZjlsyYY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "D小調觸技曲與賦格",
      "G弦上的詠嘆調",
      "平均律鋼琴曲集",
      "布蘭登堡協奏曲"
    ],
    "clue": "巴哈最具震撼力的管風琴曲，宏偉壯麗的音響常出現在各類經典電影與戲劇場景中。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_12",
    "tag": "古典音樂",
    "title": "夜曲 Op.9 No.2",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=9E6b3swbnWg",
    "youtubeId": "9E6b3swbnWg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "夜曲 Op.9 No.2",
      "月光奏鳴曲",
      "愛之夢",
      "小狗圓舞曲"
    ],
    "clue": "「鋼琴詩人」蕭邦流傳最廣的夜曲，如月光傾瀉般典雅優柔，浪漫主義鋼琴名作。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_13",
    "tag": "古典音樂",
    "title": "小狗圓舞曲",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=JUTEjt8Iorc",
    "youtubeId": "JUTEjt8Iorc",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小狗圓舞曲",
      "華麗大圓舞曲",
      "軍隊波蘭舞曲",
      "夜曲"
    ],
    "clue": "降D大調圓舞曲 (Op. 64 No. 1)，相傳描寫小狗追著自己尾巴打轉時的逗趣情景。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_14",
    "tag": "古典音樂",
    "title": "月光",
    "artist": "德布西 (Debussy)",
    "youtubeUrl": "https://www.youtube.com/watch?v=WNcsUNKlAKw",
    "youtubeId": "WNcsUNKlAKw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "月光",
      "棕髮少女",
      "牧神的午後",
      "沉沒的教堂"
    ],
    "clue": "出自印象派大師德布西《貝加馬斯克組曲》，朦朧光影與詩意氛圍的傳世鋼琴篇章。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_15",
    "tag": "古典音樂",
    "title": "藍色多瑙河",
    "artist": "約翰·史特勞斯二世 (Johann Strauss II)",
    "youtubeUrl": "https://www.youtube.com/watch?v=32fMNpLsvRY",
    "youtubeId": "32fMNpLsvRY",
    "startTime": 60,
    "duration": 60,
    "options": [
      "藍色多瑙河",
      "春之聲圓舞曲",
      "皇帝圓舞曲",
      "維也納森林的故事"
    ],
    "clue": "「圓舞曲之王」約翰·史特勞斯代表作，被譽為奧地利的第二國歌，旋律波瀾壯闊。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_16",
    "tag": "古典音樂",
    "title": "拉德茨基進行曲",
    "artist": "老約翰·史特勞斯 (Johann Strauss I)",
    "youtubeUrl": "https://www.youtube.com/watch?v=M13e1M76SqM",
    "youtubeId": "M13e1M76SqM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "拉德茨基進行曲",
      "藍色多瑙河",
      "威風凜凜進行曲",
      "雙頭鷹進行曲"
    ],
    "clue": "維也納新年音樂會每年的壓軸安可曲，觀眾皆會隨音樂節拍熱烈拍手應和。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_17",
    "tag": "古典音樂",
    "title": "威風凜凜進行曲",
    "artist": "艾爾加 (Elgar)",
    "youtubeUrl": "https://www.youtube.com/watch?v=moL4MkJ-aLk",
    "youtubeId": "moL4MkJ-aLk",
    "startTime": 20,
    "duration": 60,
    "options": [
      "威風凜凜進行曲",
      "拉德茨基進行曲",
      "威廉泰爾序曲",
      "行星組曲"
    ],
    "clue": "艾爾加《第1號威風凜凜進行曲》，中段莊嚴頌歌被譽為英國第二國歌，亦常作為畢業典禮進行曲。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_18",
    "tag": "古典音樂",
    "title": "威廉泰爾序曲",
    "artist": "羅西尼 (Rossini)",
    "youtubeUrl": "https://www.youtube.com/watch?v=c7O91GDWGPU",
    "youtubeId": "c7O91GDWGPU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "威廉泰爾序曲",
      "輕騎兵序曲",
      "1812序曲",
      "卡門序曲"
    ],
    "clue": "羅西尼歌劇《威廉·泰爾》序曲終段，萬馬奔騰的急板象徵瑞士勇士英勇作戰。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_19",
    "tag": "古典音樂",
    "title": "匈牙利舞曲第5號",
    "artist": "布拉姆斯 (Brahms)",
    "youtubeUrl": "https://www.youtube.com/watch?v=3X9LvC9WkkQ",
    "youtubeId": "3X9LvC9WkkQ",
    "startTime": 0,
    "duration": 60,
    "options": [
      "匈牙利舞曲第5號",
      "斯拉夫舞曲",
      "大學慶典序曲",
      "搖籃曲"
    ],
    "clue": "融合吉普賽熱情節奏與匈牙利查爾達斯舞曲風格，速度變換極具戲劇張力。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_20",
    "tag": "古典音樂",
    "title": "康康舞曲",
    "artist": "奧芬巴哈 (Offenbach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=4Diu2N8TGKA",
    "youtubeId": "4Diu2N8TGKA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "康康舞曲",
      "劍舞",
      "卡門序曲",
      "大黃蜂的飛行"
    ],
    "clue": "出自喜歌劇《地獄中的奧菲歐》，熱情奔放、踢腿歡慶的旋律聞名全球。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_21",
    "tag": "古典音樂",
    "title": "月光奏鳴曲",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=4Tr0otuiQuU",
    "youtubeId": "4Tr0otuiQuU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "月光奏鳴曲",
      "熱情奏鳴曲",
      "悲愴奏鳴曲",
      "告別奏鳴曲"
    ],
    "clue": "貝多芬第14號鋼琴奏鳴曲第1樂章，詩人雷爾斯塔布形容其如「琉森湖月光蕩漾的微光」。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_22",
    "tag": "古典音樂",
    "title": "悲愴奏鳴曲",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=vGq3-Fi_zQY",
    "youtubeId": "vGq3-Fi_zQY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "悲愴奏鳴曲",
      "月光奏鳴曲",
      "華德斯坦奏鳴曲",
      "暴風雨奏鳴曲"
    ],
    "clue": "貝多芬第8號鋼琴奏鳴曲第2樂章 (Adagio cantabile)，旋律極為深情溫柔。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_23",
    "tag": "古典音樂",
    "title": "胡桃鉗 - 俄羅斯舞曲",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=z2ISRMSIyX8",
    "youtubeId": "z2ISRMSIyX8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "胡桃鉗 - 俄羅斯舞曲",
      "胡桃鉗 - 蘆笛之舞",
      "花之圓舞曲",
      "天鵝湖"
    ],
    "clue": "芭蕾舞劇《胡桃鉗》中節奏明快、充滿旋轉與跳躍活力的特雷帕克 (Trepak) 舞曲。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_24",
    "tag": "古典音樂",
    "title": "1812序曲",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=VbxgYlcNxE8",
    "youtubeId": "VbxgYlcNxE8",
    "startTime": 20,
    "duration": 60,
    "options": [
      "1812序曲",
      "羅密歐與茱麗葉幻想序曲",
      "天鵝湖序曲",
      "義大利隨想曲"
    ],
    "clue": "為紀念1812年俄法戰爭而作，樂曲高潮動用了真正的加農砲聲與教堂鐘聲慶祝勝利。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_25",
    "tag": "古典音樂",
    "title": "天鵝湖 - 四小天鵝舞曲",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Xd2nTXsivHs",
    "youtubeId": "Xd2nTXsivHs",
    "startTime": 0,
    "duration": 60,
    "options": [
      "天鵝湖 - 四小天鵝舞曲",
      "胡桃鉗 - 糖梅仙子",
      "睡美人圓舞曲",
      "吉賽兒"
    ],
    "clue": "《天鵝湖》第2幕最膾炙人口的輕快四重奏，四位芭蕾舞者手挽著手同步跳躍。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_26",
    "tag": "古典音樂",
    "title": "四季 - 冬",
    "artist": "韋瓦第 (Vivaldi)",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZPdk5GaIDjo",
    "youtubeId": "ZPdk5GaIDjo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "四季 - 冬",
      "四季 - 春",
      "四季 - 夏",
      "四季 - 秋"
    ],
    "clue": "韋瓦第《四季》協奏曲「冬」第1樂章，快速拉奏的琴音生動描摹在刺骨冰雪中瑟瑟發抖之景。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_27",
    "tag": "古典音樂",
    "title": "四季 - 夏 (急板)",
    "artist": "韋瓦第 (Vivaldi)",
    "youtubeUrl": "https://www.youtube.com/watch?v=g65oWFMSoK0",
    "youtubeId": "g65oWFMSoK0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "四季 - 夏 (急板)",
      "四季 - 春",
      "四季 - 秋",
      "四季 - 冬"
    ],
    "clue": "韋瓦第《四季》協奏曲「夏」第3樂章，狂暴的弦樂暴風雨傾盆而下，戲劇張力極強。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_28",
    "tag": "古典音樂",
    "title": "小步舞曲",
    "artist": "巴哈 (Bach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=p1gGxpitLO8",
    "youtubeId": "p1gGxpitLO8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小步舞曲",
      "G弦上的詠嘆調",
      "布蘭登堡協奏曲",
      "聖母頌"
    ],
    "clue": "選自《安娜·瑪格達蓮娜·巴哈的筆記本》，旋律優雅輕快，為鋼琴初學必彈名作。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_29",
    "tag": "古典音樂",
    "title": "耶穌，世人仰望的喜悅",
    "artist": "巴哈 (Bach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=oduhc96kTlw",
    "youtubeId": "oduhc96kTlw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "耶穌，世人仰望的喜悅",
      "D小調觸技曲",
      "G弦上的詠嘆調",
      "賦格的藝術"
    ],
    "clue": "巴哈第147號清唱套曲中著名的聖詠，流暢起伏的三連音帶來無比溫暖與心靈平靜。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_30",
    "tag": "古典音樂",
    "title": "第40號交響曲",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=BJPmYURJk4c",
    "youtubeId": "BJPmYURJk4c",
    "startTime": 0,
    "duration": 60,
    "options": [
      "第40號交響曲",
      "第41號交響曲 (朱庇特)",
      "第39號交響曲",
      "小夜曲"
    ],
    "clue": "莫札特G小調第40號交響曲 (K.550) 開頭，哀愁而優美的短調弦樂急速奔馳。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_31",
    "tag": "古典音樂",
    "title": "費加洛婚禮序曲",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=ikQNFqVkNNc",
    "youtubeId": "ikQNFqVkNNc",
    "startTime": 0,
    "duration": 60,
    "options": [
      "費加洛婚禮序曲",
      "魔笛序曲",
      "唐·喬望尼序曲",
      "後宮誘逃序曲"
    ],
    "clue": "莫札特著名歌劇序曲，整首樂曲節奏明快、生動活潑，充滿歡樂與幽默氣氛。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_32",
    "tag": "古典音樂",
    "title": "英雄波蘭舞曲",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=p_iI1J0bALE",
    "youtubeId": "p_iI1J0bALE",
    "startTime": 10,
    "duration": 60,
    "options": [
      "英雄波蘭舞曲",
      "軍隊波蘭舞曲",
      "小狗圓舞曲",
      "革命練習曲"
    ],
    "clue": "蕭邦降A大調第6號波蘭舞曲 (Op.53)，宏偉莊嚴的音型展現波蘭民族的英雄氣概。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_33",
    "tag": "古典音樂",
    "title": "雨滴前奏曲",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=R2d2spnXyLA",
    "youtubeId": "R2d2spnXyLA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "雨滴前奏曲",
      "離別曲",
      "黑鍵練習曲",
      "華麗大圓舞曲"
    ],
    "clue": "降D大調第15號前奏曲 (Op.28 No.15)，持續敲擊的降A單音宛如窗外規律滴落的雨點。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_34",
    "tag": "古典音樂",
    "title": "幻想即興曲",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Gus4dnQuiGk",
    "youtubeId": "Gus4dnQuiGk",
    "startTime": 0,
    "duration": 60,
    "options": [
      "幻想即興曲",
      "夜曲",
      "英雄波蘭舞曲",
      "平靜的行板"
    ],
    "clue": "升C小調第4號即興曲 (Op.66)，右手四連音對上左手三連音的交錯奔馳，旋律極為動人。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_35",
    "tag": "古典音樂",
    "title": "鱒魚五重奏",
    "artist": "舒伯特 (Schubert)",
    "youtubeUrl": "https://www.youtube.com/watch?v=HwbWvGtaZGo",
    "youtubeId": "HwbWvGtaZGo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "鱒魚五重奏",
      "未完成交響曲",
      "魔王",
      "死神與少女"
    ],
    "clue": "舒伯特A大調鋼琴五重奏 (D.667) 第4樂章，以其藝術歌曲《鱒魚》之旋律作為變奏主題。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_36",
    "tag": "古典音樂",
    "title": "聖母頌",
    "artist": "舒伯特 (Schubert)",
    "youtubeUrl": "https://www.youtube.com/watch?v=2H5rusicEnc",
    "youtubeId": "2H5rusicEnc",
    "startTime": 0,
    "duration": 60,
    "options": [
      "聖母頌",
      "小夜曲",
      "野玫瑰",
      "菩提樹"
    ],
    "clue": "舒伯特經典藝術歌曲 (D.839)，虔誠安詳的旋律傳達聖潔慈悲的力量。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_37",
    "tag": "古典音樂",
    "title": "棕髮少女",
    "artist": "德布西 (Debussy)",
    "youtubeUrl": "https://www.youtube.com/watch?v=jGSZPRk6aXA",
    "youtubeId": "jGSZPRk6aXA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "棕髮少女",
      "月光",
      "亞麻色頭髮的少女",
      "牧神的午後"
    ],
    "clue": "選自德布西《前奏曲集》第1冊第8首，優雅柔和的五聲音階展現純真恬靜的少女氣息。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_38",
    "tag": "古典音樂",
    "title": "新世界交響曲 (念故鄉)",
    "artist": "德弗札克 (Dvořák)",
    "youtubeUrl": "https://www.youtube.com/watch?v=ASlch7R1Zvo",
    "youtubeId": "ASlch7R1Zvo",
    "startTime": 30,
    "duration": 60,
    "options": [
      "新世界交響曲 (念故鄉)",
      "大提琴協奏曲",
      "斯拉夫舞曲",
      "狂歡節序曲"
    ],
    "clue": "德弗札克第9號交響曲第2樂章，英國管奏出充滿鄉愁的悠揚旋律，中文填詞為〈念故鄉〉。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_39",
    "tag": "古典音樂",
    "title": "卡門 - 鬥牛士之歌",
    "artist": "比才 (Bizet)",
    "youtubeUrl": "https://www.youtube.com/watch?v=4DNGMoMNLRY",
    "youtubeId": "4DNGMoMNLRY",
    "startTime": 10,
    "duration": 60,
    "options": [
      "卡門 - 鬥牛士之歌",
      "卡門 - 哈巴奈拉舞曲",
      "阿萊城的姑娘",
      "塞維亞的理髮師"
    ],
    "clue": "比才歌劇《卡門》第2幕，鬥牛士埃斯卡米諾昂首步入酒館時高唱的威武進行曲。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "classical_40",
    "tag": "古典音樂",
    "title": "行星組曲 - 木星 (歡樂之神)",
    "artist": "霍斯特 (Holst)",
    "youtubeUrl": "https://www.youtube.com/watch?v=3aXsQQ-ueBk",
    "youtubeId": "3aXsQQ-ueBk",
    "startTime": 20,
    "duration": 60,
    "options": [
      "行星組曲 - 木星 (歡樂之神)",
      "行星組曲 - 火星",
      "波麗露",
      "展覽會之畫"
    ],
    "clue": "英國作曲家霍斯特代表作，中段莊嚴神聖的旋律亦被填詞為英國著名愛國歌曲。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "仲夏夜之夢 - 結婚進行曲",
    "artist": "孟德爾頌 (Mendelssohn)",
    "youtubeId": "8C4Q3vcZvkY",
    "options": [
      "仲夏夜之夢 - 結婚進行曲",
      "羅密歐與茱麗葉",
      "威風凜凜進行曲",
      "卡門序曲"
    ],
    "clue": "為莎士比亞戲劇《仲夏夜之夢》所作的配樂，常與華格納作品並列為全球婚禮必備入場曲。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "乘著歌聲的翅膀",
    "artist": "孟德爾頌 (Mendelssohn)",
    "youtubeId": "aAPYlzkkqx4",
    "options": [
      "乘著歌聲的翅膀",
      "春之歌",
      "無言歌",
      "芬格爾山洞"
    ],
    "clue": "歌詞取材自海涅詩作，旋律如微風拂面，描繪乘著美麗歌聲飛向恆河平原的浪漫夢境。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "野玫瑰",
    "artist": "舒伯特 (Schubert)",
    "youtubeId": "Vbw53GO2JGI",
    "options": [
      "野玫瑰",
      "菩提樹",
      "魔王",
      "鱒魚"
    ],
    "clue": "改編自歌德同名詩作「男孩看見野玫瑰，荒地上的野玫瑰」，為傳唱最廣的德語藝術歌曲。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "軍隊進行曲",
    "artist": "舒伯特 (Schubert)",
    "youtubeId": "dMTDjavVmH4",
    "options": [
      "軍隊進行曲",
      "拉德茨基進行曲",
      "威風凜凜進行曲",
      "土耳其進行曲"
    ],
    "clue": "舒伯特為鋼琴四手聯彈所作的著名作品 (D.733 No.1)，旋律英姿颯爽且極具節奏感。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "未完成交響曲",
    "artist": "舒伯特 (Schubert)",
    "youtubeId": "3tisvEpblig",
    "options": [
      "未完成交響曲",
      "命運交響曲",
      "新世界交響曲",
      "田園交響曲"
    ],
    "clue": "舒伯特第8號交響曲，全曲僅完成兩個樂章即停筆，但其抒情幽美已臻交響樂之巔峰境界。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "四季 - 秋",
    "artist": "韋瓦第 (Vivaldi)",
    "youtubeId": "UIdwCrfDNjU",
    "options": [
      "四季 - 秋",
      "四季 - 春",
      "四季 - 夏",
      "四季 - 冬"
    ],
    "clue": "小提琴協奏曲《四季》中的第三首，描繪農民歡欣慶祝秋天豐收、載歌載舞與暢飲美酒的歡騰場景。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "動物狂歡節 - 天鵝",
    "artist": "聖桑 (Saint-Saëns)",
    "youtubeId": "3qrKjywjo7Q",
    "options": [
      "動物狂歡節 - 天鵝",
      "天鵝湖",
      "動物狂歡節 - 化石",
      "水族館"
    ],
    "clue": "大提琴悠揚溫柔的旋律刻畫出天鵝在水面優雅滑行的姿態，是聖桑生前唯一允許出版的該組曲段落。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "動物狂歡節 - 化石",
    "artist": "聖桑 (Saint-Saëns)",
    "youtubeId": "eJfc0ON4474",
    "options": [
      "動物狂歡節 - 化石",
      "骷髏之舞",
      "小象",
      "大烏龜"
    ],
    "clue": "木琴清脆的敲擊聲模仿古代骨骼碰撞的聲響，曲中還巧妙引用了莫札特《小星星》旋律。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "骷髏之舞",
    "artist": "聖桑 (Saint-Saëns)",
    "youtubeId": "71fZhMXlGT4",
    "options": [
      "骷髏之舞",
      "荒山之夜",
      "魔法師的學徒",
      "波麗露"
    ],
    "clue": "著名的萬聖節交響詩，小提琴以不協和音拉出死神呼喚，骷髏於午夜墳場狂歡起舞。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "愛之夢 第3號",
    "artist": "李斯特 (Liszt)",
    "youtubeId": "MBOa-2b4uQQ",
    "options": [
      "愛之夢 第3號",
      "匈牙利狂想曲",
      "超技練習曲",
      "鐘"
    ],
    "clue": "李斯特改編自弗萊利格拉特詩作的鋼琴夜曲，旋律深情濃郁，是鋼琴浪漫主義的抒情代表作。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "匈牙利狂想曲第2號",
    "artist": "李斯特 (Liszt)",
    "youtubeId": "LdH1hSWGFGU",
    "options": [
      "匈牙利狂想曲第2號",
      "匈牙利舞曲第5號",
      "拉科齊進行曲",
      "斯拉夫舞曲"
    ],
    "clue": "李斯特最著名狂想曲，常出現在經典卡通《湯姆貓與傑利鼠》鋼琴決鬥場景中。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "軍隊波蘭舞曲",
    "artist": "蕭邦 (Chopin)",
    "youtubeId": "hbnunexhlXM",
    "options": [
      "軍隊波蘭舞曲",
      "英雄波蘭舞曲",
      "黑鍵練習曲",
      "革命練習曲"
    ],
    "clue": "蕭邦A大調波蘭舞曲 Op.40 No.1，充滿波蘭騎士出征的昂揚節奏與雄偉壯麗的貴族儀態。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "離別曲 Op.10 No.3",
    "artist": "蕭邦 (Chopin)",
    "youtubeId": "bzBH9Nm1BP8",
    "options": [
      "離別曲 Op.10 No.3",
      "雨滴前奏曲",
      "夜曲 Op.9 No.2",
      "幻想即興曲"
    ],
    "clue": "蕭邦曾自稱此曲的第一主題是他平生寫過最優美的旋律，後人題為《離別曲》或《悲傷》。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "花之圓舞曲",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeId": "Zp1aDnVySf8",
    "options": [
      "花之圓舞曲",
      "睡美人圓舞曲",
      "藍色多瑙河",
      "天鵝湖圓舞曲"
    ],
    "clue": "芭蕾舞劇《胡桃鉗》中最盛大華麗的終曲圓舞曲，以豎琴華麗琶音開場引出法國號溫柔主旋律。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "胡桃鉗 - 蘆笛之舞",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeId": "h94BdxnheeM",
    "options": [
      "胡桃鉗 - 蘆笛之舞",
      "糖梅仙子之舞",
      "俄羅斯舞曲",
      "阿拉伯之舞"
    ],
    "clue": "芭蕾舞劇《胡桃鉗》著名小品，由三支長笛以優美輕盈的三重奏吹響牧笛主題。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "第6號交響曲「悲愴」",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeId": "qVA1ieo9Js4",
    "options": [
      "第6號交響曲「悲愴」",
      "悲愴奏鳴曲",
      "1812序曲",
      "天鵝湖"
    ],
    "clue": "柴可夫斯基最後一部交響鉅作，終樂章破天荒採用慢板 (Adagio lamentoso)，傾訴生命深沉悲痛。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "皮爾金 - 清晨",
    "artist": "葛利格 (Grieg)",
    "youtubeId": "1HGxZDbC7oc",
    "options": [
      "皮爾金 - 清晨",
      "皮爾金 - 山大王的宮殿",
      "春之歌",
      "展覽會之畫"
    ],
    "clue": "易卜生詩劇《皮爾金》配樂，以長笛與雙簧管此起彼落的晨曦日光描繪清晨大自然之甦醒。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "皮爾金 - 山大王的宮殿",
    "artist": "葛利格 (Grieg)",
    "youtubeId": "OqvHWUZZdP0",
    "options": [
      "皮爾金 - 山大王的宮殿",
      "皮爾金 - 清晨",
      "荒山之夜",
      "大黃蜂的飛行"
    ],
    "clue": "低音管輕步點奏山怪洞窟的神秘腳步，隨著速度加快與樂隊強奏達到驚心動魄的狂歡高潮。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "黑娃娃的步態舞",
    "artist": "德布西 (Debussy)",
    "youtubeId": "hufCZZw58mk",
    "options": [
      "黑娃娃的步態舞",
      "月光",
      "棕髮少女",
      "小溪"
    ],
    "clue": "鋼琴組曲《兒童天地》終曲，巧妙融入美國黑人切分步態舞 (Cakewalk) 幽默風趣風格。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "tag": "古典音樂",
    "title": "安魂曲 - 震怒之日",
    "artist": "莫札特 (Mozart)",
    "youtubeId": "0T7eMctuJLQ",
    "options": [
      "安魂曲 - 震怒之日",
      "魔笛 - 夜后",
      "費加洛婚禮",
      "小夜曲"
    ],
    "clue": "莫札特臨終絕筆《安魂曲》(K.626) 中最強悍震撼的合唱樂章，描寫末日審判的熾熱烈火。",
    "tags": [
      "古典音樂"
    ]
  },
  {
    "id": "tw_grade5_1",
    "tag": "台灣五年級",
    "title": "月亮代表我的心",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=bv_cEeDlop0",
    "youtubeId": "bv_cEeDlop0",
    "startTime": 30,
    "duration": 60,
    "options": [
      "月亮代表我的心",
      "甜蜜蜜",
      "夜來香",
      "何日君再來"
    ],
    "clue": "1977年華語傳世經典情歌，主唱為鄧麗君。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_2",
    "tag": "台灣五年級",
    "title": "甜蜜蜜",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=5eF8oOWtsk4",
    "youtubeId": "5eF8oOWtsk4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "甜蜜蜜",
      "月亮代表我的心",
      "恰似你的溫柔",
      "小城故事"
    ],
    "clue": "1979年發行，印尼民謠改編的傳唱經典。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_3",
    "tag": "台灣五年級",
    "title": "小城故事",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=Bgi5f_0atGE",
    "youtubeId": "Bgi5f_0atGE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "小城故事",
      "甜蜜蜜",
      "月亮代表我的心",
      "千言萬語"
    ],
    "clue": "同名電影主題曲，莊奴作詞、翁清溪作曲，歌頌溫馨純樸的小城風光。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_4",
    "tag": "台灣五年級",
    "title": "恰似你的溫柔",
    "artist": "蔡琴",
    "youtubeUrl": "https://www.youtube.com/watch?v=Yvg3L7RbFHY",
    "youtubeId": "Yvg3L7RbFHY",
    "startTime": 20,
    "duration": 60,
    "options": [
      "恰似你的溫柔",
      "被遺忘的時光",
      "讀你",
      "綠島小夜曲"
    ],
    "clue": "梁弘志作詞作曲，蔡琴低沉渾厚嗓音的成名代表作。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_5",
    "tag": "台灣五年級",
    "title": "被遺忘的時光",
    "artist": "蔡琴",
    "youtubeUrl": "https://www.youtube.com/watch?v=0OhHf7FfdC0",
    "youtubeId": "0OhHf7FfdC0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "被遺忘的時光",
      "恰似你的溫柔",
      "最後一夜",
      "讀你"
    ],
    "clue": "「是誰在敲打我窗，是誰在撩動琴弦」，電影《無間道》經典名曲。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_6",
    "tag": "台灣五年級",
    "title": "外婆的澎湖灣",
    "artist": "潘安邦",
    "youtubeUrl": "https://www.youtube.com/watch?v=oqeC2vbrfsQ",
    "youtubeId": "oqeC2vbrfsQ",
    "startTime": 10,
    "duration": 60,
    "options": [
      "外婆的澎湖灣",
      "鄉間的小路",
      "踏浪",
      "聚散兩依依"
    ],
    "clue": "葉佳修為潘安邦量身創作，描繪澎湖童年與外婆溫馨祖孫情的民歌代表。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_7",
    "tag": "台灣五年級",
    "title": "鄉間的小路",
    "artist": "葉佳修",
    "youtubeUrl": "https://www.youtube.com/watch?v=abBnysri-XI",
    "youtubeId": "abBnysri-XI",
    "startTime": 0,
    "duration": 60,
    "options": [
      "鄉間的小路",
      "外婆的澎湖灣",
      "赤足走在田埂上",
      "爸爸的草鞋"
    ],
    "clue": "「走在鄉間的小路上，暮歸的老牛是我同伴」，校園民歌鄉土情懷經典。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_8",
    "tag": "台灣五年級",
    "title": "橄欖樹",
    "artist": "齊豫",
    "youtubeUrl": "https://www.youtube.com/watch?v=LZb8fJZFhlo",
    "youtubeId": "LZb8fJZFhlo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "橄欖樹",
      "歡顏",
      "夢田",
      "走在雨中"
    ],
    "clue": "三毛作詞、李泰祥作曲，「不要問我從哪裡來，我的故鄉在遠方」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_9",
    "tag": "台灣五年級",
    "title": "童年",
    "artist": "羅大佑",
    "youtubeUrl": "https://www.youtube.com/watch?v=534LRELoxJs",
    "youtubeId": "534LRELoxJs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "童年",
      "光陰的故事",
      "鹿港小鎮",
      "戀曲1990"
    ],
    "clue": "「池塘邊的榕樹上，知了在聲聲叫著夏天」，勾起無數人的純真童年。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_10",
    "tag": "台灣五年級",
    "title": "光陰的故事",
    "artist": "羅大佑",
    "youtubeUrl": "https://www.youtube.com/watch?v=6rP9gV2YMJs",
    "youtubeId": "6rP9gV2YMJs",
    "startTime": 20,
    "duration": 60,
    "options": [
      "光陰的故事",
      "童年",
      "閃亮的日子",
      "野百合也有春天"
    ],
    "clue": "「流水它帶走光陰的故事改變了一個人」，台灣校園民歌邁入成熟的里程碑。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_11",
    "tag": "台灣五年級",
    "title": "鹿港小鎮",
    "artist": "羅大佑",
    "youtubeUrl": "https://www.youtube.com/watch?v=Xgjny7YFMD4",
    "youtubeId": "Xgjny7YFMD4",
    "startTime": 20,
    "duration": 60,
    "options": [
      "鹿港小鎮",
      "戀曲1980",
      "童年",
      "之乎者也"
    ],
    "clue": "「台北不是我的家，我的家鄉沒有霓虹燈」，震撼華語樂壇的批判搖滾先河。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_12",
    "tag": "台灣五年級",
    "title": "龍的傳人",
    "artist": "李建復",
    "youtubeUrl": "https://www.youtube.com/watch?v=L8kLPuBSruc",
    "youtubeId": "L8kLPuBSruc",
    "startTime": 20,
    "duration": 60,
    "options": [
      "龍的傳人",
      "曠野寄情",
      "歸去來兮",
      "中華民國頌"
    ],
    "clue": "侯德健作詞作曲，「古老的東方有一條龍，它的名字就叫中國」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_13",
    "tag": "台灣五年級",
    "title": "捉泥鰍",
    "artist": "包美聖",
    "youtubeUrl": "https://www.youtube.com/watch?v=AdbqRQfaOz8",
    "youtubeId": "AdbqRQfaOz8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "捉泥鰍",
      "看我聽我",
      "小茉莉",
      "蘭花草"
    ],
    "clue": "「天天同歌同歡笑，捉泥鰍捉泥鰍」，純真歡快的校園民歌代表作。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_14",
    "tag": "台灣五年級",
    "title": "阿美阿美",
    "artist": "王夢麟",
    "youtubeUrl": "https://www.youtube.com/watch?v=NoY2m1iSTsw",
    "youtubeId": "NoY2m1iSTsw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "阿美阿美",
      "木棉道",
      "雨中即景",
      "七月涼山"
    ],
    "clue": "王夢麟幽默詼諧的校園民歌：「阿美阿美幾時辦嫁妝，我說阿美呀人老珠黃」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_15",
    "tag": "台灣五年級",
    "title": "三月裡的小雨",
    "artist": "劉文正",
    "youtubeUrl": "https://www.youtube.com/watch?v=67fJktZWFQ8",
    "youtubeId": "67fJktZWFQ8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "三月裡的小雨",
      "諾言",
      "熱線你和我",
      "遲到"
    ],
    "clue": "巨星劉文正1981年經典代表作，「三月裡的小雨淅瀝瀝下個不停」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_16",
    "tag": "台灣五年級",
    "title": "掌聲響起",
    "artist": "鳳飛飛",
    "youtubeUrl": "https://www.youtube.com/watch?v=_q794pPonKY",
    "youtubeId": "_q794pPonKY",
    "startTime": 30,
    "duration": 60,
    "options": [
      "掌聲響起",
      "祝你幸福",
      "敲敲門",
      "流水年華"
    ],
    "clue": "「帽子歌后」鳳飛飛傳唱半世紀的心聲名曲：「孤獨站在這舞台，聽到掌聲響起來」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_17",
    "tag": "台灣五年級",
    "title": "祝你幸福",
    "artist": "鳳飛飛",
    "youtubeUrl": "https://www.youtube.com/watch?v=AIcWy2GMhtA",
    "youtubeId": "AIcWy2GMhtA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "祝你幸福",
      "掌聲響起",
      "月朦朧鳥朦朧",
      "枫葉情"
    ],
    "clue": "鳳飛飛出道成名曲：「人生的旅途有甘有苦，要有堅強意志，祝你幸福」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_18",
    "tag": "台灣五年級",
    "title": "熱情的沙漠",
    "artist": "歐陽菲菲",
    "youtubeUrl": "https://www.youtube.com/watch?v=PwmwtCQEcJ0",
    "youtubeId": "PwmwtCQEcJ0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "熱情的沙漠",
      "逝去的愛",
      "愛的路上我和你",
      "嚮往"
    ],
    "clue": "歐陽菲菲動感爆發力經典：「我的熱情，好像一把火，燃燒了整個沙漠」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_19",
    "tag": "台灣五年級",
    "title": "就在今夜",
    "artist": "丘丘合唱團",
    "youtubeUrl": "https://www.youtube.com/watch?v=NUPOUgQxHHU",
    "youtubeId": "NUPOUgQxHHU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "就在今夜",
      "河堤上的傻瓜",
      "為何夢見他",
      "摇滾同學會"
    ],
    "clue": "娃娃金智娟沙啞狂野嗓音，打破校園民歌平靜、開啟台灣流行搖滾新時代。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_20",
    "tag": "台灣五年級",
    "title": "一剪梅",
    "artist": "費玉清",
    "youtubeUrl": "https://www.youtube.com/watch?v=VKq2flvS7dw",
    "youtubeId": "VKq2flvS7dw",
    "startTime": 20,
    "duration": 60,
    "options": [
      "一剪梅",
      "晚安曲",
      "夢駝鈴",
      "千里之外"
    ],
    "clue": "「真情像草原廣闊，層層風雨不能阻隔」，費玉清清亮嗓音紅遍海內外。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_21",
    "tag": "台灣五年級",
    "title": "我只在乎你",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=LE6vRCpcbb8",
    "youtubeId": "LE6vRCpcbb8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我只在乎你",
      "月亮代表我的心",
      "甜蜜蜜",
      "何日君再來"
    ],
    "clue": "鄧麗君1987年經典傳世名作，「任時光匆匆流去，我只在乎你」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_22",
    "tag": "台灣五年級",
    "title": "千言萬語",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=fKKrtdgD5vQ",
    "youtubeId": "fKKrtdgD5vQ",
    "startTime": 10,
    "duration": 60,
    "options": [
      "千言萬語",
      "小城故事",
      "海韻",
      "原鄉人"
    ],
    "clue": "電影《彩雲飛》插曲，「不知道為了什麼，憂愁它圍繞著我」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_23",
    "tag": "台灣五年級",
    "title": "何日君再來",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=7guSDkKIpX0",
    "youtubeId": "7guSDkKIpX0",
    "startTime": 10,
    "duration": 60,
    "options": [
      "何日君再來",
      "夜來香",
      "月亮代表我的心",
      "小城故事"
    ],
    "clue": "華語流行經典，「好花不常開，好景不常在，愁堆解笑眉，淚灑相思帶」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_24",
    "tag": "台灣五年級",
    "title": "流水年華",
    "artist": "鳳飛飛",
    "youtubeUrl": "https://www.youtube.com/watch?v=0B7EH-cYnfo",
    "youtubeId": "0B7EH-cYnfo",
    "startTime": 10,
    "duration": 60,
    "options": [
      "流水年華",
      "掌聲響起",
      "祝你幸福",
      "敲敲門"
    ],
    "clue": "帽子歌后鳳飛飛經典名曲，「朦朧的街燈，靜靜的躺在小雨中」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_25",
    "tag": "台灣五年級",
    "title": "追夢人",
    "artist": "鳳飛飛",
    "youtubeUrl": "https://www.youtube.com/watch?v=JvQkhr3CWsI",
    "youtubeId": "JvQkhr3CWsI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "追夢人",
      "掌聲響起",
      "心肝寶貝",
      "月朦朧鳥朦朧"
    ],
    "clue": "羅大佑作詞作曲，電視劇《雪山飛狐》片尾曲，「讓流浪的足跡在荒漠裡寫下永久的回憶」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_26",
    "tag": "台灣五年級",
    "title": "讀你",
    "artist": "蔡琴",
    "youtubeUrl": "https://www.youtube.com/watch?v=CAtivvxfA_8",
    "youtubeId": "CAtivvxfA_8",
    "startTime": 10,
    "duration": 60,
    "options": [
      "讀你",
      "恰似你的溫柔",
      "被遺忘的時光",
      "最後一夜"
    ],
    "clue": "梁弘志作詞作曲，「讀你千遍也不厭倦，讀你的感覺像三月」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_27",
    "tag": "台灣五年級",
    "title": "晚安曲",
    "artist": "費玉清",
    "youtubeUrl": "https://www.youtube.com/watch?v=xrBzx1WjD7I",
    "youtubeId": "xrBzx1WjD7I",
    "startTime": 10,
    "duration": 60,
    "options": [
      "晚安曲",
      "一剪梅",
      "中華民國頌",
      "夢駝鈴"
    ],
    "clue": "劉家昌作詞作曲，全台百貨公司與各機關學校每日打烊閉館的經典代表播音。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_28",
    "tag": "台灣五年級",
    "title": "中華民國頌",
    "artist": "費玉清",
    "youtubeUrl": "https://www.youtube.com/watch?v=0FIBbXgOJFg",
    "youtubeId": "0FIBbXgOJFg",
    "startTime": 10,
    "duration": 60,
    "options": [
      "中華民國頌",
      "一剪梅",
      "國恩家慶",
      "梅花"
    ],
    "clue": "劉家昌作詞作曲，慷慨激昂傳唱數十載的經典愛國歌曲。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_29",
    "tag": "台灣五年級",
    "title": "歡顏",
    "artist": "齊豫",
    "youtubeUrl": "https://www.youtube.com/watch?v=QctMbIWIgoc",
    "youtubeId": "QctMbIWIgoc",
    "startTime": 10,
    "duration": 60,
    "options": [
      "歡顏",
      "橄欖樹",
      "走在雨中",
      "你是我所有的回憶"
    ],
    "clue": "電影《歡顏》同名主題曲，齊豫空靈縹緲的嗓音令人難以忘懷。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_30",
    "tag": "台灣五年級",
    "title": "歸去來兮",
    "artist": "李建復",
    "youtubeUrl": "https://www.youtube.com/watch?v=ldoHPkultPI",
    "youtubeId": "ldoHPkultPI",
    "startTime": 10,
    "duration": 60,
    "options": [
      "歸去來兮",
      "龍的傳人",
      "曠野寄情",
      "柴拉可汗"
    ],
    "clue": "侯德健作詞作曲，台灣校園民歌時期的著名抒情史詩名篇。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_31",
    "tag": "台灣五年級",
    "title": "看我！聽我！",
    "artist": "包美聖",
    "youtubeUrl": "https://www.youtube.com/watch?v=g1O1PQlCh-g",
    "youtubeId": "g1O1PQlCh-g",
    "startTime": 10,
    "duration": 60,
    "options": [
      "看我！聽我！",
      "捉泥鰍",
      "小雨中的回憶",
      "秋蟬"
    ],
    "clue": "邱晨詞曲，校園民歌代表作，「看看我，聽聽我，我從山中來，帶著蘭花草」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_32",
    "tag": "台灣五年級",
    "title": "歸人沙城",
    "artist": "施孝榮",
    "youtubeUrl": "https://www.youtube.com/watch?v=ruUo9axPFJE",
    "youtubeId": "ruUo9axPFJE",
    "startTime": 10,
    "duration": 60,
    "options": [
      "歸人沙城",
      "拜訪春天",
      "中華之愛",
      "俠客"
    ],
    "clue": "陳輝雄詞曲，施孝榮渾厚豪邁的嗓音唱出塞外大漠的滄桑與堅毅。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_33",
    "tag": "台灣五年級",
    "title": "雨中即景",
    "artist": "王夢麟",
    "youtubeUrl": "https://www.youtube.com/watch?v=IzQj1L_ORxI",
    "youtubeId": "IzQj1L_ORxI",
    "startTime": 10,
    "duration": 60,
    "options": [
      "雨中即景",
      "木棉道",
      "阿美阿美",
      "廟會"
    ],
    "clue": "王夢麟自作自唱，「嘩啦啦啦下雨了，大家快點跑」，生動描摹下雨天眾生相。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_34",
    "tag": "台灣五年級",
    "title": "木棉道",
    "artist": "王夢麟",
    "youtubeUrl": "https://www.youtube.com/watch?v=eAKXYUJk7O4",
    "youtubeId": "eAKXYUJk7O4",
    "startTime": 10,
    "duration": 60,
    "options": [
      "木棉道",
      "雨中即景",
      "七月涼山",
      "奔放奔放"
    ],
    "clue": "馬兆駿作曲、洪光達作詞，「紅紅的花開滿了木棉道，長長的街好像在燃燒」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_35",
    "tag": "台灣五年級",
    "title": "踏著夕陽歸去",
    "artist": "葉佳修",
    "youtubeUrl": "https://www.youtube.com/watch?v=jXhssuHC5h4",
    "youtubeId": "jXhssuHC5h4",
    "startTime": 10,
    "duration": 60,
    "options": [
      "踏著夕陽歸去",
      "鄉間的小路",
      "外婆的澎湖灣",
      "流浪者的獨白"
    ],
    "clue": "葉佳修鄉村田園風格代表作，「遠遠的街燈明了，好像閃著無數的明星」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_36",
    "tag": "台灣五年級",
    "title": "蘭花草",
    "artist": "劉文正",
    "youtubeUrl": "https://www.youtube.com/watch?v=1tblJoVfQ3A",
    "youtubeId": "1tblJoVfQ3A",
    "startTime": 10,
    "duration": 60,
    "options": [
      "蘭花草",
      "三月裡的小雨",
      "諾言",
      "熱線你和我"
    ],
    "clue": "改編自胡適詩作，「我從山中來，帶著蘭花草，種在小園中，希望花開早」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_37",
    "tag": "台灣五年級",
    "title": "諾言",
    "artist": "劉文正",
    "youtubeUrl": "https://www.youtube.com/watch?v=ssK7r4yIGVw",
    "youtubeId": "ssK7r4yIGVw",
    "startTime": 10,
    "duration": 60,
    "options": [
      "諾言",
      "三月裡的小雨",
      "閃亮的日子",
      "沉思"
    ],
    "clue": "孫儀作詞、劉家昌作曲，巨星劉文正早期轟動全台的成名抒情金曲。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_38",
    "tag": "台灣五年級",
    "title": "逝去的愛",
    "artist": "歐陽菲菲",
    "youtubeUrl": "https://www.youtube.com/watch?v=eYZTOlS5SIM",
    "youtubeId": "eYZTOlS5SIM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "逝去的愛",
      "熱情的沙漠",
      "愛的路上我和你",
      "感恩的心"
    ],
    "clue": "Love is over，歐陽菲菲以渾厚動人的歌喉紅遍台日兩地的流行金曲。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_39",
    "tag": "台灣五年級",
    "title": "酒矸倘賣無",
    "artist": "蘇芮",
    "youtubeUrl": "https://www.youtube.com/watch?v=HhO7NqVLLFc",
    "youtubeId": "HhO7NqVLLFc",
    "startTime": 20,
    "duration": 60,
    "options": [
      "酒矸倘賣無",
      "一樣的月光",
      "請跟我來",
      "親愛的小孩"
    ],
    "clue": "電影《搭錯車》主題曲，侯德健作詞作曲，蘇芮震撼人心的靈魂嘶吼。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade5_40",
    "tag": "台灣五年級",
    "title": "一樣的月光",
    "artist": "蘇芮",
    "youtubeUrl": "https://www.youtube.com/watch?v=dqcoG9LUzgE",
    "youtubeId": "dqcoG9LUzgE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "一樣的月光",
      "酒矸倘賣無",
      "跟著感覺走",
      "牽手"
    ],
    "clue": "吳念真、羅大佑作詞、李壽全作曲，「什麼時候兒時玩伴都離我遠去」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "拜訪春天",
    "artist": "施孝榮",
    "youtubeId": "Onl3wGsYQYE",
    "options": [
      "拜訪春天",
      "歸人沙城",
      "中華民國頌",
      "野百合也有春天"
    ],
    "clue": "施孝榮校園民歌代表作，「那年我們來到小小的山巔，有雨細細的下……」輕快又朝氣蓬勃。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "你是我所有的回憶",
    "artist": "齊豫",
    "youtubeId": "6HkCQr_VE7Q",
    "options": [
      "你是我所有的回憶",
      "橄欖樹",
      "歡顏",
      "天天天藍"
    ],
    "clue": "李泰祥作曲、侯德健作詞，齊豫空靈縹緲的美聲詮釋如雨絲細綿的思念之情。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "天天天藍",
    "artist": "潘越雲",
    "youtubeId": "j5Dt5MhlPsM",
    "options": [
      "天天天藍",
      "野百合也有春天",
      "被遺忘的時光",
      "恰似你的溫柔"
    ],
    "clue": "陳立鷗作曲、卓以玉作詞，「天天天藍，叫我不想他也難……」滾石唱片早期抒情里程碑。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "野百合也有春天",
    "artist": "潘越雲",
    "youtubeId": "GSoLwHTXRmM",
    "options": [
      "野百合也有春天",
      "天天天藍",
      "追夢人",
      "戀曲1980"
    ],
    "clue": "羅大佑詞曲創作，收錄於潘越雲《胭脂北投》專輯，溫暖鼓勵每顆寂寞的心都有綻放的春天。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "戀曲1980",
    "artist": "羅大佑",
    "youtubeId": "2nry60MCU8U",
    "options": [
      "戀曲1980",
      "戀曲1990",
      "光陰的故事",
      "鹿港小鎮"
    ],
    "clue": "羅大佑首張專輯《之乎者也》情歌名作，「妳曾經對我說，妳永遠愛著我……」，反映當代愛情觀。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "亞細亞的孤兒",
    "artist": "羅大佑",
    "youtubeId": "2fqhfVBjeso",
    "options": [
      "亞細亞的孤兒",
      "鹿港小鎮",
      "現象七十二變",
      "童年"
    ],
    "clue": "以童聲合唱與嗩吶淒楚音色交織，深刻反思歷史與台灣處境的時代鉅作。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "戀曲1990",
    "artist": "羅大佑",
    "youtubeId": "GeNIpOsmEwA",
    "options": [
      "戀曲1990",
      "戀曲1980",
      "野百合也有春天",
      "東方之珠"
    ],
    "clue": "電影《阿郎的故事》主題曲，「烏溜溜的黑眼珠和你的笑臉」，傳唱兩岸三地的經典金曲。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "是否",
    "artist": "蘇芮",
    "youtubeId": "tmurzlEsRtM",
    "options": [
      "是否",
      "一樣的月光",
      "酒矸倘賣無",
      "跟著感覺走"
    ],
    "clue": "羅大佑詞曲、蘇芮黑衣靈魂嗓音演唱，「是否這次我將真的離開妳……」，電影《搭錯車》名曲。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "跟著感覺走",
    "artist": "蘇芮",
    "youtubeId": "v6mL0au2T1Q",
    "options": [
      "跟著感覺走",
      "一樣的月光",
      "熱情的沙漠",
      "就在今夜"
    ],
    "clue": "陳家麗作詞、陳志遠作曲，輕快奔放的都會流行風潮，鼓勵年輕世代勇敢探索自我。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "出塞曲",
    "artist": "蔡琴",
    "youtubeId": "13cZcomiqLA",
    "options": [
      "出塞曲",
      "渡口",
      "恰似你的溫柔",
      "被遺忘的時光"
    ],
    "clue": "席慕蓉作詞、李泰祥作曲，蔡琴醇厚低沉的嗓音歌詠蒙古大草原長城外的雄渾鄉愁。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "渡口",
    "artist": "蔡琴",
    "youtubeId": "F01Vupwp-AM",
    "options": [
      "渡口",
      "出塞曲",
      "讀你",
      "最後一夜"
    ],
    "clue": "席慕蓉詩作改編，開頭低沉震撼的鼓點音效常被音響發燒友奉為人聲與低頻測試聖品。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "廟會",
    "artist": "王夢麟",
    "youtubeId": "KqdJcJadx_Q",
    "options": [
      "廟會",
      "雨中即景",
      "阿美阿美",
      "木棉道"
    ],
    "clue": "校園民歌熱鬧歡騰的民俗代表作，「歡鑼喜鼓咚得隆咚鏘，鈸鐃穿雲霄……」，充滿節慶氣息。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "漁唱",
    "artist": "黃大城",
    "youtubeId": "xAxPup8jRF4",
    "options": [
      "漁唱",
      "曠野寄情",
      "歸人沙城",
      "七月涼山"
    ],
    "clue": "靳鐵章詞曲、黃大城渾厚嗓音演唱，「茫茫暮色微涼，聽那晚風吹送……」，描繪漁舟唱晚意境。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "蝸牛與黃鸝鳥",
    "artist": "銀霞",
    "youtubeId": "5KAMe3UtRAg",
    "options": [
      "蝸牛與黃鸝鳥",
      "捉泥鰍",
      "小草",
      "蘭花草"
    ],
    "clue": "陳弘文詞曲，「阿門阿前一棵葡萄樹，阿嫩阿嫩綠地剛發芽」，趣味盎然的民歌寓言傳唱大街小巷。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "閃亮的日子",
    "artist": "劉文正",
    "youtubeId": "mzSX6fnznek",
    "options": [
      "閃亮的日子",
      "蘭花草",
      "三月裡的小雨",
      "諾言"
    ],
    "clue": "羅大佑早期創作、劉文正溫情詮釋，「我不得不用白色手帕，拭去我臉上的淚水……」。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "太陽一樣",
    "artist": "劉文正",
    "youtubeId": "DlqUgdHmLw8",
    "options": [
      "太陽一樣",
      "熱情的沙漠",
      "愛像什麼",
      "閃亮的日子"
    ],
    "clue": "劉文正招牌動感舞曲，帥氣白色西裝配上招牌圍巾與舞步，迷倒全台灣無數五年級粉絲。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "夕陽伴我歸",
    "artist": "陳淑樺",
    "youtubeId": "J0SsrsIoirY",
    "options": [
      "夕陽伴我歸",
      "夢醒時分",
      "問",
      "滾滾紅塵"
    ],
    "clue": "陳淑樺早年民歌時期代表作，「夕陽已西沉，晚風露涼意」，展現清新脫俗的天籟女聲。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "台灣五年級",
    "title": "思念總在分手後",
    "artist": "葉佳修",
    "youtubeId": "WqBMsgC3ggU",
    "options": [
      "思念總在分手後",
      "鄉間的小路",
      "外婆的澎湖灣",
      "流浪者的獨白"
    ],
    "clue": "民謠詩人葉佳修詞曲名作，「想要說些什麼，又不知從何說起……」，刻劃離別深情。",
    "tags": [
      "台灣五年級"
    ]
  },
  {
    "tag": "經典台語, 台灣五年級",
    "title": "風飛沙",
    "artist": "陳盈潔",
    "youtubeId": "7CwcAH9zQ7o",
    "options": [
      "風飛沙",
      "海海人生",
      "酒後的心聲",
      "愛拼才會贏"
    ],
    "clue": "經典台語浪子情歌，「思念故鄉的風飛沙，暝暝想著你……」，陳盈潔渾厚滄桑的台語金曲。",
    "tags": [
      "經典台語",
      "台灣五年級"
    ]
  },
  {
    "tag": "經典台語, 台灣五年級",
    "title": "心事誰人知",
    "artist": "沈文程",
    "youtubeId": "T8_9SHCc6tQ",
    "options": [
      "心事誰人知",
      "愛拼才會贏",
      "浪子的心情",
      "舊情也綿綿"
    ],
    "clue": "蔡振南詞曲、沈文程唱紅全台灣街頭巷尾的台語經典，「心事若無講出來，有誰人會知……」。",
    "tags": [
      "經典台語",
      "台灣五年級"
    ]
  },
  {
    "id": "tw_grade6_1",
    "tag": "台灣六年級",
    "title": "青蘋果樂園",
    "artist": "小虎隊",
    "youtubeUrl": "https://www.youtube.com/watch?v=UPFeAndsDRQ",
    "youtubeId": "UPFeAndsDRQ",
    "startTime": 20,
    "duration": 60,
    "options": [
      "青蘋果樂園",
      "紅蜻蜓",
      "蝴蝶飛呀",
      "愛"
    ],
    "clue": "小虎隊出道成名曲，「週末午夜別徘徊，快到蘋果樂園來」引爆全台追星狂潮。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_2",
    "tag": "台灣六年級",
    "title": "紅蜻蜓",
    "artist": "小虎隊",
    "youtubeUrl": "https://www.youtube.com/watch?v=NbSf07Zr3ow",
    "youtubeId": "NbSf07Zr3ow",
    "startTime": 20,
    "duration": 60,
    "options": [
      "紅蜻蜓",
      "青蘋果樂園",
      "星光依舊燦爛",
      "放心去飛"
    ],
    "clue": "「飛呀，飛呀，看那紅色蜻蜓飛在藍天綠草的上方」，無數六年級生的成長印記。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_3",
    "tag": "台灣六年級",
    "title": "吻別",
    "artist": "張學友",
    "youtubeUrl": "https://www.youtube.com/watch?v=mIF-nn_y2_8",
    "youtubeId": "mIF-nn_y2_8",
    "startTime": 30,
    "duration": 60,
    "options": [
      "吻別",
      "一千個傷心的理由",
      "情網",
      "祝福"
    ],
    "clue": "歌神張學友1993年巔峰之作，「我和你吻別在無人的街」，創下華語唱片銷售奇蹟。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_4",
    "tag": "台灣六年級",
    "title": "一千個傷心的理由",
    "artist": "張學友",
    "youtubeUrl": "https://www.youtube.com/watch?v=Yl9sIjmaZP8",
    "youtubeId": "Yl9sIjmaZP8",
    "startTime": 25,
    "duration": 60,
    "options": [
      "一千個傷心的理由",
      "吻別",
      "心如刀割",
      "忘記你我做不到"
    ],
    "clue": "張學友抒情傳唱金曲，「一千個傷心的理由，最後我的愛情在故事裡慢慢陳舊」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_5",
    "tag": "台灣六年級",
    "title": "忘情水",
    "artist": "劉德華",
    "youtubeUrl": "https://www.youtube.com/watch?v=pKoeIPTlTDI",
    "youtubeId": "pKoeIPTlTDI",
    "startTime": 30,
    "duration": 60,
    "options": [
      "忘情水",
      "謝謝你的愛",
      "冰雨",
      "天意"
    ],
    "clue": "劉德華華語代表名曲，「給我一杯忘情水，換我一生不傷悲」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_6",
    "tag": "台灣六年級",
    "title": "我的未來不是夢",
    "artist": "張雨生",
    "youtubeUrl": "https://www.youtube.com/watch?v=lTxZmhAoSGU",
    "youtubeId": "lTxZmhAoSGU",
    "startTime": 30,
    "duration": 60,
    "options": [
      "我的未來不是夢",
      "天天想你",
      "大海",
      "口是心非"
    ],
    "clue": "張雨生高亢清澈的嗓音，激勵幾代年輕人堅持理想的熱血國歌。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_7",
    "tag": "台灣六年級",
    "title": "天天想你",
    "artist": "張雨生",
    "youtubeUrl": "https://www.youtube.com/watch?v=qSslpWSSTLg",
    "youtubeId": "qSslpWSSTLg",
    "startTime": 25,
    "duration": 60,
    "options": [
      "天天想你",
      "我的未來不是夢",
      "帶我去月球",
      "大海"
    ],
    "clue": "張雨生首張個人專輯同名主打歌，「天天想你，天天問自己，到什麼時候才能告訴你」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_8",
    "tag": "台灣六年級",
    "title": "朋友",
    "artist": "周華健",
    "youtubeUrl": "https://www.youtube.com/watch?v=6lbPgfKK7m4",
    "youtubeId": "6lbPgfKK7m4",
    "startTime": 45,
    "duration": 60,
    "options": [
      "朋友",
      "讓我歡喜讓我憂",
      "花心",
      "凡人歌"
    ],
    "clue": "「一句話一輩子，一生情一杯酒」，畢業與同窗聚會必唱曲。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_9",
    "tag": "台灣六年級",
    "title": "花心",
    "artist": "周華健",
    "youtubeUrl": "https://www.youtube.com/watch?v=IZ8-K3YPVN0",
    "youtubeId": "IZ8-K3YPVN0",
    "startTime": 20,
    "duration": 60,
    "options": [
      "花心",
      "朋友",
      "愛相隨",
      "風雨無阻"
    ],
    "clue": "周華健1993年紅遍大街小巷的代表作，「花的心藏在蕊中，空把花期都錯過」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_10",
    "tag": "台灣六年級",
    "title": "新鴛鴦蝴蝶夢",
    "artist": "黃安",
    "youtubeUrl": "https://www.youtube.com/watch?v=lDkKHtaBGaY",
    "youtubeId": "lDkKHtaBGaY",
    "startTime": 35,
    "duration": 60,
    "options": [
      "新鴛鴦蝴蝶夢",
      "包青天",
      "得意的笑",
      "愛江山更愛美人"
    ],
    "clue": "1993年華視電視連續劇《包青天》經典片尾曲。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_11",
    "tag": "經典台語, 台灣六年級",
    "title": "愛拼才會贏",
    "artist": "葉啟田",
    "youtubeUrl": "https://www.youtube.com/watch?v=bTPEofbCxB8",
    "youtubeId": "bTPEofbCxB8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "愛拼才會贏",
      "浪子的心情",
      "歡喜就好",
      "家後"
    ],
    "clue": "經典台語勵志歌曲：「三分天註定，七分靠打拼」。",
    "tags": [
      "經典台語",
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_12",
    "tag": "經典台語, 台灣六年級",
    "title": "家後",
    "artist": "江蕙",
    "youtubeUrl": "https://www.youtube.com/watch?v=KAntP2xs8FE",
    "youtubeId": "KAntP2xs8FE",
    "startTime": 35,
    "duration": 60,
    "options": [
      "家後",
      "落雨聲",
      "酒後的心聲",
      "傷心酒店"
    ],
    "clue": "鄭進一作詞作曲，江蕙道盡傳統妻子相伴一生的動人台語情歌。",
    "tags": [
      "經典台語",
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_13",
    "tag": "台灣六年級",
    "title": "浪人情歌",
    "artist": "伍佰 & China Blue",
    "youtubeUrl": "https://www.youtube.com/watch?v=OPkqtboFFYI",
    "youtubeId": "OPkqtboFFYI",
    "startTime": 25,
    "duration": 60,
    "options": [
      "浪人情歌",
      "挪威的森林",
      "愛你一萬年",
      "樹枝孤鳥"
    ],
    "clue": "「不要再想妳，不要再愛妳，讓時間悄悄的飛逝」，伍佰經典台式搖滾。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_14",
    "tag": "台灣六年級",
    "title": "挪威的森林",
    "artist": "伍佰 & China Blue",
    "youtubeUrl": "https://www.youtube.com/watch?v=gPpZJlE0Ca8",
    "youtubeId": "gPpZJlE0Ca8",
    "startTime": 30,
    "duration": 60,
    "options": [
      "挪威的森林",
      "浪人情歌",
      "淚橋",
      "白鴿"
    ],
    "clue": "「讓我將妳心兒摘下，試著將它慢慢融化」，伍佰最著名的代表作之一。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_15",
    "tag": "台灣六年級",
    "title": "愛如潮水",
    "artist": "張信哲",
    "youtubeUrl": "https://www.youtube.com/watch?v=lt2ZK19_Utw",
    "youtubeId": "lt2ZK19_Utw",
    "startTime": 35,
    "duration": 60,
    "options": [
      "愛如潮水",
      "過火",
      "別怕我傷心",
      "白月光"
    ],
    "clue": "李宗盛詞曲、情歌王子張信哲深情演繹，「既然愛了就不後悔，再多的苦我也願意背」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_16",
    "tag": "台灣六年級",
    "title": "姐妹",
    "artist": "張惠妹",
    "youtubeUrl": "https://www.youtube.com/watch?v=OO60xtWjLRw",
    "youtubeId": "OO60xtWjLRw",
    "startTime": 20,
    "duration": 60,
    "options": [
      "姐妹",
      "聽海",
      "解脫",
      "原來你什麼都不要"
    ],
    "clue": "張雨生打造、阿妹出道震撼華語樂壇的神專主打，原住民高亢清麗的合聲引領風騷。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_17",
    "tag": "台灣六年級",
    "title": "聽海",
    "artist": "張惠妹",
    "youtubeUrl": "https://www.youtube.com/watch?v=mLk61pfiHQ0",
    "youtubeId": "mLk61pfiHQ0",
    "startTime": 35,
    "duration": 60,
    "options": [
      "聽海",
      "姐妹",
      "我可以抱你嗎",
      "剪愛"
    ],
    "clue": "「聽海哭的聲音，這片海未免也太多情」，KTV不敗情歌之王。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_18",
    "tag": "台灣六年級",
    "title": "心太軟",
    "artist": "任賢齊",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZSWeurc1yMw",
    "youtubeId": "ZSWeurc1yMw",
    "startTime": 30,
    "duration": 60,
    "options": [
      "心太軟",
      "對面的女孩看過來",
      "傷心太平洋",
      "浪花一朵朵"
    ],
    "clue": "小蟲詞曲，紅遍兩岸三地傳唱神話：「你總是心太軟，心太軟，把所有問題都自己扛」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_19",
    "tag": "台灣六年級",
    "title": "對面的女孩看過來",
    "artist": "任賢齊",
    "youtubeUrl": "https://www.youtube.com/watch?v=6aosRlnxg9I",
    "youtubeId": "6aosRlnxg9I",
    "startTime": 15,
    "duration": 60,
    "options": [
      "對面的女孩看過來",
      "心太軟",
      "春天花會開",
      "浪花一朵朵"
    ],
    "clue": "阿牛創作、任賢齊歡樂演繹的校園把妹神曲：「對面的女孩看過來，看過來，看過來」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_20",
    "tag": "經典台語, 台灣六年級",
    "title": "向前走",
    "artist": "林強",
    "youtubeUrl": "https://www.youtube.com/watch?v=gD14iiXq7Xw",
    "youtubeId": "gD14iiXq7Xw",
    "startTime": 25,
    "duration": 60,
    "options": [
      "向前走",
      "春風少年兄",
      "黑輪伯仔",
      "愛拼才會贏"
    ],
    "clue": "「火車漸漸在起頭，再會吧！向前走！」引領台灣新台語搖滾浪潮的革命之作。",
    "tags": [
      "經典台語",
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_21",
    "tag": "台灣六年級",
    "title": "祝福",
    "artist": "張學友",
    "youtubeUrl": "https://www.youtube.com/watch?v=R4qQpZ2PQ1c",
    "youtubeId": "R4qQpZ2PQ1c",
    "startTime": 15,
    "duration": 60,
    "options": [
      "祝福",
      "吻別",
      "一千個傷心的理由",
      "每天愛你多一些"
    ],
    "clue": "華語歌壇畢業與告別第一神曲，「朋友我永遠祝福你」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_22",
    "tag": "台灣六年級",
    "title": "謝謝你的愛",
    "artist": "劉德華",
    "youtubeUrl": "https://www.youtube.com/watch?v=cMvj_8eoJ8Q",
    "youtubeId": "cMvj_8eoJ8Q",
    "startTime": 15,
    "duration": 60,
    "options": [
      "謝謝你的愛",
      "忘情水",
      "天意",
      "冰雨"
    ],
    "clue": "四大天王劉德華狂銷全亞洲的抒情金曲，「是不宜遲的愛，是不知所措的感慨」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_23",
    "tag": "台灣六年級",
    "title": "對你愛不完",
    "artist": "郭富城",
    "youtubeUrl": "https://www.youtube.com/watch?v=IIxWKLnaOkc",
    "youtubeId": "IIxWKLnaOkc",
    "startTime": 10,
    "duration": 60,
    "options": [
      "對你愛不完",
      "狂野之城",
      "我是不是該安靜的走開",
      "愛的呼喚"
    ],
    "clue": "郭富城招牌手勢動感神曲，「對你愛愛愛不完，我可以天天月月年年到永遠」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_24",
    "tag": "台灣六年級",
    "title": "今夜你會不會來",
    "artist": "黎明",
    "youtubeUrl": "https://www.youtube.com/watch?v=eUL6rkTAPhY",
    "youtubeId": "eUL6rkTAPhY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "今夜你會不會來",
      "情深說話未曾講",
      "夏日傾情",
      "深秋的黎明"
    ],
    "clue": "黎明紅遍兩岸三地的經典情歌，「今夜你會不會來，你的愛還在不在」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_25",
    "tag": "台灣六年級",
    "title": "新年快樂",
    "artist": "小虎隊 / 憂歡派對",
    "youtubeUrl": "https://www.youtube.com/watch?v=I_8UQnG95lk",
    "youtubeId": "I_8UQnG95lk",
    "startTime": 10,
    "duration": 60,
    "options": [
      "新年快樂",
      "青蘋果樂園",
      "紅蜻蜓",
      "逍遙遊"
    ],
    "clue": "小虎隊與憂歡派對合唱，逢年過節大街小巷必播的經典旋律。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_26",
    "tag": "台灣六年級",
    "title": "不是每個戀曲都有美好回憶",
    "artist": "林志穎",
    "youtubeUrl": "https://www.youtube.com/watch?v=UAmjOHiye1s",
    "youtubeId": "UAmjOHiye1s",
    "startTime": 10,
    "duration": 60,
    "options": [
      "不是每個戀曲都有美好回憶",
      "十七歲的雨季",
      "今年夏天",
      "戲夢"
    ],
    "clue": "小旋風林志穎出道成名曲，熱力四射的舞步席捲各大校園。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_27",
    "tag": "台灣六年級",
    "title": "大海",
    "artist": "張雨生",
    "youtubeUrl": "https://www.youtube.com/watch?v=EXaLvBGqQww",
    "youtubeId": "EXaLvBGqQww",
    "startTime": 20,
    "duration": 60,
    "options": [
      "大海",
      "我的未來不是夢",
      "天天想你",
      "口是心非"
    ],
    "clue": "音樂魔術師張雨生高亢嘹亮的傳世名作，「如果大海能夠喚回曾經的愛」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_28",
    "tag": "台灣六年級",
    "title": "讓我歡喜讓我憂",
    "artist": "周華健",
    "youtubeUrl": "https://www.youtube.com/watch?v=vqTXMw9zdto",
    "youtubeId": "vqTXMw9zdto",
    "startTime": 15,
    "duration": 60,
    "options": [
      "讓我歡喜讓我憂",
      "朋友",
      "花心",
      "愛相隨"
    ],
    "clue": "國民歌王周華健翻唱自恰克與飛鳥的抒情經典，「愛到盡頭，覆水難收」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_29",
    "tag": "台灣六年級",
    "title": "愛情的盡頭",
    "artist": "伍佰 & China Blue",
    "youtubeUrl": "https://www.youtube.com/watch?v=zzlC6ma-SYQ",
    "youtubeId": "zzlC6ma-SYQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "愛情的盡頭",
      "浪人情歌",
      "挪威的森林",
      "最後的溫柔"
    ],
    "clue": "伍佰經典搖滾情歌，「若這不是宿命，難道這就是愛情的盡頭」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_30",
    "tag": "經典台語, 台灣六年級",
    "title": "樹枝孤鳥",
    "artist": "伍佰 & China Blue",
    "youtubeUrl": "https://www.youtube.com/watch?v=ObSPLQ-1fJI",
    "youtubeId": "ObSPLQ-1fJI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "樹枝孤鳥",
      "空襲警報",
      "煞到你",
      "返去故鄉"
    ],
    "clue": "金曲獎最佳流行音樂演唱唱片獎，台語搖滾劃時代前衛鉅作。",
    "tags": [
      "經典台語",
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_31",
    "tag": "台灣六年級",
    "title": "原來你什麼都不要",
    "artist": "張惠妹",
    "youtubeUrl": "https://www.youtube.com/watch?v=rT4FqOwn-rs",
    "youtubeId": "rT4FqOwn-rs",
    "startTime": 20,
    "duration": 60,
    "options": [
      "原來你什麼都不要",
      "姐妹",
      "聽海",
      "解脫"
    ],
    "clue": "阿妹張惠妹出道首張專輯《姐妹》中催人淚下的抒情大作。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_32",
    "tag": "台灣六年級",
    "title": "領悟",
    "artist": "辛曉琪",
    "youtubeUrl": "https://www.youtube.com/watch?v=RhfUGpEp9to",
    "youtubeId": "RhfUGpEp9to",
    "startTime": 20,
    "duration": 60,
    "options": [
      "領悟",
      "味道",
      "承認",
      "深情難了"
    ],
    "clue": "李宗盛詞曲創作，辛曉琪痛徹心扉的真情演繹，「多麼痛的領悟」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_33",
    "tag": "台灣六年級",
    "title": "如果雲知道",
    "artist": "許茹芸",
    "youtubeUrl": "https://www.youtube.com/watch?v=DOcb1-SD4Eo",
    "youtubeId": "DOcb1-SD4Eo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "如果雲知道",
      "淚海",
      "獨角戲",
      "日光機場"
    ],
    "clue": "芸式唱腔代表作，「如果雲知道，逃不開糾纏的牢」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_34",
    "tag": "台灣六年級",
    "title": "新不了情",
    "artist": "萬芳",
    "youtubeUrl": "https://www.youtube.com/watch?v=Dw-R85AcN_w",
    "youtubeId": "Dw-R85AcN_w",
    "startTime": 15,
    "duration": 60,
    "options": [
      "新不了情",
      "割愛",
      "猜心",
      "碧海情天"
    ],
    "clue": "爾冬陞同名電影主題曲，萬芳細膩悠揚的嗓音唱出深情愛意。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_35",
    "tag": "台灣六年級",
    "title": "Lemon Tree",
    "artist": "蘇慧倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=HfdEk5RbzrA",
    "youtubeId": "HfdEk5RbzrA",
    "startTime": 10,
    "duration": 60,
    "options": [
      "Lemon Tree",
      "鴨子",
      "傻瓜",
      "被動"
    ],
    "clue": "滾石唱片玉女歌手蘇慧倫翻唱自 Fool's Garden，俏皮輕快的夏日檸檬樹。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_36",
    "tag": "台灣六年級",
    "title": "傷心太平洋",
    "artist": "任賢齊",
    "youtubeUrl": "https://www.youtube.com/watch?v=nsHfeiGrFqo",
    "youtubeId": "nsHfeiGrFqo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "傷心太平洋",
      "心太軟",
      "對面的女孩看過來",
      "春天花會開"
    ],
    "clue": "電視劇《神鵰俠侶》片尾曲，「一波還未平息，一波又來侵襲」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_37",
    "tag": "台灣六年級",
    "title": "大約在冬季",
    "artist": "齊秦",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZYkxIi8H13w",
    "youtubeId": "ZYkxIi8H13w",
    "startTime": 15,
    "duration": 60,
    "options": [
      "大約在冬季",
      "狼",
      "外面的世界",
      "原來的我"
    ],
    "clue": "齊秦創作僅花15分鐘卻風靡華人世界近四十載的浪漫冬季戀歌。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_38",
    "tag": "台灣六年級",
    "title": "夢醒時分",
    "artist": "陳淑樺",
    "youtubeUrl": "https://www.youtube.com/watch?v=nku5zFMZAdU",
    "youtubeId": "nku5zFMZAdU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "夢醒時分",
      "問",
      "滾滾紅塵",
      "明明白白我的心"
    ],
    "clue": "李宗盛詞曲，台灣流行音樂史上第一張銷量突破百萬張的傳奇專輯主打歌。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_39",
    "tag": "經典台語, 台灣六年級",
    "title": "酒後的心聲",
    "artist": "江蕙",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y1H22SMnS5M",
    "youtubeId": "Y1H22SMnS5M",
    "startTime": 15,
    "duration": 60,
    "options": [
      "酒後的心聲",
      "家後",
      "落雨聲",
      "傷心酒店"
    ],
    "clue": "台語天后江蕙創下三百萬張驚人銷售記錄的劃時代台語歌后名作。",
    "tags": [
      "經典台語",
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade6_40",
    "tag": "經典台語, 台灣六年級",
    "title": "傷心酒店",
    "artist": "江蕙 / 施文彬",
    "youtubeUrl": "https://www.youtube.com/watch?v=Jl0CAEZn9II",
    "youtubeId": "Jl0CAEZn9II",
    "startTime": 15,
    "duration": 60,
    "options": [
      "傷心酒店",
      "家後",
      "酒後的心聲",
      "雲中月圓"
    ],
    "clue": "江蕙與施文彬合唱，全台卡拉OK點播榜多年不墜的經典對唱曲。",
    "tags": [
      "經典台語",
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "冰雨",
    "artist": "劉德華",
    "youtubeId": "90zAJ4tFSy8",
    "options": [
      "冰雨",
      "忘情水",
      "謝謝你的愛",
      "練習"
    ],
    "clue": "劉德華情歌代表作之一，「冷冷的冰雨在臉上胡亂的拍，暖暖的眼淚跟寒雨混在一起……」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "練習",
    "artist": "劉德華",
    "youtubeId": "Tad3kweJmC4",
    "options": [
      "練習",
      "冰雨",
      "笨小孩",
      "今天"
    ],
    "clue": "改編自真實感人故事，「我已開始練習，開始慢慢著急，著急這世界沒有你……」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "笨小孩",
    "artist": "劉德華、柯受良、吳宗憲",
    "youtubeId": "tuC_Ng07iCw",
    "options": [
      "笨小孩",
      "世界第一等",
      "練習",
      "冰雨"
    ],
    "clue": "三大天王豪情對唱，「哎喲往著胸口拍一拍呀，勇敢站起來，不用心情太壞……」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "我是不是該安靜的走開",
    "artist": "郭富城",
    "youtubeId": "tnkQmsXIkP8",
    "options": [
      "我是不是該安靜的走開",
      "對你愛不完",
      "狂野之城",
      "愛的呼喚"
    ],
    "clue": "郭富城深情慢歌巔峰作，「我是不是該安靜的走開，還是該勇敢留下來……」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "為你我受冷風吹",
    "artist": "林憶蓮",
    "youtubeId": "ZD57Fv_V74s",
    "options": [
      "為你我受冷風吹",
      "傷痕",
      "夜太黑",
      "愛上一個不回家的人"
    ],
    "clue": "李宗盛詞曲量身打造，「為你我受冷風吹，寂寞時候流眼淚……」，林憶蓮都會情歌經典。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "傷痕",
    "artist": "林憶蓮",
    "youtubeId": "qCXTF6pQQR0",
    "options": [
      "傷痕",
      "為你我受冷風吹",
      "至少還有你",
      "領悟"
    ],
    "clue": "李宗盛詞曲，「夜已深，還有什麼人，讓你這樣醒著數傷痕……」，都會女子療傷之歌。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "味道",
    "artist": "辛曉琪",
    "youtubeId": "9BByAxgUCJw",
    "options": [
      "味道",
      "領悟",
      "承認",
      "遺忘"
    ],
    "clue": "黃國倫作曲、姚謙作詞，「想念你的笑，想念你的外套，想念你白色襪子和你身上的味道……」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "月亮惹的禍",
    "artist": "張宇",
    "youtubeId": "1YJ8wSH6HBU",
    "options": [
      "月亮惹的禍",
      "用心良苦",
      "一言難盡",
      "雨一直下"
    ],
    "clue": "張宇作曲、十一郎作詞，「都是你的錯，輕易愛上我……都是月亮惹的禍」，紅遍兩岸。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "一言難盡",
    "artist": "張宇",
    "youtubeId": "xkDC4n-ZEWY",
    "options": [
      "一言難盡",
      "月亮惹的禍",
      "用心良苦",
      "曲終人散"
    ],
    "clue": "張宇招牌苦情唱腔，「你給我一場戲，拓展我的淚滴……痛徹心扉的一言難盡」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "愛你一萬年",
    "artist": "伍佰 & China Blue",
    "youtubeId": "CgAJAmP14kQ",
    "options": [
      "愛你一萬年",
      "浪人情歌",
      "挪威的森林",
      "愛情的盡頭"
    ],
    "clue": "改編自日本名曲，伍佰以極致搖滾嘶吼與吉他狂飆，締造全台KTV合唱不朽傳奇。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "經典台語, 台灣六年級",
    "title": "煞到妳",
    "artist": "伍佰 & China Blue",
    "youtubeId": "GUIMi_WoSc4",
    "options": [
      "煞到妳",
      "樹枝孤鳥",
      "空襲警報",
      "萬丈深坑"
    ],
    "clue": "伍佰台語搖滾狂潮，「我看妳按怎攏看無夠，我是不是已經煞到妳……」，充滿草根狂熱。",
    "tags": [
      "經典台語",
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "白鴿",
    "artist": "伍佰 & China Blue",
    "youtubeId": "lNuXbIfwXP4",
    "options": [
      "白鴿",
      "浪人情歌",
      "挪威的森林",
      "堅強的理由"
    ],
    "clue": "為廣三SOGO槍擊案受害者創作的撫慰之歌，「前方啊，沒有方向，身上啊，沒有了衣裳……」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "刀劍如夢",
    "artist": "周華健",
    "youtubeId": "Ij0-jMzeZ2U",
    "options": [
      "刀劍如夢",
      "朋友",
      "花心",
      "讓我歡喜讓我憂"
    ],
    "clue": "1994年馬景濤版《倚天屠龍記》片頭曲，「來也匆匆，去也匆匆，恨不能相逢……」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "風雨無阻",
    "artist": "周華健",
    "youtubeId": "HUvDaKBcA44",
    "options": [
      "風雨無阻",
      "愛相隨",
      "花心",
      "親親我的寶貝"
    ],
    "clue": "周華健暖男形象情歌，「給你我的全部，你是我今生唯一的賭注……」，國民歌王代表作。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "過火",
    "artist": "張信哲",
    "youtubeId": "SrD36rogSjc",
    "options": [
      "過火",
      "愛如潮水",
      "寬容",
      "別怕我傷心"
    ],
    "clue": "情歌王子張信哲療傷聖歌，「怎麼忍心怪你犯了錯，是我給你自由過了火……」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "寬容",
    "artist": "張信哲",
    "youtubeId": "fQItfi8WsK8",
    "options": [
      "寬容",
      "過火",
      "愛如潮水",
      "白月光"
    ],
    "clue": "馬兆駿詞曲，「謝謝你給我的愛，今生今世我不忘懷……」，展現張信哲純淨清亮美聲。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "別怕我傷心",
    "artist": "張信哲",
    "youtubeId": "EGTlTEf_DxM",
    "options": [
      "別怕我傷心",
      "愛如潮水",
      "過火",
      "信仰"
    ],
    "clue": "李宗盛詞曲，「好久沒有你的信，好久沒有人陪我談心……」，深情無怨的守候之歌。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "我願意",
    "artist": "王菲",
    "youtubeId": "4Ah5gsjXVgo",
    "options": [
      "我願意",
      "紅豆",
      "天空",
      "棋子"
    ],
    "clue": "黃國倫作曲、姚謙作詞，「我願意為你，忘記我姓名……」，王菲空靈美聲的傳世經典。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "天空",
    "artist": "王菲",
    "youtubeId": "yPN9H450OHs",
    "options": [
      "天空",
      "我願意",
      "矜持",
      "棋子"
    ],
    "clue": "楊明煌製作，王菲清亮純淨的嗓音宛如高原藍天，伴隨口琴悠揚，經典不敗。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "tag": "台灣六年級",
    "title": "我是一隻魚",
    "artist": "任賢齊",
    "youtubeId": "hQMRGsteyRc",
    "options": [
      "我是一隻魚",
      "心太軟",
      "傷心太平洋",
      "對面的女孩看過來"
    ],
    "clue": "劉思銘作詞、劉志宏作曲，「需要你，我是一隻魚，水裡的空氣是你小心眼和壞脾氣……」。",
    "tags": [
      "台灣六年級"
    ]
  },
  {
    "id": "tw_grade7_1",
    "tag": "台灣七年級",
    "title": "晴天",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=DYptgVvkVLQ",
    "youtubeId": "DYptgVvkVLQ",
    "startTime": 28,
    "duration": 60,
    "options": [
      "晴天",
      "七里香",
      "不能說的秘密",
      "簡單愛"
    ],
    "clue": "「故事的小黃花，從出生那年就飄著」，收錄於《葉惠美》專輯。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_2",
    "tag": "台灣七年級",
    "title": "七里香",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=Bbp9ZaJD_eA",
    "youtubeId": "Bbp9ZaJD_eA",
    "startTime": 35,
    "duration": 60,
    "options": [
      "七里香",
      "晴天",
      "蒲公英的約定",
      "青花瓷"
    ],
    "clue": "「雨下整夜我的愛溢出就像雨水」，方文山填詞的經典夏季情歌。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_3",
    "tag": "台灣七年級",
    "title": "稻香",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=sHD_z90ZKV0",
    "youtubeId": "sHD_z90ZKV0",
    "startTime": 30,
    "duration": 60,
    "options": [
      "稻香",
      "聽媽媽的話",
      "簡單愛",
      "陽光宅男"
    ],
    "clue": "「對這個世界如果你有太多的抱怨，跌倒了就不敢繼續往前走」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_4",
    "tag": "台灣七年級",
    "title": "青花瓷",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=Z8Mqw0b9ADs",
    "youtubeId": "Z8Mqw0b9ADs",
    "startTime": 25,
    "duration": 60,
    "options": [
      "青花瓷",
      "千里之外",
      "東風破",
      "菊花台"
    ],
    "clue": "「天青色等煙雨，而我在等你」，中國風流行歌曲的巔峰極致之作。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_5",
    "tag": "台灣七年級",
    "title": "簡單愛",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y4xCVlyCvX4",
    "youtubeId": "Y4xCVlyCvX4",
    "startTime": 25,
    "duration": 60,
    "options": [
      "簡單愛",
      "開不了口",
      "安靜",
      "龍捲風"
    ],
    "clue": "「我想就這樣牽著你的手不放開，愛能不能夠永遠單純沒有悲哀」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_6",
    "tag": "台灣七年級",
    "title": "倒帶",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=cB7DIIG0ykk",
    "youtubeId": "cB7DIIG0ykk",
    "startTime": 35,
    "duration": 60,
    "options": [
      "倒帶",
      "天空",
      "檸檬草的味道",
      "假裝"
    ],
    "clue": "周杰倫譜曲、方文山作詞，蔡依林最受歡迎的抒情搖滾情歌。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_7",
    "tag": "台灣七年級",
    "title": "看我72變",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=B94n5Lbj4aw",
    "youtubeId": "B94n5Lbj4aw",
    "startTime": 20,
    "duration": 60,
    "options": [
      "看我72變",
      "舞孃",
      "愛情36計",
      "野蠻遊戲"
    ],
    "clue": "「今天的新鮮，改變的季節，美麗極限愛漂亮沒有終點」，蔡依林轉型唱跳天后奠基作。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_8",
    "tag": "台灣七年級",
    "title": "日不落",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=1GA8z-Wliew",
    "youtubeId": "1GA8z-Wliew",
    "startTime": 20,
    "duration": 60,
    "options": [
      "日不落",
      "舞孃",
      "特務J",
      "馬德里不思議"
    ],
    "clue": "「天空的霧來得漫不經心，河水對岸的常春藤爬滿了廊柱」，輕快甜蜜的國民舞曲。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_9",
    "tag": "台灣七年級",
    "title": "Super Star",
    "artist": "S.H.E",
    "youtubeUrl": "https://www.youtube.com/watch?v=gr5fNKK2FaA",
    "youtubeId": "gr5fNKK2FaA",
    "startTime": 25,
    "duration": 60,
    "options": [
      "Super Star",
      "波斯貓",
      "戀人未滿",
      "美麗新世界"
    ],
    "clue": "女子天團 S.H.E 搖滾轉型經典，「你是電，你是光，你是唯一的神話」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_10",
    "tag": "台灣七年級",
    "title": "戀人未滿",
    "artist": "S.H.E",
    "youtubeUrl": "https://www.youtube.com/watch?v=jL6D7rqk4SQ",
    "youtubeId": "jL6D7rqk4SQ",
    "startTime": 25,
    "duration": 60,
    "options": [
      "戀人未滿",
      "熱帶雨林",
      "美麗新世界",
      "Super Star"
    ],
    "clue": "S.H.E 出道第一首成名代表作：「再靠近一點點，就讓你牽手，再勇敢一點點，我就跟你走」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_11",
    "tag": "台灣七年級",
    "title": "我難過",
    "artist": "5566",
    "youtubeUrl": "https://www.youtube.com/watch?v=2l4X4lGP_Zk",
    "youtubeId": "2l4X4lGP_Zk",
    "startTime": 35,
    "duration": 60,
    "options": [
      "我難過",
      "無所謂",
      "挑撥",
      "守候"
    ],
    "clue": "偶像劇《MVP情人》片尾曲，被網友封為台灣七年級「神曲」：「我難過的是，放棄你放棄愛」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_12",
    "tag": "經典台語, 台灣七年級",
    "title": "志明與春嬌",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=5VUUGZ1-nlY",
    "youtubeId": "5VUUGZ1-nlY",
    "startTime": 30,
    "duration": 60,
    "options": [
      "志明與春嬌",
      "軋車",
      "憨人",
      "溫柔"
    ],
    "clue": "「我跟你最好就到這，你對我已經沒感覺」，五月天首張創作專輯掀起全台風潮。",
    "tags": [
      "經典台語",
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_13",
    "tag": "台灣七年級",
    "title": "溫柔",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=nWb_X3ZJQjw",
    "youtubeId": "nWb_X3ZJQjw",
    "startTime": 35,
    "duration": 60,
    "options": [
      "溫柔",
      "擁抱",
      "知足",
      "純真"
    ],
    "clue": "「不知不覺不情不願又到巷子口」，阿信經典口白：「這是我能給你的，最後的溫柔」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_14",
    "tag": "台灣七年級",
    "title": "天黑黑",
    "artist": "孫燕姿",
    "youtubeUrl": "https://www.youtube.com/watch?v=zi8z6RPYGV0",
    "youtubeId": "zi8z6RPYGV0",
    "startTime": 20,
    "duration": 60,
    "options": [
      "天黑黑",
      "我要的幸福",
      "綠光",
      "風箏"
    ],
    "clue": "取樣閩南童謠「天黑黑，要落雨」，孫燕姿出道一鳴驚人奪下金曲最佳新人。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_15",
    "tag": "台灣七年級",
    "title": "綠光",
    "artist": "孫燕姿",
    "youtubeUrl": "https://www.youtube.com/watch?v=pztQtHvZkRc",
    "youtubeId": "pztQtHvZkRc",
    "startTime": 25,
    "duration": 60,
    "options": [
      "綠光",
      "天黑黑",
      "開始懂了",
      "神奇"
    ],
    "clue": "愛爾蘭踢踏舞節奏與輕快饒舌：「期待著一個幸運，和一個衝擊，多麼奇妙的際遇」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_16",
    "tag": "台灣七年級",
    "title": "勇氣",
    "artist": "梁靜茹",
    "youtubeUrl": "https://www.youtube.com/watch?v=nDchQNPuA0k",
    "youtubeId": "nDchQNPuA0k",
    "startTime": 35,
    "duration": 60,
    "options": [
      "勇氣",
      "寧夏",
      "暖暖",
      "會呼吸的痛"
    ],
    "clue": "光良作曲，梁靜茹經典之作：「愛真的需要勇氣，來面對流言蜚語」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_17",
    "tag": "台灣七年級",
    "title": "寧夏",
    "artist": "梁靜茹",
    "youtubeUrl": "https://www.youtube.com/watch?v=MmtVl9CssYE",
    "youtubeId": "MmtVl9CssYE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "寧夏",
      "暖暖",
      "小手拉大手",
      "燕尾蝶"
    ],
    "clue": "「寧靜的夏天，天空中繁星點點」，李正帆詞曲、夏日小清新純樸代表。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_18",
    "tag": "台灣七年級",
    "title": "愛你",
    "artist": "王心凌",
    "youtubeUrl": "https://www.youtube.com/watch?v=NAODcPQcy9U",
    "youtubeId": "NAODcPQcy9U",
    "startTime": 25,
    "duration": 60,
    "options": [
      "愛你",
      "睫毛彎彎",
      "第一次愛的人",
      "Honey"
    ],
    "clue": "甜蜜教主王心凌制服熱舞招牌歌：「Oh baby 情話多說一點，想我就多看一眼」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_19",
    "tag": "台灣七年級",
    "title": "曖昧",
    "artist": "楊丞琳",
    "youtubeUrl": "https://www.youtube.com/watch?v=mebzXfWi87E",
    "youtubeId": "mebzXfWi87E",
    "startTime": 30,
    "duration": 60,
    "options": [
      "曖昧",
      "帶我走",
      "雨愛",
      "過敏"
    ],
    "clue": "偶像劇《惡魔在身邊》片尾曲，「曖昧讓人受盡委屈，找不到相愛的證據」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_20",
    "tag": "台灣七年級",
    "title": "Lydia",
    "artist": "F.I.R. 飛兒樂團",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZOHsd6Zk7DM",
    "youtubeId": "ZOHsd6Zk7DM",
    "startTime": 30,
    "duration": 60,
    "options": [
      "Lydia",
      "我們的愛",
      "Fly Away",
      "千年之戀"
    ],
    "clue": "電視劇《鬥魚》片尾曲，古典弦樂交織狂野搖滾，主唱 Faye 唱腔極具穿透力。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_21",
    "tag": "台灣七年級",
    "title": "安靜",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=1hI-7vj2FhE",
    "youtubeId": "1hI-7vj2FhE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "安靜",
      "晴天",
      "簡單愛",
      "黑色幽默"
    ],
    "clue": "周杰倫《范特西》專輯自作詞曲名作，「希望他是真的比我還要愛你」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_22",
    "tag": "台灣七年級",
    "title": "開不了口",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=H7hpK6cm-6k",
    "youtubeId": "H7hpK6cm-6k",
    "startTime": 15,
    "duration": 60,
    "options": [
      "開不了口",
      "簡單愛",
      "安靜",
      "半島鐵盒"
    ],
    "clue": "「就是開不了口讓她知道，我一定會呵護著你」，抒情R&B巔峰之作。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_23",
    "tag": "台灣七年級",
    "title": "說愛你",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=_Y_mlCbfn_Y",
    "youtubeId": "_Y_mlCbfn_Y",
    "startTime": 15,
    "duration": 60,
    "options": [
      "說愛你",
      "看我72變",
      "倒帶",
      "日不落"
    ],
    "clue": "蔡依林轉型代表作，周杰倫作曲，「我的改變因為你，說愛你」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_24",
    "tag": "台灣七年級",
    "title": "舞孃",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=0EN3MnGEBXk",
    "youtubeId": "0EN3MnGEBXk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "舞孃",
      "看我72變",
      "日不落",
      "Play我呸"
    ],
    "clue": "蔡依林榮獲金曲歌后的動感力作，「旋轉 跳躍 我閉著眼」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_25",
    "tag": "台灣七年級",
    "title": "波斯貓",
    "artist": "S.H.E",
    "youtubeUrl": "https://www.youtube.com/watch?v=wpq30k3cYFY",
    "youtubeId": "wpq30k3cYFY",
    "startTime": 10,
    "duration": 60,
    "options": [
      "波斯貓",
      "Super Star",
      "戀人未滿",
      "美麗新世界"
    ],
    "clue": "融入古典名曲《波斯市場》旋律，S.H.E俏皮活潑的異國風名曲。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_26",
    "tag": "台灣七年級",
    "title": "美麗新世界",
    "artist": "S.H.E",
    "youtubeUrl": "https://www.youtube.com/watch?v=QDiSck_imgw",
    "youtubeId": "QDiSck_imgw",
    "startTime": 15,
    "duration": 60,
    "options": [
      "美麗新世界",
      "Super Star",
      "戀人未滿",
      "熱帶雨林"
    ],
    "clue": "電子舞曲風格，S.H.E唱出對青春未來無限憧憬的美好新世界。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_27",
    "tag": "經典台語, 台灣七年級",
    "title": "憨人",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=1j_mpwKmlJg",
    "youtubeId": "1j_mpwKmlJg",
    "startTime": 20,
    "duration": 60,
    "options": [
      "憨人",
      "志明與春嬌",
      "溫柔",
      "終結孤單"
    ],
    "clue": "五月天台語搖滾精神象徵，「我有我的路，我有我的夢」。",
    "tags": [
      "經典台語",
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_28",
    "tag": "台灣七年級",
    "title": "知足",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=_o0oeyCtoFA",
    "youtubeId": "_o0oeyCtoFA",
    "startTime": 20,
    "duration": 60,
    "options": [
      "知足",
      "溫柔",
      "擁抱",
      "倔強"
    ],
    "clue": "五月天最溫柔真摯的抒情代表作，「怎麼去擁有 一道彩虹」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_29",
    "tag": "台灣七年級",
    "title": "倔強",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=R2s-H_crYkc",
    "youtubeId": "R2s-H_crYkc",
    "startTime": 20,
    "duration": 60,
    "options": [
      "倔強",
      "知足",
      "派對動物",
      "離開地球表面"
    ],
    "clue": "「我和我最後的倔強，握緊雙手絕對不放」，鼓勵無數年輕人的青春神曲。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_30",
    "tag": "台灣七年級",
    "title": "遇見",
    "artist": "孫燕姿",
    "youtubeUrl": "https://www.youtube.com/watch?v=WObbdwgB41c",
    "youtubeId": "WObbdwgB41c",
    "startTime": 15,
    "duration": 60,
    "options": [
      "遇見",
      "天黑黑",
      "綠光",
      "開始懂了"
    ],
    "clue": "幾米繪本改編電影《向左走·向右走》主題曲，孫燕姿傳唱度極高的經典。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_31",
    "tag": "台灣七年級",
    "title": "暖暖",
    "artist": "梁靜茹",
    "youtubeUrl": "https://www.youtube.com/watch?v=0ffLURMclcM",
    "youtubeId": "0ffLURMclcM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "暖暖",
      "勇氣",
      "寧夏",
      "可惜不是你"
    ],
    "clue": "情歌天后梁靜茹溫暖甜蜜名曲，「我想說其實你很好，你自己卻不知道」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_32",
    "tag": "台灣七年級",
    "title": "崇拜",
    "artist": "梁靜茹",
    "youtubeUrl": "https://www.youtube.com/watch?v=KKRqKsjqySI",
    "youtubeId": "KKRqKsjqySI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "崇拜",
      "可惜不是你",
      "情歌",
      "會呼吸的痛"
    ],
    "clue": "「我存在在你的存在」，梁靜茹極富感染力與空靈感的金曲代表作。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_33",
    "tag": "台灣七年級",
    "title": "睫毛彎彎",
    "artist": "王心凌",
    "youtubeUrl": "https://www.youtube.com/watch?v=FzKO6WZN5b4",
    "youtubeId": "FzKO6WZN5b4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "睫毛彎彎",
      "愛你",
      "第一次愛的人",
      "當你"
    ],
    "clue": "甜蜜教主王心凌結合東方笛聲與舞曲節奏的超洗腦名曲。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_34",
    "tag": "台灣七年級",
    "title": "雨愛",
    "artist": "楊丞琳",
    "youtubeUrl": "https://www.youtube.com/watch?v=oec9R5ypf-o",
    "youtubeId": "oec9R5ypf-o",
    "startTime": 20,
    "duration": 60,
    "options": [
      "雨愛",
      "曖昧",
      "理想情人",
      "帶我走"
    ],
    "clue": "偶像劇《海派甜心》片尾曲，「雨愛的秘密，能一直延續」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_35",
    "tag": "台灣七年級",
    "title": "我們的愛",
    "artist": "飛兒樂團 F.I.R.",
    "youtubeUrl": "https://www.youtube.com/watch?v=88D2-J_pk7A",
    "youtubeId": "88D2-J_pk7A",
    "startTime": 20,
    "duration": 60,
    "options": [
      "我們的愛",
      "Lydia",
      "千年之戀",
      "月牙灣"
    ],
    "clue": "F.I.R.同名出道專輯超強抒情名作，「我們的愛，過了就不再回來」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_36",
    "tag": "台灣七年級",
    "title": "愛的主打歌",
    "artist": "蕭亞軒",
    "youtubeUrl": "https://www.youtube.com/watch?v=EHMm_ElRvMA",
    "youtubeId": "EHMm_ElRvMA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "愛的主打歌",
      "最熟悉的陌生人",
      "Cappuccino",
      "表白"
    ],
    "clue": "亞洲舞曲天后蕭亞軒唱跳代表作，「我在唱什麼，什麼都覺得，你在看著我」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_37",
    "tag": "台灣七年級",
    "title": "精舞門",
    "artist": "羅志祥",
    "youtubeUrl": "https://www.youtube.com/watch?v=3WAgjt-cDQg",
    "youtubeId": "3WAgjt-cDQg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "精舞門",
      "愛轉角",
      "鬧翻天",
      "愛投羅網"
    ],
    "clue": "亞洲舞王羅志祥經典椅子舞代表作，「I wanna know 你行不行」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_38",
    "tag": "台灣七年級",
    "title": "放手",
    "artist": "Energy",
    "youtubeUrl": "https://www.youtube.com/watch?v=v-9IGzCMNks",
    "youtubeId": "v-9IGzCMNks",
    "startTime": 15,
    "duration": 60,
    "options": [
      "放手",
      "多愛我一天",
      "Come On",
      "某年某月某一天"
    ],
    "clue": "台灣最殺唱跳男團 Energy 超經典成名作，「都跟我無關，全部都放手」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_39",
    "tag": "台灣七年級",
    "title": "麻吉",
    "artist": "麻吉 MACHI",
    "youtubeUrl": "https://www.youtube.com/watch?v=mCtF2pQSZuQ",
    "youtubeId": "mCtF2pQSZuQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "麻吉",
      "Jump 2003",
      "爽",
      "甜蜜蜜"
    ],
    "clue": "黃立成帶領的 MACHI 嘻哈饒舌名曲，「我們是麻吉，你是我的兄弟」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade7_40",
    "tag": "台灣七年級",
    "title": "童話",
    "artist": "光良",
    "youtubeUrl": "https://www.youtube.com/watch?v=bBcp_ljCBGU",
    "youtubeId": "bBcp_ljCBGU",
    "startTime": 20,
    "duration": 60,
    "options": [
      "童話",
      "第一次",
      "約定",
      "勇氣"
    ],
    "clue": "光良紅遍全球華人圈的鋼琴抒情神曲，「我願變成童話裡，你愛的那個天使」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "夜曲",
    "artist": "周杰倫",
    "youtubeId": "6Q0Pd53mojY",
    "options": [
      "夜曲",
      "晴天",
      "青花瓷",
      "以父之名"
    ],
    "clue": "周杰倫十一月的蕭邦主打歌，「為你彈奏蕭邦的夜曲，紀念我死去的愛情……」，橫掃金曲獎。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "千里之外",
    "artist": "周杰倫、費玉清",
    "youtubeId": "ocDo3ySyHSI",
    "options": [
      "千里之外",
      "青花瓷",
      "菊花台",
      "髮如雪"
    ],
    "clue": "周杰倫與美聲天王費玉清破天荒跨世代合作，中國風對唱的不朽傳奇。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "聽媽媽的話",
    "artist": "周杰倫",
    "youtubeId": "_B8RaLCNUZw",
    "options": [
      "聽媽媽的話",
      "稻香",
      "安靜",
      "爺爺泡的茶"
    ],
    "clue": "溫暖勵志自傳式創作，「聽媽媽的話，別讓她受傷，想快快長大，才能保護她……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "曹操",
    "artist": "林俊傑",
    "youtubeId": "3J_bkgexrE8",
    "options": [
      "曹操",
      "江南",
      "一千年以後",
      "醉赤壁"
    ],
    "clue": "林俊傑融合搖滾與中國歷史題材，「東漢末年分三國，烽火連天不休……」，氣勢磅礡。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "江南",
    "artist": "林俊傑",
    "youtubeId": "G97_rOdHcnY",
    "options": [
      "江南",
      "一千年以後",
      "曹操",
      "小酒窩"
    ],
    "clue": "林俊傑成名經典，「圈圈圓圓圈圈，天天年年天天的一生……」，紅遍大江南北。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "一千年以後",
    "artist": "林俊傑",
    "youtubeId": "m0z1XfphYzU",
    "options": [
      "一千年以後",
      "江南",
      "修煉愛情",
      "那些你很冒險的夢"
    ],
    "clue": "科幻時空穿梭情歌，「放任在千年以後，別生動，讓命運的籤決定我們走……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "小酒窩",
    "artist": "林俊傑、蔡卓妍",
    "youtubeId": "h-woMj_Vt0A",
    "options": [
      "小酒窩",
      "江南",
      "被風吹過的夏天",
      "背對背擁抱"
    ],
    "clue": "男女合唱超甜經典，「小酒窩長睫毛，是你最美的記號，我每天睡不著想念你的微笑……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "熱帶雨林",
    "artist": "S.H.E",
    "youtubeId": "M5Y9dandexU",
    "options": [
      "熱帶雨林",
      "Super Star",
      "戀人未滿",
      "美麗新世界"
    ],
    "clue": "周杰倫作曲、方文山作詞，S.H.E三人完美和聲詮釋深情異國風情歌。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "不想長大",
    "artist": "S.H.E",
    "youtubeId": "KV17QLB2BJs",
    "options": [
      "不想長大",
      "Super Star",
      "波斯貓",
      "中國話"
    ],
    "clue": "巧妙取樣莫札特第40號交響曲開頭旋律，「我不想我不想不想長大，長大後世界就沒童話……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "開始懂了",
    "artist": "孫燕姿",
    "youtubeId": "h5eRbbOnPRc",
    "options": [
      "開始懂了",
      "天黑黑",
      "綠光",
      "遇見"
    ],
    "clue": "李偲菘作曲、姚若龍作詞，「用心酸微笑去原諒了，也翻越了，有昨天還是好的……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "逆光",
    "artist": "孫燕姿",
    "youtubeId": "JCqJcK3v4q0",
    "options": [
      "逆光",
      "遇見",
      "我懷念的",
      "奔"
    ],
    "clue": "赴埃及拍攝MV引發全台關注，「有一道光，如此獨特，照亮了所有雙眼的清澈……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "我懷念的",
    "artist": "孫燕姿",
    "youtubeId": "GSx8Olkop50",
    "options": [
      "我懷念的",
      "開始懂了",
      "逆光",
      "同類"
    ],
    "clue": "姚若龍作詞、李偲菘作曲，「我懷念的是無話不說，我懷念的是一起做夢……」，KTV必點淚崩神曲。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "假裝",
    "artist": "蔡依林",
    "youtubeId": "_34cgR4oUw4",
    "options": [
      "假裝",
      "倒帶",
      "說愛你",
      "天空"
    ],
    "clue": "蔡依林唯美抒情慢歌，「假裝我們還在戀愛，假裝你還在身邊……」，刻劃放不下的依戀。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "可惜不是你",
    "artist": "梁靜茹",
    "youtubeId": "k_l7FVsqUyM",
    "options": [
      "可惜不是你",
      "勇氣",
      "暖暖",
      "會呼吸的痛"
    ],
    "clue": "情歌天后梁靜茹催淚金曲，「可惜不是你，陪我到最後，曾一起走卻走失那路口……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "小手拉大手",
    "artist": "梁靜茹",
    "youtubeId": "5wq_uTMW0v8",
    "options": [
      "小手拉大手",
      "暖暖",
      "寧夏",
      "親親"
    ],
    "clue": "改編自吉卜力動畫《貓的報恩》主題曲，烏克麗麗輕快彈奏，甜蜜滿分。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "會呼吸的痛",
    "artist": "梁靜茹",
    "youtubeId": "dLF12O_6YiI",
    "options": [
      "會呼吸的痛",
      "可惜不是你",
      "崇拜",
      "問"
    ],
    "clue": "姚若龍作詞、宇珩作曲，「想念是會呼吸的痛，它活在我身上所有角落……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "當你",
    "artist": "王心凌",
    "youtubeId": "Es2b6sM2nrs",
    "options": [
      "當你",
      "愛你",
      "睫毛彎彎",
      "第一次愛的人"
    ],
    "clue": "林俊傑作曲，王心凌出道代表作，「當你的眼睛瞇著笑，當你喝可樂當你吵……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "帶我走",
    "artist": "楊丞琳",
    "youtubeId": "KOLDiXnQC7Q",
    "options": [
      "帶我走",
      "曖昧",
      "雨愛",
      "匿名的好友"
    ],
    "clue": "蘇打綠青峰詞曲創作，偶像劇《不良笑花》片尾曲，「帶我走，到遙遠的以後……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "愛很簡單",
    "artist": "陶喆",
    "youtubeId": "lhtaCBSL9AE",
    "options": [
      "愛很簡單",
      "普通朋友",
      "黑色柳丁",
      "天天"
    ],
    "clue": "華語R&B教父陶喆首張同名專輯名曲，「I love you 一直在這裡，在陪伴著你……」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "tag": "台灣七年級",
    "title": "普通朋友",
    "artist": "陶喆",
    "youtubeId": "3L3Me4JXVqE",
    "options": [
      "普通朋友",
      "愛很簡單",
      "沙灘",
      "小鎮姑娘"
    ],
    "clue": "以精湛尼龍吉他前奏切入，「等待，我隨時隨地在等待……我只想做你的男人」。",
    "tags": [
      "台灣七年級"
    ]
  },
  {
    "id": "tw_grade8_1",
    "tag": "台灣八年級",
    "title": "如果可以",
    "artist": "韋禮安",
    "youtubeUrl": "https://www.youtube.com/watch?v=8MG--WuNW1Y",
    "youtubeId": "8MG--WuNW1Y",
    "startTime": 35,
    "duration": 60,
    "options": [
      "如果可以",
      "還是會",
      "女孩",
      "那些年"
    ],
    "clue": "奇幻愛情電影《月老》主題曲：「如果可以我想和你回到那天相遇」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_2",
    "tag": "台灣八年級",
    "title": "那些年",
    "artist": "胡夏",
    "youtubeUrl": "https://www.youtube.com/watch?v=KqjgLbKZ1h0",
    "youtubeId": "KqjgLbKZ1h0",
    "startTime": 35,
    "duration": 60,
    "options": [
      "那些年",
      "小幸運",
      "刻在我心底的名字",
      "修煉愛情"
    ],
    "clue": "九把刀青春愛情電影《那些年，我們一起追的女孩》同名主題曲。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_3",
    "tag": "台灣八年級",
    "title": "小幸運",
    "artist": "田馥甄",
    "youtubeUrl": "https://www.youtube.com/watch?v=HDMQuMJ4MSk",
    "youtubeId": "HDMQuMJ4MSk",
    "startTime": 40,
    "duration": 60,
    "options": [
      "小幸運",
      "那些年",
      "愛情怎麼了",
      "刻在我心底的名字"
    ],
    "clue": "校園愛情電影《我的少女時代》主題曲：「與你相遇好幸運」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_4",
    "tag": "台灣八年級",
    "title": "刻在我心底的名字",
    "artist": "盧廣仲",
    "youtubeUrl": "https://www.youtube.com/watch?v=m78lJuzftcc",
    "youtubeId": "m78lJuzftcc",
    "startTime": 35,
    "duration": 60,
    "options": [
      "刻在我心底的名字",
      "魚仔",
      "幾分之幾",
      "那些年"
    ],
    "clue": "電影《刻在你心底的名字》主題曲，榮獲第57屆金馬獎最佳原創電影歌曲。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_5",
    "tag": "台灣八年級",
    "title": "光年之外",
    "artist": "鄧紫棋",
    "youtubeUrl": "https://www.youtube.com/watch?v=T4SimnaiktU",
    "youtubeId": "T4SimnaiktU",
    "startTime": 30,
    "duration": 60,
    "options": [
      "光年之外",
      "泡沫",
      "倒數",
      "再見"
    ],
    "clue": "電影《太空潛航者》中文主題曲，YouTube破2.7億觀看人次的史詩情歌。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_6",
    "tag": "台灣八年級",
    "title": "以後別做朋友",
    "artist": "周興哲",
    "youtubeUrl": "https://www.youtube.com/watch?v=Ew4VvF0DPMc",
    "youtubeId": "Ew4VvF0DPMc",
    "startTime": 35,
    "duration": 60,
    "options": [
      "以後別做朋友",
      "怎麼了",
      "你，好不好？",
      "如果雨之後"
    ],
    "clue": "電視劇《16個夏天》片尾曲，「以後別做朋友，朋友不能牽手」，情歌王子成名曲。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_7",
    "tag": "台灣八年級",
    "title": "怎麼了",
    "artist": "周興哲",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y2ge3KrdeWs",
    "youtubeId": "Y2ge3KrdeWs",
    "startTime": 35,
    "duration": 60,
    "options": [
      "怎麼了",
      "以後別做朋友",
      "如果雨之後",
      "如果可以"
    ],
    "clue": "「你說藍色是你最愛的顏色，你說如果沒有愛整個人生都黑了」，傳唱全網。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_8",
    "tag": "台灣八年級",
    "title": "披星戴月的想你",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=VpwAq7hiij0",
    "youtubeId": "VpwAq7hiij0",
    "startTime": 30,
    "duration": 60,
    "options": [
      "披星戴月的想你",
      "愛人錯過",
      "在這座城市遺失了你",
      "好不容易"
    ],
    "clue": "「我會披星戴月的想你，我會奮不顧身地前進」，新世代樂團告五人成名作。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_9",
    "tag": "台灣八年級",
    "title": "愛人錯過",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=6D79CYTxvOM",
    "youtubeId": "6D79CYTxvOM",
    "startTime": 30,
    "duration": 60,
    "options": [
      "愛人錯過",
      "披星戴月的想你",
      "帶我去找夜生活",
      "紅"
    ],
    "clue": "「你瞧你，撞到我，也不道歉」，洗腦旋律在各社群短影音掀起翻唱熱潮。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_10",
    "tag": "經典台語, 台灣八年級",
    "title": "浪子回頭",
    "artist": "茄子蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=x3bDhtuC5yk",
    "youtubeId": "x3bDhtuC5yk",
    "startTime": 30,
    "duration": 60,
    "options": [
      "浪子回頭",
      "浪流連",
      "愛情你比我想的閣較偉大",
      "日常"
    ],
    "clue": "「菸一支一支一支地點，酒一杯一杯一杯地乾」，新台語獨立搖滾現象級神曲。",
    "tags": [
      "經典台語",
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_11",
    "tag": "經典台語, 台灣八年級",
    "title": "愛情你比我想的閣較偉大",
    "artist": "茄子蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=0rp3pP2Xwhs",
    "youtubeId": "0rp3pP2Xwhs",
    "startTime": 20,
    "duration": 60,
    "options": [
      "愛情你比我想的閣較偉大",
      "浪子回頭",
      "浪流連",
      "這款自作多情"
    ],
    "clue": "電影《當男人戀愛時》主題曲，「愛你愛甲白目眉」，節奏熱血直白。",
    "tags": [
      "經典台語",
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_12",
    "tag": "台灣八年級",
    "title": "Without You",
    "artist": "高爾宣 OSN",
    "youtubeUrl": "https://www.youtube.com/watch?v=HQDDlgGy2hg",
    "youtubeId": "HQDDlgGy2hg",
    "startTime": 25,
    "duration": 60,
    "options": [
      "Without You",
      "So Boy",
      "Old Me",
      "Why You Gonna Lie"
    ],
    "clue": "嘻哈饒舌新生代高爾宣爆紅之作：「I can't live without you, baby」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_13",
    "tag": "台灣八年級",
    "title": "幹大事",
    "artist": "頑童MJ116",
    "youtubeUrl": "https://www.youtube.com/watch?v=COS0pHrCi0k",
    "youtubeId": "COS0pHrCi0k",
    "startTime": 20,
    "duration": 60,
    "options": [
      "幹大事",
      "辣台妹",
      "走跳",
      "少年董"
    ],
    "clue": "「我們這是頑童你知道的，幹大事我幹大的」，華語嘻哈天團震撼現場的派對國歌。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_14",
    "tag": "台灣八年級",
    "title": "癡情的男子漢",
    "artist": "玖壹壹",
    "youtubeUrl": "https://www.youtube.com/watch?v=UdnSKw0wI8I",
    "youtubeId": "UdnSKw0wI8I",
    "startTime": 20,
    "duration": 60,
    "options": [
      "癡情的男子漢",
      "打鐵",
      "9453",
      "下輩子"
    ],
    "clue": "本土天團玖壹壹接地氣洗腦歌：「我是愛你愛你愛到不怕死，代誌要按怎處理」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_15",
    "tag": "台灣八年級",
    "title": "想見你想見你想見你",
    "artist": "八三夭 831",
    "youtubeUrl": "https://www.youtube.com/watch?v=4iRupuNet3Q",
    "youtubeId": "4iRupuNet3Q",
    "startTime": 35,
    "duration": 60,
    "options": [
      "想見你想見你想見你",
      "最後的8/31",
      "東區東區",
      "致青春"
    ],
    "clue": "奇幻穿越愛情神劇《想見你》片尾曲，「想見你，只想見你，未來過去，我只想見你」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_16",
    "tag": "台灣八年級",
    "title": "行星",
    "artist": "理想混蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=Zn8M6mcGNoo",
    "youtubeId": "Zn8M6mcGNoo",
    "startTime": 25,
    "duration": 60,
    "options": [
      "行星",
      "不是因為天氣晴朗才愛你",
      "愚者",
      "滯留鋒"
    ],
    "clue": "新銳獨立民謠樂團療癒之作：「沒關係，我就這樣遠遠看著你，在軌道裡默默守護你」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_17",
    "tag": "台灣八年級",
    "title": "告白氣球",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=bu7nU9Mhpyo",
    "youtubeId": "bu7nU9Mhpyo",
    "startTime": 20,
    "duration": 60,
    "options": [
      "告白氣球",
      "等你下課",
      "說好不哭",
      "簡單愛"
    ],
    "clue": "「塞納河畔左岸的咖啡，我手一杯品嚐你的美」，甜蜜輕快代表作。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_18",
    "tag": "台灣八年級",
    "title": "少年",
    "artist": "夢然",
    "youtubeUrl": "https://www.youtube.com/watch?v=efKva-XmV48",
    "youtubeId": "efKva-XmV48",
    "startTime": 25,
    "duration": 60,
    "options": [
      "少年",
      "飛鳥和蟬",
      "白月光與硃砂痣",
      "踏山河"
    ],
    "clue": "熱門正能量神曲：「我還是從前那個少年，沒有一點點改變」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_19",
    "tag": "台灣八年級",
    "title": "飛鳥和蟬",
    "artist": "任然",
    "youtubeUrl": "https://www.youtube.com/watch?v=Sdh16YlinNE",
    "youtubeId": "Sdh16YlinNE",
    "startTime": 30,
    "duration": 60,
    "options": [
      "飛鳥和蟬",
      "空空如也",
      "涼城",
      "疑心病"
    ],
    "clue": "「你飛到哪片天，去尋找下一處歇腳的樹枝」，風靡網路的抒情曲。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_20",
    "tag": "台灣八年級",
    "title": "是什麼讓我遇見這樣的你",
    "artist": "白安",
    "youtubeUrl": "https://www.youtube.com/watch?v=aVmZpcrQBU4",
    "youtubeId": "aVmZpcrQBU4",
    "startTime": 20,
    "duration": 60,
    "options": [
      "是什麼讓我遇見這樣的你",
      "麥田捕手",
      "我只想在乎我在乎的",
      "安慰"
    ],
    "clue": "白安獨特咬字與清新唱腔：「是什麼讓我遇見這樣的你，是什麼讓我不再懷疑自己」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_21",
    "tag": "台灣八年級",
    "title": "還是會",
    "artist": "韋禮安",
    "youtubeUrl": "https://www.youtube.com/watch?v=eGNqW9sybyU",
    "youtubeId": "eGNqW9sybyU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "還是會",
      "如果可以",
      "女孩",
      "因為愛"
    ],
    "clue": "偶像劇《我可能不會愛你》插曲，韋禮安陽光清新的抒情代表。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_22",
    "tag": "台灣八年級",
    "title": "女孩",
    "artist": "韋禮安",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZPALMaXLfIw",
    "youtubeId": "ZPALMaXLfIw",
    "startTime": 15,
    "duration": 60,
    "options": [
      "女孩",
      "如果可以",
      "還是會",
      "慢慢等"
    ],
    "clue": "韋禮安輕快洗腦的浪漫放閃神曲，「女孩，我的故事因為你而展開」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_23",
    "tag": "台灣八年級",
    "title": "魚仔",
    "artist": "盧廣仲",
    "youtubeUrl": "https://www.youtube.com/watch?v=ybfWYpYhTQQ",
    "youtubeId": "ybfWYpYhTQQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "魚仔",
      "刻在我心底的名字",
      "幾分之幾",
      "早安晨之美"
    ],
    "clue": "電視劇《花甲男孩轉大人》主題曲，榮獲金曲獎年度歌曲與最佳作曲人獎。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_24",
    "tag": "台灣八年級",
    "title": "魔鬼中的天使",
    "artist": "田馥甄",
    "youtubeUrl": "https://www.youtube.com/watch?v=na_xv5iFt2Y",
    "youtubeId": "na_xv5iFt2Y",
    "startTime": 15,
    "duration": 60,
    "options": [
      "魔鬼中的天使",
      "小幸運",
      "寂寞寂寞就好",
      "你就不要想起我"
    ],
    "clue": "田馥甄冷豔空靈嗓音演繹愛情的糾葛與矛盾。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_25",
    "tag": "台灣八年級",
    "title": "不醉不會",
    "artist": "田馥甄",
    "youtubeUrl": "https://www.youtube.com/watch?v=7gQxgKaiPzk",
    "youtubeId": "7gQxgKaiPzk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "不醉不會",
      "小幸運",
      "愛著愛著就永遠",
      "日常"
    ],
    "clue": "陳珊妮詞曲創作，微醺迷幻風格的流行金曲。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_26",
    "tag": "台灣八年級",
    "title": "泡沫",
    "artist": "鄧紫棋",
    "youtubeUrl": "https://www.youtube.com/watch?v=CQEXldyfGGM",
    "youtubeId": "CQEXldyfGGM",
    "startTime": 20,
    "duration": 60,
    "options": [
      "泡沫",
      "光年之外",
      "來自天堂的魔鬼",
      "句號"
    ],
    "clue": "鄧紫棋於《我是歌手》震撼全場的成名抒情史詩名作。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_27",
    "tag": "台灣八年級",
    "title": "你，好不好？",
    "artist": "周興哲",
    "youtubeUrl": "https://www.youtube.com/watch?v=wSBXfzgqHtE",
    "youtubeId": "wSBXfzgqHtE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "你，好不好？",
      "以後別做朋友",
      "怎麼了",
      "如果雨之後"
    ],
    "clue": "周興哲破億觀看次數的經典抒情情歌，「能不能繼續，對我哭對我笑對我好」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_28",
    "tag": "台灣八年級",
    "title": "在這座城市遺失了你",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=fiDZGZMN9wE",
    "youtubeId": "fiDZGZMN9wE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "在這座城市遺失了你",
      "披星戴月的想你",
      "愛人錯過",
      "好不容易"
    ],
    "clue": "告五人收錄於《運氣來得若有似無》，痛徹心扉的失戀城市謳歌。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_29",
    "tag": "台灣八年級",
    "title": "日常與浪漫",
    "artist": "茄子蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=_vGN_dFtAQI",
    "youtubeId": "_vGN_dFtAQI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "日常與浪漫",
      "浪子回頭",
      "浪流連",
      "這款自作多情"
    ],
    "clue": "茄子蛋樂團以濃郁台味搖滾唱出小人物的浪漫。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_30",
    "tag": "台灣八年級",
    "title": "So Bad",
    "artist": "高爾宣",
    "youtubeUrl": "https://www.youtube.com/watch?v=kTNNPbVFNHQ",
    "youtubeId": "kTNNPbVFNHQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "So Bad",
      "Without You",
      "最後一次",
      "Benz Booty"
    ],
    "clue": "高爾宣 OSN 抓耳旋律與真摯說唱交織的千禧嘻哈佳作。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_31",
    "tag": "台灣八年級",
    "title": "辣台妹",
    "artist": "頑童MJ116",
    "youtubeUrl": "https://www.youtube.com/watch?v=zJx6v_APhWA",
    "youtubeId": "zJx6v_APhWA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "辣台妹",
      "幹大事",
      "少年董",
      "走跳"
    ],
    "clue": "頑童MJ116風靡全台各大夜店與派對的熱門嘻哈代表作。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_32",
    "tag": "台灣八年級",
    "title": "下輩子",
    "artist": "玖壹壹",
    "youtubeUrl": "https://www.youtube.com/watch?v=f2u9F-IT9wY",
    "youtubeId": "f2u9F-IT9wY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "下輩子",
      "癡情的男子漢",
      "打鐵",
      "9453"
    ],
    "clue": "台客電音嘻哈天團玖壹壹深情真摯的台語抒情神曲。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_33",
    "tag": "台灣八年級",
    "title": "東區東區",
    "artist": "八三夭",
    "youtubeUrl": "https://www.youtube.com/watch?v=qVKLNfbpCZ0",
    "youtubeId": "qVKLNfbpCZ0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "東區東區",
      "想見你想見你想見你",
      "最後的831",
      "致青春"
    ],
    "clue": "八三夭熱血狂歡的搖滾舞曲，台北東區派對標誌性神曲。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_34",
    "tag": "經典台語, 台灣八年級",
    "title": "島嶼天光",
    "artist": "滅火器",
    "youtubeUrl": "https://www.youtube.com/watch?v=iV8JDbtXZm4",
    "youtubeId": "iV8JDbtXZm4",
    "startTime": 20,
    "duration": 60,
    "options": [
      "島嶼天光",
      "長途夜車",
      "海上的人",
      "晚安台灣"
    ],
    "clue": "滅火器樂團榮獲第26屆金曲獎最佳年度歌曲的時代之歌。",
    "tags": [
      "經典台語",
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_35",
    "tag": "台灣八年級",
    "title": "指望",
    "artist": "郁可唯",
    "youtubeUrl": "https://www.youtube.com/watch?v=04VXfavbeDs",
    "youtubeId": "04VXfavbeDs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "指望",
      "時間煮雨",
      "路過人間",
      "遠方"
    ],
    "clue": "偶像劇《犀利人妻》插曲，「怕後悔的那麼倔強，怕面對的那麼絕望」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_36",
    "tag": "台灣八年級",
    "title": "燃點",
    "artist": "胡夏",
    "youtubeUrl": "https://www.youtube.com/watch?v=aNFCc2Y3g_A",
    "youtubeId": "aNFCc2Y3g_A",
    "startTime": 15,
    "duration": 60,
    "options": [
      "燃點",
      "那些年",
      "愛夏",
      "知否知否"
    ],
    "clue": "胡夏清澈深情的嗓音，「點燃你給我的所有溫暖」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_37",
    "tag": "台灣八年級",
    "title": "我有我自己",
    "artist": "閻奕格",
    "youtubeUrl": "https://www.youtube.com/watch?v=TZLzLR2PwP4",
    "youtubeId": "TZLzLR2PwP4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我有我自己",
      "也可以",
      "愛上現在的我",
      "讓一切重來"
    ],
    "clue": "閻奕格沉潛多年後重新出發的堅定自我宣言。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_38",
    "tag": "台灣八年級",
    "title": "Forever Young",
    "artist": "艾怡良",
    "youtubeUrl": "https://www.youtube.com/watch?v=rFj6azCUYrU",
    "youtubeId": "rFj6azCUYrU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Forever Young",
      "寂寞無害",
      "玻璃心",
      "我不知道愛是什麼"
    ],
    "clue": "艾怡良作詞作曲，榮獲金曲獎最佳作曲人獎的深情之作。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_39",
    "tag": "台灣八年級",
    "title": "孤獨的總和",
    "artist": "吳汶芳",
    "youtubeUrl": "https://www.youtube.com/watch?v=90xQdZ4WmLA",
    "youtubeId": "90xQdZ4WmLA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "孤獨的總和",
      "不讀不回",
      "心之所向",
      "我何必"
    ],
    "clue": "吳汶芳自彈自唱成名曲，「如果我不曾走過這一遍，生命中還有多少苦和甜」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade8_40",
    "tag": "台灣八年級",
    "title": "藍色的你",
    "artist": "宇宙人",
    "youtubeUrl": "https://www.youtube.com/watch?v=nL_VoX0ZR0E",
    "youtubeId": "nL_VoX0ZR0E",
    "startTime": 15,
    "duration": 60,
    "options": [
      "藍色的你",
      "如果我們還在一起",
      "那你呢",
      "一起去跑步"
    ],
    "clue": "宇宙人樂團療癒系海洋風金曲，榮獲金曲獎最佳樂團獎之作。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "句號",
    "artist": "鄧紫棋 G.E.M.",
    "youtubeId": "7XlqcS6B7WA",
    "options": [
      "句號",
      "光年之外",
      "倒數",
      "來自天堂的魔鬼"
    ],
    "clue": "鄧紫棋自立門戶後的深情告別力作，「可惜我們終於來到一個句號……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "倒數",
    "artist": "鄧紫棋 G.E.M.",
    "youtubeId": "ma7r2HGqwXs",
    "options": [
      "倒數",
      "句號",
      "泡沫",
      "光年之外"
    ],
    "clue": "抒情搖滾節奏，「時針一直倒數著，我們還剩多少時間……」，YouTube破億神曲。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "來自天堂的魔鬼",
    "artist": "鄧紫棋 G.E.M.",
    "youtubeId": "FWtbGkpdoP4",
    "options": [
      "來自天堂的魔鬼",
      "光年之外",
      "倒數",
      "差不多姑娘"
    ],
    "clue": "電音與流行搖滾完美碰撞，「如果你是蛇的誘惑，你存心讓我墮落……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "如果雨之後",
    "artist": "周興哲",
    "youtubeId": "gdGdO6KjF1I",
    "options": [
      "如果雨之後",
      "以後別做朋友",
      "怎麼了",
      "永不失聯的愛"
    ],
    "clue": "周興哲招牌深情情歌，「如果雨之後，淚還不停流，如果悲傷後，笑容算什麼……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "永不失聯的愛",
    "artist": "周興哲",
    "youtubeId": "WJK8486VjfU",
    "options": [
      "永不失聯的愛",
      "以後別做朋友",
      "你，好不好？",
      "怎麼了"
    ],
    "clue": "饒雪漫作詞，「你是我這一生都不想失聯的愛，何苦殘忍逼我把手放開……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "慢慢等",
    "artist": "韋禮安",
    "youtubeId": "smaCyk6HIuA",
    "options": [
      "慢慢等",
      "女孩",
      "還是會",
      "如果可以"
    ],
    "clue": "韋禮安校園時期成名作，「你留下的痕跡，指引我的世界，慢慢等，等紅燈變綠燈……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "狼",
    "artist": "韋禮安",
    "youtubeId": "C7TNXR0Vfv8",
    "options": [
      "狼",
      "女孩",
      "如果可以",
      "有人在等我"
    ],
    "clue": "顛覆以往民謠才子形象的暗黑搖滾之作，探討人性恐懼與原始慾望。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "寂寞寂寞就好",
    "artist": "田馥甄",
    "youtubeId": "DyFIzKYQQYE",
    "options": [
      "寂寞寂寞就好",
      "小幸運",
      "你就不要想起我",
      "魔鬼中的天使"
    ],
    "clue": "施人誠作詞、楊子樸作曲，「我寂寞寂寞就好，這時候誰都別來安慰擁抱……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "你就不要想起我",
    "artist": "田馥甄",
    "youtubeId": "GsKbnsUN2RE",
    "options": [
      "你就不要想起我",
      "寂寞寂寞就好",
      "不醉不會",
      "魔鬼中的天使"
    ],
    "clue": "田馥甄虐心抒情天花板，「你就不要想起我，到時候你就知道有多痛……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "懸日",
    "artist": "田馥甄",
    "youtubeId": "Nf1C1fSJG_8",
    "options": [
      "懸日",
      "無人知曉",
      "皆可",
      "或是一首歌"
    ],
    "clue": "葛大為作詞、知更作曲，「落下懸日，想念你的身影……」，獲得金曲獎最佳女歌手。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "經典台語, 台灣八年級",
    "title": "浪流連",
    "artist": "茄子蛋",
    "youtubeId": "3Y0Ut5ozaKs",
    "options": [
      "浪流連",
      "浪子回頭",
      "愛情你比我想的閣較偉大",
      "日常與浪漫"
    ],
    "clue": "高捷主演MV，「這個世界冷得像冰塊，我也想做個正常人……」，台語浪子情懷。",
    "tags": [
      "經典台語",
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "聞一聞",
    "artist": "茄子蛋",
    "youtubeId": "UXHTGeGkZwU",
    "options": [
      "親愛的無情孫小美",
      "浪子回頭",
      "浪流連",
      "這款自作多情"
    ],
    "clue": "茄子蛋充滿幽默與草根藍調搖滾的名作，呈現台灣在地樂團生猛生命力。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "幾分之幾",
    "artist": "盧廣仲",
    "youtubeId": "HQ_mU73VhEQ",
    "options": [
      "幾分之幾",
      "魚仔",
      "100種生活",
      "刻在我心底的名字"
    ],
    "clue": "電影《花甲大人轉男孩》主題曲，「那一天，那一刻，那個場景，你是我的幾分之幾……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "100種生活",
    "artist": "盧廣仲",
    "youtubeId": "nPcByqGfxQo",
    "options": [
      "100種生活",
      "早安，晨之美！",
      "魚仔",
      "我愛你"
    ],
    "clue": "盧廣仲首張專輯同名成名曲，「每個人都有100種生活，要過怎樣的生活……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "李白",
    "artist": "李榮浩",
    "youtubeId": "1II_6o7uv1g",
    "options": [
      "李白",
      "模特",
      "年少有為",
      "烏梅子醬"
    ],
    "clue": "李榮浩橫空出世代表作，「要是能重來，我要選李白，至少我還能寫寫詩來澎湃逗逗女孩……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "喜劇之王",
    "artist": "李榮浩",
    "youtubeId": "ijLLmE_sFkY",
    "options": [
      "喜劇之王",
      "李白",
      "年少有為",
      "不將就"
    ],
    "clue": "黃偉文填詞，「為甚麼要對我這麼好，讓我像個演員一樣微笑……」，致敬周星馳。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "烏梅子醬",
    "artist": "李榮浩",
    "youtubeId": "IKMaaO9QtKw",
    "options": [
      "烏梅子醬",
      "李白",
      "年少有為",
      "麻雀"
    ],
    "clue": "短影音平台超級洗腦神曲，「你淺淺的微笑就像烏梅子醬，我嚐了你嘴角唇膏薄荷味道……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "打鐵",
    "artist": "玖壹壹",
    "youtubeId": "oeM_82nqaH8",
    "options": [
      "打鐵",
      "9453",
      "癡情的男子漢",
      "下輩子"
    ],
    "clue": "夜店與廟會動感神曲，「今晚跟我一起打鐵，不管你是男生女生一起跳……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "最後的831",
    "artist": "八三夭",
    "youtubeId": "ILVlVWle8m0",
    "options": [
      "最後的831",
      "想見你想見你想見你",
      "東區東區",
      "致青春"
    ],
    "clue": "八三夭熱血龐克搖滾畢業名曲，「熱血的夏天，最後的831，我不怕跌倒……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "tag": "台灣八年級",
    "title": "我還年輕 我還年輕",
    "artist": "老王樂隊",
    "youtubeId": "oCQnAxrkTUc",
    "options": [
      "我還年輕 我還年輕",
      "島嶼天光",
      "浪子回頭",
      "山海"
    ],
    "clue": "獨立樂團現象級厭世金曲，「給我一瓶酒，再給我一支菸，說走就走，我有的是時間……」。",
    "tags": [
      "台灣八年級"
    ]
  },
  {
    "id": "tw_grade9_1",
    "tag": "台灣九年級",
    "title": "不是因為天氣晴朗才愛你",
    "artist": "理想混蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=9_068Ekk_fs",
    "youtubeId": "9_068Ekk_fs",
    "startTime": 10,
    "duration": 60,
    "options": [
      "不是因為天氣晴朗才愛你",
      "行星",
      "愚者",
      "離開的一路上"
    ],
    "clue": "理想混蛋主唱雞丁創作，全台高中大學吉他社必練、社群破億翻唱的校園純愛神曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_2",
    "tag": "台灣九年級",
    "title": "帶我去找夜生活",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=W9Fq1HC_5hg",
    "youtubeId": "W9Fq1HC_5hg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "帶我去找夜生活",
      "愛人錯過",
      "披星戴月的想你",
      "唯一"
    ],
    "clue": "告五人迷幻浪漫風格代表，「形形色色 尋尋覓覓，帶我去找夜生活」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_3",
    "tag": "台灣九年級",
    "title": "唯一",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=vxucCfcMFCk",
    "youtubeId": "vxucCfcMFCk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "唯一",
      "好不容易",
      "紅",
      "在這座城市遺失了你"
    ],
    "clue": "告五人深情鋼琴抒情名曲，「你真的那樣愛我嗎？是不是我太貪心了」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_4",
    "tag": "台灣九年級",
    "title": "好不容易",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=caxiOmSWWEM",
    "youtubeId": "caxiOmSWWEM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "好不容易",
      "唯一",
      "愛人錯過",
      "新世界"
    ],
    "clue": "懸疑劇《華燈初上》片尾曲，「我的心 這次真的受傷了，好不容易」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_5",
    "tag": "台灣九年級",
    "title": "紅",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=9WEYFqCUze8",
    "youtubeId": "9WEYFqCUze8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "紅",
      "帶我去找夜生活",
      "愛人錯過",
      "法蘭西多士"
    ],
    "clue": "告五人抒情力作，MV由謝盈萱主演，充滿情緒渲染力。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_6",
    "tag": "台灣九年級",
    "title": "捲菸",
    "artist": "美秀集團",
    "youtubeUrl": "https://www.youtube.com/watch?v=S4JLJVVjevI",
    "youtubeId": "S4JLJVVjevI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "捲菸",
      "擋一根",
      "我要你愛",
      "米兒"
    ],
    "clue": "美秀集團賽博台客代表作，YouTube點閱破千萬的九年級獨立樂團神曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_7",
    "tag": "台灣九年級",
    "title": "擋一根",
    "artist": "美秀集團",
    "youtubeUrl": "https://www.youtube.com/watch?v=3_GFxZ9xA7o",
    "youtubeId": "3_GFxZ9xA7o",
    "startTime": 15,
    "duration": 60,
    "options": [
      "擋一根",
      "捲菸",
      "我要你愛",
      "電火王"
    ],
    "clue": "美秀集團經典復古台語搖滾，「借我擋一根，免得等一下心頭悶」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_8",
    "tag": "台灣九年級",
    "title": "我要你愛",
    "artist": "美秀集團",
    "youtubeUrl": "https://www.youtube.com/watch?v=ouQwJj1V2pE",
    "youtubeId": "ouQwJj1V2pE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我要你愛",
      "捲菸",
      "擋一根",
      "金光閃閃"
    ],
    "clue": "美秀集團動感復古的熱烈求愛電音搖滾。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_9",
    "tag": "台灣九年級",
    "title": "想和你看五月的晚霞",
    "artist": "陳華",
    "youtubeUrl": "https://www.youtube.com/watch?v=ljd9ISixsWo",
    "youtubeId": "ljd9ISixsWo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "想和你看五月的晚霞",
      "與我無關",
      "無敵浪漫",
      "想太多"
    ],
    "clue": "陳華爆紅神曲，蟬聯各大串流榜冠軍，「想和你看五月的晚霞，六月日落，七月蒸發」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_10",
    "tag": "台灣九年級",
    "title": "在加納共和國離婚",
    "artist": "菲道爾 / 大穎",
    "youtubeUrl": "https://www.youtube.com/watch?v=wlSvIL-H1GQ",
    "youtubeId": "wlSvIL-H1GQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "在加納共和國離婚",
      "阿拉斯加海灣",
      "友誼長存",
      "能遇見，就很不錯了"
    ],
    "clue": "「你還愛我嗎？你懂我嗎？」洗捲各大社群平台的虐心合唱神曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_11",
    "tag": "台灣九年級",
    "title": "阿拉斯加海灣",
    "artist": "菲道爾",
    "youtubeUrl": "https://www.youtube.com/watch?v=kU0oHbP4ZDk",
    "youtubeId": "kU0oHbP4ZDk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "阿拉斯加海灣",
      "在加納共和國離婚",
      "早點回家",
      "能遇見"
    ],
    "clue": "菲道爾溫柔感傷的爆紅名作，「上天啊，難道你看不出我很愛她」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_12",
    "tag": "台灣九年級",
    "title": "我會等",
    "artist": "承桓",
    "youtubeUrl": "https://www.youtube.com/watch?v=wukVNyIrtMc",
    "youtubeId": "wukVNyIrtMc",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我會等",
      "想和你看五月的晚霞",
      "飛鳥和蟬",
      "白月光與硃砂痣"
    ],
    "clue": "「我會等枯樹生出新芽，等大雪覆蓋這座城池」，社群短影音超人氣治癒勵志曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_13",
    "tag": "台灣九年級",
    "title": "失重前幸福",
    "artist": "艾薇",
    "youtubeUrl": "https://www.youtube.com/watch?v=dZlT8K_Woo0",
    "youtubeId": "dZlT8K_Woo0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "失重前幸福",
      "甘室人生",
      "絕美",
      "悲傷的五個步驟"
    ],
    "clue": "大馬歌手艾薇高亢爆發力的金曲入圍代表作。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_14",
    "tag": "台灣九年級",
    "title": "Crush On You",
    "artist": "李浩瑋 Howard Lee",
    "youtubeUrl": "https://www.youtube.com/watch?v=YGzrowrKkw4",
    "youtubeId": "YGzrowrKkw4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Crush On You",
      "窩囊廢",
      "Blame",
      "Silver linen"
    ],
    "clue": "新世代獨立唱作人李浩瑋空靈R&B慵懶名曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_15",
    "tag": "台灣九年級",
    "title": "小紫吐司",
    "artist": "芒果醬 Mango Jump",
    "youtubeUrl": "https://www.youtube.com/watch?v=gCa2L_mC3w8",
    "youtubeId": "gCa2L_mC3w8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "小紫吐司",
      "芒狗狗",
      "夏夜晚風",
      "再見五月天"
    ],
    "clue": "芒果醬 Mango Jump 搞怪熱血的青春樂團代表作。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_16",
    "tag": "台灣九年級",
    "title": "芒狗狗",
    "artist": "芒果醬 Mango Jump",
    "youtubeUrl": "https://www.youtube.com/watch?v=_PAbZ6OZenY",
    "youtubeId": "_PAbZ6OZenY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "芒狗狗",
      "小紫吐司",
      "團寵",
      "心跳"
    ],
    "clue": "芒果醬極具辨識度的陽光無厘頭風格。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_17",
    "tag": "台灣九年級",
    "title": "能不能和我留在台北",
    "artist": "冰球樂團 icyball",
    "youtubeUrl": "https://www.youtube.com/watch?v=aT_wAEeR4vg",
    "youtubeId": "aT_wAEeR4vg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "能不能和我留在台北",
      "醉後喜歡我",
      "愛手藝",
      "搖擺大叔"
    ],
    "clue": "icyball 冰球樂團復古 City Pop 風潮的代表作，「能不能和我留在台北陪我失眠」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_18",
    "tag": "台灣九年級",
    "title": "醉後喜歡我",
    "artist": "冰球樂團 icyball",
    "youtubeUrl": "https://www.youtube.com/watch?v=3OHT350Acj4",
    "youtubeId": "3OHT350Acj4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "醉後喜歡我",
      "能不能和我留在台北",
      "Bad Boy",
      "愛手藝"
    ],
    "clue": "冰球樂團迷幻微醺的摩登都市浪漫之作。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_19",
    "tag": "台灣九年級",
    "title": "我想和你一起",
    "artist": "溫蒂漫步 Wendy Wander",
    "youtubeUrl": "https://www.youtube.com/watch?v=ltFNlTWDgU8",
    "youtubeId": "ltFNlTWDgU8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我想和你一起",
      "艾菲爾",
      "Spring",
      "Lullaby"
    ],
    "clue": "溫蒂漫步Dream Pop迷幻民謠代表作，「我想和你一起看海」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_20",
    "tag": "台灣九年級",
    "title": "針對與對峙",
    "artist": "持修",
    "youtubeUrl": "https://www.youtube.com/watch?v=NeNq5RFYubc",
    "youtubeId": "NeNq5RFYubc",
    "startTime": 15,
    "duration": 60,
    "options": [
      "針對與對峙",
      "Imma Get A New One",
      "正想著你呢",
      "根本不是我對手"
    ],
    "clue": "金曲新人持修兼具二次元與流行美學的創作神曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_21",
    "tag": "台灣九年級",
    "title": "不介意",
    "artist": "鶴 The Crane",
    "youtubeUrl": "https://www.youtube.com/watch?v=9fmGhdlf4fs",
    "youtubeId": "9fmGhdlf4fs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "不介意",
      "拉麵公子",
      "Natural Ability",
      "Unique Design"
    ],
    "clue": "鶴 The Crane 慵懶爵士R&B的當代都會風格佳作。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_22",
    "tag": "台灣九年級",
    "title": "我的愛人",
    "artist": "柏霖 PoLin",
    "youtubeUrl": "https://www.youtube.com/watch?v=g9BqoGxlkc0",
    "youtubeId": "g9BqoGxlkc0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我的愛人",
      "啼笑皆非",
      "流浪的船",
      "安好"
    ],
    "clue": "影集《火神的眼淚》插曲，聲林之王冠軍柏霖充滿戲劇張力的靈魂情歌。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_23",
    "tag": "台灣九年級",
    "title": "COLORFUL",
    "artist": "婁峻碩 SHOU",
    "youtubeUrl": "https://www.youtube.com/watch?v=c4_qKyFuL0Y",
    "youtubeId": "c4_qKyFuL0Y",
    "startTime": 15,
    "duration": 60,
    "options": [
      "COLORFUL",
      "NEVER LAND",
      "Blue Sky",
      "AIRPLANE"
    ],
    "clue": "五堅情成員婁峻碩紅遍校園的甜蜜輕快嘻哈神曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_24",
    "tag": "台灣九年級",
    "title": "NEVER LAND",
    "artist": "婁峻碩 SHOU",
    "youtubeUrl": "https://www.youtube.com/watch?v=76Z48A6pqRw",
    "youtubeId": "76Z48A6pqRw",
    "startTime": 15,
    "duration": 60,
    "options": [
      "NEVER LAND",
      "COLORFUL",
      "SOFA",
      "WE GO"
    ],
    "clue": "婁峻碩熱血追夢的潮流饒舌之作。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_25",
    "tag": "台灣九年級",
    "title": "長大",
    "artist": "派偉俊",
    "youtubeUrl": "https://www.youtube.com/watch?v=zMHO-CLxzGE",
    "youtubeId": "zMHO-CLxzGE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "長大",
      "3%",
      "最後一次心碎",
      "蝴蝶"
    ],
    "clue": "派偉俊唱出九年級世代面對成長煩惱的流行共鳴。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_26",
    "tag": "台灣九年級",
    "title": "Seaside",
    "artist": "壞特 ?te",
    "youtubeUrl": "https://www.youtube.com/watch?v=XTFxc5HPuvE",
    "youtubeId": "XTFxc5HPuvE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Seaside",
      "Cazzo",
      "Santa Baby",
      "睡不著"
    ],
    "clue": "金曲最佳新人壞特神秘慵懶的Lo-fi Chill Hop海風名作。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_27",
    "tag": "台灣九年級",
    "title": "50元的浪漫",
    "artist": "潮州土狗",
    "youtubeUrl": "https://www.youtube.com/watch?v=mjl2qabfSNs",
    "youtubeId": "mjl2qabfSNs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "50元的浪漫",
      "反毒大使",
      "現主時",
      "看你看我"
    ],
    "clue": "潮州土狗以幽默詼諧的超接地氣風格引爆青年社群。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_28",
    "tag": "台灣九年級",
    "title": "未接來電",
    "artist": "莫宰羊",
    "youtubeUrl": "https://www.youtube.com/watch?v=NXId3_EEGKY",
    "youtubeId": "NXId3_EEGKY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "未接來電",
      "健康快樂",
      "水作的",
      "魚"
    ],
    "clue": "莫宰羊以獨特Auto-tune唱腔與詩意歌詞開創的新生代說唱名曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_29",
    "tag": "台灣九年級",
    "title": "CHANGE",
    "artist": "瘦子 E.SO",
    "youtubeUrl": "https://www.youtube.com/watch?v=HTRQ0n4yjfs",
    "youtubeId": "HTRQ0n4yjfs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "CHANGE",
      "伯父",
      "太陽",
      "WAIT"
    ],
    "clue": "頑童瘦子單飛個人首張專輯《靈魂出竅》的成熟內斂主打。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_30",
    "tag": "台灣九年級",
    "title": "伯父",
    "artist": "瘦子 E.SO",
    "youtubeUrl": "https://www.youtube.com/watch?v=EcKUVuOifTg",
    "youtubeId": "EcKUVuOifTg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "伯父",
      "CHANGE",
      "Hello Beautiful",
      "她沒在看你"
    ],
    "clue": "瘦子以幽默視角寫出面對女友父親的心情，風靡新世代。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_31",
    "tag": "台灣九年級",
    "title": "能火",
    "artist": "熊仔",
    "youtubeUrl": "https://www.youtube.com/watch?v=_SoARWAcMU8",
    "youtubeId": "_SoARWAcMU8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "能火",
      "買榜",
      "信",
      "才子"
    ],
    "clue": "熊仔奪得金曲獎最佳華語專輯的饒舌巔峰霸氣之作。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_32",
    "tag": "台灣九年級",
    "title": "愚者",
    "artist": "理想混蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=FYNNLjn-CuI",
    "youtubeId": "FYNNLjn-CuI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "愚者",
      "不是因為天氣晴朗才愛你",
      "行星",
      "平衡木"
    ],
    "clue": "理想混蛋首張專輯同名核心概念曲，勇往直前的愚者精神。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_33",
    "tag": "台灣九年級",
    "title": "魚",
    "artist": "怕胖團",
    "youtubeUrl": "https://www.youtube.com/watch?v=Dnz-BTz9eDU",
    "youtubeId": "Dnz-BTz9eDU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "魚",
      "媽媽的筆記本",
      "當你在想我的時候",
      "魚在哪裡"
    ],
    "clue": "怕胖團溫暖深情的龐克抒情，「你是一隻魚，水裡的魚」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_34",
    "tag": "台灣九年級",
    "title": "暗流",
    "artist": "拍謝少年",
    "youtubeUrl": "https://www.youtube.com/watch?v=Roxj9OR6ufk",
    "youtubeId": "Roxj9OR6ufk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "暗流",
      "兄弟沒夢不應該",
      "百百人生",
      "出巡"
    ],
    "clue": "拍謝少年融合傳統台灣意象與後搖滾氣息的動人器樂搖滾。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_35",
    "tag": "經典台語, 台灣九年級",
    "title": "長途夜車",
    "artist": "滅火器",
    "youtubeUrl": "https://www.youtube.com/watch?v=TAgVVc5hAiE",
    "youtubeId": "TAgVVc5hAiE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "長途夜車",
      "島嶼天光",
      "海上的人",
      "自信勇敢咱的名"
    ],
    "clue": "寫給所有離鄉背井打拚年輕人的催淚深夜歸途之歌。",
    "tags": [
      "經典台語",
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_36",
    "tag": "台灣九年級",
    "title": "若思念便思念",
    "artist": "脆樂團 Crispy",
    "youtubeUrl": "https://www.youtube.com/watch?v=YKkhXC86EhA",
    "youtubeId": "YKkhXC86EhA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "若思念便思念",
      "愛情的模樣",
      "100分",
      "編織星空的人"
    ],
    "clue": "雙主唱男女對唱民謠，入圍金曲獎最佳演唱組合。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_37",
    "tag": "台灣九年級",
    "title": "彼個所在",
    "artist": "魏如萱",
    "youtubeUrl": "https://www.youtube.com/watch?v=86wypSCXK9M",
    "youtubeId": "86wypSCXK9M",
    "startTime": 15,
    "duration": 60,
    "options": [
      "彼個所在",
      "你啊你啊",
      "泡泡",
      "買你"
    ],
    "clue": "魏如萱以國台英粵四種語言交織而成的感人思念安魂曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_38",
    "tag": "台灣九年級",
    "title": "買榜",
    "artist": "吳卓源 / 熊仔",
    "youtubeUrl": "https://www.youtube.com/watch?v=W-H6v6b1hu4",
    "youtubeId": "W-H6v6b1hu4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "買榜",
      "台北夜空下",
      "撥接",
      "你是不是有點動心"
    ],
    "clue": "鄉民老婆 Julia 吳卓源與熊仔合作，風靡千禧新世代的R&B神曲。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_39",
    "tag": "台灣九年級",
    "title": "Millions of Years Apart",
    "artist": "恐龍的皮 The Dinosaur's Skin",
    "youtubeUrl": "https://www.youtube.com/watch?v=UwKDv80VnPo",
    "youtubeId": "UwKDv80VnPo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Millions of Years Apart",
      "All My Friends Are Dead",
      "Triassic Love",
      "Brontosaurus"
    ],
    "clue": "恐龍的皮帶有復古Lo-fi色彩與侏儸紀浪漫的九年級超人氣樂團。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "tw_grade9_40",
    "tag": "台灣九年級",
    "title": "你終究也想成為沒有秘密的極限",
    "artist": "傻子與白痴",
    "youtubeUrl": "https://www.youtube.com/watch?v=g9dWCal7nEM",
    "youtubeId": "g9dWCal7nEM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "你終究也想成為沒有秘密的極限",
      "象牙舟",
      "OY",
      "夜行動物館"
    ],
    "clue": "傻子與白痴主唱蔡維澤極具深度的獨立搖滾當代之作。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "離開的一路上",
    "artist": "理想混蛋",
    "youtubeId": "3hLESh77fSg",
    "options": [
      "離開的一路上",
      "不是因為天氣晴朗才愛你",
      "愚者",
      "行星"
    ],
    "clue": "理想混蛋抒情代表作，「離開的一路上，風景都退後，你的微笑還留在心頭……」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "滯留鋒",
    "artist": "理想混蛋",
    "youtubeId": "zxS_NTJ4Hbo",
    "options": [
      "滯留鋒",
      "離開的一路上",
      "愚者",
      "天真世界的誕生"
    ],
    "clue": "描寫如梅雨滯留鋒面般揮之不去的憂鬱與思念，主唱雞丁細膩聲線直擊人心。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "又到天黑",
    "artist": "告五人",
    "youtubeId": "ey7Jph8ndJU",
    "options": [
      "又到天黑",
      "愛人錯過",
      "披星戴月的想你",
      "好不容易"
    ],
    "clue": "告五人致敬每一位在深夜中辛勤工作者的溫暖力作，榮獲金曲獎年度歌曲獎。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "帶你飛",
    "artist": "告五人",
    "youtubeId": "BR09PGobYPk",
    "options": [
      "帶你飛",
      "又到天黑",
      "在這座城市遺失了你",
      "唯一"
    ],
    "clue": "告五人同名巡演主題曲，迷幻與流行搖滾交融，帶領歌迷遨遊音樂天空。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "一念之間",
    "artist": "告五人",
    "youtubeId": "AfFpsCz-aoY",
    "options": [
      "一念之間",
      "好不容易",
      "愛人錯過",
      "帶我去找夜生活"
    ],
    "clue": "雙主唱犬青與雲安深情對唱，描繪愛情中轉瞬即逝的緣分與抉擇。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "芒芒人海",
    "artist": "芒果醬 Mango Jump",
    "youtubeId": "xX1FYlFEANs",
    "options": [
      "芒芒人海",
      "小紫吐司",
      "夏夜晚風",
      "芒狗狗"
    ],
    "clue": "芒果醬招牌龐克熱血告白曲，「在芒芒人海遇見你，我用盡了全部的力氣……」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "夏夜晚風",
    "artist": "芒果醬 Mango Jump",
    "youtubeId": "ZMN9TFioGyg",
    "options": [
      "夏夜晚風",
      "芒芒人海",
      "小紫吐司",
      "長大"
    ],
    "clue": "芒果醬充滿青春汗水與無厘頭浪漫的夏日之歌，深受九年級學生喜愛。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "電火王",
    "artist": "美秀集團",
    "youtubeId": "BuuIbTF0_b0",
    "options": [
      "電火王",
      "捲菸",
      "擋一根",
      "我要你愛"
    ],
    "clue": "美秀集團自製炫砲樂器與賽博龐克台味搖滾結合的代表作，生猛震撼。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "這幾年",
    "artist": "美秀集團",
    "youtubeId": "LdbIqc677l8",
    "options": [
      "這幾年",
      "捲菸",
      "擋一根",
      "白骨哀"
    ],
    "clue": "美秀集團抒情搖滾名曲，刻畫長大成人面對現實無奈的真摯告白。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "終究還是因為愛",
    "artist": "TRASH",
    "youtubeId": "fl1Wbd-ldMQ",
    "options": [
      "終究還是因為愛",
      "重感情的廢物",
      "希望你回來",
      "歸零"
    ],
    "clue": "TRASH樂團正能量爆發金曲，「終究還是因為愛，讓我們相遇在這裡，勇敢站起來……」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "重感情的廢物",
    "artist": "TRASH",
    "youtubeId": "jM3HXNusWA0",
    "options": [
      "重感情的廢物",
      "終究還是因為愛",
      "離開台北",
      "希望你回來"
    ],
    "clue": "主唱阿夜唱出性情中人的心酸與驕傲，「我就是個重感情的廢物，戒不掉對你的在乎……」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "PLAYBOY",
    "artist": "婁峻碩",
    "youtubeId": "tkJyxsqbHls",
    "options": [
      "PLAYBOY",
      "COLORFUL",
      "NEVER LAND",
      "Blue Sky"
    ],
    "clue": "饒舌歌手婁峻碩嘻哈動感之作，潮流節奏席捲各大校園舞會。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "絕對發言",
    "artist": "陳零九、邱鋒澤",
    "youtubeId": "5epYuU0zdUM",
    "options": [
      "絕對發言",
      "天黑請閉眼",
      "天亮請睜眼",
      "速食愛情"
    ],
    "clue": "狼人殺系列終局之戰神曲，「發言請注意，真相就在你眼前……」，九澤CP經典合體。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "ALL DAY",
    "artist": "五堅情",
    "youtubeId": "deoS5ISDCUU",
    "options": [
      "ALL DAY",
      "兵變",
      "速食愛情",
      "月面著陸"
    ],
    "clue": "陳零九、邱鋒澤、黃偉晉、賴晏駒、婁峻碩五人合體熱血團歌，青春洋溢。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "兵變",
    "artist": "五堅情 (W0LF(S))",
    "youtubeId": "Du96eQPbfKA",
    "options": [
      "兵變",
      "ALL DAY",
      "速食愛情",
      "絕對發言"
    ],
    "clue": "結合入伍當兵與被背叛的心痛體驗，旋律洗腦動聽，MV點閱突破千萬。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "O.A.O.",
    "artist": "Ozone",
    "youtubeId": "rtVUXCyRQXI",
    "options": [
      "O.A.O.",
      "Unicorn",
      "原來的少年",
      "Bad Bad Love"
    ],
    "clue": "原子少年冠軍出道男團Ozone首支正式單曲，象徵「One And Only」，粉絲專屬告白。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "Unicorn",
    "artist": "Ozone",
    "youtubeId": "VF-KOFc8lh8",
    "options": [
      "Unicorn",
      "O.A.O.",
      "Purple Days",
      "World Top"
    ],
    "clue": "韓國知名製作團隊操刀，夢幻節奏與俐落刀群舞展現新生代男團實力。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "莫愁",
    "artist": "承桓",
    "youtubeId": "wQFdlvdIqo4",
    "options": [
      "莫愁",
      "我會等",
      "阿拉斯加海灣",
      "在加納共和國離婚"
    ],
    "clue": "承桓古風抒情新曲，旋律深邃悠遠，深受九年級喜愛。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "慢慢喜歡你",
    "artist": "莫文蔚",
    "youtubeId": "kqqraGvoqVs",
    "options": [
      "慢慢喜歡你",
      "陰天",
      "他不愛我",
      "盛夏的果實"
    ],
    "clue": "李榮浩詞曲為莫文蔚量身打造，「慢慢喜歡你，慢慢的親密，慢慢聊自己……」。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "tag": "台灣九年級",
    "title": "Benz Booty",
    "artist": "高爾宣 OSN",
    "youtubeId": "eL4Y1BE6WDc",
    "options": [
      "Benz Booty",
      "Without You",
      "So Bad",
      "最後一次"
    ],
    "clue": "高爾宣嘻哈潮流代表作，輕快美式旋律配搭流暢饒舌，廣受青年族群傳唱。",
    "tags": [
      "台灣九年級"
    ]
  },
  {
    "id": "anime_1",
    "tag": "動漫神曲",
    "title": "殘酷天使的行動綱領",
    "artist": "高橋洋子",
    "youtubeUrl": "https://www.youtube.com/watch?v=o6wtDPVkKqI",
    "youtubeId": "o6wtDPVkKqI",
    "startTime": 10,
    "duration": 60,
    "options": [
      "殘酷天使的行動綱領",
      "魂之輪迴",
      "直到世界的盡頭",
      "前前前世"
    ],
    "clue": "傳奇動畫《新世紀福音戰士》(EVA) 經典片頭曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_2",
    "tag": "動漫神曲",
    "title": "直到世界的盡頭",
    "artist": "WANDS",
    "youtubeUrl": "https://www.youtube.com/watch?v=P199MdOxVeI",
    "youtubeId": "P199MdOxVeI",
    "startTime": 35,
    "duration": 60,
    "options": [
      "直到世界的盡頭",
      "好想大聲說喜歡你",
      "捕捉閃爍的瞬間",
      "灌籃高手"
    ],
    "clue": "《灌籃高手》(Slam Dunk) 三井壽浪子回頭專屬片尾曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_3",
    "tag": "動漫神曲",
    "title": "好想大聲說喜歡你",
    "artist": "BAAD",
    "youtubeUrl": "https://www.youtube.com/watch?v=HSj-en4UHMI",
    "youtubeId": "HSj-en4UHMI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "好想大聲說喜歡你",
      "直到世界的盡頭",
      "漸漸被你吸引",
      "勇氣100%"
    ],
    "clue": "《灌籃高手》(Slam Dunk) 熱血沸騰的第一代片頭曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_4",
    "tag": "動漫神曲",
    "title": "紅蓮華",
    "artist": "LiSA",
    "youtubeUrl": "https://www.youtube.com/watch?v=MpYy6wwqxoo",
    "youtubeId": "MpYy6wwqxoo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "紅蓮華",
      "炎",
      "殘響散歌",
      "虹"
    ],
    "clue": "全球現象級動畫《鬼滅之刃 竈門炭治郎 立志篇》主題曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_5",
    "tag": "動漫神曲",
    "title": "哆啦A夢之歌",
    "artist": "大杉久美子",
    "youtubeUrl": "https://www.youtube.com/watch?v=frSrRzEJoE4",
    "youtubeId": "frSrRzEJoE4",
    "startTime": 5,
    "duration": 60,
    "options": [
      "哆啦A夢之歌",
      "櫻桃小丸子主題曲",
      "麵包超人進行曲",
      "名偵探柯南主題曲"
    ],
    "clue": "「昂、昂、昂，小叮噹幫我實現所有的願望」，陪伴幾代人的童年。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_6",
    "tag": "動漫神曲",
    "title": "We Are!",
    "artist": "北谷洋",
    "youtubeUrl": "https://www.youtube.com/watch?v=HB4iNVa746E",
    "youtubeId": "HB4iNVa746E",
    "startTime": 10,
    "duration": 60,
    "options": [
      "We Are!",
      "Believe",
      "Share The World",
      "One Day"
    ],
    "clue": "超人氣動畫《航海王 ONE PIECE》最初也是最經典的冒險序幕曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_7",
    "tag": "動漫神曲",
    "title": "炎",
    "artist": "LiSA",
    "youtubeUrl": "https://www.youtube.com/watch?v=4DxL6IKmXx4",
    "youtubeId": "4DxL6IKmXx4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "炎",
      "紅蓮華",
      "殘響散歌",
      "虹"
    ],
    "clue": "《鬼滅之刃劇場版 無限列車篇》主題曲，大哥沒有輸的熱淚感動。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_8",
    "tag": "動漫神曲",
    "title": "殘響散歌",
    "artist": "Aimer",
    "youtubeUrl": "https://www.youtube.com/watch?v=tLQLa6lM3Us",
    "youtubeId": "tLQLa6lM3Us",
    "startTime": 15,
    "duration": 60,
    "options": [
      "殘響散歌",
      "紅蓮華",
      "炎",
      "朝が来る"
    ],
    "clue": "《鬼滅之刃 遊郭篇》片頭曲，Aimer極具張力的沙啞嗓音與華麗疾速旋律。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_9",
    "tag": "動漫神曲",
    "title": "Idol",
    "artist": "YOASOBI",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZRtdQ81jPUQ",
    "youtubeId": "ZRtdQ81jPUQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Idol",
      "群青",
      "夜に駆ける",
      "怪物"
    ],
    "clue": "動畫《我推的孩子》超人氣主題曲，席捲全球各大告示牌排行榜冠軍。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_10",
    "tag": "動漫神曲",
    "title": "群青",
    "artist": "YOASOBI",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y4nEEZwckuU",
    "youtubeId": "Y4nEEZwckuU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "群青",
      "Idol",
      "夜に駆ける",
      "三原色"
    ],
    "clue": "靈感來自漫畫《藍色時期》，激勵無數追夢者的青春合唱之作。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_11",
    "tag": "動漫神曲",
    "title": "向夜晚奔去",
    "artist": "YOASOBI",
    "youtubeUrl": "https://www.youtube.com/watch?v=by4SYYWlhEs",
    "youtubeId": "by4SYYWlhEs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "向夜晚奔去",
      "群青",
      "怪物",
      "優しい彗星"
    ],
    "clue": "YOASOBI出道爆紅代表作《夜に駆ける》，串流播放突破數億次的成名曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_12",
    "tag": "動漫神曲",
    "title": "Lemon",
    "artist": "米津玄師",
    "youtubeUrl": "https://www.youtube.com/watch?v=SX_ViT4Ra7k",
    "youtubeId": "SX_ViT4Ra7k",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Lemon",
      "Peace Sign",
      "KICK BACK",
      "Paprika"
    ],
    "clue": "日劇《法醫女王》(Unnatural) 主題曲，米津玄師點閱破8億次的平成傳奇神曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_13",
    "tag": "動漫神曲",
    "title": "Peace Sign",
    "artist": "米津玄師",
    "youtubeUrl": "https://www.youtube.com/watch?v=9aJVr5tTTWk",
    "youtubeId": "9aJVr5tTTWk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Peace Sign",
      "Lemon",
      "KICK BACK",
      "打上花火"
    ],
    "clue": "熱血動畫《我的英雄學院》第2期片頭曲，象徵堅定邁向未來的和平象徵。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_14",
    "tag": "動漫神曲",
    "title": "KICK BACK",
    "artist": "米津玄師",
    "youtubeUrl": "https://www.youtube.com/watch?v=M2cckDmNLMI",
    "youtubeId": "M2cckDmNLMI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "KICK BACK",
      "Lemon",
      "Peace Sign",
      "死神"
    ],
    "clue": "動畫《鏈鋸人》熱血狂躁的片頭曲，常田大希參與編曲與演奏。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_15",
    "tag": "動漫神曲",
    "title": "前前前世",
    "artist": "RADWIMPS",
    "youtubeUrl": "https://www.youtube.com/watch?v=PDSkFeMVNFs",
    "youtubeId": "PDSkFeMVNFs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "前前前世",
      "Sparkle",
      "Grand Escape",
      "愛にできることはまだあるかい"
    ],
    "clue": "新海誠現象級動畫電影《你的名字》主題曲，疾馳而過的青春命運羈絆。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_16",
    "tag": "動漫神曲",
    "title": "Sparkle (火花)",
    "artist": "RADWIMPS",
    "youtubeUrl": "https://www.youtube.com/watch?v=a2GujJZfXpg",
    "youtubeId": "a2GujJZfXpg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Sparkle (火花)",
      "前前前世",
      "夢燈籠",
      "什麼都沒有"
    ],
    "clue": "《你的名字》彗星墜落高潮片段插曲，鋼琴琶音如流星雨般璀璨灑落。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_17",
    "tag": "動漫神曲",
    "title": "Butter-Fly",
    "artist": "和田光司",
    "youtubeUrl": "https://www.youtube.com/watch?v=YAxNwRb93xk",
    "youtubeId": "YAxNwRb93xk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Butter-Fly",
      "Target",
      "Brave Heart",
      "Seven"
    ],
    "clue": "《數碼寶貝大冒險》經典片頭曲，不死蝶和田光司燃燒生命的童年熱血回憶。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_18",
    "tag": "動漫神曲",
    "title": "魂之輪迴",
    "artist": "高橋洋子",
    "youtubeUrl": "https://www.youtube.com/watch?v=Wl7IW7OiaHc",
    "youtubeId": "Wl7IW7OiaHc",
    "startTime": 15,
    "duration": 60,
    "options": [
      "魂之輪迴",
      "殘酷天使的行動綱領",
      "THANATOS",
      "Komm, süsser Tod"
    ],
    "clue": "《新世紀福音戰士劇場版：死與新生》主題曲，莊嚴神聖的靈魂歸宿之歌。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_19",
    "tag": "動漫神曲",
    "title": "CHA-LA HEAD-CHA-LA",
    "artist": "影山浩宣",
    "youtubeUrl": "https://www.youtube.com/watch?v=dIPi7Knz6Bs",
    "youtubeId": "dIPi7Knz6Bs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "CHA-LA HEAD-CHA-LA",
      "WE GOTTA POWER",
      "摩訶不思議大冒險",
      "漸漸被你吸引"
    ],
    "clue": "《七龍珠Z》第一代片頭曲，「發射龜派氣功」的全球共通熱血童年旋律。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_20",
    "tag": "動漫神曲",
    "title": "漸漸被你吸引",
    "artist": "FIELD OF VIEW",
    "youtubeUrl": "https://www.youtube.com/watch?v=f7Z3b_vSjS8",
    "youtubeId": "f7Z3b_vSjS8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "漸漸被你吸引",
      "CHA-LA HEAD-CHA-LA",
      "直到世界的盡頭",
      "好想大聲說喜歡你"
    ],
    "clue": "《七龍珠GT》片頭曲，坂井泉水 (ZARD) 作詞的動漫金曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_21",
    "tag": "動漫神曲",
    "title": "One Last Kiss",
    "artist": "宇多田光",
    "youtubeUrl": "https://www.youtube.com/watch?v=0Uhh62MUEic",
    "youtubeId": "0Uhh62MUEic",
    "startTime": 15,
    "duration": 60,
    "options": [
      "One Last Kiss",
      "Beautiful World",
      "Sakura Drops",
      "First Love"
    ],
    "clue": "電影《福音戰士新劇場版：終》主題曲，宇多田光細膩溫柔的告別之作。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_22",
    "tag": "動漫神曲",
    "title": "Cry Baby",
    "artist": "Official鬍子男dism",
    "youtubeUrl": "https://www.youtube.com/watch?v=O1bhZgkC4Gw",
    "youtubeId": "O1bhZgkC4Gw",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Cry Baby",
      "Mixed Nuts",
      "Pretender",
      "I LOVE..."
    ],
    "clue": "動畫《東京復仇者》片頭曲，連續轉調的超高難度硬核流行搖滾。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_23",
    "tag": "動漫神曲",
    "title": "Mixed Nuts",
    "artist": "Official鬍子男dism",
    "youtubeUrl": "https://www.youtube.com/watch?v=CbH2F0kXgTY",
    "youtubeId": "CbH2F0kXgTY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Mixed Nuts",
      "Cry Baby",
      "喜劇",
      "色彩"
    ],
    "clue": "現象級喜劇動畫《SPY×FAMILY 間諜家家酒》第1季片頭曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_24",
    "tag": "動漫神曲",
    "title": "喜劇",
    "artist": "星野源",
    "youtubeUrl": "https://www.youtube.com/watch?v=D_Oyplmhhv0",
    "youtubeId": "D_Oyplmhhv0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "喜劇",
      "Mixed Nuts",
      "戀",
      "SUN"
    ],
    "clue": "動畫《SPY×FAMILY 間諜家家酒》片尾曲，描繪佛傑一家溫馨家庭日常。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_25",
    "tag": "動漫神曲",
    "title": "迴迴奇譚",
    "artist": "Eve",
    "youtubeUrl": "https://www.youtube.com/watch?v=1tk1pqwrOys",
    "youtubeId": "1tk1pqwrOys",
    "startTime": 15,
    "duration": 60,
    "options": [
      "迴迴奇譚",
      "一途",
      "SPECIALZ",
      "蒼のワルツ"
    ],
    "clue": "超人氣動畫《咒術迴戰》第1季片頭曲，疾速切分節奏與黑暗奇幻風格。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_26",
    "tag": "動漫神曲",
    "title": "一途",
    "artist": "King Gnu",
    "youtubeUrl": "https://www.youtube.com/watch?v=hm1na9R2uYA",
    "youtubeId": "hm1na9R2uYA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "一途",
      "SPECIALZ",
      "白日",
      "逆夢"
    ],
    "clue": "《劇場版 咒術迴戰 0》主題曲，乙骨憂太與里香純愛詛咒的爆發疾馳之作。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_27",
    "tag": "動漫神曲",
    "title": "SPECIALZ",
    "artist": "King Gnu",
    "youtubeUrl": "https://www.youtube.com/watch?v=fhzKLBZJC3w",
    "youtubeId": "fhzKLBZJC3w",
    "startTime": 15,
    "duration": 60,
    "options": [
      "SPECIALZ",
      "一途",
      "白日",
      "雨燦々"
    ],
    "clue": "《咒術迴戰 澀谷事變》片頭曲，「You are my special」洗腦全世界。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_28",
    "tag": "動漫神曲",
    "title": "目標是寶可夢大師",
    "artist": "松本梨香",
    "youtubeUrl": "https://www.youtube.com/watch?v=kbsRaNXfsew",
    "youtubeId": "kbsRaNXfsew",
    "startTime": 15,
    "duration": 60,
    "options": [
      "目標是寶可夢大師",
      "151",
      "競逐者",
      "微笑的向日葵"
    ],
    "clue": "《精靈寶可夢》初代片頭曲，「哪怕火中水中草叢中」小智與皮卡丘的冒險起點。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_29",
    "tag": "動漫神曲",
    "title": "Sugar Song and Bitter Step",
    "artist": "UNISON SQUARE GARDEN",
    "youtubeUrl": "https://www.youtube.com/watch?v=3exsRhw3xt8",
    "youtubeId": "3exsRhw3xt8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Sugar Song and Bitter Step",
      "Hello, world!",
      "Catch up, latency",
      "オリオンをなぞる"
    ],
    "clue": "動畫《血界戰線》ED名曲，片尾全員歡樂起舞的經典跳舞動畫。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_30",
    "tag": "動漫神曲",
    "title": "GO!!!",
    "artist": "FLOW",
    "youtubeUrl": "https://www.youtube.com/watch?v=AE4b9jO1uB4",
    "youtubeId": "AE4b9jO1uB4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "GO!!!",
      "青鳥",
      "Sign",
      "遙か彼方"
    ],
    "clue": "經典動漫《火影忍者》第4期片頭曲，「We are Fighting Dreamers」熱血澎湃。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_31",
    "tag": "動漫神曲",
    "title": "青鳥",
    "artist": "生物股長 (Ikimonogakari)",
    "youtubeUrl": "https://www.youtube.com/watch?v=KpsJWFuVTdI",
    "youtubeId": "KpsJWFuVTdI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "青鳥",
      "螢之光",
      "SAKURA",
      "YELL"
    ],
    "clue": "《火影忍者疾風傳》片頭曲，「飛翔之際，說好了就絕不回頭」，動漫傳世名曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_32",
    "tag": "動漫神曲",
    "title": "Silhouette",
    "artist": "KANA-BOON",
    "youtubeUrl": "https://www.youtube.com/watch?v=dlFA0Zq1k2A",
    "youtubeId": "dlFA0Zq1k2A",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Silhouette",
      "青鳥",
      "GO!!!",
      "Baton Road"
    ],
    "clue": "《火影忍者疾風傳》第16期片頭曲，旋律節奏感極強，全球火影迷無人不曉。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_33",
    "tag": "動漫神曲",
    "title": "曇天",
    "artist": "DOES",
    "youtubeUrl": "https://www.youtube.com/watch?v=n5TG3Fxzft0",
    "youtubeId": "n5TG3Fxzft0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "曇天",
      "修羅",
      "Some Like It Hot!!",
      "桃源鄉Alien"
    ],
    "clue": "《銀魂》經典片頭曲，DOES直率痛快的日系搖滾描寫陰霾天色下的熱血戰鬥。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_34",
    "tag": "動漫神曲",
    "title": "Some Like It Hot!! (武士之心)",
    "artist": "SPYAIR",
    "youtubeUrl": "https://www.youtube.com/watch?v=yDDBaQnd9Ls",
    "youtubeId": "yDDBaQnd9Ls",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Some Like It Hot!! (武士之心)",
      "現狀破壞",
      "曇天",
      "櫻滿月"
    ],
    "clue": "《銀魂》第17期片尾曲，SPYAIR最具代表性的燃系動漫名曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_35",
    "tag": "動漫神曲",
    "title": "secret base ～你給我的東西～",
    "artist": "茅野愛衣 / 戶松遙 / 早見沙織",
    "youtubeUrl": "https://www.youtube.com/watch?v=-nQ0teDhO6c",
    "youtubeId": "-nQ0teDhO6c",
    "startTime": 15,
    "duration": 60,
    "options": [
      "secret base ～你給我的東西～",
      "青鳥",
      "一番の宝物",
      "小小手心"
    ],
    "clue": "《未聞花名》(我們仍未知道那天所看見的花名) 片尾催淚神曲，「找到你了，面麻」。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_36",
    "tag": "動漫神曲",
    "title": "你不知道的故事",
    "artist": "supercell",
    "youtubeUrl": "https://www.youtube.com/watch?v=jpV5jeFlt_E",
    "youtubeId": "jpV5jeFlt_E",
    "startTime": 15,
    "duration": 60,
    "options": [
      "你不知道的故事",
      "戀愛循環",
      "Connect",
      "白金Disco"
    ],
    "clue": "《化物話》片尾曲，以夏季大三角天鵝座為背景的青春天文告白神曲。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_37",
    "tag": "動漫神曲",
    "title": "Connect",
    "artist": "ClariS",
    "youtubeUrl": "https://www.youtube.com/watch?v=CS2kMYu4UtM",
    "youtubeId": "CS2kMYu4UtM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Connect",
      "Magia",
      "Luminous",
      "Colorful"
    ],
    "clue": "《魔法少女小圓》片頭曲，看似純真魔法少女實則隱含曉美焰輪迴宿命的經典名作。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_38",
    "tag": "動漫神曲",
    "title": "紅蓮的弓矢",
    "artist": "Linked Horizon",
    "youtubeUrl": "https://www.youtube.com/watch?v=CID-sYQNCew",
    "youtubeId": "CID-sYQNCew",
    "startTime": 15,
    "duration": 60,
    "options": [
      "紅蓮的弓矢",
      "心臟撒撒給油",
      "美麗而殘酷的世界",
      "惡魔之子"
    ],
    "clue": "《進擊的巨人》初代片頭曲，「那一天，人類回想起了被巨人支配的恐懼」。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_39",
    "tag": "動漫神曲",
    "title": "Mela!",
    "artist": "綠黃色社會",
    "youtubeUrl": "https://www.youtube.com/watch?v=aRDURmIYBZ4",
    "youtubeId": "aRDURmIYBZ4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Mela!",
      "Shout Baby",
      "Character",
      "花になって"
    ],
    "clue": "綠黃色社會元氣爆發的超人氣流行代表作，各大校園管樂團與動漫活動必唱。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "anime_40",
    "tag": "動漫神曲",
    "title": "鄰家的龍貓",
    "artist": "井上杏美",
    "youtubeUrl": "https://www.youtube.com/watch?v=0Wv3Ya9nskA",
    "youtubeId": "0Wv3Ya9nskA",
    "startTime": 10,
    "duration": 60,
    "options": [
      "鄰家的龍貓",
      "風之谷",
      "天空之城 (伴隨著你)",
      "散步"
    ],
    "clue": "吉卜力工作室宮崎駿名作《龍貓》主題曲，全世界孩子耳熟能詳的森林精靈之歌。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "怪物",
    "artist": "YOASOBI",
    "youtubeId": "dy90tA3TT1c",
    "options": [
      "怪物",
      "Idol",
      "群青",
      "勇者"
    ],
    "clue": "動畫《BEASTARS》第二季片頭曲，探討肉食動物與草食動物的世界衝突。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "勇者",
    "artist": "YOASOBI",
    "youtubeId": "OIBODIPC_8Y",
    "options": [
      "勇者",
      "怪物",
      "Idol",
      "祝福"
    ],
    "clue": "動畫《葬送的芙莉蓮》片頭曲，追憶欣梅爾與勇者小隊昔日旅程。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "地球儀",
    "artist": "米津玄師",
    "youtubeId": "VUsURj_OYdA",
    "options": [
      "地球儀",
      "Lemon",
      "Peace Sign",
      "KICK BACK"
    ],
    "clue": "宮崎駿動畫電影《蒼鷺與少年》主題曲，米津玄師歷時四年創作的致敬之歌。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "crossing field",
    "artist": "LiSA",
    "youtubeId": "KId6eunoiWk",
    "options": [
      "crossing field",
      "紅蓮華",
      "炎",
      "Catch the Moment"
    ],
    "clue": "人氣動畫《刀劍神域》(SAO) 艾恩葛朗特篇經典片頭曲，LiSA成名代表作。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "Catch the Moment",
    "artist": "LiSA",
    "youtubeId": "LJkn2qqtijk",
    "options": [
      "Catch the Moment",
      "crossing field",
      "紅蓮華",
      "炎"
    ],
    "clue": "動畫電影《刀劍神域：序列爭戰》主題曲，「Catch the moment，在這一刻抓緊希望！」。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "Brave Shine",
    "artist": "Aimer",
    "youtubeId": "XeI8E20ZUE4",
    "options": [
      "Brave Shine",
      "殘響散歌",
      "SPARK-AGAIN",
      "Aimer 茜さす"
    ],
    "clue": "動畫《Fate/stay night [Unlimited Blade Works]》第二季片頭曲，磅礡震撼。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "SPARK-AGAIN",
    "artist": "Aimer",
    "youtubeId": "dZ0Jt1zYj7g",
    "options": [
      "SPARK-AGAIN",
      "Brave Shine",
      "殘響散歌",
      "春はゆく"
    ],
    "clue": "人氣熱血動畫《炎炎消防隊 貳之章》片頭曲，疾速爆發的搖滾靈魂。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "Imagination",
    "artist": "SPYAIR",
    "youtubeId": "2QpeSCXP2t0",
    "options": [
      "Imagination",
      "Some Like It Hot!! (武士之心)",
      "FLY HIGH!!",
      "曇天"
    ],
    "clue": "熱血排球動畫《排球少年！！》第一季第一首片頭曲，「從球場仰望那片藍天！」。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "FLY HIGH!!",
    "artist": "BURNOUT SYNDROMES",
    "youtubeId": "VKviyEGvb94",
    "options": [
      "FLY HIGH!!",
      "Imagination",
      "Hikariare",
      "Phoenix"
    ],
    "clue": "動畫《排球少年！！》第二季片頭曲，「飛吧！向著那無人能及的高空！」。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "愛能做到的還有甚麼",
    "artist": "RADWIMPS",
    "youtubeId": "EQ94zflNqn4",
    "options": [
      "愛能做到的還有甚麼",
      "前前前世",
      "Sparkle (火花)",
      "Grand Escape"
    ],
    "clue": "新海誠動畫電影《天氣之子》主題曲，「在命運的大雨下，愛還能做到什麼呢……」。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "Grand Escape",
    "artist": "RADWIMPS feat. 三浦透子",
    "youtubeId": "iXjSxAwVPhY",
    "options": [
      "Grand Escape",
      "愛能做到的還有甚麼",
      "前前前世",
      "祝祭"
    ],
    "clue": "電影《天氣之子》最震撼墜入雲海高潮插曲，宏偉唱詩合唱撼動全場。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "Sign",
    "artist": "FLOW",
    "youtubeId": "97dkzVU4p-M",
    "options": [
      "Sign",
      "GO!!!",
      "青鳥",
      "Silhouette"
    ],
    "clue": "動畫《火影忍者疾風傳》第6首片頭曲，刻畫自來也與鳴人、鼬與佐助的感人羈絆。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "遙か彼方",
    "artist": "ASIAN KUNG-FU GENERATION",
    "youtubeId": "nJ6A6GC_ki4",
    "options": [
      "遙か彼方",
      "GO!!!",
      "Silhouette",
      "青鳥"
    ],
    "clue": "早期《火影忍者》中忍考試篇熱血片頭曲，粗獷日系車庫搖滾經典。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "心臟為你奉獻",
    "artist": "Linked Horizon",
    "youtubeId": "nAksM2HAAqo",
    "options": [
      "心臟為你奉獻",
      "紅蓮的弓矢",
      "自由之翼",
      "惡魔之子"
    ],
    "clue": "動畫《進擊的巨人》第二季片頭曲，「獻出心臟吧！為了自由與尊嚴！」。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "虹",
    "artist": "菅田將暉",
    "youtubeId": "qCZf0A6nQ1Y",
    "options": [
      "虹",
      "哆啦A夢之歌",
      "向夜晚奔去",
      "再見的夏天"
    ],
    "clue": "3D動畫電影《STAND BY ME 哆啦A夢 2》主題曲，大雄與靜香婚禮感動誓詞。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "宿命",
    "artist": "Official髭男dism",
    "youtubeId": "-kgOFJG881I",
    "options": [
      "宿命",
      "Pretender",
      "Mixed Nuts",
      "I LOVE..."
    ],
    "clue": "夏季日本高校甲子園棒球大會應援神曲，熱血號角響起無悔青春。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "彼得潘",
    "artist": "優里",
    "youtubeId": "9qfPF4fpiHE",
    "options": [
      "彼得潘",
      "乾燥花",
      "Leo",
      "逃避行"
    ],
    "clue": "優里充滿搖滾衝勁與夢想掙扎的名曲，激勵每位永不長大的少年。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "白日",
    "artist": "King Gnu",
    "youtubeId": "ony539T074w",
    "options": [
      "白日",
      "一途",
      "逆夢",
      "SPECIALZ"
    ],
    "clue": "井口理天籟假音與常田大希爵士搖滾編排，破億播放量超神日劇與動漫常客。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "心予報",
    "artist": "Eve",
    "youtubeId": "dJf4wCdLU18",
    "options": [
      "心予報",
      "迴迴奇譚",
      "平行線",
      "蒼之華爾滋"
    ],
    "clue": "超人氣網路創作歌手Eve的甜美戀愛動畫神曲，節奏極度輕快跳躍。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "tag": "動漫神曲",
    "title": "Shout Baby",
    "artist": "綠黃色社會",
    "youtubeId": "zUSAFqdBb2I",
    "options": [
      "Shout Baby",
      "Mela!",
      "花になって",
      "陽はまた昇るから"
    ],
    "clue": "動畫《我的英雄學院》第四季片尾曲，長屋晴子爆發力十足的高音直穿雲霄。",
    "tags": [
      "動漫神曲"
    ]
  },
  {
    "id": "kids_1",
    "tag": "童謠兒歌",
    "title": "拔蘿蔔",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=rwth9dQS1oM",
    "youtubeId": "rwth9dQS1oM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "拔蘿蔔",
      "兩隻老虎",
      "泥娃娃",
      "小星星"
    ],
    "clue": "「拔蘿蔔拔蘿蔔，嘿呦嘿呦拔不動」，耳熟能詳的兒歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_2",
    "tag": "童謠兒歌",
    "title": "兩隻老虎",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=RApHGXfBKO0",
    "youtubeId": "RApHGXfBKO0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "兩隻老虎",
      "三隻小豬",
      "醜小鴨",
      "泥娃娃"
    ],
    "clue": "「一隻沒有耳朵，一隻沒有尾巴，真奇怪！真奇怪！」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_3",
    "tag": "童謠兒歌",
    "title": "小星星",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=yCjJyiqpAuU",
    "youtubeId": "yCjJyiqpAuU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小星星",
      "搖籃曲",
      "當我們同在一起",
      "茉莉花"
    ],
    "clue": "莫札特《小星星變奏曲》旋律：「一閃一閃亮晶晶，滿天都是小星星」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_4",
    "tag": "童謠兒歌",
    "title": "當我們同在一起",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=7shHB9qGi4g",
    "youtubeId": "7shHB9qGi4g",
    "startTime": 0,
    "duration": 60,
    "options": [
      "當我們同在一起",
      "捕魚歌",
      "火車快飛",
      "大象"
    ],
    "clue": "「當我們同在一起，在一起，其快樂無比」，德國傳統民謠改編。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_5",
    "tag": "童謠兒歌",
    "title": "泥娃娃",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=v7zHNHIjnt8",
    "youtubeId": "v7zHNHIjnt8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "泥娃娃",
      "娃娃國",
      "兩隻老虎",
      "茉莉花"
    ],
    "clue": "「泥娃娃泥娃娃，一個泥娃娃，也有那眉毛也有那眼睛」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_6",
    "tag": "童謠兒歌",
    "title": "茉莉花",
    "artist": "中國民謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=jOqyaFORT0o",
    "youtubeId": "jOqyaFORT0o",
    "startTime": 20,
    "duration": 60,
    "options": [
      "茉莉花",
      "採茶歌",
      "鳳陽花鼓",
      "康定情歌"
    ],
    "clue": "「好一朵美麗的茉莉花，芬芳美麗滿枝椏，又香又白人人誇」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_7",
    "tag": "童謠兒歌",
    "title": "火車快飛",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=Cz92K_f1Jy8",
    "youtubeId": "Cz92K_f1Jy8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "火車快飛",
      "造飛機",
      "捕魚歌",
      "拔蘿蔔"
    ],
    "clue": "「火車快飛，火車快飛，穿過高山，越過小溪，不知跑了幾百里」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_8",
    "tag": "童謠兒歌",
    "title": "大象",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=TXGjZN_frO4",
    "youtubeId": "TXGjZN_frO4",
    "startTime": 0,
    "duration": 60,
    "options": [
      "大象",
      "小星星",
      "兩隻老虎",
      "拔蘿蔔"
    ],
    "clue": "「大象大象，你的鼻子怎麼那麼長？媽媽說鼻子長才是漂亮」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_9",
    "tag": "童謠兒歌",
    "title": "造飛機",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=Vk0K6WAPAB0",
    "youtubeId": "Vk0K6WAPAB0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "造飛機",
      "火車快飛",
      "大象",
      "泥娃娃"
    ],
    "clue": "「造飛機造飛機來到青草地，蹲下去蹲下去我做飛機翼」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_10",
    "tag": "童謠兒歌",
    "title": "捕魚歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=JLp1a-oo6aA",
    "youtubeId": "JLp1a-oo6aA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "捕魚歌",
      "當我們同在一起",
      "拔蘿蔔",
      "小毛驢"
    ],
    "clue": "「白浪滔滔我不怕，撐起舵兒往前划，撒網下水到魚家，捕條大魚笑哈哈」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_11",
    "tag": "童謠兒歌",
    "title": "娃娃國",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=h9iYhgzIc80",
    "youtubeId": "h9iYhgzIc80",
    "startTime": 0,
    "duration": 60,
    "options": [
      "娃娃國",
      "泥娃娃",
      "妹妹背著洋娃娃",
      "拔蘿蔔"
    ],
    "clue": "「娃娃國，娃娃兵，金髮藍眼睛；娃娃國王鬍子長，騎著木馬打勝仗」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_12",
    "tag": "童謠兒歌",
    "title": "妹妹背著洋娃娃",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=APJTpYsue1o",
    "youtubeId": "APJTpYsue1o",
    "startTime": 0,
    "duration": 60,
    "options": [
      "妹妹背著洋娃娃",
      "娃娃國",
      "泥娃娃",
      "小星星"
    ],
    "clue": "「妹妹背著洋娃娃，走到花園去看花，娃娃哭了叫媽媽，樹上小鳥笑哈哈」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_13",
    "tag": "童謠兒歌",
    "title": "小毛驢",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=qXIFsEGF4Gg",
    "youtubeId": "qXIFsEGF4Gg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小毛驢",
      "拔蘿蔔",
      "大象",
      "三隻小豬"
    ],
    "clue": "「我有一隻小毛驢我從來也不騎，有一天我心血來潮騎著去趕集」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_14",
    "tag": "童謠兒歌",
    "title": "三隻小豬",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=c3IteJjJz5c",
    "youtubeId": "c3IteJjJz5c",
    "startTime": 0,
    "duration": 60,
    "options": [
      "三隻小豬",
      "小毛驢",
      "拔蘿蔔",
      "大野狼"
    ],
    "clue": "敘述三隻小豬蓋稻草屋、木頭屋與磚頭屋對抗大野狼的著名寓言兒歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_15",
    "tag": "童謠兒歌",
    "title": "頭兒肩膀膝蓋腳",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=5-PCV5rVv8o",
    "youtubeId": "5-PCV5rVv8o",
    "startTime": 0,
    "duration": 60,
    "options": [
      "頭兒肩膀膝蓋腳",
      "握緊雙手又張開",
      "刷牙歌",
      "跳繩歌"
    ],
    "clue": "帶動唱第一神曲，「頭兒肩膀膝蓋腳，膝蓋腳，眼睛鼻子耳朵嘴」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_16",
    "tag": "童謠兒歌",
    "title": "伊比呀呀",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=GgsI5OVKH6M",
    "youtubeId": "GgsI5OVKH6M",
    "startTime": 0,
    "duration": 60,
    "options": [
      "伊比呀呀",
      "當我們同在一起",
      "拔蘿蔔",
      "倫敦鐵橋垮下來"
    ],
    "clue": "「伊比呀呀伊比伊比呀，伊比呀呀伊比伊比呀」，歡樂的互動團康律動曲。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_17",
    "tag": "童謠兒歌",
    "title": "倫敦鐵橋垮下來",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=qnhvTx0AAfM",
    "youtubeId": "qnhvTx0AAfM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "倫敦鐵橋垮下來",
      "王老先生有塊地",
      "瑪莉有隻小綿羊",
      "小星星"
    ],
    "clue": "英國傳統童謠，「倫敦鐵橋垮下來，垮下來，垮下來，倫敦鐵橋垮下來，就要垮下來」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_18",
    "tag": "童謠兒歌",
    "title": "王老先生有塊地",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=9wOp20L2t54",
    "youtubeId": "9wOp20L2t54",
    "startTime": 0,
    "duration": 60,
    "options": [
      "王老先生有塊地",
      "瑪莉有隻小綿羊",
      "倫敦鐵橋垮下來",
      "拔蘿蔔"
    ],
    "clue": "「王老先生有塊地呀，咿呀咿呀呦，他在田邊養小鴨呀，咿呀咿呀呦，呱呱」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_19",
    "tag": "童謠兒歌",
    "title": "瑪莉有隻小綿羊",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=3ans1AEVaVY",
    "youtubeId": "3ans1AEVaVY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "瑪莉有隻小綿羊",
      "王老先生有塊地",
      "醜小鴨",
      "小蜜蜂"
    ],
    "clue": "「瑪莉有隻小綿羊，小綿羊，小綿羊，牠的毛色白如雪」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_20",
    "tag": "童謠兒歌",
    "title": "醜小鴨",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=cIXEuLMDLy0",
    "youtubeId": "cIXEuLMDLy0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "醜小鴨",
      "大象",
      "造飛機",
      "春神來了"
    ],
    "clue": "「咕咕咕，醜小鴨，呱呱呱，長大變成白天鵝」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_21",
    "tag": "童謠兒歌",
    "title": "小蜜蜂",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=8Eox6Cnlcpk",
    "youtubeId": "8Eox6Cnlcpk",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小蜜蜂",
      "蝴蝶",
      "春神來了",
      "小星星"
    ],
    "clue": "「嗡嗡嗡，嗡嗡嗡，大家一起作工，來匆匆，去匆匆，做工趣味濃」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_22",
    "tag": "童謠兒歌",
    "title": "春神來了",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=WEGJwdIXeL0",
    "youtubeId": "WEGJwdIXeL0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "春神來了",
      "蝴蝶",
      "小蜜蜂",
      "茉莉花"
    ],
    "clue": "「春神來了怎知道？美麗的花兒朵朵開，紅的花綠的草，大地換新袍」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_23",
    "tag": "童謠兒歌",
    "title": "蝴蝶",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=qMc5wSIsYc8",
    "youtubeId": "qMc5wSIsYc8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "蝴蝶",
      "小蜜蜂",
      "春神來了",
      "小毛驢"
    ],
    "clue": "「蝴蝶蝴蝶生的真美麗，頭戴著金絲身穿花花衣，你飛在花叢裡，好像在跳舞」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_24",
    "tag": "童謠兒歌",
    "title": "西北雨直直落",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=rvzZZ9np9DI",
    "youtubeId": "rvzZZ9np9DI",
    "startTime": 0,
    "duration": 60,
    "options": [
      "西北雨直直落",
      "丟丟銅仔",
      "點仔膠",
      "天黑黑要落雨"
    ],
    "clue": "經典台灣本土念謠，「西北雨直直落，鯽仔魚欲娶某，鮕呆兄打鑼鼓」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_25",
    "tag": "童謠兒歌",
    "title": "丟丟銅仔",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=baRAM0RVhn8",
    "youtubeId": "baRAM0RVhn8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "丟丟銅仔",
      "西北雨直直落",
      "點仔膠",
      "火車快飛"
    ],
    "clue": "宜蘭民謠，火車穿過隧道時水滴落在鐵軌上的清脆聲音「火車行到伊都，阿末伊都丟」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_26",
    "tag": "童謠兒歌",
    "title": "點仔膠",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=bIWLCS7EWhI",
    "youtubeId": "bIWLCS7EWhI",
    "startTime": 0,
    "duration": 60,
    "options": [
      "點仔膠",
      "西北雨直直落",
      "丟丟銅仔",
      "虎姑婆"
    ],
    "clue": "「點仔膠，黏著腳，叫阿爸，買豬腳，豬腳箍，滾爛爛，餓鬼囝仔流嘴涎」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_27",
    "tag": "童謠兒歌",
    "title": "虎姑婆",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=7-gk5pO1g-I",
    "youtubeId": "7-gk5pO1g-I",
    "startTime": 0,
    "duration": 60,
    "options": [
      "虎姑婆",
      "泥娃娃",
      "拔蘿蔔",
      "點仔膠"
    ],
    "clue": "台灣傳說改編，「好孩子不要哭，虎姑婆會來咬耳朵」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_28",
    "tag": "童謠兒歌",
    "title": "天黑黑要落雨",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZOCqUC9a7wM",
    "youtubeId": "ZOCqUC9a7wM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "天黑黑要落雨",
      "西北雨直直落",
      "拔蘿蔔",
      "丟丟銅仔"
    ],
    "clue": "「天黑黑，要落雨，阿公仔舉鋤頭要掘芋，掘啊掘，掘著一尾旋鰡鼓」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_29",
    "tag": "童謠兒歌",
    "title": "白鷺鷥",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=mh_2JA6sh64",
    "youtubeId": "mh_2JA6sh64",
    "startTime": 0,
    "duration": 60,
    "options": [
      "白鷺鷥",
      "大象",
      "蝴蝶",
      "小蜜蜂"
    ],
    "clue": "「白鷺鷥，車畚箕，車到溝仔墘，跋一倒，抾著二仙錢」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_30",
    "tag": "童謠兒歌",
    "title": "十個印第安小朋友",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=1oUXG01bP0M",
    "youtubeId": "1oUXG01bP0M",
    "startTime": 0,
    "duration": 60,
    "options": [
      "十個印第安小朋友",
      "小星星",
      "頭兒肩膀膝蓋腳",
      "當我們同在一起"
    ],
    "clue": "「一個、兩個、三個印第安，四個、五個、六個印第安，七個、八個、九個印第安，十個印第安小朋友」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_31",
    "tag": "童謠兒歌",
    "title": "刷牙歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=4cOR6Bkc6zQ",
    "youtubeId": "4cOR6Bkc6zQ",
    "startTime": 0,
    "duration": 60,
    "options": [
      "刷牙歌",
      "頭兒肩膀膝蓋腳",
      "洗澡歌",
      "造飛機"
    ],
    "clue": "生活常規養成兒歌，「上上下下，左左右右，前前後後，刷得乾乾淨淨」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_32",
    "tag": "童謠兒歌",
    "title": "握緊雙手又張開",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=BR539vcmTeg",
    "youtubeId": "BR539vcmTeg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "握緊雙手又張開",
      "頭兒肩膀膝蓋腳",
      "當我們同在一起",
      "拔蘿蔔"
    ],
    "clue": "幼兒律動兒歌，「握緊雙手又張開，拍拍手呀放腿上」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_33",
    "tag": "童謠兒歌",
    "title": "跳繩歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=wyRVBKaBW6Y",
    "youtubeId": "wyRVBKaBW6Y",
    "startTime": 0,
    "duration": 60,
    "options": [
      "跳繩歌",
      "點仔膠",
      "拔蘿蔔",
      "捉泥鰍"
    ],
    "clue": "「小皮球，香蕉油，滿地開花二十一，二五六，二五七，二八二九三十一」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_34",
    "tag": "童謠兒歌",
    "title": "生日快樂歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=C0aECv8soHo",
    "youtubeId": "C0aECv8soHo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "生日快樂歌",
      "祝你幸福",
      "新年快樂",
      "當我們同在一起"
    ],
    "clue": "全世界傳唱率最高的慶祝歌，「祝你生日快樂，祝你生日快樂」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_35",
    "tag": "童謠兒歌",
    "title": "虹彩妹妹",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=RrRaf0jcNgw",
    "youtubeId": "RrRaf0jcNgw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "虹彩妹妹",
      "茉莉花",
      "鳳陽花鼓",
      "康定情歌"
    ],
    "clue": "綏遠民謠改編，「虹彩妹妹嗯哎嗨呦，長得好那麼嗯哎嗨呦」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_36",
    "tag": "童謠兒歌",
    "title": "鳳陽花鼓",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=C6txEhXXkJs",
    "youtubeId": "C6txEhXXkJs",
    "startTime": 0,
    "duration": 60,
    "options": [
      "鳳陽花鼓",
      "虹彩妹妹",
      "茉莉花",
      "康定情歌"
    ],
    "clue": "「左手鑼，右手鼓，手拿著鑼鼓來唱歌，別的歌兒我也不會唱，只會唱個鳳陽歌」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_37",
    "tag": "童謠兒歌",
    "title": "康定情歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=K6VhJlESchM",
    "youtubeId": "K6VhJlESchM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "康定情歌",
      "鳳陽花鼓",
      "茉莉花",
      "拔蘿蔔"
    ],
    "clue": "「跑馬溜溜的山上，一朵溜溜的雲喲，端端溜溜的照在，康定溜溜的城喲」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_38",
    "tag": "童謠兒歌",
    "title": "大拇指在哪裡",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=BIYea2-WeYA",
    "youtubeId": "BIYea2-WeYA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "大拇指在哪裡",
      "頭兒肩膀膝蓋腳",
      "握緊雙手又張開",
      "刷牙歌"
    ],
    "clue": "「大拇指在哪裡，大拇指在哪裡，我在這裡，我在這裡」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_39",
    "tag": "童謠兒歌",
    "title": "小天使",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=LG_JSMsL9YU",
    "youtubeId": "LG_JSMsL9YU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小天使",
      "無敵鐵金剛",
      "小甜甜",
      "小蜜蜂"
    ],
    "clue": "《阿爾卑斯山的少女》台灣中文主題曲，「高山上的小木屋，住著一個小女孩」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "kids_40",
    "tag": "童謠兒歌",
    "title": "無敵鐵金剛",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=Kq0SQF12R2Q",
    "youtubeId": "Kq0SQF12R2Q",
    "startTime": 0,
    "duration": 60,
    "options": [
      "無敵鐵金剛",
      "小天使",
      "科學小飛俠",
      "哆啦A夢之歌"
    ],
    "clue": "「無敵鐵金剛，無敵鐵金剛，無敵鐵～金～剛！指揮艇組合！」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "潑水歌",
    "artist": "童謠",
    "youtubeId": "hceZQbl9td4",
    "options": [
      "潑水歌",
      "洗澡歌",
      "刷牙歌",
      "健康歌"
    ],
    "clue": "「嚕啦啦 嚕啦啦 嚕啦嚕啦咧，嚕啦 嚕啦 嚕啦咧」，洗澡與夏日戲水必唱歡樂兒歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "數蛤蟆",
    "artist": "童謠",
    "youtubeId": "9PJ4w4pVG74",
    "options": [
      "數蛤蟆",
      "兩隻老虎",
      "點仔膠",
      "小蜜蜂"
    ],
    "clue": "「一隻蛤蟆一張嘴，兩隻眼睛四條腿，撲通跳下水……」，趣味數字饒舌兒歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "只要我長大",
    "artist": "童謠",
    "youtubeId": "sxRRt3aaA0c",
    "options": [
      "只要我長大",
      "造飛機",
      "娃娃國",
      "妹妹背著洋娃娃"
    ],
    "clue": "「哥哥爸爸真偉大，為國去打仗……當個大英雄」，激勵幼童立志的經典兒歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "藍色小精靈",
    "artist": "卡通兒歌",
    "youtubeId": "YX7Y63zOP5s",
    "options": [
      "藍色小精靈",
      "無敵鐵金剛",
      "小天使",
      "科學小飛俠"
    ],
    "clue": "「在那山的那邊海的那邊有一群藍精靈……」，陪伴無數台灣小朋友長大的經典卡通歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "小小世界",
    "artist": "迪士尼童謠",
    "youtubeId": "mA-kzgxvmNc",
    "options": [
      "小小世界",
      "當我們同在一起",
      "歡樂頌",
      "小星星"
    ],
    "clue": "迪士尼樂園最著名的招牌主題曲，「小小世界真奇妙，天天充滿歡笑……」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "母鴨帶小鴨",
    "artist": "童謠",
    "youtubeId": "XseKqCsQ24s",
    "options": [
      "母鴨帶小鴨",
      "醜小鴨",
      "小蜜蜂",
      "大象"
    ],
    "clue": "「呱呱呱呱 呱呱呱，母鴨帶小鴨，游過小溪又下坡……」，生動模仿鴨子叫聲。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "說哈囉",
    "artist": "童謠",
    "youtubeId": "tJ02uA90P80",
    "options": [
      "說哈囉",
      "當我們同在一起",
      "早安歌",
      "握緊雙手又張開"
    ],
    "clue": "幼兒園社交禮儀互動兒歌，「你招招手我點點頭，大家見面說哈囉！」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "點蟲蟲",
    "artist": "童謠",
    "youtubeId": "3D9nJXKYcmk",
    "options": [
      "點蟲蟲",
      "小蜜蜂",
      "蝴蝶",
      "點仔膠"
    ],
    "clue": "「點蟲蟲，點蟲蟲，飛入荔枝叢……」，手指謠與親子互動經典小品。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "小陀螺",
    "artist": "童謠",
    "youtubeId": "p8jzSTP_WZc",
    "options": [
      "小陀螺",
      "造飛機",
      "跳繩歌",
      "小火車"
    ],
    "clue": "「圓圓的身體尖尖的腳，轉轉轉，看誰轉得最久……」，傳統民俗童玩兒歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "我愛鄉村",
    "artist": "童謠",
    "youtubeId": "7Pwf17fd734",
    "options": [
      "我愛鄉村",
      "鄉間的小路",
      "捕魚歌",
      "外婆的澎湖灣"
    ],
    "clue": "「我愛鄉村，鄉村風景好，綠水青山花兒笑……」，描寫農村田園風光的優美兒歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "快樂的向前走",
    "artist": "童謠",
    "youtubeId": "BcbcBXpP3gA",
    "options": [
      "快樂的向前走",
      "火車快飛",
      "春神來了",
      "造飛機"
    ],
    "clue": "「一隻小鳥飛上天，兩隻小狗跑在前，快樂的向前走，不怕路途遙遠！」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "鐘聲響了",
    "artist": "童謠",
    "youtubeId": "ImV6ZKsiX7U",
    "options": [
      "鐘聲響了",
      "上學歌",
      "放學歌",
      "火車快飛"
    ],
    "clue": "「噹噹噹，噹噹噹，鐘聲響了，同學們快快進課堂……」，校園作息歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "聖誕鈴聲",
    "artist": "聖誕兒歌",
    "youtubeId": "DuESZSG1uw0",
    "options": [
      "聖誕鈴聲",
      "平安夜",
      "聖誕老人進城了",
      "祝你聖誕快樂"
    ],
    "clue": "改編自 Jingle Bells，「叮叮噹 叮叮噹 鈴聲多響亮，你看他呀不平常……」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "平安夜",
    "artist": "聖誕童謠",
    "youtubeId": "_oUphltpWQM",
    "options": [
      "平安夜",
      "聖誕鈴聲",
      "普世歡騰",
      "天使歌唱在高天"
    ],
    "clue": "世界最著名的聖誕寧靜搖籃曲，「平安夜，聖善夜，萬暗中，光華射……」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "甜蜜的家庭",
    "artist": "童謠",
    "youtubeId": "12EaTxpm-lc",
    "options": [
      "甜蜜的家庭",
      "我的朋友在哪裡",
      "當我們同在一起",
      "世上只有媽媽好"
    ],
    "clue": "改編自英國民謠 Home! Sweet Home!，「我的家庭真可愛，整潔美滿又安康……」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "小小鳥",
    "artist": "童謠",
    "youtubeId": "7TNSYs8N058",
    "options": [
      "小小鳥",
      "小燕子",
      "大象",
      "小蜜蜂"
    ],
    "clue": "「我是一隻小小鳥，飛在藍天中，唱著歌兒多快活……」，童趣動物歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "賣湯圓",
    "artist": "童謠",
    "youtubeId": "WX1rmkgPnsY",
    "options": [
      "賣湯圓",
      "賣糖葫蘆",
      "吃春捲",
      "過新年"
    ],
    "clue": "「賣湯圓，賣湯圓，小二哥的湯圓是圓又圓……」，元宵節最應景美食兒歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "划小船",
    "artist": "童謠 (英美經典)",
    "youtubeId": "7otAJa3jui8",
    "options": [
      "划小船",
      "王老先生有塊地",
      "BINGO",
      "小星星"
    ],
    "clue": "改編自《Row, Row, Row Your Boat》，輕快輪唱「划、划、划小船，輕輕過小溪……」。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "BINGO",
    "artist": "童謠 (英美經典)",
    "youtubeId": "9mmF8zOlh_g",
    "options": [
      "BINGO",
      "瑪莉有隻小綿羊",
      "王老先生有塊地",
      "十個印第安人"
    ],
    "clue": "農夫有一隻可愛小狗名叫 B-I-N-G-O，每唱一段少拍一個字母，超好玩拍手歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "tag": "童謠兒歌",
    "title": "小白兔",
    "artist": "童謠",
    "youtubeId": "1036Tzt5wbw",
    "options": [
      "小白兔",
      "拔蘿蔔",
      "小毛驢",
      "大象"
    ],
    "clue": "「小白兔，白又白，兩隻耳朵豎起來，愛吃蘿蔔愛吃菜……」，幼兒必學啟蒙兒歌。",
    "tags": [
      "童謠兒歌"
    ]
  },
  {
    "id": "western_love_1",
    "tag": "80~90年代西洋經典情歌",
    "title": "Careless Whisper",
    "artist": "George Michael",
    "youtubeUrl": "https://www.youtube.com/watch?v=izGwDsrQ1eQ",
    "youtubeId": "izGwDsrQ1eQ",
    "startTime": 18,
    "duration": 60,
    "options": [
      "Careless Whisper",
      "Last Christmas",
      "Faith",
      "One More Try"
    ],
    "clue": "George Michael 1984 年標誌性薩克斯風浪漫情歌，前奏薩克斯風無人不曉。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_2",
    "tag": "80~90年代西洋經典情歌",
    "title": "Right Here Waiting",
    "artist": "Richard Marx",
    "youtubeUrl": "https://www.youtube.com/watch?v=S_E2EHVxNAE",
    "youtubeId": "S_E2EHVxNAE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Right Here Waiting",
      "Hold On to the Nights",
      "Now and Forever",
      "Endless Summer Nights"
    ],
    "clue": "Richard Marx 1989 年深情鋼琴抒情金曲，經典副歌「Wherever you go, whatever you do...」傳唱全球。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_3",
    "tag": "80~90年代西洋經典情歌",
    "title": "I Will Always Love You",
    "artist": "Whitney Houston",
    "youtubeUrl": "https://www.youtube.com/watch?v=3JWTaaS7LdU",
    "youtubeId": "3JWTaaS7LdU",
    "startTime": 30,
    "duration": 60,
    "options": [
      "I Will Always Love You",
      "Greatest Love of All",
      "I Have Nothing",
      "Run to You"
    ],
    "clue": "惠妮休斯頓 1992 年電影《終極保鏢》主題曲，副歌高亢轉音堪稱流行樂壇天花板。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_4",
    "tag": "80~90年代西洋經典情歌",
    "title": "Nothing's Gonna Change My Love for You",
    "artist": "Glenn Medeiros",
    "youtubeUrl": "https://www.youtube.com/watch?v=MLxTEV5vpyg",
    "youtubeId": "MLxTEV5vpyg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Nothing's Gonna Change My Love for You",
      "Hard to Say I'm Sorry",
      "Say You, Say Me",
      "Can't Fight This Feeling"
    ],
    "clue": "Glenn Medeiros 1987 年深情對唱經典，「此情不渝」全球家喻戶曉的婚禮與表白神曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_5",
    "tag": "80~90年代西洋經典情歌",
    "title": "My Heart Will Go On",
    "artist": "Céline Dion",
    "youtubeUrl": "https://www.youtube.com/watch?v=WNIPqafd4As",
    "youtubeId": "WNIPqafd4As",
    "startTime": 20,
    "duration": 60,
    "options": [
      "My Heart Will Go On",
      "Because You Loved Me",
      "The Power of Love",
      "All by Myself"
    ],
    "clue": "席琳狄翁 1997 年電影《鐵達尼號》史詩主題曲「愛無止境」，悠揚愛爾蘭錫口笛前奏最為經典。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_6",
    "tag": "80~90年代西洋經典情歌",
    "title": "(Everything I Do) I Do It for You",
    "artist": "Bryan Adams",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y0pdQU87dc8",
    "youtubeId": "Y0pdQU87dc8",
    "startTime": 30,
    "duration": 60,
    "options": [
      "(Everything I Do) I Do It for You",
      "Heaven",
      "Please Forgive Me",
      "Summer of '69"
    ],
    "clue": "布萊恩亞當斯 1991 年電影《俠盜王子羅賓漢》主題曲，沙啞滄桑的深情搖滾抒情名作。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_7",
    "tag": "80~90年代西洋經典情歌",
    "title": "Can You Feel the Love Tonight",
    "artist": "Elton John",
    "youtubeUrl": "https://www.youtube.com/watch?v=KjgWWjkNbhU",
    "youtubeId": "KjgWWjkNbhU",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Can You Feel the Love Tonight",
      "Your Song",
      "Circle of Life",
      "Candle in the Wind"
    ],
    "clue": "艾爾頓強 1994 年迪士尼動畫長片《獅子王》主題曲，榮獲奧斯卡最佳原創歌曲獎。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_8",
    "tag": "80~90年代西洋經典情歌",
    "title": "Endless Love",
    "artist": "Lionel Richie & Diana Ross",
    "youtubeUrl": "https://www.youtube.com/watch?v=7Bwwo7ctG10",
    "youtubeId": "7Bwwo7ctG10",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Endless Love",
      "Hello",
      "Say You, Say Me",
      "Truly"
    ],
    "clue": "萊諾李奇與黛安娜羅斯 1981 年合唱的《無盡的愛》，被評為告示牌史上最偉大抒情對唱歌曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_9",
    "tag": "80~90年代西洋經典情歌",
    "title": "Without You",
    "artist": "Mariah Carey",
    "youtubeUrl": "https://www.youtube.com/watch?v=Hat1Hc9SNwE",
    "youtubeId": "Hat1Hc9SNwE",
    "startTime": 30,
    "duration": 60,
    "options": [
      "Without You",
      "Hero",
      "Vision of Love",
      "Always Be My Baby"
    ],
    "clue": "瑪麗亞凱莉 1994 年翻唱的靈魂情歌「失去你」，副歌震撼人心的海豚音與寬廣音域震撼樂壇。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_10",
    "tag": "80~90年代西洋經典情歌",
    "title": "Take My Breath Away",
    "artist": "Berlin",
    "youtubeUrl": "https://www.youtube.com/watch?v=fUis9yny_lI",
    "youtubeId": "fUis9yny_lI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Take My Breath Away",
      "Danger Zone",
      "Eternal Flame",
      "Total Eclipse of the Heart"
    ],
    "clue": "柏林樂團 1986 年湯姆克魯斯主演電影《捍衛戰士 (Top Gun)》浪漫插曲，奧斯卡最佳原創歌曲得主。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_11",
    "tag": "80~90年代西洋經典情歌",
    "title": "Every Breath You Take",
    "artist": "The Police",
    "youtubeUrl": "https://www.youtube.com/watch?v=OMOGaugKpzs",
    "youtubeId": "OMOGaugKpzs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Every Breath You Take",
      "Roxanne",
      "Message in a Bottle",
      "Fields of Gold"
    ],
    "clue": "警察樂隊 1983 年稱霸告示牌 8 週冠軍神曲，Sting 標誌性的深情嗓音與吉他分解和弦。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_12",
    "tag": "80~90年代西洋經典情歌",
    "title": "Total Eclipse of the Heart",
    "artist": "Bonnie Tyler",
    "youtubeUrl": "https://www.youtube.com/watch?v=lcOxhH8N3Bo",
    "youtubeId": "lcOxhH8N3Bo",
    "startTime": 25,
    "duration": 60,
    "options": [
      "Total Eclipse of the Heart",
      "Holding Out for a Hero",
      "It's a Heartache",
      "Lost in France"
    ],
    "clue": "邦妮泰勒 1983 年震撼樂壇的搖滾情歌「全蝕之心」，滄桑沙啞嗓音爆發力十足。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_13",
    "tag": "80~90年代西洋經典情歌",
    "title": "Time After Time",
    "artist": "Cyndi Lauper",
    "youtubeUrl": "https://www.youtube.com/watch?v=VdQY7BusJNU",
    "youtubeId": "VdQY7BusJNU",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Time After Time",
      "Girls Just Want to Have Fun",
      "True Colors",
      "All Through the Night"
    ],
    "clue": "辛蒂羅波 1983 年真摯動人的抒情經典，副歌「If you're lost, you can look and you will find me」傳唱不衰。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_14",
    "tag": "80~90年代西洋經典情歌",
    "title": "Against All Odds (Take a Look at Me Now)",
    "artist": "Phil Collins",
    "youtubeUrl": "https://www.youtube.com/watch?v=FLy7dxC3nTo",
    "youtubeId": "FLy7dxC3nTo",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Against All Odds (Take a Look at Me Now)",
      "In the Air Tonight",
      "Another Day in Paradise",
      "One More Night"
    ],
    "clue": "菲爾柯林斯 1984 年電影《再看我一眼》奧斯卡提名主題曲，深情鋼琴彈奏與撕心裂肺的呼喚。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_15",
    "tag": "80~90年代西洋經典情歌",
    "title": "Hello",
    "artist": "Lionel Richie",
    "youtubeUrl": "https://www.youtube.com/watch?v=mHONNcZbwDY",
    "youtubeId": "mHONNcZbwDY",
    "startTime": 25,
    "duration": 60,
    "options": [
      "Hello",
      "Say You, Say Me",
      "Truly",
      "Endless Love"
    ],
    "clue": "萊諾李奇 1984 年深情巨作，「Hello, is it me you're looking for?」經典告白問候語名留流行史。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_16",
    "tag": "80~90年代西洋經典情歌",
    "title": "I Want to Know What Love Is",
    "artist": "Foreigner",
    "youtubeUrl": "https://www.youtube.com/watch?v=loWXMtjUZWM",
    "youtubeId": "loWXMtjUZWM",
    "startTime": 30,
    "duration": 60,
    "options": [
      "I Want to Know What Love Is",
      "Waiting for a Girl Like You",
      "Cold as Ice",
      "Feels Like the First Time"
    ],
    "clue": "外國人合唱團 1984 年福音色彩濃厚的抒情搖滾冠軍名曲，福音唱詩班合唱氣勢澎湃。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_17",
    "tag": "80~90年代西洋經典情歌",
    "title": "Hard to Say I'm Sorry",
    "artist": "Chicago",
    "youtubeUrl": "https://www.youtube.com/watch?v=pvxotwpM-_c",
    "youtubeId": "pvxotwpM-_c",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Hard to Say I'm Sorry",
      "You're the Inspiration",
      "Look Away",
      "If You Leave Me Now"
    ],
    "clue": "芝加哥樂團 1982 年「難以開口說抱歉」，Peter Cetera 優雅動聽的假音與優雅鋼琴引領流行樂潮。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_18",
    "tag": "80~90年代西洋經典情歌",
    "title": "Saving All My Love for You",
    "artist": "Whitney Houston",
    "youtubeUrl": "https://www.youtube.com/watch?v=ewxmv2tyeRs",
    "youtubeId": "ewxmv2tyeRs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Saving All My Love for You",
      "Greatest Love of All",
      "How Will I Know",
      "I Will Always Love You"
    ],
    "clue": "惠妮休斯頓 1985 年首支全美告示牌冠軍抒情曲，薩克斯風伴奏與純熟藍調唱腔一戰封神。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_19",
    "tag": "80~90年代西洋經典情歌",
    "title": "Say You, Say Me",
    "artist": "Lionel Richie",
    "youtubeUrl": "https://www.youtube.com/watch?v=WX3-VHIZ7_8",
    "youtubeId": "WX3-VHIZ7_8",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Say You, Say Me",
      "All Night Long",
      "Hello",
      "Stuck on You"
    ],
    "clue": "萊諾李奇 1985 年電影《飛越蘇聯 (White Nights)》主題曲，勇奪奧斯卡與金球獎最佳原創歌曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_20",
    "tag": "80~90年代西洋經典情歌",
    "title": "Eternal Flame",
    "artist": "The Bangles",
    "youtubeUrl": "https://www.youtube.com/watch?v=PSoOFn3wQV4",
    "youtubeId": "PSoOFn3wQV4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Eternal Flame",
      "Manic Monday",
      "Walk Like an Egyptian",
      "In Your Room"
    ],
    "clue": "手鐲合唱團 1988 年浪漫經典「永恆之火」，主唱 Susanna Hoffs 清新甜美的歌聲撥動無數心弦。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_21",
    "tag": "80~90年代西洋經典情歌",
    "title": "More Than Words",
    "artist": "Extreme",
    "youtubeUrl": "https://www.youtube.com/watch?v=UrIiLvg58SY",
    "youtubeId": "UrIiLvg58SY",
    "startTime": 20,
    "duration": 60,
    "options": [
      "More Than Words",
      "Hole Hearted",
      "Get the Funk Out",
      "Rest in Peace"
    ],
    "clue": "極限樂團 1990 年雙人木吉他抒情名作，純粹原聲吉他彈奏與唯美雙人和聲紅遍大街小巷。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_22",
    "tag": "80~90年代西洋經典情歌",
    "title": "Unchained Melody",
    "artist": "The Righteous Brothers",
    "youtubeUrl": "https://www.youtube.com/watch?v=IYj2hex99gY",
    "youtubeId": "IYj2hex99gY",
    "startTime": 25,
    "duration": 60,
    "options": [
      "Unchained Melody",
      "You've Lost That Lovin' Feelin'",
      "Soul and Inspiration",
      "Ebb Tide"
    ],
    "clue": "正義兄弟「奔放的旋律」，1990 年隨電影《第六感生死戀 (Ghost)》陶藝經典橋段再次風靡全球。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_23",
    "tag": "80~90年代西洋經典情歌",
    "title": "Tears in Heaven",
    "artist": "Eric Clapton",
    "youtubeUrl": "https://www.youtube.com/watch?v=JxPj3GAYYZ0",
    "youtubeId": "JxPj3GAYYZ0",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Tears in Heaven",
      "Wonderful Tonight",
      "Layla",
      "Change the World"
    ],
    "clue": "艾力克克萊普頓 1992 年寫給早逝幼子的悼念情歌「淚灑天堂」，橫掃第 35 屆葛萊美六項大獎。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_24",
    "tag": "80~90年代西洋經典情歌",
    "title": "Hero",
    "artist": "Mariah Carey",
    "youtubeUrl": "https://www.youtube.com/watch?v=0IA3ZvCkRkQ",
    "youtubeId": "0IA3ZvCkRkQ",
    "startTime": 30,
    "duration": 60,
    "options": [
      "Hero",
      "Vision of Love",
      "Without You",
      "One Sweet Day"
    ],
    "clue": "瑪麗亞凱莉 1993 年撫慰無數靈魂的勵志情歌「英雄」，展現無懈可擊的歌唱共鳴與感染力。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_25",
    "tag": "80~90年代西洋經典情歌",
    "title": "I Swear",
    "artist": "All-4-One",
    "youtubeUrl": "https://www.youtube.com/watch?v=Nu9RVPTpDyA",
    "youtubeId": "Nu9RVPTpDyA",
    "startTime": 20,
    "duration": 60,
    "options": [
      "I Swear",
      "I Can Love You Like That",
      "So Much in Love",
      "I Will Be Right Here"
    ],
    "clue": "全能四人行 1994 年男子美聲合唱經典「我發誓」，告示牌蟬聯 11 週冠軍並獲葛萊美獎肯定。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_26",
    "tag": "80~90年代西洋經典情歌",
    "title": "Always",
    "artist": "Bon Jovi",
    "youtubeUrl": "https://www.youtube.com/watch?v=9BMwcO6_hyA",
    "youtubeId": "9BMwcO6_hyA",
    "startTime": 30,
    "duration": 60,
    "options": [
      "Always",
      "Livin' on a Prayer",
      "Bed of Roses",
      "It's My Life"
    ],
    "clue": "邦喬飛 1994 年狂銷數百萬張的強力抒情搖滾代表作，副歌激情嘶吼傾訴永恆的愛意。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_27",
    "tag": "80~90年代西洋經典情歌",
    "title": "Because You Loved Me",
    "artist": "Céline Dion",
    "youtubeUrl": "https://www.youtube.com/watch?v=fpl4if07ics",
    "youtubeId": "fpl4if07ics",
    "startTime": 25,
    "duration": 60,
    "options": [
      "Because You Loved Me",
      "The Power of Love",
      "My Heart Will Go On",
      "It's All Coming Back to Me Now"
    ],
    "clue": "席琳狄翁 1996 年電影《因為你愛過我 (Up Close & Personal)》主題曲，告示牌 6 週冠軍巨作。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_28",
    "tag": "80~90年代西洋經典情歌",
    "title": "Truly Madly Deeply",
    "artist": "Savage Garden",
    "youtubeUrl": "https://www.youtube.com/watch?v=WQnAxOQxQIU",
    "youtubeId": "WQnAxOQxQIU",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Truly Madly Deeply",
      "I Knew I Loved You",
      "To the Moon and Back",
      "Crash and Burn"
    ],
    "clue": "野人花園 1997 年澳洲雙人組風靡全球的純情之作「真誠地、瘋狂地、深刻地」，浪漫指數破表。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_29",
    "tag": "80~90年代西洋經典情歌",
    "title": "As Long as You Love Me",
    "artist": "Backstreet Boys",
    "youtubeUrl": "https://www.youtube.com/watch?v=0Gl2QnHNpkA",
    "youtubeId": "0Gl2QnHNpkA",
    "startTime": 20,
    "duration": 60,
    "options": [
      "As Long as You Love Me",
      "I Want It That Way",
      "Quit Playing Games (With My Heart)",
      "Show Me the Meaning of Being Lonely"
    ],
    "clue": "新好男孩 1997 年席捲全球青少年的招牌抒情代表作，只要你愛我，不管你是誰、來自何方。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_30",
    "tag": "80~90年代西洋經典情歌",
    "title": "How Do I Live",
    "artist": "LeAnn Rimes",
    "youtubeUrl": "https://www.youtube.com/watch?v=MUFasKZcH_c",
    "youtubeId": "MUFasKZcH_c",
    "startTime": 25,
    "duration": 60,
    "options": [
      "How Do I Live",
      "Can't Fight the Moonlight",
      "Blue",
      "I Need You"
    ],
    "clue": "黎安萊姆絲 1997 年電影《空中監獄 (Con Air)》主題曲，在告示牌百大榜創下留榜 69 週傳奇記錄。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_31",
    "tag": "80~90年代西洋經典情歌",
    "title": "I Want It That Way",
    "artist": "Backstreet Boys",
    "youtubeUrl": "https://www.youtube.com/watch?v=4fndeDfaWCg",
    "youtubeId": "4fndeDfaWCg",
    "startTime": 20,
    "duration": 60,
    "options": [
      "I Want It That Way",
      "As Long as You Love Me",
      "Quit Playing Games",
      "Show Me the Meaning of Being Lonely"
    ],
    "clue": "Backstreet Boys 1999 年千禧年流行天團最震撼招牌情歌，副歌一出全球合唱。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_32",
    "tag": "80~90年代西洋經典情歌",
    "title": "I'll Make Love to You",
    "artist": "Boyz II Men",
    "youtubeUrl": "https://www.youtube.com/watch?v=fV8vB1BB2qc",
    "youtubeId": "fV8vB1BB2qc",
    "startTime": 24,
    "duration": 60,
    "options": [
      "I'll Make Love to You",
      "End of the Road",
      "One Sweet Day",
      "On Bended Knee"
    ],
    "clue": "Boyz II Men 1994 年蟬聯告示牌14週冠軍的R&B浪漫巔峰情歌。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_33",
    "tag": "80~90年代西洋經典情歌",
    "title": "End of the Road",
    "artist": "Boyz II Men",
    "youtubeUrl": "https://www.youtube.com/watch?v=zDKO6XYXioc",
    "youtubeId": "zDKO6XYXioc",
    "startTime": 30,
    "duration": 60,
    "options": [
      "End of the Road",
      "I'll Make Love to You",
      "Water Runs Dry",
      "Motownphilly"
    ],
    "clue": "Boyz II Men 1992 年打破告示牌歷史記錄、連續13週冠軍的失戀經典神曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_34",
    "tag": "80~90年代西洋經典情歌",
    "title": "You're Still the One",
    "artist": "Shania Twain",
    "youtubeUrl": "https://www.youtube.com/watch?v=KNZH-emehxA",
    "youtubeId": "KNZH-emehxA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "You're Still the One",
      "From This Moment On",
      "Man! I Feel Like a Woman!",
      "That Don't Impress Me Much"
    ],
    "clue": "Shania Twain 1998 年席捲全球的鄉村流行真愛宣言，獲葛萊美雙料大獎。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_35",
    "tag": "80~90年代西洋經典情歌",
    "title": "To Be with You",
    "artist": "Mr. Big",
    "youtubeUrl": "https://www.youtube.com/watch?v=L6-uJLteKek",
    "youtubeId": "L6-uJLteKek",
    "startTime": 14,
    "duration": 60,
    "options": [
      "To Be with You",
      "Just Take My Heart",
      "Wild World",
      "Green-Tinted Sixties Mind"
    ],
    "clue": "Mr. Big 1991 年木吉他與動人和聲告示牌3週冠軍搖滾抒情名曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_36",
    "tag": "80~90年代西洋經典情歌",
    "title": "Un-Break My Heart",
    "artist": "Toni Braxton",
    "youtubeUrl": "https://www.youtube.com/watch?v=p2Rch6WvPJE",
    "youtubeId": "p2Rch6WvPJE",
    "startTime": 32,
    "duration": 60,
    "options": [
      "Un-Break My Heart",
      "Breathe Again",
      "You're Makin' Me High",
      "Another Sad Love Song"
    ],
    "clue": "Toni Braxton 1996 年告示牌11週冠軍，90年代最具穿透力的傷心情歌。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_37",
    "tag": "80~90年代西洋經典情歌",
    "title": "I Don't Want to Miss a Thing",
    "artist": "Aerosmith",
    "youtubeUrl": "https://www.youtube.com/watch?v=JkK8g6FMEXE",
    "youtubeId": "JkK8g6FMEXE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "I Don't Want to Miss a Thing",
      "Dream On",
      "Crazy",
      "Cryin'"
    ],
    "clue": "史密斯飛船 (Aerosmith) 1998 年電影《世界末日》(Armageddon) 磅礴同名主題曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_38",
    "tag": "80~90年代西洋經典情歌",
    "title": "Kiss from a Rose",
    "artist": "Seal",
    "youtubeUrl": "https://www.youtube.com/watch?v=w7y19ED6Vrk",
    "youtubeId": "w7y19ED6Vrk",
    "startTime": 22,
    "duration": 60,
    "options": [
      "Kiss from a Rose",
      "Crazy",
      "Fly Like an Eagle",
      "Prayer for the Dying"
    ],
    "clue": "席爾 (Seal) 1994 年電影《蝙蝠俠3》主題曲，狂攬葛萊美年度唱片、年度歌曲等大獎。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_39",
    "tag": "80~90年代西洋經典情歌",
    "title": "When a Man Loves a Woman",
    "artist": "Michael Bolton",
    "youtubeUrl": "https://www.youtube.com/watch?v=MUuNDb-nm5M",
    "youtubeId": "MUuNDb-nm5M",
    "startTime": 25,
    "duration": 60,
    "options": [
      "When a Man Loves a Woman",
      "How Am I Supposed to Live Without You",
      "Said I Loved You...But I Lied",
      "Go the Distance"
    ],
    "clue": "麥可·波頓 (Michael Bolton) 1991 年嘶啞深情重新詮釋告示牌奪冠情歌。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_40",
    "tag": "80~90年代西洋經典情歌",
    "title": "Wind Beneath My Wings",
    "artist": "Bette Midler",
    "youtubeUrl": "https://www.youtube.com/watch?v=0iAzMRKFX3c",
    "youtubeId": "0iAzMRKFX3c",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Wind Beneath My Wings",
      "The Rose",
      "From a Distance",
      "Stay with Me"
    ],
    "clue": "貝蒂·蜜勒 (Bette Midler) 1988 年電影《情比姊妹深》催淚主題曲，獲葛萊美年度歌曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_41",
    "tag": "80~90年代西洋經典情歌",
    "title": "Can't Fight This Feeling",
    "artist": "REO Speedwagon",
    "youtubeUrl": "https://www.youtube.com/watch?v=zpOULjyy-n8",
    "youtubeId": "zpOULjyy-n8",
    "startTime": 18,
    "duration": 60,
    "options": [
      "Can't Fight This Feeling",
      "Keep On Loving You",
      "Take It on the Run",
      "In My Dreams"
    ],
    "clue": "REO Speedwagon 1984 年告示牌3週冠軍抒情搖滾代表作，講述友情轉為愛情的真心告白。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_42",
    "tag": "80~90年代西洋經典情歌",
    "title": "The Power of Love",
    "artist": "Céline Dion",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y8HOfcYWZoo",
    "youtubeId": "Y8HOfcYWZoo",
    "startTime": 30,
    "duration": 60,
    "options": [
      "The Power of Love",
      "Because You Loved Me",
      "My Heart Will Go On",
      "It's All Coming Back to Me Now"
    ],
    "clue": "席琳·狄翁 1993 年首支告示牌4週冠軍單曲，展現令人嘆為觀止的極致唱功。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_43",
    "tag": "80~90年代西洋經典情歌",
    "title": "Open Arms",
    "artist": "Journey",
    "youtubeUrl": "https://www.youtube.com/watch?v=i5pUOVC50Y8",
    "youtubeId": "i5pUOVC50Y8",
    "startTime": 18,
    "duration": 60,
    "options": [
      "Open Arms",
      "Don't Stop Believin'",
      "Faithfully",
      "Separate Ways"
    ],
    "clue": "Journey 合唱團 1981 年告示牌連續6週亞軍，80年代最具代表性的力量情歌。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_44",
    "tag": "80~90年代西洋經典情歌",
    "title": "It Must Have Been Love",
    "artist": "Roxette",
    "youtubeUrl": "https://www.youtube.com/watch?v=k2C5TjS2sh4",
    "youtubeId": "k2C5TjS2sh4",
    "startTime": 20,
    "duration": 60,
    "options": [
      "It Must Have Been Love",
      "Listen to Your Heart",
      "Joyride",
      "The Look"
    ],
    "clue": "羅克賽 (Roxette) 1990 年電影《麻雀變鳳凰》(Pretty Woman) 告示牌冠軍插曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_45",
    "tag": "80~90年代西洋經典情歌",
    "title": "Making Love Out of Nothing at All",
    "artist": "Air Supply",
    "youtubeUrl": "https://www.youtube.com/watch?v=OJsqFcXQ3hI",
    "youtubeId": "OJsqFcXQ3hI",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Making Love Out of Nothing at All",
      "Lost in Love",
      "All Out of Love",
      "Goodbye"
    ],
    "clue": "空中補給 (Air Supply) 1983 年高音穿透力十足的經典情歌代表作。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_46",
    "tag": "80~90年代西洋經典情歌",
    "title": "Lost in Love",
    "artist": "Air Supply",
    "youtubeUrl": "https://www.youtube.com/watch?v=fKTQVBnXrZs",
    "youtubeId": "fKTQVBnXrZs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Lost in Love",
      "Even the Nights Are Better",
      "Here I Am",
      "Every Woman in the World"
    ],
    "clue": "空中補給 1980 年敲開美國市場大門的成名抒情民謠代表作。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_47",
    "tag": "80~90年代西洋經典情歌",
    "title": "Longer",
    "artist": "Dan Fogelberg",
    "youtubeUrl": "https://www.youtube.com/watch?v=KfsW28jKoqo",
    "youtubeId": "KfsW28jKoqo",
    "startTime": 10,
    "duration": 60,
    "options": [
      "Longer",
      "Leader of the Band",
      "Same Old Lang Syne",
      "Run for the Roses"
    ],
    "clue": "丹·佛格伯 1979/1980 年無數婚禮必備的清澈吉他浪漫民謠名曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_48",
    "tag": "80~90年代西洋經典情歌",
    "title": "A Whole New World",
    "artist": "Peabo Bryson & Regina Belle",
    "youtubeUrl": "https://www.youtube.com/watch?v=1SfRCY-f2DU",
    "youtubeId": "1SfRCY-f2DU",
    "startTime": 25,
    "duration": 60,
    "options": [
      "A Whole New World",
      "Beauty and the Beast",
      "Can You Feel the Love Tonight",
      "Colors of the Wind"
    ],
    "clue": "1992 年迪士尼動畫《阿拉丁》主題曲，獲奧斯卡最佳原創歌曲與葛萊美年度歌曲。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_49",
    "tag": "80~90年代西洋經典情歌",
    "title": "Save the Best for Last",
    "artist": "Vanessa Williams",
    "youtubeUrl": "https://www.youtube.com/watch?v=5EdmHSTwmWY",
    "youtubeId": "5EdmHSTwmWY",
    "startTime": 20,
    "duration": 60,
    "options": [
      "Save the Best for Last",
      "Colors of the Wind",
      "Love Is",
      "Sweetest Days"
    ],
    "clue": "凡妮莎·威廉斯 1992 年告示牌5週冠軍抒情名曲「把最好的留在最後」。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "western_love_50",
    "tag": "80~90年代西洋經典情歌",
    "title": "All My Life",
    "artist": "K-Ci & JoJo",
    "youtubeUrl": "https://www.youtube.com/watch?v=DXvMT_mVbqw",
    "youtubeId": "DXvMT_mVbqw",
    "startTime": 25,
    "duration": 60,
    "options": [
      "All My Life",
      "Tell Me It's Real",
      "Crazy",
      "Never Say Never Again"
    ],
    "clue": "K-Ci & JoJo 1998 年鋼琴開頭席捲全美告示牌3週冠軍的婚禮誓言情歌。",
    "tags": [
      "80~90年代西洋經典情歌"
    ]
  },
  {
    "id": "movie_theme_1",
    "tag": "歷年經典國片主題曲",
    "title": "國境之南",
    "artist": "范逸臣",
    "youtubeUrl": "https://www.youtube.com/watch?v=oyQZg2X_cd0",
    "youtubeId": "oyQZg2X_cd0",
    "startTime": 25,
    "duration": 60,
    "options": [
      "國境之南",
      "無樂不作",
      "野玫瑰",
      "留下來的人"
    ],
    "clue": "2008 年創下台灣影史票房奇蹟電影《海角七號》深情主題曲，榮獲金馬獎最佳原創電影歌曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_2",
    "tag": "歷年經典國片主題曲",
    "title": "那些年",
    "artist": "胡夏",
    "youtubeUrl": "https://www.youtube.com/watch?v=KqjgLbKZ1h0",
    "youtubeId": "KqjgLbKZ1h0",
    "startTime": 30,
    "duration": 60,
    "options": [
      "那些年",
      "人海中遇見你",
      "孩子氣",
      "寂寞的咖啡因"
    ],
    "clue": "2011 年九把刀同名小說改編電影《那些年，我們一起追的女孩》青春主題曲，喚起無數人青澀回憶。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_3",
    "tag": "歷年經典國片主題曲",
    "title": "小幸運",
    "artist": "田馥甄 (Hebe)",
    "youtubeUrl": "https://www.youtube.com/watch?v=HDMQuMJ4MSk",
    "youtubeId": "HDMQuMJ4MSk",
    "startTime": 40,
    "duration": 60,
    "options": [
      "小幸運",
      "不為誰而作的歌",
      "愛著愛著就永遠",
      "魔鬼中的天使"
    ],
    "clue": "2015 年校園愛情青春電影《我的少女時代》主題曲，YouTube 破億點閱之超人氣國民情歌。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_4",
    "tag": "歷年經典國片主題曲",
    "title": "有一種悲傷",
    "artist": "A-Lin",
    "youtubeUrl": "https://www.youtube.com/watch?v=BRcudpJzy1I",
    "youtubeId": "BRcudpJzy1I",
    "startTime": 30,
    "duration": 60,
    "options": [
      "有一種悲傷",
      "給我一個理由忘記",
      "幸福了 然後呢",
      "失戀無罪"
    ],
    "clue": "2018 年虐心催淚國片《比悲傷更悲傷的故事》主題曲，A-Lin 醇厚飽滿嗓音唱哭全台觀眾。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_5",
    "tag": "歷年經典國片主題曲",
    "title": "刻在我心底的名字",
    "artist": "盧廣仲",
    "youtubeUrl": "https://www.youtube.com/watch?v=m78lJuzftcc",
    "youtubeId": "m78lJuzftcc",
    "startTime": 30,
    "duration": 60,
    "options": [
      "刻在我心底的名字",
      "幾分之幾",
      "魚仔",
      "大人中"
    ],
    "clue": "2020 年台灣青春同志劇情片《刻在你心底的名字》主題曲，囊括第 57 屆金馬獎與金曲獎年度歌曲獎。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_6",
    "tag": "經典台語, 歷年經典國片主題曲",
    "title": "愛情你比我想的閣較偉大",
    "artist": "茄子蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=0rp3pP2Xwhs",
    "youtubeId": "0rp3pP2Xwhs",
    "startTime": 25,
    "duration": 60,
    "options": [
      "愛情你比我想的閣較偉大",
      "浪子回頭",
      "浪流連",
      "日常"
    ],
    "clue": "2021 年邱澤主演賣座國片《當男人戀愛時》主題曲，極具感染力的道地台式搖滾風情。",
    "tags": [
      "經典台語",
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_7",
    "tag": "歷年經典國片主題曲",
    "title": "如果可以",
    "artist": "韋禮安",
    "youtubeUrl": "https://www.youtube.com/watch?v=8MG--WuNW1Y",
    "youtubeId": "8MG--WuNW1Y",
    "startTime": 35,
    "duration": 60,
    "options": [
      "如果可以",
      "女孩",
      "還是會",
      "慢慢等"
    ],
    "clue": "2021 年九把刀執導奇幻愛情國片《月老》主題曲，紅遍台日韓入圍金馬獎最佳原創電影歌曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_8",
    "tag": "歷年經典國片主題曲",
    "title": "酒矸倘賣無",
    "artist": "蘇芮",
    "youtubeUrl": "https://www.youtube.com/watch?v=HhO7NqVLLFc",
    "youtubeId": "HhO7NqVLLFc",
    "startTime": 20,
    "duration": 60,
    "options": [
      "酒矸倘賣無",
      "一樣的月光",
      "是否",
      "請跟我來"
    ],
    "clue": "1983 年虞戡平導演經典歌舞感人國片《搭錯車》主題曲，蘇芮以黑衣搖滾之姿掀起樂壇革命。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_9",
    "tag": "歷年經典國片主題曲",
    "title": "魯冰花",
    "artist": "曾淑勤",
    "youtubeUrl": "https://www.youtube.com/watch?v=i6ZLtqoDE4k",
    "youtubeId": "i6ZLtqoDE4k",
    "startTime": 15,
    "duration": 60,
    "options": [
      "魯冰花",
      "情生意動",
      "微風往事",
      "客途秋恨"
    ],
    "clue": "1989 年楊立國導演催淚經典國片《魯冰花》同名主題曲，「夜夜想起媽媽的話，閃閃的淚光魯冰花」。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_10",
    "tag": "歷年經典國片主題曲",
    "title": "不能說的秘密",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=C6dO6hCunTA",
    "youtubeId": "C6dO6hCunTA",
    "startTime": 30,
    "duration": 60,
    "options": [
      "不能說的秘密",
      "蒲公英的約定",
      "晴天",
      "彩虹"
    ],
    "clue": "2007 年周杰倫首部自編自導自演純愛奇幻國片《不能說的·秘密》同名主題曲，英倫搖滾風格名作。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_11",
    "tag": "歷年經典國片主題曲",
    "title": "一樣的月光",
    "artist": "蘇芮",
    "youtubeUrl": "https://www.youtube.com/watch?v=dqcoG9LUzgE",
    "youtubeId": "dqcoG9LUzgE",
    "startTime": 30,
    "duration": 60,
    "options": [
      "一樣的月光",
      "酒矸倘賣無",
      "是否",
      "請跟我來"
    ],
    "clue": "1983 年電影《搭錯車》插曲，吳念真、羅大佑填詞，李壽全作曲，蘇芮高亢爆發力嗓音震撼華語樂壇。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_12",
    "tag": "歷年經典國片主題曲",
    "title": "亞細亞的孤兒",
    "artist": "羅大佑",
    "youtubeUrl": "https://www.youtube.com/watch?v=2fqhfVBjeso",
    "youtubeId": "2fqhfVBjeso",
    "startTime": 25,
    "duration": 60,
    "options": [
      "亞細亞的孤兒",
      "童年",
      "鹿港小鎮",
      "戀曲1990"
    ],
    "clue": "1990 年朱延平導演感人歷史戰爭國片《異域》片尾主題曲，嗩吶與孩童合唱深刻詮釋孤軍悲歌。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_13",
    "tag": "歷年經典國片主題曲",
    "title": "追夢人",
    "artist": "鳳飛飛",
    "youtubeUrl": "https://www.youtube.com/watch?v=JvQkhr3CWsI",
    "youtubeId": "JvQkhr3CWsI",
    "startTime": 20,
    "duration": 60,
    "options": [
      "追夢人",
      "掌聲響起",
      "流水年華",
      "祝你幸福"
    ],
    "clue": "1990 年電影《天若有情 (追夢人)》主題曲，羅大佑創作紀念作家三毛，帽子歌后鳳飛飛經典傳唱。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_14",
    "tag": "歷年經典國片主題曲",
    "title": "是否",
    "artist": "蘇芮",
    "youtubeUrl": "https://www.youtube.com/watch?v=tmurzlEsRtM",
    "youtubeId": "tmurzlEsRtM",
    "startTime": 25,
    "duration": 60,
    "options": [
      "是否",
      "牽手",
      "親愛的小孩",
      "跟著感覺走"
    ],
    "clue": "1983 年電影《搭錯車》深情插曲，羅大佑詞曲創作，「是否這次我將真的離開妳……」無比揪心。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_15",
    "tag": "歷年經典國片主題曲",
    "title": "當愛已成往事",
    "artist": "林憶蓮 & 李宗盛",
    "youtubeUrl": "https://www.youtube.com/watch?v=IKA47rEDVSs",
    "youtubeId": "IKA47rEDVSs",
    "startTime": 30,
    "duration": 60,
    "options": [
      "當愛已成往事",
      "為你我受冷風吹",
      "至少還有你",
      "傷痕"
    ],
    "clue": "1993 年陳凱歌執導、張國榮主演經典史詩電影《霸王別姬》主題曲，李宗盛與林憶蓮經典男女對唱。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_16",
    "tag": "歷年經典國片主題曲",
    "title": "滾滾紅塵",
    "artist": "陳淑樺 & 羅大佑",
    "youtubeUrl": "https://www.youtube.com/watch?v=uM0fgyqb8AQ",
    "youtubeId": "uM0fgyqb8AQ",
    "startTime": 25,
    "duration": 60,
    "options": [
      "滾滾紅塵",
      "夢醒時分",
      "問",
      "笑紅塵"
    ],
    "clue": "1990 年林青霞、秦漢主演同名金馬得獎電影《滾滾紅塵》主題曲，羅大佑作詞作曲，時代動盪下的刻骨愛情。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_17",
    "tag": "歷年經典國片主題曲",
    "title": "滄海一聲笑",
    "artist": "黃霑 & 羅大佑 & 徐克",
    "youtubeUrl": "https://www.youtube.com/watch?v=j0K27MndYBk",
    "youtubeId": "j0K27MndYBk",
    "startTime": 20,
    "duration": 60,
    "options": [
      "滄海一聲笑",
      "男兒當自強",
      "倩女幽魂",
      "萬水千山縱橫"
    ],
    "clue": "1990 年徐克監製武俠經典電影《笑傲江湖》主題曲，黃霑大師採五聲音階創作，豪情萬丈笑傲江湖。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_18",
    "tag": "歷年經典國片主題曲",
    "title": "一生所愛",
    "artist": "盧冠廷",
    "youtubeUrl": "https://www.youtube.com/watch?v=pAse1VuvcOE",
    "youtubeId": "pAse1VuvcOE",
    "startTime": 25,
    "duration": 60,
    "options": [
      "一生所愛",
      "陪著你走",
      "世事何曾是絕對",
      "快樂老實人"
    ],
    "clue": "1995 年周星馳主演經典奇幻愛情電影《大話西遊 / 西遊記之仙履奇緣》片尾插曲，空靈吉他訴盡無奈宿命。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_19",
    "tag": "歷年經典國片主題曲",
    "title": "菊花台",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=PdjbRvvJAzg",
    "youtubeId": "PdjbRvvJAzg",
    "startTime": 30,
    "duration": 60,
    "options": [
      "菊花台",
      "青花瓷",
      "千里之外",
      "東風破"
    ],
    "clue": "2006 年張藝謀導演古裝宮廷大片《滿城盡帶黃金甲》片尾曲，方文山田園詩意詞句與大提琴交織悲壯情愫。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_20",
    "tag": "歷年經典國片主題曲",
    "title": "無樂不作",
    "artist": "范逸臣",
    "youtubeUrl": "https://www.youtube.com/watch?v=ng5rE7s-AMU",
    "youtubeId": "ng5rE7s-AMU",
    "startTime": 25,
    "duration": 60,
    "options": [
      "無樂不作",
      "國境之南",
      "情書",
      "野玫瑰"
    ],
    "clue": "2008 年台灣最賣座國片《海角七號》熱血開場主題曲，激昂的流行搖滾點燃全場夏日奔放熱情。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_21",
    "tag": "歷年經典國片主題曲",
    "title": "金罵沒ㄤ",
    "artist": "林美秀",
    "youtubeUrl": "https://www.youtube.com/watch?v=E_OTWZuy_Eo",
    "youtubeId": "E_OTWZuy_Eo",
    "startTime": 25,
    "duration": 60,
    "options": [
      "金罵沒ㄤ",
      "三隻小豬",
      "愛情的騙子我問你",
      "練舞功"
    ],
    "clue": "2013 年陳玉勳導演熱血喜劇國片《總舖師》插曲，馬念先詞曲，膨風嫂洗腦舞步與歌聲紅遍全台。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_22",
    "tag": "歷年經典國片主題曲",
    "title": "等一個人",
    "artist": "林芯儀",
    "youtubeUrl": "https://www.youtube.com/watch?v=NluFa3bwZig",
    "youtubeId": "NluFa3bwZig",
    "startTime": 30,
    "duration": 60,
    "options": [
      "等一個人",
      "缺口",
      "愛的可能",
      "道聽途說"
    ],
    "clue": "2014 年九把刀小說改編青春電影《等一個人咖啡》主題曲，細膩唱出等待命中註定真愛的酸甜心境。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_23",
    "tag": "歷年經典國片主題曲",
    "title": "缺口",
    "artist": "庾澄慶",
    "youtubeUrl": "https://www.youtube.com/watch?v=BCJr1EG1boc",
    "youtubeId": "BCJr1EG1boc",
    "startTime": 30,
    "duration": 60,
    "options": [
      "缺口",
      "情非得已",
      "春泥",
      "熱情的沙漠"
    ],
    "clue": "2014 年電影《等一個人咖啡》主題曲，九把刀作詞，庾澄慶用溫暖吉他與獨特嗓音唱出愛的缺口與完整。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_24",
    "tag": "歷年經典國片主題曲",
    "title": "完美落地",
    "artist": "亂彈阿翔",
    "youtubeUrl": "https://www.youtube.com/watch?v=7QcCPmXlcqY",
    "youtubeId": "7QcCPmXlcqY",
    "startTime": 25,
    "duration": 60,
    "options": [
      "完美落地",
      "翻滾吧",
      "走馬看花",
      "不一樣的朋友"
    ],
    "clue": "2011 年彭于晏主演勵志國片《翻滾吧！阿信》主題曲，勇奪第 48 屆金馬獎最佳原創電影歌曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_25",
    "tag": "歷年經典國片主題曲",
    "title": "勇者的浪漫",
    "artist": "羅美玲 & 范逸臣 & 舒米恩 & 中孝介 & Rake",
    "youtubeUrl": "https://www.youtube.com/watch?v=u0rgcWyuQbY",
    "youtubeId": "u0rgcWyuQbY",
    "startTime": 30,
    "duration": 60,
    "options": [
      "勇者的浪漫",
      "小鳥先生",
      "風起",
      "陽光下的夢想"
    ],
    "clue": "2014 年魏德聖監製熱血棒球國片《KANO》主題曲，台日五大實力歌手跨界合唱，充滿青春熱血與堅定信念。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_26",
    "tag": "歷年經典國片主題曲",
    "title": "陣頭",
    "artist": "柯有倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=rNEopzAYTUU",
    "youtubeId": "rNEopzAYTUU",
    "startTime": 25,
    "duration": 60,
    "options": [
      "陣頭",
      "零",
      "哭笑不得",
      "醒來後"
    ],
    "clue": "2012 年破三億票房熱門台灣本土電影《陣頭》同名同氣主題曲，結合傳統廟會戰鼓與搖滾龐克節奏。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_27",
    "tag": "歷年經典國片主題曲",
    "title": "孤味",
    "artist": "陳淑芳 & 于子育",
    "youtubeUrl": "https://www.youtube.com/watch?v=p8JgO6r6pyg",
    "youtubeId": "p8JgO6r6pyg",
    "startTime": 25,
    "duration": 60,
    "options": [
      "孤味",
      "追追追",
      "純情青春夢",
      "歡喜就好"
    ],
    "clue": "2020 年創下近 2 億票房金馬獎入圍大片《孤味》同名主題曲，國民阿嬤陳淑芳真摯嗓音唱出人生酸甜釋懷。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_28",
    "tag": "歷年經典國片主題曲",
    "title": "恰似你的溫柔",
    "artist": "蔡琴",
    "youtubeUrl": "https://www.youtube.com/watch?v=Yvg3L7RbFHY",
    "youtubeId": "Yvg3L7RbFHY",
    "startTime": 20,
    "duration": 60,
    "options": [
      "恰似你的溫柔",
      "被遺忘的時光",
      "讀你",
      "最後一夜"
    ],
    "clue": "梁弘志詞曲，蔡琴 1980 年成名代表作，傳唱超過四十載，多次作為金馬國片情感深沉之經典配樂。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_29",
    "tag": "歷年經典國片主題曲",
    "title": "無聲的所在",
    "artist": "林強 & 侯孝賢",
    "youtubeUrl": "https://www.youtube.com/watch?v=W8Qa5YQ9UzA",
    "youtubeId": "W8Qa5YQ9UzA",
    "startTime": 25,
    "duration": 60,
    "options": [
      "無聲的所在",
      "向前走",
      "黑輪伯仔",
      "春風少年兄"
    ],
    "clue": "1992 年台灣新電影標竿黑幫神作《少年吔，安啦！》主題曲，陳昇作詞作曲，林強與侯導滄桑對唱。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_30",
    "tag": "歷年經典國片主題曲",
    "title": "追",
    "artist": "張國榮",
    "youtubeUrl": "https://www.youtube.com/watch?v=HcSE3cQH-Ic",
    "youtubeId": "HcSE3cQH-Ic",
    "startTime": 30,
    "duration": 60,
    "options": [
      "追",
      "今生今世",
      "風繼續吹",
      "Monica"
    ],
    "clue": "1994 年陳可辛導演經典電影《金枝玉葉》主題曲，榮獲第 14 屆香港電影金像獎最佳電影歌曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_31",
    "tag": "歷年經典國片主題曲",
    "title": "新不了情",
    "artist": "萬芳",
    "youtubeUrl": "https://www.youtube.com/watch?v=Dw-R85AcN_w",
    "youtubeId": "Dw-R85AcN_w",
    "startTime": 25,
    "duration": 60,
    "options": [
      "新不了情",
      "割愛",
      "猜心",
      "就值得了愛"
    ],
    "clue": "爾冬陞導演 1993 年同名電影《新不了情》主題曲，鮑比達作曲，華語影史不朽經典。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_32",
    "tag": "歷年經典國片主題曲",
    "title": "油蔴菜籽",
    "artist": "蔡琴",
    "youtubeUrl": "https://www.youtube.com/watch?v=DJt8YcoJMxY",
    "youtubeId": "DJt8YcoJMxY",
    "startTime": 20,
    "duration": 60,
    "options": [
      "油蔴菜籽",
      "最後一夜",
      "恰似你的溫柔",
      "被遺忘的時光"
    ],
    "clue": "侯孝賢編劇、萬仁執導 1984 年電影《油蔴菜籽》同名主題曲，李宗盛作詞作曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_33",
    "tag": "歷年經典國片主題曲",
    "title": "桂花巷",
    "artist": "潘越雲",
    "youtubeUrl": "https://www.youtube.com/watch?v=In4_9HWaGpM",
    "youtubeId": "In4_9HWaGpM",
    "startTime": 20,
    "duration": 60,
    "options": [
      "桂花巷",
      "天天天藍",
      "野百合也有春天",
      "純情青春夢"
    ],
    "clue": "吳念真作詞、陳揚作曲 1987 年電影《桂花巷》主題曲，榮獲金馬獎最佳電影插曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_34",
    "tag": "歷年經典國片主題曲",
    "title": "歡顏",
    "artist": "齊豫",
    "youtubeUrl": "https://www.youtube.com/watch?v=G5Ee7EhR35w",
    "youtubeId": "G5Ee7EhR35w",
    "startTime": 20,
    "duration": 60,
    "options": [
      "歡顏",
      "橄欖樹",
      "走在雨中",
      "夢田"
    ],
    "clue": "屠忠訓導演 1979 年電影《歡顏》同名主題曲，李泰祥作曲，胡慧中主演成名作。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_35",
    "tag": "歷年經典國片主題曲",
    "title": "橄欖樹",
    "artist": "齊豫",
    "youtubeUrl": "https://www.youtube.com/watch?v=LZb8fJZFhlo",
    "youtubeId": "LZb8fJZFhlo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "橄欖樹",
      "歡顏",
      "一條日光大道",
      "春天的故事"
    ],
    "clue": "李泰祥作曲、三毛作詞，電影《歡顏》經典插曲，「不要問我從哪裡來，我的故鄉在遠方」。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_36",
    "tag": "歷年經典國片主題曲",
    "title": "永遠不回頭",
    "artist": "張雨生、王傑、邰正宵、姚可傑",
    "youtubeUrl": "https://www.youtube.com/watch?v=EiINqkHWZKQ",
    "youtubeId": "EiINqkHWZKQ",
    "startTime": 25,
    "duration": 60,
    "options": [
      "永遠不回頭",
      "烈火青春",
      "我的未來不是夢",
      "熱血"
    ],
    "clue": "朱延平導演 1989 年青春熱血電影《七匹狼》同名主題曲，群星熱血狂飆高音。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_37",
    "tag": "歷年經典國片主題曲",
    "title": "天天想你",
    "artist": "張雨生",
    "youtubeUrl": "https://www.youtube.com/watch?v=qSslpWSSTLg",
    "youtubeId": "qSslpWSSTLg",
    "startTime": 20,
    "duration": 60,
    "options": [
      "天天想你",
      "我的未來不是夢",
      "大海",
      "帶我去月球"
    ],
    "clue": "陳樂融作詞、陳志遠作曲，電影《七匹狼》經典插曲，張雨生高亢溫暖的傳世代表作。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_38",
    "tag": "歷年經典國片主題曲",
    "title": "一場遊戲一場夢",
    "artist": "王傑",
    "youtubeUrl": "https://www.youtube.com/watch?v=B2S1EngkjQk",
    "youtubeId": "B2S1EngkjQk",
    "startTime": 22,
    "duration": 60,
    "options": [
      "一場遊戲一場夢",
      "安妮",
      "是否我真的一無所有",
      "忘了你忘了我"
    ],
    "clue": "張艾嘉導演、張曼玉主演電影《黃色故事》插曲，王修成名橫掃亞洲的神級金曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_39",
    "tag": "歷年經典國片主題曲",
    "title": "倩女幽魂",
    "artist": "張國榮",
    "youtubeUrl": "https://www.youtube.com/watch?v=2pPrNkk4xAg",
    "youtubeId": "2pPrNkk4xAg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "倩女幽魂",
      "當年情",
      "風繼續吹",
      "沉默是金"
    ],
    "clue": "徐克監製、程小東執導 1987 年經典電影《倩女幽魂》同名主題曲，黃霑作詞作曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_40",
    "tag": "歷年經典國片主題曲",
    "title": "男兒當自強",
    "artist": "林子祥",
    "youtubeUrl": "https://www.youtube.com/watch?v=U_EgeFUTbW4",
    "youtubeId": "U_EgeFUTbW4",
    "startTime": 20,
    "duration": 60,
    "options": [
      "男兒當自強",
      "長路漫漫伴你闖",
      "成吉思汗",
      "分分鐘需要你"
    ],
    "clue": "徐克導演、李連杰主演《黃飛鴻之二：男兒當自強》古箏鼓點熱血主題曲，改編自古曲《將軍令》。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_41",
    "tag": "歷年經典國片主題曲",
    "title": "甜蜜蜜",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=5eF8oOWtsk4",
    "youtubeId": "5eF8oOWtsk4",
    "startTime": 10,
    "duration": 60,
    "options": [
      "甜蜜蜜",
      "小城故事",
      "月亮代表我的心",
      "我只在乎你"
    ],
    "clue": "陳可辛執導、黎明與張曼玉主演電影《甜蜜蜜》靈魂同名核心主題曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_42",
    "tag": "歷年經典國片主題曲",
    "title": "月光愛人",
    "artist": "李玟 (CoCo Lee)",
    "youtubeUrl": "https://www.youtube.com/watch?v=eRHNsKr7y6I",
    "youtubeId": "eRHNsKr7y6I",
    "startTime": 25,
    "duration": 60,
    "options": [
      "月光愛人",
      "Di Da Di",
      "刀馬旦",
      "美麗笨女人"
    ],
    "clue": "李安導演奧斯卡最佳外語片《臥虎藏龍》主題曲，入圍奧斯卡最佳原創歌曲，李玟首登奧斯卡獻唱。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_43",
    "tag": "歷年經典國片主題曲",
    "title": "看見彩虹",
    "artist": "阿飛、羅美玲、林慶台、大慶等",
    "youtubeUrl": "https://www.youtube.com/watch?v=YHpZsZFxiHw",
    "youtubeId": "YHpZsZFxiHw",
    "startTime": 30,
    "duration": 60,
    "options": [
      "看見彩虹",
      "勇者的浪漫",
      "賽德克巴萊之歌",
      "相愛的靈魂"
    ],
    "clue": "魏德聖執導台灣史詩大片《賽德克·巴萊》原聲帶主題曲，原住民族語交織壯闊彩虹橋。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_44",
    "tag": "歷年經典國片主題曲",
    "title": "拍手歌 (Kipahpah ima)",
    "artist": "台灣原聲童聲合唱團",
    "youtubeUrl": "https://www.youtube.com/watch?v=YXMDUUk21x8",
    "youtubeId": "YXMDUUk21x8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "拍手歌 (Kipahpah ima)",
      "玉山之歌",
      "讓世界聽見玉山",
      "大地之歌"
    ],
    "clue": "齊柏林空拍記錄片《看見台灣》玉山頂峰合唱名曲，感動全台灣的天籟之音。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_45",
    "tag": "歷年經典國片主題曲",
    "title": "你的樣子",
    "artist": "羅大佑",
    "youtubeUrl": "https://www.youtube.com/watch?v=YAZSNlgnm7Y",
    "youtubeId": "YAZSNlgnm7Y",
    "startTime": 20,
    "duration": 60,
    "options": [
      "你的樣子",
      "戀曲1990",
      "童年",
      "愛人同志"
    ],
    "clue": "杜琪峯導演、周潤發主演《阿郎的故事》令人淚崩的經典片尾曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_46",
    "tag": "歷年經典國片主題曲",
    "title": "有無",
    "artist": "林生祥",
    "youtubeUrl": "https://www.youtube.com/watch?v=GUlTPWlc5L0",
    "youtubeId": "GUlTPWlc5L0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "有無",
      "菜埔之歌",
      "肚財的故鄉",
      "風神125"
    ],
    "clue": "黃信堯導演《大佛普拉斯》片尾曲，王昭華作詞，榮獲第54屆金馬獎最佳原創電影歌曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_47",
    "tag": "歷年經典國片主題曲",
    "title": "為愛痴狂",
    "artist": "劉若英",
    "youtubeUrl": "https://www.youtube.com/watch?v=cYchjzfQ2RU",
    "youtubeId": "cYchjzfQ2RU",
    "startTime": 20,
    "duration": 60,
    "options": [
      "為愛痴狂",
      "很愛很愛你",
      "成全",
      "後來"
    ],
    "clue": "陳國富執導《我的美麗與哀愁》主題曲，陳昇填詞譜曲，劉若英奪金馬最佳電影歌曲成名作。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_48",
    "tag": "歷年經典國片主題曲",
    "title": "光陰的故事",
    "artist": "張艾嘉",
    "youtubeUrl": "https://www.youtube.com/watch?v=2LjMdgNkP5w",
    "youtubeId": "2LjMdgNkP5w",
    "startTime": 15,
    "duration": 60,
    "options": [
      "光陰的故事",
      "童年",
      "愛的代價",
      "是否"
    ],
    "clue": "楊德昌等執導台灣新浪潮開山作《光陰的故事》同名代表作，羅大佑詞曲，張艾嘉演唱。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_49",
    "tag": "歷年經典國片主題曲",
    "title": "各自遠揚 (それぞれに)",
    "artist": "中孝介",
    "youtubeUrl": "https://www.youtube.com/watch?v=yIBCWT4TEAE",
    "youtubeId": "yIBCWT4TEAE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "各自遠揚 (それぞれに)",
      "國境之南",
      "野玫瑰",
      "情書"
    ],
    "clue": "魏德聖導演台灣影史最賣座國片《海角七號》感動無數人的催淚插曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "movie_theme_50",
    "tag": "歷年經典國片主題曲",
    "title": "葬心",
    "artist": "黃鶯鶯",
    "youtubeUrl": "https://www.youtube.com/watch?v=OuWQInYTGK0",
    "youtubeId": "OuWQInYTGK0",
    "startTime": 20,
    "duration": 60,
    "options": [
      "葬心",
      "哭砂",
      "雪在燒",
      "留不住的故事"
    ],
    "clue": "關錦鵬導演、張曼玉主演電影《阮玲玉》主題曲，小蟲作曲，榮獲金馬獎與香港金像獎最佳電影插曲。",
    "tags": [
      "歷年經典國片主題曲"
    ]
  },
  {
    "id": "tw_classic_1",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "望春風",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=Pw1wLiJdHPY",
    "youtubeId": "Pw1wLiJdHPY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "望春風",
      "雨夜花",
      "月夜愁",
      "四季紅"
    ],
    "clue": "李臨秋作詞、鄧雨賢作曲之台灣歌謠代表作，鄧麗君溫婉動人的經典演繹。"
  },
  {
    "id": "tw_classic_2",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "雨夜花",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=0033HANLMvY",
    "youtubeId": "0033HANLMvY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "雨夜花",
      "望春風",
      "白牡丹",
      "河邊春夢"
    ],
    "clue": "周添旺作詞、鄧雨賢作曲，「雨夜花，雨夜花，受風雨吹落地……」傳唱近百年的經典名曲。"
  },
  {
    "id": "tw_classic_3",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "甲你攬牢牢",
    "artist": "江蕙",
    "youtubeUrl": "https://www.youtube.com/watch?v=7LzkETsGvBM",
    "youtubeId": "7LzkETsGvBM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "甲你攬牢牢",
      "家後",
      "落雨聲",
      "遠走高飛"
    ],
    "clue": "江蕙親自填詞譜曲的溫暖之作，「我欲甲你攬牢牢，乎你面對坎坷的運命……」撫慰無數人心。"
  },
  {
    "id": "tw_classic_4",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "阿嬤的話",
    "artist": "蕭煌奇",
    "youtubeUrl": "https://www.youtube.com/watch?v=an8kaGjzeKs",
    "youtubeId": "an8kaGjzeKs",
    "startTime": 0,
    "duration": 60,
    "options": [
      "阿嬤的話",
      "你是我的眼",
      "末班車",
      "上水的花"
    ],
    "clue": "金曲歌王蕭煌奇深情紀念撫養自己長大的阿嬤，真摯感人、催人淚下的經典台語情歌。"
  },
  {
    "id": "tw_classic_5",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "流浪到淡水",
    "artist": "金門王與李炳輝",
    "youtubeUrl": "https://www.youtube.com/watch?v=9plPMDcD4dU",
    "youtubeId": "9plPMDcD4dU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "流浪到淡水",
      "來去夏威夷",
      "晚安台灣",
      "愛拼才會贏"
    ],
    "clue": "陳明章創作、金門王與李炳輝演唱，「有緣，無緣，大家來作伙，燒酒喝一杯，乎乾啦！」紅遍全台。"
  },
  {
    "id": "tw_classic_6",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "練舞功",
    "artist": "謝金燕",
    "youtubeUrl": "https://www.youtube.com/watch?v=EBBw4fBZRTg",
    "youtubeId": "EBBw4fBZRTg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "練舞功",
      "姐姐",
      "嗶嗶嗶",
      "月彎彎"
    ],
    "clue": "電音天后謝金燕代表作，「跟我來練舞功，我來去無影蹤」，熱鬧無比的國民電音台語舞曲。"
  },
  {
    "id": "tw_classic_7",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "歡喜就好",
    "artist": "陳雷",
    "youtubeUrl": "https://www.youtube.com/watch?v=GPoTmtykcGY",
    "youtubeId": "GPoTmtykcGY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "歡喜就好",
      "風真透",
      "隨緣",
      "碼頭酒"
    ],
    "clue": "草根歌王陳雷名曲，「人生短短，若是你想開，何必怨嘆……歡喜就好！」樂觀豁達的人生哲理。"
  },
  {
    "id": "tw_classic_8",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "心花開",
    "artist": "李千娜",
    "youtubeUrl": "https://www.youtube.com/watch?v=Qd33i-OoOk4",
    "youtubeId": "Qd33i-OoOk4",
    "startTime": 0,
    "duration": 60,
    "options": [
      "心花開",
      "查某囡仔",
      "說實話",
      "不曾回來過"
    ],
    "clue": "阿弟仔作詞作曲，李千娜甜美輕快的現代台語流行代表作，傳唱度極高。"
  },
  {
    "id": "tw_classic_9",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "落雨聲",
    "artist": "江蕙",
    "youtubeUrl": "https://www.youtube.com/watch?v=XDkVnNXhQSw",
    "youtubeId": "XDkVnNXhQSw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "落雨聲",
      "家後",
      "甲你攬牢牢",
      "斷腸詩"
    ],
    "clue": "方文山作詞、周杰倫作曲，江蕙深情詮釋樹欲靜而風不止的至孝感人台語經典。"
  },
  {
    "id": "tw_classic_10",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "鼓聲若響",
    "artist": "新寶島康樂隊",
    "youtubeUrl": "https://www.youtube.com/watch?v=lbpgKhi3S0U",
    "youtubeId": "lbpgKhi3S0U",
    "startTime": 0,
    "duration": 60,
    "options": [
      "鼓聲若響",
      "歡聚歌",
      "Summer",
      "多情兄"
    ],
    "clue": "陳昇與黃連煜創作演唱，熱情洋溢的森巴節奏與台語歌詞完美融合的歡樂金曲。"
  },
  {
    "id": "tw_classic_11",
    "tag": "經典台語",
    "tags": [
      "經典台語"
    ],
    "title": "車站",
    "artist": "張秀卿",
    "youtubeUrl": "https://www.youtube.com/watch?v=oeMHMzE2Nas",
    "youtubeId": "oeMHMzE2Nas",
    "startTime": 0,
    "duration": 60,
    "options": [
      "車站",
      "想厝的心情",
      "海醉",
      "愛人仔"
    ],
    "clue": "林垂立作詞作曲，張秀卿經典成名作，「火車已經到車站，阮的心頭漸漸重……」離情依依的催淚名曲。"
  },
  {
    "id": "jdrama_1",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "突如其來的愛情 (ラブ・ストーリーは突然に)",
    "artist": "小田和正",
    "youtubeUrl": "https://www.youtube.com/watch?v=sZxzPcT1Meg",
    "youtubeId": "sZxzPcT1Meg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "突如其來的愛情 (ラブ・ストーリーは突然に)",
      "SAY YES",
      "TRUE LOVE",
      "LA·LA·LA LOVE SONG"
    ],
    "clue": "小田和正為富士電視台月九神劇《東京愛情故事》打造的主題曲，開頭經典吉他節奏一響起便喚起無數人的回憶。"
  },
  {
    "id": "jdrama_2",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "LA·LA·LA LOVE SONG",
    "artist": "久保田利伸",
    "youtubeUrl": "https://www.youtube.com/watch?v=TGQuCyLvay8",
    "youtubeId": "TGQuCyLvay8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "LA·LA·LA LOVE SONG",
      "突如其來的愛情",
      "First Love",
      "幸福的結局"
    ],
    "clue": "久保田利伸與 Naomi Campbell 合作，木村拓哉與山口智子主演神劇《長假》主題曲，日劇流行音樂的巔峰之作。"
  },
  {
    "id": "jdrama_3",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "First Love",
    "artist": "宇多田光",
    "youtubeUrl": "https://www.youtube.com/watch?v=QDfp_eSEfSk",
    "youtubeId": "QDfp_eSEfSk",
    "startTime": 0,
    "duration": 60,
    "options": [
      "First Love",
      "Automatic",
      "Can You Keep A Secret?",
      "Flavor Of Life"
    ],
    "clue": "宇多田光代表作，松嶋菜菜子與瀧澤秀明主演日劇《魔女的條件》主題曲，亞洲最暢銷音樂專輯同名主打。"
  },
  {
    "id": "jdrama_4",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "Everything",
    "artist": "MISIA",
    "youtubeUrl": "https://www.youtube.com/watch?v=aHIR33pOUv0",
    "youtubeId": "aHIR33pOUv0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "Everything",
      "逢いたくていま",
      "包み込むように…",
      "INTO THE LIGHT"
    ],
    "clue": "日本巨肺天后 MISIA 代表抒情神作，松嶋菜菜子與堤真一主演經典日劇《大和拜金女》主題曲。"
  },
  {
    "id": "jdrama_5",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "Lemon",
    "artist": "米津玄師",
    "youtubeUrl": "https://www.youtube.com/watch?v=SX_ViT4Ra7k",
    "youtubeId": "SX_ViT4Ra7k",
    "startTime": 0,
    "duration": 60,
    "options": [
      "Lemon",
      "打上花火",
      "Paprika",
      "地球儀"
    ],
    "clue": "米津玄師為石原聰美主演日劇《法醫女王 (Unnatural)》量身打造的主題曲，MV播放量創下日本流行音樂歷史巔峰。"
  },
  {
    "id": "jdrama_6",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "戀 (恋)",
    "artist": "星野源",
    "youtubeUrl": "https://www.youtube.com/watch?v=jhOVibLEDhA",
    "youtubeId": "jhOVibLEDhA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "戀 (恋)",
      "SUN",
      "喜劇",
      "不思議"
    ],
    "clue": "星野源與新垣結衣主演日劇《月薪嬌妻 (逃避雖可恥但有用)》片尾曲，片尾「戀舞」席捲亞洲引發熱潮。"
  },
  {
    "id": "jdrama_7",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "今夜在看得見月亮的丘上",
    "artist": "B'z",
    "youtubeUrl": "https://www.youtube.com/watch?v=Bz3GfWwhdt0",
    "youtubeId": "Bz3GfWwhdt0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "今夜在看得見月亮的丘上",
      "Ultra Soul",
      "ALONE",
      "OCEAN"
    ],
    "clue": "日本搖滾天團 B'z 經典名曲，木村拓哉與常盤貴子主演日劇《美麗人生》主題曲，創下超高收視狂潮。"
  },
  {
    "id": "jdrama_8",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "小小戀歌 (小さな恋のうた)",
    "artist": "MONGOL800",
    "youtubeUrl": "https://www.youtube.com/watch?v=zX_zvFHGVLY",
    "youtubeId": "zX_zvFHGVLY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小小戀歌 (小さな恋のうた)",
      "明天好天氣",
      "遙遠",
      "天體觀測"
    ],
    "clue": "山下智久與長澤雅美主演經典青春日劇《求婚大作戰》熱血插曲，日本平成時代傳唱度最高的卡拉OK神曲之一。"
  },
  {
    "id": "jdrama_9",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "SAY YES",
    "artist": "CHAGE and ASKA",
    "youtubeUrl": "https://www.youtube.com/watch?v=Q9qAyt0G-jM",
    "youtubeId": "Q9qAyt0G-jM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "SAY YES",
      "YAH YAH YAH",
      "PRIDE",
      "男與女"
    ],
    "clue": "恰克與飛鳥代表作，武田鐵矢與淺野溫子主演日劇《101次求婚》主題曲，「我是不會死的！」感動無數觀眾。"
  },
  {
    "id": "jdrama_10",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "明天好天氣 (明日晴れるかな)",
    "artist": "桑田佳祐",
    "youtubeUrl": "https://www.youtube.com/watch?v=xvuAIf8sM_c",
    "youtubeId": "xvuAIf8sM_c",
    "startTime": 0,
    "duration": 60,
    "options": [
      "明天好天氣 (明日晴れるかな)",
      "TSUNAMI",
      "白色的戀人們",
      "小小戀歌"
    ],
    "clue": "南方之星主唱桑田佳祐名作，山下智久與長澤雅美主演《求婚大作戰》片尾主題曲，「哈利路亞～嗆司！」"
  },
  {
    "id": "jdrama_11",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "粉雪",
    "artist": "レミオロメン",
    "youtubeUrl": "https://www.youtube.com/watch?v=1wxTksLZ1Mw",
    "youtubeId": "1wxTksLZ1Mw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "粉雪",
      "3月9日",
      "太陽之歌",
      "奏 (奏)"
    ],
    "clue": "澤尻英龍華主演真人真事改編感人日劇《一公升的眼淚》插曲，副歌撕心裂肺的高音震撼人心。"
  },
  {
    "id": "jdrama_12",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "三日月",
    "artist": "絢香",
    "youtubeUrl": "https://www.youtube.com/watch?v=2Z1qBTTQIEA",
    "youtubeId": "2Z1qBTTQIEA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "三日月",
      "I believe",
      "WINDING ROAD",
      "手紙"
    ],
    "clue": "實力派唱將絢香代表名曲，竹內結子主演日劇《現在，很想見你》主題曲，深情描繪遠距離戀愛的思念。"
  },
  {
    "id": "jdrama_13",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "HANABI",
    "artist": "Mr.Children",
    "youtubeUrl": "https://www.youtube.com/watch?v=EXxaBXKjl6Q",
    "youtubeId": "EXxaBXKjl6Q",
    "startTime": 0,
    "duration": 60,
    "options": [
      "HANABI",
      "Sign",
      "Innocent World",
      "Tomorrow never knows"
    ],
    "clue": "國民搖滾樂團 Mr.Children 代表作，山下智久與新垣結衣主演日劇《空中急診英雄 (Code Blue)》全系列主題曲。"
  },
  {
    "id": "jdrama_14",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "幸福的結局 (幸せな結末)",
    "artist": "大瀧詠一",
    "youtubeUrl": "https://www.youtube.com/watch?v=AZ8jKorQEN8",
    "youtubeId": "AZ8jKorQEN8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "幸福的結局 (幸せな結末)",
      "突如其來的愛情",
      "LA·LA·LA LOVE SONG",
      "TRUE LOVE"
    ],
    "clue": "音樂大師大瀧詠一名作，木村拓哉與松隆子主演經典日劇《戀愛世代》主題曲，水晶蘋果的純愛回憶。"
  },
  {
    "id": "jdrama_15",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "天空與你之間 (空と君のあいだに)",
    "artist": "中島美雪",
    "youtubeUrl": "https://www.youtube.com/watch?v=U2jEWTrExsg",
    "youtubeId": "U2jEWTrExsg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "天空與你之間 (空と君のあいだに)",
      "騎在銀龍的背上",
      "線",
      "時代"
    ],
    "clue": "國寶級歌后中島美雪創作演唱，安達祐實主演轟動日劇《無家可歸的小孩》主題曲，也是林佳儀《一個人的我依然會微笑》原曲。"
  },
  {
    "id": "jdrama_16",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "TRUE LOVE",
    "artist": "藤井郁彌",
    "youtubeUrl": "https://www.youtube.com/watch?v=Zoi65nAxcu4",
    "youtubeId": "Zoi65nAxcu4",
    "startTime": 0,
    "duration": 60,
    "options": [
      "TRUE LOVE",
      "SAY YES",
      "突如其來的愛情",
      "幸福的結局"
    ],
    "clue": "藤井郁彌百萬暢銷抒情曲，木村拓哉、石田光主演經典日劇《愛情白皮書》主題曲。"
  },
  {
    "id": "jdrama_17",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "Sign",
    "artist": "Mr.Children",
    "youtubeUrl": "https://www.youtube.com/watch?v=4wuWJ7GAc2s",
    "youtubeId": "4wuWJ7GAc2s",
    "startTime": 0,
    "duration": 60,
    "options": [
      "Sign",
      "HANABI",
      "無名之詩",
      "Innocent World"
    ],
    "clue": "Mr.Children 榮獲日本唱片大獎名曲，妻夫木聰與柴崎幸主演純愛日劇《Orange Days》主題曲。"
  },
  {
    "id": "jdrama_18",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "Can You Keep A Secret?",
    "artist": "宇多田光",
    "youtubeUrl": "https://www.youtube.com/watch?v=w4w6OTjV7so",
    "youtubeId": "w4w6OTjV7so",
    "startTime": 0,
    "duration": 60,
    "options": [
      "Can You Keep A Secret?",
      "First Love",
      "Flavor Of Life",
      "Prisoner Of Love"
    ],
    "clue": "宇多田光熱門金曲，木村拓哉與松隆子主演傳奇律政日劇《HERO》主題曲。"
  },
  {
    "id": "jdrama_19",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "PRIDE",
    "artist": "今井美樹",
    "youtubeUrl": "https://www.youtube.com/watch?v=YdnrmS1h14A",
    "youtubeId": "YdnrmS1h14A",
    "startTime": 0,
    "duration": 60,
    "options": [
      "PRIDE",
      "PIECE OF MY WISH",
      "雨にキッスの花束を",
      "瞳がほほえむから"
    ],
    "clue": "布袋寅泰作曲、今井美樹演唱，安田成美與香取慎吾主演日劇《德子 (ドク)》主題曲，百萬暢銷金曲。"
  },
  {
    "id": "jdrama_20",
    "tag": "經典日劇",
    "tags": [
      "經典日劇"
    ],
    "title": "裸的心 (裸の心)",
    "artist": "Aimyon 愛繆",
    "youtubeUrl": "https://www.youtube.com/watch?v=yOAwvRmVIyo",
    "youtubeId": "yOAwvRmVIyo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "裸的心 (裸の心)",
      "金盞花",
      "傳達愛",
      "春日"
    ],
    "clue": "創作才女 Aimyon 愛繆代表抒情曲，多部未華子主演人氣日劇《我的家政夫渚先生》主題曲。"
  },
  {
    "id": "kdrama_1",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "Stay With Me",
    "artist": "燦烈 (EXO) & Punch",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZqREAm7Ibtw",
    "youtubeId": "ZqREAm7Ibtw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "Stay With Me",
      "Beautiful",
      "如初雪般走向你",
      "Reset"
    ],
    "clue": "燦烈與 Punch 為孔劉、金高銀主演現象級神劇《孤單又燦爛的神－鬼怪》演唱之經典 OST。"
  },
  {
    "id": "kdrama_2",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "My Destiny",
    "artist": "LYn",
    "youtubeUrl": "https://www.youtube.com/watch?v=4_su_gAnePg",
    "youtubeId": "4_su_gAnePg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "My Destiny",
      "像今天一樣的眼淚",
      "再見",
      "時光倒流"
    ],
    "clue": "LYn 演唱，金秀賢與全智賢主演風靡全亞洲的現象級韓劇《來自星星的你》主題曲，「You are my destiny～」。"
  },
  {
    "id": "kdrama_3",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "ALWAYS",
    "artist": "尹未來",
    "youtubeUrl": "https://www.youtube.com/watch?v=mgFVZfGBEpM",
    "youtubeId": "mgFVZfGBEpM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "ALWAYS",
      "You Are My Everything",
      "Everytime",
      "這份愛"
    ],
    "clue": "尹未來為宋仲基、宋慧喬主演轟動全亞洲神劇《太陽的後裔》演唱的深情主題曲。"
  },
  {
    "id": "kdrama_4",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "Everytime",
    "artist": "CHEN & Punch",
    "youtubeUrl": "https://www.youtube.com/watch?v=Vj-JE5IbdCw",
    "youtubeId": "Vj-JE5IbdCw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "Everytime",
      "ALWAYS",
      "You Are My Everything",
      "Stay With Me"
    ],
    "clue": "EXO 成員 CHEN 與 Punch 合作，韓劇《太陽的後裔》充滿甜蜜告白氛圍的人氣插曲。"
  },
  {
    "id": "kdrama_5",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "從開始到現在",
    "artist": "Ryu",
    "youtubeUrl": "https://www.youtube.com/watch?v=KLrIiE4bOxU",
    "youtubeId": "KLrIiE4bOxU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "從開始到現在",
      "My Memory",
      "祈禱",
      "I Believe"
    ],
    "clue": "Ryu 演唱，裴勇俊與崔智友主演韓流開山鼻祖《冬季戀歌》主題曲，張信哲亦曾翻唱同名中文版。"
  },
  {
    "id": "kdrama_6",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "My Memory",
    "artist": "Ryu",
    "youtubeUrl": "https://www.youtube.com/watch?v=eA64_AzQafQ",
    "youtubeId": "eA64_AzQafQ",
    "startTime": 0,
    "duration": 60,
    "options": [
      "My Memory",
      "從開始到現在",
      "祈禱",
      "Reason"
    ],
    "clue": "經典韓劇《冬季戀歌》插曲，悠揚的鋼琴與深情歌聲重現南怡島白雪皚皚的浪漫回憶。"
  },
  {
    "id": "kdrama_7",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "祈禱",
    "artist": "鄭日英",
    "youtubeUrl": "https://www.youtube.com/watch?v=w8BwpL100Oo",
    "youtubeId": "w8BwpL100Oo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "祈禱",
      "Reason",
      "從開始到現在",
      "My Memory"
    ],
    "clue": "宋慧喬、宋承憲、元斌主演早期韓流悲劇經典《藍色生死戀》主題曲，催人淚下的純愛旋律。"
  },
  {
    "id": "kdrama_8",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "I Think I",
    "artist": "Star",
    "youtubeUrl": "https://www.youtube.com/watch?v=aLInIcZFuVQ",
    "youtubeId": "aLInIcZFuVQ",
    "startTime": 0,
    "duration": 60,
    "options": [
      "I Think I",
      "命運 (Fate)",
      "初次與你相遇",
      "Perhaps Love"
    ],
    "clue": "Rain 與宋慧喬主演浪漫愛情喜劇《浪漫滿屋》插曲，描繪不自覺陷入愛情的甜蜜心境。"
  },
  {
    "id": "kdrama_9",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "命運 (Fate)",
    "artist": "Why",
    "youtubeUrl": "https://www.youtube.com/watch?v=klKakxRJt3I",
    "youtubeId": "klKakxRJt3I",
    "startTime": 0,
    "duration": 60,
    "options": [
      "命運 (Fate)",
      "I Think I",
      "初次與你相遇",
      "因為我太傻"
    ],
    "clue": "《浪漫滿屋》主題曲，動感輕快的節奏配合兩位歡喜冤家的浪漫同居日常。"
  },
  {
    "id": "kdrama_10",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "She Is",
    "artist": "Clazziquai",
    "youtubeUrl": "https://www.youtube.com/watch?v=D5vmKFGnOx4",
    "youtubeId": "D5vmKFGnOx4",
    "startTime": 0,
    "duration": 60,
    "options": [
      "She Is",
      "離不開的別離",
      "Be My Love",
      "告白"
    ],
    "clue": "酷軀樂團為金宣兒與玄彬主演熱播劇《我叫金三順》演唱的經典插曲，「隱隱約約～」的輕快節奏。"
  },
  {
    "id": "kdrama_11",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "Perhaps Love (這是愛嗎)",
    "artist": "HowL & J.ae",
    "youtubeUrl": "https://www.youtube.com/watch?v=cjaW3edHhHA",
    "youtubeId": "cjaW3edHhHA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "Perhaps Love (這是愛嗎)",
      "你...我是傻瓜",
      "回想",
      "I Think I"
    ],
    "clue": "尹恩惠與朱智勛主演君主立憲宮廷劇《宮 野蠻王妃》主題曲，男女對唱的純愛浪漫經典。"
  },
  {
    "id": "kdrama_12",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "因為我太傻",
    "artist": "SS501",
    "youtubeUrl": "https://www.youtube.com/watch?v=JZu0ldjo-3Q",
    "youtubeId": "JZu0ldjo-3Q",
    "startTime": 0,
    "duration": 60,
    "options": [
      "因為我太傻",
      "Paradise",
      "Stand By Me",
      "做我的女孩"
    ],
    "clue": "李敏鎬、具惠善、金賢重主演韓版流星花園《花樣男子》尹智聖專屬深情插曲。"
  },
  {
    "id": "kdrama_13",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "那個女人",
    "artist": "白智榮",
    "youtubeUrl": "https://www.youtube.com/watch?v=U2YI2MD1Wrg",
    "youtubeId": "U2YI2MD1Wrg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "那個女人",
      "出現",
      "理由",
      "像中槍一樣"
    ],
    "clue": "OST 女王白智榮為玄彬與河智苑主演經典奇幻愛情喜劇《秘密花園》演唱之催淚主題曲。"
  },
  {
    "id": "kdrama_14",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "You Are My Everything",
    "artist": "Gummy",
    "youtubeUrl": "https://www.youtube.com/watch?v=ToASX6axGuw",
    "youtubeId": "ToASX6axGuw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "You Are My Everything",
      "ALWAYS",
      "Everytime",
      "說吧！做什麼？"
    ],
    "clue": "實力派唱將 Gummy 為《太陽的後裔》演唱的磅礴抒情 OST，宋宋 CP 經典主題旋律。"
  },
  {
    "id": "kdrama_15",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "Beautiful",
    "artist": "Crush",
    "youtubeUrl": "https://www.youtube.com/watch?v=to_5UOAINLY",
    "youtubeId": "to_5UOAINLY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "Beautiful",
      "Stay With Me",
      "如初雪般走向你",
      "Who Are You"
    ],
    "clue": "音源強盜 Crush 為《孤單又燦爛的神－鬼怪》演唱之抒情曲，「It's a beautiful life～」。"
  },
  {
    "id": "kdrama_16",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "如初雪般走向你",
    "artist": "Ailee",
    "youtubeUrl": "https://www.youtube.com/watch?v=Vz2vu89N4cw",
    "youtubeId": "Vz2vu89N4cw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "如初雪般走向你",
      "Beautiful",
      "Stay With Me",
      "I Will Go to You Like the First Snow"
    ],
    "clue": "鐵肺女王 Ailee 為《鬼怪》演唱之主題曲，橫掃各大音源榜榜首與年終大獎。"
  },
  {
    "id": "kdrama_17",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "再次，我 在這裡 (Here I Am Again)",
    "artist": "白藝潾",
    "youtubeUrl": "https://www.youtube.com/watch?v=FFmdTU4Cpr8",
    "youtubeId": "FFmdTU4Cpr8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "再次，我 在這裡 (Here I Am Again)",
      "日落",
      "如花綻放的我的愛",
      "送上我的心"
    ],
    "clue": "白藝潾為玄彬與孫藝真主演浪漫愛情神劇《愛的迫降》演唱之動人插曲。"
  },
  {
    "id": "kdrama_18",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "開始 (Start Over)",
    "artist": "Gaho",
    "youtubeUrl": "https://www.youtube.com/watch?v=O0StKlRHVeE",
    "youtubeId": "O0StKlRHVeE",
    "startTime": 0,
    "duration": 60,
    "options": [
      "開始 (Start Over)",
      "那個時候的那個人",
      "Diamond",
      "甜夜"
    ],
    "clue": "Gaho 演唱，朴敘俊主演熱血勵志神劇《梨泰院Class》爆紅 OST，充滿奔跑與逐夢力量。"
  },
  {
    "id": "kdrama_19",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "你不要擔心",
    "artist": "李笛",
    "youtubeUrl": "https://www.youtube.com/watch?v=Dic27EnDDls",
    "youtubeId": "Dic27EnDDls",
    "startTime": 0,
    "duration": 60,
    "options": [
      "你不要擔心",
      "惠化洞",
      "少女",
      "每天和你"
    ],
    "clue": "李笛為溫情神劇《請回答1988》重新詮釋的經典名曲，撫慰雙門洞每個家庭的溫暖旋律。"
  },
  {
    "id": "kdrama_20",
    "tag": "經典韓劇",
    "tags": [
      "經典韓劇"
    ],
    "title": "All For You",
    "artist": "徐仁國 & 鄭恩地",
    "youtubeUrl": "https://www.youtube.com/watch?v=3Jb_K-8fDLA",
    "youtubeId": "3Jb_K-8fDLA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "All For You",
      "我們的愛像這樣",
      "只有你",
      "情侶"
    ],
    "clue": "徐仁國與鄭恩地為《請回答1997》甜蜜合唱的主題曲，掀起復古追劇風潮的代表作。"
  }
];
})(typeof window !== 'undefined' ? window : global);
