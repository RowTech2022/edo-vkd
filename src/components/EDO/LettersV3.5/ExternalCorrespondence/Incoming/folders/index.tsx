import styled from "@emotion/styled";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import { SyntheticEvent } from "react";
import { IncomingFolder } from "@services/internal/incomingApi";
import Item from "./item";
import { Tooltip, useTheme } from "@mui/material";
import { useNavigate } from "react-router";

interface FoldersPanelProps {
  items?: IncomingFolder[];
  selectedFolder: number;
  moveToFolder: ({}: any) => void;
  refreshDataTable: () => void;
  updateFilters: (id: number) => void;
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
  updateFilters,
}: FoldersPanelProps) {
  const theme = useTheme();
  const push = useNavigate();
  const handleChange = (event: SyntheticEvent, value: number) => {
    updateFilters(value);
    push(
      `/modules/letters-v3.5/ExternalCorrespondence/corIncoming-v3.5${
        value === 0 ? "" : "?folderId=" + value
      }`
    );
  };

  return (
    <Paper
      sx={{
        border: "1px solid #cecece",
        borderRadius: "26px",
        overflow: "auto",
      }}
      square
      elevation={0}
    >
      <TabList
        sx={{ minHeight: "auto", height: "100%" }}
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
            label={
              <Tooltip title={item.folderInfo.name} placement="top">
                <p>
                  {item.folderInfo.name.length < 20
                    ? item.folderInfo.name
                    : item.folderInfo.name.substring(0, 20) + " ..."}
                </p>
              </Tooltip>
            }
            value={item.folderInfo.id || 0}
            moveToFolder={moveToFolder}
            refreshDataTable={refreshDataTable}
          />
        ))}
      </TabList>
    </Paper>
  );
}
