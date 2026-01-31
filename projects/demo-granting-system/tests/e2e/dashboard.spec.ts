import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'partner@demo.com');
    await page.fill('input[type="password"]', 'partner123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display dashboard title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should display KPI cards', async ({ page }) => {
    await expect(page.locator('text=ข้อเสนอทั้งหมด')).toBeVisible();
    await expect(page.locator('text=อนุมัติแล้ว')).toBeVisible();
    await expect(page.locator('text=โครงการตามแผน')).toBeVisible();
    await expect(page.locator('text=งบคงเหลือ')).toBeVisible();
  });

  test('should display budget overview section', async ({ page }) => {
    await expect(page.locator('text=ภาพรวมงบประมาณ')).toBeVisible();
    await expect(page.locator('text=งบประมาณทั้งหมด')).toBeVisible();
    await expect(page.locator('text=จัดสรรแล้ว')).toBeVisible();
    await expect(page.locator('text=เบิกจ่ายแล้ว')).toBeVisible();
  });

  test('should display alerts section', async ({ page }) => {
    await expect(page.locator('text=การแจ้งเตือน')).toBeVisible();
  });

  test('should display status breakdown', async ({ page }) => {
    await expect(page.locator('text=สถานะข้อเสนอโครงการ')).toBeVisible();
    await expect(page.locator('text=ฉบับร่าง')).toBeVisible();
    await expect(page.locator('text=ยื่นแล้ว')).toBeVisible();
    await expect(page.locator('text=อนุมัติ')).toBeVisible();
  });
});
