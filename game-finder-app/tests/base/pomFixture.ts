import { test as baseTest } from "@playwright/test";
import RegisterPage from "../pages/registerPage";
import LoginPage from "../pages/loginPage";
import SpecialHotPage from "../pages/specialHotPage";
import HomePage from "../pages/HomePage";

type pages = {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  specialHotPage: SpecialHotPage;
  homePage: HomePage;
};

const testPages = baseTest.extend<pages>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  specialHotPage: async ({ page }, use) => {
    await use(new SpecialHotPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export const test = testPages;
export const expect = testPages.expect;
