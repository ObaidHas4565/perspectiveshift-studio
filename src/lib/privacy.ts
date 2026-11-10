/** Best-effort masking only: free-text details can still identify someone. */
export function maskSensitiveText(text: string): string {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL]")
    // Only labelled IDs: arbitrary numbers are not safely classifiable.
    .replace(/\b(passport|student\s+id|national\s+id)(?:\s+(?:number|no\.?))?\s*[:#]?\s+[A-Z0-9][A-Z0-9-]{4,}\b/gi, "$1 [ID]")
    .replace(/(?<![\w])(?:\+\d{1,3}[ .-]?)?(?:\(\d{2,4}\)|\d{2,4})[ .-]\d{3,4}[ .-]\d{3,4}(?![\w])|(?<![\w])\+\d{10,15}(?!\d)/g, "[PHONE]")
    .replace(/\b(?:F[ -]?1|J[ -]?1|H[ -]?1B|Tier\s*[24]|Golden\s+Visa|Student\s+Visa)\b/gi, "[VISA_TYPE]")
    // Capitalised institution names only, to limit accidental sentence removal.
    .replace(/\b(?:University|College|Institute) of [A-Z][\w’'-]*(?: [A-Z][\w’'-]*){0,5}\b/g, "[INSTITUTION]")
    .replace(/\b(?:[A-Z][\w’'-]* ){1,5}(?:University|College|Institute)(?: of [A-Z][\w’'-]*(?: [A-Z][\w’'-]*){0,3})?\b/g, "[INSTITUTION]");
}