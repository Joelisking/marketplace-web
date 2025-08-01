import { cn } from '@/lib/utils';
import { Icon, LucideIconProps } from './icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';

interface Props {
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  onClose?: () => void;
  open?: boolean;
  icon: LucideIconProps;
  bgClassName?: string;
  textClassName?: string;
  buttonClassName?: string;
  subTitle?: string;
  isLoading?: boolean;
  hideCancel?: boolean;
}

export const ConfirmDialog = ({
  title = 'Confirm Deletion',
  description = 'Are you sure you want to delete? This action cannot be undone.',
  confirmText = 'Delete',
  onConfirm,
  onClose,
  open,
  icon,
  bgClassName,
  textClassName,
  buttonClassName,
  subTitle,
  isLoading,
  hideCancel,
}: Props) => {
  return (
    <AlertDialog onOpenChange={onClose} open={open}>
      <AlertDialogContent>
        <div className="flex h-12 items-center justify-between">
          <div
            className={cn(
              'bg-danger-100 flex h-12 w-12 items-center justify-center rounded-full',
              bgClassName
            )}>
            <Icon
              name={icon}
              className={cn(
                'h-6 w-6 text-primary-inverted',
                textClassName
              )}
            />
          </div>

          <AlertDialogCancel className="border-0 p-0">
            <Icon name="X" className="h-6 w-6 text-neutral-500" />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {subTitle && (
            <div className="pb-3 font-medium text-neutral-800">
              RE: {subTitle}
            </div>
          )}
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!hideCancel && (
            <AlertDialogCancel onClick={onClose}>
              Cancel
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            className={cn(
              'bg-primary-default text-white hover:bg-primary-pressed',
              buttonClassName
            )}
            onClick={onConfirm}>
            {isLoading && (
              <Icon
                name="LoaderCircle"
                className="h-4 w-4 animate-spin"
              />
            )}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
