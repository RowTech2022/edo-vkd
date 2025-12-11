import { useFormik } from "formik";
import { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  useSaveInvoiceMutation,
  useUpdateInvoiceMutation,
  useRejectInvoiceMutation,
  InvoiceProductDTO,
} from "@services/invoiceApi";
import { useAnimatedPen } from "@hooks";
import { InvoiceStates } from "../helpers/constants";
import {
  invoiceListInitialValues,
  InvoiceListInitialValuesType,
} from "../helpers/schema";
import { RejectModal } from "../modals/RejectModal";
import { DocHistories } from "./components/DocHistories";
import { UserVisas } from "./components/UserVisas";
import { GoodsAndServices } from "./components/GoodsAndServices";
import { Notes } from "./components/Notes";
import { MainInfo } from "./components/MainInfo";
import { AgreementDetails } from "./components/AgreementDetails";
import { AgreementActions } from "./components/AgreementActions";
import { Registries } from "./components/Registries";
import { useNavigate } from "react-router";
import { InvoiceProductSelector } from "@components";

type Props = {
  new?: boolean;
  entry?: Invoices.Invoice;
};

const InvoiceList = (props: Props) => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(props.entry?.summa || 0);
  const [productSelectorOpen, setProductSelectorOpen] =
    useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<InvoiceProductDTO[]>(
    props?.entry?.products || []
  );

  const [saveList] = useSaveInvoiceMutation();
  const [updateList] = useUpdateInvoiceMutation();
  const [reject] = useRejectInvoiceMutation();

  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new ||
        (props.entry && props.entry.state === InvoiceStates.Registartion)
    );
  }, [props]);

  const formik = useFormik({
    initialValues: props.new
      ? invoiceListInitialValues
      : ({
          serial: props.entry?.serial,
          docNo: props.entry?.docNo,
          date: props.entry?.date,
          contract: props.entry?.contract,
          summa: props.entry?.summa,
          notes: props.entry?.notes,
          invoiceTaxes: props.entry?.invoiceTaxes,
        } as InvoiceListInitialValuesType),
    onSubmit: (values) => {
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
      }
    },
  });

  const { handleSubmit } = formik;

  const handleUpdate = ({
    serial,
    docNo,
    date,
    contract,
    summa,
    notes,
    invoiceTaxes,
  }: InvoiceListInitialValuesType) => {
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
          serial,
          docNo,
          date,
          contract,
          summa,
          notes,
          invoiceTaxes,
          products: newusers,
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Счет-Фактура обновляется",
          success: "Счет-Фактура обновлён",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const handleSave = ({
    serial,
    docNo,
    date,
    contract,
    summa,
    notes,
    invoiceTaxes,
  }: InvoiceListInitialValuesType) => {
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
          serial,
          docNo,
          date,
          contract,
          summa,
          notes,
          invoiceTaxes,
          products: newusers,
        });
        if ("data" in res) {
          navigate(`/modules/source-documents/invoices/show/${res.data.id}`);
        }
      },
      {
        pending: "Счет-Фактура сохраняется",
        success: "Счет-Фактура сохранена",
        error: "Произошла ошибка",
      }
    );
  };

  const onSelectDocs = (docs: Products.ProductShort[]) => {
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
      } as InvoiceProductDTO;
    });
    let toAdd = newusers
      .filter((b) => !selectedProducts.find((s) => b.productId === s.productId))
      .concat(selectedProducts);
    setSelectedProducts(toAdd);
    setProductSelectorOpen(false);
  };

  const { iconContent, handlePenClick, ...penHandlers } = useAnimatedPen();

  return (
    <>
      <form
        className="tw-flex tw-flex-col tw-gap-4 tw-relative"
        onSubmit={handleSubmit}
      >
        {iconContent}

        <AgreementActions
          entry={props.entry}
          canSave={canSave}
          create={props.new}
          penHandlers={penHandlers}
          handlePenClick={handlePenClick}
          setRejectModalOpen={setRejectModalOpen}
        />
        <AgreementDetails canSave={canSave} formik={formik} />
        <MainInfo formik={formik} />
        <Registries formik={formik} canSave={canSave} />
        <Notes canSave={canSave} formik={formik} />
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
          type={6}
          rejectAccessForm={reject}
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
        />
      </div>
      <div id="modals">
        <InvoiceProductSelector
          open={productSelectorOpen}
          onSelected={onSelectDocs}
          onClose={() => {
            setProductSelectorOpen(false);
          }}
        />
      </div>
    </>
  );
};

export default InvoiceList;
