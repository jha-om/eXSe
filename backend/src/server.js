import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import { connectDB } from "./db/index.js";
import cookieParser from "cookie-parser"
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/usres", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`); 
    connectDB();
})