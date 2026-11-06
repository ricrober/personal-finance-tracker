import { useEffect, useRef } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface AddExpenseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function AddExpenseDialog({
    isOpen,
    onClose,
    children
}: AddExpenseDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog
            ref={dialogRef}
            className="modal modal-bottom sm:modal-middle"
            onCancel={event => {
                event.preventDefault();
                onClose();
            }}
            onClick={event => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="modal-box w-full max-w-none rounded-t-2xl rounded-b-none max-h-[95dvh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        Add expense
                    </h2>

                    <button
                        type="button"
                        className="btn btn-circle btn-ghost btn-sm btn-error"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <XMarkIcon className="size-6" />
                    </button>
                </div>

                {children}
            </div>
        </dialog>
    );
}