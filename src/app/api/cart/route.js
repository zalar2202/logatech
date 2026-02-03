import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Package from "@/models/Package";

export async function GET(request) {
    try {
        await dbConnect();
        const user = await verifyAuth(request);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let cart = await Cart.findOne({ user: user._id }).populate("items.package");
        if (!cart) {
            cart = await Cart.create({ user: user._id, items: [] });
        }

        return NextResponse.json({ success: true, data: cart });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const user = await verifyAuth(request);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { packageId, quantity = 1, billingCycle = "monthly" } = await request.json();

        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            cart = new Cart({ user: user._id, items: [] });
        }

        // Check if item exists
        const existingItemIndex = cart.items.findIndex(
            (item) => item.package.toString() === packageId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ package: packageId, quantity, billingCycle });
        }

        await cart.save();
        const populatedCart = await cart.populate("items.package");

        return NextResponse.json({ success: true, data: populatedCart });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();
        const user = await verifyAuth(request);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { itemId } = await request.json();

        const cart = await Cart.findOne({ user: user._id });
        if (cart) {
            cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
            await cart.save();
        }

        const populatedCart = await (cart ? cart.populate("items.package") : { items: [] });
        return NextResponse.json({ success: true, data: populatedCart });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
