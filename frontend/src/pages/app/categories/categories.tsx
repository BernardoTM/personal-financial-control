import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Plus, SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Link, useSearchParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useMutation, useQuery } from "@tanstack/react-query";
import { HedaerRootPage } from "@/components/header-root-page";
import { AlertDelete } from "@/components/alert-delete";
import { deleteCategorie, fetchCategories } from "@/services/https/categories";
import { CategorieResponse } from "@/services/https/categories/types";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/components/ui/use-toast";

export function Categories() {
  const [searchParams] = useSearchParams();

  const searchInput = searchParams.get("search") ?? undefined;

  const { data: categories } = useQuery({
    queryKey: ["categorie", searchInput],
    queryFn: () => fetchCategories(searchInput),
    // staleTime: Infinity,
  });

  const { mutateAsync: deleteCategorieFn } = useMutation({
    mutationFn: deleteCategorie,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<CategorieResponse[]>(
        ["categorie", searchInput],
        (oldData) => {
          return oldData?.filter((categorie) => categorie.id !== variables);
        }
      );
    },
    onError: () => {
      toast({
        title: "Erro ao deletar",
        description:
          "Não é possível deletar pois existem transações associadas",
        variant: "destructive",
      });
    },
  });
  async function handleDeleteCategorie(id: number) {
    await deleteCategorieFn(id);
  }

  return (
    <ScrollArea className="flex h-screen w-full bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerRootPage pageName="Categorias" />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <div className="flex items-center ml-auto">
            <Link to="create">
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Nova Categoria
                </span>
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap sm:gap-4 justify-center xl:justify-start">
            {categories?.map((categorie) => (
              <Card className="w-[340px]" key={categorie.id}>
                <CardHeader>
                  <div className="flex gap-4">
                    <div
                      style={{
                        backgroundColor: `${categorie.color}`,
                      }}
                      className={`h-8 w-8 rounded-full`}
                    ></div>
                    <div
                      className={`${
                        !categorie.description && "flex items-center"
                      }`}
                    >
                      <CardTitle>{categorie.name}</CardTitle>
                      <CardDescription>{categorie.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <AlertDelete
                    id={categorie.id}
                    message="essa categoria "
                    handleDelete={handleDeleteCategorie}
                  />
                  <Link to={`update/${categorie.id}`}>
                    <Button variant="secondary" size="icon">
                      <SquarePen className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </ScrollArea>
  );
}
