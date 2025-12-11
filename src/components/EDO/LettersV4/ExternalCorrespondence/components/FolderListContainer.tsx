import { FC, useEffect, useState } from "react";
import {
  IFolderItem,
  useDeleteLetterV4FolderMutation,
  useDeleteOutcomingFolderLettersV4Mutation,
  useFetchFoldersOutcomingLettersV4Query,
  useFetchFoldersQuery,
} from "@services/lettersApiV4";
import { FolderListCard } from "./FolderListCard";
import { AddFolder } from "./AddFolder";
import { useNavigate } from "react-router";
import { AppRoutes } from "@configs";
import clsx from "clsx";
import { AddFolderModal } from "./AddFolderModal";
import { toastPromise } from "@utils";
import { useDynamicSearchParams } from "@hooks";

interface IProps {
  onSelectFolder?: (folder: IFolderItem) => void;
  refetchData?: () => void;
}

export const FoldersListContainer: FC<IProps> = ({
  onSelectFolder,
  refetchData,
}) => {
  const { params } = useDynamicSearchParams();

  const isIncoming = params.folderType === "incomming";

  const { data, refetch } = useFetchFoldersQuery({});
  const { data: outcomingList, refetch: refetchOutcomingFolders } =
    useFetchFoldersOutcomingLettersV4Query({});

  const [selectedFolder, setSelectedFolder] = useState<IFolderItem | null>(
    null
  );

  const [deleteFolder] = useDeleteLetterV4FolderMutation();
  const [deleteFolderOutcoming] = useDeleteOutcomingFolderLettersV4Mutation();

  const [searchValue, setSearchValue] = useState(null);

  const navigate = useNavigate();

  const handleRefetchAllFolders = () => {
    if (isIncoming) {
      refetchData?.();
      refetch?.();
    } else {
      refetchOutcomingFolders?.();
      refetchData?.();
    }
  };

  const handleDeleteFolder = (folder: IFolderItem) => {
    const deleteFolderRequest = isIncoming
      ? deleteFolder
      : deleteFolderOutcoming;

    const promise = deleteFolderRequest({ id: folder.id as number }).then(
      () => {
        handleRefetchAllFolders();
      }
    );

    toastPromise(promise, {
      pending: `Папка ${folder.name} удаляется`,
      error: "Произошло ошибка",
      success: `Папка ${folder.name} успешно удалена`,
    });
  };

  const handleNavigateToFolder = (item: IFolderItem) => () => {
    navigate(`${AppRoutes.LETTERS_V4_INCOMING}?folderId=${item.id}`);
  };

  useEffect(() => {
    if (isIncoming) refetch?.();
    else refetchOutcomingFolders?.();
  }, [isIncoming]);

  return (
    <div className="folders tw-px-2 tw-py-3 tw-min-w-[900px] tw-min-h-[720px]">
      {!onSelectFolder && (
        <div className="tw-flex tw-justify-end tw-mb-3">
          <AddFolder
            refetchFolders={handleRefetchAllFolders}
            isIncoming={isIncoming}
          />
        </div>
      )}
      <input
        onChange={({ target }) => {
          if (target.value.length) {
            setSearchValue(target.value);
          } else {
            setSearchValue(null);
          }
        }}
        value={searchValue}
        type="text"
        placeholder="Поиск папки ..."
        className="tw-bg-[transparent] tw-my-3 tw-border-[1px] tw-border-[#607D8B] tw-outline-none tw-p-[5.7px] tw-w-[20%] tw-rounded-[5px] placeholder:tw-font-light"
      />
      <div className="list tw-flex tw-flex-wrap tw-gap-2">
        {((isIncoming ? data?.items : outcomingList?.items) ?? [])
          ?.filter((user: any) => {
            if (searchValue) {
              return user.name
                .toLowerCase()
                .includes(searchValue.toLowerCase());
            }
            return true;
          })
          ?.map((item) => (
            <div
              key={item.id}
              onClick={
                onSelectFolder
                  ? () => onSelectFolder(item)
                  : handleNavigateToFolder(item)
              }
              className={clsx(
                "tw-cursor-pointer tw-transition-transform tw-duration-300",
                { "hover:tw-scale-105": onSelectFolder }
              )}
            >
              <FolderListCard
                key={item.id}
                folder={item}
                onDelete={handleDeleteFolder}
                onUpdate={() => setSelectedFolder(item)}
              />
            </div>
          ))}
      </div>

      <AddFolderModal
        isIncoming={isIncoming}
        open={Boolean(selectedFolder)}
        onClose={() => setSelectedFolder(null)}
        folderId={selectedFolder?.id as number}
        refetchFolders={handleRefetchAllFolders}
      />
    </div>
  );
};
