import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base-page';

export class PaymentPage extends BasePage {
  private readonly searchField: Locator;

  constructor(page: Page) {
    super(page);
    this.searchField = page.getByRole('combobox').last();
  }

  async open(): Promise<void> {
    await this.openNavigationItem('Payments');
  }

  async expectLoaded(): Promise<void> {
    await this.expectListAtRoute('/payment');
  }

  async search(value: string): Promise<void> {
    await this.searchField.fill(value);
    await expect(this.table).toBeVisible();
  }
}
