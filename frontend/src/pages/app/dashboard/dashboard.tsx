import { ScrollArea } from "@/components/ui/scroll-area";
import { CashFlowChart } from "@/components/cash-flow-chart";
import { TotalExpenseCard } from "./total-expense-card";
import { TotalRevenueCard } from "./total-revenue-card";
import { TotalBalanceCard } from "./total-balance-card";
import { TotalBudgetCard } from "./total-budget-card";
import { BudgetCard } from "./budget-card";
import { HedaerRootPage } from "@/components/header-root-page";
import { SpendingByCategoryChart } from "./spending-by-category-chart";
import { DateMonthPicker } from "@/components/DateMonthPicker";

export function Dashboard() {
  return (
    <ScrollArea className="flex h-screen w-full bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8">
        <HedaerRootPage pageName="Dashboard" />

        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <DateMonthPicker />
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <TotalExpenseCard />
            <TotalRevenueCard />
            <TotalBalanceCard />
            <TotalBudgetCard />
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <BudgetCard />
            <SpendingByCategoryChart />
          </div>
          <div className="grid">
            <CashFlowChart />
          </div>
        </main>
      </div>
    </ScrollArea>
  );
}
