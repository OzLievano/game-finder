import { Page } from "@playwright/test";

export default class LoginPage {
  constructor(public page: Page) {
    this.page = page;
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
  async enterEmail(email: string) {
    await this.page.locator("input[name='email']").fill(email);
  }

  async enterPassword(password: string) {
    await this.page.locator("input[name='password']").fill(password);
  }

  async clickLoginButton() {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click("input[value='Login']"),
    ]);
  }
}
