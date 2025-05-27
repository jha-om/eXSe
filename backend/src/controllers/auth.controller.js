import { upsertStreamUser } from "../utils/stream.js";

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const token = user.generateToken();

        // user.token = token;
        // await user.save({ validateBeforeSave: false });

        return { token };
    } catch (error) {
        throw new Error("error while creating the token, please try again later!!!", error);
    }
}
async function signup(req, res) {
    const { email, password, fullName } = req.body;
    try {
        if ([email, password, fullName].some(field => field?.trim() === "")) {
            return res.status(400).json({ message: "all fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "email already exists, use a different one" });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            })
        } catch (error) {
            console.log("error creating stream user: ", error);
        }

        const createdUser = await User.findById(newUser._id).select("-password");
        if (!createdUser) {
            return res.status(500).json({
                message: "internal server error while creating this user"
            })
        }
        res.status(201).json({
            success: true,
            createdUser,
            message: "user created successfully",
        });
    } catch (error) {
        console.log("error in signup controller", error);
        res.status(500).json({ message: "internal server error" });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if ([email, password].some(field => field.trim() === "")) {
            return res.status(400).json({ message: "all fields are required to login" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "invalid email or password" });
        }
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "invalid email or password" });
        }

        const { token } = await generateToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -token");

        const options = {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevents XSS attacks,
            sameSite: "strict",  // prevents CSRF requests
            secure: process.env.NODE_ENV === "production",
        }

        res.status(200).cookie("token", token, options).json({
            success: true,
            message: "user logged in successfully",
            user: loggedInUser,
            token,
        })
    } catch (error) {
        console.log("error while login ::", error);
        res.status(500).json({
            message: "internal server error"
        })
    }
}

async function logout(req, res) {
    try {
        const options = {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        };
        return res.status(200).clearCookie("token", options).json({
            success: true,
            message: "user logged out successfully"
        })
    } catch (error) {
        console.log("error while logout ::", error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}

async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const { fullName, bio, location } = req.body;
        if (!fullName || !bio || !location) {
            return res.status(400).json({
                message: "all fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !location && "location"
                ].filter(Boolean)
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, {
            new: true
        }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            })
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                fullName: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            })
        } catch (error) {
            console.log("error while updating stream user during onboarding: ", error.message);
        }
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "User updated successfully"
        })
    } catch (error) {
        console.log("onboarding error", error);
        return res.status(500).json({
            messag: "internal server error"
        })
    }
}

async function me(req, res) {
    const user = req.user;
    return res.status(200).json({
        user
    })
}

export {
    signup,
    login,
    logout,
    onboard,
    me
}