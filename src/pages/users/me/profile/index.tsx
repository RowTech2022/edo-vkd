import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import fileService from "@services/fileService";
import { LoadingButton } from "@mui/lab";
import { AvatarBody2, useSaveAvatar2Mutation } from "@services/admin/userApi";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";
import {
  RoleSearchRequestBody,
  useGetTaskByIdMutation,
  useLazyFetchRolesQuery,
  useUserTaskListMutation,
} from "@services/admin/rolesApi";
import { useScreenSize, useSession } from "@hooks";
import { useNavigate } from "react-router";
import dayjs, { Dayjs } from "dayjs";
import {
  LocalizationProvider,
  PickersDay,
  StaticDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./styles.css";
import CreateTask from "./modals/CreateTask";
import EditProfile from "./modals/EditProfile";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ImageCropper, { CropResult } from "@root/shared/ui/ImageCropper";
import EditTask from "./modals/EditTask";
import ImageDialog from "@root/shared/ui/ImageDialod/ImageDialog";
import ChangePassword from "./modals/ChangePassword";

type Props = {};

const TELEGRAM_BOT_URL = import.meta.env.VITE_TELEGRAM_BOT_URL;

export const AdminProfilePage = (props: Props) => {
  const navigate = useNavigate();
  const { status } = useSession();
  const { width } = useScreenSize();
  const [fileLoading, setFileLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [open3, setOpen3] = useState<boolean>(false);
  const [open4, setOpen4] = useState<boolean>(false);
  const [open5, setOpen5] = useState<boolean>(false);
  const [open6, setOpen6] = useState<boolean>(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [selectedFile, setSelectedFile] = useState<File>();
  const [showFullAvatar, setShowFullAvatar] = useState(false);

  const [events, setEvents] = useState([]);
  const [events2, setEvents2] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const eventDates =
    //@ts-ignore
    events2?.data?.items?.map((item) =>
      dayjs(item.date).format("YYYY-MM-DD")
    ) || [];

  const handleToggleEvents = () => {
    setShowAllEvents((prev) => !prev);
  };
  const [filters, setFilters] = useState<RoleSearchRequestBody>({
    orderBy: {
      column: 1,
      order: 1,
    },
    pageInfo: {
      pageNumber: 1,
    },
  });

  const [fetchRoles, { data: roles }] = useLazyFetchRolesQuery();
  const [userTaskList] = useUserTaskListMutation();
  const [taskById] = useGetTaskByIdMutation();

  const [saveAvatar2, { isError, isLoading, isSuccess }] =
    useSaveAvatar2Mutation();
  const { data: details, isFetching, refetch } = useFetchUserDetailsQuery();

  const handleFileSlect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filesFormats = [".png", ".jpg", ".jpeg", ".JPG", ".PNG", ".JPEG"];

    function ext(name: string) {
      return name.match(/\.([^.]+)$|$/)?.[1] || "";
    }

    const isRightFormat = filesFormats.includes("." + ext(file.name));
    if (!isRightFormat) {
      toast(
        "Вы можете загрузить только фотографии в формате .PNG, .JPG или .JPEG",
        { type: "error", position: "bottom-right" }
      );
      return;
    }

    setSelectedFile(file);
    setOpen(true);
  };

  const handleUploadImage = async (result: CropResult) => {
    if (!result) return;
    setFileLoading(true);
    try {
      const formData = new FormData();
      formData.append("1", result.originalImage);

      const response = await fileService.uploadFileV2(formData);
      const resp = response as { data: AvatarBody2 };
      await saveAvatar2({
        ...resp.data,
        isSmall: true,
        pointX: result.center.x,
        pointY: result.center.y,
        radius: result.radius,
      });

      toast("Аватарка обновлена.", {
        type: "success",
        position: "top-right",
      });
      refetch();
    } catch (error) {
      toast("Произошла ошибка. Попробуйте повторить позже.", {
        type: "error",
        position: "top-right",
      });
    } finally {
      setFileLoading(false);
    }
  };

  const getData = async (selectedDate?: string) => {
    try {
      const dateToSend = selectedDate || dayjs().format("YYYY-MM-DD");
      const sendDate = { date: dateToSend };
      const res = await userTaskList(sendDate);
      // @ts-ignore
      setEvents(res);
    } catch (error) {
      console.error(error);
      toast("Произошла ошибка при загрузке событий.", {
        type: "error",
        position: "top-right",
      });
    }
  };

  const getData2 = async () => {
    try {
      const sendDate = { date: "" };
      const res = await userTaskList(sendDate);
      // @ts-ignore
      setEvents2(res);
    } catch (error) {
      console.error(error);
      toast("Произошла ошибка при загрузке событий.", {
        type: "error",
        position: "top-right",
      });
    }
  };

  const editTaskS = async (id: number) => {
    try {
      const res = await taskById(id);
      if ("data" in res) {
        setSelectedEvent(res.data);
        setOpen5(true);
      } else {
        toast("Ошибка при получении задачи.", {
          type: "error",
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Произошла ошибка при получении задачи.", {
        type: "error",
        position: "top-right",
      });
    }
  };

  const handleTaskUpdated = () => {
    getData2();
    getData();
  };

  const handleUpdate = () => {
    refetch();
    getData();
  };
  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    const formattedDate = newValue?.format("YYYY-MM-DD");
    if (formattedDate) {
      getData(formattedDate);

      // const hasEvents = eventDates.includes(formattedDate);
      // if (hasEvents) {
      //   setOpen2(true);
      // } else {
      //   setOpen3(true);
      // }
    }
  };

  const openTelegramBot = (id: number) => {
    window.open(TELEGRAM_BOT_URL + id, "_blank");
    window.close();
  };

  useEffect(() => {
    getData();
    getData2();
  }, []);

  useEffect(() => {
    if (isError) {
      toast("Произошла ошибка. Попробуйте повторить позже.", {
        type: "error",
        position: "top-right",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/auth/login");
    }
  }, [status]);

  if (status !== "authenticated") {
    return <></>;
  }

  useEffect(() => {
    if (details?.roles?.find((el: number) => el) === 1) {
      fetchRoles(filters);
    }
  }, [details]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 65%" },
            borderRadius: "20px",
            padding: { md: "40px", xs: "20px" },
            background: 'white',
          }}
        >
          <Box className="tw-grid tw-grid-cols-3">
            <Box
              className="max-md:tw-col-span-3 max-md:tw-mb-4"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
                boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.24)",
                borderRadius: "20px",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  paddingBottom: "40px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                {isFetching && (
                  <i className="tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
                    <CircularProgress />
                  </i>
                )}
                <Tooltip title="Нажмите для просмотра" placement="top">
                  <Box
                    onClick={() =>
                      setShowFullAvatar(details?.avatar ? true : false)
                    }
                    component="img"
                    style={{ opacity: isFetching ? "0.2" : 1 }}
                    src={details?.shortImage || "/images/user-avatar.png"}
                    alt="user-avatar"
                  />
                </Tooltip>
                {showFullAvatar && (
                  <ImageDialog
                    open={showFullAvatar}
                    onClose={() => setShowFullAvatar(false)}
                    image={details?.avatar}
                  />
                )}
              </Box>

              <label htmlFor="file-upload">
                <LoadingButton
                  sx={{
                    "&.MuiLoadingButton-root": {
                      borderRadius: "8px",
                      fontSize: "12px",
                    },
                  }}
                  component="span"
                  endIcon={<PhotoCameraIcon />}
                  loading={fileLoading || isLoading}
                  loadingPosition="end"
                  variant="contained"
                >
                  <span>ВЫБРАТЬ ФОТО</span>
                </LoadingButton>
                <input
                  key={Date.now()}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  // onChange={handleFileChange}
                  onChange={handleFileSlect}
                  style={{ display: "none" }}
                />
                <ImageCropper
                  open={open}
                  imageFile={selectedFile}
                  onClose={() => setOpen(false)}
                  onCrop={handleUploadImage}
                />
              </label>
            </Box>
            <Box
              className="tw-col-span-2 max-md:tw-col-span-3"
              sx={{ margin: { md: "0 20px" }, maxWidth: { md: "400px" } }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="primary" fontSize="16px">
                  ФИО
                </Typography>
                <span
                  className="tw-cursor-pointer"
                  onClick={() => setOpen4(true)}
                >
                  <SettingsOutlinedIcon />
                </span>
              </Box>
              <Typography fontSize={"14px"} marginBottom={"10px"}>
                {details?.displayName}
              </Typography>
              <Typography color="primary" fontSize="16px">
                Телефон
              </Typography>
              <Typography fontSize="14px" marginBottom={"10px"}>
                {details?.phone}
              </Typography>
              <Typography color="primary" fontSize="16px">
                E-mail
              </Typography>
              <Typography fontSize="14px" marginBottom={"10px"}>
                {details?.email}
              </Typography>
              <Typography color="primary" fontSize="16px">
                Telegram
              </Typography>
              {details?.telegram ? (
                <Typography fontSize="14px" marginBottom={"10px"}>
                  {details?.telegram}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontSize: "12px",
                    marginBottom: "10px",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                    cursor: "pointer",
                  }}
                  color="secondary"
                  onClick={() =>
                    details.id ? openTelegramBot(details.id) : null
                  }
                >
                  Подключение аккаунта
                </Typography>
              )}
              <Typography color="primary" fontSize="16px">
                Место работы
              </Typography>
              <Typography fontSize="14px" marginBottom={"10px"}>
                {details?.userCompany?.name}
              </Typography>
              <Typography color="primary" fontSize="16px">
                Позиция
              </Typography>
              <Typography fontSize="14px" marginBottom={"10px"}>
                {details?.positionName}
              </Typography>
              <Typography fontSize="14px" marginBottom={"10px"}>
                {
                  roles?.items.find((item) => item.id === details?.roles?.[0])
                    ?.roleName
                }
              </Typography>
              <Box sx={{ maxWidth: "200px" }}>
                <img
                  style={{ maxHeight: "50px", maxWidth: "150px" }}
                  src={
                    //@ts-ignore
                    details?.userSign
                  }
                  alt=""
                />
              </Box>
              <Box sx={{ width: "100%" }} mt={2}>
                <Button
                  className="max-md:tw-text-[12px]"
                  onClick={() => setOpen6(true)}
                  sx={{ width: "100%" }}
                  variant="contained"
                >
                  Изменить пароль
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 35%" },
            borderRadius: "20px",
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.24)",
            background: "white",
            padding: "5px",
            mb: "20px",
          }}
        >
          <Box>
            <Box
              sx={{
                "& .MuiPickerStaticWrapper-content": {
                  minWidth: '200px'
                },
                "& .MuiPickersCalendarHeader-labelContainer": {
                  marginRight: {xs: "inherit", sm: 'auto'}
                },
                "& .MuiTypography-h4": {
                  fontSize: { xs: "1.3rem", md: "2rem"},
                  fontWeight: 600,
                },
                "& .MuiTypography-subtitle1": {
                  fontSize: {xs: "0.8rem", md: "1rem"},
                },
                "& .MuiDayPicker-weekDayLabel": {
                  width: {xs: "30px", md: "36px"},
                },
                "& .MuiPickersDay-root": {
                  width: {xs: "30px", md: "36px"},
                  height: {xs: "30px", md: "36px"},
                },
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={value}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  dayOfWeekFormatter={(day) => `${day}.`}
                  toolbarFormat="ddd DD MMMM"
                  showToolbar
                  renderDay={(day, _selectedDate, DayComponentProps) => {
                    const formatted = day.format("YYYY-MM-DD");
                    const isEventDate = eventDates.includes(formatted);
                    return (
                      <Box position="relative">
                        <PickersDay {...DayComponentProps} />
                        {isEventDate && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: "70%",
                              transform: "translateX(-50%)",
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: "#8e24aa",
                            }}
                          />
                        )}
                      </Box>
                    );
                  }}
                />
              </LocalizationProvider>
            </Box>
            <div className="tw-mt-[-30px] tw-p-[15px] tw-flex tw-justify-between tw-gap-2 tw-items-center">
              <p className="tw-font-[600] max-md:tw-text-[13px]">Предстоящие события</p>
              <Button className="max-md:tw-text-xs" variant="contained" onClick={() => setOpen3(true)}>
                + Добавить
              </Button>
            </div>

            <div
              className={`event-list-container  ${
                showAllEvents ? "expanded" : ""
              }`}
            >
              {
                //@ts-ignore
                events?.data?.items.map((event, index) => (
                  <>
                    <div className="tw-mt-2"></div>
                    <div
                      key={index}
                      onClick={() => editTaskS(event?.id)}
                      className="tw-flex tw-items-center tw-mt-6 tw-cursor-pointer hover:tw-bg-[#F2FAFE] tw-p-2 tw-rounded-[4px]"
                    >
                      <div className="tw-w-[20%] tw-flex tw-gap-2">
                        <p className="tw-font-bold ">
                          {dayjs(`1970-01-01T${event.time}`).format("HH:mm")}
                        </p>
                      </div>
                      <div className="tw-w-[20%] tw-rounded-[4px] tw-h-[8px] tw-bg-gradient-to-r tw-from-[#A6C0FE] tw-to-[#F68084] tw-rotate-90"></div>
                      <div className="tw-w-[60%]">
                        <p className="tw-text-[12px] tw-font-[600]">
                          {event.title}
                        </p>
                        <p className="tw-text-[12px] tw-text-[#909090]">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </>
                ))
              }
            </div>
          </Box>
        </Box>
      </Box>
      <CreateTask
        onTaskCreate={handleTaskUpdated}
        dater={value?.toDate().toISOString()}
        open={open3}
        onClose={() => setOpen3(false)}
      />

      <EditTask
        onTaskUpdated={handleTaskUpdated}
        data={selectedEvent}
        open={open5}
        onClose={() => setOpen5(false)}
      />

      <EditProfile
        onUpdates={handleUpdate}
        open={open4}
        onClose={() => setOpen4(false)}
        data={details}
      />

      <ChangePassword open={open6} onClose={() => setOpen6(false)} />
    </>
  );
};
