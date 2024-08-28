import * as t from "./types";
import { get } from "@/services/methods";





export async function fetchConsoTransacions({start_time, final_time}: t.FetchDashbord): Promise<t.DashbordResponse> {
  const response = await get({
        url: "/dashboard/consolidated-transacions", params: {start_time, final_time}
      });
  return response.data
}


export async function fetchConsoBudges({start_time, final_time}: t.FetchDashbord): Promise<t.DashbordBudgeResponse> {
  const response = await get({
        url: "/dashboard/consolidated-budges", params: {start_time, final_time}
      });
  return response.data
}

export async function fetchConsoCategorys({start_time, final_time}: t.FetchDashbord): Promise<t.DashbordCategorysResponse[]> {
  const response = await get({
        url: "/dashboard/consolidated-transacions-categorys", params: {start_time, final_time}
      });
  return response.data
}

export async function fetchConsoTransacionsMonth(): Promise<t.DashbordMonthResponse[]> {
  const response = await get({
        url: "/dashboard/consolidated-transacions-month"
      });
  return response.data
}
