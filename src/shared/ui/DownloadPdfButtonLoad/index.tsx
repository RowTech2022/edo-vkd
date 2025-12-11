import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { axios } from "@root/shared/lib";

export const DownloadPdfButton = ({
  url = "https://localhost:44383/api/file/loadfile",
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

    const key = "File";

    axios
      .post(
        url,
        {},
        {
          params: {
            key,
          },
        }
      )
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
