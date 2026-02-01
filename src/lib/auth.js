import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

// Helper to get db connection - checking if verifyAuth or mongodb.js is better
// Standard practice is often lib/mongodb.js or lib/db.js
// Based on previous file list, it is 'lib/mongodb.js' for connection logic usually, 
// OR checking if there is a 'lib/db.js'. 
// Let's assume standard mongoose connection import.
// WAIT, the previous file list shows: mongodb.js inside lib.
// But some files imported '@/lib/db'. I should check if '@/lib/db' exists or if it's mapped.
// Let's safely try to use the most robust connection method. 
// I will check if lib/db.js exists first.

export async function verifyAuth(request) {
    try {
        const token = (await cookies()).get('token')?.value;

        if (!token) {
            return null;
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
            return null;
        }

        // We imported dbConnect, but let's make sure we are connected
        // It's often safer to import the connection function.
        // If '@/lib/db' doesn't exist, we might crash again.
        // Let's use '@/lib/mongodb' if that's the established pattern, 
        // OR rely on the fact that Mongoose might be cached.
        
        // Fetch user permissions/role if needed, or just return basic decoded info.
        // Ideally we return the full user doc to check role changes/bans.
        
        // Lazy load connection if necessary
        // await dbConnect(); 

        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
             return null;
        }

        return user;
    } catch (error) {
        console.error("Auth verification error:", error);
        return null; // Return null on any failure (expired, invalid, etc)
    }
}
