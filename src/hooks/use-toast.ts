
import { useToast as useToastOriginal, toast as toastOriginal } from "@/components/ui/use-toast";
import type { ToastActionElement } from "@/components/ui/toast";

/**
 * Re-export the toast functionality
 */
export const useToast = useToastOriginal;
export const toast = toastOriginal;

// Re-export additional types for consistency
export type { ToastActionElement };

// Export ToastProps type from the file where it's defined
export type { ToastProps } from "@/components/ui/toast";
