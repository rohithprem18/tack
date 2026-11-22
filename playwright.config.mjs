import { defineConfig, devices } from "playwright/test";

const port = process.env.PORT || 3000;
// NB: use "localhost", not "127.0.0.1" — the Next.js dev server only allows
// "localhost" as a dev origin by default and blocks static chunks otherwise.
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;

/**
 * End-to-end tests run against a production build (`next build` + `next start`)
 * backed by a real Postgres database. The webServer below boots the app
 * automatically; set the usual env (DATABASE_URL, AUTH_SECRET) or rely on the
 * repo's .env file. Run with: npm run test:e2e
 */
export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  // `next dev` compiles routes on first hit, so allow generous timeouts.
  timeout: 120_000,
  reporter: [["list"]],
  use: {
    baseURL,
    headless: true,
    navigationTimeout: 60_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Run the dev server: the app's proxy.ts looks for the __Secure- session
    // cookie whenever NODE_ENV=production, which a plain-http `next start`
    // never sets, so auth redirects would loop on http. Dev mode keeps the
    // cookie names consistent on http://127.0.0.1.
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
