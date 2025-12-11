import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  ActProductDTO,
  useRejectActMutation,
  useSaveActMutation,
  useUpdateActMutation,
} from "@services/ActApi";
import { ActStates } from "../helpers/constants";
import {
  actListInitialValues,
  ActListInitialValuesType,
} from "../helpers/schema";
import { DocHistories } from "./components/DocHistories";
import { UserVisas } from "./components/UserVisas";
import { GoodsAndServices } from "./components/GoodsAndServices";
import { Notes } from "./components/Notes";
import { MainInfo } from "./components/MainInfo";
import { PerformedWork } from "./components/PerformedWork";
import { ProxyForm } from "./components/ProxyForm";
import { RejectModal } from "../modals/RejectModal";

type Props = {
  new?: boolean;
  entry?: Act.Act;
};

const ActList = (props: Props) => {
  const navigate = useNavigate();
  const [productSelectorOpen, setProductSelectorOpen] =
    useState<boolean>(false);
  const [total, setTotal] = useState(props.entry?.summa || 0);
  const [selectedProducts, setSelectedProducts] = useState<ActProductDTO[]>(
    props?.entry?.products || []
  );

  const [saveList] = useSaveActMutation();
  const [updateList] = useUpdateActMutation();
  const [reject] = useRejectActMutation();
  const [rejectAccessForm] = useRejectActMutation();

  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new || (props.entry && props.entry.state === ActStates.Registartion)
    );
  }, [props]);

  const handleSave = ({
    docNo,
    date,
    contract,
    summa,
    passedBy,
    acceptedBy,
    notes,
  }: ActListInitialValuesType) => {
    toast.promise(
      async () => {
        let newusers =
          selectedProducts?.map((element) => {
            return {
              id: element.id,
              productId: element.productId,
              name: element.name,
              measure: element.measure,
              count: element.count,
              price: element.price,
              total: element.total,
            };
          }) || null;

        const res = await saveList({
          docNo,
          date,
          contract,
          summa,
          passedBy,
          acceptedBy,
          notes,
          products: newusers,
        });
        if ("data" in res) {
          navigate(`/modules/source-documents/act/show/${res.data.id}`);
        }
      },
      {
        pending: "Акт сохраняется",
        success: "Акт сохранена",
        error: "Произошла ошибка",
      }
    );
  };

  const handleUpdate = ({
    docNo,
    date,
    contract,
    summa,
    passedBy,
    acceptedBy,
    notes,
  }: ActListInitialValuesType) => {
    if (props.entry) {
      let newusers =
        selectedProducts?.map((element) => {
          return {
            id: element.id,
            productId: element.productId,
            name: element.name,
            measure: element.measure,
            count: element.count,
            price: element.price,
            total: element.total,
          };
        }) || null;
      toast.promise(
        updateList({
          id: props.entry.id,
          docNo,
          date,
          contract,
          summa,
          passedBy,
          acceptedBy,
          notes,
          products: newusers,
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
  const formik = useFormik<any>({
    initialValues: props.new
      ? actListInitialValues
      : ({
          docNo: props.entry?.docNo,
          date: props.entry?.date,
          contract: props.entry?.contract,
          summa: props.entry?.summa,
          passedBy: props.entry?.passedBy,
          acceptedBy: props.entry?.acceptedBy,
          notes: props.entry?.notes,
          products: props.entry?.products,
        } as ActListInitialValuesType),
    onSubmit: (values) => {
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
      }
    },
  });

  const { handleSubmit } = formik;

  const handleReject = ({
    reason = null,
    comment = "",
  }: {
    reason: { id: string; value: string } | null;
    comment: string;
  }) => {
    if (props.entry) {
      toast.promise(
        reject({
          id: props.entry.id,
          reason: parseInt(reason?.id!),
          comment,
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Доверенность отклоняется",
          success: "Доверенность отклонена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  return (
    <>
      <form className="tw-flex tw-flex-col tw-gap-4" onSubmit={handleSubmit}>
        <ProxyForm
          entry={props.entry}
          canSave={canSave}
          create={props.new}
          setRejectModalOpen={setRejectModalOpen}
        />
        <PerformedWork formik={formik} canSave={canSave} />
        <MainInfo formik={formik} canSave={canSave} />
        <Notes formik={formik} canSave={canSave} />
        <GoodsAndServices
          canSave={canSave}
          total={total}
          selectedProducts={selectedProducts}
          setProductSelectorOpen={setProductSelectorOpen}
          setSelectedProducts={setSelectedProducts}
          setTotal={setTotal}
        />
        <UserVisas visas={props.entry?.userVisas} />
        <DocHistories histories={props.entry?.documentHistories} />
      </form>
      <div id="modals">
        <RejectModal
          type={7}
          rejectAccessForm={rejectAccessForm}
          entry={props.entry}
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
        />
      </div>
    </>
  );
};

export default ActList;
