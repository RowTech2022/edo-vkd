import { Box } from "@mui/material";
import { Formik } from "formik";
import { financeReportSchema, initialValues } from "./schema";
import { FinanceReportForm } from "./forms/FinanceReportForm";
import { IFinanceReportsCreateRequest } from "@services/financeReport/models/create";
import {
  useCreateFinanceReportMutation,
  useGetByIdFinanceReportsMutation,
  useUpdateFinanceReportMutation,
} from "@services/financeReport";
import { FC, useEffect, useState } from "react";
import { toastPromise } from "@utils";
import { useNavigate, useParams } from "react-router";

export const FinanceReportCreate: FC = () => {
  const [initialFinanceValues, setInitialValues] = useState(initialValues);
  const [createFinanceReport] = useCreateFinanceReportMutation();
  const [updateFinanceReport] = useUpdateFinanceReportMutation();
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [getByIdFinanceReport] = useGetByIdFinanceReportsMutation();

  const onSubmit = (values: IFinanceReportsCreateRequest) => {
    const { transitions, ...payload } = values;

    if (payload.reportDetails?.items) {
      payload.reportDetails = {
        items: (payload.reportDetails?.items as Array<any>).map(
          ({
            metaDataId,
            startSum,
            endSum,
            code,
            dependCodes,
            isReadOnly,
            endDependCodes,
            priority,
            reportType,
            startDependCodes,
            title,
            ...other
          }) => {
            return {
              metaDataId,
              startSum,
              endSum,
              ...(Number(payload.reportType?.id || "") === 4 ? other : {}),
            };
          }
        ),
      };
    }

    let financeReportAction = id ? updateFinanceReport : createFinanceReport;
    payload.files?.forEach((item) => ({
      ...item,
      createAt: new Date(item.createAt).toISOString(),
    }));
    const promise = financeReportAction(payload as any);
    toastPromise(
      promise,
      {
        pending: `Отчет ${id ? "сохраняется" : "создается"}`,
        error: "Произошло ошибка",
        success: `Отчет успешно ${id ? "сохранен" : "создан"}`,
      },
      {
        then: (data) => {
          setInitialValues(data);
          navigate(`/modules/finance-report/show/${data.id}`);
        },
      }
    );
  };

  useEffect(() => {
    if (id && Number(id) !== initialValues?.id) {
      getByIdFinanceReport(Number(id)).then((res: any) => {
        if (res.data) {
          setInitialValues({
            ...res.data,
            files: res.data.files || [],
          });
        }
      });
    }
  }, [id, initialValues, getByIdFinanceReport]);

  return (
    <Box>
      <Formik
        enableReinitialize
        initialValues={initialFinanceValues}
        validationSchema={financeReportSchema}
        validateOnChange
        onSubmit={onSubmit}
      >
        {(formik) => (
          <FinanceReportForm
            setInitialValues={setInitialValues}
            formik={formik}
          />
        )}
      </Formik>
    </Box>
  );
};
