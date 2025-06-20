
import { useState, useCallback } from 'react';

type InputType = string | number | readonly string[] | undefined;

/**
 * Custom hook for managing form input state with safe initialization
 * and controlled component pattern
 */
export function useFormInput<T extends InputType>(initialValue: T = '' as T) {
  const [value, setValue] = useState<T>(initialValue);
  
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // For number inputs, convert the string to number
    if (typeof initialValue === 'number') {
      const numValue = e.target.value === '' ? 0 : Number(e.target.value);
      setValue(numValue as T);
    } else {
      setValue(e.target.value as T);
    }
  }, [initialValue]);

  // Reset to initial value
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    onChange,
    reset,
    setValue
  };
}
