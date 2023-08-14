import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createItem = joi
  .object({
    name: joi.string().min(2).max(50).required(),
    description: joi.string().min(2).max(15000),
    price: joi.number().positive().min(1).required(),
    discount: joi.number().positive().min(1),
    size: joi.array(),
    file: generalFields.file,
    categoryId: generalFields.id,
    restaurantId: generalFields.id,
  })
  .required();

export const updateItem = joi
  .object({
    itemId: generalFields.id,
    name: joi.string().min(2).max(50),
    description: joi.string().min(2).max(15000),
    price: joi.number().positive().min(1),
    discount: joi.number().positive().min(1),
    size: joi.array(),
    file: generalFields.file,
    categoryId: generalFields.optionalId,
    restaurantId: generalFields.optionalId,
  })
  .required();
