import { expect, test } from '@playwright/test'

test('provides a 200-question classics focus quiz with elimination hints', async ({ page }) => {
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/index.html')
  await expect.poll(() => page.evaluate(() => window.CLASSICS_QUIZ_POOL?.length), { timeout: 15_000 }).toBeGreaterThanOrEqual(200)

  const details = await page.evaluate(() => {
    const pool = window.CLASSICS_QUIZ_POOL
    const linjiangxianItems = pool.filter((q) => q.quote?.includes('滾滾長江東逝水') || q.prompt?.includes('滾滾長江東逝水'))
    return {
      first: pool[0],
      hasFactory: typeof window.createClassicsQuizQuestions === 'function',
      hasGameMethods: ['startClassicsQuizGame', 'answerClassicsQuiz', 'useClassicsEliminationHint', 'renderClassicsQuizCompleted']
        .every((name) => typeof window.app?.[name] === 'function'),
      leakedAnswers: pool.filter((question) => question.prompt.includes(question.correctOption)).map((question) => question.id),
      nonQuotePoetryPrompts: pool.filter((question) => question.category === '名句典故' && !question.prompt.startsWith('「')).map((question) => question.id),
      nonMainTitleKeywords: pool.filter((question) => question.category === '名句典故' && (!question.reference.readcKeyword || question.reference.readcKeyword.includes('·'))).map((question) => question.id),
      linjiangxianCount: linjiangxianItems.length,
      hasYangShenAuthor: linjiangxianItems.some((q) => q.correctOption === '楊慎'),
      hasLinjiangxianSource: linjiangxianItems.some((q) => q.correctOption.includes('臨江仙·滾滾長江東逝水')),
    }
  })

  expect(details.hasFactory).toBe(true)
  expect(details.hasGameMethods).toBe(true)
  expect(details.leakedAnswers).toEqual([])
  expect(details.nonQuotePoetryPrompts).toEqual([])
  expect(details.nonMainTitleKeywords).toEqual([])
  expect(details.linjiangxianCount).toBe(2)
  expect(details.hasYangShenAuthor).toBe(true)
  expect(details.hasLinjiangxianSource).toBe(true)
  expect(details.first.options).toHaveLength(4)
  expect(details.first.options).toContain(details.first.correctOption)
  expect(details.first.reference.readcUrl).toContain('readc.info')
  expect(details.first.reference.fullTextUrl).toContain('wikisource.org')
  expect(details.first.reference.introUrl).toContain('wikipedia.org')

  const settingsDisplay = await page.evaluate(() => {
    const gameType = document.getElementById('focusGameType')
    gameType.value = 'classicsQuiz'
    window.app.updateFocusGameAdminOptions()
    return document.getElementById('focusClassicsQuizSettings').style.display
  })
  expect(settingsDisplay).toBe('block')

  await page.evaluate(() => {
    const game = {
      gameType: 'classicsQuiz',
      startTime: Date.now(),
      questions: window.createClassicsQuizQuestions(3),
    }
    window.app.startClassicsQuizGame(game)
  })
  await expect(page.locator('#focusGameGrid button')).toHaveCount(5)
  await page.evaluate(() => window.app.useClassicsEliminationHint())
  await expect(page.locator('#focusGameGrid')).toContainText('已排除')
  await page.evaluate(() => {
    const question = window.app.focusGame.questions[0]
    window.app.answerClassicsQuiz(question.options.indexOf(question.correctOption))
  })
  await expect(page.locator('#focusGameGrid')).toContainText('答對了！')
  await expect(page.locator('#focusGameGrid a')).toHaveCount(3)
  expect(pageErrors).toEqual([])
})