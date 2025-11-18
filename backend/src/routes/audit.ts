import { Router } from 'express';
import { getAudits, recordAudit } from '../controllers/auditController';

const router = Router();

router.get('/', getAudits);
router.post('/', recordAudit);

export default router;
