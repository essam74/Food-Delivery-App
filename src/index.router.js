import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import categoryRouter from './modules/category/category.router.js'
import voucherRouter from './modules/voucher/voucher.router.js'
import orderRouter from './modules/order/order.router.js'
import reviewsRouter from './modules/reviews/reviews.router.js'
import itemRouter from './modules/item/item.router.js'
import cartRouter from './modules/cart/cart.router.js'
import restaurantRouter from './modules/restaurant/restaurant.router.js'
import userRouter from './modules/user/user.router.js'
import { globalErrorHandling } from './utils/errorHandling.js'



const initApp = (app, express) => {
    //convert Buffer Data
    app.use(express.json({})) 
    //Setup API Routing 
    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use(`/category`, categoryRouter)
    app.use(`/restaurant`, restaurantRouter)
    app.use(`/item`, itemRouter)
    app.use(`/cart`, cartRouter)
    app.use(`/reviews`, reviewsRouter)
    app.use(`/voucher`, voucherRouter)
    app.use(`/order`, orderRouter)

    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })

    app.use(globalErrorHandling)
    connectDB()

}



export default initApp