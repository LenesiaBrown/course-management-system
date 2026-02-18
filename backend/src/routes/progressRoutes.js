import express from 'express';
import { markAsFinished, getUserCompletions, checkCompletion, removeCompletion } from '../controllers/progressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { markAsFinishedSchema } from '../validators/progressValidator.js';

const router = express.Router();

router.use(authMiddleware); 

router.get('/completed', getUserCompletions);
router.post('/completed', validate(markAsFinishedSchema), markAsFinished);
router.get('/course/:courseId/user', checkCompletion);
router.delete('/:courseId', removeCompletion);



export default router;