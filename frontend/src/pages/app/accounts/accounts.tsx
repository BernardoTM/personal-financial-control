import {
  Card,
  CardContent,
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
import { deleteAccount, fetchAccounts } from "@/services/https/account";
import { normalizeMonetaryValue } from "@/utils/masks";
import { AlertDelete } from "@/components/alert-delete";
import { queryClient } from "@/lib/react-query";
import { AccountResponse } from "@/services/https/account/types";
import { toast } from "@/components/ui/use-toast";

export function Accounts() {
  const [searchParams] = useSearchParams();

  const searchInput = searchParams.get("search") ?? undefined;

  const { data: accounts } = useQuery({
    queryKey: ["account", searchInput],
    queryFn: () => fetchAccounts(searchInput),
    // staleTime: Infinity,
  });

  const { mutateAsync: deleteAccountFn } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<AccountResponse[]>(
        ["account", searchInput],
        (oldData) => {
          return oldData?.filter((account) => account.id !== variables);
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
  async function handleDeleteAccount(id: number) {
    await deleteAccountFn(id);
  }

  return (
    <ScrollArea className="flex h-screen w-full bg-muted/40">
      <div className="flex flex-col gap-4 sm:py-4 px-6 sm:px-6 md:px-8  ">
        <HedaerRootPage pageName="Contas" />
        <main className="flex flex-1 flex-col gap-4 md:gap-8 ">
          <div className="flex items-center ml-auto">
            <Link to="create">
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Nova Conta
                </span>
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap sm:gap-4 justify-center xl:justify-start">
            {accounts?.map((account) => (
              <Card className="w-[340px]" key={account.id}>
                <CardHeader>
                  <CardTitle>{account.name}</CardTitle>
                  <CardDescription>{account.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h1
                    className={
                      account.balance >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    Salado: R$ {account.balance >= 0 ? "+" : "-"}
                    {normalizeMonetaryValue(account.balance.toString())}
                  </h1>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <AlertDelete
                    id={account.id}
                    message="essa conta "
                    handleDelete={handleDeleteAccount}
                  />
                  <Link to={`update/${account.id}`}>
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
