import { get, post, put, apiDelete } from "@/services/methods";
import { DefaultApiResponse } from "@/services/types";
import * as t from "./types";


export async function createCategorie(data: t.CreateCategorie): Promise<DefaultApiResponse> {
  return await post({
    url: "/transaction-category", data 
  });
}

export async function fetchCategories(search?: string): Promise<[t.CategorieResponse]> {
  const response = await get({
        url: "/transaction-category/all", params: {"search": search}
      });

  return response.data
}

export async function getCategorie(categoriesId: number): Promise<t.CategorieResponse> {
  const response = await get({
    url: `/transaction-category/${categoriesId}`,
  });
  return response.data
}


export async function updateCategorie( data: t.UpdateCategorie): Promise<DefaultApiResponse> {
  return await put({
    url: `/transaction-category`, data
  });
}

export async function deleteCategorie(categoriesId: number): Promise<DefaultApiResponse> {
  return await apiDelete({
    url: `/transaction-category/${categoriesId}`,
  });
}