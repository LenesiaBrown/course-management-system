// Middleware to check if user has required role
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user is set by authMiddleware
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Access denied. Admin privileges required.' 
            });
        }

        next();
    };
};