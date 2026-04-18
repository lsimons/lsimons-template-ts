import { describe, expect, it } from "vitest";
import { greet } from "../src/greet.ts";

describe("greet", () => {
    it("returns a greeting for a name", () => {
        expect(greet("world")).toBe("hello, world");
    });

    it("throws on empty input", () => {
        expect(() => greet("")).toThrow(/name must not be empty/);
    });
});
