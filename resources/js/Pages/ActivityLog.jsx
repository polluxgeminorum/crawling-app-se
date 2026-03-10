import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import useAuthStore from '../stores/authStore';
import SidebarLayout from '../Layouts/SidebarLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export default function ActivityLog() {
    const { token } = useAuthStore();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
    const [statistics, setStatistics] = useState(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(20);

    useEffect(() => {
        fetchData();
        fetchStatistics();
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

    const fetchData = async (page = currentPage) => {
        try {
            const response = await axios.get('/api/log-activities', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: page,
                    per_page: perPage,
                }
            });
            setData(response.data.data);
            setTotalPages(response.data.meta.last_page);
        } catch (err) {
            setError('Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/log-activities/statistics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatistics(response.data.data);
        } catch (err) {
            console.error('Failed to fetch statistics');
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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
            'Aktivitas': item.activity_log,
            'Waktu': new Date(item.timestamp).toLocaleString('id-ID'),
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Log Aktivitas');
        XLSX.writeFile(workbook, 'log_aktivitas.xlsx');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setIsLoading(true);
        fetchData(page);
    };

    return (
        <SidebarLayout title="Log Aktivitas">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Statistics Cards */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Total Aktivitas</p>
                                    <p className="text-xl font-bold text-slate-900">{statistics.total_activities}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Hari Ini</p>
                                    <p className="text-xl font-bold text-slate-900">{statistics.today_activities}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Minggu Ini</p>
                                    <p className="text-xl font-bold text-slate-900">{statistics.week_activities}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Bulan Ini</p>
                                    <p className="text-xl font-bold text-slate-900">{statistics.month_activities}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                {statistics && statistics.daily_activities && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Daily Activities Chart (Last 7 Days) */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Aktivitas 7 Hari Terakhir</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={statistics.daily_activities}>
                                        <defs>
                                            <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="day_name" stroke="#64748B" fontSize={12} />
                                        <YAxis stroke="#64748B" fontSize={12} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                border: '1px solid #E2E8F0', 
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            formatter={(value, name) => [value, 'Jumlah Aktivitas']}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke="#3B82F6" 
                                            strokeWidth={2}
                                            fillOpacity={1} 
                                            fill="url(#colorActivities)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Activities by Role Chart */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Aktivitas Berdasarkan Role</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={statistics.activities_by_role?.map(r => ({
                                            name: r.role === 'admin' ? 'Admin' : r.role === 'pegawai' ? 'Pegawai' : r.role === 'pelaku_usaha' ? 'Pelaku Usaha' : r.role,
                                            count: r.count
                                        })) || []}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={true} vertical={false} />
                                        <XAxis type="number" stroke="#64748B" fontSize={12} />
                                        <YAxis 
                                            type="category" 
                                            dataKey="name" 
                                            stroke="#64748B" 
                                            fontSize={12}
                                            width={100}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                border: '1px solid #E2E8F0', 
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            formatter={(value, name) => [value, 'Jumlah Aktivitas']}
                                        />
                                        <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Hourly Activities Chart (Today) */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 lg:col-span-2">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Aktivitas Hari Ini (Per Jam)</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statistics.hourly_activities || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                                        <XAxis dataKey="label" stroke="#64748B" fontSize={11} />
                                        <YAxis stroke="#64748B" fontSize={12} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                border: '1px solid #E2E8F0', 
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            formatter={(value, name) => [value, 'Jumlah Aktivitas']}
                                        />
                                        <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-slate-900">Log Aktivitas</h2>
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
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 w-full md:w-64"
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
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('activity_log')}>
                                            Aktivitas {getSortIcon('activity_log')}
                                        </th>
                                        <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('timestamp')}>
                                            Waktu {getSortIcon('timestamp')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium">{item.name}</td>
                                            <td className="px-4 py-3">{item.email}</td>
                                            <td className="px-4 py-3 max-w-md truncate" title={item.activity_log}>{item.activity_log}</td>
                                            <td className="px-4 py-3">{new Date(item.timestamp).toLocaleString('id-ID')}</td>
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
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                            ))}
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
