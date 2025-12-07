import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Mail, Inbox, Send, RefreshCw, Clock, Paperclip, Reply, Eye, Search } from 'lucide-react';
import { useToast } from '../components/Toast';

export const InboxPage = ({ user, onLogout, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('inbox'); // inbox or sent
    const [inboxEmails, setInboxEmails] = useState([]);
    const [sentEmails, setSentEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        if (user?.id) {
            if (activeTab === 'inbox') {
                fetchInboxEmails();
            } else {
                fetchSentEmails();
            }
        }
    }, [user, activeTab]);

    const fetchInboxEmails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/emails/inbox?user_id=${user.id}&limit=50`);
            const data = await res.json();

            if (data.success) {
                setInboxEmails(data.emails);
            } else {
                showToast('error', data.message);
            }
        } catch (err) {
            showToast('error', 'Gagal memuat inbox');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSentEmails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/emails/history?user_id=${user.id}&limit=50`);
            const data = await res.json();

            if (data.success) {
                setSentEmails(data.emails.filter(e => e.status === 'sent' || e.status === 'replied'));
            } else {
                showToast('error', data.message);
            }
        } catch (err) {
            showToast('error', 'Gagal memuat email terkirim');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        if (activeTab === 'inbox') {
            fetchInboxEmails();
        } else {
            fetchSentEmails();
        }
        showToast('success', 'Email diperbarui');
    };

    const handleMarkAsRead = async (uid) => {
        try {
            const res = await fetch('/api/emails/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id, uid })
            });

            const data = await res.json();
            if (data.success) {
                showToast('success', 'Email ditandai telah dibaca');
                fetchInboxEmails();
            }
        } catch (err) {
            showToast('error', 'Gagal menandai email');
        }
    };

    const currentEmails = activeTab === 'inbox' ? inboxEmails : sentEmails;

    return (
        <>
            <ToastContainer />
            <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Kotak Masuk Email</h2>
                                <p className="text-cyan-100 opacity-90">
                                    {activeTab === 'inbox' ? 'Email yang diterima' : 'Email yang dikirim'}
                                </p>
                            </div>
                            <button
                                onClick={handleRefresh}
                                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition"
                                title="Refresh"
                            >
                                <RefreshCw className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex border-b border-slate-200">
                            <TabButton
                                label="Inbox"
                                icon={Inbox}
                                active={activeTab === 'inbox'}
                                count={inboxEmails.length}
                                onClick={() => setActiveTab('inbox')}
                            />
                            <TabButton
                                label="Terkirim"
                                icon={Send}
                                active={activeTab === 'sent'}
                                count={sentEmails.length}
                                onClick={() => setActiveTab('sent')}
                            />
                        </div>

                        {/* Email List */}
                        <div className="min-h-[500px]">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-96 text-slate-500">
                                    <div className="relative">
                                        <Mail className="w-16 h-16 text-cyan-500 opacity-20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
                                        </div>
                                    </div>
                                    <p className="mt-4 font-medium">Memuat email...</p>
                                </div>
                            ) : currentEmails.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                                    <Mail className="w-20 h-20 mb-4 opacity-20" />
                                    <p className="text-lg font-medium">Tidak ada email</p>
                                    <p className="text-sm">
                                        {activeTab === 'inbox'
                                            ? 'Inbox Anda kosong'
                                            : 'Belum ada email yang dikirim'}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200">
                                    {currentEmails.map((email, idx) => (
                                        <EmailListItem
                                            key={email.uid || email.id || idx}
                                            email={email}
                                            type={activeTab}
                                            onClick={() => setSelectedEmail(email)}
                                            onMarkRead={activeTab === 'inbox' ? handleMarkAsRead : null}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            {/* Email Detail Modal */}
            {selectedEmail && (
                <EmailDetailModal
                    email={selectedEmail}
                    type={activeTab}
                    onClose={() => setSelectedEmail(null)}
                    onReply={() => {
                        setShowReplyModal(true);
                    }}
                />
            )}

            {/* Reply Modal */}
            {showReplyModal && selectedEmail && (
                <ReplyModal
                    email={selectedEmail}
                    userId={user.id}
                    onClose={() => {
                        setShowReplyModal(false);
                        setSelectedEmail(null);
                    }}
                    onSuccess={() => {
                        showToast('success', 'Balasan berhasil dikirim');
                        setShowReplyModal(false);
                        setSelectedEmail(null);
                        fetchSentEmails();
                    }}
                />
            )}
        </>
    );
};

const TabButton = ({ label, icon: Icon, active, count, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-4 font-medium transition ${active
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
            {count}
        </span>
    </button>
);

const EmailListItem = ({ email, type, onClick, onMarkRead }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m yang lalu`;
        if (diffHours < 24) return `${diffHours}j yang lalu`;
        if (diffDays < 7) return `${diffDays}h yang lalu`;

        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const isUnread = type === 'inbox' && !email.isRead;

    return (
        <div
            className={`p-4 cursor-pointer hover:bg-slate-50 transition ${isUnread ? 'bg-cyan-50/30' : ''
                }`}
            onClick={onClick}
        >
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isUnread ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-slate-400'
                    }`}>
                    {type === 'inbox'
                        ? (email.from?.charAt(0) || 'U').toUpperCase()
                        : (email.recipient_name?.charAt(0) || 'U').toUpperCase()
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <div className={`font-semibold truncate ${isUnread ? 'text-cyan-900' : 'text-slate-700'}`}>
                            {type === 'inbox'
                                ? (email.from || 'Unknown Sender')
                                : (email.recipient_name || email.recipient_email)
                            }
                        </div>
                        <div className="text-xs text-slate-500 ml-2 flex-shrink-0">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDate(type === 'inbox' ? email.date : email.sent_at)}
                        </div>
                    </div>

                    <div className={`text-sm mb-1 ${isUnread ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                        {email.subject || '(No Subject)'}
                    </div>

                    <div className="text-xs text-slate-500 truncate flex items-center gap-2">
                        {type === 'inbox' ? (
                            <>
                                {email.textBody?.substring(0, 100) || 'No content'}
                                {email.hasAttachments && (
                                    <span className="inline-flex items-center gap-1 text-cyan-600">
                                        <Paperclip className="w-3 h-3" />
                                        Lampiran
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-slate-400">
                                {email.recipient_email}
                            </span>
                        )}
                    </div>
                </div>

                {isUnread && (
                    <div className="w-3 h-3 bg-cyan-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
            </div>
        </div>
    );
};

const EmailDetailModal = ({ email, type, onClose, onReply }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{email.subject || '(No Subject)'}</h3>
                            <div className="text-cyan-100 text-sm">
                                {formatDate(type === 'inbox' ? email.date : email.sent_at)}
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
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
                            {type === 'inbox'
                                ? (email.from?.charAt(0) || 'U').toUpperCase()
                                : (email.recipient_name?.charAt(0) || 'U').toUpperCase()
                            }
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900">
                                {type === 'inbox' ? email.from : email.recipient_name}
                            </div>
                            <div className="text-sm text-slate-600">
                                {type === 'inbox' ? `To: ${email.to}` : `To: ${email.recipient_email}`}
                            </div>
                        </div>
                    </div>

                    {/* Email Body */}
                    <div className="prose max-w-none">
                        {type === 'inbox' ? (
                            email.htmlBody ? (
                                <div dangerouslySetInnerHTML={{ __html: email.htmlBody }} />
                            ) : (
                                <div className="whitespace-pre-wrap text-slate-700">{email.textBody}</div>
                            )
                        ) : (
                            <div className="whitespace-pre-wrap text-slate-700 bg-slate-50 p-4 rounded-lg">
                                {email.body}
                            </div>
                        )}
                    </div>

                    {/* Attachments */}
                    {type === 'inbox' && email.hasAttachments && (
                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-2 text-slate-600 font-medium mb-2">
                                <Paperclip className="w-4 h-4" />
                                Lampiran
                            </div>
                            <div className="text-sm text-slate-500">
                                Email ini memiliki lampiran
                            </div>
                        </div>
                    )}

                    {type === 'sent' && email.attachment_name && (
                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-2 text-slate-600 font-medium mb-2">
                                <Paperclip className="w-4 h-4" />
                                Lampiran
                            </div>
                            <div className="text-sm text-slate-500">
                                {email.attachment_name}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {type === 'inbox' && (
                    <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <button
                            onClick={onReply}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition font-medium"
                        >
                            <Reply className="w-5 h-5" />
                            Balas Email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ReplyModal = ({ email, userId, onClose, onSuccess }) => {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            alert('Mohon isi pesan balasan');
            return;
        }

        try {
            setSending(true);
            const res = await fetch('/api/replies/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    to: email.from,
                    subject: `Re: ${email.subject}`,
                    body: replyText,
                    in_reply_to: email.messageId
                })
            });

            const data = await res.json();
            if (res.ok) {
                onSuccess();
            } else {
                alert(data.message || 'Gagal mengirim balasan');
            }
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat mengirim balasan');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-slideUp">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl">
                    <h3 className="text-xl font-bold">Balas Email</h3>
                    <p className="text-cyan-100 text-sm mt-1">To: {email.from}</p>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Subjek
                        </label>
                        <input
                            type="text"
                            value={`Re: ${email.subject}`}
                            disabled
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Pesan
                        </label>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Tulis balasan Anda di sini..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSendReply}
                            disabled={sending}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition font-medium disabled:opacity-50"
                        >
                            {sending ? (
                                <>
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Kirim Balasan
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={sending}
                            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium disabled:opacity-50"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
