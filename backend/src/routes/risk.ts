import { Router } from 'express';
import { classify } from '../controllers/riskController';

const router = Router();

router.post('/classify', classify);

export default router;
