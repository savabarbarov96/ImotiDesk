
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
