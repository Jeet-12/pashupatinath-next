
import React from 'react';
import Link from 'next/link';

export default function TimePass() {
    return (
        <aside className="sidebar">
            <h2>User Dashboard</h2>
            <ul>
                <li><Link href="/dashboard/user">Home</Link></li>
                <li><Link href="/dashboard/user/orders">Orders</Link></li>
                <li><Link href="/dashboard/user/products">Products</Link></li>
            </ul>
        </aside>
    );
}