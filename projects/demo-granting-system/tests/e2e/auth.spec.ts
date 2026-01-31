import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Demo Granting System');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show demo users', async ({ page }) => {
    await expect(page.locator('text=ภาคีเครือข่าย')).toBeVisible();
    await expect(page.locator('text=นักวิชาการ')).toBeVisible();
    await expect(page.locator('text=ผู้อนุมัติ')).toBeVisible();
  });

  test('should login as partner', async ({ page }) => {
    await page.fill('input[type="email"]', 'partner@demo.com');
    await page.fill('input[type="password"]', 'partner123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@demo.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should quick-fill demo user on click', async ({ page }) => {
    await page.click('text=partner@demo.com');

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveValue('partner@demo.com');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', 'partner@demo.com');
    await page.fill('input[type="password"]', 'partner123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');

    // Logout
    await page.click('text=ออกจากระบบ');
    await expect(page).toHaveURL('/login');
  });
});
