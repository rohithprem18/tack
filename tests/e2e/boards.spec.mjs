import { test, expect } from "playwright/test";
import {
  addCard,
  addList,
  createBoard,
  dragCardToList,
  login,
  unique,
} from "./helpers.mjs";

test.describe("board workflow", () => {
  test("create a board, add a list and a card, then mark the card complete", async ({ page }) => {
    const boardTitle = unique("E2E Board");
    const listTitle = unique("Todo");
    const cardTitle = unique("Write e2e tests");

    await login(page);
    await createBoard(page, boardTitle);

    await expect(page.getByText("No lists yet. Add one to start.")).toBeVisible();

    await addList(page, listTitle);
    await addCard(page, listTitle, cardTitle);

    const card = page.locator('[aria-roledescription="sortable"]', { hasText: cardTitle });
    await expect(card).toBeVisible();

    // Toggle the card to completed via its checkbox button.
    await card.getByRole("button", { name: "Mark complete" }).click();
    await expect(card.getByRole("button", { name: "Mark incomplete" })).toBeVisible();

    // Reload: the completed state must persist in the database.
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(
      page.locator('[aria-roledescription="sortable"]', { hasText: cardTitle })
        .getByRole("button", { name: "Mark incomplete" })
    ).toBeVisible();
  });

  test("move a card between lists with drag and drop", async ({ page }) => {
    const boardTitle = unique("E2E DnD");
    const todo = unique("Todo");
    const doing = unique("Doing");
    const cardTitle = unique("Drag me");

    await login(page);
    await createBoard(page, boardTitle);

    await addList(page, todo);
    await addList(page, doing);
    await addCard(page, todo, cardTitle);

    await dragCardToList(page, cardTitle, doing);

    const doingColumn = page
      .locator("main span.uppercase", { hasText: doing })
      .first()
      .locator('xpath=ancestor::div[contains(@class,"w-[280px]")][1]');
    await expect(
      doingColumn.locator('[aria-roledescription="sortable"]', { hasText: cardTitle })
    ).toBeVisible();

    // The move must persist after a reload (server action wrote to Postgres).
    await page.reload();
    await page.waitForLoadState("networkidle");
    const doingColumnAfter = page
      .locator("main span.uppercase", { hasText: doing })
      .first()
      .locator('xpath=ancestor::div[contains(@class,"w-[280px]")][1]');
    await expect(
      doingColumnAfter.locator('[aria-roledescription="sortable"]', { hasText: cardTitle })
    ).toBeVisible();
  });

  test("search box dims cards that do not match", async ({ page }) => {
    const boardTitle = unique("E2E Search");
    const listTitle = unique("Inbox");
    const matching = unique("quarterly report");
    const other = unique("unrelated chore");

    await login(page);
    await createBoard(page, boardTitle);
    await addList(page, listTitle);
    await addCard(page, listTitle, matching);
    await addCard(page, listTitle, other);

    const search = page.getByPlaceholder("Search cards…");
    await search.fill(matching.slice(0, 12));

    const matchingCard = page.locator('[aria-roledescription="sortable"]', { hasText: matching });
    const otherCard = page.locator('[aria-roledescription="sortable"]', { hasText: other });
    await expect(matchingCard).not.toHaveClass(/opacity-35/);
    await expect(otherCard).toHaveClass(/opacity-35/);

    await search.fill("");
    await expect(otherCard).not.toHaveClass(/opacity-35/);
  });
});
