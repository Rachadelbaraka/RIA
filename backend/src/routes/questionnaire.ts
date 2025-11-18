import { Router } from 'express';
import { submitAnswers, getQuestions } from '../controllers/questionnaireController';
import { adminUploadQuestions } from '../controllers/questionnaireController';

const router = Router();

router.get('/questions', getQuestions);
router.post('/submit', submitAnswers);
router.post('/admin/upload', adminUploadQuestions);

export default router;
