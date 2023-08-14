import mongoose from "mongoose"
import  { model , Schema , Types } from "mongoose"



const categorySchema = new Schema({
    name: {type:String , required: true},
    slug: {type:String , required: true},
    image: {type:Object , required: true},
    createdBy: {type:Types.ObjectId , ref:'User' },
    updatedBy: {type:Types.ObjectId, ref:'User'},
    isDeleted: {type:Boolean , default: false},
    
}, {
    toJSON:{ virtuals:true},
    toObject:{ virtuals: true},
    timestamps:true
})

categorySchema.virtual('restaurant', {
    localField:"_id",
    foreignField:'categoryId',
    ref:'restaurant'
})
 
const categoryModel = mongoose.models.Category || model('Category' , categorySchema)
export default categoryModel