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


// Function 3: Check if a user has completed a specific course
export const checkCompletion = async (req, res) => {
  const userId = req.user?.id;
  const { courseId } = req.params;

  if (!userId) return res.status(400).json({ error: "Missing user ID" });
  if (!courseId) return res.status(400).json({ error: "Missing course ID" });

  try {
    const completion = await prisma.completion.findFirst({
      where: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
      },
    });

    if (!completion) {
      return res.status(404).json({ error: "Not completed" });
    }

    res.status(200).json(completion);
  } catch (error) {
    console.error("Error in checkCompletion:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// Remove completion
export const removeCompletion = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
        // Find the completion
        const completion = await prisma.completion.findFirst({
            where: {
                userId: parseInt(userId),
                courseId: parseInt(courseId)
            }
        });

        if (!completion) {
            return res.status(404).json({ error: 'Completion not found' });
        }

        // Delete the completion
        await prisma.completion.delete({
            where: { id: completion.id }
        });

        res.status(200).json({ message: 'Completion removed successfully' });
    } catch (error) {
        console.error('Remove completion error:', error);
        res.status(500).json({ error: 'Failed to remove completion' });
    }
};
