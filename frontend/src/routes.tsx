import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { Dashboard } from "./pages/app/dashboard/dashboard";
import { NotFound } from "./404";
import { SingUp } from "./pages/auth/sing-up";
import { SingIn } from "./pages/auth/sing-in";
import { Accounts } from "./pages/app/accounts/accounts";
import { AccountCreate } from "./pages/app/accounts/accounts-create";
import { AccountUpdate } from "./pages/app/accounts/accounts-update";
import { Categories } from "./pages/app/categories/categories";
import { CategorieCreate } from "./pages/app/categories/categories-create";
import { CategorieUpdate } from "./pages/app/categories/categories-update";
import { Transactions } from "./pages/app/transactions/transactions";
import { TransactionCreate } from "./pages/app/transactions/transactions-create";
import { TransactionUpdate } from "./pages/app/transactions/transactions-update";
import { GoalCreate } from "./pages/app/goals/goals-create";
import { GoalUpdate } from "./pages/app/goals/goals-update";
import { Budgets } from "./pages/app/budgets/budgets";
import { BudgetUpdate } from "./pages/app/budgets/budgets-update";
import { BudgetCreate } from "./pages/app/budgets/budgets-create";
import { Investments } from "./pages/app/investments/investments";
import { InvestmentCreate } from "./pages/app/investments/investments-create";
import { InvestmentUpdate } from "./pages/app/investments/investments-update";
import { Goals } from "./pages/app/goals/goals";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <SingIn /> },
      { path: "/sing-up", element: <SingUp /> },
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },

      { path: "/account", element: <Accounts /> },
      { path: "/account/create", element: <AccountCreate /> },
      { path: "/account/update/:id", element: <AccountUpdate /> },

      { path: "/budget", element: <Budgets /> },
      { path: "/budget/create", element: <BudgetCreate /> },
      { path: "/budget/update/:id", element: <BudgetUpdate /> },

      { path: "/categorie", element: <Categories /> },
      { path: "/categorie/create", element: <CategorieCreate /> },
      { path: "/categorie/update/:id", element: <CategorieUpdate /> },

      { path: "/goal", element: <Goals /> },
      { path: "/goal/create", element: <GoalCreate /> },
      { path: "/goal/update/:id", element: <GoalUpdate /> },

      { path: "/investment", element: <Investments /> },
      { path: "/investment/create", element: <InvestmentCreate /> },
      { path: "/investment/update/:id", element: <InvestmentUpdate /> },

      {
        path: "/transaction",
        element: <Transactions />,
      },
      { path: "/transaction/create", element: <TransactionCreate /> },
      { path: "/transaction/update/:id", element: <TransactionUpdate /> },
    ],
  },
]);
