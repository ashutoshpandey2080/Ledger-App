import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./Routes/userRoutes.js"
import transactionRoutes from "./Routes/transactionRoutes.js";
import authRoute from "./Routes/authRoute.js"
// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb://localhost:27017/accountsBookkeeping",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};

// Connect to the database
connectDB();

// Example Route
app.get("/", (req, res) => {
    res.send("Welcome to the Accounts Bookkeeping API!");
});

// Routes
app.use('/api/auth', authRoute);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
