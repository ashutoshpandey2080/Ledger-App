import express from "express";
import {
    getUserCustomers,
    addCustomer,
} from "../Controllers/userController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router
    .route("/customers")
    .get(protect, getUserCustomers)
    .post(protect, addCustomer);

export default router;
