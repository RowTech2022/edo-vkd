import { FC, useMemo } from "react";
import {
  Autocomplete,
  FormGroup,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Card, PencilIcon, CustomButton, CustomTextField } from "@ui";
import { getFieldErrors } from "@utils";
import { FormikProps } from "formik";
import { InitialValuesType } from "../helpers/schema";
import { SignType } from "../helpers/constants";
import { ListResponse, ValueId } from "@services/api";
import { HeadListInfo } from "@services/accessMfApi";
import { useFetchUserPositionsQuery } from "@services/generalApi";

interface IDepartmentHead {
  formik: FormikProps<InitialValuesType>;
  canSave?: boolean;
  penHandlers: any;
  signBtnDisabled: boolean;
  heads?: ListResponse<HeadListInfo>;
  handleSignSignatureBody: (type: number) => void;
  handlePenClick: () => void;
}

export const DepartmentHead: FC<IDepartmentHead> = ({
  formik,
  canSave,
  penHandlers,
  signBtnDisabled,
  heads,
  handleSignSignatureBody,
  handlePenClick,
}) => {
  const userPositionsQuery = useFetchUserPositionsQuery();

  const headsOptions = useMemo(() => {
    if (!heads) return [];
    return heads.items.map((item) => item.curatorInfo);
  }, [heads]);

  const setHeadInfo = (head: ValueId) => {
    const found = heads?.items.find((item) => item.curatorInfo.id === head?.id);

    if (found) {
      formik.setFieldValue("userInfo.h_UserPosition", found.position);
      formik.setFieldValue("userInfo.h_Phone", found.phone);
    }
  };

  return (
    <Card title="Начальник отдела">
      <div className="tw-py-4 tw-px-4 mf_block_bg">
        <FormGroup className="tw-gap-4">
          <div className="tw-grid tw-grid-cols-4 tw-gap-4">
            <Autocomplete
              value={formik.values.userInfo?.head as any}
              size="small"
              options={headsOptions ?? []}
              getOptionLabel={(option) => option.value as any}
              disabled={!canSave}
              renderInput={(params) => (
                <CustomTextField
                  params={params}
                  label="Начальник*"
                  size="small"
                  name="userInfo.head"
                  onBlur={formik.handleBlur}
                  {...getFieldErrors(formik, "userInfo.head")}
                />
              )}
              onChange={(event, value) => {
                formik.setFieldValue("userInfo.head", value);
                setHeadInfo(value);
              }}
            />
            <Autocomplete
              value={formik.values.userInfo?.h_UserPosition as any}
              size="small"
              options={userPositionsQuery.data?.items || []}
              getOptionLabel={(option) => option.value as string}
              disabled={true}
              renderInput={(params) => (
                <CustomTextField
                  params={params}
                  label="Должность*"
                  size="small"
                  name="userInfo.h_UserPosition"
                  onBlur={formik.handleBlur}
                  {...getFieldErrors(formik, "userInfo.h_UserPosition")}
                />
              )}
            />
            <TextField
              label="Телефон*"
              name="userInfo.h_Phone"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+992</InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 9 }}
              disabled={true}
              onChange={formik.handleChange}
              value={formik.values.userInfo?.h_Phone}
              onBlur={formik.handleBlur}
              {...getFieldErrors(formik, "userInfo.h_Phone")}
            />
            <CustomButton
              variant="outlined"
              withRuToken
              disabled={signBtnDisabled}
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
                handleSignSignatureBody(SignType.NachOtdel);
                handlePenClick();
              }}
            >
              Подписать
            </CustomButton>
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
