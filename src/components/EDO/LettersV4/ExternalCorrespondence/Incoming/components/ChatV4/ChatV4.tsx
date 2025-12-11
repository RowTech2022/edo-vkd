import React, { useEffect, useState, useMemo, useContext } from "react";
import MemoVisa from "./components/MemoVisa";
import TabVisa from "./components/TabVisa";
import { Button, IconButton, MenuItem, TextField, Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatUser from "./components/ChatUser";
import StructureOrganizations from "./components/StructureOrganizations";
import LoadingChat from "./components/LoadingChat";
import EditExecutorsModal from "./components/EditExecutorsModal";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";
import {
  useChangeExecutorsMutation,
  useChangeVisaTypesMutation,
} from "@services/lettersApiV4";
import { downloadFile } from "../File";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import "./chatV4.css";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modulesd  s
import { Pagination, Navigation } from "swiper/modules";
import VisaModal from "./components/VisaModal";
import DocumentPdf from "./components/DocumentPdf";
import TitleChat from "./components/TitleChat";
import { IncomingCreateV4Context } from "../../create";
import { toast } from "react-toastify";
import { IValueId } from "src/services";
import EditVisaModal from "./components/EditVisaModal";

export const fileNameRegex = /([^\\?]+\.(pdf|docx?|PDF|DOCX?|xls|xlsx))/;
export const wordExtensions = [
  ".doc",
  ".docx",
  ".dot",
  ".dotx",
  ".rtf",
  ".xls",
  ".xlsx",
];

export function filterOutWordFiles(files: { url: string }[]) {
  return files.filter((file: { url: string }) => {
    const urlLower = file.url.toLowerCase();
    return !wordExtensions.some((ext) => urlLower.includes(ext));
  });
}

function ChatV4({
  modalState,
  setModalState,
  mainExecutor,
  executer,
  fileItem,
  makeVisaClick,
  makeSubVisaClick,
  makeThirdVisaClick,
  initialValues,
  mainDTO,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
  mainExecutor?: IValueId;
  executer: string | null;
  fileItem: any;
  makeVisaClick: (body: any) => void;
  makeSubVisaClick: (body: any) => void;
  makeThirdVisaClick: (body: any) => void;
  initialValues: any;
  mainDTO: any;
}) {
  const { refetchData, letterId } = useContext(IncomingCreateV4Context);
  const [showStructure, setShowStructure] = useState(false);
  const [visaListTemp, setVisaListTemp] = useState([]);
  const [userChats, setUsersChats] = useState([]);
  const [termDate, setTermData] = useState([]);
  const [visaStatusTemp, setVisaStatusTemp] = useState(null);
  const [showVisa, setShowVisa] = useState(false);
  const [showEditVisa, setShowEditVisa] = useState(false);
  const [showDocPdf, setShowDocPdf] = useState(false);
  const [showDocX, setShowDocX] = useState({
    state: false,
    file: "",
  });
  const [date, setDate] = useState("");
  const [selectedUserChat, setSelectedUserChat] = useState(null);
  const [memoState, setMemoState] = useState(false);
  const [editExecutorsModal, setEditExecutorsModal] = useState(false);
  const [mergerId, setMergerId] = useState(null);

  const [calendarOpen, setCalendarOpen] = useState(false);

  const memoUserChats = useMemo(() => userChats, [memoState]);

  const memoVisaListTemp = useMemo(() => visaListTemp, [memoState]);

  const { data: userDetails } = useFetchUserDetailsQuery();
  const [changeExecutorsMutate] = useChangeExecutorsMutation();
  const [changeVisaTypesMutate] = useChangeVisaTypesMutation();

  const handleChange = (value: any) => {
    setDate(moment(value).format("YYYY-MM-DD"));
  };

  const handlePostTermDate = (date: string) => {
    if (date) {
      const [year, month, day] = date?.split("-");
      const newObj = {
        id: Date.now().toString(),
        date: `${day}.${month}.${year}`,
      };
      setTermData([newObj]);
    }
  };

  const handlePostVisaStatusTemp = (value: number) => {
    const newObj = {
      name: value === 1 ? "Фаври" : value === 2 ? "Назорати" : "",
      status: value,
    };
    setVisaStatusTemp(newObj);
  };

  const editExecutors = () => {
    changeExecutorsMutate({
      incomingId: letterId,
      tabName: null,
      userIds: userChats?.map((el: any) => el.userId),
    }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        setEditExecutorsModal(false);
        refetchData();
      } else {
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  const editVisa = () => {
    changeVisaTypesMutate({
      incomingId: letterId,
      visaTypeIds: visaListTemp?.map((el: any) => +el.id),
    }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        setShowEditVisa(false);
        refetchData();
      } else {
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  useEffect(() => {
    if (initialValues?.id) {
      setMemoState(!memoState);
      handlePostVisaStatusTemp(initialValues?.executorType);
      if (initialValues?.term) {
        const formattedDate = format(
          new Date(initialValues?.term),
          "yyyy-MM-dd"
        );
        handlePostTermDate(formattedDate);
        handleChange(formattedDate);
      } else {
        console.error("Invalid term date value");
      }
      if (
        initialValues &&
        initialValues?.child[Object.keys(initialValues?.child)[0]]?.executors
          ?.length
      ) {
        setUsersChats(
          initialValues?.child?.[
            Object.keys(initialValues?.child)[0]
          ]?.executors?.map((el: any) => ({
            id: +el.responsible?.id,
            executorId: el.id,
            name: el.responsible.value,
            role: el.position,
            image: el.avatar,
            chatId: el.chatId,
            parentId: el.parentId,
            userId: +el?.responsible?.id,
            transitions: el?.transitions?.buttonSettings,
            conclusions: el.conclusions,
            isMerger: el?.isMerger,
          }))
        );
      }

      setVisaListTemp(
        initialValues?.visaTypes?.map((el: any) => ({
          id: el.id,
          name: el.value,
        }))
      );
    }
  }, [initialValues]);

  return (
    <Dialog
      sx={{
        "& .MuiPaper-root": { maxWidth: "90%", height: "95vh" },
        position: "relative",
        overflow: "hidden",
        zIndex: 1111,
      }}
      fullWidth={true}
      maxWidth="xl"
      open={Boolean(modalState)}
      onClose={() => setModalState(false)}
    >
      <IconButton
        onClick={() => setModalState(false)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          color: "grey.800",
        }}
      >
        <CloseIcon />
      </IconButton>
      <main className="tw-flex tw-w-full tw-h-full">
        <aside className="left category-scrollbar tw-bg-[#f9f9f9] tw-p-[20px] tw-h-full tw-flex tw-flex-col tw-justify-between tw-w-[20%] tw-rounded-l-[30px] tw-overflow-auto">
          <div className={`${showStructure ? "tw-blur-[3px]" : ""} wrapperNo1`}>
            <div className="avatar tw-flex tw-items-center tw-gap-5 tw-mb-[30px]">
              <IconButton sx={{ padding: "0px" }}>
                <div className="wrapper-image tw-w-[60px] tw-h-[60px] tw-rounded-[30px] tw-overflow-hidden tw-border-[1px] tw-border-[#007cd2]">
                  <img
                    src={initialValues?.avatar}
                    alt="avatar"
                    className="tw-w-full tw-h-full tw-object-cover tw-object-center"
                  />
                </div>
              </IconButton>
              <div className="text">
                {mainExecutor ? (
                  <p className="tw-text-[#007cd2] tw-font-bold">
                    {mainExecutor.value}
                  </p>
                ) : (
                  <p className="tw-text-[#007cd2] tw-font-bold">{executer}</p>
                )}
                {/* <p className="text-[#a9a9a9] text-[14px]">{e.role}</p> */}
              </div>
            </div>
            <div className="panel-control tw-flex tw-flex-col tw-gap-5 tw-mb-[20px]">
              {memoVisaListTemp?.length > 0 && (
                <MemoVisa
                  mainDTO={mainDTO}
                  item={{ name: executer, position: initialValues?.position }}
                  userChats={memoUserChats}
                  visaListTemp={memoVisaListTemp}
                  termDate={termDate}
                  visaStatusTemp={visaStatusTemp}
                  sign={initialValues?.sign}
                  isEditable={Boolean(
                    initialValues?.child?.[Object.keys(initialValues?.child)[0]]
                      ?.executors?.length &&
                      +initialValues?.responsible?.id === userDetails?.id
                  )}
                  openEdit={() => {
                    setEditExecutorsModal(true);
                  }}
                  openEditVisa={() => {
                    setShowEditVisa(true);
                  }}
                />
              )}
              {!initialValues?.transitions?.buttonSettings?.add_visa?.hide ? (
                <>
                  <TabVisa
                    disabled={false}
                    handleClick={(val: boolean) => setShowStructure(val)}
                    text="Исполнитель"
                    Icon={<PersonIcon className="colorIcon" />}
                  />
                  <TabVisa
                    disabled={!memoUserChats.length}
                    text="Виза"
                    handleClick={(val: boolean) => setShowVisa(val)}
                    Icon={<AssignmentIcon className="colorIcon" />}
                  />
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ru}
                  >
                    <DatePicker
                      disabled={!memoVisaListTemp.length}
                      open={calendarOpen}
                      onClose={() => setCalendarOpen(false)}
                      onOpen={() => setCalendarOpen(true)}
                      value={date}
                      minDate={new Date()}
                      onChange={(newDate) => {
                        handleChange(newDate);
                        handlePostTermDate(
                          moment(newDate).format("YYYY-MM-DD")
                        );
                        setCalendarOpen(false);
                      }}
                      label="Срок"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-root": {
                              border: "1px solid #007cd2",
                              borderRadius: "10px",
                              outline: "none",
                            },
                          }}
                          onClick={() => setCalendarOpen(true)}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <TextField
                    disabled={!date.length}
                    size="small"
                    select
                    fullWidth
                    label="Статус"
                    value={visaStatusTemp?.status}
                    onChange={(e: any) =>
                      handlePostVisaStatusTemp(e.target.value)
                    }
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": {
                        border: "1px solid #007cd2",
                        borderRadius: "10px",
                        outline: "none",
                      },
                    }}
                  >
                    <MenuItem value={1}>Фаври</MenuItem>
                    <MenuItem value={2}>Назорати</MenuItem>
                  </TextField>
                </>
              ) : (
                <></>
              )}
            </div>

            <div className="wrapper-documents tw-flex tw-flex-col tw-gap-2 tw-mb-[20px]">
              {fileItem?.map((item: { url: string }, i: number) => {
                return (
                  <div
                    key={`file-${i + 1}`}
                    className="wrapper-document tw-flex tw-items-center tw-gap-2 tw-w-full"
                  >
                    <IconButton
                      onClick={() => downloadFile(item?.url)}
                      sx={{ justifyContent: "start" }}
                    >
                      <FileDownloadIcon className="tw-text-[#1976D2]" />
                    </IconButton>
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
            <div className="wrapper-chats tw-flex tw-flex-col tw-gap-5">
              {memoUserChats?.map((e) => {
                return (
                  <ChatUser
                    key={e.id}
                    item={e}
                    isActive={e.id == selectedUserChat?.id}
                    mergerId={mergerId}
                    setMergerId={setMergerId}
                    disabledCheckbox={
                      initialValues?.child?.[
                        Object.keys(initialValues?.child)[0]
                      ]?.executors?.length
                    }
                    handlePutUserChatStatus={(val: any) => {
                      if (
                        !initialValues?.child?.[
                          Object.keys(initialValues?.child)[0]
                        ]?.executors?.length
                      ) {
                        return;
                      }
                      setSelectedUserChat(val);
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div
            className={`${
              showStructure ? "tw-blur-[3px]" : ""
            } wrapperNo2 tw-pt-[20px]`}
          >
            {!initialValues?.child?.[Object.keys(initialValues?.child)[0]]
              ?.executors?.length ? (
              <Button
                onClick={() =>
                  makeVisaClick({
                    type: visaStatusTemp?.status ?? null,
                    executorIds: userChats?.map((e: any) => e.id),
                    visaTypes: memoVisaListTemp,
                    term: date || null,
                    executorType: visaStatusTemp?.status,
                    mergerId,
                  })
                }
                disabled={!userChats.length || !memoVisaListTemp.length}
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                  fontSize: "15px",
                }}
              >
                Подписать
              </Button>
            ) : (
              <></>
            )}
          </div>

          {showStructure && (
            <StructureOrganizations
              closeModal={setShowStructure}
              finishClick={() => {
                setMemoState(!memoState);
              }}
              postUser={(obj: any) => {
                if (!userChats.some((el: any) => el.id === obj.id)) {
                  setUsersChats((prev: any) => [...prev, obj]);
                }
              }}
              deleteUser={(id: number) => {
                setUsersChats((prev: any) =>
                  prev.filter((el: any) => el.id !== id)
                );
              }}
              users={userChats}
              setMergerId={setMergerId}
              mergerId={mergerId}
            />
          )}
          <VisaModal
            selectedVisaList={visaListTemp}
            handleShowVisa={(val: boolean) => setShowVisa(val)}
            postVisaTemp={setVisaListTemp}
            modalState={showVisa}
            finishClick={() => setMemoState(!memoState)}
            mode="create"
          />
          <EditVisaModal
            selectedVisaList={visaListTemp}
            handleShowVisa={(val: boolean) => setShowEditVisa(val)}
            postVisaTemp={setVisaListTemp}
            modalState={showEditVisa}
            finishClick={editVisa}
            mode="edit"
          />

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
        </aside>
        <aside className="tw-w-[80%] tw-h-full">
          {userChats?.length < 1 && <LoadingChat />}
          {selectedUserChat && (
            <TitleChat
              currentChatUser={selectedUserChat}
              setSelectedUserChat={setSelectedUserChat}
              userChats={userChats}
              handlePostSubVisa={makeSubVisaClick}
              handlePostThirdVisa={makeThirdVisaClick}
              initialValues={initialValues}
            />
          )}
          <EditExecutorsModal
            handleSubmit={editExecutors}
            handlePostSubTabVisa={(obj: any) => {
              if (!userChats.some((el: any) => el.userId === obj.userId)) {
                setUsersChats((prev: any) => [...prev, obj]);
              }
            }}
            setSelectedUser={setUsersChats}
            selectedUser={userChats}
            visible={editExecutorsModal}
            handleToggleModal={() => setEditExecutorsModal(false)}
          />
        </aside>
      </main>
    </Dialog>
  );
}

export default ChatV4;
