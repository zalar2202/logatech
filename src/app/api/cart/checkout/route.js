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
        const { userId, clientId: bodyClientId } = body;
        const isAdmin = ["admin", "manager"].includes(user.role);
        
        // If admin provides a userId, they are checking out THEIR CURRENT CART for THAT user.
        // Otherwise, it's a normal user checking out THEIR OWN CART.
        // Actually, let's make it explicit:
        // cartSourceId: whose cart are we reading from?
        // targetUserId: who is the invoice for?
        const cartSourceId = user._id; 
        let targetUserId = (isAdmin && userId) ? userId : user._id;
        let targetClientId = (isAdmin && bodyClientId) ? bodyClientId : null;

        const cart = await Cart.findOne({ user: cartSourceId })
            .populate("items.package")
            .populate("appliedPromotion");

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // 1. Find or Create Client record
        let client;
        if (targetClientId) {
            client = await Client.findById(targetClientId);
            if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
            targetUserId = client.linkedUser || targetUserId;
        } else {
            client = await Client.findOne({ linkedUser: targetUserId });
        }

        if (!client) {
            // Fetch the user details for the client record
            let targetUser = user;
            if (targetUserId.toString() !== user._id.toString()) {
                const User = (await import("@/models/User")).default;
                targetUser = await User.findById(targetUserId);
            }

            if (!targetUser) return NextResponse.json({ error: "User/Client mapping failed. Please create client first." }, { status: 404 });

            client = await Client.create({
                name: targetUser.name,
                email: targetUser.email,
                linkedUser: targetUserId,
                company: targetUser.company || '',
                website: targetUser.website || '',
                taxId: targetUser.taxId || '',
                whatsapp: targetUser.whatsapp || '',
                preferredCommunication: targetUser.preferredCommunication || 'email',
                address: {
                    street: targetUser.address?.street || '',
                    city: targetUser.address?.city || '',
                    state: targetUser.address?.state || '',
                    zip: targetUser.address?.zip || '',
                    country: targetUser.address?.country || '',
                },
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

        // Calculate Promotion Discount
        let promotionDiscount = 0;
        let appliedPromoCode = null;
        if (cart.appliedPromotion) {
            const promo = cart.appliedPromotion;
            
            // Check category applicability
            let applicableSubtotal = subtotal;
            let isCategoryApplicable = true;
            if (promo.applicableCategories && promo.applicableCategories.length > 0) {
                const applicableItems = cart.items.filter(item => 
                    promo.applicableCategories.includes(item.package?.category)
                );
                
                if (applicableItems.length > 0) {
                    applicableSubtotal = applicableItems.reduce((acc, item) => 
                        acc + (item.package.price * item.quantity), 0
                    );
                } else {
                    isCategoryApplicable = false;
                }
            }

            // Double check validity
            const now = new Date();
            const isValid = promo.isActive && 
                             (!promo.startDate || promo.startDate <= now) && 
                             (!promo.endDate || promo.endDate >= now) &&
                             (promo.usageLimit === null || promo.usedCount < promo.usageLimit) &&
                             (subtotal >= promo.minPurchase) &&
                             isCategoryApplicable;

            if (isValid) {
                if (promo.discountType === 'percentage') {
                    promotionDiscount = (applicableSubtotal * promo.discountValue) / 100;
                } else {
                    promotionDiscount = promo.discountValue;
                }
                promotionDiscount = Math.min(promotionDiscount, applicableSubtotal);
                appliedPromoCode = promo.discountCode;

                // Increment usage
                const Promotion = (await import("@/models/Promotion")).default;
                await Promotion.findByIdAndUpdate(promo._id, { $inc: { usedCount: 1 } });
            }
        }

        const total = Math.max(0, subtotal - promotionDiscount);

        const invoiceData = {
            invoiceNumber: generateInvoiceNumber(),
            client: client._id,
            user: targetUserId,
            package: cart.items[0]?.package?._id, // Link first package for service activation logic
            status: 'sent', // Set to sent immediately so visibility filter doesn't hide it from user
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            items: items,
            subtotal: subtotal,
            promotion: {
                code: appliedPromoCode,
                discountAmount: Number(promotionDiscount.toFixed(2)),
                discountType: cart.appliedPromotion?.discountType || 'fixed',
                discountValue: cart.appliedPromotion?.discountValue || 0
            },
            total: Number(total.toFixed(2)),
            currency: client.currency || 'USD',
            createdBy: user._id
        };

        const invoice = await Invoice.create(invoiceData);

        // 3. Clear Cart
        cart.items = [];
        cart.appliedPromotion = null;
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
