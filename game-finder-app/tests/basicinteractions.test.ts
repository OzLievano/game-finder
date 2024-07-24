import { test, expect } from "@playwright/test";

test("interaction with inputs", async ({ page }) => {
  await page.goto(
    "https://www.Lambdatest.com/selenium-playground/simple-form-demo"
  );
  const messageInput = await page.locator("input#user-message");
  await messageInput.scrollIntoViewIfNeeded();
  console.log(await messageInput.getAttribute("placeholder"));
  expect(messageInput).toHaveAttribute(
    "placeholder",
    "Please enter your Message"
  );
  console.log(await messageInput.inputValue());
  await messageInput.fill("Hi OZzy");
});

test("sum", async ({ page }) => {
  await page.goto(
    "https://www.Lambdatest.com/selenium-playground/simple-form-demo"
  );
  const sum1Input = page.locator("#sum1");
  const sum2Input = page.locator("#sum2");
  const getValuesBtn = page.locator("//button[text()='Get Values']");
  let num1 = 121;
  let num2 = 546;

  await sum1Input.fill("" + num1);
  await sum2Input.fill("" + num2);
  await getValuesBtn.click();
  const result = page.locator("#addmessage");
  let expectedResult = num1 + num2;
  expect(result).toHaveText("" + expectedResult);
  //fill will clear existing value - all at once
  //type will type one character at a time
});

//test.only to run one test
test("Checkbox", async ({ page }) => {
  await page.goto(
    "https://www.Lambdatest.com/selenium-playground/checkbox-demo"
  );
  const singleCheckBox = await page.locator("id=isAgeSelected");
  expect(singleCheckBox).not.toBeChecked();
  await singleCheckBox.check(); //can use click but recommended to use check
});

// 3 tests will open 3 different browsers to run each test
