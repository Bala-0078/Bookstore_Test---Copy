const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
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
// Cucumber hook: runs before each scenario
Given('the user is on the Personal Loan Calculator page', async function () {
 browser = await chromium.launch({ headless: true });
 context = await browser.newContext();
 page = await context.newPage();
 // Replace with the actual URL of your loan calculator
 await page.goto('https://www.experian.com/blogs/ask-experian/personal-loan-calculator/');
 this.page = page;
});
// Step: Enter valid loan amount
// Valid inputs
When('the user enters a valid loan amount', async function () {
  await this.page.waitForSelector('#loanAmount', { timeout: 10000 });
  await this.page.fill('#loanAmount', '10000');
});

When('the user enters a valid interest rate', async function () {
  await this.page.waitForSelector('#interestRate', { timeout: 10000 });
  await this.page.fill('#interestRate', '5');
});

When('the user enters a valid loan term', async function () {
  await this.page.waitForSelector('#term', { timeout: 10000 });
  await this.page.fill('#term', '36');
});

When('the user enters a valid loan amount, interest rate, and loan term', async function () {
  await this.page.waitForSelector('#loanAmount', { timeout: 10000 });
  await this.page.fill('#loanAmount', '10000');
  await this.page.fill('#interestRate', '5');
  await this.page.fill('#term', '36');
});

// Invalid inputs
When('the user enters an invalid loan amount', async function () {
  await this.page.waitForSelector('#loanAmount', { timeout: 10000 });
  await this.page.fill('#loanAmount', '100');
  await page.waitForTimeout(3000);
});

When('the user enters an invalid interest rate', async function () {
  await this.page.waitForSelector('#interestRate', { timeout: 10000 });
  await this.page.fill('#interestRate', '0');
  await page.waitForTimeout(3000);
});


When('the user enters an invalid loan term', async function () {
  await this.page.waitForSelector('#term', { timeout: 10000 });
  await this.page.fill('#term', '-12');
  await page.waitForTimeout(3000);
});


// Min values
When('the user enters the minimum allowed values in all fields', async function () {
  await this.page.waitForSelector('#loanAmount', { timeout: 10000 });
  await this.page.fill('#loanAmount', '1000');
  await this.page.fill('#interestRate', '1');
  await this.page.fill('#term', '6');
});

// Max values
When('the user enters the maximum allowed values in all fields', async function () {
  await this.page.waitForSelector('#loanAmount', { timeout: 10000 });
  await this.page.fill('#loanAmount', '100000');
  await page.waitForTimeout(5000);
  await this.page.fill('#interestRate', '20');
  await page.waitForTimeout(5000);
  await this.page.fill('#term', '84');
});

// Display formatting step
When('the user enters valid values in all fields', async function () {
  await this.page.waitForSelector('#loanAmount', { timeout: 10000 });
  await this.page.fill('#loanAmount', '15000');
  await this.page.fill('#interestRate', '6.5');
  await this.page.fill('#term', '60');
});

When('clicks the {string} button', async function (buttonText) {
  await this.page.waitForSelector(`button:has-text("${buttonText}")`, { timeout: 10000 });
  await this.page.click(`button:has-text("${buttonText}")`);
  await page.waitForTimeout(5000);
});

// Then: Loan amount accepted
Then('the loan amount should be accepted without error', async function () {
 // Replace with actual validation logic
 const errorMsg = await this.page.$('#main > article > div.container.container-sm-py > div > div > div > div.col-lg-5.col-xl-4 > form > div > div:nth-child(1) > div');
 if (errorMsg) {
 throw new Error('Loan amount error message displayed');
 }
});
// Then: Interest rate accepted
Then('the interest rate should be accepted without error', async function () {
 const errorMsg = await this.page.$('#main > article > div.container.container-sm-py > div > div > div > div.col-lg-5.col-xl-4 > form > div > div:nth-child(2) > div');
 if (errorMsg) {
 throw new Error('Interest rate error message displayed');
 }
});
// Then: Loan term accepted
Then('the loan term should be accepted without error', async function () {
 const errorMsg = await this.page.$('#main > article > div.container.container-sm-py > div > div > div > div.col-lg-5.col-xl-4 > form > div > div:nth-child(3) > div');
 if (errorMsg) {
 throw new Error('Loan term error message displayed');
 }
});
// Then: Monthly payment calculated
Then('the monthly payment should be calculated and displayed correctly', async function () {
 // Replace with actual selector for result
 const result = await this.page.textContent('#calc-tab-tabpane-calcTab1 > div > div > div.bg-light.rounded-3.p-4.d-flex.flex-wrap.text-center.mb-5');
 if (!result || isNaN(Number(result.replace(/[^0-9.]/g, '')))) {
 throw new Error('Monthly payment not calculated or displayed');
 }
});
// Then: Error for invalid loan amount
Then('an error message should be displayed for the invalid loan amount', async function () {
 const errorMsg = await this.page.textContent('#main > article > div.container.container-sm-py > div > div > div > div.col-lg-5.col-xl-4 > form > div > div:nth-child(1) > div');
 if (!errorMsg) {
 throw new Error('No error message for invalid loan amount');
 }
});
// Then: Error for invalid interest rate
Then('an error message should be displayed for the invalid interest rate', async function () {
 const errorMsg = await this.page.textContent('#main > article > div.container.container-sm-py > div > div > div > div.col-lg-5.col-xl-4 > form > div > div:nth-child(2) > div');
 if (!errorMsg) {
 throw new Error('No error message for invalid interest rate');
 }
});
// Then: Error for invalid loan term
Then('an error message should be displayed for the invalid loan term', async function () {
 const errorMsg = await this.page.textContent('#main > article > div.container.container-sm-py > div > div > div > div.col-lg-5.col-xl-4 > form > div > div:nth-child(3) > div');
 if (!errorMsg) {
 throw new Error('No error message for invalid loan term');
 }
});
// Then: All input fields cleared
Then('all input fields should be cleared', async function () {
 const loanAmount = await this.page.inputValue('#loanAmount');
 const interestRate = await this.page.inputValue('#interestRate');
 const loanTerm = await this.page.inputValue('#term');
 if (loanAmount !== '' || interestRate !== '' || loanTerm !== '') {
 throw new Error('Not all input fields were cleared');
 }
});
// Then: Calculator correct result
Then('the calculator should display the correct result', async function () {
 const result = await this.page.textContent('#calc-tab-tabpane-calcTab1 > div > div > div.bg-light.rounded-3.p-4.d-flex.flex-wrap.text-center.mb-5 > span.h2.mb-0.w-100');
 if (!result || isNaN(Number(result.replace(/[^0-9.]/g, '')))) {
 throw new Error('Calculator did not display correct result');
 }
});
// Then: Result formatting
Then('the result should be displayed with proper currency and decimal formatting', async function () {
 const result = await this.page.textContent('#calc-tab-tabpane-calcTab1 > div > div > div.bg-light.rounded-3.p-4.d-flex.flex-wrap.text-center.mb-5 > span.h2.mb-0.w-100');
 if (!result.match(/^\$\d{1,3}(,\d{3})*(\.\d{2})?$/)) {
 throw new Error('Result not formatted as currency');
 }
});
// ----------- SCREENSHOT HOOKS -----------
// Take screenshot after each step, regardless of pass/fail
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
 // Log screenshot error but do not fail the test
 console.error('Screenshot failed:', e);
 }
 // Close browser after scenario
 if (browser) {
 await browser.close();
 }
});
