import { test, expect } from "../src/fixtures/fixtures";
import { testData } from "../src/data/test-data";
import type { ProductCategory } from "../src/models/enterprise";
import { IdurarApi } from "../src/helpers/idurar-api";

test.describe("Product", () => {
  test("Product list is available after authentication", async ({
    product,
  }) => {
    await product.open();
    await product.expectLoaded();
  });

  test("creates a product through the API and displays it in the list", async ({
    appPage,
    product,
  }) => {
    const category: ProductCategory = testData.productCategory();
    const record = testData.product();
    const api = new IdurarApi(appPage);
    const categoryResult = await api.create<{ _id: string }>(
      "/api/generalproductcategory/create",
      {
        name: category.name,
        description: category.description,
        color: category.color,
        enabled: category.enabled,
      },
    );
    const result = await api.create<{ _id: string }>("/api/generalproduct/create", {
      name: record.name,
      category: categoryResult.result._id,
      currency: "USD",
      price: record.price,
      description: record.description,
    });

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/created/i);
    await product.open();
    await product.expectLoaded();
    await product.expectRecordInTable(record.name);
  });
});
