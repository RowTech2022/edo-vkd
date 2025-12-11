import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC } from "react";
import { EgovFormikType } from "../helpers/schema";
import { IEgovFile } from "@services/egov/application-resident/models/common";
import fileService from "@services/fileService";
import { getParamFromUrl } from "@utils";
import { IEgovAcceptRequest } from "@services/egov/application-resident/models/actions";
import { downloadFile } from "../helpers/downloadFile";
import { UploadCard } from "@ui";
import FileService from "@root/shared/ui/Card/service/fileService";
import { validateLettersFileType } from "@root/shared/ui/Card/service/fileValidatorService";

interface IEgovFilesForm {
  formik: EgovFormikType;
  uploadDisable?: boolean;
  acceptDoc: (payload: IEgovAcceptRequest) => void;
}

export const EgovFilesAccepted: FC<IEgovFilesForm> = ({
  formik,
  uploadDisable,
}) => {
  const { values, setFieldValue } = formik;

  const handles = {
    getDelete(id: number) {
      return () => {
        setFieldValue(
          "acceptedFiles",
          values.acceptedFiles.filter((item: any) => item.id !== id)
        );
      };
    },

    getType(idx: number) {
      return (_: any, value: any) => {
        values.acceptedFiles[idx] = { ...values.acceptedFiles[idx] };
        setFieldValue("acceptedFiles", values.files);
      };
    },

    getFieldChange(id: number, key: "name" | "outDocNo" | "inDocNo") {
      return (e: React.FocusEvent) => {
        const value = e.currentTarget.textContent;

        const fileList = values.acceptedFiles.map((item: any) => {
          if (item.id === id) {
            return {
              ...item,
              [key]: value,
            };
          }
          return item;
        });

        setFieldValue("acceptedFiles", fileList);
      };
    },

    async uploadFile(id: number, event: HTMLInputElement) {
      const file = event.files;
      if (!file) {
        return;
      }

      const validFileType = await validateLettersFileType(
        FileService.getFileExtension(file[0]?.name)
      );

      if (!validFileType.isValid) {
        alert(validFileType.errorMessage);
        return;
      }

      const formData = new FormData();
      formData.append("file", file[0]);

      const lastDot = file[0].name.lastIndexOf(".");
      const name = file[0].name.slice(
        0,
        lastDot !== -1 ? lastDot : file[0].name.length
      );

      const newStateOfFile = {
        ...values.acceptedFiles[0],
        loading: true,
        name: name.slice(0, 60),
      };
      setFieldValue("acceptedFiles", [newStateOfFile]);

      await fileService.uploadFileV2(formData).then((e) => {
        let resp = e as { data: IEgovFile };
        const acceptedFiles = [...values.acceptedFiles];
        acceptedFiles[0] = {
          ...newStateOfFile,
          docId: resp.data.docId,
          id: resp.data.id,
          url: resp.data.url,
          loading: undefined,
        };
        let files = [...acceptedFiles];
        setFieldValue("acceptedFiles", files);
      });
    },
  };

  return (
    <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell width={520}>Файл</TableCell>
              <TableCell width={200}>Название </TableCell>
              <TableCell width={400}>Принял</TableCell>
              <TableCell width={200}>Исходящий номер</TableCell>
              <TableCell width={200}>Входящий номер</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {values.acceptedFiles &&
              values.acceptedFiles.map(
                (item: IEgovAcceptRequest["readyFile"], idx: number) => (
                  <TableRow key={`doc-${item.id}`}>
                    <TableCell
                      style={{ border: "solid 1px #E0E0E0" }}
                      sx={{ maxWidth: 400 }}
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
                          disabled={uploadDisable}
                          urlParser={(url) =>
                            getParamFromUrl(url, "fileName") || ""
                          }
                          change={handles.uploadFile}
                          download={(fileName: string) => {
                            downloadFile(fileName, true, item.url);
                          }}
                          item={item}
                          postfix="accepted"
                        />
                      </div>
                    </TableCell>

                    <TableCell
                      contentEditable
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={handles.getFieldChange(item.id, "name")}
                    >
                      {item.name}
                    </TableCell>

                    <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                      {item.acceptedBy || "Unknown"}
                    </TableCell>
                    <TableCell
                      contentEditable
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={handles.getFieldChange(
                        item.id,
                        "outDocNo"
                      )}
                    >
                      {item.outDocNo}
                    </TableCell>
                    <TableCell
                      contentEditable
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={handles.getFieldChange(item.id, "inDocNo")}
                    >
                      {item.inDocNo}
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
