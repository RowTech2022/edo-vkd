import { ValueId } from "@root/services";
import { Theme } from "@mui/material";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { SxProps } from "@mui/system";

interface AutocompleteWithAddProps
  extends Omit<
    AutocompleteProps<ValueId, false, false, false>,
    "renderInput" | "options" | "value" | "onChange" | "size" | "getOptionLabel" | "isOptionEqualToValue"
  > {
  sx?: SxProps<Theme>;
  name: string;
  value?: ValueId | null;
  size?: "small" | "medium";
  label: string;
  options?: ValueId[];
  required?: boolean;
  onChange?: (name: string, value: ValueId | null) => void;
  handleInputChange?: (event: React.SyntheticEvent, value: string) => void;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: ValueId
  ) => React.ReactNode;
  getOptionLabel?: (option: ValueId) => string;
  isOptionEqualToValue?: (option: ValueId, value: ValueId) => boolean;
}

export function AutocompleteWithAdd({
  sx,
  name,
  value = null,
  size = "medium",
  label,
  options = [],
  loading = false,
  disabled = false,
  required = false,
  fullWidth = true,
  onChange,
  handleInputChange,
  renderOption,
  getOptionLabel,
  isOptionEqualToValue,
  ...rest
}: AutocompleteWithAddProps) {
  // Дефолтные реализации
  const defaultRenderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: ValueId
  ) => (
    <li {...props} key={option.id}>
      {option.value}
    </li>
  );

  const defaultGetOptionLabel = (option: ValueId) => option.value;

  const defaultIsOptionEqualToValue = (option: ValueId, value: ValueId) => 
    option?.id === value?.id;

  const defaultHandleInputChange = (
    event: React.SyntheticEvent,
    value: string
  ) => {};

  const defaultOnChange = (
    event: React.SyntheticEvent,
    value: ValueId | null
  ) => {};

  return (
    <Autocomplete
      {...rest}
      sx={sx}
      value={value}
      options={options}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      isOptionEqualToValue={isOptionEqualToValue ?? defaultIsOptionEqualToValue}
      renderInput={(params) => (
        <TextField
          {...params}
          value={value?.value || ""}
          size={size}
          label={label}
          required={required}
        />
      )}
      renderOption={renderOption ?? defaultRenderOption}
      getOptionLabel={getOptionLabel ?? defaultGetOptionLabel}
      onChange={(event, value) => {
        onChange?.(name, value) ?? defaultOnChange(event, value);
      }}
      onInputChange={handleInputChange ?? defaultHandleInputChange}
    />
  );
}