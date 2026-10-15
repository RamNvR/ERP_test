import type { Locator, Page } from '@playwright/test';
import type { Product } from '../models/enterprise';
import { BasePage } from './base-page';

export class ProductPage extends BasePage {
  private readonly nameField: Locator;
  private readonly priceField: Locator;
  private readonly descriptionField: Locator;
  private readonly categoryField: Locator;

  constructor(page: Page) {
    super(page);
    this.nameField = this.form.field('name');
    this.priceField = this.form.field('price');
    this.descriptionField = this.form.field('description');
    this.categoryField = this.form.field('category');
  }

  async open(): Promise<void> {
    await this.openNavigationItem('Products');
  }

  async expectLoaded(): Promise<void> {
    await this.expectListAtRoute('/product');
  }

  async create(product: Product): Promise<void> {
    await this.clickAction(/add new/i);
    await this.form.fill(this.nameField, 'name', product.name);
    await this.form.fill(this.priceField, 'price', product.price);
    await this.form.fill(
      this.descriptionField,
      'description',
      product.description,
    );
    await this.form.choose(this.categoryField, 'category', product.category);
    await this.clickAction(/save|submit/i);
  }
}
