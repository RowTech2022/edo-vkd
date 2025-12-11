import { FC, useMemo, useState } from "react";
import { AppRoutes } from "@configs";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router";
import { IncomingIcon, OutcomingIcon } from "@icons";
import { useDynamicSearchParams, useResizable } from "@hooks";
import { useFetchModulesQuery } from "@services/modulesApi";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { IFolderItem } from "@services/lettersApiV4";
import { incomingTabs, LettersV4IncommingTab } from "./IncomingTabs";
import { FoldersList } from "./FoldersList";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  formatDate,
  getStatusColor,
  getStatusName,
} from "../../../../../shared/utils";

const menuItems = [
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
  items: any[];
  folderList: IFolderItem[];
  refetchData?: () => void;
}

export const IncomingSidebar: FC<IProps> = ({
  items,
  folderList,
  refetchData,
}) => {
  const { pathname } = useLocation();

  const [foldersOpen, setFoldersOpen] = useState(false);

  const { width, startResizing, setRef } = useResizable(
    "folders",
    260,
    150,
    500
  );
  const {
    width: menuWidth,
    startResizing: startResizingMenu,
    setRef: setRefMenu,
  } = useResizable("registry", 250, 150, 500);

  const { data: edoModules, isSuccess } = useFetchModulesQuery();

  const moduleItems = edoModules.items ?? [];

  const navigate = useNavigate();

  const { params, setParams } = useDynamicSearchParams();

  const menuItems = useMemo(() => {
    const innerModules =
      moduleItems.find((item: any) => item.modulName === "letters-v4")
        ?.subModuls ?? [];

    return innerModules.map((item: any) => {
      return {
        label: item.name,
        path: `/modules/letters-v4/${item.modulName}`,
        id: item.modulName,
        icon:
          item.modulName === "incomming" ? <IncomingIcon /> : <OutcomingIcon />,
        active: item?.active,
      };
    });
  }, [moduleItems, pathname]);

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    const params: any = {
      minified: "",
      recordId: "",
      tab: "",
    };
    if (path !== pathname || params.minified) {
      navigate(path);
    }

    setParams(params);
  };

  const getCurrentActive = () => {
    if (!params.tab) {
      return isActive(AppRoutes.LETTERS_V4_INCOMING) ? 1 : 2;
    }

    return incomingTabs.findIndex((item) => isActiveTab(item.key)) + 2;
  };

  const isActiveTab = (key: LettersV4IncommingTab) => {
    const activeTab = Number(params.tab);
    if (params.tab === LettersV4IncommingTab.FOLDERS && params.tab === key)
      return true;

    return activeTab === key && isActive(AppRoutes.LETTERS_V4_INCOMING);
  };

  // console.log("MenuItems: ", menuItems);

  return (
    <div className="tw-flex tw-gap-3">
      <div className="tw-flex tw-flex-1">
        <div
          ref={setRefMenu}
          onMouseDown={!params.minified && startResizingMenu}
          className={clsx(
            "tw-mb-3 tw-rounded-lg tw-rounded-tr-none tw-rounded-br-none tw-overflow-hidden tw-py-3 tw-bg-white tw-min-h-[70vh] tw-shadow-md tw-transition-[width] tw-duration-300"
          )}
          style={{
            width: params.minified ? "50px" : `${menuWidth}px`,
          }}
        >
          <div
            className={clsx(
              "tw-flex tw-justify-end tw-mb-1",
              params.minified ? "tw-mr-2" : ""
            )}
          >
            <IconButton
              size="small"
              onClick={() =>
                setParams("minified", params.minified ? "" : "true")
              }
            >
              <ChevronLeftIcon
                className={clsx("tw-relative", {
                  "tw-rotate-180": params.minified,
                })}
              />
            </IconButton>
          </div>
          <div className="tw-mb-3">
            {menuItems.map(({ path, label, icon }, index: number) => {
              // console.log("FoldersOpen: ", foldersOpen);
              const isCurrentActive = isActive(path) && !params.tab;
              return (
                <div key={index + 1}>
                  <div
                    onClick={() => {
                      // console.log("IsCurre: ", isCurrentActive);
                      if (!isCurrentActive) {
                        // console.log("Navigate: ", path);
                        handleNavigate(path);
                      } else {
                        // console.log("SETFoldersOpen: ", foldersOpen);
                        setFoldersOpen(!foldersOpen);
                      }
                    }}
                    key={path}
                    className={clsx(
                      "tw-py-3 tw-px-3 tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-whitespace-nowrap",
                      {
                        "lettersV4-gradient  tw-border-l-2 tw-border-light-green":
                          isCurrentActive,
                      }
                    )}
                  >
                    <span className="tw-w-[20px]">{icon}</span>
                    <span className={clsx({ "tw-opacity-0": params.minified })}>
                      {label}
                    </span>
                  </div>

                  <div
                    className={clsx(
                      "tw-rounded-tr-lg tw-rounded-br-lg tw-w-full tw-bg-light-blue tw-transition-all tw-duration-500 tw-ease-in",
                      isCurrentActive && foldersOpen && !params.minified
                        ? "tw-max-h-[120rem] tw-opacity-100"
                        : "tw-max-h-0 tw-opacity-0 tw-pointer-events-none"
                    )}
                  >
                    <FoldersList
                      folderList={folderList}
                      refetchData={refetchData}
                      isIncoming={path === AppRoutes.LETTERS_V4_INCOMING}
                    />
                  </div>
                </div>
              );
            })}
            {incomingTabs.map(({ key, title, icon }, index: number) => {
              return (
                <div key={index + 1}>
                  <div
                    onClick={() => {
                      navigate(AppRoutes.LETTERS_V4_INCOMING);
                      setParams({
                        tab: key,
                        recordId: "",
                        folderType:
                          key === LettersV4IncommingTab.FOLDERS
                            ? "incomming"
                            : "",
                      });
                    }}
                    key={key}
                    className={clsx(
                      "tw-py-3 tw-px-3 tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-whitespace-nowrap tw-transition-colors tw-duration-700",
                      {
                        "lettersV4-gradient ": isActiveTab(key),
                      }
                    )}
                  >
                    <span className="tw-w-[20px]">{icon}</span>
                    <span className={clsx({ "tw-opacity-0": params.minified })}>
                      {title}
                    </span>
                  </div>
                  {key === LettersV4IncommingTab.FOLDERS && (
                    <div
                      className={clsx(
                        "tw-rounded-tr-lg tw-rounded-br-lg tw-w-full tw-bg-light-blue tw-transition-all tw-duration-500 tw-ease-in",
                        key === params.tab && !params.minified
                          ? "tw-max-h-[120rem] tw-opacity-100"
                          : "tw-max-h-0 tw-opacity-0 tw-pointer-events-none"
                      )}
                    >
                      {menuItems.map(({ path, label, icon, id, active }) => {
                        // console.log("Id: ", id);
                        return (
                          <div
                            key={path}
                            onClick={() => {
                              setParams({
                                folderType: id,
                              });
                            }}
                            className={clsx(
                              "tw-py-3 tw-px-3 tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-whitespace-nowrap",
                              {
                                "lettersV4-gradient  tw-border-l-2 tw-border-light-green":
                                  params.folderType === id || active,
                              }
                            )}
                          >
                            <span className="tw-w-[20px]">{icon}</span>
                            <span
                              className={clsx({
                                "tw-opacity-0": params.minified,
                              })}
                            >
                              {label.slice(0, label.indexOf(" "))} папки
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        ref={setRef}
        onMouseDown={startResizing}
        className={clsx("tw-overflow-hidden tw-transition-all tw-duration-300")}
        style={{
          width: params.recordId ? width : 0,
          opacity: params.recordId ? 1 : 0,
        }}
      >
        <div className="list tw-bg-white tw-rounded-lg tw-h-full">
          {items.map((item, idx) => (
            <Tooltip
              placement="right"
              title={item.contragent?.value || ""}
              key={idx}
            >
              <div
                className={clsx(
                  "tw-flex tw-flex-col tw-gap-2 tw-cursor-pointer hover:tw-bg-slate-50 tw-border-b tw-border-solid tw-border-[#E9E9E9] tw-p-3",
                  { "tw-bg-slate-200": item.id == params.recordId }
                )}
                onClick={() => setParams("recordId", item.id)}
              >
                <span className="tw-font-medium tw-whitespace-nowrap tw-truncate">
                  {item.contragent?.value}
                </span>
                <span className="tw-text-[#25252580]">{item.header}</span>
                <div className="tw-flex tw-justify-between tw-w-full tw-items-center">
                  <Chip
                    label={getStatusName(item.state, "income_v4")}
                    sx={{
                      backgroundColor: getStatusColor(item.state),
                      fontSize: "12px",
                      py: "2px",
                      height: "24px",
                    }}
                  />
                  <span className="tw-text-[10px] tw-text-[#25252580]">
                    {formatDate(item.createdDate, true)}
                  </span>
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};
