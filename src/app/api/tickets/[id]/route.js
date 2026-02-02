import { NextResponse } from 'next/server';
import Ticket from '@/models/Ticket';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// GET Single Ticket with full messages
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const ticket = await Ticket.findById(id)
            .populate('createdBy', 'name email avatar')
            .populate('assignedTo', 'name email avatar')
            .populate('client', 'name email')
            .populate('messages.sender', 'name email avatar role');
        
        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Regular users can only view their own tickets
        if (!['admin', 'manager'].includes(user.role) && 
            ticket.createdBy._id.toString() !== user._id.toString()) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Filter internal notes for non-staff
        if (!['admin', 'manager'].includes(user.role)) {
            ticket.messages = ticket.messages.filter(m => !m.isInternal);
        }

        return NextResponse.json({ success: true, data: ticket });
    } catch (error) {
        console.error("Ticket GET error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// UPDATE Ticket (status, priority, assignment, etc)
export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Only staff can update status/assignment; users can only add messages
        if (!['admin', 'manager'].includes(user.role) && 
            ticket.createdBy.toString() !== user._id.toString()) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Handle special status changes
        if (body.status === 'resolved' && ticket.status !== 'resolved') {
            body.resolvedAt = new Date();
        }
        if (body.status === 'closed' && ticket.status !== 'closed') {
            body.closedAt = new Date();
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        return NextResponse.json({ success: true, data: updatedTicket });
    } catch (error) {
        console.error("Ticket PUT error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE Ticket (Admin only)
export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await verifyAuth(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const ticket = await Ticket.findByIdAndDelete(id);

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Ticket deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
