import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Use Prisma if DATABASE_URL provided, otherwise fallback to in-memory store (useful for tests)
let prisma: any = null;
if (process.env.DATABASE_URL) {
  prisma = new PrismaClient();
}

const inMemory = {
  controls: [] as any[],
  mitigations: [] as any[]
};

export async function listControls(req: Request, res: Response) {
  if (!prisma) return res.json(inMemory.controls);
  const controls = await prisma.riskControl.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(controls);
}

export async function createControl(req: Request, res: Response) {
  const { code, title, description } = req.body;
  if (!code || !title) return res.status(400).json({ error: 'code and title required' });
  if (!prisma) {
    const c = { id: 'mem-'+Date.now(), code, title, description, createdAt: new Date() };
    inMemory.controls.unshift(c);
    return res.json(c);
  }
  const c = await prisma.riskControl.create({ data: { code, title, description } });
  res.json(c);
}

export async function createMitigation(req: Request, res: Response) {
  const { assessmentId, controlId, owner, dueDate, notes } = req.body;
  if (!assessmentId || !controlId) return res.status(400).json({ error: 'assessmentId and controlId required' });
  if (!prisma) {
    const m = { id: 'mem-m-'+Date.now(), assessmentId, controlId, owner, dueDate: dueDate ? new Date(dueDate) : null, notes, status: 'open', createdAt: new Date() };
    inMemory.mitigations.unshift(m);
    return res.json(m);
  }
  const m = await prisma.mitigationPlan.create({ data: { assessmentId, controlId, owner, dueDate: dueDate ? new Date(dueDate) : undefined, notes } });
  res.json(m);
}

export async function listMitigations(req: Request, res: Response) {
  const { assessmentId } = req.query;
  if (!prisma) {
    const items = assessmentId ? inMemory.mitigations.filter(m => m.assessmentId === String(assessmentId)) : inMemory.mitigations;
    return res.json(items);
  }
  const where = assessmentId ? { where: { assessmentId: String(assessmentId) }, orderBy: { createdAt: 'desc' } } : { orderBy: { createdAt: 'desc' } };
  // @ts-ignore
  const items = await prisma.mitigationPlan.findMany(where);
  res.json(items);
}
