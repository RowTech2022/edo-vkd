import { InvoiceProductSelector } from "@components";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  useSaveWaybillMutation,
  useUpdateWaybillMutation,
  useRejectWaybillMutation,
  WaybillProductDTO,
} from "@services/waybillsApi";
import { useAnimatedPen } from "@hooks";
import { WaybillStates } from "../helpers/constants";
import {
  waybillInitialValues,
  WaybillInitialValuesType,
} from "../helpers/schema";
import { RejectModal } from "../modals/RejectModal";
import { DocHistories } from "./components/DocHistories";
import { UserVisas } from "./components/UserVisas";
import { GoodsAndServices } from "./components/GoodsAndServices";
import { MainInfo } from "./components/MainInfo";
import { AgreementDetails } from "./components/AgreementDetails";
import { Agreement } from "./components/Agreement";

type Props = {
  new?: boolean;
  entry?: Waybills.Waybill;
};

const WaybillPage = (props: Props) => {
  const navigate = useNavigate();
  const [rejectAccessForm] = useRejectWaybillMutation();
  const [productSelectorOpen, setProductSelectorOpen] =
    useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<WaybillProductDTO[]>(
    props?.entry?.products || []
  );
  const [saveList] = useSaveWaybillMutation();
  const [updateList] = useUpdateWaybillMutation();

  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new ||
        (props.entry && props.entry.state === WaybillStates.Registration)
    );
  }, [props]);

  const [total, setTotal] = useState(props.entry?.summa || 0);

  const handleSave = ({
    docNo,
    date,
    contract,
    proxies,
    through,
    letBy,
    letDate,
    acceptedBy,
    acceptedDate,
    summa,
  }: WaybillInitialValuesType) => {
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
              taxPercent: element.taxPercent,
              taxSumma: element.taxSumma,
              total: element.total,
            };
          }) || null;

        const res = await saveList({
          docNo,
          date,
          contract,
          proxies,
          through,
          letBy,
          letDate,
          acceptedBy,
          acceptedDate,
          summa,
          products: newusers,
        });
        if ("data" in res) {
          navigate(`/modules/source-documents/waybills/show/${res.data.id}`);
        }
      },
      {
        pending: "Лист сохраняется",
        success: "Лист сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const handleUpdate = ({
    docNo,
    date,
    contract,
    proxies,
    through,
    letBy,
    letDate,
    acceptedBy,
    acceptedDate,
    summa,
  }: WaybillInitialValuesType) => {
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
            taxPercent: element.taxPercent,
            taxSumma: element.taxSumma,
            total: element.total,
          };
        }) || null;
      toast.promise(
        updateList({
          id: props.entry.id,
          docNo,
          date,
          contract,
          proxies,
          through,
          letBy,
          letDate,
          acceptedBy,
          acceptedDate,
          summa,
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

  const formik = useFormik({
    initialValues: props.new
      ? waybillInitialValues
      : ({
          docNo: props.entry?.docNo,
          date: props.entry?.date,
          contract: props.entry?.contract,
          proxies: props.entry?.proxies,
          through: props.entry?.through,
          letBy: props.entry?.letBy,
          letDate: props.entry?.letDate,
          acceptedBy: props.entry?.acceptedBy,
          acceptedDate: props.entry?.acceptedDate,
          summa: props.entry?.summa,
        } as WaybillInitialValuesType),
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
      <form className="tw-flex tw-flex-col tw-gap-4" onSubmit={handleSubmit}>
        <Agreement
          entry={props.entry}
          canSave={canSave}
          create={props.new}
          penHandlers={penHandlers}
          handlePenClick={handlePenClick}
        />
        <AgreementDetails formik={formik} canSave={canSave} />
        <MainInfo formik={formik} canSave={canSave} />
        <GoodsAndServices
          total={total}
          setTotal={setTotal}
          canSave={canSave}
          selectedProducts={selectedProducts}
          setProductSelectorOpen={setProductSelectorOpen}
          setSelectedProducts={setSelectedProducts}
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
      <div id="modals">
        <InvoiceProductSelector
          open={productSelectorOpen}
          onSelected={(docs) => {
            let newusers = docs.map((element) => {
              return {
                id: element.id,
                productId: element.id,
                name: element.name,
                measure: element.measure,
                count: 0,
                price: 0,
                taxPercent: 0,
                taxSumma: 0,
                total: 0,
              } as WaybillProductDTO;
            });

            let toAdd = newusers
              .filter(
                (b) =>
                  !selectedProducts.find((s) => b.productId === s.productId)
              )
              .concat(selectedProducts);
            setSelectedProducts(toAdd);
            setProductSelectorOpen(false);
          }}
          onClose={() => {
            setProductSelectorOpen(false);
          }}
        />
      </div>
    </>
  );
};

export default WaybillPage;
