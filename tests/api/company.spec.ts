import { expect, test } from "../../src/fixtures/fixtures";
import { testData } from "../../src/data/test-data";
import type { Company } from "../../src/models/enterprise";
import { IdurarApi } from "../../src/helpers/idurar-api";

test.describe("Company API", () => {
  test("creates a company and displays it in the list", async ({
    appPage,
    company,
  }) => {
    const record: Company = testData.company();
    const api = new IdurarApi(appPage);
    const result = await api.create<Company>("/api/company/create", {
      name: record.name,
      phone: record.phone,
      email: record.email,
      website: record.website,
    });

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/success/i);
    await company.open();
    await company.expectLoaded();
    await company.expectRecordInTable(record.name);
  });
});
