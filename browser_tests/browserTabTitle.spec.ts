import { expect } from '@playwright/test'
import { comfyPageFixture as test } from './ComfyPage'

test.describe('Browser tab title', () => {
  test.describe('Beta Menu', () => {
    test.beforeEach(async ({ comfyPage }) => {
      await comfyPage.setSetting('Comfy.UseNewMenu', 'Top')
    })

    test.afterEach(async ({ comfyPage }) => {
      await comfyPage.setSetting('Comfy.UseNewMenu', 'Disabled')
    })

    test('Can display workflow name', async ({ comfyPage }) => {
      const workflowName = await comfyPage.page.evaluate(async () => {
        return window['app'].workflowManager.activeWorkflow.name
      })
      // Note: unsaved workflow name is always prepended with "*".
      expect(await comfyPage.page.title()).toBe(`*${workflowName}`)
    })

    test('Can display workflow name with unsaved changes', async ({
      comfyPage
    }) => {
      const workflowName = await comfyPage.page.evaluate(async () => {
        return window['app'].workflowManager.activeWorkflow.name
      })
      // Note: unsaved workflow name is always prepended with "*".
      expect(await comfyPage.page.title()).toBe(`*${workflowName}`)

      await comfyPage.menu.saveWorkflow('test')
      expect(await comfyPage.page.title()).toBe('test')

      const textBox = comfyPage.widgetTextBox
      await textBox.fill('Hello World')
      await comfyPage.clickEmptySpace()
      expect(await comfyPage.page.title()).toBe(`*test`)

      // Delete the saved workflow for cleanup.
      await comfyPage.page.evaluate(async () => {
        window['app'].workflowManager.activeWorkflow.delete()
      })
    })
  })

  test.describe('Legacy Menu', () => {
    test.beforeEach(async ({ comfyPage }) => {
      await comfyPage.setSetting('Comfy.UseNewMenu', 'Disabled')
    })

    test('Can display default title', async ({ comfyPage }) => {
      expect(await comfyPage.page.title()).toBe('ComfyUI')
    })
  })
})
