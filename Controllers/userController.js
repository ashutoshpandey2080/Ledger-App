import userModel from "../Models/userModel.js";
import customerModel from "../Models/customerModel.js";
// @desc Get all customers of a user
// @route GET /api/users/customers
// @access Private
export const getUserCustomers = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).populate("customers");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add a new customer
// @route POST /api/users/customers
// @access Private
export const addCustomer = async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const customer = await customerModel.create({
            name,
            email,
            phone,
            createdBy: req.user.id,
        });

        const user = await userModel.findById(req.user.id);
        user.customers.push(customer._id);
        await user.save();

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
