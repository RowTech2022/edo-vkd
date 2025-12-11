import { FC, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Card, Tab } from "@mui/material";
import { tabItems } from "../../statics";

export interface IItem {
  title: string;
  value: string;
  content: React.ReactNode;
}

const OrganizationTabs: FC<{}> = () => {
  const [activeTab, setActiveTab] = useState("5");

  return (
    <Box
      sx={{
        marginY: "3rem",
      }}
    >
      <TabContext value={activeTab}>
        <Box sx={{ backgroundColor: "#e0e0e0", marginBottom: "20px" }}>
          <TabList onChange={(_, value: string) => setActiveTab(value)}>
            {tabItems.map(({ title, value }) => (
              <Tab
                key={value}
                sx={{ fontWeight: "600" }}
                label={title}
                value={value}
              />
            ))}
          </TabList>
        </Box>
        {tabItems.map(({ View, value }) => (
          <TabPanel key={value} sx={{ padding: 0 }} value={value}>
            <Card sx={{ padding: "20px" }}></Card>
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default OrganizationTabs;
