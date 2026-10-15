import { test } from "../src/fixtures/fixtures";

test.describe("Product Category", () => {
  test("Product Category list is available after authentication", async ({
    productCategory,
  }) => {
    await productCategory.open();
    await productCategory.expectLoaded();
  });

});
