import slugify from "slugify";
import restaurantModel from "../../../../DB/model/Restaurant.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import itemModel from "../../../../DB/model/item.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
import userModel from "../../../../DB/model/User.model.js";

// show item

export const items = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    itemModel.find().populate([{ path: "review" }]),
    req.query
  )
    .paginate()
    .filter()
    .sort()
    .search()
    .select();
  const itemList = await apiFeatures.mongooseQuery;

  // to show review
  for (let i = 0; i < itemList.length; i++) {
    let calcRating = 0;
    for (let x = 0; x < itemList[i].review.length; x++) {
      calcRating += itemList[i].review[x].rating;
    }
    const convObject = itemList[i].toObject();
    convObject.rating = calcRating / itemList[i].review.length;
    itemList[i] = convObject;
  }

  return res.status(200).json({ message: "done", itemList });
}); 

// create item

export const createItem = asyncHandler(async (req, res, next) => {
  const { name, categoryId, restaurantId, description, price, discount, size } = req.body;

  if (!(await restaurantModel.findOne({ _id: restaurantId, categoryId }))) {
    return next(new Error("In-valid restaurant id", { cause: 400 }));
  }
 
 
  req.body.slug = slugify(name, {
    replacement: "_",
    trim: true,
    lower: true,
  });

  req.body.finalPrice = Number.parseFloat(
    price - price * ((discount || 0) / 100)
  ).toFixed(2);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
  req.file.path,
  { folder: `${process.env.APP_NAME}/restaurant/${categoryId}` }
  );
  req.body.image = { secure_url, public_id }

  req.body.createdBy = req.user._id;

  const item = await itemModel.create(req.body);

  return res.status(201).json({ success: true, item });
});

// update item

export const updateItem = asyncHandler(async (req, res, next) => {
  const { name, categoryId, restaurantId, description,size, price, discount } =
    req.body;
  const { itemId } = req.params;
  const item = await itemModel.findById(itemId);

  if (!item) {
    return next(new Error("item not found", { cause: 400 }));
  }

  if (categoryId && restaurantId) {
    if (!(await restaurantModel.findOne({ _id: restaurantId, categoryId }))) {
      return next(new Error("restaurant not found", { cause: 400 }));
    }
  }

  
  if (name) {
    req.body.slug = slugify(name, {
      lower: true,
    });
  }

  if (price && discount) {
    req.body.finalPrice = Number.parseFloat(
      price - price * (discount / 100)
    ).toFixed(2);
  } else if (price) {
    req.body.finalPrice = Number.parseFloat(
      price - price * ((item.discount || 0) / 100)
    ).toFixed(2);
  } else if (discount) {
    req.body.finalPrice = Number.parseFloat(
      item.price - item.price * (discount / 100)
    ).toFixed(2);
  }

 const { secure_url, public_id } = await cloudinary.uploader.upload(
  req.file.path,
  { folder: `${process.env.APP_NAME}/restaurant/${categoryId}` }
  );
  req.body.image = { secure_url, public_id }
  

  req.body.updatedBy = req.user._id;
  await itemModel.updateOne({ _id: itemId }, req.body);
  return res.status(200).json({ success: true, item });
});
 
// add to wishlist
export const wishlist = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  if (!(await itemModel.findOne({ _id: itemId, isDeleted: false }))) {
    return next(new Error("item not found", { cause: 404 }));
  }
  await userModel.updateOne(
    { _id: req.user._id },
    { $addToSet: { wishlist: itemId } }
  );
  return res.status(200).json({ message: "Done" });
});

// delete from wishlist
export const deleteFromWishlist = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  await userModel.updateOne(
    { _id: req.user._id },
    { $pull: { wishlist: itemId } }
  );
  return res.status(200).json({ message: "Done" });
});
