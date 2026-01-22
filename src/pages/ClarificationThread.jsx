import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProcurement } from '../context/ProcurementContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ClarificationThread = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, getRequestById, addClarificationResponse, updateRequestStatus, addTimelineEntry } = useProcurement();
  const { user } = useAuth();
  const { showToast } = useToast();
  const messagesEndRef = useRef(null);

  const [response, setResponse] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const request = useMemo(() => {
    return getRequestById ? getRequestById(id) : requests.find(r => r.id === id);
  }, [id, requests, getRequestById]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [request?.clarificationRequests]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const pendingClarifications = request.clarificationRequests?.filter(c => !c.resolved) || [];
  const resolvedClarifications = request.clarificationRequests?.filter(c => c.resolved) || [];
  const allMessages = request.clarificationRequests || [];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      showToast('Please enter a response', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the latest unresolved clarification request
      const latestClarification = pendingClarifications[pendingClarifications.length - 1];
      
      if (latestClarification && addClarificationResponse) {
        addClarificationResponse(request.id, latestClarification.id, {
          message: response,
          respondedBy: user?.id,
          respondedByName: user?.name || 'Requester',
          attachments: attachments.map(f => ({ name: f.name, size: f.size }))
        });
      }

      // Determine which status to return to based on the clarification stage
      const returnStatus = latestClarification?.stage || 'pending_approval';
      updateRequestStatus(request.id, returnStatus);
      
      addTimelineEntry(request.id, {
        status: returnStatus,
        comment: `Clarification response provided: ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}`,
        user: user?.name || 'Requester'
      });

      showToast('Response submitted successfully', 'success');
      setResponse('');
      setAttachments([]);
    } catch (error) {
      showToast('Failed to submit response', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-2xl font-bold text-slate-900">Clarification Thread</h1>
        <p className="text-slate-600 mt-1">Respond to clarification requests for your procurement request</p>
      </div>

      {/* Request Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{request.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{request.id}</p>
            <p className="text-slate-600 text-sm mt-2 line-clamp-2">{request.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              request.status === 'clarification_needed' 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {request.status === 'clarification_needed' ? 'Awaiting Response' : 'Resolved'}
            </span>
            <span className="text-amber-600 font-semibold">{formatCurrency(request.estimatedCost)}</span>
          </div>
        </div>
      </div>

      {/* Message Thread */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-900">Conversation</h3>
          <p className="text-sm text-slate-500">
            {pendingClarifications.length} pending, {resolvedClarifications.length} resolved
          </p>
        </div>

        {/* Messages */}
        <div className="max-h-[500px] overflow-y-auto p-6 space-y-6">
          {allMessages.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No clarification requests yet
            </div>
          ) : (
            allMessages.map((clarification, index) => (
              <div key={clarification.id || index} className="space-y-4">
                {/* Clarification Request */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium text-blue-900">{clarification.requestedByName}</span>
                          <span className="text-blue-600 text-sm ml-2 px-2 py-0.5 bg-blue-100 rounded">
                            {clarification.stage?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Reviewer'}
                          </span>
                        </div>
                        <span className="text-xs text-blue-500">
                          {formatDate(clarification.timestamp)}
                        </span>
                      </div>
                      <p className="text-blue-800">{clarification.message}</p>
                    </div>
                  </div>
                </div>

                {/* Response (if any) */}
                {clarification.response && (
                  <div className="flex gap-4 ml-8">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-green-900">{clarification.response.respondedByName}</span>
                          <span className="text-xs text-green-500">
                            {formatDate(clarification.response.timestamp)}
                          </span>
                        </div>
                        <p className="text-green-800">{clarification.response.message}</p>
                        
                        {/* Response attachments */}
                        {clarification.response.attachments?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <p className="text-xs text-green-600 mb-2">Attachments:</p>
                            <div className="flex flex-wrap gap-2">
                              {clarification.response.attachments.map((file, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded text-sm text-green-700">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                  </svg>
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status badge */}
                {clarification.resolved && (
                  <div className="ml-14 flex items-center gap-2 text-green-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Resolved</span>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Response Form */}
        {request.status === 'clarification_needed' && pendingClarifications.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <h4 className="font-semibold text-slate-900 mb-4">Your Response</h4>
            
            <div className="space-y-4">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                placeholder="Provide the requested clarification..."
              />

              {/* File upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Attachments (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Add Files
                </label>
              </div>

              {/* Selected files */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-slate-700">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitResponse}
                  disabled={isSubmitting || !response.trim()}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    isSubmitting || !response.trim()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Response
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resolved state */}
        {(request.status !== 'clarification_needed' || pendingClarifications.length === 0) && (
          <div className="p-6 border-t border-slate-200 bg-green-50">
            <div className="flex items-center gap-3 text-green-700">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">All clarifications have been addressed</p>
                <p className="text-sm text-green-600">Your request is continuing through the approval process</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate(`/request/${request.id}`)}
          className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Request Details
        </button>
        <button
          onClick={() => navigate(`/status/${request.id}`)}
          className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Track Status
        </button>
      </div>
    </div>
  );
};

export default ClarificationThread;
