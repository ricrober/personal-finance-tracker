import { useState, type SubmitEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

import DeleteExpenseDialog from './components/expenses/DeleteExpenseDialog';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

function AddExpenseForm() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid expense amount');
      return;
    }

    const amountInMinorUnits = Math.round(
      (parsedAmount + Number.EPSILON) * 100
    );

    if (
      !Number.isSafeInteger(amountInMinorUnits) ||
      amountInMinorUnits <= 0
    ) {
      setError('Please enter a valid expense amount');
      return;
    }

    const normalizedDescription = description.trim();

    if (!normalizedDescription) {
      setError('Please enter an expense description');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      await db.expenses.add({
        occurredAt: new Date(),
        description: normalizedDescription,
        amountInMinorUnits,
      });

      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error saving expense:', error);
      setError('Could not save the expense. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Expense amount</legend>
        <input
          className="input input-bordered w-full"
          id="enter-expense"
          type="number"
          min="0.01"
          step="0.01" 
          required
          value={amount}
          placeholder="0.00"
          onChange={event => setAmount(event.target.value)}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Expense description</legend>
        <input
          className="input input-bordered w-full"
          id="enter-expense-description"
          type="text"
          maxLength={100}
          required
          value={description}
          placeholder="Description"
          onChange={event => setDescription(event.target.value)}
        />
      </fieldset>

      <div className="flex justify-end">
        <button
          className="btn btn-primary w-full sm:w-auto"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Add Expense'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error" role='alert'>
          {error}
        </div>
      )}
    </form>
  );
}

function ExpensesList() {
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
            <div className="flex-1 font-medium tabular-nums">
              <p>{expense.description}</p>
              {currencyFormatter.format(expense.amountInMinorUnits / 100)}
              <p className='text-sm text-secondary-content'>{expense.occurredAt.toLocaleString()}</p>
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

function App() {
  return (
    <main className="min-h-dvh bg-base-200 px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-6">
            <header>
              <h1 className="text-2xl font-bold text-primary">
                Personal Finance Tracker
              </h1>
            </header>
            <section aria-labelledby="add-expense-heading">
              <h2
                id="add-expense-heading"
                className="text-lg font-semibold mb-3"
              >
                Add Expense
              </h2>
              <AddExpenseForm />
            </section>
            <section aria-labelledby="expenses-heading">
              <h2
                id="expenses-heading"
                className="text-lg font-semibold mb-3"
              >
                Expenses
              </h2>

              <ExpensesList />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
