import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FormikProps } from "formik";
import { FC } from "react";
import { CustomButton, UploadCard } from "@ui";
import { getFileInitialData } from "../../schema";
import Tooltip from "@mui/material/Tooltip";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileService from "@root/shared/ui/Card/service/fileService";
import { validateFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import { IFileResponce } from "@services/fileApi";
import { useSession, downloadFile } from "@hooks";
import fileService from "@services/fileService";
import { getParamFromUrl, formatDate } from "@utils";
import {
  ILettersV3CreateRequest,
  ILettersV3FilesRequest,
} from "@services/lettersApiV3";
import { UploadIcon } from "@icons";

interface IDocumentsForm {
  formik: FormikProps<ILettersV3CreateRequest>;
  canSave: boolean;
  readyFiles: ILettersV3FilesRequest[];
}

export const DocumentsForm: FC<IDocumentsForm> = ({
  formik,
  canSave,
  readyFiles,
}) => {
  const { values, setFieldValue } = formik;

  const { data: session } = useSession();

  const addRow = () => {
    const files = values.files;

    setFieldValue("files", [
      ...files,
      getFileInitialData(session?.user?.displayName || "", files.length),
    ]);
  };

  const handleDeleteRow = (idx: number) => {
    const files = values.files;

    files.splice(idx, 1);
    setFieldValue("files", files);
  };

  const handleUploadFile = async (idx: number, event: HTMLInputElement) => {
    const file = event.files;
    if (!file) {
      return;
    }

    const validFileType = await validateFileType(
      FileService.getFileExtension(file[0]?.name)
    );

    if (!validFileType.isValid) {
      alert(validFileType.errorMessage);
      return;
    }

    const { files } = values;
    files[idx].loading = true;
    setFieldValue("files", files);

    const formData = new FormData();
    formData.append(idx.toString(), file[0]);

    await fileService.uploadFileV2(formData).then((e) => {
      let resp = e as { data: IFileResponce };
      files[idx].loading = undefined;
      files[idx].url = resp.data.url;
      files[idx].name =
        getParamFromUrl(resp.data.url, "fileName")?.slice(-200, -4) || "";
      setFieldValue("files", files);
    });
  };

  const setDownloadFile = async (fileName: string, name: string) => {
    if (name === "") return;
    downloadFile(name);
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <CustomButton
        className="tw-mr-2 tw-w-[187px]"
        onClick={(e) => {
          addRow();
        }}
      >
        Добавить документ
      </CustomButton>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell width={"50%"}>Файл</TableCell>
              <TableCell width={"30%"}>Название </TableCell>
              <TableCell width={"20%"}>Дата Создания</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="closed__row">
            {values.files &&
              values.files.map((item, idx) => (
                <TableRow key={`doc-${idx}`}>
                  <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                    <div className="fileUploadButton tw-flex">
                      {item.loading ? (
                        <Box display="flex" justifyContent="center">
                          <CircularProgress size={30} />
                        </Box>
                      ) : (
                        <></>
                      )}
                      <UploadCard
                        urlParser={(url) =>
                          getParamFromUrl(url, "fileName") || ""
                        }
                        change={handleUploadFile}
                        download={(fileName: string) =>
                          setDownloadFile(fileName, item.url)
                        }
                        item={item}
                      />
                    </div>
                  </TableCell>

                  <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                    {item.name}
                  </TableCell>
                  <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                    {item.createAt && formatDate(item.createAt)}
                  </TableCell>
                  <div className="tw-text-center tw-flex tw-justify-end tw-items-center">
                    <IconButton onClick={() => handleDeleteRow(idx)}>
                      <DeleteOutlineIcon style={{ color: "red" }} />
                    </IconButton>
                  </div>
                </TableRow>
              ))}
            {readyFiles &&
              readyFiles.map((item, idx) => (
                <TableRow key={`doc-${idx}`}>
                  <TableCell
                    style={{
                      border: "solid 1px #E0E0E0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CloudDoneIcon />
                    <div
                      onClick={(e) => setDownloadFile(item.name, item.url)}
                      className={`tw-flex tw-items-center tw-gap-0.5 tw-font-medium ${
                        item?.url
                          ? "tw-text-blue-500 tw-cursor-pointer tw-w-11/12"
                          : "tw-text-gray-400"
                      } tw-text-center tw-rounded-md tw-p-2`}
                    >
                      <UploadIcon
                        fill={item?.url ? "#005FF9FF" : "rgba(149,164,166,1)"}
                        reverse={item?.url ? true : false}
                      />
                      <Tooltip title={item?.url} arrow>
                        <span
                          style={{ width: item.url ? "450px" : "" }}
                          className={
                            item?.url ? "tw-truncate tw-text-left" : ""
                          }
                        >
                          {item?.url
                            ? getParamFromUrl(item.url, "fileName")
                            : "Загрузите файл"}
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>

                  <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                    {item.name.slice(-200, -4)}
                  </TableCell>
                  <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                    {item.date && formatDate(item.date)}
                  </TableCell>
                  <div className="tw-text-center tw-flex tw-justify-end tw-items-center">
                    <IconButton onClick={() => handleDeleteRow(idx)}>
                      <DeleteOutlineIcon style={{ color: "red" }} />
                    </IconButton>
                  </div>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        disabled={!canSave}
        className="tw-mr-2 tw-w-[187px] tw-self-end"
        variant="contained"
        onClick={() => formik.submitForm()}
      >
        Сохранить
      </Button>
    </div>
  );
};
