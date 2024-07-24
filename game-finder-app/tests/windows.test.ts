import { expect, test } from "@playwright/test";

test("iinteract with multiple tabs", async ({ page }) => {
  await page.goto(
    "https://www.lambdatest.com/selenium-playground/window-popup-modal-demo"
  );

  console.log(page.url());
  const [newWindow] = await Promise.all([
    page.waitForEvent("popup"),
    page.click("'Follow on Twitter'"),
  ]);

  const [multipleWindows] = await Promise.all([
    page.waitForEvent("popup"),
    page.click("#followboth"),
  ]);

  await multipleWindows.waitForLoadState();
  const pages = multipleWindows.context().pages(); // return all open pages of content
  console.log("# of tabs", pages.length);

  pages.forEach((tab) => {
    console.log(tab.url());
  });
  console.log(newWindow.url());
  //newWindow.fill("", " ")
});
