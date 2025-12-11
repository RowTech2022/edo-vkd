import { PropsWithChildren } from "react";

type Props = {
  width?: string;
  height?: string;
  fill?: string;
  stroke?: string;
  className?: string;
};

export const BaseIcon = ({
  children,
  fill = "none",
  stroke = "currentColor",
  width = "24px",
  height = "24px",
}: PropsWithChildren<Props>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>{children}</g>
    </svg>
  );
};
