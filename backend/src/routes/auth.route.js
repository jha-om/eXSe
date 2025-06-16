import express from "express"
import { login, logout, me, onboard, signup } from "../controllers/auth.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import arcjetMiddleware from "../middleware/arcjet.middleware.js";
const router = express.Router();

router.get("/me", verifyJWT, me);

router.use(arcjetMiddleware);
router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", verifyJWT, logout)

router.post("/onboarding", verifyJWT, onboard);

export default router;