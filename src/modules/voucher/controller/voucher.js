import voucherModel from "../../../../DB/model/voucher.model.js";
import cloudinary from '../../../utils/cloudinary.js'
import slugify from 'slugify'
import { asyncHandler } from "../../../utils/errorHandling.js";


                      // get voucher

export const voucherList = asyncHandler(async (req, res , next)=>{
    const voucher = await voucherModel.find({isDeleted: false}).populate([{ path: ''}])
    return res.status(200).json({message: "Done" , voucher})
}) 


                    // create voucher

export const createVoucher = asyncHandler(async (req, res , next)=>{

    console.log(new Date());

    if(await voucherModel.findOne({name:req.body.name})){
        return next(new Error("Duplicated voucher name", {cause:409}))
    }

    if(req.file){
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/voucher`})
        req.body.image = {secure_url , public_id}
    }
    const voucher = await voucherModel.create(req.body)

    
    return res.status(201).json({message: "Done" , voucher})
})


                     // update voucher

export const updateVoucher = asyncHandler(async (req, res , next)=>{
    const voucher = await voucherModel.findById(req.params.voucherId)
    if(!voucher){
        return next(new Error("In-valid voucher Id" , {cause:400}))
    }

    if(req.body.name){
        if(await voucherModel.findOne({name:req.body.name})){
            return next(new Error("Duplicated voucher name", {cause:409}))
        }
        voucher.name = req.body.name
    }

    if(req.body.amount){

        voucher.amount = req.body.amount
    }

    if(req.file){
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/voucher`})
        
        if(voucher.image?.public_id){
            await cloudinary.uploader.destroy(voucher.image?.public_id)
        }
        voucher.image = {secure_url , public_id}
            
    }
    await voucher.save()
    return res.status(200).json({message: "Done" , voucher})
})