import { PlusIcon, XMarkIcon, ArrowsRightLeftIcon, ArrowUpOnSquareIcon, ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";


export default function Fab({ openAddExpenseDialog} : { openAddExpenseDialog: () => void}) {
    return (
        <div className="fab fab-flower">
            {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
            <button tabIndex={0} role="button" className="btn btn-circle btn-lg btn-primary">
                <PlusIcon className="size-6" />
            </button>

            {/* close button should not be focusable so it can close the FAB when clicked. It's just a visual placeholder */}
            <div className="fab-close">
                <span className="btn btn-circle btn-lg btn-error">
                    <XMarkIcon className="size-6" />
                </span>
            </div>

            {/* buttons that show up when FAB is open */}
            <button
                className="btn btn-circle btn-lg"
                aria-label="Expense"
                onClick={openAddExpenseDialog}
            >
                <ArrowUpOnSquareIcon className="size-6" />
            </button>

            <button className="btn btn-circle btn-lg" aria-label="Income">
                <ArrowDownOnSquareIcon className="size-6" />
            </button>

            <button className="btn btn-circle btn-lg" aria-label="Transfer">
                <ArrowsRightLeftIcon className="size-6" />
            </button>
        </div>
    );
}
