import { Box, Chip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFetchDownloadFilesMutation } from "@services/fileApi";
import { FC, useEffect } from "react";
import { UploadFileLetters } from "@services/internal/incomingApi";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface IFile {
  file: UploadFileLetters;
  type: number;
  active?: boolean;
  onRemove: (file: UploadFileLetters) => void;
  onClick: (file: UploadFileLetters) => void;
  index: number;
}

export const File: FC<IFile> = ({
  file,
  index,
  type,
  active,
  onRemove,
  onClick,
}) => {
  const downloadFile = (res: any) => {
    const parsedUrl = new URL(res);
    const fileName = parsedUrl.searchParams.get("fileName");
    const a = document.createElement("a");
    a.href = res;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getFullUrlFromResponse = (res: any) => {
    const { file64, fileName } = res.data || {};

    return `data:application/pdf;base64,${file64}`;
  };

  const setDownloadFile = async (fileName: string) => {
    if (fileName === "") return;
    downloadFile(fileName);
  };

  const onBeforeOnClick = async () => {
    onClick({
      ...file,
      fullUrl: file.url,
      loading: false,
    });
  };

  useEffect(() => {
    if (index === 0) onBeforeOnClick();
  }, [index]);

  return (
    <Box display="flex" gap={"2px"}>
      <IconButton
        sx={{
          width: "30px",
        }}
        color="info"
        onClick={() => setDownloadFile(file.url)}
      >
        <FileDownloadIcon />
      </IconButton>
      <Chip
        sx={{
          borderRadius: "5px",
          display: "flex",
          justifyContent: "space-between",
          width: "calc(100% - 30px)",
        }}
        label={file && file.url}
        onClick={onBeforeOnClick}
        onDelete={() => onRemove(file)}
        deleteIcon={<DeleteIcon />}
        variant={active ? "filled" : "outlined"}
      />
    </Box>
  );
};
