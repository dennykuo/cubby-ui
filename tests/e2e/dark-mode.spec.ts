import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

/**
 * `dark:` variant 必須跟隨 `.dark` class（與色彩 token 一致），而不是作業系統的
 * `prefers-color-scheme`。回歸：theme.css 未定義 `@custom-variant dark` 時，Tailwind v4 預設
 * 以 media query 編譯 `dark:`，以 `.dark` 切換深淺的網站會出現浮層陰影與主題不同步。
 * 以 Dropdown 的 `dark:shadow-lg dark:shadow-black/20` 作為代表。
 */
async function dropdownShadow(page: Page, scheme: "light" | "dark", darkClass: boolean) {
  await page.emulateMedia({ colorScheme: scheme });
  await openFixture(page, "dropdown");
  await page.evaluate((on) => document.documentElement.classList.toggle("dark", on), darkClass);
  await page.locator("#trigger").click();
  const content = page.locator("[data-cu-dropdown-content]");
  await expect(content).toBeVisible();
  return content.evaluate((el) => getComputedStyle(el).boxShadow);
}

test.describe("dark: variant", () => {
  test("跟隨 .dark class，不受作業系統深淺設定影響", async ({ page }) => {
    const light = await dropdownShadow(page, "light", false);
    const darkClassOnLightOs = await dropdownShadow(page, "light", true);
    const darkOsWithoutClass = await dropdownShadow(page, "dark", false);
    const darkClassOnDarkOs = await dropdownShadow(page, "dark", true);

    // 有 .dark：不論作業系統設定都套用暗色陰影
    expect(darkClassOnLightOs).not.toBe(light);
    expect(darkClassOnDarkOs).toBe(darkClassOnLightOs);
    // 沒有 .dark：即使作業系統是深色，仍維持亮色陰影
    expect(darkOsWithoutClass).toBe(light);
  });
});
