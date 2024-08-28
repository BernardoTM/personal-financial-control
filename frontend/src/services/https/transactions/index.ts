import qs from 'qs';
import * as t from "./types";
import { get, post, put, apiDelete } from "@/services/methods";
import { DefaultApiResponse } from "@/services/types";


export async function createTransaction(data: t.CreateTransaction): Promise<DefaultApiResponse> {
  return await post({
    url: "/transaction", data
  });
}

export async function fetchTransactions({ page, limit, start_time, final_time,
  order, account_id, transaction_category_id,  search}: t.FetchTransaction): Promise<t.TransactionResponse> {
    const queryString = qs.stringify({
      page,
      limit,
      start_time,
      final_time,
      order,
      account_id,
      transaction_category_id,
      search
  }, { arrayFormat: 'repeat' }); 

  const response = await get({
      url: `/transaction/all?${queryString}`
  });

  return response.data;
}

export async function getTransaction(transactionId: number): Promise<t.TransactionGetResponse> {
  const response = await get({
    url: `/transaction/${transactionId}`,
  });
  return response.data
}


export async function updateTransaction( data: t.UpdateTransaction): Promise<DefaultApiResponse> {
  return await put({
    url: `/transaction`, data
  });
}

export async function deleteTransaction(transactionId: number): Promise<DefaultApiResponse> {
  return await apiDelete({
    url: `/transaction/${transactionId}`,
  });
}