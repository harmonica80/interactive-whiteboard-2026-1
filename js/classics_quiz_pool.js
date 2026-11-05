// 成語與佳句名言典故專注力選擇題題庫
// 每筆題目均提供：中讀網優先導讀連結、原典全文連結與延伸介紹連結。
(function (global) {
  const poetryRows = `
滿江紅·寫懷|岳飛|宋|八千里路雲和月，三十功名塵與土。
滿江紅·寫懷|岳飛|宋|莫等閒、白了少年頭，空悲切！
定風波·莫聽穿林打葉聲|蘇軾|宋|回首向來蕭瑟處，歸去，也無風雨也無晴。
水調歌頭·明月幾時有|蘇軾|宋|人有悲歡離合，月有陰晴圓缺，此事古難全。
江城子·乙卯正月二十日夜記夢|蘇軾|宋|十年生死兩茫茫，不思量，自難忘。
蝶戀花·佇倚危樓風細細|柳永|宋|衣帶漸寬終不悔，為伊消得人憔悴。
青玉案·元夕|辛棄疾|宋|眾裡尋他千百度。驀然回首，那人卻在，燈火闌珊處。
終南別業|王維|唐|行到水窮處，坐看雲起時。
和子由澠池懷舊|蘇軾|宋|人生到處知何似，應似飛鴻踏雪泥。
念奴嬌·赤壁懷古|蘇軾|宋|大江東去，浪淘盡，千古風流人物。
早發白帝城|李白|唐|兩岸猿聲啼不住，輕舟已過萬重山。
斷句|蘇麟|宋|近水樓台先得月，向陽花木易為春。
遊山西村|陸游|宋|山重水複疑無路，柳暗花明又一村。
題西林壁|蘇軾|宋|不識廬山真面目，只緣身在此山中。
摸魚兒·雁丘詞|元好問|金|問世間，情為何物，直教生死相許？
無題·昨夜星辰昨夜風|李商隱|唐|身無彩鳳雙飛翼，心有靈犀一點通。
離思五首·其四|元稹|唐|曾經滄海難為水，除卻巫山不是雲。
鵲橋仙·纖雲弄巧|秦觀|宋|兩情若是久長時，又豈在朝朝暮暮。
相思|王維|唐|紅豆生南國，春來發幾枝。願君多采擷，此物最相思。
無題·相見時難別亦難|李商隱|唐|春蠶到死絲方盡，蠟炬成灰淚始乾。
月夜憶舍弟|杜甫|唐|露從今夜白，月是故鄉明。
登樂遊原|李商隱|唐|夕陽無限好，只是近黃昏。
虞美人·春花秋月何時了|李煜|南唐|春花秋月何時了？往事知多少。
虞美人·春花秋月何時了|李煜|南唐|雕欄玉砌應猶在，只是朱顏改。
九月九日憶山東兄弟|王維|唐|獨在異鄉為異客，每逢佳節倍思親。
代悲白頭翁|劉希夷|唐|年年歲歲花相似，歲歲年年人不同。
天淨沙·秋思|馬致遠|元|枯藤老樹昏鴉，小橋流水人家，古道西風瘦馬。
黃鶴樓|崔顥|唐|日暮鄉關何處是？煙波江上使人愁。
滕王閣序|王勃|唐|落霞與孤鶩齊飛，秋水共長天一色。
楓橋夜泊|張繼|唐|姑蘇城外寒山寺，夜半鐘聲到客船。
琵琶行|白居易|唐|同是天涯淪落人，相逢何必曾相識！
送杜少府之任蜀州|王勃|唐|海內存知己，天涯若比鄰。
白雪歌送武判官歸京|岑參|唐|忽如一夜春風來，千樹萬樹梨花開。
登鸛雀樓|王之渙|唐|欲窮千里目，更上一層樓。
賦得古原草送別|白居易|唐|野火燒不盡，春風吹又生。
靜夜思|李白|唐|舉頭望明月，低頭思故鄉。
遊子吟|孟郊|唐|慈母手中線，遊子身上衣。
憫農二首·其二|李紳|唐|誰知盤中飱，粒粒皆辛苦。
黃鶴樓|崔顥|唐|晴川歷歷漢陽樹，芳草萋萋鸚鵡洲。
水調歌頭·明月幾時有|蘇軾|宋|但願人長久，千里共嬋娟。
相見歡·無言獨上西樓|李煜|南唐|剪不斷，理還亂，是離愁。
臨江仙·滾滾長江東逝水|楊慎|明|滾滾長江東逝水，浪花淘盡英雄。是非成敗轉頭空。青山依舊在，幾度夕陽紅。
中庸|子思|先秦|好學近乎知，力行近乎仁，知恥近乎勇。
中庸|子思|先秦|凡事豫則立，不豫則廢。
中庸|子思|先秦|擇善固執。
易經·乾卦|周文王|先秦|上九：亢龍有悔。
易經·乾卦|周文王|先秦|初九：潛龍勿用。
易經·乾卦|周文王|先秦|九五：飛龍在天，利見大人。`.trim().split('\n').map((line) => {
    const [title, author, dynasty, quote] = line.split('|')
    return { title, author, dynasty, quote, label: `${author}－〈${title}〉` }
  })

  const idiomRows = `
完璧歸趙|藺相如|《戰國策·趙策》|藺相如奉命把和氏璧完整帶回趙國。
負荊請罪|廉頗|《史記·廉頗藺相如列傳》|廉頗背著荊條向藺相如請罪。
紙上談兵|趙括|《史記·廉頗藺相如列傳》|趙括只會談論兵法，實戰卻失敗。
圍魏救趙|孫臏|《史記·孫子吳起列傳》|孫臏攻魏都以解趙國之圍。
臥薪嘗膽|勾踐|《史記·越王勾踐世家》|勾踐忍辱復國，以苦勵志。
一鼓作氣|曹劌|《左傳·莊公十年》|曹劌主張趁士氣最盛時進攻。
退避三舍|晉文公|《左傳·僖公二十三年》|晉文公為守信而退兵三舍。
東山再起|謝安|《晉書·謝安傳》|謝安隱居東山後再度出仕。
指鹿為馬|趙高|《史記·秦始皇本紀》|趙高以鹿稱馬試探群臣。
破釜沉舟|項羽|《史記·項羽本紀》|項羽破鍋沉船以示決一死戰。
背水一戰|韓信|《史記·淮陰侯列傳》|韓信背靠河水布陣，逼軍死戰。
四面楚歌|項羽|《史記·項羽本紀》|項羽被楚歌包圍，軍心潰散。
約法三章|劉邦|《史記·高祖本紀》|劉邦入關後與百姓約定三條法令。
暗度陳倉|韓信|《史記·高祖本紀》|漢軍明修棧道，暗中出兵陳倉。
鴻門宴|項羽、劉邦|《史記·項羽本紀》|項羽宴請劉邦，范增圖謀除之未果。
樂不思蜀|劉禪|《三國志·蜀書·後主傳》|劉禪在魏國不思念故國蜀漢。
三顧茅廬|劉備|《三國志·蜀書·諸葛亮傳》|劉備三次拜訪諸葛亮。
草船借箭|諸葛亮|《三國演義》|諸葛亮借濃霧草船取得箭矢。
望梅止渴|曹操|《世說新語·假譎》|曹操以梅子故事鼓舞士兵前進。
鞠躬盡瘁|諸葛亮|《後出師表》|諸葛亮為蜀漢盡力至死。
刮目相看|呂蒙|《三國志·吳書·呂蒙傳》|呂蒙勤學後使魯肅另眼相看。
胸有成竹|文與可|《文與可畫篔簹谷偃竹記》|文與可畫竹前已成竹於胸。
入木三分|王羲之|《書斷》|王羲之書寫的筆力滲入木板三分。
東施效顰|東施|《莊子·天運》|東施模仿西施皺眉反而更難看。
邯鄲學步|壽陵少年|《莊子·秋水》|少年學邯鄲步法，最後連原步法也忘了。
井底之蛙|井蛙|《莊子·秋水》|井蛙受限井口，見識狹小。
守株待兔|宋人農夫|《韓非子·五蠹》|農夫守著樹樁等待兔子再撞死。
刻舟求劍|楚人|《呂氏春秋·察今》|楚人在船上刻記號尋找掉入水中的劍。
掩耳盜鈴|盜鈴者|《呂氏春秋·自知》|偷鈴者摀住耳朵，以為別人聽不見。
畫蛇添足|楚國舍人|《戰國策·齊策》|畫蛇比賽時有人多畫腳而失酒。
亡羊補牢|牧羊人|《戰國策·楚策》|羊失後修補羊圈，仍不算晚。
杯弓蛇影|樂廣|《晉書·樂廣傳》|客人把杯中弓影誤認為蛇而生病。
狐假虎威|狐狸|《戰國策·楚策》|狐狸借老虎威勢嚇退百獸。
買櫝還珠|鄭人|《韓非子·外儲說左上》|買者只要華麗盒子，退還珍珠。
南轅北轍|魏王|《戰國策·魏策》|想到南方卻駕車往北走。
破鏡重圓|徐德言|《本事詩·情感》|徐德言與公主以破鏡為記，終能重逢。
盲人摸象|眾盲人|《大般涅槃經》|眾盲各摸象一部而各執一見。
毛遂自薦|毛遂|《史記·平原君虞卿列傳》|毛遂主動請纓隨平原君出使。
程門立雪|楊時、游酢|《宋史·楊時傳》|二人冒雪在程頤門外等候請益。
鑿壁偷光|匡衡|《西京雜記》|匡衡鑿牆借鄰家燈光讀書。
懸梁刺股|孫敬、蘇秦|《太平御覽》|二人以懸髮與刺股自勵讀書。
高山流水|伯牙、子期|《列子·湯問》|伯牙琴音由鍾子期聽懂。
伯樂相馬|伯樂|《韓非子·說林上》|伯樂善於辨識千里馬。
班門弄斧|魯班|《王氏之言》|在魯班門前賣弄斧技，比喻不自量力。
螳臂當車|螳螂|《莊子·人間世》|螳螂舉臂想阻擋車輪。
濫竽充數|南郭先生|《韓非子·內儲說上》|南郭先生混在樂隊中湊數。
世外桃源|陶淵明|《桃花源記》|漁人發現與世隔絕的理想村落。
不恥下問|孔圉|《論語·公冶長》|孔圉不以向不如自己者請教為恥。
出類拔萃|孔子|《孟子·公孫丑上》|孟子稱孔子出於同類而高於群眾。
一鳴驚人|楚莊王|《韓非子·喻老》|楚莊王以三年不鳴後一鳴驚人自比。
亢龍有悔|周文王|《易經·乾卦》|龍飛得過高而有悔恨，比喻居高位而不知進退。
潛龍勿用|周文王|《易經·乾卦》|龍潛伏在深水不施展作為，比喻隱忍蓄勢不可妄動。
飛龍在天|周文王|《易經·乾卦》|巨龍騰飛在天空，比喻帝王在位或事業達巔峰。
雞鳴狗盜|孟嘗君|《史記·孟嘗君列傳》|孟嘗君食客學狗盜裘、學雞鳴開城門而脫險。
狡兔三窟|馮諼|《戰國策·齊策》|馮諼為孟嘗君營造三處安身立命之所。
圖窮匕見|荊軻|《史記·刺客列傳》|荊軻獻燕國地圖至卷末露出匕首行刺秦王。
奇貨可居|呂不韋|《史記·呂不韋列傳》|呂不韋認為子楚如同罕見貨物值得囤積投資。
怒髮衝冠|藺相如|《史記·廉頗藺相如列傳》|藺相如持璧倚柱怒斥秦王，頭髮直豎頂起帽子。
刎頸之交|廉頗、藺相如|《史記·廉頗藺相如列傳》|廉頗與藺相如誓同生死，成為刎頸之交。
價值連城|和氏璧|《史記·廉頗藺相如列傳》|秦昭王願以十五座城池換取趙國和氏璧。
運籌帷幄|張良|《史記·高祖本紀》|張良在帷幄中謀劃策略，決勝於千里之外。
胯下之辱|韓信|《史記·淮陰侯列傳》|韓信年輕時忍辱從淮陰屠夫胯下爬過。
一飯千金|韓信|《史記·淮陰侯列傳》|韓信封王後以千金報答漂母當年贈飯之恩。
鳥盡弓藏|范蠡|《史記·越王勾踐世家》|范蠡功成身退，警示文種飛鳥射盡則良弓被藏。
兔死狗烹|韓信|《史記·淮陰侯列傳》|野兔捕完獵狗遭烹殺，比喻功臣遭殺害。
塞翁失馬|塞翁|《淮南子·人間訓》|塞翁走失馬匹反而帶來良駒，禍福難料。
杞人憂天|杞國人|《列子·天瑞》|杞人憂慮天地崩塌而寢食難安。
愚公移山|愚公|《列子·湯問》|愚公立志移平門前太行、王屋二山。
夸父逐日|夸父|《山海經·海外北經》|夸父追趕太陽渴死，手杖化為桃林。
精衛填海|精衛|《山海經·北山經》|炎帝幼女溺死化為精衛鳥，銜石填東海。
女媧補天|女媧|《淮南子·覽冥訓》|女媧煉五色石以補蒼天，斷鰲足以立四極。
畫龍點睛|張僧繇|《歷代名畫記》|張僧繇為寺廟壁畫龍點睛，巨龍破壁飛騰。
洛陽紙貴|左思|《晉書·左思傳》|左思寫成《三都賦》，眾人抄寫使洛陽紙價大漲。
投筆從戎|班超|《後漢書·班超傳》|班超擲筆嘆息，立志到西域立功報國。
聞雞起舞|祖逖、劉琨|《晉書·祖逖傳》|祖逖與劉琨半夜聽見雞啼便拔劍練武。
枕戈待旦|祖逖|《晉書·劉琨傳》|枕著兵器等待天明，形容時刻戒備殺敵報國。
煮豆燃萁|曹植|《世說新語·文學》|曹植作七步詩，感嘆兄弟骨肉相殘。
七步成詩|曹植|《世說新語·文學》|曹丕命曹植七步之內作成一詩，否則處死。
望塵莫及|杜延年|《莊子·田子方》|望著前行者揚起的塵土而自嘆趕不上。
蕭規曹隨|曹參|《史記·曹相國世家》|曹參繼任相國完全遵循蕭何制定的規章制度。
請君入甕|周興、來俊臣|《資治通鑑·唐紀》|來俊臣以炭火大甕逼供，請酷吏周興入甕。
熟能生巧|賣油翁|《歸田錄》|賣油翁注油穿過銅錢孔而不沾濕銅錢。
鐵杵磨針|李白|《方輿勝覽》|老婦磨鐵杵做針，啟發李白功到自然成。
風聲鶴唳|苻堅|《晉書·謝玄傳》|前秦軍敗退，聽見風聲鶴叫都誤以為晉軍追來。
草木皆兵|苻堅|《晉書·謝玄傳》|苻堅在壽陽望八公山草木，皆以為晉軍。
韋編三絕|孔子|《史記·孔子世家》|孔子晚年喜讀《易經》，穿簡皮繩斷了三次。
投鼠忌器|賈誼|《漢書·賈誼傳》|想擲物打老鼠又怕砸壞器皿，比喻做事有所顧忌。
司空見慣|劉禹錫|《本事詩·情感》|劉禹錫赴宴見名妓，稱司空李紳對此早已習慣。
江郎才盡|江淹|《南史·江淹傳》|江淹夢見郭璞索還五色筆，從此詩文平庸。
口蜜腹劍|李林甫|《資治通鑑·唐紀》|李林甫口中說好話，內心卻陰險陷害他人。
撲朔迷離|花木蘭|《木蘭詩》|雄兔腳撲朔雌兔眼迷離，比喻事理錯綜難辨。
狗尾續貂|趙王司馬倫|《晉書·趙王倫傳》|官職封賞浮濫，貂尾不足而以狗尾湊數。
樑上君子|陳寔|《後漢書·陳寔傳》|陳寔稱躲在屋樑上的盜賊為君子並贈絹教化。
董狐直筆|董狐|《左傳·宣公二年》|董狐如實記載趙盾弒君，被讚為古之良史。
瓜田李下|古樂府|《君子行》|瓜田不納履，李下不整冠，比喻避嫌避非。
得隴望蜀|漢光武帝劉秀|《後漢書·光武帝紀》|既平定隴右又想進取西蜀，比喻貪得無厭。
越俎代庖|許由|《莊子·逍遙遊》|廚師不做飯，祭祀者不能越過廚具去代庖。
莊周夢蝶|莊子|《莊子·齊物論》|莊子夢見化為蝴蝶，醒後不知莊周夢蝶或蝶夢莊周。
螳螂捕蟬|少吏|《說苑·正諫》|螳螂窺蟬而不知黃雀在後，比喻貪小利招大患。
拋磚引玉|常建、趙嘏|《唐摭言》|常建題詩於靈巖寺，引出趙嘏絕妙佳作。
騎虎難下|溫嶠|《晉書·溫嶠傳》|騎在老虎背上下不來，比喻身處險境難以退縮。
唇亡齒寒|宮之奇|《左傳·僖公五年》|宮之奇諫虞公唇亡齒寒，虞虢兩國相互依存。
假道伐虢|晉獻公、荀息|《左傳·僖公五年》|晉國借虞國通道滅虢，回軍順道滅虞。
鵬程萬里|大鵬|《莊子·逍遙遊》|大鵬展翅九萬里飛往南海，比喻前程遠大。
與虎謀皮|周人|《太平御覽》|向老虎商量要其皮革，比喻所商量之事危及對方。
鄭人買履|鄭人|《韓非子·外儲說左上》|鄭人寧可相信尺碼量度，也不相信自己的腳。
聲東擊西|班超|《通典·兵六》|聲稱攻打東邊，實際攻擊西邊。
隔岸觀火|曹操|《三十六計》|在對岸看著敵方起火，坐待敵軍自相殘殺。
笑裡藏刀|李義府|《新唐書·李義府傳》|李義府外表溫和含笑，內心陰險毒辣害人。
李代桃僵|古樂府|《雞鳴》|李樹代替桃樹受蟲蛀而枯死，比喻以此代彼。
打草驚蛇|王魯|《南部新書》|縣令王魯見訴狀批示汝雖打草，吾已驚蛇。
調虎離山|荀攸|《三十六計》|誘使老虎離開深山，比喻誘使敵軍脫離險要根據地。
欲擒故縱|諸葛亮|《三十六計》|諸葛亮七擒七縱孟獲，使南中各部心悅誠服。
走為上策|檀道濟|《南齊書·王敬則傳》|面對強敵無計可施時，撤退為最佳計策。
空城計|諸葛亮|《三國演義》|諸葛亮開西城門撫琴退去司馬懿大軍。
苦肉計|黃蓋|《三國演義》|黃蓋受周瑜責罰肉刑，行詐降以火燒赤壁。
釜底抽薪|伍子胥|《三十六計》|從鍋底抽去柴火，比喻從根本上徹底解決問題。
金蟬脫殼|諸葛亮|《三十六計》|蟬脫下外殼留於原地，比喻巧布疑陣脫身。
瞞天過海|薛仁貴|《三十六計》|薛仁貴巧設巨帳瞞騙唐太宗登船渡海。
美人計|西施、范蠡|《三十六計》|越王以西施獻吳王夫差，瓦解吳國鬥志。
連環計|龐統、王允|《三國演義》|龐統巧獻連環鎖船計，促成赤壁火攻。
反間計|周瑜|《三國演義》|周瑜借蔣幹盜書計除蔡瑁、張允水軍將領。
金石為開|李廣|《史記·李將軍列傳》|李廣誤把石頭認作猛虎射箭，箭頭深沒入石。
助紂為虐|商紂王|《史記·留侯世家》|協助暴君行惡，比喻助長壞人為非作歹。
盲人瞎馬|顧愷之|《世說新語·排調》|盲人騎著瞎馬夜半臨深池，形容處境危險至極。
鹿死誰手|石勒|《晉書·石勒載記下》|逐鹿中原不知鹿死誰手，比喻天下政權誰屬。
圖南之志|大鵬|《莊子·逍遙遊》|大鵬振翅向南溟飛去，比喻志向高遠廣大。
白面書生|沈慶之|《宋書·沈慶之傳》|指只知書本缺乏實戰經驗的年輕讀書人。
沆瀣一氣|崔瀣、崔沆|《唐摭言·海敘不遇》|崔沆錄取崔瀣，時人戲稱座主門生臭味相投。
州官放火|田登|《老學庵筆記》|田登忌諱名諱，只許州官放火不許百姓點燈。
斷章取義|叔向|《左傳·襄公二十八年》|截取他人詩文中的一段而不顧前後全文。
投桃報李|周代詩人|《詩經·大雅·抑》|投我以桃，報之以李，比喻人與人禮尚往來。
步步生蓮|潘玉兒|《南史·齊本紀下》|齊廢帝蕭寶卷令潘妃行走於金箔蓮花上。
朝三暮四|狙公|《莊子·齊物論》|養猴老人給橡實早三晚四騙猴，比喻變更手段而實質不變。
買空賣空|市井商賈|《官場現形記》|自身無本錢而憑空倒賣獲利，比喻投機取巧。
削足適履|淮南王劉安|《淮南子·說林訓》|把腳削小以適應狹鞋，比喻盲目生搬硬套。
庖丁解牛|庖丁|《莊子·養生主》|廚工庖丁熟知牛體結構，運刀十九年刃如新發。
揠苗助長|宋人農夫|《孟子·公孫丑上》|農夫嫌禾苗長得慢拔高它們，結果禾苗枯死。
緣木求魚|孟子|《孟子·梁惠王上》|爬到樹上去尋找游魚，比喻方向錯誤徒勞無功。
五十步笑百步|戰國逃兵|《孟子·梁惠王上》|逃跑五十步者笑話逃跑百步者膽怯，本質相同。
嗟來之食|黔敖|《禮記·檀弓下》|黔敖吆喝飢者前來用餐，飢者寧死不受侮辱。
水落石出|蘇軾|《後赤壁賦》|江水退落石壁顯露，比喻事情真相大白。
出神入化|戴叔倫|《懷素上人草書歌》|神妙達到極致境界，形容技藝高超超凡入聖。
涸轍之鮒|莊子|《莊子·外物》|車轍深溝中的鮒魚急待斗水救命，比喻處境窘急。
一字千金|呂不韋|《史記·呂不韋列傳》|呂不韋懸賞能增減《呂氏春秋》一字者千金。
乘風破浪|宗愨|《宋書·宗愨傳》|宗愨立志乘長風破萬里浪，比喻志向宏大無畏。
東窗事發|秦檜|《西湖遊覽志餘》|秦檜謀害岳飛於東窗下策劃，死後陰謀敗露。
金玉其外|劉基|《賣柑者言》|外表光鮮如金玉，內在卻敗壞如破絮。
吳下阿蒙|呂蒙|《三國志·吳書·呂蒙傳》|魯肅讚呂蒙學問大進，不再是當年的吳下阿蒙。
指腹為婚|賈逵|《魏書·賈逵傳》|雙方父母在胎兒出生前便指著腹部訂立婚約。`.trim().split('\n').map((line) => {
    const [idiom, person, origin, story] = line.split('|')
    return { idiom, person, origin, story, label: `${person}－${idiom}` }
  })

  function hash(text) {
    let value = 0
    for (let i = 0; i < text.length; i++) value = ((value << 5) - value) + text.charCodeAt(i) | 0
    return Math.abs(value)
  }

  function stableOptions(correct, candidates, seed) {
    const uniqueCandidates = [...new Set(candidates)]
    const seen = new Set([correct])
    const distractors = uniqueCandidates
      .filter((item) => item !== correct && !seen.has(item))
      .sort((a, b) => (hash(`${seed}:${a}`) - hash(`${seed}:${b}`)))
      .slice(0, 3)
    const options = [correct, ...distractors]
    return options.sort((a, b) => hash(`${seed}:option:${a}`) - hash(`${seed}:option:${b}`))
  }

  function linksFor(keyword, original, readcDirectUrl) {
    const readcSearch = `https://readc.info/?s=${encodeURIComponent(keyword)}`
    return {
      readcKeyword: keyword,
      readcUrl: readcDirectUrl || readcSearch,
      fullTextUrl: `https://zh.wikisource.org/w/index.php?search=${encodeURIComponent(original)}&title=Special%3ASearch`,
      introUrl: `https://zh.wikipedia.org/w/index.php?search=${encodeURIComponent(keyword)}&title=Special%3ASearch`
    }
  }

  const poetryLabels = [...new Set(poetryRows.map((item) => item.label))]
  const poetryAuthors = [...new Set(poetryRows.map((item) => item.author))]
  const idiomPeople = [...new Set(idiomRows.map((item) => item.person))]
  const personPromptOverrides = {
    '東施效顰': '有人盲目模仿西施皺眉，結果反而更難看；典故主角是？',
    '毛遂自薦': '平原君的一名食客主動請纓，隨使團出使；典故主角是？',
    '伯樂相馬': '古人善於辨識千里馬，後用以比喻善於發掘人才者；典故主角是？',
    '亢龍有悔': '「亢龍有悔」出自《易經·乾卦》，傳統記載《易經》六十四卦卦爻辭作者是？',
    '潛龍勿用': '「潛龍勿用」出自《易經·乾卦》，傳統記載《易經》六十四卦卦爻辭作者是？',
    '飛龍在天': '「飛龍在天」出自《易經·乾卦》，傳統記載《易經》六十四卦卦爻辭作者是？'
  }
  const idiomOrigins = [...new Set(idiomRows.map((item) => item.origin))]
  const pool = []

  poetryRows.forEach((item, index) => {
    const workSearchTitle = item.title.split('·')[0]
    const reference = linksFor(workSearchTitle, workSearchTitle, item.title === '將進酒' ? 'https://readc.info/poem/drink/' : '')
    const sourceOptions = stableOptions(item.label, poetryLabels, `poetry-source-${index}`)
    pool.push({
      id: `poetry-source-${index + 1}`,
      category: '名句典故',
      prompt: `「${item.quote}」是出自？`,
      options: sourceOptions,
      correctOption: item.label,
      explanation: `這句出自${item.dynasty}代${item.author}〈${item.title}〉。`,
      work: `${item.author}〈${item.title}〉`,
      quote: item.quote,
      reference
    })
    pool.push({
      id: `poetry-author-${index + 1}`,
      category: '名句典故',
      prompt: `「${item.quote}」的作者是？`,
      options: stableOptions(item.author, poetryAuthors, `poetry-author-${index}`),
      correctOption: item.author,
      explanation: `「${item.quote}」出自${item.dynasty}代${item.author}〈${item.title}〉。`,
      work: `${item.author}〈${item.title}〉`,
      quote: item.quote,
      reference
    })
  })

  idiomRows.forEach((item, index) => {
    const reference = linksFor(item.idiom, item.origin)
    pool.push({
      id: `idiom-person-${index + 1}`,
      category: '成語典故',
      prompt: personPromptOverrides[item.idiom] || `成語「${item.idiom}」的典故主角是？`,
      options: stableOptions(item.person, idiomPeople, `idiom-person-${index}`),
      correctOption: item.person,
      explanation: `${item.story}典故常見出處為${item.origin}。`,
      work: `${item.idiom}典故`,
      quote: item.story,
      reference
    })
    pool.push({
      id: `idiom-origin-${index + 1}`,
      category: '成語典故',
      prompt: `成語「${item.idiom}」最常見的典故出處是？`,
      options: stableOptions(item.origin, idiomOrigins, `idiom-origin-${index}`),
      correctOption: item.origin,
      explanation: `${item.idiom}：${item.story}`, 
      work: `${item.idiom}典故`,
      quote: item.story,
      reference
    })
  })

  const quizPool = pool
  global.CLASSICS_QUIZ_POOL = Object.freeze(quizPool)
  global.createClassicsQuizQuestions = function createClassicsQuizQuestions(count, customPool = null) {
    const activePool = (customPool && Array.isArray(customPool) && customPool.length > 0)
      ? customPool
      : ((global.focusQB && typeof global.focusQB.getPool === 'function') ? global.focusQB.getPool('classicsQuiz') : quizPool);
    
    // Normalize custom items so they have correctOption and reference
    const normalized = activePool.map((item, idx) => {
      const workSearchTitle = (item.title || item.work || '').split('·')[0];
      const correctOption = item.correctOption || item.answer;
      const options = item.options || [correctOption, '李白', '杜甫', '蘇軾'];
      const reference = item.reference || {
        readcKeyword: workSearchTitle,
        readcUrl: item.links?.sinoreading || `https://www.google.com/search?q=${encodeURIComponent(workSearchTitle + ' 中讀網')}`,
        fullTextUrl: item.links?.wikisource || `https://zh.wikisource.org/wiki/${encodeURIComponent(workSearchTitle)}`,
        introUrl: item.links?.wikipedia || `https://zh.wikipedia.org/wiki/${encodeURIComponent(workSearchTitle)}`
      };
      return {
        id: item.id || `custom-classics-${idx + 1}`,
        category: item.category || '成語與佳句名言典故',
        prompt: item.prompt || `「${item.quote || item.title}」的作者／出處是？`,
        options,
        correctOption,
        explanation: item.explanation || item.fullPoem || `正解為：${correctOption}`,
        work: item.work || item.title || '',
        quote: item.quote || item.title || '',
        reference
      };
    });

    const amount = Math.max(1, Math.min(normalized.length, Number(count) || 5));
    const shuffled = [...normalized];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, amount);
  }
})(window)
