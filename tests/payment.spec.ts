import { expect, test } from "../src/fixtures/fixtures";
import { testData } from "../src/data/test-data";
import type { Customer, Invoice, Payment } from "../src/models/enterprise";
import { IdurarApi } from "../src/helpers/idurar-api";

test.describe("Payment", () => {
  test("Payment list is available after authentication", async ({ payment }) => {
    await payment.open();
    await payment.expectLoaded();
  });

  test("creates a payment through the API and displays it in the list", async ({
    appPage,
    payment,
  }) => {
    const customer: Customer = testData.customer();
    const invoice: Invoice = testData.invoice();
    const record: Payment = testData.payment();
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
    const createdInvoice = await api.createJson<{ _id: string }>(
      "/api/invoice/create",
      {
        client: client.result._id,
        number: invoice.number,
        year: invoice.year,
        currency: "USD",
        status: "draft",
        date: invoice.date,
        expiredDate: invoice.expireDate,
        taxRate: 0,
        items: [
          {
            itemName: invoice.itemName,
            description: invoice.itemDescription,
            quantity: invoice.quantity,
            price: invoice.price,
            total: invoice.quantity * invoice.price,
          },
        ],
      },
    );
    const paymentModes = await api.get<
      { _id: string; name: string; enabled: boolean; isDefault: boolean }[]
    >("/api/paymentMode/list");
    const mode = paymentModes.result.find(
      (candidate) =>
        candidate.name === record.paymentModeName &&
        candidate.enabled &&
        candidate.isDefault,
    );
    if (!mode) {
      throw new Error(
        `No enabled default payment mode named "${record.paymentModeName}" was returned by the API`,
      );
    }

    const result = await api.create<{ _id: string }>("/api/payment/create", {
      number: record.number,
      date: new Date(record.date).toUTCString(),
      amount: record.amount,
      paymentMode: mode._id,
      ref: record.reference,
      description: record.description,
      invoice: createdInvoice.result._id,
      client: client.result._id,
    });

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/payment invoice created successfully/i);
    await payment.open();
    await payment.expectLoaded();
    await payment.expectRecordInTable(String(record.number));
  });
});
