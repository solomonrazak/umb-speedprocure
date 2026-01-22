import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProcurement } from '../context/ProcurementContext';
import { useToast } from '../context/ToastContext';

const ApprovalScreen = () => {
  const { user } = useAuth();
  const { requests, approveRequest, rejectRequest, requestClarification } = useProcurement();
  const { success, error: showError } = useToast();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionModal, setActionModal] = useState({ show: false, type: null });
  const [comments, setComments] = useState('');
  const [filter, setFilter] = useState('pending');

  const pendingRequests = requests.filter(r => r.status === 'pending_approval');
  const clarificationRequests = requests.filter(r => r.status === 'clarification_needed');

  const filteredRequests = filter === 'pending' ? pendingRequests : clarificationRequests;

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-slate-100 text-slate-600',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    );
  };

  const handleAction = (request, type) => {
    setSelectedRequest(request);
    setActionModal({ show: true, type });
    setComments('');
  };

  const handleSubmitAction = () => {
    if (!comments.trim() && actionModal.type !== 'approve') {
      showError('Please provide comments');
      return;
    }

    const userData = { id: user.id, name: user.name };

    try {
      switch (actionModal.type) {
        case 'approve':
          approveRequest(selectedRequest.id, userData, comments);
          success('Request approved successfully');
          break;
        case 'reject':
          rejectRequest(selectedRequest.id, userData, comments);
          success('Request rejected');
          break;
        case 'clarify':
          requestClarification(selectedRequest.id, userData, comments);
          success('Clarification requested');
          break;
      }
      setActionModal({ show: false, type: null });
      setSelectedRequest(null);
    } catch (err) {
      showError('Action failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Pending Approval</p>
              <p className="text-3xl font-bold mt-1">{pendingRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Awaiting Clarification</p>
              <p className="text-3xl font-bold mt-1">{clarificationRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Value Pending</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(pendingRequests.reduce((sum, r) => sum + r.estimatedCost, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="border-b border-slate-200">
          <div className="flex gap-1 p-1">
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              Pending Approval ({pendingRequests.length})
            </button>
            <button
              onClick={() => setFilter('clarification')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                filter === 'clarification'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              Clarification Requested ({clarificationRequests.length})
            </button>
          </div>
        </div>

        {/* Request List */}
        <div className="divide-y divide-slate-100">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">All caught up!</h3>
              <p className="text-slate-500">No requests pending your approval</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Link 
                            to={`/request/${request.id}`}
                            className="font-semibold text-slate-800 hover:text-amber-600 transition-colors"
                          >
                            {request.title}
                          </Link>
                          {getPriorityBadge(request.priority)}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {request.id} • {request.department} • {request.category}
                        </p>
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{request.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="text-slate-500">
                            By: <span className="font-medium text-slate-700">{request.requestedByName}</span>
                          </span>
                          <span className="text-slate-500">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Estimated Cost</p>
                      <p className="text-xl font-bold text-slate-800">{formatCurrency(request.estimatedCost)}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAction(request, 'approve')}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(request, 'reject')}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(request, 'clarify')}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                      >
                        Clarify
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="mt-4 ml-16">
                  <p className="text-xs text-slate-500 mb-2">Items ({request.items.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {request.items.slice(0, 3).map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                    {request.items.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-lg">
                        +{request.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Modal */}
      {actionModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className={`px-6 py-4 ${
              actionModal.type === 'approve' ? 'bg-emerald-500' :
              actionModal.type === 'reject' ? 'bg-red-500' :
              'bg-amber-500'
            } text-white`}>
              <h3 className="text-lg font-semibold">
                {actionModal.type === 'approve' ? 'Approve Request' :
                 actionModal.type === 'reject' ? 'Reject Request' :
                 'Request Clarification'}
              </h3>
              <p className="text-sm opacity-90 mt-1">{selectedRequest?.title}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Request ID:</span>
                    <span className="ml-2 font-medium">{selectedRequest?.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Amount:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedRequest?.estimatedCost)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Requester:</span>
                    <span className="ml-2 font-medium">{selectedRequest?.requestedByName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Department:</span>
                    <span className="ml-2 font-medium">{selectedRequest?.department}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {actionModal.type === 'approve' ? 'Comments (Optional)' :
                   actionModal.type === 'reject' ? 'Reason for Rejection *' :
                   'Clarification Request *'}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 resize-none"
                  placeholder={
                    actionModal.type === 'approve' ? 'Add any comments for the requester...' :
                    actionModal.type === 'reject' ? 'Please provide the reason for rejection...' :
                    'What information do you need from the requester?'
                  }
                />
              </div>

              {actionModal.type === 'approve' && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                  <p>This request will be forwarded to the Compliance Officer for review.</p>
                </div>
              )}

              {actionModal.type === 'reject' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <p>The requester will be notified of this rejection with your reason.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setActionModal({ show: false, type: null })}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAction}
                className={`px-6 py-2.5 text-white font-medium rounded-xl transition-colors ${
                  actionModal.type === 'approve' ? 'bg-emerald-500 hover:bg-emerald-600' :
                  actionModal.type === 'reject' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {actionModal.type === 'approve' ? 'Confirm Approval' :
                 actionModal.type === 'reject' ? 'Confirm Rejection' :
                 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalScreen;
