import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // Step 1: Get the token from the request header
        // Header looks like: "Authorization: Bearer abc123token456"
        const token = req.headers.authorization?.split(' ')[1];
        
        // Step 2: Check if token exists
        if (!token) {
            return res.status(401).json({ error: 'No token provided. Please login.' });
        }

        // Step 3: Verify the token is valid and not expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Step 4: Get the user from database using the ID in the token
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true } // Don't send password!
        });

        // Step 5: Check if user still exists
        if (!user) {
            return res.status(401).json({ error: 'User not found. Please login again.' });
        }

        // Step 6: Attach user to the request so other functions can use it
        req.user = user;

        // Step 7: Pass control to the next function (like the controller)
        next();

    } catch (error) {
        // Token is invalid, expired, or something went wrong
        return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
    }
};