import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  useSaveSignaturesSampleCardMutation,
  useUpdateSignaturesSampleCardMutation,
  useDeleteSignaturesSampleCardMutation,
  useSignSignaturesSampleCardMutation,
} from "../../../services/signatureCardApi";
import {
  initialValues,
  InitialValuesType,
  validationSchema,
} from "./helpers/schema";
import { useAnimatedPen } from "@hooks";
import { DocHistories } from "./components/DocHistories";
import { UserVisas } from "./components/UserVisas";
import { SignatureStates, SignType } from "./helpers/constants";
import { GrbsForm } from "./components/GrbsForm";
import { OrganizationInfo } from "./components/OrganizationInfo";
import { SignExamples } from "./components/SignExamples";
import { ActionsWithStatus } from "./components/ActionsWithStatus";
import { RejectModal } from "./modals/RejectModal";
import { useNavigate } from "react-router";

type Props = {
  new?: boolean;
  entry?: SignatureSamples.Card;
};

const SignatureSample = (props: Props) => {
  const navigate = useNavigate();
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [saveSignatureSampleCard] = useSaveSignaturesSampleCardMutation();
  const [updateSignatureSampleCard] = useUpdateSignaturesSampleCardMutation();
  const [deleteSignatureSampleCard] = useDeleteSignaturesSampleCardMutation();
  const [signSignature] = useSignSignaturesSampleCardMutation();

  const canSave = useMemo<boolean>(() => {
    if (props.new) {
      return true;
    }
    if (props.entry && props.entry.state === SignatureStates.Registration) {
      return true;
    }
    return false;
  }, [props]);

  const handleSubmit = async (values: InitialValuesType) => {
    if (props.new) {
      handleSave(values);
    } else if (props.entry) {
      handleUpdate(values);
    }
  };

  const formik = useFormik<InitialValuesType>({
    initialValues: props.new
      ? initialValues
      : ({
          organisationInfo: props.entry?.organisationInfo,
          signatures: props.entry?.signatures,
        } as InitialValuesType),
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSave = async ({
    organisationInfo,
    signatures,
  }: InitialValuesType) => {
    toast.promise(
      async () => {
        const res = await saveSignatureSampleCard({
          organisationInfo,
          signatures,
        });
        if ("data" in res) {
          navigate(
            `/modules/documents/signatures-sample-card/show/${res.data.id}`
          );
        }
      },
      {
        pending: "Карта сохраняется",
        success: "Карта сохранена",
        error: "Произошла ошибка",
      }
    );
  };

  const handleUpdate = async ({
    organisationInfo,
    signatures,
  }: InitialValuesType) => {
    if (props.entry) {
      toast.promise(
        updateSignatureSampleCard({
          id: props.entry.id,
          organisationInfo,
          signatures,
        }),
        {
          pending: "Форма обновляется",
          success: "Форма обновлена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const handleSignSignatureBody = async (type: SignType) => {
    try {
      if (props.entry) {
        toast.promise(
          signSignature({
            id: props.entry.id,
            type: type,
            timestamp: props.entry.timestamp,
          }).then((c: any) => {
            if (c.error?.data?.StatusCode !== undefined) {
              toast.error(
                "Ошибка при подписание документа: \n" +
                  JSON.stringify(c.error?.data?.Message)
              );
            } else toast.success("Карта утверждена");
          }),
          {
            pending: "Карта утверждается",
          }
        );
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  const handleDeleteSignature = async () => {
    try {
      if (props.entry) {
        toast.promise(
          deleteSignatureSampleCard({
            id: props.entry.id,
            timestamp: props.entry.timestamp,
          }),
          {
            pending: "Карточка удаляется",
            success: "Карточка удалена",
            error: "Произошла ошибка",
          }
        );
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  const { iconContent, handlePenClick, ...penHandlers } = useAnimatedPen();

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="tw-flex tw-flex-col tw-gap-4 tw-mb-4 tw-relative"
      >
        {iconContent}

        <ActionsWithStatus
          entry={props.entry}
          formik={formik}
          canSave={canSave}
          handleSignSignatureBody={handleSignSignatureBody}
          handleDeleteSignature={handleDeleteSignature}
          setRejectModalOpen={setRejectModalOpen}
        />

        <OrganizationInfo formik={formik} canSave={canSave} />

        <SignExamples
          entry={props.entry}
          formik={formik}
          canSave={canSave}
          penHandlers={penHandlers}
          handlePenClick={handlePenClick}
          handleSignSignatureBody={handleSignSignatureBody}
        />

        <GrbsForm
          entry={props.entry}
          formik={formik}
          canSave={canSave}
          penHandlers={penHandlers}
          handlePenClick={handlePenClick}
          handleSignSignatureBody={handleSignSignatureBody}
        />

        <UserVisas visas={props.entry?.userVisas} />

        <DocHistories histories={props.entry?.documentHistories} />
      </form>

      <div id="modals">
        <RejectModal
          entry={props.entry}
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
        />
      </div>
    </>
  );
};

export default SignatureSample;
