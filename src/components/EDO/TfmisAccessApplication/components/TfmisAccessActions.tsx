import { Button } from "@mui/material";
import {
  ChevronLeftIcon,
  Card,
  DiskIcon,
  FileDeleteIcon,
  PencilIcon,
  CrossCircleIcon,
  CustomButton,
} from "@ui";
import { FC } from "react";
import { SignType } from "../helpers/constants";
import { FormikProps } from "formik";
import { InitialValuesType } from "../helpers/schema";
import { toast } from "react-toastify";
import { useDeleteTFMISAccessApplicationMutation } from "@services/tfmisApi";
import { TfmisAccessApplicationStateIndicator } from "@root/components";
import { useNavigate } from "react-router";

interface ITfmisAccessActions {
  entry?: TFMIS.AccessApplication;
  canSave?: boolean;
  create?: boolean;
  formik: FormikProps<InitialValuesType>;
  setRejectModalOpen: (open: boolean) => void;
  handleSignSignatureBody: (type: SignType) => void;
}

export const TfmisAccessActions: FC<ITfmisAccessActions> = ({
  entry,
  canSave,
  create,
  formik,
  setRejectModalOpen,
  handleSignSignatureBody,
}) => {
  const navigate = useNavigate();

  const [deleteApplication] = useDeleteTFMISAccessApplicationMutation();

  const handleDeleteApplication = async () => {
    try {
      if (entry) {
        toast.promise(
          deleteApplication({
            id: entry.id,
            timestamp: entry.timestamp,
          }),
          {
            pending: "Заявка удаляется",
            success: "Заявка удалена",
            error: "Произошла ошибка",
          }
        );
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <Card title="Новая заявка МФ РТ">
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
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={() => {
                formik.submitForm();
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
              onClick={handleDeleteApplication}
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
                handleSignSignatureBody(SignType.Sardor);
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
        <div className="stages">
          <TfmisAccessApplicationStateIndicator
            activeState={entry?.state ? entry?.state : 1}
            endStatus={8}
          />
        </div>
      </div>
    </Card>
  );
};
