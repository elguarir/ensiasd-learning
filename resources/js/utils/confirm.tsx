import ConfirmDialog from "@/components/confirm-dialog";
import { ConfirmDialogProps } from "@/hooks/use-confirm";
import { createRoot } from "react-dom/client";

// Make onConfirm optional since we provide it in the confirm function
type ConfirmOptions = Omit<
  ConfirmDialogProps,
  "open" | "onClose" | "onConfirm"
> & {
  onConfirm?: () => void;
};

/**
 * Shows a confirmation dialog and returns a promise that resolves when confirmed or rejects when cancelled.
 *
 * @example
 * // Simple usage
 * confirm({
 *   title: "Delete item",
 *   message: "Are you sure you want to delete this item?",
 * }).then(() => {
 *   // User confirmed
 *   deleteItem();
 * }).catch(() => {
 *   // User cancelled
 * });
 *
 * @example
 * // With custom buttons and variant
 * confirm({
 *   title: "Delete account",
 *   message: "This action cannot be undone. Are you absolutely sure?",
 *   confirmText: "Yes, delete my account",
 *   cancelText: "Cancel",
 *   variant: "destructive",
 * }).then(() => {
 *   deleteAccount();
 * });
 */
export function confirm(options: ConfirmOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create container for the dialog
    const confirmNode = document.createElement("div");
    document.body.appendChild(confirmNode);

    // Create root for the dialog
    const root = createRoot(confirmNode);

    // Function to close and clean up the dialog
    const closeDialog = () => {
      root.unmount();
      if (confirmNode.parentNode) {
        confirmNode.parentNode.removeChild(confirmNode);
      }
    };

    // Render the dialog
    root.render(
      <ConfirmDialog
        {...options}
        open={true}
        onConfirm={() => {
          closeDialog();
          if (options.onConfirm) options.onConfirm();
          resolve();
        }}
        onCancel={() => {
          closeDialog();
          reject();
        }}
        onClose={() => {
          closeDialog();
          reject();
        }}
      />,
    );
  });
}

/**
 * Same as confirm() but doesn't throw when cancelled.
 * Instead, it returns a boolean indicating whether the user confirmed (true) or cancelled (false).
 *
 * @example
 * const confirmed = await confirmSafe({
 *   title: "Delete item",
 *   message: "Are you sure you want to delete this item?",
 * });
 *
 * if (confirmed) {
 *   deleteItem();
 * }
 */
export async function confirmSafe(options: ConfirmOptions): Promise<boolean> {
  try {
    await confirm(options);
    return true;
  } catch {
    return false;
  }
}
