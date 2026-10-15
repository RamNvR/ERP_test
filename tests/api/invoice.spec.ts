import { expect, test } from "../../src/fixtures/fixtures";
import { testData } from "../../src/data/test-data";
import type { Customer, Invoice } from "../../src/models/enterprise";
import { IdurarApi } from "../../src/helpers/idurar-api";

test.describe("Invoice API", () => {
  test("creates an invoice and displays it in the list", async ({
    appPage,
    invoice,
  }) => {
    const customer: Customer = testData.customer();
    const record: Invoice = testData.invoice();
    const api = new IdurarApi(appPage);
    const person = await api.create<{ _id: string }>("/api/people/create", {
      firstname: customer.firstName,
      lastname: customer.lastName,
      email: customer.email,
      phone: customer.phone,
    });
    const client = await api.create<{ _id: string }>("/api/client/create", {
      type: "people",
      people: person.result._id,
    });
    const result = await api.createJson<{ _id: string }>(
      "/api/invoice/create",
      {
        client: client.result._id,
        number: record.number,
        year: record.year,
        currency: "USD",
        status: "draft",
        date: record.date,
        expiredDate: record.expireDate,
        taxRate: 0,
        items: [
          {
            itemName: record.itemName,
            description: record.itemDescription,
            quantity: record.quantity,
            price: record.price,
            total: record.quantity * record.price,
          },
        ],
      },
    );

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/invoice created/i);
    await invoice.open();
    await invoice.expectLoaded();
    await invoice.expectRecordInTable(String(record.number));
  });
});
