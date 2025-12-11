import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import TabItem, { TabProps } from "@mui/material/Tab";
import cx from "classnames";
import { SyntheticEvent } from "react";
import { useDrop } from "react-dnd";
import styles from "./Item.module.css";
import { IncomingItem } from "@services/lettersApiV3";
import { useLocation, useNavigate } from "react-router";
import { useDeleteOutcomingFolderLettersV4Mutation } from "@services/lettersApiV4";

interface ItemProps extends TabProps {
  selected?: boolean;
  moveToFolder: ({}: any) => void;
  refreshDataTable: () => void;
}

export default function Tab({
  moveToFolder,
  refreshDataTable,
  ...props
}: ItemProps) {
  const push = useNavigate();
  const { pathname: asPath } = useLocation();
  const [deleteFolder] = useDeleteOutcomingFolderLettersV4Mutation();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "folder",
    drop: (item: IncomingItem, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        moveToFolder({
          ids: [item.id],
          folderId: props.value,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const classNames = cx({
    [styles.hover]: isOver,
  });

  const handleDelete = async (e: SyntheticEvent) => {
    e.stopPropagation();
    await deleteFolder({ id: props.value } as any);
    refreshDataTable();
  };

  return (
    <TabItem
      ref={drop}
      {...props}
      sx={{
        minHeight: "auto",
        "&.MuiTab-labelIcon": { paddingY: "0 !important" },
      }}
      icon={
        <IconButton sx={{ padding: "4px" }} onClick={handleDelete}>
          <DeleteOutlineIcon />
        </IconButton>
      }
      className={classNames}
      iconPosition="end"
    />
  );
}
