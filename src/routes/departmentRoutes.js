import express from 'express';
import { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { validate } from '../middleware/validateRequest.js';
import { createDepartmentSchema, updateDepartmentSchema } from '../validators/departmentValidator.js';

const router = express.Router();

// Public routes (anyone can view departments)
router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);

// Admin only routes (protected)
router.post('/', authMiddleware, authorizeRole('ADMIN'), validate(createDepartmentSchema), createDepartment);

router.put('/:id', authMiddleware, authorizeRole('ADMIN'), validate(updateDepartmentSchema), updateDepartment);

router.delete('/:id', authMiddleware, authorizeRole('ADMIN'), deleteDepartment);




export default router;