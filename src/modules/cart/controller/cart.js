import { asyncHandler } from "../../../utils/errorHandling.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import itemModel from "../../../../DB/model/item.model.js";




// view cart

export const cart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.find({});
  return res.status(200).json({ message: "Done", cart });
});

// add to cart

export const addToCart = asyncHandler(async (req, res, next) => {
  //prepare product
  const { itemId, quantity } = req.body;
  const item = await itemModel.findById(itemId);
  if (!item) {
    return next(new Error("in-valid item id", { cause: 400 }));
  }

  // check cart exist
  const cart = await cartModel.findOne({ createdBy: req.user._id });
  if (!cart) {
    // create cart first time
    const newCart = await cartModel.create({
      createdBy: req.user._id,
      items: [{ itemId, quantity }],
    });
    return res.status(201).json({ message: "cart created", cart: newCart });
  }

  // update cart

  let matchItem = false;

  for (const item of cart.items) {
    if (item.itemId.toString() == itemId) {
      item.quantity = quantity;
      matchItem = true;
      break;
    }
  }

  //  push to cart
  if (!matchItem) {
    cart.items.push({ itemId, quantity });
  }
  await cart.save();
  return res.status(200).json({ message: "Done", cart });
});

// delete From Cart

export async function deleteElementFromCart(itemIds, createdBy) {
  const cart = await cartModel.updateOne(
    { createdBy },
    { $pull: { items: { itemId: { $in: itemIds } } } }
  );
  return cart;
}

export const deleteFromCart = asyncHandler(async (req, res, next) => {
  const cart = await deleteElementFromCart(req.user._id, req.user._id);
  return res.status(200).json({ message: "done", cart });
});

export async function clearAllCart(createdBy) {
  const cart = await cartModel.updateOne({ createdBy }, { items: [] });
  return cart;
}

export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await clearAllCart(req.user._id);
  return res.status(200).json({ message: "done", cart });
});
