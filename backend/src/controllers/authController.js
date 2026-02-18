import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
    const { email, password, role } = req.body;
    
    const userExists = await prisma.user.findUnique({ 
        where: { email: email } });
    if (userExists) {
        return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role || 'USER', // Default to 'USER' if role not provided
        },
    });

    // Generate JWT token
    const token = generateToken(user.id, res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            token,
        },
    })
};


const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ 
        where: { email: email } });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user.id, res);

    res.status(200).json({
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        },
        token
    });
}


const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Set cookie to expire right away
    });
    res.status(200).json({ 
        status: "success",
        message: "Logged out successfully" 
    });
};


export { register, login, logout };