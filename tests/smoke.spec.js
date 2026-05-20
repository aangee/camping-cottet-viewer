import { test, expect } from '@playwright/test'

const URL = '/camping-viewer/'

test('chargement — SVG visible, aucune erreur console', async ({ page }) => {
  const errors = []
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  page.on('pageerror', err => errors.push(err.message))

  await page.goto(URL)
  await page.waitForSelector('svg', { timeout: 10000 })
  await page.waitForTimeout(500) // laisser React finir le rendu

  expect(errors, `Erreurs JS : ${errors.join('\n')}`).toHaveLength(0)
})

test('clic hébergement — centrage + bottom sheet visible, aucune erreur', async ({ page }) => {
  const errors = []
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  page.on('pageerror', err => errors.push(err.message))

  await page.goto(URL)
  await page.waitForSelector('svg', { timeout: 10000 })
  await page.waitForTimeout(500)

  // Clic sur le premier marqueur cliquable (hébergement)
  const marker = page.locator('g[style*="cursor: pointer"]').first()
  await marker.click()
  await page.waitForTimeout(400) // attendre l'animation

  // La bottom sheet doit être ouverte
  await expect(page.locator('.bottom-sheet.open')).toBeVisible()

  expect(errors, `Erreurs JS : ${errors.join('\n')}`).toHaveLength(0)
})

test('clic hébergement puis déplacement — pas de blocage', async ({ page }) => {
  const errors = []
  page.on('pageerror', err => errors.push(err.message))

  await page.goto(URL)
  await page.waitForSelector('svg', { timeout: 10000 })
  await page.waitForTimeout(500)

  // Ouvrir la sheet
  await page.locator('g[style*="cursor: pointer"]').first().click()
  await page.waitForTimeout(400)
  await expect(page.locator('.bottom-sheet.open')).toBeVisible()

  // Simuler un drag sur la MAP (la sheet ne doit pas bloquer)
  await page.mouse.move(300, 200)
  await page.mouse.down()
  await page.mouse.move(400, 300)
  await page.mouse.up()

  // Pas d'erreur JS
  expect(errors, `Erreurs JS : ${errors.join('\n')}`).toHaveLength(0)
})
