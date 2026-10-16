import { expect, type Locator, type Page } from '@playwright/test';
import { FormFields } from '../helpers/form';

export abstract class BasePage {
  protected readonly menuButton: Locator;
  protected readonly table: Locator;
  protected readonly form: FormFields;
  private readonly successMessage: Locator;
  private readonly locator: {
    link: (name: string | RegExp, exact?: boolean) => Locator;
    button: (name: string | RegExp) => Locator;
    heading: (name: string | RegExp) => Locator;
  };

  protected constructor(protected readonly page: Page) {
    this.menuButton = page.getByRole('button', { name: 'menu' });
    this.table = page.getByRole('table');
    this.form = new FormFields(page);
    this.successMessage = page
      .locator(
        '.ant-message-notice-content, .ant-notification-notice-message, [role="alert"]',
      )
      .filter({ hasText: /success|created|saved/i });
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

  async expectCreatedRecord(value: string): Promise<void> {
    await expect(this.successMessage.last()).toBeVisible();
    await this.expectRecordInTable(value);
  }

  async expectRecordInTable(value: string): Promise<void> {
    await expect(
      this.table.getByRole('row').filter({ hasText: value }).first(),
    ).toBeVisible();
  }

  async expectRecordNotInTable(value: string): Promise<void> {
    await expect(
      this.table.getByRole('row').filter({ hasText: value }),
    ).toHaveCount(0);
  }

  async deleteRecordFromTable(value: string, confirm: boolean): Promise<void> {
    const row = this.table.getByRole('row').filter({ hasText: value }).first();
    await expect(row).toBeVisible();

    const deleteAction = row
      .getByRole('button', { name: /delete/i })
      .or(
        row.locator(
          'button[title*="delete" i], button[aria-label*="delete" i], ' +
            '[role="button"][title*="delete" i], [role="button"][aria-label*="delete" i], ' +
            'button:has(svg[data-icon="delete"]), button:has(.anticon-delete)',
        ),
      )
      .first();
    await deleteAction.click();

    const confirmation = this.page.locator(
      '.ant-popover:visible, .ant-modal:visible',
    ).last();
    await expect(confirmation).toBeVisible();
    const action = confirm
      ? confirmation.getByRole('button', {
          name: /^(delete|ok|yes|confirm)$/i,
        })
      : confirmation.getByRole('button', { name: /^(cancel|no)$/i });
    await action.click();

    if (confirm) {
      await this.expectRecordNotInTable(value);
    } else {
      await expect(row).toBeVisible();
    }
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
