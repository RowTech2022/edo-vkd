import { ValueId } from "@root/services";
import { Theme } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { SxProps } from "@mui/system";

interface ValueIDAutocompleteProps {
  sx?: SxProps<Theme>;
  name: string;
  value: ValueId | null | undefined;
  size?: "small" | "medium" | undefined;
  label: string;
  options?: ValueId[];
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  onChange: (name: string, value: ValueId | null) => void;
  handleInputChange?: (e: any, value: string) => void;
}

export function ValueIDAutocomplete({
  sx,
  name,
  value = null,
  size,
  label,
  options = [],
  loading,
  disabled,
  required,
  fullWidth = true,
  onChange,
  handleInputChange,
}: ValueIDAutocompleteProps) {
  return (
    <Autocomplete
      sx={sx}
      value={value}
      options={options}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      isOptionEqualToValue={(option, value) => option?.id == value?.id}
      renderInput={(params) => (
        <TextField
          {...params}
          value={value?.value || ""}
          size={size}
          label={label}
          required={required}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.value}
        </li>
      )}
      getOptionLabel={(option) => option.value}
      onChange={(event, value) => {
        onChange(name, value);
      }}
      onInputChange={handleInputChange}
    />
  );
}
