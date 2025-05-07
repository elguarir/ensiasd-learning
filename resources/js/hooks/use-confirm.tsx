import React, { ReactNode, useCallback } from "react";
import { createRoot } from "react-dom/client";

export interface ConfirmOptions {
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel?: () => void;
}

// Types for the dialog component props
export interface ConfirmDialogProps extends ConfirmOptions {
  open: boolean;
  onClose: () => void;
}

export interface ConfirmOptions {
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel?: () => void;
}

// Types for the dialog component props
export interface ConfirmDialogProps extends ConfirmOptions {
  open: boolean;
  onClose: () => void;
}

// The hook returns a function that displays a confirmation dialog
export function useConfirm() {
  // Create a memoized confirm function
  const confirm = useCallback(
    (
      options: ConfirmOptions,
      DialogComponent: React.ComponentType<ConfirmDialogProps>,
    ) => {
      // Create a container for the dialog
      const confirmNode = document.createElement("div");
      document.body.appendChild(confirmNode);

      // Create a root for the dialog
      const root = createRoot(confirmNode);

      // Function to close and clean up the dialog
      const closeDialog = () => {
        root.unmount();
        if (confirmNode.parentNode) {
          confirmNode.parentNode.removeChild(confirmNode);
        }
      };

      // Props for the dialog component
      const dialogProps: ConfirmDialogProps = {
        ...options,
        open: true,
        onClose: closeDialog,
      };

      // Render the dialog
      root.render(<DialogComponent {...dialogProps} />);
    },
    [],
  );

  return confirm;
}
