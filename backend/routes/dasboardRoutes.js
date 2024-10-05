const express = require("express");
const { verifyToken } = require("../middleWares/auth");
const { authorizeRole } = require("../middleWares/authorize");
const { getDashboardData, getDashboardDataSeller } = require("../controllers/dashboardController");
const router = express.Router();

router.route('/total-count').get(verifyToken, authorizeRole(["admin"]), getDashboardData);
router.route('/seller-count').get(verifyToken, authorizeRole(["seller"]), getDashboardDataSeller);

module.exports = router;