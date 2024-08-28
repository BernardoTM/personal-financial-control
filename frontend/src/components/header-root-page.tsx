import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { ThemeToggle } from "./theme/theme-toggle";
import { Input } from "./ui/input";
import { ChangeEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

interface HedaerRootPageProps {
  pageName: string;
}

export function HedaerRootPage({ pageName }: HedaerRootPageProps) {
  const [_searchInput, setSearchInput] = useState<string>("");
  const [_searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    setSearchParams((prev) => {
      prev.set("search", event.target.value);

      return prev;
    });
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate(`/`);
  };
  return (
    <header className="flex h-14 items-center justify-between">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{pageName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-2">
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            onChange={handleSearchInput}
          />
        </div>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
