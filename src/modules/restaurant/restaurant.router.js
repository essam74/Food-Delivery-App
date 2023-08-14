import { Router } from "express";
import * as restaurantController from './controller/restaurant.js'
import {fileUpload, fileValidation} from '../../utils/multer.js'
import {validation} from "../../middleware/validation.js";
import * as  validators from "./restaurant.validation.js";
import reviewRouter from '../reviews/reviews.router.js'
import { auth } from "../../middleware/auth.js";

  


const router = Router({mergeParams:true})
router.use("/:restaurantId/review", reviewRouter);


router.get('/', restaurantController.restaurantList)

 
router.post('/', auth,
fileUpload(fileValidation.image).single('image'),
validation(validators.createRestaurant),
restaurantController.createRestaurant)

router.put('/:restaurantId', 
fileUpload(fileValidation.image).single('image'),
validation(validators.updateRestaurant),
restaurantController.updateRestaurant)


export default router