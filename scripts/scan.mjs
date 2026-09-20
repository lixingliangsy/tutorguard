// scan.mjs — tutorguard 教育安全护栏审计（真实实现，T1 审计模板契约驱动）
// 领域：EdTech Safety / 学生数据隐私（COPPA/FERPA/GDPR）。审计教学互动安全覆盖。
// 幂等：同输入同输出、无副作用、可重入。返回 { items:[{id,...}], metrics:{...} }
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA = path.join(ROOT, '.data')
const AUDIT = path.join(DATA, 'audit')

async function fetchText(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12000)
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'user-agent': 't1-audit-bot/1.0 (+https://lxsai.com)' } })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    return await r.text()
  } finally { clearTimeout(t) }
}

async function loadTargets(targets) {
  const docs = []
  for (const t of targets) {
    try {
      if (/^https?:\/\//i.test(t)) { docs.push(await fetchText(t)); continue }
        const p = path.isAbsolute(t) ? t : path.join(AUDIT, t)
      docs.push(fs.readFileSync(p, 'utf8'))
    } catch (e) { console.warn('[scan] target load failed:', t, e.message) }
  }
  return docs
}

export async function scan(ctx) {
  const cfg = JSON.parse(fs.readFileSync(path.join(DATA, 'config.json'), 'utf8'))
  const targets = (cfg.scan && cfg.scan.targets) || [path.join(AUDIT, 'tutorguard-sample.json')]
  const docs = await loadTargets(targets)
  let cfgObj = {}
  try { cfgObj = JSON.parse(docs.join('\n')) } catch (e) { console.warn('[scan] parse failed', e.message) }
  const items = []

  const checks = [
    ['minor_pii_protection', 'tutorguard:minor-pii-missing', 'privacy', 'high', 'No minor PII protection', '未保护未成年人个人数据（COPPA/FERPA）'],
    ['grooming_abuse_detection', 'tutorguard:grooming-missing', 'safety', 'high', 'No grooming/abuse detection', '未检测诱骗/不当接触等虐待风险'],
    ['educational_claim_accuracy', 'tutorguard:claim-accuracy-missing', 'accuracy', 'medium', 'No educational-claim accuracy', '未核查教学内容/答案准确性'],
    ['human_review_escalation', 'tutorguard:human-review-missing', 'safety', 'medium', 'No human-review escalation', '高风险对话未升级人工复核'],
    ['age_appropriate_content', 'tutorguard:age-appropriate-missing', 'safety', 'medium', 'No age-appropriate content', '未确保内容适龄'],
    ['off_platform_contact_block', 'tutorguard:off-platform-missing', 'safety', 'medium', 'No off-platform contact block', '未拦截引导学生离开平台的联系方式']
  ]
  const present = {}
  for (const [key, id, category, severity, title, detail] of checks) {
    const ok = cfgObj[key] === true
    present[key] = ok
    if (!ok) items.push({ id, category, severity, title, detail, present: false })
  }

  const weights = { high: 18, medium: 10, low: 5 }
  const bySeverity = { high: 0, medium: 0, low: 0 }
  let penalty = 0
  for (const it of items) { penalty += weights[it.severity] || 0; bySeverity[it.severity]++ }
  const score = Math.max(0, 100 - penalty)

  const metrics = {
    edtech_safety_score: score,
    total_checks: checks.length,
    passed: checks.length - items.length,
    by_severity: bySeverity,
    ...present
  }
  return { items, metrics }
}
