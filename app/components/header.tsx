"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // Refs for dropdowns
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const headerRef = useRef<HTMLElement>(null);

    // Scroll effect with throttle and intersection observer
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 20;
            setIsScrolled(scrolled);
        };

        // Throttle scroll events
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMenuOpen) {
                setIsMenuOpen(false);
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    // Handle escape key and body scroll lock
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setProfileDropdownOpen(false);
                setIsMenuOpen(false);
                setActiveDropdown(null);
                if (searchFocused) {
                    searchRef.current?.blur();
                }
            }
        };

        // Prevent body scroll when mobile menu is open
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen, searchFocused]);

    // Handle search submission
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsLoading(true);
            try {
                await router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            } catch (error) {
                console.error('Navigation error:', error);
            } finally {
                setIsLoading(false);
                setIsMenuOpen(false);
                setSearchQuery('');
                setSearchFocused(false);
            }
        }
    };

    // Data with improved structure
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
            { name: 'Dashboard', path: '/dashboard', icon: '📊' },
            { name: 'Track Order', path: '/orders', icon: '📦' },
            { name: 'Wishlist', path: '/wishlist', icon: '❤️' },
            { name: 'Logout', path: '/logout', icon: '🚪', action: () => setIsLoggedIn(false) }
        ]
        : [
            { name: 'Login', path: '/login', icon: '🔐' },
            { name: 'Register', path: '/register', icon: '👤' }
        ];

    const menuItems = [
        { name: 'Home', path: '/', icon: '🏠' },
        {
            name: 'Rudraksha',
            path: '/products',
            hasDropdown: true,
            dropdownItems: rudrakshaItems,
            icon: '📿'
        },
        {
            name: 'Accessories',
            path: '/products',
            hasDropdown: true,
            dropdownItems: accessoriesItems,
            icon: '💎'
        },
        { name: 'History', path: '/history', icon: '📜' },
        { name: 'Contact', path: '/contactus', icon: '📞' },
    ];

    // Close mobile menu when route changes
    useEffect(() => {
        const handleRouteChange = () => {
            setIsMenuOpen(false);
            setActiveDropdown(null);
        };

        // This would typically be with next/router events, but we'll simulate it
        // For actual implementation, use router.events
    }, []);

    return (
        <>
            <header 
                ref={headerRef}
                className={`bg-white/95 backdrop-blur-md supports-backdrop-blur:bg-white/80 sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'shadow-xl py-0' : 'shadow-lg py-0'
                } ${isMenuOpen ? 'bg-white' : ''}`}
            >
                {/* Top announcement bar */}
                <div className={`bg-gradient-to-r from-amber-900 via-amber-700 to-amber-600 text-white transition-all duration-300 overflow-hidden ${
                    isScrolled || isMenuOpen ? 'max-h-0' : 'max-h-12'
                }`}>
                    <div className="container mx-auto px-4 h-12 flex items-center justify-center">
                        <div className="flex items-center space-x-3 text-sm font-medium flex-wrap justify-center">
                            <span className="flex items-center space-x-1 whitespace-nowrap">
                                <span className="text-amber-200">🚚</span>
                                <span>Free shipping on orders over ₹500</span>
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:flex items-center space-x-1 whitespace-nowrap">
                                <span className="text-amber-200">⭐</span>
                                <span>Authentic Rudraksha Guaranteed</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main header */}
                <div className="container mx-auto px-4">
                    <div className={`flex items-center justify-between transition-all duration-300 ${
                        isScrolled ? 'py-2' : 'py-4'
                    }`}>
                        
                        {/* Logo */}
                        <Link 
                            href="/" 
                            className="flex items-center space-x-3 group flex-shrink-0 min-w-0"
                            aria-label="Pashupatinath Rudraksh Home"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className={`relative transition-all duration-300 ${
                                isScrolled ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-12 h-12 sm:w-16 sm:h-16'
                            }`}>
                                <Image
                                    src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/PR_Logo.png"
                                    alt="Pashupatinath Rudraksh Logo"
                                    fill
                                    sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
                                    className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className={`font-serif font-bold bg-gradient-to-r from-amber-900 to-amber-600 bg-clip-text text-transparent transition-all duration-300 ${
                                    isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                                } truncate`}>
                                    Pashupatinath
                                </span>
                                <span className="text-xs text-amber-700 font-medium -mt-1 truncate">
                                    Rudraksh & Spiritual Store
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1 mx-4 xl:mx-8 flex-wrap justify-center">
                            {menuItems.map((item) => (
                                <div key={item.name} className="relative group">
                                    {item.hasDropdown ? (
                                        <div className="relative">
                                            <button
                                                className="flex items-center space-x-1 px-3 xl:px-4 py-2 text-gray-700 hover:text-amber-700 transition-all duration-200 font-medium rounded-lg hover:bg-amber-50 group whitespace-nowrap"
                                               
                                                aria-expanded={activeDropdown === item.name}
                                                aria-haspopup="true"
                                            >
                                               <Link  key={item.name} href={item.path}> <span className="text-sm">{item.icon}</span>
                                                <span className="text-sm">{item.name}</span> </Link>
                                                <svg 
                                                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
                                                        activeDropdown === item.name ? 'rotate-180' : ''
                                                    }`}
                                                     onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            
                                            {/* Dropdown with animation */}
                                            <div className={`absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-amber-100 overflow-hidden transition-all duration-300 origin-top ${
                                                activeDropdown === item.name ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                                            }`}>
                                                <div className="py-2">
                                                    {item.dropdownItems?.map((dropdownItem, index) => (
                                                        <Link
                                                            key={dropdownItem.name}
                                                            href={dropdownItem.path}
                                                            className="flex items-center px-4 py-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 border-b border-amber-50 last:border-b-0 group"
                                                            style={{ 
                                                                transitionDelay: activeDropdown === item.name ? `${index * 30}ms` : '0ms',
                                                                animationDelay: activeDropdown === item.name ? `${index * 30}ms` : '0ms'
                                                            }}
                                                            onClick={() => setActiveDropdown(null)}
                                                        >
                                                            <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">
                                                                {dropdownItem.name}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.path}
                                            className="flex items-center space-x-1 px-3 xl:px-4 py-2 text-gray-700 hover:text-amber-700 transition-all duration-200 font-medium rounded-lg hover:bg-amber-50 group whitespace-nowrap"
                                        >
                                            <span className="text-sm">{item.icon}</span>
                                            <span className="text-sm">{item.name}</span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4 xl:mx-6 min-w-0">
                            <form onSubmit={handleSearch} className="flex w-full relative min-w-0">
                                <div className={`relative flex-1 transition-all duration-300 min-w-0 ${
                                    searchFocused ? 'ring-2 ring-amber-500 ring-opacity-50 rounded-2xl' : ''
                                }`}>
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder="Search rudraksha, malas, accessories..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        className="w-full px-4 pl-10 pr-4 py-2 sm:py-3 border border-amber-200 rounded-2xl focus:outline-none focus:border-amber-400 bg-amber-25 placeholder-amber-400 text-amber-900 transition-all duration-300 text-sm sm:text-base"
                                        aria-label="Search products"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="ml-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {isLoading ? '...' : 'Search'}
                                </button>
                            </form>
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                            
                            {/* Wishlist */}
                            <Link 
                                href="/wishlist" 
                                className="relative p-2 rounded-xl hover:bg-amber-50 transition-all duration-200 group"
                                aria-label="Wishlist"
                            >
                                <div className="relative">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform">
                                        3
                                    </span>
                                </div>
                            </Link>

                            {/* Cart */}
                            <Link 
                                href="/cart" 
                                className="relative p-2 rounded-xl hover:bg-amber-50 transition-all duration-200 group"
                                aria-label="Shopping Cart"
                            >
                                <div className="relative">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform">
                                        5
                                    </span>
                                </div>
                            </Link>

                            {/* User Profile */}
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center space-x-1 sm:space-x-2 p-2 rounded-xl hover:bg-amber-50 transition-all duration-200 group"
                                    aria-label="User Account"
                                    aria-expanded={profileDropdownOpen}
                                >
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                                        {isLoggedIn ? 'U' : '👤'}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-amber-700 whitespace-nowrap">
                                        {isLoggedIn ? 'Account' : 'Login'}
                                    </span>
                                </button>

                                {/* Profile Dropdown */}
                                <div className={`absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-amber-100 overflow-hidden transition-all duration-300 origin-top-right ${
                                    profileDropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                                }`}>
                                    <div className="p-3 sm:p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-amber-25">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                                {isLoggedIn ? 'U' : '👤'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-amber-900 text-sm sm:text-base truncate">
                                                    {isLoggedIn ? 'Welcome Back!' : 'Hello, Guest'}
                                                </p>
                                                <p className="text-xs sm:text-sm text-amber-600 truncate">
                                                    {isLoggedIn ? 'User Account' : 'Sign in to your account'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-1 sm:py-2">
                                        {profileItems.map((item, index) => (
                                            <Link
                                                key={item.name}
                                                href={item.path}
                                                className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 group"
                                                style={{ transitionDelay: profileDropdownOpen ? `${index * 30}ms` : '0ms' }}
                                                onClick={(e) => {
                                                    if (item.action) {
                                                        e.preventDefault();
                                                        item.action();
                                                    }
                                                    setProfileDropdownOpen(false);
                                                }}
                                            >
                                                <span className="text-base sm:text-lg">{item.icon}</span>
                                                <span className="font-medium flex-1 text-sm sm:text-base group-hover:translate-x-1 transition-transform duration-200">
                                                    {item.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 sm:p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ml-1"
                                aria-label="Toggle menu"
                                aria-expanded={isMenuOpen}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search - Visible when not scrolled and menu not open */}
                    <div className={`md:hidden transition-all duration-300 overflow-hidden ${
                        isScrolled || isMenuOpen ? 'max-h-0' : 'max-h-16 mb-2'
                    }`}>
                        <form onSubmit={handleSearch} className="flex space-x-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="🔍 Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 pl-10 pr-4 py-3 border border-amber-200 rounded-2xl focus:outline-none focus:border-amber-400 bg-amber-25 placeholder-amber-400 text-amber-900 text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium text-sm disabled:opacity-50"
                                >
                                    {isLoading ? '...' : 'Go'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div 
                        className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 mt-[calc(100%+1px)]"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                {/* Mobile Menu */}
                <div 
                    ref={mobileMenuRef}
                    className={`lg:hidden absolute inset-x-0 top-full bg-white/95 backdrop-blur-md border-t border-amber-100 transition-all duration-300 overflow-hidden z-50 ${
                        isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="container mx-auto px-4 py-4 space-y-0 max-h-[70vh] overflow-y-auto">
                        {menuItems.map((item) => (
                            <div key={item.name} className="border-b border-amber-50 last:border-b-0">
                                {item.hasDropdown ? (
                                    <div>
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                                            className="w-full flex items-center justify-between py-4 px-2 text-gray-700 hover:text-amber-700 transition-colors font-medium text-left"
                                            aria-expanded={activeDropdown === item.name}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-base">{item.icon}</span>
                                                <span className="text-base">{item.name}</span>
                                            </div>
                                            <svg 
                                                className={`w-4 h-4 transition-transform duration-300 ${
                                                    activeDropdown === item.name ? 'rotate-180' : ''
                                                }`}
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        
                                        <div className={`pl-8 space-y-0 overflow-hidden transition-all duration-300 ${
                                            activeDropdown === item.name ? 'max-h-96 opacity-100 pb-2' : 'max-h-0 opacity-0'
                                        }`}>
                                            {item.dropdownItems?.map((dropdownItem) => (
                                                <Link
                                                    key={dropdownItem.name}
                                                    href={dropdownItem.path}
                                                    className="block py-3 px-2 text-gray-600 hover:text-amber-700 transition-colors border-l-2 border-amber-100 hover:border-amber-400 hover:bg-amber-25 rounded-r-lg text-sm"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {dropdownItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.path}
                                        className="flex items-center space-x-3 py-4 px-2 text-gray-700 hover:text-amber-700 transition-colors font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="text-base">{item.icon}</span>
                                        <span className="text-base">{item.name}</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                        
                        {/* Mobile Profile Links */}
                        <div className="pt-4 border-t border-amber-100 mt-4">
                            <div className="grid grid-cols-2 gap-2">
                                {profileItems.slice(0, 2).map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        className="flex items-center justify-center space-x-2 py-3 px-4 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
           
        </>
    );
}