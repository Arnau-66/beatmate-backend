import express from "express";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

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
app.listen(PORT, () => {
    console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
});