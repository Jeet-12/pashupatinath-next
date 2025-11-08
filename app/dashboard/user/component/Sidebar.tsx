"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type UserSidebarProps = {
    isOpen: boolean;
    isMobile?: boolean;
    onToggle?: () => void;
};

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, isMobile: _isMobile, onToggle }) => {
    const [_activeItem, _setActiveItem] = useState<string>('dashboard');
    const pathname = usePathname();

    const userMenuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/dashboard/user' },
        { id: 'orders', name: 'My Orders', icon: '📦', href: '/dashboard/user/orders' },
        { id: 'reviews', name: 'My Reviews', icon: '⭐', href: '/dashboard/user/reviews' },
        { id: 'comments', name: 'My Comments', icon: '💬', href: '/dashboard/user/comments' },
        // { id: 'coupons', name: 'My Coupons', icon: '🎫', href: '/dashboard/user/coupons' },
        { id: 'address', name: 'Address Book', icon: '🏠', href: '/dashboard/user/address' },
        { id: 'profile', name: 'Profile Settings', icon: '👤', href: '/dashboard/user/profile' },
        // { id: 'wishlist', name: 'Wishlist', icon: '❤️', href: '/dashboard/wishlist' }
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

    return (
        <aside className={`
            fixed md:relative 
            bg-white
            text-gray-800
            shadow-xl
            z-30 
            transition-all duration-300 ease-in-out
            ${isOpen ? 'w-64' : 'w-20'}
            ${isOpen ? 'left-0' : '-left-20 md:left-0'}
            h-full
            border-r border-gray-200
        `}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white h-20">
                    <Link href="/">
                <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center w-full'}`}>
                    <div className="w-12 h-12 bg-gradient-to-r from-[#5F3623] to-[#f5821f] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">PR</span>
                    </div>
                    {isOpen && (
                        <div>
                            <h3 className="font-semibold text-gray-900">Pashupatinath</h3>
                        </div>
                    )}
                </div>
                    </Link>
                {isOpen && (
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="p-4">
                <ul className="space-y-1">
                    {userMenuItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                href={item.href}
                                className={`
                                    w-full flex items-center p-3 rounded-xl transition-all duration-200
                                    ${activeItemId === item.id
                                        ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white shadow-lg'
                                        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                    }
                                    ${!isOpen && 'justify-center'}
                                `}
                            >
                                <span className={`text-xl ${activeItemId === item.id ? 'scale-110' : ''} transition-transform`}>
                                    {item.icon}
                                </span>
                                {isOpen && (
                                    <span className="ml-3 font-medium text-sm">{item.name}</span>
                                )}
                                
                                {/* Notification badges */}
                                {/* {isOpen && (
                                    <>
                                        {item.id === 'orders' && (
                                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                                        )}
                                        {item.id === 'coupons' && (
                                            <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">2</span>
                                        )}
                                        {item.id === 'comments' && (
                                            <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">5</span>
                                        )}
                                    </>
                                )} */}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Quick Stats - Only show when expanded */}
            {/* {isOpen && (
                <div className="p-4 border-t border-gray-200 mt-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Stats</h4>
                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-white rounded-lg p-2">
                                <div className="text-sm font-bold text-gray-900">12</div>
                                <div className="text-xs text-gray-600">Orders</div>
                            </div>
                            <div className="bg-white rounded-lg p-2">
                                <div className="text-sm font-bold text-gray-900">8</div>
                                <div className="text-xs text-gray-600">Reviews</div>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Logout Button */}
            <div className="absolute bottom-4 left-4 right-4">
                <button className={`
                    w-full flex items-center p-3 rounded-xl transition-all duration-200
                    bg-gray-100 hover:bg-gray-200 text-gray-700
                    ${!isOpen && 'justify-center'}
                `}>
                    <span className="text-xl">🚪</span>
                    {isOpen && (
                        <span className="ml-3 font-medium text-sm">Logout</span>
                    )}
                </button>
            </div>

            {/* Tooltip for collapsed state */}
            {!isOpen && (
                <div className="absolute left-full top-0 ml-2 hidden md:block">
                    <div className="bg-gray-900 text-white text-sm rounded-lg py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Expand Menu
                    </div>
                </div>
            )}
        </aside>
    );
};

export default UserSidebar;