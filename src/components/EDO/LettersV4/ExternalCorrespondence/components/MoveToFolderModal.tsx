import { FC } from "react";
import { FoldersListContainer } from "./FolderListContainer";
import { Dialog, DialogTitle } from "@mui/material";
import {
  IFolderItem,
  useMoveToFolderLettersV4Mutation,
  useMoveToFolderOutcomingLettersV4Mutation,
} from "@services/lettersApiV4";
import { toastPromise } from "@utils";
import { useDynamicSearchParams } from "@hooks";

interface IProps<T extends { id: number } = { id: number }> {
  item: T;
  open?: boolean;
  isIncoming?: boolean;
  onClose?: () => void;
  refetchData: () => void;
}

export const MoveToFolderModal: FC<IProps> = ({
  item,
  open,
  isIncoming,
  onClose,
  refetchData,
}) => {
  const { params } = useDynamicSearchParams();
  const [moveToFolder] = useMoveToFolderLettersV4Mutation();
  const [moveToFolderOutcoming] = useMoveToFolderOutcomingLettersV4Mutation();

  const handleSelectFolder = async (folder: IFolderItem) => {
    const request = isIncoming ? moveToFolder : moveToFolderOutcoming;

    const promise = request({
      ids: [item.id],
      folderId: folder.id,
    }).then(() => refetchData?.());
    await toastPromise(promise, {
      pending: `Письмо перемещается в папку ${folder.name}`,
      error: "Произошло ошибка",
      success: `Письмо успешно перемещено в папку ${folder.name}`,
    });
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={onClose}
      onBackdropClick={onClose}
      sx={{
        overflow: "hidden",
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          py: 2,
          pr: 10,
          background: "#607D8B",
          color: "#fff",
          borderTopLeftRadius: "35px",
          borderTopRightRadius: "35px",
        }}
        id="customized-dialog-title"
      >
        Переместить в папку
      </DialogTitle>
      <div className="tw-mb-8 tw-overflow-auto">
        <div className="tw-max-h-[90%] tw-overflow-y-auto tw-pb-8">
          <FoldersListContainer onSelectFolder={handleSelectFolder} />
        </div>
      </div>
    </Dialog>
  );
};
