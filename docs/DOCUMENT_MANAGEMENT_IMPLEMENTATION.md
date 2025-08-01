# Document Management Implementation

## Overview

This document describes the implementation of document management functionality for the vendor onboarding process, specifically handling Ghana Card uploads with the ability to view, delete, and replace existing documents.

## Problem Solved

Previously, when users attempted to upload Ghana Card documents and the backend returned an error indicating documents were already uploaded, there was no way for users to:

1. See what documents they had already uploaded
2. Delete existing documents to replace them
3. Continue with their application process

## Solution

### 1. DocumentManager Component

Created a new `DocumentManager` component (`components/vendor/onboarding/DocumentManager.tsx`) that:

- **Fetches existing documents** using `useGetVendorOnboardingDocuments`
- **Displays current documents** with preview images and metadata
- **Allows document deletion** using `useDeleteVendorOnboardingDocumentsDocumentId`
- **Supports document replacement** by uploading new files
- **Shows upload status** with visual indicators for front/back sides
- **Handles errors gracefully** with user-friendly messages

### 2. Key Features

#### Document Display

- Shows uploaded documents with preview images
- Displays file information (name, size, upload date)
- Indicates verification status
- Shows verification notes if available

#### Document Actions

- **View**: Opens document in new tab
- **Replace**: Uploads new document (deletes old one automatically)
- **Delete**: Removes document completely

#### Upload Status

- Visual indicators for front/back side completion
- Progress indicators during upload
- Success/completion messages

#### Error Handling

- Handles "already uploaded" errors gracefully
- Shows specific error messages for different failure types
- Provides clear guidance on next steps

### 3. Integration with Onboarding Form

Updated the main onboarding component (`components/vendor/onboarding/index.tsx`) to:

- Remove Ghana Card file upload logic from form
- Integrate DocumentManager component
- Validate document completion before form submission
- Disable submit button until both documents are uploaded

### 4. API Integration

The implementation uses these API endpoints:

- `GET /vendor-onboarding/documents` - Fetch existing documents
- `POST /vendor-onboarding/documents` - Upload new document
- `DELETE /vendor-onboarding/documents/:id` - Delete document
- `POST /vendor-onboarding/upload-url` - Get presigned URL for file upload

## User Flow

1. **User visits onboarding page**
   - Form loads with business information fields
   - DocumentManager component fetches existing documents

2. **If documents exist**
   - User sees uploaded documents with previews
   - Can view, replace, or delete documents
   - Form submission is enabled if both sides are uploaded

3. **If no documents exist**
   - User sees upload zones for front/back sides
   - Can upload documents using file picker
   - Progress indicators show upload status

4. **Document replacement**
   - User clicks "Replace" button
   - New file is uploaded
   - Old document is automatically deleted
   - Document list is refreshed

5. **Form submission**
   - System validates both documents are uploaded
   - Application is submitted without Ghana Card file objects
   - Documents are linked via the documents endpoint

## Technical Implementation

### Component Structure

```
DocumentManager
├── Document Status Display
├── Document Grid
│   ├── Front Side Card
│   └── Back Side Card
└── Upload Progress
```

### State Management

- `documents`: Array of uploaded documents
- `isUploading`: Upload progress state
- `deletingDocumentId`: Document being deleted

### Error Handling

- Network errors during upload
- File validation errors
- Backend "already uploaded" errors
- Permission/authorization errors

### File Validation

- File type validation (images only)
- File size validation (max 10MB)
- MIME type validation

## Benefits

1. **Better User Experience**
   - Users can see what they've already uploaded
   - Clear visual feedback on upload status
   - Intuitive document management

2. **Error Recovery**
   - Users can recover from "already uploaded" errors
   - No need to restart the entire process
   - Clear guidance on next steps

3. **Data Integrity**
   - Proper document lifecycle management
   - Automatic cleanup of old documents
   - Consistent document state

4. **Maintainability**
   - Separated concerns (form vs document management)
   - Reusable DocumentManager component
   - Clear API integration patterns

## Future Enhancements

1. **Document Verification Status**
   - Show admin verification status
   - Display verification notes
   - Allow re-upload after rejection

2. **Multiple Document Types**
   - Support for other document types
   - Dynamic document type configuration
   - Flexible document management

3. **Bulk Operations**
   - Select multiple documents
   - Bulk delete/replace operations
   - Batch upload functionality

4. **Advanced Preview**
   - Document viewer with zoom/pan
   - Thumbnail generation
   - Document metadata display

## Testing

The implementation should be tested for:

1. **Document Upload**
   - Valid file uploads
   - Invalid file rejection
   - Upload progress indication
   - Error handling

2. **Document Management**
   - Document deletion
   - Document replacement
   - Document viewing
   - Status updates

3. **Integration**
   - Form submission with documents
   - Document validation
   - Error recovery scenarios

4. **Edge Cases**
   - Network failures
   - Large file uploads
   - Concurrent operations
   - Permission errors
