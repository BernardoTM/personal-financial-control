import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { fetchConsoTransacions } from "@/services/https/dashbord";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { normalizeMonetaryValue } from "@/utils/masks";
export function TotalExpenseCard() {
  const [searchParams] = useSearchParams();

  const month = parseInt(
    searchParams.get("month") ?? new Date().getMonth().toString(),
    10
  );
  const year = parseInt(
    searchParams.get("year") ?? new Date().getFullYear().toString(),
    10
  );

  let startTime = new Date(year, month, 1, 0, 0, 0, 0);
  let finalTime = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const { data: consoTransacions } = useQuery({
    queryKey: ["consoTransacions", month, year],
    queryFn: () =>
      fetchConsoTransacions({
        start_time: startTime,
        final_time: finalTime,
      }),
  });

  return (
    <Card x-chunk="dashboard-01-chunk-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
        <TrendingDown className="h-5 w-5 text-muted-foreground text-rose-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          R$ -
          {normalizeMonetaryValue(
            consoTransacions?.expenses
              ? consoTransacions.expenses.toString()
              : "0"
          )}
        </div>
        {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
      </CardContent>
    </Card>
  );
}
