import { test, expect } from '@playwright/test';

test.describe('Proposals', () => {
  test.beforeEach(async ({ page }) => {
    // Login as partner
    await page.goto('/login');
    await page.fill('input[type="email"]', 'partner@demo.com');
    await page.fill('input[type="password"]', 'partner123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to proposals page', async ({ page }) => {
    await page.click('text=ข้อเสนอโครงการ');
    await expect(page).toHaveURL('/proposals');
    await expect(page.locator('h1')).toContainText('ข้อเสนอโครงการ');
  });

  test('should show create proposal button for partner', async ({ page }) => {
    await page.goto('/proposals');
    await expect(page.locator('text=สร้างข้อเสนอใหม่')).toBeVisible();
  });

  test('should open proposal form', async ({ page }) => {
    await page.goto('/proposals');
    await page.click('text=สร้างข้อเสนอใหม่');
    await expect(page).toHaveURL('/proposals/new');
    await expect(page.locator('h1')).toContainText('สร้างข้อเสนอโครงการใหม่');
  });

  test('should create new proposal', async ({ page }) => {
    await page.goto('/proposals/new');

    // Fill form
    await page.fill('input[name="projectName"]', 'โครงการทดสอบ Playwright');
    await page.fill('textarea[name="description"]', 'รายละเอียดโครงการทดสอบด้วย Playwright E2E Testing');
    await page.fill('input[name="budget"]', '500000');
    await page.fill('input[name="duration"]', '6');
    await page.fill('input[placeholder="วัตถุประสงค์ที่ 1"]', 'ทดสอบระบบ');
    await page.fill('input[name="targetGroup"]', 'ทีมพัฒนา');

    // Submit
    await page.click('text=บันทึกร่าง');

    // Should redirect to proposals list
    await expect(page).toHaveURL('/proposals');
  });

  test('should display proposals list', async ({ page }) => {
    await page.goto('/proposals');

    // Should have table headers
    await expect(page.locator('text=ชื่อโครงการ')).toBeVisible();
    await expect(page.locator('text=งบประมาณ')).toBeVisible();
    await expect(page.locator('text=สถานะ')).toBeVisible();
  });
});
