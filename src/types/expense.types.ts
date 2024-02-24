export interface Expense {
    id: string;
    amount: number;
    created_by: string;
    description: string;
    created_at: string;
    is_settled: boolean;
    currency_code_id: string;
    participants: ExpenseParticipant[];
}

export interface ExpenseParticipant {
    id: string;
    expense_id: string;
    user_id: string;
    amount: number;
    is_settled: boolean;
    comments: string;
    payment_cut: string;
}