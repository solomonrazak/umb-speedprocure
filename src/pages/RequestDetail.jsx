import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProcurement } from '../context/ProcurementContext';
import { useAuth } from '../context/AuthContext';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, getRequestById } = useProcurement();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('details');

  const request = useMemo(() => {
    return getRequestById ? getRequestById(id) : requests.find(r => r.id === id);
  }, [id, requests, getRequestById]);

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Request Not Found</h3>
          <p className="text-slate-500 mb-4">The request you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'compliance_review': return 'bg-blue-100 text-blue-800';
      case 'procurement_review': return 'bg-purple-100 text-purple-800';
      case 'in_progress': return 'bg-cyan-100 text-cyan-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'clarification_needed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const workflowSteps = [
    { key: 'draft', label: 'Draft', icon: '📝' },
    { key: 'pending_approval', label: 'Unit Approval', icon: '👤' },
    { key: 'compliance_review', label: 'Compliance', icon: '✓' },
    { key: 'procurement_review', label: 'Procurement', icon: '🛒' },
    { key: 'approved', label: 'Completed', icon: '✅' }
  ];

  const getCurrentStepIndex = () => {
    if (request.status === 'rejected') return -1;
    if (request.status === 'clarification_needed') {
      const lastApprovalIndex = request.timeline?.findIndex(t => 
        ['pending_approval', 'compliance_review', 'procurement_review'].includes(t.status)
      );
      return lastApprovalIndex >= 0 ? workflowSteps.findIndex(s => s.key === request.timeline[lastApprovalIndex].status) : 1;
    }
    if (request.status === 'in_progress') return 3;
    return workflowSteps.findIndex(s => s.key === request.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm mb-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{request.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-sm text-slate-500">{request.id}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {getStatusLabel(request.status)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
              {request.priority?.toUpperCase()} PRIORITY
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/status/${request.id}`)}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Track Status
          </button>
          {request.status === 'clarification_needed' && (
            <button
              onClick={() => navigate(`/clarification/${request.id}`)}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Respond
            </button>
          )}
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Workflow Progress</h3>
        <div className="relative">
          <div className="flex justify-between items-center">
            {workflowSteps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                  ${index < currentStepIndex 
                    ? 'bg-green-500 text-white' 
                    : index === currentStepIndex 
                    ? request.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                    : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {index < currentStepIndex ? '✓' : step.icon}
                </div>
                <span className={`text-xs mt-2 text-center max-w-[80px]
                  ${index <= currentStepIndex ? 'text-slate-900 font-medium' : 'text-slate-400'}`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-0" style={{ marginLeft: '40px', marginRight: '40px' }}>
            <div 
              className={`h-full transition-all duration-500 ${request.status === 'rejected' ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.max(0, (currentStepIndex / (workflowSteps.length - 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4">
          {[
            { key: 'details', label: 'Details' },
            { key: 'items', label: `Items (${request.items?.length || 0})` },
            { key: 'timeline', label: 'Timeline' },
            { key: 'attachments', label: `Attachments (${request.attachments?.length || 0})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-slate-200">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Requested By</h4>
                <p className="text-slate-900">{request.requestedBy}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Department</h4>
                <p className="text-slate-900">{request.department}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Category</h4>
                <p className="text-slate-900">{request.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Estimated Cost</h4>
                <p className="text-amber-600 font-semibold text-lg">{formatCurrency(request.estimatedCost)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Created Date</h4>
                <p className="text-slate-900">{formatDate(request.createdAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Last Updated</h4>
                <p className="text-slate-900">{formatDate(request.updatedAt || request.createdAt)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-1">Description</h4>
              <p className="text-slate-900 whitespace-pre-wrap">{request.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-1">Justification</h4>
              <p className="text-slate-900 whitespace-pre-wrap">{request.justification || 'No justification provided'}</p>
            </div>

            {request.assignedVendor && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Assigned Vendor</h4>
                <p className="text-blue-800 font-medium">{request.assignedVendor.name}</p>
                <p className="text-blue-600 text-sm">{request.assignedVendor.contact}</p>
              </div>
            )}
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="p-6">
            {request.items?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">#</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Item Name</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Description</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">Quantity</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">Unit Price</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {request.items.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                        <td className="px-4 py-3 text-slate-600">{item.description || '-'}</td>
                        <td className="px-4 py-3 text-right text-slate-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-right font-semibold text-slate-900">
                        Total Estimated Cost:
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-amber-600 text-lg">
                        {formatCurrency(request.estimatedCost)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No items added to this request
              </div>
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="p-6">
            {request.timeline?.length > 0 ? (
              <div className="space-y-4">
                {request.timeline.slice().reverse().map((entry, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        entry.status === 'rejected' ? 'bg-red-500' :
                        entry.status === 'approved' ? 'bg-green-500' :
                        'bg-amber-500'
                      }`} />
                      {index < request.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                            {getStatusLabel(entry.status)}
                          </span>
                          <p className="text-slate-900 mt-2">{entry.comment}</p>
                          <p className="text-sm text-slate-500 mt-1">By {entry.user}</p>
                        </div>
                        <span className="text-sm text-slate-500">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No timeline entries yet
              </div>
            )}
          </div>
        )}

        {/* Attachments Tab */}
        {activeTab === 'attachments' && (
          <div className="p-6">
            {request.attachments?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {request.attachments.map((file, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{file.name}</p>
                      <p className="text-sm text-slate-500">
                        {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No attachments
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetail;
