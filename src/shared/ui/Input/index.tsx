import {
  Autocomplete,
  TextField,
  InputAdornment,
  BaseTextFieldProps,
} from "@mui/material";
import { ValueIDAutocomplete } from "../Autocompele";
import { PerformantTextField } from "../PerformantTextField";

interface InputProps extends BaseTextFieldProps {
  label: string;
  name: string;
  type?: string;
  formikInstance?: any;
  disabled?: boolean;
  required?: boolean;
  value?: any;
  options?: any;
  onChange?(...args: any): any;
  extraErrorCheck?(value?: string | null): unknown;
  props?: BaseTextFieldProps | any;
}

export const Input: React.FC<InputProps> = ({
  disabled,
  label,
  name,
  value,
  extraErrorCheck,
  type = "text",
  options = {},
  onChange = (event: Event | any) => {},
  formikInstance,
  ...props
}) => {
  const renderComponent = () => {
    let Component: React.FC<any> = {} as React.FC,
      componentProps = {};
    const defaultProps = {
      name,
      value,
      label,
      disabled,
      size: "small",
    };
    switch (type) {
      case "number":
        Component = PerformantTextField;
        componentProps = {
          type: "number",
          ...props,
        };
        break;
      case "phone":
        const hasError = () => {
          return (!!value && (value as string).length < 9) ||
            value === formikInstance?.values?.signatures?.second_Phone
            ? true
            : false;
        };
        const getErrorText = (): any => {
          return value !== null && (value as string)?.length < 9
            ? "Мин 9 символов"
            : "" || (extraErrorCheck && extraErrorCheck(value));
        };
        Component = PerformantTextField;
        componentProps = {
          ...props,
          name,
          value,
          InputProps: {
            startAdornment: (
              <InputAdornment position="start">+992</InputAdornment>
            ),
          },
          inputProps: { maxLength: 9 },
          onInput: (e: any) =>
            ((e.target as HTMLInputElement).value = (
              e.target as HTMLInputElement
            ).value.replace(/[^0-9]/g, "")),
          onChange,
          error: hasError(),
          helperText: getErrorText(),
        };
        break;
      case "multiselect":
        Component = Autocomplete;
        componentProps = {
          multiple: true,
          getOptionLabel: (option: any) => option?.toString(),
          renderInput: (params: any) => (
            <TextField {...params} label={label} name={name} />
          ),
          onChange,
        };
        break;
      case "select":
        Component = ValueIDAutocomplete;
        componentProps = {
          label,
          options,
          onChange,
          ...props,
        };
        break;
      default:
        Component = PerformantTextField;
        componentProps = {
          name,
          value,
          onChange: formikInstance?.handleChange || onChange,
          ...props,
        };
        break;
    }
    return <Component {...defaultProps} {...componentProps} />;
  };
  return renderComponent();
};
