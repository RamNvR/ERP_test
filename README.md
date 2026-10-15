# IDURAR Playwright Enterprise Tests

Playwright + TypeScript UI automation for `https://cloud.idurarapp.com/`, organized around page objects, typed enterprise test data, and reusable helpers.

## Requirements

- Node.js 20 or later
- npm
- An IDURAR account for authenticated module coverage

The Playwright MCP server is installed as a development dependency and configured for this workspace in `.vscode/mcp.json`. After `npm install`, open the MCP server controls in VS Code and start **playwright**. Restart the server after changing its configuration.

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Set `APP_EMAIL` and `APP_PASSWORD` in `.env` for authenticated checks. Configure a different environment using `BASE_URL`.

The Playwright `setup` project signs in once per run and saves browser state to `playwright/.auth/idurar.json`. The Chromium project depends on setup and loads that state through `use.storageState`. The saved authentication file is ignored by Git.

## Run

```bash
npm test
npm run test:headed
npm run test:ui
npm run report
```

The setup project requires valid credentials. Each module has its own spec and reuses the saved login state; the shared `appPage` fixture navigates to the application. The Company, Customer, People, Product Category, Product, Invoice, and Payment specs create records through the authenticated application API and verify the resulting records in their UI tables. Workflows create any required related records first (for example, a person and customer before an invoice, or a customer and invoice before a payment). These tests use typed entity models, readable unique test-data factories, page objects, and shared API helpers. API mocks are available for scenarios that need deterministic endpoint responses; they are not used for live create workflows.

## Project structure

- `playwright.config.ts`: browser, reporting, retries, timeouts, and base URL.
- `src/pages/`: page objects for Login, Dashboard, Language, Company, People, Customer, Product Category, Product, Invoice, and Payment.
- `src/models/enterprise.ts`: typed business entities used by test workflows.
- `src/data/test-data.ts`: isolated, unique data factories.
- `src/helpers/`: environment, form interaction, and optional API route mocking helpers.
- `src/fixtures/fixtures.ts`: typed page-object fixtures and shared application-page navigation.
- `tests/auth.setup.ts`: creates the shared authenticated browser storage state.
- `tests/*.spec.ts`: individual module specs, including selected live create-and-verify workflows.
- `specs/idurar-erp-test-plan.md`: scenario-level functional coverage plan.
- `.github/agents/`: official Playwright planner, generator, and healer agent modes.

The suite defaults to live application behavior. `installApiMocks` is available for tests that need deterministic API responses; mocks should only be installed for endpoints relevant to the specific test.

The official Playwright agents are initialized for VS Code with `npx playwright init-agents --loop=vscode`. Use the planner to refine `specs/idurar-erp-test-plan.md`, the generator to add tests for individual plan scenarios, and the healer to diagnose and repair failing tests.
