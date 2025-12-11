import { Box, Chip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FC } from "react";
import { UploadFileLetters } from "@services/internal/incomingApi";
import { fileNameRegex } from "../ChatV4/ChatV4";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

interface IFile {
  file: UploadFileLetters;
  type: number;
  active?: boolean;
  removeDisabled?: boolean;
  onRemove: (file: UploadFileLetters) => void;
  onClick: (file: UploadFileLetters) => void;
  index: number;
}

export const downloadFile = (res: any) => {
  const parsedUrl = new URL(res);
  const fileName = parsedUrl.searchParams.get("fileName");
  const a = document.createElement("a");

  // Устанавливаем ссылку
  a.href = res;

  // Добавляем атрибут target="_blank" для открытия в новой вкладке
  a.target = "_blank";

  // Опционально: задаем имя файла для скачивания, если необходимо
  a.download = fileName;

  // Добавляем элемент в DOM и имитируем клик
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const File: FC<IFile> = ({
  file,
  type,
  active,
  onRemove,
  onClick,
  index,
  removeDisabled,
}) => {
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

  // useEffect(() => {
  //   if (index === 0) onBeforeOnClick();
  // }, [index]);

  return (
    <Box display="flex" alignItems='center' gap={"2px"}>
      <IconButton
        sx={{
          width: "30px",
        }}
        color="info"
        onClick={() => setDownloadFile(file.url)}
      >
        <RemoveRedEyeOutlinedIcon />
      </IconButton>
      <Chip
        sx={{
          borderRadius: "5px",
          display: "flex",
          justifyContent: "space-between",
          width: "calc(100% - 30px)",
        }}
        label={file?.url?.match(fileNameRegex)?.[0]}
        onClick={onBeforeOnClick}
        {...{
          onDelete: () => (removeDisabled ? undefined : onRemove(file)),
          deleteIcon: <DeleteIcon />,
        }}
        variant={active ? "filled" : "outlined"}
      />
    </Box>
  );
};
