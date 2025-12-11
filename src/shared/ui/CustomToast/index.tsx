import { useAppSelector } from "@root/store/hooks";
import { Alert } from "@mui/material";
import { useEffect, useState } from "react";

let genToastId = 0;
const toastTime = 6000;
export const CustomToast = () => {
  const error = useAppSelector((state) => state.snackbar.error);
  const [messages, setMessages] = useState<Array<any>>([]);

  useEffect(() => {
    if (error?.message) {
      genToastId++;
      messages.push({ toastId: "id_" + genToastId, message: error.message });
      const idx = messages.length - 1;
      setTimeout(() => removeItem(idx), toastTime);
      setMessages([...messages]);
    }
  }, [error]);

  const removeItem = (idx: number) => {
    messages.splice(idx, 1);
    setMessages([...messages]);
  };

  const getHandleClose = (idx: number) => {
    return () => removeItem(idx);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "30px",
        right: "30px",
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        zIndex: 999,
      }}
    >
      {messages.map(({ toastId, message }, idx) => (
        <div key={toastId} className="alert-item">
          <Alert
            onClose={getHandleClose(idx)}
            severity="error"
            sx={{ paddingY: 2 }}
          >
            {message}
          </Alert>
        </div>
      ))}
    </div>
  );
};
