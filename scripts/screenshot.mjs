import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "docs/screenshots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  args: ["--font-render-hinting=none", "--disable-lcd-text", "--force-color-profile=srgb"],
});

async function shot(path, name, viewport, { login = false, boardId, fullPage = false } = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await context.newPage();

  if (login) {
    await page.goto(`${BASE}/login`);
    await page.fill("#email", "demo@tack.app");
    await page.fill("#password", "password123");
    await page.getByRole("button", { name: "Log in", exact: true }).click();
    await page.waitForURL(`${BASE}/boards`);
  }

  const url = boardId ? `${BASE}/boards/${boardId}` : `${BASE}${path}`;
  await page.goto(url);
  await page.waitForTimeout(900); // let entrance animations settle

  if (fullPage) {
    // whileInView only fires on a real scroll — Playwright's fullPage capture
    // doesn't scroll through the page, so walk it manually first or
    // below-the-fold motion sections stay stuck at opacity: 0.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 400) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(60);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
  }

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
  await context.close();
}

const desktop = { width: 1280, height: 800 };
const mobile = { width: 390, height: 844 };

await shot("/", "landing-desktop", desktop);
await shot("/", "landing-full", desktop, { fullPage: true });
await shot("/", "landing-mobile", mobile);
await shot("/login", "login-desktop", desktop);

// boards + board detail need auth
await shot("/boards", "boards-desktop", desktop, { login: true });

const { PrismaClient } = await import("../node_modules/@prisma/client/index.js");
const prisma = new PrismaClient();
const board = await prisma.board.findFirst({ where: { title: "Tack launch" } });
await prisma.$disconnect();

if (board) {
  await shot(null, "board-desktop", desktop, { login: true, boardId: board.id });
  await shot(null, "board-mobile", mobile, { login: true, boardId: board.id });
}

await browser.close();
console.log("done");
