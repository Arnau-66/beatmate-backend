import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:4200",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "BeatMate API is running",
        endpoints: {
            ping: "GET /ping",
            login: "POST /api/auth/login",
            register: "POST /api/auth/register"
        }
    })
});

app.get("/ping", (req, res) => {
    res.json({ message: "pong"});
});

app.use("/api/auth", authRoutes);

const PORT = 3000;

async function startServer() {
    await connectDB(process.env.MONGO_URL);

    app.listen(PORT, () => {
        console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
    });
}

startServer();
