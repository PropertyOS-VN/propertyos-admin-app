import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * Cấu hình Vitest cho unit test (Client Component, hook, helper thuần túy).
 * Server Component/Route Handler phức tạp hơn nên ưu tiên test qua Playwright (E2E)
 * thay vì cố gắng mock runtime Next.js trong unit test.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    exclude: ["node_modules", ".next", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
