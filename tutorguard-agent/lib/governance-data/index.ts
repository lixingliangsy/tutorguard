import fs from 'fs'
import path from 'path'
import { getAcceptedContributed } from '../data-flywheel'

export interface GovEntry {
  id: string
  ref: string
  title: string
  text: string
  source: string
  scope: GovScope
  verify?: boolean
}

export type GovScope = 'coppa' | 'ferpa' | 'gdpr' | 'sopipa' | 'ukaadc' | 'frameworks'

interface FlatEntry {
  id: string
  ref: string
  title: string
  text: string
  source: string
  scope: GovScope
  verify?: boolean
}

const DATA_DIR = __dirname
const STOP = new Set([
  'the', 'a', 'an', 'of', 'to', 'and', 'or', 'for', 'in', 'on', 'is', 'are', 'be', 'your', 'you', 'with',
  'that', 'this', 'from', 'as', 'by', 'at', 'it', 'its', 'their', 'they', 'must', 'not', 'has', 'have',
  'per', 'child', 'children', 'minor', 'minors', 'student', 'students', 'data', 'personal', 'privacy',
  'ai', 'tutor', 'tutors', 'online', 'service', 'services',
])

function readJson(name: string): any {
  const p = path.join(DATA_DIR, name)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

let _index: FlatEntry[] | null = null

export function loadGovernanceIndex(): FlatEntry[] {
  if (_index) return _index
  const out: FlatEntry[] = []

  const datasets: Array<{
    file: string
    scope: GovScope
    standard: string
  }> = [
    { file: 'coppa.json', scope: 'coppa', standard: 'COPPA (FTC)' },
    { file: 'ferpa.json', scope: 'ferpa', standard: 'FERPA (ED SPPO)' },
    { file: 'gdpr-children.json', scope: 'gdpr', standard: 'GDPR Art.8' },
    { file: 'sopipa.json', scope: 'sopipa', standard: 'SOPIPA (CA)' },
    { file: 'uk-aadc.json', scope: 'ukaadc', standard: 'UK Age Appropriate Design Code (ICO)' },
    { file: 'frameworks.json', scope: 'frameworks', standard: 'Framework crosswalk' },
  ]

  for (const d of datasets) {
    const data = readJson(d.file)
    const entries: Array<{ id: string; title: string; body: string; ref: string; tags?: string[]; verify?: boolean }> =
      data.entries || []
    for (const e of entries) {
      out.push({
        id: e.id,
        ref: e.ref,
        title: e.title,
        text: e.body,
        source: d.standard,
        scope: d.scope,
        verify: e.verify,
      })
    }
  }

  // DATA FLYWHEEL — merge human-accepted contributed signals into the
  // retrievable index. Contributed entries always carry verify:true and are
  // never treated as vetted law (see data-flywheel.ts / guardrails G1–G5).
  for (const c of getAcceptedContributed()) {
    out.push({
      id: c.id,
      ref: c.ref,
      title: c.title,
      text: c.text,
      source: c.source,
      scope: c.scope,
      verify: c.verify,
    })
  }

  _index = out
  return out
}

/** Force the next retrieve to rebuild from disk (re-ingest newly accepted signals). */
export function invalidateGovernanceCache(): void {
  _index = null
}

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9.\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
}

export interface RetrieveOpts {
  scope?: GovScope | 'all'
  topK?: number
  threshold?: number
}

export function retrieve(query: string, opts: RetrieveOpts = {}): GovEntry[] {
  const idx = loadGovernanceIndex()
  const scope = opts.scope || 'all'
  const topK = opts.topK || 6
  const qTokens = new Set(tokenize(query))
  const scopeFilter = scope === 'all' ? idx : idx.filter((e) => e.scope === scope)

  const scored = scopeFilter.map((e) => {
    const hay = tokenize(`${e.title} ${e.text} ${e.ref} ${e.id}`)
    let score = 0
    for (const t of hay) if (qTokens.has(t)) score += 1
    // ref/id-match boost (e.g. "coppa", "art8", "sopipa", "aadc")
    for (const qt of qTokens) {
      if (e.ref.toLowerCase().includes(qt) || e.id.toLowerCase().includes(qt)) score += 2
    }
    return { e, score }
  })

  return scored
    .filter((s) => s.score > (opts.threshold ?? 0))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => ({ id: s.e.id, ref: s.e.ref, title: s.e.title, text: s.e.text, source: s.e.source, scope: s.e.scope, verify: s.e.verify }))
}

export const GOVERNANCE_SOURCES = [
  'COPPA — Children’s Online Privacy Protection Rule (16 CFR Part 312)',
  'FERPA — Family Educational Rights and Privacy Act (34 CFR Part 99)',
  'GDPR Art. 8 — Conditions applicable to child’s consent (Reg. (EU) 2016/679)',
  'SOPIPA — Student Online Personal Information Protection Act (CA Bus. & Prof. Code §22584.1)',
  'UK Age Appropriate Design Code (ICO, statutory under DPA 2018 s.123)',
]
