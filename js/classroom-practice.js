(() => {
  const key = 'classroom_practice_presets_v1';
  const reactionKey = 'classroom_reaction_presets_v1';
  const initialPresets = [1,2,3,5,10,20,30].map(n=>({name:n+' 分鐘',seconds:n*60}));
  const animations = {hourglass:'images/timer/hourglass.gif',clock:'images/timer/clock.gif',candle:'images/timer/candle.gif'};
  const allowed = () => Boolean(window.app && window.app.isAdmin);
  const store = () => window.boardStorage.local;
  const read = name => { try {
    const raw=store().getItem(name); let items=raw ? JSON.parse(raw) : (name===key ? initialPresets.map(v=>({...v})) : []);
    if(name===key && raw && !store().getItem('classroom_timer_defaults_added_v1')) {
      items=[...items,...initialPresets.filter(p=>!items.some(item=>item.seconds===p.seconds))];
      store().setItem(key,JSON.stringify(items));store().setItem('classroom_timer_defaults_added_v1','1');
    }
    return items;
  } catch (_) { return []; } };
  const write = (name, data) => { try { store().setItem(name, JSON.stringify(data)); return true; } catch (_) { alert('無法儲存，請檢查瀏覽器儲存空間。'); return false; } };
  let end = 0, remaining = 0, interval = null, lastSecond = null, audio = null, pip = null;
  const $ = id => document.getElementById(id);
  function display(seconds) { seconds = Math.max(0, seconds); return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
  function beep(final = false) {
    if (!audio) return;
    try { const osc = audio.createOscillator(), gain = audio.createGain(); osc.type = 'sine'; osc.frequency.value = final ? 880 : 660; gain.gain.setValueAtTime(0.08, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + (final ? 0.5 : 0.12)); osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime + (final ? 0.5 : 0.12)); } catch (_) {}
  }
  function update() {
    if (!allowed()) { stop(); remaining = 0; if ($('practiceTimerFloating')) $('practiceTimerFloating').hidden = true; if (pip && !pip.closed) pip.close(); if ($('practiceTimerModal')?.open) $('practiceTimerModal').close(); return; }
    const seconds = end ? Math.max(0, Math.ceil((end - Date.now()) / 1000)) : remaining;
    const text = display(seconds); if ($('practiceTimerDisplay')) $('practiceTimerDisplay').textContent = text;
    if ($('practiceTimerFloatingTime')) $('practiceTimerFloatingTime').textContent = text;
    if (pip && !pip.closed) { const t = pip.document.getElementById('pipTime'); if (t) t.textContent = text; }
    if (end && seconds !== lastSecond) { if (seconds <= 10) beep(seconds === 0); lastSecond = seconds; }
    if (end && seconds === 0) { end = 0; remaining = 0; clearInterval(interval); interval = null; if ($('practiceTimerState')) $('practiceTimerState').textContent = '時間到'; }
  }
  function stop() { clearInterval(interval); interval = null; end = 0; }
  function syncPresets() {
    const select = $('practiceTimerPresets'); if (!select) return;
    select.replaceChildren(new Option('選擇常用時間', ''));
    read(key).forEach((entry, i) => select.add(new Option(`${entry.name}（${display(entry.seconds)}）`, String(i))));
  }
  const timer = {
    open() { if (!allowed()) return; syncPresets(); try { timer.setAnimation(store().getItem('classroom_timer_animation') || 'none'); } catch (_) {} const dialog=$('practiceTimerModal'); if (!dialog.open) dialog.showModal(); update(); },
    setAnimation(value) {
      if (!allowed()) return; const path=animations[value]; const img=$('practiceTimerAnimationImage'); if(img){img.hidden=!path;if(path)img.src=path;}
      const select=$('practiceTimerAnimation');if(select)select.value=path?value:'none';
      try { store().setItem('classroom_timer_animation',path?value:'none'); } catch (_) {}
      if(pip && !pip.closed){const image=pip.document.getElementById('pipAnimation');if(image){image.hidden=!path;if(path)image.src=new URL(path,location.href).href;}}
    },
    start() {
      if (!allowed()) return; const m = Number($('practiceTimerMinutes').value), s = Number($('practiceTimerSeconds').value);
      if (!Number.isInteger(m) || !Number.isInteger(s) || m < 0 || m > 180 || s < 0 || s > 59 || m * 60 + s === 0) { alert('請輸入有效時間：0 至 180 分鐘、0 至 59 秒，且總時間大於 0。'); return; }
      try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch (_) {}
      stop(); remaining = m * 60 + s; end = Date.now() + remaining * 1000; lastSecond = null;
      $('practiceTimerState').textContent = '計時中'; $('practiceTimerFloating').hidden = false; update(); interval = setInterval(update, 250);
    },
    pause() { if (!allowed() || !end) return; remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000)); stop(); $('practiceTimerState').textContent = '已暫停'; update(); },
    resume() { if (!allowed() || end || !remaining) return; if (audio) audio.resume(); end = Date.now() + remaining * 1000; lastSecond = null; $('practiceTimerState').textContent = '計時中'; update(); interval = setInterval(update, 250); },
    reset() { if (!allowed()) return; stop(); remaining = 0; lastSecond = null; $('practiceTimerState').textContent = '尚未開始'; update(); },
    save() { if (!allowed()) return; const m = Number($('practiceTimerMinutes').value), s = Number($('practiceTimerSeconds').value), name = $('practiceTimerName').value.trim(); if (!name || !Number.isInteger(m) || !Number.isInteger(s) || m < 0 || m > 180 || s < 0 || s > 59 || !(m * 60 + s)) { alert('請輸入名稱與有效的時間。'); return; } const items = read(key); const idx = items.findIndex(x => x.name === name); if (idx >= 0) items[idx] = {name, seconds:m * 60 + s}; else items.push({name, seconds:m * 60 + s}); if (write(key, items)) syncPresets(); },
    select() { if (!allowed()) return; const item = read(key)[Number($('practiceTimerPresets').value)]; if (!item || $('practiceTimerPresets').value === '') return; $('practiceTimerName').value = item.name; $('practiceTimerMinutes').value = Math.floor(item.seconds / 60); $('practiceTimerSeconds').value = item.seconds % 60; },
    remove() { if (!allowed()) return; const value = $('practiceTimerPresets').value; if (value === '') return; const items = read(key); if (!confirm(`刪除常用時間「${items[Number(value)].name}」？`)) return; items.splice(Number(value), 1); if (write(key, items)) syncPresets(); },
    async popout() {
      if (!allowed()) return;
      if (!window.documentPictureInPicture) { alert('此瀏覽器不支援獨立置頂視窗；請使用 Chrome 或 Edge，或使用頁面上的浮動計時器。'); return; }
      try {
        pip = await window.documentPictureInPicture.requestWindow({width: 340, height: 390});
        const d = pip.document; d.title = '課堂計時器'; const style = d.createElement('style');
        const c = getComputedStyle(document.documentElement); for (const name of ['--bg-card','--bg-input','--text-primary','--accent-color','--border-color']) d.documentElement.style.setProperty(name, c.getPropertyValue(name));
        style.textContent = 'body{margin:0;display:grid;place-items:center;height:100vh;background:var(--bg-card);color:var(--text-primary);font-family:system-ui;text-align:center}strong{font-size:58px;font-variant-numeric:tabular-nums;color:var(--accent-color)}p{font-size:16px;margin:4px}img{width:80px;height:80px;object-fit:contain}img[hidden]{display:none}.controls{display:flex;justify-content:center;gap:5px;flex-wrap:wrap}.controls button{margin:4px 0}button{display:block;margin:8px auto 0;padding:8px 12px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-input);color:var(--text-primary);font:600 14px system-ui;cursor:pointer}'; d.head.appendChild(style);
        const box=d.createElement('div'), label=d.createElement('p'), value=d.createElement('strong'), settings=d.createElement('button'), picture=d.createElement('img'), controls=d.createElement('div'); label.textContent='⏱️ 課堂計時器'; value.id='pipTime'; picture.id='pipAnimation';picture.alt='計時動畫';picture.hidden=true; controls.className='controls';
        for(const [text,title,method] of [['▶','開始','start'],['⏸','暫停','pause'],['⏵','繼續','resume'],['↺','重設','reset']]){const btn=d.createElement('button');btn.type='button';btn.textContent=text;btn.title=title;btn.setAttribute('aria-label',title);btn.addEventListener('click',()=>timer[method]());controls.appendChild(btn);}
        settings.type='button'; settings.textContent='開啟計時器設定'; settings.addEventListener('click',()=>{ if (!allowed()) return; window.focus(); timer.open(); }); box.append(label,picture,value,controls,settings); d.body.appendChild(box);timer.setAnimation($('practiceTimerAnimation')?.value||'none'); update();
      } catch (_) { alert('無法開啟置頂視窗，請確認瀏覽器允許畫中畫視窗。'); }
    }
  };
  const reactions = {
    refresh() { const select=$('savedReactionSelect'); if (!select) return; select.replaceChildren(new Option('選擇已儲存情境','')); read(reactionKey).forEach((item,i)=>select.add(new Option(item.name,String(i)))); },
    save() { if (!allowed()) return; const name=$('savedReactionName').value.trim(), items=window.app._editingCustomReactions; if (!name || !Array.isArray(items) || items.length < 2) { alert('請輸入情境名稱，並設定至少 2 個互動按鈕。'); return; } const list=read(reactionKey), idx=list.findIndex(x=>x.name===name), item={name,items:JSON.parse(JSON.stringify(items)),rate:window.app.getPresetMaxReactionsPerSec('custom')}; if(idx<0)list.push(item);else list[idx]=item; if(write(reactionKey,list))this.refresh(); },
    apply() { if (!allowed()) return; const val=$('savedReactionSelect').value, item=read(reactionKey)[Number(val)]; if(val==='' || !item)return; const app=window.app; app._editingCustomReactions=JSON.parse(JSON.stringify(item.items)); app.reactionSettings.customItems=JSON.parse(JSON.stringify(item.items)); app.reactionSettings.activePreset='custom'; app.reactionSettings.presetMaxPerSec=app.reactionSettings.presetMaxPerSec||{}; app.reactionSettings.presetMaxPerSec.custom=item.rate||3; $('savedReactionName').value=item.name; app.renderCustomReactionEditorList(); app.renderLiveReactionDock(); app.updateReactionSettingsUI(); app.saveReactionSettings(); },
    remove() { if (!allowed()) return; const val=$('savedReactionSelect').value, list=read(reactionKey); if(val==='' || !list[Number(val)])return; if(!confirm(`刪除自訂情境「${list[Number(val)].name}」？`))return; list.splice(Number(val),1); if(write(reactionKey,list))this.refresh(); }
  };
  window.classroomPracticeTimer=timer; window.savedReactionScenarios=reactions;
  document.addEventListener('board-ready', () => {
    syncPresets(); reactions.refresh();
    try { const value=store().getItem('classroom_timer_animation'); if(value && allowed())timer.setAnimation(value); } catch (_) {}
    const dialog=$('practiceTimerModal');
    dialog.addEventListener('click',event=>{ if(event.target!==dialog)return; const rect=dialog.getBoundingClientRect(); if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) dialog.close(); });
  });
})();
