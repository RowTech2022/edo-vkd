import { Card ,
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
import { UploadCard , CustomButton } from "@ui";
import { formatDate } from "@utils";
import { IFileResponce } from "@services/contractsApi";
import {
  useFetchDownloadFilesMutation,
  useFetchUploadFilesMutation,
} from "@services/fileApi";
import { validateFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";

interface IAgreementFiles {
  addContractFile: Contracts.ContactFile[];
  setAddContractFile: (list: Contracts.ContactFile[]) => void;
  addRow: () => void;
}

export const AgreementFiles: FC<IAgreementFiles> = ({
  addContractFile,
  addRow,
  setAddContractFile,
}) => {
  const [uploadFile] = useFetchUploadFilesMutation();
  const [uploadFormError, setUploadFormError] = useState<string>("");

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
    await downloadMedia({ data: { fileName: fileName, type: 5 } }).then(
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

    let updatedList = addContractFile.map((el) =>
      el.id === Number(id) ? { ...el, loading: true } : el
    );
    setAddContractFile(updatedList);

    const formData = new FormData();
    formData.append(id.toString(), file[0]);

    await uploadFile({ data: formData }).then((e) => {
      let resp = e as { data: IFileResponce };
      let updatedList = addContractFile.map((el) =>
        el.id === Number(id) ? { ...el, url: resp.data.url as string } : el
      );
      setAddContractFile(updatedList);
    });
  };

  const handleDeleteRow = (id: number) => {
    const changedData = addContractFile.filter((item) => item.id !== id);
    setAddContractFile(changedData);
  };

  return (
    <Card title="Файлы приложения к договору">
      <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
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
              {addContractFile &&
                addContractFile.map((item) => (
                  <TableRow key={`doc-${item.id}`}>
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
                          change={handleUploadFile}
                          download={SetDownloadFile}
                          item={item}
                        />
                      </div>
                    </TableCell>

                    <TableCell
                      contentEditable="true"
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={(e) => {
                        let updatedListText = addContractFile.map((el) =>
                          el.id === item.id
                            ? {
                                ...el,
                                name: e.currentTarget.textContent,
                              }
                            : el
                        );
                        setAddContractFile(updatedListText);
                      }}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell
                      contentEditable
                      suppressContentEditableWarning
                      style={{ border: "solid 1px #E0E0E0" }}
                      onBlurCapture={(e) => {
                        let updatedListText = addContractFile.map((el) =>
                          el.id === item.id
                            ? {
                                ...el,
                                desc: e.currentTarget.textContent,
                              }
                            : el
                        );
                        setAddContractFile(updatedListText);
                      }}
                    >
                      {item.desc}
                    </TableCell>
                    <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                      {item?.createAt && formatDate(item?.createAt)}
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
