import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

// 1. 檢查舊版 tldraw (whiteboard_v146.html) module 語法
if (existsSync('whiteboard_v146.html')) {
  const html = readFileSync('whiteboard_v146.html', 'utf8')
  const moduleMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/)
  if (moduleMatch) {
    const result = spawnSync(process.execPath, ['--input-type=module', '--check', '-'], {
      input: moduleMatch[1],
      encoding: 'utf8',
    })
    if (result.status !== 0) {
      process.stderr.write(`Module syntax check failed for whiteboard_v146.html\n${result.stderr}`)
      process.exit(result.status ?? 1)
    }
    console.log(`✓ whiteboard_v146.html`)
  }
}

// 2. 檢查全新同步共編白板核心引擎 (js/whiteboard_core.js)
if (existsSync('js/whiteboard_core.js')) {
  const result = spawnSync(process.execPath, ['--check', 'js/whiteboard_core.js'], {
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    process.stderr.write(`Syntax check failed for js/whiteboard_core.js\n${result.stderr}`)
    process.exit(result.status ?? 1)
  }
  console.log(`✓ js/whiteboard_core.js`)
}
