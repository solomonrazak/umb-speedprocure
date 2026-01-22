import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProcurement } from '../context/ProcurementContext';
import { useToast } from '../context/ToastContext';

const CreateRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, departments, createRequest, submitRequest } = useProcurement();
  const { success, error: showError } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    department: user?.department || '',
    priority: 'medium',
    justification: '',
    items: [{ name: '', quantity: 1, unitPrice: 0, total: 0 }],
    attachments: []
  });

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Item Details' },
    { number: 3, title: 'Justification & Documents' },
    { number: 4, title: 'Review & Submit' }
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.department) newErrors.department = 'Department is required';
    }

    if (step === 2) {
      if (formData.items.length === 0) {
        newErrors.items = 'At least one item is required';
      }
      formData.items.forEach((item, index) => {
        if (!item.name.trim()) newErrors[`item_${index}_name`] = 'Item name is required';
        if (item.quantity < 1) newErrors[`item_${index}_quantity`] = 'Quantity must be at least 1';
        if (item.unitPrice <= 0) newErrors[`item_${index}_price`] = 'Price must be greater than 0';
      });
    }

    if (step === 3) {
      if (!formData.justification.trim()) newErrors.justification = 'Justification is required';
      if (formData.justification.length < 50) newErrors.justification = 'Justification must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
    
    const errorKey = `item_${index}_${field === 'unitPrice' ? 'price' : field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: formatFileSize(file.size),
      file: file,
      uploadedAt: new Date().toISOString()
    }));
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleSaveDraft = async () => {
    try {
      const request = createRequest({
        ...formData,
        estimatedCost: calculateTotal(),
        currency: 'GHS',
        requestedBy: user.id,
        requestedByName: user.name
      });
      success('Draft saved successfully');
      navigate(`/request/${request.id}`);
    } catch (err) {
      showError('Failed to save draft');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    try {
      const request = createRequest({
        ...formData,
        estimatedCost: calculateTotal(),
        currency: 'GHS',
        requestedBy: user.id,
        requestedByName: user.name
      });
      submitRequest(request.id);
      success('Request submitted successfully');
      navigate(`/request/${request.id}`);
    } catch (err) {
      showError('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  currentStep > step.number 
                    ? 'bg-emerald-500 text-white' 
                    : currentStep === step.number 
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`ml-3 font-medium hidden sm:block ${
                  currentStep === step.number ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded ${
                  currentStep > step.number ? 'bg-emerald-500' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Request Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-amber-500'
                  }`}
                  placeholder="e.g., Office Furniture Procurement"
                />
                {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-amber-500'
                  }`}
                  placeholder="Provide a detailed description of what you need..."
                />
                {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.category ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-amber-500'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-2 text-sm text-red-500">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.department ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-amber-500'
                    }`}
                  >
                    <option value="">Select a department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="mt-2 text-sm text-red-500">{errors.department}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                <div className="flex gap-4">
                  {['low', 'medium', 'high'].map(priority => (
                    <label key={priority} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={formData.priority === priority}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        priority === 'high' ? 'bg-red-100 text-red-700' :
                        priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Item Details */}
        {currentStep === 2 && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Item Details</h2>
              <button
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Item
              </button>
            </div>

            {errors.items && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {errors.items}
              </div>
            )}

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-600">Item {index + 1}</span>
                    {formData.items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Item Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none ${
                          errors[`item_${index}_name`] ? 'border-red-300' : 'border-slate-200 focus:border-amber-500'
                        }`}
                        placeholder="Item name"
                      />
                      {errors[`item_${index}_name`] && (
                        <p className="mt-1 text-xs text-red-500">{errors[`item_${index}_name`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none ${
                          errors[`item_${index}_quantity`] ? 'border-red-300' : 'border-slate-200 focus:border-amber-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Unit Price (GHS)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none ${
                          errors[`item_${index}_price`] ? 'border-red-300' : 'border-slate-200 focus:border-amber-500'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <span className="text-sm text-slate-500">Subtotal: </span>
                    <span className="text-lg font-semibold text-slate-800">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-800">Total Estimated Cost</span>
                <span className="text-2xl font-bold text-amber-600">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Justification & Documents */}
        {currentStep === 3 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Justification & Supporting Documents</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Business Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="justification"
                  value={formData.justification}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                    errors.justification ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-amber-500'
                  }`}
                  placeholder="Explain why this procurement is necessary, how it aligns with business objectives, and the impact of not proceeding..."
                />
                {errors.justification && <p className="mt-2 text-sm text-red-500">{errors.justification}</p>}
                <p className="mt-2 text-xs text-slate-500">
                  Minimum 50 characters. {formData.justification.length}/50
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-amber-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-medium mb-1">Click to upload files</p>
                    <p className="text-sm text-slate-500">or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-2">PDF, Word, Excel, Images (max 10MB each)</p>
                  </label>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{file.name}</p>
                            <p className="text-xs text-slate-500">{file.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-600 p-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Review Your Request</h2>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-700 mb-3">Basic Information</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-slate-500">Title</dt>
                    <dd className="font-medium text-slate-800">{formData.title}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Category</dt>
                    <dd className="font-medium text-slate-800">{formData.category}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Department</dt>
                    <dd className="font-medium text-slate-800">{formData.department}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Priority</dt>
                    <dd className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      formData.priority === 'high' ? 'bg-red-100 text-red-700' :
                      formData.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-3">
                  <dt className="text-xs text-slate-500">Description</dt>
                  <dd className="text-sm text-slate-700 mt-1">{formData.description}</dd>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-700 mb-3">Items ({formData.items.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 text-slate-500 font-medium">Item</th>
                        <th className="text-center py-2 text-slate-500 font-medium">Qty</th>
                        <th className="text-right py-2 text-slate-500 font-medium">Unit Price</th>
                        <th className="text-right py-2 text-slate-500 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index} className="border-b border-slate-100">
                          <td className="py-2 text-slate-800">{item.name}</td>
                          <td className="py-2 text-center text-slate-800">{item.quantity}</td>
                          <td className="py-2 text-right text-slate-800">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-2 text-right font-medium text-slate-800">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="py-3 text-right font-semibold text-slate-800">Total Estimated Cost:</td>
                        <td className="py-3 text-right text-xl font-bold text-amber-600">{formatCurrency(calculateTotal())}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Justification */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-700 mb-3">Business Justification</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{formData.justification}</p>
              </div>

              {/* Attachments */}
              {formData.attachments.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-700 mb-3">Attachments ({formData.attachments.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.attachments.map((file, index) => (
                      <span key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm">
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Notice */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-amber-800">Ready to Submit</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Once submitted, this request will be sent to your unit approver for review. 
                      You will receive notifications on the status of your request.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {currentStep === 4 && (
              <button
                onClick={handleSaveDraft}
                className="px-5 py-2.5 border-2 border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Save as Draft
              </button>
            )}
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Request
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
