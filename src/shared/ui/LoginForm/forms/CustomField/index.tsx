import { FormControl, StandardTextFieldProps, TextField } from "@mui/material";
import { FC, HTMLInputTypeAttribute, ReactNode } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { inputStyles, labelStyles, textFieldSx } from "./styles";

type IconType = typeof PersonIcon;
interface ICustomField extends StandardTextFieldProps {
  label: string;
  value?: string;
  type?: HTMLInputTypeAttribute;
  id?: string;
  autoComplete?: string;
  endIcon?: ReactNode;
  StartIcon?: IconType;
  onChange?: (value: any) => void;
}

export const CustomField: FC<ICustomField> = (props) => {
  const { endIcon, StartIcon, disabled, onChange, ...other } = props;
  return (
    <FormControl
      sx={{
        position: "relative",
        height: "82px",
        background: "transparent",
        "& .MuiFormControl-root": { WebkitBoxShadow: "none" },
      }}
    >
      {StartIcon && (
        <StartIcon
          sx={{
            position: "absolute",
            top: "36%",
            left: "1.4rem",
            transform: "translateY(-50%)",
            zIndex: 99,
            color: disabled ? "#C2C2C2" : "#009688",
          }}
        />
      )}
      <TextField
        disabled={props?.disabled ? true : false}
        sx={textFieldSx}
        inputProps={{
          style: inputStyles,
        }}
        InputProps={{
          endAdornment: endIcon,
        }}
        InputLabelProps={{
          style: labelStyles,
        }}
        fullWidth
        variant="filled"
        onChange={(event) => {
          onChange ? onChange(event.target.value) : {};
        }}
        {...other}
      />
    </FormControl>
  );
};
