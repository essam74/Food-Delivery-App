import joi from 'joi' 
import { generalFields } from '../../middleware/validation.js'


export const createVoucher = joi.object({
    name: joi.string().min(2).max(40).required(),
    amount: joi.number().positive().min(1).max(100).required(),
    expire: joi.date().greater(Date.now()).required(),
    file: generalFields.file
}).required()



export const updateVoucher = joi.object({
    voucherId: generalFields.id,
    name: joi.string().min(2).max(40),
    amount: joi.number().positive().min(1).max(100),
    file: generalFields.file
}).required()