import { expect, test } from "@playwright/test";
import { log } from "console";

test("Interact with frames", async ({ page }) => {
  await page.goto("https://letcode.in/frame");

  const allFrames = page.frames(); //array of frames

  const frame = page.frameLocator("#firstFr");

  await frame.locator("input[name='fname']").fill("ozzy");
  await frame.locator("input[name='lname']").fill("lievano");
  const innerFrame = frame.frameLocator("iframe[src='innerFrame']");
  await innerFrame
    .locator("input[name='email']")
    .fill("osvaldoalievano@gmail.com");
  // log(allFrames.length);
  // const myFrame = page.frame("firstFr");
  // await myFrame?.fill("input[name='fname']", "Ozzy");
  // await myFrame?.fill("input[name='lname']", "Lievano");

  // expect(await myFrame?.locator("p.has-text-info").textContent()).toContain(
  //   "You have entered"
  // );
  await page.waitForTimeout(3000);
});
