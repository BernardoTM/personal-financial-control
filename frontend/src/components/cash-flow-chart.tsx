import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import colors from "tailwindcss/colors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchConsoTransacionsMonth } from "@/services/https/dashbord";

export function CashFlowChart() {
  const { data } = useQuery({
    queryKey: ["consoTransacionsMonth"],
    queryFn: () => fetchConsoTransacionsMonth(),
  });
  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Fluxo de caixa</CardTitle>
          <CardDescription>
            Despesas e receitas dos últimos 12 meses
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} className="stroke-muted" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar name="Despesas" dataKey="expenses" fill={colors.rose["700"]} />
            <Bar name="Receitas" dataKey="income" fill={colors.green["700"]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
