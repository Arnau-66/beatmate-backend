import mongoose from "mongoose";

export async function connectDB(mongoUrl) {
    try {
        await mongoose.connect(mongoUrl);
        console.log("✅ MongoDB connected to:", mongoose.connection.name);
        console.log("📦 Database URL:", mongoUrl);
    } catch (err) {
        console.error("MongoDB connection error");
        console.error(err.message);
        process.exit(1);
    }
}