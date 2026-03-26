import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import useAuthStore from '../stores/authStore';
import SidebarLayout from '../Layouts/SidebarLayout';

export default function TabelDigitalTracing() {
    const authState = useAuthStore.getState();
    const { token, user, isAuthenticated } = authState;
    
    // Synchronous role-based access control - redirect BEFORE any render
    if (!isAuthenticated) {
        window.location.href = '/login';
        return null;
    }
    
    if (user?.role === 'pelaku_usaha') {
        window.location.href = '/';
        return null;
    }
    
    // Only admin and pegawai can access
    if (user?.role !== 'admin' && user?.role !== 'pegawai') {
        window.location.href = '/';
        return null;
    }
    
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    
    // Filter states for each column
    const [filters, setFilters] = useState({
        kategori: '',
        jenis_platform: '',
    });
    
    // Get unique values for dropdown filters
    const [filterOptions, setFilterOptions] = useState({
        kategori: [],
        jenis_platform: [],
    });
    const [showFilters, setShowFilters] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(20);
    
    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMapsModal, setShowMapsModal] = useState(false);
    const [selectedMapsUrl, setSelectedMapsUrl] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Notifications
    const [notification, setNotification] = useState(null);

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let result = [...data];
        
        // Filter by search - search all columns
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(item => {
                // Search in all string/number values
                const values = Object.values(item).filter(v => v !== null && v !== undefined);
                const matches = values.some(value => {
                    if (typeof value === 'object') return false;
                    return String(value).toLowerCase().includes(searchLower);
                });
                // Also search in creator name
                const creatorMatch = item.creator?.name?.toLowerCase().includes(searchLower);
                return matches || creatorMatch;
            });
        }
        
        // Filter by column-specific filters
        const filterKeys = ['kategori', 'jenis_platform'];
        filterKeys.forEach(key => {
            if (filters[key]) {
                result = result.filter(item => {
                    const value = item[key];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(filters[key].toLowerCase());
                });
            }
        });
        
        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        
        setFilteredData(result);
        setTotalPages(Math.ceil(result.length / perPage));
        setCurrentPage(1);
    }, [data, searchTerm, sortConfig, filters, perPage]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/digital-tracing', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data.data || [];
            setData(data);
            setTotalPages(Math.ceil(data.length / perPage));
            
            // Extract unique options for all dropdown filters
            const extractUnique = (arr) => [...new Set(arr.filter(Boolean))].sort();
            
            setFilterOptions({
                kategori: extractUnique(data.map(item => item.kategori)),
                jenis_platform: extractUnique(data.map(item => item.jenis_platform)),
            });
        } catch (err) {
            if (err.response?.status === 401) {
                router.visit('/login');
            } else if (err.response?.status === 403) {
                router.visit('/');
            } else {
                setError(err.message || 'Gagal memuat data');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Calculate paginated data
    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * perPage;
        return filteredData.slice(startIndex, startIndex + perPage);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearAllFilters = () => {
        setFilters({
            kategori: '',
            jenis_platform: '',
        });
        setSearchTerm('');
    };

    const openEditModal = (item) => {
        setSelectedItem(item);
        setEditForm({
            link: item.link || '',
            maps: item.maps || '',
            nama_usaha: item.nama_usaha || '',
            kategori: item.kategori || '',
            alamat: item.alamat || '',
            no_telp: item.no_telp || '',
            jenis_platform: item.jenis_platform || '',
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.put(`/api/digital-tracing/${selectedItem.id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowEditModal(false);
            fetchData();
            showNotification('success', 'Data berhasil diperbarui');
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Gagal memperbarui data');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await axios.delete(`/api/digital-tracing/${selectedItem.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDeleteModal(false);
            fetchData();
            showNotification('success', 'Data berhasil dihapus');
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Gagal menghapus data');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData.map((item, index) => ({
            'No': index + 1,
            'Link': item.link || '',
            'Link Maps': item.maps || '',
            'Nama Usaha': item.nama_usaha || '',
            'Kategori': item.kategori || '',
            'Alamat': item.alamat || '',
            'No. Telepon': item.no_telp || '',
            'Jenis Platform': item.jenis_platform || '',
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Digital Tracing');
        XLSX.writeFile(workbook, 'data_digital_tracing.xlsx');
    };

    function convertToEmbedUrl(url) {
        if (!url) return '';

        // 1. Ambil nama tempat dari URL (/place/NAMA_TEMPAT/)
        const placeMatch = url.match(/\/place\/([^/]+)/);

        if (placeMatch) {
            const placeName = decodeURIComponent(placeMatch[1]);
            
            return `https://www.google.com/maps?q=${placeName}&output=embed`;
        }

        // 2. fallback ke koordinat
        const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

        if (coordMatch) {
            const lat = coordMatch[1];
            const lng = coordMatch[2];

            return `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
        }

        // 3. fallback terakhir
        return `https://www.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
    }

    return (
        <SidebarLayout title="Tabel Data Digital Tracing">
            {/* Toast Notification */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] ${
                        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                        {notification.type === 'success' ? (
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <p className="flex-1">{notification.message}</p>
                        <button onClick={() => setNotification(null)} className="text-white hover:text-gray-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border-2 border-orange-200 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold">Edit Data Digital Tracing</h3>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Link</label>
                                <input
                                    type="text"
                                    value={editForm.link}
                                    onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Usaha</label>
                                <input
                                    type="text"
                                    value={editForm.nama_usaha}
                                    onChange={(e) => setEditForm({...editForm, nama_usaha: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                                <input
                                    type="text"
                                    value={editForm.kategori || ''}
                                    onChange={(e) => setEditForm({...editForm, kategori: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                                <textarea
                                    value={editForm.alamat}
                                    onChange={(e) => setEditForm({...editForm, alamat: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                                <input
                                    type="text"
                                    value={editForm.no_telp || ''}
                                    onChange={(e) => setEditForm({...editForm, no_telp: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Platform</label>
                                <input
                                    type="text"
                                    value={editForm.jenis_platform || ''}
                                    onChange={(e) => setEditForm({...editForm, jenis_platform: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Link Google Maps</label>
                                <input
                                    type="text"
                                    value={editForm.maps || ''}
                                    onChange={(e) => setEditForm({...editForm, maps: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border-2 border-red-200 w-full max-w-md mx-4">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold">Hapus Data Digital Tracing</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 mb-6">
                                Apakah Anda yakin ingin menghapus data <strong>{selectedItem?.nama_usaha}</strong>? 
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Maps Modal */}
            {showMapsModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border-2 border-green-200 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Lokasi di Google Maps</h3>
                            <button
                                onClick={() => setShowMapsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="h-[70vh]">
                            <iframe
                                key={selectedMapsUrl}
                                src={selectedMapsUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps Location"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-slate-900">Data Digital Tracing</h2>
                        <div className="flex gap-2 items-center w-full md:w-auto flex-wrap">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                                    showFilters ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filter
                            </button>
                            <button
                                onClick={exportToExcel}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Excel
                            </button>
                            <div className="relative flex-1 md:flex-none">
                                <input
                                    type="text"
                                    placeholder="Cari data..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 w-full md:w-64"
                                />
                                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Filter Row */}
                    {showFilters && (
                        <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-slate-700">Filter Kolom</h3>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-orange-600 hover:text-orange-700"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <select
                                        value={filters.kategori}
                                        onChange={(e) => handleFilterChange('kategori', e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500"
                                    >
                                        <option value="">Kategori</option>
                                        {filterOptions.kategori.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={filters.jenis_platform}
                                        onChange={(e) => handleFilterChange('jenis_platform', e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500"
                                    >
                                        <option value="">Jenis Platform</option>
                                        {filterOptions.jenis_platform.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Table */}
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-slate-500">Memuat data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-slate-500">Tidak ada data</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('id')}>
                                        No {getSortIcon('id')}
                                    </th>
                                    <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('link')}>
                                        Link {getSortIcon('link')}
                                    </th>
                                    <th className="px-4 py-3">
                                        Tampilkan Maps
                                    </th>
                                    <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('nama_usaha')}>
                                        Nama Usaha {getSortIcon('nama_usaha')}
                                    </th>
                                    <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('kategori')}>
                                        Kategori {getSortIcon('kategori')}
                                    </th>
                                    <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('alamat')}>
                                        Alamat {getSortIcon('alamat')}
                                    </th>
                                    <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('no_telp')}>
                                        No. Telepon {getSortIcon('no_telp')}
                                    </th>
                                    <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('jenis_platform')}>
                                        Jenis Platform {getSortIcon('jenis_platform')}
                                    </th>
                                    <th className="px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPaginatedData().map((item, index) => (
                                    <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 max-w-xs truncate" title={item.link}>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {item.link ? 'Link' : '-'}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.maps ? (
                                                <button
                                                    onClick={() => {
                                                        const embedUrl = convertToEmbedUrl(item.maps);
                                                        setSelectedMapsUrl(embedUrl);
                                                        setShowMapsModal(true);
                                                    }}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                                                    title="Tampilkan Maps"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{item.nama_usaha}</td>
                                        <td className="px-4 py-3">{item.kategori || '-'}</td>
                                        <td className="px-4 py-3 max-w-xs truncate" title={item.alamat}>{item.alamat || '-'}</td>
                                        <td className="px-4 py-3">{item.no_telp || '-'}</td>
                                        <td className="px-4 py-3">{item.jenis_platform || '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(item)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                    title="Hapus"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-lg ${
                                        page === currentPage 
                                            ? 'bg-orange-600 text-white' 
                                            : 'border border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}

                <div className="mt-4 text-sm text-slate-500">
                    Menampilkan {filteredData.length} data
                </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
