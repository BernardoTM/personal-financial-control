import colors from "tailwindcss/colors";

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchConsoCategorys } from "@/services/https/dashbord";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { normalizeMonetaryValue } from "@/utils/masks";

const COLORS = [
  colors.sky["500"],
  colors.amber["500"],
  colors.violet["500"],
  colors.emerald["500"],
  colors.rose["500"],
];

export function SpendingByCategoryChart() {
  const [searchParams] = useSearchParams();

  const month = parseInt(
    searchParams.get("month") ?? new Date().getMonth().toString(),
    10
  );
  const year = parseInt(
    searchParams.get("year") ?? new Date().getFullYear().toString(),
    10
  );

  let startTime = new Date(year, month, 1, 0, 1, 0, 0);
  let finalTime = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const { data: consoCategorys } = useQuery({
    queryKey: ["consoCategorys", month, year],
    queryFn: () =>
      fetchConsoCategorys({
        start_time: startTime,
        final_time: finalTime,
      }),
  });
  const totalAmount = consoCategorys?.reduce(
    (acc, item) => acc + item.expenses,
    0
  );

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Gastos por categorias</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart style={{ fontSize: 12 }}>
            {consoCategorys ? (
              <Pie
                data={consoCategorys}
                dataKey="expenses"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={84}
                innerRadius={64}
                strokeWidth={8}
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 12 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      className="fill-muted-foreground text-xs"
                      textAnchor={x > cx ? "start" : "end"}
                    >
                      {consoCategorys[index].name.length > 12
                        ? consoCategorys[index].name
                            .substring(0, 12)
                            .concat("...")
                        : consoCategorys[index].name.concat(" ")}
                      ({normalizeMonetaryValue(value.toString())})
                    </text>
                  );
                }}
              >
                {consoCategorys.map((_, index) => {
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                      className="stroke-background hover:opacity-80"
                    />
                  );
                })}
              </Pie>
            ) : (
              ""
            )}

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground text-lg font-semibold"
            >
              {normalizeMonetaryValue(totalAmount?.toString())}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
