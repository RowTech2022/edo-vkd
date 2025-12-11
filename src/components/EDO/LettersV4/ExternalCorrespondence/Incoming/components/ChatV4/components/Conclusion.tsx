import React, { useState, useEffect, useRef, useContext } from "react";

import {
  Avatar,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
  MenuItem,
  Menu,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

import SetNameConclusion from "./SetNameConclusion";
import CommentsConclusion from "./CommentConclusion";

import AddMemberToConclusionModal from "./AddMemberToConclusionModal";

import NotesIcon from "@mui/icons-material/Notes";

import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

import {
  useGetConclusionByIdMutation,
  useUpdateConclusionMutation,
  useSignConclusionMutation,
  useCompleteConclusionMutation,
  IFileResponce,
  useAddNewVersionConclusionMutation,
  useCreateConclusionMutation,
  useAddMembersToConclusionMutation,
  useDeleteConclusionFileMutation,
  useDeleteConclusionMutation,
} from "@services/lettersApiV4";
import fileService from "@services/fileService";
import { IncomingCreateV4Context } from "../../../create";
import ShowConclusionFile from "./ShowConclusionFIle";
import { SignIncoming } from "./SignIncoming";
import dayjs from "dayjs";
import { fileNameRegex, wordExtensions, filterOutWordFiles } from "../ChatV4";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import DocumentPdf from "./DocumentPdf";
import OwnEditor from "../OwnEditor";

const Conclusion = ({
  handleModalConclusion,
  users,
  currentUserId,
  chatInfo,
  setRefetchConclusion,
}) => {
  const { refetchData, letterId, fileItem } = useContext(
    IncomingCreateV4Context
  );

  const [
    createConclusion,
    { data: ceateConclusionResp, isSuccess: createConclusionSuccess },
  ] = useCreateConclusionMutation();

  const [deleteConclusion] = useDeleteConclusionMutation();

  const [getConclusionById, { data: singleConclusion }] =
    useGetConclusionByIdMutation();

  const [
    updateConclusion,
    {
      data: updateConclusionResp,
      isLoading: updateConclusionLoading,
      isSuccess: updateConclusionSuccess,
    },
  ] = useUpdateConclusionMutation();

  const [signConclusion, { isSuccess: singSuccess }] =
    useSignConclusionMutation();

  const [completeConclusion, { data: completeConclusionResp }] =
    useCompleteConclusionMutation();

  const [addMemberToConclusion] = useAddMembersToConclusionMutation();

  const [deleteConclusionFile] = useDeleteConclusionFileMutation();

  const [addNewVersion] = useAddNewVersionConclusionMutation();

  const [visible, setVisible] = useState(false);
  const [visibleUserId, setVisibleUserId] = useState<number | null>(null);

  const handleShowConclusion = (id: number) => {
    setVisible(id === visibleUserId ? !visible : true);
    setVisibleUserId(id);
  };

  const [nameConclusion, setNameConclusion] = useState(false);

  const handleSetNameConclusion = (state: boolean) => {
    setNameConclusion(state);
  };

  const [editConclusion, setEditConclusion] = useState(true);

  const handlePutSubTabConclusionList = async (id: number) => {
    getConclusionById(id);
    setEditConclusion(false);
  };

  const [value, setValue] = useState("");

  const handlePutSubTabConclusionListTempText = () => {
    // fix br tag
    const cleanedContent = value.replace(/<br>/g, "<br/>");

    updateConclusion({
      id: singleConclusion?.id,
      content: cleanedContent,
      files: singleConclusion?.files,
    }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        setEditConclusion(false);
        toast.success("Изменения сохранены");
        setRefetchConclusion((prev: number) => prev + 1);
      } else {
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  const [showConclusionEdsUsers, setShowConclusionEdsUsers] = useState(false);

  const handleShowConclusionEdsUsers = (state: boolean) => {
    setShowConclusionEdsUsers(state);
  };

  const [showCommentsConclusion, setShowCommentsConclusion] = useState(false);

  const handleShowCommentsConclusion = (state: boolean) => {
    setShowCommentsConclusion(state);
  };

  // Раньше вместо e.subTabConclusionListId было subTabConclusionListTempId
  const handlePutSubTabConclusionListEds = (value: string) => {
    signConclusion({
      comment: value?.length ? value : null,
      conclusionId: singleConclusion?.id,
    }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        toast.success("Заключение подписан");
        handleShowCommentsConclusion(false);
        setEditConclusion(false);
        setRefetchConclusion((prev: number) => prev + 1);
      } else {
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  const [showMember, setShowMember] = useState<null | number>(null);
  const [showSign, setShowSign] = useState(null);

  const handlePutShowInfoBlockOfConclusionEds = (clickedItem: number) => {
    if (showMember === null) {
      setShowMember(clickedItem);
    } else {
      setShowMember(null);
    }
  };

  const inputRef = useRef(null);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (conclusionId: number) => {
    setAnchorEl(null);
    deleteConclusion({ id: conclusionId }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        refetchData?.();
        setRefetchConclusion((prev: number) => prev + 1);
        toast.success("Заключение удалено");
      } else {
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  const [files, setFiles] = useState<any[]>([]);

  const [filesPreviewModal, setFilesPreviewModal] = useState(false);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState([]);
  const [isSavingAttachment, setIsSavingAttachment] = useState(false);

  const [showDocPdf, setShowDocPdf] = useState(false);
  const [showDocX, setShowDocX] = useState({
    state: false,
    file: "",
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size === 0) {
        toast.warning("Файл пустой");
        return;
      }
      const fileUrl = URL.createObjectURL(file);

      setFiles([...files, { fileObj: file, fileUrl }]);
    }
  };

  // const handlePostConclusionAttachment = async (idx: number) => {
  //   const { fileUrl, ...fileObj } = files[idx];

  //   const formData = new FormData();
  //   formData.append(idx.toString(), fileObj?.fileObj);

  //   await fileService.uploadFileV2(formData).then((e) => {
  //     let resp = e as { data: IFileResponce };

  //     updateConclusion({
  //       id: singleConclusion?.id,
  //       content: singleConclusion?.content,
  //       files: [
  //         ...singleConclusion?.files,
  //         {
  //           name:
  //             fileObj.fileObj?.name || "file." + `${fileObj?.fileObj?.type}`,
  //           url: resp.data.url,
  //         },
  //       ],
  //     }).then((resp: any) => {
  //       if (!resp.hasOwnProperty("error")) {
  //         setFiles([]);
  //         toast.success("Файл сохранен");
  //         setRefetchConclusion((prev: number) => prev + 1);
  //       } else {
  //         toast.error(resp?.error?.data?.Message);
  //       }
  //     });
  //   });
  // };

  const handlePostConclusionAttachment = async (idx: number) => {
    setIsSavingAttachment(true); // Устанавливаем загрузку в true перед началом операции

    try {
      const { fileUrl, ...fileObj } = files[idx];

      const formData = new FormData();
      formData.append(idx.toString(), fileObj?.fileObj);

      const uploadResponse = await fileService.uploadFileV2(formData); // Используем await
      let resp = uploadResponse as { data: IFileResponce };

      const updateResponse: any = await updateConclusion({
        // Используем await
        id: singleConclusion?.id,
        content: singleConclusion?.content,
        files: [
          ...singleConclusion?.files,
          {
            name:
              fileObj.fileObj?.name || "file." + `${fileObj?.fileObj?.type}`,
            url: resp.data.url,
          },
        ],
      });

      if (!updateResponse.hasOwnProperty("error")) {
        setFiles([]);
        toast.success("Файл сохранен");
        setRefetchConclusion((prev: number) => prev + 1);
      } else {
        toast.error(updateResponse?.error?.data?.Message);
      }
    } catch (error) {
      // Обработка ошибок, если необходимо
      console.error("Ошибка при сохранении вложения:", error);
      toast.error("Произошла ошибка при сохранении файла.");
    } finally {
      setIsSavingAttachment(false); // Сбрасываем загрузку в false после завершения операции
    }
  };

  const handleAddNewVersion = () => {
    addNewVersion({
      id: singleConclusion?.id,
    }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        refetchData?.();
        getConclusionById(singleConclusion?.id);
        setRefetchConclusion((prev: number) => prev + 1);
      } else {
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  const handleAddMember = (users: { id: number; value: string }[]) => {
    addMemberToConclusion({
      conclusionId: singleConclusion?.id,
      userIds: users?.map((el) => el.id),
    }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        handleShowConclusionEdsUsers(false);
        refetchData?.();
        getConclusionById(singleConclusion?.id);
        setRefetchConclusion((prev: number) => prev + 1);
      } else {
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  const handleDeleteConclusionFile = (id: number) => {
    deleteConclusionFile({ id }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        getConclusionById(singleConclusion?.id);
      } else {
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  const [showCommentEds, setShowCommentEds] = useState(false);

  const handleShowCommentEds = () => {
    setShowCommentEds(!showCommentEds);
  };

  const handleShowEndConclusion = () => {
    completeConclusion({
      conclusionId: singleConclusion?.id,
    }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        handleModalConclusion(false, true);
        setRefetchConclusion((prev: number) => prev + 1);
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editConclusion]);

  useEffect(() => {
    if (updateConclusionResp || singSuccess) {
      getConclusionById(singleConclusion?.id);
    }
  }, [updateConclusionResp, singSuccess]);

  useEffect(() => {
    if (ceateConclusionResp) {
      getConclusionById(ceateConclusionResp?.id);
      refetchData?.();
    }
  }, [ceateConclusionResp]);

  return (
    <>
      <div
        onClick={() => handleModalConclusion(false)}
        className="tw-fixed conclusion-animation tw-w-full tw-h-screen tw-top-0 tw-left-0 tw-z-10 tw-backdrop-blur-sm"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="wrapper-conclusion tw-absolute tw-bg-[#fff] tw-w-[80%] tw-h-full tw-flex tw-flex-col tw-overflow-y-auto tw-right-0  tw-border-[1px] tw-shadow-lg"
        >
          {/* Заключение создателя вкладки */}
          <div
            className={`conclusion-content tw-flex tw-justify-between ${
              singleConclusion ? "tw-h-[92%]" : "tw-h-full"
            } `}
          >
            <aside className="left aside-left-conclusion tw-h-full tw-min-w-[150px] tw-flex tw-flex-col tw-items-center tw-gap-5 tw-py-[20px]">
              <p className="tw-text-[14px] tw-text-[#939393] tw-font-[500]">
                Документы
              </p>
              <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
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
                          fontWeight: "300",
                          width: "90%",
                          margin: "0px auto",
                        }}
                      >
                        <p className="tw-text-[12px] tw-text-[#000] tw-overflow-ellipsis tw-overflow-hidden tw-whitespace-nowrap">
                          {item?.url?.match(fileNameRegex)?.[0]}
                        </p>
                      </Button>
                    </div>
                  );
                })}
              </div>
              {users?.map((invite: any, i: number) => {
                return (
                  <React.Fragment key={invite.id}>
                    <Tooltip
                      title={invite?.name + " / " + invite?.role || ""}
                      placement="top-start"
                    >
                      <span>
                        <IconButton
                          onClick={() => handleShowConclusion(+invite.id)}
                          sx={{ padding: "0px" }}
                        >
                          <Avatar
                            src={invite.image}
                            className="border-[2px] border-[#007cd2]"
                          />
                        </IconButton>
                      </span>
                    </Tooltip>

                    {/* Панель с результатами отображается только для выбранного пользователя */}
                    {visible && visibleUserId === +invite.id && (
                      <div className="panel-control-conclusion tw-flex tw-flex-col tw-items-center tw-gap-4">
                        {invite.id === currentUserId ||
                        !chatInfo?.transitions?.add_conclusion?.hide ? (
                          <IconButton
                            disabled={
                              +invite.id !== currentUserId ||
                              chatInfo?.transitions?.add_conclusion?.readOnly
                            }
                            onClick={() => {
                              handleSetNameConclusion(true);
                              setVisibleUserId(null); // Скрыть панель после добавления заключения
                              setVisible(false);
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        ) : (
                          <></>
                        )}

                        <ul className="conclusion-list">
                          {invite?.conclusions?.map((conclusion: any) => {
                            return (
                              <li
                                onClick={() => {
                                  console.log(conclusion, "conclusion");
                                  handlePutSubTabConclusionList(conclusion.id);
                                }}
                                key={conclusion.id}
                                className="tw-p-[10px] tw-border-b-[1px] tw-bg-[#d4d4d9] hover:tw-bg-[#d4d4d9] tw-cursor-pointer tw-text-[14px] tw-flex tw-flex-row tw-justify-between tw-items-center tw-space-x-3"
                              >
                                <span>{conclusion.title}</span>
                                <IconButton
                                  aria-label="more"
                                  id="long-button"
                                  aria-controls={open ? "long-menu" : undefined}
                                  aria-expanded={open ? "true" : undefined}
                                  aria-haspopup="true"
                                  onClick={handleClick}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  id="long-menu"
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                  slotProps={{
                                    paper: {
                                      style: {
                                        maxHeight: 20 * 4.5,
                                        width: "20ch",
                                      },
                                    },
                                  }}
                                >
                                  <MenuItem
                                    selected
                                    onClick={() => handleClose(conclusion.id)}
                                  >
                                    Удалить
                                  </MenuItem>
                                </Menu>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </aside>
            <main className="tw-bg-[#fff] tw-w-full tw-relative tw-h-full tw-flex tw-flex-col tw-justify-between">
              <>
                <div className="wrapper-conclusions-temp tw-flex tw-border-b-[1px] tw-flex-wrap tw-sticky tw-top-0">
                  {singleConclusion?.versions?.map((version: any) => {
                    return (
                      <Tooltip
                        title={
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <span>{version.userName}</span>
                            <span>
                              {dayjs(version?.createdAt).format(
                                "DD-MM-YYYY HH:ss"
                              )}
                            </span>
                          </Box>
                        }
                        placement="bottom-end"
                      >
                        <span>
                          <Button
                            onClick={() =>
                              handlePutSubTabConclusionList(version.id)
                            }
                            key={version.id}
                            variant={
                              +version.id === singleConclusion?.id
                                ? "contained"
                                : "outlined"
                            }
                            sx={{
                              height: "30px",
                              display: "flex",
                              gap: "10px",
                              borderLeft: "0",
                              borderTop: "0",
                              borderRadius: "0",
                              borderBottom: "0",
                              textTransform: "none",
                              "&:hover": {
                                borderLeft: "0",
                                borderTop: "0",
                                borderBottom: "0",
                              },
                            }}
                          >
                            <p>{version.version}</p>
                            <Avatar
                              src={version.userPicture}
                              className="tw-w-[25px] tw-h-[25px] tw-rounded-full tw-border-[2px] tw-border-[#007cd2]"
                            />
                          </Button>
                        </span>
                      </Tooltip>
                    );
                  })}
                </div>
                {singleConclusion &&
                  (editConclusion ? (
                    <>
                      <div className="tw-w-full tw-h-[75%] tw-overflow-y-auto">
                        <OwnEditor content={value} setContent={setValue} />
                      </div>
                    </>
                  ) : (
                    <div
                      className="tw-text-[14px] tw-p-[15px] tw-h-[75%] tw-overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html: singleConclusion?.content || "",
                      }}
                    />
                  ))}
              </>

              <div className="attachment tw-w-full tw-h-[25%] tw-overflow-auto tw-relative">
                <p className="tw-text-[15px] tw-px-[15px] tw-py-[5px] tw-bg-[#007cd2] tw-text-[#fff] tw-sticky tw-top-0">
                  Вложение
                </p>
                <table className="tw-w-full" border={1}>
                  <thead>
                    <tr className="tw-border-b-[1px]">
                      <th className="tw-text-left tw-p-[15px] tw-font-[600] tw-text-[15px]">
                        Название
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleConclusion?.files?.map((fileValue: any) => (
                      <tr className="tw-border-b-[1px] ">
                        <td
                          onClick={() => {
                            setSelectedPreviewFile([fileValue?.url]);
                            setFilesPreviewModal(true);
                          }}
                          className="tw-text-left tw-p-[15px] tw-font-[600] tw-text-[15px] tw-cursor-pointer"
                        >
                          {fileValue?.name}
                        </td>

                        <td>
                          <a
                            target="_blank"
                            href={fileValue?.url}
                            download={fileValue?.name}
                          >
                            Скачать
                          </a>
                        </td>
                        <td>
                          <Button
                            onClick={() => {
                              handleDeleteConclusionFile(fileValue.id);
                            }}
                            type="reset"
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {files?.map((fileValue, idx) => (
                      <tr className="tw-border-b-[1px] ">
                        <th
                          onClick={() => {
                            setSelectedPreviewFile([fileValue?.fileUrl]);
                            setFilesPreviewModal(true);
                          }}
                          className="tw-text-left tw-p-[15px] tw-font-[600] tw-text-[15px] tw-cursor-pointer"
                        >
                          {fileValue?.fileObj?.name}
                        </th>
                        <th className="tw-text-left tw-p-[15px] tw-font-[600] tw-text-[15px]"></th>
                        <th className="tw-text-left tw-p-[15px] tw-font-[600] tw-text-[15px]">
                          {/* <Button
                            onClick={() => handlePostConclusionAttachment(idx)}
                            sx={{ textTransform: "none" }}
                          >
                            Сохранить
                          </Button> */}
                          <Button
                            onClick={() => handlePostConclusionAttachment(idx)}
                            sx={{
                              textTransform: "none",
                              minWidth: 100, // Установите минимальную ширину, чтобы кнопка не сжималась
                              minHeight: 36, // Установите минимальную высоту
                              position: "relative", // Для правильного позиционирования лоадера
                            }}
                            disabled={isSavingAttachment} // Кнопка будет disabled, пока файл сохраняется
                          >
                            {isSavingAttachment ? (
                              <CircularProgress
                                size={24}
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  marginTop: "-12px",
                                  marginLeft: "-12px",
                                }}
                              />
                            ) : (
                              "Сохранить"
                            )}
                          </Button>
                        </th>
                        <th className="tw-text-left tw-p-[15px] tw-font-[600] tw-text-[15px]">
                          <Button
                            onClick={() => {
                              files.splice(idx, 1);
                              setFiles([...files]);
                            }}
                            sx={{ textTransform: "none" }}
                          >
                            Отмена
                          </Button>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
            {/* Подпись ======= */}
            <aside className="right aside-left-conclusion tw-h-full tw-min-w-[220px] tw-relative  tw-flex tw-flex-col tw-items-center tw-py-[20px]">
              <p className="tw-text-[14px] tw-text-[#939393] tw-font-[500] tw-mb-[30px]">
                Подписи
              </p>
              {singleConclusion?.members?.map((e: any) => {
                return (
                  <>
                    <div
                      className={`eds-item tw-w-full tw-flex tw-justify-center tw-py-[15px] ${
                        !e.comment && e.signedAt
                          ? "tw-bg-[#28ff2880]"
                          : e.comment && e.signedAt
                          ? "tw-bg-[#ffa600ae]"
                          : "tw-bg-transparent"
                      }`}
                    >
                      <Tooltip
                        title={e?.user?.value || ""}
                        placement="top-start"
                      >
                        <IconButton
                          onClick={() =>
                            handlePutShowInfoBlockOfConclusionEds(e.user.id)
                          }
                          className={`${
                            e.signedAt ? "tw-opacity-100" : "tw-opacity-30"
                          }`}
                          key={e.id}
                          sx={{
                            padding: "0px",
                          }}
                        >
                          <Avatar
                            src={e.imageUrl}
                            className="tw-border-[2px] tw-border-[#007cd2]"
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                    {e.user.id === showMember ? (
                      <div className="tw-bg-[#ffffffbd] tw-flex tw-flex-col tw-gap-1 tw-items-start tw-py-[20px] tw-px-[10px] tw-w-full">
                        <p className="tw-text-[14px] tw-font-[600]">
                          {e.user.value}
                        </p>
                        <p
                          onClick={() => {
                            if (e.signedAt && !showSign) {
                              setShowSign(e.user.id);
                            } else {
                              setShowSign(null);
                            }
                          }}
                          className={`text-[14px] tw-cursor-pointer ${
                            e.signedAt ? "tw-text-[#007cd2]" : "tw-text-[red]"
                          }`}
                        >
                          {e.signedAt ? "Подписан" : "Не подписан"}
                        </p>
                        {showSign === e.user.id ? (
                          <SignIncoming sign={e?.signInfo} />
                        ) : (
                          <></>
                        )}
                        {e.comment && (
                          <Button
                            onClick={() => handleShowCommentEds()}
                            variant="text"
                            sx={{
                              paddingY: "0",
                              paddingX: "5px",
                              paddingLeft: "0",
                              textTransform: "none",
                              fontWeight: "400",
                              display: "flex",
                              gap: "5px",
                            }}
                          >
                            <NotesIcon fontSize="small" />
                            <p>Комментарий</p>
                          </Button>
                        )}
                        {showCommentEds && (
                          <p className="text-[14px]">{e.comment}</p>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                );
              })}
            </aside>
          </div>
          {singleConclusion ? (
            <div className="tw-bg-[#fff] tw-flex tw-justify-between tw-h-[8%] tw-text-[red] tw-border-t-[1px] tw-p-[20px]">
              <div className="panel-control tw-flex tw-gap-5 tw-items-center">
                {!singleConclusion?.transition?.buttonSettings?.new_version
                  ?.hide ? (
                  <Button
                    disabled={
                      singleConclusion?.transition?.buttonSettings?.new_version
                        ?.readOnly || editConclusion
                    }
                    onClick={handleAddNewVersion}
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Новый
                  </Button>
                ) : (
                  <></>
                )}
                {!singleConclusion?.transition?.buttonSettings?.add_member
                  ?.hide ? (
                  <Button
                    disabled={
                      singleConclusion?.transition?.buttonSettings?.add_member
                        ?.readOnly || editConclusion
                    }
                    onClick={() => {
                      handleShowConclusionEdsUsers(true);
                    }}
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Пригласить
                  </Button>
                ) : (
                  <></>
                )}
                {!singleConclusion?.transition?.buttonSettings?.sign?.hide ? (
                  <Button
                    disabled={
                      singleConclusion?.transition?.buttonSettings?.sign
                        ?.readOnly || editConclusion
                    }
                    onClick={() => handleShowCommentsConclusion(true)}
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Подписать
                  </Button>
                ) : (
                  <></>
                )}
                {!singleConclusion?.transition?.buttonSettings?.change?.hide ? (
                  <Button
                    variant="outlined"
                    disabled={
                      singleConclusion?.transition?.buttonSettings?.change
                        ?.readOnly || editConclusion
                    }
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setEditConclusion(true);
                      setValue(singleConclusion?.content || "");
                    }}
                  >
                    Изменить
                  </Button>
                ) : (
                  <></>
                )}
                {!singleConclusion?.transition?.buttonSettings?.complete
                  ?.hide ? (
                  <Button
                    disabled={
                      singleConclusion?.transition?.buttonSettings?.complete
                        ?.readOnly || editConclusion
                    }
                    onClick={() => handleShowEndConclusion()}
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Завершить
                  </Button>
                ) : (
                  <></>
                )}
                {!singleConclusion?.transition?.buttonSettings?.add_files
                  ?.hide ? (
                  <Button
                    disabled={
                      singleConclusion?.transition?.buttonSettings?.add_files
                        ?.readOnly || editConclusion
                    }
                    type="submit"
                    className="flex gap-2"
                    onClick={handleButtonClick}
                  >
                    <input
                      onChange={handleFileChange}
                      type="file"
                      accept=".pdf, .doc, .docx, .xls, .xlsx"
                      ref={fileInputRef}
                      className="tw-hidden"
                    />
                    <ArrowCircleUpIcon />
                    <p>Вложение</p>
                  </Button>
                ) : (
                  <></>
                )}
              </div>
              <div className="wrapper-buttons tw-flex tw-gap-5">
                <Button
                  onClick={() => handleModalConclusion(false)}
                  sx={{ textTransform: "none" }}
                >
                  Отмена
                </Button>
                {editConclusion ? (
                  <Button
                    onClick={() => handlePutSubTabConclusionListTempText()}
                    variant="contained"
                    sx={{ textTransform: "none", fontWeight: "400" }}
                  >
                    Сохранить
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {nameConclusion && (
        <SetNameConclusion
          handleSetNameConclusion={handleSetNameConclusion}
          handleCreateConclusion={(val: { title: string }) => {
            createConclusion({
              ...val,
              incomingId: letterId,
              executorId: users?.find((el: any) => +el.id === currentUserId)
                ?.executorId,
            }).then((resp: any) => {
              if (!resp.hasOwnProperty("error")) {
                toast.success("Заключение создано");
                setRefetchConclusion((prev: number) => prev + 1);
              } else {
                toast.error(resp?.error?.data?.Message);
              }
            });
          }}
        />
      )}
      {showConclusionEdsUsers && (
        <AddMemberToConclusionModal
          handleModalVisible={handleShowConclusionEdsUsers}
          handleSubmit={handleAddMember}
        />
      )}
      {showCommentsConclusion && (
        <CommentsConclusion
          handleShowCommentsConclusion={handleShowCommentsConclusion}
          handleSave={handlePutSubTabConclusionListEds}
        />
      )}

      <ShowConclusionFile
        files={selectedPreviewFile}
        visible={filesPreviewModal}
        setVisible={(state: boolean) => setFilesPreviewModal(state)}
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
    </>
  );
};

export default Conclusion;
