import { describe, expect, it } from "vitest";
import { GET } from "./route";

/**
 * Test mẫu cho Route Handler đơn giản - dùng làm template khi viết test mới.
 * Route Handler phức tạp hơn (có gọi Supabase/billing-service) nên test qua
 * Playwright E2E hoặc mock riêng từng dependency, không nên unit test trực tiếp như thế này.
 */
describe("GET /api/health", () => {
  it("trả về status ok và đúng tên service", async () => {
    const response = await GET();
    const body = await response.json();

    expect(body).toEqual({ status: "ok", service: "admin-app" });
  });
});
