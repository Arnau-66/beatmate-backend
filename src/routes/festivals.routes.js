import { Router } from "express";
import { listFestivals, createFestival } from "../controllers/festival.controller";

const router = Router();

router.get("/", listFestivals);

// Temporalmente libre para probar. Después:
// router.post("/", verifyJWT, requireRole("admin"), createFestival);
router.post("/", createFestival);

export default router;