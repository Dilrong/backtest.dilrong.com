import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./components/layout/theme-provider.tsx";

import "./index.css";

import AppLayout from "./AppLayout.tsx";
import PortfolioBuildPage from "./pages/portfolio/BuildPage.tsx";
import PortfolioTestResultPage from "./pages/portfolio/TestResultPage.tsx";
import HomePage from "./pages/HomePage.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/portfolio" element={<PortfolioBuildPage />} />
      <Route path="/portfolio/results" element={<PortfolioTestResultPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
