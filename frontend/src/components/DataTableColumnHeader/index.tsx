/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components";
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

interface DataTableColumnHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value?: string;
}

export function DataTableColumnHeader({
  value,
  title,
  className,
}: DataTableColumnHeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleHeader = useCallback(
    (newOrder: string) => {
      if (value) {
        searchParams.set("order", newOrder);
        setSearchParams(searchParams);
      }
    },
    [searchParams, setSearchParams, value]
  );

  if (!value) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent !bg-transparent"
          >
            <span className="!text-[14px]">{title}</span>
            {value && searchParams.get("order") === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : value && searchParams.get("order") === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleHeader("asc")}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleHeader("desc")}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
