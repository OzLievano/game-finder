import { test, expect } from "@playwright/test";
import RegisterPage from "../pages/registerPage";
import LoginPage from "../pages/loginPage";
import SpecialHotPage from "../pages/specialHotPage";
import HomePage from "../pages/HomePage";

const email = "Koushik@mailinator.com";
const password = "Koushik@123";
test.describe("Page Object Test DEmo", async () => {
  test("Register test_01", async ({ page, baseURL }) => {
    const register = new RegisterPage(page);
    await page.goto(`${baseURL}route=account/register`);
    await register.enterFirstName("Koushik");
    await register.enterLastName("Koushik");
    await register.enterEmail(email);
    await register.enterTelephone("1234567890");
    await register.enterPassword(password);
    await register.enterConfirmPassword(password);
    expect(register.isSubscribed()).toBe(true);
    await register.clickTermsAndConditions();
    await register.clickContinueToRegister();
  });

  test("Login test_02", async ({ page, baseURL }) => {
    const login = new LoginPage(page);
    await page.goto(`${baseURL} route=account/Login`);
    await login.enterEmail(email);
    await login.enterPassword(password);
    await login.clickLoginButton();
    expect(await page.title()).toBe("My Account");
  });

  test("Add to cart test_03", async ({ page, baseURL }) => {
    const login = new LoginPage(page);
    const homePage = new HomePage(page);
    const specialHotPage = new SpecialHotPage(page);
    await page.goto(`${baseURL} route=account/Login`);
    await login.login(email, password);
    await homePage.clickOnSpecialHotMenu();
    await specialHotPage.addFirstProductToCart();
    const isCartVisible = await specialHotPage.isToastVisible();
    expect(isCartVisible).toBeVisible();
  });
});
