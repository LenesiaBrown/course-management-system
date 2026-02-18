import { z } from 'zod';

// Mark course as finished validation - REVISIT LATER!!!!
export const markAsFinishedSchema = z.object({
    courseId: z
        .number()
        .int("Course ID must be an integer")
        .positive("Course ID must be positive"),
    duration: z
        .string()
        .min(1, "Duration is required"),
});