import mongoose from "mongoose"
import  { model , Schema , Types } from "mongoose"



const restaurantSchema = new Schema({
    customId: String, 
    name: {type:String , required: true},
    slug: {type:String , required: true},
    image: {type:Object , required: true}, 
    info: {type:String , required: true},
    scannedMenu: {type:[Object], required:false},
    categoryId: {type:Types.ObjectId , ref:'Category' , required: true},
    avgRate: {type:Types.ObjectId , ref:'Review' , required: false},
    menu: {type:Types.ObjectId , ref:'Item' , required: false},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    isDeleted: {type:Boolean , default: false},
    
}, {
    toJSON:{virtual: true},
    toObject:{virtual: true},
    timestamps:true
})

 restaurantSchema.virtual('review', {
    ref: "Review",
    localField: "_id",
    foreignField: "restaurantId"
})

const restaurantModel = mongoose.models.restaurant || model('restaurant' , restaurantSchema)
export default restaurantModel