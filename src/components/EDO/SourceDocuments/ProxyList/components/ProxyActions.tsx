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
import { useSignInvoiceMutation } from "@services/invoiceApi";
import { toast } from "react-toastify";
import { ProxyStateIndicator } from "@components";

interface IProxyActions {
  entry?: Proxies.Proxy;
  canSave?: boolean;
  create?: boolean;
  penHandlers: any;
  handlePenClick: () => void;
  setRejectModalOpen: (open: boolean) => void;
  docClose: () => void;
}

export const ProxyActions: FC<IProxyActions> = ({
  entry,
  canSave,
  create,
  penHandlers,
  handlePenClick,
  setRejectModalOpen,
  docClose,
}) => {
  const navigate = useNavigate();

  // mutations
  const [signList] = useSignInvoiceMutation();

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
          pending: "Счет-Фактура подписывается",
          success: "Счет-Фактура подписана",
          error: "Произошла ошибка",
        }
      );
    }
  };

  return (
    <Card title="Доверенность">
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
          onClick={docClose}
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
          disabled={entry?.transitions.buttonSettings.btn_sign.readOnly}
          startIcon={
            <FileDeleteIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          {...penHandlers}
          onClick={() => {
            handleSign();
            handlePenClick();
          }}
        >
          Подписать
        </CustomButton>
        <Button
          disabled={entry?.transitions.buttonSettings.btn_undo.readOnly}
          startIcon={
            <SearchIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={() => {
            setRejectModalOpen(true);
          }}
        >
          Отклонить
        </Button>
      </div>
      <ProxyStateIndicator activeState={entry?.state || 1} endStatus={3} />
    </Card>
  );
};
