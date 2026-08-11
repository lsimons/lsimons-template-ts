import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/**/*.ts"],
            // Excluding cli.ts assumes it stays a thin argv/stdout shim
            // with the logic in importable modules. Put real logic there
            // and it will be uncovered without the thresholds noticing —
            // drop the exclusion instead.
            exclude: ["src/**/*.test.ts", "src/cli.ts"],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
});
