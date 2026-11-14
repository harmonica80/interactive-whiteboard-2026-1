(() => {
  const storageKey='dilemma_question_bank_v1';
  const subjects=['國文','數學','社會','音樂','健康','歷史','地理','自然'];
  const levels=['國小','國中','高中','大學'];
  const canEdit=()=>Boolean(window.app?.isAdmin);
  const $=id=>document.getElementById(id);
  const id=()=>`q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,11)}`;
  function getPool(){try{const raw=window.boardStorage.local.getItem(storageKey);if(raw!==null){const value=JSON.parse(raw);if(Array.isArray(value))return value;}}catch(e){console.warn('讀取題庫失敗:',e);}return (window.DILEMMA_QUESTION_BANK||[]).map(q=>({...q}));}
  function store(pool){try{window.boardStorage.local.setItem(storageKey,JSON.stringify(pool));return true;}catch(e){alert('儲存題庫失敗，請檢查瀏覽器儲存空間。');return false;}}
  function csvCell(value){const s=String(value??'');return `"${s.replace(/"/g,'""')}"`;}
  function parseCSV(text){
    const rows=[];let row=[],cell='',quoted=false,closed=false;const data=String(text).replace(/^\uFEFF/,'');
    for(let i=0;i<data.length;i++){const c=data[i];if(quoted){if(c==='"'){if(data[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;}
      else if(c==='"'){if(cell || closed)throw new Error('CSV 引號格式不正確');quoted=true;}
      else if(c===','){row.push(cell);cell='';closed=false;}
      else if(c==='\n'||c==='\r'){if(c==='\r'&&data[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';closed=false;}
      else {if(closed && !/\s/.test(c))throw new Error('CSV 引號後有多餘文字');if(!closed)cell+=c;}}
    if(quoted)throw new Error('CSV 引號未關閉');if(cell || row.length){row.push(cell);rows.push(row);}return rows.filter(r=>r.some(v=>v.trim()));
  }
  function parseRows(text){
    const rows=parseCSV(text);if(rows.length<2)throw new Error('CSV 至少需要表頭及一筆題目。');
    const expected=['領域','難度','題目','答案'];if(expected.some((v,i)=>(rows[0][i]||'').trim()!==v))throw new Error('CSV 表頭須依序為：領域、難度、題目、答案。');
    return rows.slice(1).map((r,index)=>{const subject=(r[0]||'').trim(),level=(r[1]||'').trim(),text=(r[2]||'').trim(),answer=(r[3]||'').trim().toLowerCase();
      if(r.length!==4||!subjects.includes(subject)||!levels.includes(level)||!text||text.length>300||!['對','錯','true','false','1','0'].includes(answer))throw new Error(`第 ${index+2} 列格式不正確；請確認領域、難度、題目及對／錯答案。`);
      return {id:id(),subject,level,text,answer:['對','true','1'].includes(answer)};});
  }
  function download(name,text){const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function initialize(){for(const [name,items] of [['dilemmaBankSubject',subjects],['dilemmaBankLevel',levels],['dilemmaBankSubjectFilter',subjects],['dilemmaBankLevelFilter',levels]]){const el=$(name);if(!el||el.dataset.ready)return;for(const value of items)el.add(new Option(value,value));el.dataset.ready='1';}const info=$('dilemmaBankInfo');if(info)info.textContent=`目前題庫 ${getPool().length} 題，儲存在此瀏覽器；可匯出 CSV 分享至其他裝置。`;}
  function clearForm(){ $('dilemmaBankEditId').value='';$('dilemmaBankText').value='';$('dilemmaBankFormTitle').textContent='新增題目';$('dilemmaBankAnswer').value='true'; }
  function render(){if(!canEdit())return;initialize();const pool=getPool(),query=$('dilemmaBankSearch').value.trim().toLowerCase(),subject=$('dilemmaBankSubjectFilter').value,level=$('dilemmaBankLevelFilter').value;const filtered=pool.filter(q=>(!subject||q.subject===subject)&&(!level||q.level===level)&&(!query||q.text.toLowerCase().includes(query)));const list=$('dilemmaBankList');list.replaceChildren();$('dilemmaBankStatus').textContent=`顯示 ${filtered.length} 題，共 ${pool.length} 題。`;for(const q of filtered){const row=document.createElement('div');row.className='dilemma-bank-item';const info=document.createElement('div'),title=document.createElement('strong'),meta=document.createElement('span');title.textContent=q.text;meta.textContent=`${q.subject}・${q.level}・答案：${q.answer?'對':'錯'}`;info.append(title,meta);const buttons=document.createElement('div');buttons.className='dilemma-bank-actions';for(const [label,handler] of [['編輯',()=>edit(q.id)],['刪除',()=>remove(q.id)]]){const btn=document.createElement('button');btn.type='button';btn.className='presentation-tool-btn';btn.textContent=label;btn.addEventListener('click',handler);buttons.append(btn);}row.append(info,buttons);list.append(row);}}
  function edit(itemId){if(!canEdit())return;const q=getPool().find(v=>v.id===itemId);if(!q)return;$('dilemmaBankEditId').value=q.id;$('dilemmaBankSubject').value=q.subject;$('dilemmaBankLevel').value=q.level;$('dilemmaBankText').value=q.text;$('dilemmaBankAnswer').value=String(q.answer);$('dilemmaBankFormTitle').textContent='編輯題目';$('dilemmaBankForm').scrollIntoView({block:'nearest'});$('dilemmaBankText').focus();}
  function remove(itemId){if(!canEdit())return;const pool=getPool(),q=pool.find(v=>v.id===itemId);if(!q||!confirm(`確定刪除題目「${q.text}」？`))return;if(store(pool.filter(v=>v.id!==itemId))){if($('dilemmaBankEditId').value===itemId)clearForm();render();}}
  window.dilemmaBank={
    getPool,render,clearForm,
    open(){if(!canEdit())return;initialize();render();clearForm();const dialog=$('dilemmaBankDialog'),parent=document.fullscreenElement||document.body;if(dialog.parentElement!==parent)parent.appendChild(dialog);if(!dialog.open)dialog.showModal();},
    save(){if(!canEdit())return;const subject=$('dilemmaBankSubject').value,level=$('dilemmaBankLevel').value,text=$('dilemmaBankText').value.trim(),answer=$('dilemmaBankAnswer').value==='true',itemId=$('dilemmaBankEditId').value;if(!subjects.includes(subject)||!levels.includes(level)||!text||text.length>300){alert('請填寫有效的領域、難度與題目。');return;}const pool=getPool(),idx=pool.findIndex(q=>q.id===itemId),item={id:idx<0?id():itemId,subject,level,text,answer};if(idx<0)pool.push(item);else pool[idx]=item;if(store(pool)){clearForm();render();}},
    chooseImport(){if(canEdit())$('dilemmaCsvInput').click();},
    async importFile(input){if(!canEdit())return;const file=input.files?.[0];if(!file)return;input.value='';try{if(file.size>5*1024*1024)throw new Error('CSV 檔案超過 5 MB。');const rows=parseRows(await file.text());if(!canEdit())return;if(!confirm(`將新增 ${rows.length} 題至目前題庫，確定匯入？`))return;const pool=getPool();if(store([...pool,...rows])){initialize();if($('dilemmaBankDialog').open)render();alert(`已匯入 ${rows.length} 題。`);}}catch(e){alert('匯入失敗：'+e.message);}},
    exportCSV(){if(!canEdit())return;const rows=getPool().map(q=>[q.subject,q.level,q.text,q.answer?'對':'錯'].map(csvCell).join(','));download('左右為難題庫.csv',['領域,難度,題目,答案',...rows].join('\r\n'));},
    template(){if(!canEdit())return;download('左右為難題庫範本.csv','領域,難度,題目,答案\r\n自然,國小,月球會繞地球運行。,對\r\n數學,國中,1 是質數。,錯');},
    reset(){if(!canEdit()||!confirm('確定恢復預設題庫？目前自訂題目將被取代，建議先匯出備份。'))return;try{window.boardStorage.local.removeItem(storageKey);initialize();if($('dilemmaBankDialog').open){clearForm();render();}alert('已恢復預設題庫。');}catch(e){alert('恢復失敗，請檢查瀏覽器儲存空間。');}}
  };
  document.addEventListener('board-ready',()=>initialize());
})();
