"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type UserSidebarProps = {
    isOpen: boolean;
    isMobile?: boolean;
    onToggle?: () => void;
    onItemClick?: () => void; // New prop for closing sidebar
};

const UserSidebar: React.FC<UserSidebarProps> = ({ 
    isOpen, 
    isMobile: _isMobile, 
    onToggle, 
    onItemClick 
}) => {
    const [_activeItem, _setActiveItem] = useState<string>('dashboard');
    const pathname = usePathname();

    const userMenuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/dashboard/user' },
        { id: 'orders', name: 'My Orders', icon: '📦', href: '/dashboard/user/orders' },
        { id: 'reviews', name: 'My Reviews', icon: '⭐', href: '/dashboard/user/reviews' },
        { id: 'comments', name: 'My Comments', icon: '💬', href: '/dashboard/user/comments' },
        { id: 'address', name: 'Address Book', icon: '🏠', href: '/dashboard/user/address' },
        { id: 'profile', name: 'Profile Settings', icon: '👤', href: '/dashboard/user/profile' },
    ];

    // Determine active item based on current path
    const getActiveItem = () => {
        const currentPath = pathname;
        const activeItem = userMenuItems.find(item => 
            currentPath === item.href || currentPath.startsWith(item.href + '/')
        );
        return activeItem?.id || 'dashboard';
    };

    const activeItemId = getActiveItem();

    const handleItemClick = () => {
        // Close sidebar on mobile when item is clicked
        if (onItemClick) {
            onItemClick();
        }
    };

    return (
        <aside className={`
            fixed md:relative 
            bg-white
            text-gray-800
            shadow-xl
            z-30 
            transition-all duration-300 ease-in-out
            ${isOpen ? 'w-64' : 'w-0 md:w-20'} /* Changed for better mobile handling */
            ${isOpen ? 'left-0' : '-left-full md:left-0'} /* Better mobile handling */
            h-full
            border-r border-gray-200
            overflow-hidden /* Prevent content overflow when closed */
        `}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white h-16 md:h-20">
                <Link href="/" onClick={handleItemClick}>
                    <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center w-full'}`}>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#5F3623] to-[#f5821f] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm md:text-base">PR</span>
                        </div>
                        {isOpen && (
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Pashupatinath</h3>
                            </div>
                        )}
                    </div>
                </Link>
                {isOpen && (
                    <button
                        onClick={onToggle}
                        className="p-1 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="p-2 md:p-4">
                <ul className="space-y-1">
                    {userMenuItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                href={item.href}
                                onClick={handleItemClick}
                                className={`
                                    w-full flex items-center p-2 md:p-3 rounded-xl transition-all duration-200
                                    ${activeItemId === item.id
                                        ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white shadow-lg'
                                        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                    }
                                    ${!isOpen && 'justify-center'}
                                    text-sm md:text-base /* Responsive text size */
                                `}
                            >
                                <span className={`text-lg md:text-xl ${activeItemId === item.id ? 'scale-110' : ''} transition-transform`}>
                                    {item.icon}
                                </span>
                                {isOpen && (
                                    <span className="ml-2 md:ml-3 font-medium text-xs md:text-sm">{item.name}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4">
                <button className={`
                    w-full flex items-center p-2 md:p-3 rounded-xl transition-all duration-200
                    bg-gray-100 hover:bg-gray-200 text-gray-700
                    ${!isOpen && 'justify-center'}
                    text-sm md:text-base /* Responsive text size */
                `}>
                    <span className="text-lg md:text-xl">🚪</span>
                    {isOpen && (
                        <span className="ml-2 md:ml-3 font-medium text-xs md:text-sm">Logout</span>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;