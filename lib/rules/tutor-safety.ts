/**
 * TutorGuard vertical ruleset — parent-side tutor safety & quality vetting.
 * Deterministic checks run BEFORE the model so the vetting verdict is
 * explainable and not dependent on LLM output alone.
 */
export const RULESET_VERSION = 'tutor-safety@2026-07-19'

export type TutorRule = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  check: (ctx: { info: string; age: string; concerns: string }) => boolean
  remediation: string
}

const ALONE_WITH_MINOR = /in[\s-]?home|home|one[\s-]?on[\s-]?one|1:1|private|alone|bedroom/i
const SAFEGUARD = /parent present|second adult|safeguarding|observer|supervis|another adult|door open/i

export const TUTOR_RULES: TutorRule[] = [
  {
    id: 'TG-01',
    title: 'In-home / 1:1 sessions without a safeguarding adult present',
    severity: 'high',
    check: ({ info }) => ALONE_WITH_MINOR.test(info) && !SAFEGUARD.test(info),
    remediation:
      'For in-home or one-on-one tutoring with a minor, require a second adult or an open-door policy, and keep first sessions parent-supervised.',
  },
  {
    id: 'TG-02',
    title: 'No verified identity / background check / references',
    severity: 'high',
    check: ({ info }) => !/background check|reference|references|id check|dbs|screening|vetting|police check/i.test(info),
    remediation:
      'Verify government ID, run a background/safeguarding check, and collect at least two references before any solo session with a student.',
  },
  {
    id: 'TG-03',
    title: 'One-on-one alone with a minor and no observation policy',
    severity: 'medium',
    check: ({ info, age }) => {
      const minor = Number(age) > 0 && Number(age) < 18
      return minor && ALONE_WITH_MINOR.test(info) && !SAFEGUARD.test(info)
    },
    remediation:
      'Set an observation policy: first sessions observed, periodic check-ins, and a way for the student to raise concerns safely.',
  },
  {
    id: 'TG-04',
    title: 'Vague progress metrics / quality opacity',
    severity: 'medium',
    check: ({ info }) => !/progress|assess|report|metric|goal|test|score|benchmark/i.test(info),
    remediation:
      'Ask for a written plan with measurable goals and regular progress reports. Avoid tutors who cannot show how they measure improvement.',
  },
  {
    id: 'TG-05',
    title: 'Upfront long contracts / unfair cancellation (cost fairness)',
    severity: 'low',
    check: ({ info }) => /contract|subscription|upfront|deposit|non[\s-]?refund|cancellation fee|lock[\s-]?in/i.test(info),
    remediation:
      'Prefer pay-as-you-go or short trial terms. Read cancellation and refund clauses; avoid large non-refundable upfront deposits.',
  },
]

export function runDeterministicChecks(inputs: Record<string, string>) {
  const ctx = {
    info: String(inputs.tutor_info || inputs.info || ''),
    age: String(inputs.student_age || inputs.age || ''),
    concerns: String(inputs.concerns || 'All'),
  }
  const hits = TUTOR_RULES.filter((r) => r.check(ctx)).map((r) => ({
    id: r.id,
    title: r.title,
    severity: r.severity,
    remediation: r.remediation,
    source: 'Rule-based' as const,
  }))
  return { rulesetVersion: RULESET_VERSION, hits }
}
