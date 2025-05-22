import User from "../models/user.model.js"

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
        //     res.status(401).json({
        //     success: false,
        //     message: "no user to logout"
        // })
    } catch (error) {
        console.log("error while logout ::", error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}

export {
    signup,
    login,
    logout
}