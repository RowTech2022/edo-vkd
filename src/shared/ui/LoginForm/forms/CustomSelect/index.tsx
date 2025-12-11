import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { FC } from "react";
import { formControllSx, iconSx, inputStyles, selectFieldSx } from "./styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export interface ICustomSelectItem {
  label: string;
  value: string;
}

interface ICustomSelect {
  value: any;
  label: string;
  items: Array<any>;
  onChange: (item: any) => void;
  StartIcon: any;
}

export const CustomSelect: FC<ICustomSelect> = ({
  value,
  items,
  label,
  StartIcon,
  onChange,
}) => {
  const handleChange = (e: any, newVal: any) => onChange(newVal);

  return (
    <FormControl sx={formControllSx}>
      {StartIcon && <StartIcon fontSize="large" sx={iconSx} />}
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        value={value.value}
        onChange={handleChange}
        input={<OutlinedInput sx={inputStyles} label={label} />}
        MenuProps={MenuProps}
        sx={selectFieldSx}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
