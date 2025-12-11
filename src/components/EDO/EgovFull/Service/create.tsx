import { Card } from "@ui";
import { FC , useEffect, useMemo, useState } from "react";
import { EgovActions } from "./forms/EgovActions";
import { useFormik } from "formik";
import { initialValues } from "./helpers/schema";
import { EgovServiceForm } from "./forms/EgovServiceForm";
import { transformValues } from "./helpers/transformValues";
import { toast } from "react-toastify";
import { deepCopy } from "@utils";
import { generateFrom } from "./helpers/generateFrom";
import EgovIndicator from "./forms/EgovIndicator";
import { EgovApplicationStatus } from "@root/components/Registries/Egov/ApplicationResident/helpers/constants";
import {
  IEgovServiceRequestsDTO,
  useCloseEgovServiceRequestsMutation,
  useCreateEgovServiceRequestsMutation,
  useSendToResolutionEgovServiceRequestsMutation,
  useSignEgovServiceRequestsMutation,
} from "@services/egovServiceRequests";
import { useFetchEgovServicesByIdMutation } from "@services/egovServices";
import { EgovRequiredFilesForm } from "./forms/EgovRequiredFilesForm";
import { useLocation, useNavigate } from "react-router";

interface IEgovCreate {
  id?: number;
  orgId?: number;
  srvId?: number;
}

const saveAlerts = {
  pending: "Изменение сохраняются",
  success: "Изменение сохранено",
  error: "Произошла ошибка",
};

const EgovFullServiceCreate: FC<IEgovCreate> = ({ id, orgId, srvId }) => {
  const isNew = id ? false : true;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.split("/");
  const [createEgovServiceRequests] = useCreateEgovServiceRequestsMutation();
  const [signEgovServicesRequests] = useSignEgovServiceRequestsMutation();
  const [sendToResolutionEgovServicesRequests] =
    useSendToResolutionEgovServiceRequestsMutation();
  const [closeEgovServicesRequests] = useCloseEgovServiceRequestsMutation();

  const [DTO, setDTO] = useState<IEgovServiceRequestsDTO | null>(null);
  const [emptyFiles, setEmptyFiles] = useState(false);

  const [getEgovServicesById] = useFetchEgovServicesByIdMutation();

  useEffect(() => {
    if (srvId) {
      getEgovServicesById(srvId)
        .then((res: any) => {
          if (res.data) {
            setDTO(res.data);
          }
        })
        .catch(() => {});
    }
  }, [srvId, getEgovServicesById]);

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
          let res = await createEgovServiceRequests({
            ...others,
          });

          if ("data" in res) {
            navigate(
              `/modules/egovFull/Organisation/${orgId}/Service/${srvId}/show/${res.data.id}`
            );
          }
        },
        {
          pending: srvId ? "Изменение сохраняются" : "Услуга создается",
          success: srvId ? "Изменение сохранено" : "Услуга создана",
          error: "Произошла ошибка",
        }
      );
    },
  });

  const handles = {
    back() {
      navigate(`/modules/egovFull/Organisation/${orgId}/Service/${srvId}`);
    },

    save() {
      if (
        formik.values.files.filter((item: any) => !item.filePath).length > 0
      ) {
        toast.error("Запольните все необходимые документы!");
        setEmptyFiles(true);
        return;
      }
      formik.submitForm();
    },

    accept() {
      if (!formik.values.acceptedFiles.length) return;
    },

    sign() {
      const promise = signEgovServicesRequests({
        id: DTO?.id || 0,
        timestamp: "",
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

    sendToResolution() {
      const promise = sendToResolutionEgovServicesRequests({
        id: DTO?.id || 0,
        approveBy: 0,
        comment: "",
        timestamp: "",
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

    close() {
      const promise = closeEgovServicesRequests({
        id: DTO?.id || 0,
        timestamp: "",
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
  };

  const isFormDisabled = DTO?.state === EgovApplicationStatus.accepted;

  return (
    <>
      <form className="tw-flex tw-flex-col tw-gap-4 tw-pb-6">
        <Card
          title={
            path.at(-1) !== "create"
              ? "Редактирование услуги"
              : "Создание услуги"
          }
        >
          <EgovActions
            isNew={isNew}
            handles={handles}
            transitions={DTO?.transitions}
            formik={formik}
            createMode={!Boolean(srvId)}
            disabled={isFormDisabled}
          >
            <EgovIndicator
              activeState={DTO?.state || 0}
              endStatus={EgovApplicationStatus.accepted}
            />
          </EgovActions>
        </Card>

        <Card title="Информация об услуге">
          <div
            style={{ paddingTop: 10 }}
            className="tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]"
          >
            <EgovServiceForm />
          </div>
        </Card>

        <Card title="Необходимые документы">
          <div
            style={{ paddingTop: 10 }}
            className="tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]"
          >
            <EgovRequiredFilesForm
              uploadDisabled={
                DTO?.transitions?.buttonSettings.btn_file?.readOnly ||
                isFormDisabled
              }
              emptyFiles={emptyFiles}
              formik={formik}
            />
          </div>
        </Card>
      </form>
    </>
  );
};

export default EgovFullServiceCreate;
