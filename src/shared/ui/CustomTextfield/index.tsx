import { FC, useEffect, useRef, useState } from "react";
import { TextField, Tooltip } from "@mui/material";

export const CustomTextField: FC<any> = (props) => {
  const {
    params,
    label,
    otherProps,
    maxWidth = "500px",
    value = "",
    regexp,
    onChange,
    ...rest
  } = props;

  const ref = useRef<HTMLDivElement>();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  let tooltipTitle = props.value
    ? props.value
    : params?.inputProps.value
    ? params.inputProps.value
    : otherProps?.value
    ? otherProps.value
    : "";

  const beforeOnChange = (e: any) => {
    if (regexp) {
      if (regexp.test(e.target.value)) {
        onChange && onChange(e);
      }
    } else {
      onChange && onChange(e);
    }
  };

  useEffect(() => {
    if (ref.current)
      setShowTooltip(
        ref.current?.getElementsByTagName("input")[0].scrollWidth >
          ref.current?.getElementsByTagName("input")[0].clientWidth
          ? true
          : false
      );
  }, [ref.current?.getElementsByTagName("input")[0].value]);

  useEffect(() => {
    if (showTooltip)
      ref.current?.getElementsByTagName("input")[0].value.substring(0, 10);
  }, [showTooltip]);

  return (
    <Tooltip
      componentsProps={{
        tooltip: {
          sx: {
            maxWidth,
          },
        },
      }}
      title={showTooltip ? tooltipTitle : ""}
      placement="top-start"
    >
      <TextField
        sx={{
          ".MuiOutlinedInput-input": {
            width: "-webkit-fill-available",
            textOverflow: "ellipsis",
          },

          "& .MuiButtonBase-root": {
            height: "auto",
            minHeight: "24px",
          },

          "& .MuiChip-label": {
            whiteSpace: "pre-wrap",
          },
        }}
        ref={ref}
        {...params}
        label={label}
        {...otherProps}
        {...rest}
        value={value || ""}
        onChange={beforeOnChange}
      />
    </Tooltip>
  );
};
