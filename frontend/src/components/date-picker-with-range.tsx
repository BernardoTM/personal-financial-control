import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";

function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [_, setSearchParams] = useSearchParams();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // React.useEffect(() => {
  //   setSearchParams((prev) => {
  //     prev.set(
  //       "start",
  //       date?.from ? date?.from.toISOString().split("T")[0] : ""
  //     );
  //     prev.set("finish", date?.to ? date?.to.toISOString().split("T")[0] : "");
  //     return prev;
  //   });
  // }, [date]);

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
    setSearchParams((prev) => {
      prev.set(
        "start",
        date?.from ? date?.from.toISOString().split("T")[0] : ""
      );
      prev.set("finish", date?.to ? date?.to.toISOString().split("T")[0] : "");
      return prev;
    });
  };

  // React.useEffect(() => {
  //   if (start == null || finish == null) {
  //     handleDateChange({
  //       from: addDays(new Date(), -30),
  //       to: new Date(),
  //     });
  //   }
  // }, []);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarDays
              className="mr-2 h-4 w-4"
              onChange={(e) => {
                console.log(e);
                console.log("testeeeeeee");
              }}
            />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/LL , y")} -{" "}
                  {format(date.to, "dd/LL , y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            onDayClick={() => {
              setSearchParams((prev) => {
                prev.set(
                  "start",
                  date?.from ? date?.from.toISOString().split("T")[0] : ""
                );
                prev.set(
                  "finish",
                  date?.to ? date?.to.toISOString().split("T")[0] : ""
                );
                return prev;
              });
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePickerWithRange;
