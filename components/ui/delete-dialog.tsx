import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
  // Button,
} from './alert-dialog';
import { Icon } from './icon';

interface Props {
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  onClose?: () => void;
  open?: boolean;
}

export const ConfirmDeleteDialog = ({
  title = 'Confirm Deletion',
  description = 'Are you sure you want to delete? This action cannot be undone.',
  confirmText = 'Delete',
  onConfirm,
  onClose,
  open,
}: Props) => {
  return (
    <AlertDialog onOpenChange={onClose} open={open}>
      <AlertDialogContent>
        <div className="flex h-12 items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-disabled">
            <Icon
              name="Trash2"
              className="h-6 w-6 text-danger-default"
            />
          </div>

          <AlertDialogCancel className="border-0 p-0">
            <Icon name="X" className="h-6 w-6 text-neutral-dark" />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="hover:bg-danger-600 bg-danger-default text-white"
            onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
