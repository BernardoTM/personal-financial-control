import { get, post } from "@/services/methods";
import * as t from "./types";
import { DefaultApiResponse } from "@/services/types";

export async function getUser(): Promise<DefaultApiResponse> {
  return await get({
    url: "/user",
  });
}

export async function createUser(data: t.CreateUser): Promise<DefaultApiResponse> {
  return await post({
    url: "/user", data 
  });
}

