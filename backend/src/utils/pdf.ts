import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export function generateSimpleReport(title: string, body: string) {
  const doc = new PDFDocument();
  doc.fontSize(20).text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(body);
  doc.end();
  return doc as unknown as Readable;
}

export function generateAssessmentReport(assessment: any) {
  const doc = new PDFDocument({ autoFirstPage: true });
  doc.info.Title = `Rapport - ${assessment.id}`;
  doc.fontSize(18).text('RIA Check & Go — Rapport d\'évaluation', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Assessment ID: ${assessment.id}`);
  doc.text(`Date: ${new Date(assessment.createdAt || Date.now()).toISOString()}`);
  doc.text(`Utilisateur: ${assessment.userId || 'anonymous'}`);
  doc.moveDown();

  doc.fontSize(14).text('Résumé de classification');
  doc.fontSize(12).text(`Score: ${assessment.score}`);
  doc.text(`Classification: ${assessment.classification}`);
  if ((assessment as any).reason) doc.text(`Motif: ${(assessment as any).reason}`);
  doc.moveDown();

  doc.fontSize(14).text('Obligations identifiées');
  const obligations = assessment.obligations || [];
  if (obligations.length === 0) doc.fontSize(12).text('Aucune obligation identifiée');
  else obligations.forEach((o:any, i:number) => {
    doc.fontSize(12).text(`${i+1}. ${o.code} — ${o.title}`);
    if (o.description) doc.fontSize(10).text(`   ${o.description}`);
  });
  doc.moveDown();

  doc.fontSize(14).text('Réponses au questionnaire');
  const answers = assessment.answers || [];
  answers.forEach((a:any, i:number) => {
    doc.fontSize(11).text(`${i+1}. ${a.questionId || a.code || ''}: ${a.value}`);
  });

  doc.addPage();
  doc.fontSize(12).text('Documentation technique (extraits)');
  doc.text('---');
  doc.end();
  return doc as unknown as Readable;
}
