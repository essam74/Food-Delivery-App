import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    item: [
      {
        name: { type: String, required: true },
        itemId: { type: Types.ObjectId, ref: "Item", required: true },
        quantity: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 1, required: true },
      },
    ],
    address: { type: String, required: false },
    phone: { type: String, required: false },
    note: String,
    subtotal: { type: Number, default: 1, required: true },
    finalPrice: { type: Number, default: 1, required: true },
    voucherId: { type: Types.ObjectId, ref: "Coupon" },
    status: {
      type: String,
      default: "placed",
      enum: ["placed", "rejected", "onWay", "delivered"],
    },
    paymentType: {
      type: String,
      default: "cash",
      enum: ["cash", "card"],
      required: true,
    },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.models.Order || model("Order", orderSchema);
export default orderModel;
