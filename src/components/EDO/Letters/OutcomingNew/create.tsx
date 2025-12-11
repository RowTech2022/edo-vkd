import { useState } from "react";
import { useSession } from "@hooks";
import {
  Autocomplete,
  Button,
  FormGroup,
  TextField,
  Stack,
} from "@mui/material";
import ReactQuill from "react-quill";
import { useFormik } from "formik";
import { AngleDoubleLeftIcon, Card, DiskIcon , UploadCard } from "@ui";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import {
  IInternalIncomingLettersMainDTO,
  UploadFileLetters,
  useSendInternalLetterMutation,
} from "@services/internal/incomingApi";

import {
  useFetchContragentQuery,
  useFetchResolutionPersonListQuery,
} from "@services/generalApi";

import { useFetchUploadFilesMutation } from "@services/fileApi";
import { validateLettersFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";
import { ValueId } from "@services/api";
import FoldersPanel1 from "../File";

type Props = {
  new?: boolean;
  entry?: IInternalIncomingLettersMainDTO;
};

const docType = 13; // enum for document and for creating folder for file.

const OutcomingNewCreate = (props: Props) => {
  const navigate = useNavigate();

  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>(
    props?.entry?.files || []
  );

  const [uploadFile] = useFetchUploadFilesMutation();

  const [uploadFormError, setUploadFormError] = useState<string>("");

  const handleUploadFile = async (id: string, event: HTMLInputElement) => {
    const file = event.files;
    if (!file) {
      return;
    }

    const validFileType = await validateLettersFileType(
      FileService.getFileExtension(file[0]?.name)
    );

    if (!validFileType.isValid) {
      setUploadFormError(validFileType.errorMessage);
      alert(validFileType.errorMessage);
      return;
    }

    const formData = new FormData();
    formData.append("file", file[0]);

    await uploadFile({ data: formData }).then((e) => {
      let resp = e as { data: UploadFileLetters };
      let files = addLettersFile.concat(resp.data).reverse();
      setAddLettersFile(files);
    });
  };

  const { data: session } = useSession();

  const m_from = {
    id: session?.user?.id?.toString(),
    value: session?.user?.displayName,
  };

  const contragents = useFetchContragentQuery({});

  const person = useFetchResolutionPersonListQuery();
  const latterType = [
    { id: 1, name: "Внешний" },
    { id: 2, name: "Внутренный" },
  ];

  const modules = {
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

  const [sendLetter] = useSendInternalLetterMutation();
  const [showContactInfo, setShowContactInfo] = useState<boolean>(
    !(props?.entry?.type === 2)
  );
  const handleSave = (values: typeof INITIAL_VALUES) => {
    values.files = addLettersFile;
    toast.promise(
      async () => {
        const res = await sendLetter(values);
        if ("data" in res) {
          navigate(`/modules/latters/outcomingNew/show/${res.data}`);
        }
      },
      {
        pending: "Письмо отправляется",
        success: "Письмо отправлено",
        error: "Произошла ошибка",
      }
    );
  };

  const handleUpdate = (values: typeof INITIAL_VALUES) => {
    if (props.entry) {
    }
  };

  const INITIAL_VALUES: Pick<
    Nullable<IInternalIncomingLettersMainDTO>,
    | "from"
    | "to"
    | "type"
    | "subject"
    | "body"
    | "contragent"
    | "contact"
    | "files"
  > = {
    from: m_from,
    to: null,
    type: 1,
    subject: "",
    body: "",
    contragent: null,
    contact: "",
    files: addLettersFile,
  };

  const { values, handleSubmit, setFieldValue } = useFormik({
    initialValues: props.new
      ? INITIAL_VALUES
      : ({
          from: m_from,
          to: props.entry?.to,
          type: props.entry?.type,
          subject: props.entry?.subject,
          body: props.entry?.body,
          contragent: props.entry?.contragent,
          contact: props.entry?.contact,
          files: addLettersFile,
        } as typeof INITIAL_VALUES),

    onSubmit: (values) => {
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
      }
    },
  });

  return (
    <>
      <form className="tw-flex tw-flex-col tw-gap-4" onSubmit={handleSubmit}>
        <Card title="Письмо">
          <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
            <Button
              startIcon={
                <AngleDoubleLeftIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={() => navigate(-1)}
            >
              Назад
            </Button>
            <Button
              type="submit"
              disabled={!props.new}
              startIcon={
                <DiskIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
            >
              Отправить
            </Button>
          </div>
          <FormGroup>
            <div className="tw-grid tw-grid-cols-6 tw-gap-2">
              <div>От</div>

              <Autocomplete
                disablePortal
                className="tw-col-span-5"
                options={person.isSuccess ? person.data.items : []}
                size="small"
                getOptionLabel={(option) => option.value as string}
                value={m_from as ValueId}
                disabled={true}
                renderInput={(params) => (
                  <TextField {...params} label="От кого" name="result" />
                )}
              />
            </div>
            <br />
            <div className="tw-grid tw-grid-cols-6 tw-gap-2">
              <div>Кому</div>

              <Autocomplete
                disablePortal
                className="tw-col-span-4"
                disabled={!props.new}
                options={person.isSuccess ? person.data.items : []}
                size="small"
                getOptionLabel={(option) => option.value as string}
                value={values.to as ValueId}
                onChange={(event, value) => {
                  setFieldValue("to", {
                    id: value?.id?.toString(),
                    value: value?.value,
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Кому" name="result" />
                )}
              />
              <Autocomplete
                disablePortal
                disabled={!props.new}
                options={latterType}
                value={latterType.find((x) => x.id == values.type)}
                getOptionLabel={(option) => option.name}
                size="small"
                renderInput={(params) => <TextField {...params} label="Тип" />}
                onChange={(event, value) => {
                  setShowContactInfo(!(value?.id === 2));
                  setFieldValue("type", value?.id);
                }}
              />
            </div>
          </FormGroup>
        </Card>
        <Card title="Основная информация" hidden={!showContactInfo}>
          <div className="tw-p-1">
            <FormGroup className="tw-mb-1">
              <div className="tw-grid tw-grid-cols-5 tw-gap-2">
                <Autocomplete
                  disablePortal
                  disabled={!props.new}
                  className="tw-col-span-2"
                  options={contragents.isSuccess ? contragents.data.items : []}
                  size="small"
                  getOptionLabel={(option) => option.value as string}
                  value={values.contragent as ValueId}
                  onChange={(event, value) => {
                    setFieldValue("contragent", {
                      id: value?.id?.toString(),
                      value: value?.value,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Контрагент" name="result" />
                  )}
                />

                <TextField
                  name="contact"
                  disabled={!props.new}
                  label="Контакт"
                  value={values.contact}
                  size="small"
                  onChange={(event) => {
                    setFieldValue("contact", event.target.value);
                  }}
                  required={showContactInfo}
                />
              </div>
            </FormGroup>
          </div>
        </Card>
        <Card title="Прикреплённые файлы" hidden={false}>
          <div>
            <UploadCard change={handleUploadFile} item={values.files as any} />
            <Stack className="tw-mb-4" spacing={2}>
              {values?.files && (
                <FoldersPanel1 items={addLettersFile as any} type={docType} />
              )}
            </Stack>
          </div>
        </Card>
        <Card title="Комментарии">
          <div className="tw-grid tw-p-1 tw-gap-1">
            <TextField
              label="Заголовок"
              disabled={!props.new}
              value={values.subject}
              size="small"
              onChange={(event) => {
                setFieldValue("subject", event.target.value);
              }}
              required
            />

            <ReactQuill
              value={values?.body as string}
              readOnly={!props.new}
              modules={modules}
              onChange={(e) => {
                setFieldValue("body", e);
              }}
              theme="snow"
            />
          </div>
        </Card>
      </form>
    </>
  );
};

export default OutcomingNewCreate;
