"use client";
import React, { useState } from 'react';
import { useMobile } from './hooks/useMobile';
import UserSidebar from './component/Sidebar';
import UserHeader from './component/UserHeader';
import UserFooter from './component/UserFooter';

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const isMobile = useMobile();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Overlay for Mobile */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* User Sidebar */}
            <UserSidebar
                isOpen={sidebarOpen}
                isMobile={isMobile}
                onToggle={toggleSidebar}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* User Header */}
                <UserHeader
                    onToggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                    sidebarOpen={sidebarOpen}
                />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>

                {/* User Footer */}
                <UserFooter />
            </div>
        </div>
    );
};

export default UserLayout;