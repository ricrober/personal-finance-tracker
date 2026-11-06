import { useState } from 'react';
import { db } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import DeleteExpenseDialog from './DeleteExpenseDialog'


const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export default function ExpensesList() {
    const expenses = useLiveQuery(() => db.expenses.orderBy('id').reverse().toArray(), []);

    const [expenseToDelete, setExpenseToDelete] = useState<number|null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    if (expenses === undefined) {
        return <p>Loading expenses...</p>
    }

    if (expenses.length === 0) {
        return <p>No expenses recorded yet.</p>
    }

    async function confirmDelete() {
        if (expenseToDelete === null || isDeleting) {
        return;
        }

        try {
        setIsDeleting(true);
        setDeleteError('');

        await db.expenses.delete(expenseToDelete);

        setExpenseToDelete(null);
        setDeleteError('');
        } catch (error) {
        console.error('Error deleting expense:', error);
        setDeleteError('Could not delete the expense. Please try again.');
        } finally {
        setIsDeleting(false);
        }
    }

    return (
        <section>
            <ul className="list bg-base-100 rounded-box shadow-sm">
            {expenses.map(expense => (
                <li className="list-row flex items-center" key={expense.id}>
                <div className="flex-1 min-w-0">
                    <p className='font-medium truncate'>
                        {expense.description}
                    </p>
                    <p className='text-sm font-semibold tabular-nums'>
                        {currencyFormatter.format(expense.amountInMinorUnits / 100)}
                    </p>
                    <p className='text-xs text-base-content/50'>
                        {expense.occurredAt.toLocaleString()}
                    </p>
                </div>
    
                <button
                    className="btn btn-square btn-ghost"
                    type="button"
                    aria-label="Edit expense amount"
                >
                    <PencilSquareIcon className="size-5" aria-hidden="true" />
                </button>
    
                <button
                    className="btn btn-square btn-ghost text-error"
                    type="button"
                    aria-label="Delete expense"
                    onClick={() => {
                    if (expense.id !== undefined)
                        setExpenseToDelete(expense.id);
                    }}
                >
                    <TrashIcon className="size-5" aria-hidden="true" />
                </button>  
                </li>
            ))}
            </ul>
    
            <DeleteExpenseDialog
            isOpen={expenseToDelete !== null}
            isDeleting={isDeleting}
            error={deleteError}
            onConfirm={confirmDelete}
            onCancel={() => setExpenseToDelete(null)}
            />
        </section>
    );
}