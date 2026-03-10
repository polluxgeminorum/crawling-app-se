import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/login', {
                email,
                password,
            });

            const { user, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    logout: async () => {
        try {
            await axios.post('/api/logout', {}, {
                headers: { Authorization: `Bearer ${get().token}` },
            });
        } catch (error) {
            // Continue with logout even if API fails
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthenticated: false });
            return;
        }

        try {
            const response = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },

    // Role-based access control methods
    getRole: () => {
        const { user } = get();
        return user?.role || 'guest';
    },

    isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
    },

    isPegawai: () => {
        const { user } = get();
        return user?.role === 'pegawai';
    },

    isPelakuUsaha: () => {
        const { user } = get();
        return user?.role === 'pelaku_usaha';
    },

    isGuest: () => {
        const { isAuthenticated } = get();
        return !isAuthenticated;
    },

    canAccessCrawl: () => {
        const { user, isAuthenticated } = get();
        return isAuthenticated && (user?.role === 'admin' || user?.role === 'pegawai');
    },

    canAccessTable: () => {
        const { user, isAuthenticated } = get();
        return isAuthenticated && (user?.role === 'admin' || user?.role === 'pegawai');
    },

    canAccessForm: () => {
        const { user, isAuthenticated } = get();
        return isAuthenticated && (user?.role === 'admin' || user?.role === 'pegawai' || user?.role === 'pelaku_usaha');
    },

    canAccessLogActivity: () => {
        const { user, isAuthenticated } = get();
        return isAuthenticated && user?.role === 'admin';
    },

    canAccessUserManagement: () => {
        const { user, isAuthenticated } = get();
        return isAuthenticated && user?.role === 'admin';
    },
}));

export default useAuthStore;
