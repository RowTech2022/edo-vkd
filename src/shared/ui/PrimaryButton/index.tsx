import classNames from "classnames";
import { MouseEventHandler, PropsWithChildren } from "react";
import { Loading } from "../Loading";
import styles from "./PrimaryButton.module.scss";

type Props = {
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  type?: "button" | "submit" | "reset";
  variant?: "contained" | "outlined"
};

export const PrimaryButton = (props: PropsWithChildren<Props>) => {
  return (
    <button type={props.type || "button"}
      className={classNames(
    styles["primary-button"],
    props.variant === "outlined" && styles["outlined"],
    props.className
  )}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.loading ? <Loading /> : props.children}
    </button>
  );
};
