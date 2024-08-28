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

import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { HedaerChildrenPage } from "@/components/header-children-page";
import { useToast } from "@/components/ui/use-toast";
import { createAccount } from "@/services/https/account";
import { useNavigate } from "react-router-dom";
import { normalizeMonetaryValue } from "@/utils/masks";

const accountFormSchama = z.object({
  name: z
    .string()
    .min(4, "O nome deve ter no mínimo 4 caracteres")
    .max(25, "O nome deve ter no máximo 25 caracteres"),
  description: z
    .string()
    .max(40, "A descrição deve ter no máximo 40 caracteres")
    .optional(),
  opening_balance: z.string().max(20).default("0"),
});

type AccountFormImputs = z.infer<typeof accountFormSchama>;

export function AccountCreate() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<AccountFormImputs>({
    resolver: zodResolver(accountFormSchama),
    defaultValues: {
      name: "",
      description: "",
      opening_balance: "0,00",
    },
  });

  const { mutateAsync: createAccountFn } = useMutation({
    mutationFn: createAccount,
  });
  async function handleCreateAccount(data: AccountFormImputs) {
    try {
      await createAccountFn({
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
        title: "Erro ao criar conta",
        description:
          "Não foi possível criar a conta pois já existe um conta com o mesmo nome.",
        variant: "destructive",
      });
    }
  }

  return (
    <ScrollArea className="flex h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerChildrenPage
          pageName="Contas"
          childrenName="Nova conta"
          url="/account"
        />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Crie uma nova conta</CardTitle>
              <CardDescription>
                Com ela você poderá saber onde seu dinheiro está.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateAccount)}
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
                            placeholder="Banco Inter"
                            {...field}
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saldo inicial</FormLabel>
                        <FormControl>
                          <Input
                            id="opening_balance"
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
