import { FC } from "react";
import { AppRoutes } from "@configs";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router";
import { IncomingIcon, OutcomingIcon } from "@icons";
import { useDynamicSearchParams } from "@hooks";
import { FoldersList } from "./FoldersList";

const items = [
  {
    label: "Входящие",
    path: AppRoutes.LETTERS_V4_INCOMING,
    icon: <IncomingIcon />,
  },
  {
    label: "Исходящие",
    path: AppRoutes.LETTERS_V4_OUTCOMING,
    icon: <OutcomingIcon />,
  },
];

interface IProps {
  minified?: boolean;
  handleCancelMinified?: () => void;
}

export const IncomingSidebar: FC<IProps> = ({
  minified,
  handleCancelMinified,
}) => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const { params, setParams } = useDynamicSearchParams();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => () => {
    handleCancelMinified?.();
    if (path !== pathname) {
      navigate(path);
      setParams("folders", true);
    } else {
      setParams("folders", Boolean(!params.folders));
    }
  };

  return (
    <div className="tw-flex">
      <div className="tw-rounded-lg tw-rounded-tr-none tw-rounded-br-none tw-overflow-hidden tw-py-3 tw-bg-white tw-w-[250px] tw-min-h-[70vh] tw-shadow-md">
        {items.map(({ path, label, icon }) => {
          return (
            <div
              onClick={handleNavigate(path)}
              key={path}
              className={clsx(
                "tw-py-3 tw-px-3 tw-flex tw-items-center tw-gap-2 tw-cursor-pointer",
                {
                  "tw-bg-light-blue tw-border-l-2 tw-border-light-green":
                    isActive(path),
                  "tw-w-[20px] tw-overflow-hidden": minified,
                }
              )}
            >
              {icon}
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      <div
        className={clsx(
          "tw-rounded-tr-lg tw-rounded-br-lg tw-h-full tw-bg-light-blue tw-transition-all tw-duration-300",
          params.folders ? "tw-w-[180px] tw-opacity-100" : "tw-w-0 tw-opacity-0"
        )}
      >
        <FoldersList />
      </div>
    </div>
  );
};
