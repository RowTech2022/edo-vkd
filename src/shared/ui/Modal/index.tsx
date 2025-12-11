import { PropsWithChildren } from "react";
import styles from "./Modal.module.scss";

type Props = {
  open: boolean;
  setOpen: Function;
};

export const Modal = ({
  children,
  open,
  setOpen,
}: PropsWithChildren<Props>) => {
  return (
    <>
      {open && (
        <div className={styles["modal-wrapper"]}>
          <div
            className={styles["modal-container"]}
            style={{ width: 900, height: 690 }}
          >
            <div className={styles["modal"]}>
              {children}
              <button
                className={styles["modal__close-btn"]}
                onClick={() => setOpen(false)}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.875 4.00625L10.9938 3.125L7.5 6.61875L4.00625 3.125L3.125 4.00625L6.61875 7.5L3.125 10.9938L4.00625 11.875L7.5 8.38125L10.9938 11.875L11.875 10.9938L8.38125 7.5L11.875 4.00625Z"
                    fill="#003A97"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
