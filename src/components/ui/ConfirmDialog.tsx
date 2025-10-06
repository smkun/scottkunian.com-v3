import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';

interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Dialog title */
  title: string;
  /** Dialog description/message */
  description: string;
  /** Confirm button text (default: "Confirm") */
  confirmText?: string;
  /** Cancel button text (default: "Cancel") */
  cancelText?: string;
  /** Confirm button variant (default: "primary") */
  confirmVariant?: 'primary' | 'secondary';
  /** Loading state for async operations */
  loading?: boolean;
  /** Callback when user confirms */
  onConfirm: () => void;
  /** Callback when user cancels or closes */
  onCancel: () => void;
  /** Destructive action styling (red confirm button) */
  destructive?: boolean;
}

/**
 * Accessible confirmation dialog for user actions
 *
 * Features:
 * - Focus trap within dialog
 * - Escape key to cancel
 * - Click outside to cancel
 * - Proper ARIA attributes
 * - Keyboard navigation
 *
 * @example
 * <ConfirmDialog
 *   isOpen={showDelete}
 *   title="Delete Project"
 *   description="Are you sure you want to delete this project? This action cannot be undone."
 *   confirmText="Delete"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowDelete(false)}
 *   destructive
 * />
 */
export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focus confirm button when dialog opens
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <Card
        ref={dialogRef}
        className="w-full max-w-md animate-slide-up shadow-2xl"
      >
        <CardHeader>
          <CardTitle id="dialog-title" className={destructive ? 'text-error-600' : ''}>
            {destructive && (
              <svg
                className="inline-block w-5 h-5 mr-2 -mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
            {title}
          </CardTitle>
          <CardDescription id="dialog-description">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            aria-label="Cancel action"
          >
            {cancelText}
          </Button>

          <Button
            ref={confirmButtonRef}
            variant={destructive ? 'secondary' : confirmVariant}
            onClick={onConfirm}
            loading={loading}
            className={destructive ? 'bg-error-600 hover:bg-error-700 focus:ring-error-500' : ''}
            aria-label={`${confirmText} action`}
          >
            {confirmText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
