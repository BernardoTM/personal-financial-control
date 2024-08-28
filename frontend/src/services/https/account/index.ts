import { get, post, put, apiDelete } from "@/services/methods";
import { DefaultApiResponse } from "@/services/types";
import * as t from "./types";


export async function createAccount(data: t.CreateAccount): Promise<DefaultApiResponse> {
  return await post({
    url: "/account", data 
  });
}

export async function fetchAccounts(search?: string): Promise<[t.AccountResponse]> {
    const response = await get({
        url: "/account/all", params: {"search": search}
      });

    return response.data
}

export async function getAccount(accountId: number): Promise<t.AccountResponse> {
  const response = await get({
    url: `/account/${accountId}`,
  });

  return response.data
}


export async function updateAccount( data: t.UpdateAccount): Promise<DefaultApiResponse> {
  return await put({
    url: `/account`, data
  });
}

export async function deleteAccount(accountId: number): Promise<DefaultApiResponse> {
  return await apiDelete({
    url: `/account/${accountId}`,
  });
}