'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, FileText, Clock } from 'lucide-react';
import { usePostVendorOnboardingAdminApplicationsApplicationIdReview } from '@/lib/api/admin/admin';
import {
  VENDOR_APPLICATION_STATUS,
  type VendorApplicationStatus,
} from '@/lib/types/vendor-applications';

interface VendorApplication {
  id: string;
  businessName: string;
  status: string;
  // Add other properties as needed
}

interface ApplicationReviewDialogProps {
  application: VendorApplication;
  onClose: () => void;
  onReview: () => void;
}

export function ApplicationReviewDialog({
  application,
  onClose,
  onReview,
}: ApplicationReviewDialogProps) {
  const [formData, setFormData] = useState({
    status: 'APPROVED' as VendorApplicationStatus,
    reviewNotes: '',
    rejectionReason: '',
  });

  const reviewMutation =
    usePostVendorOnboardingAdminApplicationsApplicationIdReview({
      mutation: {
        onSuccess: () => {
          onReview();
          onClose();
        },
        onError: (error) => {
          console.error('Review submission failed:', error);
        },
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData = {
      status: formData.status as
        | 'APPROVED'
        | 'REJECTED'
        | 'DOCUMENTS_REQUESTED'
        | 'UNDER_REVIEW',
      reviewNotes: formData.reviewNotes,
      ...(formData.status === VENDOR_APPLICATION_STATUS.REJECTED && {
        rejectionReason: formData.rejectionReason,
      }),
    };

    reviewMutation.mutate({
      applicationId: application.id,
      data: reviewData,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Application</DialogTitle>
          <DialogDescription>
            Review and make a decision on {application.businessName}
            &apos;s vendor application.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Decision</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as VendorApplicationStatus,
                  }))
                }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={VENDOR_APPLICATION_STATUS.APPROVED}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Approve
                    </div>
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_APPLICATION_STATUS.REJECTED}>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Reject
                    </div>
                  </SelectItem>
                  <SelectItem
                    value={
                      VENDOR_APPLICATION_STATUS.DOCUMENTS_REQUESTED
                    }>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                      Request Additional Documents
                    </div>
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_APPLICATION_STATUS.UNDER_REVIEW}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Mark for Review
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Review Notes</Label>
              <Textarea
                id="reviewNotes"
                placeholder="Add your review notes and comments..."
                value={formData.reviewNotes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reviewNotes: e.target.value,
                  }))
                }
                rows={4}
                required
              />
            </div>

            {formData.status ===
              VENDOR_APPLICATION_STATUS.REJECTED && (
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">
                  Rejection Reason
                </Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Provide specific reason for rejection..."
                  value={formData.rejectionReason}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rejectionReason: e.target.value,
                    }))
                  }
                  rows={3}
                  required
                />
              </div>
            )}

            {reviewMutation.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to submit review. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={reviewMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={reviewMutation.isPending}>
              {reviewMutation.isPending
                ? 'Submitting...'
                : 'Submit Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
