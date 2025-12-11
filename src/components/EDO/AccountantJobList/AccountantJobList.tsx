import { useMemo } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  useSaveAccountantResponsibilitiesMutation,
  useSignAccountantResponsibilitiesMutation,
  useUpdateAccountantResponsibilitiesMutation,
} from "@services/accountantApi";
import {
  initialValues,
  InitialValuesType,
  validationSchema,
} from "./helpers/schema";
import { useAnimatedPen } from "@hooks";
import { UserVisas } from "./components/UserVisas";
import { DocHistories } from "./components/DocHistories";
import { RejectModal } from "./modals/RejectModal";
import { AccountantJobResponsibilitiesListStates } from "./helpers/constants";
import { BOInfo } from "./components/BOInfo";
import { OrganizationInfo } from "./components/OrganizationInfo";
import { AccountantResponsibilities } from "./components/AccountantResponsibities";
import { useNavigate } from "react-router";

type Props = {
  new?: boolean;
  entry?: Accountant.JobResponsibilities;
};

const AccountantJobList = (props: Props) => {
  const navigate = useNavigate();

  const [saveList] = useSaveAccountantResponsibilitiesMutation();
  const [updateList] = useUpdateAccountantResponsibilitiesMutation();
  const [signList] = useSignAccountantResponsibilitiesMutation();

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new ||
        (props.entry &&
          props.entry.state ===
            AccountantJobResponsibilitiesListStates.Registration)
    );
  }, [props]);

  const handleSave = ({
    year,
    bo_Signature,
    bo_SignatureTime,
    infoCartSignaturas,
  }: InitialValuesType) => {
    toast.promise(
      async () => {
        const res = await saveList({
          year,
          bo_Signature,
          bo_SignatureTime,
          infoCartSignaturas,
        });
        if ("data" in res) {
          navigate(`/modules/documents/chief-accountant-job-responsibilities`);
        }
      },
      {
        pending: "Лист сохраняется",
        success: "Лист сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const handleSignSignatureBody = async (id: number) => {
    try {
      if (props.entry) {
        toast.promise(
          signList({
            id: props.entry.id,
            timestamp: props.entry.timestamp,
            currentState: props.entry.state,
            type: 1,
          }).then((c: any) => {
            if (c.error?.data?.StatusCode !== undefined) {
              toast.error(
                "Ошибка при подписание документа: \n" +
                  JSON.stringify(c.error?.data?.Message)
              );
            } else toast.success("Карта подписана");
          }),
          {
            pending: "Карта подписывается",
          }
        );
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  const handleUpdate = ({
    year,
    bo_Signature,
    bo_SignatureTime,
    infoCartSignaturas,
  }: InitialValuesType) => {
    if (props.entry) {
      toast.promise(
        updateList({
          id: props.entry.id,
          year,
          bo_Signature,
          bo_SignatureTime,
          infoCartSignaturas,
        }),
        {
          pending: "Лист обновляется",
          success: "Лист обновлён",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const formik = useFormik({
    initialValues: props.new
      ? initialValues
      : ({
          info: props.entry?.info,
          year: props.entry?.year,
          bo_Signature: props.entry?.bo_Signature,
          bo_SignatureTime: props.entry?.bo_SignatureTime,
          infoCartSignaturas: props.entry?.infoCartSignaturas,
        } as InitialValuesType),
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
      }
    },
  });

  const { handleSubmit } = formik;

  const { iconContent, handlePenClick, ...penHandlers } = useAnimatedPen();

  return (
    <>
      <form
        className="tw-flex tw-flex-col tw-gap-4 tw-mb-4 tw-relative"
        onSubmit={handleSubmit}
      >
        {iconContent}
        <AccountantResponsibilities
          formik={formik}
          entry={props.entry}
          create={props.new}
          canSave={canSave}
        />
        <OrganizationInfo formik={formik} canSave={canSave} />
        <BOInfo
          formik={formik}
          signBtnDisabled={
            props.new ||
            props.entry?.transitions.buttonSettings.btn_signBo.readOnly
          }
          handleSignSignatureBody={handleSignSignatureBody}
          penHandlers={penHandlers}
          handlePenClick={handlePenClick}
        />
        <UserVisas visas={props.entry?.userVisas} />
        <DocHistories histories={props.entry?.documentHistories} />
      </form>
      <RejectModal id={props.entry?.id} timestamp={props.entry?.timestamp} />
    </>
  );
};
export default AccountantJobList;
