import restaurantModel from "../../../../DB/model/restaurant.model.js";
import cloudinary from '../../../utils/cloudinary.js'
import slugify from 'slugify'
import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import {nanoid} from 'nanoid'
 

                      // get restaurant

export const restaurantList = asyncHandler(async (req, res , next)=>{
    const restaurant = await restaurantModel.find({isDeleted: false}).populate([{ path: 'categoryId'}])
    return res.status(200).json({message: "Done" , restaurant})
}) 
 

                    // create restaurant

export const createRestaurant = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    if (!(await categoryModel.findById(categoryId))) {
    return next(new Error("In-valid category Id", { cause: 400 }));
    }

    const { name , info} = req.body;
    if (await restaurantModel.findOne({ name: name.toLowerCase() })) {
    return next(new Error("Duplicated Restaurant name", { cause: 409 }));
    }
    const customId = nanoid();
    const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/restaurant/${categoryId}` }
    );

    const restaurant = await restaurantModel.create({
    name,
    info,
    slug: slugify(name, {
        replacement: "_",
        trim: true,
        lower: true,
    }),
    image: { secure_url, public_id },
    customId, 
    categoryId,
    createdBy: req.user._id
    });

    if (!restaurant) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("fail to create your Restaurant", { cause: 400 }));
    }

    return res.status(201).json({ message: "Done", restaurant });
});


                     // update restaurant

export const updateRestaurant = asyncHandler(async (req, res , next)=>{

    const {categoryId , restaurantId} = req.params
    const restaurant = await restaurantModel.findOne({_id:restaurantId , categoryId})
    if(!restaurant){
        return next(new Error("In-valid restaurant Id" , {cause:400}))
    }

    if(req.body.name){
        restaurant.name = req.body.name
        restaurant.slug = slugify(req.body.name , "_")
    }

    if(req.file){
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, 
            {folder: `${process.env.APP_NAME}/Category/${categoryId}`})
        await cloudinary.uploader.destroy(restaurant.image.public_id)
        restaurant.image = {secure_url , public_id}
    }
    await restaurant.save()
    return res.status(200).json({message: "Done" , restaurant})
})