import itemModel from "../../../../DB/model/item.model.js";
import voucherModel from "../../../../DB/model/voucher.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import {
  clearAllCart,
  deleteElementFromCart,
} from "../../cart/controller/cart.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

// create order
export const createOrder = async (req, res, next) => {
  const { items, note, paymentType, voucherName } = req.body;

  if (!req.body.items) {
    const cart = await cartModel.findOne({ createdBy: req.user._id });
    if (!cart.items?.length) {
      return next(new Error(`empty cart`, { cause: 404 }));
    }
    req.body.isCart = true;
    req.body.items = cart.items;
  } 

  if (voucherName) {
    const voucher = await voucherModel.findOne({
      name: voucherName.toLowerCase(),
      usedBy: { $nin: req.user._id },
      isDeleted: false,
    });
    if (
      !voucher ||
      parseInt(Date.now() / 1000) > parseInt(voucher?.expire?.getTime() / 1000)
    ) {
      return next(new Error("voucher not found or expired", { cause: 400 }));
    }
    req.body.voucher = voucher;
  }

  let subtotal = 0;
  let finalItemList = [];
  let itemIds = [];

  for (let item of req.body.items) {
    const checkItem = await itemModel.findOne({
      _id: item.itemId,
      isDeleted: false,
    });
    if (!checkItem) {
      return next(new Error(`fail to add this item ${item.name}`));
    }

    itemIds.push(item.itemId);
    item = req.body.isCart ? item.toObject() : item;
    item.name = checkItem.name;
    item.unitPrice = checkItem.finalPrice;
    item.finalPrice = checkItem.unitPrice * item.quantity;
    finalItemList.push(item);

    subtotal += item.finalPrice;
  }
  const order = await orderModel.create({
    createdBy: req.user._id,
    item: finalItemList,
    voucherId: req.body.voucher?._id,
    finalPrice: subtotal - subtotal * ((req.body.voucher?.amount || 0) / 100),
    address: req.user.address,
    phone: req.user.address,
    note,
    paymentType,
    status: paymentType == "card" ? "wait to place order" : "placed",
  });


  //to make voucher used
  if (req.body.voucher?._id) {
    await voucherModel.updateOne(
      { _id: req.body.voucher?._id },
      { $addToSet: { usedBy: req.user._id } }
    );
  }

  // to delete item from cart after made order
  if (!req.body.isCart) {
    await deleteElementFromCart(itemIds, req.user._id);
  } else {
    await clearAllCart(req.user._id);
  }
  return res.status(201).json({ message: "item added", order });
};

// cancel order
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await orderModel.findOne({
    _id: orderId,
    createdBy: req.user._id,
  });
  if (!order) {
    return next(new Error("Order not found", { cause: 400 }));
  }
  if (
    (order.status != "placed" && order.paymentType == "cash") ||
    (order.status != "waitPayment" && order.paymentType == "card")
  ) {
    return next(
      new Error(
        `cannot cancel your order after it been changed to ${order.status}`,
        { cause: 400 }
      )
    );
  }
  await orderModel.updateOne(
    { _id: orderId, createdBy: req.user._id },
    { status: "canceled", updatedBy: req.user._id, reason }
  );

  //to restore item to stock again
  for (const item of order.item) {
    await itemModel.updateOne(
      { _id: item.itemId },
      { $inc: { stock: parseInt(item.quantity) } }
    );
  }

  //to make voucher unused again
  if (order.voucherId) {
    await voucherModel.updateOne(
      { _id: order.voucherId },
      { $pull: { usedBy: req.user._id } }
    );
  }

  return res.status(201).json({ message: "done", order });
});

// the delivered orders to access review and rating
export const deliveredOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await orderModel.findOne({ _id: orderId });
  if (!order) {
    return next(new Error("in-valid id", { cause: 400 }));
  }
  if (
    ["waitPayment", "canceled", "rejected", "delivered"].includes(order.status)
  ) {
    return next(
      new Error(
        `cannot update your order after it been changed to ${order.status}`,
        { cause: 400 }
      )
    );
  }
  await orderModel.updateOne(
    { _id: orderId },
    { status: "delivered", updatedBy: req.user._id }
  );

  return res.status(201).json({ message: "done", order });
});
