export interface BudgetResponse {
    id: number,
    value: number,
    transaction_category_id: number,
    category_name: string,
    start_at: Date,
    finish_at: number,
    amount_spent: number
    created_at: Date,
    updated_at: Date,
}

export interface CreateBudget {
    value: number,
    transaction_category_id: number,
    start_at: Date,
    duration_in_months: number,
}

export interface UpdateBudget {
    id: number,
    value?: number,
    transaction_category_id?: number,
    start_at?: Date,
    duration_in_months?: number,
}

export interface FetchBudget {
    start_time: Date
    final_time: Date
    search?: string
}
