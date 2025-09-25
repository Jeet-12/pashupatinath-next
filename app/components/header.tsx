"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [rudrakshaDropdownOpen, setRudrakshaDropdownOpen] = useState(false);
    const [accessoriesDropdownOpen, setAccessoriesDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();

    // Refs for dropdowns to handle click outside
    const rudrakshaDropdownRef = useRef<HTMLDivElement>(null);
    const accessoriesDropdownRef = useRef<HTMLDivElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    // Handle keyboard navigation for mobile dropdowns
    const handleMobileDropdownKeyPress = (e: React.KeyboardEvent, itemName: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (itemName === 'Rudraksha') {
                setRudrakshaDropdownOpen(!rudrakshaDropdownOpen);
                setAccessoriesDropdownOpen(false);
            } else if (itemName === 'Rudraksha Accessories') {
                setAccessoriesDropdownOpen(!accessoriesDropdownOpen);
                setRudrakshaDropdownOpen(false);
            }
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsMenuOpen(false);
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
            path: '/products',
            hasDropdown: true,
            dropdownItems: rudrakshaItems
        },
        {
            name: 'Rudraksha Accessories',
            path: '/products',
            hasDropdown: true,
            dropdownItems: accessoriesItems
        },
        { name: 'History', path: '/history' },
        { name: 'Contact Us', path: '/contactus' },
    ];

    return (
        <header className={`bg-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-0'}`}>
            {/* Top bar - Hidden on scroll */}
            <div className={`bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0' : 'max-h-20 py-2'}`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="text-sm font-medium">
                        🚚 Free shipping on orders over ₹500
                    </div>
                    <div className="flex space-x-4 text-sm">
                        <span className="hover:text-gray-200 transition-colors cursor-pointer">Help</span>
                        <span className="hover:text-gray-200 transition-colors cursor-pointer">Orders & Returns</span>
                    </div>
                </div>
            </div>

            {/* Main header - Single row layout on scroll */}
            <div className="container mx-auto px-4">
                <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-0' : 'py-3'}`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center flex-shrink-0">
                        <div className={`relative transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24'}`}>
                            <Image
                                src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/PR_Logo.png"
                                alt="Pashupatinath Rudraksh Logo"
                                fill
                                sizes="(max-width: 768px) 48px, (max-width: 1024px) 64px, 96px"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className={`ml-2 font-bold bg-gradient-to-r from-[#5F3623] to-[#f5821f] bg-clip-text text-transparent transition-all duration-300 ${isScrolled ? 'text-base hidden sm:block' : 'text-lg md:text-xl hidden sm:block'}`}>
                            {isScrolled ? 'Pashupatinath' : 'Pashupatinath Rudraksh'}
                        </span>
                    </Link>

                    {/* Search Bar - Hidden on scroll */}
                    <div className={`hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-6 transition-all duration-300 ${isScrolled ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-2xl opacity-100'}`}>
                        <form onSubmit={handleSearch} className="flex w-full">
                            <input
                                type="text"
                                placeholder="Search for rudraksha, malas, accessories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#f5821f] focus:border-transparent text-black placeholder-gray-600"
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center min-w-[50px]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Right side icons - Always visible in single row */}
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {/* Wishlist */}
                        <Link href="/wishlist" className="flex flex-col items-center cursor-pointer group">
                            <div className="relative p-1 md:p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-[#f5821f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <span className={`text-xs text-gray-600 mt-0.5 group-hover:text-[#f5821f] transition-colors ${isScrolled ? 'hidden' : 'hidden md:block'}`}>Wishlist</span>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="flex flex-col items-center cursor-pointer group relative">
                            <div className="relative p-1 md:p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-[#f5821f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-[#f5821f] text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs font-bold shadow-lg">3</span>
                            </div>
                            <span className={`text-xs text-gray-600 mt-0.5 group-hover:text-[#f5821f] transition-colors ${isScrolled ? 'hidden' : 'hidden md:block'}`}>Cart</span>
                        </Link>

                        {/* User Profile Dropdown */}
                        <div className="hidden md:flex flex-col items-center cursor-pointer group" ref={profileDropdownRef}>
                            <div
                                className="p-1 md:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-[#f5821f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span className={`text-xs text-gray-600 mt-0.5 group-hover:text-[#f5821f] transition-colors ${isScrolled ? 'hidden' : 'block'}`}>Account</span>
                            {profileDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 animate-fadeIn">
                                    {profileItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-[#f5821f] transition-all duration-200 border-b border-gray-100 last:border-b-0"
                                            onClick={(e) => {
                                                if (item.action) {
                                                    e.preventDefault();
                                                    item.action();
                                                }
                                                setProfileDropdownOpen(false);
                                            }}
                                        >
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-lg bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white shadow-lg hover:shadow-xl transition-all"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile search bar - Hidden on scroll */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${isScrolled || isMenuOpen ? 'max-h-0' : 'max-h-20 mt-3'}`}>
                    <form onSubmit={handleSearch} className="flex shadow-lg rounded-lg overflow-hidden">
                        <input
                            type="text"
                            placeholder="🔍 Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow px-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-[#f5821f] text-black"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white px-4 py-3 min-w-[50px]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Navigation menu - Desktop - Always visible */}
                <nav className={`hidden md:flex justify-center space-x-6 transition-all duration-300 ${isScrolled ? 'mt-1' : 'mt-3'}`}>
                    {menuItems.map((item) => (
                        item.hasDropdown ? (
                            <div key={item.name} className="relative group" ref={item.name === 'Rudraksha' ? rudrakshaDropdownRef : accessoriesDropdownRef}>
                                <div className="flex items-center">
                                    <Link
                                        href={item.path}
                                        className="text-gray-800 hover:text-[#f5821f] transition-colors font-semibold text-sm lg:text-base py-1 px-2 rounded-lg hover:bg-orange-50"
                                    >
                                        {item.name}
                                    </Link>
                                    <button
                                        className="ml-1 text-gray-600 hover:text-[#f5821f] transition-colors p-1 rounded-full hover:bg-orange-50"
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
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                                {(item.name === 'Rudraksha' ? rudrakshaDropdownOpen : accessoriesDropdownOpen) && (
                                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn max-h-96 overflow-y-auto">
                                        {item.dropdownItems.map((dropdownItem) => (
                                            <Link
                                                key={dropdownItem.name}
                                                href={dropdownItem.path}
                                                className="flex items-center px-3 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-[#f5821f] transition-all duration-200 border-b border-gray-100 last:border-b-0"
                                                onClick={() => {
                                                    setRudrakshaDropdownOpen(false);
                                                    setAccessoriesDropdownOpen(false);
                                                }}
                                            >
                                                <span className="font-medium text-sm">{dropdownItem.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="text-gray-800 hover:text-[#f5821f] transition-colors font-semibold text-sm lg:text-base py-1 px-2 rounded-lg hover:bg-orange-50"
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                </nav>
            </div>

            {/* Enhanced Mobile menu */}
            {isMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div
                        className="absolute top-0 left-0 right-0 bg-white rounded-b-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-screen animate-slideDown"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile profile section */}
                        <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] p-6 text-white">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Welcome!</p>
                                    <p className="text-white/80">Sign in to your account</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu items */}
                        {/* Mobile menu items */}
                        <div className="max-h-[70vh] overflow-y-auto">
                            {menuItems.map((item) =>
                                item.hasDropdown ? (
                                    <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                            <Link
                                                href={item.path}
                                                className="flex-1 text-gray-800 font-semibold text-lg"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                                onClick={() => {
                                                    if (item.name === 'Rudraksha') {
                                                        setRudrakshaDropdownOpen((prev) => !prev); // toggle only Rudraksha
                                                    } else if (item.name === 'Rudraksha Accessories') {
                                                        setAccessoriesDropdownOpen((prev) => !prev); // toggle only Accessories
                                                    }
                                                }}
                                                onKeyPress={(e) => handleMobileDropdownKeyPress(e, item.name)}
                                                tabIndex={0}
                                                aria-expanded={item.name === 'Rudraksha' ? rudrakshaDropdownOpen : accessoriesDropdownOpen}
                                                aria-label={`Toggle ${item.name} dropdown`}
                                            >
                                                <svg
                                                    className={`w-5 h-5 text-gray-600 transition-transform ${(item.name === 'Rudraksha' ? rudrakshaDropdownOpen : accessoriesDropdownOpen)
                                                            ? 'rotate-180'
                                                            : ''
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                        </div>

                                        {/* Dropdown content */}
                                        {(item.name === "Rudraksha"
                                            ? rudrakshaDropdownOpen
                                            : accessoriesDropdownOpen) && (
                                                <div className="bg-gray-50 animate-fadeIn">
                                                    {item.dropdownItems.map((dropdownItem) => (
                                                        <Link
                                                            key={dropdownItem.name}
                                                            href={dropdownItem.path}
                                                            className="flex items-center px-6 py-3 text-gray-700 hover:text-[#f5821f] transition-colors border-b border-gray-100 last:border-b-0"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            <span className="w-2 h-2 bg-[#f5821f] rounded-full mr-3"></span>
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
                                        className="flex items-center px-6 py-4 text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 font-semibold text-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="w-2 h-2 bg-[#5F3623] rounded-full mr-3"></span>
                                        {item.name}
                                    </Link>
                                )
                            )}
                        </div>


                        {/* Mobile auth buttons */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-3">
                                {profileItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        className="text-center px-4 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Close button */}
                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full text-center py-3 text-gray-600 hover:text-[#f5821f] font-semibold transition-colors"
                            >
                                Close Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}