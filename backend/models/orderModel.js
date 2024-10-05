const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  }
});

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cartItems: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shipping: shippingSchema,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
