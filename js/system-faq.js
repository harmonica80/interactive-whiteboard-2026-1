(() => {
  const defaults = [
    ['如何進入班級課堂？','開啟老師分享的班級連結，或使用「輸入班級代碼」並輸入老師提供的代碼。若無法確認，請檢查網路並重新嘗試。'],
    ['忘記教師管理密碼怎麼辦？','若已設定安全問題，可在登入畫面選擇「忘記密碼」並回答問題。若無法恢復，請由資料庫管理者參考建立白板頁面的自救說明。'],
    ['學生看不到某個功能怎麼辦？','請老師確認「系統設定」中的功能模組是否啟用，並確認目前使用的班級連結正確。'],
    ['白板上的資料會自動保存嗎？','白板內容會同步到目前連接的資料庫；同步失敗或離線時請確認連線狀態，重要教材建議另行匯出備份。'],
    ['無法上傳圖片或 PDF 怎麼辦？','請確認網路及資料庫權限，並嘗試縮小圖片或降低 PDF 轉換寬度；檔案過大時請分批匯入。'],
    ['不同裝置上的內容為什麼不同？','請確認開啟的是同一個白板連結與班級代碼，並檢查裝置是否已連上網路。']
  ].map((v,i)=>({id:'default'+i,question:v[0],answer:v[1],order:i}));
  function safeHtml(html) {
    const template=document.createElement('template');template.innerHTML=html;
    const allowedTags=new Set(['B','STRONG','I','EM','U','S','BR','P','DIV','UL','OL','LI','IMG']);
    function clean(node) {
      for(const child of [...node.childNodes]) {
        if(child.nodeType===3)continue;
        if(child.nodeType!==1){child.remove();continue;}
        if(!allowedTags.has(child.tagName)) { child.replaceWith(document.createTextNode(child.textContent || ''));continue; }
        if(child.tagName==='IMG') { const src=child.getAttribute('src')||'';if(!/^data:image\/webp;base64,[a-z0-9+/=]+$/i.test(src) || src.length>1500000){child.remove();continue;}for(const attr of [...child.attributes])child.removeAttribute(attr.name);child.setAttribute('src',src);child.setAttribute('alt','FAQ 圖片'); }
        else {for(const attr of [...child.attributes])child.removeAttribute(attr.name);clean(child);}
      }
    }
    clean(template.content);return template.innerHTML;
  }
  function answerHtml(item) { if(item.format==='html')return safeHtml(item.answer);const div=document.createElement('div');div.textContent=item.answer||'';return div.innerHTML.replace(/\n/g,'<br>'); }
  async function insertImage(file, editor) {
    if(!allowed() || !file || !file.type.startsWith('image/'))return;
    try { const bitmap=await createImageBitmap(file);const scale=Math.min(1,800/bitmap.width,1600/bitmap.height);const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();const data=canvas.toDataURL('image/webp',0.8);if(!data.startsWith('data:image/webp;')||data.length>1500000){alert('圖片過大或瀏覽器不支援 WebP，請縮小圖片後重試。');return;}const img=document.createElement('img');img.src=data;img.alt='FAQ 圖片';editor.appendChild(img);editor.focus();}catch(e){alert('無法讀取圖片，請改用其他圖檔。');}
  }
  let items=[], loaded=false, initialized=false, busy=false, context='';
  const expanded=new Set();
  const allowed=()=>Boolean(window.app && window.app.isAdmin);
  const ref=()=>window.app.db.ref('settings/systemFaq');
  const status=text=>{const el=document.getElementById('systemFaqStatus');if(el)el.textContent=text;};
  function button(label, fn, disabled=false) { const b=document.createElement('button');b.type='button';b.className='presentation-tool-btn';b.textContent=label;b.disabled=disabled;b.addEventListener('click',fn);return b; }
  function render() {
    const list=document.getElementById('systemFaqList');if(!list)return;list.replaceChildren();
    if(!items.length){const p=document.createElement('p');p.className='system-faq-help';p.textContent='目前沒有常見問題，可按下方按鈕新增。';list.appendChild(p);return;}
    items.forEach((item,i)=>{
      const card=document.createElement('details');card.className='system-faq-card';card.open=expanded.has(item.id);
      const summary=document.createElement('summary');summary.className='system-faq-card-title';summary.textContent=item.question || '未命名問題';
      card.addEventListener('toggle',()=>{if(card.open)expanded.add(item.id);else expanded.delete(item.id);});
      const body=document.createElement('div');body.className='system-faq-card-body';
      const qLabel=document.createElement('label');qLabel.textContent=`問題 ${i+1}`;
      const q=document.createElement('input');q.className='question-input';q.maxLength=200;q.value=item.question;q.setAttribute('aria-label',`問題 ${i+1}`);
      const aLabel=document.createElement('label');aLabel.textContent='答案';
      q.addEventListener('input',()=>{summary.textContent=q.value.trim() || '未命名問題';});
      const wrapper=document.createElement('div');wrapper.className='quiz-editor-wrapper system-faq-editor-wrapper';
      const toolbar=document.createElement('div');toolbar.className='quiz-editor-toolbar';
      const row=document.createElement('div');row.className='quiz-editor-toolbar-row';
      const subrow=document.createElement('div');subrow.className='quiz-editor-toolbar-row quiz-editor-toolbar-row-sub';
      const a=document.createElement('div');a.className='system-faq-editor';a.contentEditable='true';a.setAttribute('role','textbox');a.setAttribute('aria-multiline','true');a.setAttribute('aria-label',`問題 ${i+1} 的答案`);a.innerHTML=answerHtml(item);
      for(const [label,command] of [['B 粗體','bold'],['I 斜體','italic'],['U 底線','underline'],['• 清單','insertUnorderedList'],['1. 清單','insertOrderedList']]) {const b=button(label,()=>{a.focus();document.execCommand(command,false,null);});b.className='quiz-editor-btn';b.addEventListener('mousedown',e=>e.preventDefault());row.appendChild(b);}
      const file=document.createElement('input');file.type='file';file.accept='image/*';file.hidden=true;file.addEventListener('change',()=>{insertImage(file.files[0],a);file.value='';});const upload=button('🖼️ 圖片',()=>file.click());upload.className='quiz-editor-btn quiz-btn-media';subrow.append(upload,file);
      for(const [label,command] of [['↩️ 復原','undo'],['↪️ 重做','redo'],['🧹 清除格式','removeFormat']]) {const b=button(label,()=>{a.focus();document.execCommand(command,false,null);});b.className='quiz-editor-btn';b.addEventListener('mousedown',e=>e.preventDefault());subrow.appendChild(b);}
      toolbar.append(row,subrow);wrapper.append(toolbar,a);
      a.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData.getData('text/plain');document.execCommand('insertText',false,text);});
      const actions=document.createElement('div');actions.className='system-faq-actions';
      actions.append(button('💾 儲存',()=>save(item.id,q.value,a.innerHTML)),button('↑ 上移',()=>move(i,-1),i===0),button('↓ 下移',()=>move(i,1),i===items.length-1),button('🗑️ 刪除',()=>remove(item.id)));
      body.append(qLabel,q,aLabel,wrapper,actions);card.append(summary,body);list.appendChild(card);
    });
  }
  async function commit(changes) {
    if(!allowed() || !loaded || busy || context!==(window.currentClassCode||''))return false;
    busy=true;status('正在儲存…');
    try {
      if(!initialized) {
        const base=Object.fromEntries(items.map(item=>[item.id,{question:item.question,answer:item.answer,order:item.order,...(item.format ? {format:item.format} : {})}]));
        for(const [path,value] of Object.entries(changes)) {
          const parts=path.split('/'); if(parts[0]!=='items')continue;
          if(parts.length===2) { if(value===null)delete base[parts[1]];else base[parts[1]]=value; }
          else if(parts.length===3 && base[parts[1]])base[parts[1]][parts[2]]=value;
        }
        changes={initialized:true,items:base};
      }
      await ref().update(changes);initialized=true;status('已儲存至目前課堂。');return true;
    } catch(e){status('儲存失敗，請檢查網路與資料庫權限，修改內容尚未儲存。');return false;} finally {busy=false;}
  }
  async function save(id,question,answer){if(!allowed())return;question=question.trim();answer=safeHtml(answer).trim();if(!question||!answer){alert('請輸入問題與答案。');return;}if(answer.length>1800000){alert('答案與圖片過大，請減少圖片或縮小圖檔後重試。');return;}const item=items.find(x=>x.id===id);if(!item)return;const value={question,answer,format:'html',order:item.order};if(await commit({['items/'+id]:value})){Object.assign(item,value);render();}}
  async function move(index,delta){if(!allowed())return;const other=index+delta;if(other<0||other>=items.length)return;const a=items[index],b=items[other], ao=a.order,bo=b.order;if(await commit({['items/'+a.id+'/order']:bo,['items/'+b.id+'/order']:ao})){a.order=bo;b.order=ao;items.sort((x,y)=>x.order-y.order);render();}}
  async function remove(id){if(!allowed())return;const item=items.find(x=>x.id===id);if(!item||!confirm(`刪除「${item.question}」？`))return;if(await commit({['items/'+id]:null})){items=items.filter(x=>x.id!==id);render();}}
  window.systemFaq={
    async load(){if(!allowed())return;loaded=false;context=window.currentClassCode||'';status('正在讀取…');try{const snap=await ref().once('value');if(!allowed() || context!==(window.currentClassCode||''))return;const data=snap.val()||{};initialized=data.initialized===true;items=initialized?Object.entries(data.items||{}).map(([id,v])=>({id,question:String(v.question||''),answer:String(v.answer||''),format:v.format==='html'?'html':'text',order:Number(v.order)||0})).sort((a,b)=>a.order-b.order):defaults.map(v=>({...v}));loaded=true;status(initialized?'已讀取目前課堂的常見問題。':'以下為建議內容，首次變更時儲存至目前課堂。');render();}catch(e){status('讀取失敗，請檢查網路與資料庫權限，重新進入此頁再試。');document.getElementById('systemFaqList')?.replaceChildren();}},
    async openViewer(){
      const dialog=document.getElementById('systemFaqViewer'),list=document.getElementById('systemFaqViewerList'),message=document.getElementById('systemFaqViewerStatus');
      const parent=document.fullscreenElement || document.body;if(dialog.parentElement!==parent)parent.appendChild(dialog);
      if(!dialog.open)dialog.showModal();list.replaceChildren();message.textContent='正在讀取…';
      try {const snap=await window.app.db.ref('settings/systemFaq').once('value');const data=snap.val()||{};const entries=data.initialized===true?Object.entries(data.items||{}).map(([id,v])=>({id,question:String(v.question||''),answer:String(v.answer||''),format:v.format,order:Number(v.order)||0})).sort((a,b)=>a.order-b.order):defaults;
        message.textContent=entries.length?'點選問題即可展開答案。':'目前沒有常見問題。';
        entries.forEach(item=>{const details=document.createElement('details'),summary=document.createElement('summary'),answer=document.createElement('div');summary.textContent=item.question;answer.className='system-faq-answer';answer.innerHTML=answerHtml(item);details.append(summary,answer);details.addEventListener('toggle',()=>{if(details.open)list.querySelectorAll('details').forEach(other=>{if(other!==details)other.open=false;});});list.appendChild(details);});
      }catch(e){message.textContent='讀取失敗，請檢查網路或資料庫讀取權限後重試。';}
    },
    async add(){if(!allowed()||!loaded)return;const id=ref().child('items').push().key;const item={id,question:'新問題',answer:'請輸入答案',order:items.length?Math.max(...items.map(x=>x.order))+1:0};if(await commit({['items/'+id]:{question:item.question,answer:item.answer,order:item.order,...(item.format ? {format:item.format} : {})}})){items.push(item);expanded.add(item.id);render();}}
  };
})();
