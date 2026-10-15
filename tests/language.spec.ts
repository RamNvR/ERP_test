import { test } from "../src/fixtures/fixtures";

test.describe("Language", () => {
  test("English can be selected in the authenticated application", async ({
    language,
  }) => {
    await language.choose("english");
  });
});
