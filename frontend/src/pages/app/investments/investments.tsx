import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateMonthPicker } from "@/components/DateMonthPicker";

import { HedaerRootPage } from "@/components/header-root-page";

export function Investments() {
  // const { data } = useQuery({
  //   queryKey: ["budgets", month, year],
  //  queryFn: teste,
  //});

  return (
    <ScrollArea className="flex h-screen w-full bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerRootPage pageName="Investimentos" />
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
        </main>
      </div>
    </ScrollArea>
  );
}
