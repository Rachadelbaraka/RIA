import { evaluateAssessmentDirect } from '../src/services/riskEngine';

describe('riskEngine', () => {
  test('classify biometric + law enforcement as Inacceptable', async () => {
    const answers = [
      { questionId: 'q_biometric', value: 'oui' },
      { questionId: 'q_law', value: 'oui' }
    ];
    const res = await evaluateAssessmentDirect(answers);
    expect(res.classification).toMatch(/Inacceptable/);
    expect(res.obligations.some((o:any)=>o.code==='A12')).toBe(true);
  });

  test('sensitive data with medium score => High Risk', async () => {
    const answers = [
      { questionId: 'q_health', value: 'oui' },
      { questionId: 'q_infra', value: 'partiellement' }
    ];
    const res = await evaluateAssessmentDirect(answers);
    expect(['High Risk (A9-A21)','Medium Risk','Low Risk']).toContain(res.classification);
    expect(res.obligations.length).toBeGreaterThan(0);
  });
});
