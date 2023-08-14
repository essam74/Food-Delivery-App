import reviewRouter from "../reviews/reviews.router.js";
import * as itemController from "./controller/item.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { auth, authorized } from "../../middleware/auth.js";
import { Router } from "express";
import { endPoint } from "./item.endPoint.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "../item/item.validation.js";
const router = Router();

router.use("/:itemId/review", reviewRouter);

router.get("/", itemController.items)


router.post(
  "/",
  auth,
  authorized(endPoint.createItem),
  fileUpload(fileValidation.image).single('image'),
  validation(validators.createItem),
  itemController.createItem
);

router.put(
  "/:itemId",
  auth,
  authorized(endPoint.updateItem),
  fileUpload(fileValidation.image).single('image'),
  validation(validators),
  itemController.updateItem
);

// wishlist

router.patch(
  "/:itemId/wishlist/add",
  auth,
  authorized(endPoint.wishlist),
  itemController.wishlist
);

router.patch(
  "/:itemId/wishlist/remove",
  auth,
  authorized(endPoint.wishlist),
  itemController.deleteFromWishlist
);

export default router;
