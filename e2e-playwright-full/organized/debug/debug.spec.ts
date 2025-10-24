import { test, Page } from '@playwright/test';

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@immowaechter.test',
  password: process.env.TEST_USER_PASSWORD || 'Test123!@#',
};

async function clearAuth(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.context().clearCookies();
}

test('DEBUG: Find logout button', async ({ page }) => {
  // IMPORTANT: Clear auth first!
  await clearAuth(page);

  // Login
  await page.goto('/login');
  await page.waitForTimeout(500);
  
  await page.fill('input#email', TEST_USER.email);
  await page.fill('input#password', TEST_USER.password);
  
  // Wait for navigation (window.location.href redirect)
  await Promise.all([
    page.waitForNavigation({ timeout: 15000 }),
    page.click('button[type="submit"]')
  ]);

  console.log('✅ Logged in, now looking for logout button...');

  // Wait for dashboard to load
  await page.waitForSelector('text=Lädt...', { state: 'hidden', timeout: 10000 }).catch(() => {
    console.log('No loading spinner found');
  });
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({ path: 'debug-dashboard.png', fullPage: true });
  console.log('📸 Screenshot saved: debug-dashboard.png');

  // Find ALL buttons and links
  const allButtons = await page.$$eval('button, a', elements => 
    elements.map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim(),
      id: el.id,
      class: el.className,
      dataTestId: el.getAttribute('data-testid'),
      ariaLabel: el.getAttribute('aria-label'),
    }))
  );

  console.log('\n📋 ALL BUTTONS & LINKS on Dashboard:');
  allButtons.forEach((btn, i) => {
    if (btn.text && btn.text.length > 0 && btn.text.length < 50) {
      console.log(`${i + 1}. ${btn.tag}: "${btn.text}"`);
      if (btn.dataTestId) console.log(`   └─ data-testid: ${btn.dataTestId}`);
    }
  });

  // Look for logout-related elements
  const logoutElements = allButtons.filter(btn => 
    btn.text?.toLowerCase().includes('logout') ||
    btn.text?.toLowerCase().includes('abmelden') ||
    btn.text?.toLowerCase().includes('sign out') ||
    btn.id?.toLowerCase().includes('logout') ||
    btn.dataTestId?.toLowerCase().includes('logout')
  );

  if (logoutElements.length > 0) {
    console.log('\n✅ FOUND LOGOUT ELEMENTS:');
    logoutElements.forEach(el => console.log(JSON.stringify(el, null, 2)));
  } else {
    console.log('\n❌ NO LOGOUT BUTTON FOUND!');
    console.log('\n💡 RECOMMENDATION:');
    console.log('Add a logout button to your dashboard with:');
    console.log('  <button data-testid="logout-button">Abmelden</button>');
  }

  // Check for dropdown menus
  const menuButtons = await page.$$eval('[role="menu"], [role="menubar"], .dropdown, .menu', elements =>
    elements.map(el => ({
      tag: el.tagName,
      class: el.className,
      id: el.id,
    }))
  );

  if (menuButtons.length > 0) {
    console.log('\n🔍 FOUND MENU ELEMENTS (logout might be inside):');
    menuButtons.forEach(el => console.log(el));
  }

  await page.waitForTimeout(2000);
});

test('DEBUG: Check protected route behavior', async ({ page }) => {
  // Clear auth
  await clearAuth(page);

  console.log('\n🔍 Testing protected route behavior...');

  // Try to access dashboard
  await page.goto('/dashboard');
  await page.waitForTimeout(2000);

  const url = page.url();
  console.log(`Current URL: ${url}`);

  if (url.includes('/login')) {
    console.log('✅ Redirects to /login (EXPECTED)');
  } else if (url.includes('/dashboard')) {
    console.log('❌ Stays on /dashboard (BAD - not protected!)');
  } else {
    console.log(`⚠️ Redirects to: ${url} (UNEXPECTED)`);
  }

  await page.screenshot({ path: 'debug-protected-route.png', fullPage: true });
  console.log('📸 Screenshot saved: debug-protected-route.png');
});