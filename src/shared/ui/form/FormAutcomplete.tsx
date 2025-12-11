import { Autocomplete } from "@mui/material";
import { ComponentProps, FC } from "react";
import { CustomTextField } from "../CustomTextfield";

type AutocompleteProps = ComponentProps<typeof Autocomplete>;
type FormAutocomplete = Omit<AutocompleteProps, "renderInput"> & {
  errorText?: string | boolean;
  label: string;
  name?: string;
};

export const FormAutocomplete: FC<FormAutocomplete> = ({
  errorText,
  name,
  label,
  ...otherProps
}) => {
  return (
    <Autocomplete
      {...otherProps}
      renderInput={(params) => (
        <CustomTextField
          params={params}
          name={name}
          label={label}
          error={Boolean(errorText)}
        />
      )}
    />
  );
};
