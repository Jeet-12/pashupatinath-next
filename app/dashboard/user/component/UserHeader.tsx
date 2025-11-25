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
            <div className="flex items-center justify-between p-3 md:p-4 h-14 md:h-16">
                {/* Mobile Toggle Button - Always visible on mobile */}
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                >
                    <span className="text-xl" style={{ color: "black" }}>☰</span>
                </button>

                {/* Desktop Toggle Button */}
                {!isMobile && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
                    >
                        <span className="text-xl" style={{ color: "black" }}>☰</span>
                    </button>
                )}

                {/* Search Bar - Adjusted for mobile */}
                <div className="flex-1 max-w-md mx-2 md:mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-black text-sm md:text-base"
                        />
                        <span className="absolute left-2 md:left-3 top-1.5 md:top-2.5 text-gray-400 text-sm md:text-base">🔍</span>
                    </div>
                </div>

                {/* User Menu - Adjusted for mobile */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                            <span className="text-xs md:text-sm text-gray-600">👤</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;