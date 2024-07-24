import { test, expect } from "@playwright/test";

test("handling alerts", async ({ page }) => {
  await page.goto(
    "https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo"
  );
  page.on("dialog", async (alert) => {
    // const alertText = alert.message();
    const alertText = alert.defaultValue();
    console.log(alertText);
    // acts as an event listener in reverse
    await alert.accept("ozzy");
    // await alert.dismiss();
  });
  //default strict behavior
  // await page.locator("button:has-text('Click Me')").nth(0).click();
  // await page.locator("button:has-text('Click Me')").nth(1).click();
  await page.locator("button:has-text('Click Me')").nth(2).click();
  // expect(page.locator("id=confirm-demo")).toContainText("Cancel!");
  expect(page.locator("id=prompt-demo")).toContainText("'Ozzy'");
});

test("Modal", async ({ page }) => {
  await page.goto(
    "https://www.lambdatest.com/selenium-playground/bootstrap-modal-demo"
  );
  await page.click("//button[@data-target='#myModal']");
  await page.click("//button[text()='Save Changes'][1]");
});
