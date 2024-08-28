export interface FetchDashbord {
    start_time: Date
    final_time: Date
}

export interface DashbordResponse {
    expenses: number, 
    income: number
}

export interface DashbordCategorysResponse {
    name: string,
    expenses: number, 
    income: number
}

export interface DashbordMonthResponse {
    month: string,
    expenses: number, 
    income: number
}

export interface DashbordBudgeResponse {
    total_value: number, 
}
