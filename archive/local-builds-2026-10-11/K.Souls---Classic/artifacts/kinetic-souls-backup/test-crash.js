import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  try {
    await page.goto('http://localhost:5174/');
    await page.waitForSelector('canvas', { timeout: 5000 });
    
    // Calculate click position for "START GAME"
    // "START GAME" is at W/2 - 75, y: 440, w: 150, h: 44.
    // Canvas is scaled. We'll just click at W/2, 460 which is center of the button.
    // The default ARENA_W is 1000. So x=500, y=460.
    
    console.log('Clicking START GAME...');
    await page.mouse.click(500, 462);
    
    // wait a moment for crash
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.error('SCRIPT ERROR:', err);
  } finally {
    await browser.close();
  }
})();
