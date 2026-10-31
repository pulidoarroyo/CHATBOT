import { useState } from "react";

export const useErrorToast = () => {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 4000);
  };

  const clearError = () => setError(null);

  return { error, showError, clearError };
};