const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

exports.getDashboardData = async(req,res)=>{
    
    try {

    const productsCount = await Product.find().count();
    const ordersCount = await Order.find().count();
    const sellersCount = await User.find({role:'seller'}).count();

    res.status(200).json({
        success:true,
        data:{
            productsCount,
            ordersCount,
            sellersCount
        }
    })

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
    

}

exports.getDashboardDataSeller = async(req,res)=>{
    
    try {

    const productsCount = (await Product.find({user:req.user})).length;

    const ordersCount = await Order.find({
        'cartItems.product': { $in: await Product.find({ user: req.user }).distinct('_id') }
      })
      .count();
    const deliveredCount = await Order.find({
        'cartItems.product': { $in: await Product.find({ user: req.user }).distinct('_id') },
        orderStatus: 'delivered'
      }).populate('cartItems.product').exec();


    res.status(200).json({
        success:true,
        data:{
            productsCount,
            ordersCount,
            deliveredCount:deliveredCount.length
        }
    })

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
    

}