import SidebarLayout from '../Layouts/SidebarLayout';
import { Link } from '@inertiajs/react';
import useAuthStore from '../stores/authStore';
import { useState, useEffect, useRef } from 'react';

// Animated Counter Component
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime;
        const startValue = 0;
        const endValue = parseInt(end.replace(/\D/g, '')) || 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(startValue + (endValue - startValue) * easeOut));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function Beranda() {
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
    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            ),
            title: 'Crawling Marketplace',
            description: 'Automatically detect and collect data from various digital marketplaces.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Data Analytics',
            description: 'Analyze economic actor patterns and trends from collected data.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: 'Pelaku Ekonomi Digital',
            description: 'Identify and categorize digital economic actors in your region.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'Laporan Lengkap',
            description: 'Generate comprehensive reports for economic census updates.',
        },
    ];

    const stats = [
        { value: '10', suffix: '+', label: 'Marketplace' },
        { value: '50', suffix: 'K+', label: 'Data Points' },
        { value: '15', suffix: '', label: 'Kabupaten/Kota' }
    ];

    return (
        <SidebarLayout title="Beranda">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-600/10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                            Deteksi Pelaku Ekonomi Digital
                            <span className="block text-orange-600">Untuk Sensus Ekonomi 2026</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                            Platform untuk mendeteksi dan mengidentifikasi pelaku ekonomi digital dalam rangka pemutakhiran data Sensus Ekonomi 2026.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/tentang"
                                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                            >
                                Lihat Penjelasan
                            </Link>
                            <a
                                href="https://sensus.bps.go.id/se2026/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 text-lg font-semibold rounded-xl transition-all border border-slate-200 hover:border-slate-300"
                            >
                                Pelajari Lebih Lanjut
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center min-w-[150px]">
                                <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-slate-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fitur Utama</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Platform kami menyediakan berbagai fitur untuk membantu Anda mendeteksi dan mengelola data pelaku ekonomi digital.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-100"
                            >
                                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Only show if not authenticated */}
            {!isAuthenticated && (
                <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Siap Memulai?
                        </h2>
                        <p className="text-xl text-orange-100 mb-10">
                            Login sekarang untuk memulai proses crawling dan deteksi pelaku ekonomi digital.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-10 py-4 bg-white text-orange-600 text-lg font-semibold rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
                        >
                            Login Sekarang
                        </Link>
                    </div>
                </section>
            )}

            {/* Welcome Section - Only show if authenticated */}
            {isAuthenticated && (
                <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Selamat Datang, {user?.name || 'User'}!
                        </h2>
                        <p className="text-xl text-orange-100 mb-10">
                            Anda sudah login sebagai {formatRole(user?.role)}
                        </p>
                        <Link
                            href="/sensus-ekonomi"
                            className="inline-block px-10 py-4 bg-white text-orange-600 text-lg font-semibold rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
                        >
                            Lihat Penjelasan
                        </Link>
                    </div>
                </section>
            )}
        </SidebarLayout>
    );
}
