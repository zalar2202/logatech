/**
 * Reset Admin Password Script (Sanitized)
 * 
 * To use this script, set the following environment variables in .env.local:
 * ADMIN_EMAIL=admin@logatech.net
 * ADMIN_PASSWORD=your_secure_password
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
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const NEW_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGO_URI || !ADMIN_EMAIL || !NEW_PASSWORD) {
    console.error("❌ Error: MONGO_URI, ADMIN_EMAIL, or ADMIN_PASSWORD is not defined");
    console.log("Please set these in your .env.local file.");
    process.exit(1);
}

async function resetAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        let user = await User.findOne({ email: ADMIN_EMAIL });

        if (!user) {
            console.log(`🔄 Creating new admin user: ${ADMIN_EMAIL}...`);
            user = new User({
                name: "Admin User",
                email: ADMIN_EMAIL,
                password: NEW_PASSWORD,
                role: "admin",
                status: "active"
            });
        } else {
            console.log(`🔄 Resetting password for: ${ADMIN_EMAIL}...`);
            user.password = NEW_PASSWORD;
            user.status = "active";
            user.role = "admin";
        }

        await user.save();
        console.log("✅ Admin access updated!");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await mongoose.connection.close();
    }
}

resetAdmin();
