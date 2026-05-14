# Employee Leave Management System - Frontend

## Overview
React frontend for Employee Leave Management System with modern UI and responsive design.

## Tech Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Features
- **Authentication**: Login/Register with JWT token management
- **Employee Dashboard**: Overview of leave requests with statistics
- **Apply Leave**: Form with file upload for supporting documents
- **Leave History**: Complete history of leave requests with status tracking
- **Manager Dashboard**: Review and approve/reject pending leave requests
- **Responsive Design**: Mobile-friendly interface
- **Role-based UI**: Different interfaces for employees and managers

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.jsx    # Route protection component
│   │   └── Sidebar.jsx           # Navigation sidebar
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   ├── EmployeeDashboard.jsx # Employee dashboard
│   │   ├── ApplyLeave.jsx        # Leave application form
│   │   ├── LeaveHistory.jsx      # Leave history page
│   │   └── ManagerDashboard.jsx  # Manager dashboard
│   ├── services/
│   │   └── api.js                # API service functions
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── layouts/
│   │   └── Layout.jsx            # Main layout component
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Global styles
├── .env.example                  # Environment variables template
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── README.md
```

## Key Components

### Authentication Flow
- JWT tokens stored in localStorage
- Automatic token attachment to API requests
- Protected routes with role-based access
- Automatic logout on token expiry

### File Upload
- Drag & drop interface
- File type validation (PDF, JPG, PNG, DOC, DOCX)
- File size validation (5MB limit)
- Preview and remove functionality

### UI Features
- Modern card-based layout
- Status badges with color coding
- Responsive tables
- Loading states and error handling
- Modal dialogs for manager actions

## API Integration
All API calls are centralized in `services/api.js` with:
- Axios interceptors for error handling
- Automatic token management
- Consistent error response handling

## Styling
- Tailwind CSS for utility-first styling
- Custom color scheme for status indicators
- Responsive breakpoints
- Hover states and transitions

## Deployment
This frontend is designed to be deployed to Azure Static Web Apps. The build output in the `dist` folder can be deployed directly.

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)