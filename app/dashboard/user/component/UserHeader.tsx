"use client";
import React from 'react';

type UserHeaderProps = {
    onToggleSidebar: () => void;
    isMobile: boolean;
    sidebarOpen?: boolean;
};

const UserHeader = ({ onToggleSidebar, isMobile, sidebarOpen: _sidebarOpen }: UserHeaderProps) => {
    return (
        <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between p-4 h-16">
                {/* Mobile Toggle Button */}
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                >
                    <span className="text-xl">☰</span>
                </button>

                {/* Desktop Toggle Button */}
                {!isMobile && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
                    >
                        <span className="text-xl">☰</span>
                    </button>
                )}

                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-xl">🔔</span>
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            2
                        </span>
                    </button>

                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 relative rounded-full overflow-hidden">
                            {/* <Image src="https://i.pravatar.cc/40" alt="Admin" fill className="object-cover" /> */}
                        </div>
                       
                    </div>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;