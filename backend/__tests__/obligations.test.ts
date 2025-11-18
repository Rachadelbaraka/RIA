import { mapObligationsForAnswers } from '../src/services/obligations';

describe('obligations mapping', ()=>{
  test('maps biometric and decision to obligations', ()=>{
    const answers = [{ questionId: 'q4', value: 'oui', text: 'reconnaissance faciale (biométrie)' }, { questionId: 'q1', value: 'oui', text: 'décision automatique affecting rights' }];
    const obs = mapObligationsForAnswers(answers);
    expect(obs.some(o=>o.code==='A10')).toBe(true);
    expect(obs.some(o=>o.code==='A9')).toBe(true);
  });
});
