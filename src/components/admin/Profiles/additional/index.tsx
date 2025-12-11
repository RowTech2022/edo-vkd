import {
  Autocomplete,
  Box,
  CardContent,
  Modal,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  Input,
  InputGroup,
  FormAutocomplete,
  Loading,
  ValueIDAutocomplete,
  AutocompleteWithAdd,
  CustomTextField,
} from "@ui";
import {
  useFetchOrganisationListQuery,
  useFetchUserTypesQuery,
  useFetchUserPositionsQuery,
  useFetchTreasureCodesQuery,
  useCreateDepartmentMutation,
  useFetchUserDepartmentsQuery,
  useCreateUserPositionsMutation,
} from "@services/generalApi";
import {
  StyledCard,
  StyledCardHeader,
} from "@root/components/EDO/Letters/Incoming/folders/modal";
import {
  useAvailableUserMutation,
  UserAdditional,
  UserGeneral,
} from "@services/admin/userApi";
import { USER_STATUSES, AUTHORIZATION_TYPES, newDateFormat } from "@utils";
import { useEffect, useState } from "react";
import { IValueId } from "src/services";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { startOfDay } from "date-fns";

const enum NewOptionType {
  department,
  position,
}
const ADD_NEW_OPTION: IValueId = { id: "-1", value: "__add_new__" };

interface FormPropsNew {
  name?: string;
  nameRU?: string;
  nameEN: string;
}
interface AdditionalProps {
  data: UserAdditional;
  dataGeneral: UserGeneral;
  setFieldValue: (name: string, value: any) => void;
  handleChange?: (e: React.ChangeEvent<any>) => void;
}

const Additional: React.FC<AdditionalProps> = ({
  data,
  dataGeneral,
  handleChange,
  setFieldValue,
}) => {
  console.log(1111, data);

  const [text, setText] = useState<string | undefined>();
  const { data: orgs, refetch } = useFetchOrganisationListQuery({ text });
  const [
    createDepartment,
    {
      isLoading: isLoadingDepartment,
      isError: isErrorDepartment,
      isSuccess: isSuccessDepartment,
    },
  ] = useCreateDepartmentMutation();
  const [
    createUserPosition,
    {
      isLoading: isLoadingUserPosition,
      isError: isErrorUserPosition,
      isSuccess: isSuccessUserPosition,
    },
  ] = useCreateUserPositionsMutation();
  const [availableUser] = useAvailableUserMutation();

  const [available, setAvailable] = useState({ items: [] });
  const [allAvailableUsers, setAllAvailableUsers] = useState({ items: [] });
  const [openNew, setOpenNew] = useState(false);
  const [newOption, setNewOption] = useState<NewOptionType | null>(null);

  const { data: userTypes } = useFetchUserTypesQuery();
  const { data: treasureCode } = useFetchTreasureCodesQuery();
  const {
    data: userPositions,
    isLoading: isLoadindUserPositions,
    refetch: refetchUserPositions,
  } = useFetchUserPositionsQuery();
  const {
    data: userDepartments,
    isLoading: isLoadingDepartments,
    refetch: refetchUserDepartments,
  } = useFetchUserDepartmentsQuery();
  const [requisites, setRequisites] = useState<any[]>([]);
  const [smart, setSmart] = useState("");

  const handleSelectChange = (name: string, value: any) => {
    setFieldValue(name, value);
  };

  const getAvailableUser = async (param: string) => {
    setAvailable({ items: [] });
    try {
      const sendData = { smart: param };
      const res = await availableUser(sendData);
      // @ts-ignore
      setAvailable(res?.data);
      if (param === "") {
        // @ts-ignore
        setAllAvailableUsers(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNew = (type: NewOptionType) => {
    setOpenNew(true);
    setNewOption(type);
  };

  const {
    handleSubmit,
    handleChange: handleChangeNew,
    values: valuesNew,
    resetForm: resetFormNew,
  } = useFormik<FormPropsNew>({
    initialValues: {
      name: "",
      nameRU: "",
      nameEN: "",
    },
    onSubmit(values) {
      if (newOption === NewOptionType.department)
        createDepartment(values as Required<FormPropsNew>).then((data) => {
          setOpenNew(false);
          resetFormNew();
          refetchUserDepartments();
        });
      if (newOption === NewOptionType.position)
        createUserPosition(values as Required<FormPropsNew>).then((data) => {
          setOpenNew(false);
          resetFormNew();
          refetchUserPositions();
        });
    },
  });

  const handleCloseNew = () => {
    if (!isLoadingDepartment) {
      setOpenNew(!openNew);
    }
  };

  useEffect(() => {
    getAvailableUser(smart);
  }, [smart]);

  useEffect(() => {
    if (data?.parentUser?.length) {
      setRequisites(data.parentUser.map((item: any) => item.value));
    }
  }, [data?.parentUser]);

  const onCompanyInputChange = (e: any, value: string) => {
    setText(value);
  };

  useEffect(() => {
    if (text?.length && text.length > 0) refetch();
  }, [text]);

  if (isLoadingDepartments || isLoadindUserPositions || !data) {
    return <Loading />;
  }

  const InputChange = (e: any, val: string) => {
    setSmart(val);
    // getAvailableUser(val);
  };

  const handleRequisitesChange = async (e: any, value: any[]) => {
    const formattedRequisites = await Promise.all(
      value.map(async (val: string) => {
        const sendData = { smart: val };
        const res = await availableUser(sendData);
        // @ts-ignore
        const selectedItem = res?.data?.items?.[0];
        return selectedItem
          ? { id: selectedItem.id, value: selectedItem.value }
          : null;
      })
    );

    const filteredRequisites = formattedRequisites.filter(
      (item: any) => item !== null
    );

    // Пример использования:
    setFieldValue("additional.parentUser", filteredRequisites);
    setRequisites(value);
  };

  return (
    <Paper
      sx={{ overflowY: "auto", padding: "20px" }}
      square={true}
      elevation={2}
    >
      <div className="tw-my-5">
        <InputGroup cols={2}>
          <FormAutocomplete
            disablePortal
            options={orgs?.items || []}
            getOptionLabel={(option: any) => option.value as string}
            size="small"
            noOptionsText="Нет данных"
            name={`additional.organisation`}
            label="Наименование организации*"
            value={data?.organisation}
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value.id
            }
            onChange={(event, value: any) => {
              setFieldValue("additional.organisation", value);
              setText(value?.value);
            }}
            color="red"
            onInputChange={onCompanyInputChange}
          />
          <ValueIDAutocomplete
            size="small"
            label="Тип пользователя"
            name={`additional.userType`}
            options={userTypes?.items}
            onChange={handleSelectChange}
            value={data?.userType}
          />
        </InputGroup>
        <InputGroup cols={2}>
          <Input
            size="small"
            label="Логин TFMIS"
            name={`additional.loginTfmis`}
            onChange={handleChange}
            value={data?.loginTfmis || ""}
          />
          <ValueIDAutocomplete
            size="small"
            label="Статус"
            name={`additional.status`}
            onChange={handleSelectChange}
            options={USER_STATUSES}
            value={USER_STATUSES.find(
              (el) =>
                el.id === (data?.status as any) || el.id === data?.status?.id
            )}
          />
        </InputGroup>
        <InputGroup cols={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Дата выпуска сертификата"
              inputFormat={newDateFormat}
              value={data?.certIssueDate || null}
              onChange={(newValue) => {
                const cleanDate = newValue ? startOfDay(newValue) : null;
                setFieldValue("additional.certIssueDate", cleanDate);
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Дата истечение срока сертификата"
              inputFormat={newDateFormat}
              value={data?.certExpireDate || null}
              onChange={(newValue) => {
                const cleanDate = newValue ? startOfDay(newValue) : null;
                setFieldValue("additional.certExpireDate", cleanDate);
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
        </InputGroup>
        <InputGroup cols={2}>
          <Input
            size="small"
            label="Логин AD"
            name={`additional.loginAd`}
            value={data?.loginAd || ""}
            onChange={handleChange}
          />
          <Input
            size="small"
            label="Сертификат"
            name={`additional.certification`}
            onChange={handleChange}
            value={data?.certification || ""}
          />
        </InputGroup>
        <InputGroup cols={2}>
          <Input
            size="small"
            label="Логин User"
            name={`additional.userLogin`}
            value={data?.userLogin || ""}
            onChange={handleChange}
          />
          <ValueIDAutocomplete
            size="small"
            label="Авторизация"
            name={`additional.autorization`}
            onChange={handleSelectChange}
            options={AUTHORIZATION_TYPES}
            value={AUTHORIZATION_TYPES.find(
              (el) =>
                el.id === (data?.autorization as any) ||
                el.id === data?.autorization?.id
            )}
          />
        </InputGroup>
        <InputGroup cols={2}>
          <AutocompleteWithAdd
            size="small"
            label="Отдел"
            name={`additional.otdel`}
            getOptionLabel={(option) =>
              option.value === "__add_new__"
                ? "Добавить новый отдел"
                : option.value
            }
            filterOptions={(opts, state) => {
              const filtered = opts.filter(
                (opt) =>
                  opt.value !== "__add_new__" &&
                  opt.value
                    .toLowerCase()
                    .includes(state.inputValue.toLowerCase())
              );
              return [...filtered, ADD_NEW_OPTION];
            }}
            onChange={(name, newValue) => {
              if (newValue?.value === "__add_new__") {
                handleAddNew(NewOptionType.department);
              } else {
                handleSelectChange(name, newValue);
              }
            }}
            options={[...userDepartments.items, ADD_NEW_OPTION]}
            renderOption={(props, option) => (
              <li {...props}>
                {option.value === "__add_new__" ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#607d8b",
                      fontWeight: "bold",
                    }}
                  >
                    <AddIcon style={{ marginRight: 8 }} />
                    Добавить новый отдел
                  </span>
                ) : (
                  option.value
                )}
              </li>
            )}
            value={data?.otdel}
          />

          <AutocompleteWithAdd
            size="small"
            label="Должность"
            name={`additional.position`}
            getOptionLabel={(option) =>
              option.value === "__add_new__"
                ? "Добавить новую должность"
                : option.value
            }
            filterOptions={(opts, state) => {
              const filtered = opts.filter(
                (opt) =>
                  opt.value !== "__add_new__" &&
                  opt.value
                    .toLowerCase()
                    .includes(state.inputValue.toLowerCase())
              );
              return [...filtered, ADD_NEW_OPTION];
            }}
            onChange={(name, newValue) => {
              if (newValue?.value === "__add_new__") {
                handleAddNew(NewOptionType.position);
              } else {
                handleSelectChange(name, newValue);
              }
            }}
            options={[...userPositions.items, ADD_NEW_OPTION]}
            renderOption={(props, option) => (
              <li {...props}>
                {option.value === "__add_new__" ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#607d8b",
                      fontWeight: "bold",
                    }}
                  >
                    <AddIcon style={{ marginRight: 8 }} />
                    Добавить новую должность
                  </span>
                ) : (
                  option.value
                )}
              </li>
            )}
            value={data?.position}
          />
        </InputGroup>
        <InputGroup cols={2}>
          <Autocomplete
            size="small"
            multiple
            disablePortal
            value={requisites}
            id="combo-box-demo"
            options={
              // @ts-ignore
              available?.items.map((item: any) => item.value) || []
            }
            filterOptions={(options) => options}
            onInputChange={InputChange}
            onChange={handleRequisitesChange}
            renderInput={(params) => (
              <CustomTextField
                params={params}
                label="Вышестоящий пользователь"
              />
            )}
          />
          <Box sx={{ display: "flex", gap: "20px" }}>
            <TextField
              name="supplier"
              label="Дата создания*"
              value={data?.createAt}
              disabled={data?.createAt ? false : true}
              focused={data?.createAt ? true : false}
              size="small"
              onChange={handleChange}
            />
            <ValueIDAutocomplete
              size="small"
              label="Еденица учёта*"
              name={`additional.treasureCode`}
              options={treasureCode?.items}
              onChange={handleSelectChange}
              value={data?.treasureCode}
            />
          </Box>
        </InputGroup>
        <InputGroup cols={2}>
          <Input
            size="small"
            label="Имя пользователья"
            name={`general.userName`}
            value={dataGeneral?.userName}
            onChange={handleChange}
          />
          <Input
            size="small"
            label="Имя пользователья RU"
            name={`general.userNameRU`}
            onChange={handleChange}
            value={dataGeneral?.userNameRU}
          />
        </InputGroup>
      </div>
      <Modal open={openNew} onClose={handleCloseNew}>
        <StyledCard>
          <StyledCardHeader
            title={
              newOption === NewOptionType.department
                ? "Добавить отдел"
                : "Добавить должность"
            }
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  name="name"
                  label="Название"
                  value={valuesNew.name}
                  disabled={isLoadingDepartment || isLoadingUserPosition}
                  required
                  fullWidth
                  onChange={handleChangeNew}
                />
                <TextField
                  name="nameRU"
                  label="Название RU"
                  value={valuesNew.nameRU}
                  disabled={isLoadingDepartment || isLoadingUserPosition}
                  required
                  fullWidth
                  onChange={handleChangeNew}
                />
                <TextField
                  name="nameEN"
                  label="Название EN"
                  value={valuesNew.nameEN}
                  disabled={isLoadingDepartment || isLoadingUserPosition}
                  required
                  fullWidth
                  onChange={handleChangeNew}
                />
                <LoadingButton
                  type="submit"
                  variant="outlined"
                  loading={isLoadingDepartment || isLoadingUserPosition}
                  fullWidth
                >
                  Сохранить
                </LoadingButton>
              </Stack>
            </form>
          </CardContent>
        </StyledCard>
      </Modal>
    </Paper>
  );
};

export default Additional;
