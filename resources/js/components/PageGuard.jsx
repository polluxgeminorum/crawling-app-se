import { useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { checkPageAccess } from '../utils/roleCheck';

/**
 * PageGuard - A wrapper component that checks role-based access control
 * 
 * Usage:
 * <PageGuard allowedRoles={['admin', 'pegawai']}>
 *   <YourPageComponent />
 * </PageGuard>
 * 
 * Or use the route-based auto-check:
 * <PageGuard>
 *   <YourPageComponent />
 * </PageGuard>
 */
export default function PageGuard({ children, allowedRoles, fallbackUrl }) {
    const { url } = usePage();
    
    useEffect(() => {
        // Get the pathname without query string
        const pathname = url.split('?')[0];
        
        let redirectTo = null;
        
        if (allowedRoles) {
            // Manual role specification
            const { isAuthenticated, user } = require('../stores/authStore').default.getState();
            
            if (!isAuthenticated) {
                redirectTo = '/login';
            } else if (!allowedRoles.includes(user?.role)) {
                redirectTo = fallbackUrl || '/';
            }
        } else {
            // Auto-check based on PAGE_ROLES configuration
            const accessResult = checkPageAccess(pathname);
            redirectTo = accessResult.redirectTo;
        }
        
        if (redirectTo) {
            router.visit(redirectTo);
        }
    }, [url, allowedRoles, fallbackUrl]);
    
    return children;
}

/**
 * RequireAuth - A wrapper that requires authentication
 * Optionally specify allowed roles
 */
export function RequireAuth({ children, allowedRoles = null, redirectTo = '/login' }) {
    const { url } = usePage();
    
    useEffect(() => {
        const { isAuthenticated, user } = require('../stores/authStore').default.getState();
        
        if (!isAuthenticated) {
            router.visit(redirectTo);
            return;
        }
        
        if (allowedRoles && !allowedRoles.includes(user?.role)) {
            router.visit('/');
        }
    }, [url, allowedRoles, redirectTo]);
    
    return children;
}

/**
 * RequireGuest - A wrapper that requires user to NOT be authenticated
 * (e.g., for login/register pages)
 */
export function RequireGuest({ children, redirectTo = '/' }) {
    const { url } = usePage();
    
    useEffect(() => {
        const { isAuthenticated } = require('../stores/authStore').default.getState();
        
        if (isAuthenticated) {
            router.visit(redirectTo);
        }
    }, [url, redirectTo]);
    
    return children;
}
