// @ts-check
const { test, expect, chromium } = require('@playwright/test');

test('Aviasales test', async ({page}) => {
  test.setTimeout(0);
  const browser = await chromium.launch();
  page = await browser.newPage();
  const themeSwitch = page.locator('data-test-id=switch');
  const from = page.locator('id=origin');
  const to = page.locator('id=destination');
  const departureDate = page.locator('data-test-id=departure-date-field');
  const passengersControl = page.locator('data-test-id=passengers-field');

  await page.goto('https://www.aviasales.com/');
  await expect(page).toHaveTitle(/Cheap Flights/);
  await themeSwitch.click();
  await delay(1000);
  await page.click("input[id=origin]", {clickCount: 3})
  await from.type("JFK");
  await delay(1000);
  await page.click("input[id=destination]", {clickCount: 3})
  await to.type("BER");
  await delay(1000);
  await departureDate.click();
  await page.selectOption('select.calendar-caption__select', '2022-09');
  await delay(1000);
  await page.locator('div.calendar-day', { hasText: "30"}).first().click();
  await delay(1000);
  await page.locator('button', { hasText: "need a return ticket"}).click();
  await delay(1000);
  await passengersControl.click();
  await delay(1000);
  await page.locator('a.additional-fields__passenger-control.--increment').first().click();
  //await page.locator('button', { hasText: "Search flights"}).click();//works
  const context = await browser.newContext();
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button', { hasText: "Search flights"}).click()
  ])
  await newPage.waitForLoadState();
  expect(await page.innerText('id=origin')).toBe('New York');
  expect(await page.innerText('id=destination')).toBe('Berlin');

});
function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
