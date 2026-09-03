import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@ui/toaster.tsx";
import { AppRouter } from "./navigation";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@pages/ErrorFallback.tsx";
import { queryClient } from "@api/queryClient.ts";

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.reload()}
        >
            <AppRouter />
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
