import {  post } from "@/services/methods";
import { DefaultApiResponse } from "@/services/types";
import * as t from "./types";
import api from "@/services/api";
import Cookies from "js-cookie";


export async function postAuthLogin(
  {email,password}: t.AuthLoginData,
): Promise<t.AuthLoginResponse> {
  return post({ url: "/auth/login", data: {email, password} });
}

export async function refreshToken(): Promise<DefaultApiResponse> {
  return api
    .get("/auth/refresh", {
      headers: {
        Authorization: JSON.parse(Cookies.get("refreshToken") || "{}")
          ?.authorization,
      },
    })
    .then((result) => {
      return { data: result.data, status: result.status } as any;
    })
    .catch((error) => {
      // throw error;
      // throw new Error(error);
      return {
        data: error?.response?.data,
        status: error?.response?.status || error?.status || 500,
      } as any;
    });
}


