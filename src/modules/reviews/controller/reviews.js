import reviewModel from "../../../../DB/model/Review.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

//  create review

export const createReview = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  const { comment, rating } = req.body;

  const order = await orderModel.findOne({
    createdBy: req.user._id,
    "restaurant.restaurantId": restaurantId,
    status: "delivered",
  });

  if (!order) {
    return next(
      new Error("cannot review restaurant before order from it", { cause: 400 })
    );
  }
  await reviewModel.create({
    orderId: order._id,
    restaurantId,
    createdBy: req.user._id,
    comment,
    rating,
  }); 
  return res.status(201).json({ message: "Done" });
}); 

//  update review

export const updateReview = asyncHandler(async (req, res, next) => {
  const { productId, reviewId } = req.params;
  await reviewModel.updateOne(
    { _id: reviewId, productId, createdBy: req.user._id },
    req.body
  );
  return res.status(200).json({ message: "Done" });
});
