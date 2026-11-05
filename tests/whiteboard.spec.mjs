import { expect, test } from '@playwright/test'

async function openWhiteboard(page) {
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/whiteboard_v146.html?e2e=1')
  await expect.poll(
    () => page.evaluate(() => Boolean(window.editorInstanceRef)),
    { timeout: 15_000 },
  ).toBe(true)
  await expect(page.locator('[data-testid="tools.draw"]')).toBeVisible()

  return pageErrors
}

async function shapeTypes(page) {
  return page.evaluate(() => window.editorInstanceRef.getCurrentPageShapes().map((shape) => shape.type))
}

async function drawStroke(page, toolTestId, start, end) {
  await page.locator(`[data-testid="tools.${toolTestId}"]`).click()
  await page.mouse.move(...start)
  await page.mouse.down()
  await page.mouse.move(...end)
  await page.mouse.up()
}

test('initializes tldraw without a page error', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  expect(pageErrors).toEqual([])
})

test('creates a draw shape', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  await drawStroke(page, 'draw', [220, 200], [380, 260])
  await expect.poll(() => shapeTypes(page)).toContain('draw')
  expect(pageErrors).toEqual([])
})

test('creates geometry and arrow shapes', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  await drawStroke(page, 'rectangle', [240, 200], [380, 300])
  await expect.poll(() => shapeTypes(page)).toContain('geo')
  await drawStroke(page, 'arrow', [450, 200], [600, 300])
  await expect.poll(() => shapeTypes(page)).toContain('arrow')
  expect(pageErrors).toEqual([])
})

test('creates note and text shapes', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  await page.locator('[data-testid="tools.note"]').click()
  await page.mouse.click(240, 200)
  await page.keyboard.type('note')
  await page.keyboard.press('Escape')
  await expect.poll(() => shapeTypes(page)).toContain('note')

  await page.locator('[data-testid="tools.text"]').click()
  await page.mouse.click(450, 200)
  await page.keyboard.type('text')
  await page.keyboard.press('Escape')
  await expect.poll(() => shapeTypes(page)).toContain('text')
  expect(pageErrors).toEqual([])
})
async function camera(page) {
  return page.evaluate(() => window.editorInstanceRef.getCamera())
}

test('supports Ctrl + mouse wheel zoom', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  const before = await camera(page)

  await page.mouse.move(500, 300)
  await page.keyboard.down('Control')
  await page.mouse.wheel(0, -400)
  await page.keyboard.up('Control')

  await expect.poll(async () => (await camera(page)).z).not.toBe(before.z)
  expect(await page.evaluate(() => window.whiteboardNavigationDiagnostics.ctrlWheel)).toBeGreaterThan(0)
  expect(pageErrors).toEqual([])
})

test('supports Space + drag and middle-button drag panning', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  const beforeSpacePan = await camera(page)

  await page.mouse.move(400, 300)
  await page.keyboard.down('Space')
  await expect(page.locator('#root')).toHaveClass(/whiteboard-pan-ready/)
  await expect(page.locator('.tl-canvas')).toHaveCSS('cursor', 'grab')
  await page.mouse.down()
  await expect(page.locator('#root')).toHaveClass(/whiteboard-panning/)
  await expect(page.locator('.tl-canvas')).toHaveCSS('cursor', 'grabbing')
  await page.mouse.move(520, 360)
  await page.mouse.up()
  await expect(page.locator('#root')).not.toHaveClass(/whiteboard-panning/)
  await page.keyboard.up('Space')

  await expect.poll(async () => {
    const current = await camera(page)
    return current.x !== beforeSpacePan.x || current.y !== beforeSpacePan.y
  }).toBe(true)

  const beforeMiddlePan = await camera(page)
  await page.mouse.move(520, 360)
  await page.mouse.down({ button: 'middle' })
  await expect(page.locator('#root')).toHaveClass(/whiteboard-panning/)
  await expect(page.locator('.tl-canvas')).toHaveCSS('cursor', 'grabbing')
  await page.mouse.move(620, 420)
  await page.mouse.up({ button: 'middle' })
  await expect(page.locator('#root')).not.toHaveClass(/whiteboard-panning/)

  await expect.poll(async () => {
    const current = await camera(page)
    return current.x !== beforeMiddlePan.x || current.y !== beforeMiddlePan.y
  }).toBe(true)
  const navigationDiagnostics = await page.evaluate(() => window.whiteboardNavigationDiagnostics)
  expect(navigationDiagnostics.spacePan).toBeGreaterThan(0)
  expect(navigationDiagnostics.middlePan).toBeGreaterThan(0)
  expect(pageErrors).toEqual([])
})

test('supports camera shortcuts when used through the main-page iframe', async ({ page }) => {
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.goto('/index.html')
  await page.addStyleTag({ content: '#focusGameOverlay { display: none !important; }' })
  await page.locator('[data-target="panel-whiteboard"]').click()

  const frame = page.frameLocator('#whiteboardFrame')
  await expect.poll(
    () => frame.locator('body').evaluate(() => Boolean(window.editorInstanceRef)),
    { timeout: 15_000 },
  ).toBe(true)

  const iframeBox = await page.locator('#whiteboardFrame').boundingBox()
  expect(iframeBox).not.toBeNull()
  const before = await frame.locator('body').evaluate(() => window.editorInstanceRef.getCamera())
  const x = iframeBox.x + Math.min(400, iframeBox.width / 2)
  const y = iframeBox.y + Math.min(300, iframeBox.height / 2)

  await page.mouse.click(x, y)
  await page.keyboard.down('Control')
  await page.mouse.wheel(0, -400)
  await page.keyboard.up('Control')
  await expect.poll(async () => frame.locator('body').evaluate(() => window.editorInstanceRef.getCamera().z)).not.toBe(before.z)

  const beforePan = await frame.locator('body').evaluate(() => window.editorInstanceRef.getCamera())
  await page.keyboard.down('Space')
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 100, y + 60)
  await page.mouse.up()
  await expect(frame.locator('#root')).not.toHaveClass(/whiteboard-panning/)
  await page.keyboard.up('Space')
  await expect.poll(async () => {
    const current = await frame.locator('body').evaluate(() => window.editorInstanceRef.getCamera())
    return current.x !== beforePan.x || current.y !== beforePan.y
  }).toBe(true)

  const beforeMiddlePan = await frame.locator('body').evaluate(() => window.editorInstanceRef.getCamera())
  await page.mouse.move(x + 100, y + 60)
  await page.mouse.down({ button: 'middle' })
  await page.mouse.move(x + 180, y + 110)
  await page.mouse.up({ button: 'middle' })
  await expect.poll(async () => {
    const current = await frame.locator('body').evaluate(() => window.editorInstanceRef.getCamera())
    return current.x !== beforeMiddlePan.x || current.y !== beforeMiddlePan.y
  }).toBe(true)
  expect(pageErrors).toEqual([])
})
