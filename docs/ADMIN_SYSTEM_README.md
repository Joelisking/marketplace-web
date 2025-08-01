# Admin Vendor Application Management System

This document describes the admin interface for managing vendor applications in the marketplace.

## Overview

The admin system provides a comprehensive interface for administrators to:

- View and manage vendor applications
- Review application details and documents
- Approve or reject applications with notes
- Monitor application statistics and processing times
- Export application data

## Features

### Dashboard

- Overview statistics (total applications, pending, approved, rejected)
- Recent applications requiring attention
- Platform overview (total vendors, users, average processing time)
- Quick access to application management

### Application Management

- **List View**: Grid layout with filtering and search capabilities
- **Detail View**: Comprehensive application information display
- **Review System**: Approve/reject applications with detailed notes
- **Document Verification**: View and verify uploaded documents
- **Status Tracking**: Monitor application status changes

### Filtering & Search

- Filter by application status
- Filter by business type
- Search by business name, email, or Ghana Card number
- Pagination support

### Security

- Role-based access control (ADMIN, SUPER roles only)
- Protected routes with middleware
- Secure API endpoints

## File Structure

```
app/admin/
├── layout.tsx                    # Admin layout with sidebar
├── page.tsx                     # Dashboard overview
└── vendor-applications/
    ├── page.tsx                 # Applications list
    └── [id]/
        └── page.tsx             # Application detail

components/admin/
├── AdminSidebar.tsx             # Navigation sidebar
├── ApplicationReviewDialog.tsx  # Review modal
└── index.ts                     # Component exports

lib/api/admin/
└── vendor-applications.ts       # API service functions
```

## API Endpoints

The system integrates with the following backend endpoints:

- `GET /vendor-onboarding/admin/applications` - List applications
- `GET /vendor-onboarding/admin/applications/{id}` - Get single application
- `POST /vendor-onboarding/admin/applications/{id}/review` - Review application
- `PUT /vendor-onboarding/admin/applications/{id}/status` - Update status
- `GET /vendor-onboarding/admin/dashboard` - Dashboard statistics

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin` (requires ADMIN or SUPER role)
2. Use the sidebar navigation to access different sections
3. The dashboard provides an overview of all applications

### Reviewing Applications

1. Go to "Vendor Applications" in the sidebar
2. Use filters to find specific applications
3. Click "View Details" to see full application information
4. Click "Review Application" to approve/reject
5. Add review notes and submit decision

### Managing Documents

1. In the application detail view, scroll to "Business Documents"
2. View uploaded documents
3. Verify document authenticity
4. Download documents if needed

## Components

### AdminSidebar

Modern sidebar navigation using shadcn/ui components with:

- Collapsible design
- Active state indicators
- Mobile responsive

### ApplicationReviewDialog

Modal dialog for reviewing applications with:

- Status selection (Approve/Reject/Request Documents/Under Review)
- Review notes field
- Rejection reason field (when rejecting)
- Form validation

### Vendor Applications List

Grid layout with:

- Application cards showing key information
- Status badges with color coding
- Quick action buttons
- Advanced filtering options

## Styling

The system uses:

- **Tailwind CSS** for styling
- **shadcn/ui** components for consistent design
- **Lucide React** icons
- Responsive design for mobile and desktop

## Security Considerations

- All admin routes are protected by middleware
- Role-based access control enforced
- API endpoints require authentication
- Input validation on all forms
- XSS protection through proper sanitization

## Future Enhancements

- Bulk actions (approve/reject multiple applications)
- Email notifications to vendors
- Application timeline/history
- Advanced analytics and reporting
- Document verification workflow
- Export functionality (CSV/Excel)

## Development

To add new features:

1. Create new components in `components/admin/`
2. Add API functions in `lib/api/admin/`
3. Create new pages in `app/admin/`
4. Update the sidebar navigation
5. Add proper TypeScript interfaces
6. Include loading states and error handling

## Testing

The system includes:

- Loading skeletons for better UX
- Error handling and user feedback
- Form validation
- Responsive design testing
- Mock data for development

## Deployment

Ensure the following are configured:

- Environment variables for API endpoints
- Authentication middleware
- Role-based access control
- CORS settings for API calls
- Error monitoring and logging
