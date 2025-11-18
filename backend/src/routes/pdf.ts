import { Router } from 'express';
import { generateReport } from '../controllers/pdfController';

const router = Router();

router.post('/', generateReport);
router.get('/assessment/:id', require('../controllers/pdfController').generateAssessmentReportHandler);

export default router;
