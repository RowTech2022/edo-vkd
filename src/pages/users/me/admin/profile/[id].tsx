import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import PhotoIcon from "@mui/icons-material/AddAPhoto";
import BadgeIcon from "@mui/icons-material/Badge";
// import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import {
  // Avatar,
  Box,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { DataTable, Input, InputGroup, Tab, TabPanel, Tabs } from "@ui";
import Access from "@root/components/admin/Profiles/access";
import Additional from "@root/components/admin/Profiles/additional";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AvatarBody2,
  useAvailableUserMutation,
  useLazyFetchUserByIdQuery,
  useResetPasswordAdminMutation,
  useSaveAvatarAdminMutation,
  useUpdateUserMutation,
} from "@services/admin/userApi";
import fileService from "@services/fileService";
import { formatDate, useToast } from "@utils";
import { useNavigate, useParams } from "react-router";
import ImageCropper, { CropResult } from "@root/shared/ui/ImageCropper";
import ImageDialog from "@root/shared/ui/ImageDialod/ImageDialog";

export const AdminProfileShowPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const userId = parseInt(params.id as string);
  const [fetchUser, { data, isFetching }] = useLazyFetchUserByIdQuery();
  const [text, setText] = useState<string | undefined>();

  const onCompanyInputChange = (e: any, value: string) => {
    setText(value);
  };

  const [updateUser, { data: userData, isLoading, isError, isSuccess }] =
    useUpdateUserMutation();
  const [availableUser] = useAvailableUserMutation();
  const [resetPasswordAdmin] = useResetPasswordAdminMutation()

  const [moduleAccess, setModuleAccess] = useState(false);

  useToast({
    successText: "Пользователь успешно обновлен.",
    isError,
    isSuccess,
  });

  const formik = useFormik<any>({
    initialValues: {},
    onSubmit: (values: any) => {
      const newValues = {
        ...values,
        additional: {
          ...values.additional,
          parentUserId: +values.additional.parentUserId,
        },
      };
      setValues(newValues);
      updateUser(newValues).then(() => {
        if (params && "id" in params) fetchUser(userId);
      });
    },
  });

  const [availableUserSearch, setAvailableUserSearch] = useState<
    string | undefined
  >();

  const { values, handleSubmit, handleChange, setFieldValue, setValues } =
    formik;

  const [saveAvatarAdmin] = useSaveAvatarAdminMutation();

  const [avatarButtons, setAvatarButtons] = useState(false);
  const [value, setValue] = useState(0);
  const [available, setAvailable] = useState({ items: [] });
  const [isAccessActive, setIsAccessActive] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(
    values?.general?.imageName || ""
  );
  const [shortImage, setShortImage] = useState<string>(
    values?.general?.shortImage || ""
  );

  const [open, setOpen] = useState<boolean>(false);
  const [showFullAvatar, setShowFullAvatar] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileLoading, setFileLoading] = useState(false);

  const handleChangeTab = (_: Event, value: number) => {
    setValue(value);
  };


  const reserPasswordFromAdmin = async () => {
    try {
      const res  = resetPasswordAdmin({
        userId : userId
      })
      toast.success("Пароль успешно сброшен")
    } catch (error) {
      toast.error("Не удалось сбросить пароль")
      console.log(error);
    }
  }

  useEffect(() => {
    if (params && "id" in params) fetchUser(userId);
  }, [params.id]);

  useEffect(() => {
    if (avatar) {
      setFieldValue("general.imageName", avatar);
    }
  }, [avatar]);

  const getAvailableUser = async () => {
    try {
      const sendData = {
        smart: "",
      };
      const res = await availableUser(sendData);
      //@ts-ignore
      setAvailable(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAvailableUser();
  }, []);

  useEffect(() => {
    if (data) {
      setValues({
        ...data,
        modulAccess: {
          items:
            data.modulAccess?.items?.map((item: any) => ({
              ...item,
              id: Math.random().toString(24),
            })) || [],
        },
      });
      setAvatar(data?.general?.imageName || "");
      setShortImage(data?.general?.shortImage || "");
    }
  }, [data]);

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
    if (!result || !userId) return;

    setFileLoading(true);
    try {
      const formData = new FormData();
      formData.append("1", result.originalImage);
      const response = await fileService.uploadFileV2(formData);
      const resp = response as { data: AvatarBody2 };

      const avatarData = await saveAvatarAdmin({
        ...resp.data,
        userId,
        isSmall: true,
        pointX: result.center.x,
        pointY: result.center.y,
        radius: result.radius,
      }).unwrap();

      setAvatar(avatarData.shortImage);
      setShortImage(avatarData.image);

      setFieldValue("general.imageName", avatarData.shortImage);
      setFieldValue("general.shortImage", avatarData.image);

      toast.success("Аватар обновлен");
    } catch (error) {
      toast.error("Ошибка при обновлении аватара");
    } finally {
      setFileLoading(false);
      setOpen(false);
    }
  };

  const historyColumns = [
    {
      flex: 2,
      field: "interface",
      headerName: "Интерфейс",
    },
    {
      field: "myProperty",
      headerName: "Объект",
    },
    {
      field: "changes",
      headerName: "Изменения",
    },
    {
      field: "change_date",
      headerName: "Дата",
      valueFormatter: (params: any) => formatDate(params.vaue),
    },
  ];

  const fileColumns = [
    {
      flex: 1,
      field: "no",
      headerName: "№",
    },
    {
      flex: 2,
      field: "name",
      headerName: "Наименование документа",
    },
    {
      field: "createAt",
      headerName: "Дата",
      valueFormatter: (params: any) => formatDate(params.value),
    },
  ];

  const handleChangeRole = (access: any) => {
    const newValues = {
      ...values,
      additional: { ...values.additional, roleDetails: access },
    };
    setValues(newValues);
  };

  const handleChangeKey = (key: string) => (event: any) => {
    const regexp = /^[a-zA-Z]{0,}$/;
    const value = event.target.value;

    if (regexp.test(value)) {
      setFieldValue(key, value);
    }
  };

  if (!data) {
    return null;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="tw-my-5">
      <div>
        <div>
          <Button variant="outlined" onClick={handleGoBack}>
            Назад
          </Button>
        </div>
        <h1 className="tw-text-center tw-mb-5">Профиль пользователя</h1>
        <div className="tw-grid tw-grid-flow-col tw-grid-cols-3 tw-gap-4">
          <div className="tw-col-span-1">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
                boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.24)",
                marginBottom: 2,
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
                {fileLoading && (
                  <i className="tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
                    <CircularProgress />
                  </i>
                )}
                <Tooltip title="Нажмите для просмотра" placement="top">
                  <Box
                    onClick={() => {
                      setShowFullAvatar(avatar ? true : false);
                    }}
                    width={250}
                    height={250}
                    component="img"
                    style={{ opacity: fileLoading ? "0.2" : 1 }}
                    src={shortImage || "/images/user-avatar.png"}
                    alt="user-avatar"
                  />
                </Tooltip>
                {showFullAvatar && (
                  <ImageDialog
                    open={showFullAvatar}
                    onClose={() => setShowFullAvatar(false)}
                    image={avatar}
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
            <InputGroup>
              <Input
                label="Фамилия"
                name="general.surName"
                value={data?.general?.surName}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Input
                label="Имя"
                name="general.name"
                value={data?.general?.name}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Input
                label="Отчество"
                name="general.patronicName"
                value={data?.general?.patronicName}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Input
                label="Фамилия(английский)"
                name="general.surNameEN"
                value={data?.general?.surNameEN}
                onChange={handleChangeKey("general.surNameEN")}
              />
            </InputGroup>
            <InputGroup>
              <Input
                label="Имя(английский)"
                name="general.nameEN"
                value={data?.general?.nameEN}
                onChange={handleChangeKey("general.nameEN")}
              />
            </InputGroup>
            <InputGroup>
              <Input
                label="Отчество(английский)"
                name="general.patronicNameEN"
                value={data?.general?.patronicNameEN}
                onChange={handleChangeKey("general.patronicNameEN")}
              />
            </InputGroup>

            <InputGroup>
              <Input
                label="Моб. телефон"
                name="general.phone"
                type="phone"
                value={data?.general?.phone}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Input
                label="E-mail"
                name="general.email"
                value={data?.general?.email}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Input
                label="ИНН"
                name="general.inn"
                value={data?.general?.inn}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Input
                label="Серия и номер паспорта"
                name="general.passportNumber"
                value={data?.general?.passportNumber}
                onChange={handleChange}
              />
            </InputGroup>
            {/* <InputGroup>
              <Autocomplete
                disablePortal
                options={
                  //@ts-ignore
                  available?.data?.items?.map((item: any) => ({
                    id: item.id,
                    value: item.value,
                  })) || []
                }
                getOptionLabel={(option: any) => option.value as string}
                size="small"
                noOptionsText="Нет данных"
                value={
                  values?.additional?.parentUserId
                    ? {
                        id: values?.additional?.parentUserId,
                        value:
                          //@ts-ignore
                          available?.data?.items?.find(
                            (item: any) =>
                              item.id === values?.additional?.parentUserId
                          )?.value || "",
                      }
                    : null
                }
                isOptionEqualToValue={(option: any, value: any) =>
                  option.id === value.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="additional.parentUserId"
                    label="Вышестоящий пользователь"
                  />
                )}
                renderOption={(props, option: any) => (
                  <li {...props} key={option.id}>
                    {option.value}
                  </li>
                )}
                onChange={(event, value: any) => {
                  console.log("Selected value:", value);
                  if (value) {
                    console.log("Setting parentUserId:", value.id);
                    setFieldValue("additional.parentUserId", value.id);
                    setText(value.value);
                  } else {
                    console.log("Clearing parentUserId");
                    setFieldValue("additional.parentUserId", null);
                    setText("");
                  }
                }}
                onInputChange={onCompanyInputChange}
              />
            </InputGroup> */}
          </div>
          <div className="tw-col-span-2">
            <div className="tw-flex tw-justify-end tw-gap-2">
              <Button variant="outlined" onClick={() => reserPasswordFromAdmin()}>
                сбросить пароль
              </Button>
              <LoadingButton
                type="submit"
                loading={isLoading}
                onClick={handleSubmit as any}
                variant="outlined"
                color="success"
                endIcon={<SaveIcon fill="currentColor" stroke="none" />}
              >
                Сохранить
              </LoadingButton>
              <Button
                variant="outlined"
                endIcon={<BadgeIcon fill="currentColor" stroke="none" />}
                onClick={() => setIsAccessActive(!isAccessActive)}
              >
                {isAccessActive
                  ? "Закрыть доступ на изменения"
                  : "Внести изменения в доступы"}
              </Button>
            </div>
            <Tabs value={value} onChange={handleChangeTab} aria-label="tabs">
              <Tab label="Полная информация" value={0} />
              <Tab label="Файлы" value={1} />
              <Tab label="История" value={2} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <Additional
                data={values?.additional}
                dataGeneral={data?.general}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            </TabPanel>
            {/* Files datatable */}
            <TabPanel value={value} index={1}>
              <div>
                <DataTable
                  columns={fileColumns}
                  items={data?.files}
                  isLoading={isFetching}
                  page={1}
                  setPage={() => {}}
                  totalItems={0}
                />
              </div>
            </TabPanel>
            {/* History datatable */}
            <TabPanel value={value} index={2}>
              <div>
                <DataTable
                  columns={historyColumns}
                  items={data?.histories}
                  isLoading={isFetching}
                  page={1}
                  setPage={() => {}}
                  totalItems={0}
                />
              </div>
            </TabPanel>
          </div>
        </div>
      </div>
      <div>
        <h1 className="tw-text-center tw-mb-5">Доступы и права</h1>
        <Access
          onChange={handleChangeRole}
          disabled={!isAccessActive}
          data={data?.additional?.roleDetails}
          formik={formik}
        />
      </div>
    </div>
  );
};
