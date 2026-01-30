import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../api/auth.api';
import { PenLine, User, LogOut, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-editorial-bg/95 backdrop-blur-md border-b border-gray-100">
            <nav className="editorial-container py-4">
                <div className="flex justify-between items-center h-12">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-editorial-text flex items-center gap-1 group"
                    >
                        The Edit
                        <span className="w-2 h-2 rounded-full bg-accent mt-1 group-hover:scale-125 transition-transform" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            <Link
                                to="/"
                                className={`text-sm font-medium transition-colors ${isActive('/')
                                        ? 'text-editorial-text'
                                        : 'text-editorial-muted hover:text-editorial-text'
                                    }`}
                            >
                                Home
                            </Link>

                            {isAuthenticated && (
                                <Link
                                    to="/drafts"
                                    className={`text-sm font-medium transition-colors ${isActive('/drafts')
                                            ? 'text-editorial-text'
                                            : 'text-editorial-muted hover:text-editorial-text'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="w-px h-6 bg-gray-200" />

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                {/* Write Button */}
                                <Link
                                    to="/create-post"
                                    className="flex items-center gap-2 text-editorial-muted hover:text-editorial-text transition-colors"
                                >
                                    <PenLine className="w-4 h-4" />
                                    <span className="text-sm font-medium">Write</span>
                                </Link>

                                {/* User Menu */}
                                <div className="relative group">
                                    <button className="flex items-center gap-2 pl-2">
                                        <div className="w-9 h-9 rounded-full bg-editorial-cream border-2 border-white shadow-sm overflow-hidden">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                                                alt="avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-editorial opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                        <div className="p-4 border-b border-gray-100">
                                            <p className="font-medium text-editorial-text truncate">
                                                {user?.name}
                                            </p>
                                            <p className="text-sm text-editorial-muted truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <div className="p-2">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-editorial-muted hover:text-editorial-text hover:bg-editorial-cream rounded-lg transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-editorial-text hover:text-editorial-accent transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-sm font-medium px-5 py-2.5 bg-accent text-white rounded-full hover:bg-[#E63900] transition-colors shadow-sm"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-editorial-text"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pt-4 pb-2 border-t border-gray-100 mt-4 animate-fade-in">
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 text-sm font-medium text-editorial-text hover:bg-editorial-cream rounded-lg"
                            >
                                Home
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/drafts"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-sm font-medium text-editorial-muted hover:bg-editorial-cream rounded-lg"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/create-post"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-sm font-medium text-editorial-muted hover:bg-editorial-cream rounded-lg"
                                    >
                                        Write Post
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-sm font-medium text-editorial-muted hover:bg-editorial-cream rounded-lg"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-sm font-medium text-editorial-text hover:bg-editorial-cream rounded-lg"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="mx-4 py-3 text-sm font-medium text-center bg-accent text-white rounded-lg"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
