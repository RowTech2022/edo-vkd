import { FC, ChangeEvent } from "react";

import { FormikProps } from "formik";
import { InitialValuesType } from "../helpers/schema";
import { Card, PencilIcon, CustomButton, CustomTextField } from "@ui";
import { SignType } from "../helpers/constants";
import { getFieldErrors, ONLY_ALPHABETICAL } from "@utils";
import { TextField, InputAdornment } from "@mui/material";

interface ISignExamples {
  entry?: SignatureSamples.Card;
  formik: FormikProps<InitialValuesType>;
  canSave?: boolean;
  create?: boolean;
  penHandlers: any;
  handleSignSignatureBody: (type: SignType) => void;
  handlePenClick: () => void;
}

export const SignExamples: FC<ISignExamples> = ({
  entry,
  formik,
  canSave,
  penHandlers,
  create,
  handlePenClick,
  handleSignSignatureBody,
}) => {
  return (
    <Card title="Образцы подписей">
      <div
        className="tw-grid tw-grid-cols-4 tw-gap-4 tw-py-4 tw-px-4 mf_block_bg"
        style={{ paddingTop: 10 }}
      >
        <CustomTextField
          name="signatures.first_Fio"
          label="ФИО *"
          value={formik.values.signatures?.first_Fio}
          size="small"
          disabled={!canSave}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          regexp={ONLY_ALPHABETICAL}
          {...getFieldErrors(formik, "signatures.first_Fio")}
        />
        <CustomTextField
          name="signatures.first_Signature"
          value="Главный бухгалтер"
          size="small"
          onChange={formik.handleChange}
          disabled={true}
        />

        <CustomTextField
          name="signatures.first_Phone"
          label="Телефон *"
          value={formik.values.signatures?.first_Phone}
          disabled={!canSave}
          size="small"
          onChange={formik.handleChange}
          onInput={(e: ChangeEvent<HTMLInputElement>) => {
            (e.target as HTMLInputElement).value = (
              e.target as HTMLInputElement
            ).value.replace(/[^0-9]/g, "");
          }}
          onBlur={formik.handleBlur}
          {...getFieldErrors(formik, "signatures.first_Phone")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">+992</InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 9 }}
        />
        <CustomButton
          sx={{ height: "fit-content" }}
          variant="outlined"
          withRuToken
          disabled={
            create || entry?.transitions.buttonSettings.btn_sign_b.readOnly
          }
          startIcon={
            <PencilIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={(el) => {
            handleSignSignatureBody(SignType.Account);
          }}
          {...penHandlers}
        >
          Подписать
        </CustomButton>

        <CustomTextField
          name="signatures.second_Fio"
          label="ФИО *"
          value={formik.values.signatures?.second_Fio}
          disabled={!canSave}
          size="small"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          regexp={ONLY_ALPHABETICAL}
          {...getFieldErrors(formik, "signatures.second_Fio")}
        />

        <CustomTextField
          name="signatures.second_Signature"
          value="Руководитель"
          size="small"
          onChange={formik.handleChange}
          disabled
        />
        <TextField
          name="signatures.second_Phone"
          label="Телефон *"
          disabled={!canSave}
          size="small"
          onChange={formik.handleChange}
          value={formik.values.signatures?.second_Phone}
          onInput={(e) => {
            (e.target as HTMLInputElement).value = (
              e.target as HTMLInputElement
            ).value.replace(/[^0-9]/g, "");
          }}
          onBlur={formik.handleBlur}
          {...getFieldErrors(formik, "signatures.second_Phone")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">+992</InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 9 }}
        />

        <CustomButton
          sx={{ height: "fit-content" }}
          variant="outlined"
          withRuToken
          disabled={
            create || entry?.transitions.buttonSettings.btn_sign_r.readOnly
          }
          startIcon={
            <PencilIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          {...penHandlers}
          onClick={(el) => {
            handleSignSignatureBody(SignType.HeadBo);
            handlePenClick();
          }}
        >
          Подписать
        </CustomButton>
      </div>
    </Card>
  );
};
