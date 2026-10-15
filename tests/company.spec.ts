import { test } from "../src/fixtures/fixtures";

test.describe("Company", () => {
  test("Company list is available after authentication", async ({ company }) => {
    await company.open();
    await company.expectLoaded();
    await company.expectListTitle();
  });

});
