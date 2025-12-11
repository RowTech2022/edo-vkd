import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { FormikProps } from "formik";
import { FC } from "react";
import { IFinanceReportsUndoDocumentRequest } from "@services/financeReport/models/actions";
import { useFetchRejectReasonsQuery } from "@services/generalApi";
import ReactQuill from "react-quill";
import UndoIcon from "@mui/icons-material/Undo";
import "react-quill/dist/quill.snow.css";

interface IUndoDocumentForm {
  formik: FormikProps<IFinanceReportsUndoDocumentRequest>;
}

const reactQuillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

export const UndoDocumentForm: FC<IUndoDocumentForm> = ({ formik }) => {
  const { data: reasons } = useFetchRejectReasonsQuery();

  const { setFieldValue, values } = formik;

  const reason = reasons?.items.find((item) => item.id === values.reason);

  return (
    <Box className="w-[100%]">
      <Autocomplete
        className="tw-mb-2"
        disablePortal
        options={reasons?.items || []}
        getOptionLabel={(option) => option.value as string}
        size="small"
        noOptionsText="Нет данных"
        renderInput={(params) => (
          <TextField {...params} name="reason" label="Причина отказа*" />
        )}
        value={reason}
        onChange={(event, value) => {
          setFieldValue("reason", value?.id);
        }}
      />
      <div className="tw-h-[230px]">
        <ReactQuill
          className="tw-h-[100%]"
          value={values?.comment}
          modules={reactQuillModules}
          onChange={(e) => {
            setFieldValue("comment", e);
          }}
          theme="snow"
        />
      </div>
      <Box display="flex" justifyContent="end" paddingTop={2}>
        <Button
          onClick={() => formik.submitForm()}
          variant="contained"
          startIcon={
            <UndoIcon
              width="20px"
              height="20px"
              fill="currentColor"
              stroke="none"
            />
          }
        >
          Вернуть документ
        </Button>
      </Box>
    </Box>
  );
};
