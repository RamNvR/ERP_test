import { test, expect } from "../src/fixtures/fixtures";

test.describe("Login", () => {
  test("Configured account reaches the dashboard", async ({ dashboard }) => {
    await dashboard.expectLoaded();
  });
});
