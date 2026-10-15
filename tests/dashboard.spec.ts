import { test } from "../src/fixtures/fixtures";

test.describe("Dashboard", () => {
  test("Dashboard loads after authentication", async ({ dashboard }) => {
    await dashboard.expectLoaded();
  });
});
