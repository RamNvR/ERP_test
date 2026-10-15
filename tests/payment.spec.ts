import { test } from "../src/fixtures/fixtures";

test.describe("Payment", () => {
  test("Payment list is available after authentication", async ({ payment }) => {
    await payment.open();
    await payment.expectLoaded();
  });

});
