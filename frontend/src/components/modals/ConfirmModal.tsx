interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-2">
          {title}
        </h2>

        <p className="text-slate-400 text-sm mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
