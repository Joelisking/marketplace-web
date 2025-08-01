import axios from 'axios';

export interface VendorApplication {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  businessDescription: string;
  businessAddress: string;
  businessPhone: string;
  taxIdentification: string;
  ghanaCardNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankCode: string;
  expectedMonthlySales: string;
  productCategories: string[];
  socialMediaLinks: Record<string, string>;
  status:
    | 'PENDING'
    | 'UNDER_REVIEW'
    | 'DOCUMENTS_REQUESTED'
    | 'APPROVED'
    | 'REJECTED'
    | 'SUSPENDED';
  reviewNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  businessDocuments: Array<{
    id: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    isVerified: boolean;
    verificationNotes: string | null;
    uploadedAt: string;
    verifiedAt: string | null;
    side: string;
  }>;
}

export interface ApplicationsResponse {
  message: string;
  applications: VendorApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApplicationResponse {
  message: string;
  application: VendorApplication;
}

export interface ReviewApplicationRequest {
  status:
    | 'APPROVED'
    | 'REJECTED'
    | 'DOCUMENTS_REQUESTED'
    | 'UNDER_REVIEW';
  reviewNotes: string;
  rejectionReason?: string;
}

export interface UpdateStatusRequest {
  status:
    | 'PENDING'
    | 'UNDER_REVIEW'
    | 'DOCUMENTS_REQUESTED'
    | 'APPROVED'
    | 'REJECTED'
    | 'SUSPENDED';
  notes: string;
  rejectionReason?: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalVendors: number;
  totalUsers: number;
  averageProcessingTime: number;
  applicationsByStatus: Array<{ status: string; count: number }>;
  applicationsByBusinessType: Array<{
    businessType: string;
    count: number;
  }>;
  recentApplications: Array<{
    id: string;
    businessName: string;
    status: string;
    createdAt: string;
    user: { email: string };
  }>;
}

export interface DashboardResponse {
  message: string;
  dashboard: DashboardStats;
}

export const vendorApplicationsApi = {
  // Get all vendor applications with filtering and pagination
  getApplications: async (params?: {
    status?: string;
    businessType?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApplicationsResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await axios.get(
      `/vendor-onboarding/admin/applications?${queryParams}`
    );
    return response.data;
  },

  // Get single vendor application by ID
  getApplication: async (
    applicationId: string
  ): Promise<ApplicationResponse> => {
    const response = await axios.get(
      `/vendor-onboarding/admin/applications/${applicationId}`
    );
    return response.data;
  },

  // Review/approve/reject application
  reviewApplication: async (
    applicationId: string,
    reviewData: ReviewApplicationRequest
  ): Promise<ApplicationResponse> => {
    const response = await axios.post(
      `/vendor-onboarding/admin/applications/${applicationId}/review`,
      reviewData
    );
    return response.data;
  },

  // Update application status
  updateStatus: async (
    applicationId: string,
    statusData: UpdateStatusRequest
  ): Promise<ApplicationResponse> => {
    const response = await axios.put(
      `/vendor-onboarding/admin/applications/${applicationId}/status`,
      statusData
    );
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardResponse> => {
    const response = await axios.get(
      '/vendor-onboarding/admin/dashboard'
    );
    return response.data;
  },

  // Verify document
  verifyDocument: async (
    documentId: string,
    verificationData: {
      isVerified: boolean;
      verificationNotes?: string;
    }
  ): Promise<{
    message: string;
    document: VendorApplication['businessDocuments'][0];
  }> => {
    const response = await axios.post(
      `/vendor-onboarding/admin/documents/${documentId}/verify`,
      verificationData
    );
    return response.data;
  },

  // Bulk actions
  bulkAction: async (
    applicationIds: string[],
    action: 'approve' | 'reject' | 'request-documents',
    notes?: string
  ): Promise<{ message: string; updatedCount: number }> => {
    const response = await axios.post(
      '/vendor-onboarding/admin/applications/bulk-action',
      {
        applicationIds,
        action,
        notes,
      }
    );
    return response.data;
  },

  // Export applications
  exportApplications: async (params?: {
    status?: string;
    businessType?: string;
    format?: 'csv' | 'excel';
  }): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await axios.get(
      `/vendor-onboarding/admin/applications/export?${queryParams}`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};
