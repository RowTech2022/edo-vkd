import { FC, ReactNode } from "react";
import { Button } from "@mui/material";
import { CheckIcon, DiskIcon, CrossCircleIcon, AngleDoubleLeftIcon } from "@ui";

import { EgovFormikType } from "../helpers/schema";
import { IEgovApplicationCreateResponse } from "@services/egov/application-resident/models/create";
import ChatIcon from "@mui/icons-material/Chat";

interface IEgovHandles {
  back: () => void;
  save: () => void;
  accept: () => void;
  sign: () => void;
  openChat: () => void;
  openUndoForm: () => void;
  cancelUndoForm: () => void;
}

interface IEgovActions {
  formik: EgovFormikType;
  handles: IEgovHandles;
  transitions: IEgovApplicationCreateResponse["transitions"];
  createMode?: boolean;
  children?: ReactNode;
  disabled?: boolean;
}

export const EgovActions: FC<IEgovActions> = ({
  formik,
  transitions,
  handles,
  createMode,
  children,
  disabled,
}) => {
  const defaultCallback = () => {};

  const { btn_accept, btn_save, btn_undo, openChat } =
    transitions?.buttonSettings || {};

  // icons
  const angleIcon = (
    <AngleDoubleLeftIcon
      width="16px"
      height="16px"
      fill="currentColor"
      stroke="none"
    />
  );

  const discIcon = (
    <DiskIcon width="16px" height="16px" fill="currentColor" stroke="none" />
  );

  const rejectIcon = (
    <CrossCircleIcon
      width="16px"
      height="16px"
      fill="currentColor"
      stroke="none"
    />
  );

  const chatIcon = (
    <ChatIcon width="16px" height="16px" fill="currentColor" stroke="none" />
  );

  const endIcon = (
    <CheckIcon width="16px" height="16px" fill="currentColor" stroke="none" />
  );

  return (
    <div className="mf_block_bg tw-overflow-hidden">
      <div className="tw-flex tw-justify-between tw-py-3 tw-px-4 tw-shadow-[0_0_4px_0_#00000025] tw-mb-4">
        <Button startIcon={angleIcon} onClick={handles.back}>
          Назад
        </Button>
        <div className="tw-flex tw-flex-wrap tw-gap-4">
          <Button
            disabled={btn_save?.readOnly || disabled}
            startIcon={discIcon}
            onClick={handles.save}
          >
            Сохранить
          </Button>
          <Button
            disabled={btn_accept?.readOnly || disabled || createMode}
            startIcon={endIcon}
            onClick={handles.accept}
          >
            Принять
          </Button>
          <Button
            disabled={btn_undo?.readOnly || disabled || createMode}
            startIcon={rejectIcon}
            onClick={handles.openUndoForm}
          >
            Отклонить
          </Button>
          <Button
            disabled={openChat?.readOnly || disabled || createMode}
            startIcon={chatIcon}
            onClick={handles.openChat}
          >
            Написать заявителю
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};
