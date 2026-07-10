import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  nextVitals,
  prettierConfig,
  {
    /*
     * Khai báo tường minh version React để eslint-plugin-react không tự
     * detect qua context.getFilename() — API này đã đổi ở ESLint 10.x
     * khiến rule "react/display-name" bị crash (TypeError: getFilename
     * is not a function) khi lint file .ts/.tsx.
     */
    settings: {
      react: {
        version: "19.2.0",
      },
    },
  },
]);
