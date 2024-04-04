import pool from "../db/connection";
import { Expense, ExpenseParticipant } from "../types/expense.types";

// TODO: add queries for filtering search results
const listExpenses = async (id: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM expense_participants WHERE user_id=$1;",
      [id]
    );
    return result.rows;
  } finally {
    client.release();
  }
};

const getCreatedExpenses = async (id: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM expenses WHERE created_by=$1;",
      [id]
    );
    return result.rows;
  } finally {
    client.release();
  }
};

const getExpense = async (id: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM expenses WHERE id=$1;", [
      id,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const createExpense = async (data: Expense) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN;");
    const expenseResult = await client.query(
      "INSERT INTO expenses(amount, currency_code_id, created_by, description, is_settled) VALUES ($1,$2,$3,$4,$5) RETURNING *;",
      [
        data.amount,
        data.currency_code_id,
        data.created_by,
        data.description,
        data.is_settled,
      ]
    );
    const expense = expenseResult.rows[0];
    const expenseID = expense.id;

    const expense_participants = data.participants.map(
      (participant: ExpenseParticipant) => {
        return {
          expense_id: `'${expenseID}'`,
          user_id: `'${participant.user_id}'`,
          is_settled: participant.is_settled,
          payment_cut: participant.payment_cut,
          currency_code_id: data.currency_code_id,
          comments: `'${participant.comments}'`,
        };
      }
    );

    for (const participant of expense_participants) {
      const participantKeys = Object.keys(participant).join(", ");
      const participantValues = Object.values(participant).join(", ");
      const query =
        "INSERT INTO expense_participants(" +
        participantKeys +
        ") VALUES(" +
        participantValues +
        ");";
      await client.query(query);
    }

    const participants = await client.query(
      "SELECT  user_id, payment_cut, is_settled, comments FROM expense_participants WHERE expense_id=$1;",
      [expenseID]
    );
    await client.query("COMMIT");
    const expenseSummary = {
      id: expenseID,
      amount: expense.amount,
      created_by: expense.created_by,
      description: expense.description,
      created_at: expense.created_at,
      is_settled: expense.is_settled,
      currency_code_id: data.currency_code_id,
      participants: participants.rows,
    };
    return expenseSummary;
  } catch (error) {
    await client.query("ROLLBACK;");
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

const getExpenseSummary = async (expenseID: string) => {
  const client = await pool.connect();
  try {
    const summary = await client.query(
      "SELECT expenses.id, user_id, payment_cut FROM expense_participants JOIN expenses on expense_participants.expense_id=expenses.id WHERE expenses.id=$1;",
      [expenseID]
    );
    return summary.rows[0];
  } finally {
    client.release();
  }
};

const settleExpense = async (expenseID: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE expenses SET is_settled=true WHERE id=$1 RETURNING *;",
      [expenseID]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  getCreatedExpenses,
  listExpenses,
  getExpense,
  getExpenseSummary,
  createExpense,
  settleExpense,
};
