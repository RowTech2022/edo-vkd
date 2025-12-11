import { FC } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { ArchiveIcon, CartIcon, FoldersIcon, PinnedIcon } from "@ui";
import clsx from "clsx";
import { useDynamicSearchParams } from "@hooks";

export enum LettersV4IncommingTab {
  CART = "cart",
  ARCHIVE = "archive",
  PINNED = "pinned",
  FOLDERS = "folders",
}

const tabs = [
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

  const topTab = (
    <div className="tab tw-mb-2 tw-flex tw-gap-6 tw-text-[#252525] tw-text-[16px] tw-font-bold">
      <MenuIcon />
      <div className="tw-cursor-pointer tw-border-b-2 tw-border-[#5F8CA1]">
        Письма
      </div>
      <div className="tw-cursor-pointer">Аналитика</div>
    </div>
  );

  return (
    <div className="tw-h-[90px] lettersV4-gradient tw-rounded-[12px] tw-p-2">
      {topTab}

      <div className="tw-bg-white tw-rounded-lg tw-h-[40px] tw-py-1 tw-flex tw-gap-6 tw-text-[14px] tw-font-medium tw-px-2">
        {tabs.map((item) => (
          <div
            onClick={() => {
              setParams("tab", item.key);
            }}
            className={clsx(
              "tw-flex tw-gap-1 tw-items-center tw-cursor-pointer tw-rounded-md tw-px-2",
              {
                "tw-bg-[#B0DAF0]": activeTab === item.key,
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
