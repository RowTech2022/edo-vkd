import { FC } from "react";
import { ArchiveIcon, CartIcon, FoldersIcon, PinnedIcon } from "@ui";
import clsx from "clsx";
import { useDynamicSearchParams } from "@hooks";

export enum LettersV4IncommingTab {
  CART = 1,
  ARCHIVE = 2,
  PINNED = 3,
  FOLDERS = "folders",
}

export const incomingTabs = [
  {
    icon: <CartIcon />,
    title: "Корзина",
    key: LettersV4IncommingTab.CART,
  },
  {
    icon: <ArchiveIcon />,
    title: "Архив",
    key: LettersV4IncommingTab.ARCHIVE,
  },
  {
    icon: <PinnedIcon />,
    title: "Закреплённый",
    key: LettersV4IncommingTab.PINNED,
  },
  {
    icon: <FoldersIcon />,
    title: "Папки",
    key: LettersV4IncommingTab.FOLDERS,
  },
];

export const IncomingTabs: FC = () => {
  const { params, setParams } = useDynamicSearchParams();

  const activeTab = params.tab;

  return (
    <div className="tw-rounded-[12px] tw-p-2 tw-mb-3">
      <div className="tw-bg-white tw-rounded-lg tw-py-1 tw-flex tw-flex-wrap tw-gap-2 tw-text-[14px] tw-font-medium tw-px-2">
        {incomingTabs.map((item) => (
          <div
            onClick={() => {
              if (params.tab == item.key) {
                setParams("tab", "");
              } else {
                setParams("tab", item.key);
              }
            }}
            className={clsx(
              "tw-flex tw-gap-1 tw-items-center tw-cursor-pointer tw-rounded-md tw-px-2",
              {
                "tw-bg-[#B0DAF0]": activeTab == item.key,
              }
            )}
          >
            <span>{item.icon}</span>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
