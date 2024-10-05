const express = require("express");
const { userRegister, userLogin, userProfileUpdate, getUserDetails, getAllUsers, userProfileUpdateAdmin, validateUser } = require("../controllers/userController");
const { verifyToken } = require("../middleWares/auth");
const router = express.Router();



router.route('/register').post(userRegister);
router.route('/login').post(userLogin);

router.route('/update').put(verifyToken,userProfileUpdate);
router.route('/details').get(verifyToken,getUserDetails);
router.route('/verify').get(verifyToken,validateUser);

// Admin routes
router.route('/all').get(verifyToken,getAllUsers);
router.route('/role/:id').put(verifyToken,userProfileUpdateAdmin);


module.exports = router;