import { FC } from "react";
import { Card, PencilIcon } from "@ui";

import { FormikProps } from "node_modules/formik/dist";
import {
  Autocomplete,
  FormGroup,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { useFetchUserPositionsQuery } from "@services/generalApi";
import { SignType } from "../helpers/constants";

interface IProps {
  formik: FormikProps<any>;
  canSave?: boolean;
  create?: boolean;
  buttonSettings: TFMIS.AccessApplication["transitions"]["buttonSettings"];
  handleSignSignatureBody: (props: SignType) => void;
}

export const UsersInfoForm: FC<IProps> = ({
  formik,
  canSave,
  buttonSettings,
  create,
  handleSignSignatureBody,
}) => {
  const userPositionsQuery = useFetchUserPositionsQuery();

  const { values, setFieldValue, handleChange } = formik;

  return (
    <Card title="Информация пользователей">
      <div className="tw-flex tw-gap-6 tw-px-4 tw-py-6 tw-flex-wrap">
        <FormGroup className="tw-gap-4 tw-flex-auto">
          <TextField
            name="userInfo.first_Fio"
            label="ФИО (полностью, согласно паспорту)*"
            size="small"
            value={values.userInfo?.first_Fio}
            disabled={!canSave}
            onChange={handleChange}
          />
          <Autocomplete
            disablePortal
            options={
              userPositionsQuery.isSuccess ? userPositionsQuery.data.items : []
            }
            getOptionLabel={(option) => option.value as string}
            size="small"
            noOptionsText="Нет данных"
            renderInput={(params) => (
              <TextField
                {...params}
                name="userInfo.first_Position"
                label="Должность*"
              />
            )}
            value={values.userInfo?.first_Position}
            disabled={!canSave}
            onChange={(event, value) => {
              setFieldValue("userInfo.first_Position", value);
            }}
          />

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              name="userInfo.first_Inn"
              label="ИНН*"
              size="small"
              value={values.userInfo?.first_Inn}
              disabled={!canSave}
              onChange={handleChange}
            />
            <TextField
              name="userInfo.first_Phone"
              label="Моб. номер*"
              onInput={(e) => {
                (e.target as HTMLInputElement).value = (
                  e.target as HTMLInputElement
                ).value.replace(/[^0-9]/g, "");
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+992</InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 9 }}
              size="small"
              error={
                values.userInfo?.first_Phone !== null &&
                (values.userInfo?.first_Phone?.length || 0) < 9
                  ? true
                  : false
              }
              helperText={
                values.userInfo?.first_Phone !== null &&
                (values.userInfo?.first_Phone?.length || 0) < 9
                  ? "Мин 9 символов"
                  : ""
              }
              value={values.userInfo?.first_Phone}
              disabled={!canSave}
              onChange={handleChange}
            />
          </div>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              name="userInfo.first_Email"
              label="E-mail*"
              size="small"
              error={
                values.userInfo?.first_Email !== null &&
                !values.userInfo?.first_Email.includes("@")
                  ? true
                  : false
              }
              helperText={
                values.userInfo?.first_Email !== null &&
                !values.userInfo?.first_Email.includes("@")
                  ? 'Поле ввода обязательно и требует символ "@"'
                  : ""
              }
              value={values.userInfo?.first_Email}
              disabled={!canSave}
              onChange={handleChange}
            />
            <Button
              disabled={create || buttonSettings.btn_signBukh.readOnly}
              startIcon={
                <PencilIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={(el) => {
                handleSignSignatureBody(SignType.Bukhgalter);
              }}
            >
              Подписать
            </Button>
          </div>
        </FormGroup>
        <FormGroup className="tw-gap-4 tw-flex-auto">
          <TextField
            name="userInfo.second_Fio"
            label="ФИО (полностью, согласно паспорту)*"
            size="small"
            value={values.userInfo?.second_Fio}
            disabled={!canSave}
            onChange={handleChange}
          />
          <Autocomplete
            disablePortal
            options={
              userPositionsQuery.isSuccess ? userPositionsQuery.data.items : []
            }
            getOptionLabel={(option) => option.value as string}
            size="small"
            noOptionsText="Нет данных"
            renderInput={(params) => (
              <TextField
                {...params}
                name="userInfo.second_Position"
                label="Должность*"
              />
            )}
            value={values.userInfo?.second_Position}
            disabled={!canSave}
            onChange={(event, value) => {
              setFieldValue("userInfo.second_Position", value);
            }}
          />
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              name="userInfo.second_Inn"
              label="ИНН*"
              size="small"
              value={values.userInfo?.second_Inn}
              disabled={!canSave}
              onChange={handleChange}
            />
            <TextField
              name="userInfo.second_Phone"
              label="Моб. номер*"
              onInput={(e) => {
                (e.target as HTMLInputElement).value = (
                  e.target as HTMLInputElement
                ).value.replace(/[^0-9]/g, "");
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+992</InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 9 }}
              size="small"
              error={
                values.userInfo?.second_Phone !== null &&
                (values.userInfo?.second_Phone?.length || 0) < 9
                  ? true
                  : false
              }
              helperText={
                values.userInfo?.second_Phone !== null &&
                (values.userInfo?.second_Phone?.length || 0) < 9
                  ? "Мин 9 символов"
                  : ""
              }
              value={values.userInfo?.second_Phone}
              disabled={!canSave}
              onChange={handleChange}
            />
          </div>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              name="userInfo.second_Email"
              label="E-mail*"
              error={
                values.userInfo?.second_Email !== null &&
                !values.userInfo?.second_Email.includes("@")
                  ? true
                  : false
              }
              helperText={
                values.userInfo?.second_Email !== null &&
                !values.userInfo?.second_Email.includes("@")
                  ? 'Поле ввода обязательно и требует символ "@"'
                  : ""
              }
              size="small"
              value={values.userInfo?.second_Email}
              disabled={!canSave}
              onChange={handleChange}
            />
            <Button
              disabled={create || buttonSettings.btn_signRukovoditel.readOnly}
              startIcon={
                <PencilIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={(el) => {
                handleSignSignatureBody(SignType.Rikovoditer);
              }}
            >
              Подписать
            </Button>
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
