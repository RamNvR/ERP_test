import type { Page, Route } from '@playwright/test';

export interface ApiMock {
  method?: string;
  url: string | RegExp;
  status?: number;
  body: unknown;
}

export async function installApiMocks(page: Page, mocks: ApiMock[]): Promise<void> {
  for (const mock of mocks) {
    await page.route(mock.url, async (route: Route) => {
      if (mock.method && route.request().method() !== mock.method.toUpperCase()) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: mock.status ?? 200,
        contentType: 'application/json',
        body: JSON.stringify(mock.body),
      });
    });
  }
}
