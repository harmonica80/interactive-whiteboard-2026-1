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
  Object.assign(app,{isAdmin:false,registeredStudents:{},getUserId:()=>local.get('user_id')||'old',getCurrentUserAvatar:()=>3,setCurrentUserAvatar(){},showNotification(title,message){this.notice={title,message}},loadClassRealNames:async()=>{},getTakenStudentNames:async()=>new Set(),closeStudentNameModal(){this.closed=true},setUserName(name){this.savedName=name}});
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
