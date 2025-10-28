import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export async function loginController(req, res) {

    try{

        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required",
            });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials",
            });
        }


        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if(!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                sub: user._id.toString(),
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            status: "ok",
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("LoginController error", err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
}

export async function registerController(req, res) {

    try{

        const { username, email, password } = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({
                status: "error",
                message: "Email already registered",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username, 
            email,
            passwordHash,
            role: "user",
        });

        return res.status(201).json({
            status: "ok",
            message: "User created succesfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
                createdAt: newUser.createdAt,
            },
        });
    } catch (err) {
        console.error("registerController error:", err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }    
}
