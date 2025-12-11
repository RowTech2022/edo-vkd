import styled from "@emotion/styled";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import { useNavigate } from "react-router";
import { SyntheticEvent } from "react";
import { IncomingFolder } from "@services/internal/incomingApi";
import Item from "./item";
import { useTheme } from "@mui/material";

interface FoldersPanelProps {
  items?: IncomingFolder[];
  selectedFolder: number;
  moveToFolder: ({}: any) => void;
  refreshDataTable: () => void;
}

const TabList = styled(Tabs)`
  & .MuiTabs-flexContainer > .MuiButtonBase-root {
    border-right: 1px solid #cecece;
  }

  & .MuiTabs-flexContainer > .MuiButtonBase-root:first-child {
    border-left: 1px solid #cecece;
  }
` as typeof Tabs;

export default function FoldersPanel({
  items = [],
  selectedFolder,
  moveToFolder,
  refreshDataTable,
}: FoldersPanelProps) {
  const theme = useTheme();
  const push = useNavigate();
  const handleChange = (event: SyntheticEvent, value: number) => {
    push(`/modules/latters/incomming/${value}`);
  };

  return (
    <Paper sx={{ border: "1px solid #cecece" }} square elevation={0}>
      <TabList
        value={selectedFolder}
        variant="scrollable"
        scrollButtons
        onChange={handleChange}
        TabScrollButtonProps={{
          sx: {
            background: theme.palette.primary.main,
            color: "#fff",
          },
        }}
      >
        {items.map((item) => (
          <Item
            key={item.folderInfo.id}
            label={item.folderInfo.name}
            value={item.folderInfo.id || 0}
            moveToFolder={moveToFolder}
            refreshDataTable={refreshDataTable}
          />
        ))}
      </TabList>
    </Paper>
  );
}
