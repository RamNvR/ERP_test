import { expect, test } from "../../src/fixtures/fixtures";
import { testData } from "../../src/data/test-data";
import type { ProductCategory } from "../../src/models/enterprise";
import { IdurarApi } from "../../src/helpers/idurar-api";

test.describe("Product Category API", () => {
  test("creates a category and displays it in the list", async ({
    appPage,
    productCategory,
  }) => {
    const category: ProductCategory = testData.productCategory();
    const api = new IdurarApi(appPage);
    const result = await api.create<{ _id: string }>(
      "/api/generalproductcategory/create",
      {
        name: category.name,
        description: category.description,
        color: category.color,
        enabled: category.enabled,
      },
    );

    await productCategory.open();
    await productCategory.expectLoaded();
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/created/i);
    await productCategory.expectRecordInTable(category.name);
  });
});
