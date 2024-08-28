import { Plus, SquarePen } from "lucide-react";

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ScrollArea,
  Button,
} from "@/lib/components";

import { Pagination } from "@/components/Pagination";

import { DataTableFacetedFilter } from "@/components/DataTableFacetedFilters";
import { transformToArray } from "@/utils/transformToArray";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { useFilter } from "@/hooks/useFilter";

import { Link } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { HedaerRootPage } from "@/components/header-root-page";
import { AlertDelete } from "@/components/alert-delete";

import { fetchCategories } from "@/services/https/categories";
import { fetchAccounts } from "@/services/https/account";

import { normalizeMonetaryValue } from "@/utils/masks";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  deleteTransaction,
  fetchTransactions,
} from "@/services/https/transactions";
import DatePickerWithRange from "@/components/date-picker-with-range";
import { queryClient } from "@/lib/react-query";
import { subDays, addDays } from "date-fns";

import { toast } from "@/components/ui/use-toast";

export function Transactions() {
  const { handleFilter, searchParams, changeItemsPerPage, changePage } =
    useFilter();

  const { data: categoriesFilters } = useQuery({
    queryKey: ["categorie"],
    queryFn: () => fetchCategories(),
  });

  const { data: accountsFilters } = useQuery({
    queryKey: ["account"],
    queryFn: () => fetchAccounts(),
  });

  const filters = {
    categories: categoriesFilters?.map((item) => ({
      id: String(item.id),
      name: item.name,
    })),
    accounts: accountsFilters?.map((item) => ({
      id: String(item.id),
      name: item.name,
    })),
  };

  const searchInput = searchParams.get("search") ?? undefined;
  const startParam = searchParams.get("start");
  const finalParam = searchParams.get("finish");
  const page = searchParams.get("page") ?? 1;
  const limit = searchParams.get("limit") ?? 10;
  const order = searchParams.get("order") ?? "asc";
  const categories = searchParams.get("categories") ?? undefined;
  const accounts = searchParams.get("accounts") ?? undefined;

  let start_time = startParam ? new Date(startParam) : subDays(new Date(), 30);
  let final_time = finalParam
    ? addDays(new Date(finalParam), 1)
    : addDays(new Date(), 1);

  const categoriesParam = categories ? categories.split(",") : undefined;
  const accountsParam = accounts ? accounts.split(",") : undefined;

  const { data } = useQuery({
    queryKey: [
      "transaction",
      searchInput,
      startParam,
      finalParam,
      page,
      order,
      categories,
      accounts,
    ],
    queryFn: () =>
      fetchTransactions({
        page: Number(page),
        limit: Number(limit),
        start_time: start_time,
        final_time: final_time,
        order: order,
        account_id: accountsParam,
        transaction_category_id: categoriesParam,
      }),
    // staleTime: Infinity,
  });

  const { mutateAsync: deleteTransactionFn } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "transaction",
          searchInput,
          startParam,
          finalParam,
          page,
          order,
          categories,
          accounts,
        ],
      });
    },
  });

  async function handleDeleteTransaction(id: number) {
    await deleteTransactionFn(id);
  }

  return (
    <ScrollArea className="flex h-screen w-full bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerRootPage pageName="Transaçãos" />
        <main className="flex flex-1 flex-col gap-4 ">
          <div className="flex items-center justify-between">
            <div className="flex  items-center gap-4  w-full">
              <DatePickerWithRange />
              <DataTableFacetedFilter
                addFilter={(value) =>
                  handleFilter({
                    name: "categories",
                    value,
                    page: "transaction",
                  })
                }
                removeFilter={(value) =>
                  handleFilter({
                    name: "categories",
                    value,
                    page: "transaction",
                  })
                }
                selectedFilters={transformToArray(
                  (searchParams.get("categories") || "") as string
                )}
                title="Categoria"
                options={(filters.categories || []).map((categorie) => {
                  return {
                    value: categorie.id,
                    label: categorie.name,
                  };
                })}
              />
              <DataTableFacetedFilter
                addFilter={(value) =>
                  handleFilter({
                    name: "accounts",
                    value,
                    page: "transaction",
                  })
                }
                removeFilter={(value) =>
                  handleFilter({
                    name: "accounts",
                    value,
                    page: "transaction",
                  })
                }
                selectedFilters={transformToArray(
                  (searchParams.get("accounts") || "") as string
                )}
                title="Conta"
                options={(filters.accounts || []).map((account) => {
                  return {
                    value: account.id,
                    label: account.name,
                  };
                })}
              />
            </div>

            <Link
              to={
                accountsFilters &&
                accountsFilters.length > 0 &&
                categoriesFilters &&
                categoriesFilters.length > 0
                  ? "create"
                  : "#"
              }
              onClick={(e) => {
                if (!accountsFilters?.length || !categoriesFilters?.length) {
                  e.preventDefault(); // Impede a navegação
                  toast({
                    title: "Ops",
                    description:
                      "Antes de adicionar uma transação você precisa de pelo menos uma contas e uma categorias",
                    variant: "default",
                  });
                }
              }}
            >
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Nova Transação
                </span>
              </Button>
            </Link>
          </div>
          <div className="flex flex-col flex-1 w-full gap-4 rounded-md">
            <div className="w-full flex flex-col gap-4 h-full">
              <Card>
                <CardContent className="p-0 flex flex-col w-full">
                  <Table className="min-w-[960px]">
                    <ScrollArea className="p-0 h-[calc(100vh-210px)] rounded-md w-full">
                      <TableHeader className="sticky top-0 py-0 px-3 z-[2] w-full bg-card">
                        <TableRow className="hover:bg-transparent ">
                          <TableHead className="w-[20%]">Descrição</TableHead>
                          <TableHead className="w-[12%]">Categoria</TableHead>
                          <TableHead className="w-[12%]">Conta</TableHead>
                          <TableHead className="w-[10%]">Tipo</TableHead>
                          <TableHead className="w-[10%]">Valor</TableHead>
                          <TableHead className="w-[16%]">
                            <DataTableColumnHeader title="Data" value="Order" />
                          </TableHead>
                          <TableHead className="w-[10%]">Deletar</TableHead>
                          <TableHead className="w-[10%]">Editar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.transactions.map((transaction) => {
                          return (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.category_name}</TableCell>
                              <TableCell>{transaction.account_name}</TableCell>
                              <TableCell
                                className={
                                  transaction.value > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {transaction.value > 0 ? "Entrada" : "Saida"}
                              </TableCell>
                              <TableCell
                                className={
                                  transaction.value > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {normalizeMonetaryValue(
                                  transaction.value.toString()
                                )}
                              </TableCell>
                              <TableCell className=" md:table-cell">
                                {format(
                                  transaction.created_at.toString(),
                                  "PPP",
                                  {
                                    locale: ptBR,
                                  }
                                )}
                              </TableCell>
                              <TableCell>
                                <AlertDelete
                                  id={transaction.id}
                                  message="essa transação "
                                  handleDelete={handleDeleteTransaction}
                                />
                              </TableCell>
                              <TableCell>
                                <Link to={`update/${transaction.id}`}>
                                  <Button variant="secondary" size="sm">
                                    <SquarePen className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </ScrollArea>
                  </Table>
                </CardContent>
              </Card>

              <Pagination
                changeMaxItems={changeItemsPerPage}
                currentItemsPerPage={Number(limit)}
                changePage={changePage}
                maxItemsPerPageOptions={[10, 15, 30, 45]}
                currentPage={Number(page)}
                total={data?.total ?? 0}
              />
            </div>
          </div>
        </main>
      </div>
    </ScrollArea>
  );
}
