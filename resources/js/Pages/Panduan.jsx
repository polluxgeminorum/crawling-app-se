import SidebarLayout from '../Layouts/SidebarLayout';

export default function Panduan() {
    const steps = [
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

    const tips = [
        'Pastikan koneksi internet stabil saat melakukan crawling',
        'Gunakan filter kategori untuk hasil yang lebih relevan',
        'Periksa secara berkala data yang sudah di-crawl',
        'Backup data secara rutin untuk keamanan',
    ];

    return (
        <SidebarLayout title="Panduan">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Panduan Penggunaan</h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Pelajari cara menggunakan sistem crawling untuk mendeteksi pelaku ekonomi digital
                    </p>
                </div>

                {/* Steps */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Langkah-langkah</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full" />
                                <div className="relative">
                                    <span className="text-5xl font-bold text-blue-100">{step.number}</span>
                                    <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{step.title}</h3>
                                    <p className="text-slate-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
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

                {/* FAQ Preview */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Pertanyaan Umum</h2>
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-2">Apakah data crawling aman?</h3>
                            <p className="text-slate-600">Ya, semua data disimpan dengan aman dan hanya dapat diakses oleh user yang berwenang.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-2">Berapa banyak data yang bisa di-crawl?</h3>
                            <p className="text-slate-600">Tergantung dari parameter yang dipilih. Sistem dirancang untuk menangani data dalam jumlah besar.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-2">Bagaimana jika terjadi error saat crawling?</h3>
                            <p className="text-slate-600">Sistem akan otomatis menyimpan progres dan memungkinkan Anda untuk melanjutkan atau memulai ulang.</p>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
