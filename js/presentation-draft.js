// 同步簡報各班級草稿：只在教師進入時讀取，變更後以局部更新保存。
(() => {
  class PresentationDraftController {
    constructor(manager) {
      this.manager = manager;
      this.classCode = window.currentClassCode || '';
      this.ref = typeof db !== 'undefined' && db ? db.ref('presentation_draft') : null;
      this.ready = false;
      this.loading = null;
      this.last = { slides: [], annotations: {}, currentSlideIndex: 0 };
      this.slideStorageKeys = {};
      this.slideKeySequence = 0;
      this.timer = null;
      this.saving = false;
      this.pending = false;
      this.failures = 0;
      this.resetRequested = false;
    }
    matchesScope() { return (window.currentClassCode || '') === this.classCode; }
    status(text) {
      const el = document.getElementById('presentationDraftStatus');
      if (el) el.textContent = text;
    }
    current() {
      return JSON.parse(JSON.stringify({ slides: this.manager.slides || [], annotations: this.manager.annotations || {}, currentSlideIndex: this.manager.currentSlideIndex || 0 }));
    }
    async ensureLoaded() {
      if (this.ready || this.loading || !this.manager.isTeacher() || this.manager.isRemoteBroadcastingActive || !this.ref || !this.matchesScope()) return this.loading;
      this.status('正在載入簡報暫存…');
      const initial = this.current();
      const before = JSON.stringify(initial);
      this.loading = (async () => {
        try {
          const snap = await this.ref.once('value');
          if (!this.matchesScope()) return;
          const data = snap.val();
          if (data && data.version !== 1) throw new Error('暫存格式不支援');
          const storedEntries = Object.entries(data?.slides || {}).filter(([, slide]) => slide?.id);
          this.slideStorageKeys = Object.fromEntries(storedEntries.map(([key, slide]) => [slide.id, key]));
          const byId = new Map(storedEntries.map(([, slide]) => [slide.id, slide]));
          const storedSlides = [];
          for (const id of data?.slideOrder || []) { if (byId.has(id)) { storedSlides.push(byId.get(id)); byId.delete(id); } }
          storedSlides.push(...byId.values());
          const restored = { slides: storedSlides, annotations: data?.annotations || {}, currentSlideIndex: Number(data?.currentSlideIndex) || 0 };
          this.last = JSON.parse(JSON.stringify(restored));
          const changed = before !== JSON.stringify(this.current());
          if (!changed && !this.resetRequested && initial.slides.length === 0 && !this.manager.isRemoteBroadcastingActive) {
            this.manager.slides = restored.slides;
            this.manager.annotations = restored.annotations;
            this.manager.currentSlideIndex = Math.max(0, Math.min(restored.currentSlideIndex, restored.slides.length - 1));
          } else if (!this.resetRequested && restored.slides.length && !this.manager.isRemoteBroadcastingActive) {
            const presentIds = new Set(this.manager.slides.map(slide => slide.id));
            const earlier = restored.slides.filter(slide => !presentIds.has(slide.id));
            this.manager.slides = earlier.concat(this.manager.slides);
            this.manager.annotations = { ...restored.annotations, ...this.manager.annotations };
            this.manager.currentSlideIndex += earlier.length;
          }
          this.ready = true;
          this.status(data ? '已載入簡報暫存' : '簡報將自動暫存');
          this.manager.render();
          if (changed || this.resetRequested) this.schedule();
        } catch (error) {
          console.warn('簡報暫存讀取失敗:', error);
          this.status('暫存讀取失敗，請重新進入簡報重試');
        } finally { this.loading = null; }
      })();
      return this.loading;
    }
    markReset() { this.resetRequested = true; }
    schedule() {
      if (!this.ready || !this.matchesScope() || !this.manager.isTeacher() || this.manager.isRemoteBroadcastingActive) return;
      this.pending = true;
      this.status('簡報暫存中…');
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.flush(), 500);
    }
    async flush() {
      if (!this.ready || !this.pending || this.saving || !this.matchesScope() || !this.manager.isTeacher() || this.manager.isRemoteBroadcastingActive) return;
      this.pending = false;
      this.saving = true;
      const next = this.current();
      const changes = {};
      const previous = this.last;
      const oldById = new Map(previous.slides.map(slide => [slide.id, slide]));
      const storageKeys = { ...this.slideStorageKeys };
      const nextIds = new Set(next.slides.map(slide => slide.id));
      for (const oldSlide of previous.slides) if (!nextIds.has(oldSlide.id) && storageKeys[oldSlide.id] !== undefined) {
        changes['slides/' + storageKeys[oldSlide.id]] = null; delete storageKeys[oldSlide.id];
      }
      for (const newSlide of next.slides) {
        const oldSlide = oldById.get(newSlide.id);
        const storageKey = storageKeys[newSlide.id] ?? ('page_' + Date.now().toString(36) + '_' + (++this.slideKeySequence));
        storageKeys[newSlide.id] = storageKey;
        if (!oldSlide || this.slideStorageKeys[newSlide.id] === undefined) { changes['slides/' + storageKey] = newSlide; continue; }
        for (const key of new Set([...Object.keys(oldSlide), ...Object.keys(newSlide)])) {
          if (JSON.stringify(oldSlide[key]) !== JSON.stringify(newSlide[key])) changes['slides/' + storageKey + '/' + key] = newSlide[key] === undefined ? null : newSlide[key];
        }
      }
      if (JSON.stringify(previous.slides.map(slide => slide.id)) !== JSON.stringify(next.slides.map(slide => slide.id))) changes.slideOrder = next.slides.map(slide => slide.id);
      const annotKeys = new Set([...Object.keys(previous.annotations), ...Object.keys(next.annotations)]);
      for (const key of annotKeys) {
        if (JSON.stringify(previous.annotations[key]) !== JSON.stringify(next.annotations[key])) changes['annotations/' + key] = next.annotations[key] ?? null;
      }
      if (previous.currentSlideIndex !== next.currentSlideIndex) changes.currentSlideIndex = next.currentSlideIndex;
      if (!Object.keys(changes).length) { this.saving = false; this.status('簡報暫存已是最新'); return; }
      changes.version = 1;
      changes.updatedAt = Date.now();
      try {
        await this.ref.update(changes);
        this.last = next;
        this.slideStorageKeys = storageKeys;
        this.failures = 0;
        this.resetRequested = false;
        this.status('簡報已自動暫存');
      } catch (error) {
        console.warn('簡報暫存寫入失敗:', error);
        this.failures += 1;
        this.status('自動暫存失敗，請檢查連線並匯出備份');
        this.pending = true;
      } finally {
        this.saving = false;
        if (this.pending && this.failures <= 3) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => this.flush(), this.failures ? 5000 * this.failures : 500);
        }
      }
    }
  }
  window.PresentationDraftController = PresentationDraftController;
})();
