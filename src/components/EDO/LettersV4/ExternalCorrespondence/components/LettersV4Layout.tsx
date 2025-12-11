import { FC, ReactNode } from "react";
import { LettersV4IncommingTab } from "./IncomingTabs";
import { IncomingSidebar } from "./IncomingSidebar";
import { useDynamicSearchParams } from "@hooks";
import { FoldersListContainer } from "./FolderListContainer";
import { IncomingTopTabs } from "./IncomingTopTabs";

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
        ) : (
          <div className="content tw-overflow-auto tw-flex-1 tw-rounded-lg tw-py-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
