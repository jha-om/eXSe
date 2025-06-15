import FriendRequest from "../models/friend-request.model.js";
import User from "../models/user.model.js"
async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            // except my id, and my already friends, can u show the new and recommended friends to me;
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true },
            ]
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("error in getRecommendedUsers controller", error.message);

        res.status(500).json({ message: "internal server error" });
    }
}

async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user._id).select("friends")
            .populate("friends", "fullName profilePic bio");
        
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("error in getRecommendedUsers controller", error.message);

        res.status(500).json({ message: "internal server error" });
    }
}

async function sendFriendRequest(req, res) {
    try {
        const myId = req.user._id;
        const { id: recipientId } = req.params
        if (myId === recipientId) {
            return res.status(400).json({
                message: "you can't send friend request to yourself"
            });
        }
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                message: "This guy doesn't exists to become my friend"
            })
        }
        if (recipient.friends.include(myId)) {
            return res.status(400).json({
                message: "We're already friends"
            })
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, sender: myId },
            ]
        })

        if (existingRequest) {
            return res.status(400).json({
                message: "A friend request already exists between you and this user"
            })
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("error in sendFriendRequest Controller", error.message);
        res.status(500).json({
            message: "internal server error"
        });
    }
}

async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({
                message: "friend request not found"
            })
        }

        // check karo ki agar current user hi recipient hai ki nhi;
        if (friendRequest.recipient.toString() !== req.user._id) {
            return res.status(403).json({
                message: "you aren't authorized to accept this request"
            })
        }
        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });
    } catch (error) {
        console.error("error acceptFriendRequest Controller", error.message);
        res.status(500).json({
            message: "internal server error"
        });
    }
}

async function getFriendRequests(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender", "fullName, profilePic, bio");

        const acceptedRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted",
        }).populate("recipient", "fullName, profilePic");

        res.status(200).json({
            incomingRequests, 
            acceptedRequests
        })
    } catch (error) {
        console.error("error getFriendRequests Controller", error.message);
        res.status(500).json({
            message: "internal server error"
        });
    }
    
}

async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending",
        }).populate("recipient", "fullName profilePic, bio");

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("error getOutgoingFriendRequests Controller", error.message);
        res.status(500).json({
            message: "internal server error"
        });
    }
}

export {
    getRecommendedUsers,
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getOutgoingFriendRequests,
}