const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, expect } = require('playwright');
const fs = require('fs');
const path = require('path');

// Increase default timeout for slow environments
setDefaultTimeout(60 * 1000);

let browser, context, page;

// Utility function to ensure screenshot directories exist
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ----------------- HOOKS -----------------
Given('the user is on the Personal Loan Calculator page', async function () {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://www.experian.com/blogs/ask-experian/personal-loan-calculator/');
  this.page = page;
});

// ----------------- VALID INPUTS -----------------
When('the user enters a valid loan amount', async function () {
  await this.page.fill('#loanAmount', '10000');
});

When('the user enters a valid interest rate', async function () {
  await this.page.fill('#interestRate', '5');
});

When('the user enters a valid loan term', async function () {
  await this.page.fill('#term', '36');
});

When('the user enters a valid loan amount, interest rate, and loan term', async function () {
  await this.page.fill('#loanAmount', '10000');
  await this.page.fill('#interestRate', '5');
  await this.page.fill('#term', '36');
});

// ----------------- INVALID INPUTS -----------------
When('the user enters an invalid loan amount', async function () {
  await this.page.fill('#loanAmount', '100');
  await this.page.keyboard.press('Tab'); // blur to trigger validation
});

When('the user enters an invalid interest rate', async function () {
  await this.page.fill('#interestRate', '0');
  await this.page.keyboard.press('Tab');
});

When('the user enters an invalid loan term', async function () {
  await this.page.fill('#term', '-12');
  await this.page.keyboard.press('Tab');
});

// ----------------- MIN/MAX -----------------
When('the user enters the minimum allowed values in all fields', async function () {
  await this.page.fill('#loanAmount', '1000');
  await this.page.fill('#interestRate', '1');
  await this.page.fill('#term', '6');
});

When('the user enters the maximum allowed values in all fields', async function () {
  await this.page.fill('#loanAmount', '100000');
  await this.page.fill('#interestRate', '20');
  await this.page.fill('#term', '84');
});

When('the user enters valid values in all fields', async function () {
  await this.page.fill('#loanAmount', '15000');
  await this.page.fill('#interestRate', '6.5');
  await this.page.fill('#term', '60');
});

When('clicks the {string} button', async function (buttonText) {
  await this.page.click(`button:has-text("${buttonText}")`);
});

// ----------------- VALIDATIONS -----------------
Then('the loan amount should be accepted without error', async function () {
  await expect(this.page.locator('#loanAmount')).toHaveValue('10000');
});

Then('the interest rate should be accepted without error', async function () {
  await expect(this.page.locator('#interestRate')).toHaveValue('5');
});

Then('the loan term should be accepted without error', async function () {
  await expect(this.page.locator('#term')).toHaveValue('36');
});

Then('the monthly payment should be calculated and displayed correctly', async function () {
  const resultBox = this.page.locator('#calc-tab-tabpane-calcTab1 div.bg-light span.h2');
  await expect(resultBox).toBeVisible({ timeout: 60000 });
  const result = await resultBox.textContent();
  if (!result || isNaN(Number(result.replace(/[^0-9.]/g, '')))) {
    throw new Error('Monthly payment not calculated or displayed');
  }
});

// ---- Invalid input error messages ----
Then('an error message should be displayed for the invalid loan amount', async function () {
  const errorMsg = this.page.getByText(/valid loan amount/i);
  await expect(errorMsg).toBeVisible({ timeout: 60000 });
});

Then('an error message should be displayed for the invalid interest rate', async function () {
  const errorMsg = this.page.getByText(/valid interest rate/i);
  await expect(errorMsg).toBeVisible({ timeout: 60000 });
});

Then('an error message should be displayed for the invalid loan term', async function () {
  const errorMsg = this.page.getByText(/valid loan term/i);
  await expect(errorMsg).toBeVisible({ timeout: 60000 });
});

// ---- Clear fields ----
Then('all input fields should be cleared', async function () {
  await expect(this.page.locator('#loanAmount')).toHaveValue('');
  await expect(this.page.locator('#interestRate')).toHaveValue('');
  await expect(this.page.locator('#term')).toHaveValue('');
});

// ---- Result correctness ----
Then('the calculator should display the correct result', async function () {
  const resultBox = this.page.locator('#calc-tab-tabpane-calcTab1 div.bg-light span.h2');
  await expect(resultBox).toBeVisible();
  const result = await resultBox.textContent();
  if (!result || isNaN(Number(result.replace(/[^0-9.]/g, '')))) {
    throw new Error('Calculator did not display correct result');
  }
});

Then('the result should be displayed with proper currency and decimal formatting', async function () {
  const resultBox = this.page.locator('#calc-tab-tabpane-calcTab1 div.bg-light span.h2');
  await expect(resultBox).toBeVisible();
  const result = await resultBox.textContent();
  if (!/^\$\d{1,3}(,\d{3})*(\.\d{2})?$/.test(result)) {
    throw new Error('Result not formatted as currency');
  }
});

// ----------------- SCREENSHOTS -----------------
After(async function (scenario) {
  if (!this.page) return;
  const passed = !scenario.result || scenario.result.status === 'PASSED';
  const dir = passed ? path.join('screenshots', 'passed') : path.join('screenshots', 'failed');
  ensureDirSync(dir);
  const fileName = `${Date.now()}-${scenario.pickle.name.replace(/ /g, '_')}.png`;
  const filePath = path.join(dir, fileName);
  try {
    await this.page.screenshot({ path: filePath, fullPage: true });
  } catch (e) {
    console.error('Screenshot failed:', e);
  }
  if (browser) {
    await browser.close();
  }
});
