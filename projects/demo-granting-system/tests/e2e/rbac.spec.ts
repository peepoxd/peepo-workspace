import { test, expect } from '@playwright/test';

test.describe('RBAC - Role Based Access Control', () => {

  test('partner should see proposals and payments', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'partner@demo.com');
    await page.fill('input[type="password"]', 'partner123');
    await page.click('button[type="submit"]');

    // Should see these menu items
    await expect(page.locator('nav >> text=ข้อเสนอโครงการ')).toBeVisible();
    await expect(page.locator('nav >> text=สัญญา')).toBeVisible();
    await expect(page.locator('nav >> text=เบิกจ่าย')).toBeVisible();

    // Should NOT see screening/approval (partner doesn't have access)
    await expect(page.locator('nav >> text=คัดกรอง')).not.toBeVisible();
    await expect(page.locator('nav >> text=อนุมัติ')).not.toBeVisible();
  });

  test('academic should see screening', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'academic@demo.com');
    await page.fill('input[type="password"]', 'academic123');
    await page.click('button[type="submit"]');

    // Should see screening
    await expect(page.locator('nav >> text=คัดกรอง')).toBeVisible();
    await expect(page.locator('nav >> text=ข้อเสนอโครงการ')).toBeVisible();

    // Should NOT see approval
    await expect(page.locator('nav >> text=อนุมัติ')).not.toBeVisible();
  });

  test('approver should see approval', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'approver@demo.com');
    await page.fill('input[type="password"]', 'approver123');
    await page.click('button[type="submit"]');

    // Should see all
    await expect(page.locator('nav >> text=คัดกรอง')).toBeVisible();
    await expect(page.locator('nav >> text=อนุมัติ')).toBeVisible();
    await expect(page.locator('nav >> text=สัญญา')).toBeVisible();
  });

  test('contract_center should see contracts only', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'contract@demo.com');
    await page.fill('input[type="password"]', 'contract123');
    await page.click('button[type="submit"]');

    // Should see contracts
    await expect(page.locator('nav >> text=สัญญา')).toBeVisible();

    // Should NOT see proposals
    await expect(page.locator('nav >> text=ข้อเสนอโครงการ')).not.toBeVisible();
  });
});
