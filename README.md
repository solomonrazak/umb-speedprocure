# UMB Bank Ghana - Procurement Management System

A comprehensive, role-based procurement management system built with React, Tailwind CSS, and modern web technologies. This prototype demonstrates a complete procurement workflow from request initiation through final approval.

![UMB Procurement System](https://img.shields.io/badge/UMB-Procurement%20System-d4a853?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd procurement-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Requesting Unit | requester@umb.com.gh | Demo@123 |
| Unit Approver | approver@umb.com.gh | Demo@123 |
| Compliance Officer | compliance@umb.com.gh | Demo@123 |
| Procurement Officer | procurement@umb.com.gh | Demo@123 |
| System Administrator | admin@umb.com.gh | Admin@123 |

## 📋 Features by Module

### 1. Dashboard
- Role-specific statistics and metrics
- Request status overview
- Recent activity feed
- Quick action buttons
- Notification center

### 2. Request Initiation
- Multi-step wizard form (4 steps)
- Dynamic item management
- Auto-calculation of costs
- File attachment support
- Draft saving capability
- Comprehensive validation

### 3. Approval Workflow
- Pending requests queue
- Approve/Reject/Request Clarification actions
- Request details preview
- Comment support for decisions
- Bulk action capabilities

### 4. Compliance Review
- Compliance checklist verification
- Risk assessment indicators
- Policy compliance notes
- Conditional approval support

### 5. Procurement Processing
- Vendor selection and assignment
- Quote comparison interface
- Purchase order generation
- Delivery tracking

### 6. Communication Hub
- Clarification request threads
- Real-time comment system
- File sharing in threads
- Notification on responses

### 7. Status Tracking
- Visual workflow timeline
- Current stage indicator
- Complete history log
- Estimated completion dates

### 8. Admin Panel
- Category management
- Department configuration
- User role management
- System settings
- Audit logs

## 🏗️ Project Structure

```
procurement-system/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.jsx          # Main layout with sidebar
│   ├── context/
│   │   ├── AuthContext.jsx         # Authentication & roles
│   │   ├── ToastContext.jsx        # Notifications
│   │   └── ProcurementContext.jsx  # Data management
│   ├── pages/
│   │   ├── Login.jsx               # Authentication
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── CreateRequest.jsx       # Request wizard
│   │   ├── MyRequests.jsx          # User's requests
│   │   ├── ApprovalScreen.jsx      # Unit approvals
│   │   ├── ComplianceReview.jsx    # Compliance queue
│   │   ├── ProcurementQueue.jsx    # Procurement processing
│   │   ├── RequestDetail.jsx       # Full request view
│   │   ├── ClarificationThread.jsx # Communications
│   │   ├── StatusTracker.jsx       # Workflow tracking
│   │   └── AdminPanel.jsx          # System admin
│   ├── App.jsx                     # Routes & auth guards
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Tailwind & custom styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔄 Workflow States

```
draft → pending_approval → compliance_review → procurement_review → approved
                ↓                    ↓                    ↓
         clarification_needed  clarification_needed  clarification_needed
                ↓                    ↓                    ↓
            rejected             rejected             rejected
```

## 🎨 Design System

### Colors
- **Primary Gold**: #d4a853 (UMB Bank branding)
- **Slate**: #1e293b (Text & backgrounds)
- **Success**: Green tones for approvals
- **Warning**: Amber tones for pending items
- **Danger**: Red tones for rejections

### Typography
- Font: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700

### Components
- Cards with soft shadows
- Rounded corners (xl)
- Gradient buttons
- Responsive tables
- Modal dialogs

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM 6.21
- **Icons**: Lucide React
- **UI Components**: HeroUI (optional)
- **Animations**: Framer Motion

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation / hamburger menu

## 🔒 Security Features

- Role-based access control (RBAC)
- Protected routes
- Session timeout (30 minutes)
- Input validation
- XSS prevention

## 📊 Data Model

### Request Object
```javascript
{
  id: "REQ-2024-001",
  title: "Office Equipment Purchase",
  description: "...",
  category: "office_equipment",
  department: "finance",
  requestedBy: "user_id",
  estimatedCost: 15000,
  priority: "high",
  status: "pending_approval",
  items: [...],
  attachments: [...],
  timeline: [...],
  clarificationRequests: [...],
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-16T14:30:00Z"
}
```

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

## 🔧 Configuration

### Environment Variables
Create a `.env` file for production:
```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=UMB Procurement System
```

## 📝 Notes for Production

1. **Backend Integration**: Replace mock data with actual API calls
2. **Authentication**: Integrate with corporate SSO/LDAP
3. **File Storage**: Connect to cloud storage (S3, Azure Blob)
4. **Database**: PostgreSQL or MongoDB recommended
5. **Caching**: Implement Redis for session management
6. **Monitoring**: Add error tracking (Sentry)

## 👨‍💻 Development

### Code Style
- ESLint for linting
- Prettier for formatting
- Component-based architecture
- Context API for state management

### Adding New Features
1. Create component in appropriate directory
2. Add route in App.jsx if needed
3. Update context if state needed
4. Add to sidebar navigation in Layout.jsx

## 📄 License

Proprietary - UMB Bank Ghana

## 📞 Support

For technical support or questions about this prototype, please contact the development team.

---

**Built with ❤️ for UMB Bank Ghana**
