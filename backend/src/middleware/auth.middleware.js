import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req?.cookies?.token || req.header("Authorization")?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is required"
            });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "unauthorized -- invalid token"
            })
        }

        console.log(decodedToken._id);

        const user = await User.findById(decodedToken._id).select("-password -token");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No user is present"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            });
        }

        console.log("Error in auth middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export default verifyJWT