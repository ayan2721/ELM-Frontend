import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaveAPI } from '../services/api';
import { 
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const EmployeeDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
  try {
    const response = await leaveAPI.getMyLeaves();

    // FIX: support both response formats safely
    const leavesData =
      response?.data?.data?.leaves ||
      response?.data?.leaves ||
      [];

    setLeaves(leavesData);

    const stats = leavesData.reduce(
      (acc, leave) => {
        acc.total++;
        acc[leave.status] = (acc[leave.status] || 0) + 1;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0 }
    );

    setStats(stats);
  } catch (error) {
    console.error('Error fetching leaves:', error);
  } finally {
    setLoading(false);
  }
};

  const getColorGradient = (color) => {
    const gradients = {
      indigo: 'from-indigo-500 to-indigo-600',
      amber: 'from-amber-500 to-amber-600',
      emerald: 'from-emerald-500 to-emerald-600',
      red: 'from-red-500 to-red-600'
    };
    return gradients[color] || gradients.indigo;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'emerald', icon: CheckCircleIcon };
      case 'rejected':
        return { color: 'red', icon: XCircleIcon };
      case 'pending':
        return { color: 'amber', icon: ClockIcon };
      default:
        return { color: 'slate', icon: ClockIcon };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-slate-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Welcome to your
              <span className="block bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent mt-2">
                Leave Dashboard
              </span>
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Track requests, view stats, and apply for new leaves in one place
            </p>
          </div>
          
          <div className="lg:w-1/2 flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              to="/apply-leave"
              className="group flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm rounded-3xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              <PlusIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Apply New Leave
            </Link>
            <Link
              to="/leave-history"
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-3xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              <ChartBarIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              View History
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: stats.total, icon: ChartBarIcon, color: 'indigo' },
          { label: 'Pending', value: stats.pending, icon: ClockIcon, color: 'amber' },
          { label: 'Approved', value: stats.approved, icon: CheckCircleIcon, color: 'emerald' },
          { label: 'Rejected', value: stats.rejected, icon: XCircleIcon, color: 'red' }
        ].map(({ label, value, icon: Icon, color }, index) => (
          <div 
            key={label}
            className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer hover:bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50 group-hover:from-indigo-50 group-hover:to-emerald-50 transition-all duration-300">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${getColorGradient(color)} shadow-lg group-hover:scale-105 transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide opacity-80">{label}</p>
                  <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-2">
                    {value}
                  </p>
                </div>
              </div>
              <div className="w-2 h-2 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-8 bg-gradient-to-r from-slate-50 via-indigo-50 to-emerald-50 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <CalendarDaysIcon className="w-8 h-8 text-indigo-600 shadow-lg" />
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Recent Activity</h2>
              <p className="text-lg text-slate-600">Your 5 most recent leave requests</p>
            </div>
          </div>
          <Link
            to="/leave-history"
            className="group ml-auto inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            View Complete History
            <DocumentMagnifyingGlassIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          {leaves.length === 0 ? (
            <div className="text-center py-20 px-8 bg-gradient-to-b from-slate-50 to-white">
              <div className="mx-auto max-w-lg">
                <div className="w-28 h-28 bg-gradient-to-r from-slate-200 to-indigo-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <PlusIcon className="w-14 h-14 text-slate-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">No Leave Requests Yet</h3>
                <p className="text-xl text-slate-600 mb-8">
                  Start by applying for your first leave request
                </p>
                <Link
                  to="/apply-leave"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
                >
                  <PlusIcon className="w-5 h-5" />
                  Apply for Leave
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Applied
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaves.slice(0, 5).map((leave) => {
                    const statusConfig = getStatusConfig(leave.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr 
                        key={leave.id} 
                        className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-emerald-50 transition-all duration-300 group cursor-pointer"
                      >
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-800 font-bold shadow-sm group-hover:shadow-md transition-all">
                            {leave.leave_type.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <div className="font-bold text-lg text-slate-900">
                              {new Date(leave.start_date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <span>→</span>
                              {new Date(leave.end_date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg ${getStatusConfig(leave.status).color === 'emerald' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : getStatusConfig(leave.status).color === 'red' ? 'bg-red-100 text-red-800 border-red-200' : getStatusConfig(leave.status).color === 'amber' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-800 border-slate-200'} border group-hover:shadow-xl transition-all`}>
                            <StatusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="capitalize font-bold">{leave.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-semibold text-slate-900">
                          {new Date(leave.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
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
    </div>
  );
};

export default EmployeeDashboard;