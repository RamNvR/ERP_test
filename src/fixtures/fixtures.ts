import { test as base, type Page } from "@playwright/test";
import { CompanyPage } from "../pages/company-page";
import { CustomerPage } from "../pages/customer-page";
import { DashboardPage } from "../pages/dashboard-page";
import { InvoicePage } from "../pages/invoice-page";
import { LanguagePage } from "../pages/language-page";
import { LoginPage } from "../pages/login-page";
import { PaymentPage } from "../pages/payment-page";
import { PeoplePage } from "../pages/people-page";
import { ProductCategoryPage } from "../pages/product-category-page";
import { ProductPage } from "../pages/product-page";

type TestFixtures = {
  appPage: Page;
  login: LoginPage;
  dashboard: DashboardPage;
  language: LanguagePage;
  company: CompanyPage;
  people: PeoplePage;
  customer: CustomerPage;
  productCategory: ProductCategoryPage;
  product: ProductPage;
  invoice: InvoicePage;
  payment: PaymentPage;
};

export const test = base.extend<TestFixtures>({
  appPage: async ({ page }, use) => {
    await page.goto("/");
    await use(page);
  },
  login: async ({ appPage }, use) => {
    await use(new LoginPage(appPage));
  },
  dashboard: async ({ appPage }, use) => {
    await use(new DashboardPage(appPage));
  },
  language: async ({ appPage }, use) => {
    await use(new LanguagePage(appPage));
  },
  company: async ({ appPage }, use) => {
    await use(new CompanyPage(appPage));
  },
  people: async ({ appPage }, use) => {
    await use(new PeoplePage(appPage));
  },
  customer: async ({ appPage }, use) => {
    await use(new CustomerPage(appPage));
  },
  productCategory: async ({ appPage }, use) => {
    await use(new ProductCategoryPage(appPage));
  },
  product: async ({ appPage }, use) => {
    await use(new ProductPage(appPage));
  },
  invoice: async ({ appPage }, use) => {
    await use(new InvoicePage(appPage));
  },
  payment: async ({ appPage }, use) => {
    await use(new PaymentPage(appPage));
  },
});

export { expect } from "@playwright/test";
