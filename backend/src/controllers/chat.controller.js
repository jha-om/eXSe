import { generateStreamToken } from "../utils/stream.js";

export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user._id);
        res.status(200).json({
            token
        })
    } catch (error) {
        console.log("error in getStreamToken controller: ", error.message);
        res.status(500).json({
            message: "internal server error"
        })
    }
}