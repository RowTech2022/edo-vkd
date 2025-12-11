import { FC } from "react";
import { Button } from "@mui/material";
import {
  ChevronLeftIcon,
  Card,
  CrossCircleIcon,
  DiskIcon,
  FileDeleteIcon,
  PencilIcon,
  CustomButton,
} from "@ui";

import { FormikProps } from "formik";
import { InitialValuesType } from "../helpers/schema";
import { SignType } from "../helpers/constants";
import { useNavigate } from "react-router";
import { SignatureSampleStateIndicator } from "@components";

interface IActionsWithStatus {
  entry?: SignatureSamples.Card;
  formik: FormikProps<InitialValuesType>;
  canSave?: boolean;
  create?: boolean;
  handleSignSignatureBody: (type: SignType) => void;
  handleDeleteSignature: () => void;
  setRejectModalOpen: (value: boolean) => void;
}

export const ActionsWithStatus: FC<IActionsWithStatus> = ({
  entry,
  formik,
  canSave,
  create,
  handleSignSignatureBody,
  handleDeleteSignature,
  setRejectModalOpen,
}) => {
  const navigate = useNavigate();

  const routeBack = () => {
    navigate(`/modules/documents/signatures-sample-card/`);
  };

  return (
    <Card title="Карточка образцов подписей">
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
            onClick={routeBack}
          >
            Назад
          </Button>
          <div className="tw-flex tw-flex-wrap tw-gap-4">
            <Button
              sx={{ fontWeight: 600, paddingX: 2 }}
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
              onClick={() => {
                formik.submitForm();
                console.log("ErrorsOnSubmit: ", formik.errors);
              }}
            >
              Сохранить
            </Button>
            <Button
              sx={{ fontWeight: 600, paddingX: 2 }}
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
              onClick={handleDeleteSignature}
            >
              Удалить документ
            </Button>
            <CustomButton
              sx={{ fontWeight: 600, paddingX: 2 }}
              withRuToken
              disabled={
                create || entry?.transitions.buttonSettings.btn_approve.readOnly
              }
              startIcon={
                <PencilIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={(el) => {
                handleSignSignatureBody(SignType.GrbsApprove);
              }}
            >
              Утвердить
            </CustomButton>
            <Button
              sx={{ fontWeight: 600, paddingX: 2 }}
              disabled={
                create || entry?.transitions.buttonSettings.btn_undo.readOnly
              }
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
        </div>
        <SignatureSampleStateIndicator
          activeState={entry?.state || 1}
          endStatus={200}
        />
      </div>
    </Card>
  );
};
