import { FC, useState, ChangeEvent } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormGroup,
  TextField,
  Toolbar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Card, CustomTextField, ListIcon, Loading } from "@ui";
import "react-datepicker/dist/react-datepicker.css";

import { formatDate, INN_REGEXP, newDateFormat } from "@utils";
import {
  IInvoicesRequestTaxBody,
  IInvoicesRequestTaxSearch,
  useLazyFetchInvoicesTaxQuery,
} from "@services/invoiceApi";
import { FormikProps } from "formik";
import { InvoiceListInitialValuesType } from "../../helpers/schema";

interface IRegistries {
  formik: FormikProps<InvoiceListInitialValuesType>;
  canSave?: boolean;
}

export const Registries: FC<IRegistries> = ({ formik, canSave }) => {
  const [filters, setFilters] = useState<Nullable<IInvoicesRequestTaxSearch>>({
    requestType: 19,
    inn: null,
    date_start: null,
    date_end: null,
    direction: null,
  });
  const [items, setItems] = useState<Invoices.InvoiceTaxes[]>();

  const { values, setFieldValue } = formik;
  const [fetchInvoices, { isFetching }] = useLazyFetchInvoicesTaxQuery();

  const fetchData = async (args: Nullable<IInvoicesRequestTaxBody>) => {
    const { data } = await fetchInvoices({
      ...args,
    });
    setItems(data?.items);
  };

  const search = async () => {
    if (
      filters.date_end === null ||
      filters.date_start === null ||
      filters.inn === null ||
      filters.direction === null
    ) {
      alert("filter Data Cant be null"); //console.log('fetchData null')
    } else {
      fetchData({ filtres: filters });
    }
  };

  return (
    <Card title="Реестр счёт-фактур">
      <div className="tw-py-4">
        <div className="tw-pb-4">
          <Toolbar className="tw-bg-white tw-rounded-lg tw-border tw-gap-4 tw-py-4">
            <div className="tw-w-full tw-grid tw-grid-flow-col-dense tw-auto-cols-fr tw-gap-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="С"
                  value={filters.date_start}
                  inputFormat={newDateFormat}
                  onChange={(newValue) => {
                    setFilters({
                      ...filters,
                      date_start: formatDate(newValue || ""),
                    });
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="До"
                  value={filters.date_end}
                  inputFormat={newDateFormat}
                  onChange={(newValue) => {
                    setFilters({
                      ...filters,
                      date_end: formatDate(newValue || ""),
                    });
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </LocalizationProvider>

              <CustomTextField
                label="ИНН"
                size="small"
                regexp={INN_REGEXP}
                value={filters.inn}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setFilters({
                    ...filters,
                    inn: event.target.value,
                  });
                }}
              />
              <TextField
                label="Тип"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                size="small"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setFilters({
                    ...filters,
                    direction: Number(event.target.value),
                  });
                }}
              />

              <Button
                startIcon={
                  isFetching ? (
                    <Loading />
                  ) : (
                    <ListIcon
                      width="18px"
                      height="18px"
                      fill="currentColor"
                      stroke="none"
                    />
                  )
                }
                disabled={isFetching}
                onClick={search}
              >
                Список
              </Button>
            </div>
          </Toolbar>
          <div className="tw-p-4">
            <FormGroup className="tw-mb-4">
              <div className="tw-grid tw-grid-cols-1 tw-gap-4">
                <Autocomplete
                  id="invoiceTaxes"
                  fullWidth
                  disablePortal
                  options={(items as Invoices.InvoiceTaxes[]) ?? []}
                  getOptionLabel={(option) => option?.numberInvoice as any}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      №-{option?.numberSerial}
                      {"-"}
                      {option?.numberInvoice} {"-"}
                      {option?.dateInvoice} {"-"}
                      {option?.innSeler}
                      {"-"}
                      {option?.fullNameSeler}
                      {"-"}
                      {option?.innBuyer}
                      {"-"}
                      {option?.fullNameBuyer}
                      {"-"}
                    </Box>
                  )}
                  size="small"
                  noOptionsText="Нет данных"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="invoiceTaxes"
                      label="Счёт-фактура-налог*"
                    />
                  )}
                  value={values?.invoiceTaxes}
                  disabled={!canSave}
                  onChange={(event, value) => {
                    setFieldValue("invoiceTaxes", value);
                  }}
                />
              </div>
            </FormGroup>
            <FormGroup className="tw-mb-4">
              <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                <TextField
                  name="numberSerial"
                  label="Серия счет фактуры*"
                  value={values.invoiceTaxes?.numberSerial}
                  disabled={values.invoiceTaxes?.numberSerial ? false : true}
                  focused={values.invoiceTaxes?.numberSerial ? true : false}
                  size="small"
                />
                <TextField
                  name="numberSerial"
                  label="Номер счет фактуры*"
                  value={values.invoiceTaxes?.numberInvoice}
                  disabled={values.invoiceTaxes?.numberInvoice ? false : true}
                  focused={values.invoiceTaxes?.numberInvoice ? true : false}
                  size="small"
                />
                <TextField
                  name="dateInvoice"
                  label="Дата выставления счет фактуры*"
                  value={values.invoiceTaxes?.dateInvoice}
                  disabled={values.invoiceTaxes?.dateInvoice ? false : true}
                  focused={values.invoiceTaxes?.dateInvoice ? true : false}
                  size="small"
                />
                <CustomTextField
                  name="innSeler"
                  label="ИНН продавца*"
                  value={values.invoiceTaxes?.innSeler}
                  disabled={values.invoiceTaxes?.innSeler ? false : true}
                  focused={values.invoiceTaxes?.innSeler ? true : false}
                  size="small"
                  regexp={INN_REGEXP}
                />
                <TextField
                  name="fullNameSeler"
                  label="Полное наименование продавца*"
                  value={values.invoiceTaxes?.fullNameSeler}
                  disabled={values.invoiceTaxes?.fullNameSeler ? false : true}
                  focused={values.invoiceTaxes?.fullNameSeler ? true : false}
                  size="small"
                />
                <CustomTextField
                  name="innBuyer"
                  label="ИНН покупателя*"
                  value={values.invoiceTaxes?.innBuyer}
                  disabled={values.invoiceTaxes?.innBuyer ? false : true}
                  focused={values.invoiceTaxes?.innBuyer ? true : false}
                  size="small"
                  regexp={INN_REGEXP}
                />
                <TextField
                  name="fullNameBuyer"
                  label="Полное наименование покупателя*"
                  value={values.invoiceTaxes?.fullNameBuyer}
                  disabled={values.invoiceTaxes?.fullNameBuyer ? false : true}
                  focused={values.invoiceTaxes?.fullNameBuyer ? true : false}
                  size="small"
                />
                <TextField
                  name="codeProduct"
                  label="Код товара / услуги**"
                  value={values.invoiceTaxes?.detail?.codeProduct}
                  disabled={
                    values.invoiceTaxes?.detail?.codeProduct ? false : true
                  }
                  focused={
                    values.invoiceTaxes?.detail?.codeProduct ? true : false
                  }
                  size="small"
                />
                <TextField
                  name="nameProduct"
                  label="Название товара / услуги*"
                  value={values.invoiceTaxes?.detail?.nameProduct}
                  disabled={
                    values.invoiceTaxes?.detail?.nameProduct ? false : true
                  }
                  focused={
                    values.invoiceTaxes?.detail?.nameProduct ? true : false
                  }
                  size="small"
                />
                <TextField
                  name="qty"
                  label="Количество*"
                  value={values.invoiceTaxes?.detail?.qty}
                  disabled={values.invoiceTaxes?.detail?.qty ? false : true}
                  focused={values.invoiceTaxes?.detail?.qty ? true : false}
                  size="small"
                />
                <TextField
                  name="qty"
                  label="Единица измерения*"
                  value={values.invoiceTaxes?.detail?.measureType}
                  disabled={
                    values.invoiceTaxes?.detail?.measureType ? false : true
                  }
                  focused={
                    values.invoiceTaxes?.detail?.measureType ? true : false
                  }
                  size="small"
                />
                <TextField
                  name="freeAmount"
                  label="Освобожденная сумма*"
                  value={Number(values.invoiceTaxes?.detail?.freeAmount)}
                  disabled={
                    Number(values.invoiceTaxes?.detail?.freeAmount)
                      ? false
                      : true
                  }
                  focused={
                    Number(values.invoiceTaxes?.detail?.freeAmount)
                      ? true
                      : false
                  }
                  size="small"
                />
                <TextField
                  name="taxableAmount"
                  label="Налогооблагаемая сумма*"
                  value={values.invoiceTaxes?.detail?.taxableAmount}
                  disabled={
                    values.invoiceTaxes?.detail?.taxableAmount ? false : true
                  }
                  focused={
                    values.invoiceTaxes?.detail?.taxableAmount ? true : false
                  }
                  size="small"
                />
                <TextField
                  name="exciseTaxAmount"
                  label="Сумма акцизного налога*"
                  value={values.invoiceTaxes?.detail?.exciseTaxAmount}
                  disabled={
                    values.invoiceTaxes?.detail?.exciseTaxAmount ? false : true
                  }
                  focused={
                    values.invoiceTaxes?.detail?.exciseTaxAmount ? true : false
                  }
                  size="small"
                />
                <TextField
                  name="vatAmount"
                  label="Сумма НДС*"
                  value={values.invoiceTaxes?.detail?.vatAmount}
                  disabled={
                    values.invoiceTaxes?.detail?.vatAmount ? false : true
                  }
                  focused={
                    values.invoiceTaxes?.detail?.vatAmount ? true : false
                  }
                  size="small"
                />
                <TextField
                  name="vatPercent"
                  label="Ставка НДС*"
                  value={values.invoiceTaxes?.detail?.vatPercent}
                  disabled={
                    values.invoiceTaxes?.detail?.vatPercent ? false : true
                  }
                  focused={
                    values.invoiceTaxes?.detail?.vatPercent ? true : false
                  }
                  size="small"
                />
                <TextField
                  name="totalAmount"
                  label="Общая сумма**"
                  value={values.invoiceTaxes?.detail?.totalAmount}
                  disabled={
                    values.invoiceTaxes?.detail?.totalAmount ? false : true
                  }
                  focused={
                    values.invoiceTaxes?.detail?.totalAmount ? true : false
                  }
                  size="small"
                />
              </div>
            </FormGroup>
          </div>
        </div>
      </div>
    </Card>
  );
};
