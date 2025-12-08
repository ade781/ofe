import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Clock, Mail, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';

const statusConfig = {
    sent: { label: 'Terkirim', color: 'text-green-600 bg-green-100', icon: CheckCircle },
    failed: { label: 'Gagal', color: 'text-red-600 bg-red-100', icon: XCircle },
    replied: { label: 'Dibalas', color: 'text-blue-600 bg-blue-100', icon: Mail },
    pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-100', icon: AlertCircle }
};

export const EmailHistoryPage = ({ user, onLogout, onNavigate }) => {
    const [emails, setEmails] = useState([]);
    const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0, replied: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedEmail, setSelectedEmail] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchEmailHistory();
            fetchStats();
        }
    }, [user]);

    const fetchEmailHistory = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/emails/history?user_id=${user.id}&limit=100`);
            const data = await res.json();

            if (data.success) {
                setEmails(data.emails);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Gagal memuat riwayat email');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/emails/stats?user_id=${user.id}`);
            const data = await res.json();

            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error('Gagal memuat statistik:', err);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchEmailHistory();
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/emails/search?user_id=${user.id}&q=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();

            if (data.success) {
                setEmails(data.emails);
            }
        } catch (err) {
            console.error('Gagal mencari email:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmails = filterStatus === 'all'
        ? emails
        : emails.filter(email => email.status === filterStatus);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-gov-dark to-gov-light rounded-lg p-6 text-white shadow-lg border-b-4 border-gov-accent">
                    <h2 className="text-3xl font-bold mb-1">📧 Riwayat Email</h2>
                    <p className="text-gov-accent opacity-90 font-semibold">Kelola dan pantau email yang telah dikirim</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <StatCard label="Total" value={stats.total} color="bg-gov-dark" />
                    <StatCard label="Terkirim" value={stats.sent} color="bg-gov-accent" />
                    <StatCard label="Gagal" value={stats.failed} color="bg-red-500" />
                    <StatCard label="Dibalas" value={stats.replied} color="bg-gov-light" />
                    <StatCard label="Pending" value={stats.pending} color="bg-gray-400" />
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg border-2 border-gov-border shadow-md p-6">
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gov-light" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan penerima, email, atau subjek..."
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-light focus:border-gov-light transition"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2.5 bg-gradient-to-r from-gov-dark to-gov-light text-white rounded-lg hover:from-gov-light hover:to-gov-dark transition font-bold"
                        >
                            🔍 Cari
                        </button>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <FilterButton
                            label="Semua"
                            active={filterStatus === 'all'}
                            onClick={() => setFilterStatus('all')}
                        />
                        <FilterButton
                            label="Terkirim"
                            active={filterStatus === 'sent'}
                            onClick={() => setFilterStatus('sent')}
                            color="green"
                        />
                        <FilterButton
                            label="Gagal"
                            active={filterStatus === 'failed'}
                            onClick={() => setFilterStatus('failed')}
                            color="red"
                        />
                        <FilterButton
                            label="Dibalas"
                            active={filterStatus === 'replied'}
                            onClick={() => setFilterStatus('replied')}
                            color="blue"
                        />
                    </div>
                </div>

                {/* Email List */}
                <div className="bg-white rounded-lg border-2 border-gov-border shadow-md">
                    {loading ? (
                        <div className="p-8 text-center text-gov-light">
                            <div className="animate-spin w-8 h-8 border-4 border-gov-light border-t-transparent rounded-full mx-auto mb-4"></div>
                            Memuat data...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            <XCircle className="w-12 h-12 mx-auto mb-4" />
                            {error}
                        </div>
                    ) : filteredEmails.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            Tidak ada email
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gov-bg border-b-2 border-gov-border">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gov-dark uppercase">Penerima</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gov-dark uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gov-dark uppercase">Subjek</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gov-dark uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gov-dark uppercase">Waktu</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gov-dark uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gov-border">
                                    {filteredEmails.map((email) => (
                                        <EmailRow
                                            key={email.id}
                                            email={email}
                                            onView={() => setSelectedEmail(email)}
                                            formatDate={formatDate}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Email Detail Modal */}
            {selectedEmail && (
                <EmailDetailModal
                    email={selectedEmail}
                    onClose={() => setSelectedEmail(null)}
                    formatDate={formatDate}
                />
            )}
        </DashboardLayout>
    );
};

const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="text-slate-600 text-sm mb-1">{label}</div>
        <div className={`text-2xl font-bold ${color.replace('bg-', 'text-')}`}>{value || 0}</div>
    </div>
);

const FilterButton = ({ label, active, onClick, color = 'slate' }) => {
    const activeClass = active
        ? `bg-${color}-600 text-white`
        : `bg-${color}-100 text-${color}-700 hover:bg-${color}-200`;

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${activeClass}`}
        >
            {label}
        </button>
    );
};

const EmailRow = ({ email, onView, formatDate }) => {
    const config = statusConfig[email.status] || statusConfig.sent;
    const StatusIcon = config.icon;

    return (
        <tr className="hover:bg-slate-50 transition">
            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {email.recipient_name || '-'}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
                {email.recipient_email}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
                <div className="max-w-xs truncate">{email.subject || '-'}</div>
                {email.status === 'failed' && (
                    <div className="text-xs text-red-500 mt-1 truncate max-w-xs">
                        {email.body ? email.body.replace('Error: ', '') : 'Gagal'}
                    </div>
                )}
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {formatDate(email.sent_at)}
                </div>
            </td>
            <td className="px-6 py-4">
                <button
                    onClick={onView}
                    className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                >
                    Lihat Detail
                </button>
            </td>
        </tr>
    );
};

const EmailDetailModal = ({ email, onClose, formatDate }) => {
    const config = statusConfig[email.status] || statusConfig.sent;
    const StatusIcon = config.icon;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{email.subject || '(No Subject)'}</h3>
                            <div className="flex items-center gap-2 text-purple-100">
                                <StatusIcon className="w-4 h-4" />
                                <span className="text-sm">{config.label}</span>
                                <span className="mx-2">•</span>
                                <span className="text-sm">{formatDate(email.sent_at)}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Penerima" value={email.recipient_name || '-'} />
                        <InfoField label="Email" value={email.recipient_email} />
                        <InfoField label="Lampiran" value={email.attachment_name || 'Tidak ada'} />
                        <InfoField label="Message ID" value={email.message_id || '-'} />
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                        <h4 className="font-semibold text-slate-700 mb-2">Isi Pesan</h4>
                        <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap">
                            {email.body || 'Tidak ada isi pesan'}
                        </div>
                    </div>

                    {email.error_message && (
                        <div className="border-t border-slate-200 pt-4">
                            <h4 className="font-semibold text-red-600 mb-2">Error Message</h4>
                            <div className="bg-red-50 rounded-lg p-4 text-sm text-red-700">
                                {email.error_message}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoField = ({ label, value }) => (
    <div>
        <div className="text-xs text-slate-500 uppercase mb-1">{label}</div>
        <div className="text-sm font-medium text-slate-900">{value}</div>
    </div>
);
