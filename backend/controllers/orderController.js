const Order = require('../models/orderModel');
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const Product = require("../models/productModel");

// initializing razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Creating Razorpay order
exports.createRazorpayOrder = async(req, res) => {

  const { totalAmount, orderId } = req.body;

  // setting up options for razorpay order.
  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: orderId.toString(),  //generatig unique id for each order
    payment_capture: 1
  };

  try {
    const response = await razorpay.orders.create(options);

    res.json({
      success:true,
      razorpay_order_id: response.id,
      currency: response.currency,
      amount: response.amount,
      orderId
    });

  } catch (err) {
    res.status(400).json({
      success:false,
      message:'Not able to create razorpay order. Please try again!'
    });
  }

}

exports.razorpayPaymentCapture = async(req,res) =>{

  try {
    
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

    const {orderId} = req.params;

    // Fetch order details from the database
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

      //Verify payment signature
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      let generatedSignature = hmac.digest('hex');
      let isSignatureValid = generatedSignature == razorpay_signature;


   if (!isSignatureValid) {
     return res.status(400).json({ error: 'Invalid payment signature' });
   }

   // Verify payment with Razorpay
   const payment = await razorpay.payments.fetch(razorpay_payment_id);

   if (payment.status !== 'captured') {
     return res.status(400).json({ error: 'Payment not captured' });
   }

    order.paymentStatus = 'paid';
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`)


  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }


}
// Create a new order
exports.createOrder = async (req, res) => {

  try {

    const { cartItems, totalAmount, shipping } = req.body;

    const customer = req.user;

    const newOrder = await Order.create({ customer, cartItems, totalAmount, shipping });

    for (const { product, quantity } of cartItems) {

      const productInfo = await Product.findById(product);

      // Check if the product exists and has enough stock
      if (!productInfo || productInfo.stock < quantity) {
          return res.status(400).json({ success: false, message: 'Invalid product or insufficient stock' });
      }

      // Reduce the stock of the product by the order quantity
      productInfo.stock -= quantity;

      await productInfo.save();
      
    }

    res.status(201).json({ success: true, order: newOrder });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }

};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer')
    .sort({ createdAt: -1 })
    .populate('cartItems.product');
    if(!orders){
      return res.status(404).json({
        success: false, 
        message:"Orders not found!"
      })
    }
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get order details by Order ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer').populate('cartItems.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders of a user by user ID
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({customer:userId}).populate('customer').populate('cartItems.product');
    if (!orders) {
      return res.status(404).json({ success: false, message: 'Orders not found' });
    }
    res.status(200).json({ 
      success: true, 
      orders:orders
     });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get the orders of the seller's products
exports.getUserProductsOrders = async(req,res)=>{
  try {
    // Find all orders where at least one cartItem's product is created by the logged-in user
    const orders = await Order.find({
      'cartItems.product': { $in: await Product.find({ user: req.user }).distinct('_id') }
    })
    .sort({ createdAt: -1 })
    .populate('cartItems.product');

    if(!orders){
     return res.status(404).json({
        success:false,
        message: 'Orders not found' });
    }

    res.status(200).json({
      success:true,
      orders
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

exports.updateOrderStatus = async(req,res)=>{
  
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success:false, message: 'Order not found' });
    }

    // Update the order status
    order.orderStatus = status;
    await order.save();

    res.json({success:true,  message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false,  message: 'Server Error' });
  }

}