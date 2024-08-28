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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { HedaerChildrenPage } from "@/components/header-children-page";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getAccount, updateAccount } from "@/services/https/account";
import { useEffect } from "react";
import { normalizeMonetaryValue } from "@/utils/masks";

const accountFormSchama = z.object({
  name: z.string().min(4).max(25),
  description: z.string().max(30).optional(),
  opening_balance: z.string().max(20),
});

type AccountFormImputs = z.infer<typeof accountFormSchama>;

export function AccountUpdate() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) {
    navigate("/account");
    return;
  }

  const accountId = parseInt(id, 10);

  const { data: account } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () => getAccount(accountId),
  });

  const form = useForm<AccountFormImputs>({
    resolver: zodResolver(accountFormSchama),
    defaultValues: {
      name: account?.name || "",
      description: account?.description || "",
      opening_balance: account?.opening_balance.toString() || "0,00",
    },
  });

  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        description: account.description,
        opening_balance: normalizeMonetaryValue(
          String(account.opening_balance)
        ),
      });
    }
  }, [account]);

  const { mutateAsync: updateAccountFn } = useMutation({
    mutationFn: updateAccount,
  });

  async function handleUpdateAccount(data: AccountFormImputs) {
    try {
      await updateAccountFn({
        id: accountId,
        name: data.name,
        description: data.description,
        opening_balance: parseInt(
          data.opening_balance.replace(/[,.]/g, ""),
          10
        ),
      });
      navigate("/account");
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
          pageName="Conta"
          childrenName="Editar conta"
          url="/account"
        />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Edite essa conta</CardTitle>
              <CardDescription>
                Com ela você poderá saber onde seu dinheiro está.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateAccount)}
                className="space-y-8"
              >
                <CardContent className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    defaultValue={account?.name}
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
                    defaultValue={account?.description}
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
                    name="opening_balance"
                    // defaultValue={account?.opening_balance}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saldo inicial</FormLabel>
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
