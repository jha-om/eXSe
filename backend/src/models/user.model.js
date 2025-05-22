import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    // token: {
    //     type: String,
    // },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true
});


// preHook;
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = bcrypt.hashSync(this.password, 10);
        next();
    } catch (error) {
        console.error("Error hashing password:", error);
        next(error);
    }
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
    },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    ) 
}

const User = mongoose.model("User", userSchema);
export default User;