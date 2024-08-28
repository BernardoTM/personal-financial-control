import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components";
import { Pagination } from "@/components/Pagination";
import { DataTableFacetedFilter } from "@/components/DataTableFacetedFilters";
import { transformToArray } from "@/utils/transformToArray";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { useFilter } from "@/hooks/useFilter";

export function Goals() {
  const totalJobs = 20;
  const jobs = [
    {
      id: 1,
      nome: "joao",
      type: "bla",
      namespace: "sdds",
      teste: "bora",
    },
    {
      id: 2,
      nome: "joao",
      type: "bla",
      namespace: "sdds",
      teste: "bora",
    },
  ];
  const { handleFilter, searchParams, changeItemsPerPage, changePage } =
    useFilter();

  const filters = {
    namespace: [
      { type: "oii", name: "oii" },
      { type: "oii2", name: "oii2" },
      { type: "oii3", name: "oii3" },
    ],
    containersImage: [{ type: "oii", name: "oiii" }],
  };

  return (
    <>
      <div className="flex flex-col flex-1 w-full gap-4 relative  rounded-md">
        <div className="flex justify-end items-center gap-4  w-full">
          <DataTableFacetedFilter
            addFilter={(value) =>
              handleFilter({ name: "namespace", value, page: "job" })
            }
            removeFilter={(value) =>
              handleFilter({ name: "namespace", value, page: "job" })
            }
            selectedFilters={transformToArray(
              (searchParams.get("namespace") || "") as string
            )}
            title="Namespace"
            options={(filters.namespace || []).map((type) => {
              return {
                value: type.name,
                label: type.name,
              };
            })}
          />
          <DataTableFacetedFilter
            addFilter={(value) =>
              handleFilter({ name: "containersImage", value, page: "job" })
            }
            removeFilter={(value) =>
              handleFilter({ name: "containersImage", value, page: "job" })
            }
            selectedFilters={transformToArray(
              (searchParams.get("containersImage") || "") as string
            )}
            title="Image"
            options={(filters.containersImage || []).map((type) => {
              return {
                value: type.name,
                label: type.name,
              };
            })}
          />
        </div>
        <div className="w-full flex flex-col gap-4 h-full">
          <Card className="h-full p-0 max-h-[calc(100vh-270px)] overflow-auto">
            <CardContent className="p-0 flex flex-col w-full">
              <Table className="min-w-[1250px]">
                <TableHeader className="sticky top-0 py-0 px-3  z-[2] w-full bg-card">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[25%]">Descrição</TableHead>
                    <TableHead className="w-[15%]">Conta</TableHead>
                    <TableHead className="w-[15%]">Categoria</TableHead>
                    <TableHead className="w-[15%]">
                      <DataTableColumnHeader
                        title="Data"
                        value="creationTimestampOrder"
                      />
                    </TableHead>
                    <TableHead className="w-[15%]">Deletar</TableHead>
                    <TableHead className="w-[15%]">Editar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => {
                    return (
                      <TableRow key={job.id}>
                        <TableCell>{job?.nome || ""}</TableCell>
                        <TableCell>{job?.namespace || ""}</TableCell>
                        <TableCell>{job?.teste || ""}</TableCell>

                        {/* <TableCell>
                          {job?.type &&
                            formatDistance(
                              new Date(job.metadata.creationTimestamp.$date),
                              new Date(),
                              {
                                addSuffix: true,
                              }
                            )}
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Pagination
            changeMaxItems={changeItemsPerPage}
            currentItemsPerPage={15}
            changePage={changePage}
            maxItemsPerPageOptions={[15, 30, 45]}
            currentPage={1}
            total={totalJobs}
          />
        </div>
      </div>
    </>
  );
}
