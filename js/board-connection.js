// 共用於教師設定頁、主頁及獨立開啟的畫布。
window.BoardConnection = (() => {
  const fields = ['apiKey', 'authDomain', 'projectId', 'appId', 'databaseURL'];
  // 修正版的預設測試專案；自建連結仍優先使用連結中的設定。
  const defaultConfig = {
    "apiKey": "AIzaSyB80q65DENqE3GBSVSwTE0kJktItW_FW_o",
    "authDomain": "opencode-whiteboard-chatgpt.firebaseapp.com",
    "databaseURL": "https://opencode-whiteboard-chatgpt-default-rtdb.asia-southeast1.firebasedatabase.app",
    "projectId": "opencode-whiteboard-chatgpt",
    "appId": "1:224520227327:web:03384ca9b55d480b27ffca"
  };
  const oldKeys = ['sid', 'b', 'dbKey', 'dbUrl'];

  function databaseUrl(value) {
    let url;
    try { url = new URL(value); } catch { throw new Error('請貼上完整的 Realtime Database HTTPS 網址。'); }
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash ||
        !/^\/?$/.test(url.pathname) || !/^[a-z0-9-]+(?:\.firebaseio\.com|\.[a-z0-9-]+\.firebasedatabase\.app)$/.test(url.hostname)) {
      throw new Error('請複製資料庫根網址，移除路徑與查詢參數。');
    }
    if (url.hostname.split('.')[0] === 'opencode-whiteboard-default-rtdb') {
      throw new Error('這是原版白板的資料庫。修正版請使用另一個 Firebase 專案。');
    }
    return url.origin;
  }

  function validate(input, expectedUrl) {
    if (input?.type === 'service_account' || input?.private_key) throw new Error('請改貼網頁應用程式的公開設定。');
    const config = {};
    for (const key of fields) {
      if (typeof input?.[key] !== 'string' || !input[key].trim()) throw new Error('設定缺少 ' + key);
      config[key] = input[key].trim();
    }
    config.databaseURL = databaseUrl(config.databaseURL);
    if (config.databaseURL !== databaseUrl(expectedUrl)) throw new Error('兩處資料庫網址不同，請核對專案設定。');
    if (config.projectId === 'opencode-whiteboard') throw new Error('請改用新專案的 Web App 設定。');
    return config;
  }

  function parseConfig(text) {
    // 接受 JSON 及控制台產生的雙引號字串物件，只剖析資料。
    const object = text.trim().replace(/^(?:const|let|var)\s+firebaseConfig\s*=\s*/, '').replace(/;\s*$/, '');
    try {
      return JSON.parse(object.replace(/([{,]\s*)([a-zA-Z]\w*)\s*:/g, '$1"$2":').replace(/,\s*}$/, '}'));
    } catch { throw new Error('請貼上 Firebase 控制台中的 firebaseConfig 設定物件。'); }
  }

  function encode(config) {
    const bytes = new TextEncoder().encode(JSON.stringify(config));
    return btoa(Array.from(bytes, n => String.fromCharCode(n)).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeLegacy(token) {
    if (token.startsWith('https://')) return token;
    const salt = 'OpEnCoDe_Wb2026_SeCuRe_SaLt';
    const binary = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
    return new TextDecoder().decode(Uint8Array.from(binary, (c, i) => c.charCodeAt(0) ^ salt.charCodeAt(i % salt.length)));
  }

  function resolve(href) {
    const url = new URL(href);
    const legacy = oldKeys.flatMap(key => url.searchParams.getAll(key).map(value => ({ key, value })));
    const secure = url.hash.startsWith('#wb=');
    if (legacy.length + Number(secure) > 1) throw new Error('連結含有衝突的設定，請重新產生。');
    if (secure) {
      const match = /^#wb=v1\.([A-Za-z0-9_-]+)$/.exec(url.hash);
      if (!match) throw new Error('連結版本或格式有誤，請重新產生。');
      let data;
      try {
        const raw = atob(match[1].replace(/-/g, '+').replace(/_/g, '/'));
        data = JSON.parse(new TextDecoder().decode(Uint8Array.from(raw, c => c.charCodeAt(0))));
      } catch { throw new Error('連結設定不完整，請重新複製整個網址。'); }
      return { mode: 'secure', config: validate(data, data?.databaseURL) };
    }
    if (legacy.length) {
      const { key, value } = legacy[0];
      return { mode: 'simple', config: { databaseURL: databaseUrl(key === 'dbUrl' ? value : decodeLegacy(value)) } };
    }
    return { mode: 'secure', config: validate(defaultConfig, defaultConfig.databaseURL) };
  }

  function makeLink(mode, url, text) {
    const link = new URL('index.html', location.href);
    if (mode === 'secure') {
      const config = parseConfig(text);
      if (!config.databaseURL) config.databaseURL = url;
      link.hash = 'wb=v1.' + encode(validate(config, url));
    } else {
      link.searchParams.set('dbUrl', databaseUrl(url));
    }
    return link.href;
  }

  async function connect(target) {
    const { mode, config } = target;
    const app = firebase.initializeApp(config, ['chatgpt', mode, config.projectId || '', new URL(config.databaseURL).hostname].join('-'));
    if (mode === 'secure') {
      const auth = app.auth();
      const user = await new Promise((resolve, reject) => {
        const stop = auth.onAuthStateChanged(user => { stop(); resolve(user); }, reject);
      });
      if (!user) await auth.signInAnonymously();
      window.firebaseAuth = auth;
    }
    return app.database();
  }
  return { resolve, makeLink, connect };
})();
