"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // You would get this from auth context
    const [rudrakshaDropdownOpen, setRudrakshaDropdownOpen] = useState(false);
    const [accessoriesDropdownOpen, setAccessoriesDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const router = useRouter();

    // Refs for dropdowns to handle click outside
    const rudrakshaDropdownRef = useRef<HTMLDivElement>(null);
    const accessoriesDropdownRef = useRef<HTMLDivElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rudrakshaDropdownRef.current && !rudrakshaDropdownRef.current.contains(event.target as Node)) {
                setRudrakshaDropdownOpen(false);
            }
            if (accessoriesDropdownRef.current && !accessoriesDropdownRef.current.contains(event.target as Node)) {
                setAccessoriesDropdownOpen(false);
            }
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const rudrakshaItems = [
        { name: '1 Mukhi Rudraksha', path: '/rudraksha/1-mukhi' },
        { name: '2 Mukhi Rudraksha', path: '/rudraksha/2-mukhi' },
        { name: '3 Mukhi Rudraksha', path: '/rudraksha/3-mukhi' },
        { name: '4 Mukhi Rudraksha', path: '/rudraksha/4-mukhi' },
        { name: '5 Mukhi Rudraksha', path: '/rudraksha/5-mukhi' },
        { name: '6 Mukhi Rudraksha', path: '/rudraksha/6-mukhi' },
        { name: '7 Mukhi Rudraksha', path: '/rudraksha/7-mukhi' },
        { name: '8 Mukhi Rudraksha', path: '/rudraksha/8-mukhi' },
        { name: '9 Mukhi Rudraksha', path: '/rudraksha/9-mukhi' },
        { name: '10 Mukhi Rudraksha', path: '/rudraksha/10-mukhi' },
        { name: '11 Mukhi Rudraksha', path: '/rudraksha/11-mukhi' },
        { name: '12 Mukhi Rudraksha', path: '/rudraksha/12-mukhi' },
        { name: '13 Mukhi Rudraksha', path: '/rudraksha/13-mukhi' },
        { name: '14 Mukhi Rudraksha', path: '/rudraksha/14-mukhi' },
    ];

    const accessoriesItems = [
        { name: 'Rudraksha Malas', path: '/accessories/malas' },
        { name: 'Rudraksha Bracelets', path: '/accessories/bracelets' },
        { name: 'Rudraksha Pendants', path: '/accessories/pendants' },
        { name: 'Rudraksha Rings', path: '/accessories/rings' },
        { name: 'Silver Accessories', path: '/accessories/silver' },
        { name: 'Gold Accessories', path: '/accessories/gold' },
        { name: 'Prayer Beads', path: '/accessories/prayer-beads' },
    ];

    const profileItems = isLoggedIn
        ? [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Track Order', path: '/orders' },
            { name: 'Wishlist', path: '/wishlist' },
            { name: 'Logout', path: '/logout', action: () => setIsLoggedIn(false) }
        ]
        : [
            { name: 'Login', path: '/login' },
            { name: 'Register', path: '/register' }
        ];

    const menuItems = [
        { name: 'Home', path: '/' },
        {
            name: 'Rudraksha',
            path: '/rudraksha',
            hasDropdown: true,
            dropdownItems: rudrakshaItems
        },
        {
            name: 'Rudraksha Accessories',
            path: '/rudraksha-accessories',
            hasDropdown: true,
            dropdownItems: accessoriesItems
        },
        { name: 'History', path: '/history' },
        { name: 'Contact Us', path: '/contactus' },
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            {/* Top bar */}
            <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white py-2 px-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-sm">
                        Free shipping on orders over ₹500
                    </div>
                    <div className="flex space-x-4 text-sm">
                        <span>Help</span>
                        <span>Orders & Returns</span>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <div className="flex-shrink-0">
                            <Image
                                src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/PR_Logo.png"
                                alt="Rudraksha World Logo"
                                width={480}
                                height={480}
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <form onSubmit={handleSearch} className="flex w-full">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#5F3623] text-black placeholder-gray-700"
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white px-6 py-2 rounded-r-lg hover:opacity-90 transition-opacity"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-6">
                        {/* Wishlist */}
                        <Link href="/wishlist" className="hidden md:flex flex-col items-center cursor-pointer">
                            <svg className="w-6 h-6 text-gray-700 hover:text-[#f5821f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="flex flex-col items-center cursor-pointer relative">
                            <svg className="w-6 h-6 text-gray-700 hover:text-[#f5821f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="absolute -top-2 -right-2 bg-[#f5821f] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                        </Link>

                        {/* User Profile Dropdown */}
                        <div className="hidden md:flex flex-col items-center cursor-pointer relative" ref={profileDropdownRef}>
                            <div
                                className="flex items-center"
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            >
                                <svg className="w-6 h-6 text-gray-700 hover:text-[#f5821f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            {profileDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    {profileItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#f5821f] transition-colors"
                                            onClick={(e) => {
                                                if (item.action) {
                                                    e.preventDefault();
                                                    item.action();
                                                }
                                                setProfileDropdownOpen(false);
                                            }}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile search bar */}
                <div className="mt-4 md:hidden">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#5F3623] text-black placeholder-gray-700"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white px-4 py-2 rounded-r-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21-6-6m2-5a7 7  11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Navigation menu */}
                <nav className="hidden md:flex justify-center space-x-8 mt-4">
                    {menuItems.map((item) => (
                        item.hasDropdown ? (
                            <div key={item.name} className="relative group" ref={item.name === 'Rudraksha' ? rudrakshaDropdownRef : accessoriesDropdownRef}>
                                <button
                                    className="text-gray-700 hover:text-[#f5821f] transition-colors font-medium flex items-center"
                                    onClick={() => {
                                        if (item.name === 'Rudraksha') {
                                            setRudrakshaDropdownOpen(!rudrakshaDropdownOpen);
                                            setAccessoriesDropdownOpen(false);
                                        } else {
                                            setAccessoriesDropdownOpen(!accessoriesDropdownOpen);
                                            setRudrakshaDropdownOpen(false);
                                        }
                                    }}
                                >
                                    {item.name}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {(item.name === 'Rudraksha' ? rudrakshaDropdownOpen : accessoriesDropdownOpen) && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                                        {item.dropdownItems.map((dropdownItem) => (
                                            <Link
                                                key={dropdownItem.name}
                                                href={dropdownItem.path}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#f5821f] transition-colors"
                                                onClick={() => {
                                                    setRudrakshaDropdownOpen(false);
                                                    setAccessoriesDropdownOpen(false);
                                                }}
                                            >
                                                {dropdownItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="text-gray-700 hover:text-[#f5821f] transition-colors font-medium"
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                </nav>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 bg-white border rounded-lg shadow-lg py-2">
                        {menuItems.map((item) => (
                            item.hasDropdown ? (
                                <div key={item.name} className="border-b last:border-b-0">
                                    <button
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                                        onClick={() => {
                                            if (item.name === 'Rudraksha') {
                                                setRudrakshaDropdownOpen(!rudrakshaDropdownOpen);
                                            } else {
                                                setAccessoriesDropdownOpen(!accessoriesDropdownOpen);
                                            }
                                        }}
                                    >
                                        {item.name}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {(item.name === 'Rudraksha' ? rudrakshaDropdownOpen : accessoriesDropdownOpen) && (
                                        <div className="bg-gray-50 pl-6 py-2">
                                            {item.dropdownItems.map((dropdownItem) => (
                                                <Link
                                                    key={dropdownItem.name}
                                                    href={dropdownItem.path}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {dropdownItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-b last:border-b-0"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}
                        <div className="border-t mt-2 pt-2 px-4">
                            <div className="grid grid-cols-2 gap-4">
                                {profileItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        className="text-center px-3 py-2 bg-gray-100 rounded hover:bg-[#f5821f] hover:text-white transition-colors text-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}