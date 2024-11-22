import mongoose from "mongoose";
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", TransactionSchema);
