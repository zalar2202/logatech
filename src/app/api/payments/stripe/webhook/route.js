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
        const invoiceId = session.metadata.invoiceId;

        await dbConnect();

        try {
            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {
                console.error("Invoice not found in webhook:", invoiceId);
                return NextResponse.json({ received: true });
            }

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

            // Update Invoice Status
            if (invoice.paymentPlan?.isInstallment && invoice.status === "sent") {
                // Was down payment
                invoice.status = "partial";
            } else {
                // Was full payment or remaining balance
                invoice.status = "paid";
            }

            await invoice.save();
            
            console.log(`✅ Payment received for Invoice ${invoice.invoiceNumber}. New Status: ${invoice.status}`);

        } catch (error) {
            console.error("Error updating invoice in webhook:", error);
            return NextResponse.json({ error: "Db error" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
