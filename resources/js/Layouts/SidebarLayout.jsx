import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
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
import { checkPageAccess } from '../utils/roleCheck';

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
    { name: 'Tentang', href: '/tentang', icon: DocumentTextIcon },
    { name: 'Sensus Ekonomi 2026', href: '/sensus-ekonomi', icon: ChartBarIcon },
    { name: 'Crawling', href: '/crawling', icon: ChartBarIcon },
    { name: 'Panduan', href: '/panduan', icon: DocumentTextIcon },
    { name: 'Log Aktivitas', href: '/activity-log', icon: ClockIcon },
    { name: 'Kelola User', href: '/tabel-user', icon: Cog6ToothIcon },
];

export default function SidebarLayout({ children, title = 'Sensus Ekonomi' }) {
    const { user, isAuthenticated, logout, checkAuth, token, canAccessCrawl, canAccessLogActivity, canAccessUserManagement, canAccessTable, canAccessForm } = useAuthStore();
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

    // Check page access and redirect if needed
    useEffect(() => {
        const pathname = currentPath.split('?')[0];
        const accessResult = checkPageAccess(pathname);
        
        if (accessResult.redirectTo) {
            window.location.href = accessResult.redirectTo;
        }
    }, [currentPath]);

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
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
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
                        {/* UMUM Section - visible to all */}
                        <div className="mb-4">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Umum
                            </p>
                        </div>
                        <Link
                            href="/"
                            className={`
                                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                ${currentPath === '/' 
                                    ? 'bg-orange-50 text-orange-600' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                            onClick={() => setMobileOpen(false)}
                        >
                            <HomeIcon className={`w-5 h-5 mr-3 ${currentPath === '/' ? 'text-orange-600' : 'text-gray-400'}`} />
                            Beranda
                        </Link>

                        <Link
                            href="/tentang"
                            className={`
                                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                ${currentPath.startsWith('/tentang') 
                                    ? 'bg-orange-50 text-orange-600' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                            onClick={() => setMobileOpen(false)}
                        >
                            <DocumentTextIcon className={`w-5 h-5 mr-3 ${currentPath.startsWith('/tentang') ? 'text-orange-600' : 'text-gray-400'}`} />
                            Tentang
                        </Link>

                        <Link
                            href="/panduan"
                            className={`
                                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                ${currentPath.startsWith('/panduan') 
                                    ? 'bg-orange-50 text-orange-600' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                            onClick={() => setMobileOpen(false)}
                        >
                            <DocumentTextIcon className={`w-5 h-5 mr-3 ${currentPath.startsWith('/panduan') ? 'text-orange-600' : 'text-gray-400'}`} />
                            Panduan
                        </Link>

                        {/* FITUR Section - only for authenticated users */}
                        {isAuthenticated && (
                            <>
                                <div className="mt-6 mb-4">
                                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Fitur
                                    </p>
                                </div>

                                {/* Prelist Dropdown */}
                                {canAccessForm() && (
                                    <div>
                                        <button
                                            onClick={() => setPrelistOpen(!prelistOpen)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                                currentPath.startsWith('/form-prelist') || currentPath.startsWith('/tabel-prelist')
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <span className="flex items-center">
                                                <DocumentTextIcon className="w-5 h-5 mr-3 text-gray-400" />
                                                Prelist
                                            </span>
                                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${prelistOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {prelistOpen && (
                                            <div className="ml-8 mt-1 space-y-1">
                                                <Link
                                                    href="/form-prelist"
                                                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                        currentPath === '/form-prelist'
                                                            ? 'bg-orange-50 text-orange-600'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    Form Prelist
                                                </Link>
                                                {canAccessTable() && (
                                                    <Link
                                                        href="/tabel-prelist"
                                                        className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            currentPath === '/tabel-prelist'
                                                                ? 'bg-orange-50 text-orange-600'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                        onClick={() => setMobileOpen(false)}
                                                    >
                                                        Tabel Prelist
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Snowball Dropdown */}
                                {canAccessForm() && (
                                    <div className="mt-1">
                                        <button
                                            onClick={() => setSnowballOpen(!snowballOpen)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                                currentPath.startsWith('/form-snowball') || currentPath.startsWith('/tabel-snowball')
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <span className="flex items-center">
                                                <DocumentTextIcon className="w-5 h-5 mr-3 text-gray-400" />
                                                Snowball
                                            </span>
                                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${snowballOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {snowballOpen && (
                                            <div className="ml-8 mt-1 space-y-1">
                                                <Link
                                                    href="/form-snowball"
                                                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                        currentPath === '/form-snowball'
                                                            ? 'bg-orange-50 text-orange-600'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    Form Snowball
                                                </Link>
                                                {canAccessTable() && (
                                                    <Link
                                                        href="/tabel-snowball"
                                                        className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            currentPath === '/tabel-snowball'
                                                                ? 'bg-orange-50 text-orange-600'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                        onClick={() => setMobileOpen(false)}
                                                    >
                                                        Tabel Snowball
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Crawling - only for Admin and Pegawai */}
                                {canAccessCrawl() && (
                                    <Link
                                        href="/crawling"
                                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors mt-1
                                            ${currentPath.startsWith('/crawling') 
                                                ? 'bg-orange-50 text-orange-600' 
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                        `}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <ChartBarIcon className={`w-5 h-5 mr-3 ${currentPath.startsWith('/crawling') ? 'text-orange-600' : 'text-gray-400'}`} />
                                        Crawling
                                    </Link>
                                )}

                                {/* ADMINISTRASI Section - only for Admin */}
                                {canAccessLogActivity() && (
                                    <>
                                        <div className="mt-6 mb-4">
                                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                Administrasi
                                            </p>
                                        </div>
                                        <Link
                                            href="/activity-log"
                                            className={`
                                                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                                ${currentPath.startsWith('/activity-log') 
                                                    ? 'bg-orange-50 text-orange-600' 
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }
                                            `}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <ClockIcon className={`w-5 h-5 mr-3 ${currentPath.startsWith('/activity-log') ? 'text-orange-600' : 'text-gray-400'}`} />
                                            Log Aktivitas
                                        </Link>
                                        <Link
                                            href="/tabel-user"
                                            className={`
                                                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                                ${currentPath.startsWith('/tabel-user') 
                                                    ? 'bg-orange-50 text-orange-600' 
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }
                                            `}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <Cog6ToothIcon className={`w-5 h-5 mr-3 ${currentPath.startsWith('/tabel-user') ? 'text-orange-600' : 'text-gray-400'}`} />
                                            Kelola User
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </nav>

                    {/* User section */}
                    <div className="border-t border-gray-200 p-4">
                        {isAuthenticated && user ? (
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-orange-600">
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
                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
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
                                    className="text-sm text-orange-600 hover:text-orange-700"
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
