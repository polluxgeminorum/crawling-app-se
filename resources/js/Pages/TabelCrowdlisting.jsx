import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
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

export default function TabelCrowdlisting() {
    const { token } = useAuthStore();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    
    // Filter states for each column
    const [filters, setFilters] = useState({
        jenis_usaha: '',
        platform_digital: '',
        jumlah_usaha: '',
        kode_pos: '',
        created_by: '',
        created_at: '',
        kabupaten_kota: '',
    });
    
    // Get unique values for dropdown filters
    const [filterOptions, setFilterOptions] = useState({
        jenis_usaha: [],
        platform_digital: [],
        jumlah_usaha: [],
        kode_pos: [],
        created_by: [],
        created_at: [],
        kabupaten_kota: [],
    });
    const [showFilters, setShowFilters] = useState(false);
    
    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Notifications
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let result = [...data];
        
        // Filter by search - search all columns
        if (searchTerm) {
            result = result.filter(item => 
                Object.values(item).some(value => 
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                ) ||
                item.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filter by column-specific filters
        const filterKeys = ['jenis_usaha', 'platform_digital', 'jumlah_usaha', 'kode_pos', 'created_by', 'created_at', 'kabupaten_kota'];
        filterKeys.forEach(key => {
            if (filters[key]) {
                result = result.filter(item => {
                    const value = key === 'created_by' ? item.creator?.name : 
                                  key === 'created_at' ? new Date(item.created_at).toLocaleDateString('id-ID') :
                                  key === 'jumlah_usaha' ? item.jumlah_usaha?.toString() :
                                  key === 'email' ? item.email :
                                  key === 'no_telp' ? item.no_telp :
                                  item[key];
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
    }, [data, searchTerm, sortConfig, filters]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/crowdlisting', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data.data);
            
            // Extract unique options for all dropdown filters
            const extractUnique = (arr) => [...new Set(arr.filter(Boolean))].sort();
            
            setFilterOptions({
                jenis_usaha: extractUnique(response.data.data.map(item => item.jenis_usaha)),
                platform_digital: extractUnique(response.data.data.map(item => item.platform_digital)),
                jumlah_usaha: extractUnique(response.data.data.map(item => item.jumlah_usaha?.toString())),
                kode_pos: extractUnique(response.data.data.map(item => item.kode_pos)),
                created_by: extractUnique(response.data.data.map(item => item.creator?.name)),
                created_at: extractUnique(response.data.data.map(item => new Date(item.created_at).toLocaleDateString('id-ID'))),
                kabupaten_kota: extractUnique(response.data.data.map(item => item.kabupaten_kota))
            });
        } catch (err) {
            setError('Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
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
            jenis_usaha: '',
            platform_digital: '',
            jumlah_usaha: '',
            kode_pos: '',
            created_by: '',
            created_at: '',
            kabupaten_kota: ''
        });
        setSearchTerm('');
    };

    const openEditModal = (item) => {
        setSelectedItem(item);
        setEditForm({
            nama_keluarga_bangunan_usaha: item.nama_keluarga_bangunan_usaha,
            nama_pemilik: item.nama_pemilik || '',
            jenis_usaha: item.jenis_usaha,
            platform_digital: item.platform_digital || '',
            alamat: item.alamat,
            jumlah_usaha: item.jumlah_usaha,
            kode_pos: item.kode_pos || '',
            email: item.email || '',
            no_telp: item.no_telp || '',
            kabupaten_kota: item.kabupaten_kota || '',
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
            await axios.put(`/api/crowdlisting/${selectedItem.id}`, editForm, {
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
            await axios.delete(`/api/crowdlisting/${selectedItem.id}`, {
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
            'Nama Keluarga/Usaha': item.nama_keluarga_bangunan_usaha,
            'Nama Pemilik': item.nama_pemilik || '',
            'Jenis Usaha': item.jenis_usaha,
            'Platform Digital': item.platform_digital || '',
            'Alamat': item.alamat,
            'Jumlah Unit Usaha': item.jumlah_usaha,
            'Kode Pos': item.kode_pos || '',
            'Email': item.email || '',
            'No. Telepon': item.no_telp || '',
            'Kabupaten/Kota': item.kabupaten_kota || '',
            'Dibuat Oleh': item.creator?.name || '-',
            'Tanggal': new Date(item.created_at).toLocaleDateString('id-ID'),
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Crowdlisting');
        XLSX.writeFile(workbook, 'data_crowdlisting.xlsx');
    };

    return (
        <SidebarLayout title="Tabel Data Crowdlisting">
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
                            <h3 className="text-xl font-bold">Edit Data Crowdlisting</h3>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Keluarga/Usaha</label>
                                <input
                                    type="text"
                                    value={editForm.nama_keluarga_bangunan_usaha}
                                    onChange={(e) => setEditForm({...editForm, nama_keluarga_bangunan_usaha: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pemilik</label>
                                <input
                                    type="text"
                                    value={editForm.nama_pemilik || ''}
                                    onChange={(e) => setEditForm({...editForm, nama_pemilik: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Usaha</label>
                                <select
                                    value={editForm.jenis_usaha}
                                    onChange={(e) => setEditForm({...editForm, jenis_usaha: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                    required
                                >
                                    <option value="">Pilih Jenis Usaha</option>
                                    <option value="perdaganga online">Perdaganga Online</option>
                                    <option value="jasa digital">Jasa Digital</option>
                                    <option value="content creator">Content Creator</option>
                                    <option value="usaha lainnya">Usaha Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Platform Digital</label>
                                <select
                                    value={editForm.platform_digital || ''}
                                    onChange={(e) => setEditForm({...editForm, platform_digital: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                >
                                    <option value="">Pilih Platform Digital</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Facebook Marketplace">Facebook Marketplace</option>
                                    <option value="Tiktok Shop">Tiktok Shop</option>
                                    <option value="Shopee">Shopee</option>
                                    <option value="Tokopedia">Tokopedia</option>
                                    <option value="Google Maps">Google Maps</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                                <textarea
                                    value={editForm.alamat}
                                    onChange={(e) => setEditForm({...editForm, alamat: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                    rows={2}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Unit Usaha</label>
                                    <input
                                        type="number"
                                        value={editForm.jumlah_usaha}
                                        onChange={(e) => setEditForm({...editForm, jumlah_usaha: parseInt(e.target.value)})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                        min={1}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Kode Pos</label>
                                    <input
                                        type="text"
                                        value={editForm.kode_pos}
                                        onChange={(e) => setEditForm({...editForm, kode_pos: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                                <input
                                    type="text"
                                    value={editForm.no_telp}
                                    onChange={(e) => setEditForm({...editForm, no_telp: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kabupaten/Kota</label>
                                <select
                                    value={editForm.kabupaten_kota || ''}
                                    onChange={(e) => setEditForm({...editForm, kabupaten_kota: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500"
                                >
                                    {KABUPATEN_KOTA_LAMPUNG.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400"
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
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Hapus Data?</h3>
                            <p className="text-slate-600 mb-6">
                                Apakah Anda yakin ingin menghapus data <strong>{selectedItem?.nama_keluarga_bangunan_usaha}</strong>? 
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
                                >
                                    {isSubmitting ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-slate-900">Data Crowdlisting</h2>
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
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <div>
                                    <select
                                        value={filters.jenis_usaha}
                                        onChange={(e) => handleFilterChange('jenis_usaha', e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500"
                                    >
                                        <option value="">Jenis Usaha</option>
                                        {filterOptions.jenis_usaha.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={filters.platform_digital}
                                        onChange={(e) => handleFilterChange('platform_digital', e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500"
                                    >
                                        <option value="">Platform Digital</option>
                                        {filterOptions.platform_digital.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={filters.jumlah_usaha}
                                        onChange={(e) => handleFilterChange('jumlah_usaha', e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500"
                                    >
                                        <option value="">Jumlah Usaha</option>
                                        {filterOptions.jumlah_usaha.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={filters.kode_pos}
                                        onChange={(e) => handleFilterChange('kode_pos', e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500"
                                    >
                                        <option value="">Kode Pos</option>
                                        {filterOptions.kode_pos.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={filters.kabupaten_kota}
                                        onChange={(e) => handleFilterChange('kabupaten_kota', e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500"
                                    >
                                        <option value="">Kabupaten/Kota</option>
                                        {filterOptions.kabupaten_kota.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={filters.created_by}
                                        onChange={(e) => handleFilterChange('created_by', e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500"
                                    >
                                        <option value="">Dibuat Oleh</option>
                                        {filterOptions.created_by.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={filters.created_at}
                                        onChange={(e) => handleFilterChange('created_at', e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500"
                                    >
                                        <option value="">Tanggal</option>
                                        {filterOptions.created_at.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

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
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('nama_keluarga_bangunan_usaha')}>
                                            Nama Keluarga/Usaha {getSortIcon('nama_keluarga_bangunan_usaha')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('nama_pemilik')}>
                                            Nama Pemilik {getSortIcon('nama_pemilik')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('jenis_usaha')}>
                                            Jenis Usaha {getSortIcon('jenis_usaha')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('platform_digital')}>
                                            Platform Digital {getSortIcon('platform_digital')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('alamat')}>
                                            Alamat {getSortIcon('alamat')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('jumlah_usaha')}>
                                            Jumlah {getSortIcon('jumlah_usaha')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('kode_pos')}>
                                            Kode Pos {getSortIcon('kode_pos')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('email')}>
                                            Email {getSortIcon('email')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('no_telp')}>
                                            No. Telepon {getSortIcon('no_telp')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('kabupaten_kota')}>
                                            Kabupaten/Kota {getSortIcon('kabupaten_kota')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('created_by')}>
                                            Dibuat Oleh {getSortIcon('created_by')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('created_at')}>
                                            Tanggal {getSortIcon('created_at')}
                                        </th>
                                        <th className="px-4 py-3">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium">{item.nama_keluarga_bangunan_usaha}</td>
                                            <td className="px-4 py-3">{item.nama_pemilik || '-'}</td>
                                            <td className="px-4 py-3">{item.jenis_usaha}</td>
                                            <td className="px-4 py-3">{item.platform_digital || '-'}</td>
                                            <td className="px-4 py-3 max-w-xs truncate" title={item.alamat}>{item.alamat}</td>
                                            <td className="px-4 py-3">{item.jumlah_usaha}</td>
                                            <td className="px-4 py-3">{item.kode_pos || '-'}</td>
                                            <td className="px-4 py-3">{item.email || '-'}</td>
                                            <td className="px-4 py-3">{item.no_telp || '-'}</td>
                                            <td className="px-4 py-3">{item.kabupaten_kota || '-'}</td>
                                            <td className="px-4 py-3">{item.creator?.name || '-'}</td>
                                            <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
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

                    <div className="mt-4 text-sm text-slate-500">
                        Menampilkan {filteredData.length} dari {data.length} data
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
