(() => {
  const defaults = [
    ['如何進入班級課堂？','開啟老師分享的班級連結，或使用「輸入班級代碼」並輸入老師提供的代碼。若無法確認，請檢查網路並重新嘗試。'],
    ['忘記教師管理密碼怎麼辦？','若已設定安全問題，可在登入畫面選擇「忘記密碼」並回答問題。若無法恢復，請由資料庫管理者參考建立白板頁面的自救說明。'],
    ['學生看不到某個功能怎麼辦？','請老師確認「系統設定」中的功能模組是否啟用，並確認目前使用的班級連結正確。'],
    ['白板上的資料會自動保存嗎？','白板內容會同步到目前連接的資料庫；同步失敗或離線時請確認連線狀態，重要教材建議另行匯出備份。'],
    ['無法上傳圖片或 PDF 怎麼辦？','請確認網路及資料庫權限，並嘗試縮小圖片或降低 PDF 轉換寬度；檔案過大時請分批匯入。'],
    ['不同裝置上的內容為什麼不同？','請確認開啟的是同一個白板連結與班級代碼，並檢查裝置是否已連上網路。']
  ].map((v,i)=>({id:'default'+i,question:v[0],answer:v[1],order:i}));
  let items=[], loaded=false, initialized=false, busy=false, context='';
  const allowed=()=>Boolean(window.app && window.app.isAdmin);
  const ref=()=>window.app.db.ref('settings/systemFaq');
  const status=text=>{const el=document.getElementById('systemFaqStatus');if(el)el.textContent=text;};
  function button(label, fn, disabled=false) { const b=document.createElement('button');b.type='button';b.className='presentation-tool-btn';b.textContent=label;b.disabled=disabled;b.addEventListener('click',fn);return b; }
  function render() {
    const list=document.getElementById('systemFaqList');if(!list)return;list.replaceChildren();
    if(!items.length){const p=document.createElement('p');p.className='system-faq-help';p.textContent='目前沒有常見問題，可按下方按鈕新增。';list.appendChild(p);return;}
    items.forEach((item,i)=>{
      const card=document.createElement('div');card.className='system-faq-card';
      const qLabel=document.createElement('label');qLabel.textContent=`問題 ${i+1}`;
      const q=document.createElement('input');q.className='question-input';q.maxLength=200;q.value=item.question;q.setAttribute('aria-label',`問題 ${i+1}`);
      const aLabel=document.createElement('label');aLabel.textContent='答案';
      const a=document.createElement('textarea');a.className='question-input';a.maxLength=3000;a.rows=3;a.value=item.answer;a.setAttribute('aria-label',`問題 ${i+1} 的答案`);
      const actions=document.createElement('div');actions.className='system-faq-actions';
      actions.append(button('💾 儲存',()=>save(item.id,q.value,a.value)),button('↑ 上移',()=>move(i,-1),i===0),button('↓ 下移',()=>move(i,1),i===items.length-1),button('🗑️ 刪除',()=>remove(item.id)));
      card.append(qLabel,q,aLabel,a,actions);list.appendChild(card);
    });
  }
  async function commit(changes) {
    if(!allowed() || !loaded || busy || context!==(window.currentClassCode||''))return false;
    busy=true;status('正在儲存…');
    try {
      if(!initialized) {
        const base=Object.fromEntries(items.map(item=>[item.id,{question:item.question,answer:item.answer,order:item.order}]));
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
  async function save(id,question,answer){if(!allowed())return;question=question.trim();answer=answer.trim();if(!question||!answer){alert('請輸入問題與答案。');return;}const item=items.find(x=>x.id===id);if(!item)return;const value={question,answer,order:item.order};if(await commit({['items/'+id]:value})){Object.assign(item,value);render();}}
  async function move(index,delta){if(!allowed())return;const other=index+delta;if(other<0||other>=items.length)return;const a=items[index],b=items[other], ao=a.order,bo=b.order;if(await commit({['items/'+a.id+'/order']:bo,['items/'+b.id+'/order']:ao})){a.order=bo;b.order=ao;items.sort((x,y)=>x.order-y.order);render();}}
  async function remove(id){if(!allowed())return;const item=items.find(x=>x.id===id);if(!item||!confirm(`刪除「${item.question}」？`))return;if(await commit({['items/'+id]:null})){items=items.filter(x=>x.id!==id);render();}}
  window.systemFaq={
    async load(){if(!allowed())return;loaded=false;context=window.currentClassCode||'';status('正在讀取…');try{const snap=await ref().once('value');if(!allowed() || context!==(window.currentClassCode||''))return;const data=snap.val()||{};initialized=data.initialized===true;items=initialized?Object.entries(data.items||{}).map(([id,v])=>({id,question:String(v.question||''),answer:String(v.answer||''),order:Number(v.order)||0})).sort((a,b)=>a.order-b.order):defaults.map(v=>({...v}));loaded=true;status(initialized?'已讀取目前課堂的常見問題。':'以下為建議內容，首次變更時儲存至目前課堂。');render();}catch(e){status('讀取失敗，請檢查網路與資料庫權限，重新進入此頁再試。');document.getElementById('systemFaqList')?.replaceChildren();}},
    async add(){if(!allowed()||!loaded)return;const id=ref().child('items').push().key;const item={id,question:'新問題',answer:'請輸入答案',order:items.length?Math.max(...items.map(x=>x.order))+1:0};if(await commit({['items/'+id]:{question:item.question,answer:item.answer,order:item.order}})){items.push(item);render();}}
  };
})();
