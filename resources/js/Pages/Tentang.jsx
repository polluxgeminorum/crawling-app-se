import SidebarLayout from '../Layouts/SidebarLayout';
import useAuthStore from '../stores/authStore';

export default function Tentang() {
    const { isAuthenticated, user } = useAuthStore();

    const tentangPlatform = [
        {
            icon: '📈',
            title: 'Ekonomi Digital Tumbuh Pesat',
            description: 'Ekonomi digital tumbuh sangat pesat. Pelaku usaha berbasis digital terus bertambah signifikan, namun belum sepenuhnya tercatat dalam data statistik formal BPS.',
        },
        {
            icon: '🗺️',
            title: 'Data Akurat, Kebijakan Tepat',
            description: 'Data tidak akurat = kebijakan tidak tepat sasaran. Tanpa data pelaku digital yang lengkap, pemerintah kesulitan merancang program pemberdayaan UMKM digital yang efektif.',
        },
        {
            icon: '🔍',
            title: 'Sensus Ekonomi Wajib Mencakup Semua',
            description: 'Amanat UU No. 16 Tahun 1997 tentang Statistik mengharuskan setiap kegiatan ekonomi terdata — termasuk yang berbasis digital.',
        },
        {
            icon: '⚡',
            title: 'Teknologi sebagai Solusi',
            description: 'Platform ini hadir untuk menjembatani kesenjangan data dengan memanfaatkan teknologi informasi modern secara efisien dan akurat.',
        },
    ];

    const videos = [
        {
            title: 'Theme Song SE 2026',
            embedUrl: 'https://www.youtube.com/embed/L86LTnOeXQE',
            description: 'Dengarkan lagu resmi Sensus Ekonomi 2026 — semangat bersama mendata Indonesia.',
        },
        {
            title: 'Lebih Tahu tentang SE 2026',
            embedUrl: 'https://www.youtube.com/embed/vQDVJuJwrXw',
            description: 'Apa itu Sensus Ekonomi? Simak penjelasan lengkapnya di sini.',
        },
        {
            title: 'Tujuan SE 2026',
            embedUrl: 'https://www.youtube.com/embed/RmgmLLOjSRQ',
            description: 'Kenapa Sensus Ekonomi penting? Pelajari tujuan dan manfaatnya untuk kita semua.',
        },
    ];

    const faqs = [
        {
            question: 'Apa itu Web Deteksi Pelaku Ekonomi Digital?',
            answer: 'Platform ini merupakan sistem resmi BPS Provinsi Lampung untuk mendeteksi dan mencatat pelaku usaha berbasis digital dalam rangka Sensus Ekonomi 2026. Platform ini memungkinkan petugas lapangan mendata, memverifikasi, dan memetakan pelaku ekonomi digital secara efisien.',
        },
        {
            question: 'Siapa yang dapat mengakses web ini?',
            answer: 'Web ini dapat diakses oleh petugas lapangan BPS, koordinator kabupaten/kota, serta administrator provinsi yang memiliki akun resmi. Pelaku usaha juga dapat mengakses untuk melihat panduan dan informasi.',
        },
        {
            question: 'Apakah data yang dikumpulkan aman?',
            answer: 'Kerahasiaan data dijamin oleh Undang-Undang No.16 Tahun 1997 tentang Statistik dan hanya digunakan untuk kepentingan statistik.',
        },
        {
            question: 'Apa itu Sensus Ekonomi 2026?',
            answer: 'Sensus Ekonomi (SE) adalah kegiatan pendataan komprehensif tentang seluruh kegiatan ekonomi non-pertanian di Indonesia yang dilaksanakan setiap 10 tahun sekali oleh BPS. SE 2026 merupakan sensus ke-5 dan pertama kali mencakup pendataan pelaku ekonomi digital secara menyeluruh.',
        },
        {
            question: 'Mengapa data pelaku ekonomi digital perlu dikumpulkan?',
            answer: 'Ekonomi digital berkembang sangat pesat, namun banyak pelakunya belum tercatat dalam statistik resmi. Data yang lengkap dan akurat dibutuhkan pemerintah untuk merancang kebijakan, program bantuan UMKM, dan pembangunan ekonomi yang tepat sasaran.',
        },
    ];

    const contactInfo = {
        name: 'Badan Pusat Statistik Provinsi Lampung',
        address: 'Jl. Basuki Rahmat No.54, Bandar Lampung 35118',
        phone: '(0721) 482909',
        email: 'bps1800@bps.go.id',
        website: 'https://lampung.bps.go.id',
        hours: 'Senin – Jumat, 08.00 – 16.00 WIB',
    };

    return (
        <SidebarLayout title="Tentang - Platform Deteksi Pelaku Ekonomi Digital">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Tentang Platform
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Platform Deteksi Pelaku Ekonomi Digital - BPS Provinsi Lampung
                    </p>
                </div>

                {/* Section 1.1: Tentang Platform Ini - Visual Hero Style */}
                <section className="mb-16">
                    <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        
                        <div className="relative z-10">
                            <p className="text-lg md:text-xl text-white leading-relaxed mb-4">
                                Platform Deteksi Pelaku Ekonomi Digital merupakan sistem informasi berbasis web yang dikembangkan oleh Badan Pusat Statistik (BPS) Provinsi Lampung dalam rangka mendukung pelaksanaan Sensus Ekonomi 2026.
                            </p>
                            <p className="text-lg md:text-xl text-white leading-relaxed mb-4">
                                Platform ini dirancang untuk mendeteksi, mencatat, memverifikasi, dan memetakan pelaku usaha berbasis digital di Provinsi Lampung, seperti penjual online di marketplace, pedagang melalui media sosial, pengemudi ojek online, kreator konten digital, serta penyedia jasa digital lainnya.
                            </p>
                            <p className="text-lg md:text-xl text-white leading-relaxed mb-4">
                                Dengan platform ini, petugas lapangan, koordinator, dan pimpinan BPS dapat berkolaborasi secara real-time dalam satu sistem yang terintegrasi.
                            </p>
                            <p className="text-lg md:text-xl text-white leading-relaxed font-medium">
                                Data yang terkumpul akan menjadi bagian dari basis data resmi Sensus Ekonomi 2026 yang digunakan untuk mendukung penyusunan kebijakan pembangunan ekonomi daerah maupun nasional.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 1.2: Mengapa Platform Ini Penting - Cards */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Mengapa Platform Ini Penting</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {tentangPlatform.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-slate-100 flex items-start">
                                <div className="text-4xl mr-4 flex-shrink-0">{item.icon}</div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 1.3: Urgensi Sensus Ekonomi 2026 */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Urgensi Sensus Ekonomi 2026</h2>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            Sensus Ekonomi (SE) diselenggarakan setiap 10 tahun sekali oleh BPS dan merupakan pendataan paling komprehensif tentang kegiatan ekonomi non-pertanian di seluruh Indonesia. SE 2026 menjadi momentum krusial karena pertama kalinya dilakukan pasca pandemi, di tengah lonjakan ekonomi digital yang masif sejak 2020–2025.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-slate-700">Lampung memiliki lebih dari 12.000 pelaku ekonomi digital aktif yang belum seluruhnya tercatat dalam basis data resmi.</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-slate-700">Data SE 2026 akan menjadi landasan RPJMD, APBD, dan program pemberdayaan UMKM Lampung 5–10 tahun ke depan.</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-slate-700">Kelengkapan data Lampung berkontribusi pada akurasi data ekonomi nasional Indonesia.</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-slate-700">Pelaku digital yang tidak terdeteksi berpotensi tidak mendapatkan akses program bantuan pemerintah.</p>
                            </div>
                        </div>
                        <p className="text-lg text-slate-700 font-semibold">
                            BPS Provinsi Lampung berkomitmen untuk menghasilkan data yang akurat, lengkap, dan dapat dipercaya demi Lampung yang lebih maju dan sejahtera.
                        </p>
                    </div>
                </section>

                {/* Section 1.4: Video Pengenalan */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Kenali Sensus Ekonomi 2026</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {videos.map((video, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                                <div className="aspect-video">
                                    <iframe
                                        src={video.embedUrl}
                                        title={video.title}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900 mb-2">{video.title}</h3>
                                    <p className="text-sm text-slate-600">{video.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2: FAQ */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Pertanyaan Umum</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
                                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                                <p className="text-slate-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Kontak Kami */}
                <section className="mb-16">
                    <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-white">
                        <h2 className="text-3xl font-bold mb-4">Kontak Kami</h2>
                        <p className="text-orange-100 mb-6">
                            Ada pertanyaan atau kendala? Hubungi tim BPS Provinsi Lampung.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white/10 rounded-lg p-4">
                                <p className="font-semibold mb-2">{contactInfo.name}</p>
                                <p className="text-orange-100">{contactInfo.address}</p>
                                <p className="text-orange-100">{contactInfo.phone}</p>
                                <p className="text-orange-100">{contactInfo.email}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <p className="font-semibold mb-2">Jam Layanan</p>
                                <p className="text-orange-100">{contactInfo.hours}</p>
                                <p className="font-semibold mt-4 mb-2">Website</p>
                                <a 
                                    href={contactInfo.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-orange-200 hover:text-white underline"
                                >
                                    {contactInfo.website}
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={`mailto:${contactInfo.email}`}
                                className="inline-block px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                            >
                                Kirim Pesan
                            </a>
                            <a
                                href={contactInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
                            >
                                Kunjungi Website BPS
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </SidebarLayout>
    );
}
