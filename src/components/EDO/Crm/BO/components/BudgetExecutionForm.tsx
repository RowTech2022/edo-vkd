import { FC } from "react";
import { Card, PencilIcon } from "@ui";

import { FormikProps } from "node_modules/formik/dist";
import { Autocomplete, FormGroup, TextField, Button } from "@mui/material";
import { SignType } from "../helpers/constants";

interface IProps {
  formik: FormikProps<any>;
  canSave?: boolean;
  create?: boolean;
  mfAccessExpenditure: TFMIS.IKuratonAndHeadInfo[];
  buttonSettings: TFMIS.AccessApplication["transitions"]["buttonSettings"];
  handleSignSignatureBody: (props: SignType) => void;
}

export const BudgetExecutionForm: FC<IProps> = ({
  formik,
  canSave,
  buttonSettings,
  create,
  mfAccessExpenditure,
  handleSignSignatureBody,
}) => {
  const { values, setFieldValue } = formik;

  return (
    <Card title="Испольнение бюджета">
      <div className="tw-flex tw-gap-6 tw-px-4 tw-py-6 tw-flex-wrap">
        <FormGroup className="tw-gap-4 tw-flex-auto">
          <Autocomplete
            disablePortal
            options={mfAccessExpenditure || []}
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
                name="userInfo.budgetExpenditureInfo"
                label="Куратор по подготовке*"
              />
            )}
            value={values.userInfo?.budgetExpenditureInfo}
            disabled={!canSave}
            onChange={(event, value) => {
              setFieldValue("userInfo.budgetExpenditureInfo", value);
            }}
          />

          <TextField
            placeholder="ФИО (полностью, согласно паспорту)*"
            size="small"
            value={values.userInfo?.budgetExpenditureInfo?.kuratorFio}
            disabled={true}
          />
          <TextField
            placeholder="Должность*"
            size="small"
            value={
              values.userInfo?.budgetExpenditureInfo?.kuratorPosition?.value
            }
            disabled={true}
          />
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              placeholder="Моб. номер*"
              size="small"
              value={values.userInfo?.budgetExpenditureInfo?.kuratorPhone}
              disabled={true}
            />

            <Button
              disabled={create || buttonSettings.btn_signKuratorExpen.readOnly}
              startIcon={
                <PencilIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={(el) => {
                handleSignSignatureBody(SignType.KuratorRaskhod);
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
            value={values.userInfo?.budgetExpenditureInfo?.headDepartFio}
            disabled={true}
          />
          <TextField
            placeholder="Должность*"
            size="small"
            value={
              values.userInfo?.budgetExpenditureInfo?.headDepartPosition?.value
            }
            disabled={true}
          />
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              placeholder="Моб. номер*"
              size="small"
              value={values.userInfo?.budgetExpenditureInfo?.headDepartPhone}
              disabled={true}
            />

            <Button
              disabled={create || buttonSettings.btn_signHeadExpen.readOnly}
              startIcon={
                <PencilIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={(el) => {
                handleSignSignatureBody(SignType.NachRaskhod);
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
