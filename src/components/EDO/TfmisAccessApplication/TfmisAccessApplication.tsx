import {
  Autocomplete,
  Button,
  Box,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Card, PencilIcon, CustomButton, CustomTextField } from "@ui";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ValueId } from "@services/api";
import {
  useFetchTreasureCodesQuery,
  useFetchYearsQuery,
  useLazyFetchSeqnumsQuery,
} from "@services/generalApi";
import { useLazyFetchMfListForTfmisAccessQuery } from "@services/accessMfApi";
import { CertifyingDocumentDTO } from "@services/signatureCardApi";
import {
  useDeleteTFMISAccessApplicationMutation,
  useSaveTFMISAccessApplicationMutation,
  useSignTFMISAccessApplicationMutation,
  useUpdateTFMISAccessApplicationMutation,
} from "@services/tfmisApi";
import { IPbsResult, PbsTree } from "@root/shared/ui/PbsTree";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { lighten, darken } from "@mui/system";
import { styled } from "@mui/material/styles";
import { formatDate, INN_REGEXP, toastPromise } from "@utils";
import {
  initialValues,
  InitialValuesType,
  validationSchema,
} from "./helpers/schema";
import { useAnimatedPen } from "@hooks";
import { AccessApplicationStates, SignType } from "./helpers/constants";
import { TfmisAccessActions } from "./components/TfmisAccessActions";
import { useNavigate } from "react-router";
import DocumentSelector from "../DocumentSelector/DocumentSelector";

type Props = {
  new: boolean;
  entry?: TFMIS.AccessApplication;
};

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "light"
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

const Application = (props: Props) => {
  const navigate = useNavigate();

  const [getMfAccedd] = useLazyFetchMfListForTfmisAccessQuery();
  const [mfAccess, setMfAccess] = useState<TFMIS.IKuratonAndHeadInfo[]>();
  const [seqnumsCheck, setSeqnumsCheck] = useState<Record<string, boolean>>({});

  const [mfAccessExpenditure, setMfAccessExpenditure] =
    useState<TFMIS.IKuratonAndHeadInfo[]>();

  const yearsQuery = useFetchYearsQuery();
  const treasureCodesQuery = useFetchTreasureCodesQuery();
  const [seqnumsQuery, { isFetching: isFetchSeq }] = useLazyFetchSeqnumsQuery();
  const [seqnums, setSeqnums] = useState<ValueId[]>();

  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  const [selectedDocs, setSelectedDocs] = useState<CertifyingDocumentDTO[]>();

  const [saveApplication] = useSaveTFMISAccessApplicationMutation();
  const [updateApplication] = useUpdateTFMISAccessApplicationMutation();
  const [signApplication] = useSignTFMISAccessApplicationMutation();
  const [deleteApplication] = useDeleteTFMISAccessApplicationMutation();

  const [documentSelectorOpen, setDocumentSelectorOpen] =
    useState<boolean>(false);

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

  const LoadSeqnum = (pbs: ValueId[]) => {
    seqnumsQuery({ orgs: pbs }).then(({ data }) => {
      let newhead = [...(data?.items || [])];
      setSeqnums([
        { id: -1, value: "Выбрать всё" },
        ...newhead.sort((item1, item2) =>
          item1.value.localeCompare(item2.value)
        ),
      ]);
    });
  };

  const handleSaveApplication = async ({
    organisation,
    userInfo,
  }: InitialValuesType) => {
    if (!selectedDocs?.length) {
      toast.error("Выберите удостоверяющие документы");
      return;
    }

    const request = saveApplication({
      organisation,
      userInfo,
      certifyingDocuments: selectedDocs || null,
    });

    const toastOptions = {
      pending: "Заявка сохраняется",
      success: "Заявка сохранена",
      error: "Произошла ошибка",
    };

    const thenConf = {
      then: (data: any) => {
        navigate(
          `/modules/documents/tfmis-access-applications/show/${data.id}`
        );
      },
    };

    toastPromise(request, toastOptions, thenConf);
  };

  const handleUpdateApplication = async ({
    organisation,
    userInfo,
  }: InitialValuesType) => {
    if (props.entry) {
      const request = updateApplication({
        id: props.entry.id,
        organisation,
        userInfo,
        certifyingDocuments: selectedDocs || null,
        timestamp: props.entry.timestamp,
      });

      const toastOptions = {
        pending: "Заявка обновляется",
        success: "Заявка обновлена",
        error: "Произошла ошибка",
      };

      toastPromise(request, toastOptions);
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

  const formik = useFormik<InitialValuesType>({
    initialValues: props.new
      ? initialValues
      : ({
          organisation: props.entry?.organisation,
          userInfo: props.entry?.userInfo,
        } as InitialValuesType),
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (props.new) {
        handleSaveApplication(values);
      } else if (props.entry) {
        handleUpdateApplication(values);
      }
    },
  });

  const { values } = formik;

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

  const handleDocDelete = (doc: CertifyingDocumentDTO) => {
    setSelectedDocs(selectedDocs?.filter((item) => item.id !== doc.id));
  };

  const { iconContent, handlePenClick, ...penHandlers } = useAnimatedPen();

  const orgTouched = formik.touched?.organisation;
  const orgErrors = formik.errors?.organisation;
  const userInfoTouched = formik.touched?.userInfo;
  const userInfoErrors = formik.errors?.userInfo;

  const docHistories = useMemo(
    () => (
      <Card title="История состояний документа">
        <TableContainer className="tw-flex tw-flex-wrap tw-gap-4 tw-pt-3 tw-pb-4 tw-px-4 mf_block_bg">
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
                props.entry.documentHistories?.map((dh) => (
                  <TableRow key={dh.startDate}>
                    <TableCell>{dh.state}</TableCell>
                    <TableCell>
                      {dh?.startDate && formatDate(dh?.startDate)}
                    </TableCell>
                    <TableCell>
                      {dh?.endDate && formatDate(dh?.endDate)}
                    </TableCell>
                    <TableCell>{dh.comment}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    ),
    [props.entry]
  );

  const visas = useMemo(
    () => (
      <Card title="Визы пользователей">
        <TableContainer className="tw-flex tw-flex-wrap tw-gap-4 tw-pt-3 tw-pb-4 tw-px-4 mf_block_bg">
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
                props.entry.userVisas?.map((visa) => (
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
    ),
    [props.entry?.userVisas]
  );

  const usersInfo = (
    <Card title="Информация пользователей">
      <div className="tw-flex tw-gap-6 tw-flex-wrap tw-py-4 tw-px-4 mf_block_bg">
        <FormGroup className="tw-gap-4 tw-flex-auto">
          <CustomTextField
            name="userInfo.first_Fio"
            label="ФИО (полностью, согласно паспорту) *"
            size="small"
            value={values.userInfo?.first_Fio}
            disabled={!canSave}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              userInfoTouched?.first_Fio && Boolean(userInfoErrors?.first_Fio)
            }
            helperText={
              userInfoTouched?.first_Fio && userInfoErrors?.first_Fio
                ? userInfoErrors?.first_Fio
                : ""
            }
          />

          <CustomTextField value="Бухгалтер" size="small" disabled={true} />

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <CustomTextField
              name="userInfo.first_Inn"
              label="ИНН *"
              size="small"
              value={values.userInfo?.first_Inn}
              disabled={!canSave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                userInfoTouched?.first_Inn && Boolean(userInfoErrors?.first_Inn)
              }
              helperText={
                userInfoTouched?.first_Inn && userInfoErrors?.first_Inn
                  ? userInfoErrors?.first_Inn
                  : ""
              }
              regexp={INN_REGEXP}
            />
            <TextField
              name="userInfo.first_Phone"
              label="Моб. номер *"
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
              value={values.userInfo?.first_Phone}
              disabled={!canSave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                userInfoTouched?.first_Phone &&
                Boolean(userInfoErrors?.first_Phone)
              }
              helperText={
                userInfoTouched?.first_Phone && userInfoErrors?.first_Phone
                  ? userInfoErrors?.first_Phone
                  : ""
              }
            />
          </div>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <CustomButton
              sx={{ height: "fit-content" }}
              variant="outlined"
              withRuToken
              disabled={
                props.new ||
                props.entry?.transitions.buttonSettings.btn_signBukh.readOnly
              }
              startIcon={
                <PencilIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              {...penHandlers}
              onClick={(el) => {
                handlePenClick();
                handleSignSignatureBody(SignType.Bukhgalter);
              }}
            >
              Подписать
            </CustomButton>
          </div>
        </FormGroup>
        <FormGroup className="tw-gap-4 tw-flex-auto">
          <CustomTextField
            name="userInfo.second_Fio"
            label="ФИО (полностью, согласно паспорту) *"
            size="small"
            value={values.userInfo?.second_Fio}
            disabled={!canSave}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              userInfoTouched?.second_Fio && Boolean(userInfoErrors?.second_Fio)
            }
            helperText={
              userInfoTouched?.second_Fio && userInfoErrors?.second_Fio
                ? userInfoErrors?.second_Fio
                : ""
            }
          />

          <CustomTextField value="Руководитель" size="small" disabled={true} />

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <CustomTextField
              name="userInfo.second_Inn"
              label="ИНН *"
              size="small"
              value={values.userInfo?.second_Inn}
              disabled={!canSave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                userInfoTouched?.second_Inn &&
                Boolean(userInfoErrors?.second_Inn)
              }
              helperText={
                userInfoTouched?.second_Inn && userInfoErrors?.second_Inn
                  ? userInfoErrors?.second_Inn
                  : ""
              }
              regexp={INN_REGEXP}
            />
            <TextField
              name="userInfo.second_Phone"
              label="Моб. номер *"
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
              value={values.userInfo?.second_Phone}
              disabled={!canSave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                userInfoTouched?.second_Phone &&
                Boolean(userInfoErrors?.second_Phone)
              }
              helperText={
                userInfoTouched?.second_Phone && userInfoErrors?.second_Phone
                  ? userInfoErrors?.second_Phone
                  : ""
              }
            />
          </div>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <CustomButton
              sx={{ height: "fit-content" }}
              variant="outlined"
              withRuToken
              disabled={
                props.new ||
                props.entry?.transitions.buttonSettings.btn_signRukovoditel
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
              {...penHandlers}
              onClick={(el) => {
                handleSignSignatureBody(SignType.Rikovoditer);
                handlePenClick();
              }}
            >
              Подписать
            </CustomButton>
          </div>
        </FormGroup>
      </div>
    </Card>
  );

  const budgetContent = (
    <Card title="Подготовка бюджета">
      <div className="tw-flex tw-gap-6 tw-flex-wrap tw-py-4 tw-px-4 mf_block_bg">
        <FormGroup className="tw-gap-4 tw-flex-auto">
          <Autocomplete
            id="budgetPreparationInfo"
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
              <CustomTextField
                name="userInfo.budgetPreparationInfo"
                label="Куратор по подготовке *"
                params={params}
                onBlur={formik.handleBlur}
                error={
                  userInfoTouched?.budgetPreparationInfo &&
                  Boolean(userInfoErrors?.budgetPreparationInfo)
                }
                helperText={
                  userInfoTouched?.budgetPreparationInfo &&
                  userInfoErrors?.budgetPreparationInfo
                    ? userInfoErrors?.budgetPreparationInfo
                    : ""
                }
              />
            )}
            value={values.userInfo?.budgetPreparationInfo}
            disabled={!canSave}
            onChange={(event, value) => {
              formik.setFieldValue("userInfo.budgetPreparationInfo", value);
            }}
          />

          <CustomTextField
            placeholder="ФИО (полностью, согласно паспорту) *"
            size="small"
            value={values.userInfo?.budgetPreparationInfo?.kuratorFio}
            disabled={true}
          />
          <CustomTextField
            placeholder="Должность *"
            size="small"
            value={
              values.userInfo?.budgetPreparationInfo?.kuratorPosition?.value
            }
            disabled={true}
          />
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              placeholder="Моб. номер *"
              size="small"
              value={values.userInfo?.budgetPreparationInfo?.kuratorPhone}
              disabled={true}
            />

            <CustomButton
              sx={{ height: "fit-content" }}
              variant="outlined"
              withRuToken
              disabled={
                props.new ||
                props.entry?.transitions.buttonSettings.btn_signKuratorBudget
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
              {...penHandlers}
              onClick={(el) => {
                handleSignSignatureBody(SignType.KuratorPod);
                handlePenClick();
              }}
            >
              Подписать
            </CustomButton>
          </div>
        </FormGroup>
        <FormGroup className="tw-gap-4 tw-flex-auto tw-mt-[55px]">
          <CustomTextField
            placeholder="ФИО (полностью, согласно паспорту) *"
            size="small"
            value={values.userInfo?.budgetPreparationInfo?.headDepartFio}
            disabled={true}
          />
          <CustomTextField
            placeholder="Должность *"
            size="small"
            value={
              values.userInfo?.budgetPreparationInfo?.headDepartPosition?.value
            }
            disabled={true}
          />
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              placeholder="Моб. номер *"
              size="small"
              value={values.userInfo?.budgetPreparationInfo?.headDepartPhone}
              disabled={true}
            />

            <CustomButton
              sx={{ height: "fit-content" }}
              variant="outlined"
              withRuToken
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
              {...penHandlers}
              onClick={(el) => {
                handleSignSignatureBody(SignType.NachPodgotovki);
                handlePenClick();
              }}
            >
              Подписать
            </CustomButton>
          </div>
        </FormGroup>
      </div>
    </Card>
  );

  const executiveBudgit = (
    <Card title="Испольнение бюджета">
      <div className="tw-flex tw-gap-6 tw-flex-wrap tw-py-4 tw-px-4 mf_block_bg">
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
              <CustomTextField
                name="userInfo.budgetExpenditureInfo"
                label="Куратор по исполнение *"
                params={params}
                onBlur={formik.handleBlur}
                error={
                  userInfoTouched?.budgetExpenditureInfo &&
                  Boolean(userInfoErrors?.budgetExpenditureInfo)
                }
                helperText={
                  userInfoTouched?.budgetExpenditureInfo &&
                  userInfoErrors?.budgetExpenditureInfo
                    ? userInfoErrors?.budgetExpenditureInfo
                    : ""
                }
              />
            )}
            value={values.userInfo?.budgetExpenditureInfo}
            disabled={!canSave}
            onChange={(event, value) => {
              formik.setFieldValue("userInfo.budgetExpenditureInfo", value);
            }}
          />

          <CustomTextField
            placeholder="ФИО (полностью, согласно паспорту) *"
            size="small"
            value={values.userInfo?.budgetExpenditureInfo?.kuratorFio}
            disabled={true}
          />
          <CustomTextField
            placeholder="Должность *"
            size="small"
            value={
              values.userInfo?.budgetExpenditureInfo?.kuratorPosition?.value
            }
            disabled={true}
          />
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              placeholder="Моб. номер *"
              size="small"
              value={values.userInfo?.budgetExpenditureInfo?.kuratorPhone}
              disabled={true}
            />
            <CustomButton
              sx={{ height: "fit-content" }}
              variant="outlined"
              withRuToken
              disabled={
                props.new ||
                props.entry?.transitions.buttonSettings.btn_signKuratorExpen
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
              {...penHandlers}
              onClick={(el) => {
                handleSignSignatureBody(SignType.KuratorRaskhod);
                handlePenClick();
              }}
            >
              Подписать
            </CustomButton>
          </div>
        </FormGroup>
        <FormGroup className="tw-gap-4 tw-flex-auto tw-mt-[55px]">
          <CustomTextField
            placeholder="ФИО (полностью, согласно паспорту)*"
            size="small"
            value={values.userInfo?.budgetExpenditureInfo?.headDepartFio}
            disabled={true}
          />
          <CustomTextField
            placeholder="Должность*"
            size="small"
            value={
              values.userInfo?.budgetExpenditureInfo?.headDepartPosition?.value
            }
            disabled={true}
          />
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              placeholder="Моб. номер*"
              size="small"
              value={values.userInfo?.budgetExpenditureInfo?.headDepartPhone}
              disabled={true}
            />

            <CustomButton
              sx={{ height: "fit-content" }}
              variant="outlined"
              withRuToken
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
              {...penHandlers}
              onClick={(el) => {
                handleSignSignatureBody(SignType.NachRaskhod);
                handlePenClick();
              }}
            >
              Подписать
            </CustomButton>
          </div>
        </FormGroup>
      </div>
    </Card>
  );

  const certificateContent = useMemo(() => {
    return (
      <Card title="Удостоверяющие документы">
        <div className="tw-flex tw-flex-wrap tw-gap-4 tw-pt-3 tw-pb-4 tw-px-4 mf_block_bg">
          {canSave && (
            <Button
              variant="outlined"
              onClick={() => {
                setDocumentSelectorOpen(true);
              }}
            >
              Добавить документ
            </Button>
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
                  <TableCell>Дата утверждения</TableCell>
                  <TableCell>Утвердил</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDocs &&
                  selectedDocs?.map((doc) => {
                    return (
                      <TableRow key={`doc-${doc.id}`}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>
                          {doc?.createTs && formatDate(doc?.createTs)}
                        </TableCell>
                        <TableCell>{doc.createdBy}</TableCell>
                        <TableCell>
                          {doc?.approveDate && formatDate(doc?.approveDate)}
                        </TableCell>
                        <TableCell>{doc.approvedBy}</TableCell>
                        <TableCell>
                          {[3, 4]?.includes(doc?.typeId) ? (
                            <IconButton
                              onClick={() => {
                                const navigatePath = {
                                  3: `/modules/documents/signatures-sample-card/show/${doc?.id}`,
                                  4: `/modules/documents/chief-accountant-job-responsibilities/show/${doc?.id}`,
                                };
                                window.open(
                                  navigatePath[doc?.typeId],
                                  "_blank"
                                );
                              }}
                            >
                              <OpenInNewIcon />
                            </IconButton>
                          ) : (
                            <></>
                          )}

                          <IconButton onClick={() => handleDocDelete(doc)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Card>
    );
  }, [selectedDocs]);

  const pbsCodeContent = useMemo(
    () => (
      <PbsTree
        disabled={!canSave}
        value={values.organisation?.pbsCode as IPbsResult[]}
        onChange={(value) => {
          LoadSeqnum(value);
          formik.setFieldValue("organisation.pbsCode", value);
        }}
      />
    ),
    [values.organisation?.pbsCode, canSave]
  );

  return (
    <>
      <form className="tw-relative" onSubmit={formik.handleSubmit}>
        {iconContent}
        <div className="tw-py-4 tw-flex tw-flex-col tw-gap-4">
          <TfmisAccessActions
            entry={props.entry}
            canSave={canSave}
            create={props.new}
            formik={formik}
            setRejectModalOpen={setRejectModalOpen}
            handleSignSignatureBody={handleSignSignatureBody}
          />

          <Card title="Дархости мазкур бо фармоиши ВМ №48 аз 18.05.2023 тасдик шудааст" />

          <Card title="Информация организации">
            <div className="tw-flex tw-flex-col tw-gap-6 tw-py-4 tw-px-4 mf_block_bg">
              <FormGroup>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
                  <Autocomplete
                    id="year"
                    disablePortal
                    value={values.organisation?.year}
                    options={yearsQuery.isSuccess ? yearsQuery.data : []}
                    getOptionLabel={(option) => option.toString()}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="organisation.year"
                        label="Финансовый год *"
                      />
                    )}
                    disabled={true}
                    onChange={(event, value) => {
                      formik.setFieldValue("organisation.year", value);
                    }}
                  />
                  <Autocomplete
                    id="treasureCode"
                    disablePortal
                    value={values.organisation?.treasureCode as any}
                    size="small"
                    disabled={!canSave}
                    options={
                      treasureCodesQuery.isSuccess
                        ? treasureCodesQuery.data.items
                        : []
                    }
                    getOptionLabel={(option) => option.value as string}
                    renderInput={(params) => (
                      <CustomTextField
                        name="organisation.treasureCode"
                        label="Единица учета *"
                        params={params}
                        onBlur={formik.handleBlur}
                        error={
                          orgTouched?.treasureCode &&
                          Boolean(orgErrors?.treasureCode)
                        }
                        helperText={
                          orgTouched?.treasureCode && orgErrors?.treasureCode
                            ? orgErrors?.treasureCode
                            : ""
                        }
                      />
                    )}
                    onChange={(event, value) => {
                      formik.setFieldValue("organisation.treasureCode", value);
                    }}
                  />

                  <CustomTextField
                    name="organisation.inn"
                    label="ИНН Организации *"
                    value={values.organisation?.inn}
                    disabled={!canSave}
                    size="small"
                    onChange={formik.handleChange}
                    onInput={(e) => {
                      (e.target as HTMLInputElement).value = (
                        e.target as HTMLInputElement
                      ).value.replace(/[^0-9]/g, "");
                    }}
                    inputProps={{ maxLength: 9 }}
                    onBlur={formik.handleBlur}
                    error={orgTouched?.inn && Boolean(orgErrors?.inn)}
                    helperText={
                      orgTouched?.inn && orgErrors?.inn ? orgErrors?.inn : ""
                    }
                    regexp={INN_REGEXP}
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <CustomTextField
                    name="organisation.orgName"
                    label="Название организации *"
                    size="small"
                    value={values.organisation?.orgName}
                    disabled={!canSave}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={orgTouched?.orgName && Boolean(orgErrors?.orgName)}
                    helperText={
                      orgTouched?.orgName && orgErrors?.orgName
                        ? orgErrors?.orgName
                        : ""
                    }
                  />
                  <CustomTextField
                    name="organisation.address"
                    label="Адрес *"
                    size="small"
                    value={values.organisation?.address}
                    disabled={!canSave}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={orgTouched?.address && Boolean(orgErrors?.address)}
                    helperText={
                      orgTouched?.address && orgErrors?.address
                        ? orgErrors?.address
                        : ""
                    }
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <div className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
                  <Box className="tw-col-span-2">{pbsCodeContent}</Box>

                  <Autocomplete
                    value={values.organisation?.seqnums! as any}
                    multiple
                    disablePortal
                    size="small"
                    options={seqnums || []}
                    getOptionLabel={(option) =>
                      option?.id + " - " + option?.value
                    }
                    disabled={!canSave}
                    groupBy={(option) => option?.value}
                    renderGroup={(params) => {
                      if (params.group === "Выбрать всё") {
                        return (
                          <GroupHeader sx={{ paddingLeft: 0 }}>
                            <Box display="inline-block" paddingLeft="20px">
                              <FormControlLabel
                                checked={Boolean(seqnumsCheck[params.group])}
                                onChange={(_, checked) => {
                                  let selected = checked
                                    ? seqnums?.slice(1)
                                    : [];
                                  seqnumsCheck[params.group] = checked;
                                  values.organisation?.pbsCode?.forEach(
                                    (item) =>
                                      (seqnumsCheck[item?.id as string] =
                                        checked)
                                  );
                                  //@ts-ignore
                                  LoadMfAccess({ id: 1, seq: selected });
                                  setSeqnumsCheck({ ...seqnumsCheck });
                                  formik.setFieldValue(
                                    "organisation.seqnums",
                                    selected
                                  );
                                }}
                                control={<Checkbox size="small" />}
                                label="Выбрать все БЗ"
                              />
                            </Box>
                          </GroupHeader>
                        );
                      } else {
                        return (
                          <li>
                            <GroupHeader>
                              {params.group}
                              <Box display="inline-block" paddingLeft="20px">
                                <FormControlLabel
                                  checked={Boolean(seqnumsCheck[params.group])}
                                  onChange={(_, checked) => {
                                    let selected = [
                                      ...(seqnums?.filter(
                                        (item) =>
                                          item.value === params.group && checked
                                      ) || []),
                                      ...(values.organisation?.seqnums?.filter(
                                        (item) => item?.value !== params.group
                                      ) || []),
                                    ];
                                    //@ts-ignore
                                    LoadMfAccess({ id: 1, seq: selected });
                                    seqnumsCheck[params.group] = checked;
                                    setSeqnumsCheck({ ...seqnumsCheck });
                                    formik.setFieldValue(
                                      "organisation.seqnums",
                                      selected
                                    );
                                  }}
                                  control={<Checkbox size="small" />}
                                  label="Выбрать всё"
                                />
                              </Box>
                            </GroupHeader>
                            <GroupItems>{params.children}</GroupItems>
                          </li>
                        );
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Бюджетные заявки*" />
                    )}
                    onChange={(event, value) => {
                      formik.setFieldValue("organisation.seqnums", value);
                      LoadMfAccess({ id: 1, seq: value });
                    }}
                  />
                </div>
              </FormGroup>
            </div>
          </Card>

          {usersInfo}

          {budgetContent}

          {executiveBudgit}

          {certificateContent}

          {visas}

          {docHistories}
        </div>

        <div className="modals">
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
        </div>
      </form>
    </>
  );
};

export default Application;
