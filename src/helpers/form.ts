import type { Locator, Page } from '@playwright/test';

export class FormFields {
  private readonly formItems: Locator;

  constructor(private readonly page: Page) {
    this.formItems = page.locator('.ant-form-item');
  }

  field(label: string): Locator {
    return this.page.getByLabel(label, { exact: false }).first();
  }

  async fill(
    field: Locator,
    label: string,
    value: string | number,
  ): Promise<void> {
    const text = String(value);
    if (await field.count()) {
      await field.fill(text);
      return;
    }

    const byPlaceholder = this.page.getByPlaceholder(label, { exact: false }).first();
    if (await byPlaceholder.count()) {
      await byPlaceholder.fill(text);
      return;
    }

    const formItem = this.formItems
      .filter({ has: this.page.getByText(label, { exact: false }) })
      .first();
    const input = formItem.locator('input, textarea').first();
    if (await input.count()) {
      await input.fill(text);
      return;
    }

    throw new Error(`Could not find an editable field for "${label}"`);
  }

  async choose(
    field: Locator,
    label: string,
    option: string,
  ): Promise<void> {
    const target =
      (await field.count())
        ? field
        : this.formItems
            .filter({ has: this.page.getByText(label, { exact: false }) })
            .first()
            .locator('.ant-select, select')
            .first();

    if (!(await target.count())) {
      throw new Error(`Could not find a selectable field for "${label}"`);
    }
    await target.click();
    const optionLocator = this.page.getByText(option, { exact: true }).last();
    await optionLocator.waitFor({ state: 'visible' });
    await optionLocator.click();
  }
}
