import { Box, Chip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFetchDownloadFilesMutation } from "@services/fileApi";
import { FC } from "react";
import { UploadFileLetters } from "@services/internal/incomingApi";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface IFile {
  file: UploadFileLetters;
  type: number;
  active?: boolean;
  onRemove: (file: UploadFileLetters) => void;
  onClick: (file: UploadFileLetters) => void;
}

export const File: FC<IFile> = ({ file, type, active, onRemove, onClick }) => {
  const [downloadMedia] = useFetchDownloadFilesMutation();

  const downloadFile = (res: any) => {
    const { file64, fileName } = res.data || {};
    const a = document.createElement("a");
    a.href = `data:application/pdf;base64,${file64}`;
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
    await downloadMedia({ data: { fileName, type } }).then((res) => {
      downloadFile(res);
    });
  };

  const onBeforeOnClick = async () => {
    onClick({ ...file, loading: true });
    await downloadMedia({ data: { fileName: file.url, type } }).then((res) => {
      onClick({
        ...file,
        fullUrl: getFullUrlFromResponse(res),
      });
    });
  };

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
        label={file.url}
        onClick={onBeforeOnClick}
        onDelete={() => onRemove(file)}
        deleteIcon={<DeleteIcon />}
        variant={active ? "filled" : "outlined"}
      />
    </Box>
  );
};
