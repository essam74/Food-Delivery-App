import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    items: [
      {
        itemId: { type: Types.ObjectId, ref: "Item", required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.models.Cart || model("Cart", cartSchema);
export default cartModel;
