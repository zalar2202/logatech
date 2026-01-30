"use client";

import { useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";

/**
 * Dashboard Home Page
 * Displays overview statistics and quick actions
 */
export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { list: users, loading } = useAppSelector((state) => state.users);

    useEffect(() => {
        // Fetch users to display stats
        dispatch(fetchUsers({ page: 1, limit: 100 }));
    }, [dispatch]);

    // Calculate user statistics
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === "active").length;
    const adminUsers = users.filter((user) => user.role === "admin").length;
    const managerUsers = users.filter((user) => user.role === "manager").length;

    // Stats data
    const stats = [
        {
            title: "Total Users",
            value: loading ? "..." : totalUsers,
            change: `${activeUsers} active`,
            icon: Users,
            color: "blue",
            gradient: "from-blue-500 to-cyan-500",
            link: "/users",
        },
        {
            title: "Companies",
            value: "0",
            change: "Coming Soon",
            icon: Building2,
            color: "green",
            gradient: "from-green-500 to-emerald-500",
            link: "/companies",
        },
        {
            title: "Transactions",
            value: "0",
            change: "Coming Soon",
            icon: Receipt,
            color: "purple",
            gradient: "from-purple-500 to-pink-500",
            link: "/transactions",
        },
        {
            title: "Packages",
            value: "0",
            change: "Coming Soon",
            icon: Package,
            color: "orange",
            gradient: "from-orange-500 to-red-500",
            link: "/packages",
        },
    ];

    // Quick actions
    const quickActions = [
        {
            title: "User Management",
            description: "View and manage all users",
            icon: Users,
            link: "/users",
            badge: `${totalUsers} users`,
            variant: "primary",
        },
        {
            title: "Payments",
            description: "Track payment records",
            icon: CreditCard,
            link: "/payments",
            badge: "Coming Soon",
            variant: "secondary",
        },
        {
            title: "Promotions",
            description: "Manage promo codes",
            icon: Tag,
            link: "/promotions",
            badge: "Coming Soon",
            variant: "secondary",
        },
    ];

    // Recent activity (based on user data for now)
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <ContentWrapper>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                    Dashboard
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Welcome back! Here is an overview of your admin panel.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={index} href={stat.link}>
                            <Card hoverable className="group cursor-pointer h-full">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                                            {stat.title}
                                        </p>
                                        {loading && index === 0 ? (
                                            <Skeleton variant="text" className="h-8 w-20 mb-2" />
                                        ) : (
                                            <h3 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                                                {stat.value}
                                            </h3>
                                        )}
                                        <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                                            {index === 0 ? (
                                                <TrendingUp className="w-3 h-3 text-green-600" />
                                            ) : (
                                                <Activity className="w-3 h-3" />
                                            )}
                                            {stat.change}
                                        </p>
                                    </div>
                                    <div
                                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Link key={index} href={action.link}>
                                        <div className="p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-colors cursor-pointer group">
                                            <Icon className="w-8 h-8 text-[var(--color-primary)] mb-3 group-hover:scale-110 transition-transform" />
                                            <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                                                {action.description}
                                            </p>
                                            <Badge variant={action.variant} size="sm">
                                                {action.badge}
                                            </Badge>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div>
                    <Card>
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
                            Recent Users
                        </h2>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} variant="text" className="h-12 w-full" />
                                ))}
                            </div>
                        ) : recentUsers.length === 0 ? (
                            <p className="text-sm text-[var(--color-text-secondary)] text-center py-8">
                                No users yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentUsers.map((user) => (
                                    <Link
                                        key={user._id || user.id}
                                        href={`/users/${user._id || user.id}`}
                                    >
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-hover)] transition-colors cursor-pointer">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-[var(--color-text-primary)] text-sm truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    user.status === "active"
                                                        ? "success"
                                                        : user.status === "inactive"
                                                          ? "warning"
                                                          : "danger"
                                                }
                                                size="sm"
                                            >
                                                {user.status}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {!loading && recentUsers.length > 0 && (
                            <Link href="/users">
                                <div className="mt-4 text-center text-sm text-[var(--color-primary)] hover:underline cursor-pointer">
                                    View all users →
                                </div>
                            </Link>
                        )}
                    </Card>
                </div>
            </div>

            {/* System Status */}
            <div className="mt-6">
                <Card>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
                                System Status
                            </h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                All systems operational
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                            <div className="text-center">
                                <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                                    Database
                                </p>
                                <Badge variant="success" size="sm" dot>
                                    Connected
                                </Badge>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                                    Auth
                                </p>
                                <Badge variant="success" size="sm" dot>
                                    Active
                                </Badge>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                                    API
                                </p>
                                <Badge variant="success" size="sm" dot>
                                    Healthy
                                </Badge>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </ContentWrapper>
    );
}
