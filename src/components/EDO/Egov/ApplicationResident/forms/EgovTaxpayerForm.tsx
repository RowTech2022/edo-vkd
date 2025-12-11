import { FC, useEffect } from "react";
import { Autocomplete, FormGroup, TextField } from "@mui/material";

import { EgovFormikType } from "../helpers/schema";
import {
  useFetchCitiesQuery,
  useFetchEgovInnListQuery,
} from "@services/generalApi";

interface IEgovTaxpayerForm {
  formik: EgovFormikType;
  disabled?: boolean;
}

export const EgovTaxpayerForm: FC<IEgovTaxpayerForm> = ({
  formik,
  disabled,
}) => {
  const { values, setFieldValue, handleChange } = formik;
  const { data: cities } = useFetchCitiesQuery();
  const { data: innList, refetch } = useFetchEgovInnListQuery();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="tw-p-4 tw-pb-0">
      <FormGroup className="tw-mb-4">
        <div className="tw-grid tw-grid-cols-3 tw-gap-4">
          <Autocomplete
            disabled={disabled}
            disablePortal
            options={innList?.items || []}
            size="small"
            getOptionLabel={(option) => option.id as string}
            value={values.inn}
            onChange={(event, value) => {
              setFieldValue("inn", value);
              setFieldValue("nameOfTaxpayer", value?.value || "");
            }}
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value.id
            }
            renderInput={(params) => (
              <TextField {...params} label="ИНН" name="inn" required />
            )}
          />
          <TextField
            disabled
            name="nameOfTaxpayer"
            label="Налогоплательщик"
            className="tw-col-span-2"
            value={values.nameOfTaxpayer}
            size="small"
            onChange={handleChange}
            required
          />
          <TextField
            disabled={disabled}
            name="address"
            label="Адрес"
            className="tw-col-span-2"
            value={values.address}
            size="small"
            onChange={handleChange}
            required
          />
          <Autocomplete
            disabled={disabled}
            disablePortal
            options={cities?.items || []}
            size="small"
            getOptionLabel={(option) => option.value as string}
            value={values.city}
            onChange={(event, value) => {
              setFieldValue("city", value);
            }}
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value.id
            }
            renderInput={(params) => (
              <TextField {...params} label="Город" name="city" required />
            )}
          />
          <TextField
            disabled={disabled}
            name="phone"
            label="Телефон"
            value={values.phone}
            size="small"
            onChange={handleChange}
            required
          />
          <TextField
            disabled={disabled}
            name="email"
            label="Электронная почта"
            value={values.email}
            size="small"
            onChange={handleChange}
            required
          />

          <TextField
            disabled={disabled}
            name="acc"
            label="Банковский счет"
            value={values.acc}
            size="small"
            onChange={handleChange}
            required
          />
          <TextField
            disabled={disabled}
            name="bankName"
            label="Наименование банка"
            value={values.bankName}
            size="small"
            onChange={handleChange}
            required
          />
        </div>
      </FormGroup>
    </div>
  );
};
