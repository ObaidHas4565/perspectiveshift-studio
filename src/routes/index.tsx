import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ROLES, MAX_ROLES, MIN_ROLES, PROBLEM_MAX, CUSTOM_PREFIX, CUSTOM_ROLE_MAX, MAX_INSIGHTS,
  resolveRole, validateInput, type Analysis,
} from "@/lib/perspectives";
import { generatePerspectives, synthesizeSolution } from "@/lib/perspectives.functions";
import { maskSensitiveText } from "@/lib/privacy";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PerspectiveShift AI — See your problem from every side" },
      { name: "description", content: "Explore a problem through different perspectives, challenge assumptions and build your own solution." },
      { property: "og:title", content: "PerspectiveShift AI" },
      { property: "og:description", content: "Explore a problem through different perspectives and build your own solution." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const EXAMPLE = "How can I prepare for an AI-driven job market?";
const STEPS = ["Perspectives", "Compare", "Challenge", "Build", "Reflect"];

function Index() {
  const gen = useServerFn(generatePerspectives);
  const synth = useServerFn(synthesizeSolution);
  const [customRole, setCustomRole] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [step, setStep] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [solution, setSolution] = useState("");
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});
  const maskedProblem = maskSensitiveText(problem);
  const hasMaskedDetails = maskedProblem !== problem;
  const rate = (role: string, v: "up" | "down") =>
    setFeedback((f) => { const n = { ...f }; if (n[role] === v) delete n[role]; else n[role] = v; return n; });

  const toggleRole = (id: string) => {
    setRoles((r) => (r.includes(id) ? r.filter((x) => x !== id) : r.length >= MAX_ROLES ? r : [...r, id]));
  };

  const submit = async () => {
    const v = validateInput(problem, roles);
    if (v) return setError(v);
    const maskedError = validateInput(maskedProblem, roles);
    if (maskedError) return setError(`After privacy masking: ${maskedError}`);
    setError(null);
    setLoading(true);
    try {
      let res: Awaited<ReturnType<typeof gen>> | null = null;
      // One automatic retry if the connection drops.
      for (let attempt = 0; attempt < 2 && !res; attempt++) {
        try { res = await gen({ data: { problem: maskedProblem, roles } }); }
        catch (e) { if (attempt === 1) throw e; await new Promise((r) => setTimeout(r, 1000)); }
      }
      if (!res || !res.ok) return setError(res ? res.error : "Something went wrong.");
      setResult(res.result);
      setStep(0);
      setInsights([]);
      setSolution("");
      setFeedback({});
    } catch {
      setError("Connection problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addCustomRole = () => {
    const label = maskSensitiveText(customRole.trim().replace(/\s+/g, " "));
    if (!label) return;
    const id = CUSTOM_PREFIX + label;
    if (!resolveRole(id)) return setError("Custom perspectives must be 3–40 characters.");
    if (roles.some((x) => resolveRole(x)?.label.toLowerCase() === label.toLowerCase())) return setError("That perspective is already selected.");
    if (roles.length >= MAX_ROLES) return setError(`Select no more than ${MAX_ROLES} perspectives.`);
    setError(null);
    setRoles((r) => [...r, id]);
    setCustomRole("");
  };

  const draftSolution = async () => {
    setDrafting(true);
    setDraftError(null);
    try {
      const res = await synth({ data: { problem: maskedProblem, insights: insights.slice(0, MAX_INSIGHTS), notes: maskSensitiveText(solution) } });
      if (!res.ok) return setDraftError(res.error);
      setSolution(res.solution);
    } catch {
      setDraftError("Connection problem. Please try again.");
    } finally {
      setDrafting(false);
    }
  };

  const toggleInsight = (t: string) =>
    setInsights((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const reset = () => { setResult(null); setStep(0); };

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <button onClick={reset} className="font-display text-xl font-bold text-foreground">
          Perspective<span className="text-primary">Shift</span> AI
        </button>
        {result && <Button variant="outline" size="sm" onClick={reset}>New problem</Button>}
      </header>

      {!result ? (
        <section className="mx-auto max-w-3xl px-6 pb-20 pt-6">
          <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
            See your problem <em className="text-primary">from every side.</em>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore viewpoints, challenge your assumptions, then shape your own solution.
          </p>

          <div className="mt-10 rounded-2xl border bg-card p-6 shadow-soft">
            <label htmlFor="problem" className="text-sm font-semibold text-foreground">Describe your problem or situation</label>
            <Textarea
              id="problem"
              value={problem}
              maxLength={PROBLEM_MAX}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. How can I prepare for an AI-driven job market?"
              className="mt-2 min-h-32 text-base"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <button type="button" className="underline-offset-2 hover:underline" onClick={() => { setProblem(EXAMPLE); setRoles(["student", "employer", "educator", "ai"]); }}>
                Try the example
              </button>
              <span>{problem.trim().length}/{PROBLEM_MAX}</span>
            </div>

            <p className="mt-6 text-sm font-semibold text-foreground">
              Choose {MIN_ROLES}–{MAX_ROLES} perspectives <span className="font-normal text-muted-foreground">({roles.length} selected)</span>
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {ROLES.map((r) => {
                const on = roles.includes(r.id);
                const disabled = !on && roles.length >= MAX_ROLES;
                return (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={on}
                    disabled={disabled}
                    onClick={() => toggleRole(r.id)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${on ? "border-primary bg-primary text-primary-foreground" : "bg-background text-foreground hover:border-primary"} disabled:opacity-40`}
                  >
                    {r.label}
                  </button>
                );
              })}
              {roles.filter((id) => id.startsWith(CUSTOM_PREFIX)).map((id) => (
                <button key={id} type="button" aria-pressed onClick={() => toggleRole(id)}
                  className="rounded-xl border border-primary bg-primary px-4 py-3 text-left text-sm font-medium text-primary-foreground">
                  {resolveRole(id)?.label} <span aria-hidden>×</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={customRole}
                maxLength={CUSTOM_ROLE_MAX}
                onChange={(e) => setCustomRole(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomRole(); } }}
                placeholder="Or type your own, e.g. Nurse, Landlord, Startup Founder"
                aria-label="Custom perspective"
                className="flex-1 rounded-xl border bg-background px-4 py-2 text-sm text-foreground"
              />
              <Button type="button" variant="outline" onClick={addCustomRole} disabled={!customRole.trim() || roles.length >= MAX_ROLES}>Add</Button>
            </div>

            {error && (
              <div role="alert" className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
                <span>{error}</span>
                {validateInput(problem, roles) === null && (
                  <Button variant="outline" size="sm" onClick={submit} disabled={loading}>{loading ? "Retrying…" : "Retry"}</Button>
                )}
              </div>
            )}

            <p className="mt-6 text-sm text-muted-foreground">
              Use made-up details, not real names or confidential information. Automatic masking can miss details, including personal issues.
            </p>
            {hasMaskedDetails && (
              <div className="mt-3 border-l-2 border-primary pl-3">
                <p className="text-sm font-semibold text-foreground">Text sent for analysis</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground" aria-live="polite">{maskedProblem}</p>
                <p className="mt-2 text-xs text-muted-foreground">Review this text and remove anything else you want to keep private.</p>
              </div>
            )}
            <Button size="lg" className="mt-4 w-full" onClick={submit} disabled={loading}>
              {loading ? "Generating perspectives…" : "Generate Perspectives"}
            </Button>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <nav className="mb-8 flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => setStep(i)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${i === step ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {i + 1}. {s}
              </button>
            ))}
          </nav>

          <p className="mb-6 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-foreground">
            These are AI-generated suggestions, not facts or a representation of everyone in a group. Verify important claims.
          </p>

          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {result.perspectives.map((p) => (
                <article key={p.role} className="rounded-2xl border bg-card p-6 shadow-soft">
                  <h2 className="text-2xl font-bold text-primary">{p.role}</h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    {([["Priorities", p.priorities], ["Concerns", p.concerns], ["Opportunities", p.opportunities], ["Suggested action", p.action]] as const).map(([k, v]) => (
                      <div key={k}><dt className="font-semibold text-foreground">{k}</dt><dd className="text-muted-foreground">{v}</dd></div>
                    ))}
                  </dl>
                  <div className="mt-4 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
                    <span>Was this helpful?</span>
                    {(["up", "down"] as const).map((v) => (
                      <button key={v} type="button" aria-pressed={feedback[p.role] === v} aria-label={v === "up" ? "Helpful" : "Not helpful"}
                        onClick={() => rate(p.role, v)}
                        className={`rounded-full border px-3 py-1 transition ${feedback[p.role] === v ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>
                        {v === "up" ? "👍" : "👎"}
                      </button>
                    ))}
                    {feedback[p.role] && <span>Thanks!</span>}
                  </div>
                </article>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              {([["Similarities", result.similarities], ["Differences", result.differences]] as const).map(([t, list]) => (
                <div key={t} className="rounded-2xl border bg-card p-6 shadow-soft">
                  <h2 className="text-2xl font-bold text-foreground">{t}</h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">{list.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {result.challenges.map((q, i) => (
                <div key={q} className="flex gap-4 rounded-2xl border bg-card p-6 shadow-soft">
                  <span className="font-display text-3xl font-bold text-accent">{i + 1}</span>
                  <p className="text-lg text-foreground">{q}</p>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Pick useful insights</h2>
                <div className="mt-4 space-y-2">
                  {result.perspectives.flatMap((p) => [p.priorities, p.opportunities, p.action].map((t) => ({ t, role: p.role }))).map(({ t, role }) => (
                    <label key={role + t} className="flex cursor-pointer gap-3 rounded-xl border bg-card p-3 text-sm">
                      <input type="checkbox" className="mt-1 accent-primary" checked={insights.includes(t)} onChange={() => toggleInsight(t)} />
                      <span><span className="font-semibold text-primary">{role}:</span> <span className="text-foreground">{t}</span></span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your solution</h2>
                <p className="mt-1 text-sm text-muted-foreground">Optionally jot your own thoughts below, then let the AI weave your selected insights into one plan. Edit it until it's yours.</p>
                <Button variant="outline" size="sm" className="mt-3" disabled={!insights.length || drafting}
                  onClick={draftSolution}>
                  {drafting ? "Drafting…" : solution.trim() ? "Redraft using my notes + insights" : "Draft a solution from my insights"}
                </Button>
                {insights.length > MAX_INSIGHTS && <p className="mt-2 text-xs text-muted-foreground">Only the first {MAX_INSIGHTS} insights will be used.</p>}
                {draftError && <p role="alert" className="mt-2 text-sm text-destructive">{draftError}</p>}
                <Textarea value={solution} onChange={(e) => setSolution(e.target.value)} className="mt-3 min-h-64" placeholder="Write your final solution…" />
                <Button className="mt-3 w-full" disabled={!solution.trim()} onClick={() => setStep(4)}>See reflection summary</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 rounded-2xl border bg-card p-8 shadow-soft">
              <h2 className="text-3xl font-bold text-foreground">Reflection summary</h2>
              <Block title="Original problem"><p>{problem}</p></Block>
              <Block title="Perspectives explored"><p>{result.perspectives.map((p) => p.role + (feedback[p.role] ? (feedback[p.role] === "up" ? " 👍" : " 👎") : "")).join(", ")}</p></Block>
              <Block title="Selected insights">
                {insights.length ? <ul className="list-disc pl-5">{insights.map((i) => <li key={i}>{i}</li>)}</ul> : <p>None selected.</p>}
              </Block>
              <Block title="Your final solution">
                {solution.trim() ? <p className="whitespace-pre-wrap">{solution}</p> : <p>Not written yet — go to step 4.</p>}
              </Block>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{title}</h3>
      <div className="mt-1 text-foreground">{children}</div>
    </div>
  );
}
