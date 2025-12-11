import DescriptionIcon from "@mui/icons-material/Description";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import CancelIcon from "@mui/icons-material/Cancel";
import { FC, ReactNode } from "react";
import { Button } from "@mui/material";
import { DiskIcon, AngleDoubleLeftIcon, ChevronLeftIcon , CustomButton } from "@ui";
import { Edit } from '@mui/icons-material'
import { EgovFullFormikType } from "../helpers/schema";
import { IEgovServiceRequestsCreateResponse } from "@services/egovServiceRequests";

interface IEgovHandles {
  back: () => void
  save: () => void
  accept: () => void
  sign: () => void
  sendToResolution: () => void
  rejectDocument: () => void
  changePatState: () => void
  close: () => void
}

interface IEgovActions {
  isNew?: boolean;
  formik: EgovFullFormikType;
  handles: IEgovHandles;
  transitions: IEgovServiceRequestsCreateResponse["transitions"];
  createMode?: boolean;
  children?: ReactNode;
  disabled?: boolean;
}

export const EgovActions: FC<IEgovActions> = ({
  isNew,
  transitions,
  handles,
  children,
  disabled,
}) => {
  const {
    btn_save,
    btn_sign,
    btn_sendtoresolution,
    btn_rejectDocument,
    btn_close,
    btn_changePayState,
  } = transitions?.buttonSettings || {}
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
          disabled={isNew || btn_sign?.readOnly || disabled}
          startIcon={
            <DescriptionIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={handles.sign}
        >
          Подписать
        </Button>
        <CustomButton
          sx={{ fontWeight: 600, paddingX: 2 }}
          // withRuToken
          disabled={isNew || btn_sendtoresolution?.readOnly || disabled}
          startIcon={
            <FileOpenIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={() => handles.sendToResolution()}
        >
          Отправить на резолюцию
        </CustomButton>

        <CustomButton
            sx={{ fontWeight: 600, paddingX: 2 }}
            // withRuToken
            disabled={isNew || btn_rejectDocument?.readOnly || disabled}
            startIcon={
              <CancelIcon
                width="16px"
                height="16px"
                fill="currentColor"
                stroke="none"
              />
            }
            onClick={() => handles.rejectDocument()}
          >
            Отклонить документ
          </CustomButton>


        <CustomButton
          sx={{ fontWeight: 600, paddingX: 2 }}
          // withRuToken
          disabled={isNew || btn_changePayState?.readOnly || disabled}
          startIcon={
            <Edit
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={() => handles.changePatState()}
        >
          Изменить статус оплаты
        </CustomButton>
        <Button
          sx={{ fontWeight: 600, paddingX: 2 }}
          disabled={isNew || btn_close?.readOnly || disabled}
          startIcon={
            <CancelIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={() => {
            handles.close()
          }}
        >
          Закрыть
        </Button>
      </div>
    </div>
    {children}
  </div>
  );
};
