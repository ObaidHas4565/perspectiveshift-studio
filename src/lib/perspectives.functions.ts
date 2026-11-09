import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ROLES, validateInput, type Analysis } from "./perspectives";

const Input = z.object({ problem: z.string(), roles: z.array(z.string()) });

export const generatePerspectives = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; result: Analysis } | { ok: false; error: string }> => {
    const err = validateInput(data.problem, data.roles);
    if (err) return { ok: false, error: err };
    const roles = ROLES.filter((r) => data.roles.includes(r.id));
    if (roles.length !== data.roles.length) return { ok: false, error: "Unknown perspective selected." };

    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    const str = { type: "string" } as const;
    const schema = {
      type: "object",
      additionalProperties: false,
      required: ["perspectives", "similarities", "differences", "challenges"],
      properties: {
        perspectives: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["role", "priorities", "concerns", "opportunities", "action"],
            properties: { role: str, priorities: str, concerns: str, opportunities: str, action: str },
          },
        },
        similarities: { type: "array", items: str },
        differences: { type: "array", items: str },
        challenges: { type: "array", items: str },
      },
    };

    const roleList = roles.map((r) => `- ${r.label} (cares about: ${r.focus})`).join("\n");
    const prompt = `Problem: """${data.problem.trim()}"""

Perspectives (in this order, exactly one card each, role field = the exact label):
${roleList}

For each perspective give ONE short sentence each for priorities, concerns, opportunities, and one concrete suggested action. Each role must be clearly distinct and grounded in that role's responsibilities — do not repeat the same advice.
Then give 2-3 similarities and 2-3 differences between the perspectives, and exactly 3 questions that challenge the user's assumptions.
Do not invent statistics, facts or figures. Do not decide the solution for the user. Return JSON.`;

    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions:
          "You help people think critically by role-playing distinct stakeholder perspectives. Viewpoints are suggestions, not facts.",
        input: [{ role: "user", content: prompt }],
        text: { format: { type: "json_schema", name: "analysis", strict: true, schema } },
      });
      let text = "";
      for (const item of (res as { output?: Array<{ type: string; content?: Array<{ type: string; text?: string }> }> }).output ?? []) {
        if (item.type === "message") for (const c of item.content ?? []) if (c.type === "output_text") text += c.text ?? "";
      }
      const parsed = JSON.parse(text) as Analysis;
      parsed.perspectives = parsed.perspectives.slice(0, roles.length);
      parsed.challenges = parsed.challenges.slice(0, 3);
      return { ok: true, result: parsed };
    } catch (e) {
      console.error(e);
      if (e instanceof GatewayError) {
        if (e.code === "rate_limited" || e.httpStatus === 429) return { ok: false, error: "Too many requests — please wait a moment and try again." };
        if (e.httpStatus === 402) return { ok: false, error: "AI credits are exhausted. Please top up to continue." };
      }
      return { ok: false, error: "Something went wrong generating perspectives. Please try again." };
    }
  });
