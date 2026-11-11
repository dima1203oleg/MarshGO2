/* global document, performance */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runAudit() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  const analyzeViewport = async (name, viewport, isMobile) => {
    const context = await browser.newContext({
      viewport,
      isMobile,
      hasTouch: isMobile,
      userAgent: isMobile 
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    const consoleLogs = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('requestfailed', req => failedRequests.push({ url: req.url(), failure: req.failure()?.errorText }));

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const screenshot1 = `audit_${name}_initial.png`;
    await page.screenshot({ path: path.join(__dirname, screenshot1), fullPage: true });

    const initialBody = await page.evaluate(() => document.body.innerText);

    // Click 'Почати' button if present to see onboarding / flow
    const startButtons = await page.$$eval('button', btns => btns.map(b => b.innerText.trim()));

    // Try clicking 'Почати'
    let step2Screen = null;
    let step2Text = null;
    try {
      const pochati = await page.getByRole('button', { name: /почати/i }).first();
      if (await pochati.isVisible()) {
        await pochati.click();
        await page.waitForTimeout(1200);
        step2Screen = `audit_${name}_step2.png`;
        await page.screenshot({ path: path.join(__dirname, step2Screen), fullPage: true });
        step2Text = await page.evaluate(() => document.body.innerText.slice(0, 1000));
      }
    } catch (e) {
      console.log('Click error:', e.message);
    }

    // Inspect interactive elements on current screen
    const buttons = await page.$$eval('button', els => els.map(b => ({
      text: b.innerText.trim(),
      ariaLabel: b.getAttribute('aria-label'),
      disabled: b.disabled
    })).filter(b => b.text || b.ariaLabel));

    const inputs = await page.$$eval('input', els => els.map(i => ({
      placeholder: i.placeholder,
      name: i.name,
      type: i.type,
      value: i.value
    })));

    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', els => els.map(h => ({
      tag: h.tagName.toLowerCase(),
      text: h.innerText.trim()
    })));

    // Accessibility check
    const missingAltImages = await page.$$eval('img:not([alt])', imgs => imgs.length);
    const formLabels = await page.$$eval('input', inputs => inputs.map(i => ({
      id: i.id,
      hasLabel: !!document.querySelector(`label[for="${i.id}"]`) || !!i.closest('label')
    })));

    // Performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: timing ? Math.round(timing.domContentLoadedEventEnd - timing.startTime) : null,
        loadComplete: timing ? Math.round(timing.loadEventEnd - timing.startTime) : null,
        transferSize: timing ? timing.transferSize : null
      };
    });

    await context.close();
    return {
      name,
      screenshot1,
      step2Screen,
      initialPreview: initialBody.slice(0, 400),
      step2Preview: step2Text,
      headings,
      buttonList: startButtons,
      buttons,
      inputs,
      missingAltImages,
      formLabels,
      performanceMetrics,
      consoleLogs,
      pageErrors,
      failedRequests
    };
  };

  const mobileRes = await analyzeViewport('mobile', { width: 393, height: 852 }, true);
  const desktopRes = await analyzeViewport('desktop', { width: 1440, height: 900 }, false);

  fs.writeFileSync(path.join(__dirname, 'audit_report.json'), JSON.stringify({ mobileRes, desktopRes }, null, 2));
  console.log('AUDIT_COMPLETE');
  await browser.close();
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
