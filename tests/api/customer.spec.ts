import { expect, test } from "../../src/fixtures/fixtures";
import { testData } from "../../src/data/test-data";
import type { Customer } from "../../src/models/enterprise";
import { IdurarApi } from "../../src/helpers/idurar-api";

test.describe("Customer API", () => {
  test("creates a customer and displays it in the list", async ({
    appPage,
    customer,
  }) => {
    const record: Customer = testData.customer();
    const api = new IdurarApi(appPage);
    const person = await api.create<{ _id: string }>("/api/people/create", {
      firstname: record.firstName,
      lastname: record.lastName,
      email: record.email,
      phone: record.phone,
    });
    const result = await api.create<{ _id: string }>("/api/client/create", {
      type: "people",
      people: person.result._id,
    });

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/created/i);
    await customer.open();
    await customer.expectLoaded();
    await customer.expectRecordInTable(record.email);
  });
});
