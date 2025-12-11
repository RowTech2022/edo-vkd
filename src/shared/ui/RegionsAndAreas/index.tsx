import { FC, useEffect, useState } from "react";
import {
  Card,
  Tabs,
  Typography,
  Box,
  Skeleton,
  MenuList,
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Breadcrumbs,
  Chip,
} from "@mui/material";
import styled from "@emotion/styled";
import { useFetchChaptersQuery } from "@services/chaptersApi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const TabList = styled(Tabs)`
  & .MuiTabs-flexContainer > .MuiButtonBase-root {
    border-right: 1px solid #cecece;
  }

  & .MuiTabs-flexContainer > .MuiButtonBase-root:first-child {
    border-left: 1px solid #cecece;
  }
` as typeof Tabs;

interface IRegionsAndAreas {
  onChange: (chapter: number, regionName: string) => void;
}

interface IGroupContainer {
  title: string;
  children: React.ReactNode;
}

const GroupContainer: FC<IGroupContainer> = ({ title, children }) => {
  return (
    <Box position="relative">
      <Typography variant="h6">Область:</Typography>
    </Box>
  );
};

export const RegionsAndAreas: FC<IRegionsAndAreas> = ({ onChange }) => {
  const [activeRegion, setActiveRegion] = useState<IChapter | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(0);
  const [regionHover, setRegionHover] = useState("");
  const [region, setRegion] = useState("");
  const [subRegion, setSubRegion] = useState("");

  const { data, isFetching } = useFetchChaptersQuery();
  const { items = [] } = data || {};

  const handleChange = (chapter: IChapter) => {
    setRegion(regionHover);
    setSubRegion(chapter.terName);
    setAnchorEl(null);
    onChange(chapter.id, chapter.terName);
  };

  useEffect(() => {
    if (items && items.length) {
      setActiveRegion(items[0]);
      setRegion(items[0].terName);
      setChapters(items[0].subTers);
      if (items[0].subTers && items[0].subTers.length) {
        setSelectedChapter(items[0].subTers[0].id);
        setSubRegion(items[0].subTers[0].terName);
        onChange(items[0].subTers[0].id, items[0].subTers[0].terName);
      }
    }
  }, [items]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    currChapter: IChapter
  ) => {
    setRegionHover(currChapter.terName);
    setChapters(currChapter.subTers);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const breadcrumbs = [
    <Chip key="region" color="primary" label={region} variant="outlined" />,
    <Chip
      key="subRegion"
      color="primary"
      label={subRegion}
      variant="outlined"
    />,
  ];

  return (
    <>
      <Card className="tw-mb-4 tw-p-4">
        {!isFetching ? (
          <Box>
            <MenuList
              variant="selectedMenu"
              sx={{
                "&.MuiList-root": { padding: 0 },
                minHeight: "40px",
                border: "none",
                display: "flex",
                columnGap: "15px",
                marginBottom: "16px",
              }}
            >
              {items.map((item: any) => (
                <Box key={item.id}>
                  <MenuItem
                    sx={{
                      minHeight: "40px",
                      border: "none !important",
                      boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.07)",
                    }}
                    key={item.terName}
                    onClick={(event) => handleClick(event, item)}
                  >
                    {item.terName}
                    <Box marginLeft="10px">
                      <ExpandMoreIcon />
                    </Box>
                  </MenuItem>
                </Box>
              ))}
            </MenuList>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box className="no-scrollbar" maxHeight="300px" overflow="auto">
                <List sx={{ minWidth: "200px" }}>
                  {chapters &&
                    chapters.map((item2: any) => (
                      <ListItem key={item2.id} disablePadding>
                        <ListItemButton onClick={() => handleChange(item2)}>
                          <ListItemText primary={item2.terName} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </Box>
            </Popover>
            <Box>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                {breadcrumbs}
              </Breadcrumbs>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box display="flex" columnGap="30px" marginBottom="25px">
              <Skeleton width="100px" variant="rectangular" height="30px" />
              <Skeleton width="80px" variant="rectangular" height="30px" />
              <Skeleton width="80px" variant="rectangular" height="30px" />
              <Skeleton width="90px" variant="rectangular" height="30px" />
              <Skeleton width="120px" variant="rectangular" height="30px" />
            </Box>
            <Box display="flex" columnGap="30px" marginBottom="16px">
              <Skeleton width="80px" variant="rectangular" height="30px" />
              <Skeleton width="120px" variant="rectangular" height="30px" />
            </Box>
          </Box>
        )}
      </Card>
    </>
  );
};

export default RegionsAndAreas;
