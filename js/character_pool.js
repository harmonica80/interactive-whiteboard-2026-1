// 一字千金易錯字庫 - 預先準備的 500 題超豐富題庫
const CHARACTER_TEST_POOL = [
  {
    "char": "痙",
    "zhuyin": "ㄐㄧㄥˋ",
    "clue": "（　）攣",
    "searchWord": "痙攣"
  },
  {
    "char": "攣",
    "zhuyin": "ㄌㄨㄢˊ",
    "clue": "痙（　）",
    "searchWord": "痙攣"
  },
  {
    "char": "足",
    "zhuyin": "ㄗㄨˊ",
    "clue": "畫蛇添（　）",
    "searchWord": "畫蛇添足"
  },
  {
    "char": "兔",
    "zhuyin": "ㄊㄨˋ",
    "clue": "守株待（　）",
    "searchWord": "守株待兔"
  },
  {
    "char": "牢",
    "zhuyin": "ㄌㄠˊ",
    "clue": "亡羊補（　）",
    "searchWord": "亡羊補牢"
  },
  {
    "char": "盾",
    "zhuyin": "ㄉㄨㄣˋ",
    "clue": "自相矛（　）",
    "searchWord": "自相矛盾"
  },
  {
    "char": "劍",
    "zhuyin": "ㄐㄧㄢˋ",
    "clue": "刻舟求（　）",
    "searchWord": "刻舟求劍"
  },
  {
    "char": "威",
    "zhuyin": "ㄨㄟ",
    "clue": "狐假虎（　）",
    "searchWord": "狐假虎威"
  },
  {
    "char": "鳥",
    "zhuyin": "ㄋㄧㄠˇ",
    "clue": "驚弓之（　）",
    "searchWord": "驚弓之鳥"
  },
  {
    "char": "蛙",
    "zhuyin": "ㄨㄚ",
    "clue": "井底之（　）",
    "searchWord": "井底之蛙"
  },
  {
    "char": "雕",
    "zhuyin": "ㄉㄧㄠ",
    "clue": "一箭雙（　）",
    "searchWord": "一箭雙雕"
  },
  {
    "char": "廢",
    "zhuyin": "ㄈㄟˋ",
    "clue": "半途而（　）",
    "searchWord": "半途而廢"
  },
  {
    "char": "形",
    "zhuyin": "ㄒㄧㄥˊ",
    "clue": "得意忘（　）",
    "searchWord": "得意忘形"
  },
  {
    "char": "琴",
    "zhuyin": "ㄑㄧㄣˊ",
    "clue": "對牛彈（　）",
    "searchWord": "對牛彈琴"
  },
  {
    "char": "動",
    "zhuyin": "ㄉㄨㄥˋ",
    "clue": "風吹草（　）",
    "searchWord": "風吹草動"
  },
  {
    "char": "語",
    "zhuyin": "ㄩˇ",
    "clue": "花言巧（　）",
    "searchWord": "花言巧語"
  },
  {
    "char": "飢",
    "zhuyin": "ㄐㄧ",
    "clue": "畫餅充（　）",
    "searchWord": "畫餅充飢"
  },
  {
    "char": "寧",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "雞犬不（　）",
    "searchWord": "雞犬不寧"
  },
  {
    "char": "非",
    "zhuyin": "ㄈㄟ",
    "clue": "口是心（　）",
    "searchWord": "口是心非"
  },
  {
    "char": "石",
    "zhuyin": "ㄕˊ",
    "clue": "落井下（　）",
    "searchWord": "落井下石"
  },
  {
    "char": "長",
    "zhuyin": "ㄓㄤˇ",
    "clue": "揠苗助（　）",
    "searchWord": "揠苗助長"
  },
  {
    "char": "水",
    "zhuyin": "ㄕㄨㄟˇ",
    "clue": "如魚得（　）",
    "searchWord": "如魚得水"
  },
  {
    "char": "出",
    "zhuyin": "ㄔㄨ",
    "clue": "水落石（　）",
    "searchWord": "水落石出"
  },
  {
    "char": "苦",
    "zhuyin": "ㄎㄨˇ",
    "clue": "同甘共（　）",
    "searchWord": "同甘共苦"
  },
  {
    "char": "趙",
    "zhuyin": "ㄓㄠˋ",
    "clue": "完璧歸（　）",
    "searchWord": "完璧歸趙"
  },
  {
    "char": "炭",
    "zhuyin": "ㄊㄢˋ",
    "clue": "雪中送（　）",
    "searchWord": "雪中送炭"
  },
  {
    "char": "馬",
    "zhuyin": "ㄇㄚˇ",
    "clue": "指鹿為（　）",
    "searchWord": "指鹿為馬"
  },
  {
    "char": "兵",
    "zhuyin": "ㄅㄧㄥ",
    "clue": "紙上談（　）",
    "searchWord": "紙上談兵"
  },
  {
    "char": "四",
    "zhuyin": "ㄙˋ",
    "clue": "朝三暮（　）",
    "searchWord": "朝三暮四"
  },
  {
    "char": "棄",
    "zhuyin": "ㄑㄧˋ",
    "clue": "自暴自（　）",
    "searchWord": "自暴自棄"
  },
  {
    "char": "煉",
    "zhuyin": "ㄌㄧㄢˋ",
    "clue": "千錘百（　）",
    "searchWord": "千錘百煉"
  },
  {
    "char": "分",
    "zhuyin": "ㄈㄣ",
    "clue": "入木三（　）",
    "searchWord": "入木三分"
  },
  {
    "char": "一",
    "zhuyin": "ㄧ",
    "clue": "百裡挑（　）",
    "searchWord": "百裡挑一"
  },
  {
    "char": "竹",
    "zhuyin": "ㄓㄨˊ",
    "clue": "胸有成（　）",
    "searchWord": "胸有成竹"
  },
  {
    "char": "速",
    "zhuyin": "ㄙㄨˋ",
    "clue": "不（　）之客",
    "searchWord": "不速之客"
  },
  {
    "char": "求",
    "zhuyin": "ㄑㄧㄡˊ",
    "clue": "供不應（　）",
    "searchWord": "供不應求"
  },
  {
    "char": "恩",
    "zhuyin": "ㄣ",
    "clue": "忘（　）負義",
    "searchWord": "忘恩負義"
  },
  {
    "char": "神",
    "zhuyin": "ㄕㄣˊ",
    "clue": "聚精會（　）",
    "searchWord": "聚精會神"
  },
  {
    "char": "日",
    "zhuyin": "ㄖˋ",
    "clue": "重見天（　）",
    "searchWord": "重見天日"
  },
  {
    "char": "一",
    "zhuyin": "ㄧ",
    "clue": "千篇（　）律",
    "searchWord": "千篇一律"
  },
  {
    "char": "名",
    "zhuyin": "ㄇㄧㄥˊ",
    "clue": "莫（　）其妙",
    "searchWord": "莫名其妙"
  },
  {
    "char": "風",
    "zhuyin": "ㄈㄥ",
    "clue": "兩袖清（　）",
    "searchWord": "兩袖清風"
  },
  {
    "char": "山",
    "zhuyin": "ㄕㄢ",
    "clue": "東（　）再起",
    "searchWord": "東山再起"
  },
  {
    "char": "海",
    "zhuyin": "ㄏㄞˇ",
    "clue": "石沉大（　）",
    "searchWord": "石沉大海"
  },
  {
    "char": "人",
    "zhuyin": "ㄖㄣˊ",
    "clue": "助（　）為樂",
    "searchWord": "助人為樂"
  },
  {
    "char": "天",
    "zhuyin": "ㄊㄧㄢ",
    "clue": "怨（　）尤人",
    "searchWord": "怨天尤人"
  },
  {
    "char": "地",
    "zhuyin": "ㄉㄧˋ",
    "clue": "頂天立（　）",
    "searchWord": "頂天立地"
  },
  {
    "char": "口",
    "zhuyin": "ㄎㄡˇ",
    "clue": "啞（　）無言",
    "searchWord": "啞口無言"
  },
  {
    "char": "意",
    "zhuyin": "ㄧˋ",
    "clue": "三心二（　）",
    "searchWord": "三心二意"
  },
  {
    "char": "心",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "粗（　）大意",
    "searchWord": "粗心大意"
  },
  {
    "char": "日",
    "zhuyin": "ㄖˋ",
    "clue": "（　）新月異",
    "searchWord": "日新月異"
  },
  {
    "char": "雷",
    "zhuyin": "ㄌㄟˊ",
    "clue": "如（　）貫耳",
    "searchWord": "如雷貫耳"
  },
  {
    "char": "熱",
    "zhuyin": "ㄖㄜˋ",
    "clue": "網路上引起（　）烈討論。",
    "searchWord": "熱烈"
  },
  {
    "char": "尷",
    "zhuyin": "ㄍㄢ",
    "clue": "場面顯得十分（　）尬。",
    "searchWord": "尷尬"
  },
  {
    "char": "尬",
    "zhuyin": "ㄍㄚˋ",
    "clue": "忘詞導致氣氛尷（　）。",
    "searchWord": "尷尬"
  },
  {
    "char": "肺",
    "zhuyin": "ㄈㄟˋ",
    "clue": "這是發自（　）腑的真心話。",
    "searchWord": "發自肺腑"
  },
  {
    "char": "冒",
    "zhuyin": "ㄇㄠˋ",
    "clue": "我們（　）著雨前行。",
    "searchWord": "冒著"
  },
  {
    "char": "梁",
    "zhuyin": "ㄌㄧㄤˊ",
    "clue": "做人不能偷（　）換柱。",
    "searchWord": "偷梁換柱"
  },
  {
    "char": "鼎",
    "zhuyin": "ㄉㄧㄥˇ",
    "clue": "感謝您的（　）力相助。",
    "searchWord": "鼎力相助"
  },
  {
    "char": "憋",
    "zhuyin": "ㄅㄧㄝ",
    "clue": "他快要（　）不住笑了。",
    "searchWord": "憋不住"
  },
  {
    "char": "戳",
    "zhuyin": "ㄔㄨㄛ",
    "clue": "這個泡沫一（　）即破。",
    "searchWord": "一戳即破"
  },
  {
    "char": "蒐",
    "zhuyin": "ㄙㄡ",
    "clue": "警方努力（　）集證據。",
    "searchWord": "蒐集"
  },
  {
    "char": "幕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "找出事件的（　）後黑手。",
    "searchWord": "幕後黑手"
  },
  {
    "char": "慕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "許多人（　）名前來參觀。",
    "searchWord": "慕名"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "霧太大，難以（　）明方向。",
    "searchWord": "辨明"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "他在大會上（　）才無礙。",
    "searchWord": "辯才無礙"
  },
  {
    "char": "磬",
    "zhuyin": "ㄑㄧㄥˋ",
    "clue": "他家境室如懸（　）。",
    "searchWord": "室如懸磬"
  },
  {
    "char": "磐",
    "zhuyin": "ㄆㄢˊ",
    "clue": "感情堅如（　）石。",
    "searchWord": "堅如磐石"
  },
  {
    "char": "藉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這使他聲名狼（　）。",
    "searchWord": "聲名狼藉"
  },
  {
    "char": "籍",
    "zhuyin": "ㄐㄧˊ",
    "clue": "在政壇上他只是一個（　）（　）無名的人。",
    "searchWord": "籍籍無名"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "做事一定要再接再（　）。",
    "searchWord": "再接再厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這句話極具鼓（　）作用。",
    "searchWord": "鼓勵"
  },
  {
    "char": "輟",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "他因貧困而（　）學。",
    "searchWord": "輟學"
  },
  {
    "char": "綴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "天空點（　）著星星。",
    "searchWord": "點綴"
  },
  {
    "char": "啜",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "她躲在角落低聲（　）泣。",
    "searchWord": "啜泣"
  },
  {
    "char": "緝",
    "zhuyin": "ㄑㄧˋ",
    "clue": "警方發布通（　）令。",
    "searchWord": "通緝"
  },
  {
    "char": "輯",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這本書的編（　）很好。",
    "searchWord": "編輯"
  },
  {
    "char": "揖",
    "zhuyin": "ㄧ",
    "clue": "他向長輩作（　）行禮。",
    "searchWord": "作揖"
  },
  {
    "char": "葺",
    "zhuyin": "ㄑㄧˋ",
    "clue": "老屋需要修（　）防漏。",
    "searchWord": "修葺"
  },
  {
    "char": "戢",
    "zhuyin": "ㄐㄧˊ",
    "clue": "兩國偃兵（　）戈。",
    "searchWord": "偃兵戢戈"
  },
  {
    "char": "戈",
    "zhuyin": "ㄍㄜ",
    "clue": "兩國偃武修（　）。",
    "searchWord": "偃武修戈"
  },
  {
    "char": "戌",
    "zhuyin": "ㄒㄩ",
    "clue": "地支順序有（　）字。",
    "searchWord": "戌"
  },
  {
    "char": "戊",
    "zhuyin": "ㄨˋ",
    "clue": "天干順序有（　）字。",
    "searchWord": "戊"
  },
  {
    "char": "戍",
    "zhuyin": "ㄕㄨˋ",
    "clue": "戰士前往邊防（　）守。",
    "searchWord": "防戍"
  },
  {
    "char": "戎",
    "zhuyin": "ㄖㄨㄥˊ",
    "clue": "將軍決定投筆從（　）。",
    "searchWord": "投筆從戎"
  },
  {
    "char": "冗",
    "zhuyin": "ㄖㄨㄥˇ",
    "clue": "文章顯得相當（　）長。",
    "searchWord": "冗長"
  },
  {
    "char": "沈",
    "zhuyin": "ㄔㄣˊ",
    "clue": "現場陷入一片（　）默。",
    "searchWord": "沈默"
  },
  {
    "char": "枕",
    "zhuyin": "ㄓㄣˇ",
    "clue": "將士們（　）戈待旦。",
    "searchWord": "枕戈待旦"
  },
  {
    "char": "耽",
    "zhuyin": "ㄉㄢ",
    "clue": "沉迷電玩會（　）誤學業。",
    "searchWord": "耽誤"
  },
  {
    "char": "眈",
    "zhuyin": "ㄉㄢ",
    "clue": "強國虎視（　）（　）。",
    "searchWord": "虎視眈眈"
  },
  {
    "char": "諂",
    "zhuyin": "ㄔㄢˇ",
    "clue": "他極力（　）媚主管。",
    "searchWord": "諂媚"
  },
  {
    "char": "陷",
    "zhuyin": "ㄒㄧㄢˋ",
    "clue": "車子在泥沼中深（　）。",
    "searchWord": "深陷"
  },
  {
    "char": "焰",
    "zhuyin": "ㄧㄢˋ",
    "clue": "大火的烈（　）沖天。",
    "searchWord": "烈焰"
  },
  {
    "char": "掐",
    "zhuyin": "ㄑㄧㄚ",
    "clue": "他（　）了自己大腿一下。",
    "searchWord": "掐"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "瓷器有一處（　）疵。",
    "searchWord": "瑕疵"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "他忙得無（　）顧及娛樂。",
    "searchWord": "無暇"
  },
  {
    "char": "遐",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這引發無限（　）想。",
    "searchWord": "遐想"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這塊美玉潔白無（　）。",
    "searchWord": "潔白無瑕"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "顧客多到應接不（　）。",
    "searchWord": "應接不暇"
  },
  {
    "char": "遐",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這留給人（　）思空間。",
    "searchWord": "遐思"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "多運動大有（　）益。",
    "searchWord": "裨益"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "這對大局毫無（　）補。",
    "searchWord": "裨補"
  },
  {
    "char": "稗",
    "zhuyin": "ㄅㄞˋ",
    "clue": "他愛看（　）官野史。",
    "searchWord": "稗官野史"
  },
  {
    "char": "碑",
    "zhuyin": "ㄅㄟ",
    "clue": "古（　）已經被風化。",
    "searchWord": "古碑"
  },
  {
    "char": "脾",
    "zhuyin": "ㄆㄧˊ",
    "clue": "他的（　）氣很暴躁。",
    "searchWord": "脾氣"
  },
  {
    "char": "俾",
    "zhuyin": "ㄅㄧˋ",
    "clue": "請準時出發（　）便抵達。",
    "searchWord": "俾便"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "土地十分乾（　）。",
    "searchWord": "乾涸"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "他如（　）轍之鮒。",
    "searchWord": "涸轍之鮒"
  },
  {
    "char": "錮",
    "zhuyin": "ㄍㄨˋ",
    "clue": "他被禁（　）在牢房中。",
    "searchWord": "禁錮"
  },
  {
    "char": "固",
    "zhuyin": "ㄍㄨˋ",
    "clue": "做事情的基礎穩（　）。",
    "searchWord": "穩固"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "水井已完全枯（　）。",
    "searchWord": "枯涸"
  },
  {
    "char": "聒",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "鳥在樹上（　）噪。",
    "searchWord": "聒噪"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "鄉村生活寧靜（　）適。",
    "searchWord": "恬適"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "他居然（　）不知恥。",
    "searchWord": "恬不知恥"
  },
  {
    "char": "颳",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "外面正（　）著大風。",
    "searchWord": "颳風"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "大家對他（　）目相看。",
    "searchWord": "刮目相看"
  },
  {
    "char": "括",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "活動包（　）多項表演。",
    "searchWord": "包括"
  },
  {
    "char": "憩",
    "zhuyin": "ㄑㄧˋ",
    "clue": "我們在涼亭小（　）。",
    "searchWord": "小憩"
  },
  {
    "char": "憩",
    "zhuyin": "ㄑㄧˋ",
    "clue": "旅途中在此稍作休（　）。",
    "searchWord": "休憩"
  },
  {
    "char": "契",
    "zhuyin": "ㄑㄧˋ",
    "clue": "雙方合作默（　）十足。",
    "searchWord": "默契"
  },
  {
    "char": "潔",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他做事（　）身自好。",
    "searchWord": "潔身自好"
  },
  {
    "char": "劫",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他是（　）後餘生的倖存者。",
    "searchWord": "劫後餘生"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他的反應很敏（　）。",
    "searchWord": "敏捷"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "前線（　）報頻傳。",
    "searchWord": "捷報"
  },
  {
    "char": "竭",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "我會（　）盡全力完成。",
    "searchWord": "竭盡全力"
  },
  {
    "char": "拮",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他最近生活（　）据。",
    "searchWord": "拮据"
  },
  {
    "char": "据",
    "zhuyin": "ㄐㄩ",
    "clue": "他最近生活拮（　）。",
    "searchWord": "拮据"
  },
  {
    "char": "詰",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "法官在法庭上（　）問嫌犯。",
    "searchWord": "詰問"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "秋天到了（　）子紅了。",
    "searchWord": "橘子"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "這杯（　）汁酸甜可口。",
    "searchWord": "橘汁"
  },
  {
    "char": "棘",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這是一件（　）手的事。",
    "searchWord": "棘手"
  },
  {
    "char": "辣",
    "zhuyin": "ㄌㄚˋ",
    "clue": "四川菜以麻（　）著稱。",
    "searchWord": "麻辣"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "真偽十分難（　）。",
    "searchWord": "真偽難辨"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "不要百般狡（　）。",
    "searchWord": "狡辯"
  },
  {
    "char": "辮",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "她綁著長（　）子。",
    "searchWord": "辮子"
  },
  {
    "char": "辦",
    "zhuyin": "ㄅㄢˋ",
    "clue": "這件事立刻（　）理。",
    "searchWord": "辦理"
  },
  {
    "char": "瓣",
    "zhuyin": "ㄅㄢˋ",
    "clue": "玫瑰花（　）隨風飄落。",
    "searchWord": "花瓣"
  },
  {
    "char": "辦",
    "zhuyin": "ㄅㄢˋ",
    "clue": "學校盛大舉（　）運動會。",
    "searchWord": "舉辦"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "醫生在診（　）搏。",
    "searchWord": "脈搏"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "這座山（　）綿延極廣。",
    "searchWord": "山脈"
  },
  {
    "char": "博",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他學問十分淵（　）。",
    "searchWord": "淵博"
  },
  {
    "char": "搏",
    "zhuyin": "ㄅㄛˊ",
    "clue": "豹正在與獵物（　）鬥。",
    "searchWord": "搏鬥"
  },
  {
    "char": "膊",
    "zhuyin": "ㄅㄛˊ",
    "clue": "農夫赤（　）下田。",
    "searchWord": "赤膊"
  },
  {
    "char": "駁",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他的論點被反（　）。",
    "searchWord": "反駁"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "車在山路上顛（　）。",
    "searchWord": "顛簸"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˋ",
    "clue": "用（　）箕篩選穀物。",
    "searchWord": "簸箕"
  },
  {
    "char": "播",
    "zhuyin": "ㄅㄛˋ",
    "clue": "電台正廣（　）警報。",
    "searchWord": "廣播"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "把專款（　）付受災戶。",
    "searchWord": "撥付"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "他用手指輕（　）琴弦。",
    "searchWord": "撥琴"
  },
  {
    "char": "攀",
    "zhuyin": "ㄆㄢ",
    "clue": "藤蔓沿著牆（　）爬。",
    "searchWord": "攀爬"
  },
  {
    "char": "樊",
    "zhuyin": "ㄈㄢˊ",
    "clue": "鳥被關在（　）籠中。",
    "searchWord": "樊籠"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "他露出貪（　）的目光。",
    "searchWord": "貪婪"
  },
  {
    "char": "焚",
    "zhuyin": "ㄈㄣˊ",
    "clue": "大火（　）毀了整片森林。",
    "searchWord": "焚毀"
  },
  {
    "char": "梵",
    "zhuyin": "ㄈㄢˋ",
    "clue": "這裡充滿（　）宇氣息。",
    "searchWord": "梵宇"
  },
  {
    "char": "縝",
    "zhuyin": "ㄓㄣˇ",
    "clue": "做事思慮（　）密。",
    "searchWord": "縝密"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "行事一定要謹（　）。",
    "searchWord": "謹慎"
  },
  {
    "char": "填",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "請（　）寫正確聯絡電話。",
    "searchWord": "填寫"
  },
  {
    "char": "顛",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "他整個人瘋瘋（　）（　）。",
    "searchWord": "瘋瘋顛顛"
  },
  {
    "char": "巔",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "登上人生的（　）峰。",
    "searchWord": "巔峰"
  },
  {
    "char": "癲",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "他突然（　）癇發作。",
    "searchWord": "癲癇"
  },
  {
    "char": "嗔",
    "zhuyin": "ㄔㄣ",
    "clue": "她面露（　）色表示不滿。",
    "searchWord": "嗔色"
  },
  {
    "char": "瞋",
    "zhuyin": "ㄔㄣ",
    "clue": "他氣得（　）目結舌。",
    "searchWord": "瞋目結舌"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "做人行事宜審（　）。",
    "searchWord": "審慎"
  },
  {
    "char": "鎮",
    "zhuyin": "ㄓㄣˋ",
    "clue": "警察開槍（　）壓暴動。",
    "searchWord": "鎮壓"
  },
  {
    "char": "震",
    "zhuyin": "ㄓㄣˋ",
    "clue": "這起大醜聞（　）驚社會。",
    "searchWord": "震驚"
  },
  {
    "char": "賑",
    "zhuyin": "ㄓㄣˋ",
    "clue": "政府撥款開倉（　）災。",
    "searchWord": "賑災"
  },
  {
    "char": "振",
    "zhuyin": "ㄓㄣˋ",
    "clue": "我們必須（　）作士氣。",
    "searchWord": "振作"
  },
  {
    "char": "陣",
    "zhuyin": "ㄓㄣˋ",
    "clue": "天空中傳來一（　）雷聲。",
    "searchWord": "一陣"
  },
  {
    "char": "朕",
    "zhuyin": "ㄓㄣˋ",
    "clue": "古代皇帝自稱為（　）。",
    "searchWord": "朕"
  },
  {
    "char": "疹",
    "zhuyin": "ㄓㄣˇ",
    "clue": "他身上起了紅（　）。",
    "searchWord": "紅疹"
  },
  {
    "char": "診",
    "zhuyin": "ㄓㄣˇ",
    "clue": "醫生做詳細（　）斷。",
    "searchWord": "診斷"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "老師嚴（　）地批評學生。",
    "searchWord": "嚴厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這是一本（　）志的好書。",
    "searchWord": "勵志"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這家百年老店（　）經滄桑。",
    "searchWord": "歷經"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "（　）史是不容忘記的。",
    "searchWord": "歷史"
  },
  {
    "char": "曆",
    "zhuyin": "ㄌㄧˋ",
    "clue": "新年換上新日（　）。",
    "searchWord": "日曆"
  },
  {
    "char": "靂",
    "zhuyin": "ㄌㄧˋ",
    "clue": "晴天霹（　）的消息。",
    "searchWord": "霹靂"
  },
  {
    "char": "礪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "在艱苦中磨（　）意志。",
    "searchWord": "磨礪"
  },
  {
    "char": "罹",
    "zhuyin": "ㄌㄧˊ",
    "clue": "不幸（　）難者眾多。",
    "searchWord": "罹難"
  },
  {
    "char": "離",
    "zhuyin": "ㄌㄧˊ",
    "clue": "兩地距（　）遙遠。",
    "searchWord": "距離"
  },
  {
    "char": "籬",
    "zhuyin": "ㄌㄧˊ",
    "clue": "院子圍著木（　）笆。",
    "searchWord": "籬笆"
  },
  {
    "char": "釐",
    "zhuyin": "ㄌㄧˊ",
    "clue": "量度要分（　）不差。",
    "searchWord": "釐毫"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "真是一對璧（　）佳偶。",
    "searchWord": "璧儷"
  },
  {
    "char": "荔",
    "zhuyin": "ㄌㄧˋ",
    "clue": "（　）枝甜美多汁。",
    "searchWord": "荔枝"
  },
  {
    "char": "麗",
    "zhuyin": "ㄌㄧˋ",
    "clue": "風景美（　）如畫。",
    "searchWord": "美麗"
  },
  {
    "char": "莉",
    "zhuyin": "ㄌㄧˋ",
    "clue": "茉（　）花悄悄綻放。",
    "searchWord": "茉莉"
  },
  {
    "char": "例",
    "zhuyin": "ㄌㄧˋ",
    "clue": "按慣（　）舉辦旅遊。",
    "searchWord": "慣例"
  },
  {
    "char": "俐",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這女孩做事伶（　）。",
    "searchWord": "伶俐"
  },
  {
    "char": "櫪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "老馬伏（　），志在千里。",
    "searchWord": "老馬伏櫪"
  },
  {
    "char": "邐",
    "zhuyin": "ㄌㄧˇ",
    "clue": "沿途風景迤（　）。",
    "searchWord": "迤邐"
  },
  {
    "char": "蠡",
    "zhuyin": "ㄌㄧˇ",
    "clue": "管窺（　）測的見解。",
    "searchWord": "管窺蠡測"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "伉（　）攜手出席活動。",
    "searchWord": "伉儷"
  },
  {
    "char": "灑",
    "zhuyin": "ㄙㄚˇ",
    "clue": "清潔工在路面（　）水。",
    "searchWord": "灑水"
  },
  {
    "char": "酒",
    "zhuyin": "ㄐㄧㄡˇ",
    "clue": "開車不喝（　）。",
    "searchWord": "酒精"
  },
  {
    "char": "矚",
    "zhuyin": "ㄓㄨˇ",
    "clue": "萬眾（　）目的決賽。",
    "searchWord": "矚目"
  },
  {
    "char": "屬",
    "zhuyin": "ㄕㄨˇ",
    "clue": "這件失物歸（　）於誰？",
    "searchWord": "歸屬"
  },
  {
    "char": "囑",
    "zhuyin": "ㄓㄨˇ",
    "clue": "他留下感人的遺（　）。",
    "searchWord": "遺囑"
  },
  {
    "char": "佇",
    "zhuyin": "ㄓㄨˋ",
    "clue": "他在雨中（　）立許久。",
    "searchWord": "佇立"
  },
  {
    "char": "貯",
    "zhuyin": "ㄓㄨˋ",
    "clue": "多（　）備防汛沙包。",
    "searchWord": "貯備"
  },
  {
    "char": "駐",
    "zhuyin": "ㄓㄨˋ",
    "clue": "軍隊已進（　）邊防。",
    "searchWord": "進駐"
  },
  {
    "char": "助",
    "zhuyin": "ㄓㄨˋ",
    "clue": "互相幫（　）是美德。",
    "searchWord": "幫助"
  },
  {
    "char": "蛀",
    "zhuyin": "ㄓㄨˋ",
    "clue": "糖吃多容易長（　）牙。",
    "searchWord": "蛀牙"
  },
  {
    "char": "築",
    "zhuyin": "ㄓㄨˊ",
    "clue": "工人正在建（　）大樓。",
    "searchWord": "建築"
  },
  {
    "char": "逐",
    "zhuyin": "ㄓㄨˊ",
    "clue": "不能隨波（　）流。",
    "searchWord": "隨波逐流"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨˋ",
    "clue": "這本名（　）譯成多國語。",
    "searchWord": "名著"
  },
  {
    "char": "署",
    "zhuyin": "ㄕㄨˇ",
    "clue": "公文需要局長簽（　）。",
    "searchWord": "簽署"
  },
  {
    "char": "曙",
    "zhuyin": "ㄕㄨˇ",
    "clue": "天空露出一線（　）光。",
    "searchWord": "曙光"
  },
  {
    "char": "薯",
    "zhuyin": "ㄕㄨˇ",
    "clue": "炸馬鈴（　）條非常香。",
    "searchWord": "馬鈴薯"
  },
  {
    "char": "暑",
    "zhuyin": "ㄕㄨˇ",
    "clue": "漫長（　）假是快樂時光。",
    "searchWord": "暑假"
  },
  {
    "char": "墅",
    "zhuyin": "ㄕㄨˋ",
    "clue": "買了一棟度假別（　）。",
    "searchWord": "別墅"
  },
  {
    "char": "塑",
    "zhuyin": "ㄙㄨˋ",
    "clue": "泥（　）作品栩栩如生。",
    "searchWord": "泥塑"
  },
  {
    "char": "宿",
    "zhuyin": "ㄙㄨˋ",
    "clue": "今晚在旅店寄（　）。",
    "searchWord": "寄宿"
  },
  {
    "char": "素",
    "zhuyin": "ㄙㄨˋ",
    "clue": "她平時穿著樸（　）。",
    "searchWord": "樸素"
  },
  {
    "char": "訴",
    "zhuyin": "ㄙㄨˋ",
    "clue": "他提起民事（　）訟。",
    "searchWord": "訴訟"
  },
  {
    "char": "溯",
    "zhuyin": "ㄙㄨˋ",
    "clue": "傳統可追（　）到百年前。",
    "searchWord": "追溯"
  },
  {
    "char": "夙",
    "zhuyin": "ㄙㄨˋ",
    "clue": "他終日（　）夜匪懈。",
    "searchWord": "夙夜匪懈"
  },
  {
    "char": "肅",
    "zhuyin": "ㄙㄨˋ",
    "clue": "大堂氣氛十分嚴（　）。",
    "searchWord": "嚴肅"
  },
  {
    "char": "簌",
    "zhuyin": "ㄙㄨˋ",
    "clue": "落葉發出（　）（　）聲。",
    "searchWord": "簌簌"
  },
  {
    "char": "速",
    "zhuyin": "ㄙㄨˋ",
    "clue": "車子的（　）度極快。",
    "searchWord": "速度"
  },
  {
    "char": "粟",
    "zhuyin": "ㄙㄨˋ",
    "clue": "人如滄海一（　）。",
    "searchWord": "滄海一粟"
  },
  {
    "char": "蘇",
    "zhuyin": "ㄙㄨ",
    "clue": "春天萬物復（　）。",
    "searchWord": "復蘇"
  },
  {
    "char": "酥",
    "zhuyin": "ㄙㄨ",
    "clue": "鳳梨（　）口感極佳。",
    "searchWord": "鳳梨酥"
  },
  {
    "char": "俗",
    "zhuyin": "ㄙㄨˊ",
    "clue": "屏除陳規陋（　）。",
    "searchWord": "陋俗"
  },
  {
    "char": "悚",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "情節令人毛骨（　）然。",
    "searchWord": "毛骨悚然"
  },
  {
    "char": "聳",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "高（　）的大樓直插雲霄。",
    "searchWord": "高聳"
  },
  {
    "char": "訟",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "兩家陷入官（　）。",
    "searchWord": "官訟"
  },
  {
    "char": "頌",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這首詩歌（　）英雄。",
    "searchWord": "歌頌"
  },
  {
    "char": "送",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "爸爸開車（　）我到車站。",
    "searchWord": "送行"
  },
  {
    "char": "宋",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這是（　）朝時期的花瓶。",
    "searchWord": "宋朝"
  },
  {
    "char": "誦",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "學生正大聲朗（　）。",
    "searchWord": "朗誦"
  },
  {
    "char": "松",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "古（　）迎風挺立。",
    "searchWord": "古松"
  },
  {
    "char": "鬆",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "工作完了可以放（　）。",
    "searchWord": "放鬆"
  },
  {
    "char": "嵩",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "這座山尊稱為（　）山。",
    "searchWord": "嵩山"
  },
  {
    "char": "慫",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "受朋友（　）恿犯了錯。",
    "searchWord": "慫恿"
  },
  {
    "char": "懍",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "眾人畏（　）遵命。",
    "searchWord": "畏懍"
  },
  {
    "char": "凜",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "寒風（　）（　）街上無人。",
    "searchWord": "寒風凜凜"
  },
  {
    "char": "鄰",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "遠親不如近（　）。",
    "searchWord": "近鄰"
  },
  {
    "char": "臨",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "歡迎貴賓光（　）指導。",
    "searchWord": "光臨"
  },
  {
    "char": "林",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "原始森（　）樹木茂密。",
    "searchWord": "森林"
  },
  {
    "char": "淋",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "他被大雨（　）濕了。",
    "searchWord": "淋雨"
  },
  {
    "char": "鱗",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "魚身上的（　）片發光。",
    "searchWord": "鱗片"
  },
  {
    "char": "麟",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "鳳毛（　）角的人才。",
    "searchWord": "鳳毛麟角"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "做公益不要（　）嗇。",
    "searchWord": "吝嗇"
  },
  {
    "char": "玲",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "玉雕小巧（　）瓏。",
    "searchWord": "玲瓏"
  },
  {
    "char": "伶",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "這孩子口齒（　）俐。",
    "searchWord": "伶俐"
  },
  {
    "char": "聆",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "大家靜靜（　）聽音樂。",
    "searchWord": "聆聽"
  },
  {
    "char": "齡",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "神木的年（　）已千年。",
    "searchWord": "年齡"
  },
  {
    "char": "羚",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "草原上有（　）羊奔馳。",
    "searchWord": "羚羊"
  },
  {
    "char": "零",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "核對後帳目為（　）。",
    "searchWord": "零錢"
  },
  {
    "char": "鈴",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "下課（　）聲響起。",
    "searchWord": "鈴聲"
  },
  {
    "char": "凌",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "不要（　）侮弱小。",
    "searchWord": "凌侮"
  },
  {
    "char": "陵",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "古代帝王（　）寢遺址。",
    "searchWord": "陵寢"
  },
  {
    "char": "綾",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "衣服是用（　）羅綢緞製成。",
    "searchWord": "綾羅綢緞"
  },
  {
    "char": "嶺",
    "zhuyin": "ㄌㄧㄥˇ",
    "clue": "翻越重重山（　）。",
    "searchWord": "山嶺"
  },
  {
    "char": "領",
    "zhuyin": "ㄌㄧㄥˇ",
    "clue": "他帶（　）團隊前行。",
    "searchWord": "帶領"
  },
  {
    "char": "令",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "禁（　）今日正式實施。",
    "searchWord": "禁令"
  },
  {
    "char": "另",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "這件事要（　）作打算。",
    "searchWord": "另作打算"
  },
  {
    "char": "靈",
    "zhuyin": "ㄌㄧㄥˊ",
    "clue": "這個方法很（　）驗。",
    "searchWord": "靈驗"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "不要（　）惜給掌聲。",
    "searchWord": "吝惜"
  },
  {
    "char": "濘",
    "zhuyin": "ㄋㄧㄥˋ",
    "clue": "車在泥（　）中打滑。",
    "searchWord": "泥濘"
  },
  {
    "char": "寧",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "夜晚十分安（　）。",
    "searchWord": "安寧"
  },
  {
    "char": "檸",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "新鮮的（　）檬紅茶。",
    "searchWord": "檸檬"
  },
  {
    "char": "獰",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "歹徒面目（　）惡。",
    "searchWord": "面目獰惡"
  },
  {
    "char": "凝",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "水汽（　）結成水滴。",
    "searchWord": "凝聚"
  },
  {
    "char": "擬",
    "zhuyin": "ㄋㄧˇ",
    "clue": "政府草（　）新規範。",
    "searchWord": "草擬"
  },
  {
    "char": "疑",
    "zhuyin": "ㄧˊ",
    "clue": "我表示懷（　）。",
    "searchWord": "懷疑"
  },
  {
    "char": "礙",
    "zhuyin": "ㄞˋ",
    "clue": "以免阻（　）交通。",
    "searchWord": "阻礙"
  },
  {
    "char": "癡",
    "zhuyin": "ㄔ",
    "clue": "他是一個郵（　）。",
    "searchWord": "郵癡"
  },
  {
    "char": "痴",
    "zhuyin": "ㄔ",
    "clue": "看他（　）迷的模樣。",
    "searchWord": "痴迷"
  },
  {
    "char": "嗤",
    "zhuyin": "ㄔ",
    "clue": "大家（　）之以鼻。",
    "searchWord": "嗤之以鼻"
  },
  {
    "char": "蚩",
    "zhuyin": "ㄔ",
    "clue": "黃帝與（　）尤大戰。",
    "searchWord": "蚩尤"
  },
  {
    "char": "笞",
    "zhuyin": "ㄔ",
    "clue": "法庭用鞭（　）之刑。",
    "searchWord": "鞭笞"
  },
  {
    "char": "疵",
    "zhuyin": "ㄘ",
    "clue": "衣服有小瑕（　）。",
    "searchWord": "瑕疵"
  },
  {
    "char": "雌",
    "zhuyin": "ㄘ",
    "clue": "這是一隻（　）鳥。",
    "searchWord": "雌鳥"
  },
  {
    "char": "茨",
    "zhuyin": "ㄘ",
    "clue": "茅（　）草屋是住所。",
    "searchWord": "茅茨"
  },
  {
    "char": "慈",
    "zhuyin": "ㄘˊ",
    "clue": "（　）祥的母親看著我。",
    "searchWord": "慈祥"
  },
  {
    "char": "磁",
    "zhuyin": "ㄘˊ",
    "clue": "（　）鐵能吸引鐵。",
    "searchWord": "磁鐵"
  },
  {
    "char": "詞",
    "zhuyin": "ㄘˊ",
    "clue": "（　）寫得非常感人。",
    "searchWord": "歌詞"
  },
  {
    "char": "辭",
    "zhuyin": "ㄘˊ",
    "clue": "決定（　）去工作。",
    "searchWord": "辭去"
  },
  {
    "char": "祠",
    "zhuyin": "ㄘˊ",
    "clue": "到宗（　）祭拜祖先。",
    "searchWord": "宗祠"
  },
  {
    "char": "賜",
    "zhuyin": "ㄙˋ",
    "clue": "感謝上天賞（　）。",
    "searchWord": "賞賜"
  },
  {
    "char": "伺",
    "zhuyin": "ㄙˋ",
    "clue": "歹徒（　）機而動。",
    "searchWord": "伺機"
  },
  {
    "char": "肆",
    "zhuyin": "ㄙˋ",
    "clue": "大（　）宣傳此事。",
    "searchWord": "大肆"
  },
  {
    "char": "寺",
    "zhuyin": "ㄙˋ",
    "clue": "深山古（　）香火旺。",
    "searchWord": "古寺"
  },
  {
    "char": "嗣",
    "zhuyin": "ㄙˋ",
    "clue": "他是唯一的後（　）。",
    "searchWord": "後嗣"
  },
  {
    "char": "飼",
    "zhuyin": "ㄙˋ",
    "clue": "用牧草（　）養牛群。",
    "searchWord": "飼養"
  },
  {
    "char": "巳",
    "zhuyin": "ㄙˋ",
    "clue": "地支有（　）字。",
    "searchWord": "巳"
  },
  {
    "char": "已",
    "zhuyin": "ㄧˇ",
    "clue": "事情（　）經無可挽回。",
    "searchWord": "已經"
  },
  {
    "char": "己",
    "zhuyin": "ㄐㄧˇ",
    "clue": "做人要克（　）復禮。",
    "searchWord": "克己"
  },
  {
    "char": "導",
    "zhuyin": "ㄉㄠˇ",
    "clue": "（　）遊解說詳盡。",
    "searchWord": "導遊"
  },
  {
    "char": "倒",
    "zhuyin": "ㄉㄠˇ",
    "clue": "排山（　）海的力量。",
    "searchWord": "排山倒海"
  },
  {
    "char": "島",
    "zhuyin": "ㄉㄠˇ",
    "clue": "台灣是寶（　）。",
    "searchWord": "寶島"
  },
  {
    "char": "搗",
    "zhuyin": "ㄉㄠˇ",
    "clue": "在課堂上（　）蛋。",
    "searchWord": "搗蛋"
  },
  {
    "char": "稻",
    "zhuyin": "ㄉㄠˋ",
    "clue": "金黃的（　）穗擺動。",
    "searchWord": "稻穗"
  },
  {
    "char": "盜",
    "zhuyin": "ㄉㄠˋ",
    "clue": "遭遇強（　）搶劫。",
    "searchWord": "強盜"
  },
  {
    "char": "道",
    "zhuyin": "ㄉㄠˋ",
    "clue": "做人講（　）義。",
    "searchWord": "道義"
  },
  {
    "char": "悼",
    "zhuyin": "ㄉㄠˋ",
    "clue": "哀（　）受難者。",
    "searchWord": "哀悼"
  },
  {
    "char": "蹈",
    "zhuyin": "ㄉㄠˋ",
    "clue": "她的舞（　）優美。",
    "searchWord": "舞蹈"
  },
  {
    "char": "叨",
    "zhuyin": "ㄉㄠ",
    "clue": "嘮（　）個不停。",
    "searchWord": "嘮叨"
  },
  {
    "char": "饕",
    "zhuyin": "ㄊㄠ",
    "clue": "許多（　）餮食客。",
    "searchWord": "饕餮"
  },
  {
    "char": "滔",
    "zhuyin": "ㄊㄠ",
    "clue": "黃河之水（　）（　）不絕。",
    "searchWord": "滔滔不絕"
  },
  {
    "char": "濤",
    "zhuyin": "ㄊㄠ",
    "clue": "驚（　）駭浪的場面。",
    "searchWord": "驚濤駭浪"
  },
  {
    "char": "掏",
    "zhuyin": "ㄊㄠ",
    "clue": "（　）出百元鈔票。",
    "searchWord": "掏出"
  },
  {
    "char": "逃",
    "zhuyin": "ㄊㄠˊ",
    "clue": "小偷拔腿（　）跑。",
    "searchWord": "逃跑"
  },
  {
    "char": "桃",
    "zhuyin": "ㄊㄠˊ",
    "clue": "花園裡（　）花盛開。",
    "searchWord": "桃花"
  },
  {
    "char": "陶",
    "zhuyin": "ㄊㄠˊ",
    "clue": "這件（　）瓷是藝術品。",
    "searchWord": "陶瓷"
  },
  {
    "char": "淘",
    "zhuyin": "ㄊㄠˊ",
    "clue": "男孩很（　）氣。",
    "searchWord": "淘氣"
  },
  {
    "char": "討",
    "zhuyin": "ㄊㄠˇ",
    "clue": "深入探（　）問題。",
    "searchWord": "探討"
  },
  {
    "char": "套",
    "zhuyin": "ㄊㄠˋ",
    "clue": "這（　）西裝很合身。",
    "searchWord": "套裝"
  },
  {
    "char": "慟",
    "zhuyin": "ㄊㄨㄥˋ",
    "clue": "他哀（　）萬分。",
    "searchWord": "哀慟"
  },
  {
    "char": "痛",
    "zhuyin": "ㄊㄨㄥˋ",
    "clue": "他頭（　）欲裂。",
    "searchWord": "頭痛"
  },
  {
    "char": "同",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "我們在（　）班上課。",
    "searchWord": "同班"
  },
  {
    "char": "銅",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "青（　）雕像很莊嚴。",
    "searchWord": "青銅"
  },
  {
    "char": "桐",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "油（　）花盛開。",
    "searchWord": "油桐花"
  },
  {
    "char": "筒",
    "zhuyin": "ㄊㄨㄥˇ",
    "clue": "丟進垃圾（　）中。",
    "searchWord": "垃圾筒"
  },
  {
    "char": "統",
    "zhuyin": "ㄊㄨㄥˇ",
    "clue": "（　）籌防疫資源。",
    "searchWord": "統籌"
  },
  {
    "char": "通",
    "zhuyin": "ㄊㄨㄥ",
    "clue": "四（　）八達的公路網。",
    "searchWord": "四通八達"
  },
  {
    "char": "贅",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "文章（　）字太多。",
    "searchWord": "贅字"
  },
  {
    "char": "椎",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "他的脊（　）受損。",
    "searchWord": "脊椎"
  },
  {
    "char": "錐",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "生產圓（　）形鋼模。",
    "searchWord": "圓錐"
  },
  {
    "char": "墜",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "流星（　）落山頭。",
    "searchWord": "墜落"
  },
  {
    "char": "追",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "警察（　）捕搶匪。",
    "searchWord": "追捕"
  },
  {
    "char": "拙",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "口齒笨（　）。",
    "searchWord": "笨拙"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "立刻（　）手辦理。",
    "searchWord": "著手"
  },
  {
    "char": "琢",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "精雕細（　）出美玉。",
    "searchWord": "精雕細琢"
  },
  {
    "char": "卓",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "取得（　）越成就。",
    "searchWord": "卓越"
  },
  {
    "char": "濯",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "出淤泥而（　）清漣。",
    "searchWord": "濯清漣"
  },
  {
    "char": "灼",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "發表真知（　）見。",
    "searchWord": "真知灼見"
  },
  {
    "char": "酌",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "反覆斟（　）決定。",
    "searchWord": "斟酌"
  },
  {
    "char": "濁",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "溪水十分混（　）。",
    "searchWord": "混濁"
  },
  {
    "char": "抉",
    "zhuyin": "ㄐㄩㄝˊ",
    "clue": "面臨人生的（　）擇。",
    "searchWord": "抉擇"
  },
  {
    "char": "既",
    "zhuyin": "ㄐㄧˋ",
    "clue": "（　）往不咎的態度。",
    "searchWord": "既往不咎"
  },
  {
    "char": "躁",
    "zhuyin": "ㄗㄠˋ",
    "clue": "千萬不要暴（　）。",
    "searchWord": "暴躁"
  },
  {
    "char": "頃",
    "zhuyin": "ㄑㄧㄥˇ",
    "clue": "（　）刻之間下起暴雨。",
    "searchWord": "頃刻"
  },
  {
    "char": "傾",
    "zhuyin": "ㄑㄧㄥ",
    "clue": "下起（　）盆大雨。",
    "searchWord": "傾盆大雨"
  },
  {
    "char": "韁",
    "zhuyin": "ㄐㄧㄤ",
    "clue": "宛如脫（　）野馬。",
    "searchWord": "脫韁野馬"
  },
  {
    "char": "鰈",
    "zhuyin": "ㄉㄧㄝˊ",
    "clue": "他們鶼（　）情深。",
    "searchWord": "鶼鰈情深"
  },
  {
    "char": "蒂",
    "zhuyin": "ㄉㄧˋ",
    "clue": "觀念根深（　）固。",
    "searchWord": "根深蒂固"
  },
  {
    "char": "懦",
    "zhuyin": "ㄋㄨㄛˋ",
    "clue": "絕不能軟（　）。",
    "searchWord": "懦弱"
  },
  {
    "char": "顢",
    "zhuyin": "ㄇㄢˊ",
    "clue": "官員辦事（　）頇。",
    "searchWord": "顢頇"
  },
  {
    "char": "頇",
    "zhuyin": "ㄏㄢ",
    "clue": "辦事顢（　）惹怒大眾。",
    "searchWord": "顢頇"
  },
  {
    "char": "姍",
    "zhuyin": "ㄕㄢ",
    "clue": "主角（　）（　）來遲。",
    "searchWord": "姍姍來遲"
  },
  {
    "char": "惴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "他整天（　）（　）不安。",
    "searchWord": "惴惴不安"
  },
  {
    "char": "揣",
    "zhuyin": "ㄔㄨㄞˇ",
    "clue": "難以（　）摩大師心思。",
    "searchWord": "揣摩"
  },
  {
    "char": "馳",
    "zhuyin": "ㄔˊ",
    "clue": "跑車風（　）電掣。",
    "searchWord": "風馳電掣"
  },
  {
    "char": "畫",
    "zhuyin": "ㄏㄨㄚˋ",
    "clue": "（　）蛇添足",
    "searchWord": "畫蛇添足"
  },
  {
    "char": "守",
    "zhuyin": "ㄕㄡˇ",
    "clue": "（　）株待兔",
    "searchWord": "守株待兔"
  },
  {
    "char": "補",
    "zhuyin": "ㄅㄨˇ",
    "clue": "亡羊（　）牢十分要緊。",
    "searchWord": "亡羊補牢"
  },
  {
    "char": "矛",
    "zhuyin": "ㄇㄠˊ",
    "clue": "自相（　）盾",
    "searchWord": "自相矛盾"
  },
  {
    "char": "求",
    "zhuyin": "ㄑㄧㄡˊ",
    "clue": "刻舟（　）劍",
    "searchWord": "刻舟求劍"
  },
  {
    "char": "假",
    "zhuyin": "ㄐㄧㄚˇ",
    "clue": "狐（　）虎威",
    "searchWord": "狐假虎威"
  },
  {
    "char": "之",
    "zhuyin": "ㄓ",
    "clue": "驚弓（　）鳥",
    "searchWord": "驚弓之鳥"
  },
  {
    "char": "之",
    "zhuyin": "ㄓ",
    "clue": "井底（　）蛙",
    "searchWord": "井底之蛙"
  },
  {
    "char": "雙",
    "zhuyin": "ㄕㄨㄤ",
    "clue": "一箭（　）雕",
    "searchWord": "一箭雙雕"
  },
  {
    "char": "途",
    "zhuyin": "ㄊㄨˊ",
    "clue": "半（　）而廢",
    "searchWord": "半途而廢"
  },
  {
    "char": "忘",
    "zhuyin": "ㄨㄤˋ",
    "clue": "得意（　）形",
    "searchWord": "得意忘形"
  },
  {
    "char": "彈",
    "zhuyin": "ㄊㄢˊ",
    "clue": "對牛（　）琴",
    "searchWord": "對牛彈琴"
  },
  {
    "char": "吹",
    "zhuyin": "ㄔㄨㄟ",
    "clue": "風（　）草動",
    "searchWord": "風吹草動"
  },
  {
    "char": "言",
    "zhuyin": "ㄧㄢˊ",
    "clue": "花（　）巧語",
    "searchWord": "花言巧語"
  },
  {
    "char": "充",
    "zhuyin": "ㄔㄨㄥ",
    "clue": "畫餅（　）飢",
    "searchWord": "畫餅充飢"
  },
  {
    "char": "犬",
    "zhuyin": "ㄑㄩㄢˇ",
    "clue": "雞（　）不寧",
    "searchWord": "雞犬不寧"
  },
  {
    "char": "是",
    "zhuyin": "ㄕˋ",
    "clue": "口（　）心非",
    "searchWord": "口是心非"
  },
  {
    "char": "下",
    "zhuyin": "ㄒㄧㄚˋ",
    "clue": "落井（　）石",
    "searchWord": "落井下石"
  },
  {
    "char": "苗",
    "zhuyin": "ㄇㄧㄠˊ",
    "clue": "揠（　）助長",
    "searchWord": "揠苗助長"
  },
  {
    "char": "魚",
    "zhuyin": "ㄩˊ",
    "clue": "如（　）得水",
    "searchWord": "如魚得水"
  },
  {
    "char": "落",
    "zhuyin": "ㄌㄨㄛˋ",
    "clue": "水（　）石出",
    "searchWord": "水落石出"
  },
  {
    "char": "共",
    "zhuyin": "ㄍㄨㄥˋ",
    "clue": "同甘（　）苦",
    "searchWord": "同甘共苦"
  },
  {
    "char": "歸",
    "zhuyin": "ㄍㄨㄟ",
    "clue": "完璧（　）趙",
    "searchWord": "完璧歸趙"
  },
  {
    "char": "送",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "雪中（　）炭",
    "searchWord": "雪中送炭"
  },
  {
    "char": "鹿",
    "zhuyin": "ㄌㄨˋ",
    "clue": "指（　）為馬",
    "searchWord": "指鹿為馬"
  },
  {
    "char": "上",
    "zhuyin": "ㄕㄤˋ",
    "clue": "紙（　）談兵",
    "searchWord": "紙上談兵"
  },
  {
    "char": "三",
    "zhuyin": "ㄙㄢ",
    "clue": "朝（　）暮四",
    "searchWord": "朝三暮四"
  },
  {
    "char": "暴",
    "zhuyin": "ㄅㄠˋ",
    "clue": "自（　）自棄",
    "searchWord": "自暴自棄"
  },
  {
    "char": "錘",
    "zhuyin": "ㄔㄨㄟˊ",
    "clue": "千（　）百煉",
    "searchWord": "千錘百煉"
  },
  {
    "char": "木",
    "zhuyin": "ㄇㄨˋ",
    "clue": "入（　）三分",
    "searchWord": "入木三分"
  },
  {
    "char": "裡",
    "zhuyin": "ㄌㄧˇ",
    "clue": "百（　）挑一",
    "searchWord": "百裡挑一"
  },
  {
    "char": "有",
    "zhuyin": "ㄧㄡˇ",
    "clue": "胸（　）成竹",
    "searchWord": "胸有成竹"
  },
  {
    "char": "客",
    "zhuyin": "ㄎㄜˋ",
    "clue": "不速之（　）",
    "searchWord": "不速之客"
  },
  {
    "char": "應",
    "zhuyin": "ㄧㄥˋ",
    "clue": "供不（　）求",
    "searchWord": "供不應求"
  },
  {
    "char": "義",
    "zhuyin": "ㄧˋ",
    "clue": "忘恩負（　）",
    "searchWord": "忘恩負義"
  },
  {
    "char": "會",
    "zhuyin": "ㄏㄨㄟˋ",
    "clue": "聚精（　）神",
    "searchWord": "聚精會神"
  },
  {
    "char": "見",
    "zhuyin": "ㄐㄧㄢˋ",
    "clue": "重（　）天日",
    "searchWord": "重見天日"
  },
  {
    "char": "篇",
    "zhuyin": "ㄆㄧㄢ",
    "clue": "千（　）一律",
    "searchWord": "千篇一律"
  },
  {
    "char": "其",
    "zhuyin": "ㄑㄧˊ",
    "clue": "莫名（　）妙",
    "searchWord": "莫名其妙"
  },
  {
    "char": "袖",
    "zhuyin": "ㄒㄧㄡˋ",
    "clue": "兩（　）清風",
    "searchWord": "兩袖清風"
  },
  {
    "char": "再",
    "zhuyin": "ㄗㄞˋ",
    "clue": "東山（　）起",
    "searchWord": "東山再起"
  },
  {
    "char": "沉",
    "zhuyin": "ㄔㄣˊ",
    "clue": "石（　）大海",
    "searchWord": "石沉大海"
  },
  {
    "char": "為",
    "zhuyin": "ㄨㄟˊ",
    "clue": "助人（　）樂",
    "searchWord": "助人為樂"
  },
  {
    "char": "尤",
    "zhuyin": "ㄧㄡˊ",
    "clue": "怨天（　）人",
    "searchWord": "怨天尤人"
  },
  {
    "char": "立",
    "zhuyin": "ㄌㄧˋ",
    "clue": "頂天（　）地",
    "searchWord": "頂天立地"
  },
  {
    "char": "無",
    "zhuyin": "ㄨˊ",
    "clue": "啞口（　）言",
    "searchWord": "啞口無言"
  },
  {
    "char": "心",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "三（　）二意",
    "searchWord": "三心二意"
  },
  {
    "char": "大",
    "zhuyin": "ㄉㄚˋ",
    "clue": "粗心（　）意",
    "searchWord": "粗心大意"
  },
  {
    "char": "新",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "日（　）月異",
    "searchWord": "日新月異"
  },
  {
    "char": "貫",
    "zhuyin": "ㄍㄨㄢˋ",
    "clue": "如雷（　）耳",
    "searchWord": "如雷貫耳"
  },
  {
    "char": "喧",
    "zhuyin": "ㄒㄩㄢ",
    "clue": "請勿大聲（　）嘩。",
    "searchWord": "喧嘩"
  },
  {
    "char": "寒",
    "zhuyin": "ㄏㄢˊ",
    "clue": "見面（　）暄幾句。",
    "searchWord": "寒暄"
  },
  {
    "char": "暄",
    "zhuyin": "ㄒㄩㄢ",
    "clue": "見面寒（　）幾句。",
    "searchWord": "寒暄"
  },
  {
    "char": "券",
    "zhuyin": "ㄑㄩㄢˋ",
    "clue": "入場（　）已售完。",
    "searchWord": "入場券"
  },
  {
    "char": "卷",
    "zhuyin": "ㄐㄩㄢˋ",
    "clue": "手不釋（　）讀好書。",
    "searchWord": "手不釋卷"
  },
  {
    "char": "卷",
    "zhuyin": "ㄐㄩㄢˋ",
    "clue": "這張試（　）非常簡單。",
    "searchWord": "試卷"
  },
  {
    "char": "券",
    "zhuyin": "ㄑㄩㄢˋ",
    "clue": "使用優待（　）可打折。",
    "searchWord": "優待券"
  },
  {
    "char": "馨",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "享受溫（　）家庭生活。",
    "searchWord": "溫馨"
  },
  {
    "char": "馨",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "花園裡（　）香四溢。",
    "searchWord": "馨香"
  },
  {
    "char": "轄",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "他的管（　）區域廣闊。",
    "searchWord": "管轄"
  },
  {
    "char": "艙",
    "zhuyin": "ㄘㄤ",
    "clue": "飛機客（　）很安靜。",
    "searchWord": "客艙"
  },
  {
    "char": "艙",
    "zhuyin": "ㄘㄤ",
    "clue": "把行李放進貨（　）。",
    "searchWord": "貨艙"
  },
  {
    "char": "僵",
    "zhuyin": "ㄐㄧㄤ",
    "clue": "談判（　）持不下。",
    "searchWord": "僵持"
  },
  {
    "char": "僵",
    "zhuyin": "ㄐㄧㄤ",
    "clue": "天冷肌肉容易（　）硬。",
    "searchWord": "僵硬"
  },
  {
    "char": "槳",
    "zhuyin": "ㄐㄧㄤˇ",
    "clue": "雙手划（　）前進。",
    "searchWord": "划槳"
  },
  {
    "char": "瞞",
    "zhuyin": "ㄇㄢˊ",
    "clue": "不能隱（　）事實真相。",
    "searchWord": "隱瞞"
  },
  {
    "char": "瞞",
    "zhuyin": "ㄇㄢˊ",
    "clue": "欺（　）是錯誤的行為。",
    "searchWord": "欺瞞"
  },
  {
    "char": "崇",
    "zhuyin": "ㄔㄨㄥˊ",
    "clue": "有著（　）高的理想。",
    "searchWord": "崇高"
  },
  {
    "char": "崇",
    "zhuyin": "ㄔㄨㄥˊ",
    "clue": "大家十分推（　）他。",
    "searchWord": "推崇"
  },
  {
    "char": "竣",
    "zhuyin": "ㄐㄩㄣˋ",
    "clue": "工程已完（　）驗收。",
    "searchWord": "完竣"
  },
  {
    "char": "毅",
    "zhuyin": "ㄧˋ",
    "clue": "做事要有恆心和（　）力。",
    "searchWord": "毅力"
  },
  {
    "char": "毅",
    "zhuyin": "ㄧˋ",
    "clue": "（　）然決然地做出決定。",
    "searchWord": "毅然決然"
  },
  {
    "char": "瞻",
    "zhuyin": "ㄓㄢ",
    "clue": "高（　）遠矚的眼光。",
    "searchWord": "高瞻遠矚"
  },
  {
    "char": "矚",
    "zhuyin": "ㄓㄨˇ",
    "clue": "高瞻遠（　）的眼光。",
    "searchWord": "高瞻遠矚"
  },
  {
    "char": "緻",
    "zhuyin": "ㄓˋ",
    "clue": "這件刺繡非常精（　）。",
    "searchWord": "精緻"
  },
  {
    "char": "製",
    "zhuyin": "ㄓˋ",
    "clue": "這款手機是台灣（　）造。",
    "searchWord": "台灣製造"
  },
  {
    "char": "質",
    "zhuyin": "ㄓˊ",
    "clue": "這家餐廳的服務品（　）很好。",
    "searchWord": "品質"
  },
  {
    "char": "執",
    "zhuyin": "ㄓˊ",
    "clue": "（　）迷不悟的態度。",
    "searchWord": "執迷不悟"
  },
  {
    "char": "執",
    "zhuyin": "ㄓˊ",
    "clue": "（　）子之手，與子偕老。",
    "searchWord": "執子之手"
  },
  {
    "char": "摯",
    "zhuyin": "ㄓˋ",
    "clue": "他是我的真（　）好友。",
    "searchWord": "真摯"
  },
  {
    "char": "置",
    "zhuyin": "ㄓˋ",
    "clue": "對這件事（　）之不理。",
    "searchWord": "置之不理"
  },
  {
    "char": "置",
    "zhuyin": "ㄓˋ",
    "clue": "（　）之死地而後生。",
    "searchWord": "置之死地"
  },
  {
    "char": "稚",
    "zhuyin": "ㄓˋ",
    "clue": "他的想法太過（　）嫩。",
    "searchWord": "稚嫩"
  },
  {
    "char": "致",
    "zhuyin": "ㄓˋ",
    "clue": "向大家（　）上最誠摯謝意。",
    "searchWord": "致謝"
  },
  {
    "char": "秩",
    "zhuyin": "ㄓˋ",
    "clue": "維護會場（　）序。",
    "searchWord": "秩序"
  },
  {
    "char": "志",
    "zhuyin": "ㄓˋ",
    "clue": "人各有（　）不能強求。",
    "searchWord": "人各有志"
  },
  {
    "char": "滯",
    "zhuyin": "ㄓˋ",
    "clue": "商品（　）銷庫存嚴重。",
    "searchWord": "滯銷"
  },
  {
    "char": "智",
    "zhuyin": "ㄓˋ",
    "clue": "這是一個（　）慧的選擇。",
    "searchWord": "智慧"
  },
  {
    "char": "幟",
    "zhuyin": "ㄓˋ",
    "clue": "獨樹一（　）的風格。",
    "searchWord": "獨樹一幟"
  },
  {
    "char": "治",
    "zhuyin": "ㄓˋ",
    "clue": "生病要及時醫（　）。",
    "searchWord": "醫治"
  },
  {
    "char": "帙",
    "zhuyin": "ㄓˋ",
    "clue": "這部巨著共分十（　）。",
    "searchWord": "帙"
  },
  {
    "char": "櫛",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "整天（　）風沐雨很辛苦。",
    "searchWord": "櫛風沐雨"
  },
  {
    "char": "疾",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）惡如仇的性格。",
    "searchWord": "疾惡如仇"
  },
  {
    "char": "忌",
    "zhuyin": "ㄐㄧˋ",
    "clue": "肆無（　）憚的行為。",
    "searchWord": "肆無忌憚"
  },
  {
    "char": "憚",
    "zhuyin": "ㄉㄢˋ",
    "clue": "肆無忌（　）的行為。",
    "searchWord": "肆無忌憚"
  },
  {
    "char": "棘",
    "zhuyin": "ㄐㄧˊ",
    "clue": "披荊斬（　）開闢道路。",
    "searchWord": "披荊斬棘"
  },
  {
    "char": "即",
    "zhuyin": "ㄐㄧˊ",
    "clue": "若（　）若離的關係。",
    "searchWord": "若即若離"
  },
  {
    "char": "及",
    "zhuyin": "ㄐㄧˊ",
    "clue": "後悔莫（　）的決定。",
    "searchWord": "後悔莫及"
  },
  {
    "char": "急",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）功近利的作風。",
    "searchWord": "急功近利"
  },
  {
    "char": "吉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "趨（　）避凶的本能。",
    "searchWord": "趨吉避凶"
  },
  {
    "char": "脊",
    "zhuyin": "ㄐㄧˇ",
    "clue": "凍得（　）背發涼。",
    "searchWord": "脊背"
  },
  {
    "char": "嫉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）賢妒能的心態。",
    "searchWord": "嫉賢妒能"
  },
  {
    "char": "集",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）思廣益以求良策。",
    "searchWord": "集思廣益"
  },
  {
    "char": "寂",
    "zhuyin": "ㄐㄧˋ",
    "clue": "耐得住（　）寞才能成功。",
    "searchWord": "寂寞"
  },
  {
    "char": "計",
    "zhuyin": "ㄐㄧˋ",
    "clue": "百年大（　）教育為本。",
    "searchWord": "百年大計"
  },
  {
    "char": "季",
    "zhuyin": "ㄐㄧˋ",
    "clue": "一年四（　）的變化。",
    "searchWord": "四季"
  },
  {
    "char": "冀",
    "zhuyin": "ㄐㄧˋ",
    "clue": "希（　）能獲得好成績。",
    "searchWord": "希冀"
  },
  {
    "char": "既",
    "zhuyin": "ㄐㄧˋ",
    "clue": "（　）得利益者的阻礙。",
    "searchWord": "既得利益"
  },
  {
    "char": "祭",
    "zhuyin": "ㄐㄧˋ",
    "clue": "村民舉行（　）祀典禮。",
    "searchWord": "祭祀"
  },
  {
    "char": "技",
    "zhuyin": "ㄐㄧˋ",
    "clue": "黔驢（　）窮的尷尬局面。",
    "searchWord": "黔驢技窮"
  },
  {
    "char": "繼",
    "zhuyin": "ㄐㄧˋ",
    "clue": "前仆後（　）地奮鬥。",
    "searchWord": "前仆後繼"
  },
  {
    "char": "績",
    "zhuyin": "ㄐㄧ",
    "clue": "創下輝煌的戰（　）。",
    "searchWord": "戰績"
  },
  {
    "char": "寄",
    "zhuyin": "ㄐㄧˋ",
    "clue": "將信（　）給遠方的朋友。",
    "searchWord": "寄信"
  },
  {
    "char": "跡",
    "zhuyin": "ㄐㄧ",
    "clue": "銷聲匿（　）的隱士。",
    "searchWord": "銷聲匿跡"
  },
  {
    "char": "藉",
    "zhuyin": "ㄐㄧㄝˋ",
    "clue": "（　）題發揮的行為。",
    "searchWord": "藉題發揮"
  },
  {
    "char": "籍",
    "zhuyin": "ㄐㄧˊ",
    "clue": "保留原來的國（　）。",
    "searchWord": "國籍"
  },
  {
    "char": "羈",
    "zhuyin": "ㄐㄧ",
    "clue": "不受任何（　）絆的自由。",
    "searchWord": "羈絆"
  },
  {
    "char": "基",
    "zhuyin": "ㄐㄧ",
    "clue": "奠定良好的（　）礎。",
    "searchWord": "基礎"
  },
  {
    "char": "機",
    "zhuyin": "ㄐㄧ",
    "clue": "把握難得的時（　）。",
    "searchWord": "時機"
  },
  {
    "char": "積",
    "zhuyin": "ㄐㄧ",
    "clue": "日（　）月累的成果。",
    "searchWord": "日積月累"
  },
  {
    "char": "極",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）樂世界的傳說。",
    "searchWord": "極樂世界"
  },
  {
    "char": "吉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）人天相的祝福。",
    "searchWord": "吉人天相"
  },
  {
    "char": "及",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這場（　）時雨下得真好。",
    "searchWord": "及時雨"
  },
  {
    "char": "幾",
    "zhuyin": "ㄐㄧˇ",
    "clue": "（　）乎快完成了。",
    "searchWord": "幾乎"
  },
  {
    "char": "記",
    "zhuyin": "ㄐㄧˋ",
    "clue": "好好（　）住這堂課。",
    "searchWord": "記住"
  },
  {
    "char": "忌",
    "zhuyin": "ㄐㄧˋ",
    "clue": "切（　）急躁行事。",
    "searchWord": "切忌"
  },
  {
    "char": "牛",
    "zhuyin": "ㄋㄧㄡˊ",
    "clue": "對（　）彈琴是白費力氣。",
    "searchWord": "對牛彈琴"
  },
  {
    "char": "山",
    "zhuyin": "ㄕㄢ",
    "clue": "這座（　）林樹木茂密。",
    "searchWord": "山林"
  },
  {
    "char": "水",
    "zhuyin": "ㄕㄨㄟˇ",
    "clue": "這杯（　）非常純淨。",
    "searchWord": "純淨水"
  },
  {
    "char": "天",
    "zhuyin": "ㄊㄧㄢ",
    "clue": "外面的（　）氣真好。",
    "searchWord": "天氣"
  },
  {
    "char": "地",
    "zhuyin": "ㄉㄧˋ",
    "clue": "這片（　）板很乾淨。",
    "searchWord": "地板"
  },
  {
    "char": "人",
    "zhuyin": "ㄖㄣˊ",
    "clue": "他是個好（　）。",
    "searchWord": "好人"
  },
  {
    "char": "學",
    "zhuyin": "ㄒㄩㄝˊ",
    "clue": "他是個熱愛（　）習的人。",
    "searchWord": "學習"
  },
  {
    "char": "校",
    "zhuyin": "ㄒㄧㄠˋ",
    "clue": "這所學（　）非常美麗。",
    "searchWord": "學校"
  },
  {
    "char": "師",
    "zhuyin": "ㄕ",
    "clue": "他是一位優秀的老（　）。",
    "searchWord": "老師"
  },
  {
    "char": "友",
    "zhuyin": "ㄧㄡˇ",
    "clue": "他是值得信賴的朋（　）。",
    "searchWord": "朋友"
  },
  {
    "char": "愛",
    "zhuyin": "ㄞˋ",
    "clue": "媽媽很（　）我。",
    "searchWord": "愛護"
  },
  {
    "char": "家",
    "zhuyin": "ㄐㄧㄚ",
    "clue": "這是我溫暖的（　）。",
    "searchWord": "家庭"
  },
  {
    "char": "鄉",
    "zhuyin": "ㄒㄧㄤ",
    "clue": "美麗的故（　）在南方。",
    "searchWord": "故鄉"
  },
  {
    "char": "路",
    "zhuyin": "ㄌㄨˋ",
    "clue": "這條（　）非常平坦。",
    "searchWord": "道路"
  },
  {
    "char": "車",
    "zhuyin": "ㄔㄜ",
    "clue": "路上的（　）輛很多。",
    "searchWord": "車輛"
  },
  {
    "char": "書",
    "zhuyin": "ㄕㄨ",
    "clue": "這本（　）內容很精彩。",
    "searchWord": "書籍"
  },
  {
    "char": "筆",
    "zhuyin": "ㄅㄧˇ",
    "clue": "這支（　）寫字很順暢。",
    "searchWord": "鉛筆"
  },
  {
    "char": "紙",
    "zhuyin": "ㄓˇ",
    "clue": "請在一張（　）上寫字。",
    "searchWord": "白紙"
  },
  {
    "char": "字",
    "zhuyin": "ㄗˋ",
    "clue": "他的（　）體很端正。",
    "searchWord": "字體"
  },
  {
    "char": "話",
    "zhuyin": "ㄏㄨㄚˋ",
    "clue": "他說的（　）非常有道理。",
    "searchWord": "說話"
  },
  {
    "char": "歌",
    "zhuyin": "ㄍㄜ",
    "clue": "這首（　）曲非常動聽。",
    "searchWord": "歌曲"
  },
  {
    "char": "圖",
    "zhuyin": "ㄊㄨˊ",
    "clue": "這幅（　）畫色彩鮮艷。",
    "searchWord": "圖畫"
  },
  {
    "char": "影",
    "zhuyin": "ㄧㄥˇ",
    "clue": "這部電（　）非常感人。",
    "searchWord": "電影"
  },
  {
    "char": "音",
    "zhuyin": "ㄧㄣ",
    "clue": "這首樂曲的（　）色優美。",
    "searchWord": "音樂"
  },
  {
    "char": "色",
    "zhuyin": "ㄙㄜˋ",
    "clue": "這件衣服的顏（　）很鮮艷。",
    "searchWord": "顏色"
  },
  {
    "char": "花",
    "zhuyin": "ㄏㄨㄚ",
    "clue": "公園裡的（　）朵盛開。",
    "searchWord": "花朵"
  },
  {
    "char": "草",
    "zhuyin": "ㄘㄠˇ",
    "clue": "綠油油的（　）地。",
    "searchWord": "草地"
  },
  {
    "char": "木",
    "zhuyin": "ㄇㄨˋ",
    "clue": "森林裡的樹（　）很高大。",
    "searchWord": "樹木"
  },
  {
    "char": "山",
    "zhuyin": "ㄕㄢ",
    "clue": "這座高（　）雄偉壯麗。",
    "searchWord": "高山"
  },
  {
    "char": "河",
    "zhuyin": "ㄏㄜˊ",
    "clue": "這條（　）流非常清澈。",
    "searchWord": "河流"
  },
  {
    "char": "海",
    "zhuyin": "ㄏㄞˇ",
    "clue": "遼闊的大（　）無邊無際。",
    "searchWord": "大海"
  }
];

const CHARACTER_CROSSWORD_POOL = [
  {
    "char": "海",
    "zhuyin": "ㄏㄞˇ",
    "searchWord": "海馬",
    "surrounding": [
      {
        "char": "腦",
        "pos": "before"
      },
      {
        "char": "外",
        "pos": "before"
      },
      {
        "char": "馬",
        "pos": "after"
      },
      {
        "char": "女",
        "pos": "after"
      }
    ]
  },
  {
    "char": "機",
    "zhuyin": "ㄐㄧ",
    "searchWord": "機會",
    "surrounding": [
      {
        "char": "手",
        "pos": "before"
      },
      {
        "char": "飛",
        "pos": "before"
      },
      {
        "char": "車",
        "pos": "after"
      },
      {
        "char": "會",
        "pos": "after"
      }
    ]
  },
  {
    "char": "天",
    "zhuyin": "ㄊㄧㄢ",
    "searchWord": "天空",
    "surrounding": [
      {
        "char": "今",
        "pos": "before"
      },
      {
        "char": "明",
        "pos": "before"
      },
      {
        "char": "氣",
        "pos": "after"
      },
      {
        "char": "空",
        "pos": "after"
      }
    ]
  },
  {
    "char": "風",
    "zhuyin": "ㄈㄥ",
    "searchWord": "風景",
    "surrounding": [
      {
        "char": "颱",
        "pos": "before"
      },
      {
        "char": "微",
        "pos": "before"
      },
      {
        "char": "雨",
        "pos": "after"
      },
      {
        "char": "景",
        "pos": "after"
      }
    ]
  },
  {
    "char": "心",
    "zhuyin": "ㄒㄧㄣ",
    "searchWord": "心理",
    "surrounding": [
      {
        "char": "開",
        "pos": "before"
      },
      {
        "char": "粗",
        "pos": "before"
      },
      {
        "char": "臟",
        "pos": "after"
      },
      {
        "char": "理",
        "pos": "after"
      }
    ]
  },
  {
    "char": "花",
    "zhuyin": "ㄏㄨㄚ",
    "searchWord": "花園",
    "surrounding": [
      {
        "char": "開",
        "pos": "before"
      },
      {
        "char": "鮮",
        "pos": "before"
      },
      {
        "char": "園",
        "pos": "after"
      },
      {
        "char": "朵",
        "pos": "after"
      }
    ]
  },
  {
    "char": "水",
    "zhuyin": "ㄕㄨㄟˇ",
    "searchWord": "水果",
    "surrounding": [
      {
        "char": "汽",
        "pos": "before"
      },
      {
        "char": "雨",
        "pos": "before"
      },
      {
        "char": "果",
        "pos": "after"
      },
      {
        "char": "庫",
        "pos": "after"
      }
    ]
  },
  {
    "char": "車",
    "zhuyin": "ㄔㄜ",
    "searchWord": "車站",
    "surrounding": [
      {
        "char": "汽",
        "pos": "before"
      },
      {
        "char": "火",
        "pos": "before"
      },
      {
        "char": "站",
        "pos": "after"
      },
      {
        "char": "禍",
        "pos": "after"
      }
    ]
  },
  {
    "char": "人",
    "zhuyin": "ㄖㄣˊ",
    "searchWord": "人口",
    "surrounding": [
      {
        "char": "男",
        "pos": "before"
      },
      {
        "char": "女",
        "pos": "before"
      },
      {
        "char": "群",
        "pos": "after"
      },
      {
        "char": "口",
        "pos": "after"
      }
    ]
  },
  {
    "char": "山",
    "zhuyin": "ㄕㄢ",
    "searchWord": "山路",
    "surrounding": [
      {
        "char": "高",
        "pos": "before"
      },
      {
        "char": "爬",
        "pos": "before"
      },
      {
        "char": "谷",
        "pos": "after"
      },
      {
        "char": "路",
        "pos": "after"
      }
    ]
  },
  {
    "char": "生",
    "zhuyin": "ㄕㄥ",
    "searchWord": "生日",
    "surrounding": [
      {
        "char": "學",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "before"
      },
      {
        "char": "活",
        "pos": "after"
      },
      {
        "char": "日",
        "pos": "after"
      }
    ]
  },
  {
    "char": "氣",
    "zhuyin": "ㄑㄧˋ",
    "searchWord": "氣球",
    "surrounding": [
      {
        "char": "空",
        "pos": "before"
      },
      {
        "char": "天",
        "pos": "before"
      },
      {
        "char": "溫",
        "pos": "after"
      },
      {
        "char": "球",
        "pos": "after"
      }
    ]
  },
  {
    "char": "力",
    "zhuyin": "ㄌㄧˋ",
    "searchWord": "力氣",
    "surrounding": [
      {
        "char": "用",
        "pos": "before"
      },
      {
        "char": "動",
        "pos": "before"
      },
      {
        "char": "量",
        "pos": "after"
      },
      {
        "char": "氣",
        "pos": "after"
      }
    ]
  },
  {
    "char": "工",
    "zhuyin": "ㄍㄨㄥ",
    "searchWord": "工作",
    "surrounding": [
      {
        "char": "員",
        "pos": "before"
      },
      {
        "char": "手",
        "pos": "before"
      },
      {
        "char": "作",
        "pos": "after"
      },
      {
        "char": "廠",
        "pos": "after"
      }
    ]
  },
  {
    "char": "作",
    "zhuyin": "ㄗㄨㄛˋ",
    "searchWord": "作品",
    "surrounding": [
      {
        "char": "工",
        "pos": "before"
      },
      {
        "char": "寫",
        "pos": "before"
      },
      {
        "char": "品",
        "pos": "after"
      },
      {
        "char": "業",
        "pos": "after"
      }
    ]
  },
  {
    "char": "用",
    "zhuyin": "ㄩㄥˋ",
    "searchWord": "用途",
    "surrounding": [
      {
        "char": "使",
        "pos": "before"
      },
      {
        "char": "利",
        "pos": "before"
      },
      {
        "char": "功",
        "pos": "after"
      },
      {
        "char": "途",
        "pos": "after"
      }
    ]
  },
  {
    "char": "動",
    "zhuyin": "ㄉㄨㄥˋ",
    "searchWord": "動物",
    "surrounding": [
      {
        "char": "運",
        "pos": "before"
      },
      {
        "char": "活",
        "pos": "before"
      },
      {
        "char": "作",
        "pos": "after"
      },
      {
        "char": "物",
        "pos": "after"
      }
    ]
  },
  {
    "char": "物",
    "zhuyin": "ㄨˋ",
    "searchWord": "物價",
    "surrounding": [
      {
        "char": "動",
        "pos": "before"
      },
      {
        "char": "植",
        "pos": "before"
      },
      {
        "char": "品",
        "pos": "after"
      },
      {
        "char": "價",
        "pos": "after"
      }
    ]
  },
  {
    "char": "品",
    "zhuyin": "ㄆㄧㄣˇ",
    "searchWord": "品牌",
    "surrounding": [
      {
        "char": "商",
        "pos": "before"
      },
      {
        "char": "產",
        "pos": "before"
      },
      {
        "char": "質",
        "pos": "after"
      },
      {
        "char": "牌",
        "pos": "after"
      }
    ]
  },
  {
    "char": "家",
    "zhuyin": "ㄐㄧㄚ",
    "searchWord": "家庭",
    "surrounding": [
      {
        "char": "回",
        "pos": "before"
      },
      {
        "char": "國",
        "pos": "before"
      },
      {
        "char": "庭",
        "pos": "after"
      },
      {
        "char": "長",
        "pos": "after"
      }
    ]
  },
  {
    "char": "國",
    "zhuyin": "ㄍㄨㄛˊ",
    "searchWord": "國旗",
    "surrounding": [
      {
        "char": "英",
        "pos": "before"
      },
      {
        "char": "美",
        "pos": "before"
      },
      {
        "char": "家",
        "pos": "after"
      },
      {
        "char": "旗",
        "pos": "after"
      }
    ]
  },
  {
    "char": "民",
    "zhuyin": "ㄇㄧㄣˊ",
    "searchWord": "民意",
    "surrounding": [
      {
        "char": "居",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "before"
      },
      {
        "char": "族",
        "pos": "after"
      },
      {
        "char": "意",
        "pos": "after"
      }
    ]
  },
  {
    "char": "意",
    "zhuyin": "ㄧˋ",
    "searchWord": "意義",
    "surrounding": [
      {
        "char": "注",
        "pos": "before"
      },
      {
        "char": "同",
        "pos": "before"
      },
      {
        "char": "見",
        "pos": "after"
      },
      {
        "char": "義",
        "pos": "after"
      }
    ]
  },
  {
    "char": "理",
    "zhuyin": "ㄌㄧˇ",
    "searchWord": "理解",
    "surrounding": [
      {
        "char": "合",
        "pos": "before"
      },
      {
        "char": "心",
        "pos": "before"
      },
      {
        "char": "由",
        "pos": "after"
      },
      {
        "char": "解",
        "pos": "after"
      }
    ]
  },
  {
    "char": "學",
    "zhuyin": "ㄒㄩㄝˊ",
    "searchWord": "學校",
    "surrounding": [
      {
        "char": "大",
        "pos": "before"
      },
      {
        "char": "小",
        "pos": "before"
      },
      {
        "char": "生",
        "pos": "after"
      },
      {
        "char": "校",
        "pos": "after"
      }
    ]
  },
  {
    "char": "校",
    "zhuyin": "ㄒㄧㄠˋ",
    "searchWord": "校車",
    "surrounding": [
      {
        "char": "學",
        "pos": "before"
      },
      {
        "char": "母",
        "pos": "before"
      },
      {
        "char": "長",
        "pos": "after"
      },
      {
        "char": "車",
        "pos": "after"
      }
    ]
  },
  {
    "char": "書",
    "zhuyin": "ㄕㄨ",
    "searchWord": "書包",
    "surrounding": [
      {
        "char": "讀",
        "pos": "before"
      },
      {
        "char": "看",
        "pos": "before"
      },
      {
        "char": "籍",
        "pos": "after"
      },
      {
        "char": "包",
        "pos": "after"
      }
    ]
  },
  {
    "char": "包",
    "zhuyin": "ㄅㄠ",
    "searchWord": "包裝",
    "surrounding": [
      {
        "char": "書",
        "pos": "before"
      },
      {
        "char": "皮",
        "pos": "before"
      },
      {
        "char": "子",
        "pos": "after"
      },
      {
        "char": "裝",
        "pos": "after"
      }
    ]
  },
  {
    "char": "子",
    "zhuyin": "ㄗˇ",
    "searchWord": "子女",
    "surrounding": [
      {
        "char": "桌",
        "pos": "before"
      },
      {
        "char": "椅",
        "pos": "before"
      },
      {
        "char": "彈",
        "pos": "after"
      },
      {
        "char": "女",
        "pos": "after"
      }
    ]
  },
  {
    "char": "女",
    "zhuyin": "ㄋㄩˇ",
    "searchWord": "女神",
    "surrounding": [
      {
        "char": "男",
        "pos": "before"
      },
      {
        "char": "婦",
        "pos": "before"
      },
      {
        "char": "兒",
        "pos": "after"
      },
      {
        "char": "神",
        "pos": "after"
      }
    ]
  },
  {
    "char": "兒",
    "zhuyin": "ㄦˊ",
    "searchWord": "兒歌",
    "surrounding": [
      {
        "char": "女",
        "pos": "before"
      },
      {
        "char": "幼",
        "pos": "before"
      },
      {
        "char": "童",
        "pos": "after"
      },
      {
        "char": "歌",
        "pos": "after"
      }
    ]
  },
  {
    "char": "童",
    "zhuyin": "ㄊㄨㄥˊ",
    "searchWord": "童年",
    "surrounding": [
      {
        "char": "兒",
        "pos": "before"
      },
      {
        "char": "神",
        "pos": "before"
      },
      {
        "char": "話",
        "pos": "after"
      },
      {
        "char": "年",
        "pos": "after"
      }
    ]
  },
  {
    "char": "年",
    "zhuyin": "ㄋㄧㄢˊ",
    "searchWord": "年輕",
    "surrounding": [
      {
        "char": "今",
        "pos": "before"
      },
      {
        "char": "明",
        "pos": "before"
      },
      {
        "char": "齡",
        "pos": "after"
      },
      {
        "char": "輕",
        "pos": "after"
      }
    ]
  },
  {
    "char": "輕",
    "zhuyin": "ㄑㄧㄥ",
    "searchWord": "輕易",
    "surrounding": [
      {
        "char": "年",
        "pos": "before"
      },
      {
        "char": "減",
        "pos": "before"
      },
      {
        "char": "快",
        "pos": "after"
      },
      {
        "char": "易",
        "pos": "after"
      }
    ]
  },
  {
    "char": "微",
    "zhuyin": "ㄨㄟˊ",
    "searchWord": "微風",
    "surrounding": [
      {
        "char": "輕",
        "pos": "before"
      },
      {
        "char": "細",
        "pos": "before"
      },
      {
        "char": "笑",
        "pos": "after"
      },
      {
        "char": "風",
        "pos": "after"
      }
    ]
  },
  {
    "char": "笑",
    "zhuyin": "ㄒㄧㄠˋ",
    "searchWord": "笑臉",
    "surrounding": [
      {
        "char": "微",
        "pos": "before"
      },
      {
        "char": "玩",
        "pos": "before"
      },
      {
        "char": "話",
        "pos": "after"
      },
      {
        "char": "臉",
        "pos": "after"
      }
    ]
  },
  {
    "char": "話",
    "zhuyin": "ㄏㄨㄚˋ",
    "searchWord": "話劇",
    "surrounding": [
      {
        "char": "說",
        "pos": "before"
      },
      {
        "char": "笑",
        "pos": "before"
      },
      {
        "char": "題",
        "pos": "after"
      },
      {
        "char": "劇",
        "pos": "after"
      }
    ]
  },
  {
    "char": "題",
    "zhuyin": "ㄊㄧˊ",
    "searchWord": "題庫",
    "surrounding": [
      {
        "char": "問",
        "pos": "before"
      },
      {
        "char": "標",
        "pos": "before"
      },
      {
        "char": "目",
        "pos": "after"
      },
      {
        "char": "庫",
        "pos": "after"
      }
    ]
  },
  {
    "char": "問",
    "zhuyin": "ㄨㄣˋ",
    "searchWord": "問候",
    "surrounding": [
      {
        "char": "提",
        "pos": "before"
      },
      {
        "char": "詢",
        "pos": "before"
      },
      {
        "char": "題",
        "pos": "after"
      },
      {
        "char": "候",
        "pos": "after"
      }
    ]
  },
  {
    "char": "候",
    "zhuyin": "ㄏㄡˋ",
    "searchWord": "候選",
    "surrounding": [
      {
        "char": "時",
        "pos": "before"
      },
      {
        "char": "氣",
        "pos": "before"
      },
      {
        "char": "車",
        "pos": "after"
      },
      {
        "char": "選",
        "pos": "after"
      }
    ]
  },
  {
    "char": "選",
    "zhuyin": "ㄒㄩㄢˇ",
    "searchWord": "選舉",
    "surrounding": [
      {
        "char": "挑",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "before"
      },
      {
        "char": "擇",
        "pos": "after"
      },
      {
        "char": "舉",
        "pos": "after"
      }
    ]
  },
  {
    "char": "擇",
    "zhuyin": "ㄗㄜˊ",
    "searchWord": "擇期",
    "surrounding": [
      {
        "char": "選",
        "pos": "before"
      },
      {
        "char": "抉",
        "pos": "before"
      },
      {
        "char": "優",
        "pos": "after"
      },
      {
        "char": "期",
        "pos": "after"
      }
    ]
  },
  {
    "char": "期",
    "zhuyin": "ㄑㄧˊ",
    "searchWord": "期待",
    "surrounding": [
      {
        "char": "學",
        "pos": "before"
      },
      {
        "char": "過",
        "pos": "before"
      },
      {
        "char": "限",
        "pos": "after"
      },
      {
        "char": "待",
        "pos": "after"
      }
    ]
  },
  {
    "char": "待",
    "zhuyin": "ㄉㄞˋ",
    "searchWord": "待客",
    "surrounding": [
      {
        "char": "期",
        "pos": "before"
      },
      {
        "char": "對",
        "pos": "before"
      },
      {
        "char": "遇",
        "pos": "after"
      },
      {
        "char": "客",
        "pos": "after"
      }
    ]
  },
  {
    "char": "客",
    "zhuyin": "ㄎㄜˋ",
    "searchWord": "客廳",
    "surrounding": [
      {
        "char": "顧",
        "pos": "before"
      },
      {
        "char": "遊",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "after"
      },
      {
        "char": "廳",
        "pos": "after"
      }
    ]
  },
  {
    "char": "廳",
    "zhuyin": "ㄊㄧㄥ",
    "searchWord": "廳舍",
    "surrounding": [
      {
        "char": "客",
        "pos": "before"
      },
      {
        "char": "大",
        "pos": "before"
      },
      {
        "char": "長",
        "pos": "after"
      },
      {
        "char": "舍",
        "pos": "after"
      }
    ]
  },
  {
    "char": "長",
    "zhuyin": "ㄓㄤˇ",
    "searchWord": "長輩",
    "surrounding": [
      {
        "char": "家",
        "pos": "before"
      },
      {
        "char": "校",
        "pos": "before"
      },
      {
        "char": "度",
        "pos": "after"
      },
      {
        "char": "輩",
        "pos": "after"
      }
    ]
  },
  {
    "char": "輩",
    "zhuyin": "ㄅㄟˋ",
    "searchWord": "輩出",
    "surrounding": [
      {
        "char": "長",
        "pos": "before"
      },
      {
        "char": "前",
        "pos": "before"
      },
      {
        "char": "分",
        "pos": "after"
      },
      {
        "char": "出",
        "pos": "after"
      }
    ]
  },
  {
    "char": "出",
    "zhuyin": "ㄔㄨ",
    "searchWord": "出口",
    "surrounding": [
      {
        "char": "進",
        "pos": "before"
      },
      {
        "char": "突",
        "pos": "before"
      },
      {
        "char": "發",
        "pos": "after"
      },
      {
        "char": "口",
        "pos": "after"
      }
    ]
  },
  {
    "char": "口",
    "zhuyin": "ㄎㄡˇ",
    "searchWord": "口哨",
    "surrounding": [
      {
        "char": "出",
        "pos": "before"
      },
      {
        "char": "進",
        "pos": "before"
      },
      {
        "char": "味",
        "pos": "after"
      },
      {
        "char": "哨",
        "pos": "after"
      }
    ]
  },
  {
    "char": "味",
    "zhuyin": "ㄨㄟˋ",
    "searchWord": "味精",
    "surrounding": [
      {
        "char": "口",
        "pos": "before"
      },
      {
        "char": "氣",
        "pos": "before"
      },
      {
        "char": "道",
        "pos": "after"
      },
      {
        "char": "精",
        "pos": "after"
      }
    ]
  },
  {
    "char": "道",
    "zhuyin": "ㄉㄠˋ",
    "searchWord": "道理",
    "surrounding": [
      {
        "char": "味",
        "pos": "before"
      },
      {
        "char": "知",
        "pos": "before"
      },
      {
        "char": "路",
        "pos": "after"
      },
      {
        "char": "理",
        "pos": "after"
      }
    ]
  },
  {
    "char": "神",
    "zhuyin": "ㄕㄣˊ",
    "searchWord": "神奇",
    "surrounding": [
      {
        "char": "留",
        "pos": "before"
      },
      {
        "char": "聚",
        "pos": "before"
      },
      {
        "char": "奇",
        "pos": "after"
      },
      {
        "char": "仙",
        "pos": "after"
      }
    ]
  },
  {
    "char": "髮",
    "zhuyin": "ㄈㄚˇ",
    "searchWord": "髮夾",
    "surrounding": [
      {
        "char": "理",
        "pos": "before"
      },
      {
        "char": "洗",
        "pos": "before"
      },
      {
        "char": "型",
        "pos": "after"
      },
      {
        "char": "夾",
        "pos": "after"
      }
    ]
  },
  {
    "char": "型",
    "zhuyin": "ㄒㄧㄥˊ",
    "searchWord": "型號",
    "surrounding": [
      {
        "char": "髮",
        "pos": "before"
      },
      {
        "char": "模",
        "pos": "before"
      },
      {
        "char": "態",
        "pos": "after"
      },
      {
        "char": "號",
        "pos": "after"
      }
    ]
  },
  {
    "char": "號",
    "zhuyin": "ㄏㄠˋ",
    "searchWord": "號召",
    "surrounding": [
      {
        "char": "型",
        "pos": "before"
      },
      {
        "char": "記",
        "pos": "before"
      },
      {
        "char": "碼",
        "pos": "after"
      },
      {
        "char": "召",
        "pos": "after"
      }
    ]
  },
  {
    "char": "碼",
    "zhuyin": "ㄇㄚˇ",
    "searchWord": "碼表",
    "surrounding": [
      {
        "char": "密",
        "pos": "before"
      },
      {
        "char": "號",
        "pos": "before"
      },
      {
        "char": "頭",
        "pos": "after"
      },
      {
        "char": "表",
        "pos": "after"
      }
    ]
  },
  {
    "char": "頭",
    "zhuyin": "ㄊㄡˊ",
    "searchWord": "頭髮",
    "surrounding": [
      {
        "char": "碼",
        "pos": "before"
      },
      {
        "char": "起",
        "pos": "before"
      },
      {
        "char": "痛",
        "pos": "after"
      },
      {
        "char": "髮",
        "pos": "after"
      }
    ]
  },
  {
    "char": "痛",
    "zhuyin": "ㄊㄨㄥˋ",
    "searchWord": "痛快",
    "surrounding": [
      {
        "char": "頭",
        "pos": "before"
      },
      {
        "char": "心",
        "pos": "before"
      },
      {
        "char": "苦",
        "pos": "after"
      },
      {
        "char": "快",
        "pos": "after"
      }
    ]
  },
  {
    "char": "快",
    "zhuyin": "ㄎㄨㄞˋ",
    "searchWord": "快速",
    "surrounding": [
      {
        "char": "痛",
        "pos": "before"
      },
      {
        "char": "輕",
        "pos": "before"
      },
      {
        "char": "樂",
        "pos": "after"
      },
      {
        "char": "速",
        "pos": "after"
      }
    ]
  },
  {
    "char": "樂",
    "zhuyin": "ㄌㄜˋ",
    "searchWord": "樂園",
    "surrounding": [
      {
        "char": "快",
        "pos": "before"
      },
      {
        "char": "音",
        "pos": "before"
      },
      {
        "char": "趣",
        "pos": "after"
      },
      {
        "char": "園",
        "pos": "after"
      }
    ]
  },
  {
    "char": "趣",
    "zhuyin": "ㄑㄩˋ",
    "searchWord": "趣事",
    "surrounding": [
      {
        "char": "樂",
        "pos": "before"
      },
      {
        "char": "興",
        "pos": "before"
      },
      {
        "char": "味",
        "pos": "after"
      },
      {
        "char": "事",
        "pos": "after"
      }
    ]
  },
  {
    "char": "事",
    "zhuyin": "ㄕˋ",
    "searchWord": "事務",
    "surrounding": [
      {
        "char": "趣",
        "pos": "before"
      },
      {
        "char": "故",
        "pos": "before"
      },
      {
        "char": "情",
        "pos": "after"
      },
      {
        "char": "務",
        "pos": "after"
      }
    ]
  },
  {
    "char": "故",
    "zhuyin": "ㄍㄨˋ",
    "searchWord": "故人",
    "surrounding": [
      {
        "char": "事",
        "pos": "before"
      },
      {
        "char": "變",
        "pos": "before"
      },
      {
        "char": "鄉",
        "pos": "after"
      },
      {
        "char": "人",
        "pos": "after"
      }
    ]
  },
  {
    "char": "鄉",
    "zhuyin": "ㄒㄧㄤ",
    "searchWord": "鄉親",
    "surrounding": [
      {
        "char": "故",
        "pos": "before"
      },
      {
        "char": "家",
        "pos": "before"
      },
      {
        "char": "村",
        "pos": "after"
      },
      {
        "char": "親",
        "pos": "after"
      }
    ]
  },
  {
    "char": "村",
    "zhuyin": "ㄘㄨㄣ",
    "searchWord": "村長",
    "surrounding": [
      {
        "char": "鄉",
        "pos": "before"
      },
      {
        "char": "農",
        "pos": "before"
      },
      {
        "char": "莊",
        "pos": "after"
      },
      {
        "char": "長",
        "pos": "after"
      }
    ]
  },
  {
    "char": "莊",
    "zhuyin": "ㄓㄨㄤ",
    "searchWord": "莊重",
    "surrounding": [
      {
        "char": "村",
        "pos": "before"
      },
      {
        "char": "山",
        "pos": "before"
      },
      {
        "char": "嚴",
        "pos": "after"
      },
      {
        "char": "重",
        "pos": "after"
      }
    ]
  },
  {
    "char": "嚴",
    "zhuyin": "ㄧㄢˊ",
    "searchWord": "嚴肅",
    "surrounding": [
      {
        "char": "莊",
        "pos": "before"
      },
      {
        "char": "尊",
        "pos": "before"
      },
      {
        "char": "格",
        "pos": "after"
      },
      {
        "char": "肅",
        "pos": "after"
      }
    ]
  },
  {
    "char": "肅",
    "zhuyin": "ㄙㄨˋ",
    "searchWord": "肅殺",
    "surrounding": [
      {
        "char": "整",
        "pos": "before"
      },
      {
        "char": "嚴",
        "pos": "before"
      },
      {
        "char": "靜",
        "pos": "after"
      },
      {
        "char": "立",
        "pos": "after"
      }
    ]
  },
  {
    "char": "立",
    "zhuyin": "ㄌㄧˋ",
    "searchWord": "立場",
    "surrounding": [
      {
        "char": "肅",
        "pos": "before"
      },
      {
        "char": "起",
        "pos": "before"
      },
      {
        "char": "刻",
        "pos": "after"
      },
      {
        "char": "場",
        "pos": "after"
      }
    ]
  },
  {
    "char": "刻",
    "zhuyin": "ㄎㄜˋ",
    "searchWord": "刻度",
    "surrounding": [
      {
        "char": "立",
        "pos": "before"
      },
      {
        "char": "片",
        "pos": "before"
      },
      {
        "char": "苦",
        "pos": "after"
      },
      {
        "char": "度",
        "pos": "after"
      }
    ]
  },
  {
    "char": "苦",
    "zhuyin": "ㄎㄨˇ",
    "searchWord": "苦笑",
    "surrounding": [
      {
        "char": "刻",
        "pos": "before"
      },
      {
        "char": "辛",
        "pos": "before"
      },
      {
        "char": "悶",
        "pos": "after"
      },
      {
        "char": "笑",
        "pos": "after"
      }
    ]
  },
  {
    "char": "夢",
    "zhuyin": "ㄇㄥˋ",
    "searchWord": "夢想",
    "surrounding": [
      {
        "char": "美",
        "pos": "before"
      },
      {
        "char": "做",
        "pos": "before"
      },
      {
        "char": "境",
        "pos": "after"
      },
      {
        "char": "話",
        "pos": "after"
      }
    ]
  },
  {
    "char": "料",
    "zhuyin": "ㄌㄧㄠˋ",
    "searchWord": "料想",
    "surrounding": [
      {
        "char": "笑",
        "pos": "before"
      },
      {
        "char": "材",
        "pos": "before"
      },
      {
        "char": "理",
        "pos": "after"
      },
      {
        "char": "想",
        "pos": "after"
      }
    ]
  },
  {
    "char": "材",
    "zhuyin": "ㄘㄞˊ",
    "searchWord": "材料",
    "surrounding": [
      {
        "char": "木",
        "pos": "before"
      },
      {
        "char": "題",
        "pos": "before"
      },
      {
        "char": "質",
        "pos": "after"
      },
      {
        "char": "料",
        "pos": "after"
      }
    ]
  },
  {
    "char": "質",
    "zhuyin": "ㄓˊ",
    "searchWord": "質問",
    "surrounding": [
      {
        "char": "材",
        "pos": "before"
      },
      {
        "char": "品",
        "pos": "before"
      },
      {
        "char": "量",
        "pos": "after"
      },
      {
        "char": "問",
        "pos": "after"
      }
    ]
  },
  {
    "char": "量",
    "zhuyin": "ㄌㄧㄤˋ",
    "searchWord": "量杯",
    "surrounding": [
      {
        "char": "質",
        "pos": "before"
      },
      {
        "char": "力",
        "pos": "before"
      },
      {
        "char": "度",
        "pos": "after"
      },
      {
        "char": "杯",
        "pos": "after"
      }
    ]
  },
  {
    "char": "杯",
    "zhuyin": "ㄅㄟ",
    "searchWord": "杯麵",
    "surrounding": [
      {
        "char": "量",
        "pos": "before"
      },
      {
        "char": "茶",
        "pos": "before"
      },
      {
        "char": "子",
        "pos": "after"
      },
      {
        "char": "麵",
        "pos": "after"
      }
    ]
  },
  {
    "char": "茶",
    "zhuyin": "ㄔㄚˊ",
    "searchWord": "茶壺",
    "surrounding": [
      {
        "char": "紅",
        "pos": "before"
      },
      {
        "char": "綠",
        "pos": "before"
      },
      {
        "char": "葉",
        "pos": "after"
      },
      {
        "char": "壺",
        "pos": "after"
      }
    ]
  },
  {
    "char": "葉",
    "zhuyin": "ㄧㄝˋ",
    "searchWord": "葉綠",
    "surrounding": [
      {
        "char": "茶",
        "pos": "before"
      },
      {
        "char": "落",
        "pos": "before"
      },
      {
        "char": "片",
        "pos": "after"
      },
      {
        "char": "綠",
        "pos": "after"
      }
    ]
  },
  {
    "char": "落",
    "zhuyin": "ㄌㄨㄛˋ",
    "searchWord": "落幕",
    "surrounding": [
      {
        "char": "降",
        "pos": "before"
      },
      {
        "char": "下",
        "pos": "before"
      },
      {
        "char": "地",
        "pos": "after"
      },
      {
        "char": "幕",
        "pos": "after"
      }
    ]
  },
  {
    "char": "幕",
    "zhuyin": "ㄇㄨˋ",
    "searchWord": "幕僚",
    "surrounding": [
      {
        "char": "落",
        "pos": "before"
      },
      {
        "char": "開",
        "pos": "before"
      },
      {
        "char": "後",
        "pos": "after"
      },
      {
        "char": "僚",
        "pos": "after"
      }
    ]
  },
  {
    "char": "後",
    "zhuyin": "ㄏㄡˋ",
    "searchWord": "後代",
    "surrounding": [
      {
        "char": "幕",
        "pos": "before"
      },
      {
        "char": "背",
        "pos": "before"
      },
      {
        "char": "悔",
        "pos": "after"
      },
      {
        "char": "代",
        "pos": "after"
      }
    ]
  },
  {
    "char": "代",
    "zhuyin": "ㄉㄞˋ",
    "searchWord": "代價",
    "surrounding": [
      {
        "char": "後",
        "pos": "before"
      },
      {
        "char": "時",
        "pos": "before"
      },
      {
        "char": "表",
        "pos": "after"
      },
      {
        "char": "價",
        "pos": "after"
      }
    ]
  },
  {
    "char": "表",
    "zhuyin": "ㄅㄧㄠˇ",
    "searchWord": "表示",
    "surrounding": [
      {
        "char": "代",
        "pos": "before"
      },
      {
        "char": "圖",
        "pos": "before"
      },
      {
        "char": "情",
        "pos": "after"
      },
      {
        "char": "示",
        "pos": "after"
      }
    ]
  },
  {
    "char": "示",
    "zhuyin": "ㄕˋ",
    "searchWord": "示弱",
    "surrounding": [
      {
        "char": "表",
        "pos": "before"
      },
      {
        "char": "警",
        "pos": "before"
      },
      {
        "char": "範",
        "pos": "after"
      },
      {
        "char": "弱",
        "pos": "after"
      }
    ]
  },
  {
    "char": "弱",
    "zhuyin": "ㄖㄨㄛˋ",
    "searchWord": "弱小",
    "surrounding": [
      {
        "char": "示",
        "pos": "before"
      },
      {
        "char": "懦",
        "pos": "before"
      },
      {
        "char": "點",
        "pos": "after"
      },
      {
        "char": "小",
        "pos": "after"
      }
    ]
  },
  {
    "char": "點",
    "zhuyin": "ㄉㄧㄢˇ",
    "searchWord": "點頭",
    "surrounding": [
      {
        "char": "弱",
        "pos": "before"
      },
      {
        "char": "特",
        "pos": "before"
      },
      {
        "char": "心",
        "pos": "after"
      },
      {
        "char": "頭",
        "pos": "after"
      }
    ]
  },
  {
    "char": "特",
    "zhuyin": "ㄊㄜˋ",
    "searchWord": "特權",
    "surrounding": [
      {
        "char": "獨",
        "pos": "before"
      },
      {
        "char": "奇",
        "pos": "before"
      },
      {
        "char": "色",
        "pos": "after"
      },
      {
        "char": "權",
        "pos": "after"
      }
    ]
  },
  {
    "char": "色",
    "zhuyin": "ㄙㄜˋ",
    "searchWord": "色調",
    "surrounding": [
      {
        "char": "特",
        "pos": "before"
      },
      {
        "char": "顏",
        "pos": "before"
      },
      {
        "char": "彩",
        "pos": "after"
      },
      {
        "char": "調",
        "pos": "after"
      }
    ]
  },
  {
    "char": "彩",
    "zhuyin": "ㄘㄞˇ",
    "searchWord": "彩券",
    "surrounding": [
      {
        "char": "色",
        "pos": "before"
      },
      {
        "char": "光",
        "pos": "before"
      },
      {
        "char": "虹",
        "pos": "after"
      },
      {
        "char": "券",
        "pos": "after"
      }
    ]
  },
  {
    "char": "虹",
    "zhuyin": "ㄏㄨㄥˊ",
    "searchWord": "虹膜",
    "surrounding": [
      {
        "char": "彩",
        "pos": "before"
      },
      {
        "char": "霓",
        "pos": "before"
      },
      {
        "char": "吸",
        "pos": "after"
      },
      {
        "char": "膜",
        "pos": "after"
      }
    ]
  },
  {
    "char": "膜",
    "zhuyin": "ㄇㄛˊ",
    "searchWord": "膜片",
    "surrounding": [
      {
        "char": "虹",
        "pos": "before"
      },
      {
        "char": "耳",
        "pos": "before"
      },
      {
        "char": "拜",
        "pos": "after"
      },
      {
        "char": "片",
        "pos": "after"
      }
    ]
  },
  {
    "char": "拜",
    "zhuyin": "ㄅㄞˋ",
    "searchWord": "拜託",
    "surrounding": [
      {
        "char": "膜",
        "pos": "before"
      },
      {
        "char": "禮",
        "pos": "before"
      },
      {
        "char": "訪",
        "pos": "after"
      },
      {
        "char": "託",
        "pos": "after"
      }
    ]
  },
  {
    "char": "訪",
    "zhuyin": "ㄈㄤˇ",
    "searchWord": "訪談",
    "surrounding": [
      {
        "char": "拜",
        "pos": "before"
      },
      {
        "char": "採",
        "pos": "before"
      },
      {
        "char": "問",
        "pos": "after"
      },
      {
        "char": "談",
        "pos": "after"
      }
    ]
  },
  {
    "char": "談",
    "zhuyin": "ㄊㄢˊ",
    "searchWord": "談話",
    "surrounding": [
      {
        "char": "訪",
        "pos": "before"
      },
      {
        "char": "交",
        "pos": "before"
      },
      {
        "char": "判",
        "pos": "after"
      },
      {
        "char": "話",
        "pos": "after"
      }
    ]
  },
  {
    "char": "夜",
    "zhuyin": "ㄧㄝˋ",
    "searchWord": "夜晚",
    "surrounding": [
      {
        "char": "午",
        "pos": "before"
      },
      {
        "char": "黑",
        "pos": "before"
      },
      {
        "char": "晚",
        "pos": "after"
      },
      {
        "char": "空",
        "pos": "after"
      }
    ]
  },
  {
    "char": "日",
    "zhuyin": "ㄖˋ",
    "searchWord": "日光",
    "surrounding": [
      {
        "char": "白",
        "pos": "before"
      },
      {
        "char": "昔",
        "pos": "before"
      },
      {
        "char": "光",
        "pos": "after"
      },
      {
        "char": "子",
        "pos": "after"
      }
    ]
  },
  {
    "char": "命",
    "zhuyin": "ㄇㄧㄥˋ",
    "searchWord": "命令",
    "surrounding": [
      {
        "char": "生",
        "pos": "before"
      },
      {
        "char": "救",
        "pos": "before"
      },
      {
        "char": "運",
        "pos": "after"
      },
      {
        "char": "令",
        "pos": "after"
      }
    ]
  },
  {
    "char": "令",
    "zhuyin": "ㄌㄧㄥˋ",
    "searchWord": "令牌",
    "surrounding": [
      {
        "char": "命",
        "pos": "before"
      },
      {
        "char": "禁",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "after"
      },
      {
        "char": "牌",
        "pos": "after"
      }
    ]
  },
  {
    "char": "光",
    "zhuyin": "ㄍㄨㄤ",
    "searchWord": "光明",
    "surrounding": [
      {
        "char": "陽",
        "pos": "before"
      },
      {
        "char": "月",
        "pos": "before"
      },
      {
        "char": "明",
        "pos": "after"
      },
      {
        "char": "輝",
        "pos": "after"
      }
    ]
  },
  {
    "char": "火",
    "zhuyin": "ㄏㄨㄛˇ",
    "searchWord": "火花",
    "surrounding": [
      {
        "char": "烈",
        "pos": "before"
      },
      {
        "char": "營",
        "pos": "before"
      },
      {
        "char": "花",
        "pos": "after"
      },
      {
        "char": "焰",
        "pos": "after"
      }
    ]
  },
  {
    "char": "星",
    "zhuyin": "ㄒㄧㄥ",
    "searchWord": "星球",
    "surrounding": [
      {
        "char": "行",
        "pos": "before"
      },
      {
        "char": "恆",
        "pos": "before"
      },
      {
        "char": "球",
        "pos": "after"
      },
      {
        "char": "光",
        "pos": "after"
      }
    ]
  },
  {
    "char": "石",
    "zhuyin": "ㄕˊ",
    "searchWord": "石頭",
    "surrounding": [
      {
        "char": "岩",
        "pos": "before"
      },
      {
        "char": "寶",
        "pos": "before"
      },
      {
        "char": "頭",
        "pos": "after"
      },
      {
        "char": "油",
        "pos": "after"
      }
    ]
  },
  {
    "char": "木",
    "zhuyin": "ㄇㄨˋ",
    "searchWord": "木材",
    "surrounding": [
      {
        "char": "樹",
        "pos": "before"
      },
      {
        "char": "草",
        "pos": "before"
      },
      {
        "char": "材",
        "pos": "after"
      },
      {
        "char": "頭",
        "pos": "after"
      }
    ]
  },
  {
    "char": "金",
    "zhuyin": "ㄐㄧㄣ",
    "searchWord": "金錢",
    "surrounding": [
      {
        "char": "黃",
        "pos": "before"
      },
      {
        "char": "白",
        "pos": "before"
      },
      {
        "char": "錢",
        "pos": "after"
      },
      {
        "char": "牌",
        "pos": "after"
      }
    ]
  },
  {
    "char": "土",
    "zhuyin": "ㄊㄨˇ",
    "searchWord": "土地",
    "surrounding": [
      {
        "char": "泥",
        "pos": "before"
      },
      {
        "char": "領",
        "pos": "before"
      },
      {
        "char": "地",
        "pos": "after"
      },
      {
        "char": "壤",
        "pos": "after"
      }
    ]
  },
  {
    "char": "雲",
    "zhuyin": "ㄩㄣˊ",
    "searchWord": "雲層",
    "surrounding": [
      {
        "char": "白",
        "pos": "before"
      },
      {
        "char": "彩",
        "pos": "before"
      },
      {
        "char": "層",
        "pos": "after"
      },
      {
        "char": "朵",
        "pos": "after"
      }
    ]
  },
  {
    "char": "雨",
    "zhuyin": "ㄩˇ",
    "searchWord": "雨水",
    "surrounding": [
      {
        "char": "暴",
        "pos": "before"
      },
      {
        "char": "春",
        "pos": "before"
      },
      {
        "char": "水",
        "pos": "after"
      },
      {
        "char": "滴",
        "pos": "after"
      }
    ]
  },
  {
    "char": "雪",
    "zhuyin": "ㄒㄩㄝˇ",
    "searchWord": "雪花",
    "surrounding": [
      {
        "char": "白",
        "pos": "before"
      },
      {
        "char": "積",
        "pos": "before"
      },
      {
        "char": "花",
        "pos": "after"
      },
      {
        "char": "人",
        "pos": "after"
      }
    ]
  },
  {
    "char": "電",
    "zhuyin": "ㄉㄧㄢˋ",
    "searchWord": "電力",
    "surrounding": [
      {
        "char": "雷",
        "pos": "before"
      },
      {
        "char": "閃",
        "pos": "before"
      },
      {
        "char": "力",
        "pos": "after"
      },
      {
        "char": "腦",
        "pos": "after"
      }
    ]
  },
  {
    "char": "春",
    "zhuyin": "ㄔㄨㄣ",
    "searchWord": "春節",
    "surrounding": [
      {
        "char": "早",
        "pos": "before"
      },
      {
        "char": "初",
        "pos": "before"
      },
      {
        "char": "節",
        "pos": "after"
      },
      {
        "char": "季",
        "pos": "after"
      }
    ]
  },
  {
    "char": "夏",
    "zhuyin": "ㄒㄧㄚˋ",
    "searchWord": "夏季",
    "surrounding": [
      {
        "char": "初",
        "pos": "before"
      },
      {
        "char": "盛",
        "pos": "before"
      },
      {
        "char": "季",
        "pos": "after"
      },
      {
        "char": "日",
        "pos": "after"
      }
    ]
  },
  {
    "char": "秋",
    "zhuyin": "ㄑㄧㄡ",
    "searchWord": "秋天",
    "surrounding": [
      {
        "char": "初",
        "pos": "before"
      },
      {
        "char": "深",
        "pos": "before"
      },
      {
        "char": "天",
        "pos": "after"
      },
      {
        "char": "風",
        "pos": "after"
      }
    ]
  },
  {
    "char": "冬",
    "zhuyin": "ㄉㄨㄥ",
    "searchWord": "冬天",
    "surrounding": [
      {
        "char": "初",
        "pos": "before"
      },
      {
        "char": "寒",
        "pos": "before"
      },
      {
        "char": "天",
        "pos": "after"
      },
      {
        "char": "季",
        "pos": "after"
      }
    ]
  },
  {
    "char": "江",
    "zhuyin": "ㄐㄧㄤ",
    "searchWord": "江水",
    "surrounding": [
      {
        "char": "長",
        "pos": "before"
      },
      {
        "char": "大",
        "pos": "before"
      },
      {
        "char": "水",
        "pos": "after"
      },
      {
        "char": "河",
        "pos": "after"
      }
    ]
  },
  {
    "char": "湖",
    "zhuyin": "ㄏㄨˊ",
    "searchWord": "湖面",
    "surrounding": [
      {
        "char": "西",
        "pos": "before"
      },
      {
        "char": "內",
        "pos": "before"
      },
      {
        "char": "面",
        "pos": "after"
      },
      {
        "char": "泊",
        "pos": "after"
      }
    ]
  },
  {
    "char": "河",
    "zhuyin": "ㄏㄜˊ",
    "searchWord": "河川",
    "surrounding": [
      {
        "char": "銀",
        "pos": "before"
      },
      {
        "char": "運",
        "pos": "before"
      },
      {
        "char": "川",
        "pos": "after"
      },
      {
        "char": "流",
        "pos": "after"
      }
    ]
  },
  {
    "char": "城",
    "zhuyin": "ㄔㄥˊ",
    "searchWord": "城堡",
    "surrounding": [
      {
        "char": "長",
        "pos": "before"
      },
      {
        "char": "京",
        "pos": "before"
      },
      {
        "char": "堡",
        "pos": "after"
      },
      {
        "char": "市",
        "pos": "after"
      }
    ]
  },
  {
    "char": "市",
    "zhuyin": "ㄕˋ",
    "searchWord": "市場",
    "surrounding": [
      {
        "char": "都",
        "pos": "before"
      },
      {
        "char": "夜",
        "pos": "before"
      },
      {
        "char": "場",
        "pos": "after"
      },
      {
        "char": "區",
        "pos": "after"
      }
    ]
  },
  {
    "char": "路",
    "zhuyin": "ㄌㄨˋ",
    "searchWord": "路口",
    "surrounding": [
      {
        "char": "道",
        "pos": "before"
      },
      {
        "char": "公",
        "pos": "before"
      },
      {
        "char": "口",
        "pos": "after"
      },
      {
        "char": "線",
        "pos": "after"
      }
    ]
  },
  {
    "char": "橋",
    "zhuyin": "ㄑㄧㄠˊ",
    "searchWord": "橋樑",
    "surrounding": [
      {
        "char": "大",
        "pos": "before"
      },
      {
        "char": "天",
        "pos": "before"
      },
      {
        "char": "樑",
        "pos": "after"
      },
      {
        "char": "墩",
        "pos": "after"
      }
    ]
  },
  {
    "char": "門",
    "zhuyin": "ㄇㄣˊ",
    "searchWord": "門口",
    "surrounding": [
      {
        "char": "大",
        "pos": "before"
      },
      {
        "char": "校",
        "pos": "before"
      },
      {
        "char": "口",
        "pos": "after"
      },
      {
        "char": "戶",
        "pos": "after"
      }
    ]
  },
  {
    "char": "窗",
    "zhuyin": "ㄔㄨㄤ",
    "searchWord": "窗戶",
    "surrounding": [
      {
        "char": "門",
        "pos": "before"
      },
      {
        "char": "車",
        "pos": "before"
      },
      {
        "char": "戶",
        "pos": "after"
      },
      {
        "char": "簾",
        "pos": "after"
      }
    ]
  },
  {
    "char": "室",
    "zhuyin": "ㄕˋ",
    "searchWord": "室內",
    "surrounding": [
      {
        "char": "教",
        "pos": "before"
      },
      {
        "char": "溫",
        "pos": "before"
      },
      {
        "char": "內",
        "pos": "after"
      },
      {
        "char": "友",
        "pos": "after"
      }
    ]
  },
  {
    "char": "房",
    "zhuyin": "ㄈㄤˊ",
    "searchWord": "房間",
    "surrounding": [
      {
        "char": "書",
        "pos": "before"
      },
      {
        "char": "套",
        "pos": "before"
      },
      {
        "char": "間",
        "pos": "after"
      },
      {
        "char": "屋",
        "pos": "after"
      }
    ]
  },
  {
    "char": "店",
    "zhuyin": "ㄉㄧㄢˋ",
    "searchWord": "店鋪",
    "surrounding": [
      {
        "char": "商",
        "pos": "before"
      },
      {
        "char": "飯",
        "pos": "before"
      },
      {
        "char": "鋪",
        "pos": "after"
      },
      {
        "char": "面",
        "pos": "after"
      }
    ]
  },
  {
    "char": "林",
    "zhuyin": "ㄌㄧㄣˊ",
    "searchWord": "林木",
    "surrounding": [
      {
        "char": "森",
        "pos": "before"
      },
      {
        "char": "竹",
        "pos": "before"
      },
      {
        "char": "木",
        "pos": "after"
      },
      {
        "char": "地",
        "pos": "after"
      }
    ]
  },
  {
    "char": "森",
    "zhuyin": "ㄙㄣ",
    "searchWord": "森林",
    "surrounding": [
      {
        "char": "黑",
        "pos": "before"
      },
      {
        "char": "陰",
        "pos": "before"
      },
      {
        "char": "林",
        "pos": "after"
      },
      {
        "char": "嚴",
        "pos": "after"
      }
    ]
  },
  {
    "char": "草",
    "zhuyin": "ㄘㄠˇ",
    "searchWord": "草原",
    "surrounding": [
      {
        "char": "青",
        "pos": "before"
      },
      {
        "char": "野",
        "pos": "before"
      },
      {
        "char": "原",
        "pos": "after"
      },
      {
        "char": "坪",
        "pos": "after"
      }
    ]
  },
  {
    "char": "樹",
    "zhuyin": "ㄕㄨˋ",
    "searchWord": "樹木",
    "surrounding": [
      {
        "char": "大",
        "pos": "before"
      },
      {
        "char": "果",
        "pos": "before"
      },
      {
        "char": "木",
        "pos": "after"
      },
      {
        "char": "枝",
        "pos": "after"
      }
    ]
  },
  {
    "char": "竹",
    "zhuyin": "ㄓㄨˊ",
    "searchWord": "竹子",
    "surrounding": [
      {
        "char": "青",
        "pos": "before"
      },
      {
        "char": "綠",
        "pos": "before"
      },
      {
        "char": "子",
        "pos": "after"
      },
      {
        "char": "林",
        "pos": "after"
      }
    ]
  },
  {
    "char": "鳥",
    "zhuyin": "ㄋㄧㄠˇ",
    "searchWord": "鳥類",
    "surrounding": [
      {
        "char": "小",
        "pos": "before"
      },
      {
        "char": "飛",
        "pos": "before"
      },
      {
        "char": "類",
        "pos": "after"
      },
      {
        "char": "巢",
        "pos": "after"
      }
    ]
  },
  {
    "char": "魚",
    "zhuyin": "ㄩˊ",
    "searchWord": "魚類",
    "surrounding": [
      {
        "char": "小",
        "pos": "before"
      },
      {
        "char": "金",
        "pos": "before"
      },
      {
        "char": "類",
        "pos": "after"
      },
      {
        "char": "池",
        "pos": "after"
      }
    ]
  },
  {
    "char": "馬",
    "zhuyin": "ㄇㄚˇ",
    "searchWord": "馬路",
    "surrounding": [
      {
        "char": "白",
        "pos": "before"
      },
      {
        "char": "野",
        "pos": "before"
      },
      {
        "char": "路",
        "pos": "after"
      },
      {
        "char": "車",
        "pos": "after"
      }
    ]
  },
  {
    "char": "牛",
    "zhuyin": "ㄋㄧㄡˊ",
    "searchWord": "牛肉",
    "surrounding": [
      {
        "char": "黃",
        "pos": "before"
      },
      {
        "char": "乳",
        "pos": "before"
      },
      {
        "char": "肉",
        "pos": "after"
      },
      {
        "char": "奶",
        "pos": "after"
      }
    ]
  },
  {
    "char": "羊",
    "zhuyin": "ㄧㄤˊ",
    "searchWord": "羊毛",
    "surrounding": [
      {
        "char": "綿",
        "pos": "before"
      },
      {
        "char": "山",
        "pos": "before"
      },
      {
        "char": "毛",
        "pos": "after"
      },
      {
        "char": "肉",
        "pos": "after"
      }
    ]
  },
  {
    "char": "犬",
    "zhuyin": "ㄑㄩㄢˇ",
    "searchWord": "犬齒",
    "surrounding": [
      {
        "char": "獵",
        "pos": "before"
      },
      {
        "char": "警",
        "pos": "before"
      },
      {
        "char": "齒",
        "pos": "after"
      },
      {
        "char": "吠",
        "pos": "after"
      }
    ]
  },
  {
    "char": "貓",
    "zhuyin": "ㄇㄠ",
    "searchWord": "貓咪",
    "surrounding": [
      {
        "char": "野",
        "pos": "before"
      },
      {
        "char": "小",
        "pos": "before"
      },
      {
        "char": "咪",
        "pos": "after"
      },
      {
        "char": "眼",
        "pos": "after"
      }
    ]
  },
  {
    "char": "羽",
    "zhuyin": "ㄩˇ",
    "searchWord": "羽毛",
    "surrounding": [
      {
        "char": "鳥",
        "pos": "before"
      },
      {
        "char": "白",
        "pos": "before"
      },
      {
        "char": "毛",
        "pos": "after"
      },
      {
        "char": "翼",
        "pos": "after"
      }
    ]
  },
  {
    "char": "手",
    "zhuyin": "ㄕㄡˇ",
    "searchWord": "手冊",
    "surrounding": [
      {
        "char": "雙",
        "pos": "before"
      },
      {
        "char": "牽",
        "pos": "before"
      },
      {
        "char": "冊",
        "pos": "after"
      },
      {
        "char": "指",
        "pos": "after"
      }
    ]
  },
  {
    "char": "足",
    "zhuyin": "ㄗㄨˊ",
    "searchWord": "足球",
    "surrounding": [
      {
        "char": "雙",
        "pos": "before"
      },
      {
        "char": "知",
        "pos": "before"
      },
      {
        "char": "球",
        "pos": "after"
      },
      {
        "char": "跡",
        "pos": "after"
      }
    ]
  },
  {
    "char": "目",
    "zhuyin": "ㄇㄨˋ",
    "searchWord": "目前",
    "surrounding": [
      {
        "char": "雙",
        "pos": "before"
      },
      {
        "char": "注",
        "pos": "before"
      },
      {
        "char": "前",
        "pos": "after"
      },
      {
        "char": "標",
        "pos": "after"
      }
    ]
  },
  {
    "char": "眼",
    "zhuyin": "ㄧㄢˇ",
    "searchWord": "眼睛",
    "surrounding": [
      {
        "char": "雙",
        "pos": "before"
      },
      {
        "char": "眨",
        "pos": "before"
      },
      {
        "char": "睛",
        "pos": "after"
      },
      {
        "char": "淚",
        "pos": "after"
      }
    ]
  },
  {
    "char": "耳",
    "zhuyin": "ㄦˇ",
    "searchWord": "耳朵",
    "surrounding": [
      {
        "char": "木",
        "pos": "before"
      },
      {
        "char": "順",
        "pos": "before"
      },
      {
        "char": "朵",
        "pos": "after"
      },
      {
        "char": "目",
        "pos": "after"
      }
    ]
  },
  {
    "char": "鼻",
    "zhuyin": "ㄅㄧˊ",
    "searchWord": "鼻子",
    "surrounding": [
      {
        "char": "象",
        "pos": "before"
      },
      {
        "char": "隆",
        "pos": "before"
      },
      {
        "char": "子",
        "pos": "after"
      },
      {
        "char": "音",
        "pos": "after"
      }
    ]
  },
  {
    "char": "舌",
    "zhuyin": "ㄕㄜˊ",
    "searchWord": "舌頭",
    "surrounding": [
      {
        "char": "長",
        "pos": "before"
      },
      {
        "char": "火",
        "pos": "before"
      },
      {
        "char": "頭",
        "pos": "after"
      },
      {
        "char": "尖",
        "pos": "after"
      }
    ]
  },
  {
    "char": "牙",
    "zhuyin": "ㄧㄚˊ",
    "searchWord": "牙齒",
    "surrounding": [
      {
        "char": "蛀",
        "pos": "before"
      },
      {
        "char": "刷",
        "pos": "before"
      },
      {
        "char": "齒",
        "pos": "after"
      },
      {
        "char": "膏",
        "pos": "after"
      }
    ]
  },
  {
    "char": "身",
    "zhuyin": "ㄕㄣ",
    "searchWord": "身體",
    "surrounding": [
      {
        "char": "自",
        "pos": "before"
      },
      {
        "char": "全",
        "pos": "before"
      },
      {
        "char": "體",
        "pos": "after"
      },
      {
        "char": "份",
        "pos": "after"
      }
    ]
  },
  {
    "char": "體",
    "zhuyin": "ㄊㄧˇ",
    "searchWord": "體力",
    "surrounding": [
      {
        "char": "本",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "before"
      },
      {
        "char": "力",
        "pos": "after"
      },
      {
        "char": "育",
        "pos": "after"
      }
    ]
  },
  {
    "char": "言",
    "zhuyin": "ㄧㄢˊ",
    "searchWord": "言語",
    "surrounding": [
      {
        "char": "留",
        "pos": "before"
      },
      {
        "char": "發",
        "pos": "before"
      },
      {
        "char": "語",
        "pos": "after"
      },
      {
        "char": "行",
        "pos": "after"
      }
    ]
  },
  {
    "char": "語",
    "zhuyin": "ㄩˇ",
    "searchWord": "語言",
    "surrounding": [
      {
        "char": "國",
        "pos": "before"
      },
      {
        "char": "華",
        "pos": "before"
      },
      {
        "char": "言",
        "pos": "after"
      },
      {
        "char": "文",
        "pos": "after"
      }
    ]
  },
  {
    "char": "文",
    "zhuyin": "ㄨㄣˊ",
    "searchWord": "文章",
    "surrounding": [
      {
        "char": "語",
        "pos": "before"
      },
      {
        "char": "中",
        "pos": "before"
      },
      {
        "char": "章",
        "pos": "after"
      },
      {
        "char": "化",
        "pos": "after"
      }
    ]
  },
  {
    "char": "字",
    "zhuyin": "ㄗˋ",
    "searchWord": "字典",
    "surrounding": [
      {
        "char": "生",
        "pos": "before"
      },
      {
        "char": "寫",
        "pos": "before"
      },
      {
        "char": "典",
        "pos": "after"
      },
      {
        "char": "體",
        "pos": "after"
      }
    ]
  },
  {
    "char": "筆",
    "zhuyin": "ㄅㄧˇ",
    "searchWord": "筆記",
    "surrounding": [
      {
        "char": "鉛",
        "pos": "before"
      },
      {
        "char": "毛",
        "pos": "before"
      },
      {
        "char": "記",
        "pos": "after"
      },
      {
        "char": "者",
        "pos": "after"
      }
    ]
  },
  {
    "char": "紙",
    "zhuyin": "ㄓˇ",
    "searchWord": "紙張",
    "surrounding": [
      {
        "char": "報",
        "pos": "before"
      },
      {
        "char": "信",
        "pos": "before"
      },
      {
        "char": "張",
        "pos": "after"
      },
      {
        "char": "箱",
        "pos": "after"
      }
    ]
  },
  {
    "char": "墨",
    "zhuyin": "ㄇㄛˋ",
    "searchWord": "墨水",
    "surrounding": [
      {
        "char": "筆",
        "pos": "before"
      },
      {
        "char": "油",
        "pos": "before"
      },
      {
        "char": "水",
        "pos": "after"
      },
      {
        "char": "汁",
        "pos": "after"
      }
    ]
  },
  {
    "char": "硯",
    "zhuyin": "ㄧㄢˋ",
    "searchWord": "硯池",
    "surrounding": [
      {
        "char": "端",
        "pos": "before"
      },
      {
        "char": "石",
        "pos": "before"
      },
      {
        "char": "池",
        "pos": "after"
      },
      {
        "char": "臺",
        "pos": "after"
      }
    ]
  },
  {
    "char": "歌",
    "zhuyin": "ㄍㄜ",
    "searchWord": "歌曲",
    "surrounding": [
      {
        "char": "民",
        "pos": "before"
      },
      {
        "char": "詩",
        "pos": "before"
      },
      {
        "char": "曲",
        "pos": "after"
      },
      {
        "char": "手",
        "pos": "after"
      }
    ]
  },
  {
    "char": "聲",
    "zhuyin": "ㄕㄥ",
    "searchWord": "聲音",
    "surrounding": [
      {
        "char": "歌",
        "pos": "before"
      },
      {
        "char": "雨",
        "pos": "before"
      },
      {
        "char": "音",
        "pos": "after"
      },
      {
        "char": "響",
        "pos": "after"
      }
    ]
  },
  {
    "char": "音",
    "zhuyin": "ㄧㄣ",
    "searchWord": "音樂",
    "surrounding": [
      {
        "char": "發",
        "pos": "before"
      },
      {
        "char": "知",
        "pos": "before"
      },
      {
        "char": "樂",
        "pos": "after"
      },
      {
        "char": "節",
        "pos": "after"
      }
    ]
  },
  {
    "char": "畫",
    "zhuyin": "ㄏㄨㄚˋ",
    "searchWord": "畫面",
    "surrounding": [
      {
        "char": "圖",
        "pos": "before"
      },
      {
        "char": "插",
        "pos": "before"
      },
      {
        "char": "面",
        "pos": "after"
      },
      {
        "char": "布",
        "pos": "after"
      }
    ]
  },
  {
    "char": "圖",
    "zhuyin": "ㄊㄨˊ",
    "searchWord": "圖片",
    "surrounding": [
      {
        "char": "地",
        "pos": "before"
      },
      {
        "char": "試",
        "pos": "before"
      },
      {
        "char": "片",
        "pos": "after"
      },
      {
        "char": "畫",
        "pos": "after"
      }
    ]
  },
  {
    "char": "影",
    "zhuyin": "ㄧㄥˇ",
    "searchWord": "影片",
    "surrounding": [
      {
        "char": "電",
        "pos": "before"
      },
      {
        "char": "投",
        "pos": "before"
      },
      {
        "char": "片",
        "pos": "after"
      },
      {
        "char": "像",
        "pos": "after"
      }
    ]
  },
  {
    "char": "燈",
    "zhuyin": "ㄉㄥ",
    "searchWord": "燈光",
    "surrounding": [
      {
        "char": "電",
        "pos": "before"
      },
      {
        "char": "路",
        "pos": "before"
      },
      {
        "char": "光",
        "pos": "after"
      },
      {
        "char": "火",
        "pos": "after"
      }
    ]
  },
  {
    "char": "鏡",
    "zhuyin": "ㄐㄧㄥˋ",
    "searchWord": "鏡頭",
    "surrounding": [
      {
        "char": "眼",
        "pos": "before"
      },
      {
        "char": "透",
        "pos": "before"
      },
      {
        "char": "頭",
        "pos": "after"
      },
      {
        "char": "像",
        "pos": "after"
      }
    ]
  },
  {
    "char": "鐘",
    "zhuyin": "ㄓㄨㄥ",
    "searchWord": "鐘聲",
    "surrounding": [
      {
        "char": "時",
        "pos": "before"
      },
      {
        "char": "警",
        "pos": "before"
      },
      {
        "char": "聲",
        "pos": "after"
      },
      {
        "char": "面",
        "pos": "after"
      }
    ]
  },
  {
    "char": "錶",
    "zhuyin": "ㄅㄧㄠˇ",
    "searchWord": "錶面",
    "surrounding": [
      {
        "char": "手",
        "pos": "before"
      },
      {
        "char": "懷",
        "pos": "before"
      },
      {
        "char": "面",
        "pos": "after"
      },
      {
        "char": "帶",
        "pos": "after"
      }
    ]
  },
  {
    "char": "舟",
    "zhuyin": "ㄓㄡ",
    "searchWord": "舟楫",
    "surrounding": [
      {
        "char": "扁",
        "pos": "before"
      },
      {
        "char": "輕",
        "pos": "before"
      },
      {
        "char": "楫",
        "pos": "after"
      },
      {
        "char": "子",
        "pos": "after"
      }
    ]
  },
  {
    "char": "船",
    "zhuyin": "ㄔㄨㄢˊ",
    "searchWord": "船隻",
    "surrounding": [
      {
        "char": "輪",
        "pos": "before"
      },
      {
        "char": "木",
        "pos": "before"
      },
      {
        "char": "隻",
        "pos": "after"
      },
      {
        "char": "長",
        "pos": "after"
      }
    ]
  },
  {
    "char": "帆",
    "zhuyin": "ㄈㄢˊ",
    "searchWord": "帆船",
    "surrounding": [
      {
        "char": "揚",
        "pos": "before"
      },
      {
        "char": "風",
        "pos": "before"
      },
      {
        "char": "船",
        "pos": "after"
      },
      {
        "char": "布",
        "pos": "after"
      }
    ]
  },
  {
    "char": "旗",
    "zhuyin": "ㄑㄧˊ",
    "searchWord": "旗幟",
    "surrounding": [
      {
        "char": "彩",
        "pos": "before"
      },
      {
        "char": "升",
        "pos": "before"
      },
      {
        "char": "幟",
        "pos": "after"
      },
      {
        "char": "桿",
        "pos": "after"
      }
    ]
  },
  {
    "char": "鼓",
    "zhuyin": "ㄍㄨˇ",
    "searchWord": "鼓聲",
    "surrounding": [
      {
        "char": "打",
        "pos": "before"
      },
      {
        "char": "鳴",
        "pos": "before"
      },
      {
        "char": "聲",
        "pos": "after"
      },
      {
        "char": "舞",
        "pos": "after"
      }
    ]
  },
  {
    "char": "琴",
    "zhuyin": "ㄑㄧㄣˊ",
    "searchWord": "琴鍵",
    "surrounding": [
      {
        "char": "鋼",
        "pos": "before"
      },
      {
        "char": "古",
        "pos": "before"
      },
      {
        "char": "鍵",
        "pos": "after"
      },
      {
        "char": "弦",
        "pos": "after"
      }
    ]
  },
  {
    "char": "笛",
    "zhuyin": "ㄉㄧˊ",
    "searchWord": "笛聲",
    "surrounding": [
      {
        "char": "長",
        "pos": "before"
      },
      {
        "char": "短",
        "pos": "before"
      },
      {
        "char": "聲",
        "pos": "after"
      },
      {
        "char": "子",
        "pos": "after"
      }
    ]
  },
  {
    "char": "棋",
    "zhuyin": "ㄑㄧˊ",
    "searchWord": "棋盤",
    "surrounding": [
      {
        "char": "圍",
        "pos": "before"
      },
      {
        "char": "象",
        "pos": "before"
      },
      {
        "char": "盤",
        "pos": "after"
      },
      {
        "char": "子",
        "pos": "after"
      }
    ]
  },
  {
    "char": "牌",
    "zhuyin": "ㄆㄞˊ",
    "searchWord": "牌照",
    "surrounding": [
      {
        "char": "金",
        "pos": "before"
      },
      {
        "char": "門",
        "pos": "before"
      },
      {
        "char": "照",
        "pos": "after"
      },
      {
        "char": "子",
        "pos": "after"
      }
    ]
  },
  {
    "char": "尺",
    "zhuyin": "ㄔˇ",
    "searchWord": "尺度",
    "surrounding": [
      {
        "char": "皮",
        "pos": "before"
      },
      {
        "char": "直",
        "pos": "before"
      },
      {
        "char": "度",
        "pos": "after"
      },
      {
        "char": "寸",
        "pos": "after"
      }
    ]
  },
  {
    "char": "印",
    "zhuyin": "ㄧㄣˋ",
    "searchWord": "印象",
    "surrounding": [
      {
        "char": "刻",
        "pos": "before"
      },
      {
        "char": "打",
        "pos": "before"
      },
      {
        "char": "象",
        "pos": "after"
      },
      {
        "char": "刷",
        "pos": "after"
      }
    ]
  },
  {
    "char": "章",
    "zhuyin": "ㄓㄤ",
    "searchWord": "章節",
    "surrounding": [
      {
        "char": "篇",
        "pos": "before"
      },
      {
        "char": "樂",
        "pos": "before"
      },
      {
        "char": "節",
        "pos": "after"
      },
      {
        "char": "法",
        "pos": "after"
      }
    ]
  },
  {
    "char": "頁",
    "zhuyin": "ㄧㄝˋ",
    "searchWord": "頁碼",
    "surrounding": [
      {
        "char": "首",
        "pos": "before"
      },
      {
        "char": "隔",
        "pos": "before"
      },
      {
        "char": "碼",
        "pos": "after"
      },
      {
        "char": "數",
        "pos": "after"
      }
    ]
  },
  {
    "char": "行",
    "zhuyin": "ㄒㄧㄥˊ",
    "searchWord": "行動",
    "surrounding": [
      {
        "char": "進",
        "pos": "before"
      },
      {
        "char": "步",
        "pos": "before"
      },
      {
        "char": "動",
        "pos": "after"
      },
      {
        "char": "走",
        "pos": "after"
      }
    ]
  },
  {
    "char": "走",
    "zhuyin": "ㄗㄡˇ",
    "searchWord": "走向",
    "surrounding": [
      {
        "char": "奔",
        "pos": "before"
      },
      {
        "char": "逃",
        "pos": "before"
      },
      {
        "char": "向",
        "pos": "after"
      },
      {
        "char": "廊",
        "pos": "after"
      }
    ]
  },
  {
    "char": "飛",
    "zhuyin": "ㄈㄟ",
    "searchWord": "飛翔",
    "surrounding": [
      {
        "char": "起",
        "pos": "before"
      },
      {
        "char": "騰",
        "pos": "before"
      },
      {
        "char": "翔",
        "pos": "after"
      },
      {
        "char": "躍",
        "pos": "after"
      }
    ]
  },
  {
    "char": "游",
    "zhuyin": "ㄧㄡˊ",
    "searchWord": "游泳",
    "surrounding": [
      {
        "char": "浮",
        "pos": "before"
      },
      {
        "char": "漫",
        "pos": "before"
      },
      {
        "char": "泳",
        "pos": "after"
      },
      {
        "char": "戲",
        "pos": "after"
      }
    ]
  },
  {
    "char": "登",
    "zhuyin": "ㄉㄥ",
    "searchWord": "登山",
    "surrounding": [
      {
        "char": "攀",
        "pos": "before"
      },
      {
        "char": "刊",
        "pos": "before"
      },
      {
        "char": "山",
        "pos": "after"
      },
      {
        "char": "記",
        "pos": "after"
      }
    ]
  },
  {
    "char": "跳",
    "zhuyin": "ㄊㄧㄠˋ",
    "searchWord": "跳躍",
    "surrounding": [
      {
        "char": "起",
        "pos": "before"
      },
      {
        "char": "心",
        "pos": "before"
      },
      {
        "char": "躍",
        "pos": "after"
      },
      {
        "char": "高",
        "pos": "after"
      }
    ]
  },
  {
    "char": "舞",
    "zhuyin": "ㄨˇ",
    "searchWord": "舞蹈",
    "surrounding": [
      {
        "char": "跳",
        "pos": "before"
      },
      {
        "char": "編",
        "pos": "before"
      },
      {
        "char": "蹈",
        "pos": "after"
      },
      {
        "char": "臺",
        "pos": "after"
      }
    ]
  },
  {
    "char": "唱",
    "zhuyin": "ㄔㄤˋ",
    "searchWord": "唱片",
    "surrounding": [
      {
        "char": "合",
        "pos": "before"
      },
      {
        "char": "獨",
        "pos": "before"
      },
      {
        "char": "片",
        "pos": "after"
      },
      {
        "char": "腔",
        "pos": "after"
      }
    ]
  },
  {
    "char": "讀",
    "zhuyin": "ㄉㄨˊ",
    "searchWord": "讀書",
    "surrounding": [
      {
        "char": "朗",
        "pos": "before"
      },
      {
        "char": "閱",
        "pos": "before"
      },
      {
        "char": "書",
        "pos": "after"
      },
      {
        "char": "者",
        "pos": "after"
      }
    ]
  },
  {
    "char": "寫",
    "zhuyin": "ㄒㄧㄝˇ",
    "searchWord": "寫作",
    "surrounding": [
      {
        "char": "描",
        "pos": "before"
      },
      {
        "char": "書",
        "pos": "before"
      },
      {
        "char": "作",
        "pos": "after"
      },
      {
        "char": "真",
        "pos": "after"
      }
    ]
  },
  {
    "char": "思",
    "zhuyin": "ㄙ",
    "searchWord": "思想",
    "surrounding": [
      {
        "char": "深",
        "pos": "before"
      },
      {
        "char": "沉",
        "pos": "before"
      },
      {
        "char": "想",
        "pos": "after"
      },
      {
        "char": "念",
        "pos": "after"
      }
    ]
  },
  {
    "char": "想",
    "zhuyin": "ㄒㄧㄤˇ",
    "searchWord": "想像",
    "surrounding": [
      {
        "char": "夢",
        "pos": "before"
      },
      {
        "char": "冥",
        "pos": "before"
      },
      {
        "char": "像",
        "pos": "after"
      },
      {
        "char": "法",
        "pos": "after"
      }
    ]
  },
  {
    "char": "愛",
    "zhuyin": "ㄞˋ",
    "searchWord": "愛心",
    "surrounding": [
      {
        "char": "仁",
        "pos": "before"
      },
      {
        "char": "親",
        "pos": "before"
      },
      {
        "char": "心",
        "pos": "after"
      },
      {
        "char": "情",
        "pos": "after"
      }
    ]
  },
  {
    "char": "情",
    "zhuyin": "ㄑㄧㄥˊ",
    "searchWord": "情感",
    "surrounding": [
      {
        "char": "友",
        "pos": "before"
      },
      {
        "char": "熱",
        "pos": "before"
      },
      {
        "char": "感",
        "pos": "after"
      },
      {
        "char": "操",
        "pos": "after"
      }
    ]
  },
  {
    "char": "信",
    "zhuyin": "ㄒㄧㄣˋ",
    "searchWord": "信任",
    "surrounding": [
      {
        "char": "相",
        "pos": "before"
      },
      {
        "char": "誠",
        "pos": "before"
      },
      {
        "char": "任",
        "pos": "after"
      },
      {
        "char": "念",
        "pos": "after"
      }
    ]
  },
  {
    "char": "義",
    "zhuyin": "ㄧˋ",
    "searchWord": "義務",
    "surrounding": [
      {
        "char": "正",
        "pos": "before"
      },
      {
        "char": "道",
        "pos": "before"
      },
      {
        "char": "務",
        "pos": "after"
      },
      {
        "char": "氣",
        "pos": "after"
      }
    ]
  },
  {
    "char": "和",
    "zhuyin": "ㄏㄜˊ",
    "searchWord": "和平",
    "surrounding": [
      {
        "char": "溫",
        "pos": "before"
      },
      {
        "char": "柔",
        "pos": "before"
      },
      {
        "char": "平",
        "pos": "after"
      },
      {
        "char": "諧",
        "pos": "after"
      }
    ]
  },
  {
    "char": "平",
    "zhuyin": "ㄆㄧㄥˊ",
    "searchWord": "平安",
    "surrounding": [
      {
        "char": "公",
        "pos": "before"
      },
      {
        "char": "水",
        "pos": "before"
      },
      {
        "char": "安",
        "pos": "after"
      },
      {
        "char": "靜",
        "pos": "after"
      }
    ]
  },
  {
    "char": "安",
    "zhuyin": "ㄢ",
    "searchWord": "安全",
    "surrounding": [
      {
        "char": "平",
        "pos": "before"
      },
      {
        "char": "定",
        "pos": "before"
      },
      {
        "char": "全",
        "pos": "after"
      },
      {
        "char": "穩",
        "pos": "after"
      }
    ]
  }
];

// ===== 🧩 一字千金：團結一詞 200 題經典題庫 =====
const CHARACTER_UNITED_WORDS_POOL = [
  {"id":1,"targetWord":"明月","chars":["明","月"],"components":["日","月","月"],"clue":"形容夜空中明亮的月亮"},
  {"id":2,"targetWord":"河海","chars":["河","海"],"components":["氵","可","氵","每"],"clue":"河流與大海的合稱"},
  {"id":3,"targetWord":"松樹","chars":["松","樹"],"components":["木","公","木","壴","寸"],"clue":"四季常青的樹木"},
  {"id":4,"targetWord":"休假","chars":["休","假"],"components":["亻","木","亻","夬"],"clue":"停止工作進行休息"},
  {"id":5,"targetWord":"晴朗","chars":["晴","朗"],"components":["日","青","月","良"],"clue":"天氣清明無雲"},
  {"id":6,"targetWord":"和諧","chars":["和","諧"],"components":["禾","口","言","皆"],"clue":"配合適當且協調"},
  {"id":7,"targetWord":"休養","chars":["休","養"],"components":["亻","木","羊","食"],"clue":"休息保養身體"},
  {"id":8,"targetWord":"語言","chars":["語","言"],"components":["言","吾","言"],"clue":"人類溝通表達的工具"},
  {"id":9,"targetWord":"思想","chars":["思","想"],"components":["田","心","木","目","心"],"clue":"大腦的思考與想法"},
  {"id":10,"targetWord":"知識","chars":["知","識"],"components":["矢","口","言","音","戈"],"clue":"透過學習獲得的學問"},
  {"id":11,"targetWord":"海洋","chars":["海","洋"],"components":["氵","每","氵","羊"],"clue":"廣闊的鹹水水域"},
  {"id":12,"targetWord":"快樂","chars":["快","樂"],"components":["忄","夬","白","木"],"clue":"心情愉快歡樂"},
  {"id":13,"targetWord":"清風","chars":["清","風"],"components":["氵","青","風"],"clue":"清涼舒爽的風"},
  {"id":14,"targetWord":"合作","chars":["合","作"],"components":["人","一","口","亻","乍"],"clue":"共同攜手完成工作"},
  {"id":15,"targetWord":"信件","chars":["信","件"],"components":["亻","言","亻","牛"],"clue":"郵寄傳遞的書信"},
  {"id":16,"targetWord":"教育","chars":["教","育"],"components":["孝","攵","亠","厶","月"],"clue":"傳授知識與培養品德"},
  {"id":17,"targetWord":"朋友","chars":["朋","友"],"components":["月","月","𠂇","又"],"clue":"互相交好知心的同伴"},
  {"id":18,"targetWord":"洗澡","chars":["洗","澡"],"components":["氵","先","氵","喿"],"clue":"用水清潔身體"},
  {"id":19,"targetWord":"冰冷","chars":["冰","冷"],"components":["冫","水","冫","令"],"clue":"溫度極低冰涼"},
  {"id":20,"targetWord":"熱情","chars":["熱","情"],"components":["執","灬","忄","青"],"clue":"待人親切且充滿活力"},
  {"id":21,"targetWord":"照明","chars":["照","明"],"components":["昭","灬","日","月"],"clue":"發出光芒照亮環境"},
  {"id":22,"targetWord":"光明","chars":["光","明"],"components":["光","日","月"],"clue":"光亮充滿希望"},
  {"id":23,"targetWord":"城牆","chars":["城","牆"],"components":["土","成","爿","嗇"],"clue":"古代用於防禦的高牆"},
  {"id":24,"targetWord":"玻璃","chars":["玻","璃"],"components":["王","皮","王","離"],"clue":"透明硬質的建築材料"},
  {"id":25,"targetWord":"玫瑰","chars":["玫","瑰"],"components":["王","攵","王","鬼"],"clue":"帶刺且美麗的花卉"},
  {"id":26,"targetWord":"理想","chars":["理","想"],"components":["王","里","木","目","心"],"clue":"對未來的抱負與憧憬"},
  {"id":27,"targetWord":"智慧","chars":["智","慧"],"components":["知","日","彗","心"],"clue":"聰明睿智與分析能力"},
  {"id":28,"targetWord":"運動","chars":["運","動"],"components":["軍","辶","重","力"],"clue":"鍛鍊身體的體育活動"},
  {"id":29,"targetWord":"健康","chars":["健","康"],"components":["亻","建","廣","隶"],"clue":"身體無病強壯"},
  {"id":30,"targetWord":"平安","chars":["平","安"],"components":["平","宀","女"],"clue":"平順安定無事故"},
  {"id":31,"targetWord":"吉祥","chars":["吉","祥"],"components":["士","口","礻","羊"],"clue":"幸運美好的徵兆"},
  {"id":32,"targetWord":"繁榮","chars":["繁","榮"],"components":["敏","糸","艹","木"],"clue":"蓬勃發展興旺"},
  {"id":33,"targetWord":"美麗","chars":["美","麗"],"components":["羊","大","麗"],"clue":"好看動人讓人讚賞"},
  {"id":34,"targetWord":"幸福","chars":["幸","福"],"components":["土","䒑","礻","一口田"],"clue":"生活甜美滿足"},
  {"id":35,"targetWord":"勇氣","chars":["勇","氣"],"components":["甬","力","气","米"],"clue":"不畏懼困難的膽量"},
  {"id":36,"targetWord":"禮貌","chars":["禮","貌"],"components":["礻","豐","豸","貌"],"clue":"文明有教養的言行"},
  {"id":37,"targetWord":"精神","chars":["精","神"],"components":["米","青","礻","申"],"clue":"人的神采與意識狀態"},
  {"id":38,"targetWord":"創造","chars":["創","造"],"components":["倉","刂","告","辶"],"clue":"發明或建立新事物"},
  {"id":39,"targetWord":"學習","chars":["學","習"],"components":["𦥯","子","羽","白"],"clue":"獲得知識技能的過程"},
  {"id":40,"targetWord":"探索","chars":["探","索"],"components":["扌","罙","𦦙","糸"],"clue":"尋找並探究未知"},
  {"id":41,"targetWord":"永恆","chars":["永","恆"],"components":["永","忄","亘"],"clue":"永遠長存不改變"},
  {"id":42,"targetWord":"溫暖","chars":["溫","暖"],"components":["氵","𥁕","日","爰"],"clue":"氣候暖和或內心感受親切"},
  {"id":43,"targetWord":"感動","chars":["感","動"],"components":["咸","心","重","力"],"clue":"內心受到觸動與震撼"},
  {"id":44,"targetWord":"希望","chars":["希","望"],"components":["巾","爻","亡","月","王"],"clue":"對未來的期待與祈望"},
  {"id":45,"targetWord":"陪伴","chars":["陪","伴"],"components":["阝","剖","亻","半"],"clue":"隨同相伴在身旁"},
  {"id":46,"targetWord":"珍惜","chars":["珍","惜"],"components":["王","㐱","忄","昔"],"clue":"愛惜珍重不浪費"},
  {"id":47,"targetWord":"堅持","chars":["堅","持"],"components":["臤","土","扌","寺"],"clue":"意志堅定持續到底"},
  {"id":48,"targetWord":"誠實","chars":["誠","實"],"components":["言","成","宀","貫"],"clue":"言行真誠不虛假"},
  {"id":49,"targetWord":"謙虛","chars":["謙","虛"],"components":["言","兼","虍","業"],"clue":"虛心不自誇"},
  {"id":50,"targetWord":"溫柔","chars":["溫","柔"],"components":["氵","𥁕","矛","木"],"clue":"態度柔和體貼"},
  {"id":51,"targetWord":"優雅","chars":["優","雅"],"components":["亻","憂","牙","隹"],"clue":"舉止優美大方"},
  {"id":52,"targetWord":"善良","chars":["善","良"],"components":["羊","𦍌","良"],"clue":"品質純正心地好"},
  {"id":53,"targetWord":"充實","chars":["充","實"],"components":["亠","允","宀","貫"],"clue":"內容豐富不空虛"},
  {"id":54,"targetWord":"燦爛","chars":["燦","爛"],"components":["火","粲","火","闌"],"clue":"光彩耀眼奪目"},
  {"id":55,"targetWord":"奇蹟","chars":["奇","蹟"],"components":["大","可","足","責"],"clue":"不可思議的神奇成就"},
  {"id":56,"targetWord":"團結","chars":["團","結"],"components":["囗","專","糸","吉"],"clue":"凝聚力量緊密合作"},
  {"id":57,"targetWord":"自由","chars":["自","由"],"components":["自","由"],"clue":"不受束縛隨心暢意"},
  {"id":58,"targetWord":"和平","chars":["和","平"],"components":["禾","口","平"],"clue":"安定沒有戰爭紛爭"},
  {"id":59,"targetWord":"信任","chars":["信","任"],"components":["亻","言","亻","壬"],"clue":"相信並倚重對方"},
  {"id":60,"targetWord":"分享","chars":["分","享"],"components":["八","刀","亠","子"],"clue":"將好東西分給其他人"},
  {"id":61,"targetWord":"成功","chars":["成","功"],"components":["成","工","力"],"clue":"達成預定的目標"},
  {"id":62,"targetWord":"精彩","chars":["精","彩"],"components":["米","青","采","彡"],"clue":"表現出色吸引人"},
  {"id":63,"targetWord":"奇妙","chars":["奇","妙"],"components":["大","可","女","少"],"clue":"新奇好玩不可思議"},
  {"id":64,"targetWord":"夢想","chars":["夢","想"],"components":["夕","林","木","目","心"],"clue":"心中的遠大理想"},
  {"id":65,"targetWord":"歡樂","chars":["歡","樂"],"components":["雚","欠","白","木"],"clue":"高興歡愉的氣氛"},
  {"id":66,"targetWord":"神秘","chars":["神","秘"],"components":["礻","申","禾","必"],"clue":"難以捉摸充滿好奇"},
  {"id":67,"targetWord":"壯觀","chars":["壯","觀"],"components":["爿","士","雚","見"],"clue":"場面雄偉景象宏大"},
  {"id":68,"targetWord":"榮耀","chars":["榮","耀"],"components":["艹","木","光","翟"],"clue":"光榮與尊貴的名譽"},
  {"id":69,"targetWord":"真誠","chars":["真","誠"],"components":["目","八","言","成"],"clue":"真心實意不作假"},
  {"id":70,"targetWord":"充沛","chars":["充","沛"],"components":["亠","允","氵","市"],"clue":"精力或資源非常充足"},
  {"id":71,"targetWord":"熱愛","chars":["熱","愛"],"components":["執","灬","爫","心","友"],"clue":"深切喜愛並投入"},
  {"id":72,"targetWord":"超越","chars":["超","越"],"components":["走","召","走","戉"],"clue":"勝過並打破原有限度"},
  {"id":73,"targetWord":"豐富","chars":["豐","富"],"components":["豐","宀","畐"],"clue":"充裕繁多不匱乏"},
  {"id":74,"targetWord":"堅強","chars":["堅","強"],"components":["臤","土","弓","厶","虫"],"clue":"堅韌剛強不怕打擊"},
  {"id":75,"targetWord":"熱烈","chars":["熱","烈"],"components":["執","灬","列","灬"],"clue":"氣氛興奮高昂"},
  {"id":76,"targetWord":"輝煌","chars":["輝","煌"],"components":["光","軍","火","皇"],"clue":"光彩耀眼成就非凡"},
  {"id":77,"targetWord":"溫馨","chars":["溫","馨"],"components":["氵","𥁕","殸","香"],"clue":"溫暖親切充滿愛意"},
  {"id":78,"targetWord":"美好","chars":["美","好"],"components":["羊","大","女","子"],"clue":"令人滿意讚嘆的事物"},
  {"id":79,"targetWord":"聰穎","chars":["聰","穎"],"components":["耳","囪","心","禾","頁"],"clue":"天資聰敏記憶力強"},
  {"id":80,"targetWord":"禮物","chars":["禮","物"],"components":["礻","豐","牛","勿"],"clue":"餽贈給他人的物品"},
  {"id":81,"targetWord":"歡喜","chars":["歡","喜"],"components":["雚","欠","壴","口"],"clue":"內心充滿歡樂喜悅"},
  {"id":82,"targetWord":"英雄","chars":["英","雄"],"components":["艹","央","隹","肱"],"clue":"本領超群令人敬佩的人"},
  {"id":83,"targetWord":"驚喜","chars":["驚","喜"],"components":["敬","馬","吉","壴"],"clue":"遇到意料之外的喜事"},
  {"id":84,"targetWord":"安寧","chars":["安","寧"],"components":["宀","女","宀","心","皿","丁"],"clue":"平靜安定沒有喧囂擾動"},
  {"id":85,"targetWord":"友情","chars":["友","情"],"components":["𠂇","又","忄","青"],"clue":"朋友之間深厚的感情"},
  {"id":86,"targetWord":"親情","chars":["親","情"],"components":["立","木","見","忄","青"],"clue":"家人親人之間的溫情"},
  {"id":87,"targetWord":"愛情","chars":["愛","情"],"components":["爫","心","友","忄","青"],"clue":"戀人之間摯愛的感情"},
  {"id":88,"targetWord":"勇士","chars":["勇","士"],"components":["甬","力","士"],"clue":"英勇大膽的戰士"},
  {"id":89,"targetWord":"勝利","chars":["勝","利"],"components":["月","券","禾","刂"],"clue":"在競賽或戰鬥中獲勝"},
  {"id":90,"targetWord":"耀眼","chars":["耀","眼"],"components":["光","翟","目","艮"],"clue":"光芒強烈奪目照人"},
  {"id":91,"targetWord":"森林","chars":["森","林"],"components":["木","木","木","木","木"],"clue":"樹木繁密的廣大區域"},
  {"id":92,"targetWord":"江湖","chars":["江","湖"],"components":["氵","工","氵","胡"],"clue":"江河與湖泊的統稱"},
  {"id":93,"targetWord":"山峰","chars":["山","峰"],"components":["山","山","夆"],"clue":"高聳山脈的頂峰"},
  {"id":94,"targetWord":"花園","chars":["花","園"],"components":["艹","化","囗","袁"],"clue":"種植花草樹木的園地"},
  {"id":95,"targetWord":"城市","chars":["城","市"],"components":["土","成","亠","巾"],"clue":"人口人口人口人口密集繁華區"},
  {"id":96,"targetWord":"國家","chars":["國","家"],"components":["囗","或","宀","豕"],"clue":"擁有領土與主權的政權"},
  {"id":97,"targetWord":"世界","chars":["世","界"],"components":["世","田","介"],"clue":"地球上所有的國家與人類"},
  {"id":98,"targetWord":"宇宙","chars":["宇","宙"],"components":["宀","于","宀","由"],"clue":"包含所有時間空間的天體"},
  {"id":99,"targetWord":"星星","chars":["星","星"],"components":["日","生","日","生"],"clue":"夜空中閃爍的天體"},
  {"id":100,"targetWord":"彩虹","chars":["彩","虹"],"components":["采","彡","虫","工"],"clue":"雨後天空中七彩的光弧"},
  {"id":101,"targetWord":"春天","chars":["春","天"],"components":["三","人","日","大","一"],"clue":"萬物復甦的季節"},
  {"id":102,"targetWord":"夏天","chars":["夏","天"],"components":["𢦡","夂","大","一"],"clue":"氣溫炎熱的季節"},
  {"id":103,"targetWord":"秋天","chars":["秋","天"],"components":["禾","火","大","一"],"clue":"楓紅落葉涼爽的季節"},
  {"id":104,"targetWord":"冬天","chars":["冬","天"],"components":["夂","冫","大","一"],"clue":"下雪飄霜寒冷的季節"},
  {"id":105,"targetWord":"太陽","chars":["太","陽"],"components":["大","丶","阝","昜"],"clue":"白日照亮地球的恆星"},
  {"id":106,"targetWord":"月亮","chars":["月","亮"],"components":["月","亠","口","冖","儿"],"clue":"夜空中圍繞地球的衛星"},
  {"id":107,"targetWord":"風雨","chars":["風","雨"],"components":["風","雨"],"clue":"颳風與下雨的天氣"},
  {"id":108,"targetWord":"雪花","chars":["雪","花"],"components":["雨","彐","艹","化"],"clue":"飄落的晶瑩冰雪"},
  {"id":109,"targetWord":"雲朵","chars":["雲","朵"],"components":["雨","云","几","木"],"clue":"天空中聚集的水氣"},
  {"id":110,"targetWord":"大海","chars":["大","海"],"components":["大","氵","每"],"clue":"浩瀚無邊的洋流"},
  {"id":111,"targetWord":"河流","chars":["河","流"],"components":["氵","可","氵","𠫓"],"clue":"奔流不息的水道"},
  {"id":112,"targetWord":"湖泊","chars":["湖","泊"],"components":["氵","胡","氵","白"],"clue":"內陸積水成池的水域"},
  {"id":113,"targetWord":"高山","chars":["高","山"],"components":["高","山"],"clue":"地勢高聳的山嶽"},
  {"id":114,"targetWord":"草原","chars":["草","原"],"components":["艹","早","厂","原"],"clue":"青草遍佈的平原"},
  {"id":115,"targetWord":"沙漠","chars":["沙","漠"],"components":["氵","少","氵","莫"],"clue":"乾旱充滿黃沙的大地"},
  {"id":116,"targetWord":"綠洲","chars":["綠","洲"],"components":["糸","彔","氵","州"],"clue":"沙漠中長有樹木水源的寶地"},
  {"id":117,"targetWord":"島嶼","chars":["島","嶼"],"components":["鳥","山","山","與"],"clue":"四面環海的陸地"},
  {"id":118,"targetWord":"天空","chars":["天","空"],"components":["一大","穴","工"],"clue":"頭頂上蔚藍的高空"},
  {"id":119,"targetWord":"大地","chars":["大","地"],"components":["大","土","乜"],"clue":"腳下廣袤無垠的陸地"},
  {"id":120,"targetWord":"微風","chars":["微","風"],"components":["彳","山","一","微","風"],"clue":"輕柔拂面的涼風"},
  {"id":121,"targetWord":"細雨","chars":["細","雨"],"components":["糸","田","雨"],"clue":"綿綿飄落的小雨"},
  {"id":122,"targetWord":"閃電","chars":["閃","電"],"components":["門","人","雨","電"],"clue":"夜空中畫過的強烈光芒"},
  {"id":123,"targetWord":"雷鳴","chars":["雷","鳴"],"components":["雨","田","口","鳥"],"clue":"天空傳來的隆隆巨響"},
  {"id":124,"targetWord":"晨光","chars":["晨","光"],"components":["日","辰","火","兀"],"clue":"清晨第一道暖光"},
  {"id":125,"targetWord":"夕陽","chars":["夕","陽"],"components":["夕","阝","昜"],"clue":"傍晚即將落下的太陽"},
  {"id":126,"targetWord":"晚霞","chars":["晚","霞"],"components":["日","免","雨","假"],"clue":"黃昏時天空絢麗彩雲"},
  {"id":127,"targetWord":"夜空","chars":["夜","空"],"components":["亠","夜","穴","工"],"clue":"漆黑寂靜的星空"},
  {"id":128,"targetWord":"露珠","chars":["露","珠"],"components":["雨","路","王","朱"],"clue":"清晨清澈透明的水滴"},
  {"id":129,"targetWord":"霜雪","chars":["霜","雪"],"components":["雨","相","雨","彐"],"clue":"寒冬結晶凝結之物"},
  {"id":130,"targetWord":"冰川","chars":["冰","川"],"components":["冫","水","川"],"clue":"極地巨大的移動冰體"},
  {"id":131,"targetWord":"溫泉","chars":["溫","泉"],"components":["氵","𥁕","白","水"],"clue":"地下自然噴出的熱水"},
  {"id":132,"targetWord":"瀑布","chars":["瀑","布"],"components":["氵","暴","巾"],"clue":"從懸崖飛瀉而下的水流"},
  {"id":133,"targetWord":"山谷","chars":["山","谷"],"components":["山","八","口"],"clue":"兩山之間的低窪地帶"},
  {"id":134,"targetWord":"懸崖","chars":["懸","崖"],"components":["縣","心","山","厓"],"clue":"陡峭近乎垂直的山壁"},
  {"id":135,"targetWord":"洞穴","chars":["洞","穴"],"components":["氵","同","宀","八"],"clue":"天然形成的山洞"},
  {"id":136,"targetWord":"叢林","chars":["叢","林"],"components":["業","丵","木","木"],"clue":"茂密叢生草木繁盛的熱帶林區"},
  {"id":137,"targetWord":"花海","chars":["花","海"],"components":["艹","化","氵","每"],"clue":"盛開如汪洋般的大片花田"},
  {"id":138,"targetWord":"楓葉","chars":["楓","葉"],"components":["木","風","艹","葉"],"clue":"秋天變紅的楓樹葉子"},
  {"id":139,"targetWord":"竹林","chars":["竹","林"],"components":["竹","木","木"],"clue":"高聳青翠的竹子林"},
  {"id":140,"targetWord":"稻田","chars":["稻","田"],"components":["禾","舀","田"],"clue":"種植金黃水稻的田地"},
  {"id":141,"targetWord":"果園","chars":["果","園"],"components":["田","木","囗","袁"],"clue":"結滿豐碩水果的園區"},
  {"id":142,"targetWord":"村莊","chars":["村","莊"],"components":["木","寸","艹","壯"],"clue":"寧靜古樸的小村落"},
  {"id":143,"targetWord":"小溪","chars":["溪","流"],"components":["氵","奚","氵","𠫓"],"clue":"山間清澈清涼的小溪流"},
  {"id":144,"targetWord":"海岸","chars":["海","岸"],"components":["氵","每","山","干"],"clue":"海洋與陸地交界的岸邊"},
  {"id":145,"targetWord":"港口","chars":["港","口"],"components":["氵","巷","口"],"clue":"船隻停泊靠岸的地方"},
  {"id":146,"targetWord":"燈塔","chars":["燈","塔"],"components":["火","登","土","荅"],"clue":"指引船隻方向的高塔"},
  {"id":147,"targetWord":"城堡","chars":["城","堡"],"components":["土","成","亻","保"],"clue":"童話般堅固雄偉的建築"},
  {"id":148,"targetWord":"宮殿","chars":["宮","殿"],"components":["宀","呂","殿"],"clue":"國王或帝王居住的華麗建築"},
  {"id":149,"targetWord":"神殿","chars":["神","殿"],"components":["礻","申","殿"],"clue":"供奉神祇莊嚴的神聖場所"},
  {"id":150,"targetWord":"樂園","chars":["樂","園"],"components":["白","木","幺","囗","袁"],"clue":"充滿歡聲笑語的遊樂園地"},
  {"id":151,"targetWord":"晨曦","chars":["晨","曦"],"components":["日","辰","日","羲"],"clue":"清晨太陽升起時的微光"},
  {"id":152,"targetWord":"朝陽","chars":["朝","陽"],"components":["十","日","月","阝","昜"],"clue":"早晨剛剛升起的太陽"},
  {"id":153,"targetWord":"暮色","chars":["暮","色"],"components":["艹","日","大","勹","巴"],"clue":"傍晚黃昏微暗的天色"},
  {"id":154,"targetWord":"晨霧","chars":["晨","霧"],"components":["日","辰","雨","務"],"clue":"清晨瀰漫在空中的水氣迷霧"},
  {"id":155,"targetWord":"晴空","chars":["晴","空"],"components":["日","青","穴","工"],"clue":"萬里無雲清朗的天空"},
  {"id":156,"targetWord":"碧海","chars":["碧","海"],"components":["珀","石","氵","每"],"clue":"翠綠碧藍浩瀚的大海"},
  {"id":157,"targetWord":"青山","chars":["青","山"],"components":["青","山"],"clue":"草木蒼翠鬱鬱蔥蔥的山嶺"},
  {"id":158,"targetWord":"綠葉","chars":["綠","葉"],"components":["糸","彔","艹","枼"],"clue":"樹木枝條上翠綠的葉片"},
  {"id":159,"targetWord":"紅花","chars":["紅","花"],"components":["糸","工","艹","化"],"clue":"鮮豔亮麗盛開的紅色花朵"},
  {"id":160,"targetWord":"白雲","chars":["白","雲"],"components":["白","雨","云"],"clue":"高空中飄浮潔白無瑕的雲朵"},
  {"id":161,"targetWord":"溪流","chars":["溪","流"],"components":["氵","奚","氵","𠫓"],"clue":"山澗蜿蜒奔流的清涼水流"},
  {"id":162,"targetWord":"泉水","chars":["泉","水"],"components":["白","水","水"],"clue":"地下自然湧出甘甜清澈的水"},
  {"id":163,"targetWord":"池塘","chars":["池","塘"],"components":["氵","也","土","唐"],"clue":"蓄積水流生長水草的低窪水池"},
  {"id":164,"targetWord":"沼澤","chars":["沼","澤"],"components":["氵","召","氵","睪"],"clue":"地勢低窪長期積水的泥濘濕地"},
  {"id":165,"targetWord":"巨石","chars":["巨","石"],"components":["巨","石"],"clue":"體積龐大堅固聳立的大石頭"},
  {"id":166,"targetWord":"岩壁","chars":["岩","壁"],"components":["山","石","土","辟"],"clue":"陡峭聳立堅硬的山石峭壁"},
  {"id":167,"targetWord":"泥土","chars":["泥","土"],"components":["氵","尼","土"],"clue":"富含有機質能滋養萬物的鬆軟土壤"},
  {"id":168,"targetWord":"沙灘","chars":["沙","灘"],"components":["氵","少","氵","難"],"clue":"海邊由細沙鋪積平緩的海岸陸地"},
  {"id":169,"targetWord":"海浪","chars":["海","浪"],"components":["氵","每","氵","良"],"clue":"海洋中隨風翻騰起伏的白色波濤"},
  {"id":170,"targetWord":"潮汐","chars":["潮","汐"],"components":["氵","朝","氵","夕"],"clue":"海水受到日月引力產生的週期漲落"},
  {"id":171,"targetWord":"繁星","chars":["繁","星"],"components":["敏","糸","日","生"],"clue":"滿天密密麻麻閃耀的無數星星"},
  {"id":172,"targetWord":"皓月","chars":["皓","月"],"components":["白","告","月"],"clue":"皎潔明亮清輝四灑的明月"},
  {"id":173,"targetWord":"寒風","chars":["寒","風"],"components":["宀","井","冫","風"],"clue":"刺骨寒冷呼嘯而過的冬天冷風"},
  {"id":174,"targetWord":"暖陽","chars":["暖","陽"],"components":["日","爰","阝","昜"],"clue":"冬日溫和溫暖照拂人心的陽光"},
  {"id":175,"targetWord":"涼風","chars":["涼","風"],"components":["氵","京","風"],"clue":"吹拂過來令人心曠神怡的清涼微風"},
  {"id":176,"targetWord":"春雨","chars":["春","雨"],"components":["三","人","日","雨"],"clue":"滋潤大地萬物生長細柔的春季雨水"},
  {"id":177,"targetWord":"秋霜","chars":["秋","霜"],"components":["禾","火","雨","相"],"clue":"深秋清晨在草木上凝結的白霜"},
  {"id":178,"targetWord":"冬雪","chars":["冬","雪"],"components":["夂","冫","雨","彐"],"clue":"隆冬時分從天空中紛紛飄落的白雪"},
  {"id":179,"targetWord":"松柏","chars":["松","柏"],"components":["木","公","木","白"],"clue":"四季常青耐寒挺拔的松樹與柏樹"},
  {"id":180,"targetWord":"楊柳","chars":["楊","柳"],"components":["木","昜","木","卯"],"clue":"河岸邊隨風輕柔搖曳擺動的綠柳"},
  {"id":181,"targetWord":"牡丹","chars":["牡","丹"],"components":["牛","土","丹"],"clue":"花朵雍容華貴端莊國色天香的名花"},
  {"id":182,"targetWord":"荷花","chars":["荷","花"],"components":["艹","何","艹","化"],"clue":"出淤泥而不染亭亭玉立的水生花卉"},
  {"id":183,"targetWord":"菊花","chars":["菊","花"],"components":["艹","匊","艹","化"],"clue":"傲霜盛開芳香四溢的秋季花朵"},
  {"id":184,"targetWord":"梅花","chars":["梅","花"],"components":["木","每","艹","化"],"clue":"凌寒獨自開堅毅高潔的初春名花"},
  {"id":185,"targetWord":"翠竹","chars":["翠","竹"],"components":["羽","卒","竹"],"clue":"枝葉青翠挺拔節節高升的竹子"},
  {"id":186,"targetWord":"稻穗","chars":["稻","穗"],"components":["禾","舀","禾","惠"],"clue":"秋收時沉甸甸金黃色成熟的水稻花穗"},
  {"id":187,"targetWord":"果實","chars":["果","實"],"components":["田","木","宀","貫"],"clue":"植物成熟結出甜美多汁的果子"},
  {"id":188,"targetWord":"原野","chars":["原","野"],"components":["厂","泉","里","予"],"clue":"廣大開闊一望無際的原野大地"},
  {"id":189,"targetWord":"平原","chars":["平","原"],"components":["干","厂","泉"],"clue":"地勢平坦開闊平緩的廣大幅員"},
  {"id":190,"targetWord":"盆地","chars":["盆","地"],"components":["分","皿","土","也"],"clue":"四周地勢高隆中間低平的地貌盆狀區域"},
  {"id":191,"targetWord":"峽谷","chars":["峽","谷"],"components":["山","夾","八","口"],"clue":"兩側山壁陡峭狹長險峻的深谷"},
  {"id":192,"targetWord":"丘陵","chars":["丘","陵"],"components":["丘","阝","夌"],"clue":"起伏平緩高低錯落起伏的矮山地帶"},
  {"id":193,"targetWord":"湖畔","chars":["湖","畔"],"components":["氵","胡","田","半"],"clue":"風景優美依山傍水的湖泊邊界"},
  {"id":194,"targetWord":"江畔","chars":["江","畔"],"components":["氵","工","田","半"],"clue":"奔騰江水兩旁綠意盎然的江邊"},
  {"id":195,"targetWord":"庭院","chars":["庭","院"],"components":["广","廷","阝","完"],"clue":"住家前方設有花草盆栽的悠閒院落"},
  {"id":196,"targetWord":"樓閣","chars":["樓","閣"],"components":["木","婁","門","各"],"clue":"古代高聳優美風景極佳的多層建築"},
  {"id":197,"targetWord":"書齋","chars":["書","齋"],"components":["聿","曰","齊"],"clue":"讀書作畫安靜典雅充滿書香的書房"},
  {"id":198,"targetWord":"畫廊","chars":["畫","廊"],"components":["聿","田","广","郎"],"clue":"陳列藝術名作與精美畫作的展覽長廊"},
  {"id":199,"targetWord":"琴房","chars":["琴","房"],"components":["王","王","今","戶","方"],"clue":"專門用來彈奏樂器練琴的高雅房間"},
  {"id":200,"targetWord":"樂章","chars":["樂","章"],"components":["白","木","幺","立","早"],"clue":"大型交響音樂或樂曲中的完整章節段落"}
];

if (typeof window !== 'undefined') {
  window.CHARACTER_TEST_POOL = CHARACTER_TEST_POOL;
  window.CHARACTER_CROSSWORD_POOL = CHARACTER_CROSSWORD_POOL;
  window.CHARACTER_UNITED_WORDS_POOL = CHARACTER_UNITED_WORDS_POOL;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CHARACTER_TEST_POOL,
    CHARACTER_CROSSWORD_POOL,
    CHARACTER_UNITED_WORDS_POOL
  };
}
