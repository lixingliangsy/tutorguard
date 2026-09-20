import type { GovEntry } from './governance-data/index'

/**
 * Honest guardrails for the TutorGuard vertical child-safety agent (deep-data moat).
 * Aligned to OPC asset guardrails G1–G5 (see AGENTS.md §11.5 moat).
 *
 * These validators run AFTER the grounded model call returns, BEFORE the
 * report is assembled and emitted. A failing validator refuses emission —
 * matching the existing "no citation → refuse" red line.
 *
 *   G1 — analysis is decision-support, not legal advice / safeguarding authority;
 *        must be grounded in at least one cited provision from the dataset
 *   G2 — no "guarantee safe for children" / "guarantee compliance" /
 *        "replace your safeguarding team"
 *   G3 — penalty/exposure figures are public reference points, never a promise
 *        the tool will keep the user under any penalty
 *   G4 — B2B positioning (enforced at content/design layer, not runtime)
 *   G5 — the child-safety mapping/roadmap is analysis aid; must not claim a
 *        product is "certified safe for children" or "fully compliant"
 */

export interface GuardrailResult {
  ok: boolean
  violations: string[]
  note: string
  needsHumanReview: boolean
}

const DECISION_SUPPORT_FOOTER =
  '\n\n— Decision-support only. Not legal advice and not a safeguarding authority. Verify against primary law (COPPA / FERPA / GDPR Art.8 / SOPIPA / UK AADC) before action. ' +
  'This is a good-faith effort record you can stand behind, not a child-safety certification.'

const UNCERTAINTY_FOOTER =
  '\n\n⚠️ Open uncertainties detected — confirm with qualified counsel / designated safeguarding lead before action.' + DECISION_SUPPORT_FOOTER

// G2 / G5 — prohibited absolute-assurance phrasing.
const PROHIBITED_PHRASES: Array<{ re: RegExp; code: string }> = [
  { re: /\bguarantee[ds]?\b[^.]{0,40}\b(safe|safety|compliance|compliant|no (harm|violation)|child[- ]?safe)\b/i, code: 'G2_GUARANTEE_SAFE' },
  { re: /\b(you|your product|this tutor|the app) (is|are|will be) (compliant|safe|child[- ]?safe|coppa[- ]?compliant)\b/i, code: 'G5_YOU_ARE_COMPLIANT' },
  { re: /\b(this|we|it) (certifies?|certify) (your|the (product|tutor|app)|compliance|conformity)\b/i, code: 'G5_CERTIFIED' },
  { re: /\breplace (your )?(safeguarding|child[- ]?safety|legal|compliance) (team|expert|lead|counsel|officer)\b/i, code: 'G2_REPLACE_TEAM' },
  { re: /\bguarantee[ds]? (no (harm|violation|risk)|100%|eliminate all risk|zero risk)\b/i, code: 'G2_GUARANTEE_NO_HARM' },
  { re: /\b(ensures?|guarantees?) (your )?(full |child[- ]?)?(compliance|safety|conformity|protection)\b/i, code: 'G5_ENSURE_COMPLIANCE' },
]

// G3 — exposure ceilings must be framed as public reference points, never as a
// promise that the tool will keep the user under them.
const PENALTY_PROMISE: RegExp =
  /\b(we |this (tool|report|agent) |the agent )(will|can|guarantees?) (keep|ensure|get) (you|your (org|company|product|tutor)) (under|below|within).*(penalt|fine|liabilit|enforcement)/i

// G1 — the report must be grounded in at least one cited provision from the dataset.
const CITATION_MARKER = /COPPA|FERPA|GDPR|Art\.?\s*8|SOPIPA|AADC|Age Appropriate|16 CFR|34 CFR|Reg\.|DPA 2018|§|Bill|Statute/i

const UNCERTAINTY_MARKER =
  /\b(uncertain|not certain|may not (be|apply)|verify with|consult (a|your|qualified)|should confirm|depends on|open (question|issue)|needs? (human|legal|safeguarding|expert) review|cannot (determine|confirm)|out of scope)\b/i

/** G1 — report is grounded in at least one cited provision from the dataset. */
export function checkCitationGrounded(report: string, citations: GovEntry[]): boolean {
  return citations.length > 0 && CITATION_MARKER.test(report)
}

/** G2 / G5 — scan for prohibited absolute-assurance phrasing. */
export function checkNoGuarantee(text: string): string[] {
  const hits: string[] = []
  for (const p of PROHIBITED_PHRASES) {
    if (p.re.test(text)) hits.push(p.code)
  }
  if (PENALTY_PROMISE.test(text)) hits.push('G3_PENALTY_PROMISE')
  return hits
}

/** Uncertainty detector — drives the "confirm with counsel" flag (G1/G5). */
export function detectUncertainty(text: string): boolean {
  return UNCERTAINTY_MARKER.test(text)
}

/** Main entry — returns whether the report may be emitted, plus the redline note. */
export function applyGuardrails(report: string, citations: GovEntry[]): GuardrailResult {
  const violations: string[] = []

  if (!checkCitationGrounded(report, citations)) {
    violations.push('G1_NO_CITATION')
  }
  violations.push(...checkNoGuarantee(report))

  const needsHumanReview = detectUncertainty(report)
  const ok = violations.length === 0

  let note = DECISION_SUPPORT_FOOTER
  if (needsHumanReview) {
    note = UNCERTAINTY_FOOTER
  }

  return { ok, violations, note, needsHumanReview }
}
