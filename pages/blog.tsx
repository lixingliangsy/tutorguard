import React from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { PRODUCT } from '../lib/product'

import { buildFaqJsonLd, buildHowToJsonLd } from '../lib/schema'
const posts = [
  {
    slug: "what-to-ask-when-hiring-a-tutor",
    title: "What to ask when hiring a private tutor",
    type: "How-to \u00b7 HowTo",
    query: "questions to ask private tutor parents",
    body: "Ask about experience with the student\u2019s age, references, session boundaries, cancellation policy, and how progress is measured. Document answers.",
    refs: ["https://www.ftc.gov/business-guidance", "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/", "https://www.unesco.org/en/artificial-intelligence/education"],
  },
  {
    slug: "ai-tutor-safety-basics",
    title: "AI tutor safety basics for product teams",
    type: "Definitional \u00b7 FAQPage",
    query: "AI tutor content safety students",
    body: "Filter unsafe content, avoid unverified medical/legal advice, keep human escalation paths, and log interventions. No filter is perfect.",
    refs: ["https://www.ftc.gov/business-guidance", "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/", "https://www.unesco.org/en/artificial-intelligence/education"],
  },
  {
    slug: "red-flags-in-tutoring-arrangements",
    title: "Red flags in tutoring arrangements",
    type: "Definitional",
    query: "tutoring red flags for parents",
    body: "Pressure to meet alone without clear norms, refusal of references, unexplained fee changes, or discouraging parent involvement deserve pause.",
    refs: ["https://www.ftc.gov/business-guidance", "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/", "https://www.unesco.org/en/artificial-intelligence/education"],
  },
]


const faqs = [
  {
    "question": "What to ask when hiring a private tutor",
    "answer": "Ask about experience with the student\\u2019s age, references, session boundaries, cancellation policy, and how progress is measured. Document answers."
  },
  {
    "question": "AI tutor safety basics for product teams",
    "answer": "Filter unsafe content, avoid unverified medical/legal advice, keep human escalation paths, and log interventions. No filter is perfect."
  },
  {
    "question": "Red flags in tutoring arrangements",
    "answer": "Pressure to meet alone without clear norms, refusal of references, unexplained fee changes, or discouraging parent involvement deserve pause."
  }
] as { question: string; answer: string }[]

const howToBlocks = [
  {
    "name": "What to ask when hiring a private tutor",
    "steps": [
      {
        "name": "Overview",
        "text": "Ask about experience with the student\\u2019s age, references, session boundaries, cancellation policy, and how progress is measured. Document answers."
      }
    ]
  }
] as { name: string; steps: { name: string; text: string }[] }[]

export default function BlogPage() {
  return (
    <Layout>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqs)) }}
        />
        {howToBlocks.map((block, i) => (
          <script
            key={`howto-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildHowToJsonLd(block.name, block.steps)),
            }}
          />
        ))}

        <title>{`${PRODUCT.name} — Blog`}</title>
        <meta name="description" content={`Definitional and how-to posts from ${PRODUCT.name}.`} />
      </Head>
      <div className="max-w-3xl">
        <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">Blog · GEO</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Guides &amp; definitions</h1>
        <p className="text-lg text-slate-600 mb-10">Own the definitional queries that AI answer engines cite.</p>

        <div className="space-y-8">
          {posts.map((p) => (
            <article key={p.slug} className="border-b border-slate-200 pb-8">
              <div className="text-xs font-semibold text-indigo-600 mb-1">{p.type}</div>
              <h2 className="text-2xl font-bold mb-2 text-slate-900">{p.title}</h2>
              <p className="text-sm text-slate-600 mb-2"><span className="font-semibold">Target query:</span> {p.query}</p>
              <p className="text-slate-700 leading-relaxed">{p.body}</p>
              <p className="text-xs text-slate-400 mt-3">refs: {p.refs.join(' · ')}</p>
            </article>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-8">Publish + syndicate per gtm-launch. Each post carries 3 authoritative refs.</p>
      </div>
    </Layout>
  )
}
