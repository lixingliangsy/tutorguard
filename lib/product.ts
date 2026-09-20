export interface InputField {
  key: string
  label: string
  type: 'input' | 'text' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "TutorGuard",
  slug: "tutorguard",
  productId: "PROD_5qlnW3TYM1AJKmjeQgReUF",
  priceMonthly: 9,
  yearlyProductId: "PROD_7TUWIGaKWndisCkOawiwp5",
  priceYearly: 90,
  pipelineId: "tutorguard-vet-v1",
  rulesetId: "tutor-safety@2026-07-19",
  rulesetVersion: "tutor-safety@2026-07-19",

  checkoutUrl: "https://pancake.waffo.ai/store/lixingliang-ai-tools-6cilbw8v/checkout/cs_06dbab55-f94a-7eb7-28c7-c12b646ae290",
  tagline: "Keep every AI tutor reply safe before students see it.",
  description: "TutorGuard automatically reviews your AI tutor's replies for unsafe content, factual errors, and policy violations, intercepting anything risky before it reaches a student.",
  toolTitle: "Tutor Safety Check",
  resultLabel: "Safety Report",
  ctaLabel: "Check Now",
  features: [
  "Review tutor arrangements for safety red flags",
  "Get a vetting and interview checklist",
  "Spot quality and fairness warning signs",
  "Receive a parent safety action plan"
],
  inputs: [
  {
    "key": "tutor_info",
    "label": "Tutor Background / Arrangement",
    "type": "textarea",
    "placeholder": "e.g. University student, in-home math tutoring"
  },
  {
    "key": "student_age",
    "label": "Student Age",
    "type": "text",
    "placeholder": "e.g. 12"
  },
  {
    "key": "concerns",
    "label": "Main Concerns",
    "type": "select",
    "options": [
      "Safety",
      "Teaching quality",
      "Cost fairness",
      "All"
    ]
  }
] as InputField[],
  definitionLead: "TutorGuard — Keep every AI tutor reply safe before students see it. Use it as decision-support: demo mode works without a live key; live runs require configuration. No fabricated metrics, and no claims for SSO/CSV/Slack unless that surface is actually shipped.",
  geoFaq: [
    { q: "What is TutorGuard?", a: "Keep every AI tutor reply safe before students see it." },
    { q: "Who should use TutorGuard?", a: "Operators and builders who need a fast first draft or checklist from TutorGuard." },
    { q: "Does it work without an API key?", a: "Yes in explicit Demo mode. Live AI requires a configured key." },
    { q: "Does it guarantee outcomes?", a: "No. Outputs are decision-support; you still review before publishing or acting." },
    { q: "Does it include SSO, Slack, or bulk CSV?", a: "Only if those features are implemented in this product build — do not assume them from marketing copy." },
    { q: "Where does data go?", a: "Runs may be stored locally under the product's .data/ boundary; treat demos as ephemeral." },
  ],
  systemPrompt: "You are TutorGuard, an advisor who helps parents evaluate the quality and safety of private tutors. Given a description of the tutor and arrangement, the student's age, and the parent's main concerns, flag the most important risks and guide the parent. Always structure your response as: (1) safety red flags (if any), (2) a vetting and interview checklist, (3) quality and fairness warning signs, (4) a parent safety action plan. Be practical and calm. In demo (mock) mode, return a realistic sample report following exactly this structure.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "1 tutor vetting check / day · watermarked report"
  },
  {
    "tier": "Family",
    "price": "$9/mo",
    "desc": "Continuous monitoring of tutors · quality reports · CSV/JSON export"
  },
  {
    "tier": "Enterprise",
    "price": "Custom",
    "desc": "Tutoring agencies · SSO · BYOK · shared rulesets"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const info = (inputs['tutor_info'] || '').trim()
  const age = (inputs['student_age'] || '').trim()
  const concerns = inputs['concerns'] || 'All'
  if (!info) return 'Describe the tutor and arrangement to run the safety check.'
  let out = 'TUTOR SAFETY CHECK - concerns: ' + concerns + '\n\n'
  out += 'Safety red flags:\n'
  out += '  - In-home sessions without a second adult present\n'
  out += '  - No reference or background check mentioned\n\n'
  out += 'Vetting & interview checklist:\n'
  out += '  - [ ] Verify ID + 2 references\n'
  out += '  - [ ] Ask about safeguarding training\n'
  out += '  - [ ] Trial session with parent present\n\n'
  out += 'Quality & fairness warning signs:\n'
  out += '  - Vague progress metrics\n'
  out += '  - Upfront long contracts\n\n'
  out += 'Parent safety action plan:\n'
  out += '  - Set check-in cadence + share session notes\n'
  out += '  - Keep first 3 sessions observed\n'
  out += '\n--- (Mock demo. Pro unlocks continuous monitoring + quality reports.)'
  return out
}
}
