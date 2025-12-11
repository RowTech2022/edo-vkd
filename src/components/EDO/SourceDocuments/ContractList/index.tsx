import { useFormik } from "formik";
import { useMemo, useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  useSaveContractMutation,
  useUpdateContractMutation,
  useSignContractMutation,
  useSendToSignContractMutation,
  useFetchContractFileQuery,
  useRejectContractMutation,
  ContractProductDTO,
} from "@services/contractsApi";
import { useAnimatedPen } from "@hooks";
import { ContractStates } from "../helpers/constants";
import {
  contractListInitialValues,
  ContractListInitialValuesType,
} from "../helpers/schema";
import { RejectModal } from "../modals/RejectModal";
import { DocHistories } from "./components/DocHistories";
import { UserVisas } from "./components/UserVisas";
import { Notes } from "./components/Notes";
import { GoodsAndServices } from "./components/GoodsAndServices";
import { MainInfo } from "./components/MainInfo";
import { AgreementTemplate } from "./components/AgreementTemplate";
import { AgreementDetails } from "./components/AgreementDetails";
import { AgreementActions } from "./components/AgreementActions";
import { AgreementFiles } from "./components/AgreementFiles";
import { AgreementViewModal } from "../modals/AgreementViewModal";
import { ContractProductSelector } from "@components";
import { useNavigate } from "react-router";

type Props = {
  new?: boolean;
  entry?: Contracts.Contract;
};

const ContractList = (props: Props) => {
  const navigate = useNavigate();
  const [pdf, setPdf] = useState<{
    loading: boolean;
    file?: string;
    filename?: string;
  }>({
    loading: false,
  });

  const [total, setTotal] = useState(props.entry?.mainInformation?.summa || 0);

  const addRow = () => {
    let newRow: Contracts.ContactFile = {
      id: +addContractFile.length + 1,
      url: "",
      name: "",
      desc: "",
      createAt: new Date().toISOString(),
    };
    setAddContractFile([...addContractFile, newRow]);
  };

  const [productSelectorOpen, setProductSelectorOpen] =
    useState<boolean>(false);
  const [dogOpen, setdogOpen] = useState<boolean>(false);
  const [curDoc, setCurDoc] = useState<number>(
    Number(props.entry?.details?.docType?.id || 0)
  );

  const fileResponse = useFetchContractFileQuery(props.entry?.id || 0);

  useEffect(() => {
    setPdf({ loading: true });
    if (fileResponse && fileResponse?.data?.file64) {
      const { file64, fileName } = fileResponse.data;
      const file = `data:application/pdf;base64,${file64}`;
      setPdf({ file, loading: false, filename: fileName });
    }
  }, [fileResponse]);

  const [selectedProducts, setSelectedProducts] = useState<
    ContractProductDTO[]
  >(props?.entry?.products || []);

  const [addContractFile, setAddContractFile] = useState<
    Contracts.ContactFile[]
  >(props?.entry?.files || []);

  const formik = useFormik<any>({
    initialValues: props.new
      ? contractListInitialValues
      : ({
          details: props.entry?.details,
          mainInformation: props.entry?.mainInformation,
          notes: props.entry?.notes,
          files: addContractFile,
        } as ContractListInitialValuesType),
    onSubmit: (values) => {
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
      }
    },
  });
  const { handleSubmit } = formik;

  //ContractDatailDTO
  const [saveList] = useSaveContractMutation();
  const [updateList] = useUpdateContractMutation();
  const [sendToS] = useSendToSignContractMutation();
  const [signList] = useSignContractMutation();
  const [rejectList] = useRejectContractMutation();

  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new || (props.entry && props.entry.state === ContractStates.Prepare)
    );
  }, [props]);

  const handleSave = ({
    details,
    mainInformation,
    notes,
  }: ContractListInitialValuesType) => {
    toast.promise(
      async () => {
        let newusers =
          selectedProducts?.map((element) => {
            return {
              id: element.id,
              productId: element.id,
              name: element.name,
              measure: element.measure,
              count: element.count,
              price: element.price,
              total: element.total,
            };
          }) || null;

        await saveList({
          details,
          mainInformation,
          notes,
          products: newusers,
          files: addContractFile,
        }).then((c: any) => {
          if (c.error?.data?.StatusCode !== undefined) {
            toast.error(
              "Ошибка при подписание документа: \n" +
                JSON.stringify(c.error?.data?.Message)
            );
          } else {
            toast.success("Договор сохранена");
            navigate(`/modules/source-documents/contracts/show/${c.data.id}`);
          }
        });
      },
      {
        pending: "Лист сохраняется",
      }
    );
  };

  const handleUpdate = ({
    details,
    mainInformation,
    notes,
  }: ContractListInitialValuesType) => {
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
          details,
          mainInformation,
          notes,
          products: newusers,
          files: addContractFile,
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

  const sendToSign = () => {
    if (props.entry) {
      toast.promise(
        sendToS({
          id: props.entry.id,
          currentState: props.entry.state,
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Карточка подписывается",
          success: "Карточка подписана",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const handleSign = () => {
    if (props.entry) {
      toast.promise(
        signList({
          id: props.entry.id,
          currentState: props.entry.state,
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Карточка подписывается",
          success: "Карточка подписана",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const docClose = () => {
    setdogOpen(false);
  };

  const docShow = () => {
    setdogOpen(true);
  };

  const onSelectDocs = (docs: ContractProductDTO[]) => {
    let toAdd = docs
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
        <AgreementActions docShow={docShow} />
        <AgreementDetails
          formik={formik}
          canSave={canSave}
          setCurDoc={setCurDoc}
        />
        <MainInfo formik={formik} canSave={canSave} />
        <AgreementTemplate data={curDoc === 1 ? "buy" : "work"} />
        <Notes canSave={canSave} formik={formik} />
        <GoodsAndServices
          canSave={canSave}
          total={total}
          selectedProducts={selectedProducts}
          setProductSelectorOpen={setProductSelectorOpen}
          setSelectedProducts={setSelectedProducts}
          setTotal={setTotal}
        />

        <AgreementFiles
          addContractFile={addContractFile}
          addRow={addRow}
          setAddContractFile={setAddContractFile}
        />

        <UserVisas visas={props.entry?.userVisas} />
        <DocHistories histories={props.entry?.documentHistories} />
      </form>
      <div id="modals">
        <RejectModal
          type={5}
          rejectAccessForm={rejectList}
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
        />
      </div>
      <div id="modals">
        <ContractProductSelector
          open={productSelectorOpen}
          onSelected={onSelectDocs}
          onClose={() => {
            setProductSelectorOpen(false);
          }}
        />
      </div>

      <div id="modals">
        <AgreementViewModal
          entry={props?.entry}
          create={props?.new}
          docOpen={dogOpen}
          penHandlers={penHandlers}
          pdf={pdf}
          docClose={docClose}
          sendToSign={sendToSign}
          handlePenClick={handlePenClick}
          setRejectModalOpen={setRejectModalOpen}
          handleSign={handleSign}
        />
      </div>
    </>
  );
};
export default ContractList;
