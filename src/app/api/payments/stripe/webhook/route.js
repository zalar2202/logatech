import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Payment from "@/models/Payment";
import { headers } from "next/headers";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
    const body = await request.text();
    const sig = (await headers()).get("stripe-signature");

    if (!stripe) {
        console.error("❌ Webhook Error: Stripe client not initialized");
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    console.log("⚓ Webhook received. Signature present:", !!sig);

    let event;

    try {
        if (!webhookSecret) {
            console.warn("⚠️ STRIPE_WEBHOOK_SECRET is missing. Verification might fail.");
        }
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error(`❌ Webhook Signature Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    console.log("✅ Webhook verified. Event type:", event.type);

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const invoiceId = session.metadata?.invoiceId;

        console.log(`📦 Processing checkout.session.completed for Invoice ID: ${invoiceId}`);
        console.log("📝 Session Metadata:", JSON.stringify(session.metadata, null, 2));

        if (!invoiceId) {
            console.error("❌ Webhook Error: No invoiceId found in session metadata");
            return NextResponse.json({ error: "No invoiceId in metadata" }, { status: 400 });
        }

        await dbConnect();

        try {
            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {
                console.error(`❌ Webhook Error: Invoice with ID ${invoiceId} not found in database`);
                return NextResponse.json({ received: true }); // Still return 200 to Stripe
            }

            console.log(`🔍 Found Invoice: ${invoice.invoiceNumber}. Current Status: ${invoice.status}`);

            // Create a payment record
            const paymentAmount = session.amount_total / 100;
            
            const newPayment = await Payment.create({
                client: invoice.client,
                invoice: invoice._id,
                amount: paymentAmount,
                currency: session.currency?.toUpperCase(),
                method: "credit_card",
                status: "completed",
                reference: session.payment_intent || session.id,
                notes: `Stripe Payment - Session ID: ${session.id}`,
            });

            console.log(`💰 Payment record created: ${newPayment._id}`);

            // Update Invoice Status and Method
            invoice.paymentMethod = "stripe";
            
            if (invoice.paymentPlan?.isInstallment && invoice.status === "sent") {
                // Was down payment (first payment)
                invoice.status = "partial";
                console.log("📈 Setting status to 'partial' (Down Payment received)");
            } else {
                // Was full payment or remaining balance
                invoice.status = "paid";
                console.log("📈 Setting status to 'paid'");
            }

            await invoice.save();
            
            console.log(`✅ SUCCESS: Invoice ${invoice.invoiceNumber} updated to ${invoice.status}`);

        } catch (error) {
            console.error("❌ Webhook Database Error:", error);
            return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
