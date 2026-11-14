import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

// 檢查全新同步共編白板核心引擎 (js/whiteboard_core.js)
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
