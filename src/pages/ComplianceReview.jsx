// import React, { useState, useMemo } from 'react';
// import { useProcurement } from '../context/ProcurementContext';
// import { useAuth } from '../context/AuthContext';
// import { useToast } from '../context/ToastContext';

// const ComplianceReview = () => {
//   const { requests, updateRequestStatus, addTimelineEntry, addClarificationRequest } = useProcurement();
//   const { user } = useAuth();
//   const { showToast } = useToast();

//   const [activeTab, setActiveTab] = useState('pending');
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [showClarifyModal, setShowClarifyModal] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [clarificationMessage, setClarificationMessage] = useState('');
//   const [complianceNotes, setComplianceNotes] = useState('');
//   const [complianceChecklist, setComplianceChecklist] = useState({
//     budgetVerified: false,
//     policyCompliant: false,
//     documentationComplete: false,
//     authorizationValid: false,
//     noConflictOfInterest: false
//   });

//   // Filter requests for compliance review
//   const complianceRequests = useMemo(() => {
//     return requests.filter(req => req.status === 'compliance_review');
//   }, [requests]);

//   const clarificationRequests = useMemo(() => {
//     return requests.filter(req => 
//       req.status === 'clarification_needed' && 
//       req.clarificationRequests?.some(c => c.requestedBy === user?.id && !c.resolved)
//     );
//   }, [requests, user]);

//   const displayedRequests = activeTab === 'pending' ? complianceRequests : clarificationRequests;

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 text-red-800';
//       case 'medium': return 'bg-amber-100 text-amber-800';
//       case 'low': return 'bg-green-100 text-green-800';
//       default: return 'bg-slate-100 text-slate-800';
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-GH', {
//       style: 'currency',
//       currency: 'GHS'
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-GH', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const allChecklistComplete = Object.values(complianceChecklist).every(v => v);

//   const handleApprove = () => {
//     if (!selectedRequest) return;
    
//     if (!allChecklistComplete) {
//       showToast('Please complete all compliance checks before approving', 'warning');
//       return;
//     }

//     updateRequestStatus(selectedRequest.id, 'procurement_review');
//     addTimelineEntry(selectedRequest.id, {
//       status: 'procurement_review',
//       comment: `Compliance approved. Notes: ${complianceNotes || 'No additional notes'}`,
//       user: user?.name || 'Compliance Officer'
//     });
    
//     showToast('Request approved and forwarded to Procurement', 'success');
//     setShowApproveModal(false);
//     setSelectedRequest(null);
//     setComplianceNotes('');
//     setComplianceChecklist({
//       budgetVerified: false,
//       policyCompliant: false,
//       documentationComplete: false,
//       authorizationValid: false,
//       noConflictOfInterest: false
//     });
//   };

//   const handleReject = () => {
//     if (!selectedRequest || !rejectionReason.trim()) {
//       showToast('Please provide a reason for rejection', 'warning');
//       return;
//     }

//     updateRequestStatus(selectedRequest.id, 'rejected');
//     addTimelineEntry(selectedRequest.id, {
//       status: 'rejected',
//       comment: `Compliance rejected: ${rejectionReason}`,
//       user: user?.name || 'Compliance Officer'
//     });
    
//     showToast('Request has been rejected', 'info');
//     setShowRejectModal(false);
//     setSelectedRequest(null);
//     setRejectionReason('');
//   };

//   const handleRequestClarification = () => {
//     if (!selectedRequest || !clarificationMessage.trim()) {
//       showToast('Please provide clarification details', 'warning');
//       return;
//     }

//     addClarificationRequest(selectedRequest.id, {
//       message: clarificationMessage,
//       requestedBy: user?.id,
//       requestedByName: user?.name || 'Compliance Officer',
//       stage: 'compliance_review'
//     });
//     updateRequestStatus(selectedRequest.id, 'clarification_needed');
//     addTimelineEntry(selectedRequest.id, {
//       status: 'clarification_needed',
//       comment: `Clarification requested by Compliance: ${clarificationMessage}`,
//       user: user?.name || 'Compliance Officer'
//     });
    
//     showToast('Clarification request sent to requester', 'success');
//     setShowClarifyModal(false);
//     setSelectedRequest(null);
//     setClarificationMessage('');
//   };

//   const checklistItems = [
//     { key: 'budgetVerified', label: 'Budget availability verified' },
//     { key: 'policyCompliant', label: 'Compliant with procurement policy' },
//     { key: 'documentationComplete', label: 'All required documentation attached' },
//     { key: 'authorizationValid', label: 'Proper authorization obtained' },
//     { key: 'noConflictOfInterest', label: 'No conflict of interest identified' }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Compliance Review</h1>
//           <p className="text-slate-600 mt-1">
//             Review requests for regulatory and policy compliance
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg">
//             <span className="font-semibold">{complianceRequests.length}</span> pending review
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-slate-200">
//         <nav className="flex gap-4">
//           <button
//             onClick={() => setActiveTab('pending')}
//             className={`px-4 py-3 font-medium border-b-2 transition-colors ${
//               activeTab === 'pending'
//                 ? 'border-amber-500 text-amber-600'
//                 : 'border-transparent text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             Pending Review ({complianceRequests.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('clarification')}
//             className={`px-4 py-3 font-medium border-b-2 transition-colors ${
//               activeTab === 'clarification'
//                 ? 'border-amber-500 text-amber-600'
//                 : 'border-transparent text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             Awaiting Clarification ({clarificationRequests.length})
//           </button>
//         </nav>
//       </div>

//       {/* Request List */}
//       {displayedRequests.length === 0 ? (
//         <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
//           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-slate-900 mb-2">
//             {activeTab === 'pending' ? 'No pending requests' : 'No pending clarifications'}
//           </h3>
//           <p className="text-slate-500">
//             {activeTab === 'pending' 
//               ? 'All requests have been reviewed'
//               : 'No requests awaiting clarification responses'}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {displayedRequests.map((request) => (
//             <div
//               key={request.id}
//               className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
//             >
//               <div className="flex flex-col lg:flex-row lg:items-start gap-4">
//                 {/* Request Info */}
//                 <div className="flex-1">
//                   <div className="flex items-start gap-3 mb-3">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
//                       {request.priority?.toUpperCase()}
//                     </span>
//                     <span className="text-xs text-slate-500">
//                       {request.id}
//                     </span>
//                   </div>
                  
//                   <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                     {request.title}
//                   </h3>
                  
//                   <p className="text-slate-600 text-sm mb-4 line-clamp-2">
//                     {request.description}
//                   </p>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                     <div>
//                       <span className="text-slate-500">Requested By</span>
//                       <p className="font-medium text-slate-900">{request.requestedBy}</p>
//                     </div>
//                     <div>
//                       <span className="text-slate-500">Department</span>
//                       <p className="font-medium text-slate-900">{request.department}</p>
//                     </div>
//                     <div>
//                       <span className="text-slate-500">Category</span>
//                       <p className="font-medium text-slate-900">{request.category}</p>
//                     </div>
//                     <div>
//                       <span className="text-slate-500">Estimated Cost</span>
//                       <p className="font-medium text-amber-600">{formatCurrency(request.estimatedCost)}</p>
//                     </div>
//                   </div>

//                   {/* Items Summary */}
//                   <div className="mt-4 pt-4 border-t border-slate-100">
//                     <span className="text-sm text-slate-500">
//                       {request.items?.length || 0} item(s) • 
//                       Submitted: {formatDate(request.createdAt)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-row lg:flex-col gap-2 lg:w-40">
//                   <button
//                     onClick={() => {
//                       setSelectedRequest(request);
//                       setShowApproveModal(true);
//                     }}
//                     className="flex-1 lg:flex-none bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => {
//                       setSelectedRequest(request);
//                       setShowClarifyModal(true);
//                     }}
//                     className="flex-1 lg:flex-none bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
//                   >
//                     Clarify
//                   </button>
//                   <button
//                     onClick={() => {
//                       setSelectedRequest(request);
//                       setShowRejectModal(true);
//                     }}
//                     className="flex-1 lg:flex-none bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Approve Modal with Checklist */}
//       {showApproveModal && selectedRequest && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-slate-200">
//               <h2 className="text-xl font-bold text-slate-900">Compliance Approval</h2>
//               <p className="text-slate-600 text-sm mt-1">
//                 Complete the compliance checklist before approving
//               </p>
//             </div>
            
//             <div className="p-6 space-y-6">
//               {/* Request Summary */}
//               <div className="bg-slate-50 rounded-lg p-4">
//                 <h3 className="font-semibold text-slate-900">{selectedRequest.title}</h3>
//                 <p className="text-sm text-slate-600 mt-1">{selectedRequest.id}</p>
//                 <p className="text-amber-600 font-medium mt-2">
//                   {formatCurrency(selectedRequest.estimatedCost)}
//                 </p>
//               </div>

//               {/* Compliance Checklist */}
//               <div>
//                 <h4 className="font-semibold text-slate-900 mb-3">Compliance Checklist</h4>
//                 <div className="space-y-3">
//                   {checklistItems.map(item => (
//                     <label 
//                       key={item.key}
//                       className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={complianceChecklist[item.key]}
//                         onChange={(e) => setComplianceChecklist(prev => ({
//                           ...prev,
//                           [item.key]: e.target.checked
//                         }))}
//                         className="w-5 h-5 text-green-600 rounded border-slate-300 focus:ring-green-500"
//                       />
//                       <span className="text-slate-700">{item.label}</span>
//                     </label>
//                   ))}
//                 </div>
//                 {!allChecklistComplete && (
//                   <p className="text-amber-600 text-sm mt-2">
//                     All items must be checked to approve
//                   </p>
//                 )}
//               </div>

//               {/* Notes */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Compliance Notes (Optional)
//                 </label>
//                 <textarea
//                   value={complianceNotes}
//                   onChange={(e) => setComplianceNotes(e.target.value)}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
//                   placeholder="Add any compliance-related notes..."
//                 />
//               </div>
//             </div>

//             <div className="p-6 border-t border-slate-200 flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowApproveModal(false);
//                   setSelectedRequest(null);
//                   setComplianceNotes('');
//                   setComplianceChecklist({
//                     budgetVerified: false,
//                     policyCompliant: false,
//                     documentationComplete: false,
//                     authorizationValid: false,
//                     noConflictOfInterest: false
//                   });
//                 }}
//                 className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleApprove}
//                 disabled={!allChecklistComplete}
//                 className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
//                   allChecklistComplete
//                     ? 'bg-green-600 text-white hover:bg-green-700'
//                     : 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                 }`}
//               >
//                 Approve & Forward
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reject Modal */}
//       {showRejectModal && selectedRequest && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-lg w-full">
//             <div className="p-6 border-b border-slate-200">
//               <h2 className="text-xl font-bold text-slate-900">Reject Request</h2>
//               <p className="text-slate-600 text-sm mt-1">
//                 Provide a reason for rejecting this request
//               </p>
//             </div>
            
//             <div className="p-6 space-y-4">
//               <div className="bg-red-50 rounded-lg p-4">
//                 <h3 className="font-semibold text-slate-900">{selectedRequest.title}</h3>
//                 <p className="text-sm text-slate-600 mt-1">{selectedRequest.id}</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Rejection Reason <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                   placeholder="Explain why this request does not meet compliance requirements..."
//                 />
//               </div>
//             </div>

//             <div className="p-6 border-t border-slate-200 flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowRejectModal(false);
//                   setSelectedRequest(null);
//                   setRejectionReason('');
//                 }}
//                 className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReject}
//                 className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
//               >
//                 Reject Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Clarification Modal */}
//       {showClarifyModal && selectedRequest && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-lg w-full">
//             <div className="p-6 border-b border-slate-200">
//               <h2 className="text-xl font-bold text-slate-900">Request Clarification</h2>
//               <p className="text-slate-600 text-sm mt-1">
//                 Ask the requester for additional information
//               </p>
//             </div>
            
//             <div className="p-6 space-y-4">
//               <div className="bg-amber-50 rounded-lg p-4">
//                 <h3 className="font-semibold text-slate-900">{selectedRequest.title}</h3>
//                 <p className="text-sm text-slate-600 mt-1">{selectedRequest.id}</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Clarification Request <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={clarificationMessage}
//                   onChange={(e) => setClarificationMessage(e.target.value)}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
//                   placeholder="What information do you need from the requester?"
//                 />
//               </div>
//             </div>

//             <div className="p-6 border-t border-slate-200 flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowClarifyModal(false);
//                   setSelectedRequest(null);
//                   setClarificationMessage('');
//                 }}
//                 className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRequestClarification}
//                 className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
//               >
//                 Send Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ComplianceReview;

import React, { useState, useMemo } from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ComplianceReview = () => {
  const { requests, approveCompliance, rejectRequest, requestClarification } = useProcurement();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showClarifyModal, setShowClarifyModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [clarificationMessage, setClarificationMessage] = useState('');
  const [complianceNotes, setComplianceNotes] = useState('');
  const [complianceChecklist, setComplianceChecklist] = useState({
    budgetVerified: false,
    policyCompliant: false,
    documentationComplete: false,
    authorizationValid: false,
    noConflictOfInterest: false
  });

  // Filter requests for compliance review
  const complianceRequests = useMemo(() => {
    return requests.filter(req => req.status === 'compliance_review');
  }, [requests]);

  const clarificationRequests = useMemo(() => {
    return requests.filter(req => 
      req.status === 'clarification_needed' && 
      req.clarificationRequests?.some(c => c.requestedBy === user?.id && !c.resolved)
    );
  }, [requests, user]);

  const displayedRequests = activeTab === 'pending' ? complianceRequests : clarificationRequests;

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const allChecklistComplete = Object.values(complianceChecklist).every(v => v);

  const handleApprove = () => {
    if (!selectedRequest) return;
    
    if (!allChecklistComplete) {
      showToast('Please complete all compliance checks before approving', 'warning');
      return;
    }

    approveCompliance(
      selectedRequest.id, 
      { id: user?.id, name: user?.name || 'Compliance Officer' },
      complianceNotes || 'All compliance checks passed'
    );
    
    showToast('Request approved and forwarded to Procurement', 'success');
    setShowApproveModal(false);
    setSelectedRequest(null);
    setComplianceNotes('');
    setComplianceChecklist({
      budgetVerified: false,
      policyCompliant: false,
      documentationComplete: false,
      authorizationValid: false,
      noConflictOfInterest: false
    });
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      showToast('Please provide a reason for rejection', 'warning');
      return;
    }

    rejectRequest(
      selectedRequest.id,
      { id: user?.id, name: user?.name || 'Compliance Officer' },
      rejectionReason
    );
    
    showToast('Request has been rejected', 'info');
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const handleRequestClarification = () => {
    if (!selectedRequest || !clarificationMessage.trim()) {
      showToast('Please provide clarification details', 'warning');
      return;
    }

    requestClarification(
      selectedRequest.id,
      { id: user?.id, name: user?.name || 'Compliance Officer' },
      clarificationMessage
    );
    
    showToast('Clarification request sent to requester', 'success');
    setShowClarifyModal(false);
    setSelectedRequest(null);
    setClarificationMessage('');
  };

  const checklistItems = [
    { key: 'budgetVerified', label: 'Budget availability verified' },
    { key: 'policyCompliant', label: 'Compliant with procurement policy' },
    { key: 'documentationComplete', label: 'All required documentation attached' },
    { key: 'authorizationValid', label: 'Proper authorization obtained' },
    { key: 'noConflictOfInterest', label: 'No conflict of interest identified' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance Review</h1>
          <p className="text-slate-600 mt-1">
            Review requests for regulatory and policy compliance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg">
            <span className="font-semibold">{complianceRequests.length}</span> pending review
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Pending Review ({complianceRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('clarification')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'clarification'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Awaiting Clarification ({clarificationRequests.length})
          </button>
        </nav>
      </div>

      {/* Request List */}
      {displayedRequests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {activeTab === 'pending' ? 'No pending requests' : 'No pending clarifications'}
          </h3>
          <p className="text-slate-500">
            {activeTab === 'pending' 
              ? 'All requests have been reviewed'
              : 'No requests awaiting clarification responses'}
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
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority?.toUpperCase()}
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
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowApproveModal(true);
                    }}
                    className="flex-1 lg:flex-none bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowClarifyModal(true);
                    }}
                    className="flex-1 lg:flex-none bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                  >
                    Clarify
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowRejectModal(true);
                    }}
                    className="flex-1 lg:flex-none bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve Modal with Checklist */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Compliance Approval</h2>
              <p className="text-slate-600 text-sm mt-1">
                Complete the compliance checklist before approving
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Request Summary */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900">{selectedRequest.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedRequest.id}</p>
                <p className="text-amber-600 font-medium mt-2">
                  {formatCurrency(selectedRequest.estimatedCost)}
                </p>
              </div>

              {/* Compliance Checklist */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Compliance Checklist</h4>
                <div className="space-y-3">
                  {checklistItems.map(item => (
                    <label 
                      key={item.key}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={complianceChecklist[item.key]}
                        onChange={(e) => setComplianceChecklist(prev => ({
                          ...prev,
                          [item.key]: e.target.checked
                        }))}
                        className="w-5 h-5 text-green-600 rounded border-slate-300 focus:ring-green-500"
                      />
                      <span className="text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
                {!allChecklistComplete && (
                  <p className="text-amber-600 text-sm mt-2">
                    All items must be checked to approve
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Compliance Notes (Optional)
                </label>
                <textarea
                  value={complianceNotes}
                  onChange={(e) => setComplianceNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Add any compliance-related notes..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedRequest(null);
                  setComplianceNotes('');
                  setComplianceChecklist({
                    budgetVerified: false,
                    policyCompliant: false,
                    documentationComplete: false,
                    authorizationValid: false,
                    noConflictOfInterest: false
                  });
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={!allChecklistComplete}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  allChecklistComplete
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Approve & Forward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Reject Request</h2>
              <p className="text-slate-600 text-sm mt-1">
                Provide a reason for rejecting this request
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900">{selectedRequest.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedRequest.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Explain why this request does not meet compliance requirements..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clarification Modal */}
      {showClarifyModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Request Clarification</h2>
              <p className="text-slate-600 text-sm mt-1">
                Ask the requester for additional information
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900">{selectedRequest.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedRequest.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Clarification Request <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={clarificationMessage}
                  onChange={(e) => setClarificationMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="What information do you need from the requester?"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => {
                  setShowClarifyModal(false);
                  setSelectedRequest(null);
                  setClarificationMessage('');
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestClarification}
                className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceReview;
