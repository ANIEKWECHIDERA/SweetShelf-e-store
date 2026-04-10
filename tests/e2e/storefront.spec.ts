import { test, expect } from "@playwright/test";

test("storefront homepage shows products and checkout link", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Dessert ordering that feels/i })).toBeVisible();
  await expect(page.locator("h2", { hasText: "Red Velvet Slice" })).toBeVisible();

  await page.locator('a[href="/cart"]').first().click();
  await expect(page).toHaveURL(/\/cart/);
});
