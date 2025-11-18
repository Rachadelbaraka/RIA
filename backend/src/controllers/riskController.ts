import { Request, Response } from 'express';
import { evaluateAssessmentDirect } from '../services/riskEngine';

export async function classify(req: Request, res: Response) {
  const { answers } = req.body;
  if (!answers) return res.status(400).json({ error: 'answers required' });
  const result = await evaluateAssessmentDirect(answers);
  res.json(result);
}
