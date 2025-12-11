import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { PropsWithChildren, useEffect, useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { getModuleIcon } from "./helpers/constants";
import clsx from "clsx";
import { useNavigate } from "react-router";

type Props = {
  item: EDOModule;
};

const ProfileModulsList = ({ item }: PropsWithChildren<Props>) => {
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState<EDOModule[]>();
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = (item: EDOModule) => {
    if (!item.subModuls?.length) {
      navigate(`/modules/${item.modulName}`);
      return;
    }
    if (open) {
      setOpen(false);
      setCurrentModule([]);
    } else {
      setCurrentModule(item.subModuls);
    }
  };

  useEffect(() => {
    if (currentModule?.length) {
      setOpen(true);
    }
  }, [currentModule]);

  // classnames
  const subModulesExist = item.subModuls?.length;
  const listItemButton = clsx(
    "tw-pl-[40px]",
    !subModulesExist && "hover:tw-underline"
  );

  return (
    <>
      <ListItemButton
        className={listItemButton}
        onClick={() => handleClick(item as EDOModule)}
      >
        <ListItemIcon>{getModuleIcon(item.modulName)}</ListItemIcon>
        <ListItemText primary={item.name} />
        {subModulesExist ? open ? <ExpandLess /> : <ExpandMore /> : ""}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {currentModule &&
          currentModule.map((item, idx) => (
            <List component="div" disablePadding key={idx}>
              <ListItemButton
                sx={{ pl: 12 }}
                onClick={() =>
                  navigate(`/modules/${item.parentModul}/${item.modulName}`)
                }
              >
                <ListItemText
                  className="hover:tw-underline"
                  primary={item.name}
                />
              </ListItemButton>
            </List>
          ))}
      </Collapse>
    </>
  );
};

export default ProfileModulsList;
