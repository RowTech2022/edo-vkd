import { Autocomplete, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BaseSyntheticEvent, memo, useState } from "react";
import { ListIcon } from "../Icons/ListIcon";
import { Loading } from "../Loading";
import { newDateFormat } from "@utils";

type Type = "text" | "date" | "select" | "number";

interface FiltersOption {
  type: Type;
  name: string;
  label?: string;
  data?: any;
  getOptionLabel?: (option: FiltersOption) => string;
  setValue?: (value: any) => any;
  onChange?: (value: any, setValue: any) => any;
}

interface FiltersProps extends React.FC {
  options: FiltersOption[];
  onSubmit?: (filters: any) => {};
  isLoading?: boolean;
}

export const getInitialValues = (options: FiltersOption[]) => {
  const initialValues: any = {};
  options.forEach((option) => {
    let value = null;
    const { name, type } = option;
    switch (type) {
      case "text":
        value = "";
        break;
      case "date":
        value = new Date();
        break;
      case "select":
        value = {};
        break;
      case "number":
        value = 0;
        break;
    }
    initialValues[name] = value;
  });
  return initialValues;
};

export const Filters = memo(
  ({ options, onSubmit, isLoading }: FiltersProps) => {
    const [filters, setFilters] = useState<any>(getInitialValues(options));

    const renderComponents = () => {
      return options.map((option: FiltersOption) => {
        const { type, label, name, getOptionLabel, setValue, onChange, data } =
          option;
        let Component: React.ReactElement<any>;
        const handleChangeAutocomplete = (value: any) => {
          if (onChange) {
            const setValue_ = (value: any) => {
              setFilters({ ...filters, [name]: value });
            };
            onChange(filters[name], setValue_);
          } else {
            setFilters({
              ...filters,
              [name]: value,
            });
          }
        };

        switch (type) {
          case "text":
            Component = (
              <TextField
                label={label}
                size="small"
                onChange={(event: BaseSyntheticEvent) => {
                  setFilters({
                    ...filters,
                    [name]: event.target.value,
                  });
                }}
              />
            );
            break;
          case "select":
            Component = (
              <Autocomplete
                disablePortal
                size="small"
                options={!!data?.length ? data : []}
                getOptionLabel={
                  getOptionLabel
                    ? (op) => getOptionLabel(op)
                    : (op) => op && op[name]
                }
                value={setValue ? setValue(filters[name]) : filters[name]}
                onChange={(_, value) => handleChangeAutocomplete(value)}
                renderInput={(params) => (
                  <TextField {...params} label={label} />
                )}
              />
            );
            break;
          case "number":
            Component = (
              <TextField
                label={label}
                size="small"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                onChange={(event: BaseSyntheticEvent) => {
                  setFilters({
                    ...filters,
                    [name]: event.target.value,
                  });
                }}
              />
            );
            break;
          case "date":
            Component = (
              <DatePicker
                label={label}
                inputFormat={newDateFormat}
                value={filters && filters[name]}
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    [name]: value,
                  });
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            );
            break;
        }
        return Component;
      });
    };

    const handleSubmit = () => {
      onSubmit && onSubmit(filters);
    };

    return (
      <div className="tw-w-full tw-grid tw-grid-flow-col-dense tw-auto-cols-fr tw-gap-4">
        {renderComponents()}
        <Button
          startIcon={
            isLoading ? (
              <Loading />
            ) : (
              <ListIcon
                width="18px"
                height="18px"
                fill="currentColor"
                stroke="none"
              />
            )
          }
          disabled={isLoading}
          onClick={handleSubmit}
        >
          Список
        </Button>
      </div>
    );
  }
);
