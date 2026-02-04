"use client";

import React from 'react';
import AccountingStats from '@/components/accounting/AccountingStats';
import TransactionsTable from '@/components/accounting/TransactionsTable';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function UserAccountingPage() {
    // Mock Data for User
    const stats = [
        { title: "Total Spent", value: "$6,200.00", percentage: "+12%", trend: "up", description: "Lifetime spend" },
        { title: "Next Invoice", value: "$1,200.00", percentage: "", trend: "neutral", description: "Due on Nov 22, 2023" },
        { title: "Active Services", value: "2", percentage: "", trend: "neutral", description: "Hosting, Maintenance" },
    ];

    const transactions = [
        { id: "INV-2024-001", date: "Oct 24, 2023", description: "Web Development Services - Milestone 1", amount: "$5,000.00", status: "Paid" },
        { id: "INV-2024-002", date: "Oct 22, 2023", description: "Hosting Subscription (Annual)", amount: "$1,200.00", status: "Paid" },
        { id: "INV-PRE-001", date: "Sep 01, 2023", description: "Project Deposit", amount: "$2,000.00", status: "Paid" },
    ];

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: 'var(--color-text-primary)' }}>Billing & Invoices</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>View your payment history and manage your subscriptions.</p>
                </div>
                <button className="loga-btn">
                    <CreditCardIcon /> Payment Methods
                </button>
            </div>

            <AccountingStats stats={stats} />

            <div style={{ marginTop: '40px' }}>
                <TransactionsTable transactions={transactions} type="user" />
            </div>
        </div>
    );
}
