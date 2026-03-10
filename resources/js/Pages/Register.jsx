import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [no_telp, setNoTelp] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('pelaku_usaha');
    const [nip, setNip] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { isAuthenticated } = useAuthStore();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.visit('/');
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await axios.post('/api/register', {
                name,
                email,
                no_telp,
                password,
                password_confirmation: passwordConfirmation,
                role,
                nip: role === 'pegawai' ? nip : null,
            });

            setSuccess(true);
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.visit('/login');
            }, 2000);
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Registrasi gagal';
            setError(message);
        } finally {
            setIsLoading(false);
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

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Daftar Akun</h2>
                    <p className="text-slate-600 mb-6">Buat akun untuk mengakses sistem crawling</p>

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">Registrasi berhasil! Redirect ke halaman login...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Daftar Sebagai
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('pelaku_usaha')}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        role === 'pelaku_usaha'
                                            ? 'border-orange-600 bg-orange-50 text-orange-700'
                                            : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="font-medium">Pelaku Usaha</div>
                                    <div className="text-xs mt-1">UMKM/Toko Online</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('pegawai')}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        role === 'pegawai'
                                            ? 'border-orange-600 bg-orange-50 text-orange-700'
                                            : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="font-medium">Pegawai</div>
                                    <div className="text-xs mt-1">Petugas BPS</div>
                                </button>
                            </div>
                        </div>

                        {/* NIP - Only for Pegawai */}
                        {role === 'pegawai' && (
                            <div>
                                <label htmlFor="nip" className="block text-sm font-medium text-slate-700 mb-2">
                                    NIP
                                </label>
                                <input
                                    id="nip"
                                    type="text"
                                    value={nip}
                                    onChange={(e) => setNip(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                                    placeholder="Masukkan NIP"
                                    required={role === 'pegawai'}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                        </div>

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
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="no_telp" className="block text-sm font-medium text-slate-700 mb-2">
                                No. Telepon
                            </label>
                            <input
                                id="no_telp"
                                type="tel"
                                value={no_telp}
                                onChange={(e) => setNoTelp(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                                placeholder="Contoh: 081234567890"
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
                                placeholder="Min. 8 karakter"
                                minLength={8}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 mb-2">
                                Konfirmasi Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                                placeholder="Masukkan password lagi"
                                minLength={8}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                            {isLoading ? 'Memproses...' : 'Daftar'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-sm text-slate-600">Sudah punya akun? </span>
                        <Link href="/login" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                            Login
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Data akan disimpan di database db_crawl_se
                </p>
            </div>
        </div>
    );
}
