import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },
    billingCycle: {
        type: String,
        enum: ["monthly", "quarterly", "semi-annually", "annually", "one-time"],
        default: "monthly",
    },
});

const CartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [CartItemSchema],
    },
    { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
