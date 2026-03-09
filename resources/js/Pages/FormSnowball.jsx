import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import SidebarLayout from '../Layouts/SidebarLayout';

export default function FormSnowball() {
    const { token, isAuthenticated } = useAuthStore();
    const [formData, setFormData] = useState({
        nama_keluarga_bangunan_usaha: '',
        nama_pengisi: '',
        no_telp: '',
        email: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        if (!isAuthenticated || !token) {
            router.visit('/login');
        }
    }, [isAuthenticated, token]);

    // Auto-hide success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post('/api/snowball', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSuccess(true);
                // Reset form
                setFormData({
                    nama_keluarga_bangunan_usaha: '',
                    nama_pengisi: '',
                    no_telp: '',
                    email: '',
                });
            }
        } catch (err) {
            // Handle validation errors (422)
            if (err.response?.status === 422) {
                const validationErrors = err.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat().join(', ');
                setError(errorMessages);
            } else {
                setError(err.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SidebarLayout title="Form Data Snowball">
            {/* Toast Notification - Top Right */}
            {success && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div className="flex-1">
                            <p className="font-semibold">Berhasil!</p>
                            <p className="text-sm text-green-100">Data snowball berhasil disimpan</p>
                        </div>
                        <button 
                            onClick={() => setSuccess(false)}
                            className="text-green-100 hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Pelaku Usaha Lain</h2>
                    <p className="text-slate-600 mb-8">
                        Bantu kami menemukan pelaku usaha lain yang mungkin dapat dimintai datanya untuk Sensus Ekonomi 2026.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nama Pelaku Usaha / Keluarga *
                            </label>
                            <input
                                type="text"
                                name="nama_keluarga_bangunan_usaha"
                                value={formData.nama_keluarga_bangunan_usaha}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                                placeholder="Nama pelaku usaha yang Anda ketahui"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nama Pengisi / Kontak *
                            </label>
                            <input
                                type="text"
                                name="nama_pengisi"
                                value={formData.nama_pengisi}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                                placeholder="Nama orang yang bisa dihubungi"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                No. Telepon
                            </label>
                            <input
                                type="text"
                                name="no_telp"
                                value={formData.no_telp}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                                placeholder="Nomor telepon yang bisa dihubungi"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                                placeholder="Alamat email yang bisa dihubungi"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors shadow-md"
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="text-center">
                            <Link
                                href="/form-prelist"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                ← Kembali ke Form Data Pelaku Usaha
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
