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

import { Input } from "@/components/ui/input";

import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { HedaerChildrenPage } from "@/components/header-children-page";
import { createCategorie } from "@/services/https/categories";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const categorieFormSchama = z.object({
  name: z
    .string()
    .min(4, "O nome deve ter no mínimo 4 caracteres")
    .max(25, "O nome deve ter no máximo 25 caracteres"),
  description: z
    .string()
    .max(40, "A descrição deve ter no máximo 40 caracteres")
    .optional(),
  color: z.string().min(7).max(7),
});

type CategorieFormImputs = z.infer<typeof categorieFormSchama>;

export function CategorieCreate() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<CategorieFormImputs>({
    resolver: zodResolver(categorieFormSchama),
    defaultValues: {
      name: "",
      description: "",
      color: "#000000",
    },
  });

  const { mutateAsync: createCategorieFn } = useMutation({
    mutationFn: createCategorie,
  });
  async function handleCreateCategorie(data: CategorieFormImputs) {
    try {
      await createCategorieFn({
        name: data.name,
        description: data.description,
        color: data.color,
      });
      navigate("/categorie");
    } catch (error) {
      toast({
        title: "Erro ao criar categoria",
        description:
          "Não foi possível criar a categoria pois já existe um categoria com o mesmo nome.",
        variant: "destructive",
      });
    }
  }

  return (
    <ScrollArea className="flex h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerChildrenPage
          pageName="Categorias"
          childrenName="Nova categoria"
          url="/categorie"
        />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Crie uma nova categoria</CardTitle>
              <CardDescription>
                Com ela você poderá saber onde esta gastando seu dinheiro.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateCategorie)}
                className="space-y-8"
              >
                <CardContent className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Alimentação"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="description"
                              placeholder="Supermercado"
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
                        <FormItem className="w-40">
                          <FormLabel>Cor</FormLabel>
                          <FormControl>
                            <Input type="color" id="color" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex gap-4 justify-end">
                  <Button type="reset" onClick={() => form.reset()}>
                    Limpar
                  </Button>
                  <Button id="submit" type="submit">
                    Salvar
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </main>
      </div>
    </ScrollArea>
  );
}
