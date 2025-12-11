import { useFormik } from "formik";
import { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  useSaveTravelExpenseMutation,
  useUpdateTravelExpenseMutation,
  useRejectTravelExpenseMutation,
} from "@services/travelExpensesApi";
import { useAnimatedPen } from "@hooks";
import { TravelStates } from "../helpers/constants";
import {
  travelExpensesInitialValues,
  TravelExpensesInitialValuesType,
} from "../helpers/schema";
import { RejectModal } from "../modals/RejectModal";
import { DocHistories } from "./components/DocHistories";
import { UserVisas } from "./components/UserVisas";
import { MainInfo } from "./components/MainInfo";
import { AgreementDetails } from "./components/AgreementDetails";
import { TravelCertificate } from "./components/TravelCertificate";
import { CertificateFiles } from "./components/CertificateFiles";
import { useNavigate } from "react-router";

type Props = {
  new?: boolean;
  entry?: TravelExpenses.TravelExpense;
};

const ProxyList = (props: Props) => {
  const navigate = useNavigate();
  const [rejectAccessForm] = useRejectTravelExpenseMutation();
  const [saveList] = useSaveTravelExpenseMutation();
  const [updateList] = useUpdateTravelExpenseMutation();

  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new ||
        (props.entry && props.entry.state === TravelStates.Registartion)
    );
  }, [props]);

  const [addTravelExpensesFile, setTravelExpensesFile] = useState<
    TravelExpenses.ITravelFile[]
  >(props?.entry?.files || []);

  const docClose = () => {};

  const addRow = () => {
    let newRow: TravelExpenses.ITravelFile = {
      id: +addTravelExpensesFile.length + 1,
      url: "",
      name: "",
      description: "",
      typeDocument: {
        id: "1",
        value: "",
      },
      createDate: null,
      createBy: "",
    };
    setTravelExpensesFile([...addTravelExpensesFile, newRow]);
  };

  const formik = useFormik<any>({
    initialValues: props.new
      ? travelExpensesInitialValues
      : ({
          docNo: props.entry?.docNo,
          date: props.entry?.date,
          term: props.entry?.term,
          fio: props.entry?.fio,
          position: props.entry?.position,
          passSeries: props.entry?.passSeries,
          passIssued: props.entry?.passIssued,
          passIssuedBy: props.entry?.passIssuedBy,
          organisation: props.entry?.organisation,
          destination: props.entry?.destination,
          purpose: props.entry?.purpose,
          files: addTravelExpensesFile,
        } as TravelExpensesInitialValuesType),
    onSubmit: (values) => {
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
      }
    },
  });

  const { values, handleSubmit } = formik;

  const handleUpdate = ({
    docNo,
    date,
    term,
    fio,
    position,
    passSeries,
    passIssued,
    passIssuedBy,
    organisation,
    destination,
    purpose,
  }: TravelExpensesInitialValuesType) => {
    if (props.entry) {
      toast.promise(
        updateList({
          id: props.entry.id,
          docNo,
          date,
          term,
          fio,
          position,
          passSeries,
          passIssued,
          passIssuedBy,
          organisation,
          destination,
          purpose,
          files: addTravelExpensesFile,
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Лист обновляется",
          success: "Лист обновлён",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const handleSave = ({
    docNo,
    date,
    term,
    fio,
    position,
    passSeries,
    passIssued,
    passIssuedBy,
    organisation,
    destination,
    purpose,
  }: TravelExpensesInitialValuesType) => {
    values.files = addTravelExpensesFile;
    toast.promise(
      async () => {
        const res = await saveList({
          docNo,
          date,
          term,
          fio,
          position,
          passSeries,
          passIssued,
          passIssuedBy,
          organisation,
          destination,
          purpose,
          files: addTravelExpensesFile,
        });
        if ("data" in res) {
          navigate(
            `/modules/source-documents/travel-expenses/show/${res.data.id}`
          );
        }
      },
      {
        pending: "Лист сохраняется",
        success: "Лист сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const { iconContent, handlePenClick, ...penHandlers } = useAnimatedPen();

  return (
    <>
      <form
        className="tw-flex tw-flex-col tw-gap-4 tw-relative"
        onSubmit={handleSubmit}
      >
        {iconContent}
        <TravelCertificate
          entry={props.entry}
          canSave={canSave}
          create={props.new}
          penHandlers={penHandlers}
          handlePenClick={handlePenClick}
          docClose={docClose}
        />
        <AgreementDetails formik={formik} canSave={canSave} />
        <MainInfo formik={formik} canSave={canSave} />
        <CertificateFiles
          canSave={canSave}
          addTravelExpensesFile={addTravelExpensesFile}
          addRow={addRow}
          setTravelExpensesFile={setTravelExpensesFile}
        />
        <UserVisas visas={props.entry?.userVisas} />
        <DocHistories histories={props.entry?.documentHistories} />
      </form>
      <div id="modals">
        <RejectModal
          type={4}
          rejectAccessForm={rejectAccessForm}
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
        />
      </div>
    </>
  );
};

export default ProxyList;
