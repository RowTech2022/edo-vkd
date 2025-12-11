import { Box } from "@mui/material";
import { FormikProps } from "formik";
import { FC, Fragment, useMemo, useState } from "react";
import {
  IFinanceReportsCreateRequest,
  IFinanceReportsCreateResponse,
} from "@services/financeReport/models/create";
import { ActionButtons } from "../components/ActionButtons";
import { DetailsForm } from "./DetailsForm";
import { InfoForm } from "./InfoForm";
import { DocumentsForm } from "./DocumentsForm";
import { IFinanceReportsSignRequest } from "@services/financeReport/models/actions";
import { Card } from "@ui";
import {
  useAcceptFinanceReportMutation,
  useSignFinanceReportMutation,
} from "@services/financeReport";
import { toast } from "react-toastify";
import { UndoDocument } from "../components/UndoDocument";
import Modal from "@mui/material/Modal";
import { TableForm } from "./TableForm";
import FinanceReportStatus from "../components/FinanceReportStatus";
import { useParams } from "react-router";

interface IFinanceReportForm {
  formik: FormikProps<IFinanceReportsCreateRequest>;
  setInitialValues: (values: IFinanceReportsCreateResponse) => void;
}

export enum UndoDocumentType {
  returnDoc,
  reject,
}

export const FinanceReportForm: FC<IFinanceReportForm> = ({
  formik,
  setInitialValues,
}) => {
  const { values } = formik;
  const [signFinanceReport] = useSignFinanceReportMutation();
  const [acceptFinanceReport] = useAcceptFinanceReportMutation();
  const [open, setOpen] = useState(false);
  const [undoDocType, setUndoDocType] = useState<UndoDocumentType>(
    UndoDocumentType.returnDoc
  );
  const params = useParams();

  const onSubmit = () => {
    formik.submitForm();
  };
  const onSign = () => {
    const payload: IFinanceReportsSignRequest = {
      id: values.id as number,
      timestamp: values.timestamp as string,
    };

    const promise = signFinanceReport(payload).then((res: any) => {
      if (res.error) throw res.error;
      setInitialValues(res.data);
    });

    toast.promise(promise, {
      pending: "Изменение сохраняються",
      error: "Произошло ошибка",
      success: "Подписание отчета прошло успешно",
    });
  };
  const onAccept = () => {
    const payload: IFinanceReportsSignRequest = {
      id: values.id as number,
      timestamp: values.timestamp as string,
    };

    const promise = acceptFinanceReport(payload).then((res: any) => {
      if (res.error) throw res.error;
      setInitialValues(res.data);
    });

    toast.promise(promise, {
      pending: "Изменение сохраняються",
      error: "Произошло ошибка",
      success: "Отчет успешно принять",
    });
  };

  const onUndoDoc = (type: UndoDocumentType) => {
    setUndoDocType(type);
    setOpen(true);
  };

  const tableForm = useMemo(
    () => <TableForm formik={formik} />,
    [values.reportDetails?.items, values.reportType]
  );

  return (
    <Box className="tw-flex tw-flex-col tw-gap-4 tw-mb-4">
      <Card title="Финансовый отчет">
        <div className="mf_block_bg">
          <ActionButtons
            isEditMode={Boolean(params.id)}
            transitions={values.transitions}
            onSubmit={onSubmit}
            onSign={onSign}
            onAccept={onAccept}
            onUndoDoc={onUndoDoc}
          />
          <Box marginBottom={2}>
            <FinanceReportStatus
              activeState={values.state || 0}
              endStatus={100}
            />
          </Box>
        </div>
      </Card>
      <InfoForm formik={formik} />
      <DetailsForm formik={formik} />
      {tableForm}
      <DocumentsForm formik={formik} />
      <Modal open={open} onClose={() => setOpen(false)}>
        <Fragment>
          <UndoDocument
            id={values.id || 0}
            type={undoDocType}
            timestamp={values.timestamp || ""}
            setInitialValues={setInitialValues}
          />
        </Fragment>
      </Modal>
    </Box>
  );
};
