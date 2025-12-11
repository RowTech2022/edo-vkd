import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Button, Typography, styled } from "@mui/material";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import fileService from "@services/fileService";
import { getParamFromUrl } from "@utils";
import { UploadIconGreenCloud } from "@icons";
import { EgovFullFormikTypeForUpdate } from "../helpers/schemaForUpdate";
import { LoadingButton } from "@mui/lab";
import { IFileResponce } from "@services/fileApi";
import { downloadFile } from "@hooks";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface IEgovFilesAcceptedForm {
  formik: EgovFullFormikTypeForUpdate;
  uploadDisabled?: boolean;
  text? : string
}

export const EgovFilesAcceptedForm: FC<IEgovFilesAcceptedForm> = ({
  formik,
  uploadDisabled,
  text
}) => {
  const { values, setFieldValue } = formik;

  const [fileLoading, setFileLoading] = useState(false);

  const handleUploadFile = async (idx: number, event: HTMLInputElement) => {
    setFileLoading(true);
    const filesFormats = [".doc", ".docx", ".xlsx", ".pdf", ".PFD"];
    const file: any = event.files;

    if (!file) {
      return;
    }
    if (file[0]?.size > 10485760) {
      toast("Размер файла должен быть не более 10 Мб");
      setFileLoading(false);
      return;
    }
    function ext(name: any) {
      return name.match(/\.([^.]+)$|$/)[1];
    }

    const isRightFormat = filesFormats.includes("." + ext(file[0].name));
    if (!isRightFormat) {
      toast(
        "Вы можете загрузить только документы в формате .pdf, .xls или .doc"
      );
      setFileLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append(idx.toString(), file[0]);

    await fileService
      .uploadFileV2(formData)
      .then((e) => {
        let resp = e as { data: IFileResponce };
        setFieldValue("acceptedFiles", [
          ...values.acceptedFiles,
          resp.data.url,
        ]);
      })
      .finally(() => setFileLoading(false));
  };

  const removeFile = (removeItem: string) => {
    setFieldValue(
      "acceptedFiles",
      values.acceptedFiles?.filter((item) => item !== removeItem)
    );
  };

  return (
    <>
      {values.acceptedFiles &&
        values.acceptedFiles.map((item, idx) => (
          <div
            key={idx}
            className="tw-relative tw-flex tw-gap-4 tw-items-center tw-justify-center tw-p-2 tw-border-[1px] tw-border-dashed tw-border-secondary tw-rounded-2xl"
          >
            <TextSnippetIcon fontSize="large" color="primary" />
            <Typography className="tw-text-primary tw-font-semibold">
              {getParamFromUrl(item, "fileName")}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              className="tw-absolute tw-right-12"
              onClick={() => downloadFile(item)}
            >
              Открыть файл
            </Button>
            <HighlightOffIcon
              fontSize="large"
              className={`tw-absolute tw-right-2 ${
                uploadDisabled
                  ? "tw-text-gray-300"
                  : "tw-text-red-400 hover:tw-text-red-500 tw-cursor-pointer"
              }`}
              onClick={() => (!uploadDisabled ? removeFile(item) : undefined)}
            />
          </div>
        ))}
      <div className="tw-flex tw-gap-4 tw-items-center tw-justify-center tw-p-2 tw-border-[1px] tw-border-dashed tw-border-[#4676FB] tw-bg-secondary/10 tw-rounded-2xl">
        <UploadIconGreenCloud />
        <div>
          <Typography>Прикрепите файлы документы</Typography>
          <Typography className="tw-text-secondary">
            {text ? text : "PDF не более 10MB"}
          </Typography>
        </div>
        <LoadingButton
          disabled={uploadDisabled}
          loading={fileLoading}
          loadingPosition="end"
          component="label"
          variant="contained"
          endIcon={<CloudUploadIcon />}
        >
          Выбрать файл
          <VisuallyHiddenInput
            onChange={(e) =>
              handleUploadFile(1, e.currentTarget as HTMLInputElement)
            }
            type="file"
          />
        </LoadingButton>
      </div>
    </>
  );
};
