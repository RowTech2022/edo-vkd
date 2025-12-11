import { FormikProps } from "formik";
import { FC } from "react";
import { InitialValuesType } from "../helpers/schema";
import { Autocomplete, Box, Button, FormGroup } from "@mui/material";
import { Card , CustomTextField } from "@ui";
import { useLocation } from "react-router";
import {
  useFetchBudgetVariantsQuery,
  useFetchProgramsQuery,
} from "@services/generalApi";
import { Link } from "react-router-dom";

interface IAccessParams {
  formik: FormikProps<InitialValuesType>;
  currentGrbs: any;
  canSave?: boolean;
  setGrbsPopupOpen: (value: boolean) => void;
}

export const AccessParams: FC<IAccessParams> = ({
  formik,
  currentGrbs,
  canSave,
  setGrbsPopupOpen,
}) => {
  const { pathname } = useLocation();

  const budgetVariantsQuery = useFetchBudgetVariantsQuery();
  const programsQuery = useFetchProgramsQuery();

  return (
    <Card title="Параметры доступов">
      <div className="tw-py-4 tw-px-4 mf_block_bg">
        <FormGroup className="tw-gap-4">
          <div className="tw-grid tw-grid-cols-[187px_1fr_1fr_1fr] tw-gap-4 ">
            <Box className="tw-w-full">
              <Link to={pathname}>
                <Button
                  sx={{ width: "100%" }}
                  variant="contained"
                  onClick={() => setGrbsPopupOpen(true)}
                >
                  Выбрать
                </Button>
              </Link>
            </Box>
            <Autocomplete
              value={currentGrbs}
              multiple
              disablePortal
              size="small"
              options={currentGrbs}
              getOptionLabel={(option) => option?.id as string}
              readOnly={true}
              renderInput={(params) => (
                <CustomTextField params={params} label="ГРБС" />
              )}
            />
            <Autocomplete
              value={formik.values?.access?.budgetVariant! as any}
              multiple
              disablePortal
              size="small"
              options={budgetVariantsQuery?.data?.items || []}
              getOptionLabel={(option) => option?.value as string}
              disabled={!canSave}
              renderInput={(params) => (
                <CustomTextField
                  params={params}
                  label="Варианты бюджета"
                ></CustomTextField>
              )}
              onChange={(event, value) => {
                formik.setFieldValue("access.budgetVariant", value);
              }}
            />
            <Box>
              <Autocomplete
                value={formik.values?.access?.programs! as any}
                multiple
                disablePortal
                size="small"
                options={programsQuery?.data?.items || []}
                getOptionLabel={(option) => option?.value as string}
                disabled={!canSave}
                renderInput={(params) => (
                  <CustomTextField
                    params={params}
                    label="Доступные программы"
                    maxWidth="auto"
                    showTooltip
                  ></CustomTextField>
                )}
                onChange={(event, value) => {
                  formik.setFieldValue("access.programs", value);
                }}
              />
            </Box>
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
