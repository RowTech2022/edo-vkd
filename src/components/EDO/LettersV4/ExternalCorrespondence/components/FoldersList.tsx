import { FC } from "react";
import { IFolderItem } from "@services/lettersApiV4";
import { FolderCard } from "./FolderCard";
import { AddFolder } from "./AddFolder";

interface IProps {
  folderList: IFolderItem[];
  isIncoming?: boolean;
  refetchData: () => void;
}

export const FoldersList: FC<IProps> = ({
  folderList,
  refetchData,
  isIncoming,
}) => {
  return (
    <div className="folders tw-px-2 tw-py-3">
      <div className="tw-flex tw-justify-end tw-mb-3">
        <AddFolder
          minified
          refetchFolders={refetchData}
          isIncoming={isIncoming}
        />
      </div>
      <div className="list tw-overflow-y-auto tw-max-h-[1080px]">
        {folderList?.map((item) => (
          <FolderCard key={item.id} data={item} refetchData={refetchData} />
        ))}
      </div>
    </div>
  );
};
