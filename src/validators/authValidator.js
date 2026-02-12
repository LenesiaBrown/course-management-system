import { z } from 'zod';

// Register validation schema
export const registerSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    role: z
        .enum(['USER', 'ADMIN'], {
            errorMap: () => ({ message: "Role must be either USER or ADMIN" })
        })
        .optional()  // Optional because it defaults to USER
        .default('USER'),  // If not provided, set to USER
});

// Login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z
        .string()
        .min(1, "Password is required"),
});