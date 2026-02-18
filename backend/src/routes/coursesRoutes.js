import express from 'express';
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { validate } from '../middleware/validateRequest.js';
import { createCourseSchema, updateCourseSchema } from '../validators/courseValidator.js';

const router = express.Router();

// Public routes (anyone can view courses)
router.get('/', getAllCourses);
router.get('/:id', getCourseById);  // Get a single course

// Admin only routes (protected)
router.post('/', authMiddleware, authorizeRole('ADMIN'), validate(createCourseSchema), createCourse);

router.put('/:id', authMiddleware, authorizeRole('ADMIN'), validate(updateCourseSchema), updateCourse);

router.delete('/:id', authMiddleware, authorizeRole('ADMIN'), deleteCourse);



export default router;





// Testing

// import express from 'express';

// const router = express.Router();

// // Sample route for courses
// router.get('/hello', (req, res) => {
//   res.json({ message: 'Hello from courses route!' });
// });


// export default router;