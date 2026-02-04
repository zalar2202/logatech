"use client";

import React from 'react';
import AccountingStats from '@/components/accounting/AccountingStats';
import TransactionsTable from '@/components/accounting/TransactionsTable';
import AddIcon from '@mui/icons-material/Add';


export default function AdminAccountingPage() {
    // Mock Data for Admin
    const stats = [
        { title: "Total Revenue", value: "$45,231.89", percentage: "+20.1%", trend: "up", description: "Compared to last month" },
        { title: "Outstanding Invoices", value: "$3,400.00", percentage: "+5.4%", trend: "up", description: "Amount waiting for payment" },
        { title: "Expenses", value: "$12,050.20", percentage: "-2.3%", trend: "down", description: "Operational costs" },
        { title: "Net Profit", value: "$33,181.69", percentage: "+24.5%", trend: "up", description: "After expenses" },
    ];

    const transactions = [
        { id: "INV-2024-001", clientName: "Acme Corp", date: "Oct 24, 2023", description: "Web Development Services", amount: "$5,000.00", status: "Paid" },
        { id: "INV-2024-002", clientName: "Global Tech", date: "Oct 22, 2023", description: "Hosting Subscription (Annual)", amount: "$1,200.00", status: "Paid" },
        { id: "INV-2024-003", clientName: "Startup Inc", date: "Oct 20, 2023", description: "UI/UX Design Package", amount: "$3,400.00", status: "Pending" },
        { id: "REF-2024-001", clientName: "John Doe", date: "Oct 18, 2023", description: "Refund for accidental charge", amount: "-$50.00", status: "Completed" },
        { id: "INV-2024-004", clientName: "Creative Studio", date: "Oct 15, 2023", description: "Consultation Fee", amount: "$500.00", status: "Overdue" },
    ];

    return (
        <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Financial Overview</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Manage your business finances, invoices, and expenses.</p>
                </div>
                <button className="loga-btn">
                    <AddIcon /> Create Invoice
                </button>
            </div>

            <AccountingStats stats={stats} />

            <div style={{ marginTop: '40px' }}>
                <TransactionsTable transactions={transactions} type="admin" />
            </div>
        </div>
    );
}
