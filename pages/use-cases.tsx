import React from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { PRODUCT } from '../lib/product'

const segments = [
  {
    name: "Parents hiring tutors",
    pain: "Hard to know what to ask in interviews.",
    how: "Get a vetting checklist and red-flag list.",
  },
  {
    name: "AI tutor products",
    pain: "Need reply safety before students see content.",
    how: "Screen replies for unsafe content signals (product positioning).",
  },
  {
    name: "Agencies",
    pain: "Need consistent quality/safety gates.",
    how: "Enterprise shared rulesets.",
  },
  {
    name: "Cost fairness",
    pain: "Unclear pricing or overpromising.",
    how: "Fairness warning signs in the report.",
  },
]

export default function UseCasesPage() {
  return (
    <Layout>
      <Head>
        <title>{`${PRODUCT.name} — Use Cases`}</title>
        <meta name="description" content={`How ${PRODUCT.name} helps ${PRODUCT.tagline}`} />
      </Head>
      <div className="max-w-4xl">
        <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">Use Cases</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Built for parents and tutoring agencies</h1>
        <p className="text-lg text-slate-600 mb-10">Pick your segment to see the workflows that matter most.</p>

        <div className="space-y-5">
          {segments.map((s) => (
            <div key={s.name} className="rounded-2xl border border-slate-200 p-6 bg-white">
              <h2 className="text-xl font-bold mb-2 text-slate-900">{s.name}</h2>
              <p className="text-sm text-slate-600 mb-2"><span className="font-semibold text-slate-900">Pain: </span>{s.pain}</p>
              <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">How {PRODUCT.name} helps: </span>{s.how}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-8">refs: FTC consumer protection guidance · ICO children guidance · UNESCO AI and education guidance (overview)</p>
      </div>
    </Layout>
  )
}
