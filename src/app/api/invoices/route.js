import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Invoice from '@/models/Invoice';
import Client from '@/models/Client'; // Ensure model is loaded
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// Helper to generate Invoice Number
function generateInvoiceNumber() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${date}-${random}`;
}

export async function GET(request) {
    try {
        await dbConnect();

        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get('clientId');
        const status = searchParams.get('status');

        // Build Query
        const query = {};
        if (clientId) query.client = clientId;
        if (status && status !== 'all') query.status = status;

        // Role restriction: Users can only see their own linked invoices?
        // For now, let's assume this API is for ADMIN panel usage mainly.
        // But if normal users access it, we might need filtering.
        if (!['admin', 'manager'].includes(user.role)) {
             // If regular user, maybe find invoices linked to their account?
             // query.user = user._id; 
             // Leaving this restricted to admin/manager for now as per dashboard logic
             return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const invoices = await Invoice.find(query)
            .populate('client', 'name email linkedUser')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: invoices });
    } catch (error) {
        console.error('Invoice fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();

        const user = await verifyAuth(request);
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();

        // 1. Basic Validation
        if (!body.client || !body.items || body.items.length === 0) {
            return NextResponse.json({ error: 'Client and at least one item are required' }, { status: 400 });
        }

        // 2. Generate Invoice Number if missing
        if (!body.invoiceNumber) {
            body.invoiceNumber = generateInvoiceNumber();
        }

        // 3. Recalculate Totals (Backend Source of Truth)
        let subtotal = 0;
        const processedItems = body.items.map(item => {
            const quantity = Number(item.quantity) || 1;
            const price = Number(item.unitPrice) || 0;
            const amount = quantity * price;
            subtotal += amount;
            return {
                description: item.description,
                quantity,
                unitPrice: price,
                amount
            };
        });

        const taxRate = Number(body.taxRate) || 0;
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;

        // 4. Create Invoice Object
        const invoiceData = {
            ...body,
            items: processedItems,
            subtotal,
            taxRate,
            taxAmount,
            total,
            createdBy: user._id
        };

        const invoice = await Invoice.create(invoiceData);
        
        // Update Client's total spent (Optional optimization)
        // await Client.findByIdAndUpdate(body.client, { $inc: { totalSpent: total } });

        return NextResponse.json({ success: true, data: invoice }, { status: 201 });

    } catch (error) {
        console.error('Invoice creation error:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Invoice number already exists' }, { status: 400 });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
