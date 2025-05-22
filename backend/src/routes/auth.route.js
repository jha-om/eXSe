import express from "express"
import { login, logout, signup } from "../controllers/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", verifyJWT, logout)

export default router;