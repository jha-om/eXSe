import express from "express"
import { login, logout, me, onboard, signup } from "../controllers/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/me", verifyJWT, me);

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", verifyJWT, logout)

router.post("/onboarding", verifyJWT, onboard)
export default router;