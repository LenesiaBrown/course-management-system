import { z } from 'zod';

// Create course validation
export const createCourseSchema = z.object({
    name: z
        .string()
        .min(1, "Course name is required")
        .max(200, "Course name too long"),
    description: z
        .string()
        .min(1, "Description is required"),
    skills: z
        .array(z.string())
        .min(1, "At least one skill is required"),
    externalLink: z
        .string()
        .url("Must be a valid URL"),
    departmentId: z
        .number()
        .int("Department ID must be an integer")
        .positive("Department ID must be positive"),
});

// Update course validation (all fields optional)
export const updateCourseSchema = z.object({
    name: z
        .string()
        .min(1)
        .max(200)
        .optional(),
    description: z
        .string()
        .min(1)
        .optional(),
    skills: z
        .array(z.string())
        .min(1)
        .optional(),
    externalLink: z
        .string()
        .url()
        .optional(),
    departmentId: z
        .number()
        .int()
        .positive()
        .optional(),
});