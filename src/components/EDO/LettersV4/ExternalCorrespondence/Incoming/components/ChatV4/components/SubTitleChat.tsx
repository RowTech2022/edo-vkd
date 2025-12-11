import React, { useEffect, useState, useContext } from "react";
import { Button, Avatar, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import InputTabName from "./InputTabName";
import { IncomingCreateV4Context } from "../../../create";
import { fileNameRegex, wordExtensions, filterOutWordFiles } from "../ChatV4";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper/modules";
import DocumentPdf from "./DocumentPdf";

const SubTitleChat = ({
  showedUsers,
  setSubUserChats,
  handlePostThirdVisa,
  initialValues,
  setSubTab,
  setThirdExecutorObj,
  isActiveSubVisa,
  selectedSubTab,
  setSelectedSubTab,
  chatInfo,
  setChatInfo,
  isConclusion,
}: {
  showedUsers: any;
  setSubUserChats: any;
  handlePostThirdVisa: (body: any) => void;
  initialValues: any;
  setSubTab: any;
  setThirdExecutorObj: any;
  isActiveSubVisa: boolean;
  thirdExecutorObj: any;
  selectedSubTab: number | string;
  setSelectedSubTab: any;
  chatInfo: any;
  setChatInfo: any;
  isConclusion: number;
}) => {
  const { fileItem } = useContext(IncomingCreateV4Context);
  const [tabName, setTabName] = useState(false);
  const [showDocPdf, setShowDocPdf] = useState(false);
  const [showDocX, setShowDocX] = useState({
    state: false,
    file: "",
  });

  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedVisa, setSelectedVisa] = useState([]);

  const handleShowTabName = (state: boolean) => {
    setTabName(state);
  };

  useEffect(() => {
    if (isConclusion) {
      initialValues?.child?.[Object.keys(initialValues?.child)[0]]?.executors
        ?.filter((elem: any) => elem.child[selectedSubTab])
        ?.forEach((elem: any) => {
          setSubUserChats(
            elem.child[selectedSubTab]?.executors?.map((item: any) => {
              return {
                id: +item.responsible.id,
                executorId: item.id,
                name: item.responsible.value,
                role: item.position,
                image: item.avatar,
                conclusions: item.conclusions,
                userId: +item?.responsible?.id,
                isMerger: item?.isMerger,
              };
            })
          );
        });
    }
  }, [initialValues, isConclusion]);

  return (
    <>
      <header className="tw-bg-[#f5f5f5] tw-p-[30px] tw-flex tw-justify-between tw-items-center tw-flex-wrap">
        <div className="wrapper-tabs tw-flex tw-items-end tw-gap-2 tw-max-w-[46%]">
          <Button
            onClick={() => {
              setSubTab(false);
              setChatInfo({
                chatId:
                  initialValues?.child?.[Object.keys(initialValues?.child)[0]]
                    ?.chatId,
                transitions:
                  initialValues?.child?.[Object.keys(initialValues?.child)[0]]
                    ?.transition?.buttonSettings,
              });
              setSelectedSubTab(0);
              setSubUserChats(
                initialValues?.child?.[
                  Object.keys(initialValues?.child)[0]
                ]?.executors?.map((el: any, i: number) => {
                  return {
                    executorId: el.id,
                    id: +el.responsible.id,
                    name: el.responsible.value,
                    role: el.position,
                    image: el.avatar,
                    conclusions: el.conclusions,
                    isMerger: el?.isMerger,
                    userId: +el.responsible.id,
                  };
                })
              );
            }}
            variant={!isActiveSubVisa ? "contained" : "outlined"}
          >
            Исполнители
          </Button>
          <div className="tw-overflow-x-auto tw-max-w-[70%]">
            <div className="wrapper-sub-tabs tw-flex tw-gap-5">
              {initialValues?.child?.["Исполнители"]?.executors?.map(
                (el: any, i: number) => {
                  const tabs = Object.keys(el.child);

                  return tabs?.map((e: string, ind: number) => {
                    return (
                      <Button
                        onClick={() => {
                          setSubTab(true);
                          setThirdExecutorObj(el);
                          setChatInfo({
                            chatId: el.child[e]?.chatId,
                            transitions:
                              el.child[e]?.transition?.buttonSettings,
                          });
                          setSubUserChats(
                            el.child[e]?.executors?.map((el: any) => {
                              return {
                                id: +el.responsible.id,
                                executorId: el.id,
                                name: el.responsible.value,
                                role: el.position,
                                image: el.avatar,
                                conclusions: el.conclusions,
                                isMerger: el?.isMerger,
                                userId: +el.responsible.id,
                              };
                            })
                          );

                          setSelectedSubTab(e);
                        }}
                        key={`subtab-${ind + 1}`}
                        variant={
                          isActiveSubVisa && selectedSubTab === e
                            ? "contained"
                            : "outlined"
                        }
                        sx={{
                          fontSize: "13px",
                          height: "30px",
                          fontWeight: 300,
                          position: "relative",
                          minWidth: "max-content",
                        }}
                      >
                        <p className="tw-overflow-ellipsis tw-overflow-hidden tw-whitespace-nowrap">
                          {e}
                        </p>
                      </Button>
                    );
                  });
                }
              )}
            </div>
          </div>

          <IconButton
            disabled={chatInfo?.transitions?.add_tab?.readOnly}
            onClick={() => {
              handleShowTabName(true);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "#007bd220",
              },
            }}
          >
            <AddIcon />
          </IconButton>
          {tabName && (
            <InputTabName
              handleShowTabName={handleShowTabName}
              handlePostThirdVisa={handlePostThirdVisa}
              selectedUser={selectedUser}
              selectedVisa={selectedVisa}
              setSelectedUser={setSelectedUser}
              setSelectedVisa={setSelectedVisa}
            />
          )}
        </div>

        <div className="tw-flex tw-flex-row tw-items-center tw-space-x-3 tw-justify-between tw-max-w-[54%]">
          <div className="tw-max-w-[85%] tw-overflow-x-auto">
            <div className="tw-flex tw-items-center tw-gap-2">
              {fileItem?.map((item: { url: string }, i: number) => {
                return (
                  <div
                    key={`file-${i + 1}`}
                    className="wrapper-document tw-flex tw-items-center tw-gap-2 tw-w-full"
                  >
                    <Button
                      onClick={() => {
                        if (
                          wordExtensions.some((ext) =>
                            item?.url?.toLowerCase().includes(ext)
                          )
                        ) {
                          setShowDocX({
                            state: true,
                            file: item?.url,
                          });
                        } else {
                          setShowDocPdf(true);
                        }
                      }}
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        fontWeight: "400",
                        width: "100%",
                      }}
                    >
                      <p className="tw-text-[14px] tw-text-[#000] tw-overflow-ellipsis tw-overflow-hidden tw-whitespace-nowrap">
                        {item?.url?.match(fileNameRegex)?.[0]}
                      </p>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel-user tw-flex tw-items-end tw-gap-2">
            {showedUsers?.map((e: any) => {
              return (
                <Tooltip
                  title={e?.value + " / " + e?.positionName || ""}
                  placement="top-start"
                >
                  <IconButton key={e.id}>
                    <Avatar
                      src={e.avatar}
                      sx={{ width: "35px", height: "35px" }}
                    />
                  </IconButton>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {showDocX?.state && (
          <div
            onClick={(event) => {
              event.stopPropagation();
              setShowDocX({
                state: false,
                file: "",
              });
            }}
            className="wrapper-pdf tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-10 tw-bg-[#00000020] tw-backdrop-blur-sm"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="pdf tw-w-[35%] tw-h-[80vh] tw-absolute tw-translate-x-[-50%] tw-translate-y-[-50%] tw-top-1/2 tw-left-1/2 tw-shadow-lg tw-border-[1px] tw-rounded-lg"
            >
              <DocumentPdf url={showDocX?.file} />
            </div>
          </div>
        )}

        {showDocPdf && (
          <div
            onClick={(event) => {
              event.stopPropagation();
              setShowDocPdf(false);
            }}
            className="wrapper-pdf tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-10 tw-bg-[#00000020] tw-backdrop-blur-sm"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="pdf tw-w-[35%] tw-h-[80vh] tw-absolute tw-translate-x-[-50%] tw-translate-y-[-50%] tw-top-1/2 tw-left-1/2 tw-shadow-lg tw-border-[1px] tw-rounded-lg"
            >
              <Swiper
                pagination={{
                  type: "fraction",
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
              >
                {filterOutWordFiles(fileItem)?.map((el: any, i: number) => {
                  return (
                    <SwiperSlide key={`file-${i + 1}`}>
                      <div className="swiper-no-swiping">
                        <DocumentPdf url={el.url} />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default SubTitleChat;
