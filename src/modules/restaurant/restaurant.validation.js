import joi from 'joi' 
import { generalFields } from '../../middleware/validation.js'


export const createRestaurant = joi.object({
    categoryId: generalFields.id,
    name: joi.string().min(2).max(40).required(),
    info: joi.string().min(10).max(1000).required(),
    file: generalFields.file

}).required()


  
export const updateRestaurant = joi.object({
    categoryId: generalFields.id,
    restaurantId: generalFields.id,
    name: joi.string().min(2).max(40),
    file: generalFields.file
}).required()