import request from 'supertest';
import app from '../src/app';

describe('pdf endpoints', ()=>{
  test('generate assessment PDF after submit', async ()=>{
    // submit an assessment
    const answers = [{ questionId: 'q1', value: 'oui' }, { questionId: 'q4', value: 'non' }];
    const submit = await request(app).post('/api/questionnaire/submit').send({ userId: null, answers });
    expect(submit.status).toBe(200);
    const id = submit.body.id || submit.body.id;
    // request pdf
    const res = await request(app).get(`/api/pdf/assessment/${submit.body.id}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
  });
});
