import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const end = source.indexOf('\n}\n') + 3;
const App = new Function('return ' + source.slice(source.indexOf('class App {'), end))();
function fixture() {
  const data = {}, writes = [], reads = [], local = new Map(), fields = {};
  for (const id of ['studentNumberRow','studentNumberInput','inputStudentModalName','studentRealNameRow','studentRealNameInput','studentNameModalError','studentRosterLookupStatus','allowStudentNicknameEdit','allowStudentRealNameEdit']) fields[id] = {value:'', style:{}, focus(){}};
  globalThis.document = {getElementById:id=>fields[id] || null};
  globalThis.window = {currentClassCode:'CLASS',boardStorage:{local:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v)}}};
  let next = 0, failWrite = false;
  const get = path => path.split('/').filter(Boolean).reduce((o,k)=>o?.[k],data) ?? null;
  const put = (path,v) => { const parts=path.split('/').filter(Boolean); let node=data; for(const part of parts.slice(0,-1)) node=node[part] ||= {}; node[parts.at(-1)]=v; };
  const ref = (path='') => ({child:k=>ref([path,k].filter(Boolean).join('/')),push:()=>({key:'new'+(++next)}),once:async()=>{reads.push(path);return {val:()=>get(path),exists:()=>get(path)!==null}},set:async v=>{if(failWrite)throw Error('離線');put(path,v)},update:async updates=>{if(failWrite)throw Error('離線');writes.push({path,updates});for(const [k,v] of Object.entries(updates))put([path,k].filter(Boolean).join('/'),v)}});
  globalThis.db = {ref};
  const app=Object.create(App.prototype);
  Object.assign(app,{isAdmin:false,registeredStudents:{},getUserId:()=>local.get('user_id')||'old',getCurrentUserAvatar:()=>3,setCurrentUserAvatar(){},showNotification(title,message){this.notice={title,message}},loadClassRealNames:async()=>{},chooseStudentRosterImportMode:async()=> 'append',refreshAdminStudentsList:async()=>{},getCurrentUserName:()=> '老師',getTakenStudentNames:async()=>new Set(),closeStudentNameModal(){this.closed=true},setUserName(name){this.savedName=name}});
  return {app,fields,data,put,get,local,reads,writes,fail:()=>{failWrite=true}};
}
test('CSV 支援 BOM、前導零、引號與換行，拒絕重複及缺漏',()=>{
  const {app}=fixture();
  const rows=app.parseStudentRosterCsv('\uFEFF座號(或學號),真實姓名(或備註)\r\n01,"王小明,班長"\r\nS002,"陳同學\n備註"\r\n');
  assert.equal(rows[0].studentNumber,'01');assert.equal(rows[0].label,'王小明,班長');assert.equal(rows[1].label,'陳同學\n備註');
  for(const csv of ['座號,真實姓名\n01,甲\n０１,乙','座號,真實姓名\n01,','座號,真實姓名\n01,"甲','姓名,備註\n甲,乙'])assert.throws(()=>app.parseStudentRosterCsv(csv));
});
test('匯入建立待登入名冊，再次匯入保留 UID、點數與歷程',async()=>{
 const f=fixture();f.app.isAdmin=true;
 const key=f.app.studentRosterKey('01');f.put('student_roster/'+key,{uid:'u1',studentNumber:'01',label:'甲'});f.put('quiz/students/u1',{name:'小明',points:22,pointsLog:{a:1},lastLoginAt:123});
 const input={files:[{size:40,text:async()=> '座號,真實姓名\n01,王小明\n02,林小華'}],value:'file'};
 await f.app.importStudentRosterCsv(input);
 assert.equal(f.get('quiz/students/u1/points'),22);assert.deepEqual(f.get('quiz/students/u1/pointsLog'),{a:1});assert.equal(f.get('quiz/students/u1/name'),'小明');assert.equal(f.get('quiz/students/u1/lastLoginAt'),123);
 assert.equal(f.get('quiz/students/new1/rosterPending'),true);assert.equal(f.get('quiz/students/new1/lastLoginAt'),null);assert.equal(f.get('quiz/profileSettings/rosterEnabled'),true);assert.equal(f.get('student_real_names/u1'),'王小明');assert.equal(input.value,'');
});
test('不完整 CSV 整批拒絕且學生不能匯入或修改設定',async()=>{
 const f=fixture();const input={files:[{size:40,text:async()=> '座號,真實姓名\n01,王小明\n01,林小華'}],value:'file'};
 f.app.isAdmin=true;await f.app.importStudentRosterCsv(input);assert.equal(f.writes.length,0);assert.equal(f.app.notice.title,'匯入失敗');
 f.app.isAdmin=false;await f.app.importStudentRosterCsv(input);await f.app.saveStudentProfileSettings({id:'allowStudentNicknameEdit',checked:false});assert.equal(f.writes.length,0);
});
function roster(f,settings={}) {
 f.app.studentProfileSettings={rosterEnabled:true,...settings};const key=f.app.studentRosterKey('01');
 f.put('student_roster/'+key,{uid:'u1',studentNumber:'01',label:'王小明'});f.put('quiz/students/u1',{name:'原暱稱',studentNumber:'01',points:9,avatar:2});f.put('student_real_names/u1','王小明');f.fields.studentNumberInput.value='01';f.fields.inputStudentModalName.value='新暱稱';
}
test('座號登入承接同一 UID，鎖定姓名與真實姓名並保留點數',async()=>{
 const f=fixture();roster(f,{allowNicknameEdit:false,allowRealNameEdit:false});f.fields.studentRealNameInput.value='偽造修改';
 await f.app.saveRosterStudentLogin();assert.equal(f.local.get('user_id'),'u1');assert.equal(f.get('quiz/students/u1/name'),'原暱稱');assert.equal(f.get('student_real_names/u1'),'王小明');assert.equal(f.get('quiz/students/u1/points'),9);assert.equal(f.app.closed,true);assert.equal(f.fields.inputStudentModalName.readOnly,true);
 assert(!f.reads.includes('student_roster'));assert(!f.reads.includes('student_real_names'));
});
test('允許修改時可更新暱稱與真實姓名',async()=>{
 const f=fixture();roster(f);await f.app.lookupStudentRoster();f.fields.studentRealNameInput.value='王大明';await f.app.saveRosterStudentLogin();assert.equal(f.get('quiz/students/u1/name'),'新暱稱');assert.equal(f.get('student_real_names/u1'),'王大明');
});
test('查無座號不建立帳號，寫入失敗不切換本機 UID',async()=>{
 const f=fixture();roster(f);f.fields.studentNumberInput.value='99';await f.app.saveRosterStudentLogin();assert.equal(f.writes.length,0);assert.equal(f.local.get('user_id'),undefined);
 f.fields.studentNumberInput.value='01';f.fail();await assert.rejects(()=>f.app.saveRosterStudentLogin());assert.equal(f.local.get('user_id'),undefined);
});
test('普通非匯入學生的真實姓名禁止修改時以雲端為準',async()=>{
 const f=fixture();f.app.classRequiresRealName=true;f.app.studentProfileSettings={allowRealNameEdit:false};f.put('student_real_names/old','原姓名');f.fields.studentRealNameInput.value='新姓名';assert.equal(await f.app.saveRequiredRealName('old'),true);assert.equal(f.get('student_real_names/old'),'原姓名');
});
test('非名冊班級保留原本登入流程，設定讀取失敗不送出',async()=>{
 const f=fixture();let called=0;f.app.loadStudentProfileSettings=async()=>{f.app.studentProfileSettings={}};f.app.saveStudentNameWithoutRoster=async()=>called++;
 await f.app.saveStudentNameFromModal();assert.equal(called,1);f.app.loadStudentProfileSettings=async()=>{throw Error('連線失敗')};await f.app.saveStudentNameFromModal();assert.equal(called,1);assert.equal(f.app._savingRosterLogin,false);
});
test('帳號整併會更新座號對應，拒絕整併不同座號',async()=>{
 const f=fixture();f.app.isAdmin=true;roster(f);const updates=await f.app.getRosterMergeUpdates('existing',['u1']);assert.equal(updates['student_roster/'+f.app.studentRosterKey('01')+'/uid'],'existing');assert.equal(updates['quiz/students/existing/studentNumber'],'01');assert.equal(updates['student_real_names/existing'],'王小明');
 f.put('student_roster/'+f.app.studentRosterKey('02'),{uid:'u2',studentNumber:'02',label:'乙'});await assert.rejects(()=>f.app.getRosterMergeUpdates('u2',['u1']));
});
test('教師儲存設定失敗會恢復原核選狀態',async()=>{
 const f=fixture();f.app.isAdmin=true;const field={id:'allowStudentNicknameEdit',checked:false};f.fail();await f.app.saveStudentProfileSettings(field);assert.equal(field.checked,true);assert.equal(field.disabled,false);assert.equal(f.app.notice.title,'儲存失敗');
});
test('覆蓋清除學生與參與歷程，保留教師教材及題庫',async()=>{
 const f=fixture();f.app.isAdmin=true;f.app.chooseStudentRosterImportMode=async()=> 'replace';
 f.put('quiz/students/s1',{name:'甲',points:88});f.put('quiz/students/old',{name:'老師',points:10});f.put('student_real_names/s1','甲');f.put('student_roster/oldkey',{uid:'s1'});
 f.put('questions/studentQ',{userId:'s1',text:'學生提問'});f.put('questions/teacherQ',{userId:'old',text:'老師題目',comments:{c1:{userId:'s1',text:'答覆'}},likes:{s1:true}});
 f.put('images/studentImg',{userId:'s1',url:'image'});f.put('images/teacherImg',{userId:'old',url:'teacher image'});
 f.put('quiz/answers/a1',{userId:'s1'});f.put('quiz/history/h1',{title:'題庫'});f.put('presentation/slides/slide1',{image:'教材'});f.put('presentation/submissions/slide1/s1',{answers:['作答']});
 f.put('quiz/wordCloud/history/h1',{title:'保留題目',savedSubmissions:{s1:{word:'學生詞彙'}},savedWords:[{word:'學生詞彙'}],totalSubmissions:1});
 f.put('settings/system',{theme:'pink'});f.put('student_reaction_counts/s1',{count:9});
 await f.app.importStudentRosterCsv({files:[{size:20,text:async()=> '座號,真實姓名\n01,王小明'}],value:'file'});
 assert.equal(f.get('quiz/students/s1'),null);assert.equal(f.get('quiz/students/old'),null);assert.equal(f.get('student_real_names/s1'),null);assert.equal(f.get('student_roster/oldkey'),null);
 assert.equal(f.get('quiz/students/new1/rosterPending'),true);assert.equal(f.get('quiz/answers'),null);assert.equal(f.get('presentation/submissions'),null);assert.equal(f.get('questions/studentQ'),null);assert.equal(f.get('images/studentImg'),null);
 assert.equal(f.get('questions/teacherQ/text'),'老師題目');assert.equal(f.get('questions/teacherQ/comments'),null);assert.equal(f.get('images/teacherImg/url'),'teacher image');assert.equal(f.get('quiz/history/h1/title'),'題庫');assert.equal(f.get('presentation/slides/slide1/image'),'教材');assert.equal(f.get('settings/system/theme'),'pink');
 assert.equal(f.get('quiz/wordCloud/history/h1/savedSubmissions'),null);assert.equal(f.get('quiz/wordCloud/history/h1/title'),'保留題目');assert(f.get('quiz/rosterResetAt'));
 // 所有清理與新名冊同一批寫入，沒有父子路徑衝突。
 assert.equal(f.writes.length,1);const keys=Object.keys(f.writes[0].updates);assert(!keys.some(a=>keys.some(b=>a!==b&&b.startsWith(a+'/'))));
});
test('取消匯入不讀取或更動現有名單',async()=>{
 const f=fixture();f.app.isAdmin=true;f.app.chooseStudentRosterImportMode=async()=>null;f.put('quiz/students/u1',{points:10});const input={files:[{size:20,text:async()=> '座號,真實姓名\n01,王小明'}],value:'file'};await f.app.importStudentRosterCsv(input);assert.equal(f.reads.length,0);assert.equal(f.writes.length,0);assert.equal(f.get('quiz/students/u1/points'),10);assert.equal(f.app._importingRoster,false);assert.equal(input.value,'');
});
test('覆蓋寫入失敗時保留原名冊與歷程，不先清空',async()=>{
 const f=fixture();f.app.isAdmin=true;f.app.chooseStudentRosterImportMode=async()=> 'replace';f.put('quiz/students/u1',{points:10});f.put('quiz/answers/a1',{answer:'A'});f.fail();await f.app.importStudentRosterCsv({files:[{size:20,text:async()=> '座號,真實姓名\n01,王小明'}],value:'file'});assert.equal(f.get('quiz/students/u1/points'),10);assert.equal(f.get('quiz/answers/a1/answer'),'A');assert.equal(f.app.notice.title,'匯入失敗');
});
test('名單外加入的預設與教師設定儲存',async()=>{
 const f=fixture();assert.equal(f.app.allowsOutsideStudentRoster(),true);f.app.studentProfileSettings={rosterEnabled:true};assert.equal(f.app.allowsOutsideStudentRoster(),false);f.app.isAdmin=true;await f.app.saveStudentProfileSettings({id:'allowOutsideRoster',checked:true});assert.equal(f.get('quiz/profileSettings/allowOutsideRoster'),true);assert.equal(f.app.allowsOutsideStudentRoster(),true);
});
test('關閉名單外加入會拒絕新姓名，既有姓名可以通過',async()=>{
 const f=fixture();f.app.studentProfileSettings={allowOutsideRoster:false};f.fields.inputStudentModalName.value='新同學';assert.equal(await f.app.validateStudentRosterAdmission(),false);assert.equal(f.writes.length,0);f.app.registeredStudents={u1:{name:'王小明'}};f.fields.inputStudentModalName.value=' 王小明 ';assert.equal(await f.app.validateStudentRosterAdmission(),true);assert.equal(f.fields.inputStudentModalName.value,'王小明');
});
test('開放名單外加入時可留空座號；既有名冊姓名自動對應座號',async()=>{
 const f=fixture();f.app.studentProfileSettings={rosterEnabled:true,allowOutsideRoster:true};f.fields.inputStudentModalName.value='新同學';assert.equal(await f.app.validateStudentRosterAdmission(),true);assert.equal(f.fields.studentNumberInput.value,'');f.app.registeredStudents={u1:{name:'小明',studentNumber:'01'}};f.fields.inputStudentModalName.value='小明';assert.equal(await f.app.validateStudentRosterAdmission(),true);assert.equal(f.fields.studentNumberInput.value,'01');
});
test('多位同名學生必須用座號識別，輸入姓名不會任意選取帳號',async()=>{
 const f=fixture();f.app.studentProfileSettings={rosterEnabled:true,allowOutsideRoster:true};f.app.registeredStudents={a:{name:'小明',studentNumber:'01'},b:{name:'小明',studentNumber:'02'}};f.fields.inputStudentModalName.value='小明';assert.equal(await f.app.validateStudentRosterAdmission(),false);assert.equal(f.local.get('user_id'),undefined);f.fields.studentNumberInput.value='02';assert.equal(await f.app.validateStudentRosterAdmission(),true);
});
test('CSV 選填暱稱與重複項目比對，重新匯入同座號除外',()=>{
 const f=fixture();const rows=f.app.parseStudentRosterCsv('座號,真實姓名,姓名或暱稱（選填）\n01,甲,同名\n02,乙,同名\n03,丙,獨特');assert.equal(rows[0].nickname,'同名');assert.deepEqual(f.app.findStudentRosterDuplicates(rows,{},{}).map(d=>d.index),[0,1]);const only=[rows[2]];assert.equal(f.app.findStudentRosterDuplicates(only,{old:{name:'獨特'}},{}).length,1);assert.equal(f.app.findStudentRosterDuplicates(only,{old:{name:'獨特',studentNumber:'03'}},{[only[0].key]:{uid:'old',label:'丙'}}).length,0);
});
test('教師勾選的重複項目才會匯入，同名核准只對指定名稱生效',async()=>{
 const f=fixture();f.app.isAdmin=true;f.put('quiz/students/old',{name:'小明',points:12});let conflict=[];f.app.chooseStudentRosterDuplicates=async(rows,students,roster)=>{conflict=f.app.findStudentRosterDuplicates(rows,students,roster);return rows.filter((row,i)=>i!==0).map(row=>({...row,approvedDuplicate:true}))};await f.app.importStudentRosterCsv({files:[{size:20,text:async()=> '座號,真實姓名,姓名或暱稱\n01,甲,小明\n02,乙,小明'}],value:'file'});assert.equal(conflict.length,2);assert.equal(f.get('student_roster/'+f.app.studentRosterKey('01')),null);assert.equal(f.get('quiz/students/new1/name'),'小明');assert.equal(f.get('quiz/students/new1/approvedDuplicateName'),'小明');assert.equal(f.get('quiz/students/old/points'),12);
});
test('全部重複項目未勾選時，覆蓋模式仍不會清除舊名單',async()=>{
 const f=fixture();f.app.isAdmin=true;f.app.chooseStudentRosterImportMode=async()=> 'replace';f.app.chooseStudentRosterDuplicates=async()=>[];f.put('quiz/students/old',{points:10});await f.app.importStudentRosterCsv({files:[{size:20,text:async()=> '座號,真實姓名\n01,甲'}],value:'file'});assert.equal(f.get('quiz/students/old/points'),10);assert.equal(f.writes.length,0);
});
test('實際送出會重讀名單外設定並擋下未登記者',async()=>{
 const f=fixture();f.put('quiz/profileSettings',{allowOutsideRoster:false});f.fields.inputStudentModalName.value='新同學';await f.app.saveStudentNameFromModal();assert.equal(f.app.savedName,undefined);assert.equal(f.writes.length,0);assert(f.fields.studentNameModalError.textContent.includes('只允許名單內'));
});
test('同名核准僅允許老師核選的名稱，不可任意改成其他同學姓名',async()=>{
 const f=fixture();roster(f);f.put('quiz/students/u1/approvedDuplicateName','核准同名');f.fields.inputStudentModalName.value='另一位同學';f.app.getTakenStudentNames=async()=>new Set(['另一位同學','核准同名']);await f.app.saveRosterStudentLogin();assert.equal(f.writes.length,0);f.fields.inputStudentModalName.value='核准同名';await f.app.saveRosterStudentLogin();assert.equal(f.get('quiz/students/u1/name'),'核准同名');
});
test('關閉名單外加入仍允許既有同學依姓名修改權限更名',async()=>{
 const f=fixture();f.app.studentProfileSettings={allowOutsideRoster:false,allowNicknameEdit:true};f.app._studentOwnProfile={name:'原暱稱'};f.app.registeredStudents={old:{name:'原暱稱'}};f.fields.inputStudentModalName.value='新暱稱';assert.equal(await f.app.validateStudentRosterAdmission(),true);
});
test('老師預先匯入的暱稱在關閉修改時，首次登入也不能變更',async()=>{
 const f=fixture();f.app.studentProfileSettings={rosterEnabled:true,allowNicknameEdit:false};f.app.syncStudentProfileFields({name:'老師指定名',studentNumber:'01',rosterPending:true,nicknamePreset:true},'王小明');assert.equal(f.fields.inputStudentModalName.readOnly,true);assert.equal(f.fields.inputStudentModalName.value,'老師指定名');
});
