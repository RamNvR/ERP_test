import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base-page';

export class DashboardPage extends BasePage {
  private readonly paidInvoiceHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.paidInvoiceHeading = page.getByRole('heading', {
      name: 'Paid Invoice',
      exact: true,
    });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.paidInvoiceHeading).toBeVisible();
  }
}
