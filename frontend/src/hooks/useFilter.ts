import { useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";


export function useFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { clusterId } = useParams();

  const changeItemsPerPage = useCallback(
    (itemsPerPage: number) => {
      searchParams.set("limit", String(itemsPerPage));
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  const changePage = useCallback(
    (page: number) => {
      searchParams.set("page", String(page));
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  const changeSearchParams = useCallback(
    ({ name, type }: { name: string; type: string }) => {
      searchParams.set(type, name);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  const handleFilter = useCallback(
    ({
      value,
      name,
      page,
    }: {
      page: string | undefined;
      value: string;
      name: string;
    }) => {
      const currentFilters = JSON.parse(
        localStorage.getItem(`gitaFilters-${clusterId}`) || "{}",
      );
      if (value === "removeall") {
        searchParams.delete(name);

        if (clusterId && page) {
          localStorage.setItem(
            `gitaFilters-${clusterId}`,
            JSON.stringify({
              ...currentFilters,
              [page]: `?${searchParams}`,
            }),
          );
        }
        return setSearchParams(searchParams);
      }
      const search = searchParams.get(name);

      if (search) {
        const parseSearch: string[] = search.split(",");

        const find = parseSearch.find((t: string) => t === value);

        if (find) {
          const filter = parseSearch.filter((t: string) => t !== value);
          if (filter.length === 0) {
            searchParams.delete(name);
          } else {
            searchParams.set(name, filter.join(","));
          }
        } else {
          searchParams.set(name, `${search},${value}`);
        }
      } else {
        searchParams.set(name, value);
      }

      if (clusterId && name !== "search" && page) {
        localStorage.setItem(
          `gitaFilters-${clusterId}`,
          JSON.stringify({
            ...currentFilters,
            [page]: `?${searchParams}`,
          }),
        );
      }

      setSearchParams(searchParams);
    },
    [clusterId, searchParams, setSearchParams],
  );

  const onChangeSearchValue = useCallback(
    (value: string) => {
      searchParams.set("search", value);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  return {
    changeItemsPerPage,
    searchParams,
    onChangeSearchValue,
    changePage,
    changeSearchParams,
    handleFilter,
  };
}
