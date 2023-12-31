import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createOrder = joi
  .object({
    // address: joi.string().min(10).max(1000).required(),
    // phone: joi
    //   .array()
    //   .items(
    //     joi
    //       .string()
    //       .pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))
    //       .required()
    //   ) 
    //   .min(1)
    //   .max(3)
    //   .required(),
    note: joi.string().min(5).max(5000),
    paymentType: joi.string().valid("cash", "card"),
    voucherName: joi.string().min(2).max(50),
    items: joi.array().items(
      joi
        .object({
          itemId: generalFields.id,
          quantity: joi.number().positive().integer().min(1).required(),
        })
        .required()
    ),
  })
  .required();

export const cancelOrder = joi.object({
  orderId: generalFields.id,
  reason: joi.string().min(3).max(5000).required(),
});

export const deliveredOrder = joi.object({
  orderId: generalFields.id,
});
