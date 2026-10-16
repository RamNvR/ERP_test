import { randomUUID } from "node:crypto";
import { test } from "../src/fixtures/fixtures";
import { testData } from "../src/data/test-data";

test.describe("Customer", () => {
  test("Customer list is available after authentication", async ({
    customer,
  }) => {
    await customer.open();
    await customer.expectLoaded();
  });

  test("keeps a customer when deletion is canceled", async ({
    customer,
  }) => {
    const record = {
      ...testData.customer(),
      email: `customer-delete-${randomUUID()}@example.test`,
    };
    await customer.open();
    await customer.expectLoaded();
    await customer.create(record);
    await customer.expectRecordInTable(record.email);

    await customer.deleteRecordFromTable(record.email, false);
    await customer.expectRecordInTable(record.email);
    await customer.deleteRecordFromTable(record.email, true);
  });

  test("removes a customer after deletion is confirmed", async ({
    customer,
  }) => {
    const record = {
      ...testData.customer(),
      email: `customer-delete-${randomUUID()}@example.test`,
    };
    await customer.open();
    await customer.expectLoaded();
    await customer.create(record);
    await customer.expectRecordInTable(record.email);

    await customer.deleteRecordFromTable(record.email, true);
    await customer.expectRecordNotInTable(record.email);
  });
});
