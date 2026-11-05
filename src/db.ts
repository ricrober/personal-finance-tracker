import { Dexie, type EntityTable } from "dexie";

interface Expense {
    id?: number
    occurredAt: Date
    description: string
    amountInMinorUnits: number
};

const db = new Dexie("PersonalFinanceTracker") as Dexie & {
    expenses: EntityTable<Expense, "id">;
};

db.version(2)
    .stores({
        expenses: "++id"
    })
    .upgrade(async tx => {
        await tx.table('expenses').toCollection().modify(expense => {
            expense.description ??= 'Legacy expense';
            expense.occurredAt ??= new Date();
        });
    });

export type { Expense };
export { db }
