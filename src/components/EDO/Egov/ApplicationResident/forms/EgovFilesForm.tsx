import {
  Autocomplete,
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
  TextField,
} from "@mui/material";
import { FC } from "react";
import { EgovFormikType } from "../helpers/schema";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { validateLettersFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";
import { IEgovFile } from "@services/egov/application-resident/models/common";
import { useFetchEgovDocTypesQuery } from "@services/generalApi";
import fileService from "@services/fileService";
import { UploadCard } from "@ui";
import { getParamFromUrl, formatDate } from "@utils";
import { downloadFile } from "../helpers/downloadFile";

interface IEgovFilesForm {
  formik: EgovFormikType;
  uploadDisabled?: boolean;
}

export const EgovFilesForm: FC<IEgovFilesForm> = ({
  formik,
  uploadDisabled,
}) => {
  const { values, setFieldValue } = formik;
  const { data: docTypes } = useFetchEgovDocTypesQuery();

  const handles = {
    add() {
      let newRow: any = {
        id: +values.files.length + 1,
        url: "",
        name: "",
        description: "",
        docType: {
          id: "1",
          value: "",
        },
        createDate: null,
        createBy: "",
      };

      setFieldValue("files", [...values.files, newRow]);
    },

    getDelete(id: number) {
      return () => {
        setFieldValue(
          "files",
          values.files.filter((item: any) => item.id !== id)
        );
      };
    },

    getType(idx: number) {
      return (_: any, value: any) => {
        const files = [...values.files];
        files[idx] = { ...files[idx] };
        files[idx].docType = value;
        setFieldValue("files", files);
      };
    },

    getNameChange(id: number) {
      return (e: React.FocusEvent) => {
        const newName = e.currentTarget.textContent;

        const fileList = values.files.map((item: any) => {
          if (item.id === id) {
            return {
              ...item,
              name: newName,
            };
          }
          return item;
        });

        setFieldValue("files", fileList);
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

      const idx = values.files.findIndex((item) => item.id === id);
      const lastDot = file[0].name.lastIndexOf(".");
      const name = file[0].name.slice(
        0,
        lastDot !== -1 ? lastDot : file[0].name.length
      );
      if (idx === -1) return;
      const files = [...values.files];
      files[idx] = { ...files[idx], loading: true, name: name.slice(0, 60) };
      setFieldValue("files", files);

      await fileService.uploadFileV2(formData).then((e) => {
        let resp = e as { data: IEgovFile };

        const idx = files.findIndex((item) => item.id === id);

        if (idx !== -1) {
          files[idx] = {
            ...files[idx],
            ...resp.data,
            loading: undefined,
            typeId: docTypes?.items[0],
          } as any;
          setFieldValue("files", files);
        }
      });
    },
  };

  const getType = (typeId: string) => {
    return docTypes?.items.find((item) => item.id == typeId) || null;
  };

  return (
    <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
      <Button disabled={uploadDisabled} onClick={handles.add}>
        Добавить документ
      </Button>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell width={520}>Файл</TableCell>
              <TableCell width={200}>Название </TableCell>
              <TableCell width={400}>Тип документа</TableCell>
              <TableCell width={200}>Дата Создания</TableCell>
              <TableCell width={200}>Создал</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {values.files &&
              values.files.map((item: any, idx: number) => {
                return (
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
                          disabled={uploadDisabled}
                          urlParser={(url) =>
                            getParamFromUrl(url, "fileName") || ""
                          }
                          change={handles.uploadFile}
                          download={(fileName: string) => {
                            downloadFile(fileName, true, item.url);
                          }}
                          item={item}
                        />
                      </div>
                    </TableCell>

                    <TableCell
                      contentEditable
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={handles.getNameChange(item.id)}
                    >
                      {item.name}
                    </TableCell>

                    <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                      <Autocomplete
                        disablePortal
                        options={docTypes?.items || []}
                        getOptionLabel={(option) => option.value as string}
                        size="small"
                        noOptionsText="Нет данных"
                        isOptionEqualToValue={(option, value) =>
                          option.id == value.id
                        }
                        renderInput={(params) => (
                          <TextField {...params} name="docType" />
                        )}
                        value={item.docType}
                        onChange={handles.getType(idx)}
                      />
                    </TableCell>
                    <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                      {formatDate(item.createDate)}
                    </TableCell>
                    <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                      {item.createBy}
                    </TableCell>
                    <div className="tw-text-center tw-flex tw-justify-end tw-items-center">
                      {item.id > -1 && (
                        <IconButton onClick={handles.getDelete(item.id)}>
                          <DeleteOutlineIcon style={{ color: "red" }} />
                        </IconButton>
                      )}
                    </div>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
