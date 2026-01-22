import React, { useState, useMemo } from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminPanel = () => {
  const { 
    requests, categories, departments, vendors, 
    addCategory, addDepartment, addVendor,
    removeCategory, removeDepartment, removeVendor 
  } = useProcurement();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    contact: '',
    category: '',
    location: '',
    rating: 3
  });

  // Statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => ['pending_approval', 'compliance_review', 'procurement_review'].includes(r.status)).length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    const totalValue = requests.reduce((sum, r) => sum + (r.estimatedCost || 0), 0);
    const avgValue = total > 0 ? totalValue / total : 0;

    // Category breakdown
    const categoryBreakdown = categories.map(cat => ({
      name: cat,
      count: requests.filter(r => r.category === cat).length,
      value: requests.filter(r => r.category === cat).reduce((sum, r) => sum + (r.estimatedCost || 0), 0)
    })).sort((a, b) => b.count - a.count);

    // Department breakdown
    const departmentBreakdown = departments.map(dept => ({
      name: dept,
      count: requests.filter(r => r.department === dept).length,
      value: requests.filter(r => r.department === dept).reduce((sum, r) => sum + (r.estimatedCost || 0), 0)
    })).sort((a, b) => b.count - a.count);

    // Status breakdown
    const statusBreakdown = [
      { status: 'draft', label: 'Draft', count: requests.filter(r => r.status === 'draft').length },
      { status: 'pending_approval', label: 'Pending Approval', count: requests.filter(r => r.status === 'pending_approval').length },
      { status: 'compliance_review', label: 'Compliance Review', count: requests.filter(r => r.status === 'compliance_review').length },
      { status: 'procurement_review', label: 'Procurement Review', count: requests.filter(r => r.status === 'procurement_review').length },
      { status: 'in_progress', label: 'In Progress', count: requests.filter(r => r.status === 'in_progress').length },
      { status: 'approved', label: 'Approved', count: approved },
      { status: 'rejected', label: 'Rejected', count: rejected },
      { status: 'clarification_needed', label: 'Clarification Needed', count: requests.filter(r => r.status === 'clarification_needed').length }
    ];

    return { total, pending, approved, rejected, totalValue, avgValue, categoryBreakdown, departmentBreakdown, statusBreakdown };
  }, [requests, categories, departments]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const openAddModal = (type) => {
    setModalType(type);
    setNewItem({
      name: '',
      description: '',
      contact: '',
      category: '',
      location: '',
      rating: 3
    });
    setShowAddModal(true);
  };

  const handleAdd = () => {
    if (!newItem.name.trim()) {
      showToast('Please enter a name', 'warning');
      return;
    }

    switch (modalType) {
      case 'category':
        if (addCategory) addCategory(newItem.name);
        showToast(`Category "${newItem.name}" added successfully`, 'success');
        break;
      case 'department':
        if (addDepartment) addDepartment(newItem.name);
        showToast(`Department "${newItem.name}" added successfully`, 'success');
        break;
      case 'vendor':
        if (!newItem.contact.trim()) {
          showToast('Please enter vendor contact', 'warning');
          return;
        }
        if (addVendor) {
          addVendor({
            id: `V${Date.now()}`,
            name: newItem.name,
            contact: newItem.contact,
            category: newItem.category || 'General',
            location: newItem.location || 'Accra',
            rating: newItem.rating
          });
        }
        showToast(`Vendor "${newItem.name}" added successfully`, 'success');
        break;
    }

    setShowAddModal(false);
  };

  const handleDelete = (type, item) => {
    if (!window.confirm(`Are you sure you want to delete "${typeof item === 'string' ? item : item.name}"?`)) {
      return;
    }

    switch (type) {
      case 'category':
        if (removeCategory) removeCategory(item);
        showToast(`Category deleted`, 'info');
        break;
      case 'department':
        if (removeDepartment) removeDepartment(item);
        showToast(`Department deleted`, 'info');
        break;
      case 'vendor':
        if (removeVendor) removeVendor(item.id);
        showToast(`Vendor deleted`, 'info');
        break;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-slate-500';
      case 'pending_approval': return 'bg-yellow-500';
      case 'compliance_review': return 'bg-blue-500';
      case 'procurement_review': return 'bg-purple-500';
      case 'in_progress': return 'bg-cyan-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'clarification_needed': return 'bg-orange-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-slate-600 mt-1">
          System configuration and management dashboard
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Requests</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Value</p>
          <p className="text-lg font-bold text-amber-600 mt-1">{formatCurrency(stats.totalValue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Avg. Value</p>
          <p className="text-lg font-bold text-slate-700 mt-1">{formatCurrency(stats.avgValue)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'categories', label: `Categories (${categories?.length || 0})` },
            { key: 'departments', label: `Departments (${departments?.length || 0})` },
            { key: 'vendors', label: `Vendors (${vendors?.length || 0})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
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
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Request Status Distribution</h3>
            <div className="space-y-3">
              {stats.statusBreakdown.map(item => (
                <div key={item.status} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                  <span className="flex-1 text-sm text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.count}</span>
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStatusColor(item.status)}`}
                      style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Requests by Category</h3>
            <div className="space-y-3">
              {stats.categoryBreakdown.slice(0, 6).map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-amber-100 text-amber-800 text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm text-slate-600">{item.name}</span>
                  <span className="font-medium text-slate-900">{item.count}</span>
                  <span className="text-sm text-slate-500">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Requests by Department</h3>
            <div className="space-y-3">
              {stats.departmentBreakdown.slice(0, 6).map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-blue-100 text-blue-800 text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm text-slate-600">{item.name}</span>
                  <span className="font-medium text-slate-900">{item.count}</span>
                  <span className="text-sm text-slate-500">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openAddModal('category')}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <svg className="w-6 h-6 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <p className="font-medium text-slate-900">Add Category</p>
                <p className="text-sm text-slate-500">Create new procurement category</p>
              </button>
              <button
                onClick={() => openAddModal('department')}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <svg className="w-6 h-6 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="font-medium text-slate-900">Add Department</p>
                <p className="text-sm text-slate-500">Create new department</p>
              </button>
              <button
                onClick={() => openAddModal('vendor')}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <svg className="w-6 h-6 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="font-medium text-slate-900">Add Vendor</p>
                <p className="text-sm text-slate-500">Register new vendor</p>
              </button>
              <button
                onClick={() => {/* Export functionality */}}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <svg className="w-6 h-6 text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-medium text-slate-900">Export Data</p>
                <p className="text-sm text-slate-500">Download reports</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Procurement Categories</h3>
            <button
              onClick={() => openAddModal('category')}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {categories?.map((category, index) => (
              <div key={category} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-amber-100 text-amber-800 font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-slate-900">{category}</span>
                  <span className="text-sm text-slate-500">
                    ({requests.filter(r => r.category === category).length} requests)
                  </span>
                </div>
                <button
                  onClick={() => handleDelete('category', category)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Departments</h3>
            <button
              onClick={() => openAddModal('department')}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Department
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {departments?.map((department, index) => (
              <div key={department} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-blue-100 text-blue-800 font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-slate-900">{department}</span>
                  <span className="text-sm text-slate-500">
                    ({requests.filter(r => r.department === department).length} requests)
                  </span>
                </div>
                <button
                  onClick={() => handleDelete('department', department)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Registered Vendors</h3>
            <button
              onClick={() => openAddModal('vendor')}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Vendor
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Vendor</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Category</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Location</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Rating</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vendors?.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{vendor.name}</p>
                        <p className="text-sm text-slate-500">{vendor.contact}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{vendor.location}</td>
                    <td className="px-4 py-3">
                      <span className="text-amber-500">
                        {'★'.repeat(vendor.rating)}{'☆'.repeat(5-vendor.rating)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDelete('vendor', vendor)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder={`Enter ${modalType} name`}
                />
              </div>

              {modalType === 'vendor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newItem.contact}
                      onChange={(e) => setNewItem(prev => ({ ...prev, contact: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="Email or phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    >
                      <option value="">Select category</option>
                      {categories?.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="City or region"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setNewItem(prev => ({ ...prev, rating }))}
                          className={`text-2xl ${rating <= newItem.rating ? 'text-amber-500' : 'text-slate-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
