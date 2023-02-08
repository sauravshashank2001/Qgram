const app = require("./app");
const cloudinary = require("cloudinary");

const mongoose = require("mongoose");
const {connectDatabase} = require("./config/database")
mongoose.set("strictQuery", false);
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`);
})