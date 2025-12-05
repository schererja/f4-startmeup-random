import { describe, it, expect } from "vitest";
import { cn } from "~/lib/utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("px-2 py-1", "px-3");
    expect(result).toBe("py-1 px-3");
  });

  it("should handle conditional classes", () => {
    const result = cn("px-2", undefined, false && "py-1", "py-2");
    expect(result).toBe("px-2 py-2");
  });

  it("should handle empty strings", () => {
    const result = cn("px-2", "", "py-1");
    expect(result).toBe("px-2 py-1");
  });

  it("should handle arrays of classes", () => {
    const result = cn(["px-2", "py-1"], "hover:bg-slate-100");
    expect(result).toContain("px-2");
    expect(result).toContain("py-1");
    expect(result).toContain("hover:bg-slate-100");
  });
});
