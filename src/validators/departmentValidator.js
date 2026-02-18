import { z } from 'zod';

// Create department validation
export const createDepartmentSchema = z.object({
    name: z
        .string()
        .min(1, "Department name is required")
        .max(100, "Department name too long"),
});

// Update department validation
export const updateDepartmentSchema = z.object({
    name: z
        .string()
        .min(1, "Department name is required")
        .max(100, "Department name too long"),
});