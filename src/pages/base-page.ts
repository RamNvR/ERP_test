import { expect, type Locator, type Page } from '@playwright/test';
import { FormFields } from '../helpers/form';

export abstract class BasePage {
  protected readonly menuButton: Locator;
  protected readonly table: Locator;
  protected readonly form: FormFields;
  private readonly locator: {
    link: (name: string | RegExp, exact?: boolean) => Locator;
    button: (name: string | RegExp) => Locator;
    heading: (name: string | RegExp) => Locator;
  };

  protected constructor(protected readonly page: Page) {
    this.menuButton = page.getByRole('button', { name: 'menu' });
    this.table = page.getByRole('table');
    this.form = new FormFields(page);
    this.locator = {
      link: (name, exact = false) => page.getByRole('link', { name, exact }),
      button: (name) => page.getByRole('button', { name }),
      heading: (name) => page.getByRole('heading', { name }),
    };
  }

  async openNavigationItem(label: string): Promise<void> {
    const link = this.locator.link(label, true).first();
    if (!(await link.isVisible().catch(() => false))) {
      if (await this.menuButton.isVisible()) await this.menuButton.click();
    }
    await link.waitFor({ state: 'visible' });
    await link.click();
  }

  async expectListAtRoute(path: string): Promise<void> {
    await expect.poll(() => new URL(this.page.url()).pathname).toBe(path);
    await expect(this.table).toBeVisible();
  }

  async expectVisibleHeading(name: string | RegExp): Promise<void> {
    await expect(this.locator.heading(name).first()).toBeVisible();
  }

  async clickAction(name: string | RegExp): Promise<void> {
    const action = this.locator.button(name).first();
    if (await action.count()) {
      await action.click();
      return;
    }
    const link = this.locator.link(name).first();
    await link.click();
  }

  protected async expectAnyVisible(locators: Locator[]): Promise<void> {
    for (const locator of locators) {
      if (await locator.count() && await locator.first().isVisible()) return;
    }
    throw new Error('None of the expected page elements are visible');
  }
}
