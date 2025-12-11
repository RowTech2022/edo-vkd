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
import ActStateIndicator from "../../../ActStateIndicator";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useSignActMutation } from "@services/ActApi";

interface IProxyForm {
  entry?: Act.Act;
  canSave?: boolean;
  create?: boolean;
  setRejectModalOpen: (open: boolean) => void;
}

export const ProxyForm: FC<IProxyForm> = ({
  entry,
  canSave,
  create,
  setRejectModalOpen,
}) => {
  const navigate = useNavigate();

  // mutations
  const [signList] = useSignActMutation();

  const handleAprove = (approve?: boolean) => {
    if (entry) {
      toast.promise(
        signList({
          id: entry.id,
          currentState: entry.state,
          timestamp: entry.timestamp,
        }),
        {
          pending: `Акт ${approve ? "одобрается" : "утверждается"}`,
          success: `Акт ${approve ? "одобрена" : "утверждена"}`,
          error: "Произошла ошибка",
        }
      );
    }
  };

  const handleDelete = () => {};

  const docClose = () => {};

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
          onClick={() => handleAprove()}
        >
          Утвердить
        </CustomButton>
        <Button
          disabled={entry?.transitions.buttonSettings.btn_sign.readOnly}
          startIcon={
            <FileDeleteIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={() => handleAprove(true)}
        >
          Одобрить
        </Button>
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
      <ActStateIndicator activeState={entry?.state || 0} endStatus={4} />
    </Card>
  );
};
