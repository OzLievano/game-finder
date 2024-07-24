import { Page } from "@playwright/test";

export default class RegisterPage {
  constructor(public page: Page) {
    this.page = page;
  }

  async enterFirstName(firstName: string) {
    await this.page.locator("#input-firstname").fill(firstName);
  }
  async enterLastName(lastName: string) {
    await this.page.locator("input[name='Lastname']").fill(lastName);
  }
  async enterEmail(email: string) {
    await this.page.locator("input[name='email']").fill(email);
  }
  async enterTelephone(telephone: string) {
    await this.page.locator("input[name='telephone']").fill(telephone);
  }
  async enterPassword(password: string) {
    await this.page.locator("input[name='password']").fill(password);
  }
  async enterConfirmPassword(password: string) {
    await this.page.locator("input[name='confirm']").fill(password);
  }
  async isSubscribed() {
    return await this.page.locator("#input-newsLetter-no").isChecked();
  }
  async clickTermsAndConditions() {
    return await this.page.click("input[name='agree']");
  }

  async clickContinueToRegister() {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle" }),
      this.page.click("input[value='continue']"),
    ]);
  }
}
