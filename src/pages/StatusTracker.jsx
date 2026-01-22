import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProcurement } from '../context/ProcurementContext';

const StatusTracker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, getRequestById } = useProcurement();

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
      case 'draft': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'compliance_review': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'procurement_review': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'in_progress': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'clarification_needed': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusLabel = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown';
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

  // Workflow steps with detailed info
  const workflowSteps = [
    { 
      key: 'draft', 
      label: 'Draft Created', 
      description: 'Request initiated and saved as draft',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      key: 'pending_approval', 
      label: 'Unit Approval', 
      description: 'Awaiting approval from unit head/supervisor',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      key: 'compliance_review', 
      label: 'Compliance Review', 
      description: 'Review for regulatory and policy compliance',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      key: 'procurement_review', 
      label: 'Procurement Processing', 
      description: 'Vendor selection and procurement execution',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      key: 'in_progress', 
      label: 'In Progress', 
      description: 'Procurement in progress with assigned vendor',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      key: 'approved', 
      label: 'Completed', 
      description: 'Procurement successfully completed',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const getCurrentStepIndex = () => {
    if (request.status === 'rejected') return -1;
    if (request.status === 'clarification_needed') {
      // Find where clarification was requested from timeline
      const lastEntry = request.timeline?.slice().reverse().find(t => 
        t.status === 'clarification_needed'
      );
      if (lastEntry?.comment?.includes('Unit')) return 1;
      if (lastEntry?.comment?.includes('Compliance')) return 2;
      return 1;
    }
    return workflowSteps.findIndex(s => s.key === request.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  // Calculate estimated completion
  const getEstimatedCompletion = () => {
    const daysPerStep = 2; // Average days per step
    const remainingSteps = workflowSteps.length - 1 - currentStepIndex;
    if (remainingSteps <= 0) return null;
    
    const estimatedDays = remainingSteps * daysPerStep;
    const date = new Date();
    date.setDate(date.getDate() + estimatedDays);
    return date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get timeline entry for a specific step
  const getTimelineForStep = (stepKey) => {
    return request.timeline?.find(t => t.status === stepKey);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <h1 className="text-2xl font-bold text-slate-900">Request Status Tracker</h1>
        <p className="text-slate-600 mt-1">Track the progress of your procurement request</p>
      </div>

      {/* Request Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{request.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{request.id}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-500">Estimated Value</p>
              <p className="text-xl font-bold text-amber-600">{formatCurrency(request.estimatedCost)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
              {getStatusLabel(request.status)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-900 font-medium">
              {request.status === 'approved' ? '100%' : 
               request.status === 'rejected' ? '0%' :
               `${Math.round((currentStepIndex / (workflowSteps.length - 1)) * 100)}%`}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                request.status === 'rejected' ? 'bg-red-500' :
                request.status === 'approved' ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ 
                width: request.status === 'approved' ? '100%' :
                       request.status === 'rejected' ? '100%' :
                       `${Math.max(5, (currentStepIndex / (workflowSteps.length - 1)) * 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-sm text-slate-500">Created</p>
            <p className="text-slate-900 font-medium">{formatDate(request.createdAt).split(',')[0]}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Department</p>
            <p className="text-slate-900 font-medium">{request.department}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Category</p>
            <p className="text-slate-900 font-medium">{request.category}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Est. Completion</p>
            <p className="text-slate-900 font-medium">
              {request.status === 'approved' ? 'Completed' :
               request.status === 'rejected' ? 'N/A' :
               getEstimatedCompletion() || 'Processing'}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Workflow Steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Workflow Steps</h3>
        
        <div className="relative">
          {workflowSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;
            const isRejected = request.status === 'rejected' && index === 0;
            const timelineEntry = getTimelineForStep(step.key);
            
            return (
              <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Vertical line */}
                {index < workflowSteps.length - 1 && (
                  <div className={`absolute left-5 top-10 w-0.5 h-full -ml-px ${
                    isCompleted ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
                
                {/* Step icon */}
                <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrent ? (request.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white') :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1">
                  <div className={`p-4 rounded-lg border ${
                    isCompleted ? 'bg-green-50 border-green-200' :
                    isCurrent ? (request.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200') :
                    'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold ${
                          isCompleted ? 'text-green-900' :
                          isCurrent ? (request.status === 'rejected' ? 'text-red-900' : 'text-amber-900') :
                          'text-slate-400'
                        }`}>
                          {step.label}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          isCompleted ? 'text-green-700' :
                          isCurrent ? (request.status === 'rejected' ? 'text-red-700' : 'text-amber-700') :
                          'text-slate-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                      {timelineEntry && (
                        <span className={`text-xs ${
                          isCompleted ? 'text-green-600' :
                          isCurrent ? (request.status === 'rejected' ? 'text-red-600' : 'text-amber-600') :
                          'text-slate-400'
                        }`}>
                          {formatDate(timelineEntry.timestamp)}
                        </span>
                      )}
                    </div>

                    {/* Timeline entry details */}
                    {timelineEntry && (
                      <div className={`mt-3 pt-3 border-t ${
                        isCompleted ? 'border-green-200' :
                        isCurrent ? (request.status === 'rejected' ? 'border-red-200' : 'border-amber-200') :
                        'border-slate-200'
                      }`}>
                        <p className={`text-sm ${
                          isCompleted ? 'text-green-800' :
                          isCurrent ? (request.status === 'rejected' ? 'text-red-800' : 'text-amber-800') :
                          'text-slate-600'
                        }`}>
                          {timelineEntry.comment}
                        </p>
                        <p className={`text-xs mt-1 ${
                          isCompleted ? 'text-green-600' :
                          isCurrent ? (request.status === 'rejected' ? 'text-red-600' : 'text-amber-600') :
                          'text-slate-400'
                        }`}>
                          — {timelineEntry.user}
                        </p>
                      </div>
                    )}

                    {/* Current step indicator */}
                    {isCurrent && request.status !== 'rejected' && request.status !== 'approved' && (
                      <div className="mt-3 flex items-center gap-2 text-amber-600">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Currently at this stage</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rejected status note */}
        {request.status === 'rejected' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-red-900">Request Rejected</h4>
                <p className="text-sm text-red-700 mt-1">
                  This request has been rejected. Please review the feedback and submit a new request if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Clarification needed note */}
        {request.status === 'clarification_needed' && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-orange-900">Clarification Requested</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Additional information has been requested. Please respond to continue the approval process.
                </p>
                <button
                  onClick={() => navigate(`/clarification/${request.id}`)}
                  className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Respond to Clarification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate(`/request/${request.id}`)}
          className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Full Details
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Status
        </button>
      </div>
    </div>
  );
};

export default StatusTracker;
