import { FormikProps } from "formik";
import { FC } from "react";
import { InitialValuesType } from "../helpers/schema";
import { Button } from "@mui/material";
import {
  ChevronLeftIcon,
  Card,
  DiskIcon,
  FileDeleteIcon,
  PencilIcon,
  CustomButton,
} from "@ui";
import { toast } from "react-toastify";
import {
  useDeleteAccountantResponsibilitiesMutation,
  useSignAccountantResponsibilitiesMutation,
} from "@services/accountantApi";
import AccountantJobListStateIndicator from "../../AccountantJobListStateIndicator";
import { useNavigate } from "react-router";

interface IAccountantResponsibilities {
  formik: FormikProps<InitialValuesType>;
  canSave: boolean;
  create?: boolean;
  entry?: Accountant.JobResponsibilities;
}

export const AccountantResponsibilities: FC<IAccountantResponsibilities> = ({
  formik,
  canSave,
  create,
  entry,
}) => {
  const navigate = useNavigate();
  const { errors, submitForm } = formik;

  // mutations
  const [signList] = useSignAccountantResponsibilitiesMutation();
  const [deleteList] = useDeleteAccountantResponsibilitiesMutation();

  const routeBack = () => {
    navigate(`/modules/documents/chief-accountant-job-responsibilities/`);
  };

  const handleSign = () => {
    if (entry) {
      toast.promise(
        signList({
          id: entry.id,
          currentState: entry.state,
          timestamp: entry.timestamp,
          type: 1,
        }),
        {
          pending: "Карточка утверждается",
          success: "Карточка утверждена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const handleDelete = () => {
    if (entry) {
      toast.promise(
        deleteList({
          id: entry?.id,
          timestamp: entry?.timestamp,
        }),
        {
          pending: "Карточка удаляется",
          success: "Карточка удалена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const btnSettings = entry?.transitions.buttonSettings;

  return (
    <Card title="Лист должностных обязанностей бухгалтера">
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
              disabled={btnSettings?.btn_save.readOnly || !canSave}
              startIcon={
                <DiskIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={() => {
                submitForm();
              }}
            >
              Сохранить
            </Button>
            <Button
              sx={{ fontWeight: 600, paddingX: 2 }}
              disabled={create || btnSettings?.btn_delete.readOnly}
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
              sx={{ fontWeight: 600, paddingX: 2 }}
              withRuToken
              disabled={create || btnSettings?.btn_sign.readOnly}
              startIcon={
                <PencilIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={handleSign}
            >
              Утвердить
            </CustomButton>
          </div>
        </div>
        <AccountantJobListStateIndicator
          activeState={entry?.state || 1}
          endStatus={200}
        />
      </div>
    </Card>
  );
};
