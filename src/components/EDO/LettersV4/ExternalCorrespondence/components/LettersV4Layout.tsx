import { FC, ReactNode } from "react";
import { LettersV4IncommingTab } from "./IncomingTabs";
import { IncomingSidebar } from "./IncomingSidebar";
import { useDynamicSearchParams } from "@hooks";
import { FoldersListContainer } from "./FolderListContainer";
import { IncomingTopTabs } from "./IncomingTopTabs";
import LettersV4NewIncomingRegistry from "../Incoming/LettersV4NewIncomingsList";
import LettersV4NewOutcomingRegistry from "../Outcoming/LettersV4OutcomingsList";

interface IProps {
  children?: ReactNode;
  items: any[];
  folderList: any;
  refetchData: () => void;
}

export const LettersV4Layout: FC<IProps> = ({
  children,
  items,
  folderList,
  refetchData,
}) => {
  const { params, setParams } = useDynamicSearchParams();

  // Проверяем, выбрана ли корзина, архив или закреплённый
  const isCartArchivePinned =
    params.tab === LettersV4IncommingTab.CART ||
    params.tab === LettersV4IncommingTab.ARCHIVE ||
    params.tab === LettersV4IncommingTab.PINNED;

  // Определяем, какой реестр показывать
  const cartType = params.cartType;
  const archiveType = params.archiveType;
  const pinnedType = params.pinnedType;

  // Показываем реестр только если выбран тип (cartType, archiveType или pinnedType)
  const hasTypeSelected = cartType || archiveType || pinnedType;

  const isOutcoming =
    cartType === "outcomming" ||
    archiveType === "outcomming" ||
    pinnedType === "outcomming";

  return (
    <div>
      <IncomingTopTabs />
      <div className="tw-flex tw-gap-3">
        <div className=" tw-py-4">
          <IncomingSidebar
            items={items}
            folderList={folderList}
            refetchData={refetchData}
          />
        </div>
        {params.tab === LettersV4IncommingTab.FOLDERS ? (
          <div className="tw-flex-1">
            <FoldersListContainer refetchData={refetchData} />
          </div>
        ) : isCartArchivePinned && hasTypeSelected ? (
          <div className="content tw-overflow-auto tw-flex-1 tw-rounded-lg">
            {isOutcoming ? (
              // Показываем реестр исходящих при выборе "Исходящие"
              <LettersV4NewOutcomingRegistry skipLayout={true} />
            ) : (
              // Показываем реестр входящих при выборе "Входящие" или по умолчанию
              <LettersV4NewIncomingRegistry skipLayout={true} />
            )}
          </div>
        ) : (
          <div className="content tw-overflow-auto tw-flex-1 tw-rounded-lg">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
