import { test, expect } from "@playwright/test";

test("storefront homepage shows products and checkout link", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Pastry storefront/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Red Velvet Slice" })).toBeVisible();

  await page.getByRole("link", { name: /^Cart \(\d+\)$/ }).click();
  await expect(page).toHaveURL(/\/cart/);
});
