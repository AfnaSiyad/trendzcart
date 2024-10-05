const express = require("express");
const { getOrders, createOrder, getOrderById, createRazorpayOrder, razorpayPaymentCapture, getUserOrders, getUserProductsOrders, updateOrderStatus } = require("../controllers/orderController");
const { verifyToken } = require("../middleWares/auth");
const router = express.Router();

router.route('/orders').get(verifyToken, getUserOrders);
router.route('/razorpayorder').post(verifyToken, createRazorpayOrder);
router.route('/paymentCapture/:orderId').post(verifyToken, razorpayPaymentCapture);
router.route('/create').post(verifyToken, createOrder);
router.route('/all').get(verifyToken, getOrders);
router.route('/:id').get(verifyToken, getOrderById);

router.route('/seller/orders').get(verifyToken, getUserProductsOrders);
router.route('/status/:orderId').put(verifyToken, updateOrderStatus);

module.exports = router;