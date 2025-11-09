"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUser, clearUser, logoutUser, getCart } from '../libs/api';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUserState] = useState<any | null>(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cartCount, setCartCount] = useState<number>(0);

    const router = useRouter();

    // Refs for dropdowns
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const menuToggleRef = useRef<HTMLButtonElement>(null);

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
            // Close profile dropdown when clicking outside
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
            
            // Close mobile menu when clicking outside (but not on the toggle button)
            if (mobileMenuRef.current && 
                !mobileMenuRef.current.contains(event.target as Node) && 
                menuToggleRef.current && 
                !menuToggleRef.current.contains(event.target as Node) && 
                isMenuOpen) {
                setIsMenuOpen(false);
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    // Initialize auth/user state from localStorage
    useEffect(() => {
        try {
            const u = getUser();
            if (u) {
                setUserState(u);
                setIsLoggedIn(true);
            } else {
                setUserState(null);
                setIsLoggedIn(false);
            }
        } catch {
            setUserState(null);
            setIsLoggedIn(false);
        }
    }, []);

    // Fetch cart count (on mount and when login changes)
    useEffect(() => {
        let mounted = true;
        const fetchCartCount = async () => {
            try {
                const cartRes = await getCart();
                if (!mounted) return;
                let c = 0;
                if (cartRes?.data) {
                    if (typeof cartRes.data === 'number') c = cartRes.data;
                    else if (cartRes.data.cart_count) c = Number(cartRes.data.cart_count) || 0;
                    else if (Array.isArray(cartRes.data.cart_items)) c = cartRes.data.cart_items.length;
                }
                setCartCount(c);
            } catch {
                // ignore
            }
        };

        fetchCartCount();

        const onStorage = (e: StorageEvent) => {
            if (e.key && ['auth_token', 'registration_session_token', 'user'].includes(e.key)) {
                fetchCartCount();
            }
        };
        const onCountsUpdated = () => fetchCartCount();
        window.addEventListener('storage', onStorage);
        window.addEventListener('countsUpdated', onCountsUpdated as EventListener);

        return () => {
            mounted = false;
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('countsUpdated', onCountsUpdated as EventListener);
        };
    }, [isLoggedIn]);

    // Listen for global auth invalidation events (e.g., invalid/expired token)
    useEffect(() => {
        const onAuthInvalid = (e: Event) => {
            try {
                // show a simple message and redirect to login
                const _detail = (e as CustomEvent)?.detail?.message || 'Session expired. Please login again.';
                // alert(detail);
            } catch {}
            try {
                clearUser();
            } catch {}
            setUserState(null);
            setIsLoggedIn(false);
            try { router.push('/login'); } catch {}
        };

        window.addEventListener('authInvalid', onAuthInvalid as EventListener);
        return () => window.removeEventListener('authInvalid', onAuthInvalid as EventListener);
    }, []);

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

    // Handle logout with complete cache clearing
    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            // Call API logout
            await logoutUser();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Clear all user data from localStorage
            localStorage.clear();
            clearUser();

            
            // Clear all related localStorage items
            const itemsToRemove = [
                'user',
                'auth_token',
                'session_token',
                'registration_session_token',
                'session_payload_token',
                'cart_count',
                'wishlist_count',
                'user_profile'
            ];
            
            itemsToRemove.forEach(item => {
                try {
                    localStorage.removeItem(item);
                    sessionStorage.removeItem(item);
                } catch (e) {
                    console.warn(`Could not remove ${item} from storage:`, e);
                }
            });
            

            // Clear all cookies
            document.cookie.split(";").forEach(function(c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            // Reset state
            setUserState(null);
            setIsLoggedIn(false);
            setCartCount(0);
            setProfileDropdownOpen(false);
            
            // Dispatch event for other components to react
            window.dispatchEvent(new Event('authInvalid'));
            window.dispatchEvent(new Event('userLoggedOut'));
            
            // Redirect to home page
            router.push('/');
        }
    };

    const rudrakshaItems = [
        { name: '1 Mukhi Rudraksha', path: '/products?category=1-mukhi' },
        { name: '2 Mukhi Rudraksha', path: '/products?category=2-mukhi' },
        { name: '3 Mukhi Rudraksha', path: '/products?category=3-mukhi' },
        { name: '4 Mukhi Rudraksha', path: '/products?category=4-mukhi' },
        { name: '5 Mukhi Rudraksha', path: '/products?category=5-mukhi' },
        { name: '6 Mukhi Rudraksha', path: '/products?category=6-mukhi' },
        { name: '7 Mukhi Rudraksha', path: '/products?category=7-mukhi' },
        { name: '8 Mukhi Rudraksha', path: '/products?category=8-mukhi' },
        { name: '9 Mukhi Rudraksha', path: '/products?category=9-mukhi' },
        { name: '10 Mukhi Rudraksha', path: '/products?category=10-mukhi' },
        { name: '11 Mukhi Rudraksha', path: '/products?category=11-mukhi' },
        { name: '12 Mukhi Rudraksha', path: '/products?category=12-mukhi' },
        { name: '13 Mukhi Rudraksha', path: '/products?category=13-mukhi' },
        { name: '14 Mukhi Rudraksha', path: '/products?category=14-mukhi' },
    ];

    // Split rudraksha items into two columns
    const rudrakshaFirstColumn = rudrakshaItems.slice(0, 7);
    const rudrakshaSecondColumn = rudrakshaItems.slice(7);

    const accessoriesItems = [
        { name: 'Jap Malas', path: '/products?category=jap-malas' },
        { name: 'Siddhi Mala', path: '/products?category=siddhi-mala' },
    ];

    const profileItems = isLoggedIn
        ? [
            { name: 'Dashboard', path: '/dashboard/user', icon: '📊' },
            { name: 'Track Order', path: '/order-track', icon: '📦' },
            { name: 'My Orders', path: '/dashboard/user/orders', icon: '📋' },
            { name: 'Logout', path: '/logout', icon: '🚪', action: handleLogout }
        ]
        : [
            { name: 'Login', path: '/login', icon: '🔐' },
            { name: 'Register', path: '/register', icon: '👤' }
        ];

    const menuItems = [
        { name: 'Home', path: '/', icon: '🏠' },
        {
            name: 'Rudraksha',
            path: '/products?main-category=rudraksha',
            hasDropdown: true,
            dropdownItems: rudrakshaItems,
            icon: '📿'
        },
        {
            name: 'Accessories',
            path: '/products?main-category=rudraksha_accessories',
            hasDropdown: true,
            dropdownItems: accessoriesItems,
            icon: '💎'
        },
        { name: 'History', path: '/history', icon: '📜' },
        { name: 'Contact', path: '/contactus', icon: '📞' },
    ];

    // Handle dropdown toggle - only opens on chevron click
    const handleDropdownToggle = (itemName: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveDropdown(activeDropdown === itemName ? null : itemName);
    };

    // Handle menu item click - navigates for main item, toggles dropdown for chevron
    const handleMenuItemClick = (item: any, e: React.MouseEvent) => {
        // Check if the click was specifically on the chevron SVG or its path
        const target = e.target as HTMLElement;
        const isChevronClick = 
            target.tagName === 'svg' || 
            target.tagName === 'path' ||
            target.closest('svg') !== null;
        
        if (item.hasDropdown && isChevronClick) {
            // Click on the chevron - toggle dropdown
            handleDropdownToggle(item.name, e);
        } else if (item.hasDropdown && !isChevronClick) {
            // Click on the main menu item - navigate to the main category
            e.preventDefault();
            router.push(item.path);
            setActiveDropdown(null);
        }
    };

    // Handle main menu item click (for navigation)
    const handleMainItemClick = (item: any) => {
        if (!item.hasDropdown) {
            router.push(item.path);
        }
    };

    return (
        <>
            <header 
                ref={headerRef}
                className={`bg-white/95 backdrop-blur-md supports-backdrop-blur:bg-white/80 sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'shadow-xl py-0' : 'shadow-lg py-0'
                } ${isMenuOpen ? 'bg-white' : ''}`}
            >
                {/* Top announcement bar */}
                <div className={`bg-gradient-to-r from-amber-900 via-amber-700 to-amber-600 text-white transform transition-transform duration-300 origin-top ${
                    isScrolled || isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-100 opacity-100'
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
                    <div className="flex items-center justify-between h-20 sm:h-24 transition-all duration-300">

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
                                    sizes="(max-inline-size: 640px) 48px, (max-inline-size: 768px) 64px, 80px"
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
                                            {/* Main menu item as button for better control */}
                                            <button
                                                onClick={(e) => handleMenuItemClick(item, e)}
                                                className="flex items-center space-x-1 px-3 xl:px-4 py-2 text-gray-700 hover:text-amber-700 transition-all duration-200 font-medium rounded-lg hover:bg-amber-50 group whitespace-nowrap"
                                                aria-expanded={activeDropdown === item.name}
                                                aria-haspopup="true"
                                            >
                                                <span className="text-sm">{item.icon}</span>
                                                <span className="text-sm">{item.name}</span>
                                                <svg 
                                                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
                                                        activeDropdown === item.name ? 'rotate-180' : ''
                                                    }`}
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            
                                            {/* Dropdown with two columns for Rudraksha */}
                                            <div className={`absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-amber-100 overflow-hidden transition-all duration-300 origin-top ${
                                                activeDropdown === item.name ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                                            } ${item.name === 'Rudraksha' ? 'w-96' : 'w-64'}`}>
                                                <div className={`${item.name === 'Rudraksha' ? 'p-4' : 'py-2'}`}>
                                                    {item.name === 'Rudraksha' ? (
                                                        // Two-column layout for Rudraksha
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1">
                                                                {rudrakshaFirstColumn.map((dropdownItem, index) => (
                                                                    <Link
                                                                        key={dropdownItem.name}
                                                                        href={dropdownItem.path}
                                                                        className="flex items-center px-3 py-2 text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 rounded-lg text-sm group"
                                                                        style={{ 
                                                                            transitionDelay: activeDropdown === item.name ? `${index * 20}ms` : '0ms'
                                                                        }}
                                                                        onClick={() => setActiveDropdown(null)}
                                                                    >
                                                                        <span className="font-medium group-hover:translate-x-1 transition-transform duration-200 truncate">
                                                                            {dropdownItem.name}
                                                                        </span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                            <div className="space-y-1">
                                                                {rudrakshaSecondColumn.map((dropdownItem, index) => (
                                                                    <Link
                                                                        key={dropdownItem.name}
                                                                        href={dropdownItem.path}
                                                                        className="flex items-center px-3 py-2 text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 rounded-lg text-sm group"
                                                                        style={{ 
                                                                            transitionDelay: activeDropdown === item.name ? `${index * 20}ms` : '0ms'
                                                                        }}
                                                                        onClick={() => setActiveDropdown(null)}
                                                                    >
                                                                        <span className="font-medium group-hover:translate-x-1 transition-transform duration-200 truncate">
                                                                            {dropdownItem.name}
                                                                        </span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // Single column for other dropdowns
                                                        item.dropdownItems?.map((dropdownItem, index) => (
                                                            <Link
                                                                key={dropdownItem.name}
                                                                href={dropdownItem.path}
                                                                className="flex items-center px-4 py-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 border-b border-amber-50 last:border-b-0 group"
                                                                style={{ 
                                                                    transitionDelay: activeDropdown === item.name ? `${index * 30}ms` : '0ms'
                                                                }}
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">
                                                                    {dropdownItem.name}
                                                                </span>
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.path}
                                            className="flex items-center space-x-1 px-3 xl:px-4 py-2 text-gray-700 hover:text-amber-700 transition-all duration-200 font-medium rounded-lg hover:bg-amber-50 group whitespace-nowrap"
                                            onClick={() => handleMainItemClick(item)}
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
                                        {cartCount || 0}
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
                                <div className={`absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-amber-100 overflow-hidden transition-all duration-300 origin-top-right z-10 ${
                                    profileDropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                                }`}>
                                    <div className="p-3 sm:p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-amber-25">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                                {user?.name ? user.name.charAt(0).toUpperCase() : (isLoggedIn ? 'U' : '👤')}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-amber-900 text-sm sm:text-base truncate">
                                                    {user?.name ? `Hi, ${user.name}` : (isLoggedIn ? 'Welcome Back!' : 'Hello, Guest')}
                                                </p>
                                                <p className="text-xs sm:text-sm text-amber-600 truncate">
                                                    {user?.email ? user.email : (isLoggedIn ? 'User Account' : 'Sign in to your account')}
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
                                                onClick={async (e) => {
                                                    if (item.name === 'Logout') {
                                                        e.preventDefault();
                                                        await handleLogout(e);
                                                        return;
                                                    }
                                                    // if (item.action) {
                                                    //     e.preventDefault();
                                                    //     item.action();
                                                    // }
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

                            {/* Mobile Menu Toggle - FIXED */}
                            <button
                                ref={menuToggleRef}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 sm:p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ml-1 relative z-60"
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
                    <div className="md:hidden transition-all duration-300 overflow-hidden" >
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

                {/* Mobile Menu Overlay - FIXED: Lower z-index */}
                {isMenuOpen && (
                    <div 
                        className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-50 mt-[calc(100%+1px)]"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                {/* Mobile Menu - FIXED: Higher z-index than overlay but lower than toggle */}
                <div 
                    ref={mobileMenuRef}
                    className={`lg:hidden absolute inset-x-0 top-full bg-white/95 backdrop-blur-md border-t border-amber-100 transition-all duration-300 overflow-hidden z-55 ${
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
                        <div className="pt-4 border-t border-amber-100 mt-4 z-10" style={{zIndex:1}}>
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