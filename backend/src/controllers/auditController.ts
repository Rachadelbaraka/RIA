import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAudits(req: Request, res: Response) {
  const audits = await prisma.audit.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  res.json(audits);
}

export async function recordAudit(req: Request, res: Response) {
  const { action, actorId, target, details } = req.body;
  const a = await prisma.audit.create({ data: { action, actorId, target, details } });
  res.json(a);
}
