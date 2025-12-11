import { PropsWithChildren, ReactElement } from "react";

type Props = {
  title: string;
  hidden?: boolean;
  trailingIcon?: ReactElement;
  maxHeight?: string;
  onTrailingIconClick?: () => void;
};

export const Card = ({
  title,
  hidden,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  return (
    <div
      style={!hidden ? {} : { display: "none" }}
      className="tw-w-full tw-flex tw-flex-col"
    >
      <div className="tw-text-white tw-text-base tw-font-bold tw-py-3 tw-flex tw-items-center tw-justify-between tw-gap-6 tw-bg-primary tw-rounded-[40px] tw-px-7 tw-mb-4">
        <span>{title}</span>
        {props.trailingIcon && (
          <div
            onClick={
              props.onTrailingIconClick ? props.onTrailingIconClick : () => {}
            }
          >
            {props.trailingIcon}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Card;
