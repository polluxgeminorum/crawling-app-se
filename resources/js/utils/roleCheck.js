/**
 * Role-based access control utility
 * 
 * Role permissions:
 * - Guest (not authenticated): Beranda, SensusEkonomi, Panduan
 * - PelakuUsaha: Beranda, SensusEkonomi, Panduan, FormCrowdlisting, FormSnowball
 * - Pegawai: Beranda, SensusEkonomi, Panduan, Crawl, TabelCrowdlisting, TabelSnowball, FormCrowdlisting, FormSnowball
 * - Admin: All pages + ActivityLog
 */

import useAuthStore from '../stores/authStore';

// Define page access by role
export const PAGE_ROLES = {
    // Pages accessible by everyone (including guests)
    '/': ['guest', 'pelaku_usaha', 'pegawai', 'admin'],
    '/panduan': ['guest', 'pelaku_usaha', 'pegawai', 'admin'],
    '/tentang': ['guest', 'pelaku_usaha', 'pegawai', 'admin'],
    
    // Pages accessible by authenticated users (pelaku_usaha, pegawai, admin)
    '/form-crowdlisting': ['pelaku_usaha', 'pegawai', 'admin'],
    '/form-snowball': ['pelaku_usaha', 'pegawai', 'admin'],
    
    // Pages accessible by Pegawai and Admin only
    '/crawling': ['pegawai', 'admin'],
    '/tabel-crowdlisting': ['pegawai', 'admin'],
    '/tabel-snowball': ['pegawai', 'admin'],
    '/tabel-dtsen': ['pegawai', 'admin'],
    '/form-dtsen': ['pegawai', 'admin'],
    
    // Pages accessible by Admin only
    '/activity-log': ['admin'],
    '/tabel-user': ['admin'],
};

/**
 * Check if current user can access a specific page
 * @param {string} pathname - The page pathname to check
 * @returns {object} - { allowed: boolean, redirectTo: string|null }
 */
export const checkPageAccess = (pathname) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    
    // Get the allowed roles for this page
    const allowedRoles = PAGE_ROLES[pathname];
    
    // If page is not in the list, allow access (or could be more strict)
    if (!allowedRoles) {
        return { allowed: true, redirectTo: null };
    }
    
    // Determine user role
    let userRole = 'guest';
    if (isAuthenticated && user) {
        userRole = user.role;
    }
    
    // Check if user role is allowed
    if (allowedRoles.includes(userRole)) {
        return { allowed: true, redirectTo: null };
    }
    
    // User is not allowed - determine redirect
    if (!isAuthenticated) {
        // Not logged in - redirect to login
        return { allowed: false, redirectTo: '/login' };
    } else {
        // Logged in but wrong role - redirect to beranda
        return { allowed: false, redirectTo: '/' };
    }
};

/**
 * Get navigation links based on user role
 * @returns {Array} - Array of navigation link objects
 */
export const getNavLinksByRole = () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    
    // Base links for everyone
    const links = [
        { name: 'Beranda', href: '/', active: false },
        { name: 'Tentang', href: '/tentang', active: false },
        { name: 'Panduan', href: '/panduan', active: false },
    ];
    
    // Determine user role
    let userRole = 'guest';
    if (isAuthenticated && user) {
        userRole = user.role;
    }
    
    // Add role-specific links
    if (userRole === 'pelaku_usaha' || userRole === 'pegawai' || userRole === 'admin') {
        links.push({ name: 'Form Pendekatan Usaha', href: '/form-crowdlisting', active: false });
        links.push({ name: 'Form Snowball', href: '/form-snowball', active: false });
    }
    
    if (userRole === 'pegawai' || userRole === 'admin') {
        links.push({ name: 'Crawling', href: '/crawling', active: false });
        links.push({ name: 'Tabel Pendekatan Usaha', href: '/tabel-crowdlisting', active: false });
        links.push({ name: 'Tabel Snowball', href: '/tabel-snowball', active: false });
        links.push({ name: 'Tabel Pendekatan Ruta', href: '/tabel-dtsen', active: false });
    }
    
    if (userRole === 'admin') {
        links.push({ name: 'Log Aktivitas', href: '/activity-log', active: false });
        links.push({ name: 'Kelola User', href: '/tabel-user', active: false });
    }
    
    return links;
};

/**
 * Get breadcrumbs for current page
 * @param {string} pathname - Current page pathname
 * @returns {Array} - Array of breadcrumb objects
 */
export const getBreadcrumbs = (pathname) => {
    const breadcrumbs = {
        '/': [{ name: 'Beranda', href: '/' }],
        '/tentang': [
            { name: 'Beranda', href: '/' },
            { name: 'Tentang', href: '/tentang' }
        ],
        '/panduan': [
            { name: 'Beranda', href: '/' },
            { name: 'Panduan', href: '/panduan' }
        ],
        '/form-crowdlisting': [
            { name: 'Beranda', href: '/' },
            { name: 'Form Pendekatan Usaha', href: '/form-crowdlisting' }
        ],
        '/form-snowball': [
            { name: 'Beranda', href: '/' },
            { name: 'Form Snowball', href: '/form-snowball' }
        ],
        '/crawling': [
            { name: 'Beranda', href: '/' },
            { name: 'Crawling', href: '/crawling' }
        ],
        '/tabel-crowdlisting': [
            { name: 'Beranda', href: '/' },
            { name: 'Tabel Pendekatan Usaha', href: '/tabel-crowdlisting' }
        ],
        '/tabel-snowball': [
            { name: 'Beranda', href: '/' },
            { name: 'Tabel Snowball', href: '/tabel-snowball' }
        ],
        '/tabel-dtsen': [
            { name: 'Beranda', href: '/' },
            { name: 'Tabel Pendekatan Ruta', href: '/tabel-dtsen' }
        ],
        '/form-dtsen': [
            { name: 'Beranda', href: '/' },
            { name: 'Form Pendekatan Ruta', href: '/form-dtsen' }
        ],
        '/activity-log': [
            { name: 'Beranda', href: '/' },
            { name: 'Log Aktivitas', href: '/activity-log' }
        ],
        '/tabel-user': [
            { name: 'Beranda', href: '/' },
            { name: 'Kelola User', href: '/tabel-user' }
        ],
    };
    
    return breadcrumbs[pathname] || [{ name: 'Beranda', href: '/' }];
};

/**
 * Check if user can access specific feature
 */
export const canAccess = {
    crawl: () => {
        const { isAuthenticated, user } = useAuthStore.getState();
        return isAuthenticated && user && ['pegawai', 'admin'].includes(user.role);
    },
    table: () => {
        const { isAuthenticated, user } = useAuthStore.getState();
        return isAuthenticated && user && ['pegawai', 'admin'].includes(user.role);
    },
    form: () => {
        const { isAuthenticated, user } = useAuthStore.getState();
        return isAuthenticated && user && ['pelaku_usaha', 'pegawai', 'admin'].includes(user.role);
    },
    dtsen: () => {
        const { isAuthenticated, user } = useAuthStore.getState();
        return isAuthenticated && user && ['pegawai', 'admin'].includes(user.role);
    },
    logActivity: () => {
        const { isAuthenticated, user } = useAuthStore.getState();
        return isAuthenticated && user && user.role === 'admin';
    },
    userManagement: () => {
        const { isAuthenticated, user } = useAuthStore.getState();
        return isAuthenticated && user && user.role === 'admin';
    },
};

export default {
    checkPageAccess,
    getNavLinksByRole,
    getBreadcrumbs,
    canAccess,
    PAGE_ROLES,
};
