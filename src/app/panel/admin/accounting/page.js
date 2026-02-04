"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AccountingStats from '@/components/accounting/AccountingStats';
import TransactionsTable from '@/components/accounting/TransactionsTable';
import AddIcon from '@mui/icons-material/Add';
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminAccountingPage() {
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        outstanding: 0,
        paidCount: 0,
        pendingCount: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get("/api/invoices");
                if (data.success) {
                    setInvoices(data.data);
                    calculateMetrics(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch accounting data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculateMetrics = (invList) => {
        const revenue = invList
            .filter(inv => inv.status === 'paid')
            .reduce((sum, inv) => sum + (inv.total || 0), 0);
        
        const outstanding = invList
            .filter(inv => ['sent', 'overdue'].includes(inv.status))
            .reduce((sum, inv) => sum + (inv.total || 0), 0);
        
        const paidCount = invList.filter(inv => inv.status === 'paid').length;
        const pendingCount = invList.filter(inv => inv.status === 'sent').length;

        setMetrics({
            totalRevenue: revenue,
            outstanding: outstanding,
            paidCount,
            pendingCount
        });
    };

    const stats = [
        { 
            title: "Total Revenue", 
            value: `$${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
            percentage: `${metrics.paidCount} Paid`, 
            trend: "up", 
            description: "Total fulfilled invoices" 
        },
        { 
            title: "Outstanding", 
            value: `$${metrics.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
            percentage: `${metrics.pendingCount} Pending`, 
            trend: "down", 
            description: "Amount waiting for payment" 
        },
        { 
            title: "Profit Margin", 
            value: "85%", // Hardcoded for demo or calculate from expenses if available
            percentage: "+2.4%", 
            trend: "up", 
            description: "Est. after cloud costs" 
        },
        { 
            title: "Active Services", 
            value: metrics.paidCount.toString(), 
            percentage: "Growth", 
            trend: "up", 
            description: "Services awaiting activation or active" 
        },
    ];

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Financial Overview</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Manage your business finances, invoices, and expenses.</p>
                </div>
                <Link href="/panel/invoices" passHref legacyBehavior>
                    <a className="loga-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <AddIcon /> Manage Invoices
                    </a>
                </Link>
            </div>

            <AccountingStats stats={stats} />

            <div style={{ marginTop: '40px' }}>
                <TransactionsTable transactions={invoices} type="admin" />
            </div>
        </div>
    );
}

