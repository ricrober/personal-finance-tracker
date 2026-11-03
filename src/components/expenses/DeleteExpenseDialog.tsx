import { useEffect, useRef } from 'react';

interface DeleteExpenseDialogProps {
    isOpen: boolean;
    isDeleting: boolean;
    error: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteExpenseDialog({
    isOpen,
    isDeleting,
    error,
    onConfirm,
    onCancel,
}: DeleteExpenseDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog
            ref={dialogRef}
            className="modal"
            onCancel={event => {
                event.preventDefault();
                onCancel();
            }}
            onClick={event => {
                if (event.target === event.currentTarget) {
                    onCancel();
                }
            }}
        >
            <div className="modal-box">
                <h3 className="text-lg font-bold">
                    Delete expense
                </h3>

                <p className="py-4">
                    Are you sure you want to delete this expense?
                    This action cannot be undone.
                </p>

                {error && (
                    <div className="alert alert-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="modal-action">
                    <button
                        type="button"
                        className="btn"
                        disabled={isDeleting}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="btn btn-error"
                        disabled={isDeleting}
                        onClick={onConfirm}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </dialog>
    );
}
