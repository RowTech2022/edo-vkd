import { Autocomplete, Box, Card, FormGroup, TextField } from "@mui/material";
import { FC, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FormikProps } from "formik";
import { WaybillInitialValuesType } from "../../helpers/schema";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatDate, newDateFormat } from "@utils";
import { useLazyFetchProxyListQuery } from "@services/proxyApi";
import { useFetchListContractQuery } from "@services/contractsApi";

interface IAgreementDetails {
  canSave?: boolean;
  formik: FormikProps<WaybillInitialValuesType>;
}

export const AgreementDetails: FC<IAgreementDetails> = ({
  formik,
  canSave,
}) => {
  const { values, setFieldValue } = formik;

  const [proxyData, setProxyData] = useState<Proxies.ProxyListItem[]>();

  const [getProxy] = useLazyFetchProxyListQuery();
  const docList = useFetchListContractQuery();

  const docShow = ({ id = null }: { id: number | null | undefined }) => {
    let dt = { contractIds: [id] };
    getProxy(dt).then(({ data }) => {
      let newusers =
        data?.items.map((element) => {
          return {
            id: element.id,
            name: element.name,
          };
        }) || [];
      setProxyData(newusers);
    });
  };

  return (
    <Card title="Детали договора">
      <div className="tw-p-4">
        <FormGroup className="tw-mb">
          <div className="tw-grid tw-grid-cols-4 tw-gap-4">
            <TextField
              label="Номер*"
              disabled={!canSave}
              value={values.docNo}
              size="small"
              onChange={(event) => {
                setFieldValue("docNo", event.target.value);
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата*"
                inputFormat={newDateFormat}
                disabled={!canSave}
                value={values.date}
                onChange={(newValue) => {
                  setFieldValue("date", newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <Autocomplete
              id="contract"
              fullWidth
              disablePortal
              options={docList.isSuccess ? docList.data.items : []}
              getOptionLabel={(option) => option.docNo as string}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  № {option.docNo} от {formatDate(option.docDate)} на сумму{" "}
                  {option.summa}
                </Box>
              )}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField {...params} name="contract" label="Договор*" />
              )}
              value={values.contract}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("contract", value);
                setFieldValue("proxies", null);
                docShow({ id: value?.id });
              }}
            />

            <Autocomplete
              disablePortal
              options={proxyData || []}
              getOptionLabel={(option) => option.name as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField {...params} name="position" label="Довренность*" />
              )}
              value={values.proxies}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("proxies", value);
              }}
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
