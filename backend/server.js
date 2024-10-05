const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const databaseConnection = require("./config/databaseConnection")
const path = require('path');

dotenv.config({path:"./config/config.env"});
app.use(cors({
    origin:process.env.FRONTEND_APP_URL,
    credentials:true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/public",express.static("public"))
databaseConnection();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dasboardRoutes");

// app.get('/check-tmp-path', (req, res) => {
//     const tmpPath = path.join('/tmp');
//     console.log("Temporary file path:", tmpPath);
//     res.send(`Temporary file path: ${tmpPath}`);
//   });

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/order',orderRoutes);
app.use('/api/v1/dashboard',dashboardRoutes);


app.use((err,req,res,next)=>{
    return res.status(500).json({
        success:false,
        message:err.message
    })
});


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port 4000`);
});