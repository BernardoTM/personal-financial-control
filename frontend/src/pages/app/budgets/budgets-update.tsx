import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { HedaerChildrenPage } from "@/components/header-children-page";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { normalizeMonetaryValue } from "@/utils/masks";
import { getBudget, updateBudget } from "@/services/https/budgets";
import { MonthPickerInput } from "@/components/month-picker-input";
import { fetchCategories } from "@/services/https/categories";

const budgetFormSchama = z.object({
  value: z.string().max(20),
  transaction_category_id: z.string().max(20),
  start_at: z.date(),
  // duration_in_months: number().default(1)
});

type BudgetFormImputs = z.infer<typeof budgetFormSchama>;

export function BudgetUpdate() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) {
    navigate("/budget");
    return;
  }

  const budgetId = parseInt(id, 10);

  const { data: budget } = useQuery({
    queryKey: ["budget", budgetId],
    queryFn: () => getBudget(budgetId),
  });

  const { data: categories } = useQuery({
    queryKey: ["categorie"],
    queryFn: () => fetchCategories(),
  });

  const form = useForm<BudgetFormImputs>({
    resolver: zodResolver(budgetFormSchama),
    defaultValues: {
      value: "0",
      start_at: new Date(),
      transaction_category_id: "",
    },
  });

  useEffect(() => {
    if (budget) {
      console.log(budget.transaction_category_id);
      form.reset({
        value: normalizeMonetaryValue(String(budget.value)),
        transaction_category_id: String(budget.transaction_category_id),
        start_at: new Date(budget.start_at + "T00:00:01"),
      });
    }
  }, [budget]);

  const { mutateAsync: updateBudgetFn } = useMutation({
    mutationFn: updateBudget,
  });

  async function handleUpdateBudget(data: BudgetFormImputs) {
    try {
      await updateBudgetFn({
        id: budgetId,
        transaction_category_id: Number(data.transaction_category_id),
        start_at: data.start_at,
        value: parseInt(data.value.replace(/[,.]/g, ""), 10),
      });
      navigate("/budget");
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
          pageName="Orçamento"
          childrenName="Editar orçamento"
          url="/budget"
        />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Editar orçamento</CardTitle>
              <CardDescription>
                Com ele você poderá planejar onde vai gastar o seu dinheiro.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateBudget)}
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
                                  <SelectLabel>Categorias</SelectLabel>
                                  {categories?.map((categorie) => (
                                    <SelectItem
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
