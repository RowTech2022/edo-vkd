import styled from "@emotion/styled";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import { SyntheticEvent } from "react";
import { useFetchDownloadFilesMutation } from "@services/fileApi";
import { UploadFileLetters } from "@services/internal/incomingApi";
import Item1 from "./item";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface FoldersPanelProps {
  items?: UploadFileLetters[];
  type: number;
  onRemove?: (item: UploadFileLetters) => void;
}

const TabList = styled(Tabs)`
  & .MuiTabs-flexContainer > .MuiButtonBase-root {
    border-right: 1px solid #cecece;
  }

  & .MuiTabs-flexContainer > .MuiButtonBase-root:first-child {
    border-left: 1px solid #cecece;
    margin: 10, 12, 15, 10;
  }
` as typeof Tabs;

export default function FoldersPanel1({
  items = [],
  type,
  onRemove,
}: FoldersPanelProps) {
  const [downloadMedia] = useFetchDownloadFilesMutation();

  const SetDownloadFile = async (event: SyntheticEvent, fileName: string) => {
    if (fileName === "") return;
    await downloadMedia({ data: { fileName: fileName, type: type } }).then(
      (res) => {
        downloadFile(res);
      }
    );
  };

  const downloadFile = (res: any) => {
    const { file64, fileName } = res.data || {};
    const a = document.createElement("a");
    a.href = `data:application/pdf;base64,${file64}`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (items.length === 0) return null;

  const handleRemove = (e: any, item: UploadFileLetters) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(item);
    }
  };

  return (
    <Paper sx={{ border: "1px solid #cecece" }} square elevation={0}>
      <TabList variant="scrollable" scrollButtons onChange={SetDownloadFile}>
        {items?.map((item) => (
          <Item1
            key={item?.url}
            label={
              <Box display="flex" columnGap="10px">
                {item?.url}{" "}
                <IconButton
                  color="error"
                  onClick={(e) => handleRemove(e, item)}
                >
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </Box>
            }
            value={item?.url}
          />
        ))}
      </TabList>
    </Paper>
  );
}
