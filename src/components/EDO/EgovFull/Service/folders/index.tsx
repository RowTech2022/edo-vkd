import styled from "@emotion/styled";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import { SyntheticEvent } from "react";
import Item from "./item";
import { Tooltip } from "@mui/material";
import { useNavigate, useParams } from "react-router";

interface FoldersPanelProps {
  items?: any[];
  selectedService: number;
  setSelectedService: (value: number) => void;
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
  selectedService,
  setSelectedService,
}: FoldersPanelProps) {
  const query = useParams();

  const push = useNavigate();
  const orgId = query.fid ? Number(query.fid) : 0;

  const handleChange = (event: SyntheticEvent, value: number) => {
    if (value === 0) {
      push(`/modules/egovFull/Organisation/${orgId}`);
      return;
    }
    push(`/modules/egovFull/Organisation/${orgId}/Service/${value}`);
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
        sx={{
          minHeight: "auto",
          height: "100%",
          "& .MuiTabs-flexContainer": {
            height: "100%",
            "& .MuiTab-root": {
              paddingY: "9px",
            },
          },
          "& .MuiButtonBase-root.Mui-selected": {
            color: "#009688",
            borderBottom: "2px solid #009688",
          },
        }}
        value={selectedService || 0}
        variant="scrollable"
        scrollButtons
        onChange={handleChange}
      >
        <Item key={0} label={<p>Все Услуги</p>} value={0} />
        {items.map((item) => (
          <Item
            key={item.id}
            label={
              <Tooltip
                title={item.value?.length > 20 ? item.value : ""}
                placement="top"
              >
                <p>
                  {item.value?.length < 20
                    ? item.value
                    : item.value?.substring(0, 20) + " ..."}
                </p>
              </Tooltip>
            }
            value={item.id || 0}
          />
        ))}
      </TabList>
    </Paper>
  );
}
