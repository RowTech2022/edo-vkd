import { InvoiceProductSelector } from "@components";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  useSaveProxyMutation,
  useUpdateProxyMutation,
  useRejectProxyMutation,
 ProxyProductDTO } from "@services/proxyApi";
import { useAnimatedPen } from "@hooks";
import { ProxyStates } from "../helpers/constants";
import {
  proxyListInitialValues,
  ProxyListInitialValuesType,
} from "../helpers/schema";
import { RejectModal } from "../modals/RejectModal";
import { DocHistories } from "./components/DocHistories";
import { UserVisas } from "./components/UserVisas";
import { GoodsAndServices } from "./components/GoodsAndServices";
import { MainInfo } from "./components/MainInfo";
import { ProxyDetails } from "./components/ProxyDetails";
import { ProxyActions } from "./components/ProxyActions";

type Props = {
  new?: boolean;
  entry?: Proxies.Proxy;
};

const ProxyList = (props: Props) => {
  const navigate = useNavigate();
  const [productSelectorOpen, setProductSelectorOpen] =
    useState<boolean>(false);
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<ProxyProductDTO[]>(
    props?.entry?.products || []
  );

  const [saveList] = useSaveProxyMutation();
  const [updateList] = useUpdateProxyMutation();
  const [reject] = useRejectProxyMutation();

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new ||
        (props.entry && props.entry.state === ProxyStates.Registartion)
    );
  }, [props]);

  const docClose = () => {};

  const formik = useFormik<any>({
    initialValues: props.new
      ? proxyListInitialValues
      : ({
          docNo: props.entry?.docNo,
          date: props.entry?.date,
          validUntil: props.entry?.validUntil,
          passSeries: props.entry?.passSeries,
          passIssued: props.entry?.passIssued,
          passIssuedBy: props.entry?.passIssuedBy,
          fio: props.entry?.fio,
          position: props.entry?.position,
          contract: props.entry?.contract,
          invoice: props.entry?.invoice,
        } as ProxyListInitialValuesType),
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
    docNo,
    date,
    validUntil,
    passSeries,
    passIssued,
    passIssuedBy,
    fio,
    position,
    contract,
    invoice,
  }: ProxyListInitialValuesType) => {
    if (props.entry) {
      let newusers =
        selectedProducts?.map((element) => {
          return {
            id: element.id,
            productId: element.productId,
            name: element.name,
            measure: element.measure,
            count: element.count,
            countText: element.countText,
          };
        }) || null;

      toast.promise(
        updateList({
          id: props.entry.id,
          docNo,
          date,
          validUntil,
          passSeries,
          passIssued,
          passIssuedBy,
          fio,
          position,
          contract,
          invoice,
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

  const handleSave = ({
    docNo,
    date,
    validUntil,
    passSeries,
    passIssued,
    passIssuedBy,
    fio,
    position,
    contract,
    invoice,
  }: ProxyListInitialValuesType) => {
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
              countText: element.countText,
            };
          }) || null;
        const res = await saveList({
          docNo,
          date,
          validUntil,
          passSeries,
          passIssued,
          passIssuedBy,
          fio,
          position,
          contract,
          invoice,
          products: newusers,
        });
        if ("data" in res) {
          navigate(`/modules/source-documents/proxies/show/${res.data.id}`);
        }
      },
      {
        pending: "Лист сохраняется",
        success: "Лист сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const onSelectDocs = (docs: Products.ProductShort[]) => {
    let newusers = docs.map((element) => {
      return {
        id: element.id * -1,
        productId: element.id,
        name: element.name,
        measure: element.measure,
        count: 0,
        countText: "",
      } as ProxyProductDTO;
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
        <ProxyActions
          entry={props.entry}
          canSave={canSave}
          create={props.new}
          penHandlers={penHandlers}
          handlePenClick={handlePenClick}
          setRejectModalOpen={setRejectModalOpen}
          docClose={docClose}
        />
        <ProxyDetails formik={formik} canSave={canSave} />
        <MainInfo formik={formik} canSave={canSave} />
        <GoodsAndServices
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
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          type={7}
          rejectAccessForm={reject}
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

export default ProxyList;
