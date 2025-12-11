import { Box, Chip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFetchDownloadFilesMutation } from "@services/fileApi";
import { FC, useEffect } from "react";
import { UploadFileLetters } from "@services/internal/incomingApi";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { downloadFileWithUrl } from "@hooks";

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
  type,
  active,
  onRemove,
  onClick,
  index,
}) => {
  const [downloadMedia] = useFetchDownloadFilesMutation();

  const getFullUrlFromResponse = (res: any) => {
    const { file64, fileName } = res.data || {};

    return `data:application/pdf;base64,${file64}`;
  };

  const setDownloadFile = async (fileName: string) => {
    if (fileName === "") return;
    await downloadMedia({ data: { fileName, type } }).then((res) => {
      downloadFileWithUrl(res);
    });
  };

  const onBeforeOnClick = async () => {
    onClick({ ...file, loading: true });
    await downloadMedia({ data: { fileName: file.url, type } }).then((res) => {
      onClick({
        ...file,
        fullUrl: getFullUrlFromResponse(res),
        loading: false,
      });
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
        label={file?.url}
        onClick={onBeforeOnClick}
        onDelete={() => onRemove(file)}
        deleteIcon={<DeleteIcon />}
        variant={active ? "filled" : "outlined"}
      />
    </Box>
  );
};
