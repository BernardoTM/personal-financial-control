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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { ptBR } from "date-fns/locale";

import { HedaerChildrenPage } from "@/components/header-children-page";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAccounts } from "@/services/https/account";
import { fetchCategories } from "@/services/https/categories";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import {
  getTransaction,
  updateTransaction,
} from "@/services/https/transactions";
import { CalendarDays } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { normalizeMonetaryValue } from "@/utils/masks";

const transactionFormSchama = z.object({
  value: z.string().max(20),
  account_id: z.string(),
  transaction_category_id: z.string(),
  created_at: z.date(),
  description: z.string().max(30).optional(),
});

type TransactionFormImputs = z.infer<typeof transactionFormSchama>;

export function TransactionUpdate() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("expense");
  const { id } = useParams<{ id: string }>();

  if (!id) {
    navigate("transaction");
    return;
  }

  const transactioId = parseInt(id, 10);

  const { data: categories } = useQuery({
    queryKey: ["categorie"],
    queryFn: () => fetchCategories(),
  });

  const { data: accounts } = useQuery({
    queryKey: ["account"],
    queryFn: () => fetchAccounts(),
  });

  const { data: transaction } = useQuery({
    queryKey: ["categorie", transactioId],
    queryFn: () => getTransaction(transactioId),
  });

  const form = useForm<TransactionFormImputs>({
    resolver: zodResolver(transactionFormSchama),
    defaultValues: {
      value: normalizeMonetaryValue(String(transaction?.value)),
      account_id: String(transaction?.account_id),
      transaction_category_id: String(transaction?.transaction_category_id),
      created_at: new Date(),
      description: transaction?.description,
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        value: normalizeMonetaryValue(String(transaction.value)),
        account_id: String(transaction.account_id),
        transaction_category_id: String(transaction.transaction_category_id),
        created_at: new Date(transaction.created_at),
        description: transaction.description,
      });
      if (transaction.value > 0) {
        setTab("revenue");
      }
    }
  }, [transaction]);

  const { mutateAsync: updateTransactionFn } = useMutation({
    mutationFn: updateTransaction,
  });

  async function handleUpdateTransaction(data: TransactionFormImputs) {
    try {
      let currentValue = -parseInt(data.value.replace(/[,.]/g, ""), 10);
      if (tab != "expense") {
        currentValue = parseInt(data.value.replace(/[,.]/g, ""), 10);
      }
      await updateTransactionFn({
        id: transactioId,
        value: currentValue,
        account_id: Number(data.account_id),
        transaction_category_id: Number(data.transaction_category_id),
        created_at: data.created_at,
        description: data.description,
      });
      navigate("/transaction");
    } catch (error) {
      toast({
        title: "Erro ao editar conta",
        description:
          "Não foi possível editar a conta pois já existe um conta com o mesmo nome.",
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
          childrenName="Editar transação"
          url="/transaction"
        />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <Tabs defaultValue="expense" onValueChange={onTabChange} value={tab}>
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
                    onSubmit={form.handleSubmit(handleUpdateTransaction)}
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
                                type="text"
                                placeholder="Conta corrente"
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
                                        format(String(field.value), "PPP", {
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
                      <Button type="submit">Salvar</Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            <TabsContent value="expense">
              <Card x-chunk="dashboard-06-chunk-0" className="shadow-inner-red">
                <CardHeader>
                  <CardTitle>Crie uma nova despesas</CardTitle>
                  <CardDescription>
                    Saiba para onde o seu dinheiro esta indo
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleUpdateTransaction)}
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
                                type="text"
                                placeholder="Conta corrente"
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
                      <Button type="submit">Salvar</Button>
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
