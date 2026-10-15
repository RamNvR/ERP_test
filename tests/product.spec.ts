import { test } from "../src/fixtures/fixtures";

test.describe("Product", () => {
  test("Product list is available after authentication", async ({ product }) => {
    await product.open();
    await product.expectLoaded();
  });
});
