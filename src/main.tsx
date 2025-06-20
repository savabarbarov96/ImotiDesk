
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from '@/components/ErrorBoundary'
import { MotionProvider } from '@/lib/animations/motion-provider'

const container = document.getElementById("root")

if (!container) {
  throw new Error("Could not find root element")
}

// Create a QueryClient instance with error handling configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {},
  },
})

createRoot(container).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <MotionProvider>
        <App />
        <Toaster />
      </MotionProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
