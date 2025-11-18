import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import questionnaireRoutes from './routes/questionnaire';
import riskRoutes from './routes/risk';
import auditRoutes from './routes/audit';
import pdfRoutes from './routes/pdf';
import riskManagementRoutes from './routes/riskManagement';
import { logger } from './utils/logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/risk-management', riskManagementRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err?.stack || err?.message || String(err));
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
