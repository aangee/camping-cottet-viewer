import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4173',
    channel: 'chrome',
    launchOptions: {
      executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
    },
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host',
    url: 'http://localhost:4173/camping-viewer/',
    reuseExistingServer: true,
    timeout: 60000,
  },
})
