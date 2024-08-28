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

import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/services/https/user";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCookies } from "@/utils/cookies";

const month = String(new Date().getMonth());
const year = String(new Date().getFullYear());

const singUpForm = z
  .object({
    email: z
      .string()
      .email("Email inválido")
      .min(5, "O email deve ter no mínimo 5 caracteres")
      .max(100, "O email deve ter no máximo 100 caracteres"),
    name: z
      .string()
      .min(4, "O nome deve ter no mínimo 4 caracteres")
      .max(100, "O nome deve ter no máximo 100 caracteres"),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "A confirmação da senha deve ter no mínimo 8 caracteres")
      .max(50, "A confirmação da senha deve ter no máximo 50 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // O erro aparecerá no campo de confirmação da senha
  });
type SingUpForm = z.infer<typeof singUpForm>;

export function SingUp() {
  const navigate = useNavigate();

  const { toast } = useToast();

  const form = useForm<SingUpForm>({
    resolver: zodResolver(singUpForm),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: postAuthLogin,
  });

  const { mutateAsync: create } = useMutation({
    mutationFn: createUser,
  });

  async function handleSingUp(data: SingUpForm) {
    try {
      const response = await create({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (response.status === 201) {
        try {
          const response = await authenticate({
            email: data.email,
            password: data.password,
          });
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
    } catch {
      toast({
        title: "Erro ao entrar",
        description: "Email já registrado",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Entrar</h1>
            <p className="text-balance text-muted-foreground">
              Insira seus dados abaixo para criar sua conta
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSingUp)}
              className=" space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="João da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormLabel>Senha</FormLabel>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
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
                Criar Conta
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Já possui uma conta?{" "}
            <Link to="/" className="underline">
              Entrar
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
