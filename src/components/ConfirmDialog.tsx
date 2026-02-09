import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <h2 className="text-sm font-semibold text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

