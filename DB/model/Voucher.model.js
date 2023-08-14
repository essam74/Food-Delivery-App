import mongoose from "mongoose"
import  { model , Schema , Types } from "mongoose"



const voucherSchema = new Schema({
    name: {type:String , required: true , unique:true},
    image: {type:Object},
    amount: {type:Number, default:1 , required:true},
    createdBy: {type:Types.ObjectId , ref:'User' , required: false},
    usedBy: [{type:Types.ObjectId , ref:'User'}],
    updatedBy: { type: Types.ObjectId, ref: "User" },
    expire: { type: Date, required: true },
    isDeleted: {type:Boolean , default: false},
    
}, {
    timestamps:true
})

const voucherModel = mongoose.models.voucher || model('voucher' , voucherSchema)
export default voucherModel