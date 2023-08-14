import mongoose from "mongoose"
import  { model , Schema , Types } from "mongoose"



const reviewSchema = new Schema({
    comment: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    restaurantId: { type: Types.ObjectId, ref: 'Restaurant', required: true },
    orderId: { type: Types.ObjectId, ref: 'Order', required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }
    
}, {
    timestamps:true
})

const reviewModel = mongoose.models.review || model('review' , reviewSchema)
export default reviewModel