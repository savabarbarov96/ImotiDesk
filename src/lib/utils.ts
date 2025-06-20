
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to delay execution - useful for staggered animations
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to check if element is in viewport
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Helper to create intersection observer with promise
export function createIntersectionObserver(
  element: HTMLElement, 
  options: IntersectionObserverInit = {}
): Promise<IntersectionObserverEntry> {
  return new Promise(resolve => {
    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        observer.disconnect();
        resolve(entry);
      }
    }, options);
    
    observer.observe(element);
  });
}
