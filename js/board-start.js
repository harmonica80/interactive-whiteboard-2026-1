(async function startBoard() {
  const status = document.getElementById('boardConnectionStatus');
  const message = status.querySelector('[role="status"]');
  status.showModal();
  try {
    const target = BoardConnection.resolve(location.href);
    const parentPage = window.parent !== window && window.parent.location.origin === location.origin &&
      window.parent.boardTarget?.config.databaseURL === target.config.databaseURL &&
      window.parent.boardTarget?.mode === target.mode &&
      window.parent.boardTarget?.config.projectId === target.config.projectId ? window.parent : null;
    window.boardTarget = target;
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
    const scripts = [...document.querySelectorAll('script[data-src]')];
    // 依原始順序執行，讓已有的傳統腳本繼續共用全域物件。
    await Promise.all(scripts.map(source => new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = false;
      script.src = source.dataset.src;
      script.onload = resolve;
      script.onerror = () => reject(new Error('無法載入 ' + source.dataset.src));
      document.head.appendChild(script);
    })));
    document.dispatchEvent(new Event('board-ready', { bubbles: true }));
    window.dispatchEvent(new Event('board-modules-started'));
    status.close();
  } catch (error) {
    message.textContent = error.code === 'auth/operation-not-allowed'
      ? '請在新 Firebase 專案的 Authentication 登入方式中啟用「匿名」，再重新連線。'
      : '白板連線失敗。' + (error.message || '請檢查網路與專案設定。');
    status.querySelector('[data-retry]').hidden = false;
  }
})();