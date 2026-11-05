import fs from 'fs';
import path from 'path';

console.log('--- 驗證測驗與互動音效設定功能 (Sound Settings) ---');

const projectRoot = process.cwd();

// 1. 檢查 audio/ 中的 8 個 MP3 檔案
const expectedAudioFiles = [
  'correct_1.mp3', 'correct_2.mp3', 'correct_3.mp3', 'correct_4.mp3',
  'wrong_1.mp3', 'wrong_2.mp3', 'wrong_3.mp3', 'wrong_4.mp3'
];

for (const file of expectedAudioFiles) {
  const fullPath = path.join(projectRoot, 'audio', file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`缺少音效檔案: audio/${file}`);
  }
  const stat = fs.statSync(fullPath);
  if (stat.size < 1000) {
    throw new Error(`音效檔案過小或損壞: audio/${file} (${stat.size} bytes)`);
  }
  console.log(`✅ 音效檔案正常: audio/${file} (${stat.size} bytes)`);
}

// 2. 檢查圖示
const svgPath = path.join(projectRoot, 'images', 'admin_icons', 'class_sound.svg');
if (!fs.existsSync(svgPath)) {
  throw new Error('缺少圖示檔案: images/admin_icons/class_sound.svg');
}
const svgContent = fs.readFileSync(svgPath, 'utf8');
if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
  throw new Error('class_sound.svg 不是有效 SVG');
}
console.log('✅ 後台圖示正常: images/admin_icons/class_sound.svg');

// 3. 檢查 index.html
const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

if (!indexHtml.includes('5 個功能')) {
  throw new Error('index.html 班級管理徽章未更新為 5 個功能');
}
console.log('✅ index.html 班級管理徽章顯示「5 個功能」');

if (!indexHtml.includes("openAdminFeature('classSound')")) {
  throw new Error('index.html 缺少 openAdminFeature(\'classSound\')');
}
console.log('✅ index.html 包含 classSound 功能卡片點擊觸發');

if (!indexHtml.includes('<option value="classSound">D. 測驗與互動音效設定</option>')) {
  throw new Error('index.html 快捷切換選單缺少 classSound');
}
console.log('✅ index.html 快捷切換選單包含「D. 測驗與互動音效設定」');

if (!indexHtml.includes('id="adminSoundSettingsSection"')) {
  throw new Error('index.html 缺少 adminSoundSettingsSection 區塊');
}
console.log('✅ index.html 包含「#adminSoundSettingsSection」工作區');

const requiredElements = [
  'adminCorrectSoundRadio',
  'adminWrongSoundRadio',
  'adminSoundVolumeRange',
  'adminSoundVolumeLabel',
  'badgeCurrentCorrectSound',
  'badgeCurrentWrongSound',
  'soundCurrentClassBadge',
  'btnSaveSoundSettings'
];
for (const el of requiredElements) {
  if (!indexHtml.includes(el)) {
    throw new Error(`index.html 缺少元素或屬性: ${el}`);
  }
}
console.log('✅ index.html 音效設定所有控制元件完整齊全');

// 4. 檢查 js/app.js
const appJs = fs.readFileSync(path.join(projectRoot, 'js', 'app.js'), 'utf8');

if (!appJs.includes('classSound: {') || !appJs.includes('adminSoundSettingsSection')) {
  throw new Error('js/app.js openAdminFeature 缺少 classSound 設定');
}
console.log('✅ js/app.js openAdminFeature 包含 classSound');

const requiredMethods = [
  'initSoundSettingsListener',
  'updateSoundSettingsUI',
  'onSoundRadioChange',
  'onSoundVolumeChange',
  'playAudioFile',
  'playSynthSound',
  'previewSound',
  'previewCurrentSelectedSounds',
  'saveSoundSettings',
  'resetSoundSettingsToDefault'
];
for (const m of requiredMethods) {
  if (!appJs.includes(m)) {
    throw new Error(`js/app.js 缺少方法: ${m}`);
  }
}
console.log('✅ js/app.js 所有音效管理核心方法完整實作');

// 5. 檢查 js/video_quiz.js
const videoQuizJs = fs.readFileSync(path.join(projectRoot, 'js', 'video_quiz.js'), 'utf8');
if (!videoQuizJs.includes("window.app.playFocusSound(isCorrect ? 'correct' : 'wrong')")) {
  throw new Error('js/video_quiz.js 缺少 playFocusSound 回饋呼叫');
}
console.log('✅ js/video_quiz.js 答題判定整合自訂音效回饋');

console.log('\n🎉 所有測驗與互動音效設定功能驗證全數通過！');
