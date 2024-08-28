import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components";
import { Button } from "../ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

interface PaginationProps {
  total: number;
  currentItemsPerPage: number;
  currentPage: number;
  changePage: (page: number) => void;
  changeMaxItems: (max: number) => void;
  maxItemsPerPageOptions: number[];
  hiddenRowsPerPage?: boolean;
}

export function Pagination({
  total,
  maxItemsPerPageOptions,
  changePage,
  hiddenRowsPerPage,
  currentPage,
  currentItemsPerPage,
  changeMaxItems,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-2  w-full">
      <div className="w-full max-w-[100px]">
        <p className="text-sm">Total: {total}</p>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8 w-full justify-end">
        {!hiddenRowsPerPage && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{"Linhas por página"}</p>
            <Select
              value={String(currentItemsPerPage)}
              onValueChange={(value) => {
                changeMaxItems(Number(value));
                changePage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={"ola mundo"} />
              </SelectTrigger>
              <SelectContent side="top">
                {(maxItemsPerPageOptions || []).map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex max-w-[120px] w-full items-center justify-center text-sm font-medium">
          {"Págiana"} {currentPage} {"de"}{" "}
          {Math.ceil(total / currentItemsPerPage)}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => changePage(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= Math.ceil(total / currentItemsPerPage)}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => changePage(Math.ceil(total / currentItemsPerPage))}
            disabled={currentPage >= Math.ceil(total / currentItemsPerPage)}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
