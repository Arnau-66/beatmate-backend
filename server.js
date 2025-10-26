import express from "express";

const app = express();
app.use(express.json());
app.get("/ping", (req, res) => {
    res.json({ message: "pong"});
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
});