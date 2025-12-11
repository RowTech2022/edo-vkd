import { useEffect, FormEvent, useState, useMemo } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  useAvailableUserMutation,
  useCreateUserMutation,
  useLazyFetchUserByIdQuery,
  UserCreateRequest,
  useUpdateUserMutation,
} from "@services/admin/userApi";
import { useFormik } from "formik";
import {
  useFetchOrganisationListQuery,
  useFetchDepartmentListQuery,
  useFetchUserTypesQuery,
  useFetchUserPositionsQuery,
  useFetchTreasureCodesQuery,
} from "@services/generalApi";
import { CustomTextField, InputGroup, ValueIDAutocomplete } from "@ui";
import {
  USER_STATUSES,
  useToast,
  AUTHORIZATION_TYPES,
  deepCopy,
  toastPromise,
  newDateFormat,
} from "@utils";
import Access from "@root/components/admin/Profiles/access";
import ModuleAccess from "@root/components/admin/Roles/modules-access";
import { useNavigate, useParams } from "react-router";
import { getLoginPattern, getNamePattern } from "@root/shared/utils/pattern";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export const AdminProfileCreatePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const { data: departments } = useFetchDepartmentListQuery();
  const [text, setText] = useState<string | undefined>();
  const { data: orgs } = useFetchOrganisationListQuery({ text });
  const { data: userTypes } = useFetchUserTypesQuery();
  const { data: treasureCode } = useFetchTreasureCodesQuery();
  const { data: userPositions } = useFetchUserPositionsQuery();
  const [available, setAvailable] = useState({ items: [] });
  const [fetchData, { data: details }] = useLazyFetchUserByIdQuery();
  const [availableUser] = useAvailableUserMutation();
  const [requisites, setRequisites] = useState<string[]>([]);
  const [smart, setSmart] = useState("");

  //const orgs = useFetchOrganisationListQuery({})

  const onCompanyInputChange = (e: any, value: string) => {
    setText(value);
  };
  const [createUser, { isLoading, isError, isSuccess, data }] =
    useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const initialValues = useMemo(() => {
    if (!details)
      return {
        modulAccess: {
          items: [],
        },
      };

    const data = deepCopy(details);

    data.modulAccess.items?.forEach((item: any) => {
      item.id = Math.random().toString(26);
    });
    return data;
  }, [details]);

  useEffect(() => {
    if (id) {
      fetchData(Number(id) || 0);
    }
  }, [id]);

  const formik = useFormik<any>({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSave({
        ...values,
        additional: {
          ...values.additional,
          parentUserId: +values.additional.parentUserId,
        },
      });
    },
  });
  const [moduleAccess, setModuleAccess] = useState(false);
  const {
    values,
    handleSubmit: onSubmit,
    handleChange,
    setFieldValue,
  } = formik;
  const handleSuccess = () => {
    navigate(`/users/me/admin/profile/${(data as any)?.id}`);
  };
  useToast({
    successText: "Пользователь создан.",
    isError,
    isSuccess,
    onSuccess: handleSuccess,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSave = (values: UserCreateRequest) => {
    const { additional, ...rest } = values || {};

    if (details) {
      toastPromise(
        updateUser(
          //@ts-ignore
          {
            id: Number(id) || 0,
            additional: additional,
            ...rest,
          }
        ),
        {
          pending: "Данные сохраняются",
          success: "Данные пользователя успешно изменены",
          error: "Произошло ошибка",
        }
      );
    } else {
      createUser(
        //@ts-ignore
        {
          additional: additional,
          ...rest,
        }
      );
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit && onSubmit();
  };

  const handleChangeRole = (values: any) => {
    setFieldValue("additional.roleDetails", values);
  };

  const handleChangeWithPattern = (key: string, pattern: RegExp) => {
    return (e: any) => {
      const value = e.target.value;

      if (!pattern.test(value)) return;
      // if (value.trim() === "") return;

      setFieldValue(key, value);
    };
  };

  const handleRequisitesChange = (e: any, value: any) => {
    const formattedRequisites = value
      .map((val: string) => {
        //@ts-ignore
        const selectedItem = available?.data?.items.find(
          (item: any) => item.value === val
        );
        return selectedItem
          ? { id: selectedItem.id, value: selectedItem.value }
          : null;
      })
      .filter((item: any) => item !== null);

    setFieldValue("additional.parentUser", formattedRequisites);
    setRequisites(value);
  };

  const getAvailableUser = async (param: string) => {
    try {
      const sendData = {
        smart: param,
      };
      const res = await availableUser(sendData);
      //@ts-ignore
      setAvailable(res);
    } catch (error) {
      console.log(error);
    }
  };

  const InputChange = (e: any, val) => {
    setSmart(val);
  };

  useEffect(() => {
    getAvailableUser(smart);
  }, [smart]);

  return (
    <form method="POST" onSubmit={handleSubmit} className="tw-my-5">
      <div>
        <h1 className="tw-text-center tw-mb-5">
          Страница регистрации пользователя
        </h1>
        <div className="tw-grid tw-grid-cols-2">
          <div className="tw-border-2">
            <h3 className="tw-mb-5 tw-w-full tw-max-w-[400px] tw-text-xl tw-text-center tw-py-2 tw-bg-white tw-border-l-0 tw-border">
              Общая информация *
            </h3>
            <div className="tw-w-1/2 tw-mx-auto">
              <InputGroup>
                <TextField
                  size="small"
                  value={values.general?.name || ""}
                  label="Имя"
                  name="general.name"
                  onChange={handleChangeWithPattern(
                    "general.name",
                    getNamePattern()
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.general?.surName || ""}
                  label="Фамилия"
                  name="general.surName"
                  onChange={handleChangeWithPattern(
                    "general.surName",
                    getNamePattern()
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.general?.patronicName || ""}
                  label="Отчество"
                  name="general.patronicName"
                  onChange={handleChangeWithPattern(
                    "general.patronicName",
                    getNamePattern()
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.general?.nameEN || ""}
                  label="Имя(английский)"
                  // name="general.name_En"
                  onChange={handleChangeWithPattern(
                    "general.nameEN",
                    /^[a-zA-Z]{0,}$/
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.general?.surNameEN || ""}
                  label="Фамилия(английский)"
                  // name="general.surName_En"
                  onChange={handleChangeWithPattern(
                    "general.surNameEN",
                    /^[a-zA-Z]{0,}$/
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.general?.patronicNameEN || ""}
                  label="Отчество(английский)"
                  // name="general.patronicName_En"
                  onChange={handleChangeWithPattern(
                    "general.patronicNameEN",
                    /^[a-zA-Z]{0,}$/
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.general?.inn || ""}
                  label="ИНН пользователя"
                  name="general.inn"
                  onChange={handleChangeWithPattern("general.inn", /^[0-9]*$/)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.general?.phone || ""}
                  label="Номер телефона"
                  name="general.phone"
                  type="phone"
                  required
                  onChange={handleChangeWithPattern(
                    "general.phone",
                    /^[0-9]*$/
                  )}
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  type="email"
                  size="small"
                  value={values.general?.email || ""}
                  label="Эл. адрес"
                  name="general.email"
                  required
                  onChange={handleChangeWithPattern(
                    "general.email",
                    /^[^\s]*$/
                  )}
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.general?.passportNumber || ""}
                  label="Серия и номер паспорта"
                  name="general.passportNumber"
                  onChange={handleChangeWithPattern(
                    "general.passportNumber",
                    /^[^ ]*$/
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={
                    (values.general?.nameEN
                      ? values.general?.nameEN + " "
                      : "") + (values.general?.surNameEN || "")
                  }
                  label="Имя пользователя"
                  name="general.userName"
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={
                    (values.general?.name ? values.general?.name + " " : "") +
                    (values.general?.surName || "")
                  }
                  label="Имя пользователя RU"
                  name="general.userNameRU"
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </div>
          </div>
          <div className="tw-border-2 tw-border-l-0">
            <h3 className="tw-mb-5 tw-w-full tw-max-w-[400px] tw-text-xl tw-text-center tw-py-2 tw-bg-white tw-border-l-0 tw-border">
              Дополнительная информация
            </h3>
            <div className="tw-w-1/2 tw-mx-auto">
              <InputGroup>
                <TextField
                  size="small"
                  value={values.additional?.loginTfmis || ""}
                  label="Логин TFMIS"
                  name="additional.loginTfmis"
                  onChange={handleChangeWithPattern(
                    "additional.loginTfmis",
                    getLoginPattern()
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.additional?.loginAd || ""}
                  label="Логин AD"
                  name="additional.loginAd"
                  onChange={handleChangeWithPattern(
                    "additional.loginAd",
                    getLoginPattern()
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.additional?.userLogin || ""}
                  label="Логин User"
                  name="additional.userLogin"
                  onChange={handleChangeWithPattern(
                    "additional.userLogin",
                    getLoginPattern()
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                {/* <ValueIDAutocomplete
                size="small"
                  label="Наименование организации"
                  name="additional.organisation"
                  value={values.additional?.organisation}
                  options={orgs?.items || []}
                  onChange={setFieldValue}
                  required
                /> */}

                <Autocomplete
                  disablePortal
                  //style={getInputStyles('company')}
                  options={orgs?.items || []}
                  getOptionLabel={(option: any) => option.value as string}
                  size="small"
                  noOptionsText="Нет данных"
                  value={values.additional?.organisation}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.id == value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="additional.organisation"
                      label="Наименование организации*"
                    />
                  )}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option.id}>
                      {option.value}
                    </li>
                  )}
                  onChange={(event, value: any) => {
                    setFieldValue("additional.organisation", value);
                    setText(value?.value);
                  }}
                  //{...getFieldErrors(formik, 'company')}
                  color="red"
                  onInputChange={onCompanyInputChange}
                />
              </InputGroup>
              <InputGroup>
                <ValueIDAutocomplete
                  size="small"
                  label="Наименование отдела"
                  name="additional.otdel"
                  value={values.additional?.otdel}
                  onChange={setFieldValue}
                  options={departments?.items || []}
                  required
                />
              </InputGroup>
              <InputGroup>
                <ValueIDAutocomplete
                  size="small"
                  label="Должность"
                  name="additional.position"
                  value={values?.additional?.position}
                  options={userPositions?.items || []}
                  onChange={setFieldValue}
                  required
                />
              </InputGroup>
              <InputGroup>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Дата выпуска сертификата"
                    inputFormat={newDateFormat}
                    value={values?.additional?.certIssueDate || null}
                    onChange={(newValue) => {
                      setFieldValue("additional.certIssueDate", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </InputGroup>
              <InputGroup>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Дата истечение срока сертификата"
                    inputFormat={newDateFormat}
                    value={values?.additional?.certExpireDate || null}
                    onChange={(newValue) => {
                      setFieldValue("additional.certExpireDate", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </InputGroup>
              <InputGroup>
                <ValueIDAutocomplete
                  size="small"
                  label="Статус пользователя"
                  name="additional.status"
                  options={USER_STATUSES}
                  value={values?.additional?.status || null}
                  onChange={setFieldValue}
                  required
                />
              </InputGroup>
              <InputGroup>
                <TextField
                  size="small"
                  value={values.additional?.certification || ""}
                  label="Сертификат"
                  name="additional.certification"
                  onChange={handleChangeWithPattern(
                    "additional.certification",
                    getNamePattern()
                  )}
                  required
                />
              </InputGroup>
              <InputGroup>
                <ValueIDAutocomplete
                  size="small"
                  label="Тип пользователя"
                  name="additional.userType"
                  value={values?.additional?.userType}
                  options={userTypes?.items || []}
                  onChange={setFieldValue}
                  required
                />
              </InputGroup>
              <InputGroup>
                <ValueIDAutocomplete
                  size="small"
                  label="Авторизация"
                  name="additional.autorization"
                  value={values?.additional?.autorization || null}
                  options={AUTHORIZATION_TYPES || []}
                  onChange={setFieldValue}
                  required
                />
              </InputGroup>
              <InputGroup>
                <ValueIDAutocomplete
                  size="small"
                  label="Еденица учёта*"
                  name="additional.treasureCode"
                  value={values?.additional?.treasureCode}
                  options={treasureCode?.items || []}
                  onChange={setFieldValue}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Autocomplete
                  size="small"
                  sx={{ width: "100%" }}
                  multiple
                  disablePortal
                  // value={values?.additional?.parentUser?.map((item: any) => item?.value) || []}
                  id="combo-box-demo"
                  options={
                    //@ts-ignore
                    available?.data?.items?.map((item: any) => item.value) || []
                  }
                  onChange={handleRequisitesChange}
                  onInputChange={InputChange}
                  renderInput={(params) => (
                    <CustomTextField
                      params={params}
                      label="Вышестоящий пользователь"
                    />
                  )}
                />
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-mt-2">
        <div className="tw-my-5">
          {moduleAccess ? (
            <ModuleAccess id={0} formik={formik} />
          ) : (
            <Access onChange={handleChangeRole} />
          )}
        </div>
        <div className="tw-mb-5 tw-flex tw-gap-4 tw-justify-center">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon fill="currentColor" stroke="none" />}
            onClick={handleGoBack}
          >
            Назад
          </Button>
          <LoadingButton
            variant="outlined"
            type="submit"
            startIcon={<SaveIcon />}
            color="success"
            loadingPosition="end"
            loading={isLoading}
          >
            Сохранить
          </LoadingButton>
          <Button
            color="error"
            variant="outlined"
            startIcon={<ClearIcon fill="currentColor" stroke="none" />}
          >
            Удалить
          </Button>
        </div>
      </div>
    </form>
  );
};
