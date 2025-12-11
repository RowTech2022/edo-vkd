import { FC } from "react";
import { Card, PencilIcon } from "@ui";

import { FormikProps } from "node_modules/formik/dist";
import { Autocomplete, FormGroup, TextField, Button } from "@mui/material";
import { SignType } from "../helpers/constants";

interface IProps {
  formik: FormikProps<any>;
  canSave?: boolean;
  create?: boolean;
  mfAccess: TFMIS.IKuratonAndHeadInfo[];
  buttonSettings: TFMIS.AccessApplication["transitions"]["buttonSettings"];
  handleSignSignatureBody: (props: SignType) => void;
}

export const BudgetPrepareForm: FC<IProps> = ({
  formik,
  canSave,
  buttonSettings,
  create,
  mfAccess,
  handleSignSignatureBody,
}) => {
  const { values, setFieldValue } = formik;

  return (
    <Card title="Подготовка бюджета">
      <div className="tw-flex tw-gap-6 tw-px-4 tw-py-6 tw-flex-wrap">
        <FormGroup className="tw-gap-4 tw-flex-auto">
          <Autocomplete
            disablePortal
            options={mfAccess || []}
            getOptionLabel={(option) =>
              (option.kuratorFio +
                " (куратор)  " +
                option.headDepartFio +
                " (начальник)") as string
            }
            size="small"
            noOptionsText="Нет данных"
            renderInput={(params) => (
              <TextField
                {...params}
                name="userInfo.budgetPreparationInfo"
                label="Куратор по подготовке*"
              />
            )}
            value={values.userInfo?.budgetPreparationInfo}
            disabled={!canSave}
            onChange={(event, value) => {
              setFieldValue("userInfo.budgetPreparationInfo", value);
            }}
          />

          <TextField
            placeholder="ФИО (полностью, согласно паспорту)*"
            size="small"
            value={values.userInfo?.budgetPreparationInfo?.kuratorFio}
            disabled={true}
          />
          <TextField
            placeholder="Должность*"
            size="small"
            value={
              values.userInfo?.budgetPreparationInfo?.kuratorPosition?.value
            }
            disabled={true}
          />
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              placeholder="Моб. номер*"
              size="small"
              value={values.userInfo?.budgetPreparationInfo?.kuratorPhone}
              disabled={true}
            />

            <Button
              disabled={create || buttonSettings.btn_signKuratorBudget.readOnly}
              startIcon={
                <PencilIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={(el) => {
                handleSignSignatureBody(SignType.KuratorPod);
              }}
            >
              Подписать
            </Button>
          </div>
        </FormGroup>
        <FormGroup className="tw-gap-4 tw-flex-auto tw-mt-[55px]">
          <TextField
            placeholder="ФИО (полностью, согласно паспорту)*"
            size="small"
            value={values.userInfo?.budgetPreparationInfo?.headDepartFio}
            disabled={true}
          />
          <TextField
            placeholder="Должность*"
            size="small"
            value={
              values.userInfo?.budgetPreparationInfo?.headDepartPosition?.value
            }
            disabled={true}
          />
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              placeholder="Моб. номер*"
              size="small"
              value={values.userInfo?.budgetPreparationInfo?.headDepartPhone}
              disabled={true}
            />

            <Button
              disabled={create || buttonSettings.btn_signHeadBudget.readOnly}
              startIcon={
                <PencilIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={(el) => {
                handleSignSignatureBody(SignType.NachPodgotovki);
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
