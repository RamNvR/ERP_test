import { expect, test } from "../../src/fixtures/fixtures";
import { testData } from "../../src/data/test-data";
import type { Person } from "../../src/models/enterprise";
import { IdurarApi } from "../../src/helpers/idurar-api";

test.describe("People API", () => {
  test("creates a person and displays it in the list", async ({
    appPage,
    people,
  }) => {
    const person: Person = testData.person();
    const api = new IdurarApi(appPage);
    const result = await api.create<{ _id: string }>("/api/people/create", {
      firstname: person.firstName,
      lastname: person.lastName,
      email: person.email,
      phone: person.phone,
    });

    await people.open();
    await people.expectLoaded();
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/created/i);
    await people.expectRecordInTable(person.email);
  });
});
