import { FC } from "react";
import { IFolderItem } from "@services/lettersApiV4";
import clsx from "clsx";
import { useDynamicSearchParams } from "@hooks";

interface IProps {
  data: IFolderItem;
}

export const FolderCard: FC<IProps> = ({ data }) => {
  const { name, totalCount, readCount, unreadCount } = data;

  const { params, setParams } = useDynamicSearchParams();

  const isActive = params.folderId === String(data.id);

  return (
    <div
      className={clsx(
        "card  tw-rounded-lg tw-p-3 tw-mb-3",
        isActive ? "tw-bg-dark-blue tw-text-white" : "tw-bg-lighter-blue"
      )}
      onClick={() => setParams("folderId", String(data.id))}
    >
      <h4 className="tw-text-lg tw-font-medium tw-mb-2">{name}</h4>
      <div className="info tw-text-sm">
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
    </div>
  );
};
