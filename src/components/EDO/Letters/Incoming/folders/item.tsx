import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import TabItem, { TabProps } from "@mui/material/Tab";
import cx from "classnames";
import { useLocation, useNavigate } from "react-router";
import { SyntheticEvent } from "react";
import { useDrop } from "react-dnd";
import {
  IncomingItem,
  useDeleteFolderMutation,
} from "@services/internal/incomingApi";
import styles from "./Item.module.css";

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
  const { pathname } = useLocation();
  const push = useNavigate();
  const [deleteFolder] = useDeleteFolderMutation();
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
  const handleDelete = (e: SyntheticEvent) => {
    e.stopPropagation();
    deleteFolder(props.value);
    if (pathname !== "/modules/latters/incomming/0") {
      push("/modules/latters/incomming/0");
    }
    refreshDataTable();
  };

  return (
    <TabItem
      {...props}
      sx={{ minHeight: "auto" }}
      ref={drop}
      icon={
        <IconButton onClick={handleDelete}>
          <DeleteOutlineIcon />
        </IconButton>
      }
      className={classNames}
      iconPosition="end"
    />
  );
}
