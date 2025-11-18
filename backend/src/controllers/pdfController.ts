import { Request, Response } from 'express';
import { generateSimpleReport } from '../utils/pdf';
import stream from 'stream';
import { PrismaClient } from '@prisma/client';
import { generateAssessmentReport } from '../utils/pdf';

const prisma = new PrismaClient();

export async function generateReport(req: Request, res: Response) {
  const { type } = req.query;
  const body = req.body || {};
  const title = (type === 'tech') ? 'Documentation Technique' : (type === 'conformity') ? 'Rapport de Conformité' : (type === 'declaration') ? 'Déclaration UE (Annexe V)' : 'Rapport Diagnostic';
  const content = `Rapport de type: ${type}\n\nContenu (prototype):\n${JSON.stringify(body, null, 2)}`;
  const pdfStream = generateSimpleReport(title, content);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g,'_')}.pdf"`);
  // pipe PDFKit stream to response
  (pdfStream as any).pipe(res);
}

export async function generateAssessmentReportHandler(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'assessment id required' });
  const assessment = await prisma.riskAssessment.findUnique({ where: { id }, include: { answers: true } });
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

  // gather obligations mapped (join)
  const maps = await prisma.obligationMapping.findMany({ where: { assessmentId: id }, include: { obligation: true } });
  const obligations = maps.map(m => ({ code: m.obligation.code, title: m.obligation.title, description: m.obligation.description }));
  const payload = { ...assessment, obligations };

  const pdfStream = generateAssessmentReport(payload);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="assessment_${id}.pdf"`);
  (pdfStream as any).pipe(res);
}
