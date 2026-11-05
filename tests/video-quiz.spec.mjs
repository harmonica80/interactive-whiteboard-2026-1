import { test, expect } from '@playwright/test'

test.describe('Interactive Video Quiz Assessment System Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173/index.html')
  })

  test('Video Quiz panel and VideoQuizManager initialize correctly', async ({ page }) => {
    const initialized = await page.evaluate(() => {
      const solarQuiz = window.videoQuiz?.quizzes?.find(q => q.title.includes('太陽系')) || window.videoQuiz?.quizzes[0]
      return {
        hasManager: typeof window.videoQuiz !== 'undefined',
        hasQuizzes: Array.isArray(window.videoQuiz?.quizzes) && window.videoQuiz.quizzes.length > 0,
        hasSolarQuiz: window.videoQuiz?.quizzes?.some(q => q.title.includes('太陽系')),
        questionsCount: solarQuiz?.questions?.length
      }
    })

    expect(initialized.hasManager).toBe(true)
    expect(initialized.hasQuizzes).toBe(true)
    expect(initialized.hasSolarQuiz).toBe(true)
    expect(initialized.questionsCount).toBeGreaterThanOrEqual(3)
  })

  test('Supports Single Choice, Multiple Choice, and Short Answer Text questions', async ({ page }) => {
    const questionTypes = await page.evaluate(() => {
      const solarQuiz = window.videoQuiz?.quizzes?.find(q => q.title.includes('太陽系')) || window.videoQuiz?.quizzes[0]
      const qList = solarQuiz?.questions || []
      return {
        types: qList.map(q => q.type),
        hasSingle: qList.some(q => q.type === 'single'),
        hasMultiple: qList.some(q => q.type === 'multiple'),
        hasText: qList.some(q => q.type === 'text')
      }
    })

    expect(questionTypes.hasSingle).toBe(true)
    expect(questionTypes.hasMultiple).toBe(true)
    expect(questionTypes.hasText).toBe(true)
  })

  test('Can switch modes between Sync, Self-paced, and Editor', async ({ page }) => {
    await page.evaluate(() => {
      window.app.switchToTab('panel-video-quiz')
    })

    const panelVisible = await page.locator('#panel-video-quiz').isVisible()
    expect(panelVisible).toBe(true)

    // Switch to Self-paced mode
    await page.evaluate(() => {
      window.videoQuiz.switchMode('self')
    })

    const selfSecVisible = await page.locator('#vqSelfSection').isVisible()
    expect(selfSecVisible).toBe(true)

    // Switch to Editor mode
    await page.evaluate(() => {
      window.videoQuiz.switchMode('editor')
    })

    const editorSecVisible = await page.locator('#vqEditorSection').isVisible()
    expect(editorSecVisible).toBe(true)
  })

  test('Question overlay popup and analytics report calculate accurately', async ({ page }) => {
    const calcResult = await page.evaluate(() => {
      const quiz = window.videoQuiz.quizzes[0]
      const mockAnswers = {
        'user_1': {
          userName: '小華',
          answers: {
            'q_1': { isCorrect: true, score: 10, answer: '木星' },
            'q_2': { isCorrect: true, score: 10, answer: ['水星', '金星', '地球'] },
            'q_3': { isCorrect: true, score: 10, answer: '有水與大氣層保護' }
          }
        },
        'user_2': {
          userName: '小明',
          answers: {
            'q_1': { isCorrect: false, score: 0, answer: '金星' },
            'q_2': { isCorrect: true, score: 10, answer: ['水星', '金星', '地球'] },
            'q_3': { isCorrect: true, score: 10, answer: '合適溫度' }
          }
        }
      }

      window.videoQuiz.renderAnalyticsDashboard(quiz, mockAnswers)
      const content = document.getElementById('vqAnalyticsContent')?.innerHTML || ''
      return {
        hasParticipants: content.includes('2 人'),
        hasLeaderboard: content.includes('小華') && content.includes('小明'),
        hasCSVBtn: content.includes('匯出全班成績 CSV')
      }
    })

    expect(calcResult.hasParticipants).toBe(true)
    expect(calcResult.hasLeaderboard).toBe(true)
    expect(calcResult.hasCSVBtn).toBe(true)
  })

  test('Teacher controls global student mode strictly (sync vs self)', async ({ page }) => {
    const modeResult = await page.evaluate(() => {
      window.videoQuiz.setGlobalMode('self')
      const isSelf = window.videoQuiz.globalMode === 'self'
      const badgeText = document.getElementById('vqStudentModeBadge')?.textContent || ''
      const selfSectionVisible = document.getElementById('vqSelfSection')?.style.display === 'block'

      window.videoQuiz.setGlobalMode('sync')
      const isSync = window.videoQuiz.globalMode === 'sync'
      const syncSectionVisible = document.getElementById('vqSyncSection')?.style.display === 'block'

      return { isSelf, badgeText, selfSectionVisible, isSync, syncSectionVisible }
    })

    expect(modeResult.isSelf).toBe(true)
    expect(modeResult.badgeText).toContain('個人自主學習')
    expect(modeResult.isSync).toBe(true)
    expect(modeResult.syncSectionVisible).toBe(true)
  })

  test('Teacher can toggle per-video enabled/disabled status', async ({ page }) => {
    const toggleResult = await page.evaluate(() => {
      const targetId = window.videoQuiz.quizzes[0].id
      const getQuiz = () => window.videoQuiz.quizzes.find(q => q.id === targetId)
      getQuiz().enabled = true
      const initEnabled = getQuiz().enabled !== false
      window.videoQuiz.toggleQuizEnabled(targetId)
      const afterFirstToggle = getQuiz().enabled === false
      window.videoQuiz.toggleQuizEnabled(targetId)
      const afterSecondToggle = getQuiz().enabled !== false
      return { initEnabled, afterFirstToggle, afterSecondToggle }
    })

    expect(toggleResult.initEnabled).toBe(true)
    expect(toggleResult.afterFirstToggle).toBe(true)
    expect(toggleResult.afterSecondToggle).toBe(true)
  })

  test('Admin quiz bank supports search and pagination by video', async ({ page }) => {
    const searchPaginationResult = await page.evaluate(() => {
      window.videoQuiz.setAdminSearchQuery('太陽系')
      const filtered1 = window.videoQuiz.adminSearchQuery === '太陽系'
      window.videoQuiz.setAdminSearchQuery('不存在的關鍵字xyz123')
      const containerText = document.getElementById('vqAdminEditorQuizList')?.textContent || ''
      const hasEmptyNotice = containerText.includes('查無符合')
      window.videoQuiz.setAdminSearchQuery('')
      window.videoQuiz.setAdminPage(1)
      const page1 = window.videoQuiz.adminCurrentPage === 1
      return { filtered1, hasEmptyNotice, page1 }
    })

    expect(searchPaginationResult.filtered1).toBe(true)
    expect(searchPaginationResult.hasEmptyNotice).toBe(true)
    expect(searchPaginationResult.page1).toBe(true)
  })

  test('Teacher can check single or multiple videos to create custom quiz set and load to start', async ({ page }) => {
    const customSetResult = await page.evaluate(() => {
      const q1 = window.videoQuiz.quizzes[0]?.id
      const q2 = window.videoQuiz.quizzes[1]?.id

      window.videoQuiz.toggleSelectQuizForCustomSet(q1)
      if (q2) window.videoQuiz.toggleSelectQuizForCustomSet(q2)
      const selectedCount = window.videoQuiz.selectedQuizIds.size

      // Mock open modal and confirm save
      window.videoQuiz.openSaveCustomSetModal()
      const setName = '跨學科精選測驗組'
      document.getElementById('vqCustomSetNameInput').value = setName
      window.videoQuiz.confirmSaveCustomSet()

      const created = window.videoQuiz.customSets.find(s => s.name === setName)
      const hasOptionInDropdown = document.getElementById('vqAdminQuizSelect')?.innerHTML.includes(setName)

      return {
        selectedCount,
        createdSet: !!created,
        quizCount: created?.quizIds?.length,
        hasOptionInDropdown
      }
    })

    expect(customSetResult.selectedCount).toBeGreaterThanOrEqual(1)
    expect(customSetResult.createdSet).toBe(true)
    expect(customSetResult.quizCount).toBeGreaterThanOrEqual(1)
    expect(customSetResult.hasOptionInDropdown).toBe(true)
  })

  test('Admin control UI titles and buttons dynamically switch for self-paced mode', async ({ page }) => {
    const uiResult = await page.evaluate(() => {
      window.videoQuiz.setGlobalMode('self')
      const titleSelf = document.getElementById('vqAdminModeSectionTitle')?.textContent || ''
      const labelSelf = document.getElementById('vqAdminQuizSelectLabel')?.textContent || ''
      const btnSelf = document.getElementById('vqAdminStartQuizBtn')?.textContent || ''

      window.videoQuiz.setGlobalMode('sync')
      const titleSync = document.getElementById('vqAdminModeSectionTitle')?.textContent || ''
      const labelSync = document.getElementById('vqAdminQuizSelectLabel')?.textContent || ''
      const btnSync = document.getElementById('vqAdminStartQuizBtn')?.textContent || ''

      return { titleSelf, labelSelf, btnSelf, titleSync, labelSync, btnSync }
    })

    expect(uiResult.titleSelf).toContain('個人自主學習')
    expect(uiResult.labelSelf).toContain('自主學習')
    expect(uiResult.btnSelf).toContain('指派自主學習')

    expect(uiResult.titleSync).toContain('全班同步測驗')
    expect(uiResult.labelSync).toContain('同步測驗')
    expect(uiResult.btnSync).toContain('發起全班同步測驗')
  })

  test('Teacher can edit custom test set name (測驗組合編輯名稱)', async ({ page }) => {
    const renameResult = await page.evaluate(() => {
      // Create a set first if none
      if (!window.videoQuiz.customSets || window.videoQuiz.customSets.length === 0) {
        window.videoQuiz.customSets = [{
          id: 'test_set_1',
          name: '原測驗組合名稱',
          quizIds: [window.videoQuiz.quizzes[0].id],
          createdAt: Date.now()
        }]
      }
      const targetSet = window.videoQuiz.customSets[0]
      const oldName = targetSet.name

      window.videoQuiz.openEditCustomSetNameModal(targetSet.id)
      const input = document.getElementById('vqEditCustomSetNameInput')
      if (input) input.value = '自然天文跨領域測驗組'
      window.videoQuiz.confirmEditCustomSetName()

      const newName = targetSet.name
      const cardsText = document.getElementById('vqAdminCustomSetsList')?.textContent || ''
      const cardsContainNewName = cardsText.includes('自然天文跨領域測驗組')

      // Clean up / restore default name if it was the default set
      if (targetSet.id === 'cset_comprehensive_default') {
        window.videoQuiz.openEditCustomSetNameModal(targetSet.id)
        if (input) input.value = '綜合影音複習測驗組'
        window.videoQuiz.confirmEditCustomSetName()
      }

      return { oldName, newName, cardsContainNewName }
    })

    expect(renameResult.newName).toBe('自然天文跨領域測驗組')
    expect(renameResult.cardsContainNewName).toBe(true)
  })

  test('ver 3.0.5 enhancements: returnToQuizVideo and sanitizeCustomSets single default set', async ({ page }) => {
    const checkResult = await page.evaluate(() => {
      // 1. Check returnToQuizVideo
      const hasReturnMethod = typeof window.videoQuiz.returnToQuizVideo === 'function'

      // 2. Check question overlay button
      const overlayContent = document.getElementById('vqQuestionOverlayContent')?.innerHTML || ''
      const noBackToAdminBtn = !overlayContent.includes('返回後台')

      // 3. Check sanitizeCustomSets
      const testList = [
        { id: 'cset_default_1', name: '太陽系科學核心組', quizIds: ['vq_science_solar'] },
        { id: 'cset_custom_999', name: '老師私房題組', quizIds: ['vq_science_solar'] },
        { id: 'cset_comprehensive_default', name: '綜合影音複習測驗組', quizIds: ['vq_science_solar', 'vq_chinese_culture'] }
      ]
      const sanitized = window.videoQuiz.sanitizeCustomSets(testList)

      return {
        hasReturnMethod,
        noBackToAdminBtn,
        sanitizedCount: sanitized.length,
        defaultSetName1: sanitized[0]?.name,
        defaultSetName2: sanitized[1]?.name,
        customSetName: sanitized[2]?.name
      }
    })

    expect(checkResult.hasReturnMethod).toBe(true)
    expect(checkResult.noBackToAdminBtn).toBe(true)
    expect(checkResult.sanitizedCount).toBe(3)
    expect(checkResult.defaultSetName1).toBe('綜合影音複習測驗組')
    expect(checkResult.defaultSetName2).toBe('跨學科精選測驗組')
    expect(checkResult.customSetName).toBe('老師私房題組')
  })

  test('ver 3.0.4 enhancements: jump question, student repeat toggle, modal backdrop close, admin return', async ({ page }) => {
    const checkResult = await page.evaluate(() => {
      // 1. Check default custom sets: only 1 default set
      const defaultSets = window.videoQuiz.customSets
      const defaultName = defaultSets[0]?.name
      const noBottomEditBtn = !document.getElementById('vqAdminCustomSetsList')?.innerHTML.includes('>✏️ 編輯名稱</button>')

      // 2. Check jumpToQuestion method existence and callable
      const hasJumpToQuestion = typeof window.videoQuiz.jumpToQuestion === 'function'

      // 3. Check toggleAllowStudentRepeat
      const initAllow = window.videoQuiz.allowStudentRepeat
      window.videoQuiz.toggleAllowStudentRepeat(!initAllow)
      const toggledAllow = window.videoQuiz.allowStudentRepeat
      window.videoQuiz.toggleAllowStudentRepeat(initAllow)

      // 4. Check modal backdrop click close
      const modal = document.getElementById('vqAnalyticsModal')
      let modalClosed = false
      if (modal) {
        modal.style.display = 'flex'
        // simulate click on backdrop
        modal.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
        modalClosed = (modal.style.display === 'none')
      }

      // 5. Check stopSyncQuiz switches to panel-admin
      window.videoQuiz.isTeacher = true
      window.videoQuiz.syncActive = true
      window.videoQuiz.stopSyncQuiz()
      const adminTabActive = document.getElementById('panel-admin')?.classList.contains('active')

      return {
        defaultName,
        noBottomEditBtn,
        hasJumpToQuestion,
        toggledAllow: toggledAllow !== initAllow,
        modalClosed,
        adminTabActive
      }
    })

    expect(checkResult.defaultName.includes('影音') || checkResult.defaultName.includes('測驗組')).toBe(true)
    expect(checkResult.noBottomEditBtn).toBe(true)
    expect(checkResult.hasJumpToQuestion).toBe(true)
    expect(checkResult.toggledAllow).toBe(true)
    expect(checkResult.modalClosed).toBe(true)
    expect(checkResult.adminTabActive).toBe(true)
  })

  test('Multiple choice quiz results (選擇題測驗結果) are cleared on reset while backend questions are preserved', async ({ page }) => {
    const quizTestResult = await page.evaluate(async () => {
      window.app.switchToTab('panel-quiz')
      const q = window.quiz
      
      // 1. 發起測驗並作答 (隔離歷史題庫，避免寫入正式雲端題庫)
      const origHistoryRef = q.historyRef
      const testHistory = {}
      q.historyRef = {
        push: (item) => {
          const testKey = 'test_key_' + Date.now()
          testHistory[testKey] = item
          q.historyBank[testKey] = item
          return { key: testKey }
        },
        child: () => ({ remove: () => {} }),
        remove: () => {}
      }

      q.startQuiz('請問長方形面積計算公式？', ['長 × 寬', '(長 + 寬) × 2'], 'single')
      await new Promise(r => setTimeout(r, 200))
      q.submitAnswer(0)
      await new Promise(r => setTimeout(r, 200))
      
      // 2. 結束測驗
      q.endQuiz()
      await new Promise(r => setTimeout(r, 200))
      
      const afterEndStatus = document.getElementById('quizStatus')?.textContent || ''
      const afterEndResults = document.getElementById('quizResults')?.textContent || ''
      
      // 3. 模擬後台系統重設
      if (typeof q.clearQuizResults === 'function') {
        q.clearQuizResults()
      }
      q.quizRef.set(null)
      q.answersRef.set(null)
      await new Promise(r => setTimeout(r, 300))
      
      const afterResetStatus = document.getElementById('quizStatus')?.textContent || ''
      const afterResetResultsHtml = document.getElementById('quizResults')?.innerHTML || ''
      const afterResetOptionsHtml = document.getElementById('answerOptions')?.innerHTML || ''
      const historyKeys = Object.keys(q.historyBank || {})
      const hasHistorySaved = Object.values(testHistory).some(item => item.question && item.question.includes('長方形面積')) || historyKeys.some(k => q.historyBank[k].question.includes('長方形面積'))
      
      // 還原題庫引用並清除測試物件
      q.historyRef = origHistoryRef
      Object.keys(testHistory).forEach(k => delete q.historyBank[k])
      
      return {
        afterEndStatus,
        hasEndedResults: afterEndResults.includes('最終結果'),
        afterResetStatus,
        isResultsEmpty: afterResetResultsHtml.trim() === '',
        isOptionsEmpty: afterResetOptionsHtml.trim() === '',
        hasHistorySaved,
        historyCount: historyKeys.length
      }
    })

    expect(quizTestResult.afterEndStatus).toContain('測驗已結束')
    expect(quizTestResult.hasEndedResults).toBe(true)
    expect(quizTestResult.afterResetStatus).toContain('目前沒有進行中的測驗')
    expect(quizTestResult.isResultsEmpty).toBe(true)
    expect(quizTestResult.isOptionsEmpty).toBe(true)
    expect(quizTestResult.hasHistorySaved).toBe(true)
    expect(quizTestResult.historyCount).toBeGreaterThanOrEqual(1)
  })
})

