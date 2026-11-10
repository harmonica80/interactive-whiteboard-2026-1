(async function startBoard() {
  const status = document.getElementById('boardConnectionStatus');
  const message = status.querySelector('[role="status"]');
  const progress = status.querySelector('[role="progressbar"]');
  const fill = status.querySelector('.board-loading-progress-fill');
  const percent = status.querySelector('.board-loading-percent');
  function setProgress(value, text) {
    const amount = Math.max(0, Math.min(100, Math.round(value)));
    progress.setAttribute('aria-valuenow', String(amount));
    fill.style.width = amount + '%';
    percent.textContent = amount + '%';
    if (text) message.textContent = text;
  }
  // 選擇返回一次性課堂前，不啟動任何課堂功能或監聽。
  function offerOneOff() {
    if (!document.querySelector('script[data-src*="js/app.js"]')) return;
    let button = status.querySelector('[data-one-off]');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'presentation-tool-btn';
      button.dataset.oneOff = '';
      button.textContent = '返回一次性課堂';
      button.addEventListener('click', () => {
        window.boardStorage?.local.removeItem('active_class_code');
        const url = new URL(location.href);
        url.searchParams.delete('class');
        url.searchParams.delete('room');
        location.replace(url.toString());
      });
      status.appendChild(button);
    }
    button.hidden = false;
  }
  status.showModal();
  try {
    setProgress(5, '正在準備連線設定…');
    const target = BoardConnection.resolve(location.href);
    const parentPage = window.parent !== window && window.parent.location.origin === location.origin &&
      window.parent.boardTarget?.config.databaseURL === target.config.databaseURL &&
      window.parent.boardTarget?.mode === target.mode &&
      window.parent.boardTarget?.config.projectId === target.config.projectId ? window.parent : null;
    window.boardTarget = target;
    const scripts = [...document.querySelectorAll('script[data-src]')];
    // 可提前下載，但仍須等 Firebase 就緒後依原順序執行。
    scripts.forEach(source => {
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'script';
      preload.href = source.dataset.src;
      document.head.appendChild(preload);
    });
    setProgress(15, '正在連線至 Firebase 專案…');
    const prefix = 'chatgpt-board:' + target.mode + ':' + target.config.databaseURL + ':';
    function scoped(store) {
      return {
        getItem: key => store.getItem(prefix + key),
        setItem: (key, value) => store.setItem(prefix + key, value),
        removeItem: key => store.removeItem(prefix + key)
      };
    }
    window.boardStorage = { local: scoped(localStorage), session: scoped(sessionStorage), prefix };
    if (!parentPage && target.mode === 'secure') {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = document.querySelector('[data-auth-src]').dataset.authSrc;
        script.onload = resolve;
        script.onerror = () => reject(new Error('無法載入 Firebase 驗證服務，請檢查網路後重試。'));
        document.head.appendChild(script);
      });
    }
    const database = parentPage ? parentPage.db : await BoardConnection.connect(target);
    bindBoardDatabase(database, parentPage);
    // 必須先確認班級，才載入 app.js 及其他會掛載資料監聽的模組。
    if (!parentPage && window.currentClassCode && scripts.some(source => source.dataset.src.includes('js/app.js'))) {
      const classCode = window.currentClassCode;
      setProgress(35, '正在確認班級代碼…');
      let exists;
      try {
        exists = await ClassRoomManager.checkClassExists(classCode);
      } catch (error) {
        status.classList.add('is-error');
        status.querySelector('h2').textContent = '暫時無法確認班級';
        message.textContent = `無法確認班級【${classCode}】，可能是網路連線、登入或資料庫權限問題。尚未進入教室，請重新嘗試，或選擇返回一次性課堂。`;
        status.querySelector('[data-retry]').textContent = '重新進入教室';
        status.querySelector('[data-retry]').hidden = false;
        offerOneOff();
        return;
      }
      if (!exists) {
        status.classList.add('is-error');
        status.querySelector('h2').textContent = '查無此班級代碼';
        message.textContent = `找不到班級【${classCode}】，可能是代碼輸入錯誤或老師尚未登記開課。尚未進入教室，請向老師確認後重試，或選擇返回一次性課堂。`;
        status.querySelector('[data-retry]').textContent = '重新進入教室';
        status.querySelector('[data-retry]').hidden = false;
        offerOneOff();
        return;
      }
      window.boardVerifiedClassCode = classCode;
    }
    setProgress(40, '連線完成，正在載入白板功能…');
    let loadedScripts = 0;
    // 依原始順序執行，讓已有的傳統腳本繼續共用全域物件。
    await Promise.all(scripts.map(source => new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = false;
      script.src = source.dataset.src;
      script.onload = () => {
        loadedScripts += 1;
        setProgress(40 + 55 * loadedScripts / scripts.length, '正在載入白板功能（' + loadedScripts + '／' + scripts.length + '）…');
        resolve();
      };
      script.onerror = () => reject(new Error('無法載入 ' + source.dataset.src));
      document.head.appendChild(script);
    })));
    document.dispatchEvent(new Event('board-ready', { bubbles: true }));
    window.dispatchEvent(new Event('board-modules-started'));
    setProgress(100, '載入完成。');
    status.close();
  } catch (error) {
    status.classList.add('is-error');
    status.querySelector('h2').textContent = '白板載入失敗';
    message.textContent = error.code === 'auth/operation-not-allowed'
      ? '請在新 Firebase 專案的 Authentication 登入方式中啟用「匿名」，再重新連線。'
      : '白板連線失敗。' + (error.message || '請檢查網路與專案設定。');
    status.querySelector('[data-retry]').hidden = false;
    const requestedClass = new URL(location.href).searchParams.get('class') || new URL(location.href).searchParams.get('room') || window.boardStorage?.local.getItem('active_class_code');
    if (requestedClass) {
      message.textContent += ' 尚未進入教室；返回一次性課堂也需要可用的資料庫連線。';
      status.querySelector('[data-retry]').textContent = '重新進入教室';
      offerOneOff();
    }
  }
})();