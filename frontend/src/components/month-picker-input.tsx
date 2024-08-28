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

interface MonthPickerInputProps {
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
}

export function MonthPickerInput({
  currentMonth,
  onMonthChange,
}: MonthPickerInputProps) {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[235px] justify-start text-left font-normal",
              !currentMonth && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {format(currentMonth, "MMM/y", {
              locale: ptBR,
            })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <MonthPicker
            currentMonth={currentMonth}
            onMonthChange={onMonthChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
