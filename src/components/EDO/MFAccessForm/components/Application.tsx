import { FC } from "react";
import { Button } from "@mui/material";
import {
  ChevronLeftIcon,
  Card,
  CrossCircleIcon,
  DiskIcon,
  FileDeleteIcon,
  PencilIcon,
 CustomButton } from "@ui";
import { SignType } from "../helpers/constants";
import { useNavigate } from "react-router";
import { FormikProps } from "formik";
import { InitialValuesType } from "../helpers/schema";
import { toast } from "react-toastify";
import { useDeleteMFAccessFormMutation } from "@services/accessMfApi";
import MfAccessFormStateIndicator from "../../MfAccessFormStateIndicator";

interface IApplication {
  formik: FormikProps<InitialValuesType>;
  entry?: MF.AccessForm;
  create?: boolean;
  canSave?: boolean;
  penHandlers: any;
  handlePenClick: () => void;
  handleSignSignatureBody: (type: SignType) => void;
  setRejectModalOpen: (val: boolean) => void;
}

export const Application: FC<IApplication> = ({
  formik,
  entry,
  create,
  canSave,
  penHandlers,
  handlePenClick,
  handleSignSignatureBody,
  setRejectModalOpen,
}) => {
  const navigate = useNavigate();

  const [deleteAccessForm] = useDeleteMFAccessFormMutation();

  const handleDeleteForm = () => {
    if (entry) {
      toast.promise(
        deleteAccessForm({
          id: entry.id,
          timestamp: entry.timestamp,
        }),
        {
          pending: "Форма удаляется",
          success: "Форма удалена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  return (
    <Card title="Заявка">
      <div className="mf_block_bg tw-overflow-hidden">
        <div className="tw-flex tw-justify-between tw-py-3 tw-px-4 tw-shadow-[0_0_4px_0_#00000025] tw-mb-4">
          <Button
            sx={{ fontWeight: 600, paddingX: 2 }}
            startIcon={
              <ChevronLeftIcon
                width="18px"
                height="18px"
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
              sx={{ fontWeight: 600, paddingX: 2 }}
              disabled={
                entry?.transitions.buttonSettings.btn_save.readOnly || !canSave
              }
              startIcon={
                <DiskIcon
                  width="18px"
                  height="18px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={() => {
                formik.submitForm();
                console.log("ErrosOnSubmit: ", formik.errors);
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
                  width="18px"
                  height="18px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={handleDeleteForm}
            >
              Удалить документ
            </Button>
            <CustomButton
              sx={{ fontWeight: 600, paddingX: 2 }}
              withRuToken
              disabled={
                create ||
                entry?.transitions.buttonSettings.btn_sign_kurator.readOnly
              }
              startIcon={
                <PencilIcon
                  width="18px"
                  height="18px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              {...penHandlers}
              onClick={(el) => {
                handleSignSignatureBody(SignType.Kurator);
                handlePenClick();
              }}
            >
              Подписать
            </CustomButton>
            <CustomButton
              sx={{ fontWeight: 600, paddingX: 2 }}
              withRuToken
              disabled={
                create ||
                entry?.transitions.buttonSettings.btn_sign_head.readOnly
              }
              startIcon={
                <PencilIcon
                  width="18px"
                  height="18px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={(el) => {
                handleSignSignatureBody(SignType.Rukovoditel);
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
                  width="18px"
                  height="18px"
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
        <MfAccessFormStateIndicator
          activeState={entry?.state || 1}
          endStatus={4}
        />
      </div>
    </Card>
  );
};
