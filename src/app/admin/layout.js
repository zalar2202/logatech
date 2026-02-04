"use client";

import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background-tertiary)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'var(--color-card-bg)',
                borderRight: '1px solid var(--color-border)',
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-primary)', margin: 0 }}>Loga Admin</h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/admin/dashboard" className="nav-item" style={{
                        padding: '12px 15px',
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        fontWeight: '500',
                        fontSize: '0.95rem'
                    }}>
                        Dashboard
                    </Link>
                    <Link href="/admin/users" className="nav-item" style={{
                        padding: '12px 15px',
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        fontWeight: '500',
                        fontSize: '0.95rem'
                    }}>
                        Users
                    </Link>
                    <Link href="/admin/accounting" className="nav-item active" style={{
                        padding: '12px 15px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        Accounting
                    </Link>
                    <Link href="/admin/settings" className="nav-item" style={{
                        padding: '12px 15px',
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        fontWeight: '500',
                        fontSize: '0.95rem'
                    }}>
                        Settings
                    </Link>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ padding: '15px', background: 'var(--color-background-secondary)', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600' }}>Admin User</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>admin@loga.com</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '0' }}>
                {children}
            </main>
        </div>
    );
}
