import { get, post, put, apiDelete } from "@/services/methods";
import { DefaultApiResponse } from "@/services/types";
import * as t from "./types";


export async function createBudget(data: t.CreateBudget): Promise<DefaultApiResponse> {
  return await post({
    url: "/budget", data 
  });
}

export async function fetchBudgets({start_time, final_time, search}: t.FetchBudget): Promise<[t.BudgetResponse]> {
  const response = await get({
        url: "/budget/all", params: {start_time, final_time, search}
      });
  return response.data
}


export async function getBudget(budgetId: number): Promise<t.BudgetResponse> {
  const response = await get({
    url: `/budget/${budgetId}`,
  });
  return response.data
}


export async function updateBudget( data: t.UpdateBudget): Promise<DefaultApiResponse> {
  return await put({
    url: `/budget`, data
  });
}

export async function deleteBudget(budgetId: number): Promise<DefaultApiResponse> {
  return await apiDelete({
    url: `/budget/${budgetId}`,
  });
}