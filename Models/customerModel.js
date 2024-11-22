import mongoose from "mongoose";
const { Schema } = mongoose;

const CustomerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

export default mongoose.model("Customer", CustomerSchema);
