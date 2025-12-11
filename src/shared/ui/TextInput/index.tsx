import classNames from "classnames";

import styles from "./TextInput.module.scss";

type Props = {
  type?: string;
  value?: string;
  placeholder?: string;
  invalid?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  onChange?: Function;
  badge?: string;
};

const defaultProps: Props = {
  placeholder: "Введите текст",
  type: "text",
  disabled: false,
};

export const TextInput: React.FC<Props> = (props: Props) => {
  return (
    <div className="tw-flex tw-flex-col tw-gap-2 tw-relative">
      <label
        className={classNames(styles["input-box"], {
          [styles["input-box--disabled"]]: props.disabled,
          [styles["input-box--incorrect"]]: props.invalid,
        })}
      >
        {props.badge ? (
          <span className="tw-absolute tw-left-1 tw-h-full tw-flex tw-items-center tw-px-2 tw-text-gray-500 tw-border-r tw-border-blue-400">
            {props.badge}
          </span>
        ) : (
          ""
        )}
        <input
          style={{
            paddingLeft: `${props.badge ? props.badge.length + "em" : ""}`,
          }}
          type={props.type}
          className={styles["input"]}
          value={props.value}
          placeholder={props.placeholder}
          disabled={props.disabled}
          onChange={(event) =>
            props.onChange ? props.onChange(event.target.value) : {}
          }
        />
      </label>
      {props.invalid && (
        <p className={styles["error-msg"]}>{props.errorMsg || "Ошибка"}</p>
      )}
    </div>
  );
};

TextInput.defaultProps = defaultProps;
