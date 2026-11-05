import { defineConfig } from '@playwright/test'

const chromeExecutablePath =
  process.env.CHROME_EXECUTABLE_PATH ??
  (process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    : undefined)

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    launchOptions: chromeExecutablePath ? { executablePath: chromeExecutablePath } : undefined,
  },
  webServer: {
    command: 'http-server . -c-1 -p 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})