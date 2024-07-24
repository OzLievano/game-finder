import { test } from "@playwright/test";
import moment from "moment";

// test("calendar demo", async ({ page }) => {
//   page.goto(
//     "https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo"
//   );
//   let date = "1994-04-12";

//   await page.fill("id=birthday", date);
//   await page.waitForTimeout(3000);
// });

test("calendar demo using moment", async ({ page }) => {
  page.goto(
    "https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo"
  );
  await selectDate(12, "December 2017");
  await page.reload();
  await selectDate(5, "December 2023");
  await page.reload();
  await selectDate(9, "May 2024");
  await page.waitForTimeout(3000);

  async function selectDate(date: number, monthYear: string) {
    await page.click("//input[@placeholder='Start date']");
    const mmYY = page.locator(
      "(//table[@class='table-condensed'//th[@class='datepicker-switch'])[1]"
    );
    const mmYYPrev = page.locator(
      "(//table[@class='table-condensed'//th[@class='prev'])[1]"
    );
    const mmYYNext = page.locator(
      "(//table[@class='table-condensed'//th[@class='next'])[1]"
    );

    let dateToSelect: string = monthYear;
    const thisMonth = moment(dateToSelect, "MMMM YYYY").isBefore();

    while ((await mmYY.textContent()) != dateToSelect) {
      if (thisMonth) {
        await mmYYPrev.click();
      } else {
        await mmYYNext.click();
      }
      await page.click(`//td[@class='day'][text()='${date}']`);
    }
  }
});
