import express from "express";
import {
    addTransaction,
    updateTransactionStatus,
} from "../Controllers/transactionController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addTransaction);
router.route("/:id").patch(protect, updateTransactionStatus);

export default router;
