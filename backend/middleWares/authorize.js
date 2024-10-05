const User = require("../models/userModel");

exports.authorizeRole = (roles) => {
    return async (req, res, next) => {
        try {

            const user = await User.findById(req.user);

            if (!roles.includes(user.role)) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized request",
                    isAuthenticated: true,
                });
            }

            next();
        } catch (error) {
            console.error("Authorization Error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                isAuthenticated: false,
            });
        }
    };
};
