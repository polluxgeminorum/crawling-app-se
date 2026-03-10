import SidebarLayout from '../Layouts/SidebarLayout';
import useAuthStore from '../stores/authStore';

export default function Panduan() {
    const { isAuthenticated, user } = useAuthStore();
    
    // Determine user role
    const userRole = isAuthenticated && user ? user.role : 'guest';
    
    // Steps for different roles
    const guestSteps = [
        {
            number: '01',
            title: 'Registrasi Akun',
            description: 'Klik tombol Daftar dan isi formulir registrasi dengan data yang valid.',
        },
        {
            number: '02',
            title: 'Login ke Sistem',
            description: 'Masukkan email dan password yang sudah terdaftar untuk mengakses sistem.',
        },
        {
            number: '03',
            title: 'Isi Form Prelist',
            description: 'Setelah login, isi formulir prelist untuk mendaftarkan pelaku ekonomi digital.',
        },
        {
            number: '04',
            title: 'Isi Form Snowball',
            description: 'Lanjutkan dengan mengisi formulir snowball untuk mendeteksi lebih banyak pelaku ekonomi.',
        },
    ];
    
    const crawlingSteps = [
        {
            number: '01',
            title: 'Login ke Sistem',
            description: 'Masukkan email dan password yang sudah terdaftar untuk mengakses sistem.',
        },
        {
            number: '02',
            title: 'Pilih Marketplace',
            description: 'Pilih marketplace yang akan di-crawl seperti Tokopedia, Shopee, Bukalapak, atau Lazada.',
        },
        {
            number: '03',
            title: 'Tentukan Parameter',
            description: 'Atur parameter crawling seperti kategori produk, wilayah, dan jumlah data yang diinginkan.',
        },
        {
            number: '04',
            title: 'Mulai Crawling',
            description: 'Klik tombol mulai dan tunggu proses crawling selesai. Data akan otomatis tersimpan.',
        },
        {
            number: '05',
            title: 'Export Data',
            description: 'Export data hasil crawling ke format Excel atau CSV untuk dianalisis lebih lanjut.',
        },
    ];
    
    const tableSupervisionSteps = [
        {
            number: '01',
            title: 'Akses Tabel Data',
            description: 'Di menu navigasi, pilih Tabel Prelist atau Tabel Snowball untuk melihat data.',
        },
        {
            number: '02',
            title: 'Filter dan Pencarian',
            description: 'Gunakan fitur filter untuk mencari data spesifik berdasarkan kriteria yang diinginkan.',
        },
        {
            number: '03',
            title: 'Edit Data',
            description: 'Klik tombol edit pada baris data yang ingin diubah untuk memperbarui informasi.',
        },
        {
            number: '04',
            title: 'Hapus Data',
            description: 'Hapus data yang tidak valid atau duplikat dengan tombol hapus.',
        },
        {
            number: '05',
            title: 'Export Data',
            description: 'Export data ke format Excel untuk laporan dan analisis lebih lanjut.',
        },
    ];
    
    const adminSupervisionSteps = [
        {
            number: '01',
            title: 'Log Aktivitas',
            description: 'Pantau semua aktivitas user dalam sistem melalui menu Log Aktivitas.',
        },
        {
            number: '02',
            title: 'Pengawasan User',
            description: 'Kelola semua user yang terdaftar melalui menu Kelola User.',
        },
        {
            number: '03',
            title: 'Edit Hak Akses',
            description: 'Ubah role user (admin, pegawai, pelaku_usaha) sesuai kebutuhan.',
        },
        {
            number: '04',
            title: 'Nonaktifkan User',
            description: 'Nonaktifkan user yang tidak aktif atau melanggar aturan sistem.',
        },
    ];
    
    const tips = [
        'Pastikan koneksi internet stabil saat melakukan crawling',
        'Gunakan filter kategori untuk hasil yang lebih relevan',
        'Periksa secara berkala data yang sudah di-crawl',
        'Backup data secara rutin untuk keamanan',
    ];
    
    // Render different content based on role
    const renderContent = () => {
        if (userRole === 'guest') {
            return (
                <>
                    {/* Header for Guest */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Panduan Registrasi & Login</h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Pelajari cara daftar dan login untuk mengisi formulir prelist dan snowball
                        </p>
                    </div>
                    
                    {/* Guest Steps */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Langkah-langkah</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {guestSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full" />
                                    <div className="relative">
                                        <span className="text-5xl font-bold text-orange-100">{step.number}</span>
                                        <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{step.title}</h3>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* CTA for Guest */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-50 rounded-2xl p-8 border border-orange-100 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Siap Untuk Mulai?</h2>
                        <p className="text-slate-600 mb-6">Daftar sekarang untuk mengisi formulir prelist dan snowball</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/register"
                                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold rounded-xl transition-all shadow-lg"
                            >
                                Daftar Sekarang
                            </a>
                            <a
                                href="/login"
                                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 text-lg font-semibold rounded-xl transition-all border border-slate-200"
                            >
                                Login
                            </a>
                        </div>
                    </div>
                </>
            );
        } else if (userRole === 'pegawai') {
            return (
                <>
                    {/* Header for Pegawai */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Panduan Penggunaan</h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Pelajari cara menggunakan sistem crawling dan pengawasan tabel
                        </p>
                    </div>
                    
                    {/* Crawling Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Panduan Crawling</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {crawlingSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full" />
                                    <div className="relative">
                                        <span className="text-5xl font-bold text-orange-100">{step.number}</span>
                                        <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{step.title}</h3>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Table Supervision Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Panduan Pengawasan Tabel</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tableSupervisionSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full" />
                                    <div className="relative">
                                        <span className="text-5xl font-bold text-green-100">{step.number}</span>
                                        <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{step.title}</h3>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Tips */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-50 rounded-2xl p-8 border border-orange-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Tips Penting</h2>
                        <ul className="space-y-4">
                            {tips.map((tip, index) => (
                                <li key={index} className="flex items-start">
                                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-700">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            );
        } else if (userRole === 'admin') {
            return (
                <>
                    {/* Header for Admin */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Panduan Administrator</h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Pelajari cara mengelola sistem, user, dan aktivitas
                        </p>
                    </div>
                    
                    {/* Crawling Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Panduan Crawling</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {crawlingSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full" />
                                    <div className="relative">
                                        <span className="text-5xl font-bold text-orange-100">{step.number}</span>
                                        <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{step.title}</h3>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Table Supervision Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Panduan Pengawasan Tabel</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tableSupervisionSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full" />
                                    <div className="relative">
                                        <span className="text-5xl font-bold text-green-100">{step.number}</span>
                                        <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{step.title}</h3>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Admin Supervision Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Panduan Pengawasan Admin</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {adminSupervisionSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full" />
                                    <div className="relative">
                                        <span className="text-5xl font-bold text-purple-100">{step.number}</span>
                                        <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{step.title}</h3>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Tips */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-50 rounded-2xl p-8 border border-orange-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Tips Penting</h2>
                        <ul className="space-y-4">
                            {tips.map((tip, index) => (
                                <li key={index} className="flex items-start">
                                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-700">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            );
        } else {
            // pelaku_usaha - show registration guide
            return (
                <>
                    {/* Header for Pelaku Usaha */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Panduan Pelaku Usaha</h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Pelajari cara mengisi formulir prelist dan snowball
                        </p>
                    </div>
                    
                    {/* Form Steps for Pelaku Usaha */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Langkah-langkah Mengisi Formulir</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {guestSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full" />
                                    <div className="relative">
                                        <span className="text-5xl font-bold text-orange-100">{step.number}</span>
                                        <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{step.title}</h3>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-50 rounded-2xl p-8 border border-orange-100 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Siap Untuk Mengisi?</h2>
                        <p className="text-slate-600 mb-6">Isi formulir prelist dan snowball sekarang</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/form-prelist"
                                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold rounded-xl transition-all shadow-lg"
                            >
                                Isi Form Prelist
                            </a>
                            <a
                                href="/form-snowball"
                                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 text-lg font-semibold rounded-xl transition-all border border-slate-200"
                            >
                                Isi Form Snowball
                            </a>
                        </div>
                    </div>
                </>
            );
        }
    };
    
    return (
        <SidebarLayout title="Panduan">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {renderContent()}
            </div>
        </SidebarLayout>
    );
}
