import { PrismaClient } from '@prisma/client';
import { mapObligationsForAnswers, lookupObligationsByCodes } from './obligations';

const prisma = new PrismaClient();

/**
 * Evaluate an existing assessment by id: computes score, classification and registers obligations mapping.
 */
export async function evaluateAssessment(assessmentId: string) {
  const assessment = await prisma.riskAssessment.findUnique({ where: { id: assessmentId }, include: { answers: true } });
  if (!assessment) throw new Error('Assessment not found');
  const { score, flags } = scoreFromAnswers(assessment.answers || []);
  const { classification, reason } = classifyScore(score, flags, assessment.answers || []);
  // persist results
  await prisma.riskAssessment.update({ where: { id: assessmentId }, data: { score, classification } });
  // Map obligations
  const obligations = mapObligationsForAnswers(assessment.answers || []);
  for (const ob of obligations) {
    // try to find existing Obligation record or create
    let dbOb = await prisma.obligation.findUnique({ where: { code: ob.code } });
    if (!dbOb) dbOb = await prisma.obligation.create({ data: ob });
    await prisma.obligationMapping.create({ data: { assessmentId: assessment.id, obligationId: dbOb.id } });
  }
  return { id: assessmentId, score, classification, reason, obligations };
}

/**
 * Evaluate answers directly (no DB): returns score, classification and obligations
 */
export async function evaluateAssessmentDirect(answers: any[]) {
  const { score, flags } = scoreFromAnswers(answers || []);
  const { classification, reason } = classifyScore(score, flags, answers || []);
  const obligations = mapObligationsForAnswers(answers || []);
  return { score, classification, reason, obligations };
}

/**
 * Scoring: sum weighted values and gather flags for detection rules
 */
function scoreFromAnswers(answers: any[]) {
  let score = 0;
  const flags: Record<string, boolean> = {};
  for (const a of answers) {
    const v = String(a.value || '').toLowerCase();
    const q = String(a.questionId || a.code || '').toLowerCase();
    // basic weights
    if (v === 'oui') score += 2;
    else if (v === 'partiellement') score += 1;
    else score += 0;
    // flags for inacceptable conditions
    if ((q.includes('biometr') || q.includes('biométr') || q.includes('biometric')) && v === 'oui') flags['biometric'] = true;
    if ((q.includes('infra') || q.includes('critical') || q.includes('infrastructure')) && v === 'oui') flags['critical_infra'] = true;
    if ((q.includes('sant') || q.includes('health') || q.includes('sensitive')) && v === 'oui') flags['sensitive_data'] = true;
    if ((q.includes('law') || q.includes('enforcement') || q.includes('police')) && v === 'oui') flags['law_enforcement'] = true;
    if ((q.includes('decision') || q.includes('emploi') || q.includes('hiring')) && v === 'oui') flags['impact_individual'] = true;
  }
  return { score, flags };
}

/**
 * Classification rules:
 * - Detect 'Inacceptable' per Art.5 using explicit flags (e.g., biometric ID for remote identification, social scoring, subliminal techniques)
 * - High Risk: if score high or impact on fundamental rights or safety-critical contexts (A9-A21)
 * - Medium / Low otherwise
 */
function classifyScore(score: number, flags: Record<string, boolean>, answers: any[]) {
  // Inacceptable risk rules (prototype set)
  // Examples of inacceptable: biometric remote ID used without safeguards, social scoring by public authorities, subliminal manipulative tech
  if (flags['biometric'] && flags['law_enforcement']) return { classification: 'Inacceptable (Art.5)', reason: 'Biometric identification used by law enforcement' };
  // Social scoring detection: look for keywords
  const qtexts = answers.map(a => String(a.questionId || a.code || a.text || '').toLowerCase()).join(' ');
  if (qtexts.includes('social scor') || qtexts.includes('social-scoring')) return { classification: 'Inacceptable (Art.5)', reason: 'Social scoring detected' };
  // Safety-critical or infrastructure impact
  if (flags['critical_infra'] && score >= 3) return { classification: 'High Risk (A9-A21)', reason: 'System affects critical infrastructure' };
  // Sensitive personal data used at scale
  if (flags['sensitive_data'] && score >= 3) return { classification: 'High Risk (A9-A21)', reason: 'Sensitive data processing' };
  // Impact on individual rights (automated decisions)
  if (flags['impact_individual'] && score >= 2) return { classification: 'High Risk (A9-A21)', reason: 'Automated decisions affecting individuals' };
  // Fallback by score
  if (score >= 6) return { classification: 'High Risk (A9-A21)', reason: 'High aggregated score' };
  if (score >= 3) return { classification: 'Medium Risk', reason: 'Medium aggregated score' };
  return { classification: 'Low Risk', reason: 'Low aggregated score' };
}
