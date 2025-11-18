import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { evaluateAssessment } from '../services/riskEngine';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export async function getQuestions(req: Request, res: Response) {
  // Load questions from JSON fixture
  const p = path.join(__dirname, '../data/questions.json');
  const raw = fs.readFileSync(p, 'utf-8');
  const questions = JSON.parse(raw);
  res.json(questions);
}

export async function submitAnswers(req: Request, res: Response) {
  const { userId, answers } = req.body;
  if (!answers || !Array.isArray(answers)) return res.status(400).json({ error: 'Answers required' });
  const assessment = await prisma.riskAssessment.create({ data: { userId: userId || null, score: 0, classification: 'pending' } });
  for (const a of answers) {
    await prisma.answer.create({ data: { questionId: a.questionId || a.id || a.code, assessmentId: assessment.id, value: a.value } });
  }
  const result = await evaluateAssessment(assessment.id);
  res.json(result);
}

export async function adminUploadQuestions(req: Request, res: Response) {
  // Accept JSON array of questions and overwrite fixture file
  const questions = req.body;
  if (!Array.isArray(questions)) return res.status(400).json({ error: 'questions array required' });
  const p = path.join(__dirname, '../data/questions.json');
  fs.writeFileSync(p, JSON.stringify(questions, null, 2), 'utf-8');
  res.json({ ok: true, count: questions.length });
}
