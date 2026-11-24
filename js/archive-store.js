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
  // 僅在備份內轉換完整的內嵌教材，不變更資料庫中的原始記錄。
  async function normalizeExportPair(listValue,dataValue,kind){
    const map=value=>value&&typeof value==='object'&&!Array.isArray(value);
    const list=listValue??{},data=dataValue??{};
    const label=kind==='presentation'?'簡報教材':'白板歷程';
    if(!map(list)||!map(data))throw new Error(`${label}資料格式不正確，無法完整匯出`);
    const normalized={list:{},data:{}};
    for(const id of Object.keys(data)){if(!Object.prototype.hasOwnProperty.call(list,id))throw new Error(`${label}存在未對應至清單的內容（${id}），請先確認資料完整性`);}
    for(const [id,item] of Object.entries(list)){
      if(!map(item))throw new Error(`${label}項目格式不正確（${id}）`);
      const name=String(item.title||id);
      if(item.format==='zip-json-v1'){
        if(typeof data[id]!=='string'||!data[id])throw new Error(`${label}「${name}」缺少壓縮內容，請重新儲存此教材後再匯出`);
        if(data[id].length>9*1024*1024)throw new Error(`${label}「${name}」壓縮內容過大，無法製作可還原的備份`);
        normalized.list[id]={...item};normalized.data[id]=data[id];continue;
      }
      const inline=kind==='presentation'
        ? Object.prototype.hasOwnProperty.call(item,'slides') && item.slides!==null && typeof item.slides==='object'
        : map(item.canvases) && map(item.pages);
      if(!inline)throw new Error(`${label}「${name}」缺少完整內容，請重新儲存此教材後再匯出`);
      const metadata={...item};let content;
      if(kind==='presentation'){
        let slides=item.slides;if(!Array.isArray(slides)){const keys=Object.keys(slides);if(keys.some(key=>!/^\d+$/.test(key)))throw new Error(`${label}「${name}」的頁面順序格式不正確`);slides=keys.sort((a,b)=>Number(a)-Number(b)).map(key=>slides[key]);}
        if(slides.some(slide=>!map(slide)))throw new Error(`${label}「${name}」包含不完整頁面`);
        content={slides,annotations:item.annotations||{}};delete metadata.slides;delete metadata.annotations;
      }
      else{content={canvases:item.canvases,pages:item.pages};delete metadata.canvases;delete metadata.pages;}
      const packed=await pack(content);normalized.list[id]={...metadata,format:'zip-json-v1',contentBytes:packed.length};normalized.data[id]=packed;
    }
    return normalized;
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
    normalizeExportPair, pack, unpack
  };
})();
