import {
  Autocomplete,
  Button,
  Box,
  FormGroup,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Card,
  AngleDoubleLeftIcon,
  DiskIcon,
  FileDeleteIcon,
  PencilIcon,
  CrossCircleIcon,
} from "@ui";
import { Form, Formik, useFormik } from "formik";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  useFetchRejectReasonsQuery,
  useFetchSeqnumsQuery,
  useFetchTreasureCodesQuery,
  useFetchUserPositionsQuery,
  useFetchYearsQuery,
} from "@services/generalApi";
import { useFetchPBSQuery } from "@services/pbsApi";
import { useLazyFetchMfListForTfmisAccessQuery } from "@services/accessMfApi";
import { CertifyingDocumentDTO } from "@services/signatureCardApi";
import {
  useDeleteTFMISAccessApplicationMutation,
  useRejectTFMISAccessApplicationMutation,
  useSaveTFMISAccessApplicationMutation,
  useSignTFMISAccessApplicationMutation,
  useCheckAprovedDocAccessApplicationMutation,
  useUpdateTFMISAccessApplicationMutation,
} from "@services/tfmisApi";
import { formatDate } from "@utils";
import {
  DocumentSelector,
  TfmisAccessApplicationStateIndicator,
} from "@components";

type Props = {
  new: boolean;
  entry?: TFMIS.AccessApplication;
};

export enum AccessApplicationStates {
  Registration = 1,
  HeadBo = 2,
  BudgetPreporation = 3,
  BudgetExpenditure = 4,
  Approve = 5,
  Checked = 6,
}

const INITIAL_VALUES: Pick<
  Nullable<TFMIS.AccessApplication>,
  "organisation" | "userInfo"
> = {
  organisation: {
    regUserId: 0,
    year: new Date().getFullYear(),
    treasureCode: null,
    inn: "",
    orgName: "",
    address: "",
    pbsCode: null,
    seqnums: [],
  },
  userInfo: {
    first_Fio: "",
    first_Position: null,
    first_Inn: "",
    first_Phone: null,
    first_Email: null,
    second_Fio: "",
    second_Position: null,
    second_Inn: "",
    second_Phone: null,
    second_Email: null,

    budgetExpenditureInfo: null,
    budgetPreparationInfo: null,
  },
};

enum SignType {
  Bukhgalter = 1,
  Rikovoditer = 2,
  KuratorPod = 3,
  NachPodgotovki = 4,
  KuratorRaskhod = 5,
  NachRaskhod = 6,
  Sardor = 7,
}

const MFTRCreate = (props: Props) => {
  const navigate = useNavigate();

  const [getMfAccedd, { isFetching }] = useLazyFetchMfListForTfmisAccessQuery();
  const [mfAccess, setMfAccess] = useState<TFMIS.IKuratonAndHeadInfo[]>();
  const [mfAccessExpenditure, setMfAccessExpenditure] =
    useState<TFMIS.IKuratonAndHeadInfo[]>();

  const yearsQuery = useFetchYearsQuery();
  const userPositionsQuery = useFetchUserPositionsQuery();
  const treasureCodesQuery = useFetchTreasureCodesQuery();
  const pbsQuery = useFetchPBSQuery({ filter: "" });
  const seqnumsQuery = useFetchSeqnumsQuery();
  const rejectReasonsQuery = useFetchRejectReasonsQuery({ type: 1 });

  const [documentSelectorOpen, setDocumentSelectorOpen] =
    useState<boolean>(false);

  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  const [selectedDocs, setSelectedDocs] = useState<CertifyingDocumentDTO[]>();

  const [saveApplication] = useSaveTFMISAccessApplicationMutation();
  const [updateApplication] = useUpdateTFMISAccessApplicationMutation();
  const [signApplication] = useSignTFMISAccessApplicationMutation();
  const [checkAprovedDoc] = useCheckAprovedDocAccessApplicationMutation();
  const [rejectApplication] = useRejectTFMISAccessApplicationMutation();
  const [deleteApplication] = useDeleteTFMISAccessApplicationMutation();

  const canSave = useMemo<boolean>(() => {
    if (props.new) {
      return true;
    }
    if (
      props.entry &&
      props.entry.state === AccessApplicationStates.Registration
    ) {
      return true;
    }
    return false;
  }, [props]);

  const LoadMfAccess = ({
    id,
    seq,
  }: {
    id: number;
    seq: { id: string; value: string }[];
  }) => {
    let seq1 = seq?.map((x) => parseInt(x.id)) || null;
    let dt = { seqnums: seq1, type: id, revSeqnums: null };
    getMfAccedd(dt).then(({ data }) => {
      let newusers = data?.items || [];
      setMfAccess(newusers);
    });
    let dt1 = { seqnums: seq1, type: 2, revSeqnums: null };
    getMfAccedd(dt1).then(({ data }) => {
      let newusers = data?.items || [];
      setMfAccessExpenditure(newusers);
    });
  };

  const handleSaveApplication = async ({
    organisation,
    userInfo,
  }: typeof INITIAL_VALUES) => {
    toast.promise(
      async () => {
        const res = await saveApplication({
          organisation,
          userInfo,
          certifyingDocuments: selectedDocs || null,
        });
        if ("data" in res) {
          navigate(
            `/modules/documents/tfmis-access-applications/show/${res.data.id}`
          );
        }
      },
      {
        pending: "Заявка сохраняется",
        success: "Заявка сохранена",
        error: "Произошла ошибка",
      }
    );
  };

  const handleUpdateApplication = async ({
    organisation,
    userInfo,
  }: typeof INITIAL_VALUES) => {
    if (props.entry) {
      toast.promise(
        updateApplication({
          id: props.entry.id,
          organisation,
          userInfo,
          certifyingDocuments: selectedDocs || null,
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Заявка обновляется",
          success: "Заявка обновлена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const getMessage = (type: SignType) => {
    switch (type) {
      case SignType.Sardor:
        return "Форма утверждается";
      default:
        return "Форма подписывается";
    }
  };

  const getDoneMessage = (type: SignType) => {
    switch (type) {
      case SignType.Sardor:
        return "Форма утверждена";
      default:
        return "Форма подписана";
    }
  };

  const handleSignSignatureBody = async (type: SignType) => {
    try {
      if (props.entry) {
        toast.promise(
          signApplication({
            id: props.entry.id,
            type: type,
            timestamp: props.entry.timestamp,
          }).then((c: any) => {
            if (c.error?.data?.StatusCode !== undefined) {
              toast.error(
                "Ошибка при подписание документа: \n" +
                  JSON.stringify(c.error?.data?.Message)
              );
            } else toast.success(getDoneMessage(type));
          }),
          {
            pending: getMessage(type),
          }
        );
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  const handleRejectApplication = async ({
    reason = null,
    comment = "",
  }: {
    reason: { id: string; value: string } | null;
    comment: string;
  }) => {
    try {
      if (props.entry) {
        toast.promise(
          rejectApplication({
            id: props.entry.id,
            comment,
            reason: parseInt(reason?.id!),
            timestamp: props.entry.timestamp,
          }),
          {
            pending: "Заявка отклоняется",
            success: "Заявка отклонена",
            error: "Произошла ошибка",
          }
        );
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  const handleDeleteApplication = async () => {
    try {
      if (props.entry) {
        toast.promise(
          deleteApplication({
            id: props.entry.id,
            timestamp: props.entry.timestamp,
          }),
          {
            pending: "Заявка удаляется",
            success: "Заявка удалена",
            error: "Произошла ошибка",
          }
        );
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  const { values, setFieldValue, handleChange, handleSubmit } = useFormik<any>({
    initialValues: props.new
      ? INITIAL_VALUES
      : ({
          organisation: props.entry?.organisation,
          userInfo: props.entry?.userInfo,
        } as typeof INITIAL_VALUES),
    onSubmit: (values) => {
      if (props.new) {
        handleSaveApplication(values);
      } else if (props.entry) {
        handleUpdateApplication(values);
      }
    },
  });

  useEffect(() => {
    if (props.entry) {
      setSelectedDocs(
        props.entry.certifyingDocuments as CertifyingDocumentDTO[]
      );
    }
    return () => {
      setSelectedDocs([]);
    };
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="tw-py-4 tw-flex tw-flex-col tw-gap-4">
          <Card title="Новая заявка МФ РТ">
            <>
              <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
                <Button
                  startIcon={
                    <AngleDoubleLeftIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                  onClick={() => navigate(-1)}
                >
                  Назад
                </Button>
                <Button
                  disabled={
                    props.entry?.transitions.buttonSettings.btn_save.readOnly ||
                    !canSave
                  }
                  startIcon={
                    <DiskIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                >
                  Сохранить
                </Button>
                <Button
                  disabled={
                    props.new ||
                    props.entry?.transitions.buttonSettings.btn_delete.readOnly
                  }
                  startIcon={
                    <FileDeleteIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                  onClick={handleDeleteApplication}
                >
                  Удалить документ
                </Button>
                <Button
                  disabled={
                    props.new ||
                    props.entry?.transitions.buttonSettings.btn_approve.readOnly
                  }
                  startIcon={
                    <PencilIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                  onClick={(el) => {
                    handleSignSignatureBody(SignType.Sardor);
                  }}
                >
                  Утвердить
                </Button>
                <Button
                  disabled={
                    props.new ||
                    props.entry?.transitions.buttonSettings.btn_undo.readOnly
                  }
                  startIcon={
                    <CrossCircleIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                  onClick={() => {
                    setRejectModalOpen(true);
                  }}
                >
                  Отклонить
                </Button>
              </div>
              <div className="stages">
                <TfmisAccessApplicationStateIndicator
                  activeState={props.entry?.state ? props.entry?.state : 1}
                  endStatus={8}
                />
              </div>
            </>
          </Card>
          <Card title="Дархости мазкур бо фармоиши ВМ №103 аз 23.07.2019 тасдик шудааст" />
          <Card title="Информация организации">
            <div className="tw-flex tw-flex-col tw-gap-6 tw-px-4 tw-py-6">
              <FormGroup>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
                  <Autocomplete
                    id="year"
                    disablePortal
                    options={yearsQuery.isSuccess ? yearsQuery.data : []}
                    getOptionLabel={(option) => option.toString()}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="organisation.year"
                        label="Финансовый год*"
                      />
                    )}
                    value={values.organisation?.year}
                    disabled={true}
                    onChange={(event, value) => {
                      setFieldValue("organisation.year", value);
                    }}
                  />
                  <Autocomplete
                    id="treasureCode"
                    disablePortal
                    options={
                      treasureCodesQuery.isSuccess
                        ? treasureCodesQuery.data.items
                        : []
                    }
                    getOptionLabel={(option) => option.value as string}
                    size="small"
                    noOptionsText="Нет данных"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="organisation.treasureCode"
                        label="Код - Наименование*"
                      />
                    )}
                    value={values.organisation?.treasureCode as any}
                    disabled={!canSave}
                    onChange={(event, value) => {
                      setFieldValue("organisation.treasureCode", value);
                    }}
                  />

                  <TextField
                    name="organisation.inn"
                    label="ИНН Организации*"
                    size="small"
                    value={values.organisation?.inn}
                    disabled={!canSave}
                    onChange={handleChange}
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <TextField
                    name="organisation.orgName"
                    label="Название организации"
                    size="small"
                    value={values.organisation?.orgName}
                    disabled={!canSave}
                    onChange={handleChange}
                  />
                  <TextField
                    name="organisation.address"
                    label="Адрес"
                    size="small"
                    value={values.organisation?.address}
                    disabled={!canSave}
                    onChange={handleChange}
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <Autocomplete
                    id="organisation.pbsCode"
                    disablePortal
                    options={pbsQuery.isSuccess ? pbsQuery.data.items : []}
                    getOptionLabel={(option) => option.value as string}
                    size="small"
                    noOptionsText="Нет данных"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="organisation.pbsCode"
                        label="Код ПБС*"
                      />
                    )}
                    value={values.organisation?.pbsCode}
                    disabled={!canSave}
                    onChange={(event, value) => {
                      setFieldValue("organisation.pbsCode", value);
                    }}
                  />
                  <Autocomplete
                    multiple
                    disablePortal
                    options={seqnumsQuery.data?.items || []}
                    getOptionLabel={(option) => option?.value!}
                    size="small"
                    noOptionsText="Нет данных"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="organisation.seqnums"
                        label="Бюджетные заявки *"
                      />
                    )}
                    value={values.organisation?.seqnums!}
                    disabled={!canSave}
                    onChange={(event, value) => {
                      setFieldValue("organisation.seqnums", value);
                      LoadMfAccess({ id: 1, seq: value });
                    }}
                  />
                </div>
              </FormGroup>
            </div>
          </Card>
          <Card title="Информация пользователей">
            <div className="tw-flex tw-gap-6 tw-px-4 tw-py-6 tw-flex-wrap">
              <FormGroup className="tw-gap-4 tw-flex-auto">
                <TextField
                  name="userInfo.first_Fio"
                  label="ФИО (полностью, согласно паспорту)*"
                  size="small"
                  value={values.userInfo?.first_Fio}
                  disabled={!canSave}
                  onChange={handleChange}
                />
                <Autocomplete
                  disablePortal
                  options={
                    userPositionsQuery.isSuccess
                      ? userPositionsQuery.data.items
                      : []
                  }
                  getOptionLabel={(option) => option.value as string}
                  size="small"
                  noOptionsText="Нет данных"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="userInfo.first_Position"
                      label="Должность*"
                    />
                  )}
                  value={values.userInfo?.first_Position}
                  disabled={!canSave}
                  onChange={(event, value) => {
                    setFieldValue("userInfo.first_Position", value);
                  }}
                />

                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <TextField
                    name="userInfo.first_Inn"
                    label="ИНН*"
                    size="small"
                    value={values.userInfo?.first_Inn}
                    disabled={!canSave}
                    onChange={handleChange}
                  />
                  <TextField
                    name="userInfo.first_Phone"
                    label="Моб. номер*"
                    onInput={(e) => {
                      (e.target as HTMLInputElement).value = (
                        e.target as HTMLInputElement
                      ).value.replace(/[^0-9]/g, "");
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+992</InputAdornment>
                      ),
                    }}
                    inputProps={{ maxLength: 9 }}
                    size="small"
                    error={
                      values.userInfo?.first_Phone !== null &&
                      (values.userInfo?.first_Phone?.length || 0) < 9
                        ? true
                        : false
                    }
                    helperText={
                      values.userInfo?.first_Phone !== null &&
                      (values.userInfo?.first_Phone?.length || 0) < 9
                        ? "Мин 9 символов"
                        : ""
                    }
                    value={values.userInfo?.first_Phone}
                    disabled={!canSave}
                    onChange={handleChange}
                  />
                </div>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <TextField
                    name="userInfo.first_Email"
                    label="E-mail*"
                    size="small"
                    error={
                      values.userInfo?.first_Email !== null &&
                      !values.userInfo?.first_Email.includes("@")
                        ? true
                        : false
                    }
                    helperText={
                      values.userInfo?.first_Email !== null &&
                      !values.userInfo?.first_Email.includes("@")
                        ? 'Поле ввода обязательно и требует символ "@"'
                        : ""
                    }
                    value={values.userInfo?.first_Email}
                    disabled={!canSave}
                    onChange={handleChange}
                  />
                  <Button
                    disabled={
                      props.new ||
                      props.entry?.transitions.buttonSettings.btn_signBukh
                        .readOnly
                    }
                    startIcon={
                      <PencilIcon
                        width="16px"
                        height="16px"
                        fill="currentColor"
                        stroke="none"
                      />
                    }
                    onClick={(el) => {
                      handleSignSignatureBody(SignType.Bukhgalter);
                    }}
                  >
                    Подписать
                  </Button>
                </div>
              </FormGroup>
              <FormGroup className="tw-gap-4 tw-flex-auto">
                <TextField
                  name="userInfo.second_Fio"
                  label="ФИО (полностью, согласно паспорту)*"
                  size="small"
                  value={values.userInfo?.second_Fio}
                  disabled={!canSave}
                  onChange={handleChange}
                />
                <Autocomplete
                  disablePortal
                  options={
                    userPositionsQuery.isSuccess
                      ? userPositionsQuery.data.items
                      : []
                  }
                  getOptionLabel={(option) => option.value as string}
                  size="small"
                  noOptionsText="Нет данных"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="userInfo.second_Position"
                      label="Должность*"
                    />
                  )}
                  value={values.userInfo?.second_Position}
                  disabled={!canSave}
                  onChange={(event, value) => {
                    setFieldValue("userInfo.second_Position", value);
                  }}
                />
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <TextField
                    name="userInfo.second_Inn"
                    label="ИНН*"
                    size="small"
                    value={values.userInfo?.second_Inn}
                    disabled={!canSave}
                    onChange={handleChange}
                  />
                  <TextField
                    name="userInfo.second_Phone"
                    label="Моб. номер*"
                    onInput={(e) => {
                      (e.target as HTMLInputElement).value = (
                        e.target as HTMLInputElement
                      ).value.replace(/[^0-9]/g, "");
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+992</InputAdornment>
                      ),
                    }}
                    inputProps={{ maxLength: 9 }}
                    size="small"
                    error={
                      values.userInfo?.second_Phone !== null &&
                      (values.userInfo?.second_Phone?.length || 0) < 9
                        ? true
                        : false
                    }
                    helperText={
                      values.userInfo?.second_Phone !== null &&
                      (values.userInfo?.second_Phone?.length || 0) < 9
                        ? "Мин 9 символов"
                        : ""
                    }
                    value={values.userInfo?.second_Phone}
                    disabled={!canSave}
                    onChange={handleChange}
                  />
                </div>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <TextField
                    name="userInfo.second_Email"
                    label="E-mail*"
                    error={
                      values.userInfo?.second_Email !== null &&
                      !values.userInfo?.second_Email.includes("@")
                        ? true
                        : false
                    }
                    helperText={
                      values.userInfo?.second_Email !== null &&
                      !values.userInfo?.second_Email.includes("@")
                        ? 'Поле ввода обязательно и требует символ "@"'
                        : ""
                    }
                    size="small"
                    value={values.userInfo?.second_Email}
                    disabled={!canSave}
                    onChange={handleChange}
                  />
                  <Button
                    disabled={
                      props.new ||
                      props.entry?.transitions.buttonSettings
                        .btn_signRukovoditel.readOnly
                    }
                    startIcon={
                      <PencilIcon
                        width="16px"
                        height="16px"
                        fill="currentColor"
                        stroke="none"
                      />
                    }
                    onClick={(el) => {
                      handleSignSignatureBody(SignType.Rikovoditer);
                    }}
                  >
                    Подписать
                  </Button>
                </div>
              </FormGroup>
            </div>
          </Card>
          <Card title="Подготовка бюджета">
            <div className="tw-flex tw-gap-6 tw-px-4 tw-py-6 tw-flex-wrap">
              <FormGroup className="tw-gap-4 tw-flex-auto">
                <Autocomplete
                  disablePortal
                  options={mfAccess || []}
                  getOptionLabel={(option) =>
                    (option.kuratorFio +
                      " (куратор)  " +
                      option.headDepartFio +
                      " (начальник)") as string
                  }
                  size="small"
                  noOptionsText="Нет данных"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="userInfo.budgetPreparationInfo"
                      label="Куратор по подготовке*"
                    />
                  )}
                  value={values.userInfo?.budgetPreparationInfo}
                  disabled={!canSave}
                  onChange={(event, value) => {
                    setFieldValue("userInfo.budgetPreparationInfo", value);
                  }}
                />

                <TextField
                  // label="ФИО (полностью, согласно паспорту)*"
                  placeholder="ФИО (полностью, согласно паспорту)*"
                  size="small"
                  value={values.userInfo?.budgetPreparationInfo?.kuratorFio}
                  disabled={true}
                />
                <TextField
                  // label="Должность*"
                  placeholder="Должность*"
                  size="small"
                  value={
                    values.userInfo?.budgetPreparationInfo?.kuratorPosition
                      ?.value
                  }
                  disabled={true}
                />
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <TextField
                    placeholder="Моб. номер*"
                    size="small"
                    value={values.userInfo?.budgetPreparationInfo?.kuratorPhone}
                    disabled={true}
                  />

                  <Button
                    disabled={
                      props.new ||
                      props.entry?.transitions.buttonSettings
                        .btn_signKuratorBudget.readOnly
                    }
                    startIcon={
                      <PencilIcon
                        width="16px"
                        height="16px"
                        fill="currentColor"
                        stroke="none"
                      />
                    }
                    onClick={(el) => {
                      handleSignSignatureBody(SignType.KuratorPod);
                    }}
                  >
                    Подписать
                  </Button>
                </div>
              </FormGroup>
              <FormGroup className="tw-gap-4 tw-flex-auto tw-mt-[55px]">
                <TextField
                  placeholder="ФИО (полностью, согласно паспорту)*"
                  size="small"
                  value={values.userInfo?.budgetPreparationInfo?.headDepartFio}
                  disabled={true}
                />
                <TextField
                  placeholder="Должность*"
                  size="small"
                  value={
                    values.userInfo?.budgetPreparationInfo?.headDepartPosition
                      ?.value
                  }
                  disabled={true}
                />
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <TextField
                    placeholder="Моб. номер*"
                    size="small"
                    value={
                      values.userInfo?.budgetPreparationInfo?.headDepartPhone
                    }
                    disabled={true}
                  />

                  <Button
                    disabled={
                      props.new ||
                      props.entry?.transitions.buttonSettings.btn_signHeadBudget
                        .readOnly
                    }
                    startIcon={
                      <PencilIcon
                        width="16px"
                        height="16px"
                        fill="currentColor"
                        stroke="none"
                      />
                    }
                    onClick={(el) => {
                      handleSignSignatureBody(SignType.NachPodgotovki);
                    }}
                  >
                    Подписать
                  </Button>
                </div>
              </FormGroup>
            </div>
          </Card>
          <Card title="Испольнение бюджета">
            <div className="tw-flex tw-gap-6 tw-px-4 tw-py-6 tw-flex-wrap">
              <FormGroup className="tw-gap-4 tw-flex-auto">
                <Autocomplete
                  disablePortal
                  options={mfAccessExpenditure || []}
                  getOptionLabel={(option) =>
                    (option.kuratorFio +
                      " (куратор)  " +
                      option.headDepartFio +
                      " (начальник)") as string
                  }
                  size="small"
                  noOptionsText="Нет данных"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="userInfo.budgetExpenditureInfo"
                      label="Куратор по подготовке*"
                    />
                  )}
                  value={values.userInfo?.budgetExpenditureInfo}
                  disabled={!canSave}
                  onChange={(event, value) => {
                    setFieldValue("userInfo.budgetExpenditureInfo", value);
                  }}
                />

                <TextField
                  placeholder="ФИО (полностью, согласно паспорту)*"
                  size="small"
                  value={values.userInfo?.budgetExpenditureInfo?.kuratorFio}
                  disabled={true}
                />
                <TextField
                  placeholder="Должность*"
                  size="small"
                  value={
                    values.userInfo?.budgetExpenditureInfo?.kuratorPosition
                      ?.value
                  }
                  disabled={true}
                />
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <TextField
                    placeholder="Моб. номер*"
                    size="small"
                    value={values.userInfo?.budgetExpenditureInfo?.kuratorPhone}
                    disabled={true}
                  />

                  <Button
                    disabled={
                      props.new ||
                      props.entry?.transitions.buttonSettings
                        .btn_signKuratorExpen.readOnly
                    }
                    startIcon={
                      <PencilIcon
                        width="16px"
                        height="16px"
                        fill="currentColor"
                        stroke="none"
                      />
                    }
                    onClick={(el) => {
                      handleSignSignatureBody(SignType.KuratorRaskhod);
                    }}
                  >
                    Подписать
                  </Button>
                </div>
              </FormGroup>
              <FormGroup className="tw-gap-4 tw-flex-auto tw-mt-[55px]">
                <TextField
                  placeholder="ФИО (полностью, согласно паспорту)*"
                  size="small"
                  value={values.userInfo?.budgetExpenditureInfo?.headDepartFio}
                  disabled={true}
                />
                <TextField
                  placeholder="Должность*"
                  size="small"
                  value={
                    values.userInfo?.budgetExpenditureInfo?.headDepartPosition
                      ?.value
                  }
                  disabled={true}
                />
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <TextField
                    placeholder="Моб. номер*"
                    size="small"
                    value={
                      values.userInfo?.budgetExpenditureInfo?.headDepartPhone
                    }
                    disabled={true}
                  />

                  <Button
                    disabled={
                      props.new ||
                      props.entry?.transitions.buttonSettings.btn_signHeadExpen
                        .readOnly
                    }
                    startIcon={
                      <PencilIcon
                        width="16px"
                        height="16px"
                        fill="currentColor"
                        stroke="none"
                      />
                    }
                    onClick={(el) => {
                      handleSignSignatureBody(SignType.NachRaskhod);
                    }}
                  >
                    Подписать
                  </Button>
                </div>
              </FormGroup>
            </div>
          </Card>
          <Card title="Удостоверяющие документы">
            <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
              {canSave && (
                <>
                  <Button
                    onClick={() => {
                      setDocumentSelectorOpen(true);
                    }}
                  >
                    Добавить документ
                  </Button>
                  <Button>Удалить документ</Button>
                </>
              )}
              <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>№</TableCell>
                      <TableCell>Название</TableCell>
                      <TableCell>Тип документа</TableCell>
                      <TableCell>Дата создания</TableCell>
                      <TableCell>Создал</TableCell>
                      <TableCell>Cтадия утверждения</TableCell>
                      <TableCell>Утвердил</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.new
                      ? selectedDocs &&
                        selectedDocs.map((doc) => (
                          <TableRow key={`doc-${doc.id}`}>
                            <TableCell>{doc.id}</TableCell>
                            <TableCell>{doc.name}</TableCell>
                            <TableCell>{doc.type}</TableCell>
                            <TableCell>{doc.createTs}</TableCell>
                            <TableCell>{doc.createdBy}</TableCell>
                            <TableCell>{doc.approveDate}</TableCell>
                            <TableCell>{doc.approveBy}</TableCell>
                          </TableRow>
                        ))
                      : props.entry?.certifyingDocuments &&
                        props.entry?.certifyingDocuments.map((doc) => (
                          <TableRow key={`doc-${doc.id}`}>
                            <TableCell>{doc.id}</TableCell>
                            <TableCell>{doc.name}</TableCell>
                            <TableCell>{doc.type}</TableCell>
                            <TableCell>
                              {doc?.createTs && formatDate(doc?.createTs)}
                            </TableCell>
                            <TableCell>{doc.createdBy}</TableCell>
                            <TableCell>
                              {doc?.approvedDate &&
                                formatDate(doc?.approvedDate)}
                            </TableCell>
                            <TableCell>{doc.approvedBy}</TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Card>
          <Card title="Визы пользователей">
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Визирующий</TableCell>
                    <TableCell>Состояние</TableCell>
                    <TableCell>Установил</TableCell>
                    <TableCell>Подпись</TableCell>
                    <TableCell>Дата установки</TableCell>
                    <TableCell>Причина отказа</TableCell>
                    <TableCell>Комментарии</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.entry &&
                    props.entry.userVisas.map((visa) => (
                      <TableRow key={visa.date}>
                        <TableCell>{visa.signedBy}</TableCell>
                        <TableCell>{visa.state}</TableCell>
                        <TableCell>{visa.setBy}</TableCell>
                        <TableCell>
                          {" "}
                          {visa.sign64 === null ? (
                            ""
                          ) : (
                            <img src={`data:image/png;base64,${visa.sign64}`} />
                          )}{" "}
                        </TableCell>
                        <TableCell>
                          {visa?.date && formatDate(visa?.date)}
                        </TableCell>
                        <TableCell>{visa.reason}</TableCell>
                        <TableCell>{visa.comment}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Card title="История состояний документа">
            <TableContainer>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Состояние</TableCell>
                    <TableCell>Начало</TableCell>
                    <TableCell>Завершение</TableCell>
                    <TableCell>Комментарий</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.entry &&
                    props.entry.documentHistories.map((dh) => (
                      <TableRow key={dh.startDate}>
                        <TableCell>{dh.state}</TableCell>
                        <TableCell>{dh.startDate}</TableCell>
                        <TableCell>{dh.endDate}</TableCell>
                        <TableCell>{dh.comment}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </div>
      </form>
      <div id="modals">
        <DocumentSelector
          open={documentSelectorOpen}
          onSelected={(docs) => {
            setSelectedDocs(docs.concat(selectedDocs ? selectedDocs : []));
            setDocumentSelectorOpen(false);
          }}
          onClose={() => {
            setDocumentSelectorOpen(false);
          }}
        />
        <Modal open={rejectModalOpen}>
          <Box className="tw-absolute sm:tw-w-fit tw-w-full tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
            <div className="lg:tw-w-[512px] md:tw-w-[400px] tw-w-full">
              <Card title="Причина отказа">
                <Formik
                  initialValues={{ reason: null, comment: "" }}
                  validate={({ reason, comment }) => {
                    const errors: any = {};
                    if (comment === "") {
                      errors.comment = "Обязательное поле";
                    }

                    if (!reason) {
                      errors.reason = "Обязательное поле";
                    }

                    return errors;
                  }}
                  onSubmit={({ reason, comment }) => {
                    handleRejectApplication({ reason, comment });
                    setRejectModalOpen(false);
                  }}
                >
                  {({
                    values,
                    setFieldValue,
                    handleChange,
                    touched,
                    errors,
                  }) => (
                    <Form className="tw-px-20 tw-py-10 tw-bg-white md:tw-rounded-lg tw-mt-2">
                      <FormGroup className="tw-gap-6">
                        <Autocomplete
                          id="v.reason"
                          disablePortal
                          options={rejectReasonsQuery.data?.items || []}
                          getOptionLabel={(option) => option.value as string}
                          value={values.reason}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Выберите причину отказа*"
                              error={touched.reason && Boolean(errors.reason)}
                              //@ts-ignore
                              helperText={touched.reason && errors.reason}
                            ></TextField>
                          )}
                          onChange={(event, value) => {
                            setFieldValue("reason", value);
                          }}
                        />
                        <TextField
                          name="comment"
                          label="Коменнтарий"
                          value={values.comment}
                          multiline
                          minRows={4}
                          error={touched.comment && Boolean(errors.comment)}
                          helperText={touched.comment && errors.comment}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <Box className="tw-pt-4 tw-flex tw-gap-4">
                        <Button type="submit" variant="contained">
                          Сохранить
                        </Button>
                        <Button onClick={() => setRejectModalOpen(false)}>
                          Отмена
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Card>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default MFTRCreate;
