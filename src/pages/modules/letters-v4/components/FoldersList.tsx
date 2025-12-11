import { FC } from "react";
import { useFetchFoldersQuery } from "@services/lettersApiV4";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FolderCard } from "./FolderCard";

export const FoldersList: FC = () => {
  const { data } = useFetchFoldersQuery("incoming");

  return (
    <div className="folders tw-px-2 tw-py-3">
      <div className="tw-flex tw-justify-end tw-mb-3">
        <IconButton className="lettersV4-folder-btn tw-h-[30px] tw-w-[50px] tw-rounded-2xl">
          <AddIcon />
        </IconButton>
      </div>
      <div className="list">
        {data?.map((item) => (
          <FolderCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};
