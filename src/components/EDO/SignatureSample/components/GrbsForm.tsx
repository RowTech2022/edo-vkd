import { FC } from "react";

import { FormikProps } from "formik";
import { InitialValuesType } from "../helpers/schema";
import { Card, PencilIcon, CustomButton, CustomTextField } from "@ui";
import { SignType } from "../helpers/constants";
import { getFieldErrors, INN_REGEXP } from "@utils";

interface IGrbsForm {
  entry?: SignatureSamples.Card;
  formik: FormikProps<InitialValuesType>;
  canSave?: boolean;
  create?: boolean;
  penHandlers: any;
  handleSignSignatureBody: (type: SignType) => void;
  handlePenClick: () => void;
}

export const GrbsForm: FC<IGrbsForm> = ({
  entry,
  formik,
  canSave,
  penHandlers,
  create,
  handlePenClick,
  handleSignSignatureBody,
}) => {
  return (
    <Card title="ГРБС">
      <div
        className="tw-grid tw-grid-cols-5 tw-gap-5 tw-py-4 tw-px-4 mf_block_bg"
        style={{ paddingTop: 10 }}
      >
        <CustomTextField
          name="signatures.treasurer_Fio"
          label="ФИО *"
          value={formik.values.signatures?.treasurer_Fio}
          size="small"
          onChange={formik.handleChange}
        />
        <CustomTextField
          name="signatures.treasurer_Position"
          label="Должность *"
          value={formik.values.signatures?.treasurer_Position}
          size="small"
          onChange={formik.handleChange}
        />
        <CustomTextField
          name="signatures.treasurer_Org"
          label="Название организации *"
          value={formik.values.signatures?.treasurer_Org}
          disabled={!canSave}
          size="small"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          {...getFieldErrors(formik, "signatures.treasurer_Org")}
        />
        <CustomTextField
          name="signatures.treasurer_Inn"
          label="ИНН Организации *"
          value={formik.values.signatures?.treasurer_Inn}
          disabled={!canSave}
          size="small"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          regexp={INN_REGEXP}
          {...getFieldErrors(formik, "signatures.treasurer_Inn")}
        />
        <CustomButton
          sx={{ height: "fit-content" }}
          variant="outlined"
          withRuToken
          disabled={
            create || entry?.transitions.buttonSettings.btn_sign_grbs.readOnly
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
          onClick={() => {
            handleSignSignatureBody(SignType.GrbsSign);
            handlePenClick();
          }}
        >
          Подписать
        </CustomButton>
      </div>
    </Card>
  );
};
