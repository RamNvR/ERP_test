import type {
  Company,
  Customer,
  Invoice,
  Payment,
  Person,
  Product,
  ProductCategory,
} from '../models/enterprise';

const unique = (value: string) =>
  `${value}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const testData = {
  company: (): Company => ({
    name: unique('E2E Company'),
    contactName: '',
    email: `${unique('company')}@example.test`,
    phone: '+1 202 555 0147',
    country: 'United States',
    website: 'www.example.test',
  }),
  person: (): Person => ({
    firstName: 'Taylor',
    lastName: unique('Person'),
    email: `${unique('person')}@example.test`,
    phone: '+1 202 555 0148',
  }),
  customer: (): Customer => ({
    firstName: 'Jordan',
    lastName: unique('Customer'),
    email: `${unique('customer')}@example.test`,
    phone: '+1 202 555 0149',
    companyName: unique('Customer Co'),
    country: 'United States',
    address: '200 Customer Avenue',
  }),
  productCategory: (): ProductCategory => ({
    name: unique('E2E Category'),
    description: 'Automated test category',
  }),
  product: (): Product => ({
    name: unique('E2E Product'),
    category: 'Services',
    price: 125,
    description: 'Automated test product',
  }),
  invoice: (): Invoice => ({
    number: Math.floor(Date.now() % 100_000),
    year: new Date().getFullYear(),
    clientName: 'Test Customer',
    date: '31/12/2030',
    expireDate: '31/01/2031',
    itemName: unique('E2E Item'),
    itemDescription: 'Automated test invoice item',
    quantity: 1,
    price: 125,
    note: 'Automated test invoice',
  }),
  payment: (): Payment => ({
    number: unique('E2E Payment'),
    clientName: 'Test Customer',
    amount: 125,
    date: '2030-12-31',
    mode: 'Cash',
    reference: unique('E2E Reference'),
  }),
};
