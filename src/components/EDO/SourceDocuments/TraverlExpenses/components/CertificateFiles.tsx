import {
  Autocomplete,
  Button,
  Card,
  TextField,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { FC, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { UploadCard } from "@ui";
import { formatDate } from "@utils";
import { IFileResponce } from "@services/contractsApi";
import {
  useFetchDownloadFilesMutation,
  useFetchUploadFilesMutation,
} from "@services/fileApi";
import { validateFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";
import { useFetchTravelDocTypeQuery } from "@services/generalApi";

interface ICertificateFiles {
  canSave: boolean;
  addTravelExpensesFile: TravelExpenses.ITravelFile[];
  setTravelExpensesFile: (list: TravelExpenses.ITravelFile[]) => void;
  addRow: () => void;
}

export const CertificateFiles: FC<ICertificateFiles> = ({
  canSave,
  addTravelExpensesFile,
  addRow,
  setTravelExpensesFile,
}) => {
  const [uploadFile] = useFetchUploadFilesMutation();
  const [uploadFormError, setUploadFormError] = useState<string>("");
  const travelDoctypesQuery = useFetchTravelDocTypeQuery();

  const [downloadMedia] = useFetchDownloadFilesMutation();

  const downloadFile = (res: any) => {
    const { file64, fileName } = res.data || {};
    const a = document.createElement("a");
    a.href = `data:application/pdf;base64,${file64}`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const SetDownloadFile = async (fileName: string) => {
    if (fileName === "") return;
    await downloadMedia({ data: { fileName: fileName, type: 9 } }).then(
      (res) => {
        downloadFile(res);
      }
    );
  };

  const handleUploadFile = async (id: number, event: HTMLInputElement) => {
    const file = event.files;
    if (!file) {
      return;
    }

    const validFileType = await validateFileType(
      FileService.getFileExtension(file[0]?.name)
    );

    if (!validFileType.isValid) {
      setUploadFormError(validFileType.errorMessage);
      alert(validFileType.errorMessage);
      return;
    }
    let updatedList = addTravelExpensesFile.map((el) =>
      el.id === Number(id) ? { ...el, loading: true } : el
    );
    setTravelExpensesFile(updatedList);

    const formData = new FormData();
    formData.append(id.toString(), file[0]);

    await uploadFile({ data: formData }).then((e) => {
      let resp = e as { data: IFileResponce };
      let updatedList = addTravelExpensesFile.map((el) =>
        el.id === Number(id) ? { ...el, url: resp.data.url as string } : el
      );
      setTravelExpensesFile(updatedList);
    });
  };

  const handleDeleteRow = (id: number) => {
    const changedData = addTravelExpensesFile.filter((item) => item.id !== id);
    setTravelExpensesFile(changedData);
  };

  return (
    <Card title="Файли приложения к удостоверению">
      <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
        <Button
          onClick={(e) => {
            addRow();
          }}
        >
          Добавить документ
        </Button>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell width={520}>Файл</TableCell>
                <TableCell width={200}>Название </TableCell>
                <TableCell width={400}>Описание</TableCell>
                <TableCell width={400}>Тип документа</TableCell>
                <TableCell width={200}>Дата Создания</TableCell>
                <TableCell width={200}>Создал</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addTravelExpensesFile &&
                addTravelExpensesFile.map((item: any) => (
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
                          change={handleUploadFile}
                          download={SetDownloadFile}
                          item={item}
                        />
                      </div>
                    </TableCell>

                    <TableCell
                      contentEditable
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={(e) => {
                        let updatedListText = addTravelExpensesFile.map((el) =>
                          el.id === item.id
                            ? {
                                ...el,
                                name: e.currentTarget.textContent,
                              }
                            : el
                        );
                        setTravelExpensesFile(updatedListText);
                      }}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell
                      contentEditable
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={(e) => {
                        let updatedListText = addTravelExpensesFile.map((el) =>
                          el.id === item.id
                            ? {
                                ...el,
                                description: e.currentTarget.textContent,
                              }
                            : el
                        );
                        setTravelExpensesFile(updatedListText);
                      }}
                    >
                      {item.description}
                    </TableCell>
                    <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                      {/* {item.typeDocument.value} */}
                      <Autocomplete
                        disablePortal
                        options={
                          travelDoctypesQuery.isSuccess
                            ? travelDoctypesQuery.data.items
                            : []
                        }
                        getOptionLabel={(option) => option.value as string}
                        size="small"
                        noOptionsText="Нет данных"
                        renderInput={(params) => (
                          <TextField {...params} name="typeDocument" />
                        )}
                        value={item.typeDocument as any}
                        disabled={!canSave}
                        onChange={(e, value) => {
                          let updatedListText = addTravelExpensesFile.map(
                            (el) =>
                              el.id === item.id
                                ? {
                                    ...el,
                                    typeDocument: value,
                                  }
                                : el
                          );
                          setTravelExpensesFile(updatedListText);
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                      {item?.createDate && formatDate(item?.createDate)}
                    </TableCell>
                    <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                      {item.createBy}
                    </TableCell>
                    <div className="tw-text-center tw-flex tw-justify-end tw-items-center">
                      {item.id > 0 && (
                        <IconButton onClick={() => handleDeleteRow(item.id)}>
                          <DeleteOutlineIcon style={{ color: "red" }} />
                        </IconButton>
                      )}
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
