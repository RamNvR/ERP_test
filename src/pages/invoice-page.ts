import type { Locator, Page } from '@playwright/test';
import type { Invoice } from '../models/enterprise';
import { BasePage } from './base-page';

export class InvoicePage extends BasePage {
  private readonly clientField: Locator;
  private readonly numberField: Locator;
  private readonly yearField: Locator;
  private readonly dateField: Locator;
  private readonly expireDateField: Locator;
  private readonly noteField: Locator;
  private readonly itemNameField: Locator;
  private readonly itemDescriptionField: Locator;
  private readonly quantityField: Locator;
  private readonly priceField: Locator;

  constructor(page: Page) {
    super(page);
    this.clientField = this.form.field('client');
    this.numberField = this.form.field('number');
    this.yearField = this.form.field('year');
    this.dateField = this.form.field('date');
    this.expireDateField = this.form.field('expire date');
    this.noteField = this.form.field('note');
    this.itemNameField = this.form.field('item name');
    this.itemDescriptionField = this.form.field('description name');
    this.quantityField = page.getByRole('spinbutton').nth(2);
    this.priceField = page.getByRole('spinbutton').nth(3);
  }

  async open(): Promise<void> {
    await this.openNavigationItem('Invoices');
  }

  async expectLoaded(): Promise<void> {
    await this.expectListAtRoute('/invoice');
  }

  async create(invoice: Invoice): Promise<void> {
    await this.clickAction(/add new/i);
    await this.form.choose(this.clientField, 'client', invoice.clientName);
    await this.form.fill(this.numberField, 'number', invoice.number);
    await this.form.fill(this.yearField, 'year', invoice.year);
    await this.form.fill(this.dateField, 'date', invoice.date);
    await this.form.fill(
      this.expireDateField,
      'expire date',
      invoice.expireDate,
    );
    await this.form.fill(this.noteField, 'note', invoice.note);
    await this.form.fill(this.itemNameField, 'item name', invoice.itemName);
    await this.form.fill(
      this.itemDescriptionField,
      'description name',
      invoice.itemDescription,
    );
    await this.quantityField.fill(String(invoice.quantity));
    await this.priceField.fill(String(invoice.price));
    await this.clickAction(/^plus save$|^save$/i);
  }
}
