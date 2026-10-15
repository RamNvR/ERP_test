import type { Locator, Page } from '@playwright/test';
import type { Customer } from '../models/enterprise';
import { BasePage } from './base-page';

export class CustomerPage extends BasePage {
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly addressField: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameField = this.form.field('first name');
    this.lastNameField = this.form.field('last name');
    this.emailField = this.form.field('email');
    this.phoneField = this.form.field('phone');
    this.companyField = this.form.field('company');
    this.addressField = this.form.field('address');
  }

  async open(): Promise<void> {
    await this.openNavigationItem('Customers');
  }

  async expectLoaded(): Promise<void> {
    await this.expectListAtRoute('/customer');
  }

  async create(customer: Customer): Promise<void> {
    await this.clickAction(/add new/i);
    await this.form.fill(this.firstNameField, 'first name', customer.firstName);
    await this.form.fill(this.lastNameField, 'last name', customer.lastName);
    await this.form.fill(this.emailField, 'email', customer.email);
    await this.form.fill(this.phoneField, 'phone', customer.phone);
    await this.form.fill(this.companyField, 'company', customer.companyName);
    await this.form.fill(this.addressField, 'address', customer.address);
    await this.clickAction(/save|submit/i);
  }
}
