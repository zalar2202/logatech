/**
 * Reset Admin Password Script
 *
 * This script resets the admin user's password in the database.
 * Run this:
 *   node src/scripts/resetAdmin.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    const envPath = join(__dirname, "../../.env.local");
    dotenv.config({ path: envPath });
} catch (error) {
    console.log("ℹ️ Skipping .env.local loading, using environment variables.");
}

import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ Error: MONGO_URI is not defined");
    process.exit(1);
}

const NEW_PASSWORD = "Admin@123";
const ADMIN_EMAIL = "admin@logatech.net";

async function resetAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        let user = await User.findOne({ email: ADMIN_EMAIL });

        if (!user) {
            console.log("🔄 Creating new admin user...");
            user = new User({
                name: "Admin User",
                email: ADMIN_EMAIL,
                password: NEW_PASSWORD,
                role: "admin",
                status: "active"
            });
        } else {
            console.log("🔄 Resetting existing admin password...");
            user.password = NEW_PASSWORD;
            user.status = "active";
            user.role = "admin";
        }

        await user.save();
        console.log("✅ Admin access restored!");
        console.log(`📧 Email: ${ADMIN_EMAIL}`);
        console.log(`🔐 Password: ${NEW_PASSWORD}`);

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await mongoose.connection.close();
    }
}

resetAdmin();
