import express from "express"
import verifyJWT from "../middleware/auth.middleware.js";
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendRequests, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";
const router = express.Router();

router.use(verifyJWT);

router.get('/', getRecommendedUsers);

router.get('/friends', getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);

router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-request", getFriendRequests);

router.get("/outgoing-friend-request", getOutgoingFriendRequests);

export default router;