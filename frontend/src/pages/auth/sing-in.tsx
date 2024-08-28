import { zodResolver } from "@hookform/resolvers/zod";
import { addCookies } from "@/utils/cookies";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { postAuthLogin } from "@/services/https/auth";
import { useToast } from "@/components/ui/use-toast";

import { useEffect } from "react";
import Cookies from "js-cookie";

const month = String(new Date().getMonth());
const year = String(new Date().getFullYear());

const singInForm = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(5, "O email deve ter no mínimo 5 caracteres")
    .max(100, "O email deve ter no máximo 100 caracteres"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .max(50, "A senha deve ter no máximo 50 caracteres"),
});

type SingInForm = z.infer<typeof singInForm>;

export function SingIn() {
  const navigate = useNavigate();

  const { toast } = useToast();

  const form = useForm<SingInForm>({
    resolver: zodResolver(singInForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: postAuthLogin,
  });

  async function handleSingIn({ email, password }: SingInForm) {
    try {
      const response = await authenticate({ email: email, password: password });
      if (response.status === 200) {
        addCookies(
          response.data.token_type,
          response.data.refresh_token,
          response.data.access_token
        );
        navigate(`/dashboard?month=${month}&year=${year}`);
      }
    } catch {
      toast({
        title: "Erro ao entrar",
        description: "Email ou senha estão errados",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (Cookies.get("accessToken") != undefined) {
      navigate(`/dashboard?month=${month}&year=${year}`);
    }
  }, []);

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Entrar</h1>
            <p className="text-balance text-muted-foreground">
              Insira seus dados abaixo para entra na sua conta
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSingIn)}
              className=" space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="exemplo@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Senha</FormLabel>
                      {/* <Link
                        to="/"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Esqueceu sua senha?
                      </Link> */}
                    </div>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button id="submit" type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/sing-up" className="underline">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex lg:justify-center lg:items-center">
        <div>
          <img
            src="/login.svg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
}
