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
        <div class="board-hint-heading">連線方式說明</div>
        <p><strong>簡易模式</strong>　只需資料庫網址。採用公開規則時，知道網址的人可能讀寫資料。</p>
        <p><strong>安全模式</strong>　加入 Firebase Web App 設定，並啟用匿名登入；已登入者可讀寫資料。</p>
      </div>
      <label>Realtime Database 網址<span class="board-url-hint">💡 請貼上剛才複製的資料庫 URL 網址</span><input required type="url" name="database" placeholder="https://…firebasedatabase.app"></label>
      <details class="board-guide">
        <summary>查看 Firebase 設定啟用匿名登入與網頁應用程式操作畫面</summary>
        <div class="board-guide-content">
          <section data-guide-secure hidden>
            <h3>啟用匿名登入</h3>
            <p>在建立好 Realtime Database 的同一個 Firebase 專案中，開啟 Authentication。</p>
            <figure><img src="images/guide/board-setup-2.png" alt="在安全性選單中選擇 Authentication" loading="lazy"><figcaption>在左側選單點選「安全性」，再選擇「Authentication」。</figcaption></figure>
            <figure><img src="images/guide/board-setup-3.png" alt="Authentication 首次設定的開始使用按鈕" loading="lazy"><figcaption>第一次設定時，點選「開始使用」。若已設定過，請到「登入方式」頁籤。</figcaption></figure>
            <figure><img src="images/guide/board-setup-4.png" alt="在登入資訊提供者選擇匿名" loading="lazy"><figcaption>在登入資訊提供者中選擇「匿名」。</figcaption></figure>
            <figure><img src="images/guide/board-setup-5.png" alt="啟用匿名登入並儲存" loading="lazy"><figcaption>開啟「啟用」，再點選「儲存」。</figcaption></figure>
            <h3>取得 Firebase Web App 設定</h3>
            <figure><img src="images/guide/board-setup-6.png" alt="在設定選單中開啟專案設定一般頁面" loading="lazy"><figcaption>點選左側「設定」，再進入「專案設定」的「一般」。</figcaption></figure>
            <figure><img src="images/guide/board-setup-7.png" alt="在您的應用程式選擇新增網頁應用程式" loading="lazy"><figcaption>往下找到「您的應用程式」。若尚未新增網頁應用程式，點選網頁圖示 &lt;/&gt;；若已有，選擇現有的網頁應用程式。</figcaption></figure>
            <figure><img src="images/guide/board-setup-8.png" alt="輸入應用程式名稱並註冊應用程式" loading="lazy"><figcaption>輸入方便辨識的應用程式名稱，點選「註冊應用程式」。</figcaption></figure>
            <figure><img src="images/guide/board-setup-config-updated.png" alt="複製 firebaseConfig 設定物件" loading="lazy"><figcaption>複製完整的 <code>const firebaseConfig = { … };</code>，貼到下方「Firebase Web App 設定」。設定中若沒有 databaseURL，請另外在下方填入資料庫網址。</figcaption></figure>
          </section>
          <section data-guide-simple-rule>
            <h3>發布資料庫規則</h3>
            <p>在 Firebase 選擇 Realtime Database 的「規則」頁籤。先按下方的「複製資料庫規則」，再貼到規則編輯區並點選「發布」。</p>
            <figure><img src="images/guide/board-setup-1.png" alt="Realtime Database 規則頁面，將簡易模式規則貼入編輯區再按發布" loading="lazy"><figcaption>使用下方簡易模式產生的規則。</figcaption></figure>
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
        <p>在 Firebase 選擇 Realtime Database 的「規則」頁籤。按上方「複製資料庫規則」，貼到規則編輯區後，再點選「發布」。</p>
        <figure><img src="images/guide/board-setup-secure-rules.png" alt="Realtime Database 規則頁面，貼上匿名登入規則後按發布" loading="lazy"><figcaption>請使用上方安全模式產生的規則。</figcaption></figure>
      </div></details>
      <label>資料庫規則<textarea data-rules rows="8" readonly aria-label="資料庫規則"></textarea></label>
      <div class="board-rule-action"><button type="button" data-copy-rules class="presentation-tool-btn">複製資料庫規則</button></div>
      <div class="board-generate">
        <button type="submit" class="presentation-tool-btn">🚀 產生白板連結</button>
      </div>
      <p role="status" data-status></p>
    </form>
    <section data-result hidden>
      <label>師生共用連結<input readonly data-url></label>
      <a data-open class="presentation-tool-btn">開啟修正版白板</a>
      <button type="button" data-copy class="presentation-tool-btn">複製連結</button>
      <div data-qr></div>
    </section>`;
  const form = host.querySelector('form');
  const { mode, config, database } = form.elements;
  const result = host.querySelector('[data-result]');
  const status = host.querySelector('[data-status]');
  function refresh() {
    const secure = mode.value === 'secure';
    host.querySelector('[data-config]').hidden = !secure;
    host.querySelector('[data-guide-secure]').hidden = !secure;
    host.querySelector('[data-guide-simple-rule]').hidden = secure;
    host.querySelector('[data-guide-secure-rule]').hidden = !secure;
    config.required = secure;
    host.querySelector('[data-help]').textContent = secure
      ? '請在自己的專案啟用 Authentication 的匿名登入。規則允許該專案的已登入使用者讀寫，老師和學生共用。請貼上網頁應用程式的公開設定。'
      : '請自行設定資料庫規則。若開放公開讀寫，知道網址的人就可能讀取、修改或刪除資料。';
    const access = secure ? 'auth != null' : true;
    host.querySelector('[data-rules]').value = JSON.stringify({
      rules: { '$node': { '.read': access, '.write': access } }
    }, null, 2);
    status.textContent = '';
    result.hidden = true;
  }
  form.addEventListener('input', refresh);
  mode.addEventListener('change', refresh);
  refresh();
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const url = BoardConnection.makeLink(mode.value, database.value, config.value);
      host.querySelector('[data-url]').value = url;
      host.querySelector('[data-open]').href = url;
      result.hidden = false;
      status.textContent = '已產生連結。請開啟白板驗證連線。';
      const qr = host.querySelector('[data-qr]');
      qr.replaceChildren();
      try {
        new QRCode(qr, { text: url, width: 240, height: 240, correctLevel: QRCode.CorrectLevel.L });
      } catch { qr.textContent = '無法顯示 QR Code，請使用上方連結。'; }
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