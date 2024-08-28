import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useMutation, useQuery } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { HedaerChildrenPage } from "@/components/header-children-page";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getCategorie, updateCategorie } from "@/services/https/categories";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const categorieFormSchama = z.object({
  name: z.string().min(4).max(25),
  description: z.string().max(30).optional(),
  color: z.string().min(7).max(7),
});

type CategorieFormImputs = z.infer<typeof categorieFormSchama>;

export function CategorieUpdate() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) {
    navigate("categorie");
    return;
  }

  const categorieId = parseInt(id, 10);

  const { data: categorie } = useQuery({
    queryKey: ["categorie", categorieId],
    queryFn: () => getCategorie(categorieId),
  });

  const form = useForm<CategorieFormImputs>({
    resolver: zodResolver(categorieFormSchama),
    defaultValues: {
      name: categorie?.name || "",
      description: categorie?.description || "",
      color: categorie?.color || "#000000",
    },
  });

  useEffect(() => {
    if (categorie) {
      form.reset({
        name: categorie.name || "",
        description: categorie.description || "",
        color: categorie.color || "#000000",
      });
    }
  }, [categorie]);

  const { mutateAsync: updateCategorieFn } = useMutation({
    mutationFn: updateCategorie,
  });

  async function handleUpdateCategorie(data: CategorieFormImputs) {
    try {
      await updateCategorieFn({
        id: categorieId,
        name: data.name,
        description: data.description,
        color: data.color,
      });
      navigate("/categorie");
    } catch (error) {
      toast({
        title: "Erro ao editar conta",
        description:
          "Não foi possível editar a conta pois já existe um conta com o mesmo nome.",
        variant: "destructive",
      });
    }
  }
  return (
    <ScrollArea className="flex h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerChildrenPage
          pageName="Categorias"
          childrenName="Editar categoria"
          url="/categorie"
        />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Edite essa categoria</CardTitle>
              <CardDescription>
                Com ela você poderá saber onde esta gastando seu dinheiro.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateCategorie)}
                className="space-y-8"
              >
                <CardContent className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    defaultValue={categorie?.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Banco Inter" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    defaultValue={categorie?.description}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Conta corrente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex gap-4 justify-end">
                  <Button type="reset" onClick={() => form.reset()}>
                    Limpar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </main>
      </div>
    </ScrollArea>
  );
}
