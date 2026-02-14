import { prisma } from '../config/db.js';


// Get all courses (with optional search and filters)
export const getAllCourses = async (req, res) => {
    try {
        const { search, skill, departmentId } = req.query;

        // Build where clause based on filters
        const where = {};

        // Search by name or description
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Filter by skill
        if (skill) {
            where.skills = { has: skill };
        }

        // Filter by department
        if (departmentId) {
            where.departmentId = parseInt(departmentId);
        }

        const courses = await prisma.course.findMany({
            where,
            include: {
                department: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(courses);
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id: parseInt(id) },
            include: {
                department: {
                    select: { id: true, name: true }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
};

// Create course (Admin only)
export const createCourse = async (req, res) => {
    try {
        const { name, description, skills, externalLink, departmentId } = req.body;

        // Below is shorthand for: data: { name: name, description: description, skills: skills, externalLink: externalLink, departmentId: departmentId }
        const course = await prisma.course.create({
            data: {
                name,
                description,
                skills,
                externalLink,
                departmentId
            },
            include: {
                department: {
                    select: { id: true, name: true }
                }
            }
        });

        res.status(201).json(course);
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ error: 'Failed to create course' });
    }
};

// Update course (Admin only)
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, skills, externalLink, departmentId } = req.body;

        const course = await prisma.course.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(skills && { skills }),
                ...(externalLink && { externalLink }),
                ...(departmentId && { departmentId })
            },
            include: {
                department: {
                    select: { id: true, name: true }
                }
            }
        });

        res.status(200).json(course);
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ error: 'Failed to update course' });
    }
};

// Delete course (Admin only)
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.course.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
};