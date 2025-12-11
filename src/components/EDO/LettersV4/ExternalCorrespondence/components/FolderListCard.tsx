import { FC, useRef, useState } from "react";
import { IFolderItem } from "@services/lettersApiV4";
import { AllFolderIcon, FolderIcon } from "@ui";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

interface IProps {
  folder: IFolderItem;
  isAll?: boolean;
  onDelete?: (item: IFolderItem) => void;
  onUpdate?: (item: IFolderItem) => void;
}

export const FolderListCard: FC<IProps> = ({
  folder,
  isAll,
  onDelete,
  onUpdate,
}) => {
  const { totalCount, readCount, unreadCount, name, id } = folder;

  const [settingsOpen, setSettingsOpen] = useState(false);

  const ref = useRef();

  const folderClassName = "tw-absolute tw-top-0 tw-left-0";

  return (
    <div className="tw-w-[224px] tw-pt-[70px] tw-relative tw-p-4">
      {isAll ? (
        <AllFolderIcon className={folderClassName} />
      ) : (
        <FolderIcon className={folderClassName} />
      )}
      <div className="info tw-text-sm tw-relative tw-z-10">
        <Tooltip title={name}>
          <h4 className="tw-text-lg tw-font-medium tw-truncate">{name}</h4>
        </Tooltip>
        <div className="tw-flex tw-gap-1">
          <span className="tw-text-[#797979]">Всего письма:</span>
          <span className="tw-font-semibold">{totalCount}</span>
        </div>
        <div className="tw-flex tw-gap-1">
          <span className="tw-text-[#797979]">Прочитанные:</span>
          <span className="tw-font-semibold">{readCount}</span>
        </div>
        <div className="tw-flex tw-gap-1">
          <span className="tw-text-[#797979]">Непрочитанные:</span>
          <span className="tw-font-semibold">{unreadCount}</span>
        </div>
      </div>

      {Boolean(id) && (
        <IconButton
          ref={ref}
          className="tw-absolute tw-top-5 tw-right-2"
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            setSettingsOpen(true);
          }}
        >
          <SettingsIcon />
        </IconButton>
      )}

      <Popover
        onBackdropClick={(e) => {
          e.stopPropagation();
          setSettingsOpen(false);
        }}
        open={settingsOpen}
        anchorEl={ref.current}
        onClose={() => setSettingsOpen(false)}
        classes={{
          paper: "tw-rounded-[12px] tw-p-2 tw-shadow-lg",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box className="no-scrollbar" maxHeight="300px" overflow="auto">
          <List sx={{ minWidth: "200px" }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(folder);
                  setSettingsOpen(false);
                }}
              >
                <ListItemText primary={"Удалить"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(folder);
                  setSettingsOpen(false);
                }}
              >
                <ListItemText primary={"Изменить"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Popover>
    </div>
  );
};
