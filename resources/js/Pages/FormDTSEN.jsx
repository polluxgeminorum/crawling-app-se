import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import SidebarLayout from '../Layouts/SidebarLayout';

// List of Lampung Regency/City
const KABUPATEN_KOTA_LAMPUNG = [
    { value: '', label: 'Pilih Kabupaten/Kota' },
    { value: 'Lampung Barat', label: 'Lampung Barat' },
    { value: 'Tanggamus', label: 'Tanggamus' },
    { value: 'Lampung Selatan', label: 'Lampung Selatan' },
    { value: 'Lampung Timur', label: 'Lampung Timur' },
    { value: 'Lampung Tengah', label: 'Lampung Tengah' },
    { value: 'Lampung Utara', label: 'Lampung Utara' },
    { value: 'Way Kanan', label: 'Way Kanan' },
    { value: 'Tulang Bawang', label: 'Tulang Bawang' },
    { value: 'Pesawaran', label: 'Pesawaran' },
    { value: 'Pringsewu', label: 'Pringsewu' },
    { value: 'Mesuji', label: 'Mesuji' },
    { value: 'Tulang Bawang Barat', label: 'Tulang Bawang Barat' },
    { value: 'Pesisir Barat', label: 'Pesisir Barat' },
    { value: 'Kota Bandar Lampung', label: 'Kota Bandar Lampung' },
    { value: 'Kota Metro', label: 'Kota Metro' },
];

export default function FormDTSEN() {
    const { token } = useAuthStore();
    
    const [formData, setFormData] = useState({
        no_kk: '',
        jenis_usaha: '',
        jenis_platform: '',
        kabupaten_kota: '',
        usaha_utama: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const jenisUsahaOptions = [
        'Perdagangan Online',
        'Jasa Digital',
        'Content Creator',
        'Usaha Lainnya'
    ];
    
    const platformOptions = [
        'Instagram',
        'Facebook Marketplace',
        'Tiktok Shop',
        'Shopee',
        'Tokopedia',
        'Google Maps',
        'Lainnya'
    ];
    
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('/api/dtsen', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setSuccess(true);
            }
            
            // Reset form
            setFormData({
                no_kk: '',
                jenis_usaha: '',
                jenis_platform: '',
                kabupaten_kota: '',
                usaha_utama: ''
            });
        } catch (err) {
            // Handle validation errors (422)
            if (err.response?.status === 422) {
                const validationErrors = err.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat().join(', ');
                setError(errorMessages);
            } else {
                setError(err.response?.data?.message || 'Gagal menyimpan data');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <SidebarLayout title="Form Pendekatan Ruta">
            {/* Toast Notification - Top Right */}
            {success && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div className="flex-1">
                            <p className="font-semibold">Berhasil!</p>
                            <p className="text-sm text-green-100">Data Pendekatan Ruta berhasil disimpan</p>
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Form Data Pendekatan Ruta</h2>
                    <p className="text-slate-600 mb-8">
                        Silakan isi data Pendekatan Ruta di bawah ini untuk mendukung Sensus Ekonomi 2026.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* No. KK */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                No. KK <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="no_kk"
                                value={formData.no_kk}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Masukkan Nomor KK"
                            />
                        </div>
                        
                        {/* Jenis Usaha */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Jenis Usaha <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="jenis_usaha"
                                value={formData.jenis_usaha}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">Pilih Jenis Usaha</option>
                                {jenisUsahaOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Jenis Platform - always visible */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Jenis Platform Digital
                            </label>
                            <select
                                name="jenis_platform"
                                value={formData.jenis_platform}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">Pilih Platform</option>
                                {platformOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Kabupaten/Kota */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Kabupaten/Kota
                            </label>
                            <select
                                name="kabupaten_kota"
                                value={formData.kabupaten_kota}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                {KABUPATEN_KOTA_LAMPUNG.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Usaha Utama */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Apakah usaha merupakan usaha utama atau sampingan? <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="usaha_utama"
                                        value="Ya"
                                        checked={formData.usaha_utama === 'Ya'}
                                        onChange={handleChange}
                                        required
                                        className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-slate-700">Ya (Usaha Utama)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="usaha_utama"
                                        value="Tidak"
                                        checked={formData.usaha_utama === 'Tidak'}
                                        onChange={handleChange}
                                        required
                                        className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-slate-700">Tidak (Usaha Sampingan)</span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    no_kk: '',
                                    jenis_usaha: '',
                                    jenis_platform: '',
                                    usaha_utama: ''
                                })}
                                className="px-6 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
