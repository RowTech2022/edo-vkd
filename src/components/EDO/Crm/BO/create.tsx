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
} from "@mui/material";
import { Card } from "@ui";
import { Form, Formik, useFormik } from "formik";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useFetchRejectReasonsQuery } from "@services/generalApi";
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
import { DocumentSelector } from "@components";
import { SignType } from "./helpers/constants";
import { NewApplicationForm, OrganizationInfoForm } from "./components";
import { UsersInfoForm } from "./components/UsersInfoForm";
import { BudgetPrepareForm } from "./components/BudgetPrepareForm";
import { BudgetExecutionForm } from "./components/BudgetExecutionForm";

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
    orgId: "",
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

const BOCreate = (props: Props) => {
  const navigate = useNavigate();

  const [getMfAccedd] = useLazyFetchMfListForTfmisAccessQuery();
  const [mfAccess, setMfAccess] = useState<TFMIS.IKuratonAndHeadInfo[]>();
  const [mfAccessExpenditure, setMfAccessExpenditure] =
    useState<TFMIS.IKuratonAndHeadInfo[]>();

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

  const CheckUprovedDocsApplication = () => {
    toast.promise(
      checkAprovedDoc({
        type: 2,
      }).then((c: any) => {
        if (c.error?.data?.StatusCode === 400) {
          toast.error(
            "Ошибка при подписание документа: \n" +
              JSON.stringify(c.error?.data?.Message)
          );
        } else {
          toast.success("Договор сохранена");
          navigate(`/modules/source-documents/contracts/show/${c.data.id}`);
        }
      }),
      {
        pending: "Карточка подписывается",
        success: "Карточка подписана",
        error: "Произошла ошибка",
      }
    );
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

  const formik = useFormik<any>({
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

  const { values, setFieldValue, handleChange, handleSubmit } = formik;

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
          <NewApplicationForm
            entry={props.entry}
            canSave={canSave}
            create={props.new}
            buttonSettings={props.entry.transitions?.buttonSettings}
            handleSignSignatureBody={handleSignSignatureBody}
            handleDeleteApplication={handleDeleteApplication}
            setRejectModalOpen={setRejectModalOpen}
          />

          <Card title="Дархости мазкур бо фармоиши ВМ №103 аз 23.07.2019 тасдик шудааст" />

          <OrganizationInfoForm
            canSave={canSave}
            formik={formik}
            LoadMfAccess={LoadMfAccess}
          />

          <UsersInfoForm
            formik={formik}
            canSave={canSave}
            create={props.new}
            buttonSettings={props.entry.transitions?.buttonSettings}
            handleSignSignatureBody={handleSignSignatureBody}
          />

          <BudgetPrepareForm
            formik={formik}
            canSave={canSave}
            create={props.new}
            buttonSettings={props.entry.transitions?.buttonSettings}
            mfAccess={mfAccess}
            handleSignSignatureBody={handleSignSignatureBody}
          />

          <BudgetExecutionForm
            formik={formik}
            canSave={canSave}
            create={props.new}
            buttonSettings={props.entry.transitions?.buttonSettings}
            mfAccessExpenditure={mfAccessExpenditure}
            handleSignSignatureBody={handleSignSignatureBody}
          />

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
                              helperText={
                                touched.reason ? (errors.reason as string) : ""
                              }
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

export default BOCreate;
