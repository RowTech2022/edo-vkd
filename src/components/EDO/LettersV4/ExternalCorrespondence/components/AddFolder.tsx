import { FC, useState } from "react";
import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AddFolderModal } from "./AddFolderModal";

interface IProps {
  minified?: boolean;
  isIncoming?: boolean;
  refetchFolders: () => void;
}

export const AddFolder: FC<IProps> = ({
  minified,
  refetchFolders,
  isIncoming,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  return (
    <div>
      {minified ? (
        <IconButton
          onClick={handleOpenModal}
          className="lettersV4-folder-btn tw-h-[30px] tw-w-[50px] tw-rounded-2xl"
        >
          <AddIcon />
        </IconButton>
      ) : (
        <div className="tw-flex tw-justify-end">
          <Button
            sx={{ borderRadius: "8px", color: "#fff", px: 3 }}
            className="lettersV4-add-btn"
            onClick={handleOpenModal}
            startIcon={<AddIcon />}
          >
            Создать папку
          </Button>
        </div>
      )}
      {open && (
        <AddFolderModal
          isIncoming={isIncoming}
          open={open}
          onClose={() => setOpen(false)}
          refetchFolders={refetchFolders}
        />
      )}
    </div>
  );
};
