const express = require("express");
const router = express.Router();
const { addProduct, updateProduct, getAllProducts, getProductDetails, deleteProduct, getLatestProducts, getUserProducts, productReview, productReviewUpdate, getAllproductsCount } = require("../controllers/productControler");
const upload = require("../middleWares/fileUpload");
const { verifyToken } = require("../middleWares/auth");



router.route('/add').post(verifyToken, upload.single('photo'), addProduct);
router.route('/all').get(getAllProducts);
router.route('/user/all').get(verifyToken, getUserProducts);
router.route('/latest').get(getLatestProducts);
router.route('/:id').put(upload.single('photo'),updateProduct).get(getProductDetails);
router.route('/:id').delete(deleteProduct);
router.route('/:productId/reviews').post(verifyToken, productReview).put(verifyToken, productReviewUpdate);
router.route('/:productId/reviews/:reviewId').put(verifyToken, productReviewUpdate);
module.exports = router;