/**
 * Seed Admin User Script (Sanitized)
 *
 * This script creates the first admin user in the database.
 * Usage:
 *   node src/scripts/seedAdmin.js
 * 
 * Required Env Vars in .env.local:
 * ADMIN_EMAIL=admin@logatech.net
 * ADMIN_PASSWORD=your_secure_password
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables if not in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    const envPath = join(__dirname, "../../.env.local");
    dotenv.config({ path: envPath });
} catch (error) {
    console.log("ℹ️ Skipping .env.local loading, using environment variables.");
}

// Import User model (must be after env vars are loaded)
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("❌ Error: MONGO_URI, ADMIN_EMAIL, or ADMIN_PASSWORD is not defined in environment");
    process.exit(1);
}

const adminData = {
    name: "Admin User",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
    status: "active",
    phone: "+1234567890",
};

async function seedAdmin() {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected successfully\n");

        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            console.log("⚠️  Admin user already exists:", existingAdmin.email);
            return;
        }

        console.log("🔄 Creating admin user...");
        const admin = new User(adminData);
        await admin.save();

        console.log("✅ Admin user created successfully!\n");
    } catch (error) {
        console.error("❌ Error seeding admin user:", error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed");
    }
}

seedAdmin();
