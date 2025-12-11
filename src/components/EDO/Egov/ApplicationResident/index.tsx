import { Card } from "@ui";
import { FC , useEffect, useMemo, useState } from "react";
import { EgovActions } from "./forms/EgovActions";
import { initialValues } from "./helpers/schema";
import { EgovTaxpayerForm } from "./forms/EgovTaxpayerForm";
import { EgovApplicationForm } from "./forms/EgovApplicationForm";
import { EgovVisaForm } from "./forms/EgovVisaForm";
import { EgovFilesForm } from "./forms/EgovFilesForm";
import { EgovHistoryForm } from "./forms/EgovHistoryForm";
import { transformValues } from "./helpers/transformValues";
import {
  useAcceptEgovApplicationMutation,
  useCreateEgovApplicationMutation,
  useGetByIdEgovApplicationMutation,
  useSignDocEgovApplicationMutation,
  useUndoDocEgovApplicationMutation,
  useUpdateEgovApplicationMutation,
} from "@services/egov/application-resident";
import { toast } from "react-toastify";
import { IEgovApplicationCreateResponse } from "@services/egov/application-resident/models/create";
import { deepCopy } from "@utils";
import { generateFrom } from "./helpers/generateFrom";
import { Chat } from "./chat";
import { Box, Button, Dialog } from "@mui/material";
import { EgovUndoDoc } from "./forms/EgovUndoDoc";
import {
  IEgovAcceptRequest,
  IEgovUndoDocRequest,
} from "@services/egov/application-resident/models/actions";
import { EgovFilesAccepted } from "./forms/EgovFilesAccepted";
import EgovIndicator from "./forms/EgovIndicator";
import { EgovApplicationStatus } from "@root/components/Registries/Egov/ApplicationResident/helpers/constants";
import { useFormik } from "formik";
import { useNavigate } from "react-router";

interface IEgovCreate {
  id?: number;
}

const saveAlerts = {
  pending: "Изменение сохраняются",
  success: "Изменение сохранено",
  error: "Произошла ошибка",
};

const EgovCreate: FC<IEgovCreate> = ({ id }) => {
  const navigate = useNavigate();
  const [createEgovApplication] = useCreateEgovApplicationMutation();
  const [updateEgovApplication] = useUpdateEgovApplicationMutation();
  const [signDocEgov] = useSignDocEgovApplicationMutation();
  const [undoDocEgov] = useUndoDocEgovApplicationMutation();
  const [acceptEgov] = useAcceptEgovApplicationMutation();
  const [getByIdEgov] = useGetByIdEgovApplicationMutation();
  const [discutionType, setDiscutionType] = useState(1);
  const [DTO, setDTO] = useState<IEgovApplicationCreateResponse | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [undoModalOpen, setUndoModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getByIdEgov(id)
        .then((res) => {
          if ("data" in res) {
            setDTO(res.data);
          }
        })
        .catch(() => {});
    }
  }, [id, getByIdEgov]);

  const formikValues = useMemo(() => {
    return DTO ? generateFrom(DTO) : deepCopy(initialValues);
  }, [DTO]);

  const formik = useFormik({
    initialValues: formikValues,
    enableReinitialize: true,
    onSubmit(values) {
      const { acceptedFiles, ...others } = values;
      const payload = transformValues(others);

      toast.promise(
        async () => {
          let res = null;
          if (id) {
            res = await updateEgovApplication({
              ...payload,
              id: Number(id),
            });
          } else {
            res = await createEgovApplication(payload);
          }

          if ("data" in res) {
            navigate(
              `/modules/eGov/Application-of-resident/show/${res.data.id}`
            );
          }
        },
        {
          pending: id ? "Изменение сохраняются" : "Заявка создается",
          success: id ? "Изменение сохранено" : "Заявка создано",
          error: "Произошла ошибка",
        }
      );
    },
  });

  const handles = {
    back() {
      navigate(-1);
    },

    save() {
      formik.submitForm();
    },

    undo(payload: IEgovUndoDocRequest) {
      const promise = undoDocEgov(payload);

      promise
        .then((res: any) => {
          if (!res.error && "data" in res) {
            setDTO(res.data);
          }
        })
        .catch((err) => console.log(err));

      toast.promise(promise, saveAlerts);
    },

    accept() {
      if (!formik.values.acceptedFiles.length) return;

      const payload: IEgovAcceptRequest = {
        id: Number(id),
        readyFile: {
          ...formik.values.acceptedFiles[0],
        },
      };

      const promise = acceptEgov(payload);

      promise
        .then((res: any) => {
          if (!res.error && "data" in res) {
            setDTO(res.data);
          }
        })
        .catch((err) => console.log(err));

      toast.promise(promise, saveAlerts);
    },

    sign() {
      const promise = signDocEgov({
        id: DTO?.id || 0,
        currentState: 1,
      });

      promise
        .then((res: any) => {
          if (!res.error && "data" in res) {
            setDTO(res.data);
          }
        })
        .catch((err) => console.log(err));

      toast.promise(promise, saveAlerts);
    },

    openChat(type?: number) {
      setDiscutionType(type === 2 ? 2 : 1);
      setChatOpen(true);
    },

    cancelUndoForm() {
      setUndoModalOpen(false);
    },

    openUndoForm() {
      setUndoModalOpen(true);
    },
  };

  const isFormDisabled = DTO?.state === EgovApplicationStatus.accepted;

  return (
    <>
      {" "}
      <form className="tw-flex tw-flex-col tw-gap-4 tw-pb-6">
        <Card title="Новое входящее письмо">
          <EgovActions
            handles={handles}
            transitions={DTO?.transitions}
            formik={formik}
            createMode={!Boolean(id)}
            disabled={isFormDisabled}
          >
            <EgovIndicator
              activeState={DTO?.state || 0}
              endStatus={EgovApplicationStatus.accepted}
            />
          </EgovActions>
        </Card>

        <Card title="Информация о налогоплательщике">
          <EgovTaxpayerForm disabled={isFormDisabled} formik={formik} />
        </Card>

        <Card title="Содержание заявления">
          <EgovApplicationForm
            disabled={isFormDisabled}
            mainSign={DTO?.mainSign}
            formik={formik}
            handleSign={handles.sign}
            signReadonly={DTO?.transitions?.buttonSettings.btn_sign?.readOnly}
            createMode={!Boolean(id)}
          />
        </Card>

        <Card title="Файлы приложения к заявлению">
          <EgovFilesForm
            uploadDisabled={
              DTO?.transitions?.buttonSettings.btn_file?.readOnly ||
              isFormDisabled
            }
            formik={formik}
          />
        </Card>

        {!DTO?.transitions?.buttonSettings.btn_ready_file?.readOnly && id && (
          <Card title="Готовый подписанный документ">
            <EgovFilesAccepted
              uploadDisable={
                DTO?.transitions?.buttonSettings.btn_ready_file?.readOnly ||
                isFormDisabled
              }
              formik={formik}
              acceptDoc={acceptEgov}
            />
          </Card>
        )}

        <Card title="Визы пользователей">
          <EgovVisaForm visa={DTO?.userVisas || []} />
        </Card>

        <Card title="История состояний заявления">
          <EgovHistoryForm history={DTO?.documentHistories || []} />
        </Card>

        {!DTO?.transitions?.buttonSettings.openDiscussion?.readOnly && id && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 2,
            }}
          >
            <Button
              disabled={
                DTO?.transitions?.buttonSettings.openDiscussion?.readOnly
              }
              color="secondary"
              variant="contained"
              onClick={() => handles.openChat(2)}
            >
              Обсуждение
            </Button>
          </Box>
        )}
      </form>
      <Dialog open={undoModalOpen}>
        <EgovUndoDoc
          id={DTO?.id || 0}
          handleCancel={handles.cancelUndoForm}
          undoDocument={handles.undo}
        />
      </Dialog>
      <Chat
        applicationResidentId={DTO?.id || 0}
        discutionType={discutionType}
        open={chatOpen}
        setOpen={setChatOpen}
      />
    </>
  );
};

export default EgovCreate;
