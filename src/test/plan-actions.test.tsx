import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlanActions } from "@/components/plan-actions";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("local plan export", () => {
  it("copies only the final plan without an application request", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<PlanActions solution={"1. Compare options.\n2. Try one approach."} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy plan" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("1. Compare options.\n2. Try one approach."));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("downloads the final plan as plain text without an application request", async () => {
    const createObjectURL = vi.fn().mockReturnValue("blob:local-plan");
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<PlanActions solution="Start with a small trial." />);
    fireEvent.click(screen.getByRole("button", { name: "Download plan" }));
    expect(click).toHaveBeenCalledOnce();
    const blob = createObjectURL.mock.calls[0]?.[0];
    expect(blob.type).toBe("text/plain;charset=utf-8");
    const reader = new FileReader();
    const text = await new Promise((resolve) => { reader.onload = () => resolve(reader.result); reader.readAsText(blob); });
    expect(text).toBe("Start with a small trial.");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});