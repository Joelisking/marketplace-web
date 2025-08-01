# Vendor Onboarding Implementation Guide

## Overview

This document describes the implementation of the vendor onboarding system with proper Ghana Card document management using the documents endpoint approach.

## 🎯 Design Decision

**Problem**: The system had two different ways of handling Ghana Card images:

- Application Schema: `ghanaCardFront` and `ghanaCardBack` as string URLs (direct fields)
- Documents Schema: `VendorDocument` model with `GHANA_CARD` type and `side` field

**Solution**: Use the Documents endpoint approach for cleaner separation of concerns and proper document management.

## 🏗️ Architecture

### Frontend Flow

1. **Multi-Step Form**: Business Info → Ghana Card Upload → Bank Info → Additional Info
2. **File Upload**: Ghana Card images uploaded via presigned URLs
3. **Document Creation**: Each image creates a document record via `/vendor-onboarding/documents`
4. **Application Submission**: Application submitted without Ghana Card URLs

### Backend Integration

- **Presigned URLs**: `/upload/presigned-url` for secure file uploads
- **Document Management**: `/vendor-onboarding/documents` for Ghana Card records
- **Application**: `/vendor-onboarding/application` for business details

## 📁 File Structure

```
components/vendor/onboarding/
├── form.tsx          # Multi-step form component
├── index.tsx         # Main onboarding page
└── types.ts          # TypeScript schemas

components/ui/
├── file-upload.tsx   # Reusable file upload component
└── ...

lib/
├── utils.ts          # File validation utilities
└── api/
    ├── vendor/vendor.ts      # Vendor API hooks
    └── upload/upload.ts      # Upload API hooks
```

## 🔧 Implementation Details

### 1. Type Definitions

```typescript
// components/vendor/onboarding/types.ts
export const CreateVendorApplicationSchema = z.object({
  // Business details
  businessName: z.string().min(2),
  businessType: z.object({ value: z.string(), label: z.string() }),
  // ... other business fields

  // Ghana Card files (not URLs)
  ghanaCardFrontFile: z.instanceof(File),
  ghanaCardBackFile: z.instanceof(File),

  // Bank details
  bankName: z.string().min(2),
  // ... other bank fields
});
```

### 2. Multi-Step Form

```typescript
// components/vendor/onboarding/form.tsx
const steps = [
  {
    title: 'Business Information',
    content: <BusinessInfoStep />
  },
  {
    title: 'Ghana Card Upload',
    content: <GhanaCardUploadStep />
  },
  {
    title: 'Bank Information',
    content: <BankInfoStep />
  },
  {
    title: 'Additional Information',
    content: <AdditionalInfoStep />
  }
];
```

### 3. File Upload Component

```typescript
// components/ui/file-upload.tsx
export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  onFileSelect,
  preview,
  error,
  // ... other props
}) => {
  // Drag & drop support
  // File validation
  // Preview generation
  // Error handling
};
```

### 4. Upload Flow

```typescript
// components/vendor/onboarding/index.tsx
const uploadGhanaCardImage = async (
  file: File,
  side: 'FRONT' | 'BACK'
) => {
  // 1. Get presigned URL
  const presignedUrlResponse = await getPresignedUrl({
    data: {
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
    },
  });

  // 2. Upload to storage
  await fetch(presignedUrlResponse.data.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  // 3. Create document record
  await uploadDocument({
    data: {
      documentType: 'GHANA_CARD',
      side: side,
      fileName: file.name,
      fileUrl: presignedUrlResponse.data.fileUrl,
      fileSize: file.size,
      mimeType: file.type,
    },
  });
};
```

## 🎨 UI/UX Features

### Multi-Step Progress Indicator

- Visual step progression
- Completed step indicators
- Current step highlighting

### File Upload Experience

- Drag & drop support
- File type validation
- File size validation (5MB max)
- Image preview
- Error messaging

### Form Validation

- Real-time validation
- Step-by-step validation
- Clear error messages
- Required field indicators

## 🔒 Security & Validation

### File Validation

```typescript
export const validateFile = (file: File, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png'],
  } = options;

  // Size validation
  if (file.size > maxSize) {
    return { isValid: false, errors: ['File too large'] };
  }

  // Type validation
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, errors: ['Invalid file type'] };
  }

  return { isValid: true, errors: [] };
};
```

### Upload Security

- Presigned URLs for secure uploads
- File type restrictions
- Size limitations
- Server-side validation

## 📊 API Endpoints

### Required Endpoints

| Endpoint                         | Method | Purpose                           |
| -------------------------------- | ------ | --------------------------------- |
| `/upload/presigned-url`          | POST   | Get presigned URL for file upload |
| `/vendor-onboarding/documents`   | POST   | Create Ghana Card document record |
| `/vendor-onboarding/application` | POST   | Submit vendor application         |

### Request/Response Examples

#### Presigned URL Request

```json
{
  "fileName": "ghana-card-front.jpg",
  "contentType": "image/jpeg",
  "fileSize": 1024000
}
```

#### Document Creation Request

```json
{
  "documentType": "GHANA_CARD",
  "side": "FRONT",
  "fileName": "ghana-card-front.jpg",
  "fileUrl": "https://storage.example.com/files/123456.jpg",
  "fileSize": 1024000,
  "mimeType": "image/jpeg"
}
```

## 🚀 Usage

### For Developers

1. **Setup**: Ensure all required API endpoints are available
2. **Configuration**: Update API base URLs in environment variables
3. **Testing**: Test file upload flow with various file types and sizes

### For Users

1. **Business Information**: Fill in business details
2. **Ghana Card Upload**: Upload front and back images
3. **Bank Information**: Enter bank account details
4. **Submit**: Complete application submission

## 🐛 Error Handling

### Common Errors

- File size too large
- Invalid file type
- Network upload failures
- Server validation errors

### Error Recovery

- Clear error messages
- Retry mechanisms
- Form state preservation
- Graceful degradation

## 🔄 Migration from Old System

### Backend Changes Required

1. Remove `ghanaCardFront` and `ghanaCardBack` fields from application schema
2. Ensure documents endpoint supports Ghana Card uploads
3. Update application validation logic

### Frontend Changes

1. Replace URL fields with file upload components
2. Implement multi-step form
3. Add file validation and preview
4. Update submission flow

## 📈 Benefits

### Technical Benefits

- **Separation of Concerns**: Document management separate from application data
- **Scalability**: Proper file storage and management
- **Security**: Presigned URLs and validation
- **Maintainability**: Clean, modular code structure

### User Benefits

- **Better UX**: Multi-step form with progress indication
- **File Validation**: Clear feedback on file requirements
- **Preview**: See uploaded images before submission
- **Error Handling**: Clear error messages and recovery

## 🧪 Testing

### Unit Tests

- File validation functions
- Form validation schemas
- Component rendering

### Integration Tests

- File upload flow
- API integration
- Error scenarios

### E2E Tests

- Complete onboarding flow
- File upload scenarios
- Error handling

## 📝 Future Enhancements

### Potential Improvements

- **Bulk Upload**: Upload multiple documents at once
- **OCR Integration**: Extract data from Ghana Card images
- **Progress Tracking**: Real-time upload progress
- **Document Management**: View and manage uploaded documents
- **Mobile Optimization**: Better mobile file upload experience

### API Enhancements

- **Webhook Support**: Notify on document upload completion
- **Document Verification**: Automated document validation
- **Version Control**: Document version management

## 🤝 Contributing

When contributing to this implementation:

1. Follow the established patterns
2. Add proper TypeScript types
3. Include error handling
4. Write tests for new features
5. Update documentation

## 📞 Support

For questions or issues:

1. Check the API documentation
2. Review error logs
3. Test with different file types
4. Verify network connectivity
5. Contact the development team
