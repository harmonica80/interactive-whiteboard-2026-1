// 雲端歷程：清單與壓縮內容分離，兩部分以單次多路徑更新保持一致。
(() => {
  let zipPromise;
  async function zipLibrary() {
    if (window.JSZip) return window.JSZip;
    if (!zipPromise) zipPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = () => window.JSZip ? resolve(window.JSZip) : reject(new Error('ZIP 元件無法使用'));
      script.onerror = () => reject(new Error('無法載入 ZIP 元件，請檢查網路連線'));
      document.head.appendChild(script);
    }).catch(error => { zipPromise = null; throw error; });
    return zipPromise;
  }
  async function pack(content) {
    const JSZip = await zipLibrary();
    const zip = new JSZip();
    zip.file('content.json', JSON.stringify(content));
    const data = await zip.generateAsync({ type: 'base64', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    // RTDB 單一字串上限 10 MB；保留餘裕，避免超過 SDK 單次寫入限制。
    if (data.length > 9 * 1024 * 1024) throw new Error('壓縮後的歷程仍超過資料庫可儲存的大小，請減少圖片或頁數後重試。');
    return data;
  }
  async function unpack(data) {
    if (typeof data !== 'string' || !data) throw new Error('找不到壓縮歷程內容');
    const JSZip = await zipLibrary();
    const zip = await JSZip.loadAsync(data, { base64: true, checkCRC32: true });
    const entry = zip.file('content.json');
    if (!entry) throw new Error('歷程內容格式不正確');
    return JSON.parse(await entry.async('string'));
  }
  window.BoardArchiveStore = {
    async save(root, listPath, dataPath, id, metadata, content) {
      const packed = await pack(content);
      const summary = { ...metadata, format: 'zip-json-v1', contentBytes: packed.length };
      await root.update({ [`${listPath}/${id}`]: summary, [`${dataPath}/${id}`]: packed });
      return summary;
    },
    async load(root, dataPath, id) {
      const snapshot = await root.child(dataPath).child(id).once('value');
      return unpack(snapshot.val());
    },
    async remove(root, listPath, dataPath, id) {
      await root.update({ [`${listPath}/${id}`]: null, [`${dataPath}/${id}`]: null });
    },
    async removeAll(root, listPath, dataPath) {
      await root.update({ [listPath]: null, [dataPath]: null });
    },
    pack, unpack
  };
})();
