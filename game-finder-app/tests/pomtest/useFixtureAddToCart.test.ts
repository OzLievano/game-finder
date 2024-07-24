import { test, expect } from "../base/pomFixture";

const email = "Koushik@mailinator.com";
const password = "Koushik@123";
test.describe("Page Object Test DEmo", async () => {
  test("Register test_01", async ({ page, baseURL, registerPage }) => {
    // const register = new RegisterPage(page);
    await page.goto(`${baseURL}route=account/register`);
    await registerPage.enterFirstName("Koushik");
    await registerPage.enterLastName("Koushik");
    await registerPage.enterEmail(email);
    await registerPage.enterTelephone("1234567890");
    await registerPage.enterPassword(password);
    await registerPage.enterConfirmPassword(password);
    expect(registerPage.isSubscribed()).toBe(true);
    await registerPage.clickTermsAndConditions();
    await registerPage.clickContinueToRegister();
  });

  test("Login test_02", async ({ page, baseURL, loginPage }) => {
    // const login = new LoginPage(page);
    await page.goto(`${baseURL} route=account/Login`);
    await loginPage.enterEmail(email);
    await loginPage.enterPassword(password);
    await loginPage.clickLoginButton();
    expect(await page.title()).toBe("My Account");
  });

  test("Add to cart test_03", async ({
    page,
    baseURL,
    loginPage,
    homePage,
    specialHotPage,
  }) => {
    // const login = new LoginPage(page);
    // const homePage = new HomePage(page);
    // const specialHotPage = new SpecialHotPage(page);
    await page.goto(`${baseURL} route=account/Login`);
    await loginPage.login(email, password);
    await homePage.clickOnSpecialHotMenu();
    await specialHotPage.addFirstProductToCart();
    const isCartVisible = await specialHotPage.isToastVisible();
    expect(isCartVisible).toBeVisible();
  });
});
