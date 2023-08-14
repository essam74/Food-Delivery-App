import mongoose from "mongoose"
import { model, Schema, Types } from "mongoose"



const itemSchema = new Schema({
    customId: String,
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    description: { type: String },
    price: { type: [Number], required: true, default: 1 },
    discount: { type: Number, default: 1 },
    finalPrice: { type: Number, required: true, default: 1 },
    size: {
        type: [String],
        enum: ['s', 'm', 'lg', 'xl', 'xxl']
    },
    image: { type: Object, required: true },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    restaurantId: { type: Types.ObjectId, ref: 'Restaurant', required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    wishUser: [{ type: Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true,
    toJSON: { virtual: true },
    toObject: { virtual: true }
})

itemSchema.virtual('review', {
    ref: "Review",
    localField: "_id",
    foreignField: "itemId"
})

const itemModel = mongoose.models.item || model('item', itemSchema)
export default itemModel