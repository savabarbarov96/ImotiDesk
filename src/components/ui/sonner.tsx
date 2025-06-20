
// This is a compatibility layer for applications using sonner
// It redirects to our custom toast implementation
import { toast } from "@/hooks/use-toast";

// Re-export toast from our shadcn implementation for backward compatibility
export { toast };
export const Toaster = () => null; // Empty component for backward compatibility
