import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useMutation, useQuery } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { HedaerChildrenPage } from "@/components/header-children-page";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { normalizeMonetaryValue } from "@/utils/masks";
import { createBudget } from "@/services/https/budgets";
import { fetchCategories } from "@/services/https/categories";
import { MonthPickerInput } from "@/components/month-picker-input";

const budgetFormSchama = z.object({
  value: z.string().max(20).default("0"),
  transaction_category_id: z.coerce.number(),
  start_at: z.date(),
  // duration_in_months: number().default(1)
});

type BudgetFormImputs = z.infer<typeof budgetFormSchama>;

export function BudgetCreate() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<BudgetFormImputs>({
    resolver: zodResolver(budgetFormSchama),
    defaultValues: {
      value: "0,00",
      start_at: new Date(),
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categorie"],
    queryFn: () => fetchCategories(),
  });

  useEffect(() => {
    if (categories != undefined && categories.length <= 0) {
      navigate("/budget");
    }
    if (categories) {
      form.reset({
        transaction_category_id: categories[0].id,
      });
    }
  }, [categories]);

  const { mutateAsync: createBudgetFn } = useMutation({
    mutationFn: createBudget,
  });
  async function handleCreateBudget(data: BudgetFormImputs) {
    try {
      await createBudgetFn({
        transaction_category_id: data.transaction_category_id,
        start_at: new Date(
          data.start_at.getFullYear(),
          data.start_at.getMonth(),
          1
        ),
        value: parseInt(data.value.replace(/[,.]/g, ""), 10),
        duration_in_months: 1,
      });
      navigate("/budget");
    } catch (error) {
      toast({
        title: "Erro ao criar orçamento",
        description:
          "Não foi possível criar a orçamento pois já existe um orçamento para essa categoria.",
        variant: "destructive",
      });
    }
  }

  return (
    <ScrollArea className="flex h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerChildrenPage
          pageName="Orçamento"
          childrenName="Novo orçamento"
          url="/budget"
        />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Crie um novo orçamento</CardTitle>
              <CardDescription>
                Com ele você poderá planejar onde vai gastar o seu dinheiro.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateBudget)}
                className="space-y-8"
              >
                <CardContent className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor do orçamento</FormLabel>
                        <FormControl>
                          <Input
                            id="value"
                            type="text"
                            defaultValue={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                normalizeMonetaryValue(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="start_at"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <MonthPickerInput
                              currentMonth={field.value}
                              onMonthChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="transaction_category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel id="categories">
                                    Categorias
                                  </SelectLabel>
                                  {categories?.map((categorie) => (
                                    <SelectItem
                                      className="cursor-pointer"
                                      key={categorie.id}
                                      value={String(categorie.id)}
                                    >
                                      {categorie.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
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
