import { test } from "../src/fixtures/fixtures";

test.describe("Invoice", () => {
  test("Invoice list is available after authentication", async ({ invoice }) => {
    await invoice.open();
    await invoice.expectLoaded();
  });

});
