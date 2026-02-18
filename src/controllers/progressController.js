import { prisma } from "../config/db.js";


// Function 1: Mark a course as finished
export const markAsFinished = async (req, res) => {
    // req.body = The data the user sent (courseId, duration)
    const { courseId, duration } = req.body;
    
    // req.user.id = The logged-in user's ID (from authenticate middleware)
    const userId = req.user.id;

    try {
        // Save to database: "User X finished Course Y"
        const completion = await prisma.completion.create({
            data: {
                userId: parseInt(userId),      // Convert to number
                courseId: parseInt(courseId),  // Convert to number
                duration: duration,             // e.g., "2 hours"
                completionDate: new Date(),     // Today's date
            },
        });

        // Success! Send back the saved data
        res.status(201).json(completion);
    } catch (error) {
        // Oops, something went wrong
        res.status(400).json({ error: "Could not mark course as finished" });
    }
};

// Function 2: Get all courses a user has finished
export const getUserCompletions = async (req, res) => {
    const userId = req.user.id; // Who's asking?

    try {
        // Find all completions for this user
        const completions = await prisma.completion.findMany({
            where: { userId: parseInt(userId) },
            include: {
                course: true, // Also get course details (name, description, etc.)
            },
        });

        // Send back the list
        res.status(200).json(completions);
    } catch (error) {
        res.status(400).json({ error: "Could not get completions" });
    }
};