import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import useAuthStore from '../stores/authStore';

export default function MainLayout({ children }) {
    const { url } = usePage();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.visit('/login');
    };

    const navLinks = [
        { name: 'Beranda', href: '/', active: url === '/' },
        { name: 'Sensus Ekonomi 2026', href: '/sensus-ekonomi', active: url === '/sensus-ekonomi' },
        { name: 'Panduan', href: '/panduan', active: url === '/panduan' },
        { name: 'Crawling', href: '/crawling', active: url === '/crawling' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-slate-800">Sensus Ekonomi</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-3">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-slate-600">Halo, {user?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-200">
                        <div className="px-4 py-3 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                                        link.active
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-3 border-t border-slate-200">
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-sm">© 2026 Sensus Ekonomi Crawling. BPS Lampung.</p>
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Tentang</a>
                            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-white transition-colors">Hubungi</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
