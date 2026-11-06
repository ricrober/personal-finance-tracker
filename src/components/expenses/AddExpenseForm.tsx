import { useState, type SubmitEvent } from "react";

import { db } from '../../db';

export default function AddExpenseForm({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
        return;
    }

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

      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      setError('Could not save the expense. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="datetime-local"
        className="input input-bordered w-full"
        value={new Date().toISOString().slice(0, 16)}
        readOnly
      />

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Expense amount</legend>
        <input
          className="input input-bordered w-full"
          id="enter-expense"
          type="number"
          min="0.01"
          step="0.01" 
          max="10 000 000 000 000 000"
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