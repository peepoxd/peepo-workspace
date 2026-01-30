const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport for full page
  await page.setViewportSize({ width: 1400, height: 2400 });

  // Load local HTML file
  const filePath = path.resolve(__dirname, 'demo-slides.html');
  await page.goto(`file://${filePath}`);

  // Wait for fonts to load
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({
    path: 'demo-preview.png',
    fullPage: true
  });

  console.log('Screenshot saved: demo-preview.png');

  await browser.close();
})();
