import { expect, test } from "@playwright/test";

/**
 * Smoke test: đảm bảo app khởi động được và API health trả về đúng dữ liệu.
 * Dùng làm template khi viết E2E test mới cho luồng quan trọng (đăng nhập, tạo hợp đồng...).
 */
test("trang chủ load được", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/PropertyOS/);
});

test("api health trả về ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toEqual({ status: "ok", service: "admin-app" });
});
