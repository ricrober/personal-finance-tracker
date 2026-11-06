import { useState } from 'react';

import AppHeader from "./components/layout/AppHeader";
import ExpensesList from "./components/expenses/ExpensesList";
import Fab from './components/expenses/Fab';
import AddExpenseDialog from './components/expenses/AddExpenseDialog';
import AddExpenseForm from './components/expenses/AddExpenseForm';


function App() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-base-100">
      <AppHeader />

      <main className='flex-1 min-h-0 overflow-y-auto overscroll-contain'>
        <ExpensesList />
      </main>

      <Fab
        openAddExpenseDialog={() => setIsAddExpenseOpen(true)}
      />

      <AddExpenseDialog
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      >
        <AddExpenseForm
          onClose={() => setIsAddExpenseOpen(false)}
        />
      </AddExpenseDialog>
    </div>
  )
}

export default App
