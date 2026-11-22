/**
 * Shared helpers for the tack end-to-end tests.
 *
 * The suite assumes a seeded database (`npm run seed`), which provides the
 * demo account below. Tests that create data use unique titles/emails so they
 * can run repeatedly against the same database.
 */

export const DEMO_USER = { email: "demo@tack.app", password: "password123" };

export function unique(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function login(page, { email = DEMO_USER.email, password = DEMO_USER.password } = {}) {
  await page.goto("/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("**/boards");
  await page.getByRole("heading", { name: "Your boards" }).waitFor();
  // Wait for hydration so client-side onClick handlers (e.g. "New board")
  // are attached before we click them.
  await page.waitForLoadState("networkidle");
}

export async function register(page, { name, email, password }) {
  await page.goto("/register");
  await page.locator("#name").fill(name);
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/boards");
  await page.getByRole("heading", { name: "Your boards" }).waitFor();
  await page.waitForLoadState("networkidle");
}

export async function createBoard(page, title) {
  await page.getByRole("button", { name: "New board" }).click();
  await page.getByPlaceholder("Board title").fill(title);
  await page.getByRole("button", { name: "Create board" }).click();
  // createBoardAction redirects straight into the new board's page.
  await page.waitForURL(/\/boards\/[^/]+/);
  await page.getByRole("heading", { name: title, exact: true }).waitFor();
  await page.waitForLoadState("networkidle");
}

export async function openBoard(page, title) {
  await page.getByRole("link", { name: new RegExp(title) }).click();
  await page.getByRole("heading", { name: title, exact: true }).waitFor();
  await page.waitForLoadState("networkidle");
}

/** The column wrapper of a list on the board page. */
function listColumn(page, listTitle) {
  return page
    .locator("main span.uppercase", { hasText: listTitle })
    .first()
    .locator('xpath=ancestor::div[contains(@class,"w-[280px]")][1]');
}

/** A draggable card on the board page. dnd-kit marks sortables with aria-roledescription. */
function card(page, cardTitle) {
  return page.locator('[aria-roledescription="sortable"]', { hasText: cardTitle }).first();
}

export async function addList(page, listTitle) {
  await page.getByRole("button", { name: "Add list" }).click();
  const input = page.getByPlaceholder("List title");
  await input.fill(listTitle);
  await input.press("Enter");
  await input.press("Escape"); // close the inline composer so the button returns
  await page.locator("main span.uppercase", { hasText: listTitle }).waitFor();
  // The board renders new lists optimistically with a temp id; reload so the
  // next steps (e.g. addCard) act on the persisted, real list id.
  await page.reload();
  await page.waitForLoadState("networkidle");
  await page.locator("main span.uppercase", { hasText: listTitle }).waitFor();
}

export async function addCard(page, listTitle, cardTitle) {
  const column = listColumn(page, listTitle);
  await column.getByRole("button", { name: "Add card" }).click();
  const input = column.getByPlaceholder("Card title");
  await input.fill(cardTitle);
  await input.press("Enter");
  await input.press("Escape"); // close the inline composer so the button returns
  await card(page, cardTitle).waitFor();
  // Same optimistic-temp-id race as addList: reload to reach the persisted card.
  await page.reload();
  await page.waitForLoadState("networkidle");
  await card(page, cardTitle).waitFor();
}

/**
 * Drag a card onto another list using raw pointer events. The board uses
 * dnd-kit's PointerSensor (activation distance 4px), which Playwright's
 * mouse API drives reliably when the pointer moves in several steps.
 */
export async function dragCardToList(page, cardTitle, targetListTitle) {
  const source = card(page, cardTitle);
  const target = listColumn(page, targetListTitle);
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) throw new Error(`drag: cannot locate "${cardTitle}" or "${targetListTitle}"`);

  const sx = from.x + from.width / 2;
  const sy = from.y + from.height / 2;
  const tx = to.x + to.width / 2;
  const ty = to.y + Math.min(to.height - 12, 90);

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + 8, sy + 8, { steps: 4 }); // exceed the 4px activation distance
  await page.mouse.move(tx, ty, { steps: 24 });
  await page.waitForTimeout(250);
  await page.mouse.up();
  await page.waitForTimeout(400); // let the server action + router.refresh() settle
}
