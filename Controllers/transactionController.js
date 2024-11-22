import transaction from "../Models/transaction.js";
import userModel from "../Models/userModel.js";
import customerModel from "../Models/customerModel.js";
import { sendMessage } from "../utilis/messageService.js";

// @desc Add a new transaction
// @route POST /api/transactions
// @access Private
export const addTransaction = async (req, res) => {
    const { amount, type, customerId } = req.body;

    try {
        const transaction = await transaction.create({
            amount,
            type,
            status: "pending",
            user: req.user.id,
            customer: customerId,
            initiatedBy: "user",
        });

        // Notify the customer
        const customer = await customerModel.findById(customerId);
        if (customer) {
            sendMessage(
                customer.email,
                "New Transaction Request",
                `A new transaction of ${type} with amount ${amount} is pending your approval.`
            );
        }

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Handle transaction approval/rejection
// @route PATCH /api/transactions/:id
// @access Private
export const updateTransactionStatus = async (req, res) => {
    const { status } = req.body; // accepted or failed

    try {
        const transaction = await transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        transaction.status = status;

        if (status === "accepted") {
            // Update the user's or customer's balance
            const user = await userModel.findById(transaction.user);
            const customer = await customerModel.findById(transaction.customer);

            if (transaction.type === "credit") {
                user.balance = (user.balance || 0) + transaction.amount;
            } else {
                user.balance = (user.balance || 0) - transaction.amount;
            }

            await user.save();
            await customer.save();
        }

        await transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
