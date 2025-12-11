import { TextField } from "@mui/material";
import { ComponentProps, FC } from "react";
import { CustomTextField } from "../CustomTextfield";

type TextFieldProps = ComponentProps<typeof TextField>;
type FormTextFielsProps = TextFieldProps & {
  errorText?: string | boolean;
};

export const FormTextField: FC<FormTextFielsProps> = ({
  errorText,
  ...otherProps
}) => {
  return <CustomTextField otherProps={otherProps} error={Boolean(errorText)} />;
};
