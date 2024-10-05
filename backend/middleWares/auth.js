const jwt = require("jsonwebtoken")

exports.verifyToken = (req, res, next) => {  

    const { token } = req?.cookies;    
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorised request",
            isAuthenticate: false,
        })
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
                isAuthenticate: false,
            })
        }
        req.user = decoded.id;
        next();

    });

}