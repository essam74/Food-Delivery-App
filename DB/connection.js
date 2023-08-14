import mongoose from 'mongoose'
const connectDB  = async ()=>{
    mongoose.set("strictQuery", false);

    return await mongoose.connect(process.env.DB)
    .then(res=>console.log(`DB Connected successfully on .........`))
    .catch(err=>console.log(` Fail to connect  DB.........${err} `))
}
 

export default connectDB;