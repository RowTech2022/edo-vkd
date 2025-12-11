import { Button } from "@mui/material";
import { FC } from "react";
import { SignDocIcon, AcceptIcon, DiskIcon, ChevronLeftIcon } from "@ui";
import { IFinanceReportTransitions } from "@services/financeReport/models/create";
import UndoIcon from "@mui/icons-material/Undo";
import { UndoDocumentType } from "../forms/FinanceReportForm";
import { useNavigate } from "react-router";

interface IActionButtons {
  transitions?: IFinanceReportTransitions;
  isEditMode?: boolean;
  onSubmit: () => void;
  onSign: () => void;
  onAccept: () => void;
  onUndoDoc: (type: UndoDocumentType) => void;
}

export const ActionButtons: FC<IActionButtons> = ({
  transitions,
  isEditMode,
  onSubmit,
  onSign,
  onAccept,
  onUndoDoc,
}) => {
  const { btn_accept, btn_save, btn_sign, btn_undo, btn_reject } =
    transitions?.buttonSettings || {};
  const navigate = useNavigate();
  return (
    <div className="tw-flex tw-justify-between tw-py-3 tw-px-4 tw-shadow-[0_0_4px_0_#00000025] tw-mb-4">
      <Button
        sx={{ fontWeight: 600 }}
        startIcon={
          <ChevronLeftIcon
            width="16px"
            height="16px"
            fill="currentColor"
            stroke="none"
          />
        }
        onClick={() => navigate(-1)}
      >
        Назад
      </Button>
      <div className="tw-flex tw-flex-wrap tw-gap-4">
        <Button
          sx={{ fontWeight: 600 }}
          disabled={btn_save?.readOnly}
          type="submit"
          onClick={onSubmit}
          startIcon={
            <DiskIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
        >
          Сохранить
        </Button>
        {isEditMode && (
          <>
            <Button
              sx={{ fontWeight: 600 }}
              disabled={btn_sign?.readOnly}
              onClick={onSign}
              startIcon={
                <SignDocIcon
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  stroke="none"
                />
              }
            >
              Подписать
            </Button>
            <Button
              sx={{ fontWeight: 600 }}
              disabled={btn_accept?.readOnly}
              onClick={onAccept}
              startIcon={
                <AcceptIcon
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  stroke="none"
                />
              }
            >
              Приянть
            </Button>
            <Button
              sx={{ fontWeight: 600 }}
              disabled={btn_undo?.readOnly}
              onClick={() => onUndoDoc(UndoDocumentType.returnDoc)}
              startIcon={
                <UndoIcon
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  stroke="none"
                />
              }
            >
              Вернуть документ
            </Button>
            <Button
              sx={{ fontWeight: 600 }}
              disabled={btn_reject?.readOnly}
              onClick={() => onUndoDoc(UndoDocumentType.reject)}
              startIcon={
                <UndoIcon
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  stroke="none"
                />
              }
            >
              Отвергунть
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
