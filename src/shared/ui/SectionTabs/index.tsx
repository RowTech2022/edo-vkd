import { FC, useEffect, useState } from "react";
import { TabContext, TabList } from "@mui/lab";
import { Box, Card, Tab } from "@mui/material";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HideSourceIcon from "@mui/icons-material/HideSource";
import ScheduleIcon from "@mui/icons-material/Schedule";

export interface ISectionTab {
  title: string;
  value: string;
  View: FC<any>;
}

interface ISectionTabs {
  items: ISectionTab[];
  defaultTab: string;
  propsData?: any;
  isTabVisbile?: (value: string) => boolean;
  getStatus?: (value: number) => string;
}

const sections: any = {
  new: 0,
  oprk1: 1,
  ib: 2,
  admin: 3,
  oprk2: 4,
  ib2: 5,
  accountant: 6,
  oprk3: 7,
  done: 100,
  delete: -1,
};

const statusColor = {
  done: "#3FA34B",
  inProgress: "#F7F7FC",
};

export const SectionTabs: FC<ISectionTabs> = ({
  items,
  propsData = {},
  defaultTab,
  isTabVisbile,
  getStatus,
}) => {
  const [activeTab, setActiveTab] = useState("oprk1");

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const getActiveTab = () => {
    const item = items.find((item) => item.value === activeTab);
    if (!item) return null;
    const { View, value } = item;

    return (
      <Card sx={{ padding: "20px" }}>
        <View {...propsData} />
      </Card>
    );
  };

  return (
    <Box
      sx={{
        marginY: "3rem",
      }}
    >
      <TabContext value={activeTab}>
        <Box sx={{ backgroundColor: "#e0e0e0", marginBottom: "20px" }}>
          <TabList
            onChange={(_, value: string) => {
              if (isTabVisbile ? isTabVisbile(value) : true) {
                setActiveTab(value);
              }
            }}
          >
            {items.map(({ title, value }) => {
              const status = getStatus && getStatus(sections[value]);

              const statuses: any = {
                done: <TaskAltIcon color="success" />,
                inProgress: <ScheduleIcon />,
                empty: <HideSourceIcon />,
              };

              const icon = status ? statuses[status] : null;

              const className = status || "";
              return (
                <Tab
                  disabled={isTabVisbile ? !isTabVisbile(value) : false}
                  iconPosition="start"
                  icon={icon}
                  className={className}
                  key={value}
                  sx={{ fontWeight: "600" }}
                  label={title}
                  value={value}
                />
              );
            })}
          </TabList>
        </Box>
        {activeTab && getActiveTab()}
      </TabContext>
    </Box>
  );
};

export default SectionTabs;
