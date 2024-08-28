import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Input } from "@/components/ui/input";

import { useMutation, useQuery } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { HedaerChildrenPage } from "@/components/header-children-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays } from "lucide-react";
import { fetchCategories } from "@/services/https/categories";
import { fetchAccounts } from "@/services/https/account";
import { useEffect, useState } from "react";
import { normalizeMonetaryValue } from "@/utils/masks";
import { createTransaction } from "@/services/https/transactions";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const transactionFormSchama = z.object({
  value: z.string().max(20),
  account_id: z.coerce.number(),
  transaction_category_id: z.coerce.number(),
  created_at: z.date(),
  description: z.string().max(30).optional(),
});

type TransactionFormImputs = z.infer<typeof transactionFormSchama>;

export function TransactionCreate() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("expense");

  const form = useForm<TransactionFormImputs>({
    resolver: zodResolver(transactionFormSchama),
    defaultValues: {
      value: "0,00",
      created_at: new Date(),
      description: "",
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categorie"],
    queryFn: () => fetchCategories(),
  });

  const { data: accounts } = useQuery({
    queryKey: ["account"],
    queryFn: () => fetchAccounts(),
  });

  useEffect(() => {
    if (
      (accounts != undefined && accounts.length <= 0) ||
      (categories != undefined && categories.length <= 0)
    ) {
      navigate("/transaction/");
    }
    if (categories && accounts) {
      form.reset({
        account_id: accounts[0].id,
        transaction_category_id: categories[0].id,
      });
    }
  }, [categories, accounts]);

  const { mutateAsync: createTransactionFn } = useMutation({
    mutationFn: createTransaction,
  });

  async function handleCreateTransaction(data: TransactionFormImputs) {
    try {
      let currentValue = -parseInt(data.value.replace(/[,.]/g, ""), 10);
      if (tab != "expense") {
        currentValue = parseInt(data.value.replace(/[,.]/g, ""), 10);
      }
      await createTransactionFn({
        account_id: data.account_id,
        transaction_category_id: data.transaction_category_id,
        created_at: data.created_at,
        description: data.description,
        value: currentValue,
      });
      navigate("/transaction/");
    } catch (error) {
      toast({
        title: "Erro ao criar transação",
        description:
          "Não foi possível criar a conta pois já existe um conta com o mesmo nome.",
        variant: "destructive",
      });
    }
  }

  const onTabChange = (value: string) => {
    setTab(value);
  };
  return (
    <ScrollArea className="flex h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerChildrenPage
          pageName="Transaçãos"
          childrenName="Nova transação"
          url="/transaction"
        />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <Tabs defaultValue="expense" onValueChange={onTabChange}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="expense">Despesa</TabsTrigger>
                <TabsTrigger value="revenue">Receita</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="revenue">
              <Card
                x-chunk="dashboard-06-chunk-0"
                className=" shadow-inner-green"
              >
                <CardHeader>
                  <CardTitle>Crie uma nova receita</CardTitle>
                  <CardDescription>
                    Saiba de onde vem suas receitas
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCreateTransaction)}
                    className="space-y-8"
                  >
                    <CardContent className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor gasto</FormLabel>
                            <FormControl>
                              <Input
                                id="value"
                                type="text"
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
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input
                                id="description"
                                type="text"
                                placeholder="Salario"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-4">
                        <FormField
                          control={form.control}
                          name="created_at"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarDays className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, "PPP", {
                                          locale: ptBR,
                                        })
                                      ) : (
                                        <span>Escolha uma data</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
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
                        <FormField
                          name="account_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Selecione a conta" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Conta</SelectLabel>
                                      {accounts?.map((account) => (
                                        <SelectItem
                                          className="cursor-pointer"
                                          key={account.id}
                                          value={String(account.id)}
                                        >
                                          {account.name}
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
            </TabsContent>
            <TabsContent value="expense">
              <Card x-chunk="dashboard-06-chunk-0" className="shadow-inner-red">
                <CardHeader>
                  <CardTitle>Crie uma nova despesa</CardTitle>
                  <CardDescription>
                    Saiba para onde o seu dinheiro esta indo
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCreateTransaction)}
                    className="space-y-8"
                  >
                    <CardContent className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor gasto</FormLabel>
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
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input
                                id="description"
                                type="text"
                                placeholder="Supermercado"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-4">
                        <FormField
                          control={form.control}
                          name="created_at"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarDays className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, "PPP", {
                                          locale: ptBR,
                                        })
                                      ) : (
                                        <span>Escolha uma data</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
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
                        <FormField
                          name="account_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Selecione a conta" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Conta</SelectLabel>
                                      {accounts?.map((account) => (
                                        <SelectItem
                                          className="cursor-pointer"
                                          key={account.id}
                                          value={String(account.id)}
                                        >
                                          {account.name}
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ScrollArea>
  );
}
