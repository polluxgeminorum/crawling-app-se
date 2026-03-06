import { useState } from 'react';
import SidebarLayout from '../Layouts/SidebarLayout';
import useAuthStore from '../stores/authStore';
import { Link } from '@inertiajs/react';

export default function Crawling() {
    const { isAuthenticated } = useAuthStore();
    const [selectedMarketplace, setSelectedMarketplace] = useState(null);
    const [crawlStatus, setCrawlStatus] = useState('idle'); // idle, running, completed
    const [progress, setProgress] = useState(0);

    const marketplaces = [
        { id: 'tokopedia', name: 'Tokopedia', logo: '🛒', color: 'bg-green-500', productCount: '2.5 juta+' },
        { id: 'shopee', name: 'Shopee', logo: '🛍️', color: 'bg-orange-500', productCount: '3 juta+' },
        { id: 'bukalapak', name: 'Bukalapak', logo: '📦', color: 'bg-purple-500', productCount: '1.2 juta+' },
        { id: 'lazada', name: 'Lazada', logo: '🏬', color: 'bg-blue-500', productCount: '800 ribu+' },
        { id: 'tokotalk', name: 'TokoTalk', logo: '💬', color: 'bg-pink-500', productCount: '500 ribu+' },
        { id: 'blibli', name: 'Blibli', logo: '🔵', color: 'bg-cyan-500', productCount: '600 ribu+' },
    ];

    const categories = [
        'Fashion', 'Elektronik', 'Handphone', 'Komputer', 'Makanan', 'Minuman',
        'Kesehatan', 'Beauty', 'Olahraga', 'Hobi', 'Rumah', 'Automotive'
    ];

    const handleStartCrawl = () => {
        if (!selectedMarketplace) return;
        
        setCrawlStatus('running');
        setProgress(0);
        
        // Simulate crawling progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setCrawlStatus('completed');
                    return 100;
                }
                return prev + 10;
            });
        }, 500);
    };

    const handleReset = () => {
        setSelectedMarketplace(null);
        setCrawlStatus('idle');
        setProgress(0);
    };

    if (!isAuthenticated) {
        return (
            <SidebarLayout title="Crawling">
                <div className="min-h-[60vh] flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Akses Ditolak</h2>
                        <p className="text-slate-600 mb-6">
                            Anda harus login terlebih dahulu untuk mengakses fitur crawling.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Login Sekarang
                        </Link>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout title="Crawling">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Crawling Marketplace</h1>
                    <p className="text-slate-600">
                        Pilih marketplace dan tentukan parameter untuk memulai crawling data pelaku ekonomi digital
                    </p>
                </div>

                {crawlStatus === 'idle' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Marketplace Selection */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Pilih Marketplace</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {marketplaces.map((marketplace) => (
                                        <button
                                            key={marketplace.id}
                                            onClick={() => setSelectedMarketplace(marketplace)}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                selectedMarketplace?.id === marketplace.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-12 h-12 ${marketplace.color} rounded-lg flex items-center justify-center text-xl`}>
                                                    {marketplace.logo}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{marketplace.name}</h3>
                                                    <p className="text-sm text-slate-500">~{marketplace.productCount} produk</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Parameters */}
                        <div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Parameter Crawling</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Kategori Produk
                                        </label>
                                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="">Semua Kategori</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Jumlah Maksimal Data
                                        </label>
                                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="100">100 data</option>
                                            <option value="500">500 data</option>
                                            <option value="1000">1.000 data</option>
                                            <option value="5000">5.000 data</option>
                                            <option value="10000">10.000 data</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Wilayah
                                        </label>
                                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="">Provinsi Lampung</option>
                                            <option value="kota-bandar-lampung">Kota Bandar Lampung</option>
                                            <option value="kota-metro">Kota Metro</option>
                                            <option value="lampung-barat">Kabupaten Lampung Barat</option>
                                            <option value="lampung-selatan">Kabupaten Lampung Selatan</option>
                                            <option value="lampung-tengah">Kabupaten Lampung Tengah</option>
                                            <option value="lampung-timur">Kabupaten Lampung Timur</option>
                                            <option value="lampung-utara">Kabupaten Lampung Utara</option>
                                            <option value="mesuji">Kabupaten Mesuji</option>
                                            <option value="pesawaran">Kabupaten Pesawaran</option>
                                            <option value="pesisir-barat">Kabupaten Pesisir Barat</option>
                                            <option value="pringsewu">Kabupaten Pringsewu</option>
                                            <option value="tanggamus">Kabupaten Tanggamus</option>
                                            <option value="tulang-bawang">Kabupaten Tulang Bawang</option>
                                            <option value="tulang-bawang-barat">Kabupaten Tulang Bawang Barat</option>
                                            <option value="way-kanan">Kabupaten Way Kanan</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleStartCrawl}
                                disabled={!selectedMarketplace}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                                    selectedMarketplace
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {selectedMarketplace ? 'Mulai Crawling' : 'Pilih Marketplace Dulu'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Running Status */}
                {crawlStatus === 'running' && (
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-6 relative">
                                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                <div 
                                    className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
                                ></div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                Sedang Melakukan Crawling...
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Mengambil data dari {selectedMarketplace?.name}
                            </p>

                            {/* Progress Bar */}
                            <div className="max-w-md mx-auto mb-6">
                                <div className="flex justify-between text-sm text-slate-600 mb-2">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                                    <div 
                                        className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="text-sm text-slate-500">
                                {progress < 50 ? 'Mengumpulkan data produk...' : 
                                 progress < 80 ? 'Memproses data...' : 
                                 'Menyimpan hasil...'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Completed Status */}
                {crawlStatus === 'completed' && (
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                Crawling Selesai!
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Data berhasil diambil dari {selectedMarketplace?.name}
                            </p>

                            <div className="bg-slate-50 rounded-xl p-4 mb-6 inline-block">
                                <div className="text-3xl font-bold text-blue-600">1,234</div>
                                <div className="text-sm text-slate-500">Data berhasil dikumpulkan</div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                                    Lihat Data
                                </button>
                                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
                                    Download Excel
                                </button>
                                <button 
                                    onClick={handleReset}
                                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                                >
                                    Crawling Lagi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
