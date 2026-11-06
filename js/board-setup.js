(() => {
  const host = document.querySelector('[data-board-setup]');
  if (!host) return;
  host.innerHTML = `
    <h3 class="board-substep-title"><span class="board-substep-marker">B</span>建立修正版白板連結</h3>
    <form>
      <label>連線方式<select name="mode">
        <option value="secure">安全模式（專案匿名登入）</option>
        <option value="simple">簡易模式（只貼資料庫網址）</option>
      </select></label>
      <div class="board-mode-summary">
        <p><strong>簡易模式</strong>　只需資料庫網址。採用公開規則時，知道網址的人可能讀寫資料。</p>
        <p><strong>安全模式</strong>　加入 Firebase Web App 設定並啟用匿名登入；任何取得設定的人都可能登入並讀寫，規則不區分老師與學生。</p>
      </div>
      <label>Realtime Database 網址<span class="board-url-hint">💡 請貼上剛才複製的資料庫 URL 網址</span><input required type="url" name="database" placeholder="https://…firebasedatabase.app"></label>
      <details class="board-guide">
        <summary>查看 Firebase 設定啟用匿名登入與網頁應用程式操作畫面</summary>
        <div class="board-guide-content">
          <section data-guide-secure hidden>
            <h3>啟用匿名登入</h3>
            <p>在建立好 Realtime Database 的同一個 Firebase 專案中，開啟 Authentication。</p>
            <figure><figcaption>1. 在左側選單點選「安全性」，再選擇「Authentication」。</figcaption><img src="images/guide/board-setup-2.webp" alt="在安全性選單中選擇 Authentication" loading="lazy"></figure>
            <figure><figcaption>2. 第一次設定時，點選「開始使用」。若已設定過，請到「登入方式」頁籤。</figcaption><img src="images/guide/board-setup-3.webp" alt="Authentication 首次設定的開始使用按鈕" loading="lazy"></figure>
            <figure><figcaption>3. 在登入資訊提供者中選擇「匿名」。</figcaption><img src="images/guide/board-setup-4.webp" alt="在登入資訊提供者選擇匿名" loading="lazy"></figure>
            <figure><figcaption>4. 開啟「啟用」，再點選「儲存」。</figcaption><img src="images/guide/board-setup-5.webp" alt="啟用匿名登入並儲存" loading="lazy"></figure>
            <h3>取得 Firebase Web App 設定</h3>
            <figure><figcaption>1. 點選左側「設定」，再進入「專案設定」的「一般」。</figcaption><img src="images/guide/board-setup-6.webp" alt="在設定選單中開啟專案設定一般頁面" loading="lazy"></figure>
            <figure><figcaption>2. 往下找到「您的應用程式」。若尚未新增網頁應用程式，點選網頁圖示 &lt;/&gt;；若已有，選擇現有的網頁應用程式。</figcaption><img src="images/guide/board-setup-7.webp" alt="在您的應用程式選擇新增網頁應用程式" loading="lazy"></figure>
            <figure><figcaption>3. 輸入方便辨識的應用程式名稱，點選「註冊應用程式」。</figcaption><img src="images/guide/board-setup-8.webp" alt="輸入應用程式名稱並註冊應用程式" loading="lazy"></figure>
            <figure><figcaption>4. 複製完整的 <code>const firebaseConfig = { … };</code>，貼到下方「Firebase Web App 設定」。設定中若沒有 databaseURL，請另外在下方填入資料庫網址。</figcaption><img src="images/guide/board-setup-config-v2.webp" alt="複製 firebaseConfig 設定物件" loading="lazy"></figure>
          </section>
          <section data-guide-simple-rule>
            <h3>發布資料庫規則</h3>
            <p>在 Firebase 選擇 Realtime Database 的「規則」頁籤。先按下方的「複製資料庫規則」，再貼到規則編輯區並點選「發布」。</p>
            <figure><figcaption>1. 使用下方簡易模式產生的規則。</figcaption><img src="images/guide/board-setup-1.webp" alt="Realtime Database 規則頁面，將簡易模式規則貼入編輯區再按發布" loading="lazy"></figure>
          </section>
        </div>
      </details>
      <label data-config>Firebase Web App 設定
        <textarea name="config" rows="6" required placeholder="貼上 Firebase 控制台的 firebaseConfig 物件"></textarea>
      </label>
      <p data-help></p>
      <p>請將以下規則貼到 Firebase 的 Realtime Database「規則」頁籤並發布。規則會套用至資料庫的各個頂層項目。</p>
      <details data-guide-secure-rule class="board-guide" hidden><summary>查看發布資料庫規則的操作畫面</summary><div class="board-guide-content">
        <h3>發布資料庫規則</h3>
        <p>在 Firebase 選擇 Realtime Database 的「規則」頁籤。按下方「複製資料庫規則」，貼到規則編輯區後，再點選「發布」。</p>
        <figure><figcaption>1. 請使用下方安全模式產生的規則。</figcaption><img src="images/guide/board-setup-secure-rules.webp" alt="Realtime Database 規則頁面，貼上匿名登入規則後按發布" loading="lazy"></figure>
      </div></details>
      <label>資料庫規則<textarea data-rules rows="8" readonly aria-label="資料庫規則"></textarea></label>
      <div class="board-rule-action"><button type="button" data-copy-rules class="presentation-tool-btn">複製資料庫規則</button></div>
      <div class="board-generate">
        <button type="submit" class="presentation-tool-btn">🚀 產生白板連結</button>
      </div>
      <p role="status" data-status></p>
    </form>
    <section class="board-link-result" data-result hidden>
      <div class="board-qr-grid">
        <div class="board-qr-card">
          <div class="board-qr-title">🌐 原始長連結 QR Code</div>
          <div class="board-qr-image" data-qr></div>
        </div>
        <div class="board-qr-card board-qr-card-accent">
          <div class="board-qr-title">⚡ 專屬短網址 QR Code</div>
          <div class="board-qr-image" data-short-qr></div>
        </div>
      </div>
      <label class="board-link-label">🌐 原始長連結</label>
      <div class="board-link-row">
        <input readonly data-url aria-label="原始長連結">
        <button type="button" data-copy class="presentation-tool-btn">📋 複製長連結</button>
      </div>
      <label class="board-link-label board-link-label-accent">⚡ 專屬短網址（推薦手機輸入或掃描）</label>
      <div class="board-link-row">
        <input readonly data-short-url aria-label="專屬短網址" placeholder="正在產生短網址…">
        <button type="button" data-copy-short class="presentation-tool-btn active" disabled>📋 複製短網址</button>
      </div>
      <p data-short-status role="status"></p>
      <a data-open class="presentation-tool-btn">開啟修正版白板</a>
    </section>`;
  document.querySelectorAll('.board-step-disclosure').forEach((step) => {
    const button = step.querySelector('.board-collapse-btn');
    if (!button) return;
    button.addEventListener('click', () => {
      step.open = false;
      const summary = step.querySelector('summary');
      summary.focus({ preventScroll: true });
      summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  const form = host.querySelector('form');
  const { mode, config, database } = form.elements;
  const result = host.querySelector('[data-result]');
  const status = host.querySelector('[data-status]');
  const shortInput = host.querySelector('[data-short-url]');
  const shortButton = host.querySelector('[data-copy-short]');
  const shortStatus = host.querySelector('[data-short-status]');
  const shortQr = host.querySelector('[data-short-qr]');
  const shortCache = new Map();
  let generation = 0;

  function drawQr(container, text) {
    container.replaceChildren();
    try {
      new QRCode(container, { text, width: 160, height: 160, correctLevel: QRCode.CorrectLevel.L });
    } catch {
      container.textContent = '無法顯示 QR Code，請使用連結。';
    }
  }

  async function createShortUrl(url) {
    if (shortCache.has(url)) return shortCache.get(url);
    const response = await fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(url));
    if (!response.ok) throw new Error('無法建立短網址');
    const data = await response.json();
    const shortUrl = new URL(data.shorturl);
    if (shortUrl.protocol !== 'https:' || shortUrl.hostname !== 'is.gd') throw new Error('短網址格式有誤');
    const lookup = await fetch('https://is.gd/forward.php?format=json&shorturl=' + encodeURIComponent(shortUrl.href));
    if (!lookup.ok) throw new Error('無法核對短網址');
    const resolved = await lookup.json();
    if (!resolved.url || new URL(resolved.url).href !== new URL(url).href) throw new Error('短網址的目標不一致');
    shortCache.set(url, shortUrl.href);
    return shortUrl.href;
  }
  function refresh() {
    const secure = mode.value === 'secure';
    host.querySelector('[data-config]').hidden = !secure;
    host.querySelector('[data-guide-secure]').hidden = !secure;
    host.querySelector('[data-guide-simple-rule]').hidden = secure;
    host.querySelector('[data-guide-secure-rule]').hidden = !secure;
    config.required = secure;
    host.querySelector('[data-help]').textContent = secure
      ? '請在自己的專案啟用 Authentication 的匿名登入並貼上網頁應用程式的公開設定。以下規則允許該專案的已登入者讀寫資料；任何取得專案設定的人都可能匿名登入，規則無法區分老師與學生。'
      : '請自行設定資料庫規則。若開放公開讀寫，知道網址的人就可能讀取、修改或刪除資料。';
    const access = secure ? 'auth != null' : true;
    host.querySelector('[data-rules]').value = JSON.stringify({
      rules: { '$node': { '.read': access, '.write': access } }
    }, null, 2);
    generation += 1;
    status.textContent = '';
    shortStatus.textContent = '';
    shortInput.value = '';
    shortButton.disabled = true;
    shortQr.replaceChildren();
    result.hidden = true;
  }
  form.addEventListener('input', refresh);
  mode.addEventListener('change', refresh);
  refresh();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    try {
      const url = BoardConnection.makeLink(mode.value, database.value, config.value);
      host.querySelector('[data-url]').value = url;
      host.querySelector('[data-open]').href = url;
      result.hidden = false;
      status.textContent = '已產生連結。請開啟白板驗證連線。';
      drawQr(host.querySelector('[data-qr]'), url);
      const requestId = ++generation;
      shortInput.value = '';
      shortButton.disabled = true;
      shortQr.replaceChildren();
      shortStatus.textContent = '正在透過 is.gd 產生短網址…';
      try {
        const shortUrl = await createShortUrl(url);
        if (requestId !== generation) return;
        shortInput.value = shortUrl;
        shortButton.disabled = false;
        shortStatus.textContent = '';
        drawQr(shortQr, shortUrl);
      } catch (error) {
        if (requestId !== generation) return;
        shortStatus.textContent = '短網址產生或驗證失敗，請使用上方完整連結。';
      }
    } catch (error) { result.hidden = true; status.textContent = error.message; }
  });
  host.querySelector('[data-copy-rules]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(host.querySelector('[data-rules]').value);
      status.textContent = '已複製資料庫規則。';
    } catch {
      status.textContent = '複製失敗，請手動選取上方規則。';
    }
  });
  shortButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shortInput.value);
      shortStatus.textContent = '已複製短網址。';
    } catch {
      shortInput.select();
      shortStatus.textContent = '已選取短網址，請使用裝置的複製功能。';
    }
  });
  host.querySelector('[data-copy]').addEventListener('click', async () => {
    const input = host.querySelector('[data-url]');
    try {
      await navigator.clipboard.writeText(input.value);
      status.textContent = '已複製白板連結。';
    } catch {
      input.select();
      status.textContent = '已選取連結，請使用裝置的複製功能。';
    }
  });
})();