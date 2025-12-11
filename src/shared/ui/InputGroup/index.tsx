import cl from "classnames";
import { PropsWithChildren } from "react";

interface InputGroupProps {
  cols?: number;
}

export const InputGroup = ({
  cols,
  children,
  ...props
}: PropsWithChildren<InputGroupProps>) => {
  const classes = cl("tw-mb-5", "tw-grid", {
    [`tw-gap-4 tw-grid-cols-${cols}`]: cols,
  });
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
