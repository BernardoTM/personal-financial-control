import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type TablePaginationProps = {
  totalItems: number;
  limit: number;
};

const TablePagination = ({ totalItems, limit }: TablePaginationProps) => {
  const totalPage = Math.ceil(totalItems / limit);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const [pages, setPages] = useState<number[]>([page]);

  useEffect(() => {
    if (totalPage <= 1) {
      setPages([1]);
    } else if (totalPage === 2) {
      setPages([1, 2]);
    } else if (totalPage >= 3) {
      setPages([1, 2, 3]);
    }
  }, []);
  console.log(pages);

  // useEffect(() => {
  //   setSearchParams((prev) => {
  //     prev.set("page", "1");
  //     return prev;
  //   });
  // }, [totalPage]);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              page === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"
            }
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("page", String(page - 1));
                return prev;
              });
              if (totalPage > 3 && page > 2) {
                setPages([page - 2, page - 1, page]);
              }
            }}
          />
        </PaginationItem>
        {page >= 4 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : (
          <></>
        )}
        {pages.map((index) => (
          <PaginationItem key={index}>
            <PaginationLink isActive={page === index} onClick={() => {}}>
              {index}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page <= totalPage - 2 && totalPage >= 4 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : (
          <></>
        )}
        <PaginationItem>
          <PaginationNext
            className={
              totalPage <= page
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("page", String(page + 1));
                return prev;
              });
              if (totalPage > 3 && page > 1 && page < totalPage - 1) {
                setPages([page, page + 1, page + 2]);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default TablePagination;
