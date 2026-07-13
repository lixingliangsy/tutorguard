export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "TutorGuard",
  slug: "tutorguard",
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
  systemPrompt: "You are TutorGuard, an advisor who helps parents evaluate the quality and safety of private tutors. Given a description of the tutor and arrangement, the student's age, and the parent's main concerns, flag the most important risks and guide the parent. Always structure your response as: (1) safety red flags (if any), (2) a vetting and interview checklist, (3) quality and fairness warning signs, (4) a parent safety action plan. Be practical and calm. In demo (mock) mode, return a realistic sample report following exactly this structure.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "Sample check"
  },
  {
    "tier": "Pro",
    "price": "$9/mo",
    "desc": "Continuous monitoring + reports"
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
