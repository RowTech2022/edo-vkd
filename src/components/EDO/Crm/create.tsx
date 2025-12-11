import { Autocomplete, Box, Button, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import { CustomButton, CustomTextField, FormAutocomplete } from "@ui";
import { Formik } from "formik";
import { FC, useState, useEffect, ChangeEvent } from "react";
import {
  IOrganization,
  IOrganizationCreate,
  useFetchCreateOrganisationMutation,
  useFetchUpdateOrganisationMutation,
} from "@services/organizationsApi";
import { useFetchOrganisationsQuery } from "@services/userprofileApi";
import {
  useFetchTreasureCodesQuery,
  useLazyFetchSeqnumsQuery,
  useFetchUserSearchMutation,
  useFetchOrganisationListQuery,
} from "@services/generalApi";
import { useFetchTerrOnlyQuery } from "@services/chaptersApi";

import {
  useFetchOnlyGRBSQuery,
  useFetchOnlyPBSMutation,
} from "@services/pbsApi";

import { getFieldConfigs } from "./utils";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ValueId, ValueIdWithPosition } from "@services/api";
import { INN_REGEXP, newDateFormat } from "@utils";
import { BlankForm } from "./forms/BlankForm";

const initialValues: IOrganizationCreate = {
  inn: "",
  name: "",
  orgId: "",
  custId: 0,
  contractNo: "",
  contractDate: new Date().toISOString(),
  grbsResponsible: null,
  grbs: null,
  pbs: null,
  address: "",
  seqnums: [],
  //files: [],
  files: [],
  requisites: [],
  orgType: null,
  terCode: null,
  treasureCode: null,
  parrenOrg: null,
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

interface ICrmCreate {
  onClose: () => void;
  orgType: { id: string; value: string };
  m_new: boolean;
  m_data?: IOrganization;
}

export const CrmCreate: FC<ICrmCreate> = ({
  onClose,
  orgType,
  m_new,
  m_data,
}) => {
  const [text, setText] = useState<string | undefined>();

  const { data: companyList } = useFetchOrganisationListQuery({ text });

  const { data: orgs } = useFetchOrganisationsQuery();
  const treasureCodes = useFetchTreasureCodesQuery();
  const terCode = useFetchTerrOnlyQuery();

  const terList =
    terCode?.data?.items?.map((item: any) => ({
      id: item.id,
      value: item.terName,
    })) || [];

  const INITIAL_VALUES = m_data || initialValues;

  const [seqnumsQuery, { isFetching: isFetchSeq }] = useLazyFetchSeqnumsQuery();

  const grbsData = useFetchOnlyGRBSQuery({ filter: "" });

  const [fetchPbs] = useFetchOnlyPBSMutation();
  const [fetchUser] = useFetchUserSearchMutation();

  const [createOrg] = useFetchCreateOrganisationMutation();
  const [updateOrg] = useFetchUpdateOrganisationMutation();
  const [pbsList, setPbsList] = useState<ValueId[]>([]);
  const [userList, setUserList] = useState<ValueIdWithPosition[]>([]);
  const [seqnums, setSeqnums] = useState<ValueId[]>();
  const [requisites, setRequisites] = useState<string[]>(
    m_data?.requisites ? [...m_data?.requisites] : []
  );
  const [current, setCurrent] = useState<string>("");
  const [emptyFileName, setEmptyFileName] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setCurrent("");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const getUsers = (item: string) => {
    fetchUser({ filter: item })
      .then((res: any) => {
        setUserList(res.data.items);
      })
      .catch((err: any) => {
        setUserList([]);
      });
  };

  const getPbs = (item: ValueId | null) => {
    fetchPbs({ filter: item?.id?.toString() || "" })
      .then((res: any) => {
        setPbsList(res.data.items);
      })
      .catch((err: any) => {
        setPbsList([]);
      });
  };

  const removeReq = (prs: string[]) => {
    setRequisites(prs);
  };

  const addToReq = () => {
    requisites.push(current);
    setCurrent("");
    setOpen(false);
  };

  const onCompanyInputChange = (e: any, value: string) => {
    setText(value);
  };

  const LoadSeqnum = (pbs: ValueId | null) => {
    seqnumsQuery({ orgs: [pbs] }).then(({ data }) => {
      setSeqnums(data?.items || []);
    });
  };

  useEffect(() => {
    getUsers("");
  }, []);

  return (
    <div className="tw-rounded-[16px] tw-overflow-hidden tw-max-w-[60vw]">
      <h2
        style={{
          padding: "20px",
          backgroundColor: "#607D8B",
          color: "white",
        }}
      >
        {(m_new ? "Создание организации" : "Редактирование организаци") +
          "  (" +
          orgType.value +
          ")"}
      </h2>
      <div className="tw-max-h-[70vh] tw-overflow-auto">
        <Formik
          initialValues={INITIAL_VALUES}
          //validationSchema={validationSchema}
          onSubmit={(values) => {
            const updatedOrgFiles = values.files.map((file: any) => {
              if (file.isNew) {
                return { ...file, id: null };
              }
              return file;
            });
            const data = {
              ...values,
              terCode: { id: String(values.terCode?.id), value: "" },
              orgType: orgType,
              requisites: requisites,
              files: updatedOrgFiles,
            };

            if (m_new) {
              if (values.files.filter((item: any) => !item.name).length > 0) {
                toast.error("Поле название должно быть заполнено");
                setEmptyFileName(true);
                return;
              }
              if (values.files.filter((item: any) => !item.name).length > 0) {
                toast.error("Поле название бланка должно быть заполнено");
                setEmptyFileName(true);
                return;
              }
              // const handleSign = () => {
              //   if (props.entry) {
              toast.promise(
                createOrg(data).then((res: any) => {
                  onClose();
                }),
                {
                  pending: "Организация создается",
                  success: "Организация успешно создана",
                  error: "Произошла ошибка",
                }
              );
            } else {
              if (values.files.filter((item: any) => !item.name).length > 0) {
                toast.error("Поле название должно быть заполнено");
                setEmptyFileName(true);
                return;
              }
              if (values.files.filter((item: any) => !item.name).length > 0) {
                toast.error("Поле название бланка должно быть заполнено");
                setEmptyFileName(true);
                return;
              }
              toast.promise(
                updateOrg(data).then((res: any) => {
                  onClose();
                }),
                {
                  pending: "Организация редактируется",
                  success: "Организация успешно изменена",
                  error: "Произошла ошибка",
                }
              );
            }
          }}
        >
          {(formik) => {
            return (
              <>
                <Box
                  display="grid"
                  style={{
                    gridTemplateColumns: "repeat(2, minmax(400px, 1fr))",
                    padding: "20px 20px",
                    gap: "15px",
                  }}
                >
                  <CustomTextField
                    size="small"
                    value={formik.values.inn}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      formik.setFieldValue("inn", event.target.value)
                    }
                    id="outlined-basic"
                    label="ИНН"
                    variant="outlined"
                    {...getFieldConfigs(formik, "inn")}
                    regexp={INN_REGEXP}
                    required
                  />
                  <CustomTextField
                    size="small"
                    value={formik.values.orgId}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      formik.setFieldValue("orgId", event.target.value)
                    }
                    id="outlined-basic"
                    label="Идентификатор"
                    variant="outlined"
                    {...getFieldConfigs(formik, "orgId")}
                    required
                  />
                  <CustomTextField
                    size="small"
                    value={formik.values.name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      formik.setFieldValue("name", event.target.value)
                    }
                    id="outlined-basic"
                    label="Название"
                    variant="outlined"
                    // regexp={ONLY_ALPHABETICAL}
                    {...getFieldConfigs(formik, "name")}
                  />

                  <Box display="flex" columnGap="15px">
                    <CustomTextField
                      className="tw-w-full"
                      size="small"
                      value={formik.values.contractNo}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        formik.setFieldValue("contractNo", event.target.value)
                      }
                      id="outlined-basic"
                      label="Номер договора"
                      variant="outlined"
                      // regexp={ONLY_NUMERIC}
                      {...getFieldConfigs(formik, "contractNo")}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        className="tw-w-full"
                        label="Дата договора"
                        inputFormat={newDateFormat}
                        value={formik.values.contractDate}
                        onChange={(newValue) => {
                          formik.setFieldValue("contractDate", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField size="small" {...params} />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                  <CustomTextField
                    size="small"
                    value={formik.values.address}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      formik.setFieldValue("address", event.target.value)
                    }
                    id="outlined-basic"
                    label="Адресс"
                    variant="outlined"
                    {...getFieldConfigs(formik, "address")}
                  />
                  <Autocomplete
                    size="small"
                    disablePortal
                    value={formik.values.terCode}
                    options={terList}
                    getOptionLabel={(option) => option.value as string}
                    id="combo-box-demo"
                    onChange={(e: any, value) => {
                      formik.setFieldValue("terCode", value);
                    }}
                    //sx={{ width: 300, marginBottom: '16px' }}
                    renderInput={(params) => (
                      <CustomTextField params={params} label="Код терретории" />
                    )}
                  />
                  <Autocomplete
                    size="small"
                    disablePortal
                    value={formik.values.treasureCode}
                    options={
                      treasureCodes.isSuccess ? treasureCodes.data.items : []
                    }
                    getOptionLabel={(option) => option.value as string}
                    id="combo-box-demo"
                    onChange={(e: any, value) => {
                      formik.setFieldValue("treasureCode", value);
                    }}
                    // sx={{ width: 300, marginBottom: '16px' }}
                    renderInput={(params) => (
                      <CustomTextField params={params} label="Единица учета" />
                    )}
                  />
                  <Autocomplete
                    size="small"
                    disablePortal
                    value={formik.values.grbsResponsible}
                    id="combo-box-demo"
                    options={userList}
                    getOptionLabel={(option) =>
                      (option.id + "-" + option.value) as string
                    }
                    onChange={(e: any, value) => {
                      formik.setFieldValue("grbsResponsible", value);
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        params={params}
                        label="ГРБС (Ответсвенный)"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          getUsers(event.target.value);
                        }}
                      />
                    )}
                  />

                  <Autocomplete
                    size="small"
                    disablePortal
                    value={formik.values.grbs}
                    id="combo-box-demo"
                    options={grbsData.isSuccess ? grbsData.data.items : []}
                    getOptionLabel={(option) =>
                      (option.id + "-" + option.value) as string
                    }
                    onChange={(e: any, value) => {
                      formik.setFieldValue("pbs", null);
                      getPbs(value);
                      formik.setFieldValue("grbs", value);
                    }}
                    //sx={{ width: 300, marginBottom: '16px' }}
                    renderInput={(params) => (
                      <CustomTextField params={params} label="ГРБС" />
                    )}
                  />

                  <Autocomplete
                    size="small"
                    disablePortal
                    value={formik.values.pbs}
                    id="combo-box-demo"
                    options={pbsList}
                    getOptionLabel={(option) =>
                      (option.id + "-" + option.value) as string
                    }
                    onChange={(e: any, value) => {
                      LoadSeqnum(value);
                      formik.setFieldValue("pbs", value);
                    }}
                    renderInput={(params) => (
                      <CustomTextField params={params} label="ПБС" />
                    )}
                  />
                  <Autocomplete
                    size="small"
                    value={formik.values.seqnums! as any}
                    multiple
                    disablePortal
                    options={seqnums || []}
                    getOptionLabel={(option) => option?.id}
                    renderInput={(params) => (
                      <CustomTextField
                        params={params}
                        label="Бюджетные заявки*"
                      ></CustomTextField>
                    )}
                    onChange={(event, value) => {
                      formik.setFieldValue("seqnums", value);
                    }}
                  />
                  <Box display="flex" columnGap="15px">
                    <Autocomplete
                      size="small"
                      multiple
                      disablePortal
                      value={requisites}
                      id="combo-box-demo"
                      options={requisites || []}
                      onChange={(e: any, value) => {
                        removeReq(value);
                      }}
                      sx={{ width: 520, marginBottom: "16px" }}
                      renderInput={(params) => (
                        <CustomTextField params={params} label="Реквезиты" />
                      )}
                    />

                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        marginBottom: "15px",
                      }}
                      onClick={handleOpen}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                  <Box sx={{ mt: "-20px" }}>
                    <FormAutocomplete
                      disablePortal
                      // style={getInputStyles("company")}
                      options={companyList?.items || []}
                      getOptionLabel={(option: any) => option.value as string}
                      size="small"
                      noOptionsText="Нет данных"
                      name="company"
                      label="Вышестоящая организация*"
                      //@ts-ignore
                      value={formik.values.parrenOrg}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.id === value.id
                      }
                      onChange={(event, value: any) => {
                        formik.setFieldValue("parrenOrg", value);
                        setText(value?.value);
                      }}
                      color="red"
                      onInputChange={onCompanyInputChange}
                    />
                  </Box>
                </Box>
                {/* <Box className="tw-px-[20px] tw-mb-4">
                  <DocumentsForm
                    formik={formik}
                    emptyFileName={emptyFileName}
                  />
                </Box> */}

                <Box className="tw-px-[20px] tw-mb-4">
                  <BlankForm formik={formik} emptyFileName={emptyFileName} />
                </Box>

                <div className="tw-flex tw-justify-end tw-flex-wrap tw-gap-4 tw-px-4 tw-mb-5">
                  <CustomButton
                    type="button"
                    color="primary"
                    variant="contained"
                    size="medium"
                    onClick={() => onClose()}
                    sx={{
                      fontWeight: 600,
                      marginLeft: "50px",
                      minWidth: "180px",
                      minHeight: "40px",
                    }}
                  >
                    Закрыть
                  </CustomButton>
                  <CustomButton
                    type="button"
                    color="primary"
                    variant="contained"
                    size="medium"
                    onClick={() => formik.submitForm()}
                    sx={{
                      fontWeight: 600,
                      minWidth: "180px",
                      minHeight: "40px",
                    }}
                  >
                    {m_new ? "Создать" : "Редактировать"}
                  </CustomButton>
                </div>
              </>
            );
          }}
        </Formik>

        <Modal open={open} onClose={handleClose}>
          <Box
            display="flex"
            columnGap="15px"
            sx={{ ...style, width: 600, borderRadius: "16px" }}
          >
            <TextField
              size="small"
              sx={{ width: "80%" }}
              onChange={(event) => {
                setCurrent(event.target.value);
              }}
              value={current}
              id="outlined-basic"
              label="Название"
              variant="outlined"
            />
            <Button
              type="button"
              color="primary"
              variant="contained"
              size="medium"
              onClick={() => addToReq()}
            >
              Добавить
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};
