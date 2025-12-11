import { FormikProps } from "formik";
import { FC } from "react";
import { InitialValuesType } from "../helpers/schema";
import { TextField } from "@mui/material";
import { Card, PencilIcon , CustomButton , CustomTextField } from "@ui";


interface IBOInfo {
  formik: FormikProps<InitialValuesType>;
  penHandlers: any;
  signBtnDisabled: boolean;
  handleSignSignatureBody: (type: number) => void;
  handlePenClick: () => void;
}

export const BOInfo: FC<IBOInfo> = ({
  formik,
  penHandlers,
  signBtnDisabled,
  handleSignSignatureBody,
  handlePenClick,
}) => {
  const { values } = formik;
  return (
    <Card title="Информации БО">
      <div
        className="tw-grid tw-grid-cols-4 tw-gap-4 tw-py-4 tw-px-4 mf_block_bg"
        style={{ paddingTop: 10 }}
      >
        <CustomTextField
          name="fio"
          label="ФИО *"
          value={values.infoCartSignaturas?.bo_Fio}
          disabled={values.infoCartSignaturas?.bo_Fio ? false : true}
          focused={values.infoCartSignaturas?.bo_Fio ? true : false}
          size="small"
        />

        <CustomTextField value="Руководитель" size="small" disabled={true} />

        <TextField
          name="phone"
          label="Телефон *"
          value={values.infoCartSignaturas?.bo_Phone}
          disabled={values.infoCartSignaturas?.bo_Phone ? false : true}
          focused={values.infoCartSignaturas?.bo_Phone ? true : false}
          size="small"
        />

        <CustomButton
          sx={{ height: "fit-content" }}
          variant="outlined"
          withRuToken
          startIcon={
            <PencilIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          disabled={signBtnDisabled}
          {...penHandlers}
          onClick={(el) => {
            handleSignSignatureBody(4);
            handlePenClick();
          }}
        >
          Подписать
        </CustomButton>
      </div>
    </Card>
  );
};
