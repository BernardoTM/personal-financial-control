import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { z } from "zod";
import { MonthPickerInput } from "@/components/month-picker-input";
import { HedaerChildrenPage } from "@/components/header-children-page";

const budgetsSchema = z.object({
  date: z.date(),
});

type BudgetsSchema = z.infer<typeof budgetsSchema>;

export function InvestmentUpdate() {
  const { handleSubmit, control } = useForm<BudgetsSchema>({
    resolver: zodResolver(budgetsSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  function handleCreate({ date }: BudgetsSchema) {
    console.log(date);
  }

  return (
    <ScrollArea className="flex h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerChildrenPage
          pageName="Investimentos"
          childrenName="Editar investimento"
          url="/investment"
        />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <form onSubmit={handleSubmit(handleCreate)}>
            <Controller
              name="date"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <MonthPickerInput
                    currentMonth={value}
                    onMonthChange={onChange}
                  />
                );
              }}
            />
            <Button type="submit" variant="secondary">
              Filtrar resultados
            </Button>
          </form>
        </main>
      </div>
    </ScrollArea>
  );
}
