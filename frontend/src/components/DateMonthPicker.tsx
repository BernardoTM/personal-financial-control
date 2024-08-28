import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MonthPicker from "./ui/month-picker";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function DateMonthPicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = useState<Date>(new Date());
  const [searchParams, setSearchParams] = useSearchParams();

  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const handleDateChange = (date: Date) => {
    setDate(date);
    setSearchParams((prev) => {
      prev.set("month", String(date.getMonth()));
      prev.set("year", String(date.getFullYear()));

      return prev;
    });
  };

  useEffect(() => {
    if (month == null || year == null) {
      handleDateChange(new Date());
    }
  }, []);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[235px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {format(date, "MMMM/y", {
              locale: ptBR,
            })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <MonthPicker currentMonth={date} onMonthChange={handleDateChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
