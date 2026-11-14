import { describe, it, expect } from "vitest";
import { problemChars, validateInput } from "@/lib/perspectives";

describe("input rules", () => {
  it("counts spaces toward the limit so the counter matches where typing stops", () =>
    expect(problemChars("a".repeat(999) + " ")).toBe(1000));
  it("rejects empty problem", () => expect(validateInput("  ", ["student", "employer"])).not.toBeNull());
  it("rejects problem under 20 chars", () => expect(validateInput("too short", ["student", "employer"])).not.toBeNull());
  it("rejects over 1000 chars", () => expect(validateInput("a".repeat(1001), ["student", "employer"])).not.toBeNull());
  it("requires at least 2 perspectives", () => expect(validateInput("How can I prepare for an AI job market?", ["student"])).not.toBeNull());
  it("allows max 4 perspectives", () =>
    expect(validateInput("How can I prepare for an AI job market?", ["student", "employer", "educator", "ai", "customer"])).not.toBeNull());
  it("accepts valid input", () => expect(validateInput("How can I prepare for an AI job market?", ["student", "employer"])).toBeNull());
});

import { ROLES, resolveRole, validateCustomPerspective } from "@/lib/perspectives";
describe("perspective options", () => {
  it("offers 12 built-in perspectives", () => expect(ROLES.length).toBe(12));
  it("accepts a typed custom perspective", () =>
    expect(validateInput("How can I prepare for an AI job market?", ["student", "custom:Nurse"])).toBeNull());
  it("rejects a custom perspective under 3 chars", () => expect(resolveRole("custom:ab")).toBeNull());
  it("rejects duplicate perspectives", () =>
    expect(validateInput("How can I prepare for an AI job market?", ["student", "student"])).not.toBeNull());
  it.each(["fdg", "ffd", "fgd", "Nurse fdg", "asdf qwerty"])("rejects meaningless custom label %s", (label) => {
    expect(validateCustomPerspective(label)).not.toBeNull();
    expect(validateInput("How can I prepare for an AI job market?", ["student", `custom:${label}`])).not.toBeNull();
  });
  it.each(["freak", "weirdo", "FREAK", "a weirdo", "Store freak", "idiot"])("rejects insulting custom label %s", (label) => {
    expect(validateCustomPerspective(label)).not.toBeNull();
    expect(resolveRole(`custom:${label}`)).toBeNull();
  });
  it.each(["Nurse", "Store Cashier", "Elderly Shopper", "Accessibility Advocate", "Startup Founder", "AI Specialist", "UX Designer", "Landlord", "Risk Reviewer"])("accepts meaningful custom label %s", (label) => {
    expect(validateCustomPerspective(label)).toBeNull();
  });
});
