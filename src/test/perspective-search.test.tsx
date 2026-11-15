import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { generate } = vi.hoisted(() => ({ generate: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: (fn: unknown) => fn }));
vi.mock("@/lib/perspectives.functions", () => ({ generatePerspectives: generate, synthesizeSolution: vi.fn() }));

import { Route } from "@/routes/index";
import { ROLES } from "@/lib/perspectives";

afterEach(() => { cleanup(); vi.clearAllMocks(); });

function renderPage() {
  const Page = Route.options.component;
  if (!Page) throw new Error("Missing index component");
  render(<Page />);
  return screen.getByRole("searchbox", { name: "Search preset perspectives" });
}

describe("preset perspective search", () => {
  it("filters immediately regardless of case and restores all 12 presets when emptied", () => {
    const search = renderPage();
    expect(ROLES.filter((role) => screen.queryByRole("button", { name: role.label }))).toHaveLength(12);
    fireEvent.change(search, { target: { value: "  STUD  " } });
    expect(screen.getByRole("button", { name: "Student" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Employer" })).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: "" } });
    expect(ROLES.filter((role) => screen.queryByRole("button", { name: role.label }))).toHaveLength(12);
    expect(generate).not.toHaveBeenCalled();
  });

  it("keeps selected presets and custom perspectives when searching and clearing", () => {
    const search = renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Student" }));
    fireEvent.change(screen.getByLabelText("Custom perspective"), { target: { value: "Nurse" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    fireEvent.change(search, { target: { value: "zzzzzz" } });
    expect(ROLES.filter((role) => screen.queryByRole("button", { name: role.label }))).toHaveLength(0);
    expect(screen.getByRole("button", { name: /Nurse/ })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Clear perspective search" }));
    expect(search).toHaveValue("");
    expect(ROLES.filter((role) => screen.queryByRole("button", { name: role.label }))).toHaveLength(12);
    expect(screen.getByRole("button", { name: "Student" })).toHaveAttribute("aria-pressed", "true");
    expect(generate).not.toHaveBeenCalled();
  });
});