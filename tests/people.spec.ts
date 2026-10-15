import { test } from "../src/fixtures/fixtures";

test.describe("People", () => {
  test("People list is available after authentication", async ({ people }) => {
    await people.open();
    await people.expectLoaded();
  });
});
