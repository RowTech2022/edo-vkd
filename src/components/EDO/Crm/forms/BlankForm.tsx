import {
  Autocomplete,
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
import { CustomButton, CustomTextField, UploadCard } from "@ui";
import { getBlankFileInitialData } from "../schema";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IFileResponce } from "@services/fileApi";
import { useSession, downloadFile } from "@hooks";
import fileService from "@services/fileService";
import {
  getParamFromUrl,
  formatDate,
  LANGUAGES,
  ORGANIZATION_DOC_TYPE,
} from "@utils";
import { IOrganizationCreate } from "@services/organizationsApi";
import { toast } from "react-toastify";

interface IBlankForm {
  formik: FormikProps<IOrganizationCreate>;
  emptyFileName: boolean;
}

export const BlankForm: FC<IBlankForm> = ({ formik, emptyFileName }) => {
  const { values, setFieldValue } = formik;
  const { data: session } = useSession();

  const addRow = () => {
    const files = values.files ?? [];
    const newRow = getBlankFileInitialData(
      session?.user?.displayName || "",
      files.length
    );

    setFieldValue("files", [...files, newRow]);
  };
  const handleDeleteRow = (idx: number) => {
    const files = values.files;
    const file = files.filter((_, index) => idx !== index);
    setFieldValue("files", file);
  };

  const handleUploadFile = async (idx: number, event: HTMLInputElement) => {

    const filesFormats = [
      ".doc",
      ".DOC",
      ".docx",
       ".DOCX",
      ".xls",
      ".xlsx",
      ".pdf",
      ".png",
      ".jpg",
      ".jpeg",
      ".JPG",
      ".PNG",
      ".JPEG",
    ];

    const file = event.files;
    if (!file) {
      return;
    }

    function ext(name: any) {
      return name.match(/\.([^.]+)$|$/)[1];
    }

    const isRightFormat = filesFormats.includes("." + ext(file[0].name));
    if (!isRightFormat) {
      toast("Вы не можете загрузить данный тип документа", {
        type: "error",
        position: "top-right",
      });
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

  const setDownloadFile = async (url: string) => {
    if (url === "") return;
    downloadFile(url, Math.random().toString(24));
  };

  return (
    <>
      <CustomButton
        onClick={(e) => {
          addRow();
        }}
      >
        Добавить документ
      </CustomButton>
      <TableContainer sx={{ overflow: "unset" }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell width={520}>Файл</TableCell>
              <TableCell width={200}>Название </TableCell>
              <TableCell width={400}>Язык</TableCell>
              <TableCell width={400}>Тип Документа</TableCell>
              <TableCell width={200}>Дата Создания</TableCell>
              <TableCell width={200}>Создал</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="closed__row">
            {values?.files &&
              values?.files?.map((item, idx) => (
                <TableRow
                  key={`doc-${idx}`}
                  className={`${
                    emptyFileName && !item.name ? "tw-bg-red-300" : ""
                  }`}
                >
                  <TableCell
                    sx={{ maxWidth: 300 }}
                    style={{ border: "solid 1px #E0E0E0" }}
                  >
                    <div className="fileUploadButton tw-flex">
                      <UploadCard
                        urlParser={(url) =>
                          getParamFromUrl(url, "fileName") || ""
                        }
                        change={handleUploadFile}
                        download={(url: any) => setDownloadFile(url)}
                        item={item}
                        accept={"*"}
                        postfix="blank"
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
                    {item?.name}
                  </TableCell>
                  <TableCell
                    contentEditable
                    suppressContentEditableWarning
                    style={{ border: "solid 1px #E0E0E0" }}
                  >
                    <Autocomplete
                      disablePortal
                      options={LANGUAGES}
                      getOptionLabel={(option) => option.name}
                      size="small"
                      renderInput={(params) => (
                        <CustomTextField params={params} />
                      )}
                      onChange={(_, value) => {
                        setFieldValue(`files.${idx}.language`, value?.id);
                      }}
                      value={
                        LANGUAGES.find((v) => v.id === item.language) || null
                      }
                    />
                    {/* {item?.description} */}
                  </TableCell>
                  <TableCell
                    contentEditable
                    suppressContentEditableWarning
                    style={{ border: "solid 1px #E0E0E0" }}
                  >
                    <Autocomplete
                      disablePortal
                      options={ORGANIZATION_DOC_TYPE}
                      getOptionLabel={(option) => option.name}
                      size="small"
                      renderInput={(params) => (
                        <CustomTextField params={params} />
                      )}
                      onChange={(_, value) => {
                        setFieldValue(`files.${idx}.docType`, value?.id);
                      }}
                      value={
                        ORGANIZATION_DOC_TYPE.find(
                          (v) => v.id === item.docType
                        ) || null
                      }
                    />
                    {/* {item?.description} */}
                  </TableCell>
                  <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                    {item?.createAt && formatDate(item?.createAt)}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "solid 1px #E0E0E0",
                      whiteSpace: "nowrap",
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    onBlurCapture={(e) => {
                      setFieldValue(
                        `files.${idx}.createBy`,
                        e?.currentTarget?.textContent
                      );
                    }}
                  >
                    {item?.createBy}
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
    </>
  );
};
