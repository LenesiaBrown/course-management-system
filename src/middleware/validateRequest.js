export const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Parse and validate the request body
            const validatedData = schema.parse(req.body);
            
            // Replace req.body with validated data
            req.body = validatedData;
            
            // Continue to next middleware/controller
            next();
        } catch (error) {
            // Check if it's a Zod validation error
            if (error.issues) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            
            // If it's not a Zod error, return generic error
            return res.status(400).json({
                error: "Invalid request data",
                message: error.message
            });
        }
    };
};