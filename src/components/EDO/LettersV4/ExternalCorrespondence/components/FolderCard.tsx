import { FC } from "react";
import {
  IFolderItem,
  useExitFolderIncomingLettersV4Mutation,
  useMoveToFolderLettersV4Mutation,
} from "@services/lettersApiV4";
import clsx from "clsx";
import { useDynamicSearchParams } from "@hooks";
import { useDrop } from "react-dnd";
import { toastPromise } from "@utils";
import Badge from "@mui/material/Badge";
import { IconButton, Tooltip } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import "./folderCard.css";
import { toast } from "node_modules/react-toastify/dist";

interface IProps {
  data: IFolderItem;
  exitVisible?: boolean;
  refetchData: () => void;
}

export const FolderCard: FC<IProps> = ({
  exitVisible = true,
  data,
  refetchData,
}) => {
  const { name, totalCount, readCount, unreadCount } = data;

  const { params, setParams } = useDynamicSearchParams();

  const [moveToFolder] = useMoveToFolderLettersV4Mutation();
  const [exitFolder] = useExitFolderIncomingLettersV4Mutation();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "folder",
    drop: (item: any, monitor) => {
      const didDrop = monitor.didDrop();

      const promise = moveToFolder({
        ids: [item.id],
        folderId: data.id,
      }).then(() => refetchData?.());
      if (!didDrop) {
        toastPromise(promise, {
          pending: `Письмо перемещается в папку ${name}`,
          error: "Произошло ошибка",
          success: `Письмо успешно перемещено в папку ${name}`,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleExitFolder = (e: any) => {
    e.stopPropagation();

    const promise = exitFolder({ id: Number(data.id)! }).then(() =>
      refetchData?.()
    );

    toastPromise(promise, {
      pending: `Выход из папки ${name}`,
      error: "Произошло ошибка",
      success: `Вы успешно вышли из папки ${name}`,
    });
  };

  const isActive = params.folderId === String(data.id) || data.active;

  return (
    <Badge
      color="error"
      badgeContent={unreadCount}
      sx={{
        width: "93%",
        marginTop: "12px",
        "& .MuiBadge-badge": {
          fontSize: "0.9rem",
          fontWeight: "bold",
          minWidth: "25px",
          height: "25px",
          borderRadius: 99999,
        },
      }}
      classes={{ badge: unreadCount > 0 ? "pulseBadge" : "" }}
    >
      <div
        ref={drop}
        className={clsx(
          "card  tw-rounded-lg tw-p-3 tw-pb-5 tw-mb-3 tw-w-full tw-relative",
          isActive ? "tw-bg-dark-blue tw-text-white" : "tw-bg-lighter-blue"
        )}
        onClick={() =>
          setParams({
            folderId: String(data.id),
            recordId: "",
            state: data.state || "",
          })
        }
      >
        <h4 className="tw-text-lg tw-font-medium">{name}</h4>
        {exitVisible && Number(data?.id) > 0 && (
          <div className="tw-absolute tw-bottom-0 tw-right-0">
            <Tooltip title="Выйти из папки">
              <IconButton color="error" onClick={handleExitFolder}>
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {/* {Boolean(unreadCount) && (
          <div className="tw-flex tw-gap-1">
            <span className="tw-text-[#797979]">Непрочитанные:</span>
            <span className="tw-font-semibold">{unreadCount}</span>
          </div>
        )} */}
      </div>
    </Badge>
  );
};
