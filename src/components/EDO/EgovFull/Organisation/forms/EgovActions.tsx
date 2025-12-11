import { FC, ReactNode } from "react";
import { Button } from "@mui/material";
import { CheckIcon, DiskIcon, ChevronLeftIcon } from "@ui";

import { EgovFullFormikType } from "../helpers/schema";
import { IEgovApplicationCreateResponse } from "@services/egov/application-resident/models/create";

interface IEgovHandles {
  back: () => void;
  save: () => void;
  sign: () => void;
}

interface IEgovActions {
  formik: EgovFullFormikType;
  handles: IEgovHandles;
  transitions: IEgovApplicationCreateResponse["transitions"];
  createMode?: boolean;
  children?: ReactNode;
  disabled?: boolean;
}

export const EgovActions: FC<IEgovActions> = ({
  transitions,
  handles,
  createMode,
  children,
  disabled,
}) => {
  const { btn_save, btn_sign } = transitions?.buttonSettings || {};

  const discIcon = (
    <DiskIcon width="16px" height="16px" fill="currentColor" stroke="none" />
  );

  const endIcon = (
    <CheckIcon width="16px" height="16px" fill="currentColor" stroke="none" />
  );

  return (
    <div className="mf_block_bg tw-overflow-hidden">
      <div className="tw-flex tw-justify-between tw-py-3 tw-px-4 tw-shadow-[0_0_4px_0_#00000025] tw-mb-4">
        <Button
          sx={{ fontWeight: 600, paddingX: 2 }}
          startIcon={
            <ChevronLeftIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={handles.back}
        >
          Назад
        </Button>
        <div className="tw-flex tw-flex-wrap tw-gap-4">
          <Button
            sx={{ fontWeight: 600, paddingX: 2 }}
            disabled={btn_save?.readOnly || disabled}
            startIcon={discIcon}
            onClick={handles.save}
          >
            Сохранить
          </Button>
          <Button
            sx={{ fontWeight: 600, paddingX: 2 }}
            disabled={btn_sign?.readOnly || disabled || createMode}
            startIcon={endIcon}
            onClick={handles.sign}
          >
            Подписать
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};
