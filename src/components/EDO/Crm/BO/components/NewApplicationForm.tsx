import { FC } from "react";
import { Button } from "@mui/material";
import {
  Card,
  AngleDoubleLeftIcon,
  DiskIcon,
  FileDeleteIcon,
  PencilIcon,
  CrossCircleIcon,
} from "@ui";

import { TfmisAccessApplicationStateIndicator } from "@components";
import { useNavigate } from "react-router";
import { SignType } from "../helpers/constants";

interface IProps {
  entry?: TFMIS.AccessApplication;
  canSave?: boolean;
  create?: boolean;
  buttonSettings: TFMIS.AccessApplication["transitions"]["buttonSettings"];
  handleSignSignatureBody: (type: SignType) => void;
  handleDeleteApplication: () => void;
  setRejectModalOpen: (open: boolean) => void;
}

export const NewApplicationForm: FC<IProps> = ({
  create,
  canSave,
  entry,
  buttonSettings,
  handleSignSignatureBody,
  handleDeleteApplication,
  setRejectModalOpen,
}) => {
  const navigate = useNavigate();

  return (
    <Card title="Новая заявка МФ РТ">
      <>
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
            disabled={buttonSettings.btn_save.readOnly || !canSave}
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
            disabled={create || buttonSettings.btn_delete.readOnly}
            startIcon={
              <FileDeleteIcon
                width="16px"
                height="16px"
                fill="currentColor"
                stroke="none"
              />
            }
            onClick={handleDeleteApplication}
          >
            Удалить документ
          </Button>
          <Button
            disabled={create || buttonSettings.btn_approve.readOnly}
            startIcon={
              <PencilIcon
                width="16px"
                height="16px"
                fill="currentColor"
                stroke="none"
              />
            }
            onClick={(el) => {
              handleSignSignatureBody(SignType.Sardor);
            }}
          >
            Утвердить
          </Button>
          <Button
            disabled={create || buttonSettings.btn_undo.readOnly}
            startIcon={
              <CrossCircleIcon
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
        <div className="stages">
          <TfmisAccessApplicationStateIndicator
            activeState={entry?.state ? entry?.state : 1}
            endStatus={8}
          />
        </div>
      </>
    </Card>
  );
};
