import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Invoice from "@/models/Invoice";
import Client from "@/models/Client";
import Package from "@/models/Package";

// Helper to generate Invoice Number (copied from invoices API for consistency)
function generateInvoiceNumber() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${date}-${random}`;
}

export async function POST(request) {
    try {
        await dbConnect();
        const user = await verifyAuth(request);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const body = await request.json().catch(() => ({}));
        const { userId } = body;
        const isAdmin = ["admin", "manager"].includes(user.role);
        const cartUserId = (isAdmin && userId) ? userId : user._id;

        const cart = await Cart.findOne({ user: cartUserId }).populate("items.package");
        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // 1. Find or Create Client record for the cart user
        let client = await Client.findOne({ linkedUser: cartUserId });
        if (!client) {
            // Fetch the user details for the client record if it's a target user
            let targetUser = user;
            if (cartUserId.toString() !== user._id.toString()) {
                const User = (await import("@/models/User")).default;
                targetUser = await User.findById(cartUserId);
            }

            if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

            client = await Client.create({
                name: targetUser.name,
                email: targetUser.email,
                linkedUser: cartUserId,
                status: 'active'
            });
        }

        // 2. Prepare Invoice Data
        let subtotal = 0;
        const items = cart.items.map(cartItem => {
            const amount = cartItem.package.price * cartItem.quantity;
            subtotal += amount;
            return {
                description: `${cartItem.package.name} (${cartItem.billingCycle})`,
                quantity: cartItem.quantity,
                unitPrice: cartItem.package.price,
                amount: amount
            };
        });

        const invoiceData = {
            invoiceNumber: generateInvoiceNumber(),
            client: client._id,
            user: cartUserId,
            status: 'draft',
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            items: items,
            subtotal: subtotal,
            total: subtotal, // Tax handling can be added later
            createdBy: user._id
        };

        const invoice = await Invoice.create(invoiceData);

        // 3. Clear Cart
        cart.items = [];
        await cart.save();

        return NextResponse.json({ 
            success: true, 
            message: "Invoice issued successfully", 
            invoiceId: invoice._id 
        });

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
