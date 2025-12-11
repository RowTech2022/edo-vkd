import { Box } from "@mui/material";
import { Formik } from "formik";
import { FC, useMemo } from "react";
import { toast } from "react-toastify";
import { useUndoDocFinanceReportMutation } from "@services/financeReport";
import { IFinanceReportsUndoDocumentRequest } from "@services/financeReport/models/actions";
import { IFinanceReportsCreateResponse } from "@services/financeReport/models/create";
import { UndoDocumentForm } from "../forms/UndoDocument";
import {
  StyledCard,
  StyledCardHeader,
} from "@root/components/EDO/Letters/Incoming/folders/modal";
import CardContent from "@mui/material/CardContent";
import { UndoDocumentType } from "../forms/FinanceReportForm";

const initialValues: IFinanceReportsUndoDocumentRequest = {
  id: 0,
  reason: 1,
  comment: "",
  operation: 0,
  timestamp: "",
};

interface IUndoDocument {
  id: number;
  type: UndoDocumentType;
  timestamp: string;
  setInitialValues: (values: IFinanceReportsCreateResponse) => void;
}

export const UndoDocument: FC<IUndoDocument> = ({
  id,
  timestamp,
  type,
  setInitialValues,
}) => {
  const [undoDocument] = useUndoDocFinanceReportMutation();

  const undoInitialValues = useMemo(() => {
    return {
      ...initialValues,
      id: id || 0,
      operation: type === UndoDocumentType.returnDoc ? 0 : 1,
      timestamp: timestamp || "",
    };
  }, [id, timestamp]);

  const onSubmit = (values: IFinanceReportsUndoDocumentRequest) => {
    const promise = undoDocument(values).then((res: any) => {
      if (res.error) {
        throw res.error;
      }
      setInitialValues(res.data);
    });
    toast.promise(promise, {
      pending: "Идет процесс возврата документа",
      error: "Произошло ошибка",
      success: "Возврать документа прошло успешно",
    });
  };

  return (
    <StyledCard className="tw-max-w-[700px] tw-w-[700px]">
      <StyledCardHeader
        title={
          type === UndoDocumentType.reject ? "Отвергунть" : "Вернуть документ"
        }
      />
      <CardContent>
        <Box padding={1} sx={{ backgroundColor: "#fff" }}>
          <Formik initialValues={undoInitialValues} onSubmit={onSubmit}>
            {(formik) => <UndoDocumentForm formik={formik} />}
          </Formik>
        </Box>
      </CardContent>
    </StyledCard>
  );
};
