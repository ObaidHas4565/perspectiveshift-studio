import { beforeEach, describe, expect, it, vi } from "vitest";

const { generateChatCompletion } = vi.hoisted(() => ({ generateChatCompletion: vi.fn() }));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator: (validate: (data: unknown) => unknown) => ({
      handler: (handle: (input: { data: unknown }) => unknown) =>
        (input: { data: unknown }) => handle({ data: validate(input.data) }),
    }),
  }),
}));

vi.mock("@lovable.dev/ai-gateway", () => ({
  generateChatCompletion,
  GatewayError: class extends Error {},
}));

import { generatePerspectives } from "@/lib/perspectives.functions";

describe("perspective model integration", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uses Gemini 3.1 Flash Lite and maps its structured response", async () => {
    const result = {
      perspectives: ["Student", "Employer"].map((role) => ({
        role, priorities: "Learn relevant skills.", concerns: "Time available.",
        opportunities: "Practical projects.", action: "Choose one project.",
      })),
      similarities: ["Both value practical skills."],
      differences: ["Students focus on learning; employers focus on hiring."],
      challenges: ["Which skills matter?", "What evidence do you have?", "What could change?"],
    };
    generateChatCompletion.mockResolvedValue({ choices: [{ message: { content: JSON.stringify(result) } }] });

    const response = await generatePerspectives({
      data: { problem: "How can I prepare for an AI-driven job market?", roles: ["student", "employer"] },
    });

    expect(generateChatCompletion).toHaveBeenCalledOnce();
    expect(generateChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
      model: "google/gemini-3.1-flash-lite",
      response_format: expect.objectContaining({
        type: "json_schema", json_schema: expect.objectContaining({ strict: true }),
      }),
    }));
    expect(response).toEqual({ ok: true, result });
  });
});