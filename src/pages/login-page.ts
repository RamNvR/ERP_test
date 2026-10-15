import { expect, type Locator, type Page } from '@playwright/test';
import { environment } from '../helpers/environment';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  private readonly loginHeading: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginHeading = page.getByRole('heading', { name: /sign in/i });
    this.emailInput = page.getByPlaceholder(/email/i);
    this.passwordInput = page.getByPlaceholder(/password/i);
    this.loginButton = page.getByRole('button', { name: /log in/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async expectLoginForm(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(email = environment.email, password = environment.password): Promise<void> {
    if (!email || !password) {
      throw new Error('Set APP_EMAIL and APP_PASSWORD to run authenticated tests');
    }
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.loginHeading).toHaveCount(0, {
      timeout: 20_000,
    });
  }
}
