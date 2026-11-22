import { test, expect } from "playwright/test";
import { DEMO_USER, login, register, unique } from "./helpers.mjs";

test.describe("authentication", () => {
  test("registering a new account lands on the boards page", async ({ page }) => {
    const email = unique("e2e") + "@example.com";
    await register(page, { name: "E2E Tester", email, password: "sup3r-secret" });
    await expect(page).toHaveURL(/\/boards$/);
    await expect(page.getByRole("heading", { name: "Your boards" })).toBeVisible();
  });

  test("registering with a short password shows a validation error", async ({ page }) => {
    const email = unique("e2e") + "@example.com";
    await page.goto("/register");
    await page.locator("#name").fill("E2E Tester");
    await page.locator("#email").fill(email);
    await page.locator("#password").fill("short");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Password must be at least 8 characters.")).toBeVisible();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("logging in with the seeded demo account works", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: "Your boards" })).toBeVisible();
  });

  test("wrong password keeps the user on the login page with an error", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#email").fill(DEMO_USER.email);
    await page.locator("#password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByText("Wrong email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("logging out returns to the landing page", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL(/\/$/);
    await expect(page).toHaveURL(/\/$/);
  });
});
