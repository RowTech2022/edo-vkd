import { useEffect } from "react";
import { toast } from "react-toastify";

interface UseToastProps {
  successText?: string;
  isError?: boolean;
  isSuccess?: boolean;
  onSuccess?: () => void;
}

export function useToast({
  successText = "Операция успешно завершена.",
  isError,
  isSuccess,
  onSuccess,
}: UseToastProps) {
  useEffect(() => {
    if (isError) {
      toast("Произошла ошибка. Попробуйте повторить позже.", {
        type: "error",
        position: "bottom-right",
      });
    }
    if (isSuccess) {
      toast(successText, {
        type: "success",
        position: "bottom-right",
      });
      onSuccess && onSuccess();
    }
  }, [isError, isSuccess, onSuccess]);
}
