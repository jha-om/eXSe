import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./db/index.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`); 
    connectDB();
})