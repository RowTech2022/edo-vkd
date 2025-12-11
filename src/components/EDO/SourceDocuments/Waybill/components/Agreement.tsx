import { FC } from "react";
import { Button } from "@mui/material";
import {
  AngleDoubleLeftIcon,
  Card,
  DiskIcon,
  FileDeleteIcon,
  SearchIcon,
 CustomButton } from "@ui";

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";
import { WayBillStatus } from "@root/components/EDO/Status/Status";
import { useSignWaybillMutation } from "@services/waybillsApi";

interface IAgreement {
  entry?: Waybills.Waybill;
  canSave?: boolean;
  create?: boolean;
  penHandlers: any;
  handlePenClick: () => void;
}

export const Agreement: FC<IAgreement> = ({
  entry,
  canSave,
  create,
  penHandlers,
  handlePenClick,
}) => {
  const navigate = useNavigate();

  const states = WayBillStatus();

  // mutations
  const [signList] = useSignWaybillMutation();

  const handleDelete = () => {};

  const handleSign = () => {
    if (entry) {
      toast.promise(
        signList({
          id: entry.id,
          currentState: entry.state,
          timestamp: entry.timestamp,
        }),
        {
          pending: "Карточка подписывается",
          success: "Карточка подписана",
          error: "Произошла ошибка",
        }
      );
    }
  };

  return (
    <Card title="Договор">
      <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
        <Button
          startIcon={
            <AngleDoubleLeftIcon
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
        <Button
          type="submit"
          disabled={
            entry?.transitions.buttonSettings.btn_save.readOnly || !canSave
          }
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
        <Button
          disabled={
            create || entry?.transitions.buttonSettings.btn_delete.readOnly
          }
          startIcon={
            <FileDeleteIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={handleDelete}
        >
          Удалить документ
        </Button>
        <CustomButton
          withRuToken
          startIcon={
            <FileDeleteIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          disabled={
            create || entry?.transitions.buttonSettings.btn_sign.readOnly
          }
          {...penHandlers}
          onClick={() => {
            handlePenClick();
            handleSign();
          }}
        >
          Подписать
        </CustomButton>
        <Button
          startIcon={
            <SearchIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          disabled={
            create || entry?.transitions.buttonSettings.btn_undo.readOnly
          }
        >
          Отклонить
        </Button>
      </div>
      <StateIndicatorBase
        states={states}
        activeState={entry?.state || 1}
        endStatus={4}
      />
    </Card>
  );
};
