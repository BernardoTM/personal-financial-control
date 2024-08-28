import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchBudgets } from "@/services/https/budgets";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

export function BudgetCard() {
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
  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <CardTitle>
          <Link to={`budget?month=7&year=2024`}>Orçamentos</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full">
          <div className="flex flex-col gap-8 mr-3">
            {budgets?.map((budget) => {
              return (
                <div>
                  <div className="flex justify-between" key={budget.id}>
                    <p className="text-sm font-medium leading-none">
                      {budget.category_name}
                    </p>
                    <p className="text-sm font-medium leading-none">
                      {(-budget.amount_spent / (budget.value / 100)).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div>
                    <Progress
                      value={-budget.amount_spent / (budget.value / 100)}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
