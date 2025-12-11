import { Box, IconButton, Typography } from "@mui/material";
import { FC } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const url =
  "https://chjo949c9q.pdcdn1.top/dl2.php?id=187464250&h=5c3d1a6ee92450713b6a4f6e9974d870&u=cache&ext=pdf&n=%D0%92%D1%8B%20%D0%BD%D0%B5%20%D0%B7%D0%BD%D0%B0%D0%B5%D1%82%D0%B5%20js%20%D0%9F%D1%80%D0%B8%D1%81%D1%82%D1%83%D0%BF%D0%B8%D0%BC";

interface IFileLoader {
  title: string;
}

export const FileLoader: FC<IFileLoader> = ({ title }) => {
  const downloadFile = () => {
    const fileUrl = url;
    const a = document.createElement("a");
    a.target = "_blank";
    a.style.display = "none";
    a.href = fileUrl;
    a.download = "image.png";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(fileUrl);
  };

  return (
    <Box>
      <Typography fontSize="16px" fontWeight="500">
        {title}
      </Typography>
      <IconButton onClick={downloadFile}>
        <Box sx={{ transform: "scale(2)" }}>
          <InsertDriveFileIcon fontSize="large" />
        </Box>
      </IconButton>
    </Box>
  );
};
