import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    ChartBarIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowLeftOnRectangleIcon,
    ChevronDownIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';

const prelistMenu = [
    { name: 'Form Prelist', href: '/form-prelist' },
    { name: 'Tabel Prelist', href: '/tabel-prelist' },
];

const snowballMenu = [
    { name: 'Form Snowball', href: '/form-snowball' },
    { name: 'Tabel Snowball', href: '/tabel-snowball' },
];

const navigation = [
    { name: 'Beranda', href: '/', icon: HomeIcon },
    { name: 'Sensus Ekonomi 2026', href: '/sensus-ekonomi', icon: ChartBarIcon },
    { name: 'Crawling', href: '/crawling', icon: ChartBarIcon },
    { name: 'Panduan', href: '/panduan', icon: DocumentTextIcon },
    { name: 'Log Aktivitas', href: '/activity-log', icon: ClockIcon },
    { name: 'Kelola User', href: '/tabel-user', icon: Cog6ToothIcon },
];

export default function SidebarLayout({ children, title = 'Sensus Ekonomi' }) {
    const { user, isAuthenticated, logout, checkAuth, token } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [prelistOpen, setPrelistOpen] = useState(false);
    const [snowballOpen, setSnowballOpen] = useState(false);
    const currentPath = window.location.pathname;

    // Only check auth on mount if token exists, but don't clear on failure
    useEffect(() => {
        if (token && !user) {
            checkAuth();
        }
    }, []);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                                <ChartBarIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">Sensus Ekonomi</span>
                        </div>
                        <button 
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = item.href === '/' 
                                ? currentPath === '/' 
                                : currentPath.startsWith(item.href);
                            
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                        ${isActive 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}

                        {/* Prelist Dropdown */}
                        <div>
                            <button
                                onClick={() => setPrelistOpen(!prelistOpen)}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                            >
                                <span className="flex items-center">
                                    <DocumentTextIcon className="w-5 h-5 mr-3 text-gray-400" />
                                    Prelist
                                </span>
                                <ChevronDownIcon className={`w-4 h-4 transition-transform ${prelistOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {prelistOpen && (
                                <div className="ml-8 mt-1 space-y-1">
                                    {prelistMenu.map((item) => {
                                        const isActive = currentPath === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`
                                                    block px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                                    ${isActive 
                                                        ? 'bg-blue-50 text-blue-600' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }
                                                `}
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Snowball Dropdown */}
                        <div>
                            <button
                                onClick={() => setSnowballOpen(!snowballOpen)}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                            >
                                <span className="flex items-center">
                                    <DocumentTextIcon className="w-5 h-5 mr-3 text-gray-400" />
                                    Snowball
                                </span>
                                <ChevronDownIcon className={`w-4 h-4 transition-transform ${snowballOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {snowballOpen && (
                                <div className="ml-8 mt-1 space-y-1">
                                    {snowballMenu.map((item) => {
                                        const isActive = currentPath === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`
                                                    block px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                                    ${isActive 
                                                        ? 'bg-blue-50 text-blue-600' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }
                                                `}
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* User section */}
                    <div className="border-t border-gray-200 p-4">
                        {isAuthenticated && user ? (
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-blue-600">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className={`${sidebarOpen ? 'lg:pl-64' : ''} flex flex-col min-h-screen transition-all duration-300`}>
                {/* Top header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-x-4">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-700">Halo, {user?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
