import { Autocomplete, Box, Checkbox, FormControlLabel } from "@mui/material";
import { CustomButton, CustomTextField } from "@ui";
import { Formik } from "formik";
import { ChangeEvent, FC, useMemo } from "react";
import { useCreateRequestMutation } from "@services/applicationsApi";
import { useFetchOrganisationsQuery } from "@services/userprofileApi";
import { validationSchema } from "./schema";
import { getFieldConfigs } from "./utils";
import { toast } from "react-toastify";
import {
  INN_REGEXP,
  ONLY_ALPHABETICAL,
  ONLY_NUMERIC,
  PHONE_REGEXP,
} from "@utils";

const initialValues: any = {
  docDate: new Date().toISOString(),
  organisation: null,
  fio: "",
  inn: "",
  serialNumber: "",
  hasToken: false,
  tokenNumber: "",
  phone: "",
  email: "",
  prikazUrl: "",
  passportUrl: "",
};

interface IRequestCreate {
  onClose: () => void;
}

export const RequestCreate: FC<IRequestCreate> = ({ onClose }) => {
  const { data: orgs } = useFetchOrganisationsQuery();
  const [createRequest] = useCreateRequestMutation();

  const orgList = useMemo(
    () =>
      orgs?.items.map((item: any) => ({
        id: item.id,
        label: item.displayName as string,
      })),
    [orgs]
  );

  return (
    <div>
      <h2
        style={{
          padding: "20px",
          backgroundColor: "#607D8B",
          color: "white",
        }}
      >
        Создание заявки
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const { id, label } = values.organisation || {};
          const data = {
            ...values,
            organisation: { id: String(id), value: label },
          };
          onClose();

          const toastId = toast.loading("Заявка создается");

          createRequest(data).then((res: any) => {
            if (!res?.error) {
              toast.update(toastId, {
                render: "Заявка успешна создано",
                type: "success",
                isLoading: false,
              });
            } else {
              toast.dismiss(toastId);
            }
          });
        }}
      >
        {(formik) => {
          return (
            <>
              <Box
                display="grid"
                style={{
                  gridTemplateColumns: "repeat(2, minmax(300px, 1fr))",
                  padding: "25px 20px",
                  gap: "15px",
                }}
              >
                <Autocomplete<{ label: string; id: string }>
                  size="small"
                  disablePortal
                  value={formik.values.organisation}
                  id="combo-box-demo"
                  options={orgList || []}
                  onChange={(e: any, value) => {
                    formik.setFieldValue("organisation", value);
                  }}
                  sx={{ width: 300, marginBottom: "16px" }}
                  renderInput={(params) => (
                    <CustomTextField params={params} label="Исполнитель" />
                  )}
                />
                <CustomTextField
                  size="small"
                  value={formik.values.inn}
                  onChange={(event) =>
                    formik.setFieldValue("inn", event.target.value)
                  }
                  id="outlined-basic"
                  label="ИНН"
                  variant="outlined"
                  regexp={INN_REGEXP}
                  {...getFieldConfigs(formik, "inn")}
                />
                <CustomTextField
                  size="small"
                  value={formik.values.fio}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    formik.setFieldValue("fio", event.target.value)
                  }
                  id="outlined-basic"
                  label="ФИО"
                  variant="outlined"
                  regexp={ONLY_ALPHABETICAL}
                  {...getFieldConfigs(formik, "fio")}
                />
                <CustomTextField
                  size="small"
                  value={formik.values.serialNumber}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    formik.setFieldValue("serialNumber", event.target.value)
                  }
                  id="outlined-basic"
                  label="Номер сертификата"
                  variant="outlined"
                  {...getFieldConfigs(formik, "serialNumber")}
                />
                <Box display="flex" columnGap="15px">
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Имеется токен"
                    checked={formik.values.hasToken}
                    onChange={(event, checked) =>
                      formik.setFieldValue("hasToken", checked)
                    }
                    {...getFieldConfigs(formik, "hasToken")}
                  />
                  <CustomTextField
                    size="small"
                    disabled={!formik.values.hasToken}
                    value={formik.values.tokenNumber}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      formik.setFieldValue("tokenNumber", event.target.value)
                    }
                    id="outlined-basic"
                    label="Номер токена"
                    variant="outlined"
                    regexp={ONLY_NUMERIC}
                    {...getFieldConfigs(formik, "tokenNumber")}
                  />
                </Box>
                <CustomTextField
                  size="small"
                  value={formik.values.phone}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    if (formik.values.phone && formik.values.phone.length >= 9)
                      return;
                    formik.setFieldValue("phone", event.target.value);
                  }}
                  id="outlined-basic"
                  label="Тел"
                  variant="outlined"
                  regexp={PHONE_REGEXP}
                  {...getFieldConfigs(formik, "phone")}
                />
                <CustomTextField
                  size="small"
                  value={formik.values.email}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    formik.setFieldValue("email", event.target.value)
                  }
                  id="outlined-basic"
                  label="Почта"
                  variant="outlined"
                  {...getFieldConfigs(formik, "email")}
                />
                <CustomTextField
                  size="small"
                  value={formik.values.prikazUrl}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    formik.setFieldValue("prikazUrl", event.target.value)
                  }
                  id="outlined-basic"
                  label="Ссылка на приказ"
                  variant="outlined"
                  {...getFieldConfigs(formik, "prikazUrl")}
                />
                <CustomTextField
                  size="small"
                  value={formik.values.passportUrl}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    formik.setFieldValue("passportUrl", event.target.value)
                  }
                  id="outlined-basic"
                  label="Ссылка на паспорт"
                  variant="outlined"
                  {...getFieldConfigs(formik, "passportUrl")}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="end"
                padding="0 20px 15px 20px"
              >
                <CustomButton
                  type="button"
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={() => formik.submitForm()}
                  sx={{ fontWeight: 600, minWidth: "180px", minHeight: "48px" }}
                >
                  Создать
                </CustomButton>
              </Box>
            </>
          );
        }}
      </Formik>
    </div>
  );
};
