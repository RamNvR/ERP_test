import type { Locator, Page } from '@playwright/test';
import type { Person } from '../models/enterprise';
import { BasePage } from './base-page';

export class PeoplePage extends BasePage {
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly phoneField: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameField = this.form.field('first name');
    this.lastNameField = this.form.field('last name');
    this.emailField = this.form.field('email');
    this.phoneField = this.form.field('phone');
  }

  async open(): Promise<void> {
    await this.openNavigationItem('Peoples');
  }

  async expectLoaded(): Promise<void> {
    await this.expectListAtRoute('/people');
  }

  async create(person: Person): Promise<void> {
    await this.clickAction(/add new/i);
    await this.form.fill(this.firstNameField, 'first name', person.firstName);
    await this.form.fill(this.lastNameField, 'last name', person.lastName);
    await this.form.fill(this.emailField, 'email', person.email);
    await this.form.fill(this.phoneField, 'phone', person.phone);
    await this.clickAction(/save|submit/i);
  }
}
