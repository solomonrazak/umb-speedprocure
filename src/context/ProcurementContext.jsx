import React, { createContext, useContext, useState, useCallback } from 'react';

const ProcurementContext = createContext(null);

// Initial mock data
const INITIAL_REQUESTS = [
  {
    id: 'PRQ-2025-001',
    title: 'Office Furniture Procurement',
    description: 'Purchase of ergonomic office chairs and desks for the new Operations wing',
    category: 'Furniture & Fixtures',
    department: 'Operations',
    requestedBy: 'USR001',
    requestedByName: 'Zeinab Abubakar',
    estimatedCost: 125000.0,
    currency: 'GHS',
    priority: 'medium',
    status: 'pending_approval',
    currentStep: 1,
    justification:
      'The current furniture is over 10 years old and causing ergonomic issues for staff. New furniture will improve productivity and reduce health-related absences.',
    items: [
      { name: 'Ergonomic Office Chair', quantity: 25, unitPrice: 3500, total: 87500 },
      { name: 'Adjustable Standing Desk', quantity: 10, unitPrice: 3750, total: 37500 }
    ],
    attachments: [
      { name: 'furniture_quotation.pdf', size: '2.4 MB', uploadedAt: '2024-01-15' }
    ],
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
    timeline: [
      {
        step: 'Request Created',
        date: '2024-01-15T09:30:00Z',
        status: 'completed',
        user: 'Zeinab Abubakar'
      }
    ]
  },

  {
    id: 'PRQ-2025-002',
    title: 'IT Equipment - Laptops',
    description: 'Procurement of laptops for new hires in the Digital Banking division',
    category: 'IT Equipment',
    department: 'Digital Banking',
    requestedBy: 'USR001',
    requestedByName: 'Zeinab Abubakar',
    estimatedCost: 280000.0,
    currency: 'GHS',
    priority: 'high',
    status: 'compliance_review',
    currentStep: 2,
    justification:
      'Critical requirement for 20 new developers joining the Digital Banking team. Delayed procurement will impact project timelines.',
    items: [
      { name: 'Dell Latitude 5540 Laptop', quantity: 20, unitPrice: 12000, total: 240000 },
      { name: 'Laptop Bags', quantity: 20, unitPrice: 500, total: 10000 },
      { name: 'Wireless Mouse', quantity: 20, unitPrice: 150, total: 3000 },
      { name: 'USB-C Docking Station', quantity: 20, unitPrice: 1350, total: 27000 }
    ],
    attachments: [
      { name: 'dell_quotation.pdf', size: '1.8 MB', uploadedAt: '2024-01-12' },
      { name: 'specifications.docx', size: '456 KB', uploadedAt: '2024-01-12' }
    ],
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-14T10:15:00Z',
    approvedBy: 'USR002',
    approvedByName: 'Joshua Lomotey',
    approvalDate: '2024-01-14T10:15:00Z',
    approvalComments: 'Approved. Essential for Digital Banking expansion.',
    timeline: [
      { step: 'Request Created', date: '2024-01-12T14:20:00Z', status: 'completed', user: 'Zeinab Abubakar' },
      { step: 'Unit Approval', date: '2024-01-14T10:15:00Z', status: 'completed', user: 'Joshua Lomotey' }
    ]
  },

  {
    id: 'PRQ-2025-003',
    title: 'Security System Upgrade',
    description: 'Upgrade of CCTV and access control systems at Head Office',
    category: 'Security Equipment',
    department: 'Security',
    requestedBy: 'USR001',
    requestedByName: 'Zeinab Abubakar',
    estimatedCost: 450000.0,
    currency: 'GHS',
    priority: 'high',
    status: 'procurement_review',
    currentStep: 3,
    justification:
      'Current security systems are outdated and have failed multiple times. Upgrade is necessary to meet Bank of Ghana security requirements.',
    items: [
      { name: 'HD CCTV Camera', quantity: 50, unitPrice: 2500, total: 125000 },
      { name: 'NVR System (64 Channel)', quantity: 2, unitPrice: 45000, total: 90000 },
      { name: 'Biometric Access Control', quantity: 15, unitPrice: 8000, total: 120000 },
      { name: 'Installation & Configuration', quantity: 1, unitPrice: 115000, total: 115000 }
    ],
    attachments: [
      { name: 'security_assessment.pdf', size: '3.2 MB', uploadedAt: '2024-01-08' },
      { name: 'vendor_proposals.pdf', size: '5.1 MB', uploadedAt: '2024-01-08' }
    ],
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
    approvedBy: 'USR002',
    approvedByName: 'Joshua Lomotey',
    complianceApprovedBy: 'USR003',
    complianceApprovedByName: 'Derrick Akomeah',
    timeline: [
      { step: 'Request Created', date: '2024-01-08T11:00:00Z', status: 'completed', user: 'Zeinab Abubakar' },
      { step: 'Unit Approval', date: '2024-01-10T09:30:00Z', status: 'completed', user: 'Joshua Lomotey' },
      { step: 'Compliance Review', date: '2024-01-13T16:45:00Z', status: 'completed', user: 'Derrick Akomeah' }
    ]
  },

  {
    id: 'PRQ-2025-004',
    title: 'Office Supplies Q1 2024',
    description: 'Quarterly office supplies for all branches',
    category: 'Office Supplies',
    department: 'Administration',
    requestedBy: 'USR001',
    requestedByName: 'Zeinab Abubakar',
    estimatedCost: 35000.0,
    currency: 'GHS',
    priority: 'low',
    status: 'clarification_needed',
    currentStep: 1,
    justification: 'Regular quarterly restocking of office supplies.',
    items: [
      { name: 'A4 Paper (Box)', quantity: 200, unitPrice: 85, total: 17000 },
      { name: 'Pens (Pack of 50)', quantity: 50, unitPrice: 120, total: 6000 },
      { name: 'Toner Cartridges', quantity: 30, unitPrice: 400, total: 12000 }
    ],
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    clarificationRequests: [
      {
        id: 'CLR-001',
        requestedBy: 'USR002',
        requestedByName: 'Joshua Lomotey',
        message: 'Please provide breakdown by branch and attach the vendor quotations.',
        createdAt: '2024-01-16T14:30:00Z',
        responses: []
      }
    ],
    timeline: [
      { step: 'Request Created', date: '2024-01-16T08:00:00Z', status: 'completed', user: 'Zeinab Abubakar' },
      { step: 'Clarification Requested', date: '2024-01-16T14:30:00Z', status: 'pending', user: 'Joshua Lomotey' }
    ]
  },

  {
    id: 'PRQ-2025-005',
    title: 'ATM Machine Replacement',
    description: 'Replacement of 5 outdated ATM machines at various branches',
    category: 'Banking Equipment',
    department: 'Retail Banking',
    requestedBy: 'USR001',
    requestedByName: 'Zeinab Abubakar',
    estimatedCost: 750000.0,
    currency: 'GHS',
    priority: 'high',
    status: 'approved',
    currentStep: 4,
    justification:
      'ATMs at Osu, Airport, Mall, Spintex, and East Legon branches are over 8 years old with frequent downtime affecting customer service.',
    items: [{ name: 'NCR SelfServ 84 ATM', quantity: 5, unitPrice: 150000, total: 750000 }],
    vendorAssigned: 'NCR Corporation Ghana',
    procurementMethod: 'Direct Procurement',
    timeline: [
      { step: 'Request Created', date: '2024-01-05T10:00:00Z', status: 'completed', user: 'Zeinab Abubakar' },
      { step: 'Unit Approval', date: '2024-01-07T09:00:00Z', status: 'completed', user: 'Joshua Lomotey' },
      { step: 'Compliance Review', date: '2024-01-10T14:00:00Z', status: 'completed', user: 'Derrick Akomeah' },
      { step: 'Procurement Review', date: '2024-01-15T11:20:00Z', status: 'completed', user: 'Brenda Johnson' }
    ]
  }
];


const CATEGORIES = [
  'IT Equipment',
  'Office Supplies',
  'Furniture & Fixtures',
  'Security Equipment',
  'Banking Equipment',
  'Vehicles',
  'Marketing Materials',
  'Professional Services',
  'Maintenance & Repairs',
  'Other'
];

const DEPARTMENTS = [
  'Operations',
  'Digital Banking',
  'Retail Banking',
  'Corporate Banking',
  'Finance',
  'Human Resources',
  'IT',
  'Security',
  'Compliance',
  'Administration',
  'Marketing'
];

const VENDORS = [
  { id: 'V001', name: 'Compuserve Ghana Ltd', category: 'IT Equipment', rating: 4.5 },
  { id: 'V002', name: 'Office Solutions Ghana', category: 'Office Supplies', rating: 4.2 },
  { id: 'V003', name: 'NCR Corporation Ghana', category: 'Banking Equipment', rating: 4.8 },
  { id: 'V004', name: 'Intercom Security Systems', category: 'Security Equipment', rating: 4.3 },
  { id: 'V005', name: 'Furniture World', category: 'Furniture & Fixtures', rating: 4.0 }
];

const PROCUREMENT_METHODS = [
  'Competitive Bidding',
  'Request for Quotation (RFQ)',
  'Direct Procurement',
  'Framework Agreement',
  'Single Source'
];

export const ProcurementProvider = ({ children }) => {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [departments, setDepartments] = useState(DEPARTMENTS);
  const [vendors] = useState(VENDORS);

  const generateRequestId = useCallback(() => {
    const year = new Date().getFullYear();
    const count = requests.filter(r => r.id.includes(year.toString())).length + 1;
    return `PRQ-${year}-${String(count).padStart(3, '0')}`;
  }, [requests]);

  const createRequest = useCallback((requestData) => {
    const newRequest = {
      ...requestData,
      id: generateRequestId(),
      status: 'draft',
      currentStep: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          step: 'Request Created',
          date: new Date().toISOString(),
          status: 'completed',
          user: requestData.requestedByName
        }
      ]
    };
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  }, [generateRequestId]);

  const submitRequest = useCallback((id) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: 'pending_approval',
          currentStep: 1,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    }));
  }, []);

  const updateRequest = useCallback((id, updates) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    }));
  }, []);

  const approveRequest = useCallback((id, approverData, comments) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const newTimeline = [...req.timeline, {
          step: 'Unit Approval',
          date: new Date().toISOString(),
          status: 'completed',
          user: approverData.name,
          comment: comments
        }];
        return {
          ...req,
          status: 'compliance_review',
          currentStep: 2,
          approvedBy: approverData.id,
          approvedByName: approverData.name,
          approvalDate: new Date().toISOString(),
          approvalComments: comments,
          timeline: newTimeline,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    }));
  }, []);

  const rejectRequest = useCallback((id, rejecterData, reason) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const newTimeline = [...req.timeline, {
          step: 'Request Rejected',
          date: new Date().toISOString(),
          status: 'rejected',
          user: rejecterData.name,
          comment: reason
        }];
        return {
          ...req,
          status: 'rejected',
          rejectedBy: rejecterData.id,
          rejectedByName: rejecterData.name,
          rejectionDate: new Date().toISOString(),
          rejectionReason: reason,
          timeline: newTimeline,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    }));
  }, []);

  const requestClarification = useCallback((id, requesterData, message) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const newClarification = {
          id: `CLR-${Date.now()}`,
          requestedBy: requesterData.id,
          requestedByName: requesterData.name,
          message,
          createdAt: new Date().toISOString(),
          responses: []
        };
        const clarificationRequests = [...(req.clarificationRequests || []), newClarification];
        const newTimeline = [...req.timeline, {
          step: 'Clarification Requested',
          date: new Date().toISOString(),
          status: 'pending',
          user: requesterData.name,
          comment: message
        }];
        return {
          ...req,
          status: 'clarification_needed',
          clarificationRequests,
          timeline: newTimeline,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    }));
  }, []);

  const respondToClarification = useCallback((requestId, clarificationId, responderData, response, attachments = []) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedClarifications = req.clarificationRequests.map(clr => {
          if (clr.id === clarificationId) {
            return {
              ...clr,
              responses: [...clr.responses, {
                respondedBy: responderData.id,
                respondedByName: responderData.name,
                message: response,
                attachments,
                respondedAt: new Date().toISOString()
              }]
            };
          }
          return clr;
        });
        const newTimeline = [...req.timeline, {
          step: 'Clarification Provided',
          date: new Date().toISOString(),
          status: 'completed',
          user: responderData.name
        }];
        return {
          ...req,
          status: 'pending_approval',
          clarificationRequests: updatedClarifications,
          timeline: newTimeline,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    }));
  }, []);

  const approveCompliance = useCallback((id, officerData, comments) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const newTimeline = [...req.timeline, {
          step: 'Compliance Review',
          date: new Date().toISOString(),
          status: 'completed',
          user: officerData.name,
          comment: comments
        }];
        return {
          ...req,
          status: 'procurement_review',
          currentStep: 3,
          complianceApprovedBy: officerData.id,
          complianceApprovedByName: officerData.name,
          complianceDate: new Date().toISOString(),
          complianceComments: comments,
          timeline: newTimeline,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    }));
  }, []);

  const approveProcurement = useCallback((id, officerData, vendorId, method, comments) => {
    const vendor = vendors.find(v => v.id === vendorId);
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const newTimeline = [...req.timeline, {
          step: 'Procurement Review',
          date: new Date().toISOString(),
          status: 'completed',
          user: officerData.name,
          comment: comments
        }];
        return {
          ...req,
          status: 'approved',
          currentStep: 4,
          procurementApprovedBy: officerData.id,
          procurementApprovedByName: officerData.name,
          procurementDate: new Date().toISOString(),
          vendorAssigned: vendor?.name || vendorId,
          procurementMethod: method,
          procurementComments: comments,
          timeline: newTimeline,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    }));
  }, [vendors]);

  const getRequestById = useCallback((id) => {
    return requests.find(req => req.id === id);
  }, [requests]);

  const getRequestsByStatus = useCallback((status) => {
    return requests.filter(req => req.status === status);
  }, [requests]);

  const getRequestsByUser = useCallback((userId) => {
    return requests.filter(req => req.requestedBy === userId);
  }, [requests]);

  const getRequestsByDepartment = useCallback((department) => {
    return requests.filter(req => req.department === department);
  }, [requests]);

  const addCategory = useCallback((category) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  }, [categories]);

  const addDepartment = useCallback((department) => {
    if (!departments.includes(department)) {
      setDepartments(prev => [...prev, department]);
    }
  }, [departments]);

  const getStats = useCallback(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'pending_approval').length;
    const compliance = requests.filter(r => r.status === 'compliance_review').length;
    const procurement = requests.filter(r => r.status === 'procurement_review').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    const clarification = requests.filter(r => r.status === 'clarification_needed').length;
    const totalValue = requests.reduce((sum, r) => sum + r.estimatedCost, 0);
    const approvedValue = requests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.estimatedCost, 0);
    
    return {
      total,
      pending,
      compliance,
      procurement,
      approved,
      rejected,
      clarification,
      totalValue,
      approvedValue
    };
  }, [requests]);

  const value = {
    requests,
    categories,
    departments,
    vendors,
    procurementMethods: PROCUREMENT_METHODS,
    createRequest,
    submitRequest,
    updateRequest,
    approveRequest,
    rejectRequest,
    requestClarification,
    respondToClarification,
    approveCompliance,
    approveProcurement,
    getRequestById,
    getRequestsByStatus,
    getRequestsByUser,
    getRequestsByDepartment,
    addCategory,
    addDepartment,
    getStats
  };

  return (
    <ProcurementContext.Provider value={value}>
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};

export default ProcurementContext;
