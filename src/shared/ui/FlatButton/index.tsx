import classNames from "classnames";
import { MouseEventHandler, PropsWithChildren } from "react";
import { Loading } from "../Loading";
import styles from "./FlatButton.module.scss";

type Props = {
  className?: string;
  loading?: boolean;
  onClick?: MouseEventHandler;
};

export const FlatButton = (props: PropsWithChildren<Props>) => {
  return (
    <button
      className={classNames(styles["flat-button"], props.className)}
      onClick={props.onClick}
    >
      {props.loading ? <Loading /> : props.children}
    </button>
  );
};
