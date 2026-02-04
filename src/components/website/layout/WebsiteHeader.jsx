"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WebsiteThemeToggle from "@/components/website/layout/WebsiteThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";

/**
 * WebsiteHeader - Modern top navigation with dropdown support (website pages only)
 */
export default function WebsiteHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const pathname = usePathname();
    const { user } = useAuth();
    const { cartCount } = useCart();

    const isHomepage = pathname === "/";

    const navItems = [
        { id: "home", label: "Home", href: "/" },
        { id: "about", label: "About", href: isHomepage ? "#about" : "/#about" },
        {
            id: "services",
            label: "Services",
            href: isHomepage ? "#services" : "/#services",
            dropdown: [
                {
                    id: "design",
                    label: "🎨 Design",
                    href: "/services/design",
                    description: "Strategic web design",
                },
                {
                    id: "develop",
                    label: "💻 Develop",
                    href: "/services/develop",
                    description: "Clean, scalable code",
                },
                {
                    id: "deploy",
                    label: "🚀 Deploy",
                    href: "/services/deploy",
                    description: "Seamless launch",
                },
                {
                    id: "maintain",
                    label: "🔧 Maintain",
                    href: "/services/maintain",
                    description: "Ongoing support",
                },
            ],
        },
        { id: "why-us", label: "Why Us", href: isHomepage ? "#why-us" : "/#why-us" },
        { id: "process", label: "Process", href: isHomepage ? "#process" : "/#process" },
        { id: "faq", label: "FAQ", href: isHomepage ? "#faq" : "/#faq" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Track pathname changes to reset UI state without triggering cascading renders in useEffect
    const [prevPathname, setPrevPathname] = useState(pathname);
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }

    const handleDropdownToggle = (itemId) => {
        setActiveDropdown(activeDropdown === itemId ? null : itemId);
    };

    const handleNavClick = (e, item) => {
        if (
            item.href.startsWith("#") ||
            (item.href.includes("#") && item.href.split("#")[0] === pathname)
        ) {
            const hash = item.href.split("#")[1];
            if (hash) {
                e.preventDefault();
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
                setIsMobileMenuOpen(false);
            }
        }
    };

    const handleContactClick = (e) => {
        e.preventDefault();
        const element = document.getElementById("contact");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
    };

    const renderNavItem = (item, isMobile = false) => {
        const hasDropdown = item.dropdown && item.dropdown.length > 0;
        const isActive =
            pathname === item.href ||
            (hasDropdown && item.dropdown.some((sub) => pathname === sub.href));

        if (hasDropdown) {
            return (
                <div
                    key={item.id}
                    className={`nav-item has-dropdown ${activeDropdown === item.id ? "open" : ""}`}
                    ref={activeDropdown === item.id ? dropdownRef : null}
                >
                    <button
                        className={`nav-link dropdown-toggle ${isActive ? "active" : ""}`}
                        onClick={() => handleDropdownToggle(item.id)}
                        aria-expanded={activeDropdown === item.id}
                        aria-haspopup="true"
                    >
                        {item.label}
                        <svg
                            className="dropdown-arrow"
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                        >
                            <path
                                d="M1 1L5 5L9 1"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <div className={`dropdown-menu ${activeDropdown === item.id ? "show" : ""}`}>
                        {item.dropdown.map((subItem) => (
                            <Link
                                key={subItem.id}
                                href={subItem.comingSoon ? "#" : subItem.href}
                                className={`dropdown-item ${pathname === subItem.href ? "active" : ""} ${subItem.comingSoon ? "coming-soon" : ""}`}
                                onClick={(e) => {
                                    if (subItem.comingSoon) {
                                        e.preventDefault();
                                    } else {
                                        setActiveDropdown(null);
                                        setIsMobileMenuOpen(false);
                                    }
                                }}
                            >
                                <span className="dropdown-item-icon">
                                    {subItem.label.split(" ")[0]}
                                </span>
                                <div className="dropdown-item-content">
                                    <span className="dropdown-item-label">
                                        {subItem.label.split(" ").slice(1).join(" ")}
                                    </span>
                                    <span className="dropdown-item-description">
                                        {subItem.description}
                                    </span>
                                    {subItem.comingSoon && (
                                        <span className="coming-soon-badge">Coming Soon</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <Link
                key={item.id}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={(e) => handleNavClick(e, item)}
            >
                {item.label}
            </Link>
        );
    };

    return (
        <header className={`header-top ${isScrolled ? "scrolled" : ""}`}>
            <nav className="navbar-top">
                <div className="navbar-container">
                    <Link href="/" className="navbar-brand flex items-center gap-2">
                        <Image
                            src="/assets/logo/LogaTech-512.webp"
                            alt="LogaTech Logo"
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                            priority
                        />
                        <span className="font-bold text-xl tracking-tight">LogaTech</span>
                    </Link>

                    <div className="navbar-nav-desktop">
                        {navItems.map((item) => renderNavItem(item))}
                    </div>

                    <div className="navbar-cta">
                        <WebsiteThemeToggle />

                        {user ? (
                            <>
                                {user.role === "user" && (
                                    <Link
                                        href="/panel/cart"
                                        className="navbar-cart-link relative"
                                        title="My Cart"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-indigo-600 rounded-full border-2 border-[var(--color-background)] leading-none">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                )}
                                <Link
                                    href="/panel/dashboard"
                                    className="loga-btn nav-dashboard-btn"
                                    title="Go to Dashboard"
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
                                </Link>
                                <Link
                                    href="#contact"
                                    className="loga-btn nav-cta-btn"
                                    onClick={handleContactClick}
                                >
                                    Let&apos;s Talk
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="loga-btn nav-signup-btn"
                                    title="Login or Create account"
                                >
                                    <UserPlus className="w-4 h-4 mr-1" /> Login / Sign Up
                                </Link>
                                <Link
                                    href="#contact"
                                    className="loga-btn nav-cta-btn"
                                    onClick={handleContactClick}
                                >
                                    Let&apos;s Talk
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="mobile-actions">
                        <WebsiteThemeToggle />
                        <button
                            className={`mobile-menu-btn ${isMobileMenuOpen ? "open" : ""}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>

                <div className={`navbar-nav-mobile ${isMobileMenuOpen ? "open" : ""}`}>
                    <div className="mobile-nav-content">
                        {navItems.map((item) => renderNavItem(item, true))}

                        {user ? (
                            <>
                                <Link
                                    href="/panel/dashboard"
                                    className="loga-btn mobile-cta-btn secondary"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="#contact"
                                    className="loga-btn mobile-cta-btn"
                                    onClick={handleContactClick}
                                >
                                    Let&apos;s Talk
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="loga-btn mobile-cta-btn"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login / Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
