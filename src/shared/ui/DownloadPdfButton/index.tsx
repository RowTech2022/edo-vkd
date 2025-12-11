import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { axios } from "@configs";

export const DownloadPdfButton = ({
  url = "/api/general/printFile3",
}: {
  url?: string;
}) => {
  const [state, setState] = useState<{
    loading: boolean;
    file?: string;
    fileName?: string;
  }>({
    loading: false,
  });

  const handleDownloadFile = () => {
    setState({ ...state, loading: true });
    axios
      .post(url, {})
      .then((res) => {
        const { file64, fileName } = res.data || {};
        const a = document.createElement("a");
        a.href = `data:application/pdf;base64,${file64}`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setState({ loading: false });
      })
      .catch(() => {
        setState({ ...state, loading: false });
      });
  };

  return (
    <Button sx={{ my: 2 }} onClick={handleDownloadFile}>
      {state.loading ? <CircularProgress /> : "Скачать файл"}
    </Button>
  );
};
