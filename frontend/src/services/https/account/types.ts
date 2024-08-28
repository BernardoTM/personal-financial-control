export interface AccountResponse {
    id: number,
    name: string,
    description: string,
    opening_balance: number,
    balance: number,
    updated_at: Date,
    created_at: Date
}

export interface CreateAccount {
    name: string,
    description?: string,
    opening_balance?: number,
}

export interface UpdateAccount {
    id?: number,
    name?: string,
    description?: string,
    opening_balance?: number,
}

