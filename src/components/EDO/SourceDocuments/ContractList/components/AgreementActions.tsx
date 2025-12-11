import { FC } from "react";
import { Button } from "@mui/material";
import {
  AngleDoubleLeftIcon,
  Card,
  DiskIcon,
  FileDeleteIcon,
  SearchIcon,
} from "@ui";

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router";
import { useSignActMutation } from "@services/ActApi";
import ContractStateIndicator from "@root/components/EDO/ContractStateIndicator";

interface IAgreementActions {
  entry?: Contracts.Contract;
  canSave?: boolean;
  create?: boolean;
  docShow: () => void;
}

export const AgreementActions: FC<IAgreementActions> = ({
  entry,
  canSave,
  create,
  docShow,
}) => {
  const navigate = useNavigate();

  // mutations
  const [signList] = useSignActMutation();

  const handleDelete = () => {};

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
        <Button
          disabled={create}
          startIcon={
            <SearchIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={docShow}
        >
          Просмотр
        </Button>
      </div>
      <ContractStateIndicator activeState={entry?.state || 1} endStatus={4} />
    </Card>
  );
};
