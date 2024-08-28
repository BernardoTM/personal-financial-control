import "./global.css";

import { RouterProvider } from "react-router-dom";

import { router } from "./routes";
import { ThemeProvider } from "./components/theme/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Toaster } from "./components/ui/toaster";

export function App() {
  return (
    <ThemeProvider storageKey="controle-financeiro">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
