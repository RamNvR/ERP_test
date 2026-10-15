import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base-page';

export class LanguagePage extends BasePage {
  private readonly languageSelector: Locator;

  constructor(page: Page) {
    super(page);
    this.languageSelector = page.getByRole('banner').getByRole('combobox').last();
  }

  async expectLanguageSelector(): Promise<void> {
    await expect(this.languageSelector).toBeVisible();
  }

  async choose(language: string): Promise<void> {
    await this.languageSelector.click();
    const escaped = language.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = this.page.getByText(new RegExp(`^${escaped}$`, 'i')).last();
    await option.waitFor({ state: 'visible' });
    await option.click();
  }
}
