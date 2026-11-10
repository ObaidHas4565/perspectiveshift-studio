import { describe, expect, it } from "vitest";
import { maskSensitiveText } from "@/lib/privacy";

describe("browser privacy masking", () => {
  it("masks email addresses", () => {
    expect(maskSensitiveText("Contact sam.lee@example.edu about learning.")).toBe("Contact [EMAIL] about learning.");
  });
  it("masks common formatted and international phone numbers", () => {
    expect(maskSensitiveText("Call +971 50 123 4567 or (212) 555-1234 or +971501234567.")).toBe("Call [PHONE] or [PHONE] or [PHONE].");
  });
  it("masks labelled identifiers without claiming to detect all IDs", () => {
    expect(maskSensitiveText("Passport number A1234567; student ID 12345678.")).toBe("Passport [ID]; student ID [ID].");
  });
  it("masks listed visa terms", () => {
    expect(maskSensitiveText("F-1, H-1B, J1, Tier 4, Golden Visa and student visa")).toBe("[VISA_TYPE], [VISA_TYPE], [VISA_TYPE], [VISA_TYPE], [VISA_TYPE] and [VISA_TYPE]");
  });
  it("masks common full institution names", () => {
    expect(maskSensitiveText("At University of Oxford and Stanford University, I studied.")).toBe("At [INSTITUTION] and [INSTITUTION], I studied.");
  });
  it("preserves unrelated context and makes no promise about personal issues", () => {
    const text = "I have a family conflict and need 2026 career advice at MIT.";
    expect(maskSensitiveText(text)).toBe(text);
  });
  it("does not change already masked text on retry", () => {
    const masked = maskSensitiveText("Email sam@example.edu about my F-1 visa.");
    expect(maskSensitiveText(masked)).toBe(masked);
  });
});