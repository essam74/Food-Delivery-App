import { Router } from "express";
import * as categoryController from './controller/category.js'
import {fileUpload, fileValidation} from '../../utils/multer.js'
import {validation} from "../../middleware/validation.js";
import * as  validators from "./category.validation.js";
import restaurantRouter from '../restaurant/restaurant.router.js'
import {auth, authorized} from "../../middleware/auth.js";
import { endpoint } from "./category.endPoint.js";



const router = Router() 

router.use("/:categoryId/restaurant" , restaurantRouter)
 
router.get('/',
auth,
 categoryController.categoryList)


router.post('/', 
auth,
authorized(endpoint.create),
fileUpload(fileValidation.image).single('image'),
validation(validators.createCategory),
categoryController.createCategory)

router.put('/:categoryId', 
auth,
authorized(endpoint.update),
fileUpload(fileValidation.image).single('image'),
validation(validators.updateCategory),
categoryController.updateCategory)


export default router