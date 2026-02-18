import express from 'express';
import { markAsFinished, getUserCompletions } from '../controllers/progressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { markAsFinishedSchema } from '../validators/progressValidator.js';

const router = express.Router();

router.use(authMiddleware); 

router.post('/', validate(markAsFinishedSchema), markAsFinished);
router.get('/completed', getUserCompletions);



export default router;