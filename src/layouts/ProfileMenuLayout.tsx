import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { PropsWithChildren,  useState } from "react";
import { Layout } from "./Layout";
import {
  Box,
  CircularProgress,
  Collapse,
  ListItemIcon,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import { useFetchModulesQuery } from "@services/modulesApi";
import ProfileModulsList from "@root/components/admin/Profile/ProfileModulsList";
import { useLocation, useNavigate } from "react-router";
import { userMenuItems } from "@utils";
import { useScreenSize } from "@hooks";

type Props = {
  ignoreSub?: boolean;
};

export const ProfileMenuLayout = ({ children }: PropsWithChildren<Props>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.split("/");
  const { width } = useScreenSize();

  const [isExpanded, setIsExpanded] = useState(false);
  const { data: edoModules, isFetching } = useFetchModulesQuery();

  if (isFetching)
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-[90vh]">
        <CircularProgress />
      </div>
    );

  return (
    <Layout noOutlet>
      <div className="tw-container tw-grid tw-grid-cols-4 tw-gap-4">
        <Typography
          className="tw-col-span-4 tw-text-white"
          variant="h5"
          sx={{ paddingY: "10px", fontWeight: "500" }}
        >
          Профиль
        </Typography>
        <div className="tw-flex tw-flex-col tw-col-span-1 max-md:tw-col-span-4">
          <MenuList
            sx={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              borderRadius: "20px",
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.24)",
              background: "white",
              "& .MuiButtonBase-root": { borderRadius: "20px" },
            }}
          >
            <MenuItem
              className={"tw-bg-[#E3E9F5] md:tw-hidden"}
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListItemIcon>
                  <WidgetsIcon />
                </ListItemIcon>
                <Typography fontSize="16px" variant="inherit">
                  {"Модули"}
                </Typography>
              </Box>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </MenuItem>
            <Collapse in={isExpanded || width > 768}>
              {userMenuItems.map((item, idx) => (
                <MenuItem
                  key={idx + 1}
                  className={`${
                    path[path.length - 1] === "profile" && !item.link
                      ? "tw-bg-[#f5f5f5]"
                      : path[path.length - 1] === item.link && "tw-bg-[#f5f5f5]"
                  }`}
                  onClick={() => navigate(`/users/me/profile/${item.link}`)}
                >
                  <ListItemIcon>
                    {!item.link ? (
                      <PersonIcon />
                    ) : (
                      item.link === "organisation" && <AccountBalanceIcon />
                    )}
                  </ListItemIcon>
                  <Typography fontSize="16px" variant="inherit">
                    {item.name}
                  </Typography>
                </MenuItem>
              ))}
{edoModules.items.map((item: any, idx) => {
  if (item.name === "Письма-V4") {
    return (
      <ProfileModulsList
        key={idx}
        item={{ ...item, name: "Корреспонденция" }}
      />
    );
  }

  if (item.name === "CRM") {
    return <ProfileModulsList key={idx} item={item} />;
  }

  return null;
})}
            </Collapse>
          </MenuList>
        </div>
        <div className="tw-col-span-3 max-md:tw-col-span-4">{children}</div>
      </div>
    </Layout>
  );
};
