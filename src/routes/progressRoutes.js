import express from 'express';
import { markAsFinished, getUserCompletions } from '../controllers/progressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); 

router.post('/', markAsFinished);
router.get('/completed', getUserCompletions);



export default router;