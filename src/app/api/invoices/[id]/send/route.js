import { NextResponse } from 'next/server';
import Invoice from '@/models/Invoice';
import Client from '@/models/Client';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { sendEmail } from '@/lib/email';

export async function POST(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await verifyAuth(request);
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Get Invoice with Client
        const invoice = await Invoice.findById(id).populate('client');
        
        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        if (!invoice.client?.email) {
            return NextResponse.json({ error: 'Client has no email address' }, { status: 400 });
        }

        // Format items for email
        const itemsHtml = invoice.items.map(item => 
            `<tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.amount.toFixed(2)}</td>
            </tr>`
        ).join('');

        // Build Email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Invoice ${invoice.invoiceNumber}</h1>
                </div>
                
                <div style="padding: 30px; background: #f9fafb;">
                    <p>Dear <strong>${invoice.client.name}</strong>,</p>
                    <p>Please find your invoice details below:</p>
                    
                    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f3f4f6;">
                                    <th style="padding: 10px; text-align: left;">Description</th>
                                    <th style="padding: 10px; text-align: center;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                    <th style="padding: 10px; text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                                    <td style="padding: 10px; text-align: right;">$${invoice.subtotal.toFixed(2)}</td>
                                </tr>
                                ${invoice.taxRate > 0 ? `
                                <tr>
                                    <td colspan="3" style="padding: 10px; text-align: right;">Tax (${invoice.taxRate}%):</td>
                                    <td style="padding: 10px; text-align: right;">$${invoice.taxAmount.toFixed(2)}</td>
                                </tr>
                                ` : ''}
                                <tr style="font-size: 18px; font-weight: bold;">
                                    <td colspan="3" style="padding: 10px; text-align: right; color: #667eea;">Total Due:</td>
                                    <td style="padding: 10px; text-align: right; color: #667eea;">$${invoice.total.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    ${invoice.paymentPlan?.isInstallment ? `
                    <div style="background: #eef2ff; border: 1px solid #c3dafe; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h4 style="margin-top: 0; color: #4338ca; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Installment Payment Plan</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr>
                                <td style="padding: 5px 0; color: #6b7280;">Down Payment:</td>
                                <td style="padding: 5px 0; text-align: right; font-weight: bold;">$${invoice.paymentPlan.downPayment.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #6b7280;">Installment Amount:</td>
                                <td style="padding: 5px 0; text-align: right; font-weight: bold;">$${invoice.paymentPlan.installmentAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #6b7280;">Total Payments:</td>
                                <td style="padding: 5px 0; text-align: right; font-weight: bold;">${invoice.paymentPlan.installmentsCount}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #6b7280;">Frequency:</td>
                                <td style="padding: 5px 0; text-align: right; font-weight: bold; text-transform: capitalize;">${invoice.paymentPlan.period}</td>
                            </tr>
                        </table>
                    </div>
                    ` : ''}
                    
                    <div style="background: white; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Issue Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}</p>
                        <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    
                    ${invoice.notes ? `
                    <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <strong>Notes:</strong><br/>
                        ${invoice.notes}
                    </div>
                    ` : ''}
                    
                    <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
                        Thank you for your business!<br/>
                        LogaTech
                    </p>
                </div>
            </div>
        `;

        // Send Email
        await sendEmail({
            to: invoice.client.email,
            subject: `Invoice ${invoice.invoiceNumber} from LogaTech`,
            html: emailHtml
        });

        // Update Invoice Status to Sent
        await Invoice.findByIdAndUpdate(id, { status: 'sent' });

        return NextResponse.json({ 
            success: true, 
            message: `Invoice sent to ${invoice.client.email}` 
        });

    } catch (error) {
        console.error('Send invoice error:', error);
        return NextResponse.json({ error: error.message || 'Failed to send invoice' }, { status: 500 });
    }
}
