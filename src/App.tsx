import { useState, type SubmitEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'MXN',
});

function AddExpenseForm() {
  const [amount, setAmount] = useState('');
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

    try {
      setIsSaving(true);
      setError('');

      await db.expenses.add({ amountInMinorUnits });

      setAmount('');
    } catch (error) {
      console.log('Error saving expense:', error);
      setError('Could not save the expense. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="enter-expense">Expense:</label>

      <input
        id="enter-expense"
        type="number"
        min="0.01"
        step="0.01" 
        required
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />

      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Add Expense'}
      </button>

      {error && <p role='alert'>{error}</p>}
    </form>
  );
}

function ExpensesList() {
  const expenses = useLiveQuery(() => db.expenses.orderBy('id').reverse().toArray(), []);

  if (expenses === undefined) {
    return <p>Loading expenses...</p>
  }

  if (expenses.length === 0) {
    return <p>No expenses recorded yet.</p>
  }

  return (
    <ul>
      {expenses.map(expense => (
        <li key={expense.id}>
          {currencyFormatter.format(expense.amountInMinorUnits / 100)}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <main>
      <h1>Personal Finance Tracker</h1>

      <h2>Add Expense</h2>
      <AddExpenseForm />

      <h2>Expenses List</h2>
      <ExpensesList />
    </main>
  )
}

export default App
