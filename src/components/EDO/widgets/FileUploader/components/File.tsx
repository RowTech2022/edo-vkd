import { Box, Chip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FC } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { getParamFromUrl } from "@utils";

interface IFileItem {
  file: any;
  active?: boolean;
  loading?: boolean;
  onRemove: (file: any) => void;
  onClick: (file: any) => void;
  onDownload: (file: any) => void;
}

export const FileItem: FC<IFileItem> = ({
  file,
  active,
  onRemove,
  onClick,
  onDownload,
}) => {
  return (
    <Box display="flex" gap={"2px"}>
      <IconButton
        sx={{
          width: "30px",
        }}
        color="info"
        onClick={() => onDownload(file)}
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
        label={getParamFromUrl(file?.url, "fileName")}
        onClick={() => onClick(file)}
        onDelete={() => onRemove(file)}
        deleteIcon={<DeleteIcon />}
        variant={active ? "filled" : "outlined"}
      />
    </Box>
  );
};
