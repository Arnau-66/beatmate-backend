import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { Festival } from "../src/models/festival.model.js";

dotenv.config();

// --- Rutas absolutas seguras ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, "../festival.json");

// --- Util: convierte {lng,lat} -> GeoJSON ---
function toGeoJSON(f) {
  const c = f?.location?.coords;
  if (!c || typeof c.lng !== "number" || typeof c.lat !== "number") {
    throw new Error(`Festival "${f?.name ?? "(sin nombre)"}" sin coords válidas (lng/lat requeridos)`);
  }
  return {
    ...f,
    location: {
      ...f.location,
      coords: { type: "Point", coordinates: [c.lng, c.lat] } // [lng, lat]
    }
  };
}

async function run() {
  console.log("Leyendo de:", dataPath);
  const raw = await fs.readFile(dataPath, "utf-8");
  const rawTrim = raw.trim();

  let parsed;
  try {
    parsed = JSON.parse(rawTrim);
  } catch (e) {
    console.error("Primeros 120 chars del archivo para depurar:");
    console.error(rawTrim.slice(0, 120));
    throw new Error("festival.json no es un JSON válido: " + e.message);
  }

  // Acepta: array puro, { festivals: [...] }, o un único objeto
  let list = null;
  if (Array.isArray(parsed)) {
    list = parsed;
  } else if (parsed && Array.isArray(parsed.festivals)) {
    list = parsed.festivals;
  } else if (parsed && typeof parsed === "object") {
    // Si te has quedado con un único objeto por error, lo metemos en array
    list = [parsed];
  }

  if (!list) {
    throw new Error("festival.json debe ser un array de festivales o un objeto { festivals: [...] }");
  }

  // Transformar coords
  const docs = list.map(toGeoJSON);

  await mongoose.connect(process.env.MONGO_URL);
  console.log("Mongo connected");

  // Modo replace: borra y mete lo del archivo
  await Festival.deleteMany({});
  const inserted = await Festival.insertMany(docs);
  console.log(`Inserted: ${inserted.length}`);

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error("Seed error:", err.message || err);
  process.exit(1);
});
