import { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getMyLeaves();
      setLeaves(response.data.data.leaves);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
  switch (status) {
    case 'approved':
      return { 
        color: 'emerald',
        text: 'text-emerald-700',
        bg: 'bg-emerald-100',
        hover: 'hover:bg-emerald-200',
        gradientFrom: 'from-emerald-500',
        gradientTo: 'to-emerald-600',
        icon: CheckCircleIcon 
      };

    case 'rejected':
      return { 
        color: 'red',
        text: 'text-red-700',
        bg: 'bg-red-100',
        hover: 'hover:bg-red-200',
        gradientFrom: 'from-red-500',
        gradientTo: 'to-red-600',
        icon: XCircleIcon 
      };

    case 'pending':
      return { 
        color: 'amber',
        text: 'text-amber-700',
        bg: 'bg-amber-100',
        hover: 'hover:bg-amber-200',
        gradientFrom: 'from-amber-500',
        gradientTo: 'to-amber-600',
        icon: ClockIcon 
      };

    default:
      return { 
        color: 'slate',
        text: 'text-slate-700',
        bg: 'bg-slate-100',
        hover: 'hover:bg-slate-200',
        gradientFrom: 'from-slate-500',
        gradientTo: 'to-slate-600',
        icon: ClockIcon 
      };
  }
};

  const filteredLeaves = leaves.filter(leave => {
    if (filter === 'all') return true;
    return leave.status === filter;
  });

  const statusCounts = {
    all: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl p-12">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Loading your leave history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Leave History
          </h1>
          <p className="text-xl text-slate-600">Track all your leave requests and their status</p>
        </div>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => {
            const config = getStatusConfig(status);
            const count = statusCounts[status];
            const isActive = filter === status;
            
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-sm transition-all duration-300 border-2 ${
                  isActive 
  ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white border-transparent shadow-lg hover:shadow-xl hover:-translate-y-0.5`
  : `bg-white text-${config.color}-700 border-slate-200 hover:${config.hover} hover:border-slate-300 hover:shadow-md`
                }`}
              >
                <config.icon className={`w-4 h-4 ${isActive ? 'group-hover:scale-110 transition-transform' : ''}`} />
                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                {count > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white/20 backdrop-blur-sm' : 'bg-white shadow-sm'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <CalendarDaysIcon className="w-7 h-7 text-indigo-600" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your Leave Requests</h2>
              <p className="text-slate-600">{filteredLeaves.length} requests matching current filter</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredLeaves.length === 0 ? (
          <div className="text-center py-20 px-8 bg-gradient-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-indigo-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CalendarDaysIcon className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                No {filter === 'all' ? 'leave requests' : `${filter} requests`} found
              </h3>
              <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                {filter === 'all'
                  ? "Get started by submitting your first leave request."
                  : `Try adjusting your filter or submit a new leave request.`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaves.map((leave) => {
                  const statusConfig = getStatusConfig(leave.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr 
                      key={leave.id} 
                      className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-emerald-50 transition-all duration-300 group"
                    >
                      {/* Leave Type */}
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-800 font-semibold shadow-sm group-hover:shadow-md transition-all">
                          {leave.leave_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900">
                            {new Date(leave.start_date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <span>→</span>
                            <span>{new Date(leave.end_date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-6">
                        <div 
                          className="text-sm text-slate-700 pr-4 line-clamp-2 group-hover:text-slate-900 transition-all max-w-xs"
                          title={leave.reason}
                        >
                          {leave.reason}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold shadow-sm ${statusConfig.bg} text-${statusConfig.color}-700 group-hover:${statusConfig.hover} transition-all`}>
                          <StatusIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="capitalize">{leave.status}</span>
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="px-6 py-6 text-sm font-medium text-slate-900">
                        {new Date(leave.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </td>

                      {/* Document */}
                      <td className="px-6 py-6">
                        {leave.document_url ? (
                          <a
                            href={leave.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500 hover:bg-indigo-50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group/link"
                          >
                            <DocumentTextIcon className="w-4 h-4 mr-2 group-hover/link:translate-x-1 transition-transform" />
                            View Document
                          </a>
                        ) : (
                          <span className="px-4 py-2.5 text-sm text-slate-400 bg-slate-100/50 rounded-xl">No document</span>
                        )}
                      </td>

                      {/* Manager Comment */}
                      <td className="px-6 py-6">
                        {leave.manager_comment ? (
                          <div className="max-w-xs">
                            <div 
                              className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-xl shadow-sm line-clamp-2 group-hover:shadow-md transition-all"
                              title={leave.manager_comment}
                            >
                              {leave.manager_comment}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 px-3 py-2 bg-slate-50/50 rounded-xl">No comment</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveHistory;