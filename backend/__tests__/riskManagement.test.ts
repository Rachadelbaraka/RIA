import request from 'supertest';
import app from '../src/app';

describe('risk management endpoints', ()=>{
  test('create control and list', async ()=>{
    const code = 'CTRL-'+Date.now();
    const res = await request(app).post('/api/risk-management/controls').send({ code, title: 'Test control', description: 'desc' });
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(code);
    const list = await request(app).get('/api/risk-management/controls');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });
});
