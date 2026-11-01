import { Dexie, type EntityTable } from "dexie";

interface Expense {
    id?: number,
    amountInMinorUnits: number
};

const db = new Dexie("PersonalFinanceTracker") as Dexie & {
    expenses: EntityTable<Expense, "id">;
};

db.version(1).stores(
    {
        expenses: "++id",
    }
);

export type { Expense };
export { db }
