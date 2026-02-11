import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY is not defined in environment variables.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16", // Recommended version or latest
    typescript: false,
});

export default stripe;
