import { Link } from '@inertiajs/react';
import {
    HomeIcon,
    ArrowLeftIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-bold text-orange-500 leading-none select-none">
                        404
                    </h1>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                        <ExclamationTriangleIcon className="w-10 h-10 text-orange-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Halaman Tidak Ditemukan
                </h2>

                {/* Description */}
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                    Maaf, halaman yang Anda cari tidak ditemukan atau mungkin telah dipindahkan.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <HomeIcon className="w-5 h-5 mr-2" />
                        Kembali ke Beranda
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Halaman Sebelumnya
                    </button>
                </div>
            </div>
        </div>
    );
}
