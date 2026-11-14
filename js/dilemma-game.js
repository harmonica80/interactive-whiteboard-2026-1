(() => {
  let state=null, refs=[], counts={yes:0,no:0}, mine=null, busy=false;
  let teacherRefs=[], teacherVotes={}, teacherSession=null;
  const root=()=>window.app?.db;
  function detach(preserveTeacher=false){
    for(const [ref,fn] of refs)ref.off('value',fn);refs=[];state=null;counts={yes:0,no:0};mine=null;busy=false;
    if(!preserveTeacher){for(const [ref,event,fn] of teacherRefs)ref.off(event,fn);teacherRefs=[];teacherVotes={};teacherSession=null;document.getElementById('focusGameOverlay')?.classList.remove('dilemma-active');}
  }
  function listen(ref,fn){const cb=ref.on('value',fn,()=>{window.app?.showNotification('連線失敗','無法讀取作答狀態，請檢查網路與資料庫權限。')});refs.push([ref,cb]);}
  function path(game){return `quiz/dilemmaVotes/${game.sessionId}/${game.questionIndex}`;}
  function question(game){return (game.questions||[])[Number(game.questionIndex)||0];}
  function escape(value){const el=document.createElement('span');el.textContent=String(value??'');return el.innerHTML;}
  function ensureTeacherVotes(game){
    if(!state?.app.isAdmin)return;
    if(teacherSession!==game.sessionId){ for(const [ref,event,fn] of teacherRefs)ref.off(event,fn);teacherRefs=[];teacherVotes={};teacherSession=game.sessionId; }
    for(let index=0;index<=Number(game.questionIndex);index++){
      if(teacherVotes[index])continue;
      teacherVotes[index]={};const ref=root().ref(`quiz/dilemmaVotes/${game.sessionId}/${index}/votes`);
      for(const event of ['child_added','child_changed','child_removed']){
        const cb=ref.on(event,snap=>{if(teacherSession!==game.sessionId)return;if(event==='child_removed')delete teacherVotes[index][snap.key];else teacherVotes[index][snap.key]=snap.val();view();},()=>state?.app.showNotification('排行榜讀取失敗','請檢查網路及資料庫權限。'));
        teacherRefs.push([ref,event,cb]);
      }
    }
  }
  function leaderboard(app,game){
    const players={};
    for(const [index,entries] of Object.entries(teacherVotes)){
      const q=game.questions[Number(index)];if(!q)continue;
      for(const [uid,vote] of Object.entries(entries)){
        const choice=vote?.pending ? vote.pending.from : vote?.choice;
        if(!['yes','no'].includes(choice))continue;
        const item=players[uid]||(players[uid]={uid,name:app.registeredStudents?.[uid]?.name || vote.name || '同學',correct:0,answered:0});
        item.answered++;if((choice==='yes')===q.answer)item.correct++;
      }
    }
    const rows=Object.values(players).sort((a,b)=>b.correct-a.correct || a.name.localeCompare(b.name,'zh-Hant'));
    let rank=0,previous=null;const list=rows.map((item,index)=>{if(item.correct!==previous){rank=index+1;previous=item.correct;}return `<li><span>${rank}. ${escape(item.name)}</span><strong>答對 ${item.correct} 題／作答 ${item.answered} 題</strong></li>`}).join('');
    return `<section class="dilemma-ranking" aria-label="即時成績排行榜"><h3>🏆 即時成績排行榜</h3><p>教師專用；依答對題數排序，改選後會即時更新。</p>${rows.length?`<ol>${list}</ol>`:'<p>尚無同學作答。</p>'}</section>`;
  }
  function view(){
    if(!state)return;const {app,game}=state;const q=question(game),grid=document.getElementById('focusGameGrid');if(!q||!grid)return;
    const isTeacher=!!app.isAdmin, canSee=isTeacher || (!!mine?.choice && !mine.pending), revealed=game.revealed===true;
    const selected=mine?.choice, remaining=selected && !mine?.changes;
    const note=isTeacher?'請等同學選擇後公布答案或切換下一題。':!selected?'請選擇「對」或「錯」；作答後會顯示人數。':mine.pending?'正在同步統計，請稍候。':remaining?'您還有一次改選機會。':'已使用改選機會。';
    const button=(side,label,symbol)=>`<button type="button" class="dilemma-choice ${side} ${selected===side?'selected':''}" ${isTeacher||revealed||busy||mine?.pending||(selected && !remaining)?'disabled':''} onclick="window.dilemmaGame.vote('${side}')"><span aria-hidden="true">${symbol}</span><strong>${label}</strong><small>${canSee?`${counts[side] || 0} 人選擇`:'選答後顯示人數'}</small></button>`;
    grid.innerHTML=`<div class="dilemma-board"><div class="dilemma-meta">⚖️ ${escape(q.subject)} · ${escape(q.level)} · 第 ${Number(game.questionIndex)+1} / ${game.questions.length} 題</div><p class="dilemma-note" role="status">${escape(note)}</p><div class="dilemma-layout">${button('yes','對','○')}<div class="dilemma-question">${escape(q.text)}</div>${button('no','錯','×')}</div>${revealed?`<p class="dilemma-reveal">答案：${q.answer?'對':'錯'}<br><a class="dilemma-reference" href="https://www.google.com/search?q=${encodeURIComponent(q.text)}" target="_blank" rel="noopener noreferrer">🔎 用題目搜尋 Google 參考資料</a></p>`:''}${mine?.pending?'<button type="button" class="presentation-tool-btn" onclick="window.dilemmaGame.retry()">重新同步統計</button>':''}${isTeacher?`<div class="dilemma-controls"><button type="button" class="presentation-tool-btn" onclick="window.dilemmaGame.reveal()" ${revealed?'disabled':''}>公布答案</button><button type="button" class="presentation-tool-btn active" onclick="window.dilemmaGame.next()">${Number(game.questionIndex)+1>=game.questions.length?'結束活動':'下一題'}</button></div>`:''}${isTeacher?leaderboard(app,game):''}</div>`;
  }
  async function settle(refPath,uid,pending){
    // 將每次操作的序號與人數一起交易，重試時不重複累加。
    const revision=Number(pending.revision), countRef=root().ref(`${refPath}/counts`);
    // 預讀目前版本，避免重新連線時交易以尚未載入的空快取誤判。
    await countRef.once('value');
    const result=await countRef.transaction(current=>{
      const next=current || {yes:0,no:0,applied:{}};
      next.applied=next.applied || {};
      const applied=Number(next.applied[uid]) || 0;
      if(applied>=revision || applied!==revision-1)return current;
      if(pending.from)next[pending.from]=Math.max(0,(Number(next[pending.from])||0)-1);
      next[pending.to]=(Number(next[pending.to])||0)+1;
      next.applied[uid]=revision;
      return next;
    },undefined,false);
    if((Number(result.snapshot.val()?.applied?.[uid])||0)<revision)throw new Error('前一次統計尚未完成');
    // 再次確認是同一筆操作，避免清除另一個分頁剛開始的新改選。
    await root().ref(`${refPath}/votes/${uid}`).transaction(current=>{
      if(!current?.pending || Number(current.pending.revision)!==revision)return current;
      return {...current,pending:null};
    },undefined,false);
  }
  window.dilemmaGame={
    detach,
    updateCountMode(){const select=document.getElementById('dilemmaCount'),custom=document.getElementById('dilemmaCustomCount');if(custom)custom.hidden=select?.value!=='custom';},
    async start(app){
      if(!app.isAdmin)return;const level=document.getElementById('dilemmaLevel').value,subjects=[...document.querySelectorAll('.dilemma-subject:checked')].map(e=>e.value);
      if(!subjects.length){app.showNotification('請選擇出題範圍','至少選擇一個領域。');return;}
      const qs=(window.dilemmaBank?.getPool() || window.DILEMMA_QUESTION_BANK || []).filter(q=>q.level===level && subjects.includes(q.subject));
      if(!qs.length){app.showNotification('無題目','目前沒有符合條件的題目。');return;}
      const select=document.getElementById('dilemmaCount'),raw=select?.value==='custom'?document.getElementById('dilemmaCustomCount')?.value:select?.value;
      const count=Number(raw);if(!Number.isInteger(count)||count<1||count>160){app.showNotification('題數不正確','請輸入 1 至 160 的整數。');return;}
      if(count>qs.length){app.showNotification('題目數量不足',`目前難度及領域只有 ${qs.length} 題，請減少題數或增加出題範圍。`);return;}
      for(let i=qs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[qs[i],qs[j]]=[qs[j],qs[i]];}
      const sessionId='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
      try {app.resetFocusGameLocalState();await Promise.all([root().ref('quiz/buzzGame').set(null),root().ref('quiz/current').update({active:false})]);app.previewStudentActivity('gameFocus');await root().ref('quiz/focusGame').set({status:'playing',gameType:'dilemma',sessionId,questionIndex:0,revealed:false,level,subjects,questions:qs.slice(0,count),startTime:Date.now()});}
      catch(e){app.showNotification('發起失敗',e.message||'請檢查連線後重試。');}
    },
    render(app,game){
      const q=question(game);if(!q || !game.sessionId)return;
      const container=document.getElementById('focusNumberGridContainer'),grid=document.getElementById('focusGameGrid');
      if(container){container.style.display='flex';container.classList.remove('schulte-mode');}document.getElementById('focusMemoryMatchBoard').style.display='none';
      for(const id of ['focusNumberGridHeader','focusHelpBtn','focusHelpInfo','focusPlayingLeaderboardSection']){const el=document.getElementById(id);if(el)el.style.display='none';}
      grid.classList.remove('schulte-mode');Object.assign(grid.style,{display:'block',width:'100%',maxWidth:'1100px',aspectRatio:'auto',height:'auto',maxHeight:'none',overflow:'visible'});
      const key=`${game.sessionId}/${game.questionIndex}`;
      if(!state || state.key!==key){const preserve=!!(app.isAdmin && state?.app.isAdmin && state.game.sessionId===game.sessionId);detach(preserve);state={key,app,game};const base=root().ref(path(game));
        for(const side of ['yes','no'])listen(base.child('counts').child(side),snap=>{counts[side]=Number(snap.val())||0;view()});
        if(!app.isAdmin){const uid=app.getUserId();listen(base.child('votes').child(uid),snap=>{mine=snap.val()||null;view()});}
      } else {state.app=app;state.game=game;}
      document.getElementById('focusGameOverlay')?.classList.add('dilemma-active');
      if(app.isAdmin)ensureTeacherVotes(game);view();
    },
    async vote(choice){
      if(!state || state.app.isAdmin || state.game.revealed || busy || !['yes','no'].includes(choice))return;
      const {app,game}=state, uid=app.getUserId(),basePath=path(game),voteRef=root().ref(`${basePath}/votes/${uid}`);busy=true;view();
      try {
        const result=await voteRef.transaction(current=>{
          if(current?.pending || current?.choice===choice || (current?.choice && Number(current.changes)>=1))return;
          return {choice,name:String(app.getCurrentUserName?.() || '同學').slice(0,40),changes:current?.choice ? 1 : 0,pending:{from:current?.choice||null,to:choice,revision:current?.choice ? 2 : 1}};
        },undefined,false);
        if(result.committed){const vote=result.snapshot.val();await settle(basePath,uid,vote.pending);}
      } catch(e){console.warn('左右為難同步失敗:',e);app.showNotification('作答同步失敗','請檢查連線，並在畫面上選擇重新同步。');}
      finally {busy=false;view();}
    },
    async retry(){if(!state || state.app.isAdmin || !mine?.pending || busy)return;busy=true;view();try{await settle(path(state.game),state.app.getUserId(),mine.pending)}catch(e){state.app.showNotification('同步失敗','請檢查連線後再試。')}finally{busy=false;view()}},
    async reveal(){if(!state?.app.isAdmin)return;try{await root().ref('quiz/focusGame').update({revealed:true})}catch(e){state.app.showNotification('操作失敗','請檢查網路連線。')}},
    async next(){if(!state?.app.isAdmin)return;const {app,game}=state;try{if(Number(game.questionIndex)+1>=game.questions.length){await root().ref('quiz/focusGame').update({status:'idle'});return;}await root().ref('quiz/focusGame').update({questionIndex:Number(game.questionIndex)+1,revealed:false});}catch(e){app.showNotification('操作失敗','請檢查網路連線。')}}
  };
})();
