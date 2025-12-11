import { Card } from "@ui";
import { FC, useEffect, useMemo, useState } from "react";
import { EgovActions } from "./forms/EgovActions";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./helpers/schema";
import { EgovServiceForm } from "./forms/EgovServiceForm";
import { EgovFilesForm } from "./forms/EgovFilesForm";
import { transformValues } from "./helpers/transformValues";
import { toast } from "react-toastify";
import { deepCopy } from "@utils";
import { generateFrom } from "./helpers/generateFrom";
import EgovIndicator from "./forms/EgovIndicator";
import { EgovApplicationStatus } from "@root/components/Registries/Egov/ApplicationResident/helpers/constants";
import {
  IEgovServicesCreateResponse,
  useCreateEgovServicesMutation,
  useFetchEgovServicesByIdMutation,
  useSignEgovServicesMutation,
  useUpdateEgovServicesMutation,
} from "@services/egovServices";
import { useNavigate, useParams } from "react-router";
interface IEgovCreate {
  id?: number;
}

const saveAlerts = {
  pending: "Изменение сохраняются",
  success: "Изменение сохранено",
  error: "Произошла ошибка",
};

const EgovFullCreate: FC<IEgovCreate> = ({ id }) => {
  const navigate = useNavigate();
  const [createEgovServices] = useCreateEgovServicesMutation();
  const [updateEgovServices] = useUpdateEgovServicesMutation();
  const [getEgovServicesById] = useFetchEgovServicesByIdMutation();
  const [signEgovService] = useSignEgovServicesMutation();

  const [DTO, setDTO] = useState<IEgovServicesCreateResponse | null>(null);
  const query = useParams();
  const orgId = query.fid ? Number(query.fid) : 0;

  useEffect(() => {
    if (id) {
      getEgovServicesById(id)
        .then((res: any) => {
          if ("data" in res) {
            setDTO(res.data);
          }
        })
        .catch(() => {});
    }
  }, [id, getEgovServicesById]);

  const formikValues = useMemo(() => {
    return DTO ? generateFrom(DTO) : deepCopy(initialValues);
  }, [DTO]);

  const formik = useFormik({
    initialValues: formikValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit(values) {
      const { acceptedFiles, ...others } = values;
      const payload = transformValues(others);

      toast.promise(
        async () => {
          let res = null;
          if (id) {
            res = await updateEgovServices({
              ...payload,
              id: Number(id),
              timestamp: DTO?.timestamp || "",
            });
          } else {
            res = await createEgovServices({
              ...payload,
              organisationId: orgId,
            });
          }

          if ("data" in res) {
            navigate(
              `/modules/egovFull/Organisation/${orgId}/show/${res.data.id}`
            );
          }
        },
        {
          pending: id ? "Изменение сохраняются" : "Услуга создается",
          success: id ? "Изменение сохранено" : "Услуга создана",
          error: "Произошла ошибка",
        }
      );
    },
  });

  const handles = {
    back() {
      navigate(`/modules/egovFull/Organisation/${orgId}`);
    },

    save() {
      formik.submitForm();
    },

    sign() {
      const promise = signEgovService({
        id: DTO?.id || 0,
        timestamp: DTO?.timestamp || "",
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
        <Card title={id ? "Редактирование услуги" : "Создание услуги"}>
          <EgovActions
            handles={handles}
            transitions={DTO?.transitions}
            formik={formik}
            createMode={!Boolean(id)}
            disabled={isFormDisabled || DTO?.state === 2}
          >
            <EgovIndicator
              activeState={DTO?.state || 0}
              endStatus={EgovApplicationStatus.registration}
            />
          </EgovActions>
        </Card>

        <Card title="Информация об услуге">
          <div
            style={{ paddingTop: 10 }}
            className="tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]"
          >
            <EgovServiceForm disabled={isFormDisabled} formik={formik} />
          </div>
        </Card>

        <Card title="Документы">
          <div
            style={{ paddingTop: 10 }}
            className="tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]"
          >
            <EgovFilesForm
              uploadDisabled={
                DTO?.transitions?.buttonSettings.btn_file?.readOnly ||
                isFormDisabled
              }
              formik={formik}
            />
          </div>
        </Card>
      </form>
    </>
  );
};

export default EgovFullCreate;
