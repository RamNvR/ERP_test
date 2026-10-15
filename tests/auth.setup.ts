import { test, expect } from "../src/fixtures/fixtures";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const authFile = path.resolve(process.cwd(), "playwright/.auth/idurar.json");

test("authenticate and save browser storage state", async ({
  page,
  context,
  login,
}) => {
  await login.goto();
  await login.login();
  await expect(
    page.getByRole("heading", { name: "Paid Invoice", exact: true }),
  ).toBeVisible();
  await mkdir(path.dirname(authFile), { recursive: true });
  await context.storageState({ path: authFile });
});
