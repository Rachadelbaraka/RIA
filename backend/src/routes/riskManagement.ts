import { Router } from 'express';
import { listControls, createControl, createMitigation, listMitigations } from '../controllers/riskManagementController';

const router = Router();

router.get('/controls', listControls);
router.post('/controls', createControl);

router.post('/mitigations', createMitigation);
router.get('/mitigations', listMitigations);

export default router;
