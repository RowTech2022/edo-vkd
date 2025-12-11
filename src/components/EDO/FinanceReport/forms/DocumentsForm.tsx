import {
  Box,
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
import { IFinanceReportsCreateRequest } from "@services/financeReport/models/create";
import { Card, CustomButton, UploadCard } from "@ui";
import { getFileInitialData } from "../schema";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileService from "@root/shared/ui/Card/service/fileService";
import { validateFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import {
  IFileResponce,
  useFetchDownloadFilesMutation,
} from "@services/fileApi";
import { useSession } from "@hooks";
import fileService from "@services/fileService";
import { getParamFromUrl, formatDate } from "@utils";

interface IDocumentsForm {
  formik: FormikProps<IFinanceReportsCreateRequest>;
}

export const DocumentsForm: FC<IDocumentsForm> = ({ formik }) => {
  const { values, setFieldValue } = formik;

  const { data: session } = useSession();
  const [downloadMedia] = useFetchDownloadFilesMutation();

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

  const downloadFile = (res: any, withUrl?: boolean, name?: string) => {
    const { file64, fileName } = res.data || {};
    const a = document.createElement("a");

    const index = res?.slice("?") || res?.length || -1;
    const url = res ? res.slice(0, index) : "";
    a.href = withUrl ? url : `data:application/pdf;base64,${file64}`;
    a.download = name || fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadFile1 = (res: string) => {
    const a = document.createElement("a");
    a.href = res;
    a.target = "_blank";
    a.download = res;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      setFieldValue("files", files);
    });
  };

  const setDownloadFile = async (fileName: string, name: string) => {
    if (fileName === "") return;
    downloadFile(fileName, true, name);
  };

  return (
    <Card title="Файлы приложения к отчету">
      <div className="tw-flex tw-flex-wrap tw-gap-2 tw-py-4 tw-px-4 mf_block_bg">
        <CustomButton
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
                <TableCell width={520}>Файл</TableCell>
                <TableCell width={200}>Название </TableCell>
                <TableCell width={400}>Описание</TableCell>
                <TableCell width={200}>Дата Создания</TableCell>
                <TableCell width={200}>Создал</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="closed__row">
              {values.files &&
                values.files.map((item, idx) => (
                  <TableRow key={`doc-${idx}`}>
                    <TableCell
                      sx={{ maxWidth: 400 }}
                      style={{ border: "solid 1px #E0E0E0" }}
                    >
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

                    <TableCell
                      contentEditable
                      suppressContentEditableWarning
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={(e) => {
                        setFieldValue(
                          `files.${idx}.name`,
                          e.currentTarget.textContent
                        );
                      }}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell
                      contentEditable
                      suppressContentEditableWarning
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={(e) => {
                        setFieldValue(
                          `files.${idx}.description`,
                          e.currentTarget.textContent
                        );
                      }}
                    >
                      {item.description}
                    </TableCell>
                    <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                      {item.createAt && formatDate(item.createAt)}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "solid 1px #E0E0E0",
                      }}
                    >
                      <Box
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.createBy}
                      </Box>
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
      </div>
    </Card>
  );
};
