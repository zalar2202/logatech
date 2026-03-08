"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchUsers } from "@/features/users/usersSlice";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Skeleton } from "@/components/common/Skeleton";
import {
    Users,
    Building2,
    Receipt,
    Package,
    CreditCard,
    Tag,
    TrendingUp,
    Activity,
    Ticket,
    MessageSquare,
    Bell,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    ShieldCheck,
    BarChart3,
    Calendar,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Dashboard Home Page - Premium SaaS Edition
 */
export default function DashboardPage() {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const { list: users, loading } = useAppSelector((state) => state.users);

    const [counts, setCounts] = useState({
        packages: 0,
        promotions: 0,
        clients: 0,
        payments: 0,
        tickets: 0,
        services: 0,
        revenue: { total: 0, paid: 0, pending: 0 }
    });

    useEffect(() => {
        if (!user) return;

        const isAdmin = ["admin", "manager"].includes(user.role);

        if (isAdmin) {
            dispatch(fetchUsers({ page: 1, limit: 100 }));
        }

        const fetchStats = async () => {
            try {
                const res = await axios.get("/api/stats/dashboard");
                const statsData = res.data.data;

                if (isAdmin) {
                    setCounts({
                        packages: statsData.packages || 0,
                        promotions: statsData.promotions || 0,
                        clients: statsData.clients || 0,
                        payments: statsData.payments || 0,
                        tickets: statsData.tickets || 0,
                        services: statsData.services || 0,
                        revenue: statsData.revenue || { total: 0, paid: 0, pending: 0 }
                    });
                } else {
                    setCounts({
                        ...counts,
                        tickets: statsData.tickets || 0,
                        services: statsData.services || 0,
                    });
                }
            } catch (e) {
                console.error("Stats fetch error", e);
            }
        };

        fetchStats();
    }, [dispatch, user]);

    // Formatters
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    // Stats data with premium visuals
    const stats = useMemo(() => [
        {
            title: "Total Platform Users",
            value: loading ? "..." : users.length,
            detail: `${users.filter(u => u.status === "active").length} active`,
            icon: Users,
            gradient: "from-blue-600 to-indigo-600",
            glow: "rgba(37, 99, 235, 0.3)",
            link: "/panel/users",
            hide: !["admin", "manager"].includes(user?.role),
            sparkline: [30, 45, 35, 60, 55, 80, 75],
        },
        {
            title: "Enterprise Clients",
            value: counts.clients,
            detail: "Manage corporate accounts",
            icon: Building2,
            gradient: "from-emerald-600 to-teal-600",
            glow: "rgba(16, 185, 129, 0.3)",
            link: "/panel/clients",
            hide: !["admin", "manager"].includes(user?.role),
            sparkline: [20, 25, 40, 35, 50, 45, 60],
        },
        {
            title: "Gross Revenue",
            value: formatCurrency(counts.revenue.total),
            detail: `${formatCurrency(counts.revenue.paid)} collected`,
            icon: CreditCard,
            gradient: "from-violet-600 to-fuchsia-600",
            glow: "rgba(139, 92, 246, 0.3)",
            link: "/panel/payments",
            hide: !["admin", "manager"].includes(user?.role),
            sparkline: [40, 30, 50, 45, 70, 65, 90],
        },
        {
            title: user?.role === "user" ? "My Subscriptions" : "Active Services",
            value: counts.services || 0,
            detail: "Current deployments",
            icon: Activity,
            gradient: "from-amber-600 to-orange-600",
            glow: "rgba(245, 158, 11, 0.3)",
            link: "/panel/services",
            sparkline: [50, 40, 60, 55, 75, 70, 85],
        },
        {
            title: "Support Tickets",
            value: counts.tickets || 0,
            detail: "Active requests",
            icon: Ticket,
            gradient: "from-rose-600 to-pink-600",
            glow: "rgba(225, 29, 72, 0.3)",
            link: "/panel/tickets",
            sparkline: [10, 20, 15, 25, 20, 35, 30],
        },
        {
            title: "Service Packages",
            value: counts.packages,
            detail: "Configurable offerings",
            icon: Package,
            gradient: "from-cyan-600 to-blue-600",
            glow: "rgba(8, 145, 178, 0.3)",
            link: "/panel/packages",
            hide: !["admin", "manager"].includes(user?.role),
            sparkline: [25, 30, 20, 40, 35, 50, 45],
        },
    ], [users, loading, counts, user]);

    // Filtered quick actions
    const quickActions = [
        { title: "My Services", icon: Zap, link: "/panel/services", color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "New Ticket", icon: MessageSquare, link: "/panel/tickets", color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Manage Users", icon: Users, link: "/panel/users", color: "text-indigo-500", bg: "bg-indigo-500/10", admin: true },
        { title: "Catalog", icon: Tag, link: "/panel/shop", color: "text-rose-500", bg: "bg-rose-500/10" },
        { title: "Revenue", icon: BarChart3, link: "/panel/payments", color: "text-emerald-500", bg: "bg-emerald-500/10", admin: true },
        { title: "Broadcast", icon: Bell, link: "/panel/notifications/send", color: "text-purple-500", bg: "bg-purple-500/10", admin: true },
    ].filter(a => !a.admin || ["admin", "manager"].includes(user?.role));

    return (
        <div className="dashboard-container p-4 md:p-8">
            <ContentWrapper>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black font-heading gradient-text">
                            {["admin", "manager"].includes(user?.role) ? "System Overview" : "Hub Dashboard"}
                        </h1>
                        <p className="text-[var(--color-text-secondary)] mt-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-[var(--color-card-bg)] p-2 rounded-2xl border border-[var(--color-border)] shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="pr-4">
                            <p className="text-sm font-bold text-[var(--color-text-primary)] leading-tight">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider">{user?.role || 'Guest'}</p>
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {stats.filter(s => !s.hide).map((stat, idx) => (
                        <Link key={idx} href={stat.link} className="block group">
                            <Card className="glass-card h-full p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <stat.icon className="w-24 h-24" />
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1 text-xs font-bold text-green-500">
                                            <ArrowUpRight className="w-3 h-3" />
                                            <span>+12%</span>
                                        </div>
                                        <p className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-tighter">vs last month</p>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <p className="text-sm font-bold text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">{stat.title}</p>
                                    <h3 className="text-3xl font-black text-[var(--color-text-primary)] mb-4">
                                        {loading && idx === 0 ? <Skeleton className="h-8 w-24" /> : stat.value}
                                    </h3>

                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-[var(--color-text-secondary)]">{stat.detail}</p>
                                        <div className="w-24 h-8">
                                            <Sparkline data={stat.sparkline} color={stat.glow.replace('0.3', '1')} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Activity & Quick Actions */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Quick Actions Bento */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-black text-[var(--color-text-primary)]">Quick Toolkit</h2>
                                <Link href="/panel" className="text-xs font-bold text-[var(--color-primary)] hover:underline">View All Tools</Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {quickActions.map((action, i) => (
                                    <Link key={i} href={action.link}>
                                        <div className="glass-card p-5 group cursor-pointer quick-action-btn flex flex-col items-center text-center">
                                            <div className={`w-12 h-12 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                                <action.icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-bold text-[var(--color-text-primary)]">{action.title}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Recent Deployments/Activity */}
                        {["admin", "manager"].includes(user?.role) && (
                            <section>
                                <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-4">Live Activity Feed</h2>
                                <Card className="glass-card p-6">
                                    <div className="space-y-6">
                                        {loading ? <Skeleton className="h-40 w-full" /> : users.slice(0, 4).map((u, i) => (
                                            <div key={i} className="activity-item group">
                                                <div className="activity-dot shadow-[0_0_8px_var(--color-primary)]" />
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-bold text-[var(--color-text-primary)]">
                                                            {u.name} <span className="text-[var(--color-text-secondary)] font-normal">joined the platform</span>
                                                        </p>
                                                        <p className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <Badge variant={u.status === 'active' ? 'success' : 'warning'} size="sm">
                                                        {u.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </section>
                        )}
                    </div>

                    {/* Sidebar: System Health & Info */}
                    <div className="space-y-8">
                        {/* Real-time Health Monitor */}
                        <section>
                            <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-4">Core Health</h2>
                            <Card className="glass-card p-6 bg-gradient-to-b from-[var(--color-background-elevated)] to-[var(--color-background-secondary)]">
                                <div className="space-y-6">
                                    <HealthItem label="API Node Europe" status="Healthy" value="42ms" />
                                    <HealthItem label="Global Auth Service" status="Operational" value="99.9%" />
                                    <HealthItem label="PostgreSQL Cluster" status="Stable" value="1.2ms" />
                                    <HealthItem label="Edge CDN" status="Active" value="18ms" />
                                </div>
                                <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">System Load</span>
                                        <span className="text-[10px] font-bold text-amber-500">24%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[24%]" />
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Security Snapshot */}
                        <section>
                            <Card className="bg-indigo-600 rounded-[2rem] p-6 text-white overflow-hidden relative border-none">
                                <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 rotate-12" />
                                <div className="relative z-10">
                                    <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" />
                                        Security Active
                                    </h3>
                                    <p className="text-xs text-indigo-100 mb-6 leading-relaxed">
                                        Your account is protected with enterprise-grade encryption and real-time threat monitoring.
                                    </p>
                                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-sm font-bold transition-colors">
                                        Audit Logs
                                    </button>
                                </div>
                            </Card>
                        </section>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
}

// Subcomponents for the dashboard
function Sparkline({ data, color }) {
    const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - val}`).join(' ');
    return (
        <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="sparkline-svg"
            />
        </svg>
    );
}

function HealthItem({ label, status, value }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="status-pulse bg-emerald-500" />
                <div>
                    <p className="text-xs font-bold text-[var(--color-text-primary)]">{label}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] font-semibold uppercase tracking-tight">{status}</p>
                </div>
            </div>
            <span className="text-xs font-black text-[var(--color-text-primary)]">{value}</span>
        </div>
    );
}

