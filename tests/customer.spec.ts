import { test } from "../src/fixtures/fixtures";

test.describe("Customer", () => {
  test("Customer list is available after authentication", async ({
    customer,
  }) => {
    await customer.open();
    await customer.expectLoaded();
  });

});
