import { z } from 'zod';

// Register validation schema
export const registerSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email({ message: "Invalid email format" }),
    password: z
        .string()
        .transform((val, ctx) => {
            if (!val || val.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password is required",
                });
                return z.NEVER;  // Stop processing
            }
            if (val.length < 6) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password must be at least 6 characters",
                });
                return z.NEVER;
            }
            return val;  // Valid, return as-is
        }),
    role: z
        .refine(
        (val) => !val || ['USER', 'ADMIN'].includes(val),
        { message: "Role must be either USER or ADMIN" }
        )
        .optional()  // Optional because it defaults to USER
        .default('USER'),  // If not provided, set to USER
});

// Login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email({ message: "Invalid email format" }),
    password: z
        .string()
        .min(1, "Password is required"),
});