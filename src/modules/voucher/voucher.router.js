import { Router } from "express";
import {fileUpload, fileValidation} from '../../utils/multer.js'
import {validation} from "../../middleware/validation.js";
import * as  validators from "./voucher.validation.js";
import * as voucherController from './controller/voucher.js'



const router = Router()

router.get('/', voucherController.voucherList)


router.post('/', 
fileUpload(fileValidation.image).single('image'),
validation(validators.createVoucher),
voucherController.createVoucher)

router.put('/:voucherId', 
fileUpload(fileValidation.image).single('image'),
validation(validators.updateVoucher),
voucherController.updateVoucher)


export default router