import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/app/products/new/validation/schema.ts",
        "src/features/wizard/draft.ts",
        "src/features/**/*Slice.ts",
        "src/features/**/hooks/**",
        "src/hooks/**",
        "src/lib/**/*.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
