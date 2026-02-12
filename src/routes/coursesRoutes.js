import express from 'express';

const router = express.Router();

// Sample route for courses
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from courses route!' });
});


export default router;