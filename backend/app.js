const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors")

if(process.env.NODE_ENV!=="production"){
    require("dotenv").config({
        "path": "backend/config/config.env"
    })
}
/*using middlewares */
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
/*Routes*/

const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user")

app.use("/api/v1",postRoutes);
app.use("/api/v1",userRoutes);

module.exports = app;