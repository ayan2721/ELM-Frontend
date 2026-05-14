import { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import {
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChatBubbleLeftEllipsisIcon,
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ManagerDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const [commentModal, setCommentModal] = useState({
    show: false,
    leaveId: null,
    comment: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await leaveAPI.getPendingLeaves();
      const leavesData = response.data?.data?.leaves || [];
      setLeaves(leavesData);
      setStats(prev => ({ ...prev, pending: leavesData.length }));
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    setActionLoading(leaveId);
    try {
      await leaveAPI.approveLeave(leaveId, null);
      setLeaves(prev => prev.filter(l => l.id !== leaveId));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1
      }));
    } catch (error) {
      alert('Failed to approve leave request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!commentModal.comment.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setActionLoading(commentModal.leaveId);
    try {
      await leaveAPI.rejectLeave(commentModal.leaveId, commentModal.comment);
      setLeaves(prev => prev.filter(l => l.id !== commentModal.leaveId));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1
      }));
      closeRejectModal();
    } catch (error) {
      alert('Failed to reject leave request');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (leaveId) => setCommentModal({ show: true, leaveId, comment: '' });
  const closeRejectModal = () => setCommentModal({ show: false, leaveId: null, comment: '' });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <SparklesIcon className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Syncing dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f8fafc] text-slate-900 pb-20">
      <div className="max-w-full xl:max-w-7xl w-full min-w-0 mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-indigo-700 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-200/50">
          <div className="absolute top-0 right-0 -mt-20 w-52 h-52 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Manager Hub</h1>
                <p className="text-indigo-100 font-medium mt-1">Reviewing requests for your team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Pending Action', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50', icon: ClockIcon },
            { label: 'Total Approved', value: stats.approved, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircleIcon },
            { label: 'Total Rejected', value: stats.rejected, color: 'text-rose-600', bg: 'bg-rose-50', icon: XCircleIcon }
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-4xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Request Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-slate-800">Pending Requests</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-slate-600 text-sm font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              {leaves.length} Total
            </div>
          </div>

          {leaves.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">All caught up!</h3>
              <p className="text-slate-500 mt-2">There are no pending leave requests to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full w-full table-auto text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    {["Employee", "Type", "Period", "Reason", "Docs", "Action"].map(header => (
                      <th key={header} className="px-4 sm:px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-widest">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 sm:px-6 py-5 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                            {leave.user_name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate max-w-[100px]">{leave.user_name}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[130px]">{leave.user_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-5">
                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold capitalize">
                          {leave.leave_type?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <span>{leave.start_date}</span>
                            <ArrowRightIcon className="w-3 h-3 text-slate-300" />
                            <span>{leave.end_date}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium uppercase mt-1">Requested {new Date(leave.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-5 min-w-0">
                        <p className="text-sm text-slate-600 max-w-[140px] truncate italic">"{leave.reason}"</p>
                      </td>
                      <td className="px-4 sm:px-6 py-5 min-w-0">
                        {leave.document_url ? (
                          <a href={leave.document_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-indigo-600 font-bold text-xs hover:underline decoration-2 underline-offset-4 truncate max-w-[120px]">
                            <DocumentMagnifyingGlassIcon className="w-4 h-4" /> View
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">None</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            disabled={actionLoading === leave.id}
                            onClick={() => handleApprove(leave.id)}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm shadow-emerald-200"
                          >
                            {actionLoading === leave.id ? '...' : 'APPROVE'}
                          </button>
                          <button
                            disabled={actionLoading === leave.id}
                            onClick={() => openRejectModal(leave.id)}
                            className="bg-white border-2 border-rose-100 text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-black transition-all"
                          >
                            {actionLoading === leave.id ? '...' : <XMarkIcon className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Enhanced Rejection Modal */}
        {commentModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeRejectModal}></div>
            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-rose-50 rounded-2xl">
                  <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-rose-500" />
                </div>
                <button onClick={closeRejectModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <XMarkIcon className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800">Rejection Reason</h3>
              <p className="text-slate-500 text-sm mt-2 mb-6">Please explain why this request is being declined. The employee will see this comment.</p>

              <textarea
                autoFocus
                value={commentModal.comment}
                onChange={(e) => setCommentModal({ ...commentModal, comment: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all resize-none"
                placeholder="e.g., Project deadline on these dates..."
                rows={4}
              />

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button 
                  onClick={closeRejectModal}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleReject}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {actionLoading ? 'Declining...' : 'Decline Leave'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManagerDashboard;