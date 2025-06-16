import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 2 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests. Please try again later.",
                });
            }
            
            if (decision.reason.isBot()) {
                return res.status(403).json({
                    success: false,
                    message: "Bot traffic detected"
                });
            }
            
            if (decision.reason.isShield()) {
                return res.status(403).json({
                    success: false,
                    message: "Request blocked by security shield"
                });
            }
            
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        
        next();
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        // // On error, allow the request to continue but log it
        // next();
    }
};

export default arcjetMiddleware;