import SidebarLayout from '../Layouts/SidebarLayout';
import useAuthStore from '../stores/authStore';

export default function SensusEkonomi() {
    const { isAuthenticated, user } = useAuthStore();

    // Format role for display
    const formatRole = (role) => {
        const roles = {
            'admin': 'Administrator',
            'pegawai': 'Pegawai',
            'pelaku_usaha': 'Pelaku Usaha'
        };
        return roles[role] || role;
    };
    const objectives = [
        'Mengidentifikasi dan memetakan pelaku ekonomi digital di seluruh Indonesia',
        'Memperbarui data baseline pelaksanaan SENSUS EKONOMI 2026',
        'Mendeteksi pertumbuhan usaha berbasis platform digital',
        'Mengumpulkan data accurate untuk perencanaan pembangunan ekonomi',
    ];

    const indicators = [
        { label: 'Total Pedagang Digital', value: '2.5 juta+' },
        { label: 'Platform Marketplace', value: '15+' },
        { label: 'Kabupaten/Kota Coverage', value: '514' },
        { label: 'Kategori Produk', value: '1000+' },
    ];

    const stages = [
        {
            title: 'Persiapan',
            description: 'Penyiapan infrastruktur dan pelatihan petugas',
            date: 'Januari 2026',
        },
        {
            title: 'Pengumpulan Data',
            description: 'Crawling data dari berbagai marketplace digital',
            date: 'Februari - Maret 2026',
        },
        {
            title: 'Verifikasi',
            description: 'Validasi dan verifikasi data yang terkumpul',
            date: 'April 2026',
        },
        {
            title: 'Analisis',
            description: 'Pengolahan dan analisis data untuk laporan',
            date: 'Mei 2026',
        },
        {
            title: 'Publikasi',
            description: 'Publikasi hasil sensus ekonomi 2026',
            date: 'Juni 2026',
        },
    ];

    return (
        <SidebarLayout title="Sensus Ekonomi 2026">
            {/* Hero */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Sensus Ekonomi 2026
                    </h1>
                    <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                        Pemutakhiran data pelaku ekonomi digital di Indonesia melalui platform marketplace
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* About */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Apa itu Sensus Ekonomi 2026?</h2>
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            Sensus Ekonomi 2026 adalah kegiatan strategis Badan Pusat Statistik (BPS) untuk
                            memetakan dan mengidentifikasi pelaku ekonomi digital di Indonesia. Dengan kemajuan
                            teknologi dan perubahan perilaku konsumen, perdagangan digital telah menjadi bagian
                            penting dari ekonomi nasional.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Platform ini membantu mendeteksi dan mengumpulkan data dari berbagai marketplace
                            digital seperti Tokopedia, Shopee, Bukalapak, dan Lazada untuk memastikan
                            data sensus ekonomi akurat dan terkini.
                        </p>
                    </div>
                </div>

                {/* Objectives */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Tujuan Utama</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {objectives.map((objective, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-slate-100 flex items-start">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <span className="text-orange-600 font-bold">{index + 1}</span>
                                </div>
                                <p className="text-slate-700">{objective}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Indicators */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Target Indikator</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {indicators.map((indicator, index) => (
                            <div key={index} className="bg-gradient-to-br from-orange-50 to-orange-50 rounded-xl p-6 border border-orange-100 text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">{indicator.value}</div>
                                <div className="text-sm text-slate-600">{indicator.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stages */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Tahapan Pelaksanaan</h2>
                    <div className="space-y-4">
                        {stages.map((stage, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-slate-100 flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex items-center mb-4 md:mb-0">
                                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{stage.title}</h3>
                                        <p className="text-slate-600">{stage.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
                                        {stage.date}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA - Only show if not authenticated */}
                {!isAuthenticated && (
                    <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Siap Berontribusi?</h2>
                        <p className="text-orange-100 mb-6">
                            Mari bersama-sama mendukung Sensus Ekonomi 2026 dengan data yang akurat
                        </p>
                        <a
                            href="/login"
                            className="inline-block px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                        >
                            Login Sekarang
                        </a>
                    </div>
                )}

                {/* Welcome - Only show if authenticated */}
                {isAuthenticated && (
                    <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Selamat Datang, {user?.name || 'User'}!</h2>
                        <p className="text-orange-100 mb-6">
                            Anda sudah login sebagai {formatRole(user?.role)}. Mari berkontribusi untuk Sensus Ekonomi 2026!
                        </p>
                        {user?.role === 'pelaku_usaha' ? (
                            <a
                                href="/panduan"
                                className="inline-block px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                            >
                                Lihat Panduan
                            </a>
                        ) : (
                            <a
                                href="/crawling"
                                className="inline-block px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                            >
                                Mulai Crawling
                            </a>
                        )}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
