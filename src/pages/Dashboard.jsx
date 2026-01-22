import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProcurement } from '../context/ProcurementContext';

const Dashboard = () => {
  const { user, getRoleLabel } = useAuth();
  const { requests, getStats, getRequestsByUser } = useProcurement();

  const stats = getStats();
  const userRequests = getRequestsByUser(user?.id);
  const recentRequests = requests.slice(0, 5);

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-slate-100 text-slate-600',
      pending_approval: 'bg-amber-100 text-amber-700',
      compliance_review: 'bg-blue-100 text-blue-700',
      procurement_review: 'bg-purple-100 text-purple-700',
      clarification_needed: 'bg-orange-100 text-orange-700',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700'
    };
    const labels = {
      draft: 'Draft',
      pending_approval: 'Pending Approval',
      compliance_review: 'Compliance Review',
      procurement_review: 'Procurement Review',
      clarification_needed: 'Clarification Needed',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'text-slate-500',
      medium: 'text-amber-500',
      high: 'text-red-500'
    };
    return (
      <span className={`flex items-center gap-1 text-sm ${styles[priority]}`}>
        <span className={`w-2 h-2 rounded-full ${priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.total,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Pending Approval',
      value: stats.pending,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50'
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalValue),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      isLarge: true
    }
  ];

  const quickActions = [
    { 
      label: 'Create Request', 
      path: '/create-request', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      roles: ['requesting_unit', 'admin'],
      color: 'bg-amber-500 hover:bg-amber-600'
    },
    { 
      label: 'View Approvals', 
      path: '/approvals', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      roles: ['unit_approver', 'admin'],
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      label: 'Compliance Queue', 
      path: '/compliance', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      roles: ['compliance_officer', 'admin'],
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    { 
      label: 'Procurement', 
      path: '/procurement', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      roles: ['procurement_officer', 'admin'],
      color: 'bg-emerald-500 hover:bg-emerald-600'
    }
  ];

  const filteredQuickActions = quickActions.filter(action => 
    action.roles.includes(user?.role)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-slate-300">
              {getRoleLabel(user?.role)} • {user?.department}
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-slate-400">
              {new Date().toLocaleDateString('en-GH', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {filteredQuickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-xl ${action.color}`}
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${stat.bgLight}`}>
                <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
            <p className={`font-bold text-slate-800 ${stat.isLarge ? 'text-xl' : 'text-2xl'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Workflow Status Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Workflow Status Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Pending Approval', count: stats.pending, color: 'bg-amber-500' },
            { label: 'Compliance Review', count: stats.compliance, color: 'bg-blue-500' },
            { label: 'Procurement Review', count: stats.procurement, color: 'bg-purple-500' },
            { label: 'Clarification Needed', count: stats.clarification, color: 'bg-orange-500' },
            { label: 'Rejected', count: stats.rejected, color: 'bg-red-500' }
          ].map((item, index) => (
            <div key={index} className="text-center p-4 bg-slate-50 rounded-xl">
              <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <span className="text-white font-bold text-lg">{item.count}</span>
              </div>
              <p className="text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent Requests</h2>
            <Link 
              to="/my-requests" 
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentRequests.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500">No requests yet</p>
              </div>
            ) : (
              recentRequests.map((request) => (
                <Link
                  key={request.id}
                  to={`/request/${request.id}`}
                  className="block p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{request.title}</p>
                      <p className="text-sm text-slate-500 mt-1">{request.id} • {request.department}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(request.status)}
                      <p className="text-xs text-slate-400 mt-2">{formatDate(request.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Notifications / Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {requests.slice(0, 5).map((request, index) => {
              const lastTimeline = request.timeline[request.timeline.length - 1];
              return (
                <div key={index} className="p-4 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    lastTimeline?.status === 'completed' ? 'bg-emerald-100' :
                    lastTimeline?.status === 'pending' ? 'bg-amber-100' :
                    'bg-slate-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      lastTimeline?.status === 'completed' ? 'text-emerald-600' :
                      lastTimeline?.status === 'pending' ? 'text-amber-600' :
                      'text-slate-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800">
                      <span className="font-medium">{lastTimeline?.step}</span>
                      <span className="text-slate-500"> - {request.title}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      by {lastTimeline?.user} • {formatDate(lastTimeline?.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* My Requests Summary (for requesting unit) */}
      {(user?.role === 'requesting_unit' || user?.role === 'admin') && userRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">My Requests</h2>
            <Link 
              to="/my-requests" 
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userRequests.slice(0, 5).map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/request/${request.id}`} className="text-amber-600 hover:text-amber-700 font-medium">
                        {request.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800 max-w-xs truncate">{request.title}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatCurrency(request.estimatedCost)}</td>
                    <td className="px-4 py-3">{getPriorityBadge(request.priority)}</td>
                    <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
