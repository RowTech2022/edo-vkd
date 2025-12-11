import { Autocomplete, Card , FormGroup, TextField } from "@mui/material";
import { FC, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FormikProps } from "formik";
import { ProxyListInitialValuesType } from "../../helpers/schema";
import { useFetchListContractQuery } from "@services/contractsApi";
import { useLazyFetchInvoiceListQuery } from "@services/invoiceApi";

interface IMainInfo {
  canSave?: boolean;
  formik: FormikProps<ProxyListInitialValuesType>;
}

export const MainInfo: FC<IMainInfo> = ({ formik, canSave }) => {
  const { values, setFieldValue } = formik;
  const [invoice, setInvoice] = useState<Invoices.InvoiceListItem[]>();

  const docList = useFetchListContractQuery();
  const [getInvoice] = useLazyFetchInvoiceListQuery();

  const docShow = ({ id = null }: { id: number | null | undefined }) => {
    let dt = { contractIds: [id] };
    getInvoice(dt).then(({ data }) => {
      let newusers =
        data?.items.map((element) => {
          return {
            id: element.id,
            name: element.name,
          };
        }) || [];
      setInvoice(newusers);
    });
  };

  return (
    <Card title="Основная информация">
      <div className="tw-p-4">
        <FormGroup className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <Autocomplete
              id="contract"
              className="tw-col-span-2"
              fullWidth
              disablePortal
              options={docList.isSuccess ? docList.data.items : []}
              getOptionLabel={(option) => option.docNo as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField {...params} name="contract" label="Договор*" />
              )}
              value={values.contract}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("contract", value);
                setFieldValue("invoice", null);
                docShow({ id: value?.id });
              }}
            />

            <TextField
              placeholder="Поставщик*"
              className="tw-col-span-5"
              value={values.contract?.supplier?.info?.value}
              disabled
              size="small"
            />
            <TextField
              placeholder="Получатель*"
              className="tw-col-span-5"
              value={values.contract?.receiver?.info?.value}
              disabled
              size="small"
            />

            <Autocomplete
              disablePortal
              className="tw-col-span-2"
              options={invoice || []}
              getOptionLabel={(option) => option.name as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField {...params} name="position" label="Счет фактура*" />
              )}
              value={values.invoice}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("invoice", value);
              }}
            />

            <TextField
              placeholder="Резвизиты поставщика*"
              className="tw-col-span-5"
              value={values.contract?.supplier?.requisites}
              disabled
              size="small"
            />

            <TextField
              placeholder="Резвизиты получателя*"
              className="tw-col-span-5"
              value={values.contract?.receiver?.requisites}
              disabled
              size="small"
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
