import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/lib/components";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

interface DataTableFacetedFilterProps {
  title?: string;
  selectedFilters: string[];
  addFilter: (value: string) => void;
  removeFilter: (value: string) => void;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableFacetedFilter({
  title,
  options,
  selectedFilters,
  removeFilter,
  addFilter,
}: DataTableFacetedFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10  border-solid">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title || ""}
          {selectedFilters?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedFilters.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedFilters.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedFilters.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      selectedFilters.some(
                        (t) => String(t) === String(option.value)
                      )
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="pb-6">
              {options.map((option) => {
                const isSelected = selectedFilters.some(
                  (t) => String(t) === String(option.value)
                );
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        removeFilter(String(option.value));
                      } else {
                        addFilter(option.value);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedFilters.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup className="relative">
                  <CommandItem
                    onSelect={() => removeFilter("removeall")}
                    className="fixed  bottom-0 bg-card w-full justify-center text-center left-0"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
