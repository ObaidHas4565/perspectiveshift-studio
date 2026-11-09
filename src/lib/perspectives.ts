export const ROLES = [
  { id: "student", label: "Student", focus: "learning, career growth, cost and time" },
  { id: "employer", label: "Employer", focus: "hiring, productivity, team capability and risk" },
  { id: "educator", label: "University / Educator", focus: "curriculum, learning outcomes and student readiness" },
  { id: "professional", label: "Industry Professional", focus: "real-world practice, standards and day-to-day work" },
  { id: "customer", label: "Customer / End User", focus: "value, experience, trust and outcomes received" },
  { id: "ai", label: "AI / Technology Specialist", focus: "capabilities, limitations, responsible use and accuracy" },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

export const PROBLEM_MIN = 20;
export const PROBLEM_MAX = 1000;
export const MIN_ROLES = 2;
export const MAX_ROLES = 4;
export const CHALLENGE_COUNT = 3;

export function validateInput(problem: string, roles: string[]): string | null {
  const p = problem.trim();
  if (!p) return "Please describe your problem or situation.";
  if (p.length < PROBLEM_MIN) return `Please add more detail (at least ${PROBLEM_MIN} characters).`;
  if (p.length > PROBLEM_MAX) return `Please keep it under ${PROBLEM_MAX} characters.`;
  if (roles.length < MIN_ROLES) return `Select at least ${MIN_ROLES} perspectives.`;
  if (roles.length > MAX_ROLES) return `Select no more than ${MAX_ROLES} perspectives.`;
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
