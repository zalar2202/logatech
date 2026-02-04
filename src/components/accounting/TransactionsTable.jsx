"use client";

import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';

const TransactionsTable = ({ transactions, type = 'user' }) => {
    // type: 'user' or 'admin'
    // If admin, show user name column.

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedId, setSelectedId] = React.useState(null);

    const handleMenuClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'paid':
                return { background: 'var(--color-success-surface)', color: 'var(--color-success-foreground)' };
            case 'pending':
                return { background: 'var(--color-warning-surface)', color: 'var(--color-warning-foreground)' };
            case 'failed':
            case 'overdue':
                return { background: 'var(--color-error-surface)', color: 'var(--color-error-foreground)' };
            default:
                return { background: 'var(--color-background-tertiary)', color: 'var(--color-text-secondary)' };
        }
    };

    return (
        <div className="loga-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Transactions</h3>
            </div>
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ background: 'var(--color-background-secondary)', textAlign: 'left' }}>
                            <th style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>ID</th>
                            {type === 'admin' && <th style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Client</th>}
                            <th style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Date</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Description</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Amount</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '15px 20px', fontFamily: 'monospace', color: 'var(--color-primary)' }}>#{tx.id}</td>
                                {type === 'admin' && <td style={{ padding: '15px 20px', fontWeight: '500' }}>{tx.clientName}</td>}
                                <td style={{ padding: '15px 20px', color: 'var(--color-text-secondary)' }}>{tx.date}</td>
                                <td style={{ padding: '15px 20px' }}>{tx.description}</td>
                                <td style={{ padding: '15px 20px', fontWeight: '700' }}>{tx.amount}</td>
                                <td style={{ padding: '15px 20px' }}>
                                    <span style={{
                                        ...getStatusStyle(tx.status),
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="loga-btn" style={{ padding: '5px 10px', fontSize: '0.8rem', borderRadius: '8px' }} title="Download Invoice">
                                            <DownloadIcon fontSize="small" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsTable;
