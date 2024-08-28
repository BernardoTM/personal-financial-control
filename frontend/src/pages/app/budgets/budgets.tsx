import { Plus, SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link, useSearchParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateMonthPicker } from "@/components/DateMonthPicker";

import { useMutation, useQuery } from "@tanstack/react-query";
import { HedaerRootPage } from "@/components/header-root-page";
import { deleteBudget, fetchBudgets } from "@/services/https/budgets";
import { AlertDelete } from "@/components/alert-delete";
import { BudgetResponse } from "@/services/https/budgets/types";
import { queryClient } from "@/lib/react-query";
import { normalizeMonetaryValue } from "@/utils/masks";
import { Progress } from "@/components/ui/progress";

export function Budgets() {
  const [searchParams, _] = useSearchParams();

  const month = parseInt(
    searchParams.get("month") ?? new Date().getMonth().toString(),
    10
  );
  const year = parseInt(
    searchParams.get("year") ?? new Date().getFullYear().toString(),
    10
  );

  const searchInput = searchParams.get("search") ?? undefined;

  let startTime = new Date(year, month, 1, 0, 1, 0, 0);
  let finalTime = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const { data: budgets } = useQuery({
    queryKey: ["budgets", month, year, searchInput],
    queryFn: () =>
      fetchBudgets({
        start_time: startTime,
        final_time: finalTime,
        search: searchInput,
      }),
  });

  const { mutateAsync: deleteBudgetFn } = useMutation({
    mutationFn: deleteBudget,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<BudgetResponse[]>(
        ["budgets", month, year, searchInput],
        (oldData) => {
          return oldData?.filter((budget) => budget.id !== variables);
        }
      );
    },
  });
  async function handleDeleteBudget(id: number) {
    await deleteBudgetFn(id);
  }
  return (
    <ScrollArea className="flex h-screen w-full bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerRootPage pageName="Orçamentos" />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <div className="flex items-center justify-between">
            <DateMonthPicker />
            <Link to="create">
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Novo Orçamento
                </span>
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap sm:gap-4 justify-center xl:justify-start">
            {budgets?.map((budget) => {
              return (
                <Card className="w-[340px]" key={budget.id}>
                  <CardHeader>
                    <CardTitle>{budget.category_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <p>
                        {normalizeMonetaryValue(budget.amount_spent.toString())}
                      </p>
                      <p>{normalizeMonetaryValue(budget.value.toString())}</p>
                    </div>
                    <Progress
                      value={-budget.amount_spent / (budget.value / 100)}
                      className="w-full mt-2"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <AlertDelete
                      id={budget.id}
                      message="esse orçamento "
                      handleDelete={handleDeleteBudget}
                    />
                    <Link to={`update/${budget.id}`}>
                      <Button variant="secondary" size="icon">
                        <SquarePen className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </ScrollArea>
  );
}
