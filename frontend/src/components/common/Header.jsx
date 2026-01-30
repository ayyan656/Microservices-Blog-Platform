import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../api/auth.api';

export default function Header() {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-gray-100">
            <nav className="container-main py-4">
                <div className="flex justify-between items-center h-12">
                    {/* Logo */}
                    <Link to="/" className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-1 group">
                        Tech.
                        <span className="w-2 h-2 rounded-full bg-[#FF4405] mt-2 group-hover:scale-125 transition-transform"></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/"
                                    className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Feed
                                </Link>
                                <Link
                                    to="/drafts"
                                    className={`text-sm font-semibold transition-colors ${isActive('/drafts') ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Dashboard
                                </Link>

                                <div className="w-px h-6 bg-gray-200 mx-2"></div>

                                <Link
                                    to="/create-post"
                                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    <span className="text-sm font-semibold">Write</span>
                                </Link>

                                <div className="relative group">
                                    <button className="flex items-center gap-2 pl-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} alt="avatar" className="w-full h-full object-cover" />
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                        <div className="p-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                                    Explore
                                </Link>
                                <div className="flex items-center gap-4 ml-4">
                                    <Link to="/login" className="text-sm font-bold text-slate-900 hover:opacity-80">
                                        Sign in
                                    </Link>
                                    <Link to="/signup" className="btn btn-primary px-5 py-2 text-sm rounded-full">
                                        Get Started
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
