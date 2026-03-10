import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import useAuthStore from '../stores/authStore';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const { login, isLoading, error, isAuthenticated } = useAuthStore();

    // Redirect authenticated users to home
    useEffect(() => {
        if (isAuthenticated) {
            router.visit('/');
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            router.visit('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <div className="w-12 h-12 bg-orange-600 to-gradient-to-br from-orange-700 rounded-xl flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-slate-800">Sensus Ekonomi</span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Login</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                                placeholder="email@bps.go.id"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                                />
                                <span className="ml-2 text-sm text-slate-600">Ingat saya</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                            {isLoading ? 'Memproses...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-sm text-orange-600 hover:text-orange-700">
                            ← Kembali ke Beranda
                        </Link>
                    </div>

                    <div className="mt-6 text-center">
                        <span className="text-sm text-slate-600">Belum punya akun? </span>
                        <Link href="/register" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
