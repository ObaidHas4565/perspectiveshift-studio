import { describe, it, expect } from "vitest";
import { validateInput } from "@/lib/perspectives";

describe("input rules", () => {
  it("rejects empty problem", () => expect(validateInput("  ", ["student", "employer"])).not.toBeNull());
  it("rejects problem under 20 chars", () => expect(validateInput("too short", ["student", "employer"])).not.toBeNull());
  it("rejects over 1000 chars", () => expect(validateInput("a".repeat(1001), ["student", "employer"])).not.toBeNull());
  it("requires at least 2 perspectives", () => expect(validateInput("How can I prepare for an AI job market?", ["student"])).not.toBeNull());
  it("allows max 4 perspectives", () =>
    expect(validateInput("How can I prepare for an AI job market?", ["student", "employer", "educator", "ai", "customer"])).not.toBeNull());
  it("accepts valid input", () => expect(validateInput("How can I prepare for an AI job market?", ["student", "employer"])).toBeNull());
});

import { ROLES, resolveRole } from "@/lib/perspectives";
describe("perspective options", () => {
  it("offers 12 built-in perspectives", () => expect(ROLES.length).toBe(12));
  it("accepts a typed custom perspective", () =>
    expect(validateInput("How can I prepare for an AI job market?", ["student", "custom:Nurse"])).toBeNull());
  it("rejects a custom perspective under 3 chars", () => expect(resolveRole("custom:ab")).toBeNull());
  it("rejects duplicate perspectives", () =>
    expect(validateInput("How can I prepare for an AI job market?", ["student", "student"])).not.toBeNull());
});
