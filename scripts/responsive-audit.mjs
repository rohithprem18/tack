import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { PrismaClient } from "../node_modules/@prisma/client/index.js";

const BASE = "http://localhost:3000";
const OUT = "docs/audit";
mkdirSync(OUT, { recursive: true });

const prisma = new PrismaClient();
const board = await prisma.board.findFirst({ where: { title: "Tack launch" } });
await prisma.$disconnect();
const slug = board?.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const browser = await chromium.launch({
  args: ["--font-render-hinting=none", "--disable-lcd-text", "--force-color-profile=srgb"],
});

const widths = [320, 375, 414, 768, 1024];
const height = 900;

async function loginContext() {
  const context = await browser.newContext({ viewport: { width: 500, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`${BASE}/login`);
  await page.fill("#email", "demo@tack.app");
  await page.fill("#password", "password123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await page.waitForURL(`${BASE}/boards`);
  return context;
}

const authedContext = await loginContext();

for (const width of widths) {
  // Landing (unauthenticated)
  {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto(`${BASE}/`);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/landing-${width}.png`, fullPage: true });
    await context.close();
  }
  // Login
  {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto(`${BASE}/login`);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/login-${width}.png`, fullPage: true });
    await context.close();
  }
  // Boards grid (authenticated) — reuse cookies
  {
    const page = await authedContext.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(`${BASE}/boards`);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/boards-${width}.png`, fullPage: true });
    await page.close();
  }
  // Board detail (authenticated)
  if (board) {
    const page = await authedContext.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(`${BASE}/boards/${board.id}/${slug}`);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/board-${width}.png` });
    await page.close();
  }
}

await browser.close();
console.log("done");
