import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { generate, synthesize } = vi.hoisted(() => ({ generate: vi.fn(), synthesize: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: (fn: unknown) => fn }));
vi.mock("@/lib/perspectives.functions", () => ({ generatePerspectives: generate, synthesizeSolution: synthesize }));

import { Route } from "@/routes/index";

beforeEach(() => {
  generate.mockResolvedValue({ ok: true, result: {
    perspectives: [{ role: "Student", priorities: "Affordable learning", concerns: "Limited time", opportunities: "Practice skills", action: "Try a course" }],
    similarities: [], differences: [], challenges: [],
  } });
  synthesize.mockResolvedValue({ ok: true, solution: "Try a short course and review your progress." });
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

async function startProblem() {
  const Page = Route.options.component;
  if (!Page) throw new Error("Missing index component");
  render(<Page />);
  fireEvent.change(screen.getByLabelText("Describe your problem or situation"), { target: { value: "How can I prepare for a changing job market?" } });
  fireEvent.click(screen.getByRole("button", { name: "Student", exact: true }));
  fireEvent.change(screen.getByLabelText("Custom perspective"), { target: { value: "Nurse" } });
  fireEvent.click(screen.getByRole("button", { name: "Add", exact: true }));
  fireEvent.change(screen.getByLabelText("Custom perspective"), { target: { value: "fgd" } });
  fireEvent.click(screen.getByRole("button", { name: "Add", exact: true }));
  fireEvent.click(screen.getByRole("button", { name: "Generate Perspectives" }));
  await screen.findByRole("button", { name: "New problem" });
}

describe("New problem", () => {
  it("clears the problem, preset and custom perspectives, and custom warning", async () => {
    await startProblem();
    fireEvent.click(screen.getByRole("button", { name: "New problem" }));
    expect(screen.getByLabelText("Describe your problem or situation")).toHaveValue("");
    expect(screen.getByLabelText("Custom perspective")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Student", exact: true })).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByRole("button", { name: /Nurse/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Generate Perspectives" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Please describe your problem or situation.");
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it("clears notes, selected insights, final solution and feedback before another problem", async () => {
    await startProblem();
    fireEvent.click(screen.getByRole("button", { name: "Helpful", exact: true }));
    fireEvent.click(screen.getByRole("button", { name: "4. Build" }));
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.change(screen.getByLabelText("Your thoughts (optional)"), { target: { value: "Keep the course affordable." } });
    fireEvent.click(screen.getByRole("button", { name: "Draft a solution from my insights" }));
    await waitFor(() => expect(screen.getByLabelText("Final solution")).toHaveValue("Try a short course and review your progress."));
    fireEvent.click(screen.getByRole("button", { name: "New problem" }));
    fireEvent.click(screen.getByRole("button", { name: "Try the example" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate Perspectives" }));
    await screen.findByRole("button", { name: "New problem" });
    expect(screen.getByRole("button", { name: "Helpful", exact: true })).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "4. Build" }));
    expect(screen.getByLabelText("Your thoughts (optional)")).toHaveValue("");
    expect(screen.getByLabelText("Final solution")).toHaveValue("");
    expect(screen.getByRole("status")).toHaveTextContent("0 insights selected");
    expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
  });
});