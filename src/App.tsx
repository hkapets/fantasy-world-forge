import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/Common/ErrorBoundary";
import { DatabaseMigration } from "@/components/Common/DatabaseMigration";
import { OfflineIndicator } from "@/components/Common/OfflineIndicator";
import { LanguageProvider } from "@/lib/i18n";
import { initializeDatabase } from "@/lib/database";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Ініціалізуємо базу даних при завантаженні
initializeDatabase().then(success => {
  if (success) {
    console.log('✅ Database initialized successfully');
  } else {
    console.warn('⚠️ Database initialization failed, falling back to localStorage');
  }
});

const AppContent = () => {
  useServiceWorker();

  return (
    <BrowserRouter>
      <OfflineIndicator />
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <ErrorBoundary>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <DatabaseMigration />
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ErrorBoundary>
);

export default App;
