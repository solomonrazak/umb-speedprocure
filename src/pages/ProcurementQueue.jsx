import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcurement } from '../context/ProcurementContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProcurementQueue = () => {
  const navigate = useNavigate();
  const { requests, vendors, procurementMethods, approveProcurement } = useProcurement();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [procurementNotes, setProcurementNotes] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Filter requests for procurement review
  const procurementRequests = useMemo(() => {
    let filtered = requests.filter(req => req.status === 'procurement_review');
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(req => req.category === filterCategory);
    }
    if (filterPriority !== 'all') {
      filtered = filtered.filter(req => req.priority === filterPriority);
    }
    
    return filtered;
  }, [requests, filterCategory, filterPriority]);

  const completedRequests = useMemo(() => {
    return requests.filter(req => req.status === 'approved').slice(0, 10);
  }, [requests]);

  const displayedRequests = useMemo(() => {
    switch (activeTab) {
      case 'pending': return procurementRequests;
      case 'completed': return completedRequests;
      default: return procurementRequests;
    }
  }, [activeTab, procurementRequests, completedRequests]);

  const categories = [...new Set(requests.map(r => r.category))].filter(Boolean);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'procurement_review': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
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
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAssignVendor = () => {
    if (!selectedRequest || !selectedVendor) {
      showToast('Please select a vendor', 'warning');
      return;
    }

    if (!selectedMethod) {
      showToast('Please select a procurement method', 'warning');
      return;
    }

    const vendor = vendors.find(v => v.id === selectedVendor);
    
    approveProcurement(
      selectedRequest.id,
      { id: user?.id, name: user?.name || 'Procurement Officer' },
      selectedVendor,
      selectedMethod,
      procurementNotes || `Vendor assigned: ${vendor?.name}`
    );
    
    showToast(`Vendor "${vendor?.name}" assigned and request approved`, 'success');
    setShowAssignModal(false);
    setSelectedRequest(null);
    setSelectedVendor('');
    setSelectedMethod('');
    setProcurementNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Procurement Queue</h1>
          <p className="text-slate-600 mt-1">
            Manage vendor assignments and procurement progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
            <span className="font-semibold">{procurementRequests.length}</span> awaiting action
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pending'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Pending Assignment ({procurementRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'completed'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Recently Completed ({completedRequests.length})
          </button>
        </nav>
      </div>

      {/* Request List */}
      {displayedRequests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No requests found</h3>
          <p className="text-slate-500">
            {activeTab === 'pending' 
              ? 'No requests awaiting vendor assignment'
              : 'No recently completed requests'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Request Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority?.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status?.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {request.id}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {request.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {request.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Requested By</span>
                      <p className="font-medium text-slate-900">{request.requestedByName || request.requestedBy}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Department</span>
                      <p className="font-medium text-slate-900">{request.department}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Category</span>
                      <p className="font-medium text-slate-900">{request.category}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Estimated Cost</span>
                      <p className="font-medium text-amber-600">{formatCurrency(request.estimatedCost)}</p>
                    </div>
                  </div>

                  {/* Assigned Vendor (for completed) */}
                  {request.vendorAssigned && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-900">
                          Vendor: {request.vendorAssigned}
                        </span>
                        {request.procurementMethod && (
                          <span className="text-sm text-slate-500">
                            • {request.procurementMethod}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items Summary */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                      {request.items?.length || 0} item(s) • 
                      Submitted: {formatDate(request.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2 lg:w-40">
                  {activeTab === 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowAssignModal(true);
                      }}
                      className="flex-1 lg:flex-none bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                    >
                      Assign Vendor
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/request/${request.id}`)}
                    className="flex-1 lg:flex-none border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/tracking/${request.id}`)}
                    className="flex-1 lg:flex-none border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    Track Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Vendor Modal */}
      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Assign Vendor & Approve</h2>
              <p className="text-slate-600 text-sm mt-1">
                Select a vendor and procurement method for this request
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Request Summary */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900">{selectedRequest.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedRequest.category}</p>
                <p className="text-amber-600 font-medium mt-2">
                  {formatCurrency(selectedRequest.estimatedCost)}
                </p>
              </div>

              {/* Vendor Selection */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Select Vendor</h4>
                <div className="space-y-3">
                  {vendors.map(vendor => (
                    <label 
                      key={vendor.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedVendor === vendor.id 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="vendor"
                        value={vendor.id}
                        checked={selectedVendor === vendor.id}
                        onChange={(e) => setSelectedVendor(e.target.value)}
                        className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{vendor.name}</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                            {vendor.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-amber-500">{'★'.repeat(Math.floor(vendor.rating))}</span>
                          <span className="text-sm text-slate-500">{vendor.rating}/5</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Procurement Method */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Procurement Method</h4>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select a method...</option>
                  {procurementMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Procurement Notes (Optional)
                </label>
                <textarea
                  value={procurementNotes}
                  onChange={(e) => setProcurementNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Add any notes about this procurement..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedRequest(null);
                  setSelectedVendor('');
                  setSelectedMethod('');
                  setProcurementNotes('');
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignVendor}
                disabled={!selectedVendor || !selectedMethod}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedVendor && selectedMethod
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Assign & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementQueue;