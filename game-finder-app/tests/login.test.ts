import { test, expect } from "@playwright/test";

const email = "gwhizzkid@yahoo.com";
const password = "Haven1235!";
test("test login", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  expect(
    await page.locator('//*[@id="root"]/div/div/button')
  ).not.toBeVisible();
  await page.locator('//*[@id="root"]/div/header/div/button').click();
  await page.locator("input[name='email']").fill(email);
  await page.locator("input[name='password']").fill(password);
  await page.locator('//*[@id="root"]/div/button').click();
  expect((await page.url()) === "http://localhost:3000/");
  expect(
    await page.waitForFunction(() =>
      document.querySelector("#root > div > div > button")
    )
  ).toBeTruthy();
  // ('//*[@id="root"]/div/div/button')).toBeVisible();
});
