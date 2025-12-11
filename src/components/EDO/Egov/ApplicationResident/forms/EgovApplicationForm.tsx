import { FC, useMemo } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { EgovFormikType } from "../helpers/schema";
import {
  useFetchEgovCountListQuery,
  useFetchEgovGovernmentsQuery,
  useFetchYearsQuery,
} from "@services/generalApi";
import { useGetTextOfApplicationEgovQuery } from "@services/egov/application-resident";
import BorderColorIcon from "@mui/icons-material/BorderColor";

interface IEgovApplicationForm {
  formik: EgovFormikType;
  disabled?: boolean;
  mainSign?: {
    sign: string;
  };
  createMode?: boolean;
  signReadonly?: boolean;
  handleSign: () => void;
}

export const EgovApplicationForm: FC<IEgovApplicationForm> = ({
  formik,
  mainSign,
  disabled,
  createMode,
  signReadonly,
  handleSign,
}) => {
  const { values, setFieldValue, handleChange } = formik;
  const { data: goverments } = useFetchEgovGovernmentsQuery();
  const { data: countList } = useFetchEgovCountListQuery();
  const { data: yearList } = useFetchYearsQuery();
  const { data: text } = useGetTextOfApplicationEgovQuery();

  const countOptions = useMemo(
    () =>
      countList?.map((item) => ({
        id: item,
        value: item,
      })),
    [countList]
  );

  const yearOptions = useMemo(
    () =>
      yearList?.map((item) => ({
        id: item,
        value: item,
      })),
    [yearList]
  );

  const theme = useTheme();

  return (
    <div className="tw-p-4 tw-pb-0">
      <Box
        sx={{
          textAlign: "center",
          padding: 5,
          border: `1px solid ${theme.palette.primary.main}`,
          marginBottom: 3,
          minWidth: "600px",
          width: "80%",
          marginX: "auto",
          borderRadius: 3,
        }}
      >
        <Typography fontSize="20px">{text}</Typography>
      </Box>
      <FormGroup className="tw-mb-4">
        <div
          className={`tw-grid tw-grid-cols-3 ${
            mainSign ? "tw-gap-10" : "tw-gap-4"
          }`}
        >
          <Autocomplete
            disabled={disabled}
            disablePortal
            options={goverments?.items || []}
            size="small"
            getOptionLabel={(option) => option.value as string}
            value={values.goverment}
            onChange={(event, value) => {
              setFieldValue("goverment", value);
            }}
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value.id
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Государство"
                name="goverment"
                required
              />
            )}
          />

          <TextField
            disabled={disabled}
            name="fio"
            label="ФИО"
            value={values.fio}
            size="small"
            onChange={handleChange}
            required
          />
          <Box position="relative">
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                display: "flex",
                gap: 2,
                justifyContent: "center",
                width: "100%",
              }}
            >
              {mainSign ? (
                <img src={`data:image/png;base64,${mainSign.sign}`} />
              ) : (
                <Button
                  disabled={signReadonly || createMode || disabled}
                  startIcon={
                    <BorderColorIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                  onClick={handleSign}
                >
                  Подписать
                </Button>
              )}
            </Box>
          </Box>

          <Autocomplete
            disabled={disabled}
            disablePortal
            options={countOptions || []}
            size="small"
            getOptionLabel={(option) => option.value as any}
            value={values.count as any}
            onChange={(event, value: any) => {
              setFieldValue("count", value);
            }}
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value.id
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="В количестве"
                name="count"
                required
              />
            )}
          />

          <Autocomplete
            disabled={disabled}
            disablePortal
            options={yearOptions || []}
            size="small"
            getOptionLabel={(option) => String(option.value)}
            value={values.year as any}
            onChange={(event, value: any) => {
              setFieldValue("year", value);
            }}
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value.id
            }
            renderInput={(params) => (
              <TextField {...params} label="Год" name="year" required />
            )}
          />
        </div>
      </FormGroup>
    </div>
  );
};
