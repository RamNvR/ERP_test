import { expect, type Locator, type Page } from '@playwright/test';
import type { Company } from '../models/enterprise';
import { BasePage } from './base-page';

export class CompanyPage extends BasePage {
  private readonly nameField: Locator;
  private readonly contactField: Locator;
  private readonly countryField: Locator;
  private readonly phoneField: Locator;
  private readonly emailField: Locator;
  private readonly websiteField: Locator;
  private readonly listTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.nameField = this.form.field('name');
    this.contactField = this.form.field('contact');
    this.countryField = this.form.field('country');
    this.phoneField = this.form.field('phone');
    this.emailField = this.form.field('email');
    this.websiteField = this.form.field('website');
    this.listTitle = page.getByText('Company List', { exact: true });
  }

  async open(): Promise<void> {
    await this.openNavigationItem('Companies');
  }

  async expectLoaded(): Promise<void> {
    await this.expectListAtRoute('/company');
  }

  async expectListTitle(): Promise<void> {
    await expect(this.listTitle).toBeVisible();
  }

  async create(company: Company): Promise<void> {
    await this.clickAction(/add new company/i);
    await this.form.fill(this.nameField, 'name', company.name);
    if (company.contactName) {
      await this.form.choose(this.contactField, 'contact', company.contactName);
    }
    if (company.country) {
      await this.form.choose(this.countryField, 'country', company.country);
    }
    await this.form.fill(this.phoneField, 'phone', company.phone);
    await this.form.fill(this.emailField, 'email', company.email);
    await this.form.fill(this.websiteField, 'website', company.website);
    await this.clickAction(/submit/i);
  }
}
