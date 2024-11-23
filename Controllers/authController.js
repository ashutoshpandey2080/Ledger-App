import userModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        console.log("Registration request ", req.body);
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            console.log("In reg");
            return res.status(400).json({ message: "User already exists" });
            console.log("User exists");
        }

        const user = await userModel.create({ name, email, phone, password });

        if (user) {
            res.status(201).json({
                message: "Registration successful",
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
            console.log("REgistration Success");
        } else {
            res.status(400).json({ message: "Invalid user data" });
            console.log("Registration Failed");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc Authenticate user and get token
// @route POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
            console.log("Login Success")
        } else {
            res.status(401).json({ message: "Invalid email or password" });
            console.log("Login failed");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
export const getProfile = async (req, res) => {
    const user = await userModel.findById(req.user.id).select("-password");

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};
