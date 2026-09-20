# TutorGuard — Authoritative Sources (deep-data moat)

Curated, web-researched references backing the `tutorguard-agent` minor-protection
corpus (`lib/governance-data/*.json`). All entries carry `verify: true` and are
decision-support, not legal advice.

## Primary law & regulators
- **COPPA** — Children's Online Privacy Protection Rule (16 CFR Part 312)
  - FTC rule page: https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa
  - 2025 final amendments (effective 2025-06-23, compliance 2026-04-22): https://www.regulations.gov/document/FTC-2024-0003-0281
- **FERPA** — Family Educational Rights and Privacy Act (34 CFR Part 99)
  - ED Student Privacy Policy Office: https://studentprivacy.ed.gov/
  - FPCO overview: https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html
- **GDPR Art. 8** — Conditions applicable to child's consent (Reg. (EU) 2016/679)
  - Text: https://gdpr-info.eu/art-8-gdpr/
  - DPIA (Art. 35): https://gdpr-info.eu/art-35-gdpr/
  - Privacy by design/default (Art. 25): https://gdpr-info.eu/art-25-gdpr/
  - Fines (Art. 83): https://gdpr-info.eu/art-83-gdpr/
- **SOPIPA** — Student Online Personal Information Protection Act (CA Bus. & Prof. Code §22584.1)
  - CA legislative text (SB-1177): https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201320140SB1177
  - CDE overview: https://www.cde.ca.gov/pd/ca/lit/sopipa.asp
- **UK Age Appropriate Design Code (Children's code)** — ICO, statutory under DPA 2018 s.123
  - Code of practice: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/

## Crosswalk / synthesis
- COPPA vs FERPA, GDPR Art.8 vs UK AADC, SOPIPA vs GDPR, minor-consent matrix,
  risk-based age assurance, data minimization, human-in-the-loop safeguarding,
  and the no-"guaranteed safe/compliant" red line — compiled in
  `lib/governance-data/frameworks.json`.

## Maintenance
When updating the corpus, add the new authoritative URL here and set `verify: true`
on the corresponding dataset entry. Contributed (flywheel) entries are always
`verify: true` and never auto-merged into the curated dataset.
