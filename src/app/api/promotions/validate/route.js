import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Promotion from '@/models/Promotion';

export async function POST(request) {
    try {
        await connectDB();
        const { code, subtotal } = await request.json();

        if (!code) {
            return NextResponse.json({ success: false, message: 'Code is required' }, { status: 400 });
        }

        const promo = await Promotion.findOne({ 
            discountCode: code.toUpperCase(), 
            isActive: true 
        });

        if (!promo) {
            return NextResponse.json({ success: false, message: 'Invalid promotion code' }, { status: 404 });
        }

        // Check dates
        const now = new Date();
        if (promo.startDate && promo.startDate > now) {
            return NextResponse.json({ success: false, message: 'This promotion has not started yet' }, { status: 400 });
        }
        if (promo.endDate && promo.endDate < now) {
            return NextResponse.json({ success: false, message: 'This promotion has expired' }, { status: 400 });
        }

        // Check usage limit
        if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
            return NextResponse.json({ success: false, message: 'This promotion has reached its usage limit' }, { status: 400 });
        }

        // Check minimum purchase
        if (subtotal < promo.minPurchase) {
            return NextResponse.json({ 
                success: false, 
                message: `Minimum purchase of $${promo.minPurchase} is required for this promotion` 
            }, { status: 400 });
        }

        // Calculate discount
        let discountAmount = 0;
        if (promo.discountType === 'percentage') {
            discountAmount = (subtotal * promo.discountValue) / 100;
        } else {
            discountAmount = promo.discountValue;
        }

        // Ensure discount doesn't exceed subtotal
        discountAmount = Math.min(discountAmount, subtotal);

        return NextResponse.json({ 
            success: true, 
            data: {
                id: promo._id,
                code: promo.discountCode,
                discountType: promo.discountType,
                discountValue: promo.discountValue,
                discountAmount: Number(discountAmount.toFixed(2))
            } 
        });

    } catch (error) {
        console.error('Validation error:', error);
        return NextResponse.json({ success: false, message: 'Failed to validate promotion' }, { status: 500 });
    }
}
