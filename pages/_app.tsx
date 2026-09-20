import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

export default function App({ Component, pageProps }: AppProps) {
  return       <><Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TutorGuard" />
        <meta property="og:description" content="TutorGuard automatically reviews your AI tutor's replies for unsafe content, factual errors, and policy violations, intercepting anything risky before it reaches a student." />
        <meta property="og:url" content="https://tutorguard.lxsaihub.com/" />
        <meta property="og:image" content="https://tutorguard.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TutorGuard" />
        <meta name="twitter:description" content="TutorGuard automatically reviews your AI tutor's replies for unsafe content, factual errors, and policy violations, intercepting anything risky before it reaches a student." />
        <meta name="twitter:image" content="https://tutorguard.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"TutorGuard","url":"https://tutorguard.lxsaihub.com/","description":"TutorGuard automatically reviews your AI tutor\'s replies for unsafe content, factual errors, and policy violations, intercepting anything risky before it reaches a student.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","priceCurrency":"USD","price":"0","availability":"https://schema.org/OnlineOnly"}}' }} />
      </Head>
      <Component {...pageProps} />
      <ChatWidget productName={SUPPORT.productName} brandColor={SUPPORT.brandColor} sessionKeyPrefix={SUPPORT.productSlug} /></>
}
