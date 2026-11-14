import commonWords from "wordlist-english/english-words-10.json";
import everydayWords from "wordlist-english/english-words-20.json";
import extendedWords from "wordlist-english/english-words-35.json";
import specialistWords from "wordlist-english/english-words-40.json";
import additionalWords from "wordlist-english/english-words-50.json";

export const ROLES = [
  { id: "student", label: "Student", focus: "learning, career growth, cost and time" },
  { id: "employer", label: "Employer", focus: "hiring, productivity, team capability and risk" },
  { id: "educator", label: "University / Educator", focus: "curriculum, learning outcomes and student readiness" },
  { id: "professional", label: "Industry Professional", focus: "real-world practice, standards and day-to-day work" },
  { id: "customer", label: "Customer / End User", focus: "value, experience, trust and outcomes received" },
  { id: "ai", label: "AI / Technology Specialist", focus: "capabilities, limitations, responsible use and accuracy" },
  { id: "parent", label: "Parent / Family", focus: "wellbeing, cost, safety and long-term future" },
  { id: "government", label: "Government / Policymaker", focus: "regulation, public interest, fairness and funding" },
  { id: "business", label: "Business Owner / Investor", focus: "return on investment, growth, competition and risk" },
  { id: "ethics", label: "Ethics / Legal Expert", focus: "rights, compliance, fairness and accountability" },
  { id: "community", label: "Community / Society", focus: "social impact, inclusion and shared benefit" },
  { id: "critic", label: "Risk & Assumptions Reviewer", focus: "weak assumptions, hidden risks and what could go wrong" },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

export const PROBLEM_MIN = 20;
export const PROBLEM_MAX = 1000;
export const MIN_ROLES = 2;
export const MAX_ROLES = 4;
export const CHALLENGE_COUNT = 3;
export const CUSTOM_PREFIX = "custom:";
export const CUSTOM_ROLE_MIN = 3;
export const CUSTOM_ROLE_MAX = 40;
export const MAX_INSIGHTS = 12;

const perspectiveWords = new Set([
  ...commonWords, ...everydayWords, ...extendedWords, ...specialistWords, ...additionalWords,
  "ai", "it", "hr", "ux", "ui", "ceo", "cto", "cfo", "coo", "ciso", "ngo", "stem", "lgbtq", "devops", "startup", "cybersecurity",
].map((word) => word.toLowerCase()));
const insultingWords = new Set([
  "freak", "freaks", "weirdo", "weirdos", "idiot", "idiots", "moron", "morons", "loser", "losers",
  "stupid", "dumb", "creep", "creeps", "jerk", "jerks", "imbecile", "imbeciles",
  "fuck", "fucking", "shit", "asshole", "bitch", "bastard",
]);

/** Local checks are deliberately conservative, not a claim of semantic understanding. */
export function validateCustomPerspective(label: string): string | null {
  const value = label.trim().replace(/\s+/g, " ");
  const normalized = value.toLowerCase().replace(/\s*\/\s*/g, "/");
  const preset = ROLES.find((role) => {
    const name = role.label.toLowerCase().replace(/\s*\/\s*/g, "/");
    return name === normalized || name.split("/").some((part) => part.trim() === normalized);
  });
  if (preset) return `That perspective is already available above. Select "${preset.label}" instead.`;
  if (value.length < CUSTOM_ROLE_MIN || value.length > CUSTOM_ROLE_MAX) {
    return `Custom perspectives must be ${CUSTOM_ROLE_MIN}–${CUSTOM_ROLE_MAX} characters.`;
  }
  const words = value.toLowerCase().split(/[\s/&()'’.-]+/).filter(Boolean);
  if (words.some((word) => insultingWords.has(word))) {
    return "Please use a respectful perspective name, without insulting labels.";
  }
  if (!/^[a-z\s/&()'’.-]+$/i.test(value) || !words.length || words.some((word) => !perspectiveWords.has(word))) {
    return "Use a recognizable perspective name, such as Nurse or Store Cashier. Check the spelling.";
  }
  return null;
}

/** Role ids are either a built-in id or "custom:<label>" typed by the user. */
export function resolveRole(id: string): { label: string; focus: string } | null {
  const known = ROLES.find((r) => r.id === id);
  if (known) return known;
  if (!id.startsWith(CUSTOM_PREFIX)) return null;
  const label = id.slice(CUSTOM_PREFIX.length).trim();
  if (validateCustomPerspective(label)) return null;
  return { label, focus: "the responsibilities and interests typical of this role" };
}

/**
 * Characters counted against PROBLEM_MAX while typing: everything the text box
 * holds, including spaces, so the on-screen count always matches the point where
 * typing stops.
 */
export function problemChars(value: string): number {
  return value.length;
}

export function validateInput(problem: string, roles: string[]): string | null {
  const p = problem.trim();
  if (!p) return "Please describe your problem or situation.";
  if (p.length < PROBLEM_MIN) return `Please add more detail (at least ${PROBLEM_MIN} characters).`;
  if (p.length > PROBLEM_MAX) return `Please keep it under ${PROBLEM_MAX} characters.`;
  if (roles.length < MIN_ROLES) return `Select at least ${MIN_ROLES} perspectives.`;
  if (roles.length > MAX_ROLES) return `Select no more than ${MAX_ROLES} perspectives.`;
  if (new Set(roles.map((r) => r.toLowerCase())).size !== roles.length) return "Each perspective can only be selected once.";
  for (const role of roles) {
    if (role.startsWith(CUSTOM_PREFIX)) {
      const error = validateCustomPerspective(role.slice(CUSTOM_PREFIX.length));
      if (error) return error;
    } else if (!resolveRole(role)) return "Please select a valid perspective.";
  }
  return null;
}

export type Perspective = {
  role: string;
  priorities: string;
  concerns: string;
  opportunities: string;
  action: string;
};

export type Analysis = {
  perspectives: Perspective[];
  similarities: string[];
  differences: string[];
  challenges: string[];
};
