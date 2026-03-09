import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import useAuthStore from '../stores/authStore';
import SidebarLayout from '../Layouts/SidebarLayout';

export default function TabelUser() {
    const { token } = useAuthStore();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    
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
                )
            );
        }
        
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
    }, [data, searchTerm, sortConfig]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data.data);
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

    const openEditModal = (item) => {
        setSelectedItem(item);
        setEditForm({
            name: item.name,
            email: item.email,
            password: '',
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
            const updateData = {
                name: editForm.name,
                email: editForm.email,
            };
            if (editForm.password) {
                updateData.password = editForm.password;
            }
            
            await axios.put(`/api/users/${selectedItem.id}`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowEditModal(false);
            fetchData();
            showNotification('success', 'User berhasil diperbarui');
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Gagal memperbarui user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await axios.delete(`/api/users/${selectedItem.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDeleteModal(false);
            fetchData();
            showNotification('success', 'User berhasil dihapus');
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Gagal menghapus user');
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
            'Nama': item.name,
            'Email': item.email,
            'Role': item.role || 'user',
            'Tanggal Dibuat': new Date(item.created_at).toLocaleDateString('id-ID'),
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data User');
        XLSX.writeFile(workbook, 'data_user.xlsx');
    };

    return (
        <SidebarLayout title="Tabel Data User">
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
                    <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-lg mx-4">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold">Edit User</h3>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password (Kosongkan jika tidak ingin mengubah)</label>
                                <input
                                    type="password"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500"
                                    placeholder="Min. 8 karakter"
                                />
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
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
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
                            <h3 className="text-xl font-bold mb-2">Hapus User?</h3>
                            <p className="text-slate-600 mb-6">
                                Apakah Anda yakin ingin menghapus user <strong>{selectedItem?.name}</strong>? 
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
                        <h2 className="text-2xl font-bold text-slate-900">Data User</h2>
                        <div className="flex gap-2 items-center w-full md:w-auto">
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
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full md:w-64"
                                />
                                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

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
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                                            Nama {getSortIcon('name')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('email')}>
                                            Email {getSortIcon('email')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('role')}>
                                            Role {getSortIcon('role')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('created_at')}>
                                            Tanggal Dibuat {getSortIcon('created_at')}
                                        </th>
                                        <th className="px-4 py-3">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium">{item.name}</td>
                                            <td className="px-4 py-3">{item.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                                    item.role === 'admin' 
                                                        ? 'bg-purple-100 text-purple-800' 
                                                        : item.role === 'pelaku_usaha'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {item.role === 'admin' ? 'Admin' : item.role === 'pelaku_usaha' ? 'Pelaku Usaha' : item.role || 'User'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
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
