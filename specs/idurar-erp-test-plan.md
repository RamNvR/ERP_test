# IDURAR ERP CRM Test Plan

## Objective and scope

Validate the sign-in experience, dashboard, language selector, and the requested Company, People, Customer, Product Category, Product, Invoice, and Payment modules in the IDURAR cloud application.

The initial automated suite includes public login/language checks and authenticated module-list smoke tests. Authenticated checks require a dedicated test account; they are skipped when credentials are not configured. The scenarios below define the broader functional coverage for extending the suite.

## Environment and preconditions

1. Set `BASE_URL` to the target environment (defaults to `https://cloud.idurarapp.com`).
2. Set `APP_EMAIL` and `APP_PASSWORD` for authenticated tests.
3. Use a dedicated test tenant/account with permission to view, create, and delete test records.
4. Configure reference entities needed by dependent workflows before running create tests: Company/People, Customer, Product Category, Product, Invoice, then Payment.
5. Use unique values from `testData` and do not run create/update/delete scenarios against production data.

## Application route map

Observed application navigation and route targets:

| Area | Navigation label | Route |
|---|---|---|
| Dashboard | Dashboard | `/` |
| Invoice | Invoices | `/invoice` |
| Payment | Payments | `/payment` |
| Customer | Customers | `/customer` |
| People | Peoples | `/people` |
| Company | Companies | `/company` |
| Product | Products | `/product` |
| Product Category | Products Category | `/category/product` |

## Test scenarios

### Login

1. **Display sign-in form** — Open the base URL; verify the Sign In heading, email and password fields, Remember Me, Forgot Password, and Log In controls.
2. **Reject invalid credentials** — Submit invalid credentials; verify the sign-in form remains available and an authentication error is presented.
3. **Sign in with a valid test account** — Submit configured credentials; verify navigation to the dashboard and authenticated navigation is available.
4. **Validate required fields** — Submit the empty form; verify required-field validation and no authenticated navigation.

### Dashboard

1. **Load dashboard after sign-in** — Verify invoice, quote, customer, and recent-record panels render.
2. **Switch dashboard reporting period** — Change the available reporting range; verify the dashboard refreshes without a navigation or application error.
3. **Render empty data state** — With an empty test tenant, verify the dashboard panels show their empty states rather than a page error.

### Language

1. **Display language selector** — Verify the selector is available on the sign-in page and authenticated application shell.
2. **Change language** — Choose a supported language and verify visible labels update.
3. **Retain a selected language** — Reload the page and verify the selected locale follows the application’s persistence behavior.

### Company

1. **Open company list** — Navigate to Companies; verify the Company List and its table render.
2. **Search/filter companies** — Search for a known record and use the filter controls; verify matching rows and empty results.
3. **Create a company** — Enter valid company, contact, country, phone, email, and website details; save and verify the created row.
4. **Validate company form** — Submit missing required values and invalid email data; verify field-level validation prevents save.
5. **Edit a company** — Update a test record and verify the changed value in the list.

### People

1. **Open people list** — Navigate to Peoples; verify the People List and table render.
2. **Search people** — Search by a unique first/last name or email and verify the matching row.
3. **Create and edit a person** — Save valid contact details, edit a field, and verify both values.
4. **Validate person form** — Verify required-field and invalid-email validation.

### Customer

1. **Open customer list** — Navigate to Customers; verify the Customer List and table render.
2. **Search customers** — Search by the unique test customer name or email.
3. **Create and edit a customer** — Save valid identity, contact, address, and company details; update and verify a field.
4. **Validate customer form** — Verify required-field and invalid-email validation.
5. **Delete a customer** — Verify canceling the confirmation preserves the record and confirming deletion removes it.

### Product Category

1. **Open product category list** — Navigate to Products Category; verify the list and table render.
2. **Create a category** — Save a unique category and description; verify it appears in the list.
3. **Validate category form** — Submit a missing category name and verify the application prevents saving.
4. **Edit a category** — Update the test category description and verify the new value.

### Product

1. **Open product list** — Navigate to Products; verify the list and table render.
2. **Create a product** — Set a unique name, existing category, price, and description; save and verify the record.
3. **Validate product values** — Verify required name/category fields and non-negative numeric price validation.
4. **Edit a product** — Change the price or description and verify the updated list row.

### Invoice

1. **Open invoice list** — Navigate to Invoices; verify the list and table render.
2. **Create an invoice** — Select a test customer and product, enter valid dates/quantities, save, and verify the invoice number and total.
3. **Validate invoice form** — Verify missing customer/items and invalid dates cannot be saved.
4. **Open invoice details** — Verify the customer, line items, calculated total, and status are consistent with the created invoice.
5. **Search invoices** — Search by generated invoice number and verify the matching record.

### Payment

1. **Open payment list** — Navigate to Payments; verify the list and table render.
2. **Create a payment** — Select a customer and invoice, enter a valid amount/date/mode/reference, save, and verify the payment row.
3. **Validate payment amount** — Verify zero, negative, and over-balance values follow application rules and cannot create invalid payments.
4. **Verify invoice balance/status** — Confirm the payment is reflected in the related invoice balance and status.
5. **Search payments** — Search by the generated payment reference or number.

## Automation design

- Use the page objects under `src/pages/` for navigation and user interactions; keep assertions in test cases or explicit page-object `expectLoaded` methods.
- Use `src/models/enterprise.ts` for typed business entities and `src/data/test-data.ts` for unique record values.
- Keep list-navigation smoke checks independent and read-only. Add CRUD coverage only with a dedicated test tenant and documented cleanup.
- Do not mock IDURAR’s core CRUD endpoints in end-to-end tests. Use `installApiMocks` only for isolated deterministic tests of unavailable or external dependencies.
- Preserve traces, screenshots, and video on failure to support the Playwright healer workflow.

## Current automated mapping

| Scenario | Automation |
|---|---|
| Login using configured account | `tests/login.spec.ts`, with state created by `tests/auth.setup.ts` |
| Dashboard | `tests/dashboard.spec.ts` |
| Language | `tests/language.spec.ts` |
| Company | `tests/company.spec.ts` |
| People | `tests/people.spec.ts` |
| Customer | `tests/customer.spec.ts` |
| Product Category | `tests/product-category.spec.ts` |
| Product | `tests/product.spec.ts` |
| Invoice | `tests/invoice.spec.ts` |
| Payment | `tests/payment.spec.ts` |

The setup project writes the authenticated browser state to `playwright/.auth/idurar.json`; the Chromium project loads it using Playwright's `storageState` configuration.

Authenticated tests require `APP_EMAIL` and `APP_PASSWORD`; with no credentials, Playwright reports those tests as skipped with the setup reason.
