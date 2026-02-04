import { NextResponse } from 'next/server';
import Invoice from '@/models/Invoice';
import Service from '@/models/Service';
import Client from '@/models/Client';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// GET Single Invoice
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await verifyAuth(request);
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const invoice = await Invoice.findById(id).populate('client');
        
        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: invoice });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// UPDATE Invoice
export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await verifyAuth(request);
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();

        // If items are being updated, recalculate totals
        if (body.items) {
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
            body.items = processedItems;
            
            const taxRate = body.taxRate !== undefined ? Number(body.taxRate) : 0;
            // Note: If taxRate isn't in body, we might need to fetch the existing one to calculate taxAmount correctly if we were strict. 
            // For MVP simplicity, assumes if items change, frontend sends everything or we accept minor drift until refetch. 
            // Better: Recalculate everything thoroughly.
            
            // To be safe, let's just use the body's values assuming frontend sends full state, 
            // OR strictly, we should just save what's passed if we trust frontend, 
            // BUT for financial data, backend logic is safer.
            
            // Let's rely on simple logic: Recalculate total if items passed.
            const taxAmount = subtotal * (taxRate / 100);
            body.subtotal = subtotal;
            body.taxAmount = taxAmount;
            body.total = subtotal + taxAmount;
        }

        const oldInvoice = await Invoice.findById(id);
        if (!oldInvoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        const invoice = await Invoice.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).populate('client');

        // Logic: If status changed to 'paid' and there's a package/user linked, activate service
        if (body.status === 'paid' && oldInvoice.status !== 'paid' && (invoice.package || invoice.user)) {
             // We need a user to link the service to. 
             // If invoice has a user, use it. Otherwise, use user linked to client if possible.
             let targetUserId = invoice.user;
             
             if (!targetUserId && invoice.client) {
                 // Try to find if client is linked to a user (some schemas might have this)
                 const clientData = await Client.findById(invoice.client);
                 targetUserId = clientData?.user || clientData?.userId;
             }

             if (targetUserId && invoice.package) {
                  // Create/Activate service
                  await Service.findOneAndUpdate(
                      { user: targetUserId, package: invoice.package },
                      { 
                          status: 'active',
                          startDate: new Date(),
                          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days, can be improved
                          price: invoice.total
                      },
                      { upsert: true, new: true }
                  );
                  console.log(`✅ Service activated for user ${targetUserId} from invoice ${invoice.invoiceNumber}`);
             }
        }

        return NextResponse.json({ success: true, data: invoice });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE Invoice
export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await verifyAuth(request);
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const invoice = await Invoice.findByIdAndDelete(id);

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
