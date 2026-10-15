import type { Locator, Page } from '@playwright/test';
import type { ProductCategory } from '../models/enterprise';
import { BasePage } from './base-page';

export class ProductCategoryPage extends BasePage {
  private readonly nameField: Locator;
  private readonly descriptionField: Locator;

  constructor(page: Page) {
    super(page);
    this.nameField = this.form.field('name');
    this.descriptionField = this.form.field('description');
  }

  async open(): Promise<void> {
    await this.openNavigationItem('Products Category');
  }

  async expectLoaded(): Promise<void> {
    await this.expectListAtRoute('/category/product');
  }

  async create(category: ProductCategory): Promise<void> {
    await this.clickAction(/add new/i);
    await this.form.fill(this.nameField, 'name', category.name);
    await this.form.fill(
      this.descriptionField,
      'description',
      category.description,
    );
    await this.clickAction(/save|submit/i);
  }
}
