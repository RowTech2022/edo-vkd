import { styled, TextField, TextFieldProps } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { usePropagateRef } from "./usePropagateRef";

const TextFieldStyled = styled(TextField)({
  width: "100%",
});

export type PerformantTextFieldProps = Omit<TextFieldProps, "name"> & {
  name: string;
  value: any;
  onChange(): any;
  /**
   * IF true, it will use the traditional method for disabling performance
   */
  disablePerformance?: boolean;
  loading?: boolean;
  min?: number;
  max?: number;
};
/**
 * This is kind of hacky solution, but it mostly works. Your mileage may vary
 */
export const PerformantTextField_: React.FC<PerformantTextFieldProps> = (
  props
) => {
  /**
   * For performance reasons (possible due to CSS in JS issues), heavy views
   * affect re-renders (Formik changes state in every re-render), bringing keyboard
   * input to its knees. To control this, we create a setState that handles the field's inner
   * (otherwise you wouldn't be able to type) and then propagate the change to Formik onBlur and
   * onFocus.
   */
  const [fieldValue, setFieldValue] = useState<string | number>(props.value);
  const { disablePerformance, loading, ...otherProps } = props;
  usePropagateRef({
    setFieldValue,
    name: props.name,
    value: props.value,
  });
  /**
   * Using this useEffect guarantees us that pre-filled forms
   * such as passwords work.
   */
  useEffect(() => {
    if (props.value !== fieldValue) {
      setFieldValue(props.value);
    }
  }, [props.value]);
  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(evt.target.value);
    props.onChange && props.onChange(evt);
  };
  const onBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    const val = evt.target.value || "";
    window.setTimeout(() => {
      props?.onChange &&
        props?.onChange({
          target: {
            name: props.name,
            value: props.type === "number" ? parseInt(val, 10) : val,
          },
        } as any);
    }, 0);
  };
  // Will set depending on the performance props
  const performanceProps = {
    value: fieldValue,
    onChange,
    onBlur,
    onFocus: onBlur,
  };
  return <TextFieldStyled {...otherProps} {...performanceProps} />;
};

const PerformantTextField = memo(PerformantTextField_);

export { PerformantTextField };
