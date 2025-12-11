import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC } from "react";
import { EgovFullFormikType } from "../helpers/schema";
import { validateLettersFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";
import { IEgovFile } from "@services/egov/application-resident/models/common";
import { useFetchEgovDocTypesQuery } from "@services/generalApi";
import fileService from "@services/fileService";
import { UploadCard } from "@ui";
import { getParamFromUrl , formatDate } from "@utils";
import { downloadFile } from "../helpers/downloadFile";

interface IEgovFilesForm {
  formik: EgovFullFormikType;
  emptyFiles?: boolean;
  uploadDisabled?: boolean;
}

export const EgovRequiredFilesForm: FC<IEgovFilesForm> = ({
  formik,
  emptyFiles,
  uploadDisabled,
}) => {
  const { values, setFieldValue } = formik;

  const { data: docTypes } = useFetchEgovDocTypesQuery();

  const handles = {
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

      const idx = values.files.findIndex((item: any) => item.fileId === id);
      if (idx === -1) return;
      const files = [...values.files];
      files[idx] = { ...files[idx], loading: true };
      setFieldValue("files", files);

      await fileService.uploadFileV2(formData).then((e) => {
        let resp = e as { data: IEgovFile };

        const idx = files.findIndex((item: any) => item.fileId === id);

        const urlParams = new URLSearchParams(resp.data.url);

        if (idx !== -1) {
          files[idx] = {
            ...files[idx],
            fileId: id,
            filePath: resp.data.url,
            loading: undefined,
            typeId: docTypes?.items[0],
          } as any;
          setFieldValue("files", files);
        }
      });
    },
  };

  const getType = (typeId: number) => {
    return docTypes?.items?.find((item) => item.id == typeId) || null;
  };

  return (
    <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
      <TableContainer>
        <Table sx={{ minWidth: 650, height: "100%" }} size="small">
          <TableHead>
            <TableRow>
              <TableCell width={720}>Название</TableCell>
              <TableCell width={400}>Тип документа</TableCell>
              <TableCell width={200}>Дата создания</TableCell>
              <TableCell width={200}>Создал</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {values.files &&
              values.files.map((item: any, idx: number) => {
                return (
                  <TableRow
                    key={`doc-${idx}`}
                    className={`${
                      emptyFiles && !item.filePath && "tw-bg-red-300"
                    }`}
                  >
                    <TableCell sx={{ maxWidth: 400 }}>
                      <div className="fileUploadButton tw-flex">
                        <UploadCard
                          disabled={uploadDisabled}
                          urlParser={(url) =>
                            getParamFromUrl(url, "fileName") || ""
                          }
                          change={handles.uploadFile}
                          download={(fileName: string) => {
                            downloadFile(fileName, true, item.filePath);
                          }}
                          item={{
                            id: item.fileId,
                            name: item.fileName,
                            url: item.filePath,
                            loading: item.loading,
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{item.fileName}</TableCell>
                    <TableCell>{formatDate(item.createAt)}</TableCell>
                    <TableCell>{item.createBy}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
