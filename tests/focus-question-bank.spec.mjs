import test, { expect } from '@playwright/test'

test.describe('Focus Question Bank & Music Manager Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('Focus Question Bank Manager loads properly and initializes default pools', async ({ page }) => {
    const result = await page.evaluate(() => {
      if (!window.focusQB) return { loaded: false }
      return {
        loaded: true,
        classicsCount: window.focusQB.getPool('classicsQuiz').length,
        hasYangShen: window.focusQB.getPool('classicsQuiz').some(q => q.quote?.includes('滾滾長江東逝水')),
        charTestCount: window.focusQB.getPool('characterTest').length,
        crosswordCount: window.focusQB.getPool('characterCrossword').length,
        unitedWordsCount: window.focusQB.getPool('characterUnitedWords').length,
        songQuizCount: window.focusQB.getPool('songQuiz').length,
        hasMoonSong: window.focusQB.getPool('songQuiz').some(q => q.title?.includes('月亮代表我的心'))
      }
    })

    expect(result.loaded).toBe(true)
    expect(result.classicsCount).toBeGreaterThanOrEqual(200)
    expect(result.hasYangShen).toBe(true)
    expect(result.charTestCount).toBeGreaterThanOrEqual(500)
    expect(result.crosswordCount).toBeGreaterThanOrEqual(100)
    expect(result.unitedWordsCount).toBeGreaterThanOrEqual(150)
    expect(result.songQuizCount).toBeGreaterThanOrEqual(30)
    expect(result.hasMoonSong).toBe(true)
  })

  test('Focus Question Bank CSV Template Generator contains UTF-8 BOM and correct headers', async ({ page }) => {
    const csvTemplates = await page.evaluate(() => {
      const qb = window.focusQB
      return {
        classics: qb.getCSVTemplateContent('classicsQuiz'),
        charTest: qb.getCSVTemplateContent('characterTest'),
        crossword: qb.getCSVTemplateContent('characterCrossword'),
        unitedWords: qb.getCSVTemplateContent('characterUnitedWords'),
        songQuiz: qb.getCSVTemplateContent('songQuiz')
      }
    })

    // Classics Quiz CSV Header
    expect(csvTemplates.classics).toContain('題型,題目問句,名句引言,作品名,作者或主角,朝代,選項A,選項B,選項C,選項D,標準答案,原典全文')
    expect(csvTemplates.classics).toContain('好學近乎知')

    // Character Test CSV Header
    expect(csvTemplates.charTest).toContain('解答正字,注音,題幹提示,字典關聯詞')
    expect(csvTemplates.charTest).toContain('畫蛇添（　）')

    // Crossword CSV Header
    expect(csvTemplates.crossword).toContain('中心正字,注音,周圍字1(上或前),周圍字2(下或前),周圍字3(左或後),周圍字4(右或後),組成詞語說明')
    expect(csvTemplates.crossword).toContain('天氣、天空')

    // United Words CSV Header
    expect(csvTemplates.unitedWords).toContain('解答詞語,散裝部件(以空格分開),詞語解釋提示')
    expect(csvTemplates.unitedWords).toContain('明月')

    // Song Quiz CSV Header
    expect(csvTemplates.songQuiz).toContain('標籤分組,歌曲名稱(正解),演唱者,YouTube網址,開始播放秒數,播放秒數,干擾選項1,干擾選項2,干擾選項3,提示說明')
    expect(csvTemplates.songQuiz).toContain('月亮代表我的心')
  })

  test('Focus Question Bank imports CSV data correctly', async ({ page }) => {
    const importResult = await page.evaluate(() => {
      const qb = window.focusQB
      const sampleCsv = `解答正字,注音,題幹提示,字典關聯詞
鳳,ㄈㄥˋ,龍（　）呈祥,龍鳳呈祥
凰,ㄏㄨㄤˊ,鳳（　）于飛,鳳凰于飛`

      const count = qb.importPool('characterTest', sampleCsv, 'replace')
      const pool = qb.getPool('characterTest')
      const isCustom = qb.isCustomPool('characterTest')

      // reset back
      qb.resetPool('characterTest')

      return {
        count,
        poolLength: pool.length,
        firstChar: pool[0].char,
        firstClue: pool[0].clue,
        isCustom
      }
    })

    expect(importResult.count).toBe(2)
    expect(importResult.poolLength).toBe(2)
    expect(importResult.firstChar).toBe('鳳')
    expect(importResult.firstClue).toBe('龍（　）呈祥')
    expect(importResult.isCustom).toBe(true)
  })

  test('Focus Question Bank imports Song Quiz CSV and supports tag filtering', async ({ page }) => {
    const songQuizResult = await page.evaluate(() => {
      const qb = window.focusQB
      const sampleSongCsv = `標籤分組,歌曲名稱(正解),演唱者,YouTube網址,開始播放秒數,播放秒數,干擾選項1,干擾選項2,干擾選項3,提示說明
校園民歌,外婆的澎湖灣,潘安邦,https://www.youtube.com/watch?v=sample1,10,15,鄉間的小路,橄欖樹,童年,澎湖灣澎湖灣外婆的澎湖灣
動漫特攝,殘酷天使的行動綱領,高橋洋子,https://www.youtube.com/watch?v=sample2,5,15,魂之輪迴,紅蓮華,前前前世,EVA片頭曲`

      const count = qb.importPool('songQuiz', sampleSongCsv, 'replace')
      const pool = qb.getPool('songQuiz')
      const isCustom = qb.isCustomPool('songQuiz')
      const allTags = qb.getAllTags('songQuiz')

      // Filter by tag
      qb.selectedTagFilters.songQuiz = '校園民歌'
      const campusFiltered = qb.searchPool('songQuiz', '')

      // Reset filter and pool
      qb.selectedTagFilters.songQuiz = 'all'
      qb.resetPool('songQuiz')

      return {
        count,
        poolLength: pool.length,
        firstTitle: pool[0].title,
        firstTag: pool[0].tag,
        isCustom,
        allTags,
        campusFilteredCount: campusFiltered.length,
        campusFilteredTitle: campusFiltered[0]?.title
      }
    })

    expect(songQuizResult.count).toBe(2)
    expect(songQuizResult.poolLength).toBe(2)
    expect(songQuizResult.firstTitle).toBe('外婆的澎湖灣')
    expect(songQuizResult.firstTag).toBe('校園民歌')
    expect(songQuizResult.isCustom).toBe(true)
    expect(songQuizResult.allTags).toContain('校園民歌')
    expect(songQuizResult.allTags).toContain('動漫特攝')
    expect(songQuizResult.campusFilteredCount).toBe(1)
    expect(songQuizResult.campusFilteredTitle).toBe('外婆的澎湖灣')
  })

  test('Timer Music Manager loads properly and supports search & CRUD', async ({ page }) => {
    const musicResult = await page.evaluate(() => {
      const mm = window.timerMusicManager
      if (!mm) return { loaded: false }

      const defaultList = mm.getPlaylist()
      const searchCanon = mm.searchPlaylist('卡農')

      // Add custom track
      mm.saveTrack({
        category: '流行抒情',
        title: '🎵 測試背景音樂',
        url: 'https://example.com/test.mp3'
      })

      const afterAddList = mm.getPlaylist()
      const isCustom = mm.isCustomPlaylist()

      // Reset
      mm.resetPlaylist()
      const afterResetList = mm.getPlaylist()

      return {
        loaded: true,
        defaultCount: defaultList.length,
        searchCanonCount: searchCanon.length,
        afterAddCount: afterAddList.length,
        isCustom,
        afterResetCount: afterResetList.length
      }
    })

    expect(musicResult.loaded).toBe(true)
    expect(musicResult.defaultCount).toBeGreaterThanOrEqual(10)
    expect(musicResult.searchCanonCount).toBeGreaterThan(0)
    expect(musicResult.afterAddCount).toBe(musicResult.defaultCount + 1)
    expect(musicResult.isCustom).toBe(true)
    expect(musicResult.afterResetCount).toBe(musicResult.defaultCount)
  })

  test('Timer Music Manager Modal opens and functions correctly', async ({ page }) => {
    // Open music modal
    await page.evaluate(() => {
      window.timerMusicManager.openModal()
    })

    const modal = page.locator('#modal-timer-music-manager')
    await expect(modal).toHaveClass(/active/)
    await expect(modal).toBeVisible()

    const cardsCount = await page.locator('#timerMusicListContainer .timer-music-item-card').count()
    expect(cardsCount).toBeGreaterThan(0)

    // Filter in search box
    await page.fill('#timerMusicSearchInput', '莫札特')
    const filteredCount = await page.locator('#timerMusicListContainer .timer-music-item-card').count()
    expect(filteredCount).toBeGreaterThan(0)

    // Close modal
    await page.click('#modal-timer-music-manager button:has-text("完成關閉")')
    await expect(modal).not.toHaveClass(/active/)
  })

  test('Image, Question, and Video modals navigate within their assigned folder group in correct display order', async ({ page }) => {
    const navResult = await page.evaluate(() => {
      const app = window.app
      if (!app) return { ok: false }

      // Set mock folders and items
      app.imageFolders = [
        { id: 'f1', name: '髮型與造型設計' },
        { id: 'f2', name: '3D建築' }
      ]
      app.images = [
        { id: 'img1', filename: 'hair1.png', folderId: 'f1', timestamp: 1000 },
        { id: 'img2', filename: 'arch1.png', folderId: 'f2', timestamp: 2000 },
        { id: 'img3', filename: 'hair2.png', folderId: 'f1', timestamp: 3000 },
        { id: 'img4', filename: 'unassigned1.png', timestamp: 4000 }
      ]

      const f1List = app.getNavigableImageList('img1')
      const f2List = app.getNavigableImageList('img2')
      const unassignedList = app.getNavigableImageList('img4')

      return {
        ok: true,
        f1Ids: f1List.map(img => img.id),
        f2Ids: f2List.map(img => img.id),
        unassignedIds: unassignedList.map(img => img.id)
      }
    })

    expect(navResult.ok).toBe(true)
    expect(navResult.f1Ids).toEqual(['img1', 'img3'])
    expect(navResult.f2Ids).toEqual(['img2'])
    expect(navResult.unassignedIds).toEqual(['img4'])
  })

  test('Question Input is a multi-line textarea supporting newlines and left-aligned text', async ({ page }) => {
    // Check question input is textarea
    const tagName = await page.locator('#questionInput').evaluate(el => el.tagName.toLowerCase())
    expect(tagName).toBe('textarea')

    // Test filling multi-line question
    await page.fill('#questionInput', '第一行問題\n第二行問題\n第三行問題')
    const val = await page.inputValue('#questionInput')
    expect(val).toContain('\n')

    // Verify CSS styles
    const styles = await page.locator('#questionInput').evaluate(el => {
      const computed = window.getComputedStyle(el)
      return {
        textAlign: computed.textAlign,
        whiteSpace: computed.whiteSpace
      }
    })
    expect(styles.textAlign).toBe('left')
    expect(styles.whiteSpace).toContain('pre-wrap')
  })

  test('Image modal zoomInfo badge is positioned on the right side', async ({ page }) => {
    const zoomInfoRight = await page.locator('#zoomInfo').evaluate(el => {
      const computed = window.getComputedStyle(el)
      return {
        position: computed.position,
        right: computed.right,
        left: computed.left
      }
    })
    expect(zoomInfoRight.position).toBe('absolute')
    expect(zoomInfoRight.right).toBe('15px')
  })

  test('Folder group collapse automatically closes other folders when opening a new folder', async ({ page }) => {
    const accordionResult = await page.evaluate(() => {
      const app = window.app
      if (!app) return { ok: false }

      // Open folder 1
      app.toggleFolderCollapse('folder-1')
      const afterFirstOpen = Array.from(app.expandedFolders)

      // Open folder 2
      app.toggleFolderCollapse('folder-2')
      const afterSecondOpen = Array.from(app.expandedFolders)

      // Close folder 2
      app.toggleFolderCollapse('folder-2')
      const afterClose = Array.from(app.expandedFolders)

      return {
        ok: true,
        afterFirstOpen,
        afterSecondOpen,
        afterClose
      }
    })

    expect(accordionResult.ok).toBe(true)
    expect(accordionResult.afterFirstOpen).toEqual(['folder-1'])
    expect(accordionResult.afterSecondOpen).toEqual(['folder-2'])
    expect(accordionResult.afterClose).toEqual([])
  })

  test('Question card text has 5-line clamping with ellipsis applied', async ({ page }) => {
    // Set a question with 10 lines
    await page.evaluate(() => {
      const app = window.app
      if (app) {
        app.questions = [{
          id: 'q-long-1',
          text: '第1行\n第2行\n第3行\n第4行\n第5行\n第6行\n第7行\n第8行\n第9行\n第10行',
          user: '測試者',
          timestamp: Date.now()
        }]
        app.renderQuestions()
      }
    })

    const textEl = page.locator('#questionList .question-item .text').first()
    const clampStyles = await textEl.evaluate(el => {
      const computed = window.getComputedStyle(el)
      return {
        webkitLineClamp: computed.webkitLineClamp || computed.lineClamp,
        overflow: computed.overflow,
        textOverflow: computed.textOverflow
      }
    })

    expect(clampStyles.webkitLineClamp).toBe('5')
    expect(clampStyles.overflow).toBe('hidden')
  })

  test('Timer music manager includes 10 Taiwanese classical piano songs in default playlist', async ({ page }) => {
    const musicCheck = await page.evaluate(() => {
      const mm = window.timerMusicManager
      if (!mm) return { ok: false }
      const list = mm.getDefaultPlaylist()
      const twSongs = list.filter(item => item.category === '台語經典')
      return {
        ok: true,
        totalCount: list.length,
        twCount: twSongs.length,
        firstSongTitle: twSongs[0] ? twSongs[0].title : '',
        lastSongTitle: twSongs[twSongs.length - 1] ? twSongs[twSongs.length - 1].title : ''
      }
    })

    expect(musicCheck.ok).toBe(true)
    expect(musicCheck.totalCount).toBe(21)
    expect(musicCheck.twCount).toBe(10)
    expect(musicCheck.firstSongTitle).toContain('黃昏的故鄉')
    expect(musicCheck.lastSongTitle).toContain('繁華攏是夢')
  })

  test('Teacher shares text is left aligned and preserves line breaks', async ({ page }) => {
    await page.evaluate(() => {
      const app = window.app
      if (app) {
        app.shares = [{
          id: 'share-test-1',
          type: 'text',
          content: '第一行教學叮嚀\n第二行作業提示\n第三行補充說明',
          timestamp: Date.now()
        }]
        app.renderTeacherShares()
      }
    })

    const shareText = page.locator('#teacherSharesContainer .share-item-content-text').first()
    const styles = await shareText.evaluate(el => {
      const computed = window.getComputedStyle(el)
      return {
        textAlign: computed.textAlign,
        whiteSpace: computed.whiteSpace
      }
    })

    expect(styles.textAlign).toBe('left')
    expect(styles.whiteSpace).toContain('pre-wrap')
  })

  test('Classics quiz question pool includes Yue Fei and Su Shi new default poems', async ({ page }) => {
    const classicsCheck = await page.evaluate(() => {
      const pool = window.CLASSICS_QUIZ_POOL || []
      const yueFei = pool.find(item => item.work && item.work.includes('滿江紅'))
      const suShi = pool.find(item => item.work && item.work.includes('定風波'))
      const liuYong = pool.find(item => item.work && item.work.includes('蝶戀花'))
      return {
        hasPool: pool.length > 0,
        hasYueFei: !!yueFei,
        hasSuShi: !!suShi,
        hasLiuYong: !!liuYong
      }
    })

    expect(classicsCheck.hasPool).toBe(true)
    expect(classicsCheck.hasYueFei).toBe(true)
    expect(classicsCheck.hasSuShi).toBe(true)
    expect(classicsCheck.hasLiuYong).toBe(true)
  })

  test('Lucky wheel has non-duplicate picking checkbox and clear history button', async ({ page }) => {
    const labelText = await page.locator('label:has(#chkRemoveWinner)').textContent()
    expect(labelText).toContain('不重複抽人')

    const clearCheck = await page.evaluate(() => {
      const app = window.app
      if (!app) return { ok: false }
      app.addWheelHistory('王小明')
      const beforeClear = document.getElementById('wheelHistoryList').children.length
      app.clearWheelHistory()
      const afterClear = document.getElementById('wheelHistoryList').textContent
      return {
        ok: true,
        beforeClear,
        afterClear
      }
    })

    expect(clearCheck.ok).toBe(true)
    expect(clearCheck.beforeClear).toBe(1)
    expect(clearCheck.afterClear).toContain('尚無記錄')
  })

  test('Clearing wheel history restores original names and adds picked students back', async ({ page }) => {
    const restoreCheck = await page.evaluate(() => {
      const app = window.app
      if (!app) return { ok: false }
      const origRef = window.db ? window.db.ref : null
      if (window.db) {
        window.db.ref = () => ({ set: () => Promise.resolve(), on: () => {} })
      }
      app.isAdmin = true
      app.wheelOriginalNames = ['測試生A', '測試生B', '測試生C', '測試生D']
      app.wheelNames = ['測試生B', '測試生C']
      app.clearWheelHistory()
      const res = {
        ok: true,
        restoredCount: app.wheelNames.length,
        restoredNames: [...app.wheelNames]
      }
      if (window.db && origRef) window.db.ref = origRef
      return res
    })

    expect(restoreCheck.ok).toBe(true)
    expect(restoreCheck.restoredCount).toBe(4)
    expect(restoreCheck.restoredNames).toEqual(['測試生A', '測試生B', '測試生C', '測試生D'])
  })

  test('Classics quiz unit is renamed to 成語與佳句名言典故 and contains new preset questions', async ({ page }) => {
    const check = await page.evaluate(() => {
      const typeName = window.focusQB ? window.focusQB.getTypeName('classicsQuiz') : ''
      const pool = window.CLASSICS_QUIZ_POOL || []
      const q1 = pool.find(item => item.quote && item.quote.includes('好學近乎知'))
      const q2 = pool.find(item => item.quote && item.quote.includes('凡事豫則立'))
      const q3 = pool.find(item => item.quote && item.quote.includes('擇善固執'))
      return {
        typeName,
        hasQ1: !!q1,
        hasQ2: !!q2,
        hasQ3: !!q3
      }
    })

    expect(check.typeName).toBe('成語與佳句名言典故')
    expect(check.hasQ1).toBe(true)
    expect(check.hasQ2).toBe(true)
    expect(check.hasQ3).toBe(true)
  })

  test('Classics quiz pool contains 亢龍有悔, 潛龍勿用, 飛龍在天', async ({ page }) => {
    const check = await page.evaluate(() => {
      const pool = window.CLASSICS_QUIZ_POOL || []
      const qKangLong = pool.find(item => (item.quote && item.quote.includes('亢龍有悔')) || (item.work && item.work.includes('亢龍有悔')))
      const qQianLong = pool.find(item => (item.quote && item.quote.includes('潛龍勿用')) || (item.work && item.work.includes('潛龍勿用')))
      const qFeiLong = pool.find(item => (item.quote && item.quote.includes('飛龍在天')) || (item.work && item.work.includes('飛龍在天')))
      return {
        hasKangLong: !!qKangLong,
        hasQianLong: !!qQianLong,
        hasFeiLong: !!qFeiLong
      }
    })

    expect(check.hasKangLong).toBe(true)
    expect(check.hasQianLong).toBe(true)
    expect(check.hasFeiLong).toBe(true)
  })

  test('Image modal displays large image from top edge aligned with thumbnail', async ({ page }) => {
    const styles = await page.evaluate(() => {
      const container = document.getElementById('imageZoomContainer')
      const img = document.getElementById('modalImage')
      const cStyle = container ? window.getComputedStyle(container) : null
      const iStyle = img ? window.getComputedStyle(img) : null
      return {
        alignItems: cStyle ? cStyle.alignItems : '',
        objectPosition: iStyle ? iStyle.objectPosition : ''
      }
    })

    expect(styles.alignItems).toBe('flex-start')
    expect(styles.objectPosition.includes('top') || styles.objectPosition === '50% 0%').toBe(true)
  })

  test('Image thumbnail (.preview-item img) displays from top edge (object-position: top center)', async ({ page }) => {
    const objPos = await page.evaluate(() => {
      const el = document.querySelector('.preview-item img') || document.querySelector('.share-item-content-image')
      if (el) {
        return window.getComputedStyle(el).objectPosition
      }
      // Create temporary element to check CSS rule applied
      const temp = document.createElement('div')
      temp.className = 'preview-item'
      const img = document.createElement('img')
      temp.appendChild(img)
      document.body.appendChild(temp)
      const res = window.getComputedStyle(img).objectPosition
      document.body.removeChild(temp)
      return res
    })

    expect(objPos.includes('top') || objPos === '50% 0%').toBe(true)
  })

  test('Character test pool contains 痙攣 with both 痙 and 攣 entries', async ({ page }) => {
    const check = await page.evaluate(() => {
      const pool = window.CHARACTER_TEST_POOL || []
      const jingItem = pool.find(item => item.char === '痙' && item.searchWord === '痙攣')
      const luanItem = pool.find(item => item.char === '攣' && item.searchWord === '痙攣')
      return {
        hasJing: !!jingItem,
        jingZhuyin: jingItem?.zhuyin,
        hasLuan: !!luanItem,
        luanZhuyin: luanItem?.zhuyin
      }
    })

    expect(check.hasJing).toBe(true)
    expect(check.jingZhuyin).toBe('ㄐㄧㄥˋ')
    expect(check.hasLuan).toBe(true)
    expect(check.luanZhuyin).toBe('ㄌㄨㄢˊ')
  })
})

