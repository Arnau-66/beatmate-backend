import { Festival } from "../models/festival.model.js";

export async function listFestivals(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit ?? "10", 10), 1), 50);
        const skip = (page -1) * limit;

        const sortField = (req.query.sort ?? "startAt");
        const order = (req.query.order ?? "asc").toLowerCase() === "desc" ? -1 : 1;
        const sort = { [sortField]: order};

        const [items, total] = await Promise.all([
            Festival.find().sort(sort).skip(skip).limit(limit),
            Festival.countDocuments(),
        ]);

        return res.json({
            items,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error("listfestivals error:", err);
        return res.status(500).json({ status: "error", message: "Internal server error"});
    }
}

export async function createFestival(req, res) {
  try {
    const payload = { ...req.body };

    if (!payload.name || !payload.location || !payload.location.coords) {
      return res.status(400).json({ status: "error", message: "name and location.coords are required" });
    }

    const { coords } = payload.location;
    if (typeof coords.lng !== "number" || typeof coords.lat !== "number") {
      return res.status(400).json({ status: "error", message: "location.coords must have numeric lng & lat" });
    }

    payload.location = {
      ...payload.location,
      coords: {
        type: "Point",
        coordinates: [coords.lng, coords.lat],
      },
    };

    const created = await Festival.create(payload);
    return res.status(201).json({ status: "ok", festival: created });
  } catch (err) {
    console.error("createFestival error:", err?.message || err);

    if (err?.name === "ValidationError") {
      return res.status(400).json({ status: "error", message: err.message });
    }
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}