export interface TransactionResponse {
    transactions: {
        id: number
        description: string
        value: number
        account_id: number
        transaction_category_id: number
        created_at: Date
        category_name: string
        account_name: string
    }[]
    total: number
}
export interface TransactionGetResponse {
    id: number
    description: string
    value: number
    account_id: number
    transaction_category_id: number
    created_at: Date
    category_name: string
    account_name: string
 
}

export interface CreateTransaction {
    description?: string,
    value: number,
    account_id: number,
    transaction_category_id: number,
    created_at: Date
}


export interface UpdateTransaction {
    id: number,
    description?: string,
    value?: number,
    account_id?: number,
    transaction_category_id?: number,
    created_at?: Date
}
export enum Order{
    ascending = "ASC",
    descending = "DESC"
}

export interface FetchTransaction {
    page: number
    limit: number
    start_time: Date
    final_time: Date
    order: string
    account_id?: string[]
    transaction_category_id?: string[]
    search?: string
}
