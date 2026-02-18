import { prisma } from '../config/db.js';

// Get all departments
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            include: {
                _count: {
                    select: { courses: true }  // Count how many courses in each department
                }
            },
            orderBy: { name: 'asc' }  // Sort alphabetically
        });

        res.status(200).json(departments);
    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
};

// Get single department by ID
export const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await prisma.department.findUnique({
            where: { id: parseInt(id) },
            include: {
                courses: true,  // Include all courses in this department
                _count: {
                    select: { courses: true }
                }
            }
        });

        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.status(200).json(department);
    } catch (error) {
        console.error('Get department error:', error);
        res.status(500).json({ error: 'Failed to fetch department' });
    }
};

// Create department (Admin only)
export const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;

        const department = await prisma.department.create({
            data: { name }
        });

        res.status(201).json(department);
    } catch (error) {
        console.error('Create department error:', error);
        
        // Check if name already exists (unique constraint)
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Department name already exists' });
        }
        
        res.status(500).json({ error: 'Failed to create department' });
    }
};

// Update department (Admin only)
export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const department = await prisma.department.update({
            where: { id: parseInt(id) },
            data: { name }
        });

        res.status(200).json(department);
    } catch (error) {
        console.error('Update department error:', error);
        
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Department name already exists' });
        }
        
        res.status(500).json({ error: 'Failed to update department' });
    }
};

// Delete department (Admin only)
export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if department has courses
        const department = await prisma.department.findUnique({
            where: { id: parseInt(id) },
            include: {
                _count: {
                    select: { courses: true }
                }
            }
        });

        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }

        if (department._count.courses > 0) {
            return res.status(400).json({ 
                error: `Cannot delete department. It has ${department._count.courses} course(s). Please delete the courses first.` 
            });
        }

        await prisma.department.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error('Delete department error:', error);
        res.status(500).json({ error: 'Failed to delete department' });
    }
};